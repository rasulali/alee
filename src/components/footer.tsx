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
        setVisibility(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "50px 0px 0px 0px",
        threshold: 0,
      },
    );

    observer.observe(footerElement);
    return () => observer.disconnect();
  }, [setVisibility]);

  return <div ref={footerRef} id="footer" className="w-full h-8"></div>;
};

export default Footer;
