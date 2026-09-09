import React from "react";

/**
 * フィルタバー。期間の前/次 + ラベル、Select 群（children）、担当者チップ（複数選択）。ページ上部1箇所。
 * chips: [{ label, active }]  onChip(label)
 */
export function FilterBar({ period, onPrev, onNext, onToday, chips = [], onChip, children, right, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Prev = L && L.ChevronLeft, Next = L && L.ChevronRight;
  const nav = { width: 36, height: 36, display: "grid", placeItems: "center", border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", cursor: "pointer", padding: 0 };
  return (
    <div role="toolbar" aria-label="フィルタ" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minHeight: 36, ...style }}>
      {period ? (
        <div style={{ display: "inline-flex", alignItems: "stretch" }}>
          <button type="button" aria-label="前へ" onClick={onPrev} style={{ ...nav, borderRadius: "var(--radius) 0 0 var(--radius)" }}>{Prev ? <Prev size={16} /> : "‹"}</button>
          <button type="button" onClick={onToday} style={{ height: 36, padding: "0 12px", border: "1px solid var(--border)", borderLeft: 0, borderRight: 0, background: "var(--card)", fontSize: 14, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", cursor: "pointer" }}>{period}</button>
          <button type="button" aria-label="次へ" onClick={onNext} style={{ ...nav, borderRadius: "0 var(--radius) var(--radius) 0" }}>{Next ? <Next size={16} /> : "›"}</button>
        </div>
      ) : null}
      {children}
      {chips.length ? (
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginLeft: 4 }} role="group" aria-label="担当者">
          {chips.map((c) => (
            <button key={c.label} type="button" aria-pressed={!!c.active} onClick={() => onChip && onChip(c.label)}
              style={{ height: 28, padding: "0 10px", borderRadius: 9999, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                border: `1px solid ${c.active ? "var(--primary)" : "var(--border)"}`, background: c.active ? "var(--primary-subtle)" : "var(--card)", color: c.active ? "var(--primary-subtle-foreground)" : "var(--foreground)" }}>
              {c.label}{c.count != null ? <span style={{ marginLeft: 4, color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{c.count}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
      {right ? <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>{right}</div> : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.FilterBar = FilterBar; }
