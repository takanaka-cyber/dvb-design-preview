import React, { useState, useMemo } from "react";
import { GG_MEMBERS, WEEKS, ADMIN_PROJECTS, SYS_CHATWORK, META_FETCH_JOBS, WEEKLY_ADMIN_KPI, WEEKLY_ADMIN_MEMBERS, SHARED_CPN, ACCESS_DAU, ACCESS_USERS, ACCESS_PAGES } from "./data.js";

/* バッチ 4: 管理画面。h1 左・右側は基本空・帯色なし・Card 縦積み、幅 max-w-4xl（E3）。
   このファイル: 共通シェル + 型 A〜D の見本（案件マスタ / チャットワーク連携 / 追加取得 Meta / 週次まとめ管理）+ 利用状況。
   ユーザー管理・アセクリ・目標設定・システム設定・研修管理は AdminScreens2.jsx */
export const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
export const muted = { fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" };
export const mono = { fontFamily: "var(--font-mono)", fontSize: 13, fontVariantNumeric: "tabular-nums" };
/** 管理画面の本文幅（E3: max-w-4xl = 896 に統一） */
export function AdminPage({ width = 896, children }) { return <div style={{ maxWidth: width, display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>; }

/* ================= 型 A: インライン CRUD リスト ================= */
/**
 * PageHeader → Card「新規◯◯登録」（Input + 右端「登録」primary）→ Card「登録済み◯◯（N 件）」（DataTable、行右端 ✏️🗑 → 編集中は ✓ ×、🗑 は ConfirmDialog）。
 * fields: [{ key, label, width, type: "text" | "select", options, placeholder, mono }]。embedded = 他画面の Card として使う（PageHeader なし）。
 */
export function CrudList({ noun, icon = "Database", fields, rows: initRows, state = "normal", toast, embedded, density = "standard", registerLabel = "登録", extraColumns = [], emptyTitle, emptyDescription, minWidth }) {
  const { SectionHeading, Button, DataTable, Input, Select, ConfirmDialog, EmptyState } = window.DVB;
  const { IconButton } = window.DVBKit;
  const [rows, setRows] = useState(state === "empty" ? [] : initRows);
  const [editing, setEditing] = useState(state === "editing" && initRows[0] ? initRows[0].id : null);
  const [draft, setDraft] = useState(state === "editing" && initRows[0] ? { ...initRows[0] } : {});
  const [confirm, setConfirm] = useState(state === "confirm" && initRows[1] ? initRows[1] : null);
  const [fresh, setFresh] = useState(Object.fromEntries(fields.map((f) => [f.key, f.type === "select" ? (f.options[0] || "") : ""])));
  const primary = fields[0];
  const firstId = `new-${noun}-${primary.key}`;
  const focusFirst = () => { const el = document.getElementById(firstId); el && el.focus(); };
  const canAdd = String(fresh[primary.key] || "").trim().length > 0;
  const add = () => { if (!canAdd) return; const r = { id: noun + Date.now(), ...fresh, createdAt: "2026-09-09", active: true }; setRows([r, ...rows]); setFresh(Object.fromEntries(fields.map((f) => [f.key, f.type === "select" ? (f.options[0] || "") : ""]))); toast({ kind: "success", message: `${noun}「${r[primary.key]}」を登録しました` }); };
  const startEdit = (r) => { setEditing(r.id); setDraft({ ...r }); };
  const commit = () => { setRows(rows.map((r) => (r.id === editing ? { ...r, ...draft } : r))); setEditing(null); toast({ kind: "success", message: `${noun}を更新しました` }); };
  const cancel = () => setEditing(null);
  const remove = () => { const r = confirm; setRows(rows.filter((x) => x.id !== r.id)); setConfirm(null); toast({ kind: "undo", message: `${noun}「${r[primary.key]}」を削除しました`, actionLabel: "元に戻す", onAction: () => setRows((rs) => [r, ...rs]) }); };
  const onKey = (e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); };
  const editor = (f) => (r) => f.type === "select"
    ? <Select size="sm" aria-label={f.label} value={draft[f.key] ?? ""} options={f.options} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} width="100%" />
    : <Input size="sm" aria-label={f.label} value={draft[f.key] ?? ""} autoFocus={f === primary} onKeyDown={onKey} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} style={f.mono ? mono : undefined} />;
  const columns = [
    ...fields.map((f) => ({ key: f.key, label: f.label, width: f.width, render: (r) => <span style={f.mono ? mono : f === primary ? { fontWeight: 500 } : undefined}>{r[f.key] || <span style={{ color: "var(--muted-foreground)" }}>—</span>}</span>, edit: editor(f) })),
    ...extraColumns,
    { key: "ops", label: "", width: 84, align: "right",
      render: (r) => <span style={{ display: "inline-flex", gap: 2 }}><IconButton icon="Pencil" label="編集" onClick={() => startEdit(r)} /><IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm(r)} /></span>,
      edit: () => <span style={{ display: "inline-flex", gap: 4 }}><Button size="sm" variant="primary" icon="Check" aria-label="確定" onClick={commit} style={{ width: 32, minWidth: 32, padding: 0 }} /><IconButton icon="X" label="キャンセル" onClick={cancel} /></span> },
  ];
  const addRow = (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
          {fields.map((f, i) => (
            <label key={f.key} style={{ display: "flex", flexDirection: "column", gap: 4, flex: i === 0 ? "1 1 200px" : `0 1 ${f.width || 160}px`, minWidth: 120 }}>
              <span style={{ fontSize: 13, lineHeight: "18px", fontWeight: 500 }}>{f.label}</span>
              {f.type === "select" ? <Select value={fresh[f.key]} options={f.options} onChange={(e) => setFresh({ ...fresh, [f.key]: e.target.value })} width="100%" />
                : <Input id={i === 0 ? firstId : undefined} value={fresh[f.key]} placeholder={f.placeholder} onKeyDown={(e) => e.key === "Enter" && add()} onChange={(e) => setFresh({ ...fresh, [f.key]: e.target.value })} style={f.mono ? mono : undefined} />}
            </label>
          ))}
          <Button variant="primary" icon="Plus" disabled={!canAdd} onClick={add}>{registerLabel}</Button>
        </div>
  );
  const table = (
        <DataTable columns={columns} rows={rows} editingKey={editing} density={density} minWidth={minWidth} style={{ border: 0, borderRadius: 0, boxShadow: "none", borderTop: "1px solid var(--border)" }}
          emptyNode={<EmptyState compact icon={icon} title={emptyTitle || `まだ${noun}が登録されていません`} description={emptyDescription || `上の「新規${noun}登録」から 1 件ずつ追加できます。`} action={<Button size="sm" variant="primary" icon="Plus" onClick={focusFirst}>{noun}を登録</Button>} />} />
  );
  const confirmDlg = <ConfirmDialog open={!!confirm} destructive title={`${noun}を削除しますか？`} description={confirm ? `「${confirm[primary.key]}」を削除します。この操作は取り消せません。` : ""} confirmLabel="削除" onConfirm={remove} onCancel={() => setConfirm(null)} />;
  if (embedded) {
    /* 他画面の 1 Card として: 見出し（件数）→ 登録行（右端「登録」primary）→ 表 */
    return (
      <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
        <SectionHeading icon={icon} title={noun} count={rows.length} style={{ padding: "12px 16px" }} />
        <div style={{ padding: "0 16px 12px" }}>{addRow}</div>
        {table}
        {confirmDlg}
      </section>
    );
  }
  return (
    <>
      <section style={card}>
        <SectionHeading icon="Plus" title={`新規${noun}登録`} />
        {addRow}
      </section>
      <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
        <SectionHeading icon={icon} title={`登録済み${noun}`} count={rows.length} style={{ padding: "12px 16px" }} />
        {table}
      </section>
      {confirmDlg}
    </>
  );
}

