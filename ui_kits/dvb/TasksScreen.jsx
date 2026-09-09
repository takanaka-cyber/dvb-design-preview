import React, { useState, useMemo } from "react";
import { WEEKS, PROJECTS, TASK_OPTIONS, ASSIGNEES, TASK_INPUT_ROWS, WEEK_TASKS, OTHER_TASKS, OTHER_CATEGORIES, SECTIONS, SECTION_TASKS, ASSIGNEE_LOAD, LOAD_DAYS, PAST_WEEKS, TODAY_ISO } from "./data.js";

/* バッチ 1: タスク管理 /tasks と 課のタスク詳細 /tasks/section-detail。骨格・ボタン位置は現状維持、帯と部品だけ置換。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const TONE = { 高: ["var(--rank-s)", "var(--rank-s-foreground)", "transparent"], 中: ["var(--rank-a)", "var(--rank-a-foreground)", "transparent"], 低: ["var(--rank-b)", "var(--rank-b-foreground)", "var(--rank-b-border)"] };
export const fmtDue = (iso) => (iso ? `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}` : "—");
export const isOverdue = (t) => !t.done && !!t.due && t.due < TODAY_ISO;

/** 優先度バッジ（--rank-* トーン: 高 = S 塗り / 中 = A / 低 = B 枠） */
export function PriorityBadge({ value }) {
  const t = TONE[value] || ["var(--rank-c)", "var(--rank-c-foreground)", "var(--rank-c-border)"];
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 22, minWidth: 32, padding: "0 8px", borderRadius: 9999, fontSize: 12, fontWeight: 600, lineHeight: 1, background: t[0], color: t[1], border: `1px solid ${t[2]}`, whiteSpace: "nowrap" }}>{value || "—"}</span>;
}
/** 行内アイコン操作。32px タップ領域。tone: destructive / positive */
export function IconButton({ icon, label, tone, onClick, active, disabled }) {
  const [h, setH] = useState(false);
  const L = window.LucideReact; const I = L[icon];
  const color = tone === "destructive" ? "var(--negative)" : tone === "positive" ? "var(--positive)" : active ? "var(--foreground)" : "var(--muted-foreground)";
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, borderRadius: "var(--radius-sm)", background: (h || active) && !disabled ? "var(--muted)" : "transparent", color, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1, padding: 0, flexShrink: 0 }}>
      {I ? <I size={16} strokeWidth={1.75} aria-hidden /> : null}
    </button>
  );
}
/** エラー帯 + 再試行 */
export function ErrorBand({ message, onRetry }) {
  const { Button } = window.DVB; const W = window.LucideReact.TriangleAlert;
  return (
    <div role="alert" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--negative-subtle)", color: "var(--negative-subtle-foreground)", fontSize: 13, lineHeight: "18px" }}>
      <W size={16} strokeWidth={1.75} aria-hidden /><span style={{ flex: 1 }}>{message}</span>
      {onRetry ? <Button size="sm" variant="secondary" icon="RotateCw" onClick={onRetry}>再試行</Button> : null}
    </div>
  );
}
const blank = () => ({ id: "n" + Math.random().toString(36).slice(2, 7), project: "", target: "", type: "", title: "", detail: "", priority: "中", assignee: "", due: "" });
const PR = { 高: 0, 中: 1, 低: 2 };
const STATUS_OPTS = ["未着手", "進行中", "完了"];

