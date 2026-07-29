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
    "mt-2 w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-[15px] text-white outline-none transition-shadow placeholder:text-white/35 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.08)]";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="text-[13px] font-medium text-white/80">Name</span>
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
        <span className="text-[13px] font-medium text-white/80">Email</span>
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
        <span className="text-[13px] font-medium text-white/80">Message</span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className={`${fieldClass} resize-y`}
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[#1d1d1f] transition-transform hover:scale-[1.02]"
      >
        Send message
      </button>
    </form>
  );
}
