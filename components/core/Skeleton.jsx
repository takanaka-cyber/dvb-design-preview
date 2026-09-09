import React from "react";

/** 読み込み中のプレースホルダ。--muted 単色、reduced-motion では静止。 */
export function Skeleton({ width = "100%", height = 14, radius = 4, style }) {
  return (
    <span aria-hidden style={{
      display: "block", width, height, borderRadius: radius, background: "var(--muted)",
      animation: "dvb-pulse 1.6s ease-in-out infinite", ...style,
    }}>
      <style>{`@keyframes dvb-pulse{50%{opacity:.55}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}`}</style>
    </span>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Skeleton = Skeleton; }
