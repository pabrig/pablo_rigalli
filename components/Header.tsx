"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiBookOpen, FiCalendar, FiDownload, FiLinkedin, FiMenu, FiX } from "react-icons/fi";
import { useLanguage } from "@/lib/language";
import { bookingUrl, cvDownload } from "@/lib/links";
import { lenisRef } from "./Providers";
import { ReadingDrawer } from "./ReadingDrawer";

const ease = [0.76, 0, 0.24, 1] as const;

export function Header() {
  const { lang, setLang, t, profile } = useLanguage();
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(() => lenisRef.current?.on("scroll", onScroll), 0);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      lenisRef.current?.off("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const locked = open || reading;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (reading) setReading(false);
      else setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenisRef.current?.start();
    };
  }, [open, reading]);

  const meetUrl = bookingUrl();
  const tight = compact && !open && !reading;
  const meetLabel = lang === "es" ? "Agendar meet" : "Book a call";

  const links = [
    { href: "/#aporte", label: t.nav.work[lang] },
    { href: "/#trayectoria", label: t.nav.experience[lang] },
    { href: "/#stack", label: t.nav.stack[lang] },
    { href: "/blog", label: t.nav.blog[lang] },
    { href: "/#contacto", label: t.nav.contact[lang] }
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          tight ? "border-b border-line bg-canvas/80 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 transition-[padding] duration-300 md:px-10 ${
            tight ? "py-2" : "py-5"
          }`}
        >
          <a
            href="/#top"
            className={`font-medium uppercase transition-all duration-300 ${
              tight ? "text-[13px] tracking-[0.16em]" : "text-[15px] tracking-[0.22em]"
            }`}
          >
            Pablo Rigalli
          </a>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full bg-glass-strong p-1 text-[11px] uppercase tracking-[0.16em] backdrop-blur-md sm:flex">
              {(["es", "en"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2.5 py-1.5 transition ${
                    lang === code ? "bg-ink text-on-accent" : "text-muted hover:text-ink"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            {meetUrl ? (
              <a
                href={meetUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={meetLabel}
                className={`group items-center justify-center rounded-full bg-accent text-[12px] font-medium uppercase tracking-[0.14em] text-on-accent transition hover:brightness-110 ${
                  tight ? "hidden h-9 w-9 sm:flex" : "hidden gap-3 px-5 py-2.5 sm:flex"
                }`}
              >
                {tight ? <FiCalendar className="text-base" aria-hidden /> : null}
                <span className={tight ? "sr-only" : undefined}>{meetLabel}</span>
                {tight ? null : (
                  <span className="h-1.5 w-1.5 rounded-full bg-on-accent transition group-hover:scale-150" />
                )}
              </a>
            ) : (
              <a
                href={`mailto:${profile.email}`}
                aria-label={t.nav.talk[lang]}
                className={`group items-center justify-center rounded-full bg-accent text-[12px] font-medium uppercase tracking-[0.14em] text-on-accent transition hover:brightness-110 ${
                  tight ? "hidden h-9 w-9 sm:flex" : "hidden gap-3 px-5 py-2.5 sm:flex"
                }`}
              >
                {tight ? <FiCalendar className="text-base" aria-hidden /> : null}
                <span className={tight ? "sr-only" : undefined}>{t.nav.talk[lang]}</span>
                {tight ? null : (
                  <span className="h-1.5 w-1.5 rounded-full bg-on-accent transition group-hover:scale-150" />
                )}
              </a>
            )}
            <a
              href={cvDownload.href}
              download={cvDownload.fileName}
              aria-label="CV"
              className={`items-center justify-center rounded-full border border-line bg-glass text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition hover:border-accent/40 hover:bg-glass-lift ${
                tight ? "hidden h-9 w-9 md:flex" : "hidden px-5 py-2.5 md:inline-flex"
              }`}
            >
              {tight ? <FiDownload className="text-base" aria-hidden /> : null}
              <span className={tight ? "sr-only" : undefined}>CV</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className={`flex items-center justify-center rounded-full border border-line bg-glass text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition hover:border-accent/40 hover:bg-glass-strong ${
                tight ? "h-9 w-9" : "h-10 w-10 lg:h-auto lg:w-auto lg:gap-2 lg:px-4 lg:py-2.5"
              }`}
            >
              <FiLinkedin className="text-base" aria-hidden />
              <span className={tight ? "sr-only" : "sr-only lg:not-sr-only"}>LinkedIn</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setReading((v) => !v);
                setOpen(false);
              }}
              aria-expanded={reading}
              aria-controls="reading-drawer"
              aria-label={t.reading.open[lang]}
              className={`flex items-center justify-center rounded-full border border-line bg-glass text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition hover:border-accent/40 hover:bg-glass-strong ${
                tight ? "h-9 w-9" : "gap-2 px-3 py-2.5 sm:px-5"
              }`}
            >
              <FiBookOpen className="text-sm" aria-hidden />
              <span className={tight ? "sr-only" : "hidden sm:inline"}>{t.reading.open[lang]}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen((v) => !v);
                setReading(false);
              }}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? t.nav.close[lang] : t.nav.menu[lang]}
              className={`flex items-center justify-center rounded-full bg-glass-strong text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition hover:bg-glass-hover ${
                tight ? "h-9 w-9" : "gap-3 px-5 py-2.5"
              }`}
            >
              {tight ? (
                open ? <FiX className="text-base" aria-hidden /> : <FiMenu className="text-base" aria-hidden />
              ) : (
                <>
                  {open ? t.nav.close[lang] : t.nav.menu[lang]}
                  <span className="flex gap-1" aria-hidden>
                    <motion.span animate={{ y: open ? -2 : 0 }} className="h-1 w-1 rounded-full bg-ink" />
                    <motion.span animate={{ y: open ? 2 : 0 }} className="h-1 w-1 rounded-full bg-ink" />
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
            className="fixed inset-0 z-40 flex flex-col bg-canvas px-5 pb-8 pt-24 md:px-10"
          >
            <div className="mx-auto h-px w-full max-w-[1400px] bg-line" />
            <div className="mx-auto grid w-full max-w-[1400px] flex-1 md:grid-cols-2">
              <nav className="flex flex-col justify-center gap-1 py-10 md:border-r md:border-line">
                {links.map((link, i) => (
                  <div key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.06 }}
                      className="group flex items-baseline gap-5 font-serif text-5xl leading-[1.05] text-soft transition hover:text-ink md:text-7xl"
                    >
                      <span className="font-sans text-xs tracking-[0.2em] text-muted">
                        0{i + 1}
                      </span>
                      <span className="transition-transform duration-500 group-hover:translate-x-3">
                        {link.label}
                      </span>
                    </motion.a>
                  </div>
                ))}
                <div className="mt-8 flex gap-2 text-[11px] uppercase tracking-[0.16em] sm:hidden">
                  {(["es", "en"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`rounded-full border border-line px-3 py-1.5 ${
                        lang === code ? "bg-ink text-on-accent" : "text-muted"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </nav>

              <motion.a
                href={`mailto:${profile.email}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.35 }}
                className="group hidden flex-col items-center justify-center text-center md:flex"
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
                  {t.nav.startA[lang]}
                </span>
                <span className="mt-4 font-serif text-7xl italic leading-[0.9] text-soft transition group-hover:text-accent lg:text-8xl">
                  {t.nav.newProject[lang]}
                </span>
                <span className="mt-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted">
                  {t.nav.together[lang]} <FiArrowUpRight />
                </span>
              </motion.a>
            </div>
            <div className="mx-auto h-px w-full max-w-[1400px] bg-line" />
            <div className="mx-auto mt-6 flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-4 text-sm text-muted">
              <div className="flex gap-6">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink"
                >
                  LinkedIn
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink"
                >
                  GitHub
                </a>
              </div>
              <a href={`mailto:${profile.email}`} className="hover:text-ink">
                {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReadingDrawer open={reading} onClose={() => setReading(false)} />
    </>
  );
}
