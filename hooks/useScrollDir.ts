import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

const SCROLL_IDLE_DELAY = 150;

type ScrollDirection = "up" | "down" | null;

interface UseScrollOptions {
  threshold?: number;
  velocitySamples?: number;
}

interface UseScrollReturn {
  scrollDir: ScrollDirection;
  scrollY: number;
  velocity: number;
  isScrolling: boolean;
}

const getScrollPosition = (el?: HTMLElement | null) => {
  if (typeof window === "undefined") return 0;

  return el
    ? el.scrollTop
    : window.pageYOffset || document.documentElement.scrollTop;
};

const useScrollDir = (
  element?: HTMLElement | null,
  options: UseScrollOptions = {},
): UseScrollReturn => {
  const { threshold = 10, velocitySamples = 5 } = options;

  const [scrollDir, setScrollDir] = useState<ScrollDirection>(null);
  const [scrollY, setScrollY] = useState(() => getScrollPosition(element));
  const [velocity, setVelocity] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(0);
  const velocityBuffer = useRef<number[]>([]);
  const ticking = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useEffectEvent(() => {
    if (ticking.current) return;

    ticking.current = true;

    requestAnimationFrame(() => {
      const currentScrollY = element
        ? element.scrollTop
        : window.pageYOffset || document.documentElement.scrollTop;

      const now = Date.now();
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = now - lastTimestamp.current;

      setScrollY(currentScrollY);
      setIsScrolling(true);

      if (deltaTime > 0 && lastTimestamp.current > 0) {
        const currentVelocity = Math.abs(deltaY / deltaTime);

        velocityBuffer.current.push(currentVelocity);
        if (velocityBuffer.current.length > velocitySamples) {
          velocityBuffer.current.shift();
        }

        const avgVelocity =
          velocityBuffer.current.reduce((sum, v) => sum + v, 0) /
          velocityBuffer.current.length;
        setVelocity(avgVelocity);
      }

      if (Math.abs(deltaY) > threshold) {
        const newDirection: ScrollDirection = deltaY > 0 ? "down" : "up";
        setScrollDir(newDirection);
      }

      lastScrollY.current = currentScrollY;
      lastTimestamp.current = now;
      ticking.current = false;

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        setVelocity(0);
        velocityBuffer.current = [];
      }, SCROLL_IDLE_DELAY);
    });
  });

  useEffect(() => {
    const target = element || window;
    lastScrollY.current = getScrollPosition(element);
    lastTimestamp.current = Date.now();

    const eventOptions = { passive: true };
    target.addEventListener("scroll", handleScroll, eventOptions);

    return () => {
      target.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [element]);

  return {
    scrollDir,
    scrollY,
    velocity,
    isScrolling,
  };
};

export default useScrollDir;
