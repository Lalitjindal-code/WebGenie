import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Terminal, AlertCircle, FileText } from "lucide-react";

interface BackendConsoleProps {
  logs: string[];
}

export const BackendConsole = ({ logs }: BackendConsoleProps) => {
  const aiLogs = logs.filter((log) => log.includes("🪄") || log.includes("Gemini") || log.includes("AI"));
  const executionLogs = logs.filter((log) => !log.includes("🪄") && !log.includes("Gemini") && !log.includes("AI") && !log.includes("❌"));
  const errorLogs = logs.filter((log) => log.includes("❌") || log.includes("Error") || log.includes("Failed"));

  return (
    <div className="h-48 bg-card border-t border-border flex flex-col">
      <Tabs defaultValue="execution" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start px-4 py-2 bg-transparent border-b border-border">
          <TabsTrigger value="execution" className="text-xs flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            Execution
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            AI Logs
          </TabsTrigger>
          <TabsTrigger value="errors" className="text-xs flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="output" className="text-xs flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Output JSON
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="execution" className="m-0 p-4">
            <div className="space-y-1 font-mono text-xs">
              {executionLogs.length > 0 ? (
                executionLogs.map((log, index) => (
                  <div key={index} className="text-muted-foreground">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground/50">No execution logs yet. Run a test to see output.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="m-0 p-4">
            <div className="space-y-1 font-mono text-xs">
              {aiLogs.length > 0 ? (
                aiLogs.map((log, index) => (
                  <div key={index} className="text-primary">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground/50">No AI logs yet. Generate code to see AI activity.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="errors" className="m-0 p-4">
            <div className="space-y-1 font-mono text-xs">
              {errorLogs.length > 0 ? (
                errorLogs.map((log, index) => (
                  <div key={index} className="text-destructive">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground/50">No errors. Everything looks good! ✨</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="output" className="m-0 p-4">
            <div className="space-y-1 font-mono text-xs">
              {logs.length > 0 ? (
                <pre className="text-muted-foreground whitespace-pre-wrap">
                  {JSON.stringify({ logs }, null, 2)}
                </pre>
              ) : (
                <div className="text-muted-foreground/50">No output yet. Test your flow to see results.</div>
              )}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

