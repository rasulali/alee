declare global {
  interface VisibilityContextType {
    isVisible: boolean;
    setVisibility: (visible: boolean) => void;
  }

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
}

export {};
