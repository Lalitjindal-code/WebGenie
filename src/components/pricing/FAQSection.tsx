import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is GenieSite beginner-friendly?",
    answer:
      "Absolutely. Start with our drag-and-drop builder and Genie Assistant will guide you through every step, no code required.",
  },
  {
    question: "Do I own the code generated?",
    answer:
      "Yes! Every component, workflow, and deployment you create belongs to you. Export or customize the code whenever you like.",
  },
  {
    question: "Can I upgrade anytime?",
    answer:
      "Upgrade or downgrade between plans at any time. Changes apply instantly and prorated billing keeps things simple.",
  },
  {
    question: "Is my data secure?",
    answer:
      "We use enterprise-grade security with Supabase, encrypted storage, and audit logs to protect your projects around the clock.",
  },
];

const FAQSection = () => (
  <section className="relative py-24 px-4">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(139,92,246,0.15),_transparent_70%)]" />
    </div>

    <div className="container relative z-10 mx-auto max-w-[900px] text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-display font-bold"
      >
        FAQ — your wishes, answered ✨
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-lg text-muted-foreground"
      >
        Everything you need to know about pricing, plans, and the Genie&apos;s magical capabilities.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12"
      >
        <Accordion type="single" collapsible className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="group overflow-hidden rounded-3xl border border-border/60 bg-[#0C0C16]/80 backdrop-blur-xl"
            >
              <AccordionTrigger className="px-6 py-5 text-lg font-medium text-white hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary/30 to-accent/30 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;


