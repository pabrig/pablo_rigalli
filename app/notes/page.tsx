import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getManual } from "@/lib/docs";
import { defaultOgImage, SITE_URL } from "@/lib/blog/og";
import { noteHref } from "@/lib/paths";

export function generateMetadata(): Metadata {
  const manual = getManual();
  return {
    title: manual.title.es,
    description: manual.description.es,
    openGraph: {
      title: manual.title.es,
      description: manual.description.es,
      url: `${SITE_URL}/notes`,
      siteName: "Pablo Rigalli",
      locale: "es_AR",
      type: "website",
      images: [defaultOgImage(manual.title.es)]
    },
    twitter: {
      card: "summary_large_image",
      title: manual.title.es,
      description: manual.description.es,
      images: [defaultOgImage(manual.title.es).url]
    }
  };
}

export default function DocsIndexPage() {
  const first = getManual().pages[0];
  if (!first) return <DocsEmpty />;
  redirect(noteHref(first.slug));
}

function DocsEmpty() {
  return (
    <p className="text-muted">Las notas todavía no tienen secciones.</p>
  );
}
