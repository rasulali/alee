"use client";
import { useMemo } from "react";
import { useReducedMotion } from "motion/react";

export function useDevicePreferences() {
  const prefersReducedMotion = useReducedMotion();

  const lowEndDevice = useMemo(() => {
    if (typeof window === "undefined") return true;

    const testPerformance = () => {
      let totalDuration = 0;
      let maxDuration = 0;
      const testRuns = 3;

      for (let run = 0; run < testRuns; run++) {
        const start = performance.now();

        const array = new Array(5000).fill(null).map((_, i) => i);
        const processed = array.map((x) => Math.sin(x) * Math.cos(x));
        const filtered = processed.filter((x) => x > 0);
        const sum = filtered.reduce((acc, val) => acc + val, 0);

        const duration = performance.now() - start;
        totalDuration += duration;
        if (duration > maxDuration) maxDuration = duration;
      }

      const avgDuration = totalDuration / testRuns;

      return avgDuration > 5 || maxDuration > 10;
    };

    const hasWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const webgl = !!(
          canvas.getContext("webgl") ||
          canvas.getContext("experimental-webgl") ||
          canvas.getContext("webgl2")
        );
        return !webgl;
      } catch (e) {
        return true;
      }
    };

    const getDeviceInfo = () => {
      const { width } = window.screen;
      const pixelRatio = window.devicePixelRatio || 1;

      const isSmallScreen = width < 768;
      const isLowDensity = pixelRatio <= 1;

      const isAndroid = /Android/i.test(navigator.userAgent);
      const isLowEndAndroid = isAndroid && width <= 412 && pixelRatio < 2;

      return isSmallScreen && (isLowDensity || isLowEndAndroid);
    };

    const signals = [testPerformance(), hasWebGL(), getDeviceInfo()];
    const lowEndScore = signals.filter(Boolean).length;
    return lowEndScore >= 2;
  }, []);

  return {
    prefersReducedMotion,
    lowEndDevice,
  };
}
