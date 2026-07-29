import type { Metadata } from "next";
import { IBM_Plex_Mono, Outfit } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/data/portfolio";
import "./globals.css";

const brand = Outfit({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const nav = IBM_Plex_Mono({
  variable: "--font-nav",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Photography`,
    template: `%s — ${site.name}`,
  },
  description:
    "sceyenic photography portfolio — street, photojournalism, graduation, headshots, and events.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${brand.variable} ${nav.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#1a1a1a]">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
