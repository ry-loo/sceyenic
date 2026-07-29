import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/data/portfolio";
import "./globals.css";

const typewriter = Special_Elite({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

const typewriterBody = Special_Elite({
  variable: "--font-body",
  subsets: ["latin"],
  weight: "400",
});

const typewriterCaption = Special_Elite({
  variable: "--font-caption",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — Photography`,
    template: `%s — ${site.name}`,
  },
  description:
    "sceyenic photography portfolio — an analog album of street, photojournalism, graduation, headshots, and events.",
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
      className={`${typewriter.variable} ${typewriterBody.variable} ${typewriterCaption.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
