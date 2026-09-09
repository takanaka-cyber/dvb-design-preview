import React from "react";

/** カード内・ページ内のセクション見出し。背景色なし。lucide アイコン + タイトル + 件数 + 右アクション。 */
export function SectionHeading({ icon, title, count, description, children, level = 2, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = icon && L && L[icon];
  const H = level === 3 ? "h3" : "h2";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 32, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        {I ? <I size={16} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" /> : null}
        <H style={{ margin: 0, fontSize: 16, lineHeight: "24px", fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap" }}>{title}</H>
        {count != null ? <span style={{ height: 20, minWidth: 24, padding: "0 6px", borderRadius: 9999, background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, lineHeight: "20px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{count}</span> : null}
        {description ? <span style={{ fontSize: 13, color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{description}</span> : null}
      </div>
      {children ? <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{children}</div> : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.SectionHeading = SectionHeading; }
