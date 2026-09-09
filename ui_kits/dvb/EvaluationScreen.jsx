import React, { useState, useRef } from "react";
import { EVAL_QUARTERS, EVAL_MONTHS, EVAL_STATUS, EVAL_INFO, EVAL_COMPANY_GOALS, EVAL_SCALE, EVAL_RESULT_GOALS, EVAL_BEHAVIOR_GOALS, GRADE_TABLE } from "./data.js";

/* バッチ 2: 目標（評価シート）/evaluation。骨格・ボタン位置は現状維持（Q タブ → 情報バー → 全社/部門目標 → 成果目標 → 行動目標 → 評価サマリー → アクションバー右寄せ → 等級表）。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };
const SCORE = { S: 5, A: 4, B: 3, C: 2, D: 1 };
const scoreToGrade = (n) => (n >= 4.5 ? "S" : n >= 3.5 ? "A" : n >= 2.5 ? "B" : n >= 1.5 ? "C" : "D");

export function EvaluationScreen({ state = "normal", toast, mobile, narrow }) {
  const { PageHeader, SectionHeading, Button, DataTable, Badge, Select, Input, Textarea, Tabs, SaveStatus, ConfirmDialog, EmptyState, Skeleton } = window.DVB;
  const { ErrorBand } = window.DVBKit;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [q, setQ] = useState(EVAL_INFO.quarter);
  const [year, setYear] = useState(EVAL_INFO.year);
  const [status, setStatus] = useState(EVAL_INFO.status);
  const [grade, setGrade] = useState(EVAL_INFO.grade);
  const [weight, setWeight] = useState(String(EVAL_INFO.weight));
  const [results, setResults] = useState(EVAL_RESULT_GOALS);
  const [behaviors, setBehaviors] = useState(EVAL_BEHAVIOR_GOALS);
  const [save, setSave] = useState("saved");
  const [confirm, setConfirm] = useState(null);
  const timer = useRef(null);
  const touch = () => { setSave("saving"); clearTimeout(timer.current); timer.current = setTimeout(() => setSave("saved"), 800); };
  const updR = (id, k, v) => { setResults((rs) => rs.map((r) => (r.id === id ? { ...r, [k]: v } : r))); touch(); };
  const updB = (id, k, v) => { setBehaviors((b) => ({ ...b, [grade]: b[grade].map((r) => (r.id === id ? { ...r, [k]: v } : r)) })); touch(); };
  const L = window.LucideReact;
  const [stLabel, stTone] = EVAL_STATUS[status];
  const readOnly = mobile || status === "fixed";

  const resultSelf = results.reduce((n, r) => n + (SCORE[r.self] || 0) * r.weight, 0) / results.reduce((n, r) => n + r.weight, 0);
  const bList = behaviors[grade] || [];
  const behaviorSelf = bList.length ? bList.reduce((n, r) => n + (SCORE[r.self] || 0), 0) / bList.length : 0;
  const summaryRows = [
    { id: "result", item: "成果目標", self: results.every((r) => r.self) ? scoreToGrade(resultSelf) : "", first: "", final: "" },
    { id: "behavior", item: "行動目標", self: bList.every((r) => r.self) ? scoreToGrade(behaviorSelf) : "", first: "", final: "" },
    { id: "total", item: "総合", self: results.every((r) => r.self) && bList.every((r) => r.self) ? scoreToGrade(resultSelf * 0.7 + behaviorSelf * 0.3) : "", first: "", final: "" },
  ];
  const cell = (v) => (v ? <span style={{ fontWeight: 600 }}>{v}</span> : <span style={{ color: "var(--muted-foreground)" }}>未入力</span>);
  const summaryCols = [
    { key: "item", label: "項目", render: (r) => <span style={{ fontWeight: 500 }}>{r.item}</span> },
    { key: "self", label: "自己評価", width: 140, render: (r) => cell(r.self) },
    { key: "first", label: "一次評価", width: 140, render: (r) => cell(r.first) },
    { key: "final", label: "最終評価", width: 140, render: (r) => cell(r.final) },
  ];
  const gradeCols = [
    { key: "grade", label: "等級", width: 80, render: (r) => <span style={{ fontWeight: 600, color: r.grade === grade ? "var(--primary)" : "inherit" }}>{r.grade}</span> },
    { key: "role", label: "役割", width: 260 },
    { key: "expect", label: "期待される成果" },
  ];
  const pending = <div style={{ minHeight: 36, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border)", ...muted }}>未入力</div>;
  const yearNav = (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
      <Button size="sm" variant="ghost" icon="ChevronLeft" aria-label="前年度" onClick={() => setYear(year - 1)} />
      <span style={{ fontSize: 14, fontWeight: 500, fontVariantNumeric: "tabular-nums", minWidth: 72, textAlign: "center" }}>{year}年度</span>
      <Button size="sm" variant="ghost" icon="ChevronRight" aria-label="次年度" onClick={() => setYear(year + 1)} disabled={year >= 2026} />
    </div>
  );
  const tabsRow = (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, borderBottom: mobile ? 0 : undefined }}>
      <Tabs aria-label="四半期" items={EVAL_QUARTERS.map((k) => ({ value: k, label: `${k}（${EVAL_MONTHS[k][0]}〜${EVAL_MONTHS[k][2]}）` }))} value={q} onChange={setQ} style={{ flex: 1, minWidth: 0 }} />
      {mobile ? null : <div style={{ paddingBottom: 4 }}>{yearNav}</div>}
    </div>
  );
  const infoBar = (
    <div style={{ ...card, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: mobile ? "8px 16px" : "8px 24px", padding: "10px 16px", fontSize: 13, lineHeight: "20px" }}>
      {[["氏名", EVAL_INFO.name], ["ステータス", <Badge value={stTone} label={stLabel} />], ["四半期", `${year}年度 ${q}`], ["部門", EVAL_INFO.dept], ["等級", grade], ["評価者", EVAL_INFO.evaluator]].map(([k, v]) => (
        <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}><span style={{ color: "var(--muted-foreground)" }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span></span>
      ))}
      {readOnly ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ color: "var(--muted-foreground)" }}>ウェイト</span><span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{weight}%</span></span>
        : <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6 }}><label htmlFor="ev-weight" style={{ color: "var(--muted-foreground)" }}>ウェイト</label><Input id="ev-weight" size="sm" numeric value={weight} onChange={(e) => { setWeight(e.target.value); touch(); }} style={{ width: 72 }} aria-label="ウェイト" /><span>%</span></span>}
    </div>
  );

  const body = loading ? (
    <>
      <div style={{ ...card, flexDirection: "row", gap: 24, padding: "12px 16px" }}>{[120, 80, 100, 80, 60, 160].map((w, i) => <Skeleton key={i} height={16} width={w} />)}</div>
      {[0, 1, 2].map((i) => <section key={i} style={card}><Skeleton height={20} width={140} /><Skeleton height={64} /><Skeleton height={64} width="80%" /></section>)}
    </>
  ) : error ? <ErrorBand message="評価シートを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} />
  : empty ? <EmptyState icon="ClipboardCheck" title={`${year}年度 ${q} の評価シートはまだ作成されていません`} description="目標設定（管理）で四半期目標が公開されると、ここに自分のシートが作られます。" action={<Button variant="primary" icon="Plus" onClick={() => toast({ kind: "success", message: "評価シートを作成しました" })}>シートを作成</Button>} />
  : (
    <>
      {infoBar}
      {/* ④ 全社 / 部門目標 */}
      <section style={card}>
        <SectionHeading icon="Building2" title="全社 / 部門目標" description={`${year}年度`} />
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(2, minmax(0,1fr))", gap: 12 }}>
          {[["全社", EVAL_COMPANY_GOALS.company], ["部門", EVAL_COMPANY_GOALS.dept]].map(([k, v]) => <div key={k} style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--muted)", fontSize: 14, lineHeight: "22px" }}><div style={{ ...muted, marginBottom: 2 }}>{k}</div>{v}</div>)}
        </div>
      </section>
      {/* ⑤ 成果目標 */}
      <section style={card}>
        <SectionHeading icon="Target" title="成果目標" count={results.length} description="ウェイト合計 100%" />
        {results.map((r, i) => (
          <div key={r.id} style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: i ? 12 : 0, borderTop: i ? "1px solid var(--border)" : 0 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span aria-hidden style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 600, flexShrink: 0, marginTop: readOnly ? 0 : 6 }}>{i + 1}</span>
              {readOnly ? <div style={{ flex: 1, fontSize: 14, lineHeight: "22px", fontWeight: 500 }}>{r.title}</div> : <Textarea aria-label={`成果目標 ${i + 1}`} rows={2} value={r.title} onChange={(e) => updR(r.id, "title", e.target.value)} style={{ flex: 1 }} />}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, fontSize: 13 }}>
                <span style={{ color: "var(--muted-foreground)" }}>ウェイト</span>
                {readOnly ? <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{r.weight}%</span> : <><Input size="sm" numeric value={String(r.weight)} onChange={(e) => updR(r.id, "weight", Number(e.target.value) || 0)} style={{ width: 64 }} aria-label="ウェイト" /><span>%</span></>}
              </span>
            </div>
            <div style={{ ...muted, paddingLeft: mobile ? 0 : 36 }}>達成基準: {r.criteria}</div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, minmax(0,1fr))", gap: 12, paddingLeft: mobile ? 0 : 36 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={muted}>自己評価</div>
                {readOnly ? <div style={{ fontSize: 14, lineHeight: "22px" }}><span style={{ fontWeight: 600, marginRight: 8 }}>{r.self || "未入力"}</span>{r.selfNote}</div> : (<>
                  <Select size="sm" value={r.self} placeholder="評価を選ぶ" options={EVAL_SCALE} onChange={(e) => updR(r.id, "self", e.target.value)} width={120} aria-label="自己評価" />
                  <Textarea aria-label="自己評価コメント" rows={2} value={r.selfNote} placeholder="根拠となる数値・事実" onChange={(e) => updR(r.id, "selfNote", e.target.value)} />
                </>)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><div style={muted}>一次評価</div>{pending}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><div style={muted}>最終評価</div>{pending}</div>
            </div>
          </div>
        ))}
      </section>
      {/* ⑥ 行動目標（見出し右に 等級 select） */}
      <section style={card}>
        <SectionHeading icon="Footprints" title="行動目標" count={bList.length} description="等級ごとの行動基準">
          {readOnly ? <Badge value="neutral" label={grade} /> : <Select size="sm" value={grade} options={Object.keys(EVAL_BEHAVIOR_GOALS)} onChange={(e) => { setGrade(e.target.value); touch(); }} width={96} aria-label="等級" />}
        </SectionHeading>
        {mobile ? null : <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 140px 140px", gap: 12, ...muted, paddingBottom: 4, borderBottom: "1px solid var(--border)" }}><span>行動基準</span><span>自己評価</span><span>一次評価</span></div>}
        {bList.map((b) => (
          <div key={b.id} style={{ display: "grid", gridTemplateColumns: mobile ? "minmax(0,1fr) auto" : "minmax(0,1fr) 140px 140px", gap: 12, alignItems: "center", minHeight: 40 }}>
            <span style={{ fontSize: 14, lineHeight: "22px" }}>{b.title}</span>
            {readOnly ? <span style={{ fontWeight: 600, fontSize: 14 }}>{b.self || "未入力"}</span> : <Select size="sm" value={b.self} placeholder="—" options={EVAL_SCALE} onChange={(e) => updB(b.id, "self", e.target.value)} width="100%" aria-label="自己評価" />}
            {mobile ? null : <span style={muted}>未入力</span>}
          </div>
        ))}
      </section>
      {mobile ? null : (<>
        {/* ⑦ 評価サマリー（生 table → DataTable） */}
        <section style={card}>
          <SectionHeading icon="Table2" title="評価サマリー" description="成果 70% + 行動 30%" />
          <DataTable density="compact" columns={summaryCols} rows={summaryRows} stickyHeader={false} caption="評価サマリー" />
        </section>
        {/* ⑧ アクションバー justify-end。順序と位置は現状どおり、色だけ primary / secondary / ghost destructive */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
          <Button variant="primary" icon="Send" disabled={status !== "self" && status !== "returned"} onClick={() => setConfirm({ title: "自己評価を提出しますか？", description: "提出後は一次評価者が確認します。提出後の修正は「差し戻し」が必要です。", confirmLabel: "提出", onConfirm: () => { setStatus("first"); setConfirm(null); toast({ kind: "success", message: "自己評価を提出しました" }); } })}>{status === "returned" ? "自己評価を再提出" : "自己評価を提出"}</Button>
          <Button variant="secondary" icon="Send" disabled={status !== "first"} onClick={() => { setStatus("final"); toast({ kind: "success", message: "一次評価を提出しました" }); }}>一次評価を提出</Button>
          <Button variant="secondary" icon="Send" disabled={status !== "final"}>最終評価を提出</Button>
          <Button variant="secondary" icon="Undo2" disabled={status !== "first" && status !== "final"} onClick={() => { setStatus("returned"); toast({ kind: "info", message: "自己評価に差し戻しました" }); }}>差し戻し</Button>
          <Button variant="primary" icon="CheckCircle2" disabled={status !== "final"} onClick={() => { setStatus("fixed"); toast({ kind: "success", message: "評価を確定しました" }); }}>確定</Button>
          <Button variant="ghost" icon="RotateCcw" disabled={status === "draft"} style={{ color: "var(--negative)" }} onClick={() => setConfirm({ title: "DRAFT に戻しますか？", description: "提出済みの評価はすべて取り消され、自己評価からやり直しになります。この操作は取り消せません。", confirmLabel: "DRAFT に戻す", destructive: true, onConfirm: () => { setStatus("draft"); setConfirm(null); toast({ kind: "success", message: "DRAFT に戻しました" }); } })}>DRAFT に戻す</Button>
        </div>
        {/* ⑨ 等級表 */}
        <section style={card}>
          <SectionHeading icon="Layers" title="等級表" description="行動目標は等級に対応" />
          <DataTable density="compact" columns={gradeCols} rows={GRADE_TABLE} stickyHeader={false} caption="等級表" />
        </section>
      </>)}
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="ClipboardCheck" title="目標" description={mobile ? `${year}年度 評価シート（閲覧）` : "四半期の評価シート。入力は自動保存"}>
        {mobile || loading || empty || error ? null : <SaveStatus state={save} time="15:56" />}
      </PageHeader>
      {tabsRow}
      {body}
      {confirm ? <ConfirmDialog title={confirm.title} description={confirm.description} confirmLabel={confirm.confirmLabel} destructive={!!confirm.destructive} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { EvaluationScreen });
