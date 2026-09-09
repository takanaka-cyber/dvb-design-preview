import React, { useState } from "react";
import { CPN_ROWS, ADSET_ROWS, NAMES, PROJECTS } from "./data.js";

/** 案件別まとめ ＞ 1案件（/reports/projects）。ボードから開く詳細。KPI 4枚 / 今週のタスク / 検証CP結果 / 週次施策 / 担当者入力。 */
export function ProjectScreen({ state = "normal", toast, narrow }) {
  const { PageHeader, FilterBar, Select, Button, KpiCard, DataTable, MetricCell, Badge, EmptyState, SectionHeading, Field, Textarea, Input, SaveStatus, TaskRow } = window.DVB;
  const loading = state === "loading", error = state === "error", empty = state === "empty";
  const [owner, setOwner] = useState("白井");
  const [sort, setSort] = useState({ k: "spend", d: "desc" });
  const [save, setSave] = useState(error ? "error" : "saved");
  const [tasks, setTasks] = useState([{ id: 1, text: "CR 差し替え（型B → 型C）", assignee: "白井", due: "9/10", done: false }]);
  const [adding, setAdding] = useState(false);
  const onEdit = () => { if (error) return; setSave("saving"); clearTimeout(onEdit.t); onEdit.t = setTimeout(() => setSave("saved"), 900); };

  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
  const num = (k, u, dg) => ({ key: k, align: "right", sortable: true, render: (r) => <MetricCell value={r[k]} unit={u} digits={dg || 0} /> });
  const cpnCols = [
    { key: "name", label: "CPN名", sticky: true, width: 220, render: (r) => <span title={r.name} style={{ fontWeight: 500 }}>{r.name}</span> },
    { ...num("spend", "¥"), label: "消化" }, { ...num("imp"), label: "Imp" }, { ...num("click"), label: "Click" }, { ...num("mcv"), label: "MCV" }, { ...num("cv"), label: "CV" },
    { ...num("cpa", "¥"), label: "CPA" }, { ...num("cpc", "¥"), label: "CPC" }, { ...num("ctr", "%", 2), label: "CTR" }, { ...num("profit", "¥"), label: "粗利" }, { ...num("roas", "%", 1), label: "ROAS" },
    { key: "links", label: "", width: 200, render: () => <span style={{ display: "flex", gap: 10, fontSize: 13 }}><a href="#">CRを開く</a><a href="#">シートを開く</a><a href="#">プロマネを開く</a></span> },
  ];
  const adCols = [
    { key: "name", label: "広告セット名", sticky: true, width: 200 }, { key: "cpn", label: "CPN名", width: 220, render: (r) => <span style={{ color: "var(--muted-foreground)" }}>{r.cpn}</span> },
    { ...num("spend", "¥"), label: "消化" }, { ...num("imp"), label: "Imp" }, { ...num("click"), label: "Click" }, { ...num("result"), label: "結果" }, { ...num("cpr", "¥"), label: "結果単価" }, { ...num("cpc", "¥"), label: "CPC" }, { ...num("ctr", "%", 2), label: "CTR" }, { ...num("cpm", "¥"), label: "CPM" },
  ];
  const cpn = empty ? [] : [...CPN_ROWS].sort((a, b) => (sort.d === "desc" ? 1 : -1) * (b[sort.k] - a[sort.k]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <a href="#screen=board" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500, color: "var(--primary)", marginBottom: -8 }}>← ボード（全案件）へ戻る</a>
      <PageHeader icon="FolderKanban" title="A社 記事LP" description="案件別まとめ ＞ 1案件。実績・今週のタスク・検証CP・週次施策・担当者入力">
        <Button icon="ExternalLink">シートを開く</Button>
        <Button icon="ExternalLink">プロマネを開く</Button>
      </PageHeader>
      <FilterBar period="対象週 9/7〜9/13" right={<SaveStatus state={save} time="15:56" onRetry={() => { setSave("saving"); setTimeout(() => setSave("error"), 800); }} />}>
        <Select options={NAMES} value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="担当者" />
        <Select options={["A社 記事LP", ...PROJECTS.slice(1)]} defaultValue="A社 記事LP" aria-label="案件" />
      </FilterBar>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        <KpiCard label="対象週 商材粗利" value={empty ? "—" : "¥1,204,300"} delta={empty ? undefined : { value: 120400, prefix: "¥", digits: 0 }} note={empty ? "対象週の数値なし" : "先週 ¥1,083,900"} loading={loading} error={error} />
        <KpiCard label="対象週 ROAS" value={empty ? "—" : "311.7"} unit={empty ? undefined : "%"} delta={empty ? undefined : { value: 12.3, unit: "pt" }} note={empty ? "対象週の数値なし" : "先週 299.4%"} loading={loading} error={error} />
        <KpiCard label="対象週 消化" value={empty ? "—" : "¥8,090,909"} delta={empty ? undefined : { value: -38200, prefix: "¥", digits: 0 }} note={empty ? "対象週の数値なし" : "先週 ¥8,129,109"} loading={loading} error={error} />
        <KpiCard label="対象週 CV" value={empty ? "—" : "412"} delta={empty ? undefined : { value: 18, digits: 0 }} note={empty ? "対象週の数値なし" : "先週 394"} loading={loading} error={error} />
      </div>

      {/* 今週のタスク: 週の運用主役なので KPI 直下に独立セクション（担当者入力の末尾から移動） */}
      <section style={card}>
        <SectionHeading icon="ListChecks" title="今週のタスク" description="この案件で今週やること。ボードの行と同じデータ" count={tasks.length}>
          {!adding ? <Button size="sm" icon="Plus" onClick={() => setAdding(true)} disabled={loading}>追加</Button> : null}
        </SectionHeading>
        {tasks.length === 0 && !adding ? <EmptyState compact icon="ListChecks" title="今週のタスクはまだありません。" description="「追加」から1行ずつ入れられます。" /> : null}
        {tasks.map((t) => <TaskRow key={t.id} {...t} onToggle={() => { setTasks((ts) => ts.map((x) => x.id === t.id ? { ...x, done: !x.done } : x)); toast({ kind: "undo", message: t.done ? "未完了に戻しました" : "タスクを完了にしました", actionLabel: "元に戻す" }); }} onMenu={() => toast({ kind: "info", message: "メニュー: 編集 / 削除" })} />)}
        {adding ? <TaskRow mode="edit" projects={["A社 記事LP"]} project="A社 記事LP" assignees={NAMES} assignee={owner} onCancel={() => setAdding(false)} onSubmit={(fd) => { setTasks((ts) => [...ts, { id: Date.now(), text: fd.get("text"), assignee: fd.get("assignee"), due: fd.get("due") ? fd.get("due").slice(5).replace("-", "/") : undefined }]); setAdding(false); toast({ kind: "success", message: "タスクを追加しました" }); }} /> : null}
      </section>

      <section style={card}>
        <SectionHeading icon="FlaskConical" title="検証CP結果" count={empty ? 0 : cpn.length} description={`${owner} × ${empty ? 0 : cpn.length}CP`}>
          <div style={{ display: "flex", gap: 4 }} role="tablist">{NAMES.map((n) => <button key={n} role="tab" aria-selected={owner === n} type="button" onClick={() => setOwner(n)} style={{ height: 28, padding: "0 10px", borderRadius: 9999, fontSize: 13, fontWeight: 500, border: `1px solid ${owner === n ? "var(--primary)" : "var(--border)"}`, background: owner === n ? "var(--primary-subtle)" : "var(--card)", color: owner === n ? "var(--primary-subtle-foreground)" : "var(--foreground)", cursor: "pointer" }}>{n}</button>)}</div>
        </SectionHeading>
        <DataTable columns={cpnCols} rows={cpn} sortKey={sort.k} sortDir={sort.d} onSort={(k, d) => setSort({ k, d })} density="compact" loading={loading} error={error ? "AXAD の集計に接続できませんでした。" : undefined} onRetry={() => toast({ kind: "info", message: "再読み込みしています…" })} minWidth={1400} caption="検証CP結果" style={{ boxShadow: "none" }}
          emptyNode={<EmptyState compact icon="FlaskConical" title="紐付けCP（対象週の数値なし）" description="設定の CPN 名とスプレッドシートの表記が一致しているか確認してください。" action={<Button size="sm" icon="ExternalLink">設定を開く</Button>} />} />
      </section>

      <section style={card}>
        <SectionHeading icon="Layers" title="週次レポートでまとめた施策" count={empty ? 0 : 1} description="所有者別" />
        {loading ? <div style={{ display: "grid", gap: 8 }}>{[0, 1, 2].map((i) => <span key={i} style={{ height: 14, width: `${70 - i * 15}%`, background: "var(--muted)", borderRadius: 4 }} />)}</div>
          : empty ? <EmptyState compact icon="Layers" title="この週にまとめた施策はまだありません。" description="週次レポートで施策グループを作ると、ここに広告セット・広告の表が並びます。" />
          : error ? <div style={{ padding: "12px 0", fontSize: 13, color: "var(--negative)" }}>施策データを取得できませんでした。</div>
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>型C × 25-34F 検証</span>
                <Badge kind="assignee" value="白井" />
                <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>類似1%が結果単価で優位。来週は予算を 1.5 倍に。</span>
              </div>
              <DataTable columns={adCols} rows={ADSET_ROWS} density="compact" minWidth={1300} caption="広告セット表" style={{ boxShadow: "none" }} />
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>広告表（「CRを表示」でクリエイティブ）と画像ギャラリーは同じ compact テーブルで続く。</div>
            </div>
          )}
      </section>

      <section style={card}>
        <SectionHeading icon="PenLine" title="担当者入力" description="担当者 × 週 × 案件で1件。自動保存" />
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "repeat(3, minmax(0,1fr))", gap: 12 }}>
          <Field label="うまく行ってること: 媒体／運用" htmlFor="sm"><Textarea id="sm" rows={3} onChange={onEdit} disabled={loading} defaultValue={empty || loading ? "" : "類似1% の CPA が先週比 −12%。"} placeholder="媒体・運用面でうまく行っていること" /></Field>
          <Field label="うまく行ってること: 型／見出し／SC" htmlFor="sc"><Textarea id="sc" rows={3} onChange={onEdit} disabled={loading} placeholder="型・見出し・SC でうまく行っていること" /></Field>
          <Field label="うまく行ってること: 記事／LP" htmlFor="sa"><Textarea id="sa" rows={3} onChange={onEdit} disabled={loading} placeholder="記事・LP でうまく行っていること" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "minmax(0,2fr) 160px minmax(0,3fr)", gap: 12, alignItems: "start" }}>
          <Field label="備考データ（外的要因・補足情報）" htmlFor="notes"><Textarea id="notes" rows={3} onChange={onEdit} disabled={loading} placeholder="外的要因・補足情報" /></Field>
          <Field label="担当者所感 ランク" htmlFor="rank"><Select id="rank" options={["S", "A", "B", "C", "停止"]} defaultValue={empty ? "" : "S"} placeholder="未設定" onChange={onEdit} disabled={loading} width="100%" /></Field>
          <Field label="担当者所感 自由記入" htmlFor="cm"><Textarea id="cm" rows={3} onChange={onEdit} disabled={loading} placeholder="所感" /></Field>
        </div>
      </section>
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.ProjectScreen = ProjectScreen;
