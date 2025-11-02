import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { springs } from "@/lib/helper-functions";

const BtnAnim = ({
  showDrawer,
  shouldAnimate,
  onClick,
}: {
  showDrawer: boolean;
  shouldAnimate: boolean;
  onClick: () => void;
}) => {
  const textRef = useRef<HTMLButtonElement>(null);
  const tButtons = useTranslations("navbar.buttons");
  const text = showDrawer ? tButtons("less") : tButtons("more");

  if (!shouldAnimate) {
    return (
      <button
        ref={textRef}
        onClick={onClick}
        className="relative overflow-hidden whitespace-nowrap leading-none cursor-pointer text-xs font-semibold"
      >
        {text}
      </button>
    );
  }

  const textInView = useInView(textRef, { once: true });

  return (
    <motion.button
      ref={textRef}
      onClick={onClick}
      className="relative overflow-hidden whitespace-nowrap leading-none cursor-pointer text-xs font-semibold"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={text}
          initial="initial"
          animate={textInView ? "animate" : "initial"}
          exit="exit"
          className="relative"
        >
          <div className="relative">
            {text.split("").map((l, i) => (
              <motion.span
                variants={{
                  initial: { y: "100%" },
                  animate: { y: 0 },
                  exit: { y: "-100%" },
                }}
                transition={{
                  ...springs(shouldAnimate).quick,
                  delay: 0.025 * i,
                }}
                className="inline-block"
                key={`${text}-${i}`}
              >
                {l === " " ? "\u00A0" : l}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default BtnAnim;
