import { useNavigate } from "react-router-dom";
import { useTransition } from "./TransitionContext";
import PageTransition from "./PageTransition";
import { smootherInstance } from "./ScrollSmoother"; // 👈 important

export default function AnimatedRoutes({ children }) {
  const { transitioning, nextPath, endTransition } = useTransition();
  const navigate = useNavigate();

  const handleReveal = () => {
    if (nextPath) {
      navigate(nextPath);

      // 🔥 FORCE SCROLL TOP WHEN NEW PAGE LOADS (while covered)
      requestAnimationFrame(() => {
        if (smootherInstance) {
          smootherInstance.scrollTo(0, true); // GSAP scroll
        } else {
          window.scrollTo(0, 0); // Mobile native scroll
        }
      });
    }
  };

  const handleComplete = () => {
    endTransition();
  };

  return (
    <>
      {transitioning && (
        <PageTransition
          onReveal={handleReveal}
          onComplete={handleComplete}
        />
      )}
      {children}
    </>
  );
}
