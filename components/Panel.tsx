"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function Panel({
  children,
  className = "",
  framed = true
}: {
  children: ReactNode;
  className?: string;
  framed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(window.innerHeight - el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Progress runs while the next panel slides over this one.
  const { scrollYProgress } = useScroll({
    target: sentinelRef,
    offset: ["end end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.7]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  if (reduceMotion) {
    return (
      <div
        className={`relative ${framed ? "mx-2 rounded-[32px] border border-line md:mx-3" : ""} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <>
      <motion.div
        ref={ref}
        style={{ top, scale, y, transformOrigin: "50% calc(100% - 50vh)" }}
        className={`sticky flex min-h-screen flex-col justify-center overflow-clip ${
          framed
            ? "mx-2 rounded-[32px] border border-line shadow-[0_-30px_80px_rgba(0,0,0,0.55)] md:mx-3"
            : ""
        } ${className}`}
      >
        {children}
        <motion.div
          aria-hidden
          style={{ opacity: dim }}
          className="pointer-events-none absolute inset-0 z-10 bg-canvas/85"
        />
      </motion.div>
      <div ref={sentinelRef} aria-hidden />
    </>
  );
}
