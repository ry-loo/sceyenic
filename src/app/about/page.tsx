import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import { site } from "@/data/portfolio";

const script = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "About",
  description: `About Ryan — ${site.name} photography.`,
};

export default function AboutPage() {
  return (
    <div
      className={`${script.variable} relative pt-28 pb-24 sm:pt-36 sm:pb-32`}
    >
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-16 xl:gap-20">
          <div
            className="relative aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] lg:sticky lg:top-32"
            aria-label="Portrait photo"
          />

          <article className="min-w-0 pt-2 lg:pt-6">
            <h1
              className="text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.1] font-semibold tracking-[-0.01em] text-white"
              style={{ fontFamily: "var(--font-script), cursive" }}
            >
              hey, i&apos;m ryan!
            </h1>

            <div className="mt-8 space-y-6 text-[16px] leading-[1.75] text-white/60 sm:text-[17px]">
              <p>
                I&apos;m a Stanford-based street photographer with a passion for
                capturing the nuance of the human experience through compelling
                visual storytelling. My work spans six continents and over 37
                countries, documenting a diverse range of people, places, and
                moments.
              </p>
              <p>
                While street photography remains my first love, I also have
                experience with a wide range of professional photography
                work—from individual portrait sessions to graduation photos,
                headshots for White House employees and Churchill Scholarship
                recipients, and regional events across the West Coast. My style
                leans heavily toward candid imagery, aiming to preserve authentic
                moments as they naturally unfold.
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
