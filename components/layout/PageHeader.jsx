import React from "react";

/** ページヘッダ。アイコン + タイトル + 説明1行 + 右アクション（主1・副2まで）。帯色なし。backLink = h1 の上に「← 戻る」ghost（課タスク詳細・アセクリ詳細・1 案件）。 */
export function PageHeader({ icon, title, description, backLink, children, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = icon && L && L[icon];
  const Arrow = L && L.ArrowLeft;
  const back = backLink ? (typeof backLink === "string" ? { label: backLink } : backLink) : null;
  const header = (
    <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, minHeight: 44, ...(back ? undefined : style) }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, minWidth: 0 }}>
        {I ? <span style={{ width: 32, height: 32, borderRadius: "var(--radius)", background: "var(--primary-subtle)", color: "var(--primary)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2 }}><I size={18} strokeWidth={1.75} aria-hidden /></span> : null}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 20, lineHeight: "28px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
          {description ? <p style={{ margin: "2px 0 0", fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{description}</p> : null}
        </div>
      </div>
      {children ? <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{children}</div> : null}
    </header>
  );
  if (!back) return header;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, ...style }}>
      <a href={back.href || "#"} onClick={(e) => { if (back.onClick) { e.preventDefault(); back.onClick(); } }} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 10px 0 6px", marginLeft: -6, borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)", textDecoration: "none" }}>{Arrow ? <Arrow size={16} strokeWidth={1.75} aria-hidden /> : "←"}{back.label || "戻る"}</a>
      {header}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.PageHeader = PageHeader; }
