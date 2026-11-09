import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocsArticle } from "@/components/DocsArticle";
import { SITE_URL } from "@/lib/blog/og";
import { getDoc, getDocNeighbors, getDocSlugs, getManual } from "@/lib/docs";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getDoc(params.slug);
  if (!page) return { title: "Manual" };
  return {
    title: page.title.es,
    description: page.description.es,
    openGraph: {
      title: page.title.es,
      description: page.description.es,
      url: `${SITE_URL}/docs/${page.slug}`,
      siteName: "Pablo Rigalli",
      locale: "es_AR",
      type: "article"
    }
  };
}

export default function DocsPage({ params }: Props) {
  const manual = getManual();
  const source = getDoc(params.slug);
  if (!source) notFound();
  const listed = manual.pages.find((item) => item.slug === source.slug);
  const page = { ...source, number: listed?.number ?? source.number };
  const { prev, next } = getDocNeighbors(page.slug);
  const chapter = manual.chapters.find((item) => item.id === page.chapter);

  return (
    <DocsArticle
      page={page}
      chapterTitle={chapter?.title ?? { es: page.chapter, en: page.chapter }}
      chapterNumber={chapter?.number ?? ""}
      prev={prev}
      next={next}
    />
  );
}
