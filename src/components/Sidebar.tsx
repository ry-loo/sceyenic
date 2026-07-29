"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site, socialLinks } from "@/data/portfolio";
import { InstagramIcon, LinkedInIcon } from "./SocialIcons";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

export function Sidebar({ onNavigate, className = "" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full flex-col bg-white text-[#1a1a1a] ${className}`}
    >
      <Link
        href="/"
        onClick={onNavigate}
        className="group mb-10 block shrink-0 no-underline"
        aria-label={`${site.name} home`}
      >
        <span className="font-display text-[1.35rem] font-medium tracking-[0.02em] text-[#111] transition-opacity group-hover:opacity-60">
          {site.name}
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
        {navLinks.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={`nav-link w-fit py-1 transition-opacity duration-200 ${
                active
                  ? "opacity-100"
                  : "opacity-45 hover:opacity-100"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-4 pt-10">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888] transition-colors hover:text-[#111]"
            aria-label={link.label}
          >
            {link.icon === "instagram" ? (
              <InstagramIcon className="h-4 w-4" />
            ) : (
              <LinkedInIcon className="h-4 w-4" />
            )}
          </a>
        ))}
      </div>
    </aside>
  );
}
