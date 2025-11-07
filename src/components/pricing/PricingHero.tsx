import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type PricingHeroProps = {
  onCtaClick?: () => void;
};

const PricingHero = ({ onCtaClick }: PricingHeroProps) => (
  <section className="relative overflow-hidden pt-32 pb-24 px-4">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_65%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
    </div>

    <div className="container relative z-10 mx-auto max-w-[1060px] text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
          Pricing
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
          Choose the Right Plan for Your Magic ✨
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl">
          Whether you&apos;re a creator, developer, or an entire team — GenieSite has a plan tailored to your ambitions.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="rounded-full bg-gradient-to-r from-primary to-accent px-10 py-6 text-lg font-semibold shadow-2xl transition-smooth hover:opacity-90"
          >
            Start Free Today
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-border/60 px-10 py-6 text-lg text-white hover:border-primary/60 hover:text-white"
            asChild
          >
            <a href="#plans">Compare Plans</a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default PricingHero;


