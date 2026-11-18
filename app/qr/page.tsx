import type { Metadata } from "next";
import { QrClientView } from "./QrClientView";

export const metadata: Metadata = {
  title: "Compartir Portfolio · Pablo Rigalli",
  description: "Escaneá el código QR para acceder y explorar el portfolio de Pablo Rigalli.",
  robots: {
    index: true,
    follow: true
  }
};

export default function QrPage() {
  return <QrClientView />;
}
