export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  description: string;
  features: string[];
  highlight?: boolean;
  stripePriceId?: string | null;
  ctaLabel?: string | null;
};


