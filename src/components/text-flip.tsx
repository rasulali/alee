import { motion, Transition } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const springConfig: Transition = {
  type: "spring",
  bounce: 0,
  stiffness: 240,
  damping: 35,
};

interface TextFlipProps {
  labels: string[];
  activeIndex: number;
  shouldAnimate: boolean;
  padToMax?: boolean;
  stagger?: number;
  delay?: number;
  hoverFlip?: boolean;
  animateOnMount?: boolean;
  className?: string;
}

const TextFlip = ({
  labels,
  activeIndex,
  shouldAnimate,
  stagger = 0.05,
  delay = 0,
  hoverFlip = false,
  animateOnMount = false,
  className,
}: TextFlipProps) => {
  const normalizedLabels = useMemo(() => {
    if (!labels || labels.length === 0) return ["", ""];
    if (labels.length === 1) return [labels[0], labels[0]];
    return labels.slice(0, 2);
  }, [labels]);

  const safeIndex = Math.min(
    Math.max(activeIndex, 0),
    normalizedLabels.length - 1,
  );

  const [isHovered, setIsHovered] = useState(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  const hoverIndex =
    normalizedLabels.length > 1 ? (safeIndex === 0 ? 1 : 0) : safeIndex;

  const displayIndex = hoverFlip && isHovered ? hoverIndex : safeIndex;
  const mountIndex =
    animateOnMount && !hasMountedRef.current
      ? displayIndex === 0
        ? 1
        : 0
      : displayIndex;

  const currentLabel = normalizedLabels[safeIndex];

  const longestLabel = useMemo(() => {
    return normalizedLabels.reduce(
      (longest, label) => (label.length > longest.length ? label : longest),
      "",
    );
  }, [normalizedLabels]);

  const containerClasses = cn(
    "relative inline-block overflow-hidden whitespace-nowrap leading-tight",
    className,
  );

  if (!shouldAnimate) {
    return (
      <div className={containerClasses}>
        <span className="invisible block whitespace-nowrap">
          {longestLabel}
          {"\u200A"}
        </span>
        <span className="absolute inset-0 block">
          {currentLabel.split("").map((character, index) => (
            <span key={index} className="inline-block">
              {character === " " ? "\u00A0" : character}
            </span>
          ))}
          {"\u200A"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      onPointerEnter={hoverFlip ? () => setIsHovered(true) : undefined}
      onPointerLeave={hoverFlip ? () => setIsHovered(false) : undefined}
    >
      <span className="invisible block whitespace-nowrap">
        {longestLabel}
        {"\u200A"}
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none opacity-0 absolute inset-0 flex flex-col"
      >
        {normalizedLabels.map((label, i) => (
          <span key={`ghost-${i}`}>{label}</span>
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="relative">
          {normalizedLabels.map((label, labelIndex) => {
            const offset = (labelIndex - displayIndex) * 100;

            return (
              <span
                key={`${label}-${labelIndex}`}
                className="absolute inset-0"
                aria-hidden={labelIndex !== displayIndex}
              >
                {label.split("").map((character, charIndex) => (
                  <motion.span
                    key={`${label}-${labelIndex}-${charIndex}`}
                    initial={
                      animateOnMount && !hasMountedRef.current
                        ? { y: `${(labelIndex - mountIndex) * 100}%` }
                        : false
                    }
                    animate={{ y: `${offset}%` }}
                    transition={{
                      ...springConfig,
                      delay: delay + stagger * charIndex,
                    }}
                    className="inline-block"
                  >
                    {character === " " ? "\u00A0" : character}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TextFlip;
