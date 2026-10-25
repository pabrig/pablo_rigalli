"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring
} from "framer-motion";
import type { ReactNode, PointerEvent } from "react";

type CursorSpotlightProps = {
  children: ReactNode;
  className?: string;
  /** Hero default: 520 */
  radius?: number;
  /** Hero default: 0.06 */
  spotOpacity?: number;
};

export function CursorSpotlight({
  children,
  className = "",
  radius = 520,
  spotOpacity = 0.06
}: CursorSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const smoothX = useSpring(x, { stiffness: 70, damping: 26, mass: 0.55 });
  const smoothY = useSpring(y, { stiffness: 70, damping: 26, mass: 0.55 });
  const spotlight = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(109, 98, 232, ${spotOpacity}), transparent 62%)`;

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const onPointerLeave = () => {
    x.set(-1000);
    y.set(-1000);
  };

  return (
    <div
      className={`relative ${className}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 z-0"
          />
          <motion.div
            aria-hidden
            style={{ x: smoothX, y: smoothY }}
            className="pointer-events-none absolute left-0 top-0 z-0 h-[min(380px,52vw)] w-[min(380px,52vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.12] blur-[100px]"
          />
        </>
      ) : null}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

/** Per-card hover glow (Impact-style), pairs with section spotlight */
export function CardCursorSpotlight({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const lightX = useMotionValue(-500);
  const lightY = useMotionValue(-500);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${lightX}px ${lightY}px, rgba(109, 98, 232, 0.09), transparent 72%)`;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onPointerMove={(e) => {
        if (reduceMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        lightX.set(e.clientX - rect.left);
        lightY.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        lightX.set(-500);
        lightY.set(-500);
      }}
    >
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 z-0"
        />
      ) : null}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
