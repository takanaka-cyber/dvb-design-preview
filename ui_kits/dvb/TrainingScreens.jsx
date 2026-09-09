import React, { useState } from "react";
import { TRAINEE, TRAINING_NAV, TRAINING_STEPS, TRAINING_ITEMS, TRAINING_CHECKLIST, TRAINING_VALUES, CR_TARGET, QA_HISTORY, TRAINING_FEEDBACK } from "./data.js";

/* バッチ 3: 研修 /onboarding/*（全面再設計・位置ルールの対象外）。サイドバー 248 ｜ SubNav 200 ｜ 本文 max-w-4xl。
   このファイル: シェル + ホーム / スケジュール / 学習リスト / チェックリスト / 理解度チェック。残りは TrainingScreens2.jsx */
export const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
export const muted = { fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" };
export const KIND_BADGE = { lecture: { label: "講義", value: "info" }, assignment: { label: "課題", value: "neutral" } };
/** lucide を安全に描く（名前が無ければ何も出さない） */
export function Ic({ name, size = 16, color, style }) { const I = window.LucideReact[name]; return I ? <I size={size} strokeWidth={1.75} aria-hidden color={color} style={style} /> : null; }

/** 研修の進捗（SubNav の右端と ホームの Progress カードで共用） */
export function trainingStats(empty) {
  if (empty) return { steps: [0, TRAINING_STEPS.length], items: [0, TRAINING_ITEMS.length], checks: [0, TRAINING_CHECKLIST.reduce((n, c) => n + c.items.length, 0)], cr: [0, CR_TARGET.total], fbUnread: 0, qaUnanswered: 0, valueFb: false };
  const checks = TRAINING_CHECKLIST.flatMap((c) => c.items);
  return {
    steps: [TRAINING_STEPS.filter((s) => s.status === "done").length, TRAINING_STEPS.length],
    items: [TRAINING_ITEMS.filter((i) => i.read).length, TRAINING_ITEMS.length],
    checks: [checks.filter((c) => c.done).length, checks.length],
    cr: [CR_TARGET.done, CR_TARGET.total],
    fbUnread: TRAINING_FEEDBACK.filter((f) => f.unread).length,
    qaUnanswered: QA_HISTORY.flatMap((g) => g.items).filter((q) => q.unanswered).length,
    valueFb: TRAINING_VALUES.some((v) => v.fb),
  };
}
/** SubNav のグループに進捗・ドットを埋める */
export function navGroups(empty) {
  const s = trainingStats(empty);
  const extra = { "training-schedule": { progress: `${s.steps[0]}/${s.steps[1]}` }, "training-learning": { progress: `${s.items[0]}/${s.items[1]}` }, "training-checklist": { progress: `${s.checks[0]}/${s.checks[1]}` },
    "training-values": { dot: s.valueFb ? "info" : false }, "training-cr": { dot: s.fbUnread ? "info" : false }, "training-qa": { dot: s.qaUnanswered ? "warning" : false } };
  return TRAINING_NAV.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, ...(extra[it.key] || {}) })) }));
}

/** 研修シェル: PC は SubNav 200 + 本文 max-w-4xl（896）。スマホ / 1024 未満は上部の横スクロール Tabs */
export function TrainingShell({ page, onNavigate, mobile, empty, children }) {
  const { SubNav } = window.DVB;
  const groups = navGroups(empty);
  const go = (k) => onNavigate && onNavigate(k);
  if (mobile) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <SubNav compact groups={groups} activeKey={page} onSelect={go} style={{ margin: "-16px -16px 0", paddingLeft: 4, flexShrink: 0 }} />
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 12, paddingTop: 12 }}>{children}</div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <SubNav groups={groups} activeKey={page} onSelect={go} style={{ position: "sticky", top: 64 }} />
      <div style={{ flex: 1, minWidth: 0, maxWidth: 896, display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}

/** Progress カード（KpiCard 型: ラベル / 主値 / バー） */
function ProgressCard({ label, value, max, icon, onClick, mobile }) {
  const { Progress } = window.DVB;
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} aria-label={`${label} ${value}/${max}`}
      style={{ ...card, gap: 8, padding: mobile ? "12px 14px" : "14px 16px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "inherit", background: h ? "var(--muted)" : "var(--card)", transition: "background var(--duration) var(--ease)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, ...muted, fontWeight: 500 }}><Ic name={icon} size={14} />{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, fontVariantNumeric: "tabular-nums" }}><span style={{ fontSize: 24, lineHeight: "32px", fontWeight: 600, letterSpacing: "-0.01em" }}>{value}</span><span style={muted}>/ {max}</span></div>
      <Progress value={value} max={max} showLabel={false} />
    </button>
  );
}

