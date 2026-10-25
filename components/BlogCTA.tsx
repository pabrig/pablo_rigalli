"use client";

import Link from "next/link";
import { useCopy } from "@/lib/language";

export function BlogCTA() {
  const { lang, t } = useCopy();
  const c = t.blog.cta;

  return (
    <aside className="mt-12 border-t border-line pt-8">
      <div className="flex flex-col items-stretch gap-2 sm:mx-auto sm:max-w-xs">
        <Link
          href="/"
          className="rounded-full bg-accent px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-on-accent transition hover:brightness-110"
        >
          {c.site[lang]}
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-line bg-white/[0.04] px-5 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] transition hover:border-accent/35 hover:bg-white/[0.06]"
        >
          {c.allPosts[lang]}
        </Link>
      </div>
    </aside>
  );
}
