"use client";

import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "@/lib/language";
import type { BlogPostMeta } from "@/lib/blog";

function formatDate(date: string, lang: "es" | "en") {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function BlogReadMore({ posts }: { posts: BlogPostMeta[] }) {
  const { lang, t } = useCopy();
  const b = t.blog;

  if (posts.length === 0) {
    return (
      <section className="mt-16 border-t border-line pt-10">
        <h2 className="text-lg font-medium text-ink">{b.readMoreEmpty[lang]}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.readMoreEmptyHint[lang]}</p>
        <Link
          href="/blog"
          className="group mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent"
        >
          {b.viewAll[lang]}
          <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-16 border-t border-line pt-10" aria-label={b.keepReading[lang]}>
      <h2 className="text-lg font-medium text-ink">{b.moreFrom[lang]}</h2>

      <ul className="mt-6 divide-y divide-line">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group block py-5 transition first:pt-0 last:pb-0"
            >
              <p className="text-[13px] text-muted">
                {formatDate(p.date, lang)} · {p.readingMinutes} {b.minRead[lang]}
              </p>
              <h3 className="mt-2 font-serif text-xl leading-snug text-ink transition group-hover:text-accent md:text-[1.35rem]">
                {p.title[lang]}
              </h3>
              <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">
                {p.description[lang]}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/blog"
        className="group mt-8 inline-flex items-center gap-1.5 text-[15px] font-medium text-muted transition hover:text-accent"
      >
        {b.viewAll[lang]}
        <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </section>
  );
}
