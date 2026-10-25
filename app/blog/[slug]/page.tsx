import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/BlogArticle";
import { getAllPosts, getAllSlugs, getPostBySlug } from "@/lib/blog";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post" };

  return {
    title: post.title.es,
    description: post.description.es,
    openGraph: {
      title: post.title.es,
      description: post.description.es,
      type: "article",
      publishedTime: post.date
    }
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const morePosts = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return <BlogArticle post={post} morePosts={morePosts} />;
}
