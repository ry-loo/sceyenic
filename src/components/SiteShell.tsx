"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AmbientLightLeaks } from "@/components/AmbientLightLeaks";
import { categories, site } from "@/data/portfolio";

const primaryLinks = [
  { href: "/", label: "Graph" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const navLinkClass =
  "text-[13px] text-white/70 transition-opacity hover:opacity-100";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const isWorkPage = pathname.startsWith("/work/");

  useEffect(() => {
    setOpen(false);
    setWorkOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative min-h-dvh bg-black text-[#f5f5f7]">
      <AmbientLightLeaks />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/35 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between px-5 sm:h-14 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-70"
          >
            {site.name}
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}

            <div className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1.5 ${navLinkClass} ${
                  isWorkPage ? "text-white" : ""
                }`}
                aria-expanded={workOpen}
                aria-haspopup="true"
                onClick={() => setWorkOpen((v) => !v)}
              >
                Work
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                  className="opacity-50 transition-transform group-hover:opacity-80 group-focus-within:rotate-180"
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className={`absolute right-0 top-[calc(100%+10px)] min-w-[200px] rounded-2xl border border-white/10 bg-black/95 py-2 shadow-2xl backdrop-blur-xl transition-[opacity,transform] duration-200 ${
                  workOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
                }`}
              >
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/work/${c.slug}`}
                    className={`block px-4 py-2.5 text-[13px] transition-colors hover:bg-white/5 hover:text-white ${
                      pathname === `/work/${c.slug}`
                        ? "text-white"
                        : "text-white/65"
                    }`}
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
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
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-[28px] font-semibold tracking-[-0.03em] text-white"
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                className="flex items-center justify-between py-3 text-[28px] font-semibold tracking-[-0.03em] text-white"
                aria-expanded={workOpen}
                onClick={() => setWorkOpen((v) => !v)}
              >
                Work
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                  className={`text-white/50 transition-transform ${
                    workOpen ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M2 3.5L5 6.5L8 3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {workOpen && (
                <div className="mb-2 grid gap-1 pl-1">
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/work/${c.slug}`}
                      className="py-2 text-[17px] text-white/55"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="relative z-10">{children}</main>

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
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </footer>
    </div>
  );
}