/* 案件マスタ /admin/projects（型 A の見本。通常・空・編集中・削除確認） */
export function AdminProjectsScreen({ state = "normal", toast }) {
  const { PageHeader } = window.DVB;
  const fields = [{ key: "name", label: "案件名", placeholder: "例: G社 家電 EC" }, { key: "owner", label: "担当", type: "select", options: GG_MEMBERS, width: 140 }];
  const extra = [{ key: "createdAt", label: "登録日", width: 120, render: (r) => <span style={{ ...mono, color: "var(--muted-foreground)" }}>{r.createdAt}</span> }];
  return (
    <AdminPage>
      <PageHeader icon="Database" title="案件マスタ" description="タスク管理・週次レポートで選べる案件の一覧" />
      <CrudList noun="案件" icon="Database" fields={fields} rows={ADMIN_PROJECTS} extraColumns={extra} state={state} toast={toast} />
    </AdminPage>
  );
}

/* ================= 型 B: 設定フォーム ================= */
/** Card × N（SectionHeading = 設定グループ、Field 縦積み、行追加は Label 右の secondary、行削除は行内右の ghost destructive）→ 最下部「保存」primary 1 個（左寄せ） */
export function ChatworkSettingsForm({ state = "normal", toast, embedded }) {
  const { SectionHeading, Button, Input, Field, Switch, Select } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const error = state === "error";
  const [v, setV] = useState(SYS_CHATWORK);
  const [targets, setTargets] = useState([{ id: "n1", label: "日報 未送信リマインド", roomId: "301122334" }, { id: "n2", label: "週次まとめ 未記入リマインド", roomId: "312345678" }]);
  const [saving, setSaving] = useState(state === "saving");
  const save = () => { setSaving(true); setTimeout(() => { setSaving(false); toast({ kind: "success", message: "チャットワーク連携を保存しました" }); }, 900); };
  const upd = (id, k, val) => setTargets(targets.map((t) => (t.id === id ? { ...t, [k]: val } : t)));
  const tokenGroup = (<>
        <Field label="API トークン" htmlFor="cw-token" required error={error ? "このトークンでは認証できません（401）" : undefined}><Input id="cw-token" value={v.token} invalid={error} style={mono} onChange={(e) => setV({ ...v, token: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="管理者通知ルーム ID" htmlFor="cw-room" help="エラー・追加依頼の通知先"><Input id="cw-room" numeric value={v.notifyRoom} style={mono} onChange={(e) => setV({ ...v, notifyRoom: e.target.value })} /></Field>
          <Field label="日報リマインド時刻" htmlFor="cw-time"><Select id="cw-time" value={v.dailyReminder} options={["17:00", "17:30", "18:00"]} onChange={(e) => setV({ ...v, dailyReminder: e.target.value })} width="100%" /></Field>
        </div>
        <Switch checked={v.mentionAdmin} onChange={(c) => setV({ ...v, mentionAdmin: c })} label="エラー時に管理者へ TO を付ける" />
  </>);
  const targetGroup = (<>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionHeading level={embedded ? 3 : 2} icon="Bell" title="リマインド通知先" count={targets.length} />
          <Button size="sm" variant="secondary" icon="Plus" onClick={() => setTargets([...targets, { id: "n" + Date.now(), label: "", roomId: "" }])}>追加</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 180px 32px", gap: 8, ...muted }}><span>ラベル</span><span>ルーム ID</span><span /></div>
          {targets.map((t) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 180px 32px", gap: 8, alignItems: "center" }}>
              <Input size="sm" value={t.label} placeholder="例: 日報 未送信リマインド" aria-label="ラベル" onChange={(e) => upd(t.id, "label", e.target.value)} />
              <Input size="sm" numeric value={t.roomId} placeholder="ルーム ID" aria-label="ルーム ID" style={mono} onChange={(e) => upd(t.id, "roomId", e.target.value)} />
              <IconButton icon="Trash2" label="この通知先を削除" tone="destructive" onClick={() => { setTargets(targets.filter((x) => x.id !== t.id)); toast({ kind: "undo", message: "通知先を削除しました", actionLabel: "元に戻す", onAction: () => setTargets((ts) => [...ts, t]) }); }} />
            </div>
          ))}
        </div>
  </>);
  const saveBtn = <div><Button variant="primary" icon="Save" loading={saving} onClick={save}>保存</Button></div>;
  if (embedded) {
    /* システム設定の 1 Card: 見出し → トークン → 通知先 → 下部 保存（左寄せ） */
    return (
      <section style={card}>
        <SectionHeading icon="MessageSquare" title="チャットワーク連携" description="通知の送信元とリマインド" />
        {error ? <ErrorBand message="保存できませんでした。API トークンが無効です" onRetry={save} /> : null}
        {tokenGroup}
        <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "4px 0" }} />
        {targetGroup}
        {saveBtn}
      </section>
    );
  }
  return (
    <>
      {error ? <ErrorBand message="保存できませんでした。API トークンが無効です。入力内容はブラウザに退避済みです" onRetry={save} /> : null}
      <section style={card}>
        <SectionHeading icon="KeyRound" title="API トークン" description="通知の送信に使う Chatwork API トークン" />
        {tokenGroup}
      </section>
      <section style={card}>
        {targetGroup}
      </section>
      {saveBtn}
    </>
  );
}
/* チャットワーク連携（型 B の見本。通常・保存中・エラー）— システム設定 /admin/settings の 1 Card を単独で描く */
export function AdminTypeBScreen({ state = "normal", toast }) {
  const { PageHeader } = window.DVB;
  return (
    <AdminPage>
      <PageHeader icon="MessageSquare" title="チャットワーク連携" description="型 B: 設定フォーム。Card 縦積み → 最下部に「保存」1 個（左寄せ）" />
      <ChatworkSettingsForm state={state} toast={toast} />
    </AdminPage>
  );
}

