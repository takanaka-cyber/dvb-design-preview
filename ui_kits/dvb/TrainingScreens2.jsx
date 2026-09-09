import React, { useState } from "react";
import { TRAINING_VALUE_ROUNDS, TRAINING_VALUES, CR_TARGET, CR_OUTPUTS, PROJECTS, GLOSSARY_KPI, GLOSSARY_INDUSTRY, GLOSSARY_INTERNAL, QA_HISTORY, QA_THREADS, QA_TEMPLATES } from "./data.js";

/* バッチ 3: 研修（続き）: バリュー振り返り / CRアウトプット / 用語集 / Q&A */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" };
const SCALE = ["S", "A", "B", "C", "D"];
const SELF_BADGE = { S: "done", A: "done", B: "info", C: "todo", D: "late" };

/** 上長 FB 枠（--info-subtle、名前・日付付き） */
function FbBox({ fb, placeholder = "上長のフィードバックはまだありません" }) {
  const { Ic } = window.DVBKit;
  if (!fb) return <div style={{ padding: "10px 12px", borderRadius: "var(--radius)", border: "1px dashed var(--border)", ...muted }}>{placeholder}</div>;
  return (
    <div style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, lineHeight: "18px", fontWeight: 600 }}><Ic name="MessageSquareText" size={14} />{fb.by}からのフィードバック<span style={{ fontWeight: 400, fontVariantNumeric: "tabular-nums", marginLeft: "auto" }}>{fb.at}</span></div>
      <div style={{ fontSize: 14, lineHeight: "20px" }}>{fb.text}</div>
    </div>
  );
}

/* ================= バリュー振り返り（アコーディオン） ================= */
export function TrainingValuesScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, Badge, Select, Textarea, SegmentedControl, SaveStatus, DraftRestoreBanner, EmptyState, Button } = window.DVB;
  const { TrainingShell, Ic } = window.DVBKit;
  const empty = state === "empty";
  const [round, setRound] = useState(empty ? TRAINING_VALUE_ROUNDS[1] : TRAINING_VALUE_ROUNDS[0]);
  const [vals, setVals] = useState(TRAINING_VALUES);
  const [open, setOpen] = useState("v1");
  const [save, setSave] = useState("saved");
  const [draft, setDraft] = useState(!empty);
  const roundEmpty = empty || round !== TRAINING_VALUE_ROUNDS[0];
  const upd = (id, patch) => { setVals((vs) => vs.map((v) => (v.id === id ? { ...v, ...patch } : v))); setSave("saving"); clearTimeout(upd.t); upd.t = setTimeout(() => setSave("saved"), 900); };
  return (
    <TrainingShell page="training-values" onNavigate={onNavigate} empty={empty}>
      <PageHeader icon="Heart" title="バリュー振り返り" description="5 つのバリューを 1 つずつ。入力は自動保存">
        <SaveStatus state={roundEmpty ? "idle" : save} />
        <SegmentedControl aria-label="ラウンド" options={TRAINING_VALUE_ROUNDS} value={round} onChange={setRound} />
      </PageHeader>
      {draft && !roundEmpty ? <DraftRestoreBanner time="9/8 21:05" onRestore={() => { upd("v2", { note: "D社の要因分解を横で見た。自分では未実施。次は媒体か LP かを先に決めてから数値を見る。（復元）" }); setOpen("v2"); setDraft(false); toast({ kind: "success", message: "下書きを復元しました" }); }} onDiscard={() => setDraft(false)} /> : null}
      {roundEmpty ? <EmptyState icon="Heart" title={`${round} はまだ始まっていません`} description="上長が開始すると 5 つのバリューを記入できます。ラウンド 1 は左のセグメントで見られます。" action={<Button variant="secondary" onClick={() => setRound(TRAINING_VALUE_ROUNDS[0])}>ラウンド 1 を見る</Button>} /> : (
        <div style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
          {vals.map((v, i) => {
            const on = open === v.id;
            return (
              <section key={v.id} style={{ borderBottom: i < vals.length - 1 ? "1px solid var(--border)" : 0 }}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : v.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 56, padding: "0 16px", border: 0, background: on ? "var(--primary-subtle)" : "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--muted)", color: "var(--muted-foreground)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{i + 1}</span>
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 15, lineHeight: "22px", fontWeight: 600 }}>{v.name}</span>
                    <span style={{ ...muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.desc}</span>
                  </span>
                  {v.fb ? <span aria-label="上長 FB あり" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--info)", flexShrink: 0 }} /> : null}
                  {v.self ? <Badge value={SELF_BADGE[v.self]} label={`自己評価 ${v.self}`} /> : <Badge value="neutral" label="未記入" />}
                  <Ic name={on ? "ChevronUp" : "ChevronDown"} color="var(--muted-foreground)" />
                </button>
                {on ? (
                  <div style={{ padding: "4px 16px 16px 52px", display: "grid", gridTemplateColumns: "minmax(0,3fr) minmax(0,2fr)", gap: 16, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label htmlFor={`note-${v.id}`} style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500 }}>意識した点</label>
                      <Textarea id={`note-${v.id}`} rows={6} value={v.note} placeholder="この 2 週間で、このバリューをどう意識したか。できた場面・できなかった場面を具体的に" onChange={(e) => upd(v.id, { note: e.target.value })} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label htmlFor={`self-${v.id}`} style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500 }}>自己評価</label>
                        <Select id={`self-${v.id}`} value={v.self} placeholder="選択" options={SCALE} onChange={(e) => upd(v.id, { self: e.target.value })} width="100%" />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500 }}>上長 FB</span>
                        <FbBox fb={v.fb} />
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      )}
    </TrainingShell>
  );
}

