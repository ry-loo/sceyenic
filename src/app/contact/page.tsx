import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="relative pt-28 pb-24 sm:pt-36 sm:pb-32">
      <article className="mx-auto max-w-[640px] px-5 sm:px-8">
        <p className="text-[12px] font-medium tracking-[0.16em] text-white/40 uppercase">
          Contact
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.045em] text-white">
          Let’s make something.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-white/55">
          Tell me a little about the project. Prefer email?{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-white underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white"
          >
            {site.email}
          </a>
        </p>
        <div className="mt-12 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <ContactForm />
        </div>
      </article>
    </div>
  );
}
