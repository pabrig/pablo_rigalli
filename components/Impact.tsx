"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { useCopy } from "@/lib/language";
import { MaskText } from "./MaskText";
import { Reveal } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

type Item = ReturnType<typeof useCopy>["t"]["impact"]["items"][number];

function ProductVisual({ animate }: { animate: boolean }) {
  const layers = ["UI", "API", "DATA"];
  return (
    <div className="relative flex h-full flex-col justify-center gap-2 px-8">
      {layers.map((layer, i) => (
        <div
          key={layer}
          className="flex h-9 items-center justify-between rounded-lg border border-line bg-white/[0.03] px-3"
          style={{ marginLeft: i * 14, marginRight: (2 - i) * 14 }}
        >
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted">{layer}</span>
          <span className="flex gap-1">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1 w-4 rounded-full bg-white/10" />
            ))}
          </span>
        </div>
      ))}
      {animate && (
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-[22%] h-2 w-2 -ml-1 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(90,67,239,0.45)]"
          animate={{ y: [0, 92, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function ArchitectureVisual({ animate }: { animate: boolean }) {
  const nodes = [
    [20, 24],
    [80, 24],
    [50, 50],
    [20, 76],
    [80, 76]
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      {nodes
        .filter((_, i) => i !== 2)
        .map(([x, y], i) => (
          <motion.line
            key={`${x}-${y}`}
            x1={50}
            y1={50}
            x2={x}
            y2={y}
            stroke="#5a43ef"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
            initial={{ strokeDashoffset: 0, opacity: 0.35 }}
            animate={animate ? { strokeDashoffset: [0, -16], opacity: 0.6 } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
          />
        ))}
      {nodes.map(([x, y], i) => (
        <rect
          key={`n-${x}-${y}`}
          x={x - (i === 2 ? 9 : 7)}
          y={y - (i === 2 ? 7 : 5)}
          width={i === 2 ? 18 : 14}
          height={i === 2 ? 14 : 10}
          rx="2"
          fill={i === 2 ? "rgba(90,67,239,0.12)" : "rgba(255,255,255,0.03)"}
          stroke={i === 2 ? "#5a43ef" : "rgba(221,217,239,0.14)"}
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function DxVisual({ animate }: { animate: boolean }) {
  const lines = [0.7, 0.45, 0.85, 0.6];
  return (
    <div className="flex h-full items-center gap-6 px-8">
      <motion.svg
        viewBox="0 0 100 100"
        className="h-14 w-14 shrink-0"
        aria-hidden
        animate={animate ? { rotate: 360 } : undefined}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M50 4 C53 34 66 47 96 50 C66 53 53 66 50 96 C47 66 34 53 4 50 C34 47 47 34 50 4Z"
          fill="#5a43ef"
        />
      </motion.svg>
      <div className="flex flex-1 flex-col gap-2.5">
        {lines.map((width, i) => (
          <motion.span
            key={i}
            className="h-1.5 origin-left rounded-full bg-white/[0.12]"
            style={{ width: `${width * 100}%` }}
            initial={{ scaleX: animate ? 0 : 1 }}
            animate={animate ? { scaleX: [0, 1, 1, 0] } : undefined}
            transition={{
              duration: 4,
              times: [0, 0.3, 0.85, 1],
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}

const visuals = {
  product: ProductVisual,
  architecture: ArchitectureVisual,
  dx: DxVisual
} as const;

function ImpactCard({ item, index }: { item: Item; index: number }) {
  const { lang } = useCopy();
  const reduceMotion = useReducedMotion() ?? false;
  const lightX = useMotionValue(-500);
  const lightY = useMotionValue(-500);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${lightX}px ${lightY}px, rgba(90,67,239,0.07), transparent 72%)`;
  const Visual = visuals[item.id as keyof typeof visuals] ?? ProductVisual;

  return (
    <motion.article
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, ease, delay: index * 0.12 }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        lightX.set(e.clientX - rect.left);
        lightY.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        lightX.set(-500);
        lightY.set(-500);
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-[#080712] p-3 transition-colors duration-500 hover:border-accent/35"
    >
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0"
      />

      <div
        className="relative h-44 overflow-hidden rounded-[16px] border border-line bg-canvas/70"
        style={{
          backgroundImage: "radial-gradient(rgba(138,136,153,0.25) 1px, transparent 1px)",
          backgroundSize: "14px 14px"
        }}
      >
        <Visual animate={!reduceMotion} />
        <span className="absolute left-4 top-3 font-mono text-[10px] text-muted">0{index + 1}</span>
      </div>

      <div className="relative flex flex-1 flex-col px-4 pb-4 pt-7 md:px-5">
        <h3 className="font-serif text-[2rem] italic leading-[1.05] tracking-tight">
          <MaskText text={item.title[lang]} delay={0.2 + index * 0.1} />
        </h3>
        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">{item.body[lang]}</p>
        <ul className="mt-7 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted transition-colors duration-500 group-hover:border-accent/30 group-hover:text-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function Impact() {
  const { lang, t } = useCopy();

  return (
    <section id="aporte" className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[6%] h-[70%] bg-[radial-gradient(ellipse_50%_45%_at_50%_45%,rgba(90,67,239,0.05),transparent_72%)]"
      />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <Reveal className="md:pt-4">
            <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t.impact.eyebrow[lang]}
            </p>
          </Reveal>
          <h2 className="text-[clamp(2rem,4.6vw,4.2rem)] font-light leading-[1.04] tracking-[-0.035em]">
            <MaskText key={lang} text={t.impact.title[lang]} />
          </h2>
        </div>

        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-3 md:gap-5">
          {t.impact.items.map((item, i) => (
            <ImpactCard key={`${item.id}-${lang}`} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
