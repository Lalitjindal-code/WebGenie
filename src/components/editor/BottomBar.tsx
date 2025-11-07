import { Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const BREAKPOINTS = {
  desktop: 1280,
  tablet: 768,
  mobile: 480,
} as const;

export const BottomBar = () => {
  const { zoom, setZoom, breakpoint, setBreakpoint, pages, currentPageId, setCurrentPage, addPage } = useEditorStore();
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  const handleBreakpointChange = (bp: 'desktop' | 'tablet' | 'mobile') => {
    setBreakpoint(bp);
  };

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      toast.error("Please enter a page name");
      return;
    }

    const pageId = `page-${Date.now()}`;
    addPage({
      id: pageId,
      name: newPageName.trim(),
      components: [],
    });
    
    setCurrentPage(pageId);
    setNewPageName("");
    setShowAddPage(false);
    toast.success(`✨ Page "${newPageName.trim()}" created!`);
  };

  return (
    <div className="h-12 bg-card border-t border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground mr-2">Pages:</span>
        {pages.map((page) => (
          <Button
            key={page.id}
            variant={currentPageId === page.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentPage(page.id)}
            className="h-7 text-xs transition-all"
          >
            {page.name}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddPage(true)}
          className="h-7 text-xs border border-dashed border-border hover:border-primary"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Page
        </Button>
      </div>

      <Dialog open={showAddPage} onOpenChange={setShowAddPage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Page name (e.g., About, Contact)"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPage(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPage} className="bg-gradient-to-r from-primary to-accent">
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant={breakpoint === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleBreakpointChange('desktop')}
            className={breakpoint === 'desktop' ? 'bg-gradient-to-r from-primary to-accent' : ''}
            title={`Desktop (${BREAKPOINTS.desktop}px)`}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={breakpoint === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleBreakpointChange('tablet')}
            className={breakpoint === 'tablet' ? 'bg-gradient-to-r from-primary to-accent' : ''}
            title={`Tablet (${BREAKPOINTS.tablet}px)`}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={breakpoint === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleBreakpointChange('mobile')}
            className={breakpoint === 'mobile' ? 'bg-gradient-to-r from-primary to-accent' : ''}
            title={`Mobile (${BREAKPOINTS.mobile}px)`}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            disabled={zoom <= 25}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
