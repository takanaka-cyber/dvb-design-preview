import React, { useEffect, useState } from "react";

const CSS = ".dvb-subnav-tabs::-webkit-scrollbar{display:none}";
/**
 * 第 2 階層ナビ（研修の左サブナビ）。幅 200。
 * groups: [{ label?, items: [{ key, label, icon, progress?: "3/8", dot?: boolean | "info" | "warning" }] }]
 * グループ見出し 11px --muted-foreground（大文字化なし）。項目 高さ 36、lucide アイコン + ラベル + 右端に 進捗「3/8」か 未読ドット。
 * アクティブ = --primary-subtle 背景 + 左 2px --primary。compact（1024 未満）は上部の横スクロール Tabs に畳む。
 */
export function SubNav({ groups = [], activeKey, onSelect, compact = false, "aria-label": ariaLabel = "サブナビゲーション", style }) {
  const [hover, setHover] = useState(null);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  useEffect(() => { if (typeof document !== "undefined" && !document.getElementById("dvb-subnav-css")) { const s = document.createElement("style"); s.id = "dvb-subnav-css"; s.textContent = CSS; document.head.appendChild(s); } }, []);
  const dotColor = (d) => (d === "warning" ? "var(--warning)" : "var(--info)");
  const items = groups.flatMap((g) => g.items);

  if (compact) {
    return (
      <nav aria-label={ariaLabel} className="dvb-subnav-tabs" role="tablist" style={{ display: "flex", alignItems: "stretch", height: 44, borderBottom: "1px solid var(--border)", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", fontFamily: "var(--font-sans)", background: "var(--card)", ...style }}>
        {items.map((it) => {
          const on = it.key === activeKey; const I = it.icon && L && L[it.icon];
          return (
            <button key={it.key} type="button" role="tab" aria-selected={on} onClick={() => onSelect && onSelect(it.key)}
              style={{ height: 44, padding: "0 14px", border: 0, borderBottom: `2px solid ${on ? "var(--primary)" : "transparent"}`, marginBottom: -1, background: "transparent", color: on ? "var(--primary)" : "var(--muted-foreground)", fontSize: 14, fontWeight: on ? 600 : 500, lineHeight: 1, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0, position: "relative" }}>
              {I ? <I size={16} strokeWidth={1.75} aria-hidden /> : null}
              {it.label}
              {it.progress ? <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: on ? "var(--primary)" : "var(--muted-foreground)", opacity: 0.9 }}>{it.progress}</span> : null}
              {it.dot ? <span aria-label="未読あり" style={{ width: 6, height: 6, borderRadius: "50%", background: dotColor(it.dot), flexShrink: 0 }} /> : null}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label={ariaLabel} style={{ width: 200, minWidth: 200, display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-sans)", color: "var(--foreground)", ...style }}>
      {groups.map((g, gi) => (
        <div key={g.label || gi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {g.label ? <div style={{ padding: `${gi === 0 ? 0 : 12}px 10px 4px`, fontSize: 11, lineHeight: "16px", fontWeight: 500, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{g.label}</div> : gi > 0 ? <div style={{ height: 8 }} /> : null}
          {g.items.map((it) => {
            const on = it.key === activeKey; const I = it.icon && L && L[it.icon];
            return (
              <button key={it.key} type="button" aria-current={on ? "page" : undefined} onClick={() => onSelect && onSelect(it.key)} onMouseEnter={() => setHover(it.key)} onMouseLeave={() => setHover(null)}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", height: 36, padding: "0 10px", border: 0, borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: 14, lineHeight: 1, fontWeight: on ? 600 : 400, textAlign: "left", position: "relative",
                  background: on ? "var(--primary-subtle)" : hover === it.key ? "var(--muted)" : "transparent", color: on ? "var(--primary-subtle-foreground)" : "var(--foreground)", transition: "background var(--duration) var(--ease)" }}>
                {on ? <span aria-hidden style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, borderRadius: 1, background: "var(--primary)" }} /> : null}
                {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0, color: on ? "var(--primary)" : "var(--muted-foreground)" }} /> : null}
                <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span>
                {it.progress ? <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: "var(--muted-foreground)", flexShrink: 0 }}>{it.progress}</span> : null}
                {it.dot ? <span aria-label="未読あり" style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor(it.dot), flexShrink: 0 }} /> : null}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.SubNav = SubNav; }
