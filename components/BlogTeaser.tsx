"use client";

import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "@/lib/language";
import type { BlogPostMeta } from "@/lib/blog";
import { Reveal } from "./Reveal";
import { MaskText } from "./MaskText";
import { CardCursorSpotlight, CursorSpotlight } from "./CursorSpotlight";
import { blogCardLinkClassName } from "@/lib/blog/card";

function formatDate(date: string, lang: "es" | "en") {
  const d = new Date(date);
  return d.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

const PREVIEW_COUNT = 2;

export function BlogTeaser({ posts }: { posts: BlogPostMeta[] }) {
  const { lang, t } = useCopy();
  const b = t.blog.teaser;
  if (posts.length === 0) return null;

  const preview = posts.slice(0, PREVIEW_COUNT);
  const hasMore = posts.length > PREVIEW_COUNT;

  return (
    <section id="blog" className="px-5 py-16 md:px-10 md:py-24">
      <CursorSpotlight className="mx-auto max-w-[1400px] overflow-hidden rounded-[28px] md:rounded-[32px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-14">
          <Reveal className="lg:sticky lg:top-28">
            <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {b.eyebrow[lang]}
            </p>
            <h2 className="mt-5 max-w-md text-2xl font-light leading-[1.12] tracking-[-0.02em] md:text-4xl">
              <MaskText key={lang} text={b.title[lang]} />
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">{b.body[lang]}</p>
            <Link
              href="/blog"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.04] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition hover:border-accent/40 hover:bg-white/[0.06]"
            >
              {b.all[lang]}
              <FiArrowUpRight className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <ul
              className="grid auto-rows-fr gap-3 sm:grid-cols-2"
              aria-label={t.blog.postsLabel[lang]}
            >
              {preview.map((post, index) => (
                <li key={post.slug} className="flex h-full min-h-0">
                  <CardCursorSpotlight className="h-full min-h-0 flex-1 rounded-[20px]">
                    <Link href={`/blog/${post.slug}`} className={blogCardLinkClassName}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-[13px] text-muted">
                          {formatDate(post.date, lang)} · {post.readingMinutes}{" "}
                          {t.blog.minRead[lang]}
                        </p>
                        {index === 0 ? (
                          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                            {t.blog.latest[lang]}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-3 line-clamp-3 min-h-[4.5rem] font-serif text-xl leading-snug text-ink transition group-hover:text-accent md:min-h-[5rem] md:text-2xl">
                        {post.title[lang]}
                      </h3>
                      <p className="mt-2 line-clamp-4 flex-1 text-[15px] leading-relaxed text-muted">
                        {post.description[lang]}
                      </p>
                      <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-soft transition group-hover:text-accent">
                        {t.blog.openPost[lang]}
                        <FiArrowUpRight className="text-base transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </CardCursorSpotlight>
                </li>
              ))}
            </ul>

            {hasMore ? (
              <p className="mt-5 text-center text-[13px] leading-relaxed text-muted lg:text-left">
                {b.morePostsHint[lang]}{" "}
                <Link href="/blog" className="text-soft underline-offset-4 transition hover:text-accent hover:underline">
                  {b.indexLink[lang]}
                </Link>
              </p>
            ) : null}
          </Reveal>
        </div>
      </CursorSpotlight>
    </section>
  );
}
