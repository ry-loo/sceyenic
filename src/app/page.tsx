"use client";

import dynamic from "next/dynamic";

const PhotoGraph = dynamic(
  () => import("@/components/PhotoGraph").then((m) => m.PhotoGraph),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-dvh w-full items-center justify-center bg-transparent">
        <p className="text-[13px] tracking-[0.18em] text-white/40 uppercase">
          Loading graph…
        </p>
      </div>
    ),
  },
);

export default function HomePage() {
  return <PhotoGraph />;
}
