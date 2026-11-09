import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DocsFrame } from "@/components/DocsFrame";
import { getManual } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const manual = getManual();

  return (
    <main className="relative min-h-screen bg-canvas">
      <Header />
      <div className="pt-24 md:pt-28">
        <DocsFrame manual={manual}>{children}</DocsFrame>
      </div>
      <Footer />
    </main>
  );
}
