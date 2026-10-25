"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCopy } from "@/lib/language";
import { Reveal, Stagger, StaggerItem } from "./Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

type Step = ReturnType<typeof useCopy>["t"]["stack"]["steps"][number];

function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          <span key={i} className="font-serif italic text-soft">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function Terminal({ step, total, active }: { step: Step; total: number; active: number }) {
  const { lang, t } = useCopy();

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-line bg-[#05040c]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/9 blur-[90px]"
      />
      <div className="relative flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="font-mono text-[11px] text-muted">agent · {step.id}</span>
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === active ? "w-5 bg-accent" : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease }}
          className="relative min-h-[220px] px-5 py-6 font-mono text-[13px] leading-relaxed md:min-h-[280px] md:px-8 md:py-10 md:text-[15px]"
        >
          <p className="flex gap-2">
            <span className="text-accent">❯</span>
            <span className="text-ink">
              {step.command.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.01, delay: 0.1 + i * 0.016 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </p>
          <div className="mt-5 space-y-1.5">
            {step.output.map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  ease,
                  delay: 0.25 + step.command.length * 0.016 + i * 0.18
                }}
                className={line.startsWith("→") ? "text-soft" : "text-muted"}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative grid grid-cols-2 border-t border-line">
        <div className="border-r border-line px-5 py-5 md:px-7">
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">{t.stack.aiLabel[lang]}</p>
          <p className="mt-2 text-sm text-ink/85">{step.ai[lang]}</p>
        </div>
        <div className="px-5 py-5 md:px-7">
          <p className="text-[10px] uppercase tracking-[0.22em] text-soft">{t.stack.youLabel[lang]}</p>
          <p className="mt-2 text-sm text-ink/85">{step.you[lang]}</p>
        </div>
      </div>
    </div>
  );
}

export function Stack() {
  const { lang, t } = useCopy();
  const steps = t.stack.steps;
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"]
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  return (
    <section id="stack" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
          <p className="text-[11px] uppercase tracking-[0.28em] text-soft">{t.stack.eyebrow[lang]}</p>
          <div>
            <h2 className="text-4xl font-light leading-[1.02] tracking-[-0.03em] md:text-7xl">
              <Emphasis text={t.stack.title[lang]} />
            </h2>
            <p className="mt-8 max-w-xl leading-relaxed text-muted">{t.stack.intro[lang]}</p>
          </div>
        </Reveal>

        <div className="mt-24 grid gap-10 md:grid-cols-[1fr_1.15fr] md:gap-16">
          <ol ref={listRef} className="relative">
            {steps.map((step, i) => (
              <li
                key={step.id}
                className="relative border-l border-line py-10 pl-8 md:flex md:min-h-[46vh] md:flex-col md:justify-center md:py-0 md:pl-10"
              >
                <motion.span
                  aria-hidden
                  animate={{ scaleY: active === i ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute -left-px top-0 h-full w-px origin-top bg-accent"
                />
                <motion.div
                  animate={{ opacity: active === i ? 1 : 0.35 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="font-serif text-4xl italic md:text-6xl">{step.title[lang]}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-muted">{step.body[lang]}</p>
                </motion.div>
                <div className="mt-8 md:hidden">
                  <Terminal step={step} total={steps.length} active={i} />
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden md:block">
            <div className="sticky top-[calc(50vh-13rem)]">
              <Terminal step={steps[active]} total={steps.length} active={active} />
            </div>
          </div>
        </div>

        <div className="mt-28 md:mt-40">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-soft">
              {t.stack.toolboxTitle[lang]}
            </p>
          </Reveal>
          <Stagger className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {t.stack.toolbox.map((group, i) => (
              <StaggerItem
                key={group.title.en}
                className={`py-8 sm:pr-8 lg:py-10 ${
                  i > 0 ? "border-t border-line sm:border-t-0" : ""
                } ${i % 2 === 1 ? "sm:border-l sm:border-line sm:pl-8" : ""} ${
                  i === 2 ? "lg:border-l lg:border-line lg:pl-8" : ""
                } ${i >= 2 ? "sm:border-t lg:border-t-0" : ""}`}
              >
                <h3 className={`text-lg ${i === 0 ? "text-accent" : ""}`}>{group.title[lang]}</h3>
                <p className="mt-2 text-sm text-muted">{group.note[lang]}</p>
                <ul className="mt-6 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="font-serif text-2xl leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
