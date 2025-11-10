"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useReducedMotion } from "motion/react";
import { getCookie, setCookie } from "@/lib/utils";

const COOKIE_NAME = "anim-pref";
const COOKIE_AUTO_VALUE = "anim-auto";
const PREF_AUTO = "auto";
const PREF_DISABLED = "false";
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
  const [anim, setAnim] = useState(override ?? true);
  const [userPref, setUserPref] = useState<string | null>(null);

  const lowEndDevice = useMemo(() => {
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
        const sum = filtered.reduce((acc, val) => acc + val, 0);

        const duration = performance.now() - start;
        totalDuration += duration;
        if (duration > maxDuration) maxDuration = duration;
      }

      const avgDuration = totalDuration / PERF_TEST_RUNS;
      return avgDuration > PERF_AVG_THRESHOLD || maxDuration > PERF_MAX_THRESHOLD;
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

      const isSmallScreen = width < SMALL_SCREEN_WIDTH;
      const isLowDensity = pixelRatio <= 1;

      const isAndroid = /Android/i.test(navigator.userAgent);
      const isLowEndAndroid =
        isAndroid && width <= LOW_END_ANDROID_WIDTH && pixelRatio < LOW_END_ANDROID_PIXEL_RATIO;

      return isSmallScreen && (isLowDensity || isLowEndAndroid);
    };

    const signals = [testPerformance(), hasWebGL(), getDeviceInfo()];
    const lowEndScore = signals.filter(Boolean).length;
    const isLowEnd = lowEndScore >= LOW_END_THRESHOLD;

    localStorage.setItem(STORAGE_KEY, isLowEnd ? "low-end" : "high-end");

    return isLowEnd;
  }, []);

  useEffect(() => {
    if (override !== undefined) {
      setAnim(override);
      return;
    }

    const autoValue = !(prefersReducedMotion || lowEndDevice);
    const savedAutoValue = getCookie(COOKIE_AUTO_VALUE);
    const userPreference = getCookie(COOKIE_NAME);

    setUserPref(userPreference);

    if (savedAutoValue === null) {
      setCookie(COOKIE_AUTO_VALUE, autoValue.toString());
    } else if (savedAutoValue !== autoValue.toString()) {
      setCookie(COOKIE_AUTO_VALUE, autoValue.toString());
    }

    if (userPreference === PREF_DISABLED) {
      setAnim(false);
    } else {
      setAnim(autoValue);
    }
  }, [prefersReducedMotion, lowEndDevice, override]);

  const toggle = useCallback(() => {
    const currentPref = getCookie(COOKIE_NAME);
    const newValue = currentPref === PREF_DISABLED ? PREF_AUTO : PREF_DISABLED;
    const autoValue = getCookie(COOKIE_AUTO_VALUE) === "true";

    setCookie(COOKIE_NAME, newValue);
    setUserPref(newValue);
    setAnim(newValue === PREF_DISABLED ? false : autoValue);
  }, []);

  return { anim, toggle, isAuto: userPref !== PREF_DISABLED };
}
