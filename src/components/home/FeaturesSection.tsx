import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bot, Code2, LayoutDashboard, Rocket, Workflow, Blocks } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";

type Feature = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof iconMap;
};

const iconMap = {
  Code2,
  LayoutDashboard,
  Rocket,
  Bot,
  Workflow,
  Blocks,
};

const fetchFeatures = async (): Promise<Feature[]> => {
  try {
    const data = await apiFetch<{ features?: Feature[] }>("/features");
    return data.features ?? [];
  } catch (error) {
    console.error("Failed to load features from API", error);
    return [];
  }
};

const fallbackFeatures: Feature[] = [
  {
    id: "ai-code",
    title: "AI Code Generation",
    description: "Instantly turns your design into real React + Node.js code.",
    icon: "Code2",
  },
  {
    id: "drag-drop",
    title: "Drag & Drop Builder",
    description: "Design like Canva, deploy like a dev with pixel-perfect control.",
    icon: "LayoutDashboard",
  },
  {
    id: "one-click",
    title: "One-Click Deploy",
    description: "Push live via Vercel instantly without leaving GenieSite.",
    icon: "Rocket",
  },
  {
    id: "genie-assistant",
    title: "Smart Genie Assistant",
    description: "Your AI co-builder that helps you improve & fix code on the fly.",
    icon: "Bot",
  },
  {
    id: "logic-flow",
    title: "Logic Flow Builder",
    description: "Visual backend builder powered by Gemini API workflows.",
    icon: "Workflow",
  },
  {
    id: "real-components",
    title: "Real Components",
    description: "Buttons, navbars, cards, and footers—all production ready.",
    icon: "Blocks",
  },
];

const FeaturesSection = () => {
  const { data } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const features = useMemo(() => {
    if (!data || data.length === 0) {
      return fallbackFeatures;
    }

    return data.map((feature) => {
      if (feature.icon && feature.icon in iconMap) {
        return feature;
      }

      return { ...feature, icon: "Code2" as const };
    });
  }, [data]);

  return (
    <section id="features" className="relative py-24 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-72 bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "0.8s" }} />
      </div>

      <div className="container mx-auto relative z-10 max-w-[1200px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border/60 bg-secondary/40 backdrop-blur-lg text-sm font-medium"
          >
            <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent animate-pulse" />
            Powered by AI
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-4xl md:text-5xl font-display font-bold leading-tight"
          >
            Capabilities that feel like <span className="gradient-text">magic</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-6 text-lg text-muted-foreground"
          >
            GenieSite blends design freedom with production-grade engineering so you can ship polished experiences faster than ever.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? Code2;

            return (
              <motion.div
                key={feature.id ?? index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-3xl border border-transparent bg-gradient-to-br from-secondary/80 via-background to-background p-[1px] shadow-2xl"
              >
                <div className="relative h-full rounded-[calc(theme(borderRadius.3xl))] bg-[#0B0B10]/90 p-8 transition-smooth group-hover:bg-[#0F0F18]/80">
                  <div className="absolute inset-0 rounded-[calc(theme(borderRadius.3xl))] opacity-0 transition-smooth group-hover:opacity-100" style={{ background: "linear-gradient(120deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))" }} />
                  <div className="relative space-y-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-xl glow-magic transition-spring group-hover:scale-110">
                      <Icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-display font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-smooth group-hover:bg-primary/20" />
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-6 left-1/2 h-12 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl opacity-0 transition-smooth group-hover:opacity-80" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

