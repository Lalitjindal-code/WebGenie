import { FlowNode } from "@/store/backendStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlowPropertiesPanelProps {
  node: FlowNode | null;
  onUpdate: (id: string, updates: Partial<FlowNode>) => void;
}

export const FlowPropertiesPanel = ({ node, onUpdate }: FlowPropertiesPanelProps) => {
  if (!node) {
    return (
      <div className="w-[300px] bg-card border-l border-border flex items-center justify-center hidden md:flex">
        <div className="text-center text-muted-foreground p-6">
          <p className="text-sm">Select a node to edit properties</p>
        </div>
      </div>
    );
  }

  const handleDataChange = (key: string, value: any) => {
    onUpdate(node.id, {
      data: {
        ...node.data,
        [key]: value,
      },
    });
  };

  const renderNodeProperties = () => {
    switch (node.type) {
      case "fetch_data":
        return (
          <>
            <div>
              <Label>Table Name</Label>
              <Input
                value={node.data.table || ""}
                onChange={(e) => handleDataChange("table", e.target.value)}
                placeholder="users"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Filters (JSON)</Label>
              <Textarea
                value={JSON.stringify(node.data.filters || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleDataChange("filters", JSON.parse(e.target.value));
                  } catch {}
                }}
                placeholder='{"status": "active"}'
                className="mt-2 font-mono text-xs"
                rows={4}
              />
            </div>
          </>
        );

      case "insert_record":
        return (
          <>
            <div>
              <Label>Table Name</Label>
              <Input
                value={node.data.table || ""}
                onChange={(e) => handleDataChange("table", e.target.value)}
                placeholder="contacts"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Values (JSON)</Label>
              <Textarea
                value={JSON.stringify(node.data.values || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleDataChange("values", JSON.parse(e.target.value));
                  } catch {}
                }}
                placeholder='{"name": "", "email": ""}'
                className="mt-2 font-mono text-xs"
                rows={4}
              />
            </div>
          </>
        );

      case "http_request":
        return (
          <>
            <div>
              <Label>Method</Label>
              <Select
                value={node.data.method || "GET"}
                onValueChange={(value) => handleDataChange("method", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={node.data.url || ""}
                onChange={(e) => handleDataChange("url", e.target.value)}
                placeholder="https://api.example.com/data"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Headers (JSON)</Label>
              <Textarea
                value={JSON.stringify(node.data.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleDataChange("headers", JSON.parse(e.target.value));
                  } catch {}
                }}
                placeholder='{"Authorization": "Bearer token"}'
                className="mt-2 font-mono text-xs"
                rows={3}
              />
            </div>
            <div>
              <Label>Body (JSON)</Label>
              <Textarea
                value={JSON.stringify(node.data.body || {}, null, 2)}
                onChange={(e) => {
                  try {
                    handleDataChange("body", JSON.parse(e.target.value));
                  } catch {}
                }}
                placeholder='{"key": "value"}'
                className="mt-2 font-mono text-xs"
                rows={3}
              />
            </div>
          </>
        );

      case "ai_generate":
        return (
          <>
            <div>
              <Label>Prompt</Label>
              <Textarea
                value={node.data.prompt || ""}
                onChange={(e) => handleDataChange("prompt", e.target.value)}
                placeholder="Generate a welcome message..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label>Model</Label>
              <Select
                value={node.data.model || "gemini-1.5-pro"}
                onValueChange={(value) => handleDataChange("model", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Temperature</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={node.data.temperature || 0.7}
                onChange={(e) => handleDataChange("temperature", parseFloat(e.target.value))}
                className="mt-2"
              />
            </div>
          </>
        );

      case "return_response":
        return (
          <div>
            <Label>Response (JSON)</Label>
            <Textarea
              value={JSON.stringify(node.data.response || {}, null, 2)}
              onChange={(e) => {
                try {
                  handleDataChange("response", JSON.parse(e.target.value));
                } catch {}
              }}
              placeholder='{"success": true, "message": ""}'
              className="mt-2 font-mono text-xs"
              rows={6}
            />
          </div>
        );

      default:
        return (
          <div>
            <Label>Label</Label>
            <Input
              value={node.data.label || ""}
              onChange={(e) => handleDataChange("label", e.target.value)}
              className="mt-2"
            />
            <div className="mt-4">
              <Label>Description</Label>
              <Textarea
                value={node.data.description || ""}
                onChange={(e) => handleDataChange("description", e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-[300px] bg-card border-l border-border flex flex-col hidden md:flex">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">{node.data.label || node.type}</h3>
        <p className="text-xs text-muted-foreground">Properties</p>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="general" className="p-4">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {renderNodeProperties()}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label>Error Handling</Label>
              <Select
                value={node.data.errorHandling || "throw"}
                onValueChange={(value) => handleDataChange("errorHandling", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="throw">Throw Error</SelectItem>
                  <SelectItem value="continue">Continue</SelectItem>
                  <SelectItem value="fallback">Use Fallback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fallback Node ID</Label>
              <Input
                value={node.data.fallbackNodeId || ""}
                onChange={(e) => handleDataChange("fallbackNodeId", e.target.value)}
                placeholder="node-id"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Link to Backend Flow</Label>
              <Select
                value={node.data.frontendLink || ""}
                onValueChange={(value) => handleDataChange("frontendLink", value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select frontend component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="contact_form">Contact Form</SelectItem>
                  <SelectItem value="newsletter_form">Newsletter Form</SelectItem>
                  <SelectItem value="login_form">Login Form</SelectItem>
                  <SelectItem value="custom_button">Custom Button</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                This flow will be triggered when the selected frontend component is activated.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

