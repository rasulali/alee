"use client";
import Link from "next/link";
import Logo from "./logo";
import { motion, useReducedMotion, Transition, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useMemo, useRef, useState } from "react";

const Nav = () => {
  const { theme, setTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const lowEndDevice = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      ("deviceMemory" in navigator && (navigator as any).deviceMemory < 4) ||
      ("hardwareConcurrency" in navigator && navigator.hardwareConcurrency < 4)
    );
  }, []);
  const shouldAnimate = !(prefersReducedMotion || lowEndDevice);

  // State for nav visibility
  const [isNavVisible, setIsNavVisible] = useState(true);

  const prevScrollY = useRef(0);
  const isAtBottom = useRef(false);
  const documentHeight = useRef(0);
  const { scrollY } = useScroll();

  // Create the transition objects once, not on every render
  const buttonAnimation = useMemo<Transition>(() => ({
    type: "spring",
    duration: shouldAnimate ? 0.2 : 0,
    bounce: 0.2
  }), [shouldAnimate]);

  const blurContainerAnimation = useMemo<Transition>(() => ({
    type: "spring",
    duration: shouldAnimate ? 0.5 : 0,
    bounce: 0,
    stiffness: 100,
    damping: 25
  }), [shouldAnimate]);

  const contentAnimation = useMemo<Transition>(() => ({
    type: "spring",
    duration: shouldAnimate ? 0.4 : 0,
    bounce: 0,
    stiffness: 120,
    damping: 20
  }), [shouldAnimate]);

  // Define the threshold for showing navbar when close to top (30vh)
  const topThresholdVh = 30;

  // Optimized scroll handler using useMotionValueEvent
  useMotionValueEvent(scrollY, 'change', (currentScrollY) => {
    // Get viewport height for vh calculations
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    // Calculate 30vh in pixels
    const topThreshold = viewportHeight * (topThresholdVh / 100);

    // Update document height only when needed to avoid layout thrashing
    if (documentHeight.current === 0 && typeof window !== "undefined") {
      documentHeight.current = document.documentElement.scrollHeight;
    }

    // Check if at bottom - do this computation only when needed
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const scrollPosition = currentScrollY + windowHeight;
    const atBottom = documentHeight.current - scrollPosition < 5;

    // Ignore scroll events when at the bottom (prevents iOS Safari bounce issue)
    if (atBottom) {
      if (!isAtBottom.current) {
        isAtBottom.current = true;
      }
      return;
    } else if (isAtBottom.current) {
      isAtBottom.current = false;
    }

    // Show navbar when within 30vh of top
    if (currentScrollY <= topThreshold) {
      if (!isNavVisible) {
        setIsNavVisible(true);
      }
    } else {
      // Standard scroll behavior when not near top
      const isScrollingDown = currentScrollY > prevScrollY.current + 5;
      const isScrollingUp = currentScrollY < prevScrollY.current - 5;

      if (isScrollingDown && isNavVisible) {
        setIsNavVisible(false);
      } else if (isScrollingUp && !isNavVisible) {
        setIsNavVisible(true);
      }
    }

    prevScrollY.current = currentScrollY;
  });

  // Memoize the animation values to prevent recalculation on each render
  const heightAnimation = useMemo(() => ({
    height: !isNavVisible ? "12vh" : "30vh"
  }), [isNavVisible]);

  const positionAnimation = useMemo(() => ({
    y: !isNavVisible ? "-100%" : "0%"
  }), [isNavVisible]);

  return (
    <>
      <motion.div
        className="w-full pointer-events-none"
        animate={heightAnimation}
        transition={blurContainerAnimation}
        initial={false}
      />
      <motion.div
        animate={positionAnimation}
        transition={blurContainerAnimation}
        className="fixed top-0 h-[12vh] left-0 w-full z-50
        drop-shadow backdrop-blur-sm bg-gradient-to-b from-background to-transparent"
      />
      <motion.div
        className="fixed top-0 left-0 px-6 py-4 w-full z-50"
        animate={positionAnimation}
        transition={contentAnimation}
        initial={false}
      >
        <div className="w-full grid grid-cols-6 gap-x-2 self-start">
          <div className="flex flex-col h-full gap-y-2 col-span-4">
            <Link href="/">
              <Logo className="text-primary h-4" />
            </Link>
            <div className="text-sm text-primary font-semibold leading-none flex flex-col">
              <h1>Artisian Apps &</h1>
              <h1>Websites</h1>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "w-8 h-6 flex min-w-[50px] rounded-[2rem] border-2 border-primary p-1 col-start-6 justify-self-end z-10",
              { "justify-end": theme === "light", "justify-start": theme === "dark" }
            )}
          >
            <motion.div
              layout
              transition={buttonAnimation}
              className="h-full bg-primary rounded-full aspect-square"
            />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Nav;
