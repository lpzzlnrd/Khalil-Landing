import type { Metadata } from "next";
import { fraunces, inter, jetbrainsMono, montserrat } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carousels Selling — KLEY STUDIO",
  description:
    "Instala un Sistema de Adquisición Paralelo en tu Instagram. Done-for-you para coaches, consultores e infoproductores que ya facturan +100K€/mes.",
  icons: {
    icon: "/KS.png",
    shortcut: "/KS.png",
    apple: "/KS.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
