import { create } from 'zustand';

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  label?: string;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface BackendState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNode: FlowNode | null;
  flowJson: any;
}

interface BackendStore extends BackendState {
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  setSelectedNode: (node: FlowNode | null) => void;
  addNode: (node: FlowNode) => void;
  updateNode: (id: string, updates: Partial<FlowNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: FlowEdge) => void;
  deleteEdge: (id: string) => void;
  setFlowJson: (json: any) => void;
  loadFlow: (json: any) => void;
  clearFlow: () => void;
}

const createDefaultNode = (type: string, position: { x: number; y: number }): FlowNode => {
  const id = `${type}-${Date.now()}`;
  const baseData: Record<string, any> = { label: type };

  // Add type-specific default data
  switch (type) {
    case 'start':
      return { id, type, position, data: { ...baseData, label: 'Start' } };
    case 'fetch_data':
      return { id, type, position, data: { ...baseData, table: '', filters: {} } };
    case 'insert_record':
      return { id, type, position, data: { ...baseData, table: '', values: {} } };
    case 'http_request':
      return { id, type, position, data: { ...baseData, method: 'GET', url: '', headers: {} } };
    case 'ai_generate':
      return { id, type, position, data: { ...baseData, prompt: '', model: 'gemini-1.5-pro' } };
    case 'return_response':
      return { id, type, position, data: { ...baseData, response: {} } };
    default:
      return { id, type, position, data: baseData };
  }
};

export const useBackendStore = create<BackendStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  flowJson: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  setSelectedNode: (node) => set({ selectedNode: node }),

  addNode: (node) => {
    const newNode = node.id ? node : createDefaultNode(node.type, node.position);
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates, data: { ...node.data, ...updates.data } } : node
      ),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
    }));
  },

  addEdge: (edge) => {
    // Check if edge already exists
    const exists = get().edges.some(
      (e) => e.source === edge.source && e.target === edge.target
    );
    if (!exists) {
      set((state) => ({ edges: [...state.edges, edge] }));
    }
  },

  deleteEdge: (id) => {
    set((state) => ({ edges: state.edges.filter((edge) => edge.id !== id) }));
  },

  setFlowJson: (json) => set({ flowJson: json }),

  loadFlow: (json) => {
    if (json?.nodes && json?.edges) {
      set({
        nodes: json.nodes,
        edges: json.edges,
        flowJson: json,
      });
    }
  },

  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      flowJson: null,
    });
  },
}));

