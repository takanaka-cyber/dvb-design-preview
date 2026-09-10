import React, { useState, useMemo } from "react";
import { BOARD_ROWS, GG_MEMBERS, WEEKS, WEEKLY_TASK_ROWS, PROJECT_TASKS } from "./data.js";

/**
 * 今週のタスク一覧 /reports/projects/tasks（9/10 担当者「全案件のタスクが一枚で見える一覧」）。
 * 本番の /reports/projects/tasks は comparison へのリダイレクトなので、そこを実画面にする前提。
 * データは ProjectWeeklyTask（週 × 案件 × 担当者 × 1 行テキスト × 状態 × 期限）そのまま。スキーマ変更なし。
 * 1 枚の表に「案件の見出し行 → その案件の今週のタスク → 行内追加」を全案件ぶん並べる。行を開く操作は無い。タスクが無い案件も見出しだけ出す（＝手つかずが分かる）。
 * 上部で「案件別｜担当者別」を切替（担当者別は運用者が自分の週を見る用）。
 */
const RANK_ORDER = { S: 0, A: 1, B: 2, C: 3, "未設定": 4, "停止": 5 };
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" };
const isoToMd = (iso) => (iso ? `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}` : "");
const ctl = { height: 32, fontSize: 13, border: "1px solid var(--input)", borderRadius: "var(--radius-sm)", background: "var(--card)", color: "var(--foreground)", padding: "0 8px", outline: "none" };

/** 行内追加フォーム。案件別では案件が固定（見出し行の案件）、担当者別では担当が固定。Enter で追加して入力欄を空のまま残す（連続入力）。Esc で閉じる */
function AddRow({ fixedProject, fixedAssignee, projects, assignees, defaultAssignee, onSubmit, onCancel, mobile }) {
  const [text, setText] = useState("");
  const [assignee, setAssignee] = useState(fixedAssignee || defaultAssignee || assignees[0]);
  const [project, setProject] = useState(fixedProject || projects[0]);
  const [due, setDue] = useState("");
  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; onSubmit({ project, assignee, text: text.trim(), due: isoToMd(due) }); setText(""); };
  const sel = (v, set, opts, label) => <select value={v} onChange={(e) => set(e.target.value)} aria-label={label} style={{ ...ctl, minWidth: 0 }}>{opts.map((o) => <option key={o}>{o}</option>)}</select>;
  return (
    <form onSubmit={submit} onKeyDown={(e) => { if (e.key === "Escape") onCancel(); }}
      style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : `${fixedProject ? "" : "180px "}minmax(0,1fr) ${fixedAssignee ? "" : "120px "}130px auto auto`, gap: 8, alignItems: "center", padding: mobile ? "8px 12px 10px 44px" : "6px 12px 6px 44px", background: "var(--primary-subtle)" }}>
      {fixedProject ? null : sel(project, setProject, projects, "案件")}
      <input autoFocus value={text} onChange={(e) => setText(e.target.value)} placeholder="タスクを入力（Enter で追加、続けて入力できます）" aria-label="タスク" style={{ ...ctl, minWidth: 0 }} />
      {fixedAssignee ? null : sel(assignee, setAssignee, assignees, "担当")}
      <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="期限" style={{ ...ctl, fontVariantNumeric: "tabular-nums" }} />
      <div style={{ display: "flex", gap: 6 }}>
        <button type="submit" disabled={!text.trim()} style={{ height: 32, padding: "0 12px", borderRadius: "var(--radius-sm)", border: 0, background: "var(--primary)", color: "var(--primary-foreground)", fontSize: 13, fontWeight: 500, cursor: text.trim() ? "pointer" : "not-allowed", opacity: text.trim() ? 1 : 0.5, whiteSpace: "nowrap" }}>追加</button>
        <button type="button" onClick={onCancel} style={{ height: 32, padding: "0 10px", borderRadius: "var(--radius-sm)", border: 0, background: "transparent", color: "var(--muted-foreground)", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>閉じる</button>
      </div>
    </form>
  );
}

