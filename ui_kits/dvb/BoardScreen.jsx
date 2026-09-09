import React, { useState } from "react";
import { BOARD_ROWS, NAMES, PROJECTS } from "./data.js";

/**
 * 案件別まとめ ＝ GG 週次案件ボード（/reports/projects/comparison）。ナビ「案件別まとめ」の着地画面。
 * 担当者負荷ストリップ（案件数）→ KPI 3 枚 → 8 列（2段セル）のテーブル。先週値は列にせずツールチップ。行は展開で備考・検証CP要約。
 */
export function BoardScreen({ state = "normal", toast, narrow }) {
  const D = window.DVB;
  const { PageHeader, FilterBar, Select, Button, KpiCard, DataTable, MetricCell, Badge, EmptyState, ConfirmDialog, SaveStatus } = D;
  const [rows, setRows] = useState(BOARD_ROWS);
  const [sort, setSort] = useState({ k: "dp", d: "desc" });
  const [sel, setSel] = useState([]);       // 負荷ストリップで選んだ担当者（複数可）
  const [expanded, setExpanded] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const loading = state === "loading", error = state === "error", empty = state === "empty";

  const base = empty ? [] : rows;
  // 「担当」= 現担当者(owner) + 今週タスクを持つ人(tasks[].assignee)。複数担当のマスタ化は確認待ちなので導出で表現
  const people = (r) => Array.from(new Set([r.owner, ...r.tasks.map((t) => t.assignee)].filter(Boolean)));
  const data = base.filter((r) => !sel.length || people(r).some((n) => sel.includes(n))).sort((a, b) => (sort.d === "desc" ? 1 : -1) * (((b[sort.k] ?? -Infinity)) - ((a[sort.k] ?? -Infinity))));
  const allTasks = data.flatMap((r) => r.tasks);
  const open = allTasks.filter((t) => !t.done).length;

  // 負荷 = その人が今週タスクを持つ案件数（スプシ「今週の担当者は何の案件をやるか」の再現）。副次: 未完了件数・期限超過
  const load = NAMES.map((n) => {
    const mine = base.filter((r) => r.tasks.some((t) => t.assignee === n));
    const ts = mine.flatMap((r) => r.tasks.filter((t) => t.assignee === n));
    return { n, projects: mine.length, open: ts.filter((t) => !t.done).length, late: ts.filter((t) => t.overdue && !t.done).length };
  });
  const unassigned = base.filter((r) => r.rank !== "停止" && r.tasks.length === 0);

  const toggleTask = (rid, tid) => { setRows((rs) => rs.map((r) => r.id !== rid ? r : { ...r, tasks: r.tasks.map((t) => t.id !== tid ? t : { ...t, done: !t.done }) })); toast({ kind: "undo", message: "タスクを完了にしました", actionLabel: "元に戻す" }); };
  const addTask = (rid, text) => { if (!text.trim()) return; setRows((rs) => rs.map((r) => r.id !== rid ? r : { ...r, tasks: [...r.tasks, { id: Date.now(), text, assignee: r.owner, done: false }] })); setEditing(null); toast({ kind: "success", message: "タスクを追加しました" }); };
  const delTask = () => { const { rid, tid } = confirm; setRows((rs) => rs.map((r) => r.id !== rid ? r : { ...r, tasks: r.tasks.filter((t) => t.id !== tid) })); setConfirm(null); toast({ kind: "success", message: "タスクを削除しました" }); };
  const toggleExpand = (id) => setExpanded((xs) => xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]);

  const L = window.LucideReact; const Check = L.Check, Plus = L.Plus, X = L.X, ChevronRight = L.ChevronRight, ChevronDown = L.ChevronDown;
  const taskCell = (r) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "2px 0", minWidth: 300 }}>
      {r.tasks.map((t) => (
        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, height: 24 }}>
          <button type="button" role="checkbox" aria-checked={t.done} onClick={() => toggleTask(r.id, t.id)} aria-label={t.done ? "未完了に戻す" : "完了にする"} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${t.done ? "var(--primary)" : "var(--muted-foreground)"}`, background: t.done ? "var(--primary)" : "var(--card)", color: "#fff", display: "grid", placeItems: "center", padding: 0, cursor: "pointer", flexShrink: 0 }}>{t.done ? <Check size={11} strokeWidth={3} /> : null}</button>
          <span style={{ flex: 1, minWidth: 0, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: t.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
          {t.assignee && t.assignee !== r.owner ? <span style={{ fontSize: 12, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{t.assignee}</span> : null}
          {t.due ? <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: t.overdue && !t.done ? "var(--negative)" : "var(--muted-foreground)", whiteSpace: "nowrap" }}>{t.due}{t.overdue && !t.done ? " 超過" : ""}</span> : null}
          <button type="button" aria-label="削除" onClick={() => setConfirm({ rid: r.id, tid: t.id, text: t.text })} style={{ width: 20, height: 20, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", borderRadius: 4, opacity: 0.6 }}><X size={12} /></button>
        </div>
      ))}
      {editing === r.id ? (
        <form onSubmit={(e) => { e.preventDefault(); addTask(r.id, new FormData(e.currentTarget).get("text")); }} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input name="text" autoFocus placeholder="タスクを入力（Enter で追加・Esc で閉じる）" onKeyDown={(e) => e.key === "Escape" && setEditing(null)} style={{ flex: 1, height: 28, fontSize: 13, padding: "0 8px", border: "1px solid var(--ring)", borderRadius: "var(--radius-sm)", background: "var(--card)", outline: "none", boxShadow: "0 0 0 3px var(--primary-subtle)" }} />
          <button type="submit" style={{ height: 28, padding: "0 10px", fontSize: 12, fontWeight: 500, border: 0, borderRadius: "var(--radius-sm)", background: "var(--primary)", color: "var(--primary-foreground)", cursor: "pointer" }}>追加</button>
        </form>
      ) : (
        <button type="button" onClick={() => setEditing(r.id)} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, height: 24, padding: "0 6px", border: 0, background: "transparent", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, borderRadius: 4, cursor: "pointer" }}><Plus size={12} />タスクを追加</button>
      )}
    </div>
  );

  // 8 列（1,104px）。先週粗利／先週ROAS は列にせず MetricCell の previous（title ツールチップ）へ。1440 − ナビ 248 の内容幅 1,142px に横スクロール無しで収まる
  const cols = [
    { key: "name", label: "案件名", sticky: true, width: 168, render: (r) => (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button type="button" aria-label={expanded.includes(r.id) ? "詳細を閉じる" : "詳細を開く"} aria-expanded={expanded.includes(r.id)} onClick={() => toggleExpand(r.id)} style={{ width: 20, height: 20, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", cursor: "pointer", borderRadius: 4, marginLeft: -4, flexShrink: 0 }}>{expanded.includes(r.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</button>
        <a href="#screen=project" style={{ color: "var(--primary)", fontWeight: 500 }}>{r.name}</a>
      </div>
    ) },
    { key: "rank", label: "ランク", width: 72, render: (r) => <Badge kind="rank" value={r.rank === "停止" ? "停止" : r.rank} /> },
    { key: "owner", label: "担当", width: 120, wrap: true, render: (r) => <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{people(r).map((n) => <Badge key={n} kind="assignee" value={n} />)}</div> },
    { key: "tasks", label: "今週のタスク", wrap: true, width: 320, render: taskCell },
    { key: "dp", label: "粗利 / 増減", align: "right", width: 112, sortable: true, render: (r) => <MetricCell value={r.profit} delta={r.dp} previous={r.lastProfit} unit="¥" empty="—" /> },
    { key: "dr", label: "ROAS / 増減", align: "right", width: 104, sortable: true, render: (r) => <MetricCell value={r.roas} delta={r.dr} previous={r.lastRoas} unit="%" digits={1} deltaUnit="pt" /> },
    { key: "ds", label: "消化 / 増減", align: "right", width: 112, sortable: true, render: (r) => <MetricCell value={r.spend} delta={r.ds} previous={r.lastSpend} unit="¥" /> },
    { key: "dc", label: "CV / 増減", align: "right", width: 96, sortable: true, render: (r) => <MetricCell value={r.cv} delta={r.dc} previous={r.lastCv} /> },
  ];

  const renderExpanded = (r) => (
    <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "minmax(0,2fr) minmax(0,1fr) auto", gap: 16, alignItems: "start" }}>
      <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 2 }}>備考 / フォーカス</div><div>{r.note || <span style={{ color: "var(--muted-foreground)" }}>—</span>}</div></div>
      <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 2 }}>検証CP</div><div style={{ fontVariantNumeric: "tabular-nums" }}>{r.cp && r.cp.count ? `${r.cp.count}本 ／ 粗利 ${r.cp.profit < 0 ? "−" : ""}¥${Math.abs(r.cp.profit).toLocaleString()}` : <span style={{ color: "var(--muted-foreground)" }}>—</span>}</div></div>
      <a href="#screen=project" style={{ fontSize: 13, fontWeight: 500, color: "var(--primary)", whiteSpace: "nowrap" }}>1案件ページを開く →</a>
    </div>
  );

  const chip = (l) => {
    const active = sel.includes(l.n);
    return (
      <button key={l.n} type="button" aria-pressed={active} onClick={() => setSel((s) => s.includes(l.n) ? s.filter((x) => x !== l.n) : [...s, l.n])} disabled={loading}
        title={`${l.n}: 今週タスクを持つ案件 ${l.projects}件（未完了 ${l.open}、期限超過 ${l.late}）`}
        style={{ minWidth: 0, display: "flex", alignItems: "baseline", gap: 6, height: 36, padding: "0 10px", border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`, borderRadius: "var(--radius-sm)", background: active ? "var(--primary-subtle)" : "var(--card)", color: "var(--foreground)", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", transition: "background var(--duration) var(--ease), border-color var(--duration) var(--ease)" }}>
        <span style={{ fontWeight: 500 }}>{l.n}</span>
        {loading ? <span style={{ flex: 1, height: 12, background: "var(--muted)", borderRadius: 4, alignSelf: "center" }} /> : (
          <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--muted-foreground)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: l.projects ? "var(--foreground)" : "var(--muted-foreground)" }}>{l.projects}</span>案件
            {l.open ? <span style={{ fontSize: 12 }}> 未完了{l.open}</span> : null}
            {l.late ? <span style={{ fontSize: 12, color: "var(--negative)" }}> 超過{l.late}</span> : null}
          </span>
        )}
      </button>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="FolderKanban" title="案件別まとめ" description="GG 週次案件ボード。先週比較・案件ごとの今週のタスク。案件名で1案件ページへ">
        <Button icon="Download">CSV</Button>
        <Button variant="primary" icon="Plus" onClick={() => data[0] && setEditing(data[0].id)}>タスクを追加</Button>
      </PageHeader>
      <FilterBar period="今週（9/7〜9/13）" right={<SaveStatus state={error ? "error" : "saved"} time="15:56" />}>
        <Select options={["全案件", ...PROJECTS]} defaultValue="全案件" />
        <Select options={["全ランク", "S", "A", "B", "C", "停止", "未設定"]} defaultValue="全ランク" />
        <Select options={["全状態", "未完了", "完了"]} defaultValue="全状態" />
      </FilterBar>

      {/* 担当者負荷ストリップ: 全幅・7人を等幅グリッド。値＝今週タスクを持つ案件数。チップを押すと表をその人で絞る */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: "10px 16px 12px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <span style={{ fontWeight: 500, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>今週の担当（今週タスクを持つ案件数）</span>
          {sel.length ? <button type="button" onClick={() => setSel([])} style={{ height: 20, padding: "0 4px", border: 0, background: "transparent", color: "var(--primary)", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>絞り込みを解除（{sel.join("・")}）</button> : null}
          <span style={{ marginLeft: "auto", whiteSpace: "nowrap", color: unassigned.length ? "var(--negative)" : "var(--muted-foreground)" }}>{loading ? "" : `担当者が付いていない案件 ${unassigned.length}件`}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${narrow ? Math.ceil(NAMES.length / 2) : NAMES.length}, minmax(0,1fr))`, gap: 8 }}>{load.map(chip)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12, alignItems: "stretch" }}>
        <KpiCard label="今週のタスク" value={loading ? undefined : empty ? 0 : allTasks.length} unit="件" note="フィルタ後" loading={loading} error={error} />
        <KpiCard label="未完了" value={loading ? undefined : empty ? 0 : open} unit="件" note={`期限超過 ${allTasks.filter((t) => t.overdue && !t.done).length}`} loading={loading} error={error} />
        <KpiCard label="完了" value={loading ? undefined : empty ? 0 : allTasks.length - open} unit="件" note={allTasks.length ? `${Math.round((allTasks.length - open) / allTasks.length * 100)}%` : "—"} loading={loading} error={error} />
      </div>

      <DataTable columns={cols} rows={data} sortKey={sort.k} sortDir={sort.d} onSort={(k, d) => setSort({ k, d })} loading={loading} error={error ? "AXAD の集計（team LIKE 'TM2%'）に接続できませんでした。" : undefined} onRetry={() => toast({ kind: "info", message: "再読み込みしています…" })}
        minWidth={1100} maxHeight={560} caption="GG 週次案件ボード" expandedKeys={expanded} renderExpanded={renderExpanded}
        emptyNode={<div style={{ padding: 16 }}><EmptyState variant="guide" title="この週の案件データはまだありません。" description="AXAD の同期は毎朝 6:00。先に今週のタスクだけ入れておくこともできます。" steps={["対象週と担当者を選ぶ", "案件行の「タスクを追加」で今週やることを1行ずつ", "金曜に完了チェックを付ける"]} action={<Button variant="primary" icon="Plus" onClick={() => toast({ kind: "info", message: "案件を選ぶと行内で追加できます" })}>最初のタスクを追加</Button>} /></div>} />

      {confirm ? <ConfirmDialog title="タスクを削除しますか？" description={`「${confirm.text}」が削除されます。この操作は取り消せません。`} onConfirm={delTask} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.BoardScreen = BoardScreen;
