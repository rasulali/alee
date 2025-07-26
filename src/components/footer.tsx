"use client";

import { useEffect, useRef } from "react";
import { useFooterVisibility } from "../contexts/FooterVisibilityContext";

const Footer = () => {
  const { setFooterVisible } = useFooterVisibility();
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "50px 0px 0px 0px",
        threshold: 0,
      },
    );

    observer.observe(footerElement);
    return () => observer.disconnect();
  }, [setFooterVisible]);

  return (
    <div ref={footerRef} id="footer" className="w-full h-8 border">
      Footer content
    </div>
  );
};

export default Footer;
