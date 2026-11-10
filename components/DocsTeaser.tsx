"use client";

import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "@/lib/language";
import type { DocsManual } from "@/lib/docs/types";
import { Reveal } from "./Reveal";

export function DocsTeaser({ manual }: { manual: DocsManual }) {
  const { lang, t } = useCopy();
  const copy = t.docs.teaser;
  if (manual.pages.length === 0) return null;

  const chapters = manual.chapters.filter((chapter) =>
    manual.pages.some((page) => page.chapter === chapter.id)
  );

  return (
    <section id="manual" className="px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {copy.eyebrow[lang]}
            </p>
            <h2 className="mt-5 max-w-md text-2xl font-light leading-[1.12] tracking-[-0.02em] md:text-4xl">
              {copy.title[lang]}
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">{copy.body[lang]}</p>
            <Link
              href="/docs"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-glass px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition hover:border-accent/40 hover:bg-glass-strong"
            >
              {copy.open[lang]}
              <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="divide-y divide-line border-y border-line">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="grid gap-3 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8">
                  <p className="flex items-baseline gap-2 pt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                    <span className="font-mono text-[12px] tracking-normal text-soft">{chapter.number}</span>
                    <span>{chapter.title[lang]}</span>
                  </p>
                  <ul>
                    {manual.pages
                      .filter((page) => page.chapter === chapter.id)
                      .map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/docs/${page.slug}`}
                            className="group grid gap-1 border-b border-transparent py-2 last:pb-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-baseline sm:gap-6"
                          >
                            <span className="font-serif text-xl leading-snug text-ink transition group-hover:text-accent">
                              <span className="mr-2 font-mono text-[13px] tracking-normal text-muted">{page.number}</span>
                              {page.title[lang]}
                            </span>
                            <span className="text-[14px] leading-relaxed text-muted">{page.description[lang]}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
