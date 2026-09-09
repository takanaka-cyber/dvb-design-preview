import React, { useState } from "react";

/** 1行入力。白背景・高さ36。invalid で赤枠、readOnly は罫線だけ。数値は numeric=true で右寄せ tabular。 */
export function Input({ value, defaultValue, placeholder, onChange, disabled, readOnly, invalid, numeric, size = "md", icon, type = "text", style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = icon && L && L[icon];
  const h = size === "sm" ? 32 : 36;
  return (
    <span style={{ position: "relative", display: "inline-flex", width: "100%", ...style }}>
      {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ position: "absolute", left: 10, top: (h - 16) / 2, color: "var(--muted-foreground)", pointerEvents: "none" }} /> : null}
      <input type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} readOnly={readOnly}
        aria-invalid={invalid || undefined} inputMode={numeric ? "decimal" : undefined}
        onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", height: h, padding: I ? "0 12px 0 32px" : "0 12px", fontSize: size === "sm" ? 13 : 14, lineHeight: "20px",
          color: disabled ? "var(--disabled-foreground)" : "var(--foreground)", background: disabled ? "var(--muted)" : "var(--card)",
          border: `1px solid ${invalid ? "var(--negative)" : focus ? "var(--ring)" : "var(--input)"}`,
          boxShadow: focus ? `0 0 0 3px ${invalid ? "var(--negative-subtle)" : "var(--primary-subtle)"}` : "none",
          borderRadius: size === "sm" ? "var(--radius-sm)" : "var(--radius)", outline: "none",
          textAlign: numeric ? "right" : "left", fontVariantNumeric: numeric ? "tabular-nums" : undefined,
          cursor: disabled ? "not-allowed" : "text", transition: "border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)",
        }} {...rest} />
    </span>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Input = Input; }
