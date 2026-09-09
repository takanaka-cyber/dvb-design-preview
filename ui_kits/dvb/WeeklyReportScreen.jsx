import React, { useState } from "react";
import { WEEKS, WEEKLY_TOP10, WEEKLY_KPI, MONTHLY_GOAL, WEEKLY_MEDIA, SHARED_CPN, AI_RESULT, BOARD_ROWS, CPN_ROWS, GG_MEMBERS } from "./data.js";

const yen = (n) => n == null ? "—" : `¥${Math.round(n).toLocaleString("ja-JP")}`;
const TEMPLATE = "【今の状態】\n\n【課題認識】\n\n【次の一手】\n";

/** 1行の注意帯。tone: negative | warning | info */
function Notice({ tone = "info", children, action, icon }) {
  const L = window.LucideReact;
  const I = L[icon || (tone === "negative" ? "CircleAlert" : tone === "warning" ? "TriangleAlert" : "Info")];
  const fg = `var(--${tone}-subtle-foreground)`;
  return (
    <div role={tone === "negative" ? "alert" : "status"} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40, padding: "6px 12px", background: `var(--${tone}-subtle)`, color: fg, borderRadius: "var(--radius)", fontSize: 14, lineHeight: "20px" }}>
      {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ color: `var(--${tone})`, flexShrink: 0 }} /> : null}
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
      {action}
    </div>
  );
}

