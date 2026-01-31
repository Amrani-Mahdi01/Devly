/**
 * GradientText Component
 * Animated gradient text effect
 */
export default function GradientText({ children, className = "" }) {
  return (
    <span
      className={`bg-gradient-to-r from-primary via-white to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] ${className}`}
    >
      {children}
    </span>
  );
}
