import React, { useState } from "react";
import { GG_MEMBERS, BOARD_ROWS } from "./data.js";

/* Wave 2 ラフ（通常状態のみ、1440）。目標 / コミットメント / ダッシュボード */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const yen = (n) => `¥${Math.round(n).toLocaleString("ja-JP")}`;
const MONTHS = { Q1: ["4月", "5月", "6月"], Q2: ["7月", "8月", "9月"], Q3: ["10月", "11月", "12月"], Q4: ["1月", "2月", "3月"] };

/** 目標（評価シート）。Q1〜Q4 タブ維持。「Qの目標」→「今月の振り返り」を上下に。 */
export function GoalScreen({ toast }) {
  const { PageHeader, Button, SectionHeading, Field, Textarea, Select, SaveStatus, Badge } = window.DVB;
  const [q, setQ] = useState("Q2");
  const tab = (k) => <button key={k} type="button" role="tab" aria-selected={q === k} onClick={() => setQ(k)} style={{ height: 36, padding: "0 16px", border: 0, borderBottom: `2px solid ${q === k ? "var(--primary)" : "transparent"}`, background: "transparent", fontSize: 14, fontWeight: q === k ? 600 : 500, color: q === k ? "var(--foreground)" : "var(--muted-foreground)", cursor: "pointer", marginBottom: -1 }}>{k}</button>;
  const rows = [["商材粗利", [yen(11200000), yen(12800000), yen(3523500)], yen(12000000)], ["ROAS", ["198.2%", "203.5%", "206.4%"], "200%"], ["新規検証CP", ["6", "8", "3"], "8"]];
  const th = { background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, padding: "6px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
  const td = { padding: "8px 12px", fontSize: 13, textAlign: "right", fontVariantNumeric: "tabular-nums", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 1040 }}>
      <PageHeader icon="ClipboardCheck" title="目標" description="四半期の目標と月次の振り返り"><SaveStatus state="saved" time="15:56" /></PageHeader>
      <div role="tablist" style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>{Object.keys(MONTHS).map(tab)}</div>
      <section style={card}>
        <SectionHeading icon="Target" title={`${q} の目標`} description="2026年度">
          <Badge value="info" label="評価サマリー: 未入力" />
        </SectionHeading>
        <Field label="目標" htmlFor="g1"><Textarea id="g1" rows={3} defaultValue="担当案件の商材粗利 月 ¥12,000,000 を 3 か月連続で達成する。D社の主因切り分けを月内に完了。" /></Field>
        <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%" }}>
            <thead><tr><th style={{ ...th, textAlign: "left" }}>指標</th>{MONTHS[q].map((m) => <th key={m} style={th}>{m}</th>)}<th style={th}>目標</th></tr></thead>
            <tbody>{rows.map(([l, vs, g]) => <tr key={l}><td style={{ ...td, textAlign: "left", fontWeight: 500 }}>{l}</td>{vs.map((v, i) => <td key={i} style={td}>{v}</td>)}<td style={{ ...td, color: "var(--muted-foreground)" }}>{g}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section style={card}>
        <SectionHeading icon="MessageSquareText" title="今月の振り返り" description="9月"><Select size="sm" options={["9月", "8月", "7月"]} defaultValue="9月" aria-label="月" /></SectionHeading>
        <Field label="達成できたこと" htmlFor="r1"><Textarea id="r1" rows={3} placeholder="今月達成できたこと" /></Field>
        <Field label="課題と来月の一手" htmlFor="r2"><Textarea id="r2" rows={3} placeholder="課題認識と来月の行動" /></Field>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "var(--muted-foreground)" }}><span>評価者コメント: 未入力</span><Button size="sm" icon="Send" onClick={() => toast({ kind: "success", message: "評価者に共有しました" })}>評価者に共有</Button></div>
      </section>
    </div>
  );
}

