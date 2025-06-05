'use client';
import { useMemo } from 'react';
import { useReducedMotion } from 'motion/react';

export function useDevicePreferences() {
  const prefersReducedMotion = useReducedMotion();

  const lowEndDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;

    // 1. Performance Test
    const testPerformance = () => {
      const start = performance.now();
      let sum = 0;
      for (let i = 0; i < 1_000_000; i++) sum += i;
      return performance.now() - start > 50; // > 50ms = slow
    };

    // 2. Feature Detection
    const hasWebGL = () => {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl') || !!canvas.getContext('experimental-webgl');
    };

    // 3. Screen Heuristic
    const { width } = window.screen;
    const pixelRatio = window.devicePixelRatio || 1;
    const isSmallLowRes = width < 768 && pixelRatio <= 1;

    // Combine signals: low-end if at least 2 out of 3 suggest it
    const signals = [testPerformance(), !hasWebGL(), isSmallLowRes];
    const lowEndScore = signals.filter(Boolean).length;
    return lowEndScore >= 2; // Majority vote
  }, []);

  return {
    prefersReducedMotion,
    lowEndDevice,
  };
}
