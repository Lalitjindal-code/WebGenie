import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Code, Eye, Play, Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlocksLibrary } from "./BlocksLibrary";
import { FlowCanvas } from "./FlowCanvas";
import { FlowPropertiesPanel } from "./FlowPropertiesPanel";
import { BackendConsole } from "./BackendConsole";
import { useBackendStore } from "@/store/backendStore";
import { supabase } from "@/integrations/supabase/client";

interface BackendBuilderProps {
  projectId: string;
  onReturn: () => void;
}

export const BackendBuilder = ({ projectId, onReturn }: BackendBuilderProps) => {
  const { nodes, edges, selectedNode, setSelectedNode, addNode, updateNode, deleteNode, addEdge, flowJson, setFlowJson, loadFlow, setNodes, setEdges } = useBackendStore();
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const handleSave = useCallback(async () => {
    try {
      const flowData = {
        nodes,
        edges,
      };

      // Check if flow exists
      const { data: existing } = await supabase
        .from("flows")
        .select("id")
        .eq("project_id", projectId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("flows")
          .update({
            flow_json: flowData,
            updated_at: new Date().toISOString(),
          })
          .eq("project_id", projectId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("flows")
          .insert({
            project_id: projectId,
            flow_json: flowData,
            updated_at: new Date().toISOString(),
          });
        if (error) throw error;
      }

      toast.success("✨ Flow saved successfully!");
    } catch (error: any) {
      console.error("Save failed:", error);
      toast.error("Failed to save flow");
    }
  }, [projectId, nodes, edges]);

  useEffect(() => {
    // Load existing flow when component mounts
    const loadExistingFlow = async () => {
      try {
        const { data, error } = await supabase
          .from("flows")
          .select("flow_json, generated_code")
          .eq("project_id", projectId)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" - that's okay
          console.error("Failed to load flow:", error);
          return;
        }

        if (data) {
          if (data.flow_json) {
            loadFlow(data.flow_json);
          }
          if (data.generated_code) {
            setGeneratedCode(data.generated_code);
          }
        }
      } catch (error) {
        console.error("Error loading flow:", error);
      }
    };

    loadExistingFlow();

    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (nodes.length > 0 || edges.length > 0) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [projectId, loadFlow, handleSave, nodes, edges]);

  const handleGenerateCode = useCallback(async () => {
    setIsGenerating(true);
    setConsoleLogs((prev) => [...prev, "🪄 Genie is generating your backend code..."]);
    
    try {
      const flowData = {
        nodes,
        edges,
      };

      const { data, error } = await supabase.functions.invoke("generate-backend", {
        body: { flow_json: flowData },
      });

      if (error) throw error;

      const code = data.code || "// No code generated";
      setGeneratedCode(code);
      setConsoleLogs((prev) => [...prev, "✅ Code generated successfully!", `📝 Generated ${code.split("\n").length} lines of code`]);

      // Save generated code
      await supabase
        .from("flows")
        .update({ generated_code: code })
        .eq("project_id", projectId);

      toast.success("✨ Backend code generated!");
      setShowCodePreview(true);
    } catch (error: any) {
      console.error("Code generation failed:", error);
      setConsoleLogs((prev) => [...prev, `❌ Error: ${error.message || "Failed to generate code"}`]);
      toast.error("Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  }, [nodes, edges, projectId]);

  const handleTestFlow = useCallback(async () => {
    setIsTesting(true);
    setConsoleLogs(["🧪 Starting flow test..."]);

    try {
      // Simulate flow execution
      const flowData = {
        nodes,
        edges,
      };

      const { data, error } = await supabase.functions.invoke("test-backend", {
        body: { flow_json: flowData },
      });

      if (error) throw error;

      setConsoleLogs((prev) => [
        ...prev,
        "✅ Test completed successfully!",
        `📊 Output: ${JSON.stringify(data.output || {}, null, 2)}`,
      ]);

      toast.success("✨ Flow test passed!");
    } catch (error: any) {
      console.error("Test failed:", error);
      setConsoleLogs((prev) => [...prev, `❌ Test failed: ${error.message || "Unknown error"}`]);
      toast.error("Flow test failed");
    } finally {
      setIsTesting(false);
    }
  }, [nodes, edges]);

  const handleDeploy = useCallback(async () => {
    if (!generatedCode) {
      toast.error("Please generate code first");
      return;
    }

    toast.info("🚀 Deploying backend to Supabase Edge Functions...");

    try {
      const { data, error } = await supabase.functions.invoke("deploy-backend", {
        body: {
          project_id: projectId,
          code: generatedCode,
        },
      });

      if (error) throw error;

      toast.success(`✨ Backend deployed! Available at: ${data.url || "/api/backend"}`);
      setConsoleLogs((prev) => [...prev, `🚀 Deployed successfully to: ${data.url || "/api/backend"}`]);
    } catch (error: any) {
      console.error("Deployment failed:", error);
      toast.error("Failed to deploy backend");
      setConsoleLogs((prev) => [...prev, `❌ Deployment failed: ${error.message}`]);
    }
  }, [generatedCode, projectId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col bg-[#0B0B10]"
    >

      {/* Top Toolbar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onReturn}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Editor
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isGenerating || isTesting}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Flow
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateCode}
            disabled={isGenerating || isTesting}
            className="border-primary/50 hover:bg-primary/10"
          >
            <Code className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Code"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCodePreview(true)}
            disabled={!generatedCode}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Code
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestFlow}
            disabled={isGenerating || isTesting}
          >
            <Play className="w-4 h-4 mr-2" />
            {isTesting ? "Testing..." : "Test Flow"}
          </Button>
          <Button
            size="sm"
            onClick={handleDeploy}
            disabled={!generatedCode || isGenerating || isTesting}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Deploy API
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Blocks Library */}
        <BlocksLibrary onAddNode={addNode} />

        {/* Center - Flow Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodeSelect={setSelectedNode}
            onNodeUpdate={updateNode}
            onNodeDelete={deleteNode}
            onEdgeAdd={addEdge}
          />
        </div>

        {/* Right Sidebar - Properties Panel */}
        <FlowPropertiesPanel
          node={selectedNode}
          onUpdate={updateNode}
        />
      </div>

      {/* Bottom Console */}
      <BackendConsole logs={consoleLogs} />

      {/* Code Preview Modal */}
      {showCodePreview && generatedCode && (
        <CodePreviewModal
          code={generatedCode}
          onClose={() => setShowCodePreview(false)}
        />
      )}
    </motion.div>
  );
};

const CodePreviewModal = ({ code, onClose }: { code: string; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border-2 border-primary/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Generated Backend Code
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-sm font-mono bg-[#0B0B10] p-4 rounded-lg overflow-auto">
            <code>{code}</code>
          </pre>
        </div>
      </motion.div>
    </motion.div>
  );
};

