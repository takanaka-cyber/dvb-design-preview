import React, { useState } from "react";
import { MBO_HISTORY } from "./data.js";

const STATUS = { sent: ["done", "送信済み"], none: ["neutral", "未記載"], off: ["info", "休み"], draft: ["todo", "下書き"] };

/** 日報 履歴一覧（/mbo/history）。PC 1440 + スマホ 393。月切替 + 日付ごとの行。行クリックで当日の日報（読み取り）。 */
export function MboHistoryScreen({ state = "normal", toast, narrow, mobile, onNavigate }) {
  const { PageHeader, Button, DataTable, Badge, EmptyState, SectionHeading } = window.DVB;
  const L = window.LucideReact; const Prev = L.ChevronLeft, Next = L.ChevronRight, Msg = L.MessageSquare, Chev = L.ChevronRight;
  const loading = state === "loading", error = state === "error", empty = state === "empty";
  const [month, setMonth] = useState(9);
  const [sel, setSel] = useState(empty || mobile ? null : 8);
  const rows = empty ? [] : [...MBO_HISTORY].reverse();
  const cur = rows.find((r) => r.d === sel);
  const monthNav = (
    <div role="group" aria-label="月" style={{ display: "inline-flex", alignItems: "stretch" }}>
      <button type="button" aria-label="前月" onClick={() => { setMonth(month - 1); setSel(null); }} style={{ width: 44, height: 36, display: "grid", placeItems: "center", border: "1px solid var(--border)", borderRadius: "var(--radius) 0 0 var(--radius)", background: "var(--card)", color: "var(--foreground)", cursor: "pointer", padding: 0 }}><Prev size={16} /></button>
      <span style={{ display: "inline-flex", alignItems: "center", height: 36, padding: "0 16px", border: "1px solid var(--border)", borderLeft: 0, borderRight: 0, background: "var(--card)", fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>2026年 {month}月</span>
      <button type="button" aria-label="次月" disabled={month >= 9} onClick={() => setMonth(month + 1)} style={{ width: 44, height: 36, display: "grid", placeItems: "center", border: "1px solid var(--border)", borderRadius: "0 var(--radius) var(--radius) 0", background: "var(--card)", color: "var(--foreground)", cursor: month >= 9 ? "not-allowed" : "pointer", opacity: month >= 9 ? 0.5 : 1, padding: 0 }}><Next size={16} /></button>
    </div>
  );
  const emptyNode = <EmptyState compact icon="BookOpen" title="この月の日報はまだありません。" description="日報を送信すると日付ごとにここに並びます。" />;
  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" };
  const line = (v) => <span style={{ display: "block", maxWidth: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: v ? "var(--foreground)" : "var(--disabled-foreground)" }}>{v ? v.replace(/\n/g, " ") : "—"}</span>;

  const detail = cur ? (
    <article style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 12 }} aria-label={`${cur.date} の日報`}>
      <SectionHeading level={3} icon="BookOpen" title={cur.date}><Badge value={STATUS[cur.status][0]} label={STATUS[cur.status][1] + (cur.sentAt ? ` ${cur.sentAt}` : "")} /></SectionHeading>
      <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>良かった動き / 学んだこと</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{cur.good || "—"}</div></div>
      <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>反省点 / 改善点</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{cur.bad || "—"}</div></div>
      {cur.comment ? <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 6 }}><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><Msg size={16} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" /><span style={{ fontWeight: 600 }}>{cur.comment.by}</span><span style={{ color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{cur.comment.at}</span></div><p style={{ margin: 0, fontSize: 14, lineHeight: "22px" }}>{cur.comment.text}</p></div> : null}
    </article>
  ) : null;

  if (mobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <PageHeader icon="History" title="過去の日報" style={{ alignItems: "center" }}><Button size="sm" variant="ghost" icon="ChevronLeft" onClick={() => onNavigate && onNavigate("mbo")}>今日</Button></PageHeader>
        {monthNav}
        {sel != null ? <>{detail}<Button variant="ghost" icon="ChevronLeft" onClick={() => setSel(null)}>一覧へ戻る</Button></> : rows.length === 0 ? <div style={card}>{emptyNode}</div> : (
          <div style={{ ...card, display: "flex", flexDirection: "column" }}>
            {rows.map((r, i) => (
              <button key={r.d} type="button" onClick={() => setSel(r.d)} style={{ display: "grid", gridTemplateColumns: "72px minmax(0,1fr) auto", alignItems: "center", gap: 8, minHeight: 56, padding: "8px 12px", border: 0, borderTop: i ? "1px solid var(--border)" : 0, background: "transparent", textAlign: "left", cursor: "pointer", color: "var(--foreground)", fontFamily: "inherit" }}>
                <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: r.weekend ? "var(--muted-foreground)" : "var(--foreground)" }}>{r.date}</span>
                <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2, fontSize: 13, lineHeight: "18px" }}><Badge value={STATUS[r.status][0]} label={STATUS[r.status][1]} size="sm" style={{ alignSelf: "flex-start" }} />{r.good ? line(r.good) : null}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--muted-foreground)" }}>{r.comment ? <Msg size={16} strokeWidth={1.75} aria-label="上長コメントあり" /> : null}<Chev size={16} /></span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const cols = [
    { key: "date", label: "日付", width: 96, render: (r) => <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: r.weekend ? "var(--muted-foreground)" : "var(--foreground)" }}>{r.date}</span> },
    { key: "good", label: "良かった動き / 学んだこと", width: narrow ? 260 : 340, render: (r) => line(r.good) },
    { key: "bad", label: "反省点 / 改善点", width: narrow ? 240 : 320, render: (r) => line(r.bad) },
    { key: "status", label: "状態", width: 110, render: (r) => <Badge value={STATUS[r.status][0]} label={STATUS[r.status][1]} /> },
    { key: "comment", label: "上長コメント", width: 100, render: (r) => r.comment ? <span title={`${r.comment.by} ${r.comment.at}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--foreground)", fontSize: 13 }}><Msg size={16} strokeWidth={1.75} aria-hidden color="var(--primary)" />あり</span> : <span style={{ color: "var(--disabled-foreground)" }}>—</span> },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="History" title="日報 履歴" description="日付ごとの日報。行を選ぶと右に内容を表示">
        <Button icon="BookOpen" onClick={() => onNavigate && onNavigate("mbo")}>今日の日報</Button>
      </PageHeader>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>{monthNav}<span style={{ fontSize: 13, color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{empty || loading || error ? "" : `送信済み ${rows.filter((r) => r.status === "sent").length} 日 · 未記載 ${rows.filter((r) => r.status === "none").length} 日`}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: cur ? "minmax(0,1fr) 360px" : "minmax(0,1fr)", gap: 16, alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          <DataTable columns={cols} rows={rows.map((r) => ({ ...r, id: r.d }))} loading={loading} error={error ? "履歴の取得に失敗しました。" : undefined} onRetry={() => toast({ kind: "info", message: "再読み込みしています…" })} caption="日報 履歴" emptyNode={emptyNode} minWidth={narrow ? 860 : 1000}
            onRowClick={(r) => setSel(r.d)} selectedKey={sel} />
        </div>
        {detail}
      </div>
    </div>
  );
}

window.DVBKit = window.DVBKit || {}; window.DVBKit.MboHistoryScreen = MboHistoryScreen;