export function WeeklyTasksScreen({ state = "normal", toast, narrow, mobile, onNavigate }) {
  const { PageHeader, Button, Badge, Select, Checkbox, ConfirmDialog, EmptyState, WeekSelector, SegmentedControl, Progress } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const L = window.LucideReact; const Plus = L.Plus, Cal = L.Calendar;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  // 閲覧のみ = 役職（ADMIN/DIRECTOR/MANAGER）でも GG 事業部所属でもない人。追加・削除は出さず、チェックは無効（実装 PR #41 の canEdit=false と同じ）
  const canEdit = state !== "readonly";
  const [week, setWeek] = useState(0);
  const [tasks, setTasks] = useState(loading || empty || error ? [] : WEEKLY_TASK_ROWS);
  const [view, setView] = useState("project");
  const [fa, setFa] = useState("全担当"); const [fs, setFs] = useState("全状態");
  const [showEmpty, setShowEmpty] = useState(true);
  const [adding, setAdding] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const projects = useMemo(() => BOARD_ROWS.slice().sort((a, b) => (RANK_ORDER[a.rank] ?? 4) - (RANK_ORDER[b.rank] ?? 4) || a.name.localeCompare(b.name, "ja")), []);
  const projectNames = projects.map((p) => p.name);
  const filtered = fa === "全担当" && fs === "全状態";
  const visible = tasks.filter((t) => (fa === "全担当" || t.assignee === fa) && (fs === "全状態" || (fs === "完了" ? t.done : !t.done)));
  const groups = view === "project"
    ? projects.map((p) => ({ key: p.name, name: p.name, rank: p.rank, owner: p.owner, rows: visible.filter((t) => t.project === p.name) }))
    : GG_MEMBERS.map((n) => ({ key: n, name: n, rows: visible.filter((t) => t.assignee === n) }));
  const shown = groups.filter((g) => g.rows.length || (showEmpty && filtered));

  // 集計はフィルタ前（画面上部の数字は常に「今週の全体」）
  const total = tasks.length, open = tasks.filter((t) => !t.done).length, late = tasks.filter((t) => t.overdue && !t.done).length, done = total - open;

  const toggle = (t) => { setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))); toast({ kind: "undo", message: t.done ? "未完了に戻しました" : "タスクを完了にしました", actionLabel: "元に戻す", onAction: () => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: t.done } : x))) }); };
  const add = (v) => { setTasks((ts) => [...ts, { id: "w" + Date.now(), project: v.project, text: v.text, assignee: v.assignee, due: v.due, done: false }]); toast({ kind: "success", message: `${v.project} にタスクを追加しました` }); };
  const del = (t) => setConfirm({ text: t.text, onConfirm: () => { setTasks((ts) => ts.filter((x) => x.id !== t.id)); setConfirm(null); toast({ kind: "success", message: "タスクを削除しました" }); } });
  const carryOver = () => { const prev = PROJECT_TASKS.filter((t) => !t.done).map((t) => ({ ...t, id: "c" + t.id, due: "", overdue: false })); setTasks(prev); toast({ kind: "success", message: `先週の未完了 ${prev.length} 件を持ち越しました` }); };
  const goBoard = () => (onNavigate ? onNavigate("board-v2") : (location.hash = "#screen=board-v2"));

  const duePill = (t) => t.due ? (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: t.done ? "var(--muted-foreground)" : t.overdue ? "var(--negative)" : "var(--muted-foreground)", background: t.overdue && !t.done ? "var(--negative-subtle)" : "transparent", border: t.overdue && !t.done ? "1px solid transparent" : "1px solid var(--border)" }}>
      <Cal size={12} strokeWidth={2} />{t.due}{t.overdue && !t.done ? " 超過" : ""}
    </span>
  ) : <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>—</span>;
  const textStyle = (t) => ({ minWidth: 0, fontSize: 13, lineHeight: "18px", color: t.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: t.done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: mobile ? "normal" : "nowrap" });
  const projectChip = (t) => <a href="#screen=project" style={{ fontSize: 12, fontWeight: 500, color: "var(--primary)", whiteSpace: "nowrap", textDecoration: "none" }}>{t.project}</a>;

  /** タスク 1 行。PC: 6 列グリッド（36px 行）。担当者別では担当列の代わりに案件を出す。スマホ: 2 段（本文 → チップ） */
  const row = (t) => mobile ? (
    <div key={t.id} role="row" style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 8px 10px 12px", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <Checkbox checked={t.done} disabled={!canEdit} onChange={() => toggle(t)} />
        <span style={{ ...textStyle(t), flex: 1 }}>{t.text}</span>
        {canEdit ? <IconButton icon="Trash2" label="削除" onClick={() => del(t)} /> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 28, flexWrap: "wrap" }}>
        {view === "project" ? <Badge kind="assignee" value={t.assignee} size="sm" /> : projectChip(t)}
        {duePill(t)}
        {t.done ? <Badge value="done" size="sm" /> : t.overdue ? <Badge value="late" size="sm" /> : null}
      </div>
    </div>
  ) : (
    <div key={t.id} role="row" style={{ display: "grid", gridTemplateColumns: "44px minmax(0,1fr) 150px 110px 84px 40px", alignItems: "center", minHeight: 36, padding: "0 4px 0 0", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "grid", placeItems: "center" }}><Checkbox checked={t.done} disabled={!canEdit} onChange={() => toggle(t)} /></div>
      <span style={textStyle(t)}>{t.text}</span>
      <div>{view === "project" ? <Badge kind="assignee" value={t.assignee} /> : projectChip(t)}</div>
      <div>{duePill(t)}</div>
      <div><Badge value={t.done ? "done" : t.overdue ? "late" : "todo"} /></div>
      <div style={{ display: "grid", placeItems: "center" }}>{canEdit ? <IconButton icon="Trash2" label="削除" onClick={() => del(t)} /> : null}</div>
    </div>
  );

  /** 見出し行: 案件別 = ランク + 案件名（1 案件ページへ）+ 今週タスクを持つ人 + 未完了/件数 + ［＋ タスクを追加］。担当者別 = 名前 + 件数 */
  const head = (g) => {
    const people = Array.from(new Set(g.rows.map((t) => t.assignee)));
    const openN = g.rows.filter((t) => !t.done).length;
    return (
      <div key={"h" + g.key} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40, padding: mobile ? "8px 8px 8px 12px" : "0 8px 0 12px", background: "var(--muted)", borderTop: "1px solid var(--border)", flexWrap: mobile ? "wrap" : "nowrap" }}>
        {view === "project" ? <Badge kind="rank" value={g.rank === "停止" ? "停止" : g.rank} /> : <Badge kind="assignee" value={g.name} />}
        {view === "project" ? <a href="#screen=project" style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", textDecoration: "none", whiteSpace: "nowrap" }}>{g.name}</a> : null}
        {view === "project" && !mobile ? <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{people.map((n) => <Badge key={n} kind="assignee" value={n} size="sm" />)}</div> : null}
        <span style={{ fontSize: 12, color: g.rows.length ? "var(--muted-foreground)" : "var(--warning-subtle-foreground)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{g.rows.length ? `未完了 ${openN} ／ ${g.rows.length}件` : "今週のタスクなし"}</span>
        <span style={{ flex: 1 }} />
        {adding === g.key || !canEdit ? null : <Button size="sm" variant="ghost" icon="Plus" onClick={() => setAdding(g.key)}>タスクを追加</Button>}
      </div>
    );
  };

  const skeleton = Array.from({ length: 6 }, (_, i) => <div key={i} aria-busy="true" style={{ display: "flex", alignItems: "center", gap: 12, height: 36, padding: "0 12px", borderTop: "1px solid var(--border)" }}><span style={{ width: 18, height: 18, borderRadius: 4, background: "var(--muted)" }} /><span style={{ width: `${40 + (i % 3) * 15}%`, height: 12, borderRadius: 4, background: "var(--muted)" }} /></div>);

  const body = error ? <div style={{ padding: 12 }}><ErrorBand message="今週のタスクを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /></div>
    : loading ? skeleton
    : tasks.length === 0 ? <div style={{ padding: 16 }}><EmptyState variant="guide" icon="ListChecks" title="この週のタスクはまだありません。" description="案件ごとに「今週やること」を 1 行ずつ入れます。先週のスプシの備考をそのまま貼る形で始められます。" steps={["案件の見出し行の「タスクを追加」を押す", "担当者を選んでタスクを 1 行入力（Enter で続けて入力）", "金曜にチェックを付けて完了"]} action={canEdit ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}><Button variant="primary" icon="Plus" onClick={() => { setTasks([]); setAdding(projects[0].name); }}>最初のタスクを追加</Button><Button icon="History" onClick={carryOver}>先週の未完了を持ち越す</Button></div> : undefined} /></div>
    : shown.length === 0 ? <div style={{ padding: 16 }}><EmptyState compact icon="ListChecks" title="条件に合うタスクはありません" description="担当・状態の絞り込みを外すと全件に戻ります。" /></div>
    : shown.map((g) => [
      head(g),
      ...g.rows.map(row),
      adding === g.key ? <AddRow key={"a" + g.key} mobile={mobile} fixedProject={view === "project" ? g.name : undefined} fixedAssignee={view === "person" ? g.name : undefined} defaultAssignee={g.owner} projects={projectNames} assignees={GG_MEMBERS} onSubmit={add} onCancel={() => setAdding(null)} /> : null,
    ]);

  // adding が空状態からの遷移で tasks=[] のままだと EmptyState に戻るので、フォームを先に出す
  const showAddOnEmpty = tasks.length === 0 && adding && !loading && !error;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 12 : 16 }}>
      <PageHeader icon="ListChecks" title="今週のタスク一覧" description="全案件の今週やることを一枚で。チェックで完了、案件の行内で追加。数字は先週比較・案件タスクへ">
        {mobile ? null : <Button icon="FolderKanban" onClick={goBoard}>先週比較・案件タスク</Button>}
        {canEdit ? <Button variant="primary" icon="Plus" disabled={loading || error} onClick={() => setAdding((shown[0] || projects[0]).key || projects[0].name)}>タスクを追加</Button> : null}
      </PageHeader>

      {/* 週セレクタ（左）＋ 案件別｜担当者別 ＋ 絞り込み（右）。1 段。スマホは 2 段 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <WeekSelector weeks={WEEKS} index={week} onChange={(i) => setWeek(i)} compact={mobile || narrow} />
        <SegmentedControl aria-label="表示" value={view} onChange={(v) => { setView(v); setAdding(null); }} options={[{ value: "project", label: "案件別", icon: "FolderKanban" }, { value: "person", label: "担当者別", icon: "Users" }]} />
        {mobile ? null : <span style={{ flex: 1 }} />}
        <Select size="sm" value={fa} options={["全担当", ...GG_MEMBERS]} onChange={(e) => setFa(e.target.value)} width={mobile ? 120 : 130} aria-label="担当で絞る" />
        <Select size="sm" value={fs} options={["全状態", "未完了", "完了"]} onChange={(e) => setFs(e.target.value)} width={mobile ? 110 : 120} aria-label="状態で絞る" />
        {mobile ? null : <Checkbox label={view === "project" ? "タスクなしの案件も表示" : "タスクなしの人も表示"} checked={showEmpty} onChange={setShowEmpty} disabled={!filtered} />}
      </div>

      {/* 進捗の帯: KPI カード 3 枚の代わりに 1 行。会議で最初に見たいのは表なので、上の帯は薄く */}
      <div style={{ ...card, display: "flex", alignItems: "center", gap: mobile ? 12 : 20, padding: mobile ? "10px 12px" : "10px 16px", flexWrap: "wrap", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>今週 <b style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>{loading || error ? "—" : total}</b> 件</span>
        <span style={{ color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>未完了 <b style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>{loading || error ? "—" : open}</b>{late ? <span style={{ color: "var(--negative)", fontWeight: 500 }}>（期限超過 {late}）</span> : null}</span>
        <span style={{ color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>完了 <b style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>{loading || error ? "—" : done}</b></span>
        <Progress value={done} max={total || 1} label={total ? `${Math.round(done / total * 100)}%` : "—"} style={{ flex: 1, minWidth: 140, maxWidth: mobile ? undefined : 320, marginLeft: mobile ? 0 : "auto" }} />
      </div>

      {/* 一枚の表: 案件（または担当者）の見出し行 → タスク行 → 行内追加。行を開く操作は無い */}
      <section style={{ ...card, overflow: "hidden" }} aria-label={view === "project" ? "案件別の今週のタスク" : "担当者別の今週のタスク"}>
        {mobile ? null : (
          <div role="row" style={{ display: "grid", gridTemplateColumns: "44px minmax(0,1fr) 150px 110px 84px 40px", alignItems: "center", height: 36, padding: "0 4px 0 0", fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)" }}>
            <span /><span>タスク</span><span>{view === "project" ? "担当" : "案件"}</span><span>期限</span><span>状態</span><span />
          </div>
        )}
        {showAddOnEmpty ? [head({ key: projects[0].name, name: projects[0].name, rank: projects[0].rank, owner: projects[0].owner, rows: [] }), <AddRow key="a0" mobile={mobile} fixedProject={projects[0].name} defaultAssignee={projects[0].owner} projects={projectNames} assignees={GG_MEMBERS} onSubmit={add} onCancel={() => setAdding(null)} />] : body}
      </section>

      {confirm ? <ConfirmDialog title="タスクを削除しますか？" description={`「${confirm.text}」が削除されます。この操作は取り消せません。`} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { WeeklyTasksScreen });
