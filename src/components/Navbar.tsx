import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import scrollToSection from "@/components/shared/ScrollToSection";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = useCallback(
    (id: string) => {
      if (location.pathname === "/") {
        scrollToSection(id);
        setIsOpen(false);
      } else {
        navigate(`/?scrollTo=${id}`);
        setIsOpen(false);
      }
    },
    [location.pathname, navigate]
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-magic transition-smooth group-hover:scale-110">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">GenieSite</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="group relative text-sm font-medium text-foreground/70 transition-smooth hover:text-foreground">
              Home
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <button
              onClick={() => handleScroll("features")}
              className="group relative text-sm font-medium text-foreground/70 transition-smooth hover:text-foreground"
            >
              Features
              <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => handleScroll("how-it-works")}
              className="group relative text-sm font-medium text-foreground/70 transition-smooth hover:text-foreground"
            >
              How It Works
              <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </button>
            <Link to="/pricing" className="group relative text-sm font-medium text-foreground/70 transition-smooth hover:text-foreground">
              Pricing
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/about" className="group relative text-sm font-medium text-foreground/70 transition-smooth hover:text-foreground">
              About
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <button
              onClick={() => handleScroll("contact")}
              className="group relative text-sm font-medium text-foreground/70 transition-smooth hover:text-foreground"
            >
              Contact
              <span className="pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </button>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth glow-blue">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <button onClick={() => handleScroll("features")} className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-smooth">
              Features
            </button>
            <button onClick={() => handleScroll("how-it-works")} className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-smooth">
              How It Works
            </button>
            <Link to="/pricing" className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth">
              Pricing
            </Link>
            <Link to="/about" className="block px-4 py-2 hover:bg-muted rounded-lg transition-smooth">
              About
            </Link>
            <button onClick={() => handleScroll("contact")} className="block w-full text-left px-4 py-2 hover:bg-muted rounded-lg transition-smooth">
              Contact
            </button>
            <div className="flex flex-col gap-2 px-4 pt-2">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button className="w-full bg-gradient-to-r from-primary to-accent">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
