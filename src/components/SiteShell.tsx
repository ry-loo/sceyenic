"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, site } from "@/data/portfolio";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
          scrolled || open
            ? "border-b border-black/5 bg-white/75 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-5 sm:h-14 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-display text-[17px] font-semibold tracking-[-0.02em] text-[#1d1d1f] transition-opacity hover:opacity-70"
          >
            {site.name}
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-normal tracking-[-0.01em] text-[#1d1d1f]/80 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="text-[13px] text-[#1d1d1f]/80 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`border-t border-black/5 bg-white/95 backdrop-blur-xl md:hidden ${
            open ? "block" : "hidden"
          }`}
        >
          <nav className="flex flex-col gap-1 px-5 py-6" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-6 grid gap-2 border-t border-black/5 pt-6">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/work/${c.slug}`}
                  className="py-1 text-[15px] text-[#86868b] transition-colors hover:text-[#1d1d1f]"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-black/5 bg-[#f5f5f7]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              {site.name}
            </p>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-[#86868b]">
              Photography across street, photojournalism, graduation, headshots,
              and events.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#86868b]">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="transition-colors hover:text-[#1d1d1f]"
              >
                {c.title}
              </Link>
            ))}
            <Link href="/about" className="transition-colors hover:text-[#1d1d1f]">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[#1d1d1f]">
              Contact
            </Link>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-5 pb-10 text-[12px] text-[#86868b] sm:px-8 lg:px-10">
          © {new Date().getFullYear()} {site.name}
        </div>
      </footer>
    </div>
  );
}
