"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCopy } from "@/lib/language";
import { useReading } from "@/lib/reading";
import {
  PAGE_SWATCHES,
  PAGE_TONES,
  READING_FONTS,
  type PageTone,
  type ReadingFont
} from "@/lib/reading-prefs";

const ease = [0.76, 0, 0.24, 1] as const;

const FONT_FAMILY: Record<ReadingFont, string> = {
  default: "var(--font-sans), system-ui, sans-serif",
  literata: "var(--font-literata), Georgia, serif",
  source: "var(--font-source), system-ui, sans-serif",
  fraunces: "var(--font-fraunces), Georgia, serif"
};

const SIZE_LABELS = ["A", "A", "A", "A", "A"] as const;
const SIZE_CLASS = ["text-[12px]", "text-[14px]", "text-[16px]", "text-[19px]", "text-[22px]"] as const;

export function ReadingDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useCopy();
  const { prefs, update, reset } = useReading();
  const closeRef = useRef<HTMLButtonElement>(null);
  const copy = t.reading;

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.button
          key="reading-overlay"
          type="button"
          aria-label={copy.close[lang]}
          className="fixed inset-0 z-[70] bg-canvas/50 backdrop-blur-[2px]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
        />
      )}
      {open && (
        <motion.aside
          key="reading-panel"
          id="reading-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reading-drawer-title"
          className="fixed inset-y-0 right-0 z-[80] flex w-[min(100vw,22rem)] flex-col border-l border-line bg-elevated shadow-2xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-5">
            <h2
              id="reading-drawer-title"
              className="text-[12px] font-medium uppercase tracking-[0.18em]"
            >
              {copy.title[lang]}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="text-[11px] uppercase tracking-[0.16em] text-muted transition hover:text-ink"
            >
              {copy.close[lang]}
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
            <section>
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-soft">{copy.page[lang]}</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {PAGE_TONES.map((tone) => (
                  <PageOption
                    key={tone}
                    tone={tone}
                    label={copy.pages[tone][lang]}
                    selected={prefs.page === tone}
                    onSelect={() => update({ page: tone })}
                  />
                ))}
              </div>
            </section>

            <RangeField
              id="reading-brightness"
              label={copy.brightness[lang]}
              value={prefs.brightness}
              onChange={(brightness) => update({ brightness })}
            />
            <RangeField
              id="reading-warmth"
              label={copy.warmth[lang]}
              value={prefs.warmth}
              onChange={(warmth) => update({ warmth })}
            />

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-soft">{copy.size[lang]}</h3>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {SIZE_LABELS.map((label, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-pressed={prefs.size === index}
                    aria-label={`${copy.size[lang]} ${index + 1}`}
                    onClick={() => update({ size: index })}
                    className={`grid h-12 place-items-center rounded-2xl border transition ${SIZE_CLASS[index]} ${
                      prefs.size === index
                        ? "border-accent text-ink"
                        : "border-line text-muted hover:border-accent/40 hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-soft">{copy.font[lang]}</h3>
              <div className="mt-3 grid gap-2">
                {READING_FONTS.map((font) => (
                  <button
                    key={font}
                    type="button"
                    aria-pressed={prefs.font === font}
                    onClick={() => update({ font })}
                    style={{ fontFamily: FONT_FAMILY[font] }}
                    className={`rounded-2xl border px-4 py-3 text-left text-[15px] transition ${
                      prefs.font === font
                        ? "border-accent text-ink"
                        : "border-line text-muted hover:border-accent/40 hover:text-ink"
                    }`}
                  >
                    {copy.fonts[font][lang]}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="border-t border-line px-5 py-4">
            <button
              type="button"
              onClick={reset}
              className="text-[11px] uppercase tracking-[0.16em] text-muted underline-offset-4 transition hover:text-ink hover:underline"
            >
              {copy.reset[lang]}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function PageOption({
  tone,
  label,
  selected,
  onSelect
}: {
  tone: PageTone;
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-[12px] transition ${
        selected
          ? "border-accent text-ink"
          : "border-line text-muted hover:border-accent/40 hover:text-ink"
      }`}
    >
      <span
        aria-hidden
        className="h-5 w-5 shrink-0 rounded-full border border-line"
        style={{ background: PAGE_SWATCHES[tone] }}
      />
      {label}
    </button>
  );
}

function RangeField({
  id,
  label,
  value,
  onChange
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[11px] uppercase tracking-[0.22em] text-soft">
          {label}
        </label>
        <span className="font-mono text-[11px] text-muted">{value}</span>
      </div>
      <input
        id={id}
        className="reading-range mt-4"
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        style={{ ["--range-fill" as string]: `${value}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </section>
  );
}
