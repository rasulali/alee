"use client";

import Link from "next/link";
import Logo from "./logo";
import { motion, Variants, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import TextFlip from "./text-flip";
import { LocaleLink } from "./locale";
import { locales } from "../config-locale";
import { useVisibility } from "../contexts/visibility-provider";
import useScrollDir from "@/hooks/useScrollDir";
import { useAnim } from "@/hooks/useAnim";
import {
  IoPlay,
  IoPause,
  IoLanguage,
  IoSunny,
  IoGlasses,
} from "react-icons/io5";

interface NavItem {
  name: string;
  href: string;
}

const Nav = () => {
  const tItems = useTranslations("navbar.items");
  const tButtons = useTranslations("navbar.buttons");
  const tStatus = useTranslations("navbar.status");

  const navItems: NavItem[] = [
    { name: tItems("start"), href: "#" },
    { name: tItems("work"), href: "#" },
    { name: tItems("notes"), href: "#" },
    { name: tItems("media"), href: "#" },
    { name: tItems("info"), href: "#" },
  ];

  const { theme, setTheme } = useTheme();

  const [showDrawer, setDrawerState] = useState(false);
  const [drawerContentVisible, setDrawerContentVisible] = useState(false);
  const { isVisible } = useVisibility();
  const { scrollDir } = useScrollDir();

  const { anim: shouldAnimate, toggle: toggleAnimationMode } = useAnim();

  const viewport = useRef({ h: 0, w: 0 });

  const navVisible = useMemo(() => {
    if (showDrawer) return true;
    if (isVisible) return true;
    if (scrollDir === "down") return false;
    return true;
  }, [showDrawer, scrollDir, isVisible]);

  useEffect(() => {
    const updateViewport = () => {
      viewport.current = {
        h: window.innerHeight,
        w: window.innerWidth,
      };
    };

    updateViewport();

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const scrollLockClasses = [
      "overflow-hidden",
      "overscroll-none",
      "touch-none",
    ];
    const targets = [document.body, document.documentElement];

    if (showDrawer) {
      targets.forEach((target) => target.classList.add(...scrollLockClasses));
    } else {
      targets.forEach((target) =>
        target.classList.remove(...scrollLockClasses),
      );
    }

    return () => {
      targets.forEach((target) =>
        target.classList.remove(...scrollLockClasses),
      );
    };
  }, [showDrawer]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleDrawer = useCallback(() => {
    setDrawerState((prev) => !prev);
  }, []);

  useEffect(() => {
    if (showDrawer) {
      setDrawerContentVisible(true);
    }
  }, [showDrawer]);

  const handleDrawerContentAnimationComplete = useCallback(() => {
    if (!showDrawer) {
      setDrawerContentVisible(false);
    }
  }, [showDrawer]);

  const locale = useLocale();

  const [showLocales, setShowLocales] = useState(false);

  const drawerVariants: Variants = {
    closed: {
      height: 32,
      y: !navVisible ? -32 : 0,
    },
    open: {
      height: "100dvh",
      y: 0,
    },
  };

  const toggleLabels = [tButtons("more"), tButtons("less")];
  const toggleIndex = showDrawer ? 1 : 0;

  return (
    <>
      <motion.div
        variants={drawerVariants}
        initial="closed"
        animate={showDrawer ? "open" : "closed"}
        className={cn(
          shouldAnimate ? "backdrop-blur-sm bg-background/50" : "bg-background",
          "fixed inset-0 z-50 overflow-hidden",
        )}
      >
        {drawerContentVisible && (
          <motion.div
            initial={shouldAnimate ? "hidden" : false}
            animate={showDrawer ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            transition={{ duration: shouldAnimate ? 0.25 : 0 }}
            onAnimationComplete={handleDrawerContentAnimationComplete}
            className={cn(
              "w-full h-full grid grid-rows-6 p-2",
              !showDrawer && "pointer-events-none",
            )}
            aria-hidden={!showDrawer}
          >
            <div className=""></div>

            <nav className="flex flex-col  row-span-3 items-start justify-center gap-y-2">
              {navItems.map((item, i) => {
                const delay = shouldAnimate ? i * 0.05 : 0;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setDrawerState(false)}
                    aria-label={`Navigate to ${item.name}`}
                    rel="noopener noreferrer"
                    className="text-3xl cursor-not-allowed"
                  >
                    <TextFlip
                      padToMax
                      labels={[tStatus("soon"), item.name]}
                      activeIndex={toggleIndex}
                      shouldAnimate={shouldAnimate}
                      hoverFlip
                      animateOnMount
                      delay={delay}
                      className="block"
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col justify-end gap-y-2 py-1">
              <div className="flex leading-none items-center">
                <div className="flex gap-x-2 items-center">
                  <a href="mailto:rasul@alee.az">
                    <TextFlip
                      labels={["rasul@alee.az"]}
                      activeIndex={toggleIndex}
                      shouldAnimate={shouldAnimate}
                      hoverFlip
                      animateOnMount
                      className="block"
                    />
                  </a>
                  <Link
                    href="https://wa.me/994103112612"
                    aria-label="WhatsApp contact"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <TextFlip
                      labels={["whatsapp"]}
                      activeIndex={toggleIndex}
                      shouldAnimate={shouldAnimate}
                      hoverFlip
                      animateOnMount
                      className="block"
                    />
                  </Link>
                </div>
              </div>
              <div className="flex leading-none items-center">
                <div className="flex gap-x-2 items-center">
                  <Link
                    href="https://www.instagram.com/rasulalee"
                    aria-label="Instagram account of developer"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <TextFlip
                      labels={["instagram"]}
                      activeIndex={toggleIndex}
                      shouldAnimate={shouldAnimate}
                      hoverFlip
                      animateOnMount
                      className="block"
                    />
                  </Link>
                  <Link
                    href="https://x.com/terminaloxide"
                    aria-label="Twitter or X account of developer"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <TextFlip
                      labels={["x"]}
                      activeIndex={toggleIndex}
                      shouldAnimate={shouldAnimate}
                      hoverFlip
                      animateOnMount
                      className="block"
                    />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/rasul-alee"
                    aria-label="Linkedin account of developer"
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <TextFlip
                      labels={["linkedin"]}
                      activeIndex={toggleIndex}
                      shouldAnimate={shouldAnimate}
                      hoverFlip
                      animateOnMount
                      className="block"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-y-2 py-1">
              <div className="flex justify-end leading-none">
                <div className="flex items-center">
                  <motion.div
                    transition={{
                      layout: {
                        duration: shouldAnimate ? 0.3 : 0,
                        type: "spring",
                        bounce: 0,
                        stiffness: 240,
                        damping: 35,
                      },
                    }}
                    className="flex items-center gap-x-2 px-2 py-1 rounded-full bg-background shadow-inset"
                  >
                    <AnimatePresence initial={false}>
                      {showLocales && (
                        <motion.div
                          initial={shouldAnimate ? { width: 0 } : false}
                          animate={{ width: "auto" }}
                          exit={shouldAnimate ? { width: 0 } : undefined}
                          transition={{ duration: shouldAnimate ? 0.2 : 0 }}
                          className="flex items-center gap-x-2 overflow-hidden"
                        >
                          {locales.map((l, i) => (
                            <LocaleLink
                              key={l}
                              locale={l}
                              onClick={() => setShowLocales(false)}
                              className={cn(
                                l === locale
                                  ? "text-primary"
                                  : "text-primary/50",
                                "uppercase font-medium",
                              )}
                            >
                              <TextFlip
                                labels={[l]}
                                activeIndex={showLocales ? 1 : 0}
                                shouldAnimate={shouldAnimate}
                                hoverFlip
                                animateOnMount
                                delay={shouldAnimate ? i * 0.05 : 0}
                                className="block"
                              />
                            </LocaleLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => setShowLocales(!showLocales)}
                      aria-label="Change language"
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      <IoLanguage size={20} />
                    </button>

                    <button
                      onClick={toggleAnimationMode}
                      aria-label="Toggle animation mode"
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      {shouldAnimate ? (
                        <IoPlay size={20} />
                      ) : (
                        <IoPause size={20} />
                      )}
                    </button>
                    <button
                      onClick={toggleTheme}
                      aria-label={`Switch to ${
                        theme === "dark" ? "light" : "dark"
                      } mode`}
                      aria-pressed={theme === "dark"}
                      className="w-6 h-6 flex items-center justify-center"
                    >
                      {theme === "dark" ? (
                        <IoGlasses size={20} />
                      ) : (
                        <IoSunny size={20} />
                      )}
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.header
        className="fixed top-0 left-0 p-2 w-full z-50"
        animate={{ y: !navVisible ? -32 : 0 }}
        initial={false}
      >
        <div className="w-full flex justify-between items-center h-4">
          <Link href="/" aria-label="Navigate to home page">
            <Logo className="w-12" />
          </Link>
          <button
            onClick={toggleDrawer}
            className="relative overflow-hidden whitespace-nowrap leading-none cursor-pointer text-xs font-bold"
            aria-label={showDrawer ? toggleLabels[1] : toggleLabels[0]}
          >
            <TextFlip
              labels={toggleLabels}
              activeIndex={toggleIndex}
              shouldAnimate={shouldAnimate}
              padToMax
            />
          </button>
        </div>
      </motion.header>
    </>
  );
};

export default Nav;
