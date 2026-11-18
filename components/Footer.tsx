"use client";

import Link from "next/link";
import { useCopy } from "@/lib/language";

export function Footer() {
  const { lang, profile } = useCopy();

  return (
    <footer className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 text-[11px] uppercase tracking-[0.18em] text-muted md:flex-row md:items-center md:justify-between md:px-10">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <div className="flex items-center gap-6">
        <Link
          href="/qr"
          className="transition hover:text-accent"
        >
          {lang === "es" ? "Compartir / QR" : "Share / QR"}
        </Link>
        <p>{profile.location[lang]}</p>
      </div>
    </footer>
  );
}
