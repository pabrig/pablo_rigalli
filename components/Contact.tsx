"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "@/lib/language";
import { bookingUrl, cvDownload } from "@/lib/links";
import { Reveal } from "./Reveal";
import { MaskText } from "./MaskText";

export function Contact() {
  const { lang, t, profile } = useCopy();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 28]);
  const meetUrl = bookingUrl();

  return (
    <section ref={ref} id="contacto" className="px-3 pb-3 pt-3 md:px-3">
      <motion.div
        style={{ scale, borderRadius: radius }}
        className="mx-auto max-w-[1400px] overflow-hidden bg-elevated px-6 py-20 md:px-14 md:py-28"
      >
        <Reveal>
          <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t.contact.eyebrow[lang]}
          </p>
          <h2 className="mt-6 max-w-4xl text-3xl font-light leading-[1.1] tracking-tight md:text-6xl">
            <MaskText key={lang} text={t.contact.title[lang]} />
          </h2>
          <p className="mt-6 max-w-xl text-muted">{t.contact.body[lang]}</p>
        </Reveal>

        <a
          href={`mailto:${profile.email}`}
          className="group mt-16 flex items-end justify-between gap-6 border-b border-line pb-6"
        >
          <span className="break-all font-serif text-[clamp(2rem,6.5vw,6rem)] leading-none transition group-hover:text-accent">
            {profile.email}
          </span>
          <FiArrowUpRight className="mb-2 shrink-0 text-4xl text-muted transition duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-accent md:text-6xl" />
        </a>

        <div className="mt-10 flex flex-wrap gap-2">
          {meetUrl ? (
            <a
              href={meetUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-accent px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-on-accent transition hover:brightness-110"
            >
              {t.contact.scheduleMeet[lang]}
            </a>
          ) : null}
          <a
            href={cvDownload.href}
            download={cvDownload.fileName}
            className="rounded-full border border-line bg-white/[0.04] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition hover:border-accent/40 hover:bg-white/[0.08]"
          >
            {t.contact.downloadCv[lang]}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/[0.06] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition hover:bg-white/[0.12]"
          >
            {t.contact.linkedin}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/[0.06] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.14em] transition hover:bg-white/[0.12]"
          >
            {t.contact.github}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
