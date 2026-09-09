import React, { useState } from "react";

/**
 * データテーブル。sticky ヘッダ・sticky 第1列、並べ替え可の列だけ矢印、数値右寄せ、密度2段。
 * columns: [{ key, label, align, sortable, width, sticky, render(row) }]
 * state: loading（スケルトン行）/ error（1行メッセージ）/ 空は emptyNode を表示。
 * 行の展開: expandedKeys（rowKey の配列）に入っている行の直下に renderExpanded(row) を全列幅で描く。
 */
export function DataTable({ columns = [], rows = [], rowKey = "id", sortKey, sortDir = "desc", onSort, density = "standard", stickyHeader = true, maxHeight, loading, error, emptyNode, onRetry, minWidth, caption, expandedKeys = [], renderExpanded, style }) {
  const [hoverRow, setHoverRow] = useState(null);
  const compact = density === "compact";
  const py = compact ? 8 : 12, px = compact ? 8 : 12;
  const rowH = compact ? 36 : 44;
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Up = L && L.ChevronUp, Down = L && L.ChevronDown, Both = L && L.ChevronsUpDown;

  const th = (c, i) => {
    const active = sortKey === c.key;
    const right = c.align === "right";
    return (
      <th key={c.key} scope="col" aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : undefined}
        style={{
          position: "sticky", top: stickyHeader ? 0 : undefined, left: c.sticky ? 0 : undefined, zIndex: c.sticky ? 3 : 2,
          background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, lineHeight: "16px", fontWeight: 500,
          textAlign: right ? "right" : "left", padding: `${compact ? 6 : 8}px ${px}px`, whiteSpace: "nowrap", width: c.width, minWidth: c.width,
          borderBottom: "1px solid var(--border)", boxShadow: c.sticky ? "1px 0 0 var(--border)" : undefined, userSelect: "none",
        }}>
        {c.sortable ? (
          <button type="button" onClick={() => onSort && onSort(c.key, active && sortDir === "desc" ? "asc" : "desc")}
            style={{ display: "inline-flex", alignItems: "center", gap: 2, background: "none", border: 0, padding: 0, font: "inherit", color: active ? "var(--foreground)" : "inherit", cursor: "pointer", flexDirection: right ? "row-reverse" : "row" }}>
            {c.label}
            {active ? (sortDir === "asc" ? (Up ? <Up size={14} /> : "↑") : (Down ? <Down size={14} /> : "↓")) : (Both ? <Both size={14} style={{ opacity: 0.6 }} /> : "⇅")}
          </button>
        ) : c.label}
      </th>
    );
  };

  const cellStyle = (c, r, hovered) => ({
    padding: `${py}px ${px}px`, height: rowH, fontSize: 13, lineHeight: "18px", verticalAlign: "middle",
    textAlign: c.align === "right" ? "right" : "left", whiteSpace: c.wrap ? "normal" : "nowrap",
    fontVariantNumeric: c.align === "right" ? "tabular-nums" : undefined,
    position: c.sticky ? "sticky" : undefined, left: c.sticky ? 0 : undefined, zIndex: c.sticky ? 1 : undefined,
    background: hovered ? "var(--accent)" : "var(--card)", boxShadow: c.sticky ? "1px 0 0 var(--border)" : undefined,
    borderBottom: "1px solid var(--border)", color: "var(--foreground)", width: c.width, minWidth: c.width,
  });

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--card)", overflow: "auto", maxHeight, boxShadow: "var(--shadow-card)", ...style }}>
      <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%", minWidth: (rows.length || loading) ? (minWidth || "100%") : "100%", fontFamily: "var(--font-sans)" }}>
        {caption ? <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{caption}</caption> : null}
        <thead><tr>{columns.map(th)}</tr></thead>
        <tbody>
          {loading ? Array.from({ length: 5 }).map((_, i) => (
            <tr key={"sk" + i} aria-busy="true">{columns.map((c, j) => (
              <td key={c.key} style={cellStyle(c, null, false)}><span style={{ display: "inline-block", width: j === 0 ? "70%" : "55%", height: 12, borderRadius: 4, background: "var(--muted)" }} /></td>
            ))}</tr>
          )) : error ? (
            <tr><td colSpan={columns.length} style={{ padding: "32px 16px", textAlign: "center", fontSize: 14, color: "var(--foreground)" }}>
              <div style={{ color: "var(--negative)", fontWeight: 500 }}>データを取得できませんでした</div>
              <div style={{ color: "var(--muted-foreground)", fontSize: 13, marginTop: 4 }}>{typeof error === "string" ? error : "時間をおいてもう一度お試しください。"}</div>
              {onRetry ? <button type="button" onClick={onRetry} style={{ marginTop: 12, height: 32, padding: "0 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--card)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>再読み込み</button> : null}
            </td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 0 }}>{emptyNode || <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>データがありません。</div>}</td></tr>
          ) : rows.map((r, i) => {
            const k = r[rowKey] ?? i;
            const hovered = hoverRow === k;
            const expanded = renderExpanded && expandedKeys.includes(k);
            return (
              <React.Fragment key={k}>
                <tr onMouseEnter={() => setHoverRow(k)} onMouseLeave={() => setHoverRow(null)}>
                  {columns.map((c) => <td key={c.key} style={{ ...cellStyle(c, r, hovered), borderBottom: expanded ? 0 : "1px solid var(--border)" }}>{c.render ? c.render(r) : r[c.key]}</td>)}
                </tr>
                {expanded ? (
                  <tr>
                    <td colSpan={columns.length} style={{ padding: 0, borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
                      <div style={{ position: "sticky", left: 0, maxWidth: "100%", padding: `12px ${px + 4}px 14px`, background: "var(--muted)", borderTop: "1px dashed var(--border)", fontSize: 13, lineHeight: "18px", color: "var(--foreground)" }}>{renderExpanded(r)}</div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.DataTable = DataTable; }