/** ホームの 1 行（FB / Q&A）。dot = 未読 */
function Row({ dot, label, text, at, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: "flex", alignItems: "flex-start", gap: 10, width: "100%", minHeight: 44, padding: "8px 8px", border: 0, borderRadius: "var(--radius-sm)", background: h ? "var(--muted)" : "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit" }}>
      <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: dot ? "var(--info)" : "transparent" }} />
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: dot ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
        {text ? <span style={{ ...muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span> : null}
      </span>
      {at ? <span style={{ ...muted, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{at}</span> : null}
    </button>
  );
}

/* ================= ホーム（新設） ================= */
export function TrainingHomeScreen({ state = "normal", toast, mobile, onNavigate }) {
  const { PageHeader, SectionHeading, Button, Badge, EmptyState } = window.DVB;
  const empty = state === "empty";
  const s = trainingStats(empty);
  const go = (k) => onNavigate && onNavigate(k);
  const current = TRAINING_STEPS.find((x) => x.status === "current");
  const recentQa = QA_HISTORY.flatMap((g) => g.items.map((q) => ({ ...q, date: g.date }))).slice(0, 3);
  const [read, setRead] = useState({});
  const desc = empty ? `${TRAINEE.label} · 開始 ${TRAINEE.startLabel} · 1 日目` : `${TRAINEE.label} · 開始 ${TRAINEE.startLabel} · ${TRAINEE.day} 日目`;
  return (
    <TrainingShell page="training-home" onNavigate={onNavigate} mobile={mobile} empty={empty}>
      <PageHeader icon="GraduationCap" title="研修" description={desc} style={mobile ? { alignItems: "center" } : undefined} />
      {/* 上段 3 列: Progress カード */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, minmax(0,1fr))", gap: mobile ? 8 : 12 }}>
        <ProgressCard mobile={mobile} icon="BookOpen" label="学習リスト" value={s.items[0]} max={s.items[1]} onClick={() => go("training-learning")} />
        <ProgressCard mobile={mobile} icon="ListChecks" label="チェックリスト" value={s.checks[0]} max={s.checks[1]} onClick={() => go("training-checklist")} />
        <ProgressCard mobile={mobile} icon="Image" label="CRアウトプット" value={s.cr[0]} max={s.cr[1]} onClick={() => go("training-cr")} />
      </div>
      {/* 次にやること */}
      {empty ? (
        <section style={{ ...card, padding: 0 }}><EmptyState icon="CalendarDays" title="まずスケジュールを確認しましょう" description="研修の Step が Day 1 から並んでいます。今日の Step から始めてください。" action={<Button variant="primary" icon="CalendarDays" onClick={() => go("training-schedule")}>スケジュールへ</Button>} /></section>
      ) : (
        <section style={{ ...card, borderColor: "var(--primary)", boxShadow: "0 0 0 1px var(--primary), var(--shadow-card)" }}>
          <SectionHeading icon="Play" title="次にやること"><Badge value="info" label="今ここ" /></SectionHeading>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, ...muted }}><span style={{ fontVariantNumeric: "tabular-nums" }}>Day {current.day} · {current.date}</span><span>·</span><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Ic name="Clock" size={13} />約 {current.minutes} 分</span></div>
              <div style={{ fontSize: mobile ? 18 : 20, lineHeight: "28px", fontWeight: 600, letterSpacing: "-0.01em" }}>{current.title}</div>
              <div style={{ fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>{current.note}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                <Button size="sm" variant="ghost" icon="BookOpen" onClick={() => go("training-learning")}>講義 {current.lectures} 本 / 課題 {current.assignments} 本</Button>
                {current.quiz ? <Button size="sm" variant="ghost" icon="CircleHelp" onClick={() => go("training-quiz")}>理解度チェック</Button> : null}
              </div>
            </div>
            <Button variant="primary" icon="Play" block={mobile} onClick={() => go("training-schedule")} style={{ flexShrink: 0 }}>始める</Button>
          </div>
        </section>
      )}
      {/* 下段 2 列: 上長からのフィードバック / 最近の Q&A */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, minmax(0,1fr))", gap: mobile ? 12 : 16 }}>
        <section style={{ ...card, gap: 4 }}>
          <SectionHeading icon="MessageSquareText" title="上長からのフィードバック" count={empty ? 0 : s.fbUnread - Object.keys(read).length} description={empty ? undefined : "未読"} style={{ marginBottom: 4 }} />
          {empty ? <EmptyState compact icon="MessageSquareText" title="フィードバックはまだありません" description="まとめや振り返りを提出すると上長から届きます" /> :
            TRAINING_FEEDBACK.map((f) => <Row key={f.id} dot={f.unread && !read[f.id]} label={f.label} text={f.text} at={f.at.split(" ")[0]} onClick={() => { setRead({ ...read, [f.id]: true }); go(f.screen); }} />)}
        </section>
        <section style={{ ...card, gap: 4 }}>
          <SectionHeading icon="MessageSquare" title="最近の Q&A" style={{ marginBottom: 4 }}><Button size="sm" variant="ghost" icon="ArrowRight" onClick={() => go("training-qa")}>Q&A を開く</Button></SectionHeading>
          {empty ? <EmptyState compact icon="MessageSquare" title="まだ質問がありません" description="わからない用語や画面の場所は Q&A で聞けます" action={<Button size="sm" variant="secondary" onClick={() => go("training-qa")}>質問する</Button>} /> :
            recentQa.map((q) => <Row key={q.id} dot={q.unanswered} label={q.q} text={q.unanswered ? "回答待ち" : undefined} at={q.date.replace("今日 ", "")} onClick={() => go("training-qa")} />)}
        </section>
      </div>
    </TrainingShell>
  );
}

/* ================= スケジュール（縦タイムライン） ================= */
export function TrainingScheduleScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, Button, Badge, Progress, EmptyState } = window.DVB;
  const empty = state === "empty";
  const go = (k) => onNavigate && onNavigate(k);
  const [steps, setSteps] = useState(TRAINING_STEPS);
  const done = steps.filter((x) => x.status === "done").length;
  const complete = (id) => { setSteps((ss) => { const i = ss.findIndex((x) => x.id === id); return ss.map((x, j) => (j === i ? { ...x, status: "done" } : j === i + 1 && x.status === "future" ? { ...x, status: "current" } : x)); }); toast({ kind: "success", message: "Step を完了にしました" }); };
  return (
    <TrainingShell page="training-schedule" onNavigate={onNavigate} empty={empty}>
      <PageHeader icon="CalendarDays" title="スケジュール" description="Day 1 から順に進めます。今の Step は青枠" />
      {empty ? <EmptyState icon="CalendarDays" title="スケジュールはまだ作成されていません" description="上長が研修スケジュールを登録すると、ここに Day 1 から表示されます。" action={<Button variant="secondary" icon="MessageSquare" onClick={() => go("training-qa")}>Q&A で聞く</Button>} /> : (<>
        <Progress value={done} max={steps.length} />
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((st, i) => {
            const isDone = st.status === "done", cur = st.status === "current", fut = st.status === "future";
            return (
              <li key={st.id} style={{ display: "grid", gridTemplateColumns: "96px 24px minmax(0,1fr)", gap: "0 12px", alignItems: "stretch" }}>
                {/* 日付軸 */}
                <div style={{ paddingTop: 14, textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                  <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: fut ? "var(--muted-foreground)" : "var(--foreground)" }}>Day {st.day}</span>
                  <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{st.date}</span>
                </div>
                {/* 線とマーカー */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  <span aria-hidden style={{ position: "absolute", top: i === 0 ? 24 : 0, bottom: i === steps.length - 1 ? "auto" : 0, height: i === steps.length - 1 ? 24 : undefined, width: 2, background: "var(--border)" }} />
                  <span aria-hidden style={{ position: "relative", marginTop: 16, width: 20, height: 20, borderRadius: "50%", display: "grid", placeItems: "center", background: isDone ? "var(--positive)" : cur ? "var(--primary)" : "var(--card)", border: `2px solid ${isDone ? "var(--positive)" : cur ? "var(--primary)" : "var(--border)"}`, color: "#fff" }}>{isDone ? <Ic name="Check" size={12} color="#fff" /> : null}</span>
                </div>
                {/* Step カード */}
                <div style={{ ...card, marginBottom: 12, gap: 8, opacity: fut ? 0.8 : 1, borderColor: cur ? "var(--primary)" : "var(--border)", boxShadow: cur ? "0 0 0 1px var(--primary), var(--shadow-card)" : "var(--shadow-card)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, color: fut ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: "none" }}>{st.title}</span>
                        {cur ? <Badge value="info" label="今ここ" /> : isDone ? <Badge value="done" label="完了" /> : null}
                      </div>
                      <div style={{ fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>{st.note}</div>
                    </div>
                    <span style={{ ...muted, display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}><Ic name="Clock" size={13} />約 {st.minutes} 分</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    {(st.lectures || st.assignments) ? <Button size="sm" variant="ghost" icon="BookOpen" onClick={() => go("training-learning")}>講義 {st.lectures} 本 / 課題 {st.assignments} 本</Button> : null}
                    {st.quiz ? <Button size="sm" variant="ghost" icon="CircleHelp" onClick={() => go("training-quiz")}>理解度チェック</Button> : null}
                    {st.external ? <Button size="sm" variant="secondary" icon="ExternalLink" onClick={() => toast({ kind: "info", message: `${st.external.label}（別タブ）` })}>{st.external.label}</Button> : null}
                    {cur ? <Button size="sm" variant="primary" icon="Check" style={{ marginLeft: "auto" }} onClick={() => complete(st.id)}>完了にする</Button> : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </>)}
    </TrainingShell>
  );
}

/* ================= 学習リスト（講義 + 課題を統合、4 状態） ================= */
const FILTERS = ["すべて", "未読", "まとめ未提出", "FB あり"];
export function TrainingLearningScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, SectionHeading, Button, Badge, Input, Textarea, Checkbox, SegmentedControl, SaveStatus, DraftRestoreBanner, EmptyState, Skeleton } = window.DVB;
  const { ErrorBand } = window.DVBKit;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [items, setItems] = useState(empty || loading || error ? [] : TRAINING_ITEMS);
  const [filter, setFilter] = useState("すべて");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(error ? null : "l3");
  const [draft, setDraft] = useState(state === "normal");
  const [save, setSave] = useState({});
  const [hover, setHover] = useState(null);
  const upd = (id, patch) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const onSummary = (id, v) => { upd(id, { summary: v }); setSave((s) => ({ ...s, [id]: "saving" })); clearTimeout(onSummary[id]); onSummary[id] = setTimeout(() => setSave((s) => ({ ...s, [id]: "saved" })), 900); };
  const visible = items.filter((x) => (filter === "未読" ? !x.read : filter === "まとめ未提出" ? !x.summary : filter === "FB あり" ? !!x.fb : true)).filter((x) => !q || x.title.includes(q) || x.category.includes(q));
  const cats = [...new Set(items.map((x) => x.category))];
  const read = items.filter((x) => x.read).length;
  return (
    <TrainingShell page="training-learning" onNavigate={onNavigate} empty={empty}>
      <PageHeader icon="BookOpen" title="学習リスト" description={`講義と課題をまとめて。読了 ${read}/${items.length}`} />
      {draft && !empty ? <DraftRestoreBanner time="9/8 22:40" onRestore={() => { upd("l5", { summary: "型B は悩み提示から、型C は結果提示から。CR と LP の見出し順を揃える。（復元した下書き）" }); setOpen("l5"); setDraft(false); toast({ kind: "success", message: "下書きを復元しました" }); }} onDiscard={() => setDraft(false)} /> : null}
      {error ? <ErrorBand message="学習リストを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}
      {/* 上部: SegmentedControl + 検索 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <SegmentedControl aria-label="絞り込み" options={FILTERS} value={filter} onChange={setFilter} />
        <Input size="sm" icon="Search" placeholder="タイトルで検索" aria-label="検索" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 240, marginLeft: "auto" }} />
      </div>
      {loading ? (
        <section style={{ ...card, gap: 0, padding: 0 }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, height: 56, padding: "0 16px", borderBottom: i < 4 ? "1px solid var(--border)" : 0 }}><Skeleton width={18} height={18} /><Skeleton width={`${40 + (i % 3) * 12}%`} height={14} /><span style={{ marginLeft: "auto" }} /><Skeleton width={56} height={28} /><Skeleton width={56} height={28} /></div>)}</section>
      ) : empty && !error ? (
        <EmptyState icon="BookOpen" title="学習リストはまだありません" description="上長が講義と課題を登録すると表示されます。先にスケジュールを確認してください。" action={<Button variant="secondary" icon="CalendarDays" onClick={() => onNavigate && onNavigate("training-schedule")}>スケジュールへ</Button>} />
      ) : !error && visible.length === 0 ? (
        <EmptyState icon="Search" title="条件に合う項目がありません" description="絞り込みか検索語を変えてください。" action={<Button variant="secondary" onClick={() => { setFilter("すべて"); setQ(""); }}>条件をリセット</Button>} />
      ) : !error ? cats.map((c) => {
        const list = visible.filter((x) => x.category === c); if (!list.length) return null;
        return (
          <section key={c} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <SectionHeading level={3} icon="Folder" title={c} count={`${list.filter((x) => x.read).length}/${list.length}`} />
            <div style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
              {list.map((it, i) => {
                const on = open === it.id; const k = KIND_BADGE[it.kind];
                return (
                  <div key={it.id} style={{ borderBottom: i < list.length - 1 ? "1px solid var(--border)" : 0, position: "relative" }}>
                    {it.fb ? <span aria-label="上長 FB あり" style={{ position: "absolute", left: 6, top: 24, width: 8, height: 8, borderRadius: "50%", background: "var(--info)" }} /> : null}
                    <div role="button" tabIndex={0} aria-expanded={on} onClick={() => setOpen(on ? null : it.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(on ? null : it.id); } }} onMouseEnter={() => setHover(it.id)} onMouseLeave={() => setHover(null)}
                      style={{ display: "flex", alignItems: "center", gap: 12, height: 56, padding: "0 12px 0 20px", cursor: "pointer", background: on ? "var(--primary-subtle)" : hover === it.id ? "var(--muted)" : "transparent", transition: "background var(--duration) var(--ease)" }}>
                      <span onClick={(e) => e.stopPropagation()}><Checkbox checked={it.read} onChange={(v) => { upd(it.id, { read: v }); toast({ kind: "success", message: v ? "読了にしました" : "未読に戻しました" }); }} /></span>
                      <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: it.read ? "var(--muted-foreground)" : "var(--foreground)" }}>{it.title}</span>
                        <Badge value={k.value} label={k.label} size="sm" />
                        <span style={{ ...muted, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{it.minutes} 分</span>
                      </span>
                      <span style={{ display: "inline-flex", gap: 6, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                        {it.hasDoc ? <Button size="sm" variant="secondary" icon="FileText" onClick={() => toast({ kind: "info", message: "資料を開きます（別タブ）" })}>資料</Button> : null}
                        {it.hasVideo ? <Button size="sm" variant="secondary" icon="Video" onClick={() => toast({ kind: "info", message: "動画を開きます（別タブ）" })}>動画</Button> : null}
                        <Button size="sm" variant="ghost" icon={it.summary ? "PenLine" : "Plus"} onClick={() => setOpen(on ? null : it.id)}>{it.summary ? "まとめを見る" : "まとめを書く"}</Button>
                      </span>
                    </div>
                    {on ? (
                      <div style={{ padding: "12px 16px 16px 44px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--border)", background: "var(--card)" }}>
                        <Textarea rows={4} value={it.summary} placeholder={it.kind === "assignment" ? "課題の回答・提出物の URL を書いてください" : "学んだことを 3 行でまとめてください"} aria-label="まとめ" onChange={(e) => onSummary(it.id, e.target.value)} />
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                          <SaveStatus state={save[it.id] || (it.summary ? "saved" : "idle")} />
                          <Button variant="primary" icon="Send" disabled={!it.summary.trim()} onClick={() => { setSave((s) => ({ ...s, [it.id]: "saved" })); toast({ kind: "success", message: "まとめを提出しました。上長に通知されます" }); }}>保存</Button>
                        </div>
                        {it.fb ? (
                          <div style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, lineHeight: "18px", fontWeight: 600 }}><Ic name="MessageSquareText" size={14} />{it.fb.by}からのフィードバック<span style={{ fontWeight: 400, fontVariantNumeric: "tabular-nums", marginLeft: "auto" }}>{it.fb.at}</span></div>
                            <div style={{ fontSize: 14, lineHeight: "20px" }}>{it.fb.text}</div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        );
      }) : null}
    </TrainingShell>
  );
}

/* ================= チェックリスト ================= */
export function TrainingChecklistScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, SectionHeading, Progress, Switch, Checkbox, EmptyState, Button } = window.DVB;
  const { IconButton } = window.DVBKit;
  const empty = state === "empty";
  const [cats, setCats] = useState(empty ? [] : TRAINING_CHECKLIST);
  const [onlyTodo, setOnlyTodo] = useState(false);
  const all = cats.flatMap((c) => c.items); const done = all.filter((x) => x.done).length;
  const toggle = (cid, id, v) => setCats((cs) => cs.map((c) => (c.category !== cid ? c : { ...c, items: c.items.map((x) => (x.id === id ? { ...x, done: v } : x)) })));
  return (
    <TrainingShell page="training-checklist" onNavigate={onNavigate} empty={empty}>
      <PageHeader icon="ListChecks" title="チェックリスト" description="研修中にやること。完了したらチェック" />
      {empty ? <EmptyState icon="ListChecks" title="チェックリストはまだありません" description="上長が項目を登録すると表示されます。" action={<Button variant="secondary" icon="CalendarDays" onClick={() => onNavigate && onNavigate("training-schedule")}>スケジュールへ</Button>} /> : (<>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Progress value={done} max={all.length} style={{ flex: 1 }} />
          <Switch label="未完了だけ表示" checked={onlyTodo} onChange={setOnlyTodo} />
        </div>
        {done === all.length ? <div role="status" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--positive-subtle)", color: "var(--positive-subtle-foreground)", fontSize: 14, lineHeight: "20px" }}><Ic name="CircleCheck" size={16} color="var(--positive)" />すべて完了しました。上長に通知されます。</div> : null}
        {cats.map((c) => {
          const list = onlyTodo ? c.items.filter((x) => !x.done) : c.items; if (!list.length) return null;
          return (
            <section key={c.category} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <SectionHeading level={3} title={c.category} count={`${c.items.filter((x) => x.done).length}/${c.items.length}`} />
              <div style={{ ...card, padding: "4px 8px", gap: 0 }}>
                {list.map((x) => (
                  <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 4px" }}>
                    <Checkbox id={x.id} checked={x.done} onChange={(v) => { toggle(c.category, x.id, v); if (v) toast({ kind: "success", message: "完了にしました" }); }} />
                    <label htmlFor={x.id} style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: "20px", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: x.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: x.done ? "line-through" : "none" }}>{x.label}</label>
                    {x.link ? <IconButton icon="ExternalLink" label="関連画面を開く" onClick={() => onNavigate && onNavigate(x.link)} /> : null}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </>)}
    </TrainingShell>
  );
}

/* ================= 理解度チェック（静的・通常のみ） ================= */
export function TrainingQuizScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, Button } = window.DVB;
  return (
    <TrainingShell page="training-quiz" onNavigate={onNavigate}>
      <PageHeader icon="CircleHelp" title="理解度チェック" description="Step ごとの確認テスト（Google フォーム）。所要 10 分">
        <Button variant="secondary" icon="ExternalLink" onClick={() => toast({ kind: "info", message: "別タブで開きます" })}>別タブで開く</Button>
      </PageHeader>
      <div style={{ display: "flex", alignItems: "center", gap: 8, ...muted }}><Ic name="Info" size={14} />スケジュールの「記事 LP の構成と検証の考え方」（Day 5）の Step からも開けます。</div>
      <div style={{ ...card, padding: 0, height: 720, overflow: "hidden" }}>
        <iframe title="理解度チェック" src="about:blank" style={{ width: "100%", height: "100%", border: 0, display: "block", background: "var(--muted)" }} />
        <div aria-hidden style={{ position: "relative", marginTop: -720, height: 720, display: "grid", placeItems: "center", pointerEvents: "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "var(--muted-foreground)", fontSize: 14 }}><Ic name="CircleHelp" size={32} /><span>理解度チェック（Google フォーム）がここに表示されます</span><span style={muted}>iframe · 高さ 720 · border のみ</span></div>
        </div>
      </div>
    </TrainingShell>
  );
}

window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { TrainingShell, TrainingHomeScreen, TrainingScheduleScreen, TrainingLearningScreen, TrainingChecklistScreen, TrainingQuizScreen, trainingStats, navGroups, Ic });
