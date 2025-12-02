import { motion, Transition } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const SPRING_CONFIG: Transition = {
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
  const [isHovered, setIsHovered] = useState(false);

  const normalizedLabels =
    !labels || labels.length === 0
      ? ["", ""]
      : labels.length === 1
        ? [labels[0], labels[0]]
        : labels.slice(0, 2);

  const safeIndex = Math.min(
    Math.max(activeIndex, 0),
    normalizedLabels.length - 1,
  );

  const hoverIndex =
    normalizedLabels.length > 1 ? (safeIndex === 0 ? 1 : 0) : safeIndex;

  const displayIndex = hoverFlip && isHovered ? hoverIndex : safeIndex;
  const subscribeOnce = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};

    const frame = requestAnimationFrame(callback);
    return () => cancelAnimationFrame(frame);
  };
  const hasMounted = useSyncExternalStore(
    subscribeOnce,
    () => true,
    () => false,
  );
  const mountIndex =
    animateOnMount && !hasMounted ? (displayIndex === 0 ? 1 : 0) : displayIndex;

  const currentLabel = normalizedLabels[safeIndex];

  const longestLabel = normalizedLabels.reduce(
    (longest, label) => (label.length > longest.length ? label : longest),
    "",
  );

  const containerClasses = cn(
    "relative inline-block overflow-hidden whitespace-nowrap leading-tight",
    className,
  );

  const handlePointerEnter = () => {
    if (hoverFlip) setIsHovered(true);
  };

  const handlePointerLeave = () => {
    if (hoverFlip) setIsHovered(false);
  };

  if (!shouldAnimate) {
    const displayLabel =
      hoverFlip && isHovered ? normalizedLabels[hoverIndex] : currentLabel;

    return (
      <div
        className={containerClasses}
        onPointerEnter={hoverFlip ? handlePointerEnter : undefined}
        onPointerLeave={hoverFlip ? handlePointerLeave : undefined}
      >
        <span className="invisible block whitespace-nowrap">
          {longestLabel}
          {"\u200A"}
        </span>
        <span className="absolute inset-0 block text-center">
          {displayLabel.split("").map((character, index) => (
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
      onPointerEnter={hoverFlip ? handlePointerEnter : undefined}
      onPointerLeave={hoverFlip ? handlePointerLeave : undefined}
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

      <div className="absolute inset-0 text-center">
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
                      animateOnMount && !hasMounted
                        ? { y: `${(labelIndex - mountIndex) * 100}%` }
                        : false
                    }
                    animate={{ y: `${offset}%` }}
                    transition={{
                      ...SPRING_CONFIG,
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
