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
const W = { bg: "var(--warning-subtle)", fg: "var(--warning-subtle-foreground)" }, P = { bg: "var(--positive-subtle)", fg: "var(--positive-subtle-foreground)" }, N = { bg: "var(--negative-subtle)", fg: "var(--negative-subtle-foreground)" }, I = { bg: "var(--info-subtle)", fg: "var(--info-subtle-foreground)" }, M = { bg: "var(--muted)", fg: "var(--muted-foreground)" };
const STATUS = {
  todo:    { label: "未完了", ...W },
  done:    { label: "完了",   ...P },
  late:    { label: "遅れ",   ...N },
  info:    { label: "情報",   ...I },
  neutral: { label: "—",      ...M },
  // バッチ 4 追加（既存 5 値は変更なし）: 承認 / 日報 / 納品 の状態。日本語ラベルでも引ける
  pending: { label: "承認待ち", ...W }, training: { label: "研修中", ...I }, approved: { label: "承認済", ...P }, rejected: { label: "却下", ...M },
  sent: { label: "送信済", ...P }, missing: { label: "未記載", ...W }, off: { label: "休", ...M },
  undelivered: { label: "未納品", ...W }, delivered: { label: "納品済", ...P }, none: { label: "タスクなし", ...M },
};
Object.values(STATUS).slice(5).forEach((s) => { STATUS[s.label] = s; });
/** アセクリ Tier。Tier 1 = primary-subtle、Tier 2 = info-subtle、Tier 3 以下 = muted */
const TIER = { "Tier 1": { bg: "var(--primary-subtle)", fg: "var(--primary-subtle-foreground)" }, "Tier 2": I, "Tier 3": M };
/** ロール。ADMIN = primary-subtle、MANAGER / LEADER = info-subtle、それ以外 = muted。文字は mono 11px */
const ROLE = { ADMIN: { bg: "var(--primary-subtle)", fg: "var(--primary-subtle-foreground)" }, MANAGER: I, LEADER: I, MEMBER: M, TRAINEE: W, VIEWER: M };

/** ラベル類。kind: rank | media | status | assignee | count | tier | role。折り返し禁止。 */
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
  if (kind === "tier") {
    const t = TIER[value] || TIER["Tier 3"];
    if (!value) return <span style={{ ...base, borderRadius: "var(--radius-sm)", borderColor: "var(--border)", borderStyle: "dashed", color: "var(--muted-foreground)" }}>Tier 未設定</span>;
    return <span style={{ ...base, borderRadius: "var(--radius-sm)", background: t.bg, color: t.fg, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{label || value}</span>;
  }
  if (kind === "role") {
    const r = ROLE[String(value || "").toUpperCase()] || ROLE.MEMBER;
    return <span style={{ ...base, borderRadius: "var(--radius-sm)", background: r.bg, color: r.fg, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>{label || String(value || "—").toUpperCase()}</span>;
  }
  if (kind === "count") {
    return <span style={{ ...base, borderRadius: "var(--radius-full)", background: "var(--muted)", color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums", minWidth: 24, justifyContent: "center", padding: "0 6px" }}>{value}</span>;
  }
  const s = STATUS[value] || STATUS.neutral;
  return <span style={{ ...base, borderRadius: "var(--radius-full)", background: s.bg, color: s.fg }}>{label || s.label}</span>;
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Badge = Badge; }
