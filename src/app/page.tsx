import Image from "next/image";
import Link from "next/link";
import { categories, site } from "@/data/portfolio";

export default function HomePage() {
  const hero = categories[0]?.images[0];

  return (
    <>
      <section className="relative flex min-h-dvh items-end overflow-hidden bg-[#000]">
        {hero && (
          <Image
            src={hero.src}
            alt=""
            fill
            priority
            className="animate-hero-image object-cover opacity-70"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
          <h1 className="animate-fade-up font-display text-[clamp(3.5rem,12vw,8rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-white">
            {site.name}
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-md text-[17px] leading-relaxed font-light text-white/75 sm:text-[19px]"
            style={{ animationDelay: "120ms" }}
          >
            Photography with clarity, timing, and quiet precision.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              href="#work"
              className="rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-[#1d1d1f] transition-transform hover:scale-[1.02]"
            >
              View work
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/35 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-16 bg-[#f5f5f7] py-20 sm:py-28">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
          <div className="mb-12 max-w-2xl sm:mb-16">
            <p className="text-[12px] font-medium tracking-[0.16em] text-[#86868b] uppercase">
              Selected work
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-[#1d1d1f]">
              Five disciplines. One standard.
            </h2>
          </div>

          <div className="animate-stagger grid gap-5 md:grid-cols-2 lg:gap-6">
            {categories.map((category, index) => {
              const cover = category.images[0];
              const wide = index === 0 || index === 3;
              return (
                <Link
                  key={category.slug}
                  href={`/work/${category.slug}`}
                  className={`group relative overflow-hidden rounded-[28px] bg-[#e8e8ed] ${
                    wide ? "md:col-span-2 min-h-[420px] lg:min-h-[520px]" : "min-h-[360px] lg:min-h-[440px]"
                  }`}
                >
                  {cover && (
                    <Image
                      src={cover.src}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      sizes={wide ? "100vw" : "50vw"}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                    <h3 className="font-display text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
                      {category.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] text-white/70">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-8">
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-[#1d1d1f]">
            Ready when you are.
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#86868b]">
            Commissions, collaborations, and quiet conversations about what the
            frame should hold.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-[#1d1d1f] px-6 py-3 text-[14px] font-medium text-white transition-transform hover:scale-[1.02]"
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