/* ================= CRアウトプット（Dialog + 9:16 カードグリッド） ================= */
const APPEALS = ["結果提示", "悩み提示", "比較", "権威", "限定", "手順"];
const CR_TYPES = ["静止画", "動画 15s", "動画 30s"];
const THUMB_BG = ["var(--muted)", "var(--primary-subtle)", "oklch(0.95 0.01 250)", "var(--muted)", "oklch(0.93 0.015 255)"];
function CrCard({ it, onOpen, onEdit, onDelete }) {
  const { Ic } = window.DVBKit; const { IconButton } = window.DVBKit;
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 6 }}>
      <button type="button" onClick={onOpen} aria-label={`#${it.no} ${it.project} ${it.appeal} を拡大`} style={{ position: "relative", aspectRatio: "9 / 16", width: "100%", border: `1px solid ${h ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius)", background: THUMB_BG[it.tone], cursor: "pointer", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: h ? "0 0 0 1px var(--primary)" : "var(--shadow-card)", transition: "border-color var(--duration) var(--ease)" }}>
        <span style={{ display: "flex", justifyContent: "space-between", padding: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "var(--muted-foreground)", background: "var(--card)", borderRadius: 9999, padding: "2px 8px", border: "1px solid var(--border)" }}>#{it.no}</span>
          {it.fb ? <span aria-label="上長 FB あり" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--info)", marginTop: 4 }} /> : null}
        </span>
        <span style={{ display: "grid", placeItems: "center", color: "var(--muted-foreground)" }}><Ic name={it.type.startsWith("動画") ? "Video" : "Image"} size={28} /></span>
        <span style={{ padding: 10, textAlign: "left", display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 13, lineHeight: "18px", fontWeight: 600, color: "var(--foreground)" }}>{it.appeal}</span>
          <span style={{ ...muted, fontSize: 12 }}>{it.type}</span>
        </span>
      </button>
      {h ? <span style={{ position: "absolute", right: 6, top: 6, display: "inline-flex", gap: 2, background: "var(--card)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)" }}><IconButton icon="Pencil" label="編集" onClick={onEdit} /><IconButton icon="Trash2" label="削除" tone="destructive" onClick={onDelete} /></span> : null}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 13, lineHeight: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.project}</span>
        <span style={{ ...muted, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{it.date}</span>
      </div>
    </div>
  );
}
export function TrainingCrOutputScreen({ state = "normal", toast, narrow, onNavigate }) {
  const { PageHeader, Button, Badge, Progress, Dialog, ConfirmDialog, Field, Input, Select, Textarea, SaveStatus, EmptyState, DraftRestoreBanner } = window.DVB;
  const { TrainingShell, Ic } = window.DVBKit;
  const empty = state === "empty";
  const [items, setItems] = useState(empty ? [] : CR_OUTPUTS);
  const [form, setForm] = useState(null);
  const [view, setView] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [fbSave, setFbSave] = useState("idle");
  const [saving, setSaving] = useState(false);
  const done = empty ? 0 : CR_TARGET.done + (items.length - CR_OUTPUTS.length);
  const blank = { project: PROJECTS[0], appeal: APPEALS[0], type: CR_TYPES[0], memo: "", file: "" };
  const submit = () => { setSaving(true); setTimeout(() => { setSaving(false); if (form.id) setItems((xs) => xs.map((x) => (x.id === form.id ? { ...x, ...form } : x))); else setItems((xs) => [{ id: "cr" + Date.now(), no: done + 1, date: "9/9", tone: 1, fb: null, ...form }, ...xs]); setForm(null); toast({ kind: "success", message: form.id ? "CR アウトプットを更新しました" : `CR アウトプットを登録しました（${done + 1}/${CR_TARGET.total}）` }); }, 700); };
  const cols = narrow ? 3 : 4;
  return (
    <TrainingShell page="training-cr" onNavigate={onNavigate} empty={empty}>
      <PageHeader icon="Image" title="CRアウトプット" description={`30 日で ${CR_TARGET.total} 件。9:16 のサムネと訴求を登録`}>
        <Button variant="primary" icon="Plus" onClick={() => setForm(blank)}>新規追加</Button>
      </PageHeader>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Progress value={done} max={CR_TARGET.total} label={`${done}/${CR_TARGET.total}（${Math.round(done / CR_TARGET.total * 100)}%）· ${CR_TARGET.days} 日`} style={{ flex: 1 }} />
        <Badge value={done >= CR_TARGET.total ? "done" : "todo"} label={`期限 ${CR_TARGET.deadline}`} />
      </div>
      {items.length === 0 ? <EmptyState icon="Image" title="まだ CR アウトプットがありません" description="1 日 5 件が目安。サムネと訴求の 2 つだけで登録できます。" action={<Button variant="primary" icon="Plus" onClick={() => setForm(blank)}>新規追加</Button>} /> : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 16 }}>
          {items.map((it) => <CrCard key={it.id} it={it} onOpen={() => { setView(it); setFbSave(it.fb ? "saved" : "idle"); }} onEdit={() => setForm({ ...it })} onDelete={() => setConfirm(it)} />)}
        </div>
      )}
      {/* 新規追加 / 編集 Dialog（md） */}
      {form ? (
        <Dialog open size="md" title={form.id ? `CR アウトプット #${form.no} を編集` : "CR アウトプットを追加"} description="サムネ（9:16）・案件・訴求を登録します" onClose={() => setForm(null)} confirmLabel={form.id ? "更新" : "登録"} confirmLoading={saving} confirmDisabled={!form.appeal.trim()} onConfirm={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "180px minmax(0,1fr)", gap: 16 }}>
            <button type="button" onClick={() => { setForm({ ...form, file: "cr_" + Date.now() + ".png" }); toast({ kind: "success", message: "サムネを添付しました" }); }} style={{ aspectRatio: "9 / 16", border: `1px dashed ${form.file ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius)", background: form.file ? "var(--primary-subtle)" : "var(--muted)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", color: "var(--muted-foreground)", fontSize: 13, padding: 12, textAlign: "center", fontFamily: "inherit" }}>
              <Ic name={form.file ? "CircleCheck" : "Upload"} size={24} color={form.file ? "var(--primary)" : undefined} />{form.file ? "添付済み" : "サムネをドロップ\nまたはクリック"}<span style={{ fontSize: 12 }}>9:16 · PNG / JPG / MP4</span>
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="案件" htmlFor="cr-p"><Select id="cr-p" value={form.project} options={PROJECTS} onChange={(e) => setForm({ ...form, project: e.target.value })} width="100%" /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="訴求" htmlFor="cr-a" required><Select id="cr-a" value={form.appeal} options={APPEALS} onChange={(e) => setForm({ ...form, appeal: e.target.value })} width="100%" /></Field>
                <Field label="種別" htmlFor="cr-t"><Select id="cr-t" value={form.type} options={CR_TYPES} onChange={(e) => setForm({ ...form, type: e.target.value })} width="100%" /></Field>
              </div>
              <Field label="メモ" htmlFor="cr-m" help="参考にした CR・狙い。上長への一言でも可"><Textarea id="cr-m" rows={3} value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} /></Field>
              {!form.id ? <DraftRestoreBanner time="9/9 12:20" onRestore={() => { setForm({ ...form, project: PROJECTS[2], appeal: "比較", memo: "B社 比較記事の導入文と揃える（復元）" }); toast({ kind: "success", message: "下書きを復元しました" }); }} onDiscard={() => {}} /> : null}
            </div>
          </div>
        </Dialog>
      ) : null}
      {/* 拡大 Dialog（FB は Textarea + SaveStatus） */}
      {view ? (
        <Dialog open size="md" title={`#${view.no} ${view.project} · ${view.appeal}`} description={`${view.type} · 登録 ${view.date}`} onClose={() => setView(null)} hideFooter>
          <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 20 }}>
            <div style={{ aspectRatio: "9 / 16", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: THUMB_BG[view.tone], display: "grid", placeItems: "center", color: "var(--muted-foreground)" }}><Ic name={view.type.startsWith("動画") ? "Video" : "Image"} size={40} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)" }}>メモ</span><p style={{ margin: 0, fontSize: 14, lineHeight: "20px" }}>{view.memo || "—"}</p></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><label htmlFor="cr-fb" style={{ fontSize: 14, fontWeight: 500 }}>上長フィードバック</label><SaveStatus state={fbSave} /></div>
                <Textarea id="cr-fb" rows={4} defaultValue={view.fb ? view.fb.text : ""} placeholder="上長が記入します（研修生は閲覧のみ）" onChange={() => { setFbSave("saving"); clearTimeout(setFbSave.t); setFbSave.t = setTimeout(() => setFbSave("saved"), 900); }} />
                {view.fb ? <span style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>{view.fb.by} · {view.fb.at}</span> : null}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: "auto" }}>
                <Button variant="ghost" icon="Pencil" onClick={() => { setForm({ ...view }); setView(null); }}>編集</Button>
                <Button variant="secondary" onClick={() => setView(null)}>閉じる</Button>
              </div>
            </div>
          </div>
        </Dialog>
      ) : null}
      {confirm ? <ConfirmDialog title="CR アウトプットを削除しますか？" description={`#${confirm.no} ${confirm.project}・${confirm.appeal} を削除します。件数は ${done - 1} 件に戻ります。`} onCancel={() => setConfirm(null)} onConfirm={() => { setItems((xs) => xs.filter((x) => x.id !== confirm.id)); setConfirm(null); toast({ kind: "success", message: "削除しました" }); }} /> : null}
    </TrainingShell>
  );
}

/* ================= 用語集（静的） ================= */
const GLOSSARY_TABS = ["KPI", "業界用語", "社内用語"];
export function TrainingGlossaryScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, Input, SegmentedControl, DataTable, EmptyState, Button } = window.DVB;
  const { TrainingShell } = window.DVBKit;
  const [tab, setTab] = useState("KPI");
  const [q, setQ] = useState("");
  const hit = (x) => !q || x.term.includes(q) || (x.desc || "").includes(q) || (x.formula || "").includes(q);
  const kpi = GLOSSARY_KPI.filter(hit), rows = (tab === "業界用語" ? GLOSSARY_INDUSTRY : GLOSSARY_INTERNAL).filter(hit);
  const cols = [{ key: "term", label: "用語", width: 220, render: (r) => <span style={{ fontWeight: 600 }}>{r.term}</span> }, { key: "desc", label: "意味", wrap: true }];
  const none = <EmptyState compact icon="Search" title={`「${q}」に一致する用語はありません`} description="別の言葉で検索するか、Q&A で聞いてください。" action={<Button size="sm" variant="secondary" onClick={() => onNavigate && onNavigate("training-qa")}>Q&A で聞く</Button>} />;
  return (
    <TrainingShell page="training-glossary" onNavigate={onNavigate}>
      <PageHeader icon="BookMarked" title="用語集" description="KPI の式・業界用語・社内用語。用語と意味を部分一致で検索">
        <Input icon="Search" placeholder="用語・意味を検索" aria-label="検索" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 280 }} />
      </PageHeader>
      <SegmentedControl aria-label="分類" options={GLOSSARY_TABS} value={tab} onChange={setTab} />
      {tab === "KPI" ? (kpi.length === 0 ? none : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
          {kpi.map((g) => (
            <div key={g.id} style={{ ...card, gap: 8 }}>
              <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600 }}>{g.term}</div>
              <code style={{ display: "block", padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--muted)", color: "var(--foreground)", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: "18px" }}>{g.term} = {g.formula}</code>
              <div style={{ fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>{g.desc}</div>
            </div>
          ))}
        </div>
      )) : (
        <DataTable columns={cols} rows={rows} density="standard" stickyHeader maxHeight={640} emptyNode={none} />
      )}
    </TrainingShell>
  );
}

