import React from "react";

/**
 * 週セレクタ。ページ上部 1 箇所だけ。［◀ 前週］ 9/1（月）〜 9/7（日） ［次週 ▶］ + Select（過去 12 週 + 「過去の週を見る…」）。
 * weeks: [{ key, label, current }]（新しい順。index 0 が最新）。キーボード ← → で前後週。compact で ◀ ▶ のみ。
 */
export function WeekSelector({ weeks = [], index = 0, onChange, compact, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Prev = L && L.ChevronLeft, Next = L && L.ChevronRight;
  const w = weeks[index] || {};
  const go = (i) => { if (i < 0 || i >= weeks.length) return; onChange && onChange(i); };
  const nav = { height: 36, display: "inline-flex", alignItems: "center", gap: 4, padding: compact ? "0 8px" : "0 10px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" };
  const dis = { opacity: 0.5, cursor: "not-allowed" };
  return (
    <div role="group" aria-label="対象週" tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowLeft") { e.preventDefault(); go(index + 1); } if (e.key === "ArrowRight") { e.preventDefault(); go(index - 1); } }}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, outline: "none", borderRadius: "var(--radius)", ...style }}>
      <div style={{ display: "inline-flex", alignItems: "stretch" }}>
        <button type="button" aria-label="前週" disabled={index >= weeks.length - 1} onClick={() => go(index + 1)} style={{ ...nav, borderRadius: "var(--radius) 0 0 var(--radius)", ...(index >= weeks.length - 1 ? dis : {}) }}>{Prev ? <Prev size={16} /> : "‹"}{compact ? null : "前週"}</button>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 36, padding: "0 12px", border: "1px solid var(--border)", borderLeft: 0, borderRight: 0, background: "var(--card)", fontSize: 16, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
          {w.label || "—"}
          {w.current ? <span style={{ height: 20, padding: "0 8px", borderRadius: 9999, background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", fontSize: 12, fontWeight: 600, lineHeight: "20px" }}>今週</span> : null}
        </div>
        <button type="button" aria-label="次週" disabled={index <= 0} onClick={() => go(index - 1)} style={{ ...nav, borderRadius: "0 var(--radius) var(--radius) 0", ...(index <= 0 ? dis : {}) }}>{compact ? null : "次週"}{Next ? <Next size={16} /> : "›"}</button>
      </div>
      {!compact ? (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <select aria-label="週を選ぶ" value={String(index)} onChange={(e) => { if (e.target.value === "more") { onChange && onChange(index, "more"); return; } go(Number(e.target.value)); }}
            style={{ appearance: "none", WebkitAppearance: "none", height: 36, padding: "0 32px 0 12px", fontSize: 14, color: "var(--foreground)", background: "var(--card)", border: "1px solid var(--input)", borderRadius: "var(--radius)", cursor: "pointer", outline: "none", fontVariantNumeric: "tabular-nums" }}>
            {weeks.slice(0, 12).map((x, i) => <option key={x.key || i} value={String(i)}>{x.label}{x.current ? "（今週）" : ""}</option>)}
            <option value="more">過去の週を見る…</option>
          </select>
          <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 10, top: 10, pointerEvents: "none" }}><path d="m6 9 6 6 6-6" /></svg>
        </span>
      ) : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.WeekSelector = WeekSelector; }
