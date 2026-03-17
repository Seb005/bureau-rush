import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Bureau Rush — La folie de l'employabilité",
  description:
    "Jeu arcade rétro où tu incarnes un conseiller en emploi dans un CJE du Québec. Survis à la bureaucratie!",
  openGraph: {
    title: "Bureau Rush — La folie de l'employabilité",
    description:
      "Survis à la bureaucratie dans ce jeu arcade rétro inspiré de Papers, Please!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${pixelFont.variable} antialiased`}>
        {/* CRT scanlines overlay */}
        <div className="crt-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
