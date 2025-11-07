import { useDraggable } from "@dnd-kit/core";
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Video, 
  Square,
  Grid3x3,
  Heading1,
  AlignLeft,
  Mail,
  MessageSquare
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const components = [
  { type: 'hero', label: 'Hero Section', icon: Layout, category: 'sections' },
  { type: 'features', label: 'Features Grid', icon: Grid3x3, category: 'sections' },
  { type: 'footer', label: 'Footer', icon: AlignLeft, category: 'sections' },
  { type: 'heading', label: 'Heading', icon: Heading1, category: 'text' },
  { type: 'paragraph', label: 'Paragraph', icon: Type, category: 'text' },
  { type: 'button', label: 'Button', icon: Square, category: 'elements' },
  { type: 'image', label: 'Image', icon: ImageIcon, category: 'media' },
  { type: 'video', label: 'Video', icon: Video, category: 'media' },
  { type: 'input', label: 'Input Field', icon: Mail, category: 'forms' },
  { type: 'textarea', label: 'Text Area', icon: MessageSquare, category: 'forms' },
];

const DraggableComponent = ({ type, label, icon: Icon }: any) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${type}`,
    data: { type }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-grab active:cursor-grabbing transition-all hover:scale-105 border border-transparent hover:border-primary/30"
    >
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

export const ComponentsSidebar = () => {
  const categories = ['sections', 'text', 'elements', 'media', 'forms'];

  return (
    <div className="w-[260px] bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Components</h3>
        <p className="text-xs text-muted-foreground mt-1">Drag to canvas</p>
      </div>

      <Tabs defaultValue="sections" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 py-2 bg-transparent">
          <TabsTrigger value="sections" className="text-xs">Sections</TabsTrigger>
          <TabsTrigger value="elements" className="text-xs">Elements</TabsTrigger>
          <TabsTrigger value="forms" className="text-xs">Forms</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="m-0 p-4 space-y-2">
              {components
                .filter((comp) => comp.category === category)
                .map((comp) => (
                  <DraggableComponent key={comp.type} {...comp} />
                ))}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </div>
  );
};
