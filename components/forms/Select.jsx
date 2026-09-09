import React from "react";

/** 単純な Select（ネイティブ）。高さ36、白背景、右に chevron。shadcn Select と同寸。 */
export function Select({ value, defaultValue, onChange, options = [], placeholder, disabled, size = "md", width, style, ...rest }) {
  const h = size === "sm" ? 32 : 36;
  return (
    <span style={{ position: "relative", display: "inline-flex", width: width || "auto", ...style }}>
      <select value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled}
        style={{
          appearance: "none", WebkitAppearance: "none", width: "100%", height: h, padding: "0 32px 0 12px", fontSize: size === "sm" ? 13 : 14,
          color: value === "" || value === undefined && placeholder ? "var(--foreground)" : "var(--foreground)",
          background: disabled ? "var(--muted)" : "var(--card)", border: "1px solid var(--input)", borderRadius: size === "sm" ? "var(--radius-sm)" : "var(--radius)",
          cursor: disabled ? "not-allowed" : "pointer", outline: "none",
        }} {...rest}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 10, top: (h - 16) / 2, pointerEvents: "none" }}><path d="m6 9 6 6 6-6" /></svg>
    </span>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Select = Select; }
