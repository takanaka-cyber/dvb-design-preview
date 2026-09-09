import React from "react";

/** 増減の整形。sign と ▲▼ を併記。色は文字色だけ。 */
function fmtDelta(d) {
  if (d == null || d.value == null) return null;
  const v = Number(d.value);
  const dir = v > 0 ? "up" : v < 0 ? "down" : "flat";
  const abs = Math.abs(v);
  const num = d.format ? d.format(abs) : abs.toLocaleString("ja-JP", { maximumFractionDigits: d.digits ?? 1 });
  const arrow = dir === "up" ? "▲" : dir === "down" ? "▼" : "±";
  const sign = dir === "up" ? "+" : dir === "down" ? "−" : "";
  const color = dir === "up" ? "var(--positive)" : dir === "down" ? "var(--negative)" : "var(--muted-foreground)";
  const invert = d.invert; // CPA など「下がると良い」指標
  return { text: `${arrow} ${sign}${d.prefix || ""}${num}${d.unit || ""}`, color: invert ? (dir === "up" ? "var(--negative)" : dir === "down" ? "var(--positive)" : color) : color };
}

/** KPI カード。ラベル / 主値 / 増減 / 補足1行。横並び 4〜6 枚。 */
export function KpiCard({ label, value, unit, delta, note, loading, error, style }) {
  const d = fmtDelta(delta);
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: "14px 16px", minWidth: 0, display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <div style={{ fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      {loading ? (
        <div aria-busy="true" style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
          <span style={{ display: "block", width: "60%", height: 24, borderRadius: 4, background: "var(--muted)" }} />
          <span style={{ display: "block", width: "40%", height: 12, borderRadius: 4, background: "var(--muted)" }} />
        </div>
      ) : error ? (
        <div style={{ fontSize: 13, color: "var(--negative)", paddingTop: 4 }}>取得できませんでした</div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, fontVariantNumeric: "tabular-nums" }}>
            <span style={{ fontSize: 24, lineHeight: "32px", fontWeight: 600, color: "var(--foreground)", letterSpacing: "-0.01em" }}>{value ?? "—"}</span>
            {unit ? <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{unit}</span> : null}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 12, lineHeight: "16px", fontVariantNumeric: "tabular-nums", minHeight: 16 }}>
            {d ? <span style={{ color: d.color, fontWeight: 500, whiteSpace: "nowrap" }}>{d.text}</span> : null}
            {note ? <span style={{ color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{note}</span> : null}
          </div>
        </>
      )}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.KpiCard = KpiCard; }
