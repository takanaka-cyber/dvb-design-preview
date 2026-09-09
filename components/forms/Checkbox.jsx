import React, { useState } from "react";

/** チェックボックス。18px、ON = --primary、indeterminate は横線。label を渡すとラベル付き。 */
export function Checkbox({ checked = false, indeterminate, onChange, disabled, label, id, style }) {
  const [focus, setFocus] = useState(false);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Check = L && L.Check, Minus = L && L.Minus;
  const on = checked || indeterminate;
  const ctl = (
    <button type="button" role="checkbox" id={id} aria-checked={indeterminate ? "mixed" : checked} aria-label={label ? undefined : "選択"} disabled={disabled} onClick={() => !disabled && onChange && onChange(!checked)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ width: 18, height: 18, flexShrink: 0, borderRadius: 4, padding: 0, display: "grid", placeItems: "center", border: `1.5px solid ${on ? "var(--primary)" : "var(--muted-foreground)"}`, background: on ? "var(--primary)" : "var(--card)", color: "var(--primary-foreground)", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer", boxShadow: focus ? "0 0 0 3px var(--primary-subtle)" : "none", transition: "background var(--duration) var(--ease)" }}>
      {indeterminate ? (Minus ? <Minus size={12} strokeWidth={3} /> : "−") : checked ? (Check ? <Check size={12} strokeWidth={3} /> : "✓") : null}
    </button>
  );
  if (!label) return ctl;
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, minHeight: 32, fontSize: 14, lineHeight: "20px", color: disabled ? "var(--disabled-foreground)" : "var(--foreground)", cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      {ctl}<span>{label}</span>
    </label>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Checkbox = Checkbox; }
