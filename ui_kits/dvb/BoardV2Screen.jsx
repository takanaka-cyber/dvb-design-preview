import React, { useState, useMemo } from "react";
import { PROJECTS, GG_MEMBERS, PROJECT_TASKS } from "./data.js";

/* バッチ 2: 案件別まとめ 先週比較 /reports/projects/comparison（board-v2）。既存 BoardScreen はそのまま、下部に「タスクの追加・完了管理」を追加。BoardScreen.jsx は上書きしない。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const fmt = (iso) => iso;

export function BoardV2Screen(props) {
  const { BoardScreen } = window.DVBKit;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <BoardScreen {...props} />
      <ProjectTaskSection {...props} />
    </div>
  );
}

/** 下部セクション: 追加フォーム行（右端「追加」）→ フィルタ Select 3 → タスク表（第 1 列 完了トグル・最終列 🗑）。thead bg-blue-900 廃止 → DataTable。confirm → ConfirmDialog。 */
export function ProjectTaskSection({ state = "normal", toast, onNavigate }) {
  const { SectionHeading, Button, DataTable, Badge, Select, Input, Checkbox, ConfirmDialog, EmptyState } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [tasks, setTasks] = useState(loading || empty || error ? [] : PROJECT_TASKS);
  const [form, setForm] = useState({ project: "", text: "", assignee: "", due: "2026-09-12" });
  const [fp, setFp] = useState("全案件"); const [fa, setFa] = useState("全担当"); const [fs, setFs] = useState("全状態");
  const [confirm, setConfirm] = useState(null);
  const rows = useMemo(() => tasks.filter((t) => (fp === "全案件" || t.project === fp) && (fa === "全担当" || t.assignee === fa) && (fs === "全状態" || (fs === "完了" ? t.done : !t.done))), [tasks, fp, fa, fs]);
  const toggle = (t) => { setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))); toast({ kind: "undo", message: t.done ? "未完了に戻しました" : "タスクを完了にしました", actionLabel: "元に戻す", onAction: () => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: t.done } : x))) }); };
  const add = () => { if (!form.project || !form.text.trim()) return; const d = form.due ? `${Number(form.due.slice(5, 7))}/${Number(form.due.slice(8, 10))}` : ""; setTasks((ts) => [...ts, { id: "p" + Date.now(), project: form.project, text: form.text.trim(), assignee: form.assignee || "白井", due: d, done: false }]); setForm({ ...form, text: "" }); toast({ kind: "success", message: "タスクを追加しました" }); };
  const cols = [
    { key: "done", label: "", width: 44, render: (t) => <Checkbox checked={t.done} onChange={() => toggle(t)} aria-label={t.done ? "未完了に戻す" : "完了にする"} /> },
    { key: "project", label: "案件", width: 160, render: (t) => <span style={{ fontWeight: 500 }}>{t.project}</span> },
    { key: "text", label: "タスク", render: (t) => <span style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--muted-foreground)" : "var(--foreground)" }}>{t.text}</span> },
    { key: "assignee", label: "担当", width: 110, render: (t) => <Badge kind="assignee" value={t.assignee} /> },
    { key: "due", label: "期限", width: 96, align: "right", render: (t) => <span style={{ color: t.overdue && !t.done ? "var(--negative)" : "inherit", fontWeight: t.overdue && !t.done ? 600 : 400 }}>{fmt(t.due)}{t.overdue && !t.done ? " 超過" : ""}</span> },
    { key: "status", label: "状態", width: 84, render: (t) => <Badge value={t.done ? "done" : t.overdue ? "late" : "todo"} /> },
    { key: "del", label: "", width: 44, render: (t) => <IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm({ text: t.text, onConfirm: () => { setTasks((ts) => ts.filter((x) => x.id !== t.id)); setConfirm(null); toast({ kind: "success", message: "タスクを削除しました" }); } })} /> },
  ];
  return (
    <section style={card} aria-labelledby="board-tasks">
      <SectionHeading icon="ListChecks" title="タスクの追加・完了管理" count={loading ? undefined : tasks.filter((t) => !t.done).length} description="案件に紐づくタスク。金曜に完了チェック"><Button size="sm" onClick={() => (onNavigate ? onNavigate("tasks-weekly") : (location.hash = "#screen=tasks-weekly"))}>全案件のタスクを一枚で見る{window.LucideReact && window.LucideReact.ArrowUpRight ? <window.LucideReact.ArrowUpRight size={14} strokeWidth={2} aria-hidden /> : null}</Button></SectionHeading>
      {/* 追加フォーム行（右端「追加」） */}
      <div style={{ display: "grid", gridTemplateColumns: "200px minmax(0,1fr) 140px 150px auto", gap: 8, alignItems: "center" }}>
        <Select size="sm" value={form.project} placeholder="案件を選ぶ" options={PROJECTS} onChange={(e) => setForm({ ...form, project: e.target.value })} width="100%" aria-label="案件" />
        <Input size="sm" value={form.text} placeholder="タスクを入力（Enter で追加）" aria-label="タスク" onChange={(e) => setForm({ ...form, text: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
        <Select size="sm" value={form.assignee} placeholder="担当" options={GG_MEMBERS} onChange={(e) => setForm({ ...form, assignee: e.target.value })} width="100%" aria-label="担当" />
        <Input size="sm" type="date" value={form.due} aria-label="期限" onChange={(e) => setForm({ ...form, due: e.target.value })} />
        <Button size="sm" variant="primary" icon="Plus" onClick={add} disabled={!form.project || !form.text.trim()}>追加</Button>
      </div>
      {/* フィルタ Select 3 */}
      <div style={{ display: "flex", gap: 8 }}>
        <Select size="sm" value={fp} options={["全案件", ...PROJECTS]} onChange={(e) => setFp(e.target.value)} width={180} aria-label="案件で絞る" />
        <Select size="sm" value={fa} options={["全担当", ...GG_MEMBERS]} onChange={(e) => setFa(e.target.value)} width={130} aria-label="担当で絞る" />
        <Select size="sm" value={fs} options={["全状態", "未完了", "完了"]} onChange={(e) => setFs(e.target.value)} width={120} aria-label="状態で絞る" />
      </div>
      {error ? <ErrorBand message="案件タスクを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : loading ? <DataTable density="compact" columns={cols} rows={[]} loading skeletonRows={4} /> : rows.length === 0 ? <EmptyState compact icon="ListChecks" title={tasks.length ? "条件に合うタスクはありません" : "案件タスクはまだありません"} description={tasks.length ? undefined : "上の行で案件とタスクを入れて［追加］。"} /> : <DataTable density="compact" columns={cols} rows={rows} minWidth={880} caption="案件タスク" />}
      {confirm ? <ConfirmDialog title="タスクを削除しますか？" description={`「${confirm.text}」が削除されます。この操作は取り消せません。`} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </section>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { BoardV2Screen, ProjectTaskSection });
