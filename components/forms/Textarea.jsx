import React, { useState } from "react";

/** 複数行入力。白背景（amber-50 は使わない）。rows 既定3、最小高さ 80。 */
export function Textarea({ value, defaultValue, placeholder, onChange, disabled, readOnly, invalid, rows = 3, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} readOnly={readOnly} rows={rows}
      aria-invalid={invalid || undefined} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        display: "block", width: "100%", minHeight: 80, padding: "10px 12px", fontSize: 14, lineHeight: "20px", resize: "vertical",
        color: disabled ? "var(--disabled-foreground)" : "var(--foreground)", background: disabled ? "var(--muted)" : "var(--card)",
        border: `1px solid ${invalid ? "var(--negative)" : focus ? "var(--ring)" : "var(--input)"}`,
        boxShadow: focus ? `0 0 0 3px ${invalid ? "var(--negative-subtle)" : "var(--primary-subtle)"}` : "none",
        borderRadius: "var(--radius)", outline: "none", fontFamily: "var(--font-sans)",
        transition: "border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)", ...style,
      }} {...rest} />
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Textarea = Textarea; }
