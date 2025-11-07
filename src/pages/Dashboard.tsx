import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Sparkles, LogOut, User, Settings, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreateProjectModal } from "@/components/editor/CreateProjectModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/login");
      } else {
        setUser(user);
        loadProjects(user.id);
      }
    });
  }, [navigate]);

  const loadProjects = async (userId: string) => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load projects");
    } else {
      setProjects(data || []);
      setFilteredProjects(data || []);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        project.name?.toLowerCase().includes(query) ||
        project.type?.toLowerCase().includes(query) ||
        project.template?.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleLogout = async () => {
    toast.info("💨 Logging you out, master...");
    await supabase.auth.signOut();
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleCreateProject = async (name: string, template: string, type: 'static' | 'dynamic') => {
    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        template,
        type,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create project");
    } else {
      toast.success("✨ Project created successfully!");
      setShowCreateModal(false);
      navigate(`/editor/${data.id}`);
    }
  };

  const templates = [
    { name: "Landing Page", active: true },
    { name: "Portfolio", active: false },
    { name: "E-commerce", active: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-magic">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-display font-bold gradient-text">GenieSite</span>
              </div>
              <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search projects or templates..."
                  className="pl-10 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-blue">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
              <div className="relative group">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button 
                    onClick={() => navigate("/profile")}
                    className="w-full px-4 py-2 text-left hover:bg-secondary flex items-center gap-2 rounded-t-lg"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-secondary flex items-center gap-2 text-destructive rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Welcome Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold gradient-text mb-2">
            ✨ Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">Let's build something magical today.</p>
        </div>

        {/* Projects Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold">Your Projects</h2>
            {searchQuery && (
              <span className="text-sm text-muted-foreground">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create New Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowCreateModal(true)}
              className="cursor-pointer flex items-center justify-center"
            >
              <Card className="h-64 w-full border-2 border-dashed border-border hover:border-primary transition-smooth flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 glow-magic">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-semibold">Create New Project</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Project Cards */}
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card 
                  className="h-64 hover:shadow-lg transition-all hover:border-primary/50 border-2 cursor-pointer"
                  onClick={() => navigate(`/editor/${project.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{project.type}</span>
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">
                        {project.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Templates Section */}
        <section>
          <h2 className="text-2xl font-display font-bold mb-6">Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <motion.div
                key={index}
                whileHover={template.active ? { scale: 1.02 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`h-64 transition-all border-2 ${
                    template.active
                      ? "cursor-pointer hover:shadow-lg hover:border-primary/50"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <CardContent className="p-6 relative">
                    {!template.active && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold bg-muted px-4 py-2 rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    )}
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                      <Wand2 className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Chatbot */}
      {showChatbot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 w-96 max-h-[70vh] md:max-h-[600px] bg-card border-2 border-primary/50 rounded-2xl shadow-lg z-50 flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-sparkle">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">Genie Assistant</span>
            </div>
            <button onClick={() => setShowChatbot(false)} className="text-muted-foreground hover:text-foreground">
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            <div className="bg-secondary/50 rounded-lg p-3 mb-4">
              <p className="text-sm">
                👋 Hello! I'm your Genie assistant. How can I help you build magic today?
              </p>
            </div>
          </div>
          <div className="p-4 border-t border-border">
            <Input placeholder="Ask Genie anything..." className="bg-background" />
          </div>
        </motion.div>
      )}

      {/* Chatbot Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 md:bottom-6 md:right-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-magic shadow-lg z-40"
        style={{ boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)' }}
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white animate-sparkle" />
      </motion.button>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Made with ✨ by Team WebGenie — Lalit, Pratiksha, Arin, Vaibhav
          </p>
        </div>
      </footer>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
};

export default Dashboard;
