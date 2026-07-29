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

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="nav-link mb-2 block text-[#888]">Name</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border-0 border-b border-[#ddd] bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#111]"
        />
      </label>
      <label className="block">
        <span className="nav-link mb-2 block text-[#888]">Email</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-0 border-b border-[#ddd] bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#111]"
        />
      </label>
      <label className="block">
        <span className="nav-link mb-2 block text-[#888]">Message</span>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full resize-y border-0 border-b border-[#ddd] bg-transparent py-2 text-sm outline-none transition-colors focus:border-[#111]"
        />
      </label>
      <button
        type="submit"
        className="nav-link mt-2 border border-[#111] px-5 py-2.5 text-[#111] transition-colors hover:bg-[#111] hover:text-white"
      >
        Send
      </button>
    </form>
  );
}
