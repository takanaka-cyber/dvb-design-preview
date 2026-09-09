import React, { useState } from "react";
import { GG_MEMBERS, SEPT_DAYS, MBO_MONTHLY, MBO_HISTORY } from "./data.js";

const TODAY = 9;

/** 日報 月別（見る側、/mbo/monthly）。記載済み／未記載が開かずに分かるグリッド + 右パネルでコメント入力。 */
export function MboMonthlyScreen({ state = "normal", toast, narrow }) {
  const { PageHeader, Button, KpiCard, Badge, EmptyState, SectionHeading, Field, Textarea, Select, DataTable } = window.DVB;
  const L = window.LucideReact; const Check = L.Check, Minus = L.Minus, Prev = L.ChevronLeft, Next = L.ChevronRight, Msg = L.MessageSquare;
  const loading = state === "loading", error = state === "error", empty = state === "empty";
  const [sel, setSel] = useState(empty || loading || error ? null : { name: "白井", d: 8 });
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState({});
  const grid = empty ? [] : MBO_MONTHLY;
  const missing = grid.filter((m) => m.cells[TODAY - 1].s === "none").map((m) => m.name);
  const cellW = narrow ? 26 : 30;
  const days = SEPT_DAYS;
  const cell = (c, name) => {
    const active = sel && sel.name === name && sel.d === c.d;
    const isToday = c.d === TODAY;
    const base = { width: cellW, height: 36, display: "grid", placeItems: "center", border: 0, borderRadius: "var(--radius-sm)", cursor: c.s === "future" ? "default" : "pointer", background: active ? "var(--primary-subtle)" : "transparent", boxShadow: active ? "inset 0 0 0 1px var(--primary)" : isToday ? "inset 0 0 0 1px var(--border)" : "none", padding: 0, fontSize: 12, fontWeight: 500 };
    const t = c.s === "sent" ? <Check size={14} strokeWidth={2.5} color="var(--positive)" aria-label="送信済み" /> : c.s === "none" ? <Minus size={14} strokeWidth={2} color="var(--disabled-foreground)" aria-label="未記載" /> : c.s === "off" ? <span style={{ color: "var(--muted-foreground)" }} aria-label="休み">休</span> : null;
    return <button key={c.d} type="button" disabled={c.s === "future"} onClick={() => setSel({ name, d: c.d })} title={`${name} 9/${c.d} ${c.s === "sent" ? "送信済み" : c.s === "none" ? "未記載" : c.s === "off" ? "休み" : ""}`} style={base}>{t}</button>;
  };
  const rec = sel ? MBO_HISTORY.find((h) => h.d === sel.d) : null;
  const selStatus = sel ? grid.find((m) => m.name === sel.name)?.cells[sel.d - 1].s : null;
  const send = () => { if (!comment.trim()) return; setSent((s) => ({ ...s, [`${sel.name}-${sel.d}`]: { text: comment, at: "15:58" } })); setComment(""); toast({ kind: "success", message: `${sel.name}さんにコメントを送信しました` }); };
  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="CalendarDays" title="日報 月別" description="メンバー × 日付。開かずに記載済み／未記載が分かる">
        <Button icon="Download">CSV</Button>
      </PageHeader>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div role="group" aria-label="月" style={{ display: "inline-flex", alignItems: "stretch" }}>
          <button type="button" aria-label="前月" style={{ width: 36, height: 36, display: "grid", placeItems: "center", border: "1px solid var(--border)", borderRadius: "var(--radius) 0 0 var(--radius)", background: "var(--card)", cursor: "pointer", padding: 0, color: "var(--foreground)" }}><Prev size={16} /></button>
          <span style={{ display: "inline-flex", alignItems: "center", height: 36, padding: "0 16px", border: "1px solid var(--border)", borderLeft: 0, borderRight: 0, background: "var(--card)", fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>2026年 9月</span>
          <button type="button" aria-label="次月" disabled style={{ width: 36, height: 36, display: "grid", placeItems: "center", border: "1px solid var(--border)", borderRadius: "0 var(--radius) var(--radius) 0", background: "var(--card)", cursor: "not-allowed", opacity: 0.5, padding: 0, color: "var(--foreground)" }}><Next size={16} /></button>
        </div>
        <Select options={["GG（全員）", "事業部A", "事業部B"]} defaultValue="GG（全員）" aria-label="チーム" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: narrow ? "220px minmax(0,1fr)" : "260px minmax(0,1fr)", gap: 12, alignItems: "stretch" }}>
        <KpiCard label="今日の未記載" value={loading ? undefined : empty ? "—" : missing.length} unit={empty ? undefined : "名"} note={`9/${TODAY}（火）`} loading={loading} error={error} />
        <div style={{ ...card, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)" }}>未記載のメンバー</div>
          {loading ? <span style={{ height: 22, width: 200, background: "var(--muted)", borderRadius: 4 }} /> : error ? <span style={{ fontSize: 13, color: "var(--negative)" }}>取得できませんでした</span> : missing.length === 0 ? <span style={{ fontSize: 14, color: "var(--positive)", display: "inline-flex", alignItems: "center", gap: 6 }}><Check size={16} strokeWidth={2} />全員記載済み</span> : (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{missing.map((n) => <button key={n} type="button" onClick={() => setSel({ name: n, d: TODAY })} style={{ height: 28, padding: "0 10px", borderRadius: 9999, fontSize: 13, fontWeight: 500, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", color: "var(--foreground)" }}>{n}</button>)}</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: sel ? "minmax(0,1fr) 380px" : "minmax(0,1fr)", gap: 16, alignItems: "start" }}>
        <section style={{ ...card, overflow: "auto" }} aria-label="記載状況">
          {loading ? <div style={{ padding: 16, display: "grid", gap: 8 }}>{GG_MEMBERS.map((n) => <span key={n} style={{ height: 28, background: "var(--muted)", borderRadius: 4 }} />)}</div>
            : error ? <div style={{ padding: "32px 16px", textAlign: "center" }}><div style={{ color: "var(--negative)", fontWeight: 500, fontSize: 14 }}>データを取得できませんでした</div><Button size="sm" style={{ marginTop: 12 }} onClick={() => toast({ kind: "info", message: "再読み込みしています…" })}>再読み込み</Button></div>
            : empty ? <EmptyState icon="CalendarDays" title="この月の日報はまだありません。" description="メンバーが日報を送信すると、日付ごとに ✓ が付きます。" />
            : (
              <table style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: "100%" }}>
                <thead><tr>
                  <th scope="col" style={{ position: "sticky", left: 0, zIndex: 2, background: "var(--muted)", textAlign: "left", padding: "6px 12px", fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", borderBottom: "1px solid var(--border)", minWidth: 120, boxShadow: "1px 0 0 var(--border)" }}>メンバー</th>
                  {days.map((x) => <th key={x.d} scope="col" style={{ background: x.d === TODAY ? "var(--primary-subtle)" : "var(--muted)", padding: "4px 0", fontSize: 12, lineHeight: "14px", fontWeight: x.d === TODAY ? 600 : 500, color: x.weekend ? "var(--disabled-foreground)" : x.d === TODAY ? "var(--primary-subtle-foreground)" : "var(--muted-foreground)", borderBottom: "1px solid var(--border)", width: cellW, minWidth: cellW, fontVariantNumeric: "tabular-nums", textAlign: "center" }}><div>{x.d}</div><div style={{ fontWeight: 400 }}>{x.dow}</div></th>)}
                  <th scope="col" style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)", minWidth: 116 }} />
                </tr></thead>
                <tbody>
                  {grid.map((m) => (
                    <tr key={m.name}>
                      <th scope="row" style={{ position: "sticky", left: 0, zIndex: 1, background: "var(--card)", textAlign: "left", padding: "0 12px", height: 44, fontSize: 14, fontWeight: 500, borderBottom: "1px solid var(--border)", boxShadow: "1px 0 0 var(--border)", whiteSpace: "nowrap" }}>{m.name}</th>
                      {m.cells.map((c) => <td key={c.d} style={{ padding: "0", height: 44, borderBottom: "1px solid var(--border)", background: c.d === TODAY ? "var(--primary-subtle)" : "var(--card)", textAlign: "center" }}>{cell(c, m.name)}</td>)}
                      <td style={{ padding: "0 12px", borderBottom: "1px solid var(--border)", textAlign: "right", whiteSpace: "nowrap" }}><Button size="sm" icon="Sparkles" onClick={() => toast({ kind: "info", message: `${m.name}さんの今月の日報を AI 分析します` })}>AI分析</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          {!loading && !error && !empty ? <div style={{ display: "flex", gap: 16, padding: "8px 12px", fontSize: 12, color: "var(--muted-foreground)", borderTop: "1px solid var(--border)" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Check size={12} strokeWidth={2.5} color="var(--positive)" />送信済み</span><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Minus size={12} color="var(--disabled-foreground)" />未記載</span><span>休 休み</span></div> : null}
        </section>

        {sel ? (
          <aside style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 12 }} aria-label="日報とコメント">
            <SectionHeading level={3} icon="BookOpen" title={`${sel.name} · 9/${sel.d}`}>
              {selStatus === "sent" ? <Badge value="done" label="送信済み" /> : selStatus === "off" ? <Badge value="info" label="休み" /> : <Badge value="neutral" label="未記載" />}
              <button type="button" aria-label="閉じる" onClick={() => setSel(null)} style={{ width: 28, height: 28, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", borderRadius: "var(--radius-sm)" }}><L.X size={16} /></button>
            </SectionHeading>
            {selStatus === "sent" && rec ? (
              <>
                <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>良かった動き / 学んだこと</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{rec.good || "—"}</div></div>
                <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>反省点 / 改善点</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{rec.bad || "—"}</div></div>
              </>
            ) : <EmptyState compact icon="BookOpen" title={selStatus === "off" ? "この日は休みです。" : "この日の日報はまだ送信されていません。"} description={selStatus === "off" ? undefined : "送信されると、ここに内容が表示されます。"} />}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {(rec && rec.comment) || sent[`${sel.name}-${sel.d}`] ? [rec && rec.comment, sent[`${sel.name}-${sel.d}`] && { by: "上長", at: `9/9 ${sent[`${sel.name}-${sel.d}`].at}`, text: sent[`${sel.name}-${sel.d}`].text }].filter(Boolean).map((c, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}><div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}><Msg size={16} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" /><span style={{ fontWeight: 600 }}>{c.by}</span><span style={{ color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{c.at}</span></div><p style={{ margin: 0, fontSize: 14, lineHeight: "22px" }}>{c.text}</p></div>
              )) : null}
              <Field label="コメント" help="コメント者: 上長（Chief Manager）として送信されます" htmlFor="cm"><Textarea id="cm" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="気づいたこと・次のアクション" /></Field>
              <Button variant="primary" icon="Send" onClick={send} disabled={!comment.trim()} style={{ alignSelf: "flex-end" }}>コメントを送信</Button>
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.MboMonthlyScreen = MboMonthlyScreen;
