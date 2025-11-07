import { useDroppable } from "@dnd-kit/core";
import { useEditorStore } from "@/store/editorStore";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Canvas = () => {
  const { pages, currentPageId, addComponent, selectComponent, selectedComponent, zoom, breakpoint } = useEditorStore();
  const currentPage = pages.find((p) => p.id === currentPageId);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  const breakpointWidths = {
    desktop: '1280px',
    tablet: '768px',
    mobile: '480px',
  };

  const renderComponent = (component: any) => {
    const isSelected = selectedComponent === component.id;
    
    let content = null;
    switch (component.type) {
      case 'hero':
        content = (
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-12 rounded-lg text-center">
            <h1 className="text-4xl font-bold mb-4">{component.props.title || 'Hero Title'}</h1>
            <p className="text-muted-foreground mb-6">{component.props.subtitle || 'Hero subtitle goes here'}</p>
            <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white">
              {component.props.buttonText || 'Get Started'}
            </button>
          </div>
        );
        break;
      case 'features':
        content = (
          <div className="grid grid-cols-3 gap-6 p-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 bg-secondary/50 rounded-lg text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Feature {i}</h3>
                <p className="text-sm text-muted-foreground">Feature description</p>
              </div>
            ))}
          </div>
        );
        break;
      case 'heading':
        content = <h2 className="text-2xl font-bold">{component.props.text || 'Heading Text'}</h2>;
        break;
      case 'paragraph':
        content = <p className="text-muted-foreground">{component.props.text || 'Paragraph text goes here...'}</p>;
        break;
      case 'button':
        const buttonProps: any = {
          className: "px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg text-white",
        };
        if (component.props.linkTo) {
          buttonProps.onClick = () => {
            // Navigate to linked page
            const targetPage = pages.find(p => 
              p.id === 'home' ? component.props.linkTo === '/' : 
              component.props.linkTo === `/${p.name.toLowerCase()}`
            );
            if (targetPage) {
              useEditorStore.getState().setCurrentPage(targetPage.id);
            }
          };
        }
        if (component.props.backendFlow) {
          // Add backend flow trigger
          const originalOnClick = buttonProps.onClick;
          buttonProps.onClick = async (e: React.MouseEvent) => {
            if (originalOnClick) originalOnClick(e);
            
            // Trigger backend flow
            try {
              const { supabase } = await import("@/integrations/supabase/client");
              const { toast } = await import("sonner");
              
              toast.info(`🪄 Triggering ${component.props.backendFlow}...`);
              
              const { data, error } = await supabase.functions.invoke(component.props.backendFlow, {
                body: { 
                  componentId: component.id,
                  componentProps: component.props 
                }
              });
              
              if (error) throw error;
              
              toast.success("✨ Backend flow executed successfully!");
            } catch (error: any) {
              console.error("Backend flow error:", error);
              const { toast } = await import("sonner");
              toast.error(`Failed to execute backend flow: ${error.message}`);
            }
          };
        }
        content = (
          <button {...buttonProps}>
            {component.props.text || 'Button'}
          </button>
        );
        break;
      case 'image':
        content = (
          <div className="w-full h-48 bg-secondary/50 rounded-lg flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-muted-foreground" />
          </div>
        );
        break;
      case 'footer':
        content = (
          <div className="bg-secondary/30 p-8 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">© 2025 Your Company</p>
          </div>
        );
        break;
      default:
        content = (
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm">{component.type}</p>
          </div>
        );
    }

    return (
      <motion.div
        key={component.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => {
          e.stopPropagation();
          selectComponent(component.id);
        }}
        className={`cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
        } hover:ring-1 hover:ring-primary/50 rounded-lg`}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 bg-background p-4 overflow-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPageId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mx-auto transition-all duration-300 ease-out"
          style={{ 
            width: breakpointWidths[breakpoint], 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          <div
            ref={setNodeRef}
            className={`min-h-[800px] bg-card rounded-lg border-2 border-dashed transition-all duration-150 p-8 space-y-4 ${
              isOver ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onClick={() => selectComponent(null)}
          >
            {currentPage?.components.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground animate-sparkle" />
                  <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag components from the left sidebar to start designing
                  </p>
                </div>
              </div>
            ) : (
              currentPage?.components.map(renderComponent)
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
