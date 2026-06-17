import { motion, useScroll, useSpring } from "motion/react";

interface ScrollProgressBarProps {
  accentColor: "violet" | "gold";
}

export default function ScrollProgressBar({ accentColor }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  
  // Create a spring animation to make the scroll movement look liquid-smooth
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const barBg = accentColor === "violet" ? "bg-purple-600" : "bg-[#C9A84C]";
  const barShadow = accentColor === "violet" 
    ? "shadow-[0_0_8px_#7C3AED]" 
    : "shadow-[0_0_8px_#C9A84C]";

  return (
    <motion.div
      id="scroll-progress-bar"
      className={`fixed top-0 left-0 right-0 h-[3px] ${barBg} ${barShadow} origin-left z-[100000]`}
      style={{ scaleX }}
    />
  );
}
