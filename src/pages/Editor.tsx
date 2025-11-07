import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Toolbar } from "@/components/editor/Toolbar";
import { ComponentsSidebar } from "@/components/editor/ComponentsSidebar";
import { Canvas } from "@/components/editor/Canvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { BottomBar } from "@/components/editor/BottomBar";
import { GenieChatbot } from "@/components/editor/GenieChatbot";
import { BackendBuilder } from "@/components/backend/BackendBuilder";
import { useEditorStore } from "@/store/editorStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MonacoEditor from "@monaco-editor/react";

const Editor = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("Untitled Project");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showBackendBuilder, setShowBackendBuilder] = useState(false);
  const { addComponent, loadProject, pages, setSaving, currentPageId } = useEditorStore();

  useEffect(() => {
    if (!projectId) {
      navigate("/dashboard");
      return;
    }

    loadProjectData();
    
    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(saveProject, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;

      if (data) {
        setProjectName(data.name);
        useEditorStore.getState().setProjectId(data.id);
        useEditorStore.getState().setProjectType(data.type as 'static' | 'dynamic');
        // Load saved design if exists
        if (data.thumbnail_url) {
          // Parse and load design JSON
        }
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      toast.error("Failed to load project");
      navigate("/dashboard");
    }
  };

  const saveProject = async () => {
    if (!projectId) return;

    setSaving(true);
    try {
      const designJSON = JSON.stringify({ pages });
      
      await supabase
        .from("projects")
        .update({
          name: projectName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      toast.success("Project saved");
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save");
    } finally {
      setTimeout(() => setSaving(false), 500);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'canvas-drop-zone') {
      const componentType = active.data.current?.type;
      if (componentType) {
        const newComponent = {
          id: `${componentType}-${Date.now()}`,
          type: componentType,
          props: {},
        };
        addComponent(newComponent);
        toast.success("✨ Component added!");
      }
    }
  };

  const handleGenerateCode = async () => {
    setShowCodeModal(true);
    toast.info("🪄 Genie is generating your code...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { pages }
      });

      if (error) throw error;

      setGeneratedCode(data.code || "// Code generation in progress...");
      toast.success("✨ Code generated!");
    } catch (error) {
      console.error("Code generation failed:", error);
      toast.error("Failed to generate code");
      setGeneratedCode("// Error generating code. Please try again.");
    }
  };

  const handlePreview = async () => {
    setShowPreview(true);
    toast.info("🪄 Genie is preparing your preview...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { pages }
      });

      if (error) throw error;

      const reactCode = data.code || "// No code generated";
      
      // Wrap React code in HTML for iframe preview
      const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${reactCode}
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App || (() => React.createElement('div', null, 'Preview'))));
  </script>
</body>
</html>`;
      
      setPreviewCode(htmlCode);
      toast.success("✨ Preview ready!");
    } catch (error) {
      console.error("Preview generation failed:", error);
      toast.error("Failed to generate preview");
      setPreviewCode(`
<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body><p>Error generating preview. Please try again.</p></body>
</html>`);
    }
  };

  const handleDeploy = async () => {
    await saveProject();
    navigate(`/deploy/${projectId}`);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-background">
        <Toolbar
          projectName={projectName}
          onNameChange={setProjectName}
          onPreview={handlePreview}
          onGenerateCode={handleGenerateCode}
          onDeploy={handleDeploy}
          onBackendBuilder={() => setShowBackendBuilder(!showBackendBuilder)}
          showBackendBuilder={showBackendBuilder}
        />

        {showBackendBuilder ? (
          <BackendBuilder projectId={projectId || ""} onReturn={() => setShowBackendBuilder(false)} />
        ) : (
          <>
            <div className="flex-1 flex overflow-hidden">
              <ComponentsSidebar />
              <Canvas />
              <PropertiesPanel />
            </div>
            <BottomBar />
          </>
        )}

        <GenieChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-6 right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-magic shadow-lg z-40"
          style={{ boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)' }}
        >
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white animate-sparkle" />
        </motion.button>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
              Live Preview
            </DialogTitle>
          </DialogHeader>
          <div className="border-2 border-primary/30 rounded-lg overflow-hidden glow-magic">
            <iframe
              srcDoc={previewCode}
              className="w-full h-[70vh] bg-white"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Code Modal */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Generated Code</DialogTitle>
          </DialogHeader>
          <MonacoEditor
            height="60vh"
            defaultLanguage="typescript"
            value={generatedCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
            }}
          />
        </DialogContent>
      </Dialog>
    </DndContext>
  );
};

export default Editor;
