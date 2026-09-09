import React from "react";

/** セグメント切替。--muted 背景の枠に 2〜6 個。選択中 = 白 + shadow-sm。高さ 32。options は文字列か { value, label, icon }。 */
export function SegmentedControl({ options = [], value, onChange, "aria-label": ariaLabel, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div role="radiogroup" aria-label={ariaLabel} style={{ display: "inline-flex", alignItems: "center", gap: 2, height: 32, padding: 2, background: "var(--muted)", borderRadius: "var(--radius)", ...style }}>
      {opts.map((o) => {
        const on = o.value === value;
        const I = o.icon && L && L[o.icon];
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange && onChange(o.value)}
            style={{ height: 28, padding: "0 12px", border: 0, borderRadius: "var(--radius-sm)", background: on ? "var(--card)" : "transparent", color: on ? "var(--foreground)" : "var(--muted-foreground)", boxShadow: on ? "0 1px 2px oklch(0 0 0 / 0.08)" : "none", fontSize: 13, fontWeight: 500, lineHeight: 1, display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", whiteSpace: "nowrap", transition: "background var(--duration) var(--ease)" }}>
            {I ? <I size={14} strokeWidth={1.75} aria-hidden /> : null}{o.label}
          </button>
        );
      })}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.SegmentedControl = SegmentedControl; }
