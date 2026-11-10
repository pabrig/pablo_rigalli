"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DocsOutline } from "@/components/DocsOutline";
import { useCopy } from "@/lib/language";
import type { Lang } from "@/lib/content";
import { noteHref } from "@/lib/paths";
import type { DocsManual, DocsPageMeta } from "@/lib/docs/types";
import { lenisRef } from "./Providers";

const ease = [0.76, 0, 0.24, 1] as const;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function haystack(page: DocsPageMeta, lang: Lang, chapter: string) {
  return normalize(
    [
      page.title[lang],
      page.description[lang],
      chapter,
      page.tags.join(" "),
      page.headings[lang].map((heading) => heading.text).join(" "),
      page.plain[lang]
    ].join(" ")
  );
}

export function DocsFrame({ manual, children }: { manual: DocsManual; children: ReactNode }) {
  const { lang, t } = useCopy();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [indexOpen, setIndexOpen] = useState(false);

  const needle = normalize(query.trim());
  const pages = manual.pages.filter((page) => {
    const chapter = manual.chapters.find((item) => item.id === page.chapter)?.title[lang] ?? page.chapter;
    const matchesChapter = !chapterId || page.chapter === chapterId;
    const matchesQuery = !needle || haystack(page, lang, chapter).includes(needle);
    return matchesChapter && matchesQuery;
  });

  const results = useMemo(() => {
    if (!needle) return [];
    const hits: { href: string; title: string; detail: string }[] = [];
    for (const page of pages) {
      const title = page.title[lang];
      if (
        normalize(title).includes(needle) ||
        normalize(page.description[lang]).includes(needle) ||
        page.tags.some((item) => normalize(item).includes(needle))
      ) {
        hits.push({
          href: noteHref(page.slug),
          title: page.number ? `${page.number}  ${title}` : title,
          detail: page.description[lang]
        });
      }
      for (const heading of page.headings[lang]) {
        if (heading.depth !== 2) continue;
        if (normalize(heading.text).includes(needle)) {
          hits.push({
            href: `${noteHref(page.slug)}#${heading.id}`,
            title: heading.text,
            detail: title
          });
        }
      }
    }
    return hits.slice(0, 8);
  }, [lang, needle, pages]);

  const current = manual.pages.find((page) => pathname === noteHref(page.slug));

  useEffect(() => {
    setIndexOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!indexOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndexOpen(false);
    };
    window.addEventListener("keydown", onKey);
    lenisRef.current?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      lenisRef.current?.start();
    };
  }, [indexOpen]);

  const sidebar = (
    <DocsSidebar
      manual={manual}
      pages={pages}
      chapterId={chapterId}
      query={query}
      results={results}
      pathname={pathname}
      onQuery={setQuery}
      onChapter={setChapterId}
      onNavigate={() => setIndexOpen(false)}
    />
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10">
      <header className="mb-8 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-soft">{t.docs.kicker[lang]}</p>
        <p className="mt-3 text-xl font-light leading-snug tracking-[-0.02em] text-ink md:text-2xl">
          {t.docs.header[lang]}
        </p>
      </header>
      <div className="lg:grid lg:grid-cols-[220px_minmax(0,680px)_200px] lg:items-start lg:justify-center lg:gap-10">
      <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.25rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:pr-1">
        <button
          type="button"
          className="mb-6 inline-flex rounded-full border border-line bg-glass px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink lg:hidden"
          aria-expanded={indexOpen}
          onClick={() => setIndexOpen(true)}
        >
          {t.docs.index[lang]}
        </button>
        <div className="hidden lg:block">{sidebar}</div>
      </div>

      <div className="min-w-0">{children}</div>

      <aside className="sticky top-20 hidden max-h-[calc(100vh-6.25rem)] overflow-y-auto overscroll-y-contain lg:block">
        {current ? (
          <DocsOutline
            headings={current.headings[lang].filter((heading) => heading.depth === 2)}
            label={t.docs.onThisPage[lang]}
          />
        ) : null}
      </aside>

      <AnimatePresence>
        {indexOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={t.nav.close[lang]}
              className="absolute inset-0 bg-canvas/70"
              onClick={() => setIndexOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t.docs.index[lang]}
              className="absolute inset-y-0 left-0 w-[min(100vw,20rem)] overflow-y-auto border-r border-line bg-elevated px-5 py-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.45, ease }}
            >
              {sidebar}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>
    </div>
  );
}

