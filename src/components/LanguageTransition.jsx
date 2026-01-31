import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function LanguageTransition({ trigger, onComplete, direction = "ltr", onLangChange }) {
  const overlaysRef = useRef([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;

    hasAnimated.current = true;

    const overlays = overlaysRef.current.filter(Boolean);
    if (!overlays.length) return;

    const enterFrom = direction === "rtl" ? -100 : 100;
    const exitTo = direction === "rtl" ? 100 : -100;

    // Slide in timeline
    const tlIn = gsap.timeline({
      onComplete: () => {
        // Change language only when fully covered
        if (onLangChange) onLangChange();

        // Slide out timeline after a short delay
        gsap.to(overlays, {
          xPercent: exitTo,
          stagger: 0.15,
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            if (onComplete) onComplete();
            hasAnimated.current = false; // ready for next trigger
          },
        });
      },
    });

    tlIn.set(overlays, { xPercent: enterFrom }).to(overlays, {
      xPercent: 0,
      stagger: 0.15,
      duration: 0.5,
      ease: "power4.out",
    });

    return () => tlIn.kill();
  }, [trigger, direction, onLangChange, onComplete]);

  if (!trigger) return null;

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
