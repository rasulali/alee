"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initializeAnimation,
  toggleAnimation,
} from "@/store/slices/animation-slice";

const STORAGE_KEY = "device-capabilities";
const PERF_TEST_RUNS = 3;
const PERF_ARRAY_SIZE = 5000;
const PERF_AVG_THRESHOLD = 5;
const PERF_MAX_THRESHOLD = 10;
const SMALL_SCREEN_WIDTH = 768;
const LOW_END_ANDROID_WIDTH = 412;
const LOW_END_ANDROID_PIXEL_RATIO = 2;
const LOW_END_THRESHOLD = 2;

export function useAnim(override?: boolean) {
  const prefersReducedMotion = useReducedMotion();
  const dispatch = useAppDispatch();
  const { anim, isAuto } = useAppSelector((state) => state.animation);

  useEffect(() => {
    if (override !== undefined) return;

    const computeLowEndDevice = () => {
      if (typeof window === "undefined") return true;

      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached !== null) {
        return cached === "low-end";
      }

      const testPerformance = () => {
        let totalDuration = 0;
        let maxDuration = 0;

        for (let run = 0; run < PERF_TEST_RUNS; run++) {
          const start = performance.now();

          const array = new Array(PERF_ARRAY_SIZE).fill(null).map((_, i) => i);
          const processed = array.map((x) => Math.sin(x) * Math.cos(x));
          const filtered = processed.filter((x) => x > 0);
          filtered.reduce((acc, val) => acc + val, 0);

          const duration = performance.now() - start;
          totalDuration += duration;
          if (duration > maxDuration) maxDuration = duration;
        }

        const avgDuration = totalDuration / PERF_TEST_RUNS;
        return (
          avgDuration > PERF_AVG_THRESHOLD || maxDuration > PERF_MAX_THRESHOLD
        );
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
        } catch {
          return true;
        }
      };

      const getDeviceInfo = () => {
        const { width } = window.screen;
        const pixelRatio = window.devicePixelRatio || 1;

        const isSmallScreen = width < SMALL_SCREEN_WIDTH;
        const isLowDensity = pixelRatio <= 1;

        const isAndroid = /Android/i.test(navigator.userAgent);
        const isLowEndAndroid =
          isAndroid &&
          width <= LOW_END_ANDROID_WIDTH &&
          pixelRatio < LOW_END_ANDROID_PIXEL_RATIO;

        return isSmallScreen && (isLowDensity || isLowEndAndroid);
      };

      const signals = [testPerformance(), hasWebGL(), getDeviceInfo()];
      const lowEndScore = signals.filter(Boolean).length;
      const isLowEnd = lowEndScore >= LOW_END_THRESHOLD;

      localStorage.setItem(STORAGE_KEY, isLowEnd ? "low-end" : "high-end");

      return isLowEnd;
    };

    const lowEndDevice = computeLowEndDevice();

    dispatch(
      initializeAnimation({
        prefersReducedMotion: Boolean(prefersReducedMotion),
        lowEndDevice,
      }),
    );
  }, [dispatch, override, prefersReducedMotion]);

  const toggle = () => {
    if (override !== undefined) return;
    dispatch(toggleAnimation());
  };

  return {
    anim: override ?? anim,
    toggle,
    isAuto: override !== undefined ? false : isAuto,
  };
}
