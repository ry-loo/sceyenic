"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AmbientLightLeaks } from "@/components/AmbientLightLeaks";
import { categories, site } from "@/data/portfolio";

const links = [
  { href: "/", label: "Graph" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isGraph = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : isGraph ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isGraph]);

  return (
    <div className="relative min-h-dvh bg-black text-[#f5f5f7]">
      <AmbientLightLeaks />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-5 sm:h-14 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
          >
            {site.name}
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-white/70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
            <div className="hidden items-center gap-4 lg:flex">
              {categories.slice(0, 3).map((c) => (
                <Link
                  key={c.slug}
                  href={`/work/${c.slug}`}
                  className="text-[12px] text-white/35 transition-colors hover:text-white/80"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </nav>

          <button
            type="button"
            className="text-[13px] text-white/70 md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-black/95 px-5 py-6 md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-[28px] font-semibold tracking-[-0.03em] text-white"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/work/${c.slug}`}
                    className="py-1 text-[15px] text-white/50"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10">{children}</main>

      {!isGraph && (
        <footer className="relative z-10 border-t border-white/5 bg-black/50">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-14 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <div>
              <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-white">
                {site.name}
              </p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-white/45">
                Photography across street, photojournalism, graduation,
                headshots, and events.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/40">
              <Link href="/" className="hover:text-white">
                Graph
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/work/${c.slug}`}
                  className="hover:text-white"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
