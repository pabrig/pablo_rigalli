import type { Lang } from "@/lib/content";

export type DocsHeading = {
  depth: 2 | 3 | 4;
  text: string;
  id: string;
};

export type DocsChapter = {
  id: string;
  order: number;
  number: string;
  title: Record<Lang, string>;
};

export type DocsPageMeta = {
  slug: string;
  order: number;
  number: string;
  chapter: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: string[];
  headings: Record<Lang, DocsHeading[]>;
  plain: Record<Lang, string>;
};

export type DocsPage = DocsPageMeta & {
  body: Record<Lang, string>;
};

export type DocsManual = {
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  chapters: DocsChapter[];
  pages: DocsPageMeta[];
};
