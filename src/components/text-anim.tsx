import { cn } from "@/lib/utils";
import { motion, Transition, useInView } from "framer-motion";
import { useRef } from "react";


const BtnAnim = ({ children, className, transition, stagger, onClick }:
  {
    children: string, className?: string, transition?: Transition,
    stagger: number, onClick: () => void
  }) => {
  const textRef = useRef<HTMLButtonElement>(null);
  const textInView = useInView(textRef, { once: true });
  return (
    <motion.button
      ref={textRef}
      initial="initial"
      onClick={onClick}
      animate={textInView ? "animate" : "initial"}
      className={cn(
        "relative overflow-hidden whitespace-nowrap",
        className
      )}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{
              initial: {
                y: 0,
              },
              animate: {
                y: "-100%",
              },
            }}
            transition={
              { ...transition, delay: stagger * i }}
            className="inline-block"
            key={`${children}-${i}`}
          >
            {l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            initial="initial"
            animate={textInView ? "animate" : "initial"}
            variants={{
              initial: {
                y: "100%",
              },
              animate: {
                y: 0,
              },
            }}
            transition={
              { ...transition, delay: stagger * i }
            }
            className="inline-block"
            key={`${children}-${i}`}
          >
            {l}
          </motion.span>
        ))}
      </div>
    </motion.button>
  );
};
export default BtnAnim;
