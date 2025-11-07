import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import ContactSection from "@/components/home/ContactSection";
import scrollToSection from "@/components/shared/ScrollToSection";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionId = params.get("scrollTo");

    if (!sectionId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [location.search]);

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white">
      <Navbar />
      <main className="bg-gradient-to-b from-[#0B0B10] via-[#0D0D15] to-[#09080F]">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
