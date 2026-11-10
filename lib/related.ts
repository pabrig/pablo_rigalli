import { getAllPosts } from "@/lib/blog";
import { getManual } from "@/lib/docs";
import { blogHref, noteHref, type RelatedLink } from "@/lib/paths";

export type { RelatedLink };

const PAIRS: { note: string; post: string }[] = [
  { note: "software-design-principles-and-patterns", post: "product-plus-software-challenge-before-code" },
  { note: "hexagonal_architecture_ports_and_adapters", post: "product-plus-software-challenge-before-code" },
  { note: "backend-architecture", post: "product-plus-software-challenge-before-code" },
  { note: "modern_frontend_systems_architecture", post: "product-plus-software-challenge-before-code" },
  { note: "frontend_scalability_and_module_federation", post: "product-plus-software-challenge-before-code" },
  { note: "ai_systems_rag_architectures_and_context_management", post: "the-new-art-of-code-from-line-craft-to-critical-judgment" },
  { note: "ai_systems_rag_architectures_and_context_management", post: "timeless-git-tools-for-agentic-workflow" },
  { note: "ai_systems_rag_architectures_and_context_management", post: "shaping-digital-personalities" },
  { note: "solid_principles_and_advanced_design_patterns", post: "the-new-art-of-code-from-line-craft-to-critical-judgment" },
  { note: "telemetry_sampling_and_cardinality_management", post: "timeless-git-tools-for-agentic-workflow" },
  { note: "docker_and_kubernetes_foundations", post: "timeless-git-tools-for-agentic-workflow" }
];

export function postsForNote(slug: string): RelatedLink[] {
  const wanted = PAIRS.filter((pair) => pair.note === slug).map((pair) => pair.post);
  const posts = getAllPosts();
  return wanted.flatMap((id) => {
    const post = posts.find((item) => item.slug === id);
    if (!post) return [];
    return [{ href: blogHref(post.slug), title: post.title }];
  });
}

export function notesForPost(slug: string): RelatedLink[] {
  const wanted = PAIRS.filter((pair) => pair.post === slug).map((pair) => pair.note);
  const pages = getManual().pages;
  return wanted.flatMap((id) => {
    const page = pages.find((item) => item.slug === id);
    if (!page) return [];
    return [{ href: noteHref(page.slug), title: page.title }];
  });
}
