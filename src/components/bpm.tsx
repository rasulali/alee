"use client";
import { useDevicePreferences } from "@/hooks/useDevicePreferences";
import {
  useInView,
  useMotionValue,
  useMotionValueEvent,
  animate,
  motion,
} from "motion/react";
import { useRef, useEffect, useState, useMemo } from "react";

const BPM = () => {
  const bpmRef = useRef(null);
  const isBPMInView = useInView(bpmRef, { once: true });
  const { prefersReducedMotion, lowEndDevice } = useDevicePreferences();

  const shouldAnimate = useMemo(
    () => !(prefersReducedMotion || lowEndDevice),
    [prefersReducedMotion, lowEndDevice],
  );

  const [displayValue, setDisplayValue] = useState(() =>
    shouldAnimate ? 71 : 144,
  );
  const count = useMotionValue(shouldAnimate ? 71 : 144);

  useMotionValueEvent(count, "change", (latest) => {
    const rounded = Math.round(latest);
    if (rounded !== displayValue) {
      setDisplayValue(rounded);
    }
  });

  useEffect(() => {
    if (isBPMInView) {
      if (shouldAnimate) {
        const controls = animate(count, 144, {
          type: "spring",
          stiffness: 60,
          damping: 15,
          mass: 1,
          duration: 3,
          delay: 0.2,
        });
        return controls.stop;
      } else {
        count.set(144);
        setDisplayValue(144);
      }
    }
  }, [isBPMInView, count, shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate) {
      count.set(144);
      setDisplayValue(144);
    } else if (!isBPMInView) {
      count.set(71);
      setDisplayValue(71);
    }
  }, [shouldAnimate, count, isBPMInView]);

  return (
    <div ref={bpmRef} className="flex flex-col gap-y-5">
      <div className="w-full h-full grid grid-cols-2 gap-x-2 mx-auto">
        <motion.h1 className="text-6xl text-right">{displayValue}</motion.h1>
        <motion.h1 className="text-3xl font-bold">BPM</motion.h1>
      </div>
      <div className="flex gap-x-1.5">
        <h1 className="text-3xl first-letter:text-primary font-bold text-primary/50 leading-none inline-block">
          Bold.
        </h1>
        <h1 className="text-3xl first-letter:text-primary font-bold text-primary/50 leading-none inline-block">
          Precise.
        </h1>
        <h1 className="text-3xl first-letter:text-primary font-bold text-primary/50 leading-none inline-block">
          Mutable.
        </h1>
      </div>
    </div>
  );
};

export default BPM;
