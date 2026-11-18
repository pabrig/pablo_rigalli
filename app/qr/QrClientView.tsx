"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiCheck, FiCopy, FiDownload, FiExternalLink, FiShare2 } from "react-icons/fi";
import { useCopy } from "@/lib/language";

export function QrClientView() {
  const { lang, profile } = useCopy();
  const [copied, setCopied] = useState(false);

  const siteUrl = "https://pablo-rigalli.vercel.app";
  const utmUrl = `${siteUrl}?utm_source=presencial&utm_medium=qr&utm_campaign=portfolio`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name} — Senior Software Engineer`,
          text: "Portfolio interactivo y casos de arquitectura e ingeniería de Pablo Rigalli",
          url: siteUrl
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-ink flex flex-col justify-between">
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted transition hover:border-accent/40 hover:text-ink"
        >
          <FiArrowLeft className="text-base" />
          <span>{lang === "es" ? "Volver al sitio" : "Back to site"}</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-4 py-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted transition hover:border-accent/40 hover:text-ink"
          aria-label="Share"
        >
          <FiShare2 className="text-base" />
          <span>{lang === "es" ? "Compartir" : "Share"}</span>
        </button>
      </div>

      {/* Main QR Card */}
      <div className="mx-auto my-auto w-full max-w-md">
        <div className="relative rounded-3xl border border-line bg-elevated p-8 text-center shadow-2xl backdrop-blur-md">
          {/* Subtle glow effect */}
          <div className="absolute -top-12 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

          {/* Header info */}
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-glass px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {profile.name}
          </div>

          <h1 className="mt-4 font-serif text-2xl font-light tracking-tight text-ink md:text-3xl">
            {lang === "es" ? "Escanear para conectar" : "Scan to connect"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {lang === "es"
              ? "Acceso directo a mi portfolio, casos de arquitectura y contacto."
              : "Direct access to my portfolio, architecture work & contact."}
          </p>

          {/* QR Code Presentation */}
          <div className="mx-auto mt-6 flex h-64 w-64 items-center justify-center rounded-2xl bg-white p-4 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
            <Image
              src="/qr-portfolio.svg"
              alt={`Código QR para acceder al portfolio de ${profile.name}`}
              width={230}
              height={230}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          {/* Direct URL Box */}
          <div className="mt-6 flex items-center justify-between rounded-xl border border-line bg-glass px-4 py-2.5 text-left text-xs">
            <span className="truncate font-mono text-muted">{siteUrl}</span>
            <button
              onClick={handleCopy}
              className="ml-3 inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-glass-strong px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition hover:bg-glass-hover"
            >
              {copied ? (
                <>
                  <FiCheck className="text-accent" />
                  <span className="text-accent">{lang === "es" ? "Copiado" : "Copied"}</span>
                </>
              ) : (
                <>
                  <FiCopy />
                  <span>{lang === "es" ? "Copiar" : "Copy"}</span>
                </>
              )}
            </button>
          </div>

          {/* Action Links */}
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            <a
              href="/qr-portfolio.png"
              download="pablo-rigalli-qr.png"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-glass px-4 py-2.5 font-medium uppercase tracking-[0.12em] text-muted transition hover:border-accent/40 hover:text-ink"
            >
              <FiDownload className="text-sm" />
              <span>{lang === "es" ? "Descargar QR" : "Download QR"}</span>
            </a>
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-medium uppercase tracking-[0.12em] text-on-accent transition hover:brightness-110"
            >
              <FiExternalLink className="text-sm" />
              <span>{lang === "es" ? "Abrir web" : "Open site"}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <footer className="mx-auto w-full max-w-md text-center text-[11px] uppercase tracking-[0.18em] text-soft">
        <p>Pablo Rigalli · Senior Software & Product-Minded Engineer</p>
      </footer>
    </main>
  );
}
