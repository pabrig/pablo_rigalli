"use client";

import { useEffect, useState } from "react";
import type { DocsHeading } from "@/lib/docs/types";

export function DocsOutline({
  headings,
  label
}: {
  headings: DocsHeading[];
  label: string;
}) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    setActive(headings[0]?.id ?? "");
    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => node !== null);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 1] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label={label}>
      <p className="text-[11px] uppercase tracking-[0.22em] text-soft">{label}</p>
      <ul className="mt-3 space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block text-[13px] leading-snug transition ${
                active === heading.id ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
