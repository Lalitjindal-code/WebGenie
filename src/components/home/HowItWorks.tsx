import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";

const steps = [
  {
    id: "design",
    title: "Design Visually",
    description: "Drag & drop elements on the canvas with precision controls.",
    number: "01",
  },
  {
    id: "convert",
    title: "AI Converts to Code",
    description: "Genie writes clean React, Node.js, and API logic behind the scenes.",
    number: "02",
  },
  {
    id: "preview",
    title: "Preview Instantly",
    description: "See your live site in seconds with responsive previews.",
    number: "03",
  },
  {
    id: "deploy",
    title: "Deploy with a Click",
    description: "Publish to Vercel in one tap with automatic environment setup.",
    number: "04",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const genieOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);

  return (
    <section id="how-it-works" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/40 to-accent/0 md:block" />
        <div className="absolute -left-10 top-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div ref={sectionRef} className="container mx-auto relative z-10 max-w-[1200px]">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border/60 bg-secondary/40 backdrop-blur-lg text-sm font-medium"
          >
            <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold"
          >
            How GenieSite Works — from Wish to Website ✨
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Follow the trail of the Genie and watch your idea transform into a production-ready website, step by step.
          </motion.p>
        </div>

        <div className="relative">
          <motion.div
            style={{ top: genieOffset }}
            className="pointer-events-none absolute hidden -left-16 z-20 h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-2xl glow-magic md:flex"
          >
            <Sparkles className="h-10 w-10" strokeWidth={1.5} />
          </motion.div>

          <div className="grid gap-10 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative rounded-3xl border border-border/60 bg-secondary/40 p-8 backdrop-blur-xl transition-smooth group-hover:border-primary/60 group-hover:bg-secondary/60">
                  <div className="absolute inset-0 rounded-3xl opacity-0 transition-smooth group-hover:opacity-100" style={{ background: "linear-gradient(140deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))" }} />
                  <div className="relative space-y-5">
                    <span className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">Step</span>
                    <div className="flex items-end justify-between">
                      <h3 className="text-2xl font-display font-semibold">{step.title}</h3>
                      <span className="text-4xl font-bold gradient-text">{step.number}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-primary/20 blur-2xl opacity-0 transition-smooth group-hover:opacity-100" />
                    <div className="pointer-events-none absolute bottom-0 left-1/2 h-14 w-28 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/20 blur-2xl opacity-0 transition-smooth group-hover:opacity-100" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

