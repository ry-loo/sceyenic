import Link from "next/link";
import { TornPhoto } from "@/components/TornPhoto";
import { categories, site } from "@/data/portfolio";

export default function HomePage() {
  return (
    <>
      {/* Album cover */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#141210] px-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 40%, rgba(90,70,40,0.35), transparent 55%), linear-gradient(180deg, #1a1713, #0e0c0a)",
          }}
        />
        <div className="relative z-10 w-full max-w-xl text-center">
          <p className="animate-fade-up font-caption text-[11px] tracking-[0.35em] text-[#8a7f6c] uppercase">
            Photo album
          </p>
          <h1 className="animate-fade-up mt-6 font-display text-[clamp(2.75rem,10vw,5.5rem)] leading-none tracking-[0.12em] text-[#e8e2d4] uppercase">
            {site.name}
          </h1>
          <p
            className="animate-fade-up mx-auto mt-6 max-w-sm text-[14px] leading-relaxed text-[#9a9080]"
            style={{ animationDelay: "100ms" }}
          >
            Prints, torn edges, and pages you can almost turn.
          </p>
          <Link
            href="#album"
            className="animate-fade-up mt-10 inline-block border border-[#6a6050] px-5 py-2.5 font-caption text-[11px] tracking-[0.2em] text-[#d4cbb8] uppercase transition-colors hover:border-[#d4cbb8] hover:text-[#e8e2d4]"
            style={{ animationDelay: "180ms" }}
          >
            Open album
          </Link>
        </div>
      </section>

      {/* Open album spread */}
      <section id="album" className="scroll-mt-14 px-3 py-10 sm:px-6 sm:py-16 lg:px-10">
        <div className="album-page album-spine relative mx-auto max-w-[1180px] overflow-hidden rounded-sm px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="mb-10 flex flex-col gap-2 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-caption text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
                Contents
              </p>
              <h2 className="mt-2 text-2xl tracking-wide text-[var(--ink)] sm:text-3xl">
                Five chapters
              </h2>
            </div>
            <p className="max-w-xs font-caption text-[10px] leading-relaxed tracking-[0.06em] text-[var(--muted)]">
              Each page holds a category — taped, tilted, a little worn.
            </p>
          </div>

          <div className="animate-stagger grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {categories.map((category, index) => {
              const cover = category.images[0];
              if (!cover) return null;
              return (
                <Link
                  key={category.slug}
                  href={`/work/${category.slug}`}
                  className={`block ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <TornPhoto
                    image={cover}
                    index={index}
                    caption={category.title}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    priority={index < 2}
                  />
                </Link>
              );
            })}
          </div>

          <p className="mt-14 text-center font-caption text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
            — end of spread —
          </p>
        </div>
      </section>
    </>
  );
}
