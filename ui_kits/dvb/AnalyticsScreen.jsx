import React, { useState } from "react";
import { ANALYTICS_TEMPLATE_GROUPS, ANALYTICS_HISTORY, ANALYTICS_REPORT } from "./data.js";

/* バッチ 2: 分析 /analytics。入力・テンプレ・レポートを ChatPanel に載せる。過去のレポート（右寄せトグル → 一覧、hover で 🗑 → ConfirmDialog）。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };

/** レポート本文。表は DataTable 相当（thead --muted、13px、tabular-nums） */
function Report({ r }) {
  const th = { background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, padding: "6px 10px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
  const td = { padding: "7px 10px", fontSize: 13, borderBottom: "1px solid var(--border)", fontVariantNumeric: "tabular-nums", verticalAlign: "top" };
  const h4 = { margin: "4px 0 0", fontSize: 14, fontWeight: 600 };
  return (
    <div className="analytics-report" style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
      <p style={{ margin: 0, fontWeight: 500 }}>{r.summary}</p>
      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
        <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%" }}>
          <thead><tr>{r.table.columns.map((c, i) => <th key={c} style={{ ...th, textAlign: i === 1 || i === 2 ? "right" : "left" }}>{c}</th>)}</tr></thead>
          <tbody>{r.table.rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j} style={{ ...td, textAlign: j === 1 || j === 2 ? "right" : "left", fontWeight: j === 0 ? 500 : 400, color: j === 2 ? (c.startsWith("−") ? "var(--negative)" : "var(--positive)") : "inherit", borderBottom: i === r.table.rows.length - 1 ? 0 : td.borderBottom }}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <h4 style={h4}>要因</h4><ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 2 }}>{r.factors.map((f) => <li key={f}>{f}</li>)}</ul>
      <h4 style={h4}>来週の一手</h4><ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 2 }}>{r.next.map((f) => <li key={f}>{f}</li>)}</ul>
    </div>
  );
}

