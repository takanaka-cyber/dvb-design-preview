import React from "react";

/** 進捗バー。高さ 8、--muted 上に --primary。達成（value >= max）で --positive、期限超過（overdue）で --negative。ラベル既定「12/30（40%）」。 */
export function Progress({ value = 0, max = 100, overdue, label, showLabel = true, size = "md", width, style }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  const done = max > 0 && value >= max;
  const color = overdue && !done ? "var(--negative)" : done ? "var(--positive)" : "var(--primary)";
  const text = label ?? `${value}/${max}（${pct}%）`;
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={text} style={{ display: "flex", alignItems: "center", gap: 8, width, minWidth: 0, ...style }}>
      <span style={{ flex: 1, minWidth: 40, height: size === "sm" ? 6 : 8, borderRadius: 9999, background: "var(--muted)", overflow: "hidden" }}>
        <span style={{ display: "block", width: `${pct}%`, height: "100%", borderRadius: 9999, background: color, transition: "width var(--duration) var(--ease)" }} />
      </span>
      {showLabel ? <span style={{ fontSize: 13, lineHeight: "18px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: overdue && !done ? "var(--negative)" : done ? "var(--positive)" : "var(--muted-foreground)" }}>{text}</span> : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Progress = Progress; }
