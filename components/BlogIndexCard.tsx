"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import type { BlogPostMeta } from "@/lib/blog";
import { blogCardLinkClassName } from "@/lib/blog/card";
import { CardCursorSpotlight } from "./CursorSpotlight";

const ease = [0.22, 1, 0.36, 1] as const;

export function BlogIndexCard({
  post,
  index,
  lang,
  labels
}: {
  post: BlogPostMeta;
  index: number;
  lang: "es" | "en";
  labels: {
    minRead: string;
    openPost: string;
    latest: string;
    formatDate: (date: string) => string;
  };
}) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.75, ease, delay: index * 0.08 }}
      className="flex h-full min-h-0"
    >
      <CardCursorSpotlight className="h-full min-h-0 flex-1 rounded-[20px]">
        <Link href={`/blog/${post.slug}`} className={blogCardLinkClassName}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[13px] text-muted">
              {labels.formatDate(post.date)} · {post.readingMinutes} {labels.minRead}
            </p>
            {index === 0 ? (
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent">
                {labels.latest}
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 line-clamp-3 min-h-[4.5rem] font-serif text-xl leading-snug text-ink transition group-hover:text-accent md:min-h-[5rem] md:text-2xl">
            {post.title[lang]}
          </h2>

          <p className="mt-2 line-clamp-4 flex-1 text-[15px] leading-relaxed text-muted">
            {post.description[lang]}
          </p>

          <div className="mt-auto pt-5">
            <ul className="flex min-h-[1.75rem] flex-wrap gap-1.5">
              {post.tags.slice(0, 4).map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-muted transition group-hover:border-accent/25 group-hover:text-soft"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-soft transition group-hover:text-accent">
              {labels.openPost}
              <FiArrowUpRight className="text-base transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      </CardCursorSpotlight>
    </motion.li>
  );
}
