"use client";

import Link from "next/link";
import Logo from "./logo";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

interface ControlButtonsProps {
  showLocales: boolean;
  setShowLocales: Dispatch<SetStateAction<boolean>>;
  shouldAnimate: boolean;
  toggleAnimationMode: () => void;
  toggleTheme: () => void;
  theme: string | undefined;
  locale: string;
}

const SPRING_CONFIG = {
  type: "spring" as const,
  bounce: 0,
  stiffness: 240,
  damping: 35,
};

function ControlButtons({
  showLocales,
  setShowLocales,
  shouldAnimate,
  toggleAnimationMode,
  toggleTheme,
  theme,
  locale,
}: ControlButtonsProps) {
  const layoutTransition = {
    layout: shouldAnimate ? SPRING_CONFIG : { duration: 0 },
  };

  const localeTransition = { duration: shouldAnimate ? 0.2 : 0 };

  const handleToggleLocales = () => setShowLocales((prev) => !prev);
  const handleCloseLocales = () => setShowLocales(false);

  return (
    <motion.div
      transition={layoutTransition}
      className="flex items-center gap-x-2 px-2 py-1 rounded-full shadow-inset"
    >
      <AnimatePresence initial={false}>
        {showLocales && (
          <motion.div
            initial={shouldAnimate ? { width: 0 } : false}
            animate={{ width: "auto" }}
            exit={shouldAnimate ? { width: 0 } : undefined}
            transition={localeTransition}
            className="flex items-center gap-x-2 overflow-hidden"
          >
            {locales.map((l, i) => (
              <LocaleLink
                key={l}
                locale={l}
                onClick={handleCloseLocales}
                className={cn(
                  l === locale ? "text-primary" : "text-primary/50",
                  "uppercase font-medium inline-flex items-center justify-center w-6 h-5",
                )}
              >
                <TextFlip
                  labels={[l]}
                  activeIndex={showLocales ? 1 : 0}
                  shouldAnimate={shouldAnimate}
                  hoverFlip
                  animateOnMount
                  delay={shouldAnimate ? i * 0.05 : 0}
                  className="block leading-none"
                />
              </LocaleLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggleLocales}
        aria-label="Change language"
        className="w-6 h-5 flex items-center justify-center"
      >
        <IoLanguage className="w-full h-full" />
      </button>

      <button
        onClick={toggleAnimationMode}
        aria-label="Toggle animation mode"
        className="w-6 h-5 flex items-center justify-center"
      >
        {shouldAnimate ? (
          <IoPlay className="w-full h-full" />
        ) : (
          <IoPause className="w-full h-full" />
        )}
      </button>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        aria-pressed={theme === "dark"}
        className="w-6 h-5 flex items-center justify-center"
      >
        {theme === "dark" ? (
          <IoGlasses className="w-full h-full" />
        ) : (
          <IoSunny className="w-full h-full" />
        )}
      </button>
    </motion.div>
  );
}

const Nav = () => {
  const tItems = useTranslations("navbar.items");
  const tButtons = useTranslations("navbar.buttons");
  const tStatus = useTranslations("navbar.status");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const { isVisible } = useVisibility();
  const { scrollDir } = useScrollDir();
  const { anim: shouldAnimate, toggle: toggleAnimationMode } = useAnim();

  const [showDrawer, setDrawerState] = useState(false);
  const [drawerContentVisible, setDrawerContentVisible] = useState(false);
  const [showLocales, setShowLocales] = useState(false);

  const navItems: NavItem[] = [
    { name: tItems("portfolio"), href: "/work" },
    { name: tItems("journal"), href: "/notes" },
    { name: tItems("gallery"), href: "/media" },
    { name: tItems("profile"), href: "/info" },
  ];

  const navVisible = (() => {
    if (showDrawer) return true;
    if (isVisible) return true;
    if (scrollDir === "down") return false;
    return true;
  })();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleDrawer = () => {
    setShowLocales(false);
    setDrawerContentVisible(true);
    setDrawerState((prev) => !prev);
  };

  const handleDrawerContentAnimationComplete = () => {
    if (!showDrawer) {
      setDrawerContentVisible(false);
    }
  };

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

  const drawerVariants = {
    closed: {
      height: 32,
      y: !navVisible ? -32 : 0,
      transition: shouldAnimate ? SPRING_CONFIG : { duration: 0 },
    },
    open: {
      height: "100dvh",
      y: 0,
      transition: shouldAnimate ? SPRING_CONFIG : { duration: 0 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentTransition = { duration: shouldAnimate ? 0.25 : 0 };

  const toggleLabels = [tButtons("open"), tButtons("close")];

  const toggleIndex = showDrawer ? 1 : 0;

  return (
    <>
      <motion.div
        variants={drawerVariants}
        initial="closed"
        animate={showDrawer ? "open" : "closed"}
        className={cn(
          shouldAnimate ? "backdrop-blur-sm bg-background/50" : "bg-background",
          "fixed inset-0 z-50 overflow-hidden lg:hidden",
        )}
      >
        {drawerContentVisible && (
          <motion.div
            initial={shouldAnimate ? "hidden" : false}
            animate={showDrawer ? "visible" : "hidden"}
            variants={contentVariants}
            transition={contentTransition}
            onAnimationComplete={handleDrawerContentAnimationComplete}
            className={cn(
              "w-full h-full grid grid-rows-6 p-2",
              !showDrawer && "pointer-events-none",
            )}
            aria-hidden={!showDrawer}
          >
            <nav className="flex flex-col row-start-2 row-span-4 items-start justify-center gap-y-2">
              {navItems.map((item, i) => {
                const delay = shouldAnimate ? i * 0.05 : 0;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setDrawerState(false)}
                    aria-label={`Navigate to ${item.name}`}
                    rel="noopener noreferrer"
                    className="text-3xl"
                  >
                    <TextFlip
                      padToMax
                      labels={[item.name]}
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

            <div className="flex flex-col justify-end gap-y-2 py-1 row-start-6">
              <div className="flex justify-end leading-none">
                <div className="flex items-center">
                  <ControlButtons
                    showLocales={showLocales}
                    setShowLocales={setShowLocales}
                    shouldAnimate={shouldAnimate}
                    toggleAnimationMode={toggleAnimationMode}
                    toggleTheme={toggleTheme}
                    theme={theme}
                    locale={locale}
                  />
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
        <div className="w-full flex justify-between items-center lg:grid lg:grid-cols-3 lg:gap-4">
          <div className="flex justify-start">
            <Link href="/" aria-label="Navigate to home page">
              <Logo className="w-12" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-x-6">
            {navItems.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-label={`Navigate to ${item.name}`}
                  rel="noopener noreferrer"
                  className="text-sm"
                >
                  <TextFlip
                    labels={[item.name, tStatus("soon")]}
                    activeIndex={0}
                    shouldAnimate={shouldAnimate}
                    hoverFlip
                    className="block"
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex justify-end">
            <div className="hidden lg:block">
              <ControlButtons
                showLocales={showLocales}
                setShowLocales={setShowLocales}
                shouldAnimate={shouldAnimate}
                toggleAnimationMode={toggleAnimationMode}
                toggleTheme={toggleTheme}
                theme={theme}
                locale={locale}
              />
            </div>
            <button
              onClick={toggleDrawer}
              className="lg:hidden relative overflow-hidden whitespace-nowrap leading-none cursor-pointer text-xs font-medium"
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
        </div>
      </motion.header>
    </>
  );
};

export default Nav;