export function AnalyticsScreen({ state = "normal", toast }) {
  const { PageHeader, Button, ChatPanel, ConfirmDialog, EmptyState, Skeleton } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [group, setGroup] = useState(ANALYTICS_TEMPLATE_GROUPS[0].key);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(loading);
  const [history, setHistory] = useState(error ? [] : ANALYTICS_HISTORY);
  const [showHistory, setShowHistory] = useState(!empty && !loading);
  const [hover, setHover] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const actions = (
    <span style={{ display: "inline-flex", gap: 4 }}>
      <Button size="sm" variant="ghost" icon="Save" onClick={() => toast({ kind: "success", message: "レポートを保存しました" })}>保存</Button>
      <Button size="sm" variant="ghost" icon="Eraser" onClick={() => { setMessages([]); toast({ kind: "info", message: "レポートをクリアしました" }); }}>クリア</Button>
    </span>
  );
  const initial = loading ? [{ id: "q", role: "user", text: ANALYTICS_REPORT.question, at: "15:56" }, { id: "a", role: "ai", text: "AXAD の今週分を集計しています", streaming: true }]
    : empty || error ? [] : [{ id: "q", role: "user", text: ANALYTICS_REPORT.question, at: ANALYTICS_REPORT.at }, { id: "a", role: "ai", content: <Report r={ANALYTICS_REPORT} />, at: ANALYTICS_REPORT.at, actions }];
  const [messages, setMessages] = useState(initial);
  const send = (t) => {
    setMessages((m) => [...m, { id: Date.now(), role: "user", text: t, at: "15:57" }, { id: "s" + Date.now(), role: "ai", text: "集計しています", streaming: true }]); setValue(""); setSending(true);
    setTimeout(() => { setSending(false); setMessages((m) => m.map((x) => (x.streaming ? { ...x, streaming: false, text: undefined, content: <Report r={{ ...ANALYTICS_REPORT, summary: `修正版: ${ANALYTICS_REPORT.summary}` }} />, at: "15:57", actions } : x))); setHistory((h) => [{ id: "ah" + Date.now(), question: t, at: "9/9 15:57" }, ...h]); }, 1600);
  };
  const g = ANALYTICS_TEMPLATE_GROUPS.find((x) => x.key === group);
  const header = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div role="group" aria-label="テンプレートのグループ" style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={muted}>テンプレート</span>
        {ANALYTICS_TEMPLATE_GROUPS.map((x) => { const on = x.key === group; return <button key={x.key} type="button" aria-pressed={on} onClick={() => setGroup(x.key)} style={{ height: 26, padding: "0 10px", borderRadius: 9999, fontSize: 13, fontWeight: 500, cursor: "pointer", border: `1px solid ${on ? "var(--primary)" : "var(--border)"}`, background: on ? "var(--primary-subtle)" : "var(--card)", color: on ? "var(--primary-subtle-foreground)" : "var(--foreground)" }}>{x.label}</button>; })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
        {g.items.map((t) => (
          <Button key={t.title} variant="secondary" onClick={() => setValue(t.body)} style={{ height: 72, padding: "10px 12px", alignItems: "flex-start", justifyContent: "flex-start", textAlign: "left", whiteSpace: "normal" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{t.title}</span><span style={{ fontSize: 13, fontWeight: 400, color: "var(--muted-foreground)", lineHeight: "18px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t.body}</span></span>
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="Activity" title="分析ダッシュボード" description="GG 1課 · 大倉 一郎 · 質問すると AXAD の集計から AI がレポートを作ります" />
      {error ? <ErrorBand message="AI レポートの生成に失敗しました。AXAD の集計に接続できません" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}
      <ChatPanel height={640} header={header} messages={messages} value={value} onChange={setValue} onSend={send} sending={sending} disabled={error}
        placeholder={messages.length ? "レポートを修正する（例: D社だけ媒体別に分けて）" : "質問を入力（Enter で送信・Shift+Enter で改行）"}
        emptyNode={<EmptyState icon="Bot" title="質問かテンプレートを選ぶと、AI がレポートを作ります" description="今週の数値・案件・メンバーについて聞けます。結果は「過去のレポート」に残ります。" />} />

      {/* ④ 過去のレポート トグル（右寄せ） */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="sm" variant="ghost" icon={showHistory ? "ChevronUp" : "History"} onClick={() => setShowHistory(!showHistory)}>過去のレポート{history.length ? `（${history.length}）` : ""}</Button>
      </div>
      {/* ⑤ 過去レポート一覧（行 hover で 🗑） */}
      {showHistory ? (
        <section style={{ ...card, padding: 0, gap: 0 }}>
          {loading ? <div style={{ padding: 16, display: "grid", gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={16} width={`${70 - i * 12}%`} />)}</div>
            : history.length === 0 ? <div style={{ padding: 16 }}><EmptyState compact icon="History" title="過去のレポートはまだありません" /></div>
            : history.map((h, i) => (
              <div key={h.id} onMouseEnter={() => setHover(h.id)} onMouseLeave={() => setHover(null)} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 44, padding: "0 8px 0 16px", borderTop: i ? "1px solid var(--border)" : 0, background: hover === h.id ? "var(--muted)" : "transparent" }}>
                <L.FileText size={16} color="var(--muted-foreground)" aria-hidden />
                <button type="button" onClick={() => { setValue(h.question); toast({ kind: "info", message: "質問を入力欄に戻しました" }); }} style={{ flex: 1, minWidth: 0, textAlign: "left", border: 0, background: "transparent", padding: 0, fontSize: 14, color: "var(--foreground)", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.question}</button>
                <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{h.at}</span>
                <span style={{ width: 32, visibility: hover === h.id ? "visible" : "hidden" }}><IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm(h)} /></span>
              </div>
            ))}
        </section>
      ) : null}
      {confirm ? <ConfirmDialog title="レポートを削除しますか？" description={`「${confirm.question}」（${confirm.at}）が削除されます。この操作は取り消せません。`} onConfirm={() => { setHistory((h) => h.filter((x) => x.id !== confirm.id)); setConfirm(null); toast({ kind: "success", message: "レポートを削除しました" }); }} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { AnalyticsScreen });
