import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export let smootherInstance = null; // export so other components can use it

export default function ScrollSmootherComponent() {
  useEffect(() => {
    const isDesktop = window.innerWidth > 1024;

    if (!isDesktop) return; // Disable on mobile/tablet for performance

    smootherInstance = ScrollSmoother.create({
      wrapper: "#wrapper",
      content: "#content",
      smooth: 2,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
      // Prevent header from being affected by smooth scroll
      smoothTouch: false,
    });

    // Pin the header outside of ScrollSmoother
    gsap.set("#main-header", { position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 });

    return () => {
      smootherInstance?.kill();
      smootherInstance = null;
    };
  }, []);

  return null;
}