import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} photography.`,
};

export default function AboutPage() {
  return (
    <div className="px-3 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16 lg:px-10">
      <article className="album-page relative mx-auto max-w-[720px] overflow-hidden rounded-sm px-6 py-12 sm:px-12 sm:py-16">
        <p className="font-caption text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Notes in the margin
        </p>
        <h1 className="mt-4 text-3xl tracking-wide text-[var(--ink)] sm:text-4xl">
          About {site.name}
        </h1>
        <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-[#3a352c]">
          <p>
            This site is meant to feel like a physical album — prints with torn
            edges, tape, and a little grit. The work spans street,
            photojournalism, graduation, headshots, and events.
          </p>
          <p>
            Clarity and timing over spectacle. Listen first, then shoot with
            intention.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-10 inline-block border border-[rgba(60,50,30,0.35)] px-4 py-2 font-caption text-[10px] tracking-[0.16em] text-[var(--ink)] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
        >
          Get in touch
        </Link>
      </article>
    </div>
  );
}
