import React, { useState } from "react";
import { PROJECTS, GG_MEMBERS, HIT_COUNTS, HIT_REQUESTS_TO_ME, HIT_MY_REQUESTS, HIT_APPROVALS, HIT_MEASURES } from "./data.js";

/* バッチ 2: ヒット施策 /hit-measures。カード 4 色 → 白 + SectionHeading + 件数 Badge。ボタン位置は現状維持。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };
const yen = (n) => `¥${Math.round(n).toLocaleString("ja-JP")}`;
const MEDIA = ["FB", "TikTok", "Google", "その他"];

export function HitMeasuresScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Badge, Select, Input, Textarea, Field, Dialog, ConfirmDialog, EmptyState, Skeleton, DraftRestoreBanner } = window.DVB;
  const { ErrorBand } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const has = !loading && !empty && !error;
  const [reqOpen, setReqOpen] = useState(false);
  const [toMe, setToMe] = useState(has ? HIT_REQUESTS_TO_ME : []);
  const [mine, setMine] = useState(has ? HIT_MY_REQUESTS : []);
  const [approvals, setApprovals] = useState(has ? HIT_APPROVALS : []);
  const [measures, setMeasures] = useState(has ? HIT_MEASURES : []);
  const [project, setProject] = useState("全案件");
  const [openMonths, setOpenMonths] = useState({ "2026年9月": true });
  const [expanded, setExpanded] = useState(null);
  const [fill, setFill] = useState(null);
  const [review, setReview] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [draft, setDraft] = useState(true);
  const [form, setForm] = useState({ media: "FB", title: "", content: "", before: "", after: "", point: "" });

  const counts = { waiting: toMe.length, approval: approvals.length, done: has ? HIT_COUNTS.done : 0 };
  const months = [...new Set(measures.map((m) => m.month))];
  const visible = measures.filter((m) => project === "全案件" || m.project === project);
  const row = { display: "flex", alignItems: "center", gap: 12, minHeight: 48, padding: "6px 0", borderTop: "1px solid var(--border)" };
  const skel = (n) => <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{Array.from({ length: n }, (_, i) => <Skeleton key={i} height={40} />)}</div>;
  const none = (text) => <div style={{ ...muted, padding: "8px 0" }}>{text}</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ① h1 + 右に Badge 3 */}
      <PageHeader icon="Sparkles" title="ヒット施策共有" description="うまくいった施策を記入し、チームで再現する">
        <Badge value="todo" label={`記入待ち ${counts.waiting}`} />
        <Badge value="info" label={`編集承認待ち ${counts.approval}`} />
        <Badge value="done" label={`完了 ${counts.done}`} />
      </PageHeader>
      {error ? <ErrorBand message="ヒット施策を取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}

      {/* ② 全幅ボタン → フォーム展開（下部 キャンセル / 依頼を送信 並列） */}
      <section style={{ ...card, padding: reqOpen ? 16 : 0, gap: reqOpen ? 12 : 0, overflow: "hidden" }}>
        {reqOpen ? (<>
          <SectionHeading icon="Send" title="ヒット施策の記入を依頼する" description="依頼先のチャットワークに通知されます" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
            <Field label="案件" htmlFor="rq-p" required><Select id="rq-p" options={PROJECTS} placeholder="案件を選ぶ" width="100%" /></Field>
            <Field label="依頼先" htmlFor="rq-m" required><Select id="rq-m" options={GG_MEMBERS} placeholder="メンバーを選ぶ" width="100%" /></Field>
            <Field label="期限" htmlFor="rq-d"><Input id="rq-d" type="date" defaultValue="2026-09-19" /></Field>
          </div>
          <Field label="依頼メモ" htmlFor="rq-n" help="何をまとめてほしいか 1 行"><Textarea id="rq-n" rows={2} placeholder="例: 型C の勝ちパターン（訴求・構成）をまとめてください" /></Field>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" block onClick={() => setReqOpen(false)}>キャンセル</Button>
            <Button variant="primary" block icon="Send" onClick={() => { setReqOpen(false); setMine((m) => [{ id: "mr" + Date.now(), to: "白井", project: PROJECTS[0], due: "9/19", status: "todo" }, ...m]); toast({ kind: "success", message: "記入依頼を送信しました" }); }}>依頼を送信</Button>
          </div>
        </>) : <Button variant="secondary" block icon="Plus" onClick={() => setReqOpen(true)} style={{ height: 44, borderRadius: "var(--radius)" }}>ヒット施策の記入を依頼する</Button>}
      </section>

      {/* ③ あなたへの記入依頼（amber → 白 + warning Badge） */}
      <section style={card}>
        <SectionHeading icon="Inbox" title="あなたへの記入依頼"><Badge value="todo" label={`${toMe.length} 件`} /></SectionHeading>
        {loading ? skel(2) : toMe.length === 0 ? none("あなたへの記入依頼はありません") : toMe.map((r) => (
          <div key={r.id} style={row}>
            <span style={{ fontWeight: 500, fontSize: 14, minWidth: 120 }}>{r.project}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.note}</span>
            <span style={{ ...muted, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>依頼者 <Badge kind="assignee" value={r.from} /></span>
            <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>期限 {r.due}</span>
            <Button size="sm" variant="primary" icon="PenLine" onClick={() => { setFill(r); setForm({ media: "FB", title: "", content: "", before: "", after: "", point: "" }); setDraft(true); }}>記入する</Button>
          </div>
        ))}
      </section>

      {/* ④ あなたが依頼した一覧（blue → 白 + info Badge） */}
      <section style={card}>
        <SectionHeading icon="SendHorizontal" title="あなたが依頼した一覧"><Badge value="info" label={`${mine.length} 件`} /></SectionHeading>
        {loading ? skel(2) : mine.length === 0 ? none("依頼中の記入はありません") : mine.map((r) => (
          <div key={r.id} style={row}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 120 }}><Badge kind="assignee" value={r.to} /></span>
            <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{r.project}</span>
            <Badge value={r.status === "done" ? "done" : "todo"} label={r.status === "done" ? "記入済み" : "記入待ち"} />
            <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>期限 {r.due}</span>
            <Button size="sm" variant="destructive" icon="X" disabled={r.status === "done"} onClick={() => setConfirm({ title: "記入依頼を取り消しますか？", description: `${r.to} への「${r.project}」の依頼を取り消します。相手には取り消しが通知されます。`, confirmLabel: "取り消す", onConfirm: () => { setMine((m) => m.filter((x) => x.id !== r.id)); setConfirm(null); toast({ kind: "success", message: "依頼を取り消しました" }); } })}>取り消し</Button>
          </div>
        ))}
      </section>

      {/* ⑤ 編集承認待ち（purple → 白 + warning Badge） */}
      <section style={card}>
        <SectionHeading icon="FileCheck2" title="編集承認待ち"><Badge value="todo" label={`${approvals.length} 件`} /></SectionHeading>
        {loading ? skel(1) : approvals.length === 0 ? none("承認待ちの編集はありません") : approvals.map((a) => (
          <div key={a.id} style={row}>
            <Badge kind="assignee" value={a.by} />
            <span style={{ fontWeight: 500, fontSize: 14, minWidth: 120 }}>{a.project}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</span>
            <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{a.at}</span>
            <Button size="sm" variant="secondary" icon="Eye" onClick={() => setReview(a)}>内容を確認</Button>
          </div>
        ))}
      </section>

      {/* ⑥ ヒット施策（emerald 帯 → SectionHeading + positive Badge。表の上に案件 Select、月別アコーディオン） */}
      <section style={card}>
        <SectionHeading icon="Sparkles" title="ヒット施策"><Badge value="done" label={`${visible.length} 件`} /></SectionHeading>
        <div><Select size="sm" value={project} options={["全案件", ...PROJECTS]} onChange={(e) => setProject(e.target.value)} width={220} aria-label="案件" /></div>
        {loading ? skel(3) : visible.length === 0 ? <EmptyState icon="Sparkles" title="ヒット施策はまだありません" description="うまくいった施策を記入すると、月別にここへ並びます。" action={<Button variant="primary" icon="Plus" onClick={() => setReqOpen(true)}>記入を依頼する</Button>} /> : months.map((mo) => {
          const list = visible.filter((m) => m.month === mo); if (!list.length) return null;
          const open = !!openMonths[mo]; const Chev = open ? L.ChevronDown : L.ChevronRight;
          return (
            <div key={mo} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <button type="button" aria-expanded={open} onClick={() => setOpenMonths((o) => ({ ...o, [mo]: !open }))} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", height: 44, padding: "0 12px", border: 0, background: "transparent", cursor: "pointer", textAlign: "left", fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>
                <Chev size={16} color="var(--muted-foreground)" aria-hidden /><span style={{ fontVariantNumeric: "tabular-nums" }}>{mo}</span><Badge kind="count" value={list.length} />
              </button>
              {open ? list.map((m) => {
                const ex = expanded === m.id;
                return (
                  <div key={m.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <button type="button" aria-expanded={ex} onClick={() => setExpanded(ex ? null : m.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", minHeight: 48, padding: "8px 12px 8px 36px", border: 0, background: ex ? "var(--primary-subtle)" : "transparent", cursor: "pointer", textAlign: "left", color: "var(--foreground)" }}>
                      <Badge kind="media" value={m.media} />
                      <span style={{ fontWeight: 500, fontSize: 14, whiteSpace: "nowrap" }}>{m.project}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</span>
                      <Badge kind="assignee" value={m.author} />
                      <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{m.date}</span>
                    </button>
                    {ex ? (
                      <div style={{ padding: "4px 12px 12px 36px", display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 12 }}>
                          <div style={{ fontSize: 14, lineHeight: "22px" }}><div style={muted}>施策内容</div>{m.content}</div>
                          <div style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--muted)", fontSize: 13 }}>
                            <div style={muted}>CPA</div>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, fontVariantNumeric: "tabular-nums" }}><span style={{ color: "var(--muted-foreground)" }}>{yen(m.before)}</span><L.ArrowRight size={14} aria-hidden color="var(--muted-foreground)" /><span style={{ fontSize: 18, fontWeight: 600 }}>{yen(m.after)}</span><span style={{ color: "var(--positive)", fontWeight: 600 }}>{Math.round((1 - m.after / m.before) * 100)}% 改善</span></div>
                          </div>
                        </div>
                        <div style={{ fontSize: 14, lineHeight: "22px" }}><div style={muted}>再現のポイント</div>{m.point}</div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                          <Button size="sm" variant="secondary" icon="Pencil" onClick={() => toast({ kind: "info", message: "編集は承認待ちに入ります" })}>編集</Button>
                          <Button size="sm" variant="destructive" icon="Trash2" onClick={() => setConfirm({ title: "ヒット施策を削除しますか？", description: `「${m.title}」が削除されます。この操作は取り消せません。`, confirmLabel: "削除", onConfirm: () => { setMeasures((ms) => ms.filter((x) => x.id !== m.id)); setConfirm(null); setExpanded(null); toast({ kind: "success", message: "削除しました" }); } })}>削除</Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              }) : null}
            </div>
          );
        })}
      </section>

      {/* 記入 Dialog（下部 キャンセル / 完了して送信） */}
      {fill ? (
        <Dialog open size="md" title="ヒット施策を記入" description={`${fill.project} · 依頼者 ${fill.from} · 期限 ${fill.due}`} onClose={() => setFill(null)} confirmLabel="完了して送信" confirmDisabled={!form.title.trim() || !form.content.trim()}
          onConfirm={() => { setMeasures((ms) => [{ id: "h" + Date.now(), month: "2026年9月", project: fill.project, media: form.media, title: form.title, author: "大倉", date: "9/9", content: form.content, before: Number(form.before) || 0, after: Number(form.after) || 0, point: form.point }, ...ms]); setToMe((t) => t.filter((x) => x.id !== fill.id)); setFill(null); toast({ kind: "success", message: `${fill.from} に送信しました` }); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {draft ? <DraftRestoreBanner time="9/8 22:14" onRestore={() => { setForm({ media: "FB", title: "型C の CR 差し替え", content: "冒頭 3 秒を結果提示に変更。", before: "13200", after: "", point: "" }); setDraft(false); toast({ kind: "success", message: "下書きを復元しました" }); }} onDiscard={() => setDraft(false)} /> : null}
            <div style={{ ...muted, padding: "8px 10px", background: "var(--muted)", borderRadius: "var(--radius-sm)" }}>依頼メモ: {fill.note}</div>
            <div style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr)", gap: 12 }}>
              <Field label="媒体" htmlFor="hf-m"><Select id="hf-m" value={form.media} options={MEDIA} onChange={(e) => setForm({ ...form, media: e.target.value })} width="100%" /></Field>
              <Field label="施策タイトル" htmlFor="hf-t" required><Input id="hf-t" value={form.title} placeholder="例: 型B → 型C の CR 差し替えで CPA 18% 改善" onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            </div>
            <Field label="施策内容" htmlFor="hf-c" required><Textarea id="hf-c" rows={3} value={form.content} placeholder="何を、どう変えたか" onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="改善前 CPA（円）" htmlFor="hf-b"><Input id="hf-b" numeric value={form.before} placeholder="13200" onChange={(e) => setForm({ ...form, before: e.target.value })} /></Field>
              <Field label="改善後 CPA（円）" htmlFor="hf-a"><Input id="hf-a" numeric value={form.after} placeholder="10800" onChange={(e) => setForm({ ...form, after: e.target.value })} /></Field>
            </div>
            <Field label="再現のポイント" htmlFor="hf-p" help="他の案件で真似するときの注意"><Textarea id="hf-p" rows={2} value={form.point} onChange={(e) => setForm({ ...form, point: e.target.value })} /></Field>
          </div>
        </Dialog>
      ) : null}

      {/* 承認 Dialog（下部 却下（左・destructive）/ 承認（右・primary）） */}
      {review ? (
        <Dialog open size="md" title="編集内容を確認" description={`${review.project} · ${review.by} · ${review.at}`} onClose={() => setReview(null)} confirmLabel="承認" cancelLabel="閉じる"
          destructive={{ label: "却下", icon: "X", onClick: () => { setApprovals((a) => a.filter((x) => x.id !== review.id)); setReview(null); toast({ kind: "info", message: "編集を却下しました" }); } }}
          onConfirm={() => { setApprovals((a) => a.filter((x) => x.id !== review.id)); setReview(null); toast({ kind: "success", message: "編集を承認しました" }); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{review.title}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 12, borderRadius: "var(--radius)", border: "1px solid var(--border)", fontSize: 14, lineHeight: "22px" }}><div style={{ ...muted, marginBottom: 4 }}>変更前</div><span style={{ color: "var(--muted-foreground)", textDecoration: "line-through" }}>{review.before}</span></div>
              <div style={{ padding: 12, borderRadius: "var(--radius)", border: "1px solid var(--primary)", background: "var(--primary-subtle)", fontSize: 14, lineHeight: "22px" }}><div style={{ ...muted, marginBottom: 4 }}>変更後</div>{review.after}</div>
            </div>
          </div>
        </Dialog>
      ) : null}
      {confirm ? <ConfirmDialog title={confirm.title} description={confirm.description} confirmLabel={confirm.confirmLabel} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { HitMeasuresScreen });
