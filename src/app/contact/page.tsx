import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-xl animate-fade-in pt-4 lg:pt-8">
      <h1 className="font-display text-2xl font-medium tracking-tight text-[#111] sm:text-3xl">
        Contact
      </h1>
      <p className="mt-6 text-[0.95rem] leading-relaxed font-light text-[#333]">
        For bookings, collaborations, or questions, send a note. Prefer email?
        Reach out at{" "}
        <a
          href={`mailto:${site.email}`}
          className="underline decoration-[#ccc] underline-offset-4 transition-colors hover:decoration-[#111]"
        >
          {site.email}
        </a>
        .
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </article>
  );
}
