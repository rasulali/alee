"use client";
import Link from "next/link";
import Logo from "./logo";
import { motion, useReducedMotion, Transition, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [scrollDirection, setScrollDirection] = useState("up");
  const { scrollY } = useScroll();
  const scrollThreshold = 5;
  const [isNearTop, setIsNearTop] = useState(true);
  const viewportHeightInit = useRef(0);
  useEffect(() => {
    viewportHeightInit.current = window.innerHeight;
  }, []);
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

  const topThresholVh = 30;

  useMotionValueEvent(scrollY, "change", (current) => {
    const viewportHeightCurrent = typeof window !== "undefined" ? window.innerHeight : 0;
    const maxScrollY = document.documentElement.scrollHeight - viewportHeightCurrent;

    // Ignore state update if viewport height changed and we are at max scroll position
    // exp: its not user scroll but viewport resize due to browser behavior or window resize
    if (viewportHeightCurrent !== viewportHeightInit.current && current >= maxScrollY) return;

    const topThreshold = viewportHeightCurrent * (topThresholVh / 100);
    setIsNearTop(current <= topThreshold);

    const previous = scrollY.getPrevious() || 0;
    const diff = current - previous;

    // Ignore bounce scroll at max scroll position
    // exp : its not user scroll but viewport change due to browser behavior on mobile devices
    if (previous >= maxScrollY && current >= maxScrollY) return;

    if (Math.abs(diff) > scrollThreshold) {
      setScrollDirection(diff > 0 ? "down" : "up");
    }
  });

  const isNavVisible = isNearTop || scrollDirection === "up";

  const positionAnimation = useMemo(() => ({
    y: !isNavVisible ? "-100%" : "0%"
  }), [isNavVisible]);

  return (
    <>
      <motion.div
        animate={positionAnimation}
        transition={blurContainerAnimation}
        className="fixed top-0 h-[12dvh] left-0 w-full z-50
        drop-shadow backdrop-blur-sm bg-gradient-to-b from-background to-transparent"
      />
      <div
        className="h-[30dvh] pointer-events-none"
        aria-hidden="true"
        key="nav-spacer"
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
              <Logo className="h-4" />
            </Link>
            <div className="text-sm font-semibold leading-none flex flex-col">
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
