import React from "react";

/** ラベル + 入力 + 補助/エラー文。必須は赤 * ではなくラベル末尾「（必須）」。 */
export function Field({ label, required, help, error, htmlFor, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <label htmlFor={htmlFor} style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500, color: "var(--foreground)" }}>
        {label}{required ? <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>（必須）</span> : null}
      </label>
      {children}
      {error ? <p role="alert" style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: "var(--negative)" }}>{error}</p>
        : help ? <p style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" }}>{help}</p> : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Field = Field; }
