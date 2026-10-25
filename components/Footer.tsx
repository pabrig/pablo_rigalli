"use client";

import { useCopy } from "@/lib/language";

export function Footer() {
  const { lang, profile } = useCopy();

  return (
    <footer className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 text-[11px] uppercase tracking-[0.18em] text-muted md:flex-row md:items-center md:justify-between md:px-10">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>{profile.location[lang]}</p>
    </footer>
  );
}
