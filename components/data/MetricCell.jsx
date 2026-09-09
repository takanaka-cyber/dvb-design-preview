import React from "react";

/** テーブル用「主値 + 増減」2段セル。主値 13px --foreground、増減 12px 意味色。右寄せ tabular。previous を渡すと先週値をツールチップ（title）に出す（列を増やさない）。 */
export function MetricCell({ value, delta, unit = "", deltaUnit, digits = 0, invert, empty = "—", previous, previousLabel = "先週", style }) {
  const has = value != null && value !== "";
  const v = Number(delta);
  const dir = delta == null || Number.isNaN(v) || v === 0 ? "flat" : v > 0 ? "up" : "down";
  const good = invert ? dir === "down" : dir === "up";
  const color = dir === "flat" ? "var(--muted-foreground)" : good ? "var(--positive)" : "var(--negative)";
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "±";
  const sign = dir === "up" ? "+" : dir === "down" ? "−" : "";
  const fmt = (n, dg) => typeof n === "number" ? n.toLocaleString("ja-JP", { minimumFractionDigits: dg, maximumFractionDigits: dg }) : n;
  const fmtV = (n) => n == null || n === "" ? empty : `${unit === "¥" ? "¥" : ""}${fmt(n, digits)}${unit !== "¥" ? unit : ""}`;
  const tip = previous !== undefined && has ? `${previousLabel} ${fmtV(previous)}` : undefined;
  return (
    <div title={tip} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: "18px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", cursor: tip ? "help" : undefined, ...style }}>
      <span style={{ fontSize: 13, color: has ? "var(--foreground)" : "var(--disabled-foreground)" }}>{has ? `${unit === "¥" ? "¥" : ""}${fmt(value, digits)}${unit !== "¥" ? unit : ""}` : empty}</span>
      {delta != null && has ? (
        <span style={{ fontSize: 12, color, fontWeight: 500 }}>{arrow} {sign}{unit === "¥" ? "¥" : ""}{fmt(Math.abs(v), deltaUnit === "pt" ? 1 : digits)}{deltaUnit ?? (unit !== "¥" ? unit : "")}</span>
      ) : null}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.MetricCell = MetricCell; }