/* ================= 型 C: Dialog + 表 ================= */
const JOB_STATUS = { done: ["done", "完了"], running: ["info", "取得中"], error: ["late", "エラー"], paused: ["neutral", "停止"], queued: ["neutral", "待機"] };
/**
 * 右端「追加」primary → Dialog（キャンセル / 追加）→ 進捗パネル（Progress + 開始 / 停止 / 再試行 / リセット）→ DataTable（行末 🗑 ghost destructive）。
 * media: "Meta" | "TikTok"。embedded = 他画面の Card（SectionHeading 右に「追加」）。
 */
export function FetchJobsPanel({ media = "Meta", jobs: initJobs, accounts, state = "normal", toast, embedded, pageHeader }) {
  const { SectionHeading, Button, DataTable, Dialog, ConfirmDialog, Select, Input, Field, Progress, Badge, EmptyState } = window.DVB;
  const { IconButton } = window.DVBKit;
  const [jobs, setJobs] = useState(state === "empty" ? [] : initJobs);
  const [open, setOpen] = useState(state === "dialog");
  const [form, setForm] = useState({ account: accounts[0], from: "2026-09-01", to: "2026-09-08" });
  const [confirm, setConfirm] = useState(null);
  const running = jobs.find((j) => j.status === "running");
  const total = jobs.reduce((n, j) => n + j.progress[1], 0), done = jobs.reduce((n, j) => n + j.progress[0], 0);
  const add = () => { setJobs([{ id: "j" + Date.now(), account: form.account, range: `${form.from} 〜 ${form.to}`, status: "queued", progress: [0, 8] }, ...jobs]); setOpen(false); toast({ kind: "success", message: `${media} の追加取得を予約しました` }); };
  const setStatus = (id, s) => setJobs(jobs.map((j) => (j.id === id ? { ...j, status: s } : j)));
  const columns = [
    { key: "account", label: "アカウント", render: (r) => <span style={{ fontWeight: 500 }}>{r.account}</span> },
    { key: "range", label: "期間", width: 220, render: (r) => <span style={mono}>{r.range}</span> },
    { key: "progress", label: "進捗", width: 160, render: (r) => <Progress size="sm" value={r.progress[0]} max={r.progress[1]} overdue={r.status === "error"} label={`${r.progress[0]}/${r.progress[1]} 日`} /> },
    { key: "status", label: "状態", width: 96, render: (r) => <Badge value={JOB_STATUS[r.status][0]} label={JOB_STATUS[r.status][1]} /> },
    { key: "ops", label: "", width: 44, align: "right", render: (r) => <IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm(r)} /> },
  ];
  const addBtn = <Button variant="primary" icon="Plus" size={embedded ? "sm" : "md"} onClick={() => setOpen(true)}>追加</Button>;
  return (
    <>
      {pageHeader ? pageHeader(addBtn) : null}
      <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
        <SectionHeading icon="Download" title={`追加取得 ${media}`} count={jobs.length} description="過去期間の数値を再取得" style={{ padding: "12px 16px" }}>{embedded ? addBtn : null}</SectionHeading>
        {/* 進捗パネル */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--border)", background: "var(--muted)", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px", minWidth: 0 }}>
            <Progress value={done} max={total || 1} label={total ? `${done}/${total} 日（${Math.round(done / total * 100)}%）` : "ジョブなし"} />
          </div>
          <span style={{ ...muted, whiteSpace: "nowrap" }}>{running ? `取得中: ${running.account}` : jobs.some((j) => j.status === "error") ? "エラーのジョブがあります" : "待機中"}</span>
          <div style={{ display: "inline-flex", gap: 4 }}>
            <Button size="sm" variant="secondary" icon="Play" disabled={!!running || !jobs.some((j) => j.status === "queued" || j.status === "paused")} onClick={() => { const q = jobs.find((j) => j.status === "queued" || j.status === "paused"); if (q) { setStatus(q.id, "running"); toast({ kind: "info", message: "取得を開始しました" }); } }}>開始</Button>
            <Button size="sm" variant="secondary" icon="Pause" disabled={!running} onClick={() => { setStatus(running.id, "paused"); toast({ kind: "info", message: "取得を停止しました" }); }}>停止</Button>
            <Button size="sm" variant="secondary" icon="RotateCw" disabled={!jobs.some((j) => j.status === "error")} onClick={() => { setJobs(jobs.map((j) => (j.status === "error" ? { ...j, status: "queued" } : j))); toast({ kind: "info", message: "エラーのジョブを再試行に戻しました" }); }}>再試行</Button>
            <Button size="sm" variant="ghost" icon="Eraser" disabled={!jobs.some((j) => j.status === "done")} onClick={() => { setJobs(jobs.filter((j) => j.status !== "done")); toast({ kind: "success", message: "完了したジョブを消去しました" }); }}>リセット</Button>
          </div>
        </div>
        <DataTable columns={columns} rows={jobs} density="compact" style={{ border: 0, borderRadius: 0, boxShadow: "none", borderTop: "1px solid var(--border)" }}
          emptyNode={<EmptyState compact icon="Download" title="追加取得のジョブはありません" description="右上の［追加］でアカウントと期間を指定します。" action={<Button size="sm" variant="primary" icon="Plus" onClick={() => setOpen(true)}>追加</Button>} />} />
      </section>
      <Dialog open={open} size="sm" title={`追加取得 ${media}`} description="取得済みの期間は上書きされます" onClose={() => setOpen(false)} confirmLabel="追加" onConfirm={add} confirmDisabled={!form.account || !form.from || !form.to}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="アカウント" htmlFor="fj-acc" required><Select id="fj-acc" value={form.account} options={accounts} onChange={(e) => setForm({ ...form, account: e.target.value })} width="100%" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="開始日" htmlFor="fj-from" required><Input id="fj-from" type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></Field>
            <Field label="終了日" htmlFor="fj-to" required><Input id="fj-to" type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></Field>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog open={!!confirm} destructive title="ジョブを削除しますか？" description={confirm ? `「${confirm.account} / ${confirm.range}」を削除します。取得済みの数値は残ります。` : ""} confirmLabel="削除" onConfirm={() => { setJobs(jobs.filter((j) => j.id !== confirm.id)); setConfirm(null); toast({ kind: "success", message: "ジョブを削除しました" }); }} onCancel={() => setConfirm(null)} />
    </>
  );
}
export const META_ACCOUNTS = ["A社 記事LP（act_1234）", "C社 美容D2C（act_5678）", "E社 保険比較（act_2468）"];
export const TIKTOK_ACCOUNTS = ["C社 美容 新規（adv_9012）", "B社 通販（adv_3456）"];
/* 追加取得 Meta（型 C の見本。通常・空・Dialog 開）— システム設定 /admin/settings の 1 Card を単独で描く */
export function AdminTypeCScreen({ state = "normal", toast }) {
  const { PageHeader } = window.DVB;
  return (
    <AdminPage>
      <FetchJobsPanel media="Meta" jobs={META_FETCH_JOBS} accounts={META_ACCOUNTS} state={state} toast={toast}
        pageHeader={(addBtn) => <PageHeader icon="Download" title="追加取得 Meta" description="型 C: Dialog + 表。右端「追加」→ Dialog（キャンセル / 追加）→ 進捗パネル → 表（行末 🗑）">{addBtn}</PageHeader>} />
    </AdminPage>
  );
}

