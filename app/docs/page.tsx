import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getManual } from "@/lib/docs";
import { SITE_URL } from "@/lib/blog/og";

export function generateMetadata(): Metadata {
  const manual = getManual();
  return {
    title: manual.title.es,
    description: manual.description.es,
    openGraph: {
      title: manual.title.es,
      description: manual.description.es,
      url: `${SITE_URL}/docs`,
      siteName: "Pablo Rigalli",
      locale: "es_AR",
      type: "website"
    }
  };
}

export default function DocsIndexPage() {
  const first = getManual().pages[0];
  if (!first) return <DocsEmpty />;
  redirect(`/docs/${first.slug}`);
}

function DocsEmpty() {
  return (
    <p className="text-muted">El manual todavía no tiene secciones.</p>
  );
}
