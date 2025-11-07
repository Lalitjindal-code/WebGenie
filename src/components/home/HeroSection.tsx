import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { Pen, Boxes, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const HeroSection = () => {
  const controls = useAnimation();
  const location = useLocation();

  useEffect(() => {
    controls.start("animate");
  }, [controls, location.key]);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-4">
      <div className="absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-[420px] w-[420px] translate-x-1/4 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%)]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1200px]">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <motion.div variants={floatingVariants} initial="initial" animate={controls} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-5 py-2 text-sm font-medium backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
              Spellbinding websites in minutes
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              Your imagination. <span className="gradient-text">Real code.</span>
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground">
              Craft interactive experiences with our AI-powered canvas. GenieSite transforms every component into clean React and Node.js code—ready to deploy in a single click.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full rounded-full bg-gradient-to-r from-primary to-accent px-10 py-6 text-lg font-semibold glow-blue transition-smooth hover:opacity-90">
                  Start Free Today
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-full border-border/60 bg-transparent px-10 py-6 text-lg">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 pt-8 sm:grid-cols-3">
              {[
                { label: "Genie Projects live", value: "12K+" },
                { label: "Code lines generated", value: "8.7M" },
                { label: "Average deploy time", value: "46s" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/60 bg-secondary/30 p-4 text-center">
                  <p className="text-3xl font-display font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -top-10 -left-6 h-40 w-40 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent opacity-80" />
            <div className="relative overflow-hidden rounded-[36px] border border-border/60 bg-gradient-to-br from-[#131321] via-[#0C0C14] to-[#08080E] shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/50 px-6 py-4">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground">GenieSite Editor</span>
              </div>

              <div className="grid gap-6 p-8">
                <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20 p-8 shadow-lg">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl glow-magic">
                    <Pen className="h-9 w-9" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-display font-semibold">Create without limits</h3>
                  <p className="mt-3 text-sm text-muted-foreground">Visual design meets AI power. Build responsive layouts, data connections, and interactions.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-secondary/40 p-5">
                    <span className="text-xs text-muted-foreground">Components</span>
                    <div className="mt-4 space-y-2">
                      {["Hero", "Pricing", "Testimonials", "Blog"].map((item) => (
                        <div key={item} className="flex items-center justify-between rounded-xl bg-background/40 px-3 py-2 text-sm">
                          <span>{item}</span>
                          <Boxes className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-secondary/40 p-5">
                    <span className="text-xs text-muted-foreground">Deployments</span>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Production</span>
                        <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">Synced</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Preview</span>
                        <span>Ready</span>
                      </div>
                      <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent text-xs font-semibold">
                        Deploy to Vercel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