function DocsSidebar({
  manual,
  pages,
  chapterId,
  query,
  results,
  pathname,
  onQuery,
  onChapter,
  onNavigate
}: {
  manual: DocsManual;
  pages: DocsPageMeta[];
  chapterId: string | null;
  query: string;
  results: { href: string; title: string; detail: string }[];
  pathname: string;
  onQuery: (value: string) => void;
  onChapter: (value: string | null) => void;
  onNavigate: () => void;
}) {
  const { lang, t } = useCopy();
  const chapters = manual.chapters.filter((chapter) => pages.some((page) => page.chapter === chapter.id));
  const loose = pages.filter((page) => !manual.chapters.some((chapter) => chapter.id === page.chapter));

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-soft">{manual.title[lang]}</p>
      <label className="mt-4 block">
        <span className="sr-only">{t.docs.search[lang]}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={t.docs.search[lang]}
          className="w-full rounded-full border border-line bg-glass px-4 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted focus:border-accent/50"
        />
      </label>

      {manual.chapters.length > 0 ? (
        <div className="mt-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-soft">{t.docs.tags[lang]}</p>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            <TagButton active={chapterId === null} onClick={() => onChapter(null)}>
              {t.docs.all[lang]}
            </TagButton>
            {manual.chapters
              .filter((chapter) => manual.pages.some((page) => page.chapter === chapter.id))
              .map((chapter) => (
              <TagButton
                key={chapter.id}
                active={chapterId === chapter.id}
                onClick={() => onChapter(chapterId === chapter.id ? null : chapter.id)}
              >
                {chapter.title[lang]}
              </TagButton>
            ))}
          </div>
        </div>
      ) : null}

      {query.trim() ? (
        <div className="mt-5">
          {results.length === 0 ? (
            <p className="text-[13px] leading-relaxed text-muted">{t.docs.empty[lang]}</p>
          ) : (
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result.href}>
                  <Link href={result.href} onClick={onNavigate} className="block rounded-xl px-2 py-1.5 transition hover:bg-glass">
                    <span className="block text-[13px] text-ink">{result.title}</span>
                    <span className="mt-0.5 block line-clamp-2 text-[12px] leading-snug text-muted">{result.detail}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {chapters.map((chapter) => (
          <section key={chapter.id}>
            <h2 className="flex items-baseline gap-2 text-[11px] uppercase tracking-[0.2em] text-muted">
              <span className="font-mono text-[12px] tracking-normal text-soft">{chapter.number}</span>
              <span>{chapter.title[lang]}</span>
            </h2>
            <ul className="mt-2 space-y-1">
              {pages
                .filter((page) => page.chapter === chapter.id)
                .map((page) => {
                  const href = noteHref(page.slug);
                  const active = pathname === href;
                  return (
                    <li key={page.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={`grid grid-cols-[2.2rem_minmax(0,1fr)] items-baseline gap-1 border-l py-1 pl-2 text-[13px] leading-snug transition ${
                          active
                            ? "border-accent text-ink"
                            : "border-transparent text-muted hover:text-ink"
                        }`}
                      >
                        <span className="font-mono text-[12px] tabular-nums">{page.number}</span>
                        <span className="line-clamp-2">{page.title[lang]}</span>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
        {loose.length > 0 ? (
          <ul className="space-y-1">
            {loose.map((page) => (
              <li key={page.slug}>
                <Link href={noteHref(page.slug)} onClick={onNavigate} className="text-[14px] text-muted">
                  {page.title[lang]}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function TagButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] whitespace-nowrap transition ${
        active ? "border-accent text-ink" : "border-line text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
