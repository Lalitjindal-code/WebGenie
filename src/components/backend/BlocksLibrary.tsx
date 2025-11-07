import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  GitBranch,
  Repeat,
  Clock,
  Send,
  Database,
  Plus,
  Edit,
  Trash2,
  Globe,
  Webhook,
  Mail,
  Bell,
  Sparkles,
  FileText,
  Calculator,
  Hash,
  Calendar,
  Shuffle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useBackendStore, FlowNode } from "@/store/backendStore";

interface BlockCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  blocks: BlockDefinition[];
}

interface BlockDefinition {
  type: string;
  label: string;
  icon: any;
  description: string;
  category: string;
}

const blockCategories: BlockCategory[] = [
  {
    id: "basic",
    label: "Basic Logic",
    icon: GitBranch,
    color: "text-blue-400",
    blocks: [
      { type: "start", label: "Start", icon: Play, description: "Flow entry point", category: "basic" },
      { type: "if_else", label: "If / Else", icon: GitBranch, description: "Conditional logic", category: "basic" },
      { type: "loop", label: "Loop", icon: Repeat, description: "For each iteration", category: "basic" },
      { type: "delay", label: "Delay", icon: Clock, description: "Wait for duration", category: "basic" },
      { type: "return_response", label: "Return Response", icon: Send, description: "Send response", category: "basic" },
    ],
  },
  {
    id: "database",
    label: "Database",
    icon: Database,
    color: "text-green-400",
    blocks: [
      { type: "fetch_data", label: "Fetch Data", icon: Database, description: "Query Supabase table", category: "database" },
      { type: "insert_record", label: "Insert Record", icon: Plus, description: "Add new record", category: "database" },
      { type: "update_record", label: "Update Record", icon: Edit, description: "Modify existing record", category: "database" },
      { type: "delete_record", label: "Delete Record", icon: Trash2, description: "Remove record", category: "database" },
      { type: "auth_check", label: "Auth Check", icon: Database, description: "Verify user authentication", category: "database" },
      { type: "file_upload", label: "File Upload", icon: Database, description: "Upload to Supabase Storage", category: "database" },
    ],
  },
  {
    id: "api",
    label: "API",
    icon: Globe,
    color: "text-orange-400",
    blocks: [
      { type: "http_request", label: "HTTP Request", icon: Globe, description: "GET / POST / PUT / DELETE", category: "api" },
      { type: "webhook", label: "Webhook Listener", icon: Webhook, description: "Receive webhook", category: "api" },
      { type: "email_sender", label: "Email Sender", icon: Mail, description: "Send email notification", category: "api" },
      { type: "notification", label: "Notification", icon: Bell, description: "Send system notification", category: "api" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    icon: Sparkles,
    color: "text-purple-400",
    blocks: [
      { type: "ai_generate", label: "AI Text Generator", icon: Sparkles, description: "Generate with Gemini", category: "ai" },
      { type: "ai_image", label: "AI Image Generator", icon: Sparkles, description: "Create images with AI", category: "ai" },
      { type: "ai_condition", label: "AI Condition", icon: Sparkles, description: "AI-based decision", category: "ai" },
      { type: "ai_fix", label: "AI Code Modifier", icon: Sparkles, description: "Auto-fix logic", category: "ai" },
    ],
  },
  {
    id: "utility",
    label: "Utility",
    icon: FileText,
    color: "text-gray-400",
    blocks: [
      { type: "log", label: "Log / Print", icon: FileText, description: "Output to console", category: "utility" },
      { type: "math", label: "Math / Expression", icon: Calculator, description: "Calculate expression", category: "utility" },
      { type: "variable", label: "Variable", icon: Hash, description: "Set / Get variable", category: "utility" },
      { type: "date_time", label: "Date / Time", icon: Calendar, description: "Date operations", category: "utility" },
      { type: "random", label: "Random Value", icon: Shuffle, description: "Generate random", category: "utility" },
    ],
  },
];

export const BlocksLibrary = ({ onAddNode }: { onAddNode: (node: FlowNode) => void }) => {
  const [openCategories, setOpenCategories] = useState<string[]>(["basic", "database", "api", "ai", "utility"]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleDragStart = (e: React.DragEvent, block: BlockDefinition) => {
    e.dataTransfer.setData("application/reactflow", block.type);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
    // Add visual feedback
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
    console.log("Drag started for block:", block.type);
  };

  const handleBlockClick = (block: BlockDefinition) => {
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };

    onAddNode({
      id: `${block.type}-${Date.now()}`,
      type: block.type,
      position,
      data: {
        label: block.label,
        description: block.description,
        category: block.category,
      },
    });
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Logic Blocks</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag or click to add</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {blockCategories.map((category) => {
            const Icon = category.icon;
            const isOpen = openCategories.includes(category.id);

            return (
              <Collapsible key={category.id} open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm font-medium">{category.label}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="space-y-1 pl-2 mt-1">
                    {category.blocks.map((block) => {
                      const BlockIcon = block.icon;
                      return (
                        <motion.div
                          key={block.type}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, block)}
                          onClick={() => handleBlockClick(block)}
                          className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/60 cursor-grab active:cursor-grabbing border border-transparent hover:border-primary/30 transition-all group"
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ${category.color}`}>
                            <BlockIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{block.label}</p>
                            <p className="text-xs text-muted-foreground truncate">{block.description}</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles className="w-3 h-3 text-primary animate-sparkle" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

