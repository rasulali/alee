"use client";

import { useEffect, useRef } from "react";
import { useVisibility } from "../contexts/visibility-provider";

const Footer = () => {
  const { setVisibility } = useVisibility();
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibility(entry.intersectionRatio >= 0.5);
      },
      {
        root: null,
        threshold: 0.5,
      },
    );

    observer.observe(footerElement);
    return () => observer.disconnect();
  }, [setVisibility]);

  return <div ref={footerRef} id="footer" className="w-full h-16"></div>;
};

export default Footer;
