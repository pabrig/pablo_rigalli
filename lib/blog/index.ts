import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Lang } from "@/lib/content";

export type BlogPostMeta = {
  slug: string;
  date: string;
  readingMinutes: number;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: string[];
  published: boolean;
};

export type BlogPost = BlogPostMeta & {
  body: Record<Lang, string>;
};

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function localePath(slug: string, lang: Lang) {
  return path.join(CONTENT_DIR, `${slug}.${lang}.md`);
}

/** Gemini sometimes omits --- delimiters; gray-matter then treats YAML as body and title falls back to slug. */
function repairMarkdownRaw(raw: string): string {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (normalized.trimStart().startsWith("---")) return raw;
  if (!normalized.trimStart().startsWith("title:")) return raw;

  const lines = normalized.split("\n");
  const publishedIdx = lines.findIndex((line) =>
    /^published:\s*(true|false)\s*$/i.test(line.trim())
  );
  if (publishedIdx < 0) return raw;

  let bodyStart = publishedIdx + 1;
  while (bodyStart < lines.length && lines[bodyStart].trim() === "") {
    bodyStart += 1;
  }

  const fmLines = lines.slice(0, publishedIdx + 1);
  const rebuilt: string[] = [];
  let inTags = false;

  for (const line of fmLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("tags:")) {
      inTags = true;
      rebuilt.push("tags:");
      continue;
    }
    if (inTags && /^published:/i.test(trimmed)) {
      inTags = false;
      rebuilt.push(line);
      continue;
    }
    if (inTags && trimmed && !trimmed.includes(":")) {
      rebuilt.push(`  - ${trimmed}`);
      continue;
    }
    if (!inTags) rebuilt.push(line);
  }

  const body = lines.slice(bodyStart).join("\n");
  return `---\n${rebuilt.join("\n")}\n---\n\n${body}`;
}

function normalizeDate(value: unknown): string {
  const s = String(value ?? "").trim();
  if (!s) return "";
  const d = new Date(`${s}T12:00:00`);
  if (Number.isNaN(d.getTime())) return s;
  return s.length >= 10 ? s.slice(0, 10) : d.toISOString().slice(0, 10);
}

function parseLocaleFile(slug: string, lang: Lang) {
  const filePath = localePath(slug, lang);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const repaired = repairMarkdownRaw(raw);
  const { data, content } = matter(repaired);
  if (process.env.NODE_ENV === "development" && !data.title && raw.trimStart().startsWith("title:")) {
    console.warn(
      `[blog] ${slug}.${lang}.md: frontmatter not parsed — wrap YAML between --- lines (see content/blog/gemini-prompt.txt).`
    );
  }
  return { data, content: content.trim() };
}

function discoverSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR);
  const slugs = new Set<string>();
  for (const file of files) {
    const match = file.match(/^(.+)\.(es|en)\.md$/);
    if (match) slugs.add(match[1]);
  }
  return Array.from(slugs);
}

function buildMeta(slug: string): BlogPostMeta | null {
  const es = parseLocaleFile(slug, "es");
  const en = parseLocaleFile(slug, "en");
  const base = es?.data ?? en?.data;
  if (!base) return null;

  const published = base.published !== false;
  if (!published) return null;

  return {
    slug,
    date: normalizeDate(base.date),
    readingMinutes: Number(base.readingMinutes ?? 6),
    title: {
      es: String(es?.data.title ?? en?.data.title ?? slug),
      en: String(en?.data.title ?? es?.data.title ?? slug)
    },
    description: {
      es: String(es?.data.description ?? en?.data.description ?? ""),
      en: String(en?.data.description ?? es?.data.description ?? "")
    },
    tags: Array.isArray(base.tags) ? base.tags.map(String) : [],
    published
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return discoverSlugs()
    .map((slug) => buildMeta(slug))
    .filter((p): p is BlogPostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const meta = buildMeta(slug);
  if (!meta) return null;

  const es = parseLocaleFile(slug, "es");
  const en = parseLocaleFile(slug, "en");
  if (!es && !en) return null;

  return {
    ...meta,
    body: {
      es: es?.content ?? en?.content ?? "",
      en: en?.content ?? es?.content ?? ""
    }
  };
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
