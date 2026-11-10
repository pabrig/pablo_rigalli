import type { Metadata } from "next";
import type { Lang } from "@/lib/content";
import type { BlogPost } from "@/lib/blog";

export const SITE_URL = "https://pablo-rigalli.vercel.app";

/** Fallback when frontmatter has no `image` (file: public/og-image.png). */
export const DEFAULT_OG_IMAGE_PATH = "/og-image.png";

export function blogPostPath(slug: string, lang?: Lang): string {
  const base = `/blog/${slug}`;
  return lang ? `${base}?lang=${lang}` : base;
}

export function blogPostUrl(slug: string, lang?: Lang): string {
  return `${SITE_URL}${blogPostPath(slug, lang)}`;
}

export function defaultOgImage(alt = "Pablo Rigalli — Senior Software & Product-Minded Engineer") {
  return {
    url: `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
    width: 1200,
    height: 630,
    alt
  };
}

export function resolveOgImageUrl(image?: string): string {
  const fallback = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;
  const raw = image?.trim();
  if (!raw) return fallback;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${SITE_URL}${raw}`;
  return `${SITE_URL}/${raw}`;
}

function localeAvailable(post: BlogPost, lang: Lang): boolean {
  return post.title[lang].trim().length > 0 && post.description[lang].trim().length > 0;
}

/** Primary locale for HTML metadata (site default). */
const PRIMARY_LANG: Lang = "es";

export function blogPostMetadata(post: BlogPost): Metadata {
  const canonical = blogPostUrl(post.slug);
  const imageUrl = resolveOgImageUrl(post.image);

  const languages: Record<string, string> = {
    "x-default": canonical
  };
  if (localeAvailable(post, "es")) languages["es-AR"] = blogPostUrl(post.slug, "es");
  if (localeAvailable(post, "en")) languages["en-US"] = blogPostUrl(post.slug, "en");

  const alternateLocale: string[] = [];
  if (localeAvailable(post, "en")) alternateLocale.push("en_US");
  if (localeAvailable(post, "es")) alternateLocale.push("es_AR");

  const primary = PRIMARY_LANG;
  const title = post.title[primary] || post.title.en || post.title.es;
  const description =
    post.description[primary] || post.description.en || post.description.es;
  const ogLocale = primary === "es" ? "es_AR" : "en_US";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Pablo Rigalli",
      locale: ogLocale,
      alternateLocale: alternateLocale.filter((l) => l !== ogLocale),
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    alternates: {
      canonical,
      languages
    }
  };
}

export function blogIndexMetadata(): Metadata {
  const canonical = `${SITE_URL}/blog`;
  const imageUrl = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;
  return {
    title: "Blog",
    description:
      "Notas sobre producto, arquitectura e ingeniería aumentada con IA — Pablo Rigalli.",
    alternates: {
      canonical,
      languages: {
        "x-default": canonical,
        "es-AR": `${canonical}?lang=es`,
        "en-US": `${canonical}?lang=en`
      }
    },
    openGraph: {
      url: canonical,
      siteName: "Pablo Rigalli",
      locale: "es_AR",
      alternateLocale: ["en_US"],
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Pablo Rigalli" }]
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog · Pablo Rigalli",
      images: [imageUrl]
    }
  };
}
