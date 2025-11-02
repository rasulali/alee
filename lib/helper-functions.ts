import { Transition } from "motion/react";

const NORMAL_SPRING_DURATION = 0.5;
const QUICK_SPRING_DURATION = 0.15;
export const springs = (shouldAnimate: boolean) => {
  const normalSpring: Transition = {
    type: "spring",
    bounce: 0,
    stiffness: 160,
    damping: 25,
    duration: shouldAnimate ? NORMAL_SPRING_DURATION : 0,
  };

  const quickSpring: Transition = {
    type: "spring",
    bounce: 0,
    stiffness: 240,
    damping: 35,
    duration: shouldAnimate ? QUICK_SPRING_DURATION : 0,
  };

  return {
    normal: normalSpring,
    quick: quickSpring,
    content: {
      type: "spring" as const,
      bounce: 0,
      stiffness: 120,
      damping: 20,
      duration: shouldAnimate ? 0.4 : 0,
    },
    theme: {
      type: "spring" as const,
      bounce: 0.2,
      duration: shouldAnimate ? 0.2 : 0,
    },
  };
};
