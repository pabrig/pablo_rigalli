import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, Literata, Newsreader, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { READING_BOOT_SCRIPT } from "@/lib/reading-prefs";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap"
});

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  display: "swap"
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

export const viewport: Viewport = {
  themeColor: "#232328"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pablo-rigalli.vercel.app"),
  title: {
    default: "Pablo Rigalli — Senior Software & Product-Minded Engineer",
    template: "%s · Pablo Rigalli"
  },
  description:
    "Ingeniero senior con mirada de producto. Arquitectura, React/Next.js, APIs e IA aplicada a DX. itti · Acid Labs. Argentina, remoto.",
  keywords: [
    "Pablo Rigalli",
    "Senior Software Engineer",
    "Product-Minded Engineer",
    "React",
    "Next.js",
    "itti",
    "Acid Labs"
  ],
  authors: [{ name: "Pablo Rigalli" }],
  openGraph: {
    title: "Pablo Rigalli — Senior Software & Product-Minded Engineer",
    description:
      "Construyo productos digitales donde la arquitectura y el negocio se encuentran.",
    url: "https://pablo-rigalli.vercel.app",
    siteName: "Pablo Rigalli",
    locale: "es_AR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pablo Rigalli — Product-Minded Engineer",
    description: "Arquitectura, producto y DX aumentada con IA."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${literata.variable} ${sourceSans.variable} ${fraunces.variable}`}
    >
      <body className="font-sans antialiased">
        <Script id="reading-boot" strategy="beforeInteractive">
          {READING_BOOT_SCRIPT}
        </Script>
        <div className="grain" aria-hidden />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
