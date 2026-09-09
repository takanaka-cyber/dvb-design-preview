import React, { useState } from "react";

/** トグル。shadcn 相当（36×20）。ON = --primary。label を渡すと右にラベル（クリックで切替）。 */
export function Switch({ checked = false, onChange, disabled, label, id, size = "md", style }) {
  const [focus, setFocus] = useState(false);
  const w = size === "sm" ? 28 : 36, h = size === "sm" ? 16 : 20, knob = h - 4;
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  const ctl = (
    <button type="button" role="switch" id={id} aria-checked={checked} aria-label={label ? undefined : "切替"} disabled={disabled} onClick={toggle} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ position: "relative", width: w, height: h, borderRadius: 9999, border: 0, padding: 0, flexShrink: 0, background: checked ? "var(--primary)" : "var(--input)", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer", boxShadow: focus ? "0 0 0 3px var(--primary-subtle)" : "none", transition: "background var(--duration) var(--ease)" }}>
      <span aria-hidden style={{ position: "absolute", top: 2, left: checked ? w - knob - 2 : 2, width: knob, height: knob, borderRadius: "50%", background: "var(--card)", boxShadow: "0 1px 2px oklch(0 0 0 / 0.2)", transition: "left var(--duration) var(--ease)" }} />
    </button>
  );
  if (!label) return ctl;
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, lineHeight: "20px", color: disabled ? "var(--disabled-foreground)" : "var(--foreground)", cursor: disabled ? "not-allowed" : "pointer", ...style }}>
      {ctl}<span>{label}</span>
    </label>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Switch = Switch; }
