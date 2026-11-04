import { BlogList } from "@/components/BlogList";
import { getAllPosts } from "@/lib/blog";
import { blogIndexMetadata } from "@/lib/blog/og";

export const metadata = blogIndexMetadata();

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogList posts={posts} />;
}