/** 開閉セクション（既定は閉）。見出しは SectionHeading と同じ 16/600。 */
function Disclosure({ icon, title, count, description, defaultOpen = false, children, right }) {
  const [open, setOpen] = useState(defaultOpen);
  const L = window.LucideReact; const Chev = open ? L.ChevronDown : L.ChevronRight; const I = icon && L[icon];
  return (
    <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px 0 8px", minHeight: 48 }}>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, height: 48, border: 0, background: "transparent", cursor: "pointer", textAlign: "left", padding: "0 8px", borderRadius: "var(--radius-sm)", color: "var(--foreground)" }}>
          <Chev size={16} strokeWidth={1.75} color="var(--muted-foreground)" aria-hidden />
          {I ? <I size={16} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" /> : null}
          <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600 }}>{title}</span>
          {count != null ? <span style={{ height: 20, minWidth: 24, padding: "0 6px", borderRadius: 9999, background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, lineHeight: "20px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{count}</span> : null}
          {description ? <span style={{ fontSize: 13, color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{description}</span> : null}
        </button>
        {right}
      </div>
      {open ? <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div> : null}
    </section>
  );
}

/** 週次レポート（/reports/weekly）。PC 1440 / スマホ 393・430（mobile）。 */
export function WeeklyReportScreen({ state = "normal", toast, narrow, mobile }) {
  const D = window.DVB;
  const { PageHeader, Button, Select, KpiCard, DataTable, MetricCell, Badge, EmptyState, SectionHeading, Field, Textarea, SaveStatus, WeekSelector, FreshnessBadge, FreshnessNotice, DraftRestoreBanner } = D;
  const loading = state === "loading", error = state === "error", empty = state === "empty", view = state === "view";
  const [week, setWeek] = useState(1);
  const [member, setMember] = useState(view ? "三冨" : "自分");
  const viewing = member !== "自分";
  const [fresh, setFresh] = useState(error ? "none" : empty ? "stale" : "fresh");
  const [refreshing, setRefreshing] = useState(false);
  const [draft, setDraft] = useState(state === "normal");
  const [save, setSave] = useState(error ? "error" : "saved");
  const [growth, setGrowth] = useState(empty || loading ? "" : "C社 美容D2C: TikTok 新規 CPN の入札調整が効き CV +41。A社 記事LP: 型C の CR 差し替え初週で CTR 1.33 → 1.50。");
  const [shrink, setShrink] = useState(empty || loading ? "" : "D社 サプリ: Google の CPA が ¥4,000 台に上昇、利益 −¥98,400。媒体か LP かの切り分けが来週頭に持ち越し。");
  const [review, setReview] = useState(TEMPLATE);
  const [ai, setAi] = useState(state === "normal" ? AI_RESULT : null);
  const [aiRunning, setAiRunning] = useState(false);
  const [sort, setSort] = useState({ k: "profit", d: "desc" });
  const onEdit = (set) => (e) => { set(e.target.value); if (error) return; setSave("saving"); clearTimeout(onEdit.t); onEdit.t = setTimeout(() => setSave("saved"), 900); };
  const refresh = () => { setRefreshing(true); setTimeout(() => { setRefreshing(false); setFresh("fresh"); toast({ kind: "success", message: "CPデータを更新しました" }); }, 900); };
  const restore = () => { setDraft(false); setReview("【今の状態】\n利益は横ばい。C社の伸びで D社の減少を吸収\n\n【課題認識】\nD社の主因が媒体か LP か未確定\n\n【次の一手】\n月曜に LP 遷移率を先に切り分ける"); toast({ kind: "success", message: "復元しました" }); };
  const runAi = () => { setAiRunning(true); setTimeout(() => { setAiRunning(false); setAi(AI_RESULT); toast({ kind: "success", message: "AI分析が完了しました" }); }, 1200); };

  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
  const K = empty ? null : WEEKLY_KPI;
  const kpis = (
    <div style={{ display: "grid", gridTemplateColumns: mobile ? "repeat(2, minmax(0,1fr))" : "repeat(4, minmax(0,1fr))", gap: 12 }}>
      <KpiCard label="週の利益" value={K ? yen(K.profit) : "—"} delta={K && { value: K.dp, prefix: "¥", digits: 0 }} note={K ? "前週比" : "案件なし"} loading={loading} error={error} />
      <KpiCard label="消化" value={K ? yen(K.spend) : "—"} delta={K && { value: K.ds, prefix: "¥", digits: 0 }} note={K ? "前週比" : "案件なし"} loading={loading} error={error} />
      <KpiCard label="ROAS" value={K ? K.roas.toFixed(1) : "—"} unit={K ? "%" : undefined} delta={K && { value: K.dr, unit: "pt" }} note={K ? "前週比" : "案件なし"} loading={loading} error={error} />
      <KpiCard label="CV" value={K ? K.cv.toLocaleString("ja-JP") : "—"} delta={K && { value: K.dc, digits: 0 }} note={K ? "前週比" : "案件なし"} loading={loading} error={error} />
    </div>
  );
  const pct = Math.round(MONTHLY_GOAL.actual / MONTHLY_GOAL.target * 1000) / 10;
  const goal = (
    <section style={{ ...card, gap: 10 }} aria-label="月間目標">
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3, minmax(0,1fr))", gap: 12 }}>
        {[["目標利益", yen(MONTHLY_GOAL.target)], ["今月累計", empty ? "—" : yen(MONTHLY_GOAL.actual)], ["達成率", empty ? "—" : `${pct}%`]].map(([l, v]) => (
          <div key={l} style={{ minWidth: 0 }}><div style={{ fontSize: 13, color: "var(--muted-foreground)", fontWeight: 500 }}>{l}</div>{loading ? <span style={{ display: "block", width: "60%", height: 24, marginTop: 4, borderRadius: 4, background: "var(--muted)" }} /> : <div style={{ fontSize: 20, lineHeight: "28px", fontWeight: 600, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>{v}</div>}</div>
        ))}
      </div>
      <div aria-hidden style={{ height: 6, borderRadius: 3, background: "var(--muted)", overflow: "hidden" }}><div style={{ width: `${empty || loading ? 0 : pct}%`, height: "100%", background: "var(--primary)", transition: "width var(--duration) var(--ease)" }} /></div>
    </section>
  );

  const nameCol = { key: "name", label: "CPN名", sticky: true, width: 300, render: (r) => <span title={r.name} style={{ display: "block", maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>{r.name.length > 40 ? r.name.slice(0, 40) + "…" : r.name}</span> };
  const num = (k, label, u, dg) => ({ key: k, label, align: "right", sortable: true, width: 92, render: (r) => <MetricCell value={r[k]} unit={u} digits={dg || 0} /> });
  const topCols = [nameCol, { key: "media", label: "媒体", width: 80, render: (r) => <Badge kind="media" value={r.media} /> },
    num("spend", "消化", "¥"), num("revenue", "売上", "¥"), num("profit", "利益", "¥"), num("roas", "ROAS", "%", 1), num("cv", "CV"), num("cpa", "CPA", "¥"), num("imp", "Imp"), num("clicks", "Clicks"), num("ctr", "CTR", "%", 2), num("cpc", "CPC", "¥"), num("cpm", "CPM", "¥"), num("mcv", "MCV"), num("mcpa", "MCPA", "¥"), num("cvr", "CVR", "%", 2)];
  const top = empty ? [] : [...WEEKLY_TOP10].sort((a, b) => (sort.d === "desc" ? 1 : -1) * ((b[sort.k] ?? -Infinity) - (a[sort.k] ?? -Infinity)));
  const cpnCols = [{ key: "name", label: "CPN名", sticky: true, width: 220, render: (r) => <span title={r.name} style={{ fontWeight: 500 }}>{r.name}</span> }, num("spend", "消化", "¥"), num("profit", "利益", "¥"), num("roas", "ROAS", "%", 1), num("cv", "CV"), num("cpa", "CPA", "¥"), num("ctr", "CTR", "%", 2)];

  const readonlyBox = (v) => <div style={{ padding: "10px 12px", minHeight: 80, fontSize: 14, lineHeight: "20px", whiteSpace: "pre-wrap", background: "var(--muted)", borderRadius: "var(--radius)", color: v ? "var(--foreground)" : "var(--muted-foreground)" }}>{v || "未記入"}</div>;
  const ta = (id, label, ph, v, set) => (
    <Field key={id} label={<span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span>{label}</span><span style={{ fontSize: 12, fontWeight: 400, color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{v.length} 字</span></span>} htmlFor={id}>
      {viewing ? readonlyBox(v.trim() === TEMPLATE.trim() ? "" : v) : <Textarea id={id} rows={4} value={v} onChange={onEdit(set)} placeholder={ph} disabled={loading} />}
    </Field>
  );
  const reflection = (
    <section style={card}>
      <SectionHeading icon="MessageSquareText" title="振り返りコメント" description={viewing ? "読み取り" : "自動保存"} />
      {ta("growth", "グロース要因", "成長した理由・成功要因", growth, setGrowth)}
      {ta("shrink", "シュリンク要因", "減少した理由・改善点", shrink, setShrink)}
      {ta("review", "週次振り返り", "", review, setReview)}
    </section>
  );

  /* ---------- スマホ ---------- */
  if (mobile) {
    return <MobileWeekly {...{ state, toast, week, setWeek, fresh, refresh, refreshing, draft, restore, setDraft, kpis, goal, save, empty, loading, growth, shrink, review, member }} />;
  }

  /* ---------- PC ---------- */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PageHeader icon="BarChart3" title="週次レポート" description="週の数値と振り返り。月曜に振り返りコメントを書く">
        <SaveStatus state={viewing ? "idle" : save} time="15:56" onRetry={() => { setSave("saving"); setTimeout(() => setSave("error"), 800); }} />
      </PageHeader>

      <div role="toolbar" aria-label="表示条件" style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <WeekSelector weeks={WEEKS} index={week} onChange={(i, r) => r === "more" ? toast({ kind: "info", message: "過去の週を選ぶダイアログを開く" }) : setWeek(i)} />
        <Select aria-label="メンバー" options={["自分", ...GG_MEMBERS]} value={member} onChange={(e) => setMember(e.target.value)} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <Button icon="RefreshCw" onClick={refresh} loading={refreshing} disabled={loading}>CPデータ更新</Button>
          <FreshnessBadge state={fresh} time={fresh === "fresh" ? "9/9 08:12" : "9/7 18:40"} />
        </div>
      </div>

      {viewing ? <Notice tone="info" icon="Eye">{member}さんのレポートを閲覧中</Notice> : null}
      {empty ? <Notice tone="negative" action={<Button size="sm" icon="ExternalLink" onClick={() => toast({ kind: "info", message: "設定を開く" })}>設定を開く</Button>}>設定の担当者名がスプレッドシートと一致していないため、案件が表示されていません。設定で担当者名を確認してください。</Notice> : null}
      {error ? <Notice tone="negative" action={<Button size="sm" icon="RefreshCw" onClick={() => toast({ kind: "info", message: "再読み込みしています…" })}>再試行</Button>}>データを取得できませんでした</Notice> : null}
      {fresh !== "fresh" && !loading ? <FreshnessNotice onRefresh={refresh} loading={refreshing} /> : null}
      {draft && !viewing && !loading ? <DraftRestoreBanner time="9/8 22:14" onRestore={restore} onDiscard={() => setDraft(false)} /> : null}

      {kpis}
      {goal}
      {reflection}

      <section style={card}>
        <SectionHeading icon="Sparkles" title="AI分析">
          {!viewing ? <Button icon="Sparkles" onClick={runAi} loading={aiRunning} disabled={loading || error}>AI分析を実行</Button> : null}
        </SectionHeading>
        {ai ? (
          <article style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600 }}>{ai.title}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "22px" }}>{ai.body}</p>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>実行 {ai.at}</div>
          </article>
        ) : <EmptyState compact icon="Sparkles" title="まだ分析していません。" description="振り返りを書いてから実行すると精度が上がります" />}
      </section>

      <section style={card}>
        <SectionHeading icon="Trophy" title="利益TOP10" count={empty || loading ? undefined : top.length} description="消化・売上・利益ほか 16 項目。並べ替え可" />
        <DataTable columns={topCols} rows={top} sortKey={sort.k} sortDir={sort.d} onSort={(k, d) => setSort({ k, d })} density="compact" loading={loading} skeletonRows={6} error={error ? "CPデータの取得に失敗しました。" : undefined} onRetry={() => toast({ kind: "info", message: "再読み込みしています…" })} minWidth={1780} maxHeight={440} caption="利益TOP10" style={{ boxShadow: "none" }}
          emptyNode={<EmptyState compact icon="Trophy" title="表示できる案件がありません。" description="上の帯から設定を開き、担当者名を確認してください。" />} />
      </section>

      <Disclosure icon="Layers" title="媒体別詳細" count={empty ? 0 : WEEKLY_MEDIA.length}>
        {empty ? <EmptyState compact icon="Layers" title="媒体別の数値がありません。" description="案件が表示されると媒体ごとに集計されます。" /> : (
          <div style={{ display: "grid", gridTemplateColumns: narrow ? "repeat(2, minmax(0,1fr))" : "repeat(4, minmax(0,1fr))", gap: 12 }}>
            {WEEKLY_MEDIA.map((m) => (
              <div key={m.media} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <Badge kind="media" value={m.media} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["消化", m.spend, m.ds, "¥"], ["売上", m.revenue, m.dr, "¥"], ["利益", m.profit, m.dp, "¥"], ["ROAS", m.roas, m.droas, "%"]].map(([l, v, d, u]) => (
                    <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{l}</span><MetricCell value={v} delta={d} unit={u} digits={u === "%" ? 1 : 0} deltaUnit={u === "%" ? "pt" : undefined} style={{ alignItems: "flex-start" }} /></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Disclosure>

      <Disclosure icon="FolderKanban" title="案件別詳細" count={empty ? 0 : BOARD_ROWS.length - 1}>
        {empty ? <EmptyState compact icon="FolderKanban" title="案件がありません。" description="担当者名の設定を確認してください。" /> : BOARD_ROWS.filter((r) => r.profit != null).map((r) => (
          <Disclosure key={r.id} title={r.name} description={`${r.owner} · 利益 ${yen(r.profit)}`} right={<Badge kind="rank" value={r.rank} />}>
            <DataTable columns={cpnCols} rows={CPN_ROWS} density="compact" minWidth={900} caption={`${r.name} CPN`} style={{ boxShadow: "none" }} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: 14 }}><span style={{ fontWeight: 600 }}>施策グループ</span><span style={{ color: "var(--muted-foreground)", fontSize: 13 }}>型C × 25-34F 検証 — 類似1%が結果単価で優位。来週は予算を 1.5 倍に。</span></div>
          </Disclosure>
        ))}
      </Disclosure>

      <Disclosure icon="Share2" title="共有CP" count={empty ? 0 : SHARED_CPN.length}>
        <DataTable columns={[{ key: "name", label: "CPN名", sticky: true, width: 280, render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> }, num("spend", "消化", "¥"), num("profit", "利益", "¥"), num("roas", "ROAS", "%", 1)]} rows={empty ? [] : SHARED_CPN} density="compact" caption="共有CP" style={{ boxShadow: "none" }} emptyNode={<EmptyState compact icon="Share2" title="共有CPはありません。" />} />
      </Disclosure>
    </div>
  );
}

/** スマホ版（2.2）: 1〜6 のみ。振り返り以降は「PCで開く」+ 折りたたみで読める。 */
function MobileWeekly({ toast, week, setWeek, fresh, refresh, refreshing, draft, restore, setDraft, kpis, goal, save, empty, loading, growth, shrink, review, member }) {
  const { PageHeader, Button, SaveStatus, WeekSelector, FreshnessBadge, FreshnessNotice, DraftRestoreBanner, EmptyState } = window.DVB;
  const [open, setOpen] = useState(false);
  const L = window.LucideReact; const Chev = open ? L.ChevronDown : L.ChevronRight;
  const ro = (l, v) => <div key={l}><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>{l}</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap", color: v ? "var(--foreground)" : "var(--muted-foreground)" }}>{v || "未記入"}</div></div>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <PageHeader icon="BarChart3" title="週次レポート"><SaveStatus state={save} time="15:56" /></PageHeader>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <WeekSelector compact weeks={WEEKS} index={week} onChange={setWeek} style={{ alignSelf: "stretch" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <FreshnessBadge state={fresh} time={fresh === "fresh" ? "9/9 08:12" : "9/7 18:40"} />
          <Button size="sm" icon="RefreshCw" onClick={refresh} loading={refreshing}>CPデータ更新</Button>
        </div>
      </div>
      {empty ? <Notice tone="negative">設定の担当者名がスプレッドシートと一致していないため、案件が表示されていません。設定で担当者名を確認してください。</Notice> : null}
      {fresh !== "fresh" ? <FreshnessNotice onRefresh={refresh} loading={refreshing} /> : null}
      {draft ? <DraftRestoreBanner time="9/8 22:14" onRestore={restore} onDiscard={() => setDraft(false)} /> : null}
      {kpis}
      {goal}
      <section style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--muted-foreground)", borderBottom: open ? "1px solid var(--border)" : 0 }}>
          <L.Monitor size={16} strokeWidth={1.75} aria-hidden />
          <span style={{ flex: 1 }}>振り返りの入力と AI 分析は PC で開く</span>
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 44, padding: "0 8px", marginRight: -8, border: 0, background: "transparent", color: "var(--primary)", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>読む<Chev size={16} /></button>
        </div>
        {open ? <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>{empty ? <EmptyState compact icon="MessageSquareText" title="この週の振り返りはまだありません。" /> : [ro("グロース要因", growth), ro("シュリンク要因", shrink), ro("週次振り返り", review.trim() === TEMPLATE.trim() ? "" : review)]}</div> : null}
      </section>
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.WeeklyReportScreen = WeeklyReportScreen;
