import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteShell } from "@/components/SiteShell";
import { site } from "@/data/portfolio";
import "./globals.css";

const brand = Manrope({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${brand.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
