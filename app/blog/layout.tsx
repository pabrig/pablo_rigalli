import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen bg-canvas">
      <Header />
      <div className="pt-24 md:pt-28">{children}</div>
      <Footer />
    </main>
  );
}
