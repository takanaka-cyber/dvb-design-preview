import React from "react";

/**
 * 未保存の下書き復元バナー。PageHeader 直下、1画面に1本だけ。高さ 44。
 * --warning-subtle 背景 + 左 3px --warning バー + lucide History。［復元する］secondary ［破棄］ghost（確認なしで即消える）。
 */
export function DraftRestoreBanner({ time, onRestore, onDiscard, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = L && L.History;
  const B = typeof window !== "undefined" && window.DVB && window.DVB.Button;
  const btn = (label, ghost, onClick) => B ? <B size="sm" variant={ghost ? "ghost" : "secondary"} onClick={onClick}>{label}</B>
    : <button type="button" onClick={onClick} style={{ height: 32, padding: "0 10px", fontSize: 13, fontWeight: 500, border: `1px solid ${ghost ? "transparent" : "var(--border)"}`, borderRadius: "var(--radius-sm)", background: ghost ? "transparent" : "var(--card)", color: "var(--foreground)", cursor: "pointer" }}>{label}</button>;
  return (
    <div role="status" style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 12px 0 13px", background: "var(--warning-subtle)", color: "var(--warning-subtle-foreground)", borderRadius: "var(--radius)", boxShadow: "inset 3px 0 0 var(--warning)", fontSize: 14, lineHeight: "20px", ...style }}>
      {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0, color: "var(--warning)" }} /> : null}
      <span style={{ flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontVariantNumeric: "tabular-nums" }}>前回の未保存の入力があります{time ? `（${time}）` : ""}。</span>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>{btn("復元する", false, onRestore)}{btn("破棄", true, onDiscard)}</div>
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.DraftRestoreBanner = DraftRestoreBanner; }
