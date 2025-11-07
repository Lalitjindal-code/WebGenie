import { useEditorStore } from "@/store/editorStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PropertiesPanel = () => {
  const { selectedComponent, pages, currentPageId, updateComponent, removeComponent } = useEditorStore();

  const currentPage = pages.find((p) => p.id === currentPageId);
  const component = currentPage?.components.find((c) => c.id === selectedComponent);

  if (!component) {
    return (
      <div className="w-[300px] bg-card border-l border-border flex items-center justify-center hidden md:flex">
        <div className="text-center text-muted-foreground p-6">
          <p className="text-sm">Select a component to edit properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateComponent(component.id, { [key]: value });
  };

  return (
    <div className="w-[300px] bg-card border-l border-border flex flex-col hidden md:flex">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{component.type}</h3>
          <p className="text-xs text-muted-foreground">Properties</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeComponent(component.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 py-2 bg-transparent">
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="content" className="p-4 space-y-4">
            {component.type === 'hero' && (
              <>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={component.props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={component.props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={component.props.buttonText || ''}
                    onChange={(e) => handlePropChange('buttonText', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </>
            )}

            {(component.type === 'heading' || component.type === 'paragraph') && (
              <div>
                <Label htmlFor="text">Text</Label>
                <Input
                  id="text"
                  value={component.props.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="mt-2"
                />
              </div>
            )}

            {component.type === 'button' && (
              <>
                <div>
                  <Label htmlFor="text">Button Text</Label>
                  <Input
                    id="text"
                    value={component.props.text || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="linkTo">Link To</Label>
                  <Select
                    value={component.props.linkTo || ''}
                    onValueChange={(value) => handlePropChange('linkTo', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {pages.map((page) => (
                        <SelectItem key={page.id} value={`/${page.id === 'home' ? '' : page.name.toLowerCase()}`}>
                          {page.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backendFlow">🧩 Link to Backend Flow</Label>
                  <Select
                    value={component.props.backendFlow || ''}
                    onValueChange={(value) => handlePropChange('backendFlow', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select backend flow" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      <SelectItem value="contact_flow">Contact Form Flow</SelectItem>
                      <SelectItem value="newsletter_flow">Newsletter Flow</SelectItem>
                      <SelectItem value="auth_flow">Authentication Flow</SelectItem>
                      <SelectItem value="custom_flow">Custom Flow</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    This component will trigger the selected backend flow when activated.
                  </p>
                </div>
              </>
            )}

            {component.type === 'image' && (
              <>
                <div>
                  <Label htmlFor="src">Image URL</Label>
                  <Input
                    id="src"
                    value={component.props.src || ''}
                    onChange={(e) => handlePropChange('src', e.target.value)}
                    className="mt-2"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    value={component.props.alt || ''}
                    onChange={(e) => handlePropChange('alt', e.target.value)}
                    className="mt-2"
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="style" className="p-4 space-y-4">
            <div>
              <Label htmlFor="className">CSS Classes</Label>
              <Input
                id="className"
                value={component.props.className || ''}
                onChange={(e) => handlePropChange('className', e.target.value)}
                className="mt-2"
                placeholder="custom-class another-class"
              />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
