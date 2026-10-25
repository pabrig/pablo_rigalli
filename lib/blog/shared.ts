import type { Lang } from "@/lib/content";

export type BlogPostMeta = {
  slug: string;
  date: string;
  readingMinutes: number;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  tags: string[];
  published: boolean;
  locales: Record<Lang, boolean>;
};

export type BlogPost = BlogPostMeta & {
  body: Record<Lang, string>;
};

/** Posts that have a locale file and non-empty title for that language. */
export function postIsAvailable(post: BlogPostMeta, lang: Lang): boolean {
  if (!post.locales[lang]) return false;
  return post.title[lang].length > 0;
}

export function filterPostsByLang(posts: BlogPostMeta[], lang: Lang): BlogPostMeta[] {
  return posts.filter((p) => postIsAvailable(p, lang));
}
