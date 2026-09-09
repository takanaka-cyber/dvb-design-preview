import React from "react";

/**
 * フォーム用モーダル（確認だけなら ConfirmDialog）。幅 sm 480 / md 640 / lg 95vw。
 * ヘッダ（タイトル + ×）、本文スクロール、フッタは 左に破壊系（destructive）・右に キャンセル（secondary）+ 確定（primary）。
 */
export function Dialog({ open = true, title, description, size = "md", children, onClose, cancelLabel = "キャンセル", confirmLabel = "保存", onConfirm, confirmDisabled, confirmLoading, destructive, hideFooter, inline, style }) {
  if (!open) return null;
  const D = typeof window !== "undefined" ? window.DVB : null;
  const Button = D && D.Button;
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const X = L && L.X;
  const width = size === "sm" ? 480 : size === "lg" ? "95vw" : 640;
  const panel = (
    <div role="dialog" aria-modal="true" aria-labelledby="dvb-dlg-title" style={{ width, maxWidth: "calc(100vw - 32px)", maxHeight: inline ? undefined : "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "var(--card)", color: "var(--card-foreground)", borderRadius: 12, border: "1px solid var(--border)", boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)", fontFamily: "var(--font-sans)", ...style }}>
      <header style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h2 id="dvb-dlg-title" style={{ margin: 0, fontSize: 16, lineHeight: "24px", fontWeight: 600 }}>{title}</h2>
          {description ? <p style={{ margin: "2px 0 0", fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" }}>{description}</p> : null}
        </div>
        <button type="button" aria-label="閉じる" onClick={onClose} style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", flexShrink: 0, marginTop: -4, marginRight: -8 }}>{X ? <X size={18} strokeWidth={1.75} /> : "×"}</button>
      </header>
      <div style={{ padding: 20, overflow: "auto", flex: 1, minHeight: 0 }}>{children}</div>
      {hideFooter ? null : (
        <footer style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
          {destructive && Button ? <Button variant="destructive" icon={destructive.icon || "Trash2"} onClick={destructive.onClick} disabled={destructive.disabled}>{destructive.label || "削除"}</Button> : null}
          <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8 }}>
            {Button ? <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button> : null}
            {Button && onConfirm ? <Button variant="primary" onClick={onConfirm} disabled={confirmDisabled} loading={confirmLoading}>{confirmLabel}</Button> : null}
          </span>
        </footer>
      )}
    </div>
  );
  if (inline) return panel;
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(0.208 0.042 266 / 0.4)", display: "grid", placeItems: "center", zIndex: 50 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{panel}</div>
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Dialog = Dialog; }
