"use client";

import Link from "next/link";
import { BlogProse } from "@/components/BlogProse";
import { DocsOutline } from "@/components/DocsOutline";
import { useCopy } from "@/lib/language";
import type { Lang } from "@/lib/content";
import type { DocsPage, DocsPageMeta } from "@/lib/docs/types";
import { noteHref, type RelatedLink } from "@/lib/paths";

export function DocsArticle({
  page,
  chapterTitle,
  chapterNumber,
  prev,
  next,
  relatedPosts = []
}: {
  page: DocsPage;
  chapterTitle: Record<Lang, string>;
  chapterNumber: string;
  prev: DocsPageMeta | null;
  next: DocsPageMeta | null;
  relatedPosts?: RelatedLink[];
}) {
  const { lang, t } = useCopy();
  const headings = page.headings[lang];
  const sections = headings.filter((heading) => heading.depth === 2);

  return (
    <article className="min-w-0 pb-8">
      <p className="flex flex-wrap items-baseline gap-2 text-[11px] uppercase tracking-[0.22em] text-muted">
        <span className="rounded-full border border-accent/40 px-2 py-0.5 text-accent">{t.docs.kind[lang]}</span>
        {chapterNumber ? <span className="font-mono text-[12px] tracking-normal text-soft">{chapterNumber}</span> : null}
        <span>{chapterTitle[lang]}</span>
      </p>
      <h1 className="mt-3 font-serif text-[clamp(1.8rem,4vw,2.6rem)] font-normal leading-[1.12] tracking-[-0.03em] text-ink">
        {page.number ? (
          <span className="mr-3 font-mono text-[0.55em] tracking-normal text-muted">{page.number}</span>
        ) : null}
        {page.title[lang]}
      </h1>
      <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed text-soft">{page.description[lang]}</p>

      {page.tags.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {page.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 border-t border-line pt-6 lg:hidden">
        <DocsOutline headings={sections} label={t.docs.onThisPage[lang]} />
      </div>

      <div className="docs-prose mt-8">
        <BlogProse
          markdown={page.body[lang]}
          headingIds={headings.map((heading) => heading.id)}
        />
      </div>

      {relatedPosts.length > 0 ? (
        <aside className="mt-12 border-t border-line pt-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-soft">{t.docs.relatedBlog[lang]}</p>
          <ul className="mt-3 space-y-2">
            {relatedPosts.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-serif text-lg leading-snug text-ink transition hover:text-accent">
                  {item.title[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <nav className="mt-16 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={noteHref(prev.slug)}
            className="rounded-2xl border border-line px-4 py-4 transition hover:border-accent/40"
          >
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">{t.docs.prev[lang]}</span>
            <span className="mt-2 block text-[15px] text-ink">
              {prev.number ? <span className="mr-2 font-mono text-[12px] text-muted">{prev.number}</span> : null}
              {prev.title[lang]}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={noteHref(next.slug)}
            className="rounded-2xl border border-line px-4 py-4 transition hover:border-accent/40 sm:text-right"
          >
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">{t.docs.next[lang]}</span>
            <span className="mt-2 block text-[15px] text-ink">
              {next.number ? <span className="mr-2 font-mono text-[12px] text-muted">{next.number}</span> : null}
              {next.title[lang]}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
