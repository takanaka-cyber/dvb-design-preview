import React from "react";

/**
 * データ鮮度。「CPデータ更新」ボタンの横に置く。
 * state: fresh（--positive「9/9 08:12 取得」）| stale（--warning「9/7 18:40 取得 · 24時間以上前」）| none（--muted-foreground「未取得」）
 */
export function FreshnessBadge({ state = "none", time, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const color = state === "fresh" ? "var(--positive)" : state === "stale" ? "var(--warning)" : "var(--muted-foreground)";
  const I = L && (state === "fresh" ? L.CircleCheck : state === "stale" ? L.Clock : L.CircleDashed);
  const text = state === "none" || !time ? "未取得" : state === "stale" ? `${time} 取得 · 24時間以上前` : `${time} 取得`;
  return (
    <span role="status" title={text} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, fontSize: 13, lineHeight: "18px", color, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", ...style }}>
      {I ? <I size={14} strokeWidth={2} aria-hidden /> : null}{text}
    </span>
  );
}

/** 鮮度の注意帯。古い・未取得のとき KPI の上に 1 行。閉じるボタン無し（更新すると消える）。 */
export function FreshnessNotice({ onRefresh, loading, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = L && L.TriangleAlert;
  const B = typeof window !== "undefined" && window.DVB && window.DVB.Button;
  return (
    <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40, padding: "6px 12px", background: "var(--warning-subtle)", color: "var(--warning-subtle-foreground)", borderRadius: "var(--radius)", fontSize: 14, lineHeight: "20px", ...style }}>
      {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ color: "var(--warning)", flexShrink: 0 }} /> : null}
      <span style={{ flex: 1, minWidth: 0 }}>数字が古い可能性があります</span>
      {B ? <B size="sm" icon="RefreshCw" onClick={onRefresh} loading={loading}>CPデータ更新</B> : <button type="button" onClick={onRefresh} style={{ height: 32, padding: "0 10px", fontSize: 13, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--card)", cursor: "pointer" }}>CPデータ更新</button>}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.FreshnessBadge = FreshnessBadge; window.DVB.FreshnessNotice = FreshnessNotice; }
