import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MissionSection from "@/components/about/MissionSection";
import TeamSection from "@/components/about/TeamSection";
import VisionSection from "@/components/about/VisionSection";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0B0B10] text-white">
      <Navbar />

      <main className="bg-gradient-to-b from-[#0B0B10] via-[#0D0D15] to-[#08080F]">
        <section className="relative overflow-hidden pt-32 pb-24 px-4">
          <div className="absolute inset-0">
            <div className="animate-spin-slow absolute left-1/2 top-[-280px] h-[720px] w-[720px] -translate-x-1/2 rounded-full border border-primary/10" />
            <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(59,130,246,0.18),rgba(139,92,246,0.08),transparent_65%)] blur-[120px]" />
          </div>

          <div className="container relative z-10 mx-auto max-w-[1100px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mx-auto max-w-3xl text-center space-y-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-5 py-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary animate-sparkle" />
                About GenieSite
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Building the future of website creation — powered by AI ✨
              </h1>
              <p className="text-xl text-muted-foreground">
                We believe coding should feel like creating magic. GenieSite empowers every team to weave ideas into immersive digital products—no spells required.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/">
                  <Button size="lg" className="group rounded-full bg-gradient-to-r from-primary to-accent px-10 py-6 text-lg font-semibold hover:opacity-90">
                    Explore GenieSite
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="rounded-full border-border/60 px-10 py-6 text-lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <MissionSection />
        <TeamSection />
        <VisionSection />

        <section className="relative py-24 px-4">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_transparent_65%)]" />
          </div>

          <div className="container relative z-10 mx-auto max-w-[960px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[36px] border border-border/60 bg-[#0E0E16]/90 px-10 py-16 text-center shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Ready to build something <span className="gradient-text">magical</span>?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Join the growing WebGenie community shaping the next era of cross-functional creation.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/signup">
                  <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent px-10 py-6 text-lg font-semibold">
                    Start Building Free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="ghost" size="lg" className="rounded-full px-10 py-6 text-lg">
                    Talk with the Genie
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
