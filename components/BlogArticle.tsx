"use client";

import Link from "next/link";
import { useCopy } from "@/lib/language";
import { profile } from "@/lib/content";
import type { BlogPost, BlogPostMeta } from "@/lib/blog";
import { BlogProse } from "./BlogProse";
import { BlogShell } from "./BlogShell";
import { BlogReadMore } from "./BlogReadMore";
import { BlogReadingProgress } from "./BlogReadingProgress";

function formatDate(date: string, lang: "es" | "en") {
  const d = new Date(`${date}T12:00:00`);
  return d.toLocaleDateString(lang === "es" ? "es-AR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function authorInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function BlogArticle({
  post,
  morePosts
}: {
  post: BlogPost;
  morePosts: BlogPostMeta[];
}) {
  const { lang, t } = useCopy();
  const b = t.blog;

  return (
    <>
      <BlogReadingProgress />
      <BlogShell trail="post" reading>
        <article className="pb-4">
          <Link
            href="/blog"
            className="inline-flex text-[13px] text-muted transition hover:text-accent"
          >
            ← {b.back[lang]}
          </Link>

          <header className="mt-8">
            <h1 className="font-serif text-[clamp(2rem,5vw,2.75rem)] font-normal leading-[1.12] tracking-[-0.03em] text-ink">
              {post.title[lang]}
            </h1>

            <p className="blog-deck mt-5 text-[1.2rem] leading-[1.55] text-soft md:text-[1.25rem] md:leading-[1.5]">
              {post.description[lang]}
            </p>

            <div className="mt-8 flex items-center gap-3 border-b border-line pb-8">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[13px] font-medium text-accent"
                aria-hidden
              >
                {authorInitials(profile.name)}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">{profile.name}</p>
                <p className="mt-0.5 text-[14px] text-muted">
                  <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  <span aria-hidden> · </span>
                  {post.readingMinutes} {b.minRead[lang]}
                </p>
              </div>
            </div>

            {post.tags.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span className="rounded-full border border-line px-3 py-1 text-[12px] text-muted">
                      {tag}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </header>

          <div className="blog-body mt-10 md:mt-12">
            <BlogProse markdown={post.body[lang]} />
          </div>

          <BlogReadMore posts={morePosts} />
        </article>
      </BlogShell>
    </>
  );
}
