"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCopy } from "@/lib/language";

export function BlogShell({
  children,
  trail,
  wide = false,
  reading = false
}: {
  children: ReactNode;
  trail?: "index" | "post";
  wide?: boolean;
  /** Article column (~680px), Medium / Substack style */
  reading?: boolean;
}) {
  const { lang, t } = useCopy();
  const b = t.blog;

  return (
    <div
      className={`blog-shell mx-auto w-full pb-16 md:pb-20 ${
        wide
          ? "max-w-[1400px] px-5 md:px-10"
          : reading
            ? "max-w-[680px] px-5 md:px-6"
            : "max-w-xl px-5"
      }`}
    >
      <nav
        aria-label="Blog"
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.22em] text-muted"
      >
        <Link href="/" className="transition hover:text-accent">
          {b.site[lang]}
        </Link>
        <span aria-hidden className="text-line">
          /
        </span>
        {trail === "post" ? (
          <>
            <Link href="/blog" className="transition hover:text-accent">
              Blog
            </Link>
            <span aria-hidden className="text-line">
              /
            </span>
            <span className="text-soft">{b.reading[lang]}</span>
          </>
        ) : (
          <span className="text-soft">Blog</span>
        )}
      </nav>
      {children}
    </div>
  );
}
