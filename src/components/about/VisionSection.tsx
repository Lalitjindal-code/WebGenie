import { motion } from "framer-motion";

const VisionSection = () => (
  <section className="relative overflow-hidden py-24 px-4">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 24 }).map((_, index) => (
          <span
            key={index}
            className="animate-float absolute h-1 w-1 rounded-full bg-white/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>

    <div className="container relative z-10 mx-auto max-w-[920px] text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground"
      >
        Vision & Future
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 text-4xl md:text-5xl font-display font-bold leading-tight"
      >
        “We’re blending design, AI, and engineering to make full-stack creation effortless and powerful.”
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-6 text-lg text-muted-foreground"
      >
        GenieSite is evolving into an intelligent co-creator—bridging every gap between imagination and deployment. From multi-player editing to AI-driven testing, the future is a canvas where teams collaborate in real time, ship faster, and keep the magic alive.
      </motion.p>
    </div>
  </section>
);

export default VisionSection;

