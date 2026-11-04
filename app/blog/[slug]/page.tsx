import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/BlogArticle";
import { getAllPosts, getAllSlugs, getPostBySlug } from "@/lib/blog";
import { blogPostMetadata } from "@/lib/blog/og";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post" };

  return blogPostMetadata(post);
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const morePosts = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return <BlogArticle post={post} morePosts={morePosts} />;
}
