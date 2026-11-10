import type { Lang } from "@/lib/content";

export type RelatedLink = {
  href: string;
  title: Record<Lang, string>;
};

export function noteHref(slug: string) {
  return `/notes/${slug}`;
}

export function blogHref(slug: string) {
  return `/blog/${slug}`;
}
