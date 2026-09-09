import React from "react";

const K = {
  success: { icon: "Check", color: "var(--positive)", ttl: "3秒" },
  undo:    { icon: "Check", color: "var(--foreground)", ttl: "6秒" },
  error:   { icon: "CircleAlert", color: "var(--negative)", ttl: "手動で閉じる" },
  info:    { icon: "Info", color: "var(--primary)", ttl: "4秒" },
};

/** トースト1件（sonner の見た目仕様）。kind: success | undo | error | info。右下に積む。 */
export function Toast({ kind = "success", message, actionLabel, onAction, onClose, style }) {
  const k = K[kind] || K.info;
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = L && L[k.icon];
  const X = L && L.X;
  return (
    <div role="status" aria-live={kind === "error" ? "assertive" : "polite"} style={{
      display: "flex", alignItems: "center", gap: 10, width: 360, minHeight: 48, padding: "12px 12px 12px 14px",
      background: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
      boxShadow: "0 4px 12px oklch(0 0 0 / 0.10)", fontSize: 14, lineHeight: "20px", fontFamily: "var(--font-sans)", ...style,
    }}>
      {I ? <I size={16} strokeWidth={2} color={k.color} aria-hidden style={{ flexShrink: 0 }} /> : null}
      <span style={{ flex: 1, minWidth: 0 }}>{message}</span>
      {actionLabel ? <button type="button" onClick={onAction} style={{ height: 28, padding: "0 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>{actionLabel}</button> : null}
      {kind === "error" && X ? <button type="button" aria-label="閉じる" onClick={onClose} style={{ width: 28, height: 28, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", borderRadius: "var(--radius-sm)" }}><X size={16} /></button> : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Toast = Toast; }
