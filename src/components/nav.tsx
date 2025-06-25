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
import { throttle } from "lodash";
import { useTranslations } from 'next-intl';
import { setUserLocale } from "../services/locale";

interface NavItem {
  name: string;
  href: string;
}

type ScrollDirection = "up" | "down";

const SCROLL_THRESHOLD = 5;
const TOP_THRESHOLD_VH = 30;
const DRAWER_DELAY = 0.2;
const ITEM_DELAY = 0.05;

const Nav = () => {

  const tItems = useTranslations('navbar.items');
  const tButtons = useTranslations('navbar.buttons');
  const tHeadings = useTranslations('navbar.headings');
  const tFooter = useTranslations('navbar.footer');

  const navItems: NavItem[] = [
    { name: tItems('home'), href: "#home" },
    { name: tItems('projects'), href: "#projects" },
    { name: tItems('writings'), href: "#writings" },
    { name: tItems('about'), href: "#about" },
  ];

  const { prefersReducedMotion, lowEndDevice } = useDevicePreferences();
  const { resolvedTheme: theme, setTheme } = useTheme();
  const { scrollY } = useScroll();

  const [scrollDir, setScrollDir] = useState<ScrollDirection>("up");
  const [nearTop, setNearTop] = useState(true);
  const [showDrawer, setDrawerState] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(navItems[0].href);
  const [locale, setLocale] = useState<'en' | 'az'>('en');

  const viewport = useRef({ h: 0, w: 0 });

  const shouldAnimate = useMemo(() =>
    !(prefersReducedMotion || lowEndDevice),
    [prefersReducedMotion, lowEndDevice]
  );

  const navVisible = useMemo(() =>
    showDrawer || nearTop || scrollDir === "up",
    [showDrawer, nearTop, scrollDir]
  );

  useEffect(() => {
    const updateViewport = () => {
      viewport.current = {
        h: window.innerHeight,
        w: window.innerWidth
      };
    };

    updateViewport();

    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.5,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = `#${entry.target.id}`;
          setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navItems.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setDrawerState(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      setActiveSection(href);
    }
  }, []);

  const springs = useMemo(() => {
    const normalSpring: Transition = {
      type: "spring",
      bounce: 0,
      stiffness: 160,
      damping: 25,
      duration: shouldAnimate ? 0.5 : 0
    };

    const quickSpring: Transition = {
      type: "spring",
      bounce: 0,
      stiffness: 240,
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

  const throttledScrollHandler = useCallback(
    throttle((current: number) => {
      const vh = viewport.current.h || window.innerHeight;
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
    }, 16),
    [viewport]
  );

  useMotionValueEvent(scrollY, "change", throttledScrollHandler);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleDrawer = useCallback(() => {
    setDrawerState(prev => !prev);
  }, []);

  const handleLocaleChange = useCallback(async (lang: 'en' | 'az') => {
    await setUserLocale(lang);
    setLocale(lang);
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
      x: -100,
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
    <>
      <motion.div
        variants={drawerVariants}
        initial="closed"
        animate={showDrawer ? "open" : "closed"}
        className={cn(shouldAnimate ?
          "backdrop-blur-sm bg-gradient-to-b from-background to-transparent" :
          "bg-background", "fixed inset-0 z-50 overflow-hidden overscroll-none touch-none \
    drop-shadow-sm ")}
      >
        <AnimatePresence>
          {showDrawer &&
            <div className="mt-[calc(18dvh)] w-full h-[calc(100%-18dvh)] flex flex-col">
              <nav className="px-6 flex flex-col">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    custom={i}
                  >
                    <Link
                      href={item.href}
                      aria-label={`Navigate to ${item.name}`}
                      className="flex items-center gap-x-2 w-fit pr-6"
                      onClick={e => handleNavClick(item.href, e)}
                    >
                      <h1
                        className={cn(
                          item.href !== activeSection && "text-primary/50",
                          "font-semibold leading-none relative text-4xl"
                        )}
                      >
                        {item.name}
                      </h1>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="w-full h-full flex flex-col mt-[6dvh]">
                <div className="flex flex-col flex-1 px-6">
                  <div className="overflow-hidden">
                    <motion.h1
                      initial="hidden"
                      animate={showDrawer ? "visible" : "hidden"}
                      variants={textVariants}
                      custom={2}
                      className="cursor-default text-sm font-medium text-primary/50 block leading-none"
                    >
                      {tHeadings("haveIdea")}
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.a
                      href="mailto:contact@alee.az"
                      initial="hidden"
                      animate={showDrawer ? "visible" : "hidden"}
                      custom={2}
                      variants={textVariants}
                      className="font-handwrite text-5xl block pb-0.5"
                    >
                      contact@alee.az
                    </motion.a>
                  </div>
                  <div className="mt-[6vh] w-full flex flex-col gap-y-1">
                    <div className="overflow-hidden">
                      <motion.h1
                        initial="hidden"
                        animate={showDrawer ? "visible" : "hidden"}
                        variants={textVariants}
                        custom={4}
                        className="cursor-default text-sm font-medium text-primary/50 block leading-none"
                      >{tHeadings("socials")}</motion.h1>
                    </div>
                    <div className="overflow-hidden w-full flex gap-x-4">
                      <Link
                        href="https://www.instagram.com/rasulalee"
                        aria-label="Instagram account of developer"
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        <motion.div
                          initial="hidden"
                          animate={showDrawer ? "visible" : "hidden"}
                          custom={4}
                          variants={textVariants}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            className="w-8"
                          >
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor">
                              <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"></path>
                              <path d="M16.5 12a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m1.008-5.5h-.01"></path>
                            </g>
                          </svg>
                        </motion.div>
                      </Link>
                      <Link
                        href="https://www.x.com/"
                        aria-label="Twitter or X account of developer"
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        <motion.div
                          initial="hidden"
                          animate={showDrawer ? "visible" : "hidden"}
                          custom={4}
                          variants={textVariants}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            className="w-8"
                          >
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m3 21l7.548-7.548M21 3l-7.548 7.548m0 0L8 3H3l7.548 10.452m2.904-2.904L21 21h-5l-5.452-7.548" color="currentColor"></path>
                          </svg>
                        </motion.div>
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/rasul-alee"
                        aria-label="Linkedin account of developer"
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        <motion.div
                          initial="hidden"
                          animate={showDrawer ? "visible" : "hidden"}
                          custom={4}
                          variants={textVariants}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            className="w-8"
                          >
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 9.5H4c-.943 0-1.414 0-1.707.293S2 10.557 2 11.5V20c0 .943 0 1.414.293 1.707S3.057 22 4 22h.5c.943 0 1.414 0 1.707-.293S6.5 20.943 6.5 20v-8.5c0-.943 0-1.414-.293-1.707S5.443 9.5 4.5 9.5m2-5.25a2.25 2.25 0 1 1-4.5 0a2.25 2.25 0 0 1 4.5 0m5.826 5.25H11.5c-.943 0-1.414 0-1.707.293S9.5 10.557 9.5 11.5V20c0 .943 0 1.414.293 1.707S10.557 22 11.5 22h.5c.943 0 1.414 0 1.707-.293S14 20.943 14 20v-3.5c0-1.657.528-3 2.088-3c.78 0 1.412.672 1.412 1.5v4.5c0 .943 0 1.414.293 1.707s.764.293 1.707.293h.499c.942 0 1.414 0 1.707-.293c.292-.293.293-.764.293-1.706L22 14c0-2.486-2.364-4.5-4.703-4.5c-1.332 0-2.52.652-3.297 1.673c0-.63 0-.945-.137-1.179a1 1 0 0 0-.358-.358c-.234-.137-.549-.137-1.179-.137" color="currentColor"></path>
                          </svg>
                        </motion.div>
                      </Link>
                      <Link
                        href="https://api.whatsapp.com/send?phone=994103112612&text=_from%20website_"
                        aria-label="Whatsapp contact of developer"
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        <motion.div
                          initial="hidden"
                          animate={showDrawer ? "visible" : "hidden"}
                          custom={4}
                          variants={textVariants}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                            className="w-8"
                          >
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor">
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12c0 1.379.28 2.693.784 3.888c.279.66.418.99.436 1.24c.017.25-.057.524-.204 1.073L2 22l3.799-1.016c.549-.147.823-.22 1.073-.204c.25.018.58.157 1.24.436A10 10 0 0 0 12 22"></path>
                              <path d="M12.882 12C14.052 12 15 13.007 15 14.25s-.948 2.25-2.118 2.25h-2.47c-.666 0-.998 0-1.205-.203S9 15.768 9 15.115V12m3.882 0C14.052 12 15 10.993 15 9.75s-.948-2.25-2.118-2.25h-2.47c-.666 0-.998 0-1.205.203S9 8.232 9 8.885V12m3.882 0H9"></path>
                            </g>
                          </svg>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-[6vh] w-full flex flex-col gap-y-1">
                    <div className="overflow-hidden">
                      <motion.h1
                        initial="hidden"
                        animate={showDrawer ? "visible" : "hidden"}
                        variants={textVariants}
                        custom={4}
                        className="cursor-default text-sm font-medium text-primary/50 block leading-none"
                      >{tHeadings('extras')}</motion.h1>
                    </div>
                    <div className="overflow-hidden w-full flex gap-x-4">
                      <motion.button
                        onClick={() => {
                          handleLocaleChange(locale === 'az' ? 'en' : 'az');
                        }}
                        className="cursor-pointer"
                      >
                        <motion.div
                          initial="hidden"
                          animate={showDrawer ? "visible" : "hidden"}
                          custom={6}
                          variants={textVariants}
                        >
                          <svg
                            className="w-8"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12c0 1.052.18 2.062.512 3m10.502-6h8.488M11 15H2.512m18.99-6a9 9 0 0 0-8.488-6c1.6 0 2.909 3.762 2.995 8.5M21.502 9c.278.789.45 1.628.498 2.5M2.512 15A9 9 0 0 0 11 21c-1.544 0-2.816-3.5-2.982-8M2 5.297C2 4.2 2 3.65 2.187 3.224c.2-.452.542-.815.968-1.025C3.557 2 4.075 2 5.11 2H6c1.886 0 2.828 0 3.414.62C10 3.243 10 4.24 10 6.24v2.259c0 .871 0 1.307-.264 1.457s-.606-.092-1.29-.576l-.105-.073c-.5-.354-.75-.53-1.034-.621c-.283-.091-.584-.091-1.185-.091h-1.01c-1.037 0-1.555 0-1.957-.199a2.06 2.06 0 0 1-.968-1.025C2 6.945 2 6.396 2 5.297m20 12c0-1.098 0-1.647-.187-2.073a2.06 2.06 0 0 0-.968-1.025C20.443 14 19.925 14 18.89 14H18c-1.886 0-2.828 0-3.414.62C14 15.243 14 16.24 14 18.24v2.259c0 .871 0 1.307.264 1.457s.606-.092 1.29-.576l.105-.073c.5-.354.75-.53 1.034-.621c.283-.091.584-.091 1.185-.091h1.01c1.037 0 1.555 0 1.957-.199c.426-.21.769-.573.968-1.025c.187-.426.187-.975.187-2.074" color="currentColor"></path>
                          </svg>
                        </motion.div>
                      </motion.button>

                      <Link
                        href="https://github.com/rasulali/alee"
                        aria-label="Instagram account of developer"
                        target="_blank"
                        rel="noopener noreferrer me"
                      >
                        <motion.div
                          initial="hidden"
                          animate={showDrawer ? "visible" : "hidden"}
                          custom={6}
                          variants={textVariants}
                        >
                          <svg
                            className="w-8"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} color="currentColor">
                              <path d="M10 20.568c-3.429 1.157-6.286 0-8-3.568"></path>
                              <path d="M10 22v-3.242c0-.598.184-1.118.48-1.588c.204-.322.064-.78-.303-.88C7.134 15.452 5 14.107 5 9.645c0-1.16.38-2.25 1.048-3.2c.166-.236.25-.354.27-.46c.02-.108-.015-.247-.085-.527c-.283-1.136-.264-2.343.16-3.43c0 0 .877-.287 2.874.96c.456.285.684.428.885.46s.469-.035 1.005-.169A9.5 9.5 0 0 1 13.5 3a9.6 9.6 0 0 1 2.343.28c.536.134.805.2 1.006.169c.2-.032.428-.175.884-.46c1.997-1.247 2.874-.96 2.874-.96c.424 1.087.443 2.294.16 3.43c-.07.28-.104.42-.084.526s.103.225.269.461c.668.95 1.048 2.04 1.048 3.2c0 4.462-2.134 5.807-5.177 6.643c-.367.101-.507.559-.303.88c.296.47.48.99.48 1.589V22"></path>
                            </g>
                          </svg>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="leading-none px-6 py-4 cursor-default
                  w-full text-primary/20 text-xs font-semibold text-center">
                  {tFooter('info')}
                </div>
              </div>
            </div>
          }
        </AnimatePresence>
      </motion.div >

      <motion.header
        className="fixed top-0 left-0 px-6 py-4 w-full z-50"
        animate={{ y: !navVisible ? "-100%" : "0%" }}
        transition={springs.content}
        initial={false}
      >
        <div className="w-full grid grid-cols-6 gap-x-2">
          <div className="flex flex-col h-full gap-y-2 col-span-4 min-w-0">
            <Link
              href="/"
              aria-label="Go back to home screen"
            >
              <Logo className="h-4 fill-black" />
            </Link>
            <div className="text-xs font-semibold leading-none flex flex-col cursor-default">
              <h1>ARTISAN APPS &</h1>
              <h1>WEBSITES</h1>
            </div>
          </div>

          <div className="w-full h-full flex flex-col gap-y-2 justify-between col-span-2">
            <motion.button
              onClick={toggleTheme}
              className="w-full h-fit z-10 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'dark'}
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
              className="w-fit h-fit self-end cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={showDrawer}
            >
              <h1 className="text-xs font-semibold leading-none">
                {showDrawer ? tButtons('less') : tButtons('more')}
              </h1>
            </motion.button>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Nav;
