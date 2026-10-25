import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Impact } from "@/components/Impact";
import { Experience } from "@/components/Experience";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Panel } from "@/components/Panel";

export default function HomePage() {
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
        <Contact />
        <Footer />
      </Panel>
    </main>
  );
}