export function TasksScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, SectionHeading, Button, DataTable, Badge, Select, Input, Textarea, Field, WeekSelector, FilterBar, SegmentedControl, Progress, Dialog, ConfirmDialog, Checkbox, EmptyState, Skeleton } = window.DVB;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [week, setWeek] = useState(0);
  const [inputRows, setInputRows] = useState(empty ? [blank()] : TASK_INPUT_ROWS);
  const [saving, setSaving] = useState(false);
  const [acOpen, setAcOpen] = useState(false);
  const [acActive, setAcActive] = useState(ASSIGNEES);
  const [tasks, setTasks] = useState(empty || error || loading ? [] : WEEK_TASKS);
  const [sort, setSort] = useState("priority");
  const [chip, setChip] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [others, setOthers] = useState(OTHER_TASKS);
  const [otherText, setOtherText] = useState("");
  const [cats, setCats] = useState(OTHER_CATEGORIES);
  const [otherCat, setOtherCat] = useState(OTHER_CATEGORIES[0]);
  const [catDialog, setCatDialog] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [showSection, setShowSection] = useState(true);
  const [secView, setSecView] = useState("all");
  const [showLoad, setShowLoad] = useState(true);
  const [pastOpen, setPastOpen] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const upd = (id, k, v) => setInputRows((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const sel = (r, k, opts, ph) => <Select size="sm" value={r[k]} placeholder={ph} options={opts} onChange={(e) => upd(r.id, k, e.target.value)} width="100%" aria-label={ph} />;
  const inputCols = [
    { key: "project", label: "案件名", width: 176, render: (r) => sel(r, "project", PROJECTS, "案件を選ぶ") },
    { key: "target", label: "対象", width: 92, render: (r) => sel(r, "target", TASK_OPTIONS.target, "—") },
    { key: "type", label: "種別", width: 100, render: (r) => sel(r, "type", TASK_OPTIONS.type, "—") },
    { key: "title", label: "本編名", width: 150, render: (r) => <Input size="sm" value={r.title} placeholder="本編名" aria-label="本編名" onChange={(e) => upd(r.id, "title", e.target.value)} /> },
    { key: "detail", label: "施策内容", render: (r) => <Input size="sm" value={r.detail} placeholder="施策内容" aria-label="施策内容" onChange={(e) => upd(r.id, "detail", e.target.value)} /> },
    { key: "priority", label: "優先度", width: 84, render: (r) => sel(r, "priority", TASK_OPTIONS.priority, "—") },
    { key: "assignee", label: "アセクリ", width: 128, render: (r) => sel(r, "assignee", acActive, "未指定") },
    { key: "due", label: "期限日", width: 150, render: (r) => <Input size="sm" type="date" value={r.due} aria-label="期限日" onChange={(e) => upd(r.id, "due", e.target.value)} /> },
    { key: "del", label: "", width: 44, render: (r) => <IconButton icon="Trash2" label="行を削除" tone="destructive" onClick={() => setConfirm({ title: "入力行を削除しますか？", description: `「${r.detail || r.project || "空の行"}」が削除されます。この操作は取り消せません。`, onConfirm: () => { setInputRows((rs) => (rs.length > 1 ? rs.filter((x) => x.id !== r.id) : [blank()])); setConfirm(null); toast({ kind: "success", message: "行を削除しました" }); } })} /> },
  ];
  const save = () => { setSaving(true); setTimeout(() => { setSaving(false); toast({ kind: "success", message: `タスクを保存しました（${inputRows.filter((r) => r.project).length} 行）` }); }, 900); };

  const done = tasks.filter((t) => t.done).length;
  const visible = useMemo(() => tasks.filter((t) => !chip || t.assignee === chip).slice().sort((a, b) => (sort === "priority" ? PR[a.priority] - PR[b.priority] : sort === "due" ? a.due.localeCompare(b.due) : a.project.localeCompare(b.project, "ja"))), [tasks, chip, sort]);
  const complete = (t) => {
    setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
    toast({ kind: "undo", message: t.done ? "未完了に戻しました" : "タスクを完了にしました", actionLabel: "元に戻す", onAction: () => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: t.done } : x))) });
  };
  const ops = (t) => (
    <span style={{ display: "inline-flex" }}>
      <IconButton icon="Copy" label="コピー" onClick={() => { setInputRows((rs) => [...rs.filter((r) => r.project || r.detail), { ...t, id: "c" + Date.now(), due: "" }]); toast({ kind: "success", message: "タスク入力にコピーしました" }); }} />
      <IconButton icon={expanded === t.id ? "ChevronUp" : "ChevronDown"} label="展開" active={expanded === t.id} onClick={() => setExpanded(expanded === t.id ? null : t.id)} />
      <IconButton icon="Pencil" label="編集" onClick={() => setExpanded(t.id)} />
      <IconButton icon="Check" label={t.done ? "未完了に戻す" : "完了にする"} tone={t.done ? "positive" : undefined} onClick={() => complete(t)} />
    </span>
  );
  const weekCols = [
    { key: "project", label: "案件名", width: 150, render: (r) => <span style={{ fontWeight: 500 }}>{r.project}</span> },
    { key: "target", label: "対象", width: 64 },
    { key: "type", label: "種別", width: 72, render: (r) => <Badge value="info" label={r.type} /> },
    { key: "title", label: "本編名", width: 130 },
    { key: "detail", label: "施策内容", render: (r) => <span style={{ textDecoration: r.done ? "line-through" : "none", color: r.done ? "var(--muted-foreground)" : "var(--foreground)" }}>{r.detail}</span> },
    { key: "priority", label: "優先度", width: 76, render: (r) => <PriorityBadge value={r.priority} /> },
    { key: "assignee", label: "アセクリ", width: 120, render: (r) => <Badge kind="assignee" value={r.assignee} /> },
    { key: "due", label: "期限日", width: 96, align: "right", render: (r) => <span style={{ color: isOverdue(r) ? "var(--negative)" : "inherit", fontWeight: isOverdue(r) ? 600 : 400 }}>{fmtDue(r.due)}{isOverdue(r) ? " 超過" : ""}</span> },
    { key: "ops", label: "", width: 136, render: ops },
  ];
  const chips = ASSIGNEES.map((a) => ({ label: a, active: chip === a, count: tasks.filter((t) => t.assignee === a).length }));

  const secTasks = useMemo(() => { const list = SECTION_TASKS.filter((t) => secView !== "dash" || t.dashboard); return list.slice().sort((a, b) => (secView === "project" ? a.project.localeCompare(b.project, "ja") : secView === "priority" ? PR[a.priority] - PR[b.priority] : a.owner.localeCompare(b.owner, "ja"))); }, [secView]);
  const secCols = [
    { key: "owner", label: "メンバー", width: 110, render: (r) => <Badge kind="assignee" value={r.owner} /> },
    { key: "project", label: "案件名", width: 150 },
    { key: "detail", label: "施策内容", render: (r) => `${r.title} · ${r.detail}` },
    { key: "priority", label: "優先度", width: 76, render: (r) => <PriorityBadge value={r.priority} /> },
    { key: "due", label: "期限", width: 80, align: "right", render: (r) => fmtDue(r.due) },
    { key: "done", label: "状態", width: 84, render: (r) => <Badge value={r.done ? "done" : isOverdue(r) ? "late" : "todo"} /> },
  ];
  const loadTone = (n) => (n >= 5 ? ["var(--rank-s)", "var(--rank-s-foreground)", "transparent"] : n >= 3 ? ["var(--rank-a)", "var(--rank-a-foreground)", "transparent"] : n >= 1 ? ["var(--rank-b)", "var(--rank-b-foreground)", "var(--rank-b-border)"] : ["transparent", "var(--disabled-foreground)", "transparent"]);
  const loadCols = [
    { key: "name", label: "アセクリ", sticky: true, width: 140, render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    ...LOAD_DAYS.map((d) => ({ key: d.key, label: d.label, width: 92, align: "right", render: (r) => { const [bg, fg, bd] = loadTone(r[d.key]); return <span style={{ display: "inline-grid", placeItems: "center", minWidth: 28, height: 22, padding: "0 6px", borderRadius: "var(--radius-sm)", background: bg, color: fg, border: `1px solid ${bd}`, fontSize: 13, fontWeight: r[d.key] ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>{r[d.key]}</span>; } })),
  ];
  const legend = [["0 件", loadTone(0)], ["1〜2 件", loadTone(1)], ["3〜4 件", loadTone(3)], ["5 件以上", loadTone(5)]];
  const eyeBtn = (on, set) => <Button size="sm" variant="ghost" icon={on ? "EyeOff" : "Eye"} onClick={() => set(!on)}>{on ? "非表示" : "表示"}</Button>;
  const addOther = () => { if (!otherText.trim()) return; setOthers((o) => [...o, { id: "o" + Date.now(), text: otherText.trim(), category: otherCat, status: "未着手", subtasks: [] }]); setOtherText(""); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ① h1 + 副題、右に週セレクタ */}
      <PageHeader icon="ListTodo" title="タスク管理" description="今週のタスクを入力し、アセクリへ発注する。金曜に完了を確認">
        <WeekSelector weeks={WEEKS} index={week} onChange={(i) => setWeek(i)} />
      </PageHeader>

      {/* ② タスク入力（濃紺帯 → SectionHeading。右端 アセクリ管理 Popover） */}
      <section style={card} aria-labelledby="tasks-input">
        <SectionHeading icon="PenLine" title="タスク入力" description="行ごとに 1 タスク。空の行は保存されません">
          <span style={{ position: "relative", display: "inline-flex" }}>
            <Button size="sm" variant="secondary" icon="Users" aria-expanded={acOpen} onClick={() => setAcOpen(!acOpen)}>アセクリ管理</Button>
            {acOpen ? (
              <div role="dialog" aria-label="アセクリ管理" style={{ position: "absolute", top: 40, right: 0, zIndex: 30, width: 280, background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>選択肢に出すアセクリ</div>
                {ASSIGNEES.map((a) => <Checkbox key={a} checked={acActive.includes(a)} onChange={(v) => setAcActive((xs) => (v ? [...xs, a] : xs.filter((x) => x !== a)))} label={a} />)}
                <div style={{ display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 8 }}><Input size="sm" placeholder="アセクリ名を追加" aria-label="アセクリ名" /><Button size="sm" variant="secondary" icon="Plus" onClick={() => toast({ kind: "info", message: "アセクリの追加は管理画面に反映されます" })}>追加</Button></div>
              </div>
            ) : null}
          </span>
        </SectionHeading>
        <DataTable density="compact" columns={inputCols} rows={inputRows} minWidth={1080} loading={loading} skeletonRows={3} stickyHeader={false} caption="タスク入力" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button variant="ghost" icon="Plus" onClick={() => setInputRows((rs) => [...rs, blank()])}>行追加</Button>
          <Button variant="primary" icon="Save" loading={saving} onClick={save}>保存</Button>
        </div>
      </section>

      {/* ③ 今週タスク */}
      <section style={card} aria-labelledby="tasks-week">
        <SectionHeading icon="CalendarCheck" title="今週タスク" count={loading ? undefined : tasks.length}>
          {!loading && tasks.length ? <Progress value={done} max={tasks.length} width={200} /> : null}
          <SegmentedControl aria-label="並び替え" options={[{ value: "priority", label: "優先度" }, { value: "due", label: "期限" }, { value: "project", label: "案件" }]} value={sort} onChange={setSort} />
          <IconButton icon="Settings2" label="列設定" onClick={() => toast({ kind: "info", message: "列設定はこのキットでは省略" })} />
        </SectionHeading>
        {error ? <ErrorBand message="タスクを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}
        {!error && !loading && tasks.length ? <FilterBar chips={chips} onChip={(l) => setChip(chip === l ? null : l)} /> : null}
        {loading ? <DataTable density="compact" columns={weekCols} rows={[]} loading skeletonRows={5} minWidth={1000} />
          : error ? null
          : tasks.length === 0 ? <EmptyState icon="ListTodo" title="今週のタスクはまだありません" description="上の「タスク入力」に行を追加して保存すると、ここに並びます。" action={<Button variant="primary" icon="Plus" onClick={() => { setInputRows((rs) => [...rs, blank()]); window.scrollTo({ top: 0, behavior: "smooth" }); }}>行を追加</Button>} />
          : <DataTable density="compact" columns={weekCols} rows={visible} minWidth={1000} selectedKey={expanded} caption="今週タスク" />}
        {expanded && tasks.some((t) => t.id === expanded) ? (() => { const t = tasks.find((x) => x.id === expanded); return (
          <div style={{ border: "1px solid var(--border)", borderLeft: "3px solid var(--primary)", borderRadius: "var(--radius)", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span style={{ fontSize: 14, fontWeight: 600 }}>{t.project} · {t.title}</span><PriorityBadge value={t.priority} /><Badge kind="assignee" value={t.assignee} /><span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>期限 {fmtDue(t.due)}</span><span style={{ marginLeft: "auto" }}><IconButton icon="X" label="閉じる" onClick={() => setExpanded(null)} /></span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Button size="sm" icon="ExternalLink">CR を開く</Button><Button size="sm" icon="ExternalLink">プロマネを開く</Button><Button size="sm" variant="ghost" icon="Plus">新規</Button><Button size="sm" variant="ghost" icon="Maximize2">展開</Button></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <Field label="施策内容" htmlFor={`d-${t.id}`}><Textarea id={`d-${t.id}`} rows={3} defaultValue={t.detail} /></Field>
              <Field label="アセクリへの発注メモ" htmlFor={`m-${t.id}`} help="納品形式・本数・参考 URL"><Textarea id={`m-${t.id}`} rows={3} placeholder="例: 9:16 / 15 秒 / 2 本。参考: 前回 v3 の 2 本目" /></Field>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="secondary" icon="Save" onClick={() => toast({ kind: "success", message: "保存しました" })}>保存</Button>
              <Button variant="primary" icon="Send" onClick={() => setConfirm({ title: "発注を送信しますか？", description: `${t.assignee} のチャットワークに「${t.detail}」の発注内容を送ります。`, confirmLabel: "送信", destructive: false, onConfirm: () => { setConfirm(null); toast({ kind: "success", message: `${t.assignee} に発注を送信しました` }); } })}>発注送信</Button>
            </div>
          </div>); })() : null}
      </section>

      {/* ④ その他（slate 帯 + 📝 → SectionHeading + ListChecks） */}
      <section style={card} aria-labelledby="tasks-other">
        <SectionHeading icon="ListChecks" title="その他" count={others.length} description="案件に紐づかないタスク">
          <IconButton icon="Plus" label="カテゴリを追加" onClick={() => setCatDialog(true)} />
        </SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 140px 32px", gap: 8, alignItems: "center" }}>
          <Input size="sm" value={otherText} placeholder="タスクを入力（Enter で追加）" aria-label="その他のタスク" onChange={(e) => setOtherText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addOther(); }} />
          <Select size="sm" value={otherCat} options={cats} onChange={(e) => setOtherCat(e.target.value)} width="100%" aria-label="カテゴリ" />
          <IconButton icon="Plus" label="追加" onClick={addOther} disabled={!otherText.trim()} />
        </div>
        {others.length === 0 ? <EmptyState compact icon="ListChecks" title="その他のタスクはありません" /> : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {others.map((o) => (
              <div key={o.id} style={{ borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto 120px 32px", gap: 8, alignItems: "center", minHeight: 44 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, fontSize: 14 }}><Badge value="neutral" label={o.category} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: o.status === "完了" ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: o.status === "完了" ? "line-through" : "none" }}>{o.text}</span></span>
                  <Button size="sm" variant="ghost" icon="Plus" onClick={() => setOthers((os) => os.map((x) => (x.id === o.id ? { ...x, subtasks: [...x.subtasks, "新しいサブタスク"] } : x)))}>サブタスク</Button>
                  <Select size="sm" value={o.status} options={STATUS_OPTS} onChange={(e) => setOthers((os) => os.map((x) => (x.id === o.id ? { ...x, status: e.target.value } : x)))} width="100%" aria-label="ステータス" />
                  <IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm({ title: "タスクを削除しますか？", description: `「${o.text}」とサブタスク ${o.subtasks.length} 件が削除されます。この操作は取り消せません。`, onConfirm: () => { setOthers((os) => os.filter((x) => x.id !== o.id)); setConfirm(null); toast({ kind: "success", message: "削除しました" }); } })} />
                </div>
                {o.subtasks.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 32, paddingLeft: 24, fontSize: 13, color: "var(--muted-foreground)" }}><L.CornerDownRight size={14} aria-hidden />{s}</div>)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ⑤ 課のタスク一覧 */}
      <section style={card} aria-labelledby="tasks-section">
        <SectionHeading level={3} icon="Users" title="課のタスク一覧" count={SECTION_TASKS.length}>{eyeBtn(showSection, setShowSection)}</SectionHeading>
        {showSection ? (<>
          <SegmentedControl aria-label="表示" options={[{ value: "all", label: "全て" }, { value: "dash", label: "ダッシュボード表示のみ" }, { value: "project", label: "案件別" }, { value: "priority", label: "優先度別" }]} value={secView} onChange={setSecView} />
          {loading ? <DataTable density="compact" columns={secCols} rows={[]} loading skeletonRows={4} /> : <DataTable density="compact" columns={secCols} rows={secTasks} minWidth={880} maxHeight={360} />}
        </>) : null}
      </section>

      {/* ⑥ 課のタスク詳細を見る（セクション間・中央） */}
      <div style={{ display: "flex", justifyContent: "center" }}><Button variant="secondary" icon="ArrowRight" onClick={() => onNavigate && onNavigate("tasks-section")}>課のタスク詳細を見る</Button></div>

      {/* ⑦ アセクリ稼働状況（紫帯 → SectionHeading、凡例は rank トーン） */}
      <section style={card} aria-labelledby="tasks-load">
        <SectionHeading level={3} icon="Gauge" title="アセクリ稼働状況" description="納品予定の件数 / 日">
          <span role="list" aria-label="凡例" style={{ display: "inline-flex", gap: 10, alignItems: "center", marginRight: 8 }}>
            {legend.map(([l, [bg, fg, bd]]) => <span key={l} role="listitem" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted-foreground)" }}><span aria-hidden style={{ width: 14, height: 14, borderRadius: 3, background: bg === "transparent" ? "var(--muted)" : bg, border: `1px solid ${bd === "transparent" ? "transparent" : bd}` }} />{l}</span>)}
          </span>
          {eyeBtn(showLoad, setShowLoad)}
        </SectionHeading>
        {showLoad ? (loading ? <DataTable density="compact" columns={loadCols.slice(0, 8)} rows={[]} loading skeletonRows={4} /> : <DataTable density="compact" columns={loadCols} rows={ASSIGNEE_LOAD} minWidth={1460} caption="アセクリ稼働状況" />) : null}
      </section>

      {/* ⑧ 過去のタスク（週アコーディオン） */}
      <section style={{ ...card, padding: 0, gap: 0 }} aria-labelledby="tasks-past">
        <div style={{ padding: "12px 16px 4px" }}><SectionHeading level={3} icon="History" title="過去のタスク" /></div>
        {loading ? <div style={{ padding: 16, display: "grid", gap: 10 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={16} width={`${60 - i * 10}%`} />)}</div> : PAST_WEEKS.map((w) => {
          const open = pastOpen === w.key; const Chev = open ? L.ChevronDown : L.ChevronRight;
          return (
            <div key={w.key} style={{ borderTop: "1px solid var(--border)" }}>
              <button type="button" aria-expanded={open} onClick={() => setPastOpen(open ? null : w.key)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", height: 44, padding: "0 16px", border: 0, background: "transparent", cursor: "pointer", textAlign: "left", fontSize: 14, color: "var(--foreground)" }}>
                <Chev size={16} color="var(--muted-foreground)" aria-hidden /><span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{w.label}</span>
                <span style={{ marginLeft: "auto" }}><Badge value={w.done === w.total ? "done" : "todo"} label={`${w.done}/${w.total} 件完了`} /></span>
              </button>
              {open ? <div style={{ padding: "0 16px 16px" }}><DataTable density="compact" columns={weekCols.slice(0, 8)} rows={w.tasks} minWidth={880} /></div> : null}
            </div>
          );
        })}
      </section>

      <Dialog open={catDialog} size="sm" title="カテゴリを追加" onClose={() => { setCatDialog(false); setNewCat(""); }} confirmLabel="追加" confirmDisabled={!newCat.trim()} onConfirm={() => { setCats((c) => [...c, newCat.trim()]); setOtherCat(newCat.trim()); setCatDialog(false); setNewCat(""); toast({ kind: "success", message: `カテゴリ「${newCat.trim()}」を追加しました` }); }}>
        <Field label="カテゴリ名" htmlFor="cat" help="「その他」の入力行で選べるようになります"><Input id="cat" value={newCat} placeholder="例: 採用" onChange={(e) => setNewCat(e.target.value)} /></Field>
      </Dialog>
      {confirm ? <ConfirmDialog title={confirm.title} description={confirm.description} confirmLabel={confirm.confirmLabel} destructive={confirm.destructive !== false} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}

/** 課のタスク詳細 /tasks/section-detail。左「タスク管理に戻る」ghost → h1 → 課ごとに h2 + メンバーカード 3 列。 */
export function SectionDetailScreen({ state = "normal", onNavigate }) {
  const { PageHeader, SectionHeading, Button, Badge, EmptyState } = window.DVB;
  const empty = state === "empty";
  const tasks = empty ? [] : SECTION_TASKS;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div><Button variant="ghost" icon="ArrowLeft" onClick={() => onNavigate && onNavigate("tasks")}>タスク管理に戻る</Button></div>
      <PageHeader icon="Users" title="課のタスク詳細一覧" description={`${WEEKS[0].label} · ${SECTIONS.length} 課 ${SECTIONS.reduce((n, s) => n + s.members.length, 0)} 名`} />
      {empty ? <EmptyState icon="ListTodo" title="今週のタスクはありません" description="メンバーがタスク管理で保存すると、課ごとにここへ並びます。" /> : SECTIONS.map((sec) => {
        const secTasks = tasks.filter((t) => sec.members.includes(t.owner));
        return (
          <section key={sec.name} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <SectionHeading icon="Building2" title={sec.name} description={`${sec.members.length} 名`}><Badge value={secTasks.every((t) => t.done) ? "done" : "todo"} label={`${secTasks.filter((t) => t.done).length}/${secTasks.length} 件完了`} /></SectionHeading>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
              {sec.members.map((m) => {
                const ts = tasks.filter((t) => t.owner === m); const d = ts.filter((t) => t.done).length;
                return (
                  <article key={m} style={{ ...card, gap: 0, padding: 0 }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                      <SectionHeading level={3} icon="User" title={m}><Badge value={ts.length && d === ts.length ? "done" : "neutral"} label={`${d}/${ts.length} 件完了`} /></SectionHeading>
                    </div>
                    {ts.length === 0 ? <div style={{ padding: "20px 16px", fontSize: 13, color: "var(--muted-foreground)", textAlign: "center" }}>今週のタスクはありません</div> : ts.map((t) => (
                      <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}><PriorityBadge value={t.priority} /><Badge value="info" label={t.type} /><span style={{ fontSize: 13, color: "var(--muted-foreground)", marginLeft: "auto", fontVariantNumeric: "tabular-nums", ...(isOverdue(t) ? { color: "var(--negative)", fontWeight: 600 } : {}) }}>{fmtDue(t.due)}{isOverdue(t) ? " 超過" : ""}</span></div>
                        <div style={{ fontSize: 14, lineHeight: "20px", textDecoration: t.done ? "line-through" : "none", color: t.done ? "var(--muted-foreground)" : "var(--foreground)" }}><span style={{ fontWeight: 500 }}>{t.project}</span> · {t.title} — {t.detail}</div>
                        <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>アセクリ: {t.assignee}</div>
                      </div>
                    ))}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { TasksScreen, SectionDetailScreen, PriorityBadge, IconButton, ErrorBand, fmtDue, isOverdue });
