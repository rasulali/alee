import { MotionValue } from "motion/react";

declare global {
  interface VisibilityContextType {
    isVisible: boolean;
    setVisibility: (visible: boolean) => void;
  }
  type Nodes = {
    [nodeName: string]: THREE.Object3D | THREE.Mesh | THREE.Points | THREE.Line;
  };
  interface DivierProps {
    text?: string;
  }
  type ScrollDirection = "up" | "down" | null;

  interface UseScrollOptions {
    threshold?: number;
    throttleMs?: number;
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
