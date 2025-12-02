"use client";

import { AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import PageTransition from "./page-transition";

export default function TransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={pathname}>{children}</PageTransition>
    </AnimatePresence>
  );
}
