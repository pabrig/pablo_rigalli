"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function MaskText({ text, delay = 0 }: { text: string; delay?: number }) {
  type Segment = { text: string; emphasis: boolean };
  const words: Segment[][] = [];
  let previousEndedWithSpace = true;
  text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .forEach((part) => {
      const emphasis = part.startsWith("*");
      const clean = part.replace(/\*/g, "");
      const joinsPrevious = !previousEndedWithSpace && !clean.startsWith(" ");
      previousEndedWithSpace = clean.endsWith(" ");
      clean.split(" ").forEach((token, i) => {
        if (!token) return;
        const gluesToPrevious = i === 0 && joinsPrevious && words.length > 0;
        if (gluesToPrevious) words[words.length - 1].push({ text: token, emphasis });
        else words.push([{ text: token, emphasis }]);
      });
    });

  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ staggerChildren: 0.04, delayChildren: delay }}
    >
      {words.map((segments, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              show: { y: 0, rotate: 0, transition: { duration: 1, ease } }
            }}
          >
            {segments.map((segment, j) => (
              <span key={j} className={segment.emphasis ? "font-serif italic text-soft" : ""}>
                {segment.text}
              </span>
            ))}
            &nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
