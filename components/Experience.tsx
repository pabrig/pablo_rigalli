"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useCopy } from "@/lib/language";
import { MaskText } from "./MaskText";

type Role = ReturnType<typeof useCopy>["t"]["experience"]["roles"][number];

function RoleCard({
  role,
  x,
  viewport
}: {
  role: Role;
  x: MotionValue<number>;
  viewport: number;
}) {
  const { lang } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const [center, setCenter] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setCenter(el.offsetLeft + el.offsetWidth / 2);
  }, [viewport, lang]);

  const proximity = useTransform(x, (v) => {
    if (!viewport) return 1;
    const distance = Math.abs(center + v - viewport / 2) / viewport;
    return Math.max(0, 1 - distance * 1.4);
  });
  const scale = useTransform(proximity, [0, 1], [0.93, 1]);
  const opacity = useTransform(proximity, [0, 1], [0.45, 1]);
  const innerX = useTransform(x, (v) => {
    if (!viewport) return 0;
    return ((center + v - viewport / 2) / viewport) * -28;
  });
  const borderColor = useTransform(
    proximity,
    [0.6, 1],
    ["rgba(255,255,255,0.06)", "rgba(109,98,232,0.18)"]
  );

  return (
    <motion.article
      ref={ref}
      style={{ scale, opacity, borderColor }}
      className="group relative flex h-[56vh] min-h-[400px] w-[82vw] shrink-0 flex-col justify-between overflow-hidden rounded-[24px] border bg-elevated p-6 sm:w-[460px] md:p-8"
    >
      <motion.div style={{ x: innerX }}>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{role.period[lang]}</p>
        <h3 className="mt-8 font-serif text-4xl leading-none md:text-5xl">{role.company}</h3>
        <p className="mt-3 text-sm text-soft">
          {role.title[lang]} · {role.location[lang]}
        </p>
        <p className="mt-5 text-sm leading-relaxed text-muted">{role.summary[lang]}</p>
      </motion.div>
      <ul className="space-y-2 border-t border-line pt-5 text-sm">
        {role.highlights[lang].map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
            <span className="text-ink/85">{item}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Experience() {
  const { lang, t } = useCopy();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [viewport, setViewport] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setViewport(window.innerWidth);
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [lang]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -distance], { clamp: true });
  const titleX = useTransform(scrollYProgress, [0, 1], [0, -distance * 0.3]);
  const headingY = useTransform(scrollYProgress, [0, 0.15], [24, 0]);
  const progress = useTransform(scrollYProgress, [0.04, 0.96], [0, 1], { clamp: true });

  return (
    <section
      ref={sectionRef}
      id="trayectoria"
      className="relative"
      style={{ height: `calc(100vh + ${distance * 1.15}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.p
          aria-hidden
          style={{ x: titleX }}
          className="pointer-events-none absolute left-0 top-[10vh] whitespace-nowrap font-serif text-[22vw] italic leading-none text-white/[0.03] md:text-[16vw]"
        >
          {t.experience.eyebrow[lang]} — 2020 / 2026
        </motion.p>

        <motion.div
          style={{ y: headingY }}
          className="relative mx-auto mb-10 w-full max-w-[1400px] px-5 md:px-10"
        >
          <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t.experience.eyebrow[lang]}
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-light leading-tight tracking-[-0.02em] md:text-4xl">
            <MaskText key={lang} text={t.experience.title[lang]} />
          </h2>
        </motion.div>

        <motion.div
          ref={trackRef}
          style={{
            x,
            paddingLeft: "max(1.25rem, calc((100vw - 1400px) / 2 + 2.5rem))",
            paddingRight: "max(1.25rem, calc((100vw - 1400px) / 2 + 2.5rem))"
          }}
          className="relative flex w-max gap-4 md:gap-6"
        >
          {t.experience.roles.map((role) => (
            <RoleCard
              key={`${role.company}-${role.period.en}`}
              role={role}
              x={x}
              viewport={viewport}
            />
          ))}
        </motion.div>

        <div className="mx-auto mt-10 w-full max-w-[1400px] px-5 md:px-10">
          <div className="h-px w-full bg-line">
            <motion.div
              style={{ scaleX: progress }}
              className="h-px origin-left bg-accent/70"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
