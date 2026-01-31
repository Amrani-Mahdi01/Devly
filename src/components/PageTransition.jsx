import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PageTransition({ onReveal, onComplete }) {
  const overlaysRef = useRef([]);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const overlays = overlaysRef.current.filter(Boolean);
    if (!overlays.length) return;

    const tl = gsap.timeline();

    // 1️⃣ Slide overlays in from right
    tl.set(overlays, { xPercent: 100 })
      .to(overlays, {
        xPercent: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: "power4.out",
      })
      // 2️⃣ When overlays fully cover the screen, trigger navigation
      .call(() => {
        if (onReveal && !hasNavigated.current) {
          hasNavigated.current = true;
          onReveal();
        }
      })
      // 3️⃣ Brief pause to ensure new page renders
      .to({}, { duration: 0.1 })
      // 4️⃣ Slide overlays out to left to reveal new page
      .to(overlays, {
        xPercent: -100,
        stagger: 0.15,
        duration: 0.5,
        ease: "power4.inOut",
      })
      // 5️⃣ Call onComplete after everything finishes
      .call(() => {
        if (onComplete) onComplete();
      });

    return () => {
      tl.kill();
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => (overlaysRef.current[i] = el)}
          className="absolute left-0 right-0 bg-primary"
          style={{ top: `${i * 33.33}%`, height: "33.33%" }}
        />
      ))}
    </div>
  );
}