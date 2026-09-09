import React, { useState } from "react";
import { COMMIT_MONTHS, MY_COMMITMENTS, TEAM_COMMITMENTS } from "./data.js";

/* バッチ 1: コミットメント /commitment（1440・4 状態）。月送りは同じ位置で帯なし、帯 → SectionHeading、進捗は Progress。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const TYPES = ["毎日", "週次", "月次"];

export function CommitScreenV2({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Badge, Input, Select, Textarea, Field, WeekSelector, SegmentedControl, Progress, ConfirmDialog, EmptyState, Skeleton } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [month, setMonth] = useState(0);
  const [items, setItems] = useState(empty || error || loading ? [] : MY_COMMITMENTS);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", type: "毎日", max: "" });
  const [open, setOpen] = useState(null);
  const [result, setResult] = useState({});
  const [divOpen, setDivOpen] = useState({ "事業部A": true, "事業部B": true });
  const [confirm, setConfirm] = useState(null);

  const achieved = items.filter((c) => (c.type === "毎日" ? c.doneToday : c.value >= c.max)).length;
  const late = items.filter((c) => c.late).length;
  const missStreak = Math.max(0, ...items.map((c) => c.missStreak || 0));
  const upd = (id, patch) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const add = () => { if (!draft.title.trim()) return; setItems((xs) => [...xs, { id: "c" + Date.now(), title: draft.title.trim(), type: draft.type, value: 0, max: draft.type === "毎日" ? 7 : Number(draft.max) || 1, doneToday: false, late: false, reason: "", reflection: "" }]); setDraft({ title: "", type: "毎日", max: "" }); setAdding(false); toast({ kind: "success", message: "コミットメントを追加しました" }); };

  const row = (c) => {
    const isOpen = open === c.id; const Chev = isOpen ? L.ChevronUp : L.ChevronDown;
    const value = c.type === "毎日" ? c.value + (c.doneToday ? 1 : 0) : c.value;
    return (
      <div key={c.id} style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "32px minmax(0, 1fr) 240px auto 32px", gap: 12, alignItems: "center", minHeight: 48 }}>
          <IconButton icon={isOpen ? "ChevronUp" : "ChevronDown"} label={isOpen ? "閉じる" : "詳細を開く"} active={isOpen} onClick={() => setOpen(isOpen ? null : c.id)} />
          <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, fontSize: 14, lineHeight: "20px" }}>
            <Badge value="neutral" label={c.type} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{c.title}</span>
            {c.late ? <Badge value="late" label="遅れ" /> : null}{c.missStreak ? <Badge value="late" label={`連続未達 ${c.missStreak} 日`} /> : null}
          </span>
          <Progress value={value} max={c.max} overdue={c.late} />
          {c.type === "毎日" ? (
            <IconButton icon="Check" label={c.doneToday ? "今日の達成を取り消す" : "今日達成"} tone={c.doneToday ? "positive" : undefined} onClick={() => { upd(c.id, { doneToday: !c.doneToday }); toast({ kind: "success", message: c.doneToday ? "取り消しました" : "今日の達成を記録しました" }); }} />
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <IconButton icon="Minus" label="1 減らす" disabled={c.value <= 0} onClick={() => upd(c.id, { value: Math.max(0, c.value - 1) })} />
              <span style={{ minWidth: 20, textAlign: "center", fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{c.value}</span>
              <IconButton icon="Plus" label="1 増やす" onClick={() => { upd(c.id, { value: c.value + 1, late: c.value + 1 >= c.max ? false : c.late }); if (c.value + 1 >= c.max) toast({ kind: "success", message: "達成しました" }); }} />
            </span>
          )}
          <IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm({ title: "コミットメントを削除しますか？", description: `「${c.title}」と記録が削除されます。この操作は取り消せません。`, onConfirm: () => { setItems((xs) => xs.filter((x) => x.id !== c.id)); setConfirm(null); toast({ kind: "success", message: "削除しました" }); } })} />
        </div>
        {isOpen ? (
          <div style={{ padding: "4px 0 16px 44px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}><span style={{ color: "var(--muted-foreground)" }}>今週の結果</span><SegmentedControl aria-label="結果" options={[{ value: "ok", label: "達成", icon: "Circle" }, { value: "ng", label: "未達", icon: "X" }]} value={result[c.id] || (c.late ? "ng" : "ok")} onChange={(v) => setResult((r) => ({ ...r, [c.id]: v }))} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 8, alignItems: "end" }}>
              <Field label="未達理由" htmlFor={`r-${c.id}`}><Textarea id={`r-${c.id}`} rows={2} defaultValue={c.reason} placeholder="何が起きて、どこで詰まったか" /></Field>
              <Button variant="secondary" icon="Save" onClick={() => toast({ kind: "success", message: "未達理由を保存しました" })}>保存</Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 8, alignItems: "end" }}>
              <Field label="振り返り" htmlFor={`f-${c.id}`}><Textarea id={`f-${c.id}`} rows={2} defaultValue={c.reflection} placeholder="次はどう変えるか" /></Field>
              <Button variant="secondary" icon="Save" onClick={() => toast({ kind: "success", message: "振り返りを保存しました" })}>保存</Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const person = (p) => (
    <article key={p.name} style={{ ...card, gap: 8, padding: 12, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><Badge kind="assignee" value={p.name} /><span style={{ marginLeft: "auto", display: "inline-flex", gap: 6 }}>{p.value >= p.max ? <Badge value="done" label="達成" /> : null}{p.late ? <Badge value="late" label="遅れ" /> : null}{p.missStreak ? <Badge value="late" label={`連続未達 ${p.missStreak} 日`} /> : null}</span></div>
      <div style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500, minHeight: 40 }}>{p.title}</div>
      <Progress value={p.value} max={p.max} overdue={p.late} />
    </article>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ① h1（右側なし） */}
      <PageHeader icon="Target" title="コミットメント" description="月ごとの約束と達成の記録。チームの状況も同じ画面で見る" />
      {/* ② 月選択カード: 位置は同じ、amber 帯を外し中央に ◀ 2026年9月 ▶（WeekSelector の月表示） */}
      <section style={{ ...card, alignItems: "center", padding: 12 }}>
        <WeekSelector compact unit="month" weeks={COMMIT_MONTHS} index={month} onChange={(i) => setMonth(i)} aria-label="対象月" />
      </section>
      {error ? <ErrorBand message="コミットメントを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}

      {/* ③ 自分のコミットメント（帯 → SectionHeading、右にバッジ 3 つ） */}
      <section style={card}>
        <SectionHeading icon="User" title="自分のコミットメント" description={COMMIT_MONTHS[month].label}>
          {!loading && items.length ? <>
            <Badge value={achieved === items.length ? "done" : "neutral"} label={`${achieved}/${items.length} 達成`} />
            {late ? <Badge value="late" label={`${late} 件遅れ`} /> : null}
            {missStreak ? <Badge value="late" label={`連続未達 ${missStreak} 日`} /> : null}
          </> : null}
        </SectionHeading>
        {/* 本文最上部: 追加（破線・全幅）→ 展開フォーム、下部 キャンセル/追加（半々） */}
        {adding ? (
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "var(--muted)" }}>
            <Field label="コミットメント" htmlFor="cm-title" required><Input id="cm-title" value={draft.title} placeholder="例: 毎日 18:00 までに日報を送信する" onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 12 }}>
              <Field label="種類" htmlFor="cm-type"><Select id="cm-type" value={draft.type} options={TYPES} onChange={(e) => setDraft({ ...draft, type: e.target.value })} style={{ width: "100%" }} /></Field>
              <Field label="目標回数" htmlFor="cm-max" help={draft.type === "毎日" ? "毎日は 7 回/週 で固定" : "期間内の回数"}><Input id="cm-max" numeric value={draft.type === "毎日" ? "7" : draft.max} disabled={draft.type === "毎日"} placeholder="例: 2" onChange={(e) => setDraft({ ...draft, max: e.target.value })} /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Button variant="secondary" block onClick={() => { setAdding(false); setDraft({ title: "", type: "毎日", max: "" }); }}>キャンセル</Button>
              <Button variant="primary" block icon="Plus" disabled={!draft.title.trim()} onClick={add}>追加</Button>
            </div>
          </div>
        ) : (
          <button type="button" disabled={loading || error} onClick={() => setAdding(true)} style={{ height: 44, width: "100%", border: "1px dashed var(--border)", borderRadius: "var(--radius)", background: "transparent", color: loading || error ? "var(--disabled-foreground)" : "var(--primary)", fontSize: 14, fontWeight: 500, cursor: loading || error ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}><L.Plus size={16} aria-hidden />コミットメントを追加</button>
        )}
        {loading ? <div style={{ display: "grid", gap: 14, paddingTop: 8 }}>{[0, 1, 2].map((i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 240px", gap: 12, alignItems: "center" }}><Skeleton height={14} width={`${70 - i * 12}%`} /><Skeleton height={8} /></div>)}</div>
          : error ? null
          : items.length === 0 ? <EmptyState icon="Target" title="コミットメントがまだありません" description="今月やり切る約束を 1 つ決めて追加しましょう。毎日・週次・月次から選べます。" />
          : <div style={{ display: "flex", flexDirection: "column" }}>{items.map(row)}</div>}
      </section>

      {/* ④ チームのコミットメント（slate 帯 → SectionHeading、事業部ごと折りたたみ、3 列 minmax(0,1fr) で 1280 でも崩れない） */}
      <section style={card}>
        <SectionHeading icon="Users" title="チームのコミットメント" count={Object.values(TEAM_COMMITMENTS).flat().length} />
        {loading ? <Skeleton height={96} /> : error ? <div style={{ fontSize: 13, color: "var(--muted-foreground)", padding: "8px 0" }}>チームの状況は再試行後に表示されます。</div> : Object.entries(TEAM_COMMITMENTS).map(([div, ps]) => {
          const o = !!divOpen[div]; const Chev = o ? L.ChevronDown : L.ChevronRight;
          return (
            <div key={div} style={{ borderTop: "1px solid var(--border)" }}>
              <button type="button" aria-expanded={o} onClick={() => setDivOpen((d) => ({ ...d, [div]: !o }))} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", height: 44, padding: 0, border: 0, background: "transparent", cursor: "pointer", textAlign: "left", color: "var(--foreground)" }}>
                <Chev size={16} color="var(--muted-foreground)" aria-hidden /><h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{div}</h3>
                <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{ps.length} 名 · 遅れ {ps.filter((p) => p.late).length}</span>
              </button>
              {o ? <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, paddingBottom: 12 }}>{ps.map(person)}</div> : null}
            </div>
          );
        })}
      </section>
      {confirm ? <ConfirmDialog title={confirm.title} description={confirm.description} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { CommitScreenV2 });
