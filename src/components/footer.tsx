"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { useVisibility } from "../contexts/visibility-provider";

const Footer = () => {
  const { setVisibility } = useVisibility();
  const footerRef = useRef<HTMLDivElement>(null);

  const handleVisibility = useEffectEvent(
    (entry: IntersectionObserverEntry) => {
      setVisibility(entry.intersectionRatio >= 0.5);
    },
  );

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        handleVisibility(entry);
      },
      {
        root: null,
        threshold: 0.5,
      },
    );

    observer.observe(footerElement);
    return () => observer.disconnect();
  }, []);

  return <div ref={footerRef} id="footer" className="w-full h-16"></div>;
};

export default Footer;
