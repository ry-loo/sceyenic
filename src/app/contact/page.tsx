import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default function ContactPage() {
  return (
    <div className="px-3 pt-20 pb-12 sm:px-6 sm:pt-24 sm:pb-16 lg:px-10">
      <article className="album-page relative mx-auto max-w-[640px] overflow-hidden rounded-sm px-6 py-12 sm:px-12 sm:py-16">
        <p className="font-caption text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          Leave a note
        </p>
        <h1 className="mt-4 text-3xl tracking-wide text-[var(--ink)] sm:text-4xl">
          Contact
        </h1>
        <p className="mt-5 font-caption text-[11px] leading-relaxed tracking-[0.04em] text-[var(--muted)]">
          For bookings and collaborations — or email{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-[var(--ink)] underline decoration-[rgba(60,50,30,0.35)] underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </article>
    </div>
  );
}
