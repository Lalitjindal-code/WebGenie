import { useState } from "react";
import { Undo2, Redo2, Save, Eye, Code, Rocket, Sparkles, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store/editorStore";
import { toast } from "sonner";

interface ToolbarProps {
  projectName: string;
  onNameChange: (name: string) => void;
  onPreview: () => void;
  onGenerateCode: () => void;
  onDeploy: () => void;
  onBackendBuilder?: () => void;
  showBackendBuilder?: boolean;
}

export const Toolbar = ({ projectName, onNameChange, onPreview, onGenerateCode, onDeploy, onBackendBuilder, showBackendBuilder }: ToolbarProps) => {
  const { undo, redo, isSaving } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-magic">
            <Sparkles className="w-4 h-4 text-white animate-sparkle" />
          </div>
          {isEditing ? (
            <Input
              value={projectName}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              className="w-48 h-8"
              autoFocus
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="font-semibold cursor-pointer hover:text-primary transition-smooth"
            >
              {projectName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {isSaving ? (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Saving...
            </span>
          ) : (
            <span className="text-xs text-success flex items-center gap-1">
              <Save className="w-3 h-3" />
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          disabled={showBackendBuilder}
        >
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        {onBackendBuilder && (
          <Button
            variant={showBackendBuilder ? "default" : "outline"}
            size="sm"
            onClick={onBackendBuilder}
            className={showBackendBuilder ? "bg-gradient-to-r from-primary to-accent" : ""}
          >
            <Settings className="w-4 h-4 mr-2" />
            Backend Builder
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onGenerateCode}
          className="border-primary/50 hover:bg-primary/10"
          disabled={showBackendBuilder}
        >
          <Code className="w-4 h-4 mr-2" />
          <Sparkles className="w-3 h-3 mr-1" />
          Generate Code
        </Button>
        <Button
          size="sm"
          onClick={onDeploy}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-blue"
          disabled={showBackendBuilder}
        >
          <Rocket className="w-4 h-4 mr-2" />
          Deploy
        </Button>
      </div>
    </div>
  );
};
