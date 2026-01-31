import { useTransition } from "./TransitionContext";
import { smootherInstance } from "./ScrollSmoother"; // 👈 import it

export default function AnimatedLink({ to, className, children, onClick }) {
  const { startTransition } = useTransition();

  const handleClick = (e) => {
    // If a custom onClick is provided, call it and let it handle everything
    if (onClick) {
      onClick(e);
      // If the default wasn't prevented by the custom handler, don't run transition
      if (e.defaultPrevented) {
        return;
      }
    }

    // Default behavior: prevent navigation and run transition
    e.preventDefault();

    // 🔥 Scroll logic depending on device
    if (smootherInstance) {
      // Desktop (GSAP ScrollSmoother)
      smootherInstance.scrollTo(0, true); // instant jump to top
    } else {
      // Mobile (normal scroll)
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    startTransition(to);
  };

  return (
    <div href={to} onClick={handleClick} className={className}>
      {children}
    </div>
  );
}