import React from "react";

/** lucide アイコンのラッパ。name は lucide-react のコンポーネント名（PascalCase）。 */
export function Icon({ name, size = 16, strokeWidth = 1.75, color = "currentColor", style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Cmp = L && L[name];
  if (!Cmp) return <span aria-hidden style={{ display: "inline-block", width: size, height: size, ...style }} />;
  return <Cmp size={size} strokeWidth={strokeWidth} color={color} aria-hidden style={{ flexShrink: 0, ...style }} />;
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Icon = Icon; }
