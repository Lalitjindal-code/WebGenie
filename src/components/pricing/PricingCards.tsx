import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { PricingPlan } from "./types";

type PricingCardsProps = {
  plans: PricingPlan[];
  isLoading?: boolean;
  onSelectPlan?: (plan: PricingPlan) => Promise<void> | void;
};

const formatPrice = (plan: PricingPlan) => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: plan.currency ?? "INR",
    maximumFractionDigits: 0,
  });

  return formatter.format(plan.price);
};

const PricingCards = ({ plans, isLoading, onSelectPlan }: PricingCardsProps) => {
  const { toast } = useToast();

  const handleClick = async (plan: PricingPlan) => {
    if (!onSelectPlan) {
      if (plan.stripePriceId) {
        toast({
          title: "Stripe checkout (stub)",
          description: `Would redirect to Stripe checkout for plan ${plan.name}.`,
        });
        console.info("Stripe checkout stub triggered", {
          planId: plan.id,
          stripePriceId: plan.stripePriceId,
        });
        return;
      }

      toast({
        title: "Checkout unavailable",
        description: "Stripe integration is not configured yet. Contact sales for access.",
      });
      return;
    }

    await onSelectPlan(plan);
  };

  return (
    <section id="plans" className="relative py-10 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1100px]">
        <div className="mx-auto mb-16 max-w-3xl text-center space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
            Plans & Pricing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold"
          >
            Unlock production-ready magic at every tier
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Transparent pricing with powerful AI features included. Upgrade whenever you&apos;re ready for more stardust.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-[32px] border border-border/60 bg-secondary/50 p-10" />
              ))
            : plans.map((plan, index) => {
                const isHighlighted = Boolean(plan.highlight);
                const ctaLabel = plan.ctaLabel ?? (plan.name === "Free" ? "Start for Free" : plan.name === "Team" ? "Contact Sales" : "Upgrade to Pro");

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`relative h-full rounded-[32px] border border-border/70 bg-[#0C0C16]/80 backdrop-blur-xl transition-smooth ${
                        isHighlighted
                          ? "border-primary/80 shadow-[0_25px_60px_rgba(59,130,246,0.25)]"
                          : "hover:border-primary/40"
                      }`}
                    >
                      {isHighlighted && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-xs font-medium uppercase tracking-[0.3em] text-white shadow-lg">
                          Most Popular
                        </div>
                      )}
                      <CardHeader className="flex flex-col items-center gap-3 pb-10 pt-12 text-center">
                        <CardTitle className="text-2xl font-display font-semibold">{plan.name}</CardTitle>
                        <div className="flex items-end gap-2">
                          <span className="text-5xl font-bold gradient-text">{formatPrice(plan)}</span>
                          <span className="text-sm uppercase text-muted-foreground">/{plan.interval}</span>
                        </div>
                        <CardDescription className="text-base text-muted-foreground/90">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex h-full flex-col gap-8 px-10 pb-12">
                        <ul className="space-y-4">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/90">
                              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                                ✨
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          disabled={isLoading}
                          onClick={() => handleClick(plan)}
                          className={`group flex h-12 items-center justify-center gap-2 rounded-full text-base font-semibold transition-smooth ${
                            isHighlighted
                              ? "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                              : "border border-border/70 bg-transparent text-white hover:border-primary/60"
                          }`}
                        >
                          {ctaLabel}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;


