import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function FancyCursor() {
  const cursor = useRef(null);

  useEffect(() => {
    const el = cursor.current;
    if (!el) return;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    const delay = 0.15;

    // Smooth follow animation
    function animate() {
      posX += (mouseX - posX) * delay;
      posY += (mouseY - posY) * delay;

      gsap.set(el, {
        x: posX - el.offsetWidth / 2,
        y: posY - el.offsetHeight / 2,
      });

      requestAnimationFrame(animate);
    }
    animate();

    function handleMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    document.addEventListener("mousemove", handleMouseMove);

    // Elements that trigger the hover growth
    const hoverElements = document.querySelectorAll(
      "a, button, h1, h2, h3, h6, .magnet"
    );

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(cursor.current, {
          width: 80,
          height: 80,
          duration: 0.3,
          ease: "power3.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(cursor.current, {
          width: 24,
          height: 24,
          duration: 0.3,
          ease: "power3.out",
        });
      });
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", () => {});
        el.removeEventListener("mouseleave", () => {});
      });
    };
  }, []);

  return (
    <div
      ref={cursor}
      className="pointer-events-none fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-lime-400 z-[9999]"
      
    />
  );
}
