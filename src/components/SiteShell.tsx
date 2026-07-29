"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, site } from "@/data/portfolio";

const links = [
  { href: "/#album", label: "Album" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
    <div className="min-h-dvh bg-[var(--album)] text-[var(--ink)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#141210]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="font-display text-[15px] font-semibold tracking-[0.22em] text-[#e8e2d4] uppercase"
          >
            {site.name}
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-caption text-[11px] tracking-[0.14em] text-[#a89f8c] uppercase transition-colors hover:text-[#e8e2d4]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="font-caption text-[11px] tracking-[0.14em] text-[#a89f8c] uppercase md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/5 bg-[#141210] px-5 py-6 md:hidden">
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-caption text-sm tracking-[0.12em] text-[#e8e2d4] uppercase"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 grid gap-2 border-t border-white/10 pt-4">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/work/${c.slug}`}
                    className="font-caption text-xs tracking-[0.1em] text-[#a89f8c] uppercase"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/5 bg-[#0e0c0a]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-lg tracking-[0.2em] text-[#e8e2d4] uppercase">
              {site.name}
            </p>
            <p className="font-caption mt-2 max-w-sm text-[11px] leading-relaxed tracking-[0.06em] text-[#7a7264]">
              A physical album of street, photojournalism, graduation,
              headshots, and events.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/work/${c.slug}`}
                className="font-caption text-[10px] tracking-[0.12em] text-[#7a7264] uppercase transition-colors hover:text-[#e8e2d4]"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
