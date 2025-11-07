import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Github, Linkedin, Twitter } from "lucide-react";
import scrollToSection from "@/components/shared/ScrollToSection";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id: string) => {
    if (location.pathname === "/") {
      scrollToSection(id);
      return;
    }

    navigate(`/?scrollTo=${id}`);
  };

  return (
    <footer className="relative border-t border-border bg-[#05050A]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="animate-pulse-slow absolute left-1/3 top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
        <div className="animate-pulse-slow absolute right-1/4 bottom-8 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1200px] px-4 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-50 blur-lg" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg glow-magic">
                  <Sparkles className="h-5 w-5" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <p className="text-xl font-display font-bold gradient-text">GenieSite</p>
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Dream. Build. Deploy.</p>
              </div>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Craft immersive digital experiences powered by our AI Genie. No limits, no compromise—just production-grade magic.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Navigation</h3>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="transition-smooth hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <button onClick={() => handleScroll("features")} className="transition-smooth hover:text-white">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("how-it-works")} className="transition-smooth hover:text-white">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleScroll("contact")} className="transition-smooth hover:text-white">
                  Contact
                </button>
              </li>
              <li>
                <Link to="/pricing" className="transition-smooth hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-smooth hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">Connect</h3>
            <p className="text-sm text-muted-foreground">Follow the Genie for behind-the-scenes sparks.</p>
            <div className="flex gap-4">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-[#10101A] transition-smooth hover:border-primary/50 hover:bg-[#131323]"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-muted-foreground transition-smooth group-hover:text-white" strokeWidth={1.5} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-[#10101A] transition-smooth hover:border-primary/50 hover:bg-[#131323]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-muted-foreground transition-smooth group-hover:text-white" strokeWidth={1.5} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-[#10101A] transition-smooth hover:border-primary/50 hover:bg-[#131323]"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-muted-foreground transition-smooth group-hover:text-white" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-6 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 WebGenie. All rights reserved.</p>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.4em]">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent animate-ping" />
            Crafted with stardust
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
