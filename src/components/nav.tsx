"use client";

import Link from "next/link";
import Logo from "./logo";
import { motion, Variants, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
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
  setShowLocales: (show: boolean) => void;
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

const ControlButtons = React.memo(
  ({
    showLocales,
    setShowLocales,
    shouldAnimate,
    toggleAnimationMode,
    toggleTheme,
    theme,
    locale,
  }: ControlButtonsProps) => {
    const layoutTransition = useMemo(
      () => ({
        layout: shouldAnimate ? SPRING_CONFIG : { duration: 0 },
      }),
      [shouldAnimate],
    );

    const localeTransition = useMemo(
      () => ({ duration: shouldAnimate ? 0.2 : 0 }),
      [shouldAnimate],
    );

    const handleToggleLocales = useCallback(
      () => setShowLocales(!showLocales),
      [showLocales, setShowLocales],
    );

    const handleCloseLocales = useCallback(
      () => setShowLocales(false),
      [setShowLocales],
    );

    return (
      <motion.div
        transition={layoutTransition}
        className="flex items-center gap-x-2 px-2 py-1 rounded-full bg-background shadow-inset"
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
                    "uppercase font-medium w-6 h-6",
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
          onClick={handleToggleLocales}
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
          {shouldAnimate ? <IoPlay size={20} /> : <IoPause size={20} />}
        </button>
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-pressed={theme === "dark"}
          className="w-6 h-6 flex items-center justify-center"
        >
          {theme === "dark" ? <IoGlasses size={20} /> : <IoSunny size={20} />}
        </button>
      </motion.div>
    );
  },
);

ControlButtons.displayName = "ControlButtons";

const Nav = () => {
  const tItems = useTranslations("navbar.items");
  const tButtons = useTranslations("navbar.buttons");
  const tStatus = useTranslations("navbar.status");
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isVisible } = useVisibility();
  const { scrollDir } = useScrollDir();
  const { anim: shouldAnimate, toggle: toggleAnimationMode } = useAnim();

  const [showDrawer, setDrawerState] = useState(false);
  const [drawerContentVisible, setDrawerContentVisible] = useState(false);
  const [showLocales, setShowLocales] = useState(false);

  const navItems = useMemo<NavItem[]>(
    () => [
      { name: tItems("start"), href: "/" },
      { name: tItems("work"), href: "/work" },
      { name: tItems("notes"), href: "/notes" },
      { name: tItems("media"), href: "/media" },
      { name: tItems("info"), href: "/info" },
    ],
    [tItems],
  );

  const isNavItemActive = useCallback(
    (item: NavItem) => {
      const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
      return (
        pathWithoutLocale === item.href ||
        pathWithoutLocale.startsWith(item.href + "/")
      );
    },
    [pathname, locale],
  );

  const navVisible = useMemo(() => {
    if (showDrawer) return true;
    if (isVisible) return true;
    if (scrollDir === "down") return false;
    return true;
  }, [showDrawer, scrollDir, isVisible]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleDrawer = useCallback(() => {
    setDrawerState((prev) => !prev);
  }, []);

  const handleDrawerContentAnimationComplete = useCallback(() => {
    if (!showDrawer) {
      setDrawerContentVisible(false);
    }
  }, [showDrawer]);

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

  useEffect(() => {
    if (showDrawer) {
      setDrawerContentVisible(true);
    }
  }, [showDrawer]);

  const drawerVariants = useMemo<Variants>(
    () => ({
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
    }),
    [navVisible, shouldAnimate],
  );

  const contentVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    [],
  );

  const contentTransition = useMemo(
    () => ({ duration: shouldAnimate ? 0.25 : 0 }),
    [shouldAnimate],
  );

  const toggleLabels = useMemo(
    () => [tButtons("more"), tButtons("less")],
    [tButtons],
  );

  const toggleIndex = showDrawer ? 1 : 0;

  return (
    <>
      {/* Mobile Drawer */}
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
            <div className=""></div>

            <nav className="flex flex-col  row-span-3 items-start justify-center gap-y-2">
              {navItems.map((item, i) => {
                const delay = shouldAnimate ? i * 0.05 : 0;
                const isActive = isNavItemActive(item);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setDrawerState(false)}
                    aria-label={`Navigate to ${item.name}`}
                    rel="noopener noreferrer"
                    className={cn(
                      "text-3xl px-2 py-1",
                      isActive && "rounded-full bg-background shadow-inset",
                    )}
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

      {/* Desktop & Mobile Header */}
      <motion.header
        className="fixed top-0 left-0 p-2 w-full z-50"
        animate={{ y: !navVisible ? -32 : 0 }}
        initial={false}
      >
        <div className="w-full flex justify-between items-center h-4 lg:grid lg:grid-cols-3 lg:gap-4">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" aria-label="Navigate to home page">
              <Logo className="w-12" />
            </Link>
          </div>

          {/* Desktop Nav Items (centered) */}
          <nav className="hidden lg:flex items-center justify-center gap-x-6">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-label={`Navigate to ${item.name}`}
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm",
                    isActive &&
                      "px-2 py-1 rounded-full bg-background shadow-inset",
                  )}
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

          {/* Control Buttons (desktop) / Toggle Button (mobile) */}
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
              className="lg:hidden relative overflow-hidden whitespace-nowrap leading-none cursor-pointer text-xs font-bold"
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
