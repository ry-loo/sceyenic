"use client";

import { useEffect, useState } from "react";

/**
 * Fixed cinematic orange light-leak + film-grain backdrop.
 * pointer-events: none — never blocks interaction.
 */
export function AmbientLightLeaks() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      className={`ambient-leaks${paused ? " ambient-leaks--paused" : ""}`}
      aria-hidden="true"
    >
      <div className="ambient-leaks__field">
        <span className="leak leak--1" />
        <span className="leak leak--2" />
        <span className="leak leak--3" />
        <span className="leak leak--4" />
        <span className="leak leak--5" />
      </div>
      <div className="ambient-leaks__grain" />
    </div>
  );
}
