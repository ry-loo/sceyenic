import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} photography.`,
};

export default function AboutPage() {
  return (
    <div className="bg-[#f5f5f7] pt-28 pb-24 sm:pt-36 sm:pb-32">
      <article className="mx-auto max-w-[720px] px-5 sm:px-8">
        <p className="text-[12px] font-medium tracking-[0.16em] text-[#86868b] uppercase">
          About
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.045em] text-[#1d1d1f]">
          Quiet frames. Clear intent.
        </h1>
        <div className="mt-10 space-y-6 text-[17px] leading-relaxed font-light text-[#424245]">
          <p>
            {site.name} is a photography practice spanning street,
            photojournalism, graduation, headshots, and events. The work favors
            clarity, timing, and observation over spectacle.
          </p>
          <p>
            Whether documenting a public moment or making a simple portrait, the
            approach stays the same: listen first, then shoot with intention.
          </p>
          <p>
            Available for commissions and collaborations, wherever the
            assignment leads.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-12 inline-flex rounded-full bg-[#1d1d1f] px-6 py-3 text-[14px] font-medium text-white transition-transform hover:scale-[1.02]"
        >
          Get in touch
        </Link>
      </article>
    </div>
  );
}
