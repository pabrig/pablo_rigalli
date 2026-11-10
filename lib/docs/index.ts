import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang } from "@/lib/content";
import { extractHeadings, plainText } from "./headings";
import type { DocsChapter, DocsManual, DocsPage, DocsPageMeta } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/docs");
const MANUAL_PATH = path.join(CONTENT_DIR, "manual.json");

type ManualFile = {
  title?: Record<string, string>;
  description?: Record<string, string>;
  chapters?: Array<{
    id?: string;
    order?: number;
    title?: Record<string, string>;
  }>;
};

function localeText(value: Record<string, string> | undefined, fallback: string): Record<Lang, string> {
  return {
    es: String(value?.es ?? value?.en ?? fallback),
    en: String(value?.en ?? value?.es ?? fallback)
  };
}

function readManualFile(): { title: Record<Lang, string>; description: Record<Lang, string>; chapters: DocsChapter[] } {
  const empty = {
    title: { es: "Manual", en: "Docs" },
    description: { es: "", en: "" },
    chapters: [] as DocsChapter[]
  };
  if (!fs.existsSync(MANUAL_PATH)) return empty;
  const parsed = JSON.parse(fs.readFileSync(MANUAL_PATH, "utf8")) as ManualFile;
  const chapters = (parsed.chapters ?? [])
    .filter((chapter) => chapter.id)
    .map((chapter) => ({
      id: String(chapter.id),
      order: Number(chapter.order ?? 0),
      title: localeText(chapter.title, String(chapter.id))
    }))
    .sort((a, b) => a.order - b.order)
    .map((chapter, index) => ({ ...chapter, number: String(index + 1) }));

  return {
    title: localeText(parsed.title, "Manual"),
    description: localeText(parsed.description, ""),
    chapters
  };
}

function localePath(slug: string, lang: Lang) {
  return path.join(CONTENT_DIR, `${slug}.${lang}.md`);
}

function parseLocaleFile(slug: string, lang: Lang) {
  const filePath = localePath(slug, lang);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { data, content: content.trim() };
}

function discoverSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = new Set<string>();
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    const match = file.match(/^(.+)\.(es|en)\.md$/);
    if (match) slugs.add(match[1]);
  }
  return Array.from(slugs);
}

function buildPage(slug: string, withBody: boolean): DocsPage | DocsPageMeta | null {
  const es = parseLocaleFile(slug, "es");
  const en = parseLocaleFile(slug, "en");
  const base = es?.data ?? en?.data;
  if (!base || base.published === false) return null;

  const esBody = es?.content ?? en?.content ?? "";
  const enBody = en?.content ?? es?.content ?? "";
  const meta: DocsPageMeta = {
    slug,
    order: Number(base.order ?? 0),
    number: "",
    chapter: String(base.chapter ?? ""),
    title: {
      es: String(es?.data.title ?? en?.data.title ?? slug),
      en: String(en?.data.title ?? es?.data.title ?? slug)
    },
    description: {
      es: String(es?.data.description ?? en?.data.description ?? ""),
      en: String(en?.data.description ?? es?.data.description ?? "")
    },
    tags: Array.isArray(base.tags) ? base.tags.map(String) : [],
    headings: {
      es: extractHeadings(esBody),
      en: extractHeadings(enBody)
    },
    plain: {
      es: plainText(esBody),
      en: plainText(enBody)
    }
  };

  if (!withBody) return meta;
  return { ...meta, body: { es: esBody, en: enBody } };
}

function chapterRank(chapters: DocsChapter[], id: string) {
  const found = chapters.find((chapter) => chapter.id === id);
  return found ? found.order : 999;
}

export function getManual(): DocsManual {
  const manual = readManualFile();
  const sorted = discoverSlugs()
    .map((slug) => buildPage(slug, false))
    .filter((page): page is DocsPageMeta => page !== null)
    .sort((a, b) => {
      const byChapter = chapterRank(manual.chapters, a.chapter) - chapterRank(manual.chapters, b.chapter);
      if (byChapter !== 0) return byChapter;
      if (a.order !== b.order) return a.order - b.order;
      return a.slug.localeCompare(b.slug);
    });

  const section = new Map<string, number>();
  const pages = sorted.map((page) => {
    const chapter = manual.chapters.find((item) => item.id === page.chapter);
    if (!chapter) return page;
    const next = (section.get(chapter.id) ?? 0) + 1;
    section.set(chapter.id, next);
    return { ...page, number: `${chapter.number}.${next}` };
  });

  return { ...manual, pages };
}

export function getDoc(slug: string): DocsPage | null {
  const page = buildPage(slug, true);
  if (!page || !("body" in page)) return null;
  const number = getManual().pages.find((item) => item.slug === slug)?.number ?? "";
  return { ...page, number };
}

export function getDocSlugs() {
  return getManual().pages.map((page) => page.slug);
}

export function getDocNeighbors(slug: string) {
  const pages = getManual().pages;
  const index = pages.findIndex((page) => page.slug === slug);
  return {
    prev: index > 0 ? pages[index - 1] : null,
    next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : null
  };
}