/** コミットメント。帯廃止、自分のカード + チーム（事業部ごと折りたたみ）。他人のカードも 13px 以上。 */
export function CommitScreen({ toast }) {
  const { PageHeader, Button, SectionHeading, Badge, KpiCard } = window.DVB;
  const L = window.LucideReact;
  const [openDiv, setOpenDiv] = useState({ "事業部A": true });
  const me = { name: "髙仲", text: "毎日 18:00 までに日報を送信する", streak: 12, hit: true, week: [1, 1, 1, 0, 1] };
  const team = { "事業部A": [{ name: "白井", text: "週 2 本の新規 CR を配信開始", streak: 4, hit: true, week: [1, 1, 1, 1, 0] }, { name: "井上", text: "TikTok CPN の入札を毎朝確認", streak: 0, hit: false, miss: 3, week: [0, 0, 1, 0, 0] }, { name: "三冨", text: "検証CPの結果を金曜にまとめる", streak: 2, hit: true, week: [1, 1, 0, 1, 1] }], "事業部B": [{ name: "佐藤", text: "D社の切り分けを日次で更新", streak: 1, hit: true, week: [1, 0, 1, 1, 1] }] };
  const dots = (w) => <span style={{ display: "inline-flex", gap: 4 }} aria-label="今週の達成">{["月", "火", "水", "木", "金"].map((d, i) => <span key={d} title={d} style={{ width: 16, height: 16, borderRadius: 4, background: w[i] ? "var(--positive)" : "var(--muted)", display: "grid", placeItems: "center" }}>{w[i] ? <L.Check size={10} strokeWidth={3} color="#fff" /> : null}</span>)}</span>;
  const person = (p, mine) => (
    <div key={p.name} style={{ ...card, gap: 8, padding: mine ? 16 : 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Badge kind="assignee" value={p.name} /><span style={{ marginLeft: "auto" }}>{p.hit ? <Badge value="done" label={`連続 ${p.streak} 日`} /> : <Badge value="late" label={`連続未達 ${p.miss} 日`} />}</span></div>
      <div style={{ fontSize: mine ? 16 : 14, lineHeight: mine ? "24px" : "20px", fontWeight: 500 }}>{p.text}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "var(--muted-foreground)" }}>{dots(p.week)}{mine ? <Button size="sm" variant="primary" icon="Check" onClick={() => toast({ kind: "success", message: "今日の達成を記録しました" })}>今日達成</Button> : <span style={{ fontVariantNumeric: "tabular-nums" }}>今週 {p.week.filter(Boolean).length}/5</span>}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="Target" title="コミットメント" description="毎日の約束を 1 つ。達成を記録し、チームで見える"><Button icon="Pencil">約束を編集</Button></PageHeader>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) repeat(2, minmax(0,1fr))", gap: 12, alignItems: "stretch" }}>
        {person(me, true)}
        <KpiCard label="チーム達成率（今週）" value="72" unit="%" delta={{ value: -6, unit: "pt" }} note="先週 78%" />
        <KpiCard label="連続未達" value="1" unit="名" note="井上 3 日" />
      </div>
      <SectionHeading icon="Users" title="チーム" count={Object.values(team).flat().length} />
      {Object.entries(team).map(([div, ps]) => {
        const open = !!openDiv[div]; const Chev = open ? L.ChevronDown : L.ChevronRight;
        return (
          <section key={div} style={{ ...card, padding: 0, gap: 0 }}>
            <button type="button" aria-expanded={open} onClick={() => setOpenDiv((o) => ({ ...o, [div]: !open }))} style={{ display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 16px", border: 0, background: "transparent", cursor: "pointer", textAlign: "left", fontSize: 16, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap" }}><Chev size={16} color="var(--muted-foreground)" />{div}<span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{ps.length} 名 · 未達 {ps.filter((p) => !p.hit).length}</span></button>
            {open ? <div style={{ padding: "0 16px 16px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>{ps.map((p) => person(p, false))}</div> : null}
          </section>
        );
      })}
    </div>
  );
}

/** ダッシュボード。白カードに置換のみ。空状態に「今日やること: 日報を書く」の導線 1 つ。 */
export function DashboardScreen({ toast, onNavigate }) {
  const { PageHeader, Button, KpiCard, SectionHeading, Badge, EmptyState, MetricCell } = window.DVB;
  const tasks = BOARD_ROWS.flatMap((r) => r.tasks.map((t) => ({ ...t, project: r.name }))).filter((t) => !t.done);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="LayoutDashboard" title="ダッシュボード" description="9/9（火）。今日やることと今週の数値" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        <KpiCard label="今週の利益" value={yen(3523500)} delta={{ value: 61900, prefix: "¥", digits: 0 }} note="前週比" />
        <KpiCard label="ROAS" value="206.4" unit="%" delta={{ value: 3.2, unit: "pt" }} note="前週比" />
        <KpiCard label="未完了タスク" value={tasks.length} unit="件" note={`期限超過 ${tasks.filter((t) => t.overdue).length}`} />
        <KpiCard label="今日の日報" value="未送信" note="18:00 まで" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)", gap: 16, alignItems: "start" }}>
        <section style={card}>
          <SectionHeading icon="ListTodo" title="今週のタスク" count={tasks.length}><Button size="sm" variant="ghost" icon="ArrowRight" onClick={() => onNavigate && onNavigate("board")}>ボードで見る</Button></SectionHeading>
          {tasks.map((t) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", alignItems: "center", gap: 12, minHeight: 36, borderBottom: "1px solid var(--border)", fontSize: 14 }}>
              <span style={{ minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><span style={{ color: "var(--muted-foreground)", fontSize: 13, marginRight: 8 }}>{t.project}</span>{t.text}</span>
              <Badge kind="assignee" value={t.assignee} />
              <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: t.overdue ? "var(--negative)" : "var(--muted-foreground)", minWidth: 56, textAlign: "right" }}>{t.due}{t.overdue ? " 超過" : ""}</span>
            </div>
          ))}
        </section>
        <section style={card}>
          <SectionHeading icon="BookOpen" title="今日やること" />
          <EmptyState compact icon="BookOpen" title="今日の日報はまだ書いていません。" description="18:00 までに送信するとチャットワークに通知されます。" action={<Button variant="primary" icon="PenLine" onClick={() => onNavigate && onNavigate("mbo")}>日報を書く</Button>} />
        </section>
      </div>
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { GoalScreen, CommitScreen, DashboardScreen });
