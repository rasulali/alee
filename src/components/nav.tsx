"use client";

import Link from "next/link";
import Logo from "./logo";
import {
  motion,
  Transition,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  Variants
} from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDevicePreferences } from "@/hooks/useDevicePreferences";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

type ScrollDirection = "up" | "down";

const SCROLL_THRESHOLD = 5;
const TOP_THRESHOLD_VH = 30;
const DRAWER_DELAY = 0.2;
const ITEM_DELAY = 0.05;

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Writings", href: "/writings" },
  { name: "About", href: "/about" },
];

const Nav = () => {
  const { prefersReducedMotion, lowEndDevice } = useDevicePreferences();
  const { resolvedTheme: theme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  const [scrollDir, setScrollDir] = useState<ScrollDirection>("up");
  const [nearTop, setNearTop] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const viewport = useRef({ h: 0, w: 0 });

  const pathname = usePathname()

  const shouldAnimate = useMemo(() =>
    !(prefersReducedMotion || lowEndDevice),
    [prefersReducedMotion, lowEndDevice]
  );

  const navVisible = useMemo(() =>
    showDrawer || nearTop || scrollDir === "up",
    [showDrawer, nearTop, scrollDir]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      viewport.current = {
        h: window.innerHeight,
        w: window.innerWidth
      };
    }
  }, []);

  const springs = useMemo(() => {
    const normalSpring: Transition = {
      type: "spring",
      bounce: 0,
      stiffness: 100,
      damping: 25,
      duration: shouldAnimate ? 0.5 : 0
    };

    const quickSpring: Transition = {
      type: "spring",
      bounce: 0,
      stiffness: 200,
      damping: 35,
      duration: shouldAnimate ? 0.15 : 0
    };

    return {
      normal: normalSpring,
      quick: quickSpring,
      content: {
        type: "spring" as const,
        bounce: 0,
        stiffness: 120,
        damping: 20,
        duration: shouldAnimate ? 0.4 : 0
      },
      theme: {
        type: "spring" as const,
        bounce: 0.2,
        duration: shouldAnimate ? 0.2 : 0
      }
    };
  }, [shouldAnimate]);

  useMotionValueEvent(scrollY, "change", useCallback((current: number) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 0;
    const maxScroll = document.documentElement.scrollHeight - vh;
    const prev = scrollY.getPrevious() || 0;

    if (vh !== viewport.current.h && current >= maxScroll) return;
    if (prev >= maxScroll && current >= maxScroll) return;

    const topThreshold = vh * (TOP_THRESHOLD_VH / 100);
    setNearTop(current <= topThreshold);

    const diff = current - prev;
    if (Math.abs(diff) > SCROLL_THRESHOLD) {
      setScrollDir(diff > 0 ? "down" : "up");
    }
  }, [scrollY]));

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleDrawer = useCallback(() => {
    setShowDrawer(prev => !prev);
  }, []);

  const drawerVariants: Variants = {
    closed: {
      height: "12dvh",
      y: !navVisible ? "-100%" : "0%",
      transition: {
        ...springs.quick,
      }
    },
    open: {
      height: "100dvh",
      y: "0%",
      transition: {
        ...springs.normal,
        delayChildren: DRAWER_DELAY,
        staggerChildren: ITEM_DELAY
      }
    }
  };

  const itemVariants: Variants = {
    closed: {
      x: -200,
      opacity: 0,
      transition: springs.quick
    },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        ...springs.normal,
        delay: shouldAnimate ? ITEM_DELAY * i : 0
      }
    })
  };

  const textVariants: Variants = {
    hidden: {
      y: "100%",
      transition: springs.quick
    },
    visible: (i: number) => ({
      y: "0%",
      transition: {
        ...springs.quick,
        delay: shouldAnimate ? DRAWER_DELAY + (i / 10) + (ITEM_DELAY * navItems.length) : 0
      }

    })
  };

  const yPos = useMemo(() => ({
    y: !navVisible ? "-100%" : "0%"
  }), [navVisible]);

  const ThemeIcon = ({ dark }: { dark: boolean }) => {
    const props = {
      viewBox: "0 0 75 75",
      width: "100%",
      height: "100%",
      className: "fill-primary",
      xmlns: "http://www.w3.org/2000/svg"
    };

    return dark ? (
      <svg {...props}>
        <path
          d="M37.5 75C58.2113 75 75 58.2113 75 37.5C75 35.7637 72.3975 35.475 71.5013 36.9638C69.5897 40.13 66.9826 42.8198 63.8776 44.8293C60.7725 46.8387 57.2509 48.1153 53.5794 48.5621C49.9079 49.009 46.1829 48.6145 42.6864 47.4085C39.19 46.2026 36.0138 44.2167 33.3986 41.6014C30.7833 38.9862 28.7974 35.81 27.5915 32.3136C26.3855 28.8171 25.991 25.0921 26.4379 21.4206C26.8847 17.7492 28.1613 14.2275 30.1707 11.1224C32.1802 8.01739 34.87 5.41033 38.0362 3.49875C39.525 2.59875 39.2363 0 37.5 0C16.7888 0 0 16.7888 0 37.5C0 58.2113 16.7888 75 37.5 75Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg {...props}>
        <path id="center"
          d="M58.4303 37.5001C58.4303 43.0511 56.2251 48.3748 52.3 52.3C48.3748 56.2251 43.0511 58.4303 37.5001 58.4303C31.949 58.4303 26.6253 56.2251 22.7001 52.3C18.775 48.3748 16.5698 43.0511 16.5698 37.5001C16.5698 31.949 18.775 26.6253 22.7001 22.7001C26.6253 18.775 31.949 16.5698 37.5001 16.5698C43.0511 16.5698 48.3748 18.775 52.3 22.7001C56.2251 26.6253 58.4303 31.949 58.4303 37.5001Z"
          fill="currentColor" />
        <path id="beams" fillRule="evenodd" clipRule="evenodd"
          d="M37.5 0C38.1939 0 38.8593 0.275643 39.35 0.76629C39.8406 1.25694 40.1163 1.9224 40.1163 2.61628V6.10465C40.1163 6.79853 39.8406 7.46399 39.35 7.95464C38.8593 8.44529 38.1939 8.72093 37.5 8.72093C36.8061 8.72093 36.1407 8.44529 35.65 7.95464C35.1594 7.46399 34.8837 6.79853 34.8837 6.10465V2.61628C34.8837 1.9224 35.1594 1.25694 35.65 0.76629C36.1407 0.275643 36.8061 0 37.5 0ZM10.9849 10.9849C11.4754 10.4949 12.1404 10.2197 12.8337 10.2197C13.527 10.2197 14.192 10.4949 14.6826 10.9849L16.0535 12.3523C16.5303 12.8455 16.7943 13.5063 16.7887 14.1923C16.7831 14.8783 16.5082 15.5346 16.0234 16.0199C15.5385 16.5052 14.8824 16.7807 14.1965 16.787C13.5105 16.7932 12.8495 16.5298 12.3558 16.0535L10.9849 14.6826C10.4949 14.192 10.2197 13.527 10.2197 12.8337C10.2197 12.1404 10.4949 11.4754 10.9849 10.9849ZM64.0151 10.9849C64.5051 11.4754 64.7803 12.1404 64.7803 12.8337C64.7803 13.527 64.5051 14.192 64.0151 14.6826L62.6442 16.0535C62.1482 16.5156 61.4923 16.7672 60.8145 16.7553C60.1367 16.7433 59.49 16.4687 59.0106 15.9894C58.5313 15.51 58.2567 14.8633 58.2447 14.1855C58.2328 13.5077 58.4844 12.8518 58.9465 12.3558L60.3174 10.9849C60.808 10.4949 61.473 10.2197 62.1663 10.2197C62.8596 10.2197 63.5246 10.4949 64.0151 10.9849ZM0 37.5C0 36.8061 0.275643 36.1407 0.76629 35.65C1.25694 35.1594 1.9224 34.8837 2.61628 34.8837H6.10465C6.79853 34.8837 7.46399 35.1594 7.95464 35.65C8.44529 36.1407 8.72093 36.8061 8.72093 37.5C8.72093 38.1939 8.44529 38.8593 7.95464 39.35C7.46399 39.8406 6.79853 40.1163 6.10465 40.1163H2.61628C1.9224 40.1163 1.25694 39.8406 0.76629 39.35C0.275643 38.8593 0 38.1939 0 37.5ZM66.2791 37.5C66.2791 36.8061 66.5547 36.1407 67.0454 35.65C67.536 35.1594 68.2015 34.8837 68.8953 34.8837H72.3837C73.0776 34.8837 73.7431 35.1594 74.2337 35.65C74.7244 36.1407 75 36.8061 75 37.5C75 38.1939 74.7244 38.8593 74.2337 39.35C73.7431 39.8406 73.0776 40.1163 72.3837 40.1163H68.8953C68.2015 40.1163 67.536 39.8406 67.0454 39.35C66.5547 38.8593 66.2791 38.1939 66.2791 37.5ZM58.9465 58.9465C59.4371 58.4566 60.102 58.1814 60.7953 58.1814C61.4887 58.1814 62.1536 58.4566 62.6442 58.9465L64.0151 60.3174C64.2722 60.557 64.4783 60.8458 64.6213 61.1667C64.7643 61.4877 64.8412 61.8341 64.8474 62.1854C64.8536 62.5367 64.789 62.8856 64.6574 63.2114C64.5258 63.5372 64.33 63.8331 64.0815 64.0815C63.8331 64.33 63.5372 64.5258 63.2114 64.6574C62.8856 64.789 62.5367 64.8536 62.1854 64.8474C61.8341 64.8412 61.4877 64.7643 61.1667 64.6213C60.8458 64.4783 60.557 64.2722 60.3174 64.0151L58.9465 62.6442C58.4566 62.1536 58.1814 61.4887 58.1814 60.7953C58.1814 60.102 58.4566 59.4371 58.9465 58.9465ZM16.0535 58.9465C16.5434 59.4371 16.8186 60.102 16.8186 60.7953C16.8186 61.4887 16.5434 62.1536 16.0535 62.6442L14.6826 64.0151C14.443 64.2722 14.1542 64.4783 13.8333 64.6213C13.5123 64.7643 13.1659 64.8412 12.8146 64.8474C12.4633 64.8536 12.1144 64.789 11.7886 64.6574C11.4628 64.5258 11.1669 64.33 10.9185 64.0815C10.67 63.8331 10.4742 63.5372 10.3426 63.2114C10.211 62.8856 10.1464 62.5367 10.1526 62.1854C10.1588 61.8341 10.2357 61.4877 10.3787 61.1667C10.5217 60.8458 10.7278 60.557 10.9849 60.3174L12.3523 58.9465C12.5953 58.7034 12.8838 58.5105 13.2013 58.3789C13.5188 58.2474 13.8592 58.1796 14.2029 58.1796C14.5466 58.1796 14.887 58.2474 15.2045 58.3789C15.522 58.5105 15.8105 58.7034 16.0535 58.9465ZM37.5 66.2791C38.1939 66.2791 38.8593 66.5547 39.35 67.0454C39.8406 67.536 40.1163 68.2015 40.1163 68.8953V72.3837C40.1163 73.0776 39.8406 73.7431 39.35 74.2337C38.8593 74.7244 38.1939 75 37.5 75C36.8061 75 36.1407 74.7244 35.65 74.2337C35.1594 73.7431 34.8837 73.0776 34.8837 72.3837V68.8953C34.8837 68.2015 35.1594 67.536 35.65 67.0454C36.1407 66.5547 36.8061 66.2791 37.5 66.2791Z"
          fill="currentColor" />
      </svg>
    );
  };


  return (
    // -drawer opens slow
    // -bottom text animates slow and stutters
    // -nav items shift as browser viewport change its size
    <>
      <motion.div
        variants={drawerVariants}
        initial="closed"
        animate={showDrawer ? "open" : "closed"}
        className="fixed inset-0 z-50 overflow-hidden
    drop-shadow-sm backdrop-blur-sm bg-gradient-to-b from-background to-transparent"
      >
        <div className="mt-[calc(18dvh)] w-full h-[calc(100%-18dvh)] flex flex-col">
          <nav className="px-6 flex flex-col">
            {navItems.map((item, i) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                custom={i}
              >
                <Link
                  className={cn(item.href === pathname ? "text-5xl" : "text-4xl opacity-50",
                    "uppercase font-semibold leading-none")}
                  href={item.href}
                  onClick={() => setShowDrawer(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="w-full h-full flex flex-col mt-[6vh]">
            <div className="flex flex-col flex-1 px-6">
              <div className="overflow-hidden">
                <motion.h1
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  variants={textVariants}
                  custom={0}
                  className="uppercase text-sm font-medium text-primary/50 block leading-none"
                >
                  Have an idea?
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.a
                  href="mailto:contact@alee.az"
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  custom={1}
                  variants={textVariants}
                  className="font-playwrite text-3xl font-light block py-0.5"
                >
                  contact@alee.az
                </motion.a>
              </div>
              <div className="mt-[6vh] overflow-hidden w-full flex gap-x-4">
                <motion.a
                  href=""
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  custom={2}
                  variants={textVariants}
                  className="block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    className="w-8"
                  >
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor">
                      <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"></path>
                      <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01"></path>
                    </g>
                  </svg>
                </motion.a>
                <motion.a
                  href=""
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  custom={2}
                  variants={textVariants}
                  className="block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    className="w-8"
                  >
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3 21l7.548-7.548M21 3l-7.548 7.548m0 0L8 3H3l7.548 10.452m2.904-2.904L21 21h-5l-5.452-7.548" color="currentColor"></path>
                  </svg>
                </motion.a>
                <motion.a
                  href=""
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  custom={2}
                  variants={textVariants}
                  className="block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    className="w-8"
                  >
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 9.5H4c-.943 0-1.414 0-1.707.293S2 10.557 2 11.5V20c0 .943 0 1.414.293 1.707S3.057 22 4 22h.5c.943 0 1.414 0 1.707-.293S6.5 20.943 6.5 20v-8.5c0-.943 0-1.414-.293-1.707S5.443 9.5 4.5 9.5m2-5.25a2.25 2.25 0 1 1-4.5 0a2.25 2.25 0 0 1 4.5 0m5.826 5.25H11.5c-.943 0-1.414 0-1.707.293S9.5 10.557 9.5 11.5V20c0 .943 0 1.414.293 1.707S10.557 22 11.5 22h.5c.943 0 1.414 0 1.707-.293S14 20.943 14 20v-3.5c0-1.657.528-3 2.088-3c.78 0 1.412.672 1.412 1.5v4.5c0 .943 0 1.414.293 1.707s.764.293 1.707.293h.499c.942 0 1.414 0 1.707-.293c.292-.293.293-.764.293-1.706L22 14c0-2.486-2.364-4.5-4.703-4.5c-1.332 0-2.52.652-3.297 1.673c0-.63 0-.945-.137-1.179a1 1 0 0 0-.358-.358c-.234-.137-.549-.137-1.179-.137" color="currentColor"></path>
                  </svg>
                </motion.a>
                <motion.a
                  href=""
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  custom={2}
                  variants={textVariants}
                  className="block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    className="w-8"
                  >
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.379.28 2.693.784 3.888c.279.66.418.99.436 1.24c.017.25-.057.524-.204 1.073L2 22l3.799-1.016c.549-.147.823-.22 1.073-.204c.25.018.58.157 1.24.436A10 10 0 0 0 12 22"></path>
                      <path d="M12.882 12C14.052 12 15 13.007 15 14.25s-.948 2.25-2.118 2.25h-2.47c-.666 0-.998 0-1.205-.203S9 15.768 9 15.115V12m3.882 0C14.052 12 15 10.993 15 9.75s-.948-2.25-2.118-2.25h-2.47c-.666 0-.998 0-1.205.203S9 8.232 9 8.885V12m3.882 0H9"></path>
                    </g>
                  </svg>
                </motion.a>
              </div>
            </div>
            <div className="flex flex-col w-full p-6 leading-none">
              <div className="overflow-hidden">
                <motion.h1
                  initial="hidden"
                  animate={showDrawer ? "visible" : "hidden"}
                  custom={4}
                  variants={textVariants}
                  className="uppercase font-light block">
                  created
                </motion.h1>
              </div>
              <div className="flex flex-col">
                <div className="overflow-hidden">
                  <motion.h1
                    initial="hidden"
                    animate={showDrawer ? "visible" : "hidden"}
                    custom={5}
                    variants={textVariants}
                    className="block py-0.5"
                  >
                    Design & Development by Rasul Ali
                  </motion.h1>
                </div>
                <div className="overflow-hidden">
                  <motion.h1
                    initial="hidden"
                    animate={showDrawer ? "visible" : "hidden"}
                    custom={6}
                    variants={textVariants}
                    className="block py-0.5"
                  >
                    © 2025 All Rights Reserved
                  </motion.h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="h-[30dvh] pointer-events-none" aria-hidden="true" />

      <motion.header
        className="fixed top-0 left-0 px-6 py-4 w-full z-50"
        animate={yPos}
        transition={springs.content}
        initial={false}
      >
        <div className="w-full grid grid-cols-6 gap-x-2">
          <div className="flex flex-col h-full gap-y-2 col-span-4 min-w-0">
            <Link href="/">
              <Logo className="h-4 fill-black" />
            </Link>
            <div className="text-xs uppercase font-semibold leading-none flex flex-col">
              <h1>Artisan Apps &</h1>
              <h1>Websites</h1>
            </div>
          </div>

          <div className="w-full h-full flex flex-col gap-y-2 justify-between col-span-2">
            <motion.button
              onClick={toggleTheme}
              className="w-full h-fit z-10"
              aria-label="Toggle Dark Mode"
            >
              <div className="flex w-full items-center h-fit">
                <motion.div
                  layout
                  transition={springs.theme}
                  className={cn(
                    theme === 'dark' ? "w-4" : "flex-1",
                    "min-w-4 h-1 shrink-0 bg-primary rounded-full"
                  )}
                />

                <div className="flex shrink-0 mx-1 items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={springs.theme}
                      className="flex items-center justify-center w-6 h-6"
                    >
                      <ThemeIcon dark={theme === "dark"} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.div
                  layout
                  transition={springs.theme}
                  className={cn(
                    theme === 'dark' ? "flex-1" : "w-4",
                    "min-w-4 shrink-0 h-1 bg-primary rounded-full"
                  )}
                />
              </div>
            </motion.button>

            <motion.button
              onClick={toggleDrawer}
              className="w-fit h-fit self-end"
              aria-label="Toggle navigation menu"
              aria-expanded={showDrawer}
            >
              <h1 className="text-xs uppercase font-semibold leading-none">
                {showDrawer ? 'less.' : 'more.'}
              </h1>
            </motion.button>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Nav;
