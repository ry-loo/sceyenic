import type { Metadata } from "next";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} photography.`,
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-xl animate-fade-in pt-4 lg:pt-8">
      <h1 className="font-display text-2xl font-medium tracking-tight text-[#111] sm:text-3xl">
        About
      </h1>
      <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed font-light text-[#333]">
        <p>
          {site.name} is a photography practice spanning street, photojournalism,
          graduation, headshots, and events. The work favors clarity, timing, and
          quiet observation over spectacle.
        </p>
        <p>
          Whether documenting a public moment or making a simple portrait, the
          approach stays the same: listen first, then shoot with intention.
        </p>
        <p>
          Based wherever the assignment leads. Available for commissions and
          collaborations.
        </p>
      </div>
    </article>
  );
}
