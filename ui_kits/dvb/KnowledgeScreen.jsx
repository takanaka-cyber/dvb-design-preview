import React, { useState } from "react";
import { PROJECTS, GG_MEMBERS, KNOWLEDGE_FILTERS, KNOWLEDGE_RESULTS, CPN_ROWS, ADSET_ROWS, AD_ROWS } from "./data.js";

/* バッチ 2: 検証ナレッジ DB /reports/knowledge。読み取り専用。フィルタ 1 行 → 件数 → 結果カード（左 4px 媒体色、展開で 3 表）。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", display: "flex", flexDirection: "column" };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };
const yen = (n) => (n == null ? "—" : `¥${Math.round(n).toLocaleString("ja-JP")}`);
const num = (n) => (n == null ? "—" : Math.round(n).toLocaleString("ja-JP"));
const pct = (n, d = 2) => (n == null ? "—" : `${n.toFixed(d)}%`);
const MEDIA_BAR = { FB: "var(--media-fb-foreground)", TikTok: "var(--media-tiktok-foreground)", Google: "var(--media-google-foreground)", "その他": "var(--media-other-foreground)" };
const sum = (rows, k) => rows.reduce((n, r) => n + (r[k] || 0), 0);

export function KnowledgeScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, DataTable, Badge, Select, Input, FilterBar, EmptyState, Skeleton } = window.DVB;
  const { ErrorBand } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [searched, setSearched] = useState(true);
  const [word, setWord] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sort, setSort] = useState({ k: "spend", d: "desc" });
  const results = empty || loading || error ? [] : KNOWLEDGE_RESULTS;

  const cpnTotal = { id: "total", name: "合計", spend: sum(CPN_ROWS, "spend"), imp: sum(CPN_ROWS, "imp"), click: sum(CPN_ROWS, "click"), mcv: sum(CPN_ROWS, "mcv"), cv: sum(CPN_ROWS, "cv"), profit: sum(CPN_ROWS, "profit") };
  cpnTotal.cpa = cpnTotal.spend / cpnTotal.cv; cpnTotal.cpc = cpnTotal.spend / cpnTotal.click; cpnTotal.ctr = (cpnTotal.click / cpnTotal.imp) * 100; cpnTotal.roas = ((cpnTotal.spend + cpnTotal.profit) / cpnTotal.spend) * 100; cpnTotal.cvr = (cpnTotal.cv / cpnTotal.click) * 100;
  const bold = (r, v) => <span style={{ fontWeight: r.id === "total" ? 600 : 400 }}>{v}</span>;
  const cpnCols = [
    { key: "name", label: "CPN 名", sticky: true, width: 240, render: (r) => <span style={{ fontWeight: r.id === "total" ? 600 : 500 }}>{r.name}</span> },
    { key: "spend", label: "消化", align: "right", width: 110, render: (r) => bold(r, yen(r.spend)) },
    { key: "imp", label: "imp", align: "right", width: 100, render: (r) => bold(r, num(r.imp)) },
    { key: "click", label: "クリック", align: "right", width: 90, render: (r) => bold(r, num(r.click)) },
    { key: "ctr", label: "CTR", align: "right", width: 80, render: (r) => bold(r, pct(r.ctr)) },
    { key: "cpc", label: "CPC", align: "right", width: 80, render: (r) => bold(r, yen(r.cpc)) },
    { key: "mcv", label: "mCV", align: "right", width: 80, render: (r) => bold(r, num(r.mcv)) },
    { key: "cv", label: "CV", align: "right", width: 70, render: (r) => bold(r, num(r.cv)) },
    { key: "cvr", label: "CVR", align: "right", width: 80, render: (r) => bold(r, pct(r.cvr ?? (r.cv / r.click) * 100)) },
    { key: "cpa", label: "CPA", align: "right", width: 100, render: (r) => bold(r, yen(r.cpa)) },
    { key: "profit", label: "利益", align: "right", width: 110, render: (r) => bold(r, <span style={{ color: r.profit < 0 ? "var(--negative)" : "inherit" }}>{yen(r.profit)}</span>) },
    { key: "roas", label: "ROAS", align: "right", width: 90, render: (r) => bold(r, pct(r.roas, 1)) },
  ];
  const adsetCols = [
    { key: "name", label: "広告セット", sticky: true, width: 200, render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: "cpn", label: "CPN", width: 200, render: (r) => <span style={{ color: "var(--muted-foreground)" }}>{r.cpn}</span> },
    { key: "spend", label: "消化", align: "right", width: 110, sortable: true, render: (r) => yen(r.spend) },
    { key: "imp", label: "imp", align: "right", width: 100, sortable: true, render: (r) => num(r.imp) },
    { key: "click", label: "クリック", align: "right", width: 90, sortable: true, render: (r) => num(r.click) },
    { key: "result", label: "結果", align: "right", width: 70, sortable: true, render: (r) => num(r.result) },
    { key: "cpr", label: "結果単価", align: "right", width: 100, sortable: true, render: (r) => yen(r.cpr) },
    { key: "cpc", label: "CPC", align: "right", width: 80, sortable: true, render: (r) => yen(r.cpc) },
    { key: "ctr", label: "CTR", align: "right", width: 80, sortable: true, render: (r) => pct(r.ctr) },
  ];
  const adCols = [
    { key: "name", label: "広告", sticky: true, width: 200, render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: "adset", label: "広告セット", width: 180, render: (r) => <span style={{ color: "var(--muted-foreground)" }}>{r.adset}</span> },
    { key: "spend", label: "消化", align: "right", width: 110, render: (r) => yen(r.spend) },
    { key: "imp", label: "imp", align: "right", width: 100, render: (r) => num(r.imp) },
    { key: "click", label: "クリック", align: "right", width: 90, render: (r) => num(r.click) },
    { key: "result", label: "結果", align: "right", width: 70, render: (r) => num(r.result) },
    { key: "cpr", label: "結果単価", align: "right", width: 100, render: (r) => yen(r.cpr) },
    { key: "ctr", label: "CTR", align: "right", width: 80, render: (r) => pct(r.ctr) },
    { key: "cpc", label: "CPC", align: "right", width: 80, render: (r) => yen(r.cpc) },
  ];
  const adsetSorted = ADSET_ROWS.slice().sort((a, b) => (sort.d === "desc" ? 1 : -1) * ((b[sort.k] ?? 0) - (a[sort.k] ?? 0)));
  const reset = () => { setWord(""); setSearched(false); toast({ kind: "info", message: "検索条件をリセットしました" }); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ① h1（右側なし） */}
      <PageHeader icon="Search" title="検証ナレッジDB" description="過去の検証 CP を案件・媒体・担当で探す。読み取り専用" />

      {/* ② フィルタバー 1 行（Select 4 / 日付 2 / フリーワード / 検索 / リセット） */}
      <FilterBar>
        <Select size="sm" options={["全案件", ...PROJECTS]} defaultValue="全案件" aria-label="案件" width={160} />
        <Select size="sm" options={["全媒体", ...KNOWLEDGE_FILTERS.media]} defaultValue="全媒体" aria-label="媒体" width={110} />
        <Select size="sm" options={["全担当", ...GG_MEMBERS]} defaultValue="全担当" aria-label="担当" width={110} />
        <Select size="sm" options={["全部", ...KNOWLEDGE_FILTERS.dept]} defaultValue="全部" aria-label="部" width={110} />
        <Input size="sm" type="date" defaultValue="2026-07-01" aria-label="開始日" style={{ width: 150 }} />
        <span style={muted}>〜</span>
        <Input size="sm" type="date" defaultValue="2026-09-09" aria-label="終了日" style={{ width: 150 }} />
        <Input size="sm" icon="Search" value={word} placeholder="フリーワード（CPN 名・仮説）" aria-label="フリーワード" onChange={(e) => setWord(e.target.value)} style={{ width: 240 }} />
        <Button size="sm" variant="primary" icon="Search" loading={loading} onClick={() => { setSearched(true); toast({ kind: "info", message: "検索しました" }); }}>検索</Button>
        {searched ? <Button size="sm" variant="ghost" icon="RotateCcw" onClick={reset}>リセット</Button> : null}
      </FilterBar>

      {error ? <ErrorBand message="検証データを取得できませんでした" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}

      {/* ③ 件数行 */}
      {loading ? <Skeleton height={16} width={200} /> : !error ? <div style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>{results.length} 件の検証 · 2026/07/01〜2026/09/09</div> : null}

      {/* ④ 結果カード列 */}
      {loading ? [0, 1, 2].map((i) => <div key={i} style={{ ...card, padding: 16, gap: 8, borderLeft: "4px solid var(--border)" }}><Skeleton height={18} width="50%" /><Skeleton height={14} width="30%" /></div>)
        : !error && results.length === 0 ? <EmptyState icon="Search" title="該当する検証が見つかりません" description="期間を広げるか、案件・媒体の条件を外してみてください。" action={<Button variant="primary" icon="RotateCcw" onClick={reset}>条件をリセット</Button>} />
        : results.map((k) => {
          const open = expanded === k.id; const Chev = open ? L.ChevronDown : L.ChevronRight;
          return (
            <article key={k.id} style={{ ...card, borderLeft: `4px solid ${MEDIA_BAR[k.media] || MEDIA_BAR["その他"]}`, overflow: "hidden" }}>
              <button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : k.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 56, padding: "10px 16px", border: 0, background: open ? "var(--primary-subtle)" : "transparent", cursor: "pointer", textAlign: "left", color: "var(--foreground)" }}>
                <Chev size={16} color="var(--muted-foreground)" aria-hidden />
                <span style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap" }}>{k.project}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.title}</span>
                <Badge kind="media" value={k.media} />
                <Badge kind="assignee" value={k.owner} />
                <span style={{ ...muted, whiteSpace: "nowrap" }}>{k.dept}</span>
                <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{k.period}</span>
              </button>
              {open ? (
                <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
                    <div style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--muted)", fontSize: 14, lineHeight: "22px" }}><div style={muted}>仮説</div>{k.hypothesis}</div>
                    <div style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--muted)", fontSize: 14, lineHeight: "22px" }}><div style={muted}>結果</div>{k.result}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <SectionHeading level={3} icon="Megaphone" title="CPN" count={CPN_ROWS.length} description="合計行つき" />
                    <DataTable density="compact" columns={cpnCols} rows={[...CPN_ROWS, cpnTotal]} selectedKey="total" minWidth={1240} maxHeight={320} caption={`${k.title} CPN`} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <SectionHeading level={3} icon="Layers" title="広告セット" count={ADSET_ROWS.length} description="列ヘッダで並べ替え" />
                    <DataTable density="compact" columns={adsetCols} rows={adsetSorted} sortKey={sort.k} sortDir={sort.d} onSort={(kk, d) => setSort({ k: kk, d })} minWidth={1030} caption={`${k.title} 広告セット`} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <SectionHeading level={3} icon="Image" title="広告" count={AD_ROWS.length} />
                    <DataTable density="compact" columns={adCols} rows={AD_ROWS} minWidth={1010} caption={`${k.title} 広告`} />
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { KnowledgeScreen });
