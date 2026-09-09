import React, { useState } from "react";
import { WEEKS, GG_MEMBERS, PROJECTS, TASK_OPTIONS, SECTION_TASKS, OTHER_TASKS, OTHER_CATEGORIES, CAL_WEEK, CAL_EVENTS, TEAM_PROGRESS, MY_COMMITMENTS, TODAY_ISO } from "./data.js";

/* バッチ 1: ダッシュボード /dashboard（1440・4 状態）。h1 追加（E2）、帯 5 本 → SectionHeading、右側要素は同じ位置。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const STATUS_OPTS = ["未着手", "進行中", "完了"];
const TODAY = 9;

export function DashboardScreenV2({ state = "normal", toast, onNavigate }) {
  const { PageHeader, SectionHeading, Button, Badge, DataTable, Select, Input, WeekSelector, SegmentedControl, Progress, ConfirmDialog, EmptyState, Skeleton, Dialog, Field } = window.DVB;
  const { PriorityBadge, IconButton, ErrorBand, fmtDue, isOverdue } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [week, setWeek] = useState(0);
  const [sentAt, setSentAt] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [member, setMember] = useState("大倉");
  const [fProject, setFProject] = useState("");
  const [fPriority, setFPriority] = useState("");
  const [showDone, setShowDone] = useState(true);
  const [calView, setCalView] = useState("week");
  const [others, setOthers] = useState(OTHER_TASKS);
  const [otherText, setOtherText] = useState("");
  const [catDialog, setCatDialog] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [commitDone, setCommitDone] = useState(MY_COMMITMENTS[0].doneToday);

  const all = empty || error || loading ? [] : SECTION_TASKS;
  const mine = all.filter((t) => t.owner === "大倉");
  const board = all.filter((t) => t.owner === member && (!fProject || t.project === fProject) && (!fPriority || t.priority === fPriority) && (showDone || !t.done));
  const mineDone = mine.filter((t) => t.done).length;
  const events = empty ? [] : CAL_EVENTS;

  const send = () => setConfirm({ title: "当日タスクを送信しますか？", description: `今日（9/9）のタスク ${mine.filter((t) => !t.done).length} 件をチャットワークの報告先ルームに送ります。`, confirmLabel: "送信", destructive: false, onConfirm: () => { setConfirm(null); setSentAt("15:56"); toast({ kind: "success", message: "当日タスクを送信しました" }); } });
  const boardCols = [
    { key: "project", label: "案件名", width: 150, render: (r) => <span style={{ fontWeight: 500 }}>{r.project}</span> },
    { key: "type", label: "種別", width: 72, render: (r) => <Badge value="info" label={r.type} /> },
    { key: "detail", label: "施策内容", render: (r) => <span style={{ textDecoration: r.done ? "line-through" : "none", color: r.done ? "var(--muted-foreground)" : "inherit" }}>{r.title} · {r.detail}</span> },
    { key: "priority", label: "優先度", width: 76, render: (r) => <PriorityBadge value={r.priority} /> },
    { key: "assignee", label: "アセクリ", width: 110 },
    { key: "due", label: "期限", width: 84, align: "right", render: (r) => <span style={isOverdue(r) ? { color: "var(--negative)", fontWeight: 600 } : undefined}>{fmtDue(r.due)}</span> },
    { key: "done", label: "状態", width: 84, render: (r) => <Badge value={r.done ? "done" : isOverdue(r) ? "late" : "todo"} /> },
  ];
  const checkCard = (title, icon, lines, done, target) => {
    const I = L[icon];
    return (
      <a href={`#screen=${target}`} onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(target); }} style={{ ...card, flexDirection: "row", alignItems: "center", gap: 12, borderLeft: `3px solid ${done ? "var(--positive)" : "var(--primary)"}`, textDecoration: "none", color: "inherit" }}>
        <span style={{ width: 36, height: 36, borderRadius: "var(--radius)", background: done ? "var(--positive-subtle)" : "var(--primary-subtle)", color: done ? "var(--positive)" : "var(--primary)", display: "grid", placeItems: "center", flexShrink: 0 }}>{I ? <I size={18} strokeWidth={1.75} aria-hidden /> : null}</span>
        <span style={{ minWidth: 0, flex: 1 }}><span style={{ display: "block", fontSize: 15, fontWeight: 600 }}>{title}</span><span style={{ display: "block", fontSize: 13, color: "var(--muted-foreground)", marginTop: 2 }}>{lines}</span></span>
        {done ? <Badge value="done" /> : <Badge value="todo" label="未完了" />}
        <L.ChevronRight size={18} color="var(--muted-foreground)" aria-hidden />
      </a>
    );
  };
  const chip = (e) => { const tone = e.kind === "shoot" ? ["var(--primary-subtle)", "var(--primary-subtle-foreground)"] : e.kind === "deadline" ? ["var(--warning-subtle)", "var(--warning-subtle-foreground)"] : ["var(--muted)", "var(--foreground)"]; return <span key={e.label} style={{ display: "block", fontSize: 13, lineHeight: "18px", padding: "3px 6px", borderRadius: "var(--radius-sm)", background: tone[0], color: tone[1], overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.label}</span>; };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ① h1（E2 で追加）右に 当日タスク送信 → 送信済みは positive バッジ（位置同じ） */}
      <PageHeader icon="LayoutDashboard" title="ダッシュボード" description="9/9（火）。今日やることと今週のタスク">
        {sentAt ? <Badge value="done" label={`送信済み ${sentAt}`} /> : <Button variant="primary" icon="Send" disabled={loading || error} onClick={send}>当日タスク送信</Button>}
      </PageHeader>
      <div><WeekSelector weeks={WEEKS} index={week} onChange={setWeek} /></div>
      {error ? <ErrorBand message="ダッシュボードのデータを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}

      {/* ② チェックリスト 2 枚（カード全体がリンク、左 3px バー） */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {loading ? [0, 1].map((i) => <div key={i} style={{ ...card, minHeight: 72 }}><Skeleton width="40%" height={16} /><Skeleton width="70%" height={12} /></div>) : <>
          {checkCard("タスク管理", "ListTodo", empty ? "今週のタスクはまだありません" : `今週 ${mine.length} 件 · 完了 ${mineDone} · 期限超過 ${mine.filter(isOverdue).length}`, !empty && mine.length > 0 && mineDone === mine.length, "tasks")}
          {checkCard("日報", "BookOpen", "本日未送信 · 18:00 まで", false, "mbo")}
        </>}
      </div>

      {empty ? (
        <section style={card}><EmptyState icon="BookOpen" title="今日やること: 日報を書く" description="今週のタスクはまだありません。日報を 18:00 までに送信すると、チャットワークに通知されます。" action={<Button variant="primary" icon="PenLine" onClick={() => onNavigate && onNavigate("mbo")}>日報を書く</Button>} /></section>
      ) : (<>
        {/* ③ タスク進捗（indigo→purple バー → Progress） */}
        <section style={card}>
          <SectionHeading icon="TrendingUp" title="タスク進捗" description="今週 · 自分" />
          {loading ? <Skeleton height={8} /> : <Progress value={mineDone} max={mine.length} />}
        </section>

        {/* ④ 進捗ボード（帯 → SectionHeading、右にフィルタ Select×2 + 目、表の上にメンバー Select） */}
        <section style={card}>
          <SectionHeading icon="BarChart3" title="進捗ボード" count={loading ? undefined : board.length}>
            <Select size="sm" value={fProject} placeholder="すべての案件" options={PROJECTS} onChange={(e) => setFProject(e.target.value)} aria-label="案件" />
            <Select size="sm" value={fPriority} placeholder="すべての優先度" options={TASK_OPTIONS.priority} onChange={(e) => setFPriority(e.target.value)} aria-label="優先度" />
            <IconButton icon={showDone ? "Eye" : "EyeOff"} label={showDone ? "完了を隠す" : "完了を表示"} active={!showDone} onClick={() => setShowDone(!showDone)} />
          </SectionHeading>
          <div><Select size="sm" value={member} options={GG_MEMBERS} onChange={(e) => setMember(e.target.value)} aria-label="メンバー" /></div>
          <DataTable density="compact" columns={boardCols} rows={board} loading={loading} skeletonRows={4} minWidth={880} emptyNode={<EmptyState compact icon="Table2" title="条件に合うタスクはありません" />} />
        </section>

        {/* ⑤ カレンダー（teal 帯 → SectionHeading、右に表示切替） */}
        <section style={card}>
          <SectionHeading icon="Calendar" title="カレンダー" description={WEEKS[week].label}>
            <SegmentedControl aria-label="表示切替" options={[{ value: "week", label: "週" }, { value: "month", label: "月" }]} value={calView} onChange={setCalView} />
          </SectionHeading>
          {loading ? <Skeleton height={120} /> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {CAL_WEEK.map((c, i) => {
                const today = c.d === TODAY; const wk = c.dow === "土" || c.dow === "日";
                return (
                  <div key={c.d} style={{ minHeight: calView === "week" ? 132 : 96, padding: 8, borderLeft: i ? "1px solid var(--border)" : 0, background: today ? "var(--primary-subtle)" : "var(--card)", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, fontSize: 13, color: wk ? "var(--muted-foreground)" : "var(--foreground)", fontVariantNumeric: "tabular-nums" }}><span style={{ fontWeight: 600, fontSize: 14, color: today ? "var(--primary)" : "inherit" }}>9/{c.d}</span><span>{c.dow}</span>{today ? <Badge size="sm" value="info" label="今日" /> : null}</div>
                    {events.filter((e) => e.d === c.d).map(chip)}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ⑥ その他（slate 帯 → SectionHeading、右上 ＋ / カテゴリ管理） */}
        <section style={card}>
          <SectionHeading icon="ListChecks" title="その他" count={others.length}>
            <Button size="sm" variant="ghost" icon="FolderCog" onClick={() => setCatDialog(true)}>カテゴリ管理</Button>
            <IconButton icon="Plus" label="タスクを追加" onClick={() => { if (otherText.trim()) { setOthers((o) => [...o, { id: "o" + Date.now(), text: otherText.trim(), category: OTHER_CATEGORIES[2], status: "未着手", subtasks: [] }]); setOtherText(""); } }} />
          </SectionHeading>
          <Input size="sm" value={otherText} placeholder="タスクを入力（Enter で追加）" aria-label="その他のタスク" onChange={(e) => setOtherText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && otherText.trim()) { setOthers((o) => [...o, { id: "o" + Date.now(), text: otherText.trim(), category: OTHER_CATEGORIES[2], status: "未着手", subtasks: [] }]); setOtherText(""); } }} />
          {others.map((o) => (
            <div key={o.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto 120px 32px", gap: 8, alignItems: "center", minHeight: 40, borderTop: "1px solid var(--border)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, fontSize: 14 }}><Badge value="neutral" label={o.category} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.text}</span></span>
              <Button size="sm" variant="ghost" icon="Plus">サブタスク</Button>
              <Select size="sm" value={o.status} options={STATUS_OPTS} onChange={(e) => setOthers((os) => os.map((x) => (x.id === o.id ? { ...x, status: e.target.value } : x)))} width="100%" aria-label="ステータス" />
              <IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm({ title: "タスクを削除しますか？", description: `「${o.text}」が削除されます。この操作は取り消せません。`, onConfirm: () => { setOthers((os) => os.filter((x) => x.id !== o.id)); setConfirm(null); toast({ kind: "success", message: "削除しました" }); } })} />
            </div>
          ))}
        </section>

        {/* ⑦ コミットメント（amber⇄red 帯 → SectionHeading） */}
        <section style={card}>
          <SectionHeading icon="Target" title="コミットメント" description="今月">
            <Button size="sm" variant="ghost" icon="ArrowRight" onClick={() => onNavigate && onNavigate("commit")}>すべて見る</Button>
          </SectionHeading>
          {loading ? <Skeleton height={44} /> : MY_COMMITMENTS.slice(0, 2).map((c, i) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 220px auto", gap: 16, alignItems: "center", minHeight: 40, borderTop: i ? "1px solid var(--border)" : 0 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, fontSize: 14 }}><Badge value="neutral" label={c.type} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>{c.late ? <Badge value="late" label="遅れ" /> : null}</span>
              <Progress value={c.type === "毎日" && commitDone ? c.value + 1 : c.value} max={c.max} overdue={c.late} />
              {c.type === "毎日" ? <IconButton icon="Check" label={commitDone ? "今日の達成を取り消す" : "今日達成"} tone={commitDone ? "positive" : undefined} onClick={() => { setCommitDone(!commitDone); toast({ kind: "success", message: commitDone ? "取り消しました" : "今日の達成を記録しました" }); }} /> : <span style={{ width: 32 }} />}
            </div>
          ))}
        </section>

        {/* ⑧ チーム進捗（slate 帯 → SectionHeading、クリック開閉） */}
        <section style={{ ...card, padding: 0, gap: 0 }}>
          <button type="button" aria-expanded={teamOpen} onClick={() => setTeamOpen(!teamOpen)} style={{ display: "flex", alignItems: "center", width: "100%", padding: "12px 16px", border: 0, background: "transparent", cursor: "pointer", textAlign: "left", color: "inherit" }}>
            <SectionHeading icon="Users" title="チーム進捗" description={`${TEAM_PROGRESS.length} 名 · 今週`} style={{ flex: 1 }} />
            {teamOpen ? <L.ChevronUp size={18} color="var(--muted-foreground)" aria-hidden /> : <L.ChevronDown size={18} color="var(--muted-foreground)" aria-hidden />}
          </button>
          {teamOpen ? <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column" }}>
            {TEAM_PROGRESS.map((m) => (
              <div key={m.name} style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: 16, alignItems: "center", minHeight: 40, borderTop: "1px solid var(--border)" }}>
                <Badge kind="assignee" value={m.name} /><Progress value={m.done} max={m.total || 1} label={m.total ? undefined : "タスクなし"} />
              </div>
            ))}
          </div> : null}
        </section>
      </>)}

      <Dialog open={catDialog} size="sm" title="カテゴリ管理" description="「その他」のカテゴリ" onClose={() => setCatDialog(false)} confirmLabel="保存" onConfirm={() => { setCatDialog(false); toast({ kind: "success", message: "カテゴリを保存しました" }); }}>
        <div style={{ display: "grid", gap: 8 }}>
          {OTHER_CATEGORIES.map((c) => <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}><Input size="sm" defaultValue={c} aria-label="カテゴリ名" /><IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => toast({ kind: "info", message: "使用中のカテゴリは削除できません" })} /></div>)}
          <Button size="sm" variant="ghost" icon="Plus" style={{ justifySelf: "start" }}>カテゴリを追加</Button>
        </div>
      </Dialog>
      {confirm ? <ConfirmDialog title={confirm.title} description={confirm.description} confirmLabel={confirm.confirmLabel} destructive={confirm.destructive !== false} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { DashboardScreenV2 });
