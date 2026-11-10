"use client";

import type { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Components } from "react-markdown";

const components: Components = {
  a: ({ href, children }) => {
    const isInternal = href?.startsWith("/");
    if (isInternal && href) {
      return (
        <Link href={href} className="blog-link">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className="blog-link">
        {children}
      </a>
    );
  },
  h2: ({ children, id }) => {
    const label = headingLabel(children)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
    const adr = ADR_HEADINGS.has(label);
    return (
      <h2 id={id} className={adr ? "blog-h2 adr-h2" : "blog-h2"}>
        {children}
      </h2>
    );
  },
  h3: ({ children, id }) => (
    <h3 id={id} className="blog-h3">
      {children}
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4 id={id} className="blog-h4">
      {children}
    </h4>
  ),
  blockquote: ({ children }) => <blockquote className="blog-blockquote">{children}</blockquote>,
  hr: () => <hr className="blog-hr" />,
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="blog-inline-code" {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="blog-pre">{children}</pre>,
  table: ({ children }) => (
    <div className="blog-table-wrap">
      <table className="blog-table">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="blog-th">{children}</th>,
  td: ({ children }) => <td className="blog-td">{children}</td>
};

function headingLabel(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(headingLabel).join("");
  if (children && typeof children === "object" && "props" in children) {
    return headingLabel((children as ReactElement).props.children);
  }
  return "";
}

const ADR_HEADINGS = new Set(["context", "contexto", "decision", "decisión", "trade-offs", "tradeoffs", "outcome", "resultado"]);

type MdNode = {
  type?: string;
  depth?: number;
  children?: MdNode[];
  data?: { hProperties?: Record<string, string> };
};

function remarkHeadingIds(ids: string[]) {
  return function headingIdsPlugin() {
    return (tree: MdNode) => {
      let index = 0;
      const walk = (node: MdNode | undefined) => {
        if (!node || typeof node !== "object") return;
        if (node.type === "heading" && node.depth && node.depth >= 2 && node.depth <= 4) {
          const id = ids[index];
          index += 1;
          if (id) node.data = { ...node.data, hProperties: { ...(node.data?.hProperties ?? {}), id } };
        }
        node.children?.forEach(walk);
      };
      walk(tree);
    };
  };
}

export function BlogProse({
  markdown,
  headingIds
}: {
  markdown: string;
  headingIds?: string[];
}) {
  const plugins = headingIds?.length ? [remarkGfm, remarkHeadingIds(headingIds)] : [remarkGfm];

  return (
    <div className="blog-prose">
      <ReactMarkdown remarkPlugins={plugins} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
