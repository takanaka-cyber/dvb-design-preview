import React from "react";

/** 空状態。1文目「なぜ空か」、2文目「次にすること」。variant="guide" で初回ガイド（手順3つ + 主ボタン1つ。ボタンは手順の下に縦積み＝表の中でも見切れない）。 */
export function EmptyState({ icon = "Inbox", title, description, action, variant = "default", steps = [], compact, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = icon && L && L[icon];
  if (variant === "guide") {
    return (
      <div style={{ padding: 24, border: "1px dashed var(--border)", borderRadius: "var(--radius)", background: "var(--card)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, ...style }}>
        <div>
          <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600 }}>{title}</div>
          {description ? <p style={{ margin: "4px 0 12px", fontSize: 14, color: "var(--muted-foreground)" }}>{description}</p> : null}
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
            {steps.map((s, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, lineHeight: "20px" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", fontSize: 12, fontWeight: 600, display: "grid", placeItems: "center", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    );
  }
  return (
    <div role="status" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: compact ? "24px 16px" : "48px 16px", gap: 4, ...style }}>
      {I ? <span style={{ width: 40, height: 40, borderRadius: "var(--radius)", background: "var(--muted)", color: "var(--muted-foreground)", display: "grid", placeItems: "center", marginBottom: 8 }}><I size={20} strokeWidth={1.5} aria-hidden /></span> : null}
      <div style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500, color: "var(--foreground)" }}>{title}</div>
      {description ? <div style={{ fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)", maxWidth: 360 }}>{description}</div> : null}
      {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.EmptyState = EmptyState; }
