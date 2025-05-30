'use client'
import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

export function useDevicePreferences() {
  const prefersReducedMotion = useReducedMotion();

  const lowEndDevice = useMemo(() => {
    if (typeof window === "undefined") return false;

    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;

    return (
      (deviceMemory !== undefined && deviceMemory < 4) ||
      (hardwareConcurrency !== undefined && hardwareConcurrency < 4)
    );
  }, []);

  return {
    prefersReducedMotion,
    lowEndDevice,
  };
}
