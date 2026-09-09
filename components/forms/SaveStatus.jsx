import React from "react";

/** 自動保存の状態表示。画面右上1箇所に置く。state: idle | saving | saved | error */
export function SaveStatus({ state = "idle", time, onRetry, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const base = { display: "inline-flex", alignItems: "center", gap: 6, height: 28, fontSize: 13, lineHeight: "18px", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums", ...style };
  if (state === "idle") return <span style={{ ...base, color: "var(--muted-foreground)" }}>入力内容は自動保存されます</span>;
  if (state === "saving") {
    const I = L && L.LoaderCircle;
    return <span role="status" aria-live="polite" style={{ ...base, color: "var(--muted-foreground)" }}>{I ? <I size={14} strokeWidth={2} style={{ animation: "dvb-spin 0.8s linear infinite" }} /> : null}<style>{`@keyframes dvb-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){svg{animation:none!important}}`}</style>保存中…</span>;
  }
  if (state === "saved") {
    const I = L && L.Check;
    return <span role="status" aria-live="polite" style={{ ...base, color: "var(--muted-foreground)" }}>{I ? <I size={14} strokeWidth={2} color="var(--positive)" /> : null}保存済み{time ? <span> {time}</span> : null}</span>;
  }
  const I = L && L.CircleAlert;
  return (
    <span role="alert" style={{ ...base, color: "var(--negative)" }}>
      {I ? <I size={14} strokeWidth={2} /> : null}保存に失敗
      <button type="button" onClick={onRetry} style={{ height: 24, padding: "0 8px", marginLeft: 2, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "var(--card)", color: "var(--foreground)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>再試行</button>
    </span>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.SaveStatus = SaveStatus; }
