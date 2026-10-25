"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "@/lib/language";
import { bookingUrl, cvDownload } from "@/lib/links";
import { lenisRef } from "./Providers";

const ease = [0.76, 0, 0.24, 1] as const;

export function Header() {
  const { lang, setLang, t, profile } = useLanguage();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    if (open) lenisRef.current?.stop();
    else lenisRef.current?.start();
    document.body.style.overflow = open ? "hidden" : "";
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const meetUrl = bookingUrl();

  const links = [
    { href: "/#aporte", label: t.nav.work[lang] },
    { href: "/#trayectoria", label: t.nav.experience[lang] },
    { href: "/#stack", label: t.nav.stack[lang] },
    { href: "/blog", label: t.nav.blog[lang] },
    { href: "/#contacto", label: t.nav.contact[lang] }
  ];

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? -96 : 0 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
          <a href="/#top" className="text-[15px] font-medium uppercase tracking-[0.22em]">
            Pablo Rigalli
          </a>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full bg-white/[0.06] p-1 text-[11px] uppercase tracking-[0.16em] backdrop-blur-md sm:flex">
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
                className="group hidden items-center gap-3 rounded-full bg-accent px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-on-accent transition hover:brightness-110 sm:flex"
              >
                {lang === "es" ? "Agendar meet" : "Book a call"}
                <span className="h-1.5 w-1.5 rounded-full bg-on-accent transition group-hover:scale-150" />
              </a>
            ) : (
              <a
                href={`mailto:${profile.email}`}
                className="group hidden items-center gap-3 rounded-full bg-accent px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-on-accent transition hover:brightness-110 sm:flex"
              >
                {t.nav.talk[lang]}
                <span className="h-1.5 w-1.5 rounded-full bg-on-accent transition group-hover:scale-150" />
              </a>
            )}
            <a
              href={cvDownload.href}
              download={cvDownload.fileName}
              className="hidden rounded-full border border-line bg-white/[0.04] px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] transition hover:border-accent/40 hover:bg-white/[0.08] md:inline-flex"
            >
              CV
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex items-center gap-3 rounded-full bg-white/[0.06] px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] backdrop-blur-md transition hover:bg-white/[0.12]"
            >
              {open ? t.nav.close[lang] : t.nav.menu[lang]}
              <span className="flex gap-1" aria-hidden>
                <motion.span
                  animate={{ y: open ? -2 : 0 }}
                  className="h-1 w-1 rounded-full bg-ink"
                />
                <motion.span
                  animate={{ y: open ? 2 : 0 }}
                  className="h-1 w-1 rounded-full bg-ink"
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

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
    </>
  );
}
