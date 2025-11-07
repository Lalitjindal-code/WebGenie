import { motion } from "framer-motion";
import { Lamp, Sparkles } from "lucide-react";

const MissionSection = () => (
  <section className="relative overflow-hidden py-24 px-4">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-0 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[160px]" />
    </div>

    <div className="container relative z-10 mx-auto max-w-[1100px]">
      <div className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
            To empower creators, developers, and dreamers
          </h2>
          <p className="text-lg text-muted-foreground">
            We believe full-stack craftsmanship should be accessible to everyone. GenieSite blends design, AI, and engineering so you can orchestrate production-grade experiences without writing a single line of code—unless you want to.
          </p>
          <p className="text-lg text-muted-foreground">
            Our platform turns ideas into deployable products by combining intuitive tooling with generative intelligence. The result? Websites that feel handcrafted, delivered at the speed of imagination.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-[40px] border border-border/60 bg-[#0C0C16] p-10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_60%)]" />
            <div className="relative flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-primary to-accent opacity-30 blur-2xl" />
                <div className="relative grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-xl">
                  <Lamp className="h-16 w-16" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-center text-lg font-medium">Making technology feel like magic.</p>
              <p className="text-center text-sm text-muted-foreground">
                The Genie keeps the lamp glowing—fueling every launch, every iteration, every dream.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default MissionSection;

