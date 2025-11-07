import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingHero from "@/components/pricing/PricingHero";
import PricingCards from "@/components/pricing/PricingCards";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import FAQSection from "@/components/pricing/FAQSection";
import type { PricingPlan } from "@/components/pricing/types";
import scrollToSection from "@/components/shared/ScrollToSection";
import { apiFetch } from "@/lib/apiClient";

const fallbackPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    currency: "INR",
    interval: "month",
    description: "Experiment with GenieSite magic at no cost.",
    features: ["2 Projects", "1 Deployment", "Limited AI", "Community Support"],
    highlight: false,
    ctaLabel: "Start for Free",
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    currency: "INR",
    interval: "month",
    description: "Unlimited creation with full AI access and custom domains.",
    features: ["Unlimited Projects", "Unlimited Deployments", "Full AI Access", "Custom Domains", "Team Sharing"],
    highlight: true,
    ctaLabel: "Upgrade to Pro",
  },
  {
    id: "team",
    name: "Team",
    price: 999,
    currency: "INR",
    interval: "month",
    description: "Collaborative power with shared assets and priority support.",
    features: ["Collaboration", "Shared Assets", "Priority Support", "Unlimited Deployments", "Role Management"],
    highlight: false,
    ctaLabel: "Contact Sales",
  },
];

const fetchPlans = async (): Promise<PricingPlan[]> => {
  try {
    const payload = await apiFetch<{ plans?: PricingPlan[] }>("/pricing");
    return payload.plans ?? [];
  } catch (error) {
    console.error("Failed to load pricing plans from API", error);
    return [];
  }
};

const Pricing = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const plans = useMemo(() => {
    if (!data || data.length === 0) {
      return fallbackPlans;
    }
    return data.map((plan) => ({
      ...plan,
      currency: plan.currency ?? "INR",
      interval: plan.interval ?? "month",
    }));
  }, [data]);

  const handleHeroCta = useCallback(() => {
    scrollToSection("plans");
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white">
      <Navbar />
      <main className="bg-gradient-to-b from-[#0B0B10] via-[#0D0D15] to-[#08080F]">
        <PricingHero onCtaClick={handleHeroCta} />
        <PricingCards plans={plans} isLoading={isLoading} />
        <ComparisonTable />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
