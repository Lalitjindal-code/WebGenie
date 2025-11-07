import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl } from "@/lib/apiClient";

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      toast({
        title: "Missing details",
        description: "Please fill out your name, email, and message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      event.currentTarget.reset();

      toast({
        title: "✨ Message sent successfully!",
        description: "We will get back to you shortly.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment or email us at hello@geniesite.ai.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[420px] w-[420px] translate-x-1/3 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10 max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-border/60 bg-secondary/40 p-8 backdrop-blur-xl shadow-2xl"
          >
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
                Connect with the Genie
              </span>
              <h2 className="text-4xl font-display font-bold leading-tight">
                We&apos;d love to hear about your next magical project
              </h2>
              <p className="text-base text-muted-foreground">
                Share your ideas, collaboration requests, or feedback. Our team answers every message within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground/80">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Luna Starfield"
                  required
                  className="h-12 rounded-xl bg-background/60 border-border/40 focus:border-primary focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@geniesite.ai"
                  required
                  className="h-12 rounded-xl bg-background/60 border-border/40 focus:border-primary focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground/80">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  required
                  className="min-h-[140px] rounded-xl bg-background/60 border-border/40 focus:border-primary focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-base font-semibold text-white transition-smooth hover:opacity-90"
              >
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex h-full items-center justify-center"
          >
            <div className="relative max-w-md">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-[140px]" />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-[48px] border border-border/50 bg-gradient-to-br from-[#10101A] to-[#08080E] p-12 shadow-[0_30px_80px_rgba(23,23,45,0.65)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_65%)]" />
                <div className="relative flex flex-col items-center gap-8">
                  <div className="relative">
                    <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-3xl" />
                    <div className="relative grid place-items-center rounded-full bg-gradient-to-br from-primary to-accent p-16 text-white shadow-2xl">
                      <Sparkles className="h-14 w-14" strokeWidth={1.5} />
                    </div>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 -z-10 rounded-full border-2 border-dashed border-white/10"
                    />
                  </div>

                  <div className="relative text-center">
                    <p className="text-xl font-medium text-white">The Genie is always listening.</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Whisper your wish and watch the stardust dance its way to our team.
                    </p>
                  </div>
                </div>

                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -left-20 top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 opacity-80 blur-3xl"
                  animate={{ x: [0, 12, 0], y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 bottom-6 h-28 w-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 opacity-70 blur-3xl"
                  animate={{ x: [0, -10, 0], y: [0, 6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="pointer-events-none absolute inset-0">
                  {[...Array(18).keys()].map((particle) => (
                    <motion.span
                      key={particle}
                      className="absolute h-1 w-1 rounded-full bg-white/50"
                      initial={{
                        opacity: 0,
                        x: Math.random() * 240,
                        y: Math.random() * 220,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        x: [Math.random() * 240, Math.random() * 240 - 40],
                        y: [Math.random() * 220, Math.random() * 220 - 40],
                      }}
                      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.div>
              <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-44 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

