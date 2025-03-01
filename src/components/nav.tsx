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
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const prevScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (currentScrollY) => {
    if (currentScrollY > prevScrollY.current + 5) {
      setIsScrollingDown(true);
    } else if (currentScrollY < prevScrollY.current - 5) {
      setIsScrollingDown(false);
    }
    prevScrollY.current = currentScrollY;
  });

  const buttonAnimation: Transition = {
    type: "spring",
    duration: shouldAnimate ? 0.2 : 0,
    bounce: 0.2
  };

  const blurContainerAnimation: Transition = {
    type: "spring",
    duration: shouldAnimate ? 0.5 : 0,
    bounce: 0,
    stiffness: 100,
    damping: 25
  };

  const contentAnimation: Transition = {
    type: "spring",
    duration: shouldAnimate ? 0.4 : 0,
    bounce: 0,
    stiffness: 120,
    damping: 20,
    custom: (isScrollingDown: boolean) => ({
      delay: isScrollingDown ? 0 : shouldAnimate ? 0.2 : 0
    })
  };

  return (
    <>
      <motion.div
        className="w-full pointer-events-none"
        animate={{
          height: isScrollingDown ? "12vh" : "30vh"
        }}
        transition={blurContainerAnimation}
        initial={false}
      />

      <motion.div
        animate={{
          y: isScrollingDown ? "-100%" : "0%"
        }}
        transition={blurContainerAnimation}
        className="fixed top-0 h-[12vh] left-0 w-full z-50
        drop-shadow backdrop-blur-sm bg-gradient-to-b from-background to-transparent"
      />

      <motion.div
        className="fixed top-0 left-0 px-6 py-4 w-full z-50"
        animate={{
          y: isScrollingDown ? "-100%" : "0%"
        }}
        transition={contentAnimation}
        custom={isScrollingDown}
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
