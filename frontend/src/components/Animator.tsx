import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Define the types for the animation types and props
type AnimationType =
  | "slideUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "rotateIn"; // You can extend this with more animations

interface AnimatedSectionProps {
  children: ReactNode;
  className: string;
  animationType: AnimationType;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animationType,
}) => {
  const [ref, inView] = useInView({
    threshold: 0.2, // Trigger animation when 20% of the element is visible
    triggerOnce: true, // Trigger animation once when the section comes into view
  });

  // Define animations for each type
  const animations = {
    slideUp: {
      initial: { y: 100, opacity: 0 },
      animate: inView ? { y: 0, opacity: 1 } : {},
      transition: { duration: 0.2 },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: inView ? { opacity: 1 } : {},
      transition: { duration: 1.5 },
    },
    slideLeft: {
      initial: { x: -100, opacity: 0 },
      animate: inView ? { x: 0, opacity: 1 } : {},
      transition: { duration: 1.5 },
    },
    slideRight: {
      initial: { x: 100, opacity: 0 },
      animate: inView ? { x: 0, opacity: 1 } : {},
      transition: { duration: 1.5 },
    },
    zoomIn: {
      initial: { scale: 0.8, opacity: 0 },
      animate: inView ? { scale: 1, opacity: 1 } : {},
      transition: { duration: 1.5 },
    },
    rotateIn: {
      initial: { opacity: 0, rotate: 45 },
      animate: inView ? { opacity: 1, rotate: 0 } : {},
      transition: { duration: 1.5 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={animations[animationType]?.initial}
      animate={animations[animationType]?.animate}
      transition={animations[animationType]?.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
