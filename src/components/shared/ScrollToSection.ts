export const scrollToSection = (id: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById(id);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default scrollToSection;

