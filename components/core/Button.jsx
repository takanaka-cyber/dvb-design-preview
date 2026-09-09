import React, { useState } from "react";

const V = {
  primary:     { bg: "var(--primary)", fg: "var(--primary-foreground)", bd: "var(--primary)", hbg: "var(--primary-hover)" },
  secondary:   { bg: "var(--card)", fg: "var(--foreground)", bd: "var(--border)", hbg: "var(--muted)" },
  ghost:       { bg: "transparent", fg: "var(--foreground)", bd: "transparent", hbg: "var(--muted)" },
  destructive: { bg: "var(--destructive)", fg: "var(--destructive-foreground)", bd: "var(--destructive)", hbg: "oklch(0.505 0.213 27)" },
  link:        { bg: "transparent", fg: "var(--primary)", bd: "transparent", hbg: "transparent" },
};

/** ボタン。1画面に primary は1つ。高さ 36 (md) / 32 (sm)。 */
export function Button({ variant = "secondary", size = "md", icon, children, loading, disabled, block, type = "button", onClick, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const v = V[variant] || V.secondary;
  const sm = size === "sm";
  const off = disabled || loading;
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = icon && L && L[icon];
  return (
    <button type={type} disabled={off} onClick={onClick} aria-busy={loading || undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: block ? "flex" : "inline-flex", width: block ? "100%" : undefined, alignItems: "center", justifyContent: "center", gap: 6,
        height: sm ? 32 : 36, minWidth: sm ? 56 : 64, padding: sm ? "0 10px" : "0 14px",
        fontSize: sm ? 13 : 14, fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap",
        borderRadius: sm ? "var(--radius-sm)" : "var(--radius)", border: `1px solid ${v.bd}`,
        background: hover && !off ? v.hbg : v.bg, color: v.fg,
        opacity: off ? 0.5 : 1, cursor: off ? "not-allowed" : "pointer",
        textDecoration: variant === "link" && hover ? "underline" : "none",
        transition: "background var(--duration) var(--ease)", ...style,
      }} {...rest}>
      {loading ? <Spinner /> : I ? <I size={sm ? 14 : 16} strokeWidth={1.75} aria-hidden /> : null}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ animation: "dvb-spin 0.8s linear infinite" }}>
      <style>{`@keyframes dvb-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){svg{animation:none!important}}`}</style>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Button = Button; }
