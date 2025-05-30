"use client";
import Link from "next/link";
import Logo from "./logo";
import { motion, Transition, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDevicePreferences } from "@/hooks/useDevicePreferences";

const Nav = () => {
  const { prefersReducedMotion, lowEndDevice } = useDevicePreferences();
  const { resolvedTheme: theme, setTheme } = useTheme();
  const shouldAnimate = !(prefersReducedMotion || lowEndDevice);
  const [scrollDirection, setScrollDirection] = useState("up");
  const { scrollY } = useScroll();
  const scrollThreshold = 5;
  const [isNearTop, setIsNearTop] = useState(true);
  const viewportHeightInit = useRef(0);
  useEffect(() => {
    viewportHeightInit.current = window.innerHeight;
  }, []);

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
    if (viewportHeightCurrent !== viewportHeightInit.current && current >= maxScrollY) return;

    const topThreshold = viewportHeightCurrent * (topThresholVh / 100);
    setIsNearTop(current <= topThreshold);

    const previous = scrollY.getPrevious() || 0;
    const diff = current - previous;

    // Ignore bounce scroll at max scroll position
    if (previous >= maxScrollY && current >= maxScrollY) return;

    if (Math.abs(diff) > scrollThreshold) {
      setScrollDirection(diff > 0 ? "down" : "up");
    }
  });

  const isNavVisible = isNearTop || scrollDirection === "up";

  const positionAnimation = useMemo(() => ({
    y: !isNavVisible ? "-100%" : "0%"
  }), [isNavVisible]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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
          <div className="flex flex-col h-full gap-y-2 col-span-4 min-w-0">
            <Link href="/">
              <Logo className="h-4 fill-black" />
            </Link>
            <div className="text-sm font-semibold leading-none flex flex-col">
              <h1>Artisian Apps &</h1>
              <h1>Websites</h1>
            </div>
          </div>
          <motion.button
            id="button"
            onClick={() => toggleTheme()}
            className="w-full h-8 self-start flex col-span-2 justify-self-end z-10 min-w-0"
          >
            <motion.div
              className="flex w-full items-center"
            >
              <motion.div
                layout
                transition={{
                  type: "spring",
                  duration: shouldAnimate ? 0.4 : 0,
                  bounce: 0.2,
                }}
                className={cn(theme === 'dark' ? "w-4" : "flex-1", "h-1 shrink-0 bg-primary rounded-full")}
              />
              <motion.div
                layout
                transition={{
                  type: "spring",
                  duration: shouldAnimate ? 0.4 : 0,
                  bounce: 0.2,
                }}
                className="flex shrink-0 mx-1 items-center justify-center"
              >
                <AnimatePresence
                  mode="wait" initial={false}>
                  <motion.div
                    key={theme}
                    initial={{ rotate: 90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: shouldAnimate ? 0.2 : 0 }}
                    className="flex items-center justify-center w-6 h-6"
                  >
                    {theme === "dark" ? (
                      <svg
                        viewBox="0 0 75 75"
                        width="100%"
                        height="100%"
                        className="fill-primary"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M37.5 75C58.2113 75 75 58.2113 75 37.5C75 35.7637 72.3975 35.475 71.5013 36.9638C69.5897 40.13 66.9826 42.8198 63.8776 44.8293C60.7725 46.8387 57.2509 48.1153 53.5794 48.5621C49.9079 49.009 46.1829 48.6145 42.6864 47.4085C39.19 46.2026 36.0138 44.2167 33.3986 41.6014C30.7833 38.9862 28.7974 35.81 27.5915 32.3136C26.3855 28.8171 25.991 25.0921 26.4379 21.4206C26.8847 17.7492 28.1613 14.2275 30.1707 11.1224C32.1802 8.01739 34.87 5.41033 38.0362 3.49875C39.525 2.59875 39.2363 0 37.5 0C16.7888 0 0 16.7888 0 37.5C0 58.2113 16.7888 75 37.5 75Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 75 75"
                        width="100%"
                        height="100%"
                        className="fill-primary"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path id="center"
                          d="M58.4303 37.5001C58.4303 43.0511 56.2251 48.3748 52.3 52.3C48.3748 56.2251 43.0511 58.4303 37.5001 58.4303C31.949 58.4303 26.6253 56.2251 22.7001 52.3C18.775 48.3748 16.5698 43.0511 16.5698 37.5001C16.5698 31.949 18.775 26.6253 22.7001 22.7001C26.6253 18.775 31.949 16.5698 37.5001 16.5698C43.0511 16.5698 48.3748 18.775 52.3 22.7001C56.2251 26.6253 58.4303 31.949 58.4303 37.5001Z"
                          fill="currentColor" />
                        <path id="beams" fillRule="evenodd" clipRule="evenodd"
                          d="M37.5 0C38.1939 0 38.8593 0.275643 39.35 0.76629C39.8406 1.25694 40.1163 1.9224 40.1163 2.61628V6.10465C40.1163 6.79853 39.8406 7.46399 39.35 7.95464C38.8593 8.44529 38.1939 8.72093 37.5 8.72093C36.8061 8.72093 36.1407 8.44529 35.65 7.95464C35.1594 7.46399 34.8837 6.79853 34.8837 6.10465V2.61628C34.8837 1.9224 35.1594 1.25694 35.65 0.76629C36.1407 0.275643 36.8061 0 37.5 0ZM10.9849 10.9849C11.4754 10.4949 12.1404 10.2197 12.8337 10.2197C13.527 10.2197 14.192 10.4949 14.6826 10.9849L16.0535 12.3523C16.5303 12.8455 16.7943 13.5063 16.7887 14.1923C16.7831 14.8783 16.5082 15.5346 16.0234 16.0199C15.5385 16.5052 14.8824 16.7807 14.1965 16.787C13.5105 16.7932 12.8495 16.5298 12.3558 16.0535L10.9849 14.6826C10.4949 14.192 10.2197 13.527 10.2197 12.8337C10.2197 12.1404 10.4949 11.4754 10.9849 10.9849ZM64.0151 10.9849C64.5051 11.4754 64.7803 12.1404 64.7803 12.8337C64.7803 13.527 64.5051 14.192 64.0151 14.6826L62.6442 16.0535C62.1482 16.5156 61.4923 16.7672 60.8145 16.7553C60.1367 16.7433 59.49 16.4687 59.0106 15.9894C58.5313 15.51 58.2567 14.8633 58.2447 14.1855C58.2328 13.5077 58.4844 12.8518 58.9465 12.3558L60.3174 10.9849C60.808 10.4949 61.473 10.2197 62.1663 10.2197C62.8596 10.2197 63.5246 10.4949 64.0151 10.9849ZM0 37.5C0 36.8061 0.275643 36.1407 0.76629 35.65C1.25694 35.1594 1.9224 34.8837 2.61628 34.8837H6.10465C6.79853 34.8837 7.46399 35.1594 7.95464 35.65C8.44529 36.1407 8.72093 36.8061 8.72093 37.5C8.72093 38.1939 8.44529 38.8593 7.95464 39.35C7.46399 39.8406 6.79853 40.1163 6.10465 40.1163H2.61628C1.9224 40.1163 1.25694 39.8406 0.76629 39.35C0.275643 38.8593 0 38.1939 0 37.5ZM66.2791 37.5C66.2791 36.8061 66.5547 36.1407 67.0454 35.65C67.536 35.1594 68.2015 34.8837 68.8953 34.8837H72.3837C73.0776 34.8837 73.7431 35.1594 74.2337 35.65C74.7244 36.1407 75 36.8061 75 37.5C75 38.1939 74.7244 38.8593 74.2337 39.35C73.7431 39.8406 73.0776 40.1163 72.3837 40.1163H68.8953C68.2015 40.1163 67.536 39.8406 67.0454 39.35C66.5547 38.8593 66.2791 38.1939 66.2791 37.5ZM58.9465 58.9465C59.4371 58.4566 60.102 58.1814 60.7953 58.1814C61.4887 58.1814 62.1536 58.4566 62.6442 58.9465L64.0151 60.3174C64.2722 60.557 64.4783 60.8458 64.6213 61.1667C64.7643 61.4877 64.8412 61.8341 64.8474 62.1854C64.8536 62.5367 64.789 62.8856 64.6574 63.2114C64.5258 63.5372 64.33 63.8331 64.0815 64.0815C63.8331 64.33 63.5372 64.5258 63.2114 64.6574C62.8856 64.789 62.5367 64.8536 62.1854 64.8474C61.8341 64.8412 61.4877 64.7643 61.1667 64.6213C60.8458 64.4783 60.557 64.2722 60.3174 64.0151L58.9465 62.6442C58.4566 62.1536 58.1814 61.4887 58.1814 60.7953C58.1814 60.102 58.4566 59.4371 58.9465 58.9465ZM16.0535 58.9465C16.5434 59.4371 16.8186 60.102 16.8186 60.7953C16.8186 61.4887 16.5434 62.1536 16.0535 62.6442L14.6826 64.0151C14.443 64.2722 14.1542 64.4783 13.8333 64.6213C13.5123 64.7643 13.1659 64.8412 12.8146 64.8474C12.4633 64.8536 12.1144 64.789 11.7886 64.6574C11.4628 64.5258 11.1669 64.33 10.9185 64.0815C10.67 63.8331 10.4742 63.5372 10.3426 63.2114C10.211 62.8856 10.1464 62.5367 10.1526 62.1854C10.1588 61.8341 10.2357 61.4877 10.3787 61.1667C10.5217 60.8458 10.7278 60.557 10.9849 60.3174L12.3523 58.9465C12.5953 58.7034 12.8838 58.5105 13.2013 58.3789C13.5188 58.2474 13.8592 58.1796 14.2029 58.1796C14.5466 58.1796 14.887 58.2474 15.2045 58.3789C15.522 58.5105 15.8105 58.7034 16.0535 58.9465ZM37.5 66.2791C38.1939 66.2791 38.8593 66.5547 39.35 67.0454C39.8406 67.536 40.1163 68.2015 40.1163 68.8953V72.3837C40.1163 73.0776 39.8406 73.7431 39.35 74.2337C38.8593 74.7244 38.1939 75 37.5 75C36.8061 75 36.1407 74.7244 35.65 74.2337C35.1594 73.7431 34.8837 73.0776 34.8837 72.3837V68.8953C34.8837 68.2015 35.1594 67.536 35.65 67.0454C36.1407 66.5547 36.8061 66.2791 37.5 66.2791Z"
                          fill="currentColor" />
                      </svg>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              <motion.div
                layout
                transition={{
                  type: "spring",
                  duration: shouldAnimate ? 0.4 : 0,
                  bounce: 0.2,
                }}
                className={cn(theme === 'dark' ? "flex-1" : "w-4", "shrink-0 h-1 bg-primary rounded-full")}
              />
            </motion.div>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Nav;
