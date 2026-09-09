import React, { useState } from "react";
import { PROJECTS, GG_MEMBERS, SHOOT_EVENTS } from "./data.js";

/* バッチ 2: 撮影スケジュール /shooting-schedule。ツールバー（左 ◀ 今日 ▶ + 月、右 凡例 → 月/週/日 → 新規作成）→ カレンダー → 予定 Dialog。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column" };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };
const DOW = ["日", "月", "火", "水", "木", "金", "土"];
const TODAY = 9; // 2026-09-09（火）。data.js の暦: 9/1 = 月
const FIRST_DOW = 1; // 9/1 の曜日 index（月）
const DAYS = 30;
const CHIP = { shoot: { bg: "var(--primary-subtle)", fg: "var(--primary-subtle-foreground)", bar: "var(--primary)", label: "撮影" }, deadline: { bg: "var(--warning-subtle)", fg: "var(--warning-subtle-foreground)", bar: "var(--warning)", label: "締切" } };
const blank = (d) => ({ id: null, d, time: "10:00", title: "", kind: "shoot", project: "", owner: "", memo: "" });

export function ShootingScheduleScreen({ state = "normal", toast }) {
  const { PageHeader, Button, Badge, Select, Input, Textarea, Field, SegmentedControl, Dialog, ConfirmDialog, Skeleton } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [events, setEvents] = useState(empty || loading || error ? [] : SHOOT_EVENTS);
  const [unit, setUnit] = useState("month");
  const [month, setMonth] = useState(9);
  const [day, setDay] = useState(TODAY);
  const [hoverCell, setHoverCell] = useState(null);
  const [dlg, setDlg] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const byDay = (d) => (month === 9 ? events.filter((e) => e.d === d).sort((a, b) => (a.time || "").localeCompare(b.time || "")) : []);
  const save = () => { setSaving(true); setTimeout(() => { setSaving(false); if (dlg.id) { setEvents((es) => es.map((e) => (e.id === dlg.id ? dlg : e))); toast({ kind: "success", message: "予定を更新しました" }); } else { setEvents((es) => [...es, { ...dlg, id: "s" + Date.now() }]); toast({ kind: "success", message: "予定を作成しました" }); } setDlg(null); }, 700); };
  const chip = (e) => { const c = CHIP[e.kind]; return (
    <button key={e.id} type="button" onClick={(ev) => { ev.stopPropagation(); setDlg({ ...e }); }} title={e.title} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", height: 24, padding: "0 6px", border: 0, borderLeft: `2px solid ${c.bar}`, borderRadius: "var(--radius-sm)", background: c.bg, color: c.fg, fontSize: 12, fontWeight: 500, textAlign: "left", cursor: "pointer", overflow: "hidden" }}>
      {e.time ? <span style={{ fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{e.time}</span> : null}<span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</span>
    </button>
  ); };

  const cells = Array.from({ length: Math.ceil((FIRST_DOW + DAYS) / 7) * 7 }, (_, i) => i - FIRST_DOW + 1);
  const cell = (d, tall) => {
    const inMonth = d >= 1 && d <= DAYS; const dow = ((d - 1 + FIRST_DOW) % 7 + 7) % 7; const today = inMonth && d === TODAY && month === 9;
    return (
      <div key={d} role={inMonth ? "gridcell" : undefined} aria-label={inMonth ? `9/${d}` : undefined} onMouseEnter={() => setHoverCell(d)} onMouseLeave={() => setHoverCell(null)} onClick={() => inMonth && setDlg(blank(d))}
        style={{ minHeight: tall ? 360 : 108, padding: 6, borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: today ? "var(--primary-subtle)" : inMonth ? "var(--card)" : "var(--background)", display: "flex", flexDirection: "column", gap: 4, cursor: inMonth ? "pointer" : "default", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 24 }}>
          <span style={{ fontSize: 13, fontWeight: today ? 700 : 500, fontVariantNumeric: "tabular-nums", color: !inMonth ? "var(--disabled-foreground)" : today ? "var(--primary)" : dow === 0 || dow === 6 ? "var(--muted-foreground)" : "var(--foreground)", display: "inline-grid", placeItems: "center", minWidth: 24, height: 24, borderRadius: 9999, background: today ? "var(--card)" : "transparent" }}>{inMonth ? d : ""}</span>
          {inMonth && hoverCell === d ? <IconButton icon="Plus" label={`9/${d} に予定を追加`} onClick={(e) => { e && e.stopPropagation && e.stopPropagation(); setDlg(blank(d)); }} /> : null}
        </div>
        {inMonth ? byDay(d).map(chip) : null}
      </div>
    );
  };
  const weekStart = day - (((day - 1 + FIRST_DOW) % 7 + 7) % 7);
  const grid = (days, tall) => (
    <div role="grid" style={{ ...card, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
        {DOW.map((w, i) => <div key={w} style={{ ...muted, height: 32, display: "grid", placeItems: "center", fontWeight: 500, color: i === 0 || i === 6 ? "var(--disabled-foreground)" : "var(--muted-foreground)", borderRight: i < 6 ? "1px solid var(--border)" : 0 }}>{w}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", borderLeft: "1px solid var(--border)", marginRight: -1, marginBottom: -1 }}>{days.map((d) => cell(d, tall))}</div>
    </div>
  );
  const dayView = () => {
    const list = byDay(day);
    return (
      <div style={{ ...card, padding: 16, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>9/{day}（{DOW[((day - 1 + FIRST_DOW) % 7 + 7) % 7]}）</span>{day === TODAY ? <Badge value="info" label="今日" /> : null}<span style={{ marginLeft: "auto" }}><Button size="sm" variant="ghost" icon="Plus" onClick={() => setDlg(blank(day))}>この日に追加</Button></span></div>
        {list.length === 0 ? <div style={{ ...muted, padding: "16px 0" }}>予定はありません。</div> : list.map((e) => (
          <button key={e.id} type="button" onClick={() => setDlg({ ...e })} style={{ display: "grid", gridTemplateColumns: "72px 1fr auto", alignItems: "center", gap: 12, minHeight: 48, padding: "0 12px", border: "1px solid var(--border)", borderLeft: `3px solid ${CHIP[e.kind].bar}`, borderRadius: "var(--radius)", background: "var(--card)", textAlign: "left", cursor: "pointer", color: "var(--foreground)" }}>
            <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{e.time || "終日"}</span>
            <span style={{ minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 500 }}>{e.title}</div>{e.project ? <div style={muted}>{e.project}{e.owner ? ` · ${e.owner}` : ""}{e.memo ? ` · ${e.memo}` : ""}</div> : null}</span>
            <Badge value={e.kind === "shoot" ? "info" : "todo"} label={CHIP[e.kind].label} />
          </button>
        ))}
      </div>
    );
  };
  const step = (dir) => { if (unit === "month") setMonth((m) => m + dir); else if (unit === "week") setDay((d) => Math.min(DAYS, Math.max(1, d + 7 * dir))); else setDay((d) => Math.min(DAYS, Math.max(1, d + dir))); };
  const title = unit === "month" ? `2026年${month}月` : unit === "week" ? `2026年9月 ${Math.max(1, weekStart)}日〜${Math.min(DAYS, weekStart + 6)}日` : `2026年9月${day}日（${DOW[((day - 1 + FIRST_DOW) % 7 + 7) % 7]}）`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="Camera" title="撮影スケジュール" description="撮影と納品締切の予定。Google カレンダーと同期" />
      {/* ② ツールバー */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <IconButton icon="ChevronLeft" label="前へ" onClick={() => step(-1)} />
        <Button size="sm" variant="secondary" onClick={() => { setMonth(9); setDay(TODAY); }}>今日</Button>
        <IconButton icon="ChevronRight" label="次へ" onClick={() => step(1)} />
        <h2 style={{ margin: "0 8px", fontSize: 18, lineHeight: "28px", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{title}</h2>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8 }} role="list" aria-label="凡例">
          <Badge value="info" label="撮影" /><Badge value="todo" label="締切" />
        </span>
        <SegmentedControl aria-label="表示単位" options={[{ value: "month", label: "月" }, { value: "week", label: "週" }, { value: "day", label: "日" }]} value={unit} onChange={setUnit} />
        <Button variant="primary" icon="Plus" onClick={() => setDlg(blank(TODAY))}>新規作成</Button>
      </div>
      {error ? <ErrorBand message="予定を取得できませんでした。Google カレンダーに接続できません" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}
      {empty && !loading ? <div style={{ ...muted, display: "flex", alignItems: "center", gap: 6 }}><L.Info size={14} aria-hidden />予定はありません。日付の＋で追加できます。</div> : null}
      {/* ③ カレンダー */}
      {loading ? (
        <div style={{ ...card, padding: 12, display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 8 }}>{Array.from({ length: 35 }, (_, i) => <Skeleton key={i} height={96} />)}</div>
      ) : unit === "month" ? grid(cells, false) : unit === "week" ? grid(Array.from({ length: 7 }, (_, i) => weekStart + i), true) : dayView()}

      {/* ④ 予定 Dialog（§2 Dialog。フッタは現状と同じ 左 削除 + Google カレンダー ／ 右 キャンセル + 作成/更新） */}
      {dlg ? (
        <Dialog open size="md" title={dlg.id ? "予定を編集" : "予定を作成"} description={`2026年9月${dlg.d}日（${DOW[((dlg.d - 1 + FIRST_DOW) % 7 + 7) % 7]}）`} onClose={() => setDlg(null)} hideFooter>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="タイトル" htmlFor="ev-t" required><Input id="ev-t" value={dlg.title} placeholder="例: C社 縦型 15 秒 撮影" onChange={(e) => setDlg({ ...dlg, title: e.target.value })} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="種別" htmlFor="ev-k"><Select id="ev-k" value={dlg.kind} options={[{ value: "shoot", label: "撮影" }, { value: "deadline", label: "締切" }]} onChange={(e) => setDlg({ ...dlg, kind: e.target.value })} width="100%" /></Field>
              <Field label="案件" htmlFor="ev-p"><Select id="ev-p" value={dlg.project} placeholder="案件を選ぶ" options={PROJECTS} onChange={(e) => setDlg({ ...dlg, project: e.target.value })} width="100%" /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="日付" htmlFor="ev-d"><Input id="ev-d" type="date" value={`2026-09-${String(dlg.d).padStart(2, "0")}`} onChange={(e) => setDlg({ ...dlg, d: Number(e.target.value.slice(8, 10)) || dlg.d })} /></Field>
              <Field label="時刻" htmlFor="ev-h" help="締切は空でも可"><Input id="ev-h" type="time" value={dlg.time} onChange={(e) => setDlg({ ...dlg, time: e.target.value })} /></Field>
              <Field label="担当" htmlFor="ev-o"><Select id="ev-o" value={dlg.owner} placeholder="—" options={GG_MEMBERS} onChange={(e) => setDlg({ ...dlg, owner: e.target.value })} width="100%" /></Field>
            </div>
            <Field label="メモ" htmlFor="ev-m"><Textarea id="ev-m" rows={2} value={dlg.memo} placeholder="場所・本数・持ち物" onChange={(e) => setDlg({ ...dlg, memo: e.target.value })} /></Field>
          </div>
          <footer style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px -20px -20px", padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
            {dlg.id ? <Button variant="destructive" icon="Trash2" onClick={() => setConfirm(dlg)}>削除</Button> : null}
            <Button variant="secondary" icon="ExternalLink" onClick={() => toast({ kind: "info", message: "Google カレンダーで開きます" })}>Google カレンダー</Button>
            <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8 }}>
              <Button variant="secondary" onClick={() => setDlg(null)}>キャンセル</Button>
              <Button variant="primary" icon={dlg.id ? "Save" : "Plus"} loading={saving} disabled={!dlg.title.trim()} onClick={save}>{dlg.id ? "更新" : "作成"}</Button>
            </span>
          </footer>
        </Dialog>
      ) : null}
      {confirm ? <ConfirmDialog title="予定を削除しますか？" description={`「${confirm.title}」（9/${confirm.d}）を削除します。Google カレンダー側の予定も削除されます。`} onConfirm={() => { setEvents((es) => es.filter((e) => e.id !== confirm.id)); setConfirm(null); setDlg(null); toast({ kind: "success", message: "予定を削除しました" }); }} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { ShootingScheduleScreen });
