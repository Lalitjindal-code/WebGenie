import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Rocket, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEditorStore } from "@/store/editorStore";

const Deploy = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<"vercel" | "netlify" | null>(null);
  const { pages } = useEditorStore();

  useEffect(() => {
    if (!projectId) {
      navigate("/dashboard");
      return;
    }

    loadProject();
  }, [projectId, navigate]);

  const loadProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("name, deployed_url")
        .eq("id", projectId)
        .single();

      if (error) throw error;

      if (data) {
        setProjectName(data.name);
        if (data.deployed_url) {
          setDeployedUrl(data.deployed_url);
        }
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      toast.error("Failed to load project");
    }
  };

  const addLog = (message: string) => {
    setDeploymentLogs((prev) => [...prev, message]);
  };

  const handleDeploy = async (platform: "vercel" | "netlify") => {
    if (!projectId) return;

    setSelectedPlatform(platform);
    setDeploying(true);
    setDeploymentLogs([]);
    setDeployedUrl(null);

    addLog(`🚀 Starting deployment to ${platform}...`);
    addLog("📦 Generating build files...");

    try {
      // Generate code first
      addLog("🪄 Genie is generating your code...");
      const { data: codeData, error: codeError } = await supabase.functions.invoke("generate-code", {
        body: { pages },
      });

      if (codeError) throw codeError;

      addLog("✅ Code generated successfully!");
      addLog(`📤 Uploading to ${platform}...`);

      // Deploy to platform
      const { data: deployData, error: deployError } = await supabase.functions.invoke(`deploy-${platform}`, {
        body: {
          projectId,
          code: codeData.code,
        },
      });

      if (deployError) throw deployError;

      const url = deployData?.url || `https://${projectId}.${platform === "vercel" ? "vercel.app" : "netlify.app"}`;
      setDeployedUrl(url);

      // Save deployment to database
      await supabase.from("deployments").insert({
        project_id: projectId,
        platform,
        url,
        status: "success",
      });

      // Update project with deployed URL
      await supabase
        .from("projects")
        .update({ deployed_url: url })
        .eq("id", projectId);

      addLog("✨ Deployment successful!");
      addLog(`🌐 Your site is live at: ${url}`);
      toast.success("✨ Your wish is live, master!");
    } catch (error: any) {
      console.error("Deployment failed:", error);
      addLog(`❌ Deployment failed: ${error.message || "Unknown error"}`);
      toast.error("Deployment failed. Please try again.");

      // Save failed deployment
      await supabase.from("deployments").insert({
        project_id: projectId,
        platform,
        url: null,
        status: "failed",
      });
    } finally {
      setDeploying(false);
    }
  };

  const copyUrl = () => {
    if (deployedUrl) {
      navigator.clipboard.writeText(deployedUrl);
      toast.success("URL copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" onClick={() => navigate(`/editor/${projectId}`)} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <h1 className="text-4xl font-display font-bold gradient-text mb-2">
              🚀 Deploy Your Website
            </h1>
            <p className="text-muted-foreground">{projectName}</p>
          </div>
        </div>

        {/* Deployment Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-2 border-border/60 bg-[#0C0C16]/80 backdrop-blur-xl hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Deploy to Vercel</CardTitle>
                </div>
                <CardDescription>
                  Lightning-fast deployments with automatic HTTPS and global CDN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleDeploy("vercel")}
                  disabled={deploying}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {deploying && selectedPlatform === "vercel" ? "Deploying..." : "Deploy Now"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-2 border-border/60 bg-[#0C0C16]/80 backdrop-blur-xl hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle>Deploy to Netlify</CardTitle>
                </div>
                <CardDescription>
                  Continuous deployment with form handling and serverless functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleDeploy("netlify")}
                  disabled={deploying}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {deploying && selectedPlatform === "netlify" ? "Deploying..." : "Deploy Now"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Status Console */}
        {deploying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-primary/30 bg-[#0C0C16]/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-sparkle" />
                  Deployment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0B0B10] rounded-lg p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
                  {deploymentLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-muted-foreground"
                    >
                      {log}
                    </motion.div>
                  ))}
                  {deploying && (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-primary"
                    >
                      ⏳ Processing...
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Success Result */}
        {deployedUrl && !deploying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="border-2 border-success/50 bg-gradient-to-br from-success/10 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <Sparkles className="w-5 h-5 animate-sparkle" />
                  ✨ Your wish is live, master!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-[#0B0B10] rounded-lg">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-primary hover:underline"
                  >
                    {deployedUrl}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyUrl}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => window.open(deployedUrl, "_blank")}
                    className="flex-1 bg-gradient-to-r from-primary to-accent"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Site
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeploy(selectedPlatform || "vercel")}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Redeploy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Genie Animation */}
        {deploying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl glow-magic"
            >
              <Sparkles className="w-12 h-12 text-white animate-sparkle" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Deploy;

