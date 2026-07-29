"use client";

import { FormEvent, useState } from "react";
import { site } from "@/data/portfolio";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Inquiry from ${name || "website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  const fieldClass =
    "mt-2 w-full border-0 border-b border-[rgba(60,50,30,0.3)] bg-transparent py-2 font-caption text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--ink)]";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="font-caption text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
          Name
        </span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="font-caption text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
          Email
        </span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="font-caption text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
          Message
        </span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className={`${fieldClass} resize-y`}
        />
      </label>
      <button
        type="submit"
        className="mt-2 border border-[rgba(60,50,30,0.35)] px-4 py-2 font-caption text-[10px] tracking-[0.16em] text-[var(--ink)] uppercase transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
      >
        Send
      </button>
    </form>
  );
}
