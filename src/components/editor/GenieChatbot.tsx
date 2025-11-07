import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEditorStore } from "@/store/editorStore";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GenieChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenieChatbot = ({ isOpen, onClose }: GenieChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '👋 Hello master! I\'m your Genie assistant. How can I help you build magic today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pages, currentPageId } = useEditorStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const currentPage = pages.find((p) => p.id === currentPageId);
      const context = {
        currentPage: currentPage?.name,
        components: currentPage?.components.map((c) => c.type),
      };

      const { data, error } = await supabase.functions.invoke('genie-chat', {
        body: { 
          message: userMessage,
          context 
        }
      });

      if (error) throw error;

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.response || 'Your wish is my command, master! ✨' 
      }]);
    } catch (error: any) {
      console.error('Genie chat error:', error);
      toast.error('Genie is having trouble responding');
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Apologies, master! I encountered an issue. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Add a hero section",
    "Create a contact form",
    "Suggest color scheme",
    "Fix my layout"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 right-6 w-[calc(100vw-3rem)] max-w-[384px] max-h-[70vh] md:max-h-[600px] bg-card/95 backdrop-blur-sm border-2 border-primary/50 rounded-2xl shadow-lg z-50 flex flex-col"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-sparkle">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-semibold">Genie Assistant</span>
                <p className="text-xs text-muted-foreground">Your magical helper</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-accent text-white'
                        : 'bg-secondary'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-full transition-smooth"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Genie anything..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
