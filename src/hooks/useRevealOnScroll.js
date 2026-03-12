import { useEffect } from "react";

export default function useRevealOnScroll() {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length) {
      return undefined;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      revealItems.forEach((item) => observer.observe(item));
      return () => observer.disconnect();
    }

    revealItems.forEach((item) => item.classList.add("in-view"));
    return undefined;
  }, []);
}