/* ================= 型 D: 読み取り専用ダッシュボード ================= */
const yen = (n) => (n == null ? "—" : `${n < 0 ? "−" : ""}¥${Math.abs(n).toLocaleString("ja-JP")}`);
/** 共有CP管理（型 C）: 週次まとめ管理に埋め込み。単独ルート /admin/shared-cpns は描かない */
function SharedCpnSection({ state, toast }) {
  const { SectionHeading, Button, DataTable, Dialog, ConfirmDialog, Input, Field, Select, EmptyState } = window.DVB;
  const { IconButton } = window.DVBKit;
  const [rows, setRows] = useState(state === "empty" ? [] : SHARED_CPN);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", media: "Google" });
  const [confirm, setConfirm] = useState(null);
  const cols = [
    { key: "name", label: "CPN 名", render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: "spend", label: "消化", align: "right", width: 120, render: (r) => <span style={mono}>{yen(r.spend)}</span> },
    { key: "profit", label: "粗利", align: "right", width: 120, render: (r) => <span style={mono}>{yen(r.profit)}</span> },
    { key: "roas", label: "ROAS", align: "right", width: 96, render: (r) => <span style={mono}>{r.roas.toFixed(1)}%</span> },
    { key: "ops", label: "", width: 44, align: "right", render: (r) => <IconButton icon="Trash2" label="共有CP から外す" tone="destructive" onClick={() => setConfirm(r)} /> },
  ];
  return (
    <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
      <SectionHeading icon="Handshake" title="共有CP管理" count={rows.length} description="担当者をまたぐキャンペーン。週次レポートでは既定で閉" style={{ padding: "12px 16px" }}>
        <Button size="sm" variant="primary" icon="Plus" onClick={() => setOpen(true)}>追加</Button>
      </SectionHeading>
      <DataTable columns={cols} rows={rows} density="compact" style={{ border: 0, borderRadius: 0, boxShadow: "none", borderTop: "1px solid var(--border)" }}
        emptyNode={<EmptyState compact icon="Handshake" title="共有CP はありません" description="ブランド KW やリマケなど、担当者をまたぐ CPN を登録します。" action={<Button size="sm" variant="primary" icon="Plus" onClick={() => setOpen(true)}>追加</Button>} />} />
      <Dialog open={open} size="sm" title="共有CP を追加" onClose={() => setOpen(false)} confirmLabel="追加" confirmDisabled={!form.name.trim()} onConfirm={() => { setRows([{ id: "s" + Date.now(), name: form.name, owner: "共有", spend: 0, profit: 0, roas: 0 }, ...rows]); setOpen(false); setForm({ name: "", media: "Google" }); toast({ kind: "success", message: "共有CP を追加しました" }); }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="CPN 名" htmlFor="sc-name" required help="AXAD 上の名前と完全一致"><Input id="sc-name" value={form.name} placeholder="例: TM2-共有_ブランドKW_Google" onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="媒体" htmlFor="sc-media"><Select id="sc-media" value={form.media} options={["FB", "TikTok", "Google", "その他"]} onChange={(e) => setForm({ ...form, media: e.target.value })} width="100%" /></Field>
        </div>
      </Dialog>
      <ConfirmDialog open={!!confirm} destructive title="共有CP から外しますか？" description={confirm ? `「${confirm.name}」は次週から各担当者の集計に戻ります。` : ""} confirmLabel="外す" onConfirm={() => { setRows(rows.filter((r) => r.id !== confirm.id)); setConfirm(null); toast({ kind: "success", message: "共有CP から外しました" }); }} onCancel={() => setConfirm(null)} />
    </section>
  );
}
/* 週次まとめ管理 /admin/weekly-reports（型 D の見本。通常・空・読み込み・エラー） */
export function AdminWeeklyScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, SectionHeading, Button, KpiCard, Badge, Select, Skeleton, EmptyState } = window.DVB;
  const { IconButton, ErrorBand, Ic } = window.DVBKit;
  const loading = state === "loading", error = state === "error", empty = state === "empty";
  const [week, setWeek] = useState(WEEKS[empty ? 3 : 1].key);
  const [open, setOpen] = useState(() => new Set(["wm1"]));
  const [refreshing, setRefreshing] = useState(false);
  const allOpen = open.size === WEEKLY_ADMIN_MEMBERS.length;
  const toggle = (id) => setOpen((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const refresh = () => { setRefreshing(true); setTimeout(() => { setRefreshing(false); toast({ kind: "success", message: "週次まとめを更新しました" }); }, 900); };
  const k = WEEKLY_ADMIN_KPI;
  const kpi = (props) => <KpiCard {...props} loading={loading} error={error} />;
  return (
    <AdminPage>
      <PageHeader icon="CalendarCog" title="週次まとめ管理" description="メンバーの週次レポート記入状況と共有CP">
        <Select aria-label="週" value={week} options={WEEKS.map((w) => ({ value: w.key, label: w.label }))} onChange={(e) => setWeek(e.target.value)} width={240} />
        <Button variant="secondary" icon="RotateCw" loading={refreshing} onClick={refresh}>更新</Button>
      </PageHeader>
      {error ? <ErrorBand message="週次まとめを取得できませんでした" onRetry={refresh} /> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        {kpi({ label: "記入済み", value: empty ? 0 : k.written, unit: `/ ${k.members} 名`, note: empty ? "未記入 5 名" : `未記入 ${k.members - k.written} 名` })}
        {kpi({ label: "施策コメント", value: empty ? 0 : k.comments, unit: "件", note: "全案件分" })}
        {kpi({ label: "AI 分析 実行", value: empty ? 0 : k.aiDone, unit: `/ ${k.members} 名`, note: "今週" })}
        {kpi({ label: "共有CP", value: k.sharedCpn, unit: "件", note: "下の一覧で管理" })}
      </div>
      <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
        <SectionHeading icon="Users" title="メンバー一覧" count={loading ? undefined : WEEKLY_ADMIN_MEMBERS.length} style={{ padding: "12px 16px" }}>
          <Button size="sm" variant="ghost" icon={allOpen ? "ChevronsDownUp" : "ChevronsUpDown"} onClick={() => setOpen(allOpen ? new Set() : new Set(WEEKLY_ADMIN_MEMBERS.map((m) => m.id)))}>{allOpen ? "折りたたむ" : "全て展開"}</Button>
        </SectionHeading>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, height: 52, padding: "0 16px", borderBottom: "1px solid var(--border)" }}><Skeleton width={16} height={16} /><Skeleton width={72} height={14} /><Skeleton width={56} height={14} /><Skeleton width={64} height={20} radius={10} /><span style={{ flex: 1 }} /><Skeleton width={96} height={14} /></div>)
          : error ? <div style={{ padding: 32, textAlign: "center", ...muted }}>取得できませんでした</div>
          : empty ? <EmptyState compact icon="CalendarCog" title="この週の週次まとめはまだありません" description="月曜に先週分が生成されます。別の週を選ぶか、［更新］してください。" action={<Button size="sm" variant="secondary" icon="RotateCw" onClick={refresh}>更新</Button>} />
          : WEEKLY_ADMIN_MEMBERS.map((m) => {
            const on = open.has(m.id);
            return (
              <div key={m.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, padding: "0 8px 0 16px" }}>
                  <button type="button" aria-expanded={on} onClick={() => toggle(m.id)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0, height: 52, border: 0, background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit", padding: 0 }}>
                    <Ic name={on ? "ChevronDown" : "ChevronRight"} color="var(--muted-foreground)" />
                    <Badge kind="assignee" value={m.name} />
                    <span style={muted}>{m.dept}</span>
                    <Badge kind="status" value={m.status} />
                    <span style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>{m.updatedAt ? `更新 ${m.updatedAt}` : "未記入"}</span>
                    <span style={{ marginLeft: "auto", ...mono, fontSize: 14, fontWeight: 500 }}>{m.status === "sent" ? yen(m.profit) : "—"}</span>
                    {m.status === "sent" ? <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: m.dp >= 0 ? "var(--positive)" : "var(--negative)", minWidth: 88, textAlign: "right" }}>{m.dp >= 0 ? "▲ +" : "▼ −"}{yen(Math.abs(m.dp)).slice(1)}</span> : <span style={{ minWidth: 88 }} />}
                  </button>
                  <IconButton icon="ExternalLink" label={`${m.name}の週次レポートを開く`} onClick={() => onNavigate && onNavigate("weekly")} />
                </div>
                {on ? (
                  <div style={{ padding: "0 16px 14px 44px" }}>
                    {m.factors.length === 0 ? <div style={{ ...muted, padding: "8px 0" }}>週次レポートが未記入です。リマインドは日報通知ルームに 17:30 に送られます。</div> : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {m.factors.map((f, i) => (
                          <div key={i} style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: f.tone === "positive" ? "var(--positive-subtle)" : "var(--negative-subtle)", color: f.tone === "positive" ? "var(--positive-subtle-foreground)" : "var(--negative-subtle-foreground)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <Ic name={f.tone === "positive" ? "TrendingUp" : "TrendingDown"} size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{f.tone === "positive" ? "増加要因" : "減少要因"}</span><span style={{ fontSize: 14, lineHeight: "20px" }}>{f.text}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
      {loading || error ? null : <SharedCpnSection state={state} toast={toast} />}
    </AdminPage>
  );
}

/* ================= 利用状況 /admin/access-logs（型 D。ナビには載せない） ================= */
export function AccessLogsScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, KpiCard, Badge, DataTable, Skeleton, EmptyState, Button } = window.DVB;
  const { ErrorBand } = window.DVBKit;
  const loading = state === "loading", error = state === "error", empty = state === "empty";
  const [hover, setHover] = useState(null);
  const dau = empty ? ACCESS_DAU.map((d) => ({ ...d, value: 0 })) : ACCESS_DAU;
  const max = Math.max(1, ...dau.map((d) => d.value));
  const today = dau[dau.length - 1].value, avg7 = Math.round(dau.slice(-7).reduce((n, d) => n + d.value, 0) / 7 * 10) / 10;
  const pv = empty ? 0 : ACCESS_PAGES.reduce((n, p) => n + p.count, 0);
  const kpi = (props) => <KpiCard {...props} loading={loading} error={error} />;
  const userCols = [
    { key: "name", label: "名前", render: (r) => <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 500 }}>{r.name}</span><Badge kind="role" value={r.role} size="sm" /></span> },
    { key: "lastAccess", label: "最終アクセス", width: 140, render: (r) => <span style={mono}>{r.lastAccess}</span> },
    { key: "d7", label: "7日", align: "right", width: 72, sortable: true, render: (r) => <span style={mono}>{r.d7} 日</span> },
    { key: "d30", label: "30日", align: "right", width: 80, sortable: true, render: (r) => <span style={mono}>{r.d30} 日</span> },
  ];
  const pageCols = [
    { key: "rank", label: "#", width: 48, align: "right", render: (r) => <span style={{ ...mono, color: "var(--muted-foreground)" }}>{r.rank}</span> },
    { key: "path", label: "ページ", render: (r) => <span style={mono}>{r.path}</span> },
    { key: "count", label: "アクセス数", align: "right", width: 120, sortable: true, render: (r) => <span style={mono}>{r.count.toLocaleString("ja-JP")}</span> },
  ];
  const [sort, setSort] = useState({ k: "d30", d: "desc" });
  const users = useMemo(() => [...ACCESS_USERS].sort((a, b) => (sort.d === "desc" ? b[sort.k] - a[sort.k] : a[sort.k] - b[sort.k])), [sort]);
  const tableProps = { loading, error: error ? "アクセスログに接続できません" : undefined, onRetry: () => toast({ kind: "info", message: "再読み込み" }), density: "compact", style: { border: 0, borderRadius: 0, boxShadow: "none", borderTop: "1px solid var(--border)" } };
  return (
    <AdminPage>
      <PageHeader icon="Activity" title="利用状況" description="直近 14 日のアクセス。ナビには載せない（導線は別途）" />
      {error ? <ErrorBand message="アクセスログを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行" })} /> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        {kpi({ label: "今日の DAU", value: today, unit: "名", note: `${ACCESS_DAU[13].label}（${ACCESS_DAU[13].dow}）` })}
        {kpi({ label: "7 日平均 DAU", value: avg7, unit: "名", delta: empty ? undefined : { value: 0.6, digits: 1 }, note: "前週比" })}
        {kpi({ label: "30 日ユニーク", value: empty ? 0 : ACCESS_USERS.length, unit: "名", note: `登録 ${ACCESS_USERS.length} 名` })}
        {kpi({ label: "ページビュー（30 日）", value: pv.toLocaleString("ja-JP"), note: "上位 10 ページ" })}
      </div>
      <section style={card}>
        <SectionHeading icon="BarChart3" title="DAU" description="日別のログインユーザー数。土日は薄く" />
        {loading ? <Skeleton width="100%" height={160} /> : error ? <div style={{ height: 160, display: "grid", placeItems: "center", ...muted }}>取得できませんでした</div> : (
          <div role="img" aria-label="日別 DAU 棒グラフ" style={{ display: "grid", gridTemplateColumns: `repeat(${dau.length}, minmax(0,1fr))`, gap: 6, alignItems: "end", height: 180, paddingTop: 8 }}>
            {dau.map((d, i) => (
              <div key={d.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 4 }}>
                <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: hover === i ? "var(--foreground)" : "var(--muted-foreground)", minHeight: 16 }}>{d.value}</span>
                <div style={{ width: "100%", maxWidth: 40, height: `${Math.max(2, d.value / max * 120)}px`, borderRadius: 4, background: d.weekend ? "var(--muted)" : hover === i ? "var(--primary-hover)" : "var(--primary)", border: d.weekend ? "1px solid var(--border)" : 0, transition: "background var(--duration) var(--ease)" }} title={`${d.label}（${d.dow}）${d.value} 名`} />
                <span style={{ fontSize: 12, lineHeight: "16px", fontVariantNumeric: "tabular-nums", color: d.weekend ? "var(--muted-foreground)" : "var(--foreground)", whiteSpace: "nowrap" }}>{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, alignItems: "start" }}>
        <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
          <SectionHeading icon="Users" title="ユーザー別" count={loading ? undefined : users.length} style={{ padding: "12px 16px" }} />
          <DataTable {...tableProps} columns={userCols} rows={empty ? [] : users} sortKey={sort.k} sortDir={sort.d} onSort={(k, d) => setSort({ k, d })} emptyNode={<EmptyState compact icon="Users" title="この期間のアクセスはありません" />} />
        </section>
        <section style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
          <SectionHeading icon="FileText" title="ページ別" description="30 日" style={{ padding: "12px 16px" }} />
          <DataTable {...tableProps} columns={pageCols} rows={empty ? [] : ACCESS_PAGES} sortKey="count" sortDir="desc" onSort={() => {}} emptyNode={<EmptyState compact icon="FileText" title="アクセスはありません" />} />
        </section>
      </div>
    </AdminPage>
  );
}

window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { AdminPage, CrudList, ChatworkSettingsForm, FetchJobsPanel, META_ACCOUNTS, TIKTOK_ACCOUNTS, AdminProjectsScreen, AdminTypeBScreen, AdminTypeCScreen, AdminWeeklyScreen, AccessLogsScreen, adminCard: card });
