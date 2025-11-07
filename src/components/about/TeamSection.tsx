import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Stars } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
};

const fetchTeam = async (): Promise<TeamMember[]> => {
  try {
    const data = await apiFetch<{ team?: TeamMember[] }>("/team");
    return data.team ?? [];
  } catch (error) {
    console.error("Failed to load team members from API", error);
    return [];
  }
};

const defaultTeam: TeamMember[] = [
  { id: "lalit", name: "Lalit Jindal", role: "Product Architect" },
  { id: "pratiksha", name: "Pratiksha Ahire", role: "Frontend Developer" },
  { id: "arin", name: "Arin Yadav", role: "Backend Developer" },
  { id: "vaibhav", name: "Vaibhav Gurjar", role: "UI/UX Designer" },
];

const TeamSection = () => {
  const { data } = useQuery({ queryKey: ["team"], queryFn: fetchTeam, staleTime: 1000 * 60 * 10, retry: 1 });

  const team = useMemo(() => {
    if (!data || data.length === 0) {
      return defaultTeam;
    }
    return data;
  }, [data]);

  return (
    <section className="relative py-24 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-10 h-72 w-72 translate-x-1/3 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-72 w-72 translate-y-1/3 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1100px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center space-y-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            <Stars className="h-4 w-4 text-primary animate-sparkle" />
            Team WebGenie
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            The magical minds behind <span className="gradient-text">GenieSite</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A dream team of builders blending design, AI, and engineering into spellbinding products.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2">
          {team.map((member, index) => (
            <motion.div
              key={member.id ?? member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-[#10101A]/70 p-[1px] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/10 to-accent/0 opacity-0 transition-smooth group-hover:opacity-100" />
              <div className="relative h-full rounded-[27px] bg-[#0B0B12]/90 px-8 py-10 shadow-2xl transition-smooth group-hover:translate-y-[-4px]">
                <div className="absolute -top-10 right-10 h-24 w-24 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 blur-2xl opacity-0 transition-smooth group-hover:opacity-100" />
                <div className="absolute inset-0 opacity-0 transition-smooth group-hover:opacity-100">
                  <div className="animate-spin-slow absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border border-dashed border-primary/30" />
                </div>
                <div className="relative space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/60 px-4 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {member.role}
                  </div>
                  <h3 className="text-2xl font-display font-semibold">{member.name}</h3>
                  {member.bio ? <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p> : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;

