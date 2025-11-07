import { create } from 'zustand';

export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Component[];
}

export interface Page {
  id: string;
  name: string;
  components: Component[];
}

export interface DesignState {
  projectId: string | null;
  projectType: 'static' | 'dynamic';
  pages: Page[];
  currentPageId: string | null;
  selectedComponent: string | null;
  history: DesignState[];
  historyIndex: number;
  isSaving: boolean;
  zoom: number;
  breakpoint: 'desktop' | 'tablet' | 'mobile';
}

interface EditorStore extends DesignState {
  setProjectId: (id: string) => void;
  setProjectType: (type: 'static' | 'dynamic') => void;
  addPage: (page: Page) => void;
  setCurrentPage: (pageId: string) => void;
  addComponent: (component: Component, pageId?: string) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setBreakpoint: (breakpoint: 'desktop' | 'tablet' | 'mobile') => void;
  undo: () => void;
  redo: () => void;
  saveSnapshot: () => void;
  setSaving: (saving: boolean) => void;
  loadProject: (data: Partial<DesignState>) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  projectId: null,
  projectType: 'static',
  pages: [{ id: 'home', name: 'Home', components: [] }],
  currentPageId: 'home',
  selectedComponent: null,
  history: [],
  historyIndex: -1,
  isSaving: false,
  zoom: 100,
  breakpoint: 'desktop',

  setProjectId: (id) => set({ projectId: id }),
  setProjectType: (type) => set({ projectType: type }),

  addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),

  setCurrentPage: (pageId) => set({ currentPageId: pageId }),

  addComponent: (component, pageId) => {
    const targetPageId = pageId || get().currentPageId;
    set((state) => ({
      pages: state.pages.map((page) =>
        page.id === targetPageId
          ? { ...page, components: [...page.components, component] }
          : page
      ),
    }));
    get().saveSnapshot();
  },

  updateComponent: (id, props) => {
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        components: updateComponentRecursive(page.components, id, props),
      })),
    }));
    get().saveSnapshot();
  },

  removeComponent: (id) => {
    set((state) => ({
      pages: state.pages.map((page) => ({
        ...page,
        components: removeComponentRecursive(page.components, id),
      })),
    }));
    get().saveSnapshot();
  },

  selectComponent: (id) => set({ selectedComponent: id }),

  setZoom: (zoom) => set({ zoom }),

  setBreakpoint: (breakpoint) => set({ breakpoint }),

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      // Preserve the history array when applying undo so we don't wipe out available redos
      set((state) => ({
        ...state,
        ...previousState,
        history: state.history,
        historyIndex: newIndex,
      }));
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      set((state) => ({
        ...state,
        ...nextState,
        history: state.history,
        historyIndex: newIndex
      }));
    }
  },

  saveSnapshot: () => {
    const state = get();
    const snapshot = {
      projectId: state.projectId,
      projectType: state.projectType,
      pages: JSON.parse(JSON.stringify(state.pages)),
      currentPageId: state.currentPageId,
      selectedComponent: state.selectedComponent,
      zoom: state.zoom,
      breakpoint: state.breakpoint,
      isSaving: false,
      history: [],
      historyIndex: -1,
    };
    
    set((state) => {
      // Remove any future redos when making a new change
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        history: [...newHistory, snapshot],
        historyIndex: state.historyIndex + 1,
      };
    });
  },

  setSaving: (saving) => set({ isSaving: saving }),

  loadProject: (data) => set((state) => ({ ...state, ...data })),
}));

function updateComponentRecursive(
  components: Component[],
  id: string,
  props: Record<string, any>
): Component[] {
  return components.map((comp) => {
    if (comp.id === id) {
      return { ...comp, props: { ...comp.props, ...props } };
    }
    if (comp.children) {
      return {
        ...comp,
        children: updateComponentRecursive(comp.children, id, props),
      };
    }
    return comp;
  });
}

function removeComponentRecursive(components: Component[], id: string): Component[] {
  return components
    .filter((comp) => comp.id !== id)
    .map((comp) => ({
      ...comp,
      children: comp.children ? removeComponentRecursive(comp.children, id) : undefined,
    }));
}
