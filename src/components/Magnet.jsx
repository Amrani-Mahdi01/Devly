import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export default function Magnet({ children, strength = 0.4 }) {
  const el = useRef(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    // Skip magnet on mobile
    if (window.innerWidth < 1024) return;

    function handleMove(e) {
      const rect = node.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(node, {
        x: x * strength,
        y: y * strength,
        duration: 0.3,
        ease: "power3.out",
      });
    }

    function handleLeave() {
      gsap.to(node, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    }

    node.addEventListener("mousemove", handleMove);
    node.addEventListener("mouseleave", handleLeave);

    return () => {
      node.removeEventListener("mousemove", handleMove);
      node.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return (
    <div ref={el} className="inline-block will-change-transform">
      {children}
    </div>
  );
}
