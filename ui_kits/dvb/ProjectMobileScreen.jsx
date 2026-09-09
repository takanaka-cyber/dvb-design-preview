import React, { useState } from "react";
import { BOARD_ROWS, CPN_ROWS, WEEKS } from "./data.js";

const yen = (n) => n == null ? "—" : `¥${Math.round(n).toLocaleString("ja-JP")}`;

/** 案件別まとめ スマホ（393、閲覧のみ）。ボード（案件リスト）→ 1 案件。タスクのチェックだけ操作可。 */
export function ProjectMobileScreen({ state = "normal", toast }) {
  const { PageHeader, KpiCard, MetricCell, Badge, EmptyState, SectionHeading, WeekSelector, SaveStatus } = window.DVB;
  const L = window.LucideReact; const Chev = L.ChevronRight, Check = L.Check, Monitor = L.Monitor;
  const empty = state === "empty";
  const [week, setWeek] = useState(1);
  const [open, setOpen] = useState(null);
  const [rows, setRows] = useState(BOARD_ROWS);
  const list = empty ? [] : rows.filter((r) => r.profit != null);
  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" };
  const cur = open != null ? rows.find((r) => r.id === open) : null;
  const toggle = (rid, tid) => { setRows((rs) => rs.map((r) => r.id !== rid ? r : { ...r, tasks: r.tasks.map((t) => t.id !== tid ? t : { ...t, done: !t.done }) })); toast({ kind: "undo", message: "タスクを完了にしました", actionLabel: "元に戻す" }); };

  if (cur) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <PageHeader icon="FolderKanban" title={cur.name} style={{ alignItems: "center" }}>
          <button type="button" onClick={() => setOpen(null)} style={{ display: "inline-flex", alignItems: "center", gap: 2, height: 44, padding: "0 8px", border: 0, background: "transparent", color: "var(--primary)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}><L.ChevronLeft size={16} />一覧</button>
        </PageHeader>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Badge kind="rank" value={cur.rank} /><Badge kind="assignee" value={cur.owner} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
          <KpiCard label="商材粗利" value={yen(cur.profit)} delta={{ value: cur.dp, prefix: "¥", digits: 0 }} note="前週比" />
          <KpiCard label="ROAS" value={cur.roas.toFixed(1)} unit="%" delta={{ value: cur.dr, unit: "pt" }} note="前週比" />
          <KpiCard label="消化" value={yen(cur.spend)} delta={{ value: cur.ds, prefix: "¥", digits: 0 }} note="前週比" />
          <KpiCard label="CV" value={cur.cv} delta={{ value: cur.dc, digits: 0 }} note="前週比" />
        </div>
        <section style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <SectionHeading level={3} icon="ListChecks" title="今週のタスク" count={cur.tasks.length} />
          {cur.tasks.length === 0 ? <EmptyState compact icon="ListChecks" title="今週のタスクはまだありません。" description="追加は PC の案件別まとめから。" /> : cur.tasks.map((t) => (
            <label key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 44, cursor: "pointer" }}>
              <button type="button" role="checkbox" aria-checked={t.done} onClick={() => toggle(cur.id, t.id)} aria-label={t.done ? "未完了に戻す" : "完了にする"} style={{ width: 24, height: 24, borderRadius: 6, border: `1.5px solid ${t.done ? "var(--primary)" : "var(--muted-foreground)"}`, background: t.done ? "var(--primary)" : "var(--card)", color: "#fff", display: "grid", placeItems: "center", padding: 0, cursor: "pointer", flexShrink: 0 }}>{t.done ? <Check size={14} strokeWidth={3} /> : null}</button>
              <span style={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: "20px", color: t.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
              {t.due ? <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", color: t.overdue && !t.done ? "var(--negative)" : "var(--muted-foreground)", whiteSpace: "nowrap" }}>{t.due}{t.overdue && !t.done ? " 超過" : ""}</span> : null}
            </label>
          ))}
        </section>
        <section style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <SectionHeading level={3} icon="FlaskConical" title="検証CP" count={CPN_ROWS.length} />
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 88px 64px", gap: "0 8px", fontSize: 12, color: "var(--muted-foreground)", padding: "0 0 6px", borderBottom: "1px solid var(--border)" }}><span>CPN名</span><span style={{ textAlign: "right" }}>粗利</span><span style={{ textAlign: "right" }}>ROAS</span></div>
          {CPN_ROWS.map((c) => (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 88px 64px", gap: "0 8px", alignItems: "center", minHeight: 40, borderBottom: "1px solid var(--border)" }}>
              <span title={c.name} style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
              <MetricCell value={c.profit} unit="¥" /><MetricCell value={c.roas} unit="%" digits={1} />
            </div>
          ))}
        </section>
        <section style={{ ...card, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <SectionHeading level={3} icon="PenLine" title="担当者入力"><span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted-foreground)" }}><Monitor size={14} />PCで入力</span></SectionHeading>
          <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>うまく行ってること: 媒体／運用</div><div style={{ fontSize: 14, lineHeight: "22px", padding: "10px 12px", background: "var(--muted)", borderRadius: "var(--radius)" }}>類似1% の CPA が先週比 −12%。</div></div>
          <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>担当者所感</div><div style={{ fontSize: 14, lineHeight: "22px", padding: "10px 12px", background: "var(--muted)", borderRadius: "var(--radius)", color: "var(--muted-foreground)" }}>未記入</div></div>
        </section>
      </div>
    );
  }

  const profit = list.reduce((s, r) => s + r.profit, 0), dp = list.reduce((s, r) => s + r.dp, 0), spend = list.reduce((s, r) => s + r.spend, 0), cv = list.reduce((s, r) => s + r.cv, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <PageHeader icon="FolderKanban" title="案件別まとめ" style={{ alignItems: "center" }}><SaveStatus state="idle" /></PageHeader>
      <WeekSelector compact weeks={WEEKS} index={week} onChange={setWeek} />
      <div style={{ display: "grid", gap: 12 }}>
        <KpiCard label="商材粗利（担当案件合計）" value={empty ? "—" : yen(profit)} delta={empty ? undefined : { value: dp, prefix: "¥", digits: 0 }} note={empty ? "案件なし" : "前週比"} />
        <KpiCard label="消化" value={empty ? "—" : yen(spend)} note={empty ? "案件なし" : `${list.length} 案件`} />
        <KpiCard label="CV" value={empty ? "—" : cv.toLocaleString("ja-JP")} note={empty ? "案件なし" : "前週比は案件ごとに"} />
      </div>
      <section style={{ ...card, display: "flex", flexDirection: "column" }} aria-label="案件リスト">
        {list.length === 0 ? <EmptyState compact icon="FolderKanban" title="担当案件がありません。" description="設定の担当者名を確認してください（PC）。" /> : list.map((r, i) => (
          <button key={r.id} type="button" onClick={() => setOpen(r.id)} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto 16px", alignItems: "center", gap: 12, minHeight: 56, padding: "8px 12px 8px 16px", border: 0, borderTop: i ? "1px solid var(--border)" : 0, background: "transparent", textAlign: "left", cursor: "pointer", color: "var(--foreground)", fontFamily: "inherit" }}>
            <span style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}><Badge kind="rank" value={r.rank} /><span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span></span>
            <MetricCell value={r.profit} delta={r.dp} unit="¥" />
            <Chev size={16} color="var(--muted-foreground)" />
          </button>
        ))}
      </section>
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.ProjectMobileScreen = ProjectMobileScreen;
