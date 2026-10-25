"use client";

import { useCopy } from "@/lib/language";
import type { BlogPostMeta } from "@/lib/blog";
import { BlogShell } from "./BlogShell";
import { BlogCTA } from "./BlogCTA";
import { BlogIndexCard } from "./BlogIndexCard";
import { MaskText } from "./MaskText";
import { Reveal } from "./Reveal";
import { CursorSpotlight } from "./CursorSpotlight";

function formatDate(date: string, lang: "es" | "en") {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function BlogList({ posts }: { posts: BlogPostMeta[] }) {
  const { lang, t } = useCopy();
  const b = t.blog;

  const cardLabels = {
    minRead: b.minRead[lang],
    openPost: b.openPost[lang],
    latest: b.latest[lang],
    formatDate: (date: string) => formatDate(date, lang)
  };

  return (
    <BlogShell trail="index" wide>
      <CursorSpotlight className="relative overflow-hidden rounded-[28px]">
        <header className="relative pt-4 md:pt-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:items-end md:gap-10">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {b.title[lang]}
              </p>
              {posts.length > 0 ? (
                <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-muted">
                  {posts.length} {b.indexCount[lang]}
                </p>
              ) : null}
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="text-[clamp(1.65rem,3.8vw,2.65rem)] font-light leading-[1.08] tracking-[-0.03em] md:max-w-2xl">
                <MaskText key={lang} text={b.subtitle[lang]} />
              </h1>
            </Reveal>
          </div>
        </header>

        <section aria-label={b.postsLabel[lang]} className="relative mt-12 md:mt-16">
          {posts.length > 0 ? (
            <ul
              className={`grid auto-rows-fr gap-4 md:gap-5 ${
                posts.length === 1 ? "mx-auto max-w-xl" : "md:grid-cols-2"
              }`}
            >
              {posts.map((post, index) => (
                <BlogIndexCard
                  key={post.slug}
                  post={post}
                  index={index}
                  lang={lang}
                  labels={cardLabels}
                />
              ))}
            </ul>
          ) : (
            <Reveal>
              <p className="py-16 text-center text-sm text-muted">{b.empty[lang]}</p>
            </Reveal>
          )}
        </section>

        <BlogCTA />
      </CursorSpotlight>
    </BlogShell>
  );
}
