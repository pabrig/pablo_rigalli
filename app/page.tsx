import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Impact } from "@/components/Impact";
import { Experience } from "@/components/Experience";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Panel } from "@/components/Panel";
import { BlogTeaser } from "@/components/BlogTeaser";
import { getAllPosts } from "@/lib/blog";

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <main className="relative min-h-screen">
      <Header />
      <Panel framed={false} className="bg-canvas pb-24 md:pb-32">
        <Hero />
      </Panel>
      <Panel className="bg-panel">
        <Impact />
      </Panel>
      <Panel className="bg-canvas">
        <Experience />
      </Panel>
      <Panel className="bg-panel">
        <Stack />
      </Panel>
      <Panel className="bg-canvas">
        <BlogTeaser posts={posts} />
      </Panel>
      <Panel className="bg-panel">
        <Contact />
        <Footer />
      </Panel>
    </main>
  );
}