/* ================= Q&A（ChatPanel + 左 240「過去の質問」常設 / スマホはドロワー） ================= */
function HistoryList({ history, active, onPick, loading }) {
  const { Skeleton } = window.DVB;
  const [h, setH] = useState(null);
  if (loading) return <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} height={14} width={`${60 + (i % 2) * 25}%`} />)}</div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "auto", minHeight: 0, padding: "4px 8px 8px" }}>
      {history.map((g) => (
        <div key={g.date} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ padding: "8px 8px 2px", fontSize: 11, lineHeight: "16px", fontWeight: 500, color: "var(--muted-foreground)" }}>{g.date}</div>
          {g.items.map((q) => { const on = q.id === active; return (
            <button key={q.id} type="button" aria-current={on ? "true" : undefined} onClick={() => onPick(q.id)} onMouseEnter={() => setH(q.id)} onMouseLeave={() => setH(null)}
              style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 36, padding: "6px 8px", border: 0, borderRadius: "var(--radius-sm)", background: on ? "var(--primary-subtle)" : h === q.id ? "var(--muted)" : "transparent", color: on ? "var(--primary-subtle-foreground)" : "var(--foreground)", cursor: "pointer", textAlign: "left", fontFamily: "inherit", fontSize: 13, lineHeight: "18px", fontWeight: on ? 600 : 400, position: "relative" }}>
              {on ? <span aria-hidden style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, borderRadius: 1, background: "var(--primary)" }} /> : null}
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.q}</span>
              {q.unanswered ? <span aria-label="未回答" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--warning)", flexShrink: 0 }} /> : null}
            </button>
          ); })}
        </div>
      ))}
    </div>
  );
}
const ANSWER = { text: "型B は「悩みの提示」から、型C は「結果の提示」から始めます。使い分けは案件の認知段階で決めます。\n・悩みが顕在化している（サプリ・保険比較）→ 型B\n・結果が想像しやすい（美容・記事 LP）→ 型C\nA社 記事LP の検証では型C で CPA −18%。まず型C を 1 本、型B を 1 本つくって比べるのが早いです。", sources: ["マニュアル §3.1", "検証ナレッジ k1", "ヒット施策 h1"] };
export function TrainingQaScreen({ state = "normal", toast, mobile, onNavigate }) {
  const { PageHeader, Button, ChatPanel, EmptyState, SectionHeading } = window.DVB;
  const { TrainingShell, ErrorBand, IconButton, Ic } = window.DVBKit;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const history = empty || error ? [] : QA_HISTORY;
  const [active, setActive] = useState(empty || error ? null : loading ? "q5" : "q4");
  const [threads, setThreads] = useState(() => { const t = { ...QA_THREADS }; if (loading) t.q5 = [...t.q5, { id: 2, role: "ai", text: "マニュアル §3.1 と検証ナレッジを確認しています", streaming: true }]; return t; });
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(loading);
  const [tpl, setTpl] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [voted, setVoted] = useState({});
  const [newThreads, setNewThreads] = useState([]);
  const actions = (tid, mid) => (
    <span style={{ display: "inline-flex", gap: 4 }}>
      {voted[`${tid}-${mid}`] ? <span style={{ ...muted, display: "inline-flex", alignItems: "center", gap: 4 }}><Ic name="Check" size={13} color="var(--positive)" />ありがとうございます</span> : (<>
        <Button size="sm" variant="ghost" icon="ThumbsUp" onClick={() => setVoted({ ...voted, [`${tid}-${mid}`]: true })}>役に立った</Button>
        <Button size="sm" variant="ghost" icon="ThumbsDown" onClick={() => { setVoted({ ...voted, [`${tid}-${mid}`]: true }); toast({ kind: "info", message: "上長に共有しました。後で回答が届きます" }); }}>立たなかった</Button>
      </>)}
    </span>
  );
  const msgs = active && threads[active] ? threads[active].map((m) => (m.role === "ai" && !m.streaming ? { ...m, actions: actions(active, m.id) } : m)) : [];
  const send = (t) => {
    const tid = active || "n" + Date.now();
    const base = threads[tid] || [];
    setThreads((th) => ({ ...th, [tid]: [...base, { id: Date.now(), role: "user", text: t, at: "15:57" }, { id: "s" + Date.now(), role: "ai", text: "マニュアルと用語集を確認しています", streaming: true }] }));
    if (!active) { setActive(tid); setNewThreads((n) => [{ id: tid, q: t }, ...n]); }
    setValue(""); setSending(true); setTpl(null);
    setTimeout(() => { setSending(false); setThreads((th) => ({ ...th, [tid]: th[tid].map((m) => (m.streaming ? { ...m, streaming: false, text: ANSWER.text, sources: ANSWER.sources, at: "15:57" } : m)) })); }, 1500);
  };
  const fullHistory = newThreads.length ? [{ date: "今日 9/9", items: [...newThreads, ...(history[0] && history[0].date.startsWith("今日") ? history[0].items : [])] }, ...history.filter((g) => !g.date.startsWith("今日"))] : history;
  const emptyNode = <EmptyState icon="Bot" title="質問を入力すると、マニュアルと用語集をもとに答えます" description="用語の意味、画面の場所、数値の見方。Enter で送信、Shift+Enter で改行。" />;
  const pick = (id) => { setActive(id); setDrawer(false); };
  const newQ = () => { setActive(null); setValue(""); setDrawer(false); };
  const chat = (h) => (
    <ChatPanel height={h} style={mobile ? { flex: 1, minHeight: 0, borderRadius: "var(--radius)" } : undefined} messages={msgs} value={value} onChange={setValue} onSend={send} sending={sending} disabled={error}
      templates={active ? [] : QA_TEMPLATES} activeTemplate={tpl} onTemplate={(t) => { setTpl(t); setValue(t === "用語の意味" ? "「」の意味を教えて" : t === "画面の場所" ? "「」はどの画面にありますか？" : "「」が上がったときは何を見ればいい？"); }}
      emptyNode={emptyNode} inputFontSize={mobile ? 16 : 14} placeholder={error ? "接続を確認してください" : "質問を入力（Enter で送信・Shift+Enter で改行）"} />
  );

  if (mobile) {
    return (
      <TrainingShell page="training-qa" onNavigate={onNavigate} mobile empty={empty}>
        <PageHeader title="Q&A" description={active ? "続きの質問もここで" : "マニュアル・用語集から回答"} style={{ alignItems: "center", minHeight: 36 }}>
          <IconButton icon="Plus" label="新しい質問" onClick={newQ} />
          <span style={{ position: "relative" }}><IconButton icon="History" label="過去の質問" onClick={() => setDrawer(true)} />{fullHistory.some((g) => g.items.some((q) => q.unanswered)) ? <span aria-hidden style={{ position: "absolute", right: 5, top: 5, width: 6, height: 6, borderRadius: "50%", background: "var(--warning)" }} /> : null}</span>
        </PageHeader>
        {error ? <ErrorBand message="回答サーバーに接続できません" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", margin: "0 -16px", padding: "0 16px 0" }}>{chat("auto")}</div>
        {drawer ? (
          <div role="dialog" aria-modal="true" aria-label="過去の質問" style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
            <button type="button" aria-label="閉じる" onClick={() => setDrawer(false)} style={{ flex: 1, border: 0, background: "oklch(0 0 0 / 0.4)", cursor: "pointer", padding: 0 }} />
            <div style={{ width: 300, background: "var(--card)", display: "flex", flexDirection: "column", boxShadow: "0 8px 24px oklch(0 0 0 / 0.16)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, height: 56, padding: "0 8px 0 16px", borderBottom: "1px solid var(--border)" }}><span style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>過去の質問</span><IconButton icon="X" label="閉じる" onClick={() => setDrawer(false)} /></div>
              <div style={{ padding: "8px 8px 0" }}><Button variant="secondary" block icon="Plus" onClick={newQ}>新しい質問</Button></div>
              {fullHistory.length ? <HistoryList history={fullHistory} active={active} onPick={pick} loading={loading} /> : <EmptyState compact icon="History" title="過去の質問はありません" />}
            </div>
          </div>
        ) : null}
      </TrainingShell>
    );
  }
  return (
    <TrainingShell page="training-qa" onNavigate={onNavigate} empty={empty}>
      <PageHeader icon="MessageSquare" title="Q&A" description="マニュアルと用語集をもとに AI が答えます。過去の質問は左に残ります">
        <Button variant="secondary" icon="Plus" onClick={newQ}>新しい質問</Button>
      </PageHeader>
      {error ? <ErrorBand message="回答サーバーに接続できません。過去の質問は読めます" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}
      <div style={{ display: "grid", gridTemplateColumns: "240px minmax(0,1fr)", gap: 16, height: 680 }}>
        <aside aria-label="過去の質問" style={{ ...card, padding: 0, gap: 0, minHeight: 0 }}>
          <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid var(--border)" }}><SectionHeading level={3} icon="History" title="過去の質問" count={fullHistory.reduce((n, g) => n + g.items.length, 0)} /></div>
          {fullHistory.length || loading ? <HistoryList history={fullHistory} active={active} onPick={pick} loading={loading && !fullHistory.length} /> : <EmptyState compact icon="History" title="過去の質問はありません" description="質問すると、ここに日付ごとに残ります。" />}
        </aside>
        {chat("100%")}
      </div>
    </TrainingShell>
  );
}

window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { TrainingValuesScreen, TrainingCrOutputScreen, TrainingGlossaryScreen, TrainingQaScreen });
