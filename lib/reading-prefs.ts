export const READING_STORAGE_KEY = "pr-reading";

export const PAGE_TONES = ["paper", "sepia", "light", "dark"] as const;
export const READING_FONTS = ["default", "literata", "source", "fraunces"] as const;
export const TYPE_SCALES = [0.92, 1, 1.08, 1.16, 1.28] as const;

export type PageTone = (typeof PAGE_TONES)[number];
export type ReadingFont = (typeof READING_FONTS)[number];

export type ReadingPrefs = {
  page: PageTone;
  brightness: number;
  warmth: number;
  size: number;
  font: ReadingFont;
};

export const DEFAULT_READING: ReadingPrefs = {
  page: "dark",
  brightness: 100,
  warmth: 0,
  size: 1,
  font: "default"
};

export const PAGE_SWATCHES: Record<PageTone, string> = {
  paper: "#f3efe6",
  sepia: "#f4e4c4",
  light: "#f4f4f6",
  dark: "#232328"
};

const THEME_COLORS: Record<PageTone, string> = {
  paper: "#f3efe6",
  sepia: "#f4e4c4",
  light: "#f4f4f6",
  dark: "#232328"
};

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

export function sanitizeReading(value: unknown): ReadingPrefs {
  const raw =
    value && typeof value === "object" ? (value as Partial<ReadingPrefs>) : {};
  const page = PAGE_TONES.includes(raw.page as PageTone)
    ? (raw.page as PageTone)
    : DEFAULT_READING.page;
  const font = READING_FONTS.includes(raw.font as ReadingFont)
    ? (raw.font as ReadingFont)
    : DEFAULT_READING.font;
  const size =
    typeof raw.size === "number" &&
    Number.isInteger(raw.size) &&
    raw.size >= 0 &&
    raw.size < TYPE_SCALES.length
      ? raw.size
      : DEFAULT_READING.size;

  return {
    page,
    font,
    size,
    brightness: clamp(raw.brightness, 0, 100, DEFAULT_READING.brightness),
    warmth: clamp(raw.warmth, 0, 100, DEFAULT_READING.warmth)
  };
}

export function readReadingPrefs(): ReadingPrefs {
  try {
    const raw = window.localStorage.getItem(READING_STORAGE_KEY);
    if (!raw) return DEFAULT_READING;
    return sanitizeReading(JSON.parse(raw));
  } catch {
    return DEFAULT_READING;
  }
}

export function applyReading(prefs: ReadingPrefs) {
  const root = document.documentElement;
  root.dataset.page = prefs.page;
  root.dataset.font = prefs.font;
  root.style.setProperty("--brightness", String(prefs.brightness));
  root.style.setProperty("--warmth", String(prefs.warmth));
  root.style.setProperty("--type-scale", String(TYPE_SCALES[prefs.size]));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[prefs.page]);
}

export const READING_BOOT_SCRIPT = `(function(){try{var raw=localStorage.getItem("${READING_STORAGE_KEY}");if(!raw)return;var p=JSON.parse(raw);var pages={paper:1,sepia:1,light:1,dark:1};var fonts={default:1,literata:1,source:1,fraunces:1};var scales=[0.92,1,1.08,1.16,1.28];var root=document.documentElement;if(pages[p.page])root.dataset.page=p.page;if(fonts[p.font])root.dataset.font=p.font;var b=Number(p.brightness);var w=Number(p.warmth);if(b>=0&&b<=100)root.style.setProperty("--brightness",String(Math.round(b)));if(w>=0&&w<=100)root.style.setProperty("--warmth",String(Math.round(w)));var size=Number(p.size);if(size>=0&&size<scales.length&&Math.round(size)===size)root.style.setProperty("--type-scale",String(scales[size]));}catch(e){}})();`;
