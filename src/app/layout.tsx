import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getConference, getEdition, getNavData } from "@/lib/content";

// Fonts are bundled in ./fonts (SIL Open Font License) so the build never depends on Google Fonts being reachable.
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-bricolage",
  display: "swap",
});
const jetbrains = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const c = getConference();
  const e = getEdition(c.current_edition);
  return {
    // The domain lives in one place: NEXT_PUBLIC_SITE_URL (see README → "Changing the domain").
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: e.name, template: `%s · ${c.name}` },
    description: e.tagline,
    icons: { icon: "/media/pycon-logo/pycon-rwanda-mark-dark-bg.svg", apple: "/media/pycon-logo/pycon-rwanda-mark-dark-bg-500px.png" },
    openGraph: { siteName: c.name, title: e.name, description: e.tagline, images: e.hero.poster ? [e.hero.poster] : undefined },
  };
}

export const viewport: Viewport = { themeColor: "#0f1626" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nav = getNavData();
  return (
    <html lang="en" className={`${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Nav data={nav} />
        <main id="main">{children}</main>
        <Footer data={nav} />
        <Reveal />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
