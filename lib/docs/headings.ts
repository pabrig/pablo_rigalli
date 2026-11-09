import type { DocsHeading } from "./types";

export function slugifyHeading(text: string) {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return slug || "seccion";
}

export function extractHeadings(markdown: string): DocsHeading[] {
  const seen = new Map<string, number>();
  const headings: DocsHeading[] = [];

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const depth = match[1].length as 2 | 3 | 4;
    const text = match[2].replace(/[*_`]/g, "").trim();
    let id = slugifyHeading(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    headings.push({ depth, text, id });
  }

  return headings;
}

export function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
