"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const useIsHydrated = () =>
  React.useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};

      const frame = requestAnimationFrame(callback);
      return () => cancelAnimationFrame(frame);
    },
    () => true,
    () => false,
  );

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const mounted = useIsHydrated();

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
