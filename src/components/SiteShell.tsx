"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/data/portfolio";
import { Sidebar } from "./Sidebar";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh bg-white text-[#1a1a1a]">
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#eee] bg-white px-5 lg:hidden">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-[0.02em] text-[#111]"
        >
          {site.name}
        </Link>
        <button
          type="button"
          className="nav-link px-1 py-2 opacity-70 hover:opacity-100"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-30 bg-white px-5 pb-8 pt-16 transition-opacity duration-300 lg:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <Sidebar onNavigate={() => setOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-20 hidden w-[220px] px-8 py-10 lg:block">
        <div className="pointer-events-auto h-full">
          <Sidebar />
        </div>
      </div>

      <main className="min-h-dvh pt-14 lg:pt-0 lg:pl-[220px]">
        <div className="animate-fade-in px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
