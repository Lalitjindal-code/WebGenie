import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const comparisonRows = [
  {
    feature: "Projects",
    free: "2",
    pro: "Unlimited",
    team: "Unlimited",
  },
  {
    feature: "Deployments",
    free: "1",
    pro: "Unlimited",
    team: "Unlimited",
  },
  {
    feature: "AI Code Generator",
    free: "❌",
    pro: "✅",
    team: "✅",
  },
  {
    feature: "Collaboration",
    free: "❌",
    pro: "❌",
    team: "✅",
  },
];

const ComparisonTable = () => (
  <section className="relative py-24 px-4">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="absolute left-1/4 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
    </div>

    <div className="container relative z-10 mx-auto max-w-[1100px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto mb-12 max-w-3xl text-center space-y-4"
      >
        <h2 className="text-4xl font-display font-bold">Feature-by-feature clarity</h2>
        <p className="text-lg text-muted-foreground">
          See exactly what magic each plan unlocks before you commit. Upgrade as your ambitions grow.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className="overflow-hidden border border-border/70 bg-[#0B0B12]/70 backdrop-blur-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-y-2 px-4">
                <thead>
                  <tr className="text-left text-sm uppercase tracking-[0.2em] text-muted-foreground/80">
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4 text-center">Free</th>
                    <th className="px-6 py-4 text-center">Pro</th>
                    <th className="px-6 py-4 text-center">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="rounded-3xl bg-[#101020]/80 text-base text-muted-foreground/90">
                      <td className="rounded-l-3xl px-6 py-5 font-medium text-white/90">{row.feature}</td>
                      <td className="px-6 py-5 text-center">{row.free}</td>
                      <td className="px-6 py-5 text-center">{row.pro}</td>
                      <td className="rounded-r-3xl px-6 py-5 text-center">{row.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </section>
);

export default ComparisonTable;


