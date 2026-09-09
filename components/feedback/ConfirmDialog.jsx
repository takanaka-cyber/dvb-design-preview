import React from "react";

/** 破壊操作の確認。window.confirm の代替。右が破壊ボタン、左がキャンセル。inline=true で埋め込み表示（仕様カード用）。 */
export function ConfirmDialog({ open = true, title, description, confirmLabel = "削除", cancelLabel = "キャンセル", destructive = true, loading, onConfirm, onCancel, inline }) {
  if (!open) return null;
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Warn = L && L.TriangleAlert;
  const panel = (
    <div role="alertdialog" aria-modal="true" aria-labelledby="dvb-cd-title" style={{
      width: 420, maxWidth: "calc(100vw - 32px)", background: "var(--card)", color: "var(--card-foreground)", borderRadius: 12,
      border: "1px solid var(--border)", boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)", padding: 20, fontFamily: "var(--font-sans)",
    }}>
      <div style={{ display: "flex", gap: 12 }}>
        {destructive && Warn ? <span style={{ width: 32, height: 32, borderRadius: "var(--radius)", background: "var(--negative-subtle)", color: "var(--negative)", display: "grid", placeItems: "center", flexShrink: 0 }}><Warn size={16} strokeWidth={1.75} /></span> : null}
        <div style={{ minWidth: 0 }}>
          <h2 id="dvb-cd-title" style={{ margin: 0, fontSize: 16, lineHeight: "24px", fontWeight: 600 }}>{title}</h2>
          <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>{description}</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
        <button type="button" onClick={onCancel} disabled={loading} style={btn("ghost")}>{cancelLabel}</button>
        <button type="button" onClick={onConfirm} disabled={loading} autoFocus style={btn(destructive ? "destructive" : "primary")}>{loading ? "処理中…" : confirmLabel}</button>
      </div>
    </div>
  );
  if (inline) return panel;
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0.208 0.042 266 / 0.4)", display: "grid", placeItems: "center", zIndex: 50 }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()}>{panel}</div>
    </div>
  );
}
function btn(kind) {
  const base = { height: 36, minWidth: 64, padding: "0 14px", borderRadius: "var(--radius)", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "1px solid transparent" };
  if (kind === "destructive") return { ...base, background: "var(--destructive)", color: "var(--destructive-foreground)" };
  if (kind === "primary") return { ...base, background: "var(--primary)", color: "var(--primary-foreground)" };
  return { ...base, background: "transparent", color: "var(--foreground)" };
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.ConfirmDialog = ConfirmDialog; }
