"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
  type MotionValue
} from "framer-motion";
import { useCopy } from "@/lib/language";
import { bookingUrl, cvDownload } from "@/lib/links";

const ease = [0.22, 1, 0.36, 1] as const;
const PLANE_COUNT = 4;

function Cross({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute text-lg leading-none text-muted ${className}`}>
      +
    </span>
  );
}

function Plane({
  index,
  depth,
  className,
  children
}: {
  index: number;
  depth: MotionValue<number>;
  className: string;
  children: ReactNode;
}) {
  const z = useTransform(depth, (v) => v * index);

  return (
    <motion.div
      style={{ z }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.35 + (PLANE_COUNT - 1 - index) * 0.1 }}
      className={`preserve-3d absolute inset-0 rounded-[22px] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Label({ text, highlight }: { text: string; highlight?: boolean }) {
  return (
    <span
      className={`absolute -right-3 bottom-3 translate-x-full whitespace-nowrap text-[10px] uppercase tracking-[0.24em] ${
        highlight ? "text-accent" : "text-muted"
      }`}
    >
      — {text}
    </span>
  );
}

function Packet({
  depth,
  left,
  top,
  offset,
  duration
}: {
  depth: MotionValue<number>;
  left: string;
  top: string;
  offset: number;
  duration: number;
}) {
  const time = useTime();
  const progress = useTransform(time, (t) => ((t / 1000 + offset) % duration) / duration);
  const z = useTransform<number, number>([progress, depth], ([p, d]) => p * d * (PLANE_COUNT - 1));
  const opacity = useTransform(progress, [0, 0.12, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.6, 1, 1.4]);

  return (
    <motion.span
      aria-hidden
      style={{ z, opacity, scale, left, top }}
      className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[#8b7af5] shadow-[0_0_12px_2px_rgba(90,67,239,0.5)]"
    />
  );
}

function Beam({
  depth,
  tiltX,
  tiltY,
  reduceMotion
}: {
  depth: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const time = useTime();
  const z = useTransform(depth, (d) => d * (PLANE_COUNT - 1) + 18);
  const lean = useTransform<number, number>([tiltX, time], ([x, t]) =>
    reduceMotion ? 0 : x * 26 + Math.sin(t / 1500) * 7 + Math.sin(t / 2400) * 3.5
  );
  const shiftX = useTransform<number, number>([tiltX, time], ([x, t]) =>
    reduceMotion ? 0 : x * 36 + Math.sin(t / 1800) * 10
  );
  const scaleX = useTransform<number, number>([tiltY, time], ([y, t]) =>
    reduceMotion ? 1 : 1 + Math.abs(y) * 0.18 + Math.sin(t / 1300) * 0.08
  );
  const veil = useTransform(time, (t) =>
    reduceMotion ? 0.32 : 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(t / 1600))
  );
  const travel = useTransform(time, (t) => `${reduceMotion ? 36 : 8 + ((t / 22) % 72)}%`);
  const transform = useMotionTemplate`translateZ(${z}px) translateX(${shiftX}px) rotateZ(${lean}deg) scaleX(${scaleX})`;

  return (
    <motion.div
      aria-hidden
      style={{ transform, transformOrigin: "50% 0%" }}
      className="pointer-events-none absolute left-1/2 top-[8%] h-[230%] w-56 -translate-x-1/2"
    >
      <motion.div
        style={{ opacity: veil }}
        className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_8%,rgba(139,122,245,0.16),rgba(90,67,239,0.12)_32%,rgba(45,35,110,0.06)_62%,transparent_82%)] blur-2xl"
      />
      <motion.div
        style={{ opacity: veil }}
        className="absolute inset-x-[18%] inset-y-[2%] bg-[linear-gradient(180deg,rgba(139,122,245,0.1),rgba(90,67,239,0.1)_34%,transparent_88%)] blur-xl"
      />
      <div className="absolute inset-x-[36%] inset-y-[6%] bg-[linear-gradient(180deg,rgba(107,87,232,0.08),rgba(90,67,239,0.06)_40%,transparent)] blur-md" />
      {!reduceMotion && (
        <motion.span
          style={{ top: travel }}
          className="absolute left-1/2 h-28 w-20 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,122,245,0.22),rgba(90,67,239,0.12)_45%,transparent)] blur-xl"
        />
      )}
    </motion.div>
  );
}

function Spark({
  depth,
  rotateX,
  rotateZ,
  reduceMotion
}: {
  depth: MotionValue<number>;
  rotateX: MotionValue<number>;
  rotateZ: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const time = useTime();
  const bob = useTransform(time, (t) => (reduceMotion ? 0 : Math.sin(t / 900) * 10));
  const z = useTransform<number, number>([depth, bob], ([d, b]) => d * (PLANE_COUNT - 1) + 78 + b);
  const counterZ = useTransform(rotateZ, (v) => -v);
  const counterX = useTransform(rotateX, (v) => -v);
  const transform = useMotionTemplate`translateZ(${z}px) rotateZ(${counterZ}deg) rotateX(${counterX}deg)`;

  return (
    <motion.div
      aria-hidden
      style={{ transform }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease, delay: 1.6 }}
      className="absolute left-1/2 top-1/2 -ml-12 -mt-12 h-24 w-24 md:-ml-14 md:-mt-14 md:h-28 md:w-28"
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-accent/28 blur-2xl"
        animate={reduceMotion ? undefined : { opacity: [0.32, 0.58, 0.32], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.svg
        viewBox="0 0 100 100"
        className="relative h-full w-full"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="spark-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c8bfff" />
            <stop offset="55%" stopColor="#7565e8" />
            <stop offset="100%" stopColor="#5a43ef" />
          </linearGradient>
        </defs>
        <motion.path
          d="M50 4 C53 34 66 47 96 50 C66 53 53 66 50 96 C47 66 34 53 4 50 C34 47 47 34 50 4Z"
          fill="url(#spark-fill)"
          style={{ transformOrigin: "50px 50px" }}
          animate={reduceMotion ? undefined : { scale: [1, 0.86, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <path
          d="M80 14 C80.8 19 81 19.2 86 20 C81 20.8 80.8 21 80 26 C79.2 21 79 20.8 74 20 C79 19.2 79.2 19 80 14Z"
          fill="#9a8ee6"
          opacity="0.8"
        />
      </motion.svg>
    </motion.div>
  );
}

function Chip({
  label,
  className,
  factor,
  dir,
  tiltX,
  tiltY,
  scrollYProgress,
  delay
}: {
  label: string;
  className: string;
  factor: number;
  dir: number;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  delay: number;
}) {
  const x = useTransform<number, number>(
    [tiltX, scrollYProgress],
    ([tx, p]) => tx * 72 * factor + p * dir * 180 * factor
  );
  const y = useTransform<number, number>(
    [tiltY, scrollYProgress],
    ([ty, p]) => ty * 48 * factor - p * 280 * factor
  );

  return (
    <motion.span style={{ x, y }} className={`absolute hidden md:block ${className}`}>
      <motion.span
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease, delay }}
        className="block rounded-full border border-line bg-canvas/75 px-3 py-1.5 font-mono text-[11px] text-muted backdrop-blur-md"
        style={{ opacity: 0.38 + factor * 0.42 }}
      >
        {label}
      </motion.span>
    </motion.span>
  );
}

function Title({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((raw, i) => {
        const emphasis = raw.startsWith("*");
        const word = raw.replace(/\*/g, "");
        return (
          <span
            key={`${raw}-${i}`}
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          >
            <motion.span
              className={`inline-block ${emphasis ? "font-serif italic text-soft" : ""}`}
              initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease, delay: 0.15 + i * 0.045 }}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </>
  );
}

const chipLayout = [
  { className: "left-[10%] top-[20%]", factor: 0.9, dir: -1 },
  { className: "left-[22%] bottom-[30%]", factor: 0.55, dir: -1 },
  { className: "left-[30%] top-[10%]", factor: 0.35, dir: -1 },
  { className: "right-[12%] top-[24%]", factor: 1, dir: 1 },
  { className: "right-[24%] bottom-[32%]", factor: 0.6, dir: 1 },
  { className: "right-[32%] top-[12%]", factor: 0.4, dir: 1 }
];

const packets = [
  { left: "14%", top: "30%", offset: 0, duration: 3.4 },
  { left: "50%", top: "70%", offset: 1.1, duration: 3.8 },
  { left: "86%", top: "70%", offset: 2.3, duration: 3.2 },
  { left: "34%", top: "30%", offset: 0.6, duration: 4.2 },
  { left: "66%", top: "30%", offset: 1.9, duration: 3.6 }
];

export function Hero() {
  const { lang, t, profile } = useCopy();
  const reduceMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const layers = t.hero.layers[lang];
  const meetUrl = bookingUrl();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const intro = useMotionValue(reduceMotion ? 1 : 0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const tiltX = useSpring(pointerX, { stiffness: 50, damping: 16, mass: 0.8 });
  const tiltY = useSpring(pointerY, { stiffness: 50, damping: 16, mass: 0.8 });
  const spread = useSpring(0, { stiffness: 70, damping: 18 });
  const lightX = useMotionValue(-1000);
  const lightY = useMotionValue(-1000);

  useEffect(() => {
    if (reduceMotion) {
      intro.set(1);
      return;
    }
    const controls = animate(intro, 1, { duration: 2.2, ease, delay: 0.5 });
    return () => controls.stop();
  }, [intro, reduceMotion]);

  const scrollGap = useTransform(scrollYProgress, [0, 0.7], [0, 62]);
  const scrollTurn = useTransform(scrollYProgress, [0, 1], [0, 38]);
  const depth = useTransform<number, number>(
    [intro, spread, scrollGap],
    ([i, s, g]) => i * 42 + s + g
  );
  const rotateX = useTransform<number, number>([intro, tiltY], ([i, y]) => i * 58 - y * 14);
  const rotateZ = useTransform<number, number>(
    [intro, tiltX, scrollTurn],
    ([i, x, turn]) => i * -38 + x * 16 + turn
  );
  const rigScale = useTransform(intro, [0, 1], [0.82, 1]);
  const glow = useTransform(scrollYProgress, [0, 0.6], [0.2, 0.52]);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${lightX}px ${lightY}px, rgba(90,67,239,0.07), transparent 62%)`;

  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const objectY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const farGridY = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    lightX.set(e.clientX - rect.left);
    lightY.set(e.clientY - rect.top);
    if (reduceMotion || e.pointerType !== "mouse") return;
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    spread.set(0);
    lightX.set(-1000);
    lightY.set(-1000);
  };

  return (
    <section ref={sectionRef} id="top" className="relative px-3 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col pt-24 md:h-[100svh] md:min-h-[620px] md:pb-3 md:pt-[5.5rem]">
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="grid shrink-0 gap-6 px-2 pb-8 md:grid-cols-[1fr_1.4fr] md:px-4 md:pb-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="text-[11px] uppercase tracking-[0.28em] text-muted"
            >
              {profile.headline[lang]}
              <br />
              <span className="text-soft">{profile.kicker[lang]}</span>
            </motion.p>
            <h1 className="text-[clamp(2rem,min(4.4vw,6.4vh),3.8rem)] font-light leading-[1.04] tracking-[-0.03em]">
              <Title key={lang} text={t.hero.title[lang]} />
            </h1>
          </motion.div>

          <motion.div
            style={{ scale: stageScale, y: stageY }}
            initial={{ clipPath: "inset(10% 8% 10% 8% round 28px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
            transition={{ duration: 1.6, ease, delay: 0.1 }}
            className="relative overflow-hidden rounded-[28px] bg-elevated md:min-h-0 md:flex-1"
          >
            <div
              className="scene relative h-full"
              onPointerMove={onPointerMove}
              onPointerEnter={() => spread.set(18)}
              onPointerLeave={onPointerLeave}
            >
              <motion.div
                aria-hidden
                style={{ y: farGridY }}
                className="stage-grid pointer-events-none absolute -inset-y-28 inset-x-0 scale-110 opacity-25"
              />
              <motion.div
                aria-hidden
                style={{ y: gridY }}
                className="stage-grid pointer-events-none absolute -inset-y-20 inset-x-0"
                animate={
                  reduceMotion ? undefined : { backgroundPosition: ["0px 0px", "56px 28px"] }
                }
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                aria-hidden
                style={{ background: spotlight }}
                className="pointer-events-none absolute inset-0"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_35%,rgba(2,2,8,0.62))]"
              />
              <motion.div
                aria-hidden
                style={{ opacity: glow }}
                className="pointer-events-none absolute left-1/2 top-[46%] h-[60%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/14 blur-[110px]"
              />

              {t.hero.chips.map((chip, i) => (
                <Chip
                  key={chip}
                  label={chip}
                  {...chipLayout[i]}
                  tiltX={tiltX}
                  tiltY={tiltY}
                  scrollYProgress={scrollYProgress}
                  delay={1.4 + i * 0.12}
                />
              ))}

              <motion.div
                style={{ y: objectY }}
                className="relative h-[400px] md:absolute md:inset-x-0 md:bottom-[12%] md:top-0 md:h-auto"
              >
                <div className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-[62%] -translate-y-[20%] md:h-[290px] md:w-[290px] md:-translate-x-1/2 md:-translate-y-[45%]">
                  <motion.div
                    style={{ rotateX, rotateZ, scale: rigScale }}
                    className="preserve-3d relative h-full w-full"
                  >
                    <Plane index={0} depth={depth} className="border border-line bg-[#05050c]">
                      <div
                        className="absolute inset-4 rounded-[14px] opacity-50"
                        style={{
                          backgroundImage: "radial-gradient(#6e6c7e 1px, transparent 1px)",
                          backgroundSize: "14px 14px"
                        }}
                      />
                      <Label text={layers[3]} />
                    </Plane>

                    <Plane index={1} depth={depth} className="border border-line bg-[#070612]/92">
                      <svg
                        className="absolute inset-0 h-full w-full"
                        viewBox="0 0 100 100"
                        aria-hidden
                      >
                        <path
                          d="M14 30 H50 V70 H86 M14 70 H34 V30 M66 30 V70"
                          fill="none"
                          stroke="#8a8899"
                          strokeWidth="0.6"
                        />
                        {[
                          [14, 30],
                          [50, 30],
                          [50, 70],
                          [86, 70],
                          [14, 70],
                          [34, 30],
                          [66, 30]
                        ].map(([cx, cy]) => (
                          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.6" fill="#ddd9ef" />
                        ))}
                      </svg>
                      <Label text={layers[2]} />
                    </Plane>

                    <Plane index={2} depth={depth} className="border border-line bg-[#0a0914]/92">
                      <div className="absolute inset-5 grid grid-cols-3 grid-rows-4 gap-2">
                        <div className="col-span-3 rounded-md bg-white/[0.07]" />
                        <div className="row-span-3 rounded-md bg-white/[0.04]" />
                        <div className="col-span-2 row-span-2 rounded-md bg-white/[0.05]" />
                        <div className="rounded-md bg-white/[0.04]" />
                        <div className="rounded-md bg-accent/45" />
                      </div>
                      <Label text={layers[1]} />
                    </Plane>

                    <Plane
                      index={3}
                      depth={depth}
                      className="border border-accent/35 bg-accent/[0.04] backdrop-blur-[2px]"
                    >
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="relative h-[70%] w-[70%]">
                          <motion.div
                            className="absolute inset-0 rounded-full border border-dashed border-accent/40"
                            animate={reduceMotion ? undefined : { rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                          />
                          <motion.div
                            className="absolute inset-[18%] rounded-full border border-accent/25"
                            animate={reduceMotion ? undefined : { rotate: -360 }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                          >
                            <span className="absolute -top-1 left-1/2 -ml-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_1px_rgba(90,67,239,0.45)]" />
                          </motion.div>
                          <div className="absolute inset-[38%] rounded-full bg-accent/18 blur-md" />
                        </div>
                      </div>
                      <Label text={layers[0]} highlight />
                    </Plane>

                    <Beam depth={depth} tiltX={tiltX} tiltY={tiltY} reduceMotion={reduceMotion} />

                    {!reduceMotion &&
                      packets.map((packet) => (
                        <Packet key={`${packet.left}-${packet.top}`} depth={depth} {...packet} />
                      ))}

                    <Spark
                      depth={depth}
                      rotateX={rotateX}
                      rotateZ={rotateZ}
                      reduceMotion={reduceMotion}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease, delay: 1.1 }}
                className="relative flex flex-col gap-6 p-6 md:absolute md:inset-x-0 md:bottom-0 md:flex-row md:items-end md:justify-between md:p-8 lg:p-10"
              >
                <p className="max-w-md text-sm leading-relaxed text-muted md:text-[15px]">
                  {t.hero.body[lang]}
                </p>
                <div className="flex max-w-xl flex-wrap justify-end gap-2 md:max-w-none">
                  {meetUrl ? (
                    <a
                      href={meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-canvas transition hover:brightness-110"
                    >
                      {t.hero.scheduleMeet[lang]}
                    </a>
                  ) : null}
                  <a
                    href={`mailto:${profile.email}`}
                    className={`rounded-full px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur transition ${
                      meetUrl
                        ? "bg-white/[0.04] hover:bg-white/[0.12]"
                        : "bg-accent text-canvas hover:brightness-110"
                    }`}
                  >
                    {t.hero.primary[lang]}
                  </a>
                  <a
                    href={cvDownload.href}
                    download={cvDownload.fileName}
                    className="rounded-full border border-line bg-white/[0.04] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition hover:border-accent/40 hover:bg-white/[0.05]"
                  >
                    {t.hero.downloadCv[lang]}
                  </a>
                  <a
                    href="#trayectoria"
                    className="rounded-full bg-white/[0.04] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur transition hover:bg-white/[0.12]"
                  >
                    {t.hero.secondary[lang]}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="relative mt-3 flex h-6 shrink-0 items-center justify-center">
            <Cross className="left-0" />
            <Cross className="left-1/4 hidden md:block" />
            <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-muted">
              {t.hero.scroll[lang]}
              <span className="relative block h-4 w-px overflow-hidden bg-line">
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-accent"
                  animate={reduceMotion ? undefined : { y: ["-100%", "200%"] }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.6
                  }}
                />
              </span>
            </span>
            <Cross className="right-1/4 hidden md:block" />
            <Cross className="right-0" />
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-1 border-y border-line sm:grid-cols-3">
          {t.stats.map((stat, i) => (
            <div
              key={stat.value}
              className={`flex flex-col-reverse gap-3 px-2 py-8 md:px-6 ${
                i > 0 ? "border-t border-line sm:border-l sm:border-t-0" : "md:pl-4"
              }`}
            >
              <dt className="text-[11px] uppercase leading-relaxed tracking-[0.18em] text-muted">
                {stat.label[lang]}
              </dt>
              <dd className="font-serif text-5xl italic tracking-tight">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
