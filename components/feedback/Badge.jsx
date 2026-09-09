import React from "react";

const RANK = {
  S:  { bg: "var(--rank-s)", fg: "var(--rank-s-foreground)", bd: "transparent" },
  A:  { bg: "var(--rank-a)", fg: "var(--rank-a-foreground)", bd: "transparent" },
  B:  { bg: "var(--rank-b)", fg: "var(--rank-b-foreground)", bd: "var(--rank-b-border)" },
  C:  { bg: "var(--rank-c)", fg: "var(--rank-c-foreground)", bd: "var(--rank-c-border)" },
  "停止": { bg: "var(--rank-stop)", fg: "var(--rank-stop-foreground)", bd: "transparent" },
};
const MEDIA = {
  FB: "fb", TikTok: "tiktok", Google: "google", "その他": "other",
};
const STATUS = {
  todo:    { label: "未完了", bg: "var(--warning-subtle)", fg: "var(--warning-subtle-foreground)" },
  done:    { label: "完了",   bg: "var(--positive-subtle)", fg: "var(--positive-subtle-foreground)" },
  late:    { label: "遅れ",   bg: "var(--negative-subtle)", fg: "var(--negative-subtle-foreground)" },
  info:    { label: "情報",   bg: "var(--info-subtle)", fg: "var(--info-subtle-foreground)" },
  neutral: { label: "—",      bg: "var(--muted)", fg: "var(--muted-foreground)" },
};

/** ラベル類。kind: rank | media | status | assignee | count。折り返し禁止。 */
export function Badge({ kind = "status", value, label, size = "md", style }) {
  const h = size === "sm" ? 20 : 22;
  const base = { display: "inline-flex", alignItems: "center", gap: 6, height: h, padding: "0 8px", fontSize: 12, fontWeight: 500, lineHeight: 1, whiteSpace: "nowrap", border: "1px solid transparent", ...style };

  if (kind === "rank") {
    const r = RANK[value];
    if (!r) return <span style={{ ...base, borderRadius: "var(--radius-full)", borderColor: "var(--border)", borderStyle: "dashed", color: "var(--muted-foreground)", fontWeight: 500 }}>未設定</span>;
    return <span style={{ ...base, borderRadius: "var(--radius-full)", background: r.bg, color: r.fg, borderColor: r.bd, fontWeight: 600, minWidth: 28, justifyContent: "center" }}>{value}</span>;
  }
  if (kind === "media") {
    const k = MEDIA[value] || "other";
    return <span style={{ ...base, borderRadius: "var(--radius-sm)", background: `var(--media-${k})`, color: `var(--media-${k}-foreground)` }}>{value}</span>;
  }
  if (kind === "assignee") {
    const name = value || "—";
    return (
      <span style={{ ...base, padding: "0 8px 0 2px", borderRadius: "var(--radius-full)", background: "var(--muted)", color: "var(--foreground)" }}>
        <span aria-hidden style={{ width: h - 4, height: h - 4, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600 }}>{name.slice(0, 1)}</span>
        {name}
      </span>
    );
  }
  if (kind === "count") {
    return <span style={{ ...base, borderRadius: "var(--radius-full)", background: "var(--muted)", color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums", minWidth: 24, justifyContent: "center", padding: "0 6px" }}>{value}</span>;
  }
  const s = STATUS[value] || STATUS.neutral;
  return <span style={{ ...base, borderRadius: "var(--radius-full)", background: s.bg, color: s.fg }}>{label || s.label}</span>;
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Badge = Badge; }
