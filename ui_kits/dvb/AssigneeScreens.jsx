import React, { useState } from "react";
import { ASSIGNEE_LIST, ASSIGNEE_UNDELIVERED, ASSIGNEE_DELIVERED } from "./data.js";

/* バッチ 3: アセクリ 一覧 /assignee（PC、通常・空・アクセス拒否）と 詳細 /assignee/[id]（スマホ 393・430 が主 + PC 1440、4 状態）。
   外部向け: サイドバーなし、ヘッダに「AXIS」テキストのみ。骨格・ボタン位置は現状維持、色は primary / secondary の 2 種へ。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" };
const STATUS = { undelivered: { value: "todo", label: "未納品" }, delivered: { value: "done", label: "納品済" }, none: { value: "neutral", label: "タスクなし" } };

/** 外部向けシェル: ヘッダ「AXIS」のみ + 本文（PC は max-w 896 中央） */
export function ExternalShell({ mobile, children, width = 896 }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: mobile ? "100%" : 860, background: "var(--background)" }}>
      <header style={{ height: 56, display: "flex", alignItems: "center", padding: "0 16px", background: "var(--card)", borderBottom: "1px solid var(--border)", flexShrink: 0, position: "sticky", top: 0, zIndex: 5 }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.04em", color: "var(--foreground)" }}>AXIS</span>
        <span style={{ marginLeft: 10, ...muted }}>アセクリ タスク管理</span>
      </header>
      <main style={{ flex: 1, minHeight: 0, overflow: mobile ? "auto" : "visible", padding: mobile ? 16 : 24, display: "flex", flexDirection: "column" }}>
        <div style={{ width: "100%", maxWidth: mobile ? "none" : width, margin: mobile ? 0 : "0 auto", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}

/* ================= 一覧 ================= */
export function AssigneeListScreen({ state = "normal", toast, onNavigate }) {
  const { Badge, EmptyState, AuthCard, Button } = window.DVB;
  const [h, setH] = useState(null);
  if (state === "denied") {
    return (
      <ExternalShell>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
          <AuthCard icon="Lock" iconTone="negative" title="アクセスできません" description="このリンクは無効か、有効期限が切れています。担当者に再発行を依頼してください。" footer={<span>心当たりがない場合は、リンクを送った担当者にご連絡ください</span>} />
        </div>
      </ExternalShell>
    );
  }
  const list = state === "empty" ? [] : ASSIGNEE_LIST;
  return (
    <ExternalShell>
      <div style={{ textAlign: "center", padding: "24px 0 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        <h1 style={{ margin: 0, fontSize: 24, lineHeight: "32px", fontWeight: 600, letterSpacing: "-0.01em" }}>アセクリ タスク管理</h1>
        <p style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>担当のアセクリを選ぶと、未納品タスクと納品済みタスクを確認できます</p>
      </div>
      {list.length === 0 ? <EmptyState icon="Users" title="アセクリが登録されていません" description="管理画面のアセクリ・ルーム管理で登録すると、ここに表示されます。" /> : (
        <div role="list" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 }}>
          {list.map((a) => { const st = STATUS[a.status]; return (
            <a key={a.id} role="listitem" href={`#screen=assignee-detail`} onClick={(e) => { e.preventDefault(); onNavigate && onNavigate("assignee-detail"); }} onMouseEnter={() => setH(a.id)} onMouseLeave={() => setH(null)}
              style={{ ...card, gap: 12, textDecoration: "none", color: "inherit", cursor: "pointer", borderColor: h === a.id ? "var(--primary)" : "var(--border)", boxShadow: h === a.id ? "0 0 0 1px var(--primary), var(--shadow-card)" : "var(--shadow-card)", transition: "border-color var(--duration) var(--ease)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span aria-hidden style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 15, fontWeight: 600, flexShrink: 0 }}>{a.name.slice(0, 1)}</span>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 16, lineHeight: "24px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span>
                  <span style={muted}>{a.tier}</span>
                </span>
                <Badge value={st.value} label={st.label} />
              </div>
              <div style={{ display: "flex", gap: 16, ...muted, fontVariantNumeric: "tabular-nums" }}><span>未納品 <b style={{ color: a.undelivered ? "var(--warning)" : "inherit", fontWeight: 600 }}>{a.undelivered}</b></span><span>納品済 <b style={{ fontWeight: 600, color: "var(--foreground)" }}>{a.delivered}</b></span></div>
            </a>
          ); })}
        </div>
      )}
    </ExternalShell>
  );
}

/* ================= 詳細 ================= */
const URL_HELP = { cr: "納品した CR（ドライブ・Figma など）の URL", pm: "プロマネ（進行管理）シートの URL", sheet: "制作シートの URL" };
function UrlRow({ label, value, onChange, onRemove, placeholder, mobile }) {
  const { Field } = window.DVB; const { IconButton, BigInput } = window.DVBKit;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <BigInput value={value} placeholder={placeholder || "https://"} aria-label={label} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 0 }} type="url" />
      {onRemove ? <IconButton icon="X" label="この URL を削除" onClick={onRemove} /> : <span style={{ width: 32, flexShrink: 0 }} />}
    </div>
  );
}
function TaskMeta({ t, mobile }) {
  const { Badge } = window.DVB;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 15, lineHeight: "22px", fontWeight: 600 }}>{t.project}</span>
        <Badge value="info" label={t.type} size="sm" />
        <span style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500 }}>{t.title}</span>
      </div>
      <div style={{ fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>{t.detail}</div>
      {t.due ? <div style={{ display: "flex", alignItems: "center", gap: 6, ...muted, fontVariantNumeric: "tabular-nums" }}>期限 {t.due}{t.overdue ? <Badge value="late" label="期限超過" size="sm" /> : null}</div> : null}
      {t.deliveredAt ? <div style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>納品 {t.deliveredAt}</div> : null}
    </div>
  );
}
export function AssigneeDetailScreen({ state = "normal", toast, mobile, onNavigate }) {
  const { SectionHeading, Button, Badge, Field, ConfirmDialog, EmptyState, Skeleton, DraftRestoreBanner } = window.DVB;
  const { ErrorBand, BigInput } = window.DVBKit;
  const L = window.LucideReact;
  const loading = state === "loading", empty = state === "empty", error = state === "error";
  const [todo, setTodo] = useState(loading || empty || error ? [] : ASSIGNEE_UNDELIVERED);
  const [done, setDone] = useState(loading || empty || error ? [] : ASSIGNEE_DELIVERED);
  const [openGroups, setOpenGroups] = useState({ "今日の納品": true });
  const [editing, setEditing] = useState(null);
  const [editVals, setEditVals] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [draft, setDraft] = useState(state === "normal");
  const [delivering, setDelivering] = useState(null);
  const upd = (id, patch) => setTodo((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const deliver = (t) => {
    if (!t.crUrls.some((u) => u.trim())) { toast({ kind: "error", message: "CR URL を 1 つ以上入力してください" }); return; }
    setDelivering(t.id);
    setTimeout(() => { setDelivering(null); setTodo((xs) => xs.filter((x) => x.id !== t.id)); setDone((gs) => { const item = { id: t.id, project: t.project, type: t.type, title: t.title, detail: t.detail, deliveredAt: "9/9 15:57", crUrl: t.crUrls.filter(Boolean)[0], pmUrl: t.pmUrl }; return gs[0] && gs[0].group === "今日の納品" ? gs.map((g, i) => (i === 0 ? { ...g, items: [item, ...g.items] } : g)) : [{ group: "今日の納品", items: [item] }, ...gs]; }); setOpenGroups((o) => ({ ...o, "今日の納品": true })); toast({ kind: "success", message: `「${t.project} ${t.title}」を納品しました。担当者に通知されます` }); }, 800);
  };
  const revert = (g, item) => { setDone((gs) => gs.map((x) => (x.group !== g ? x : { ...x, items: x.items.filter((i) => i.id !== item.id) })).filter((x) => x.items.length)); setTodo((xs) => [...xs, { id: item.id, project: item.project, type: item.type, title: item.title, detail: item.detail, due: "—", overdue: false, crUrls: [item.crUrl || ""], pmUrl: item.pmUrl || "", sheetUrl: "" }]); setConfirm(null); toast({ kind: "success", message: "未納品に戻しました" }); };
  const saveUrls = (g, item) => { setDone((gs) => gs.map((x) => (x.group !== g ? x : { ...x, items: x.items.map((i) => (i.id === item.id ? { ...i, ...editVals } : i)) }))); setEditing(null); toast({ kind: "success", message: "URL を更新しました" }); };
  const todoCount = todo.length, doneCount = done.reduce((n, g) => n + g.items.length, 0);
  const label = { fontSize: 13, lineHeight: "18px", fontWeight: 500, color: "var(--foreground)" };

  return (
    <ExternalShell mobile={mobile}>
      {/* ① 戻る + h1 + 説明（backLink） */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Button size="sm" variant="ghost" icon="ArrowLeft" onClick={() => onNavigate && onNavigate("assignee")} style={{ alignSelf: "flex-start", marginLeft: -10 }}>戻る</Button>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span aria-hidden style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 14, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>制</span>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: mobile ? 20 : 24, lineHeight: mobile ? "28px" : "32px", fontWeight: 600, letterSpacing: "-0.01em" }}>制作A社</h1>
            <p style={{ margin: "2px 0 0", fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>タスク一覧 · Tier 1</p>
          </div>
        </div>
      </div>
      {draft && !loading && !empty ? <DraftRestoreBanner time="9/9 14:02" onRestore={() => { upd("u2", { crUrls: ["https://drive.google.com/file/d/1XyZ…/view"] }); setDraft(false); toast({ kind: "success", message: "入力途中の URL を復元しました" }); }} onDiscard={() => setDraft(false)} /> : null}
      {error ? <ErrorBand message="タスクを取得できませんでした。リンクの有効期限を確認してください" onRetry={() => toast({ kind: "info", message: "再試行しました" })} /> : null}

      {/* ② 未納品タスク */}
      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionHeading icon="Clock" title="未納品タスク"><Badge value="todo" label={`${todoCount} 件`} /></SectionHeading>
        {loading ? [0, 1].map((i) => <div key={i} style={card}><Skeleton width="50%" height={18} /><Skeleton width="80%" height={14} /><Skeleton height={44} /><Skeleton height={44} /></div>)
          : !error && todo.length === 0 ? <div style={{ ...card, padding: 0 }}><EmptyState compact icon="CircleCheck" title="未納品のタスクはありません" description="新しい発注が届くとここに表示されます。" /></div>
          : todo.map((t) => (
            <div key={t.id} style={{ ...card, flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: 16, borderLeft: `3px solid ${t.overdue ? "var(--negative)" : "var(--warning)"}` }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                <TaskMeta t={t} mobile={mobile} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={label}>CR URL（必須）</span><Button size="sm" variant="ghost" icon="Plus" onClick={() => upd(t.id, { crUrls: [...t.crUrls, ""] })}>行追加</Button></div>
                  {t.crUrls.map((u, i) => <UrlRow key={i} label={`CR URL ${i + 1}`} value={u} onChange={(v) => upd(t.id, { crUrls: t.crUrls.map((x, j) => (j === i ? v : x)) })} onRemove={t.crUrls.length > 1 ? () => upd(t.id, { crUrls: t.crUrls.filter((_, j) => j !== i) }) : null} />)}
                  <span style={muted}>{URL_HELP.cr}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={label}>PM URL</span><UrlRow label="PM URL" value={t.pmUrl} onChange={(v) => upd(t.id, { pmUrl: v })} /></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={label}>シート URL</span><UrlRow label="シート URL" value={t.sheetUrl} onChange={(v) => upd(t.id, { sheetUrl: v })} /></div>
                </div>
              </div>
              {/* 納品する: PC は右端・縦中央、スマホは入力欄の下・全幅 */}
              <Button variant="primary" icon="PackageCheck" block={mobile} loading={delivering === t.id} onClick={() => deliver(t)} style={{ height: 44, flexShrink: 0, alignSelf: mobile ? "stretch" : "center" }}>納品する</Button>
            </div>
          ))}
      </section>

      {/* ③ 納品済みタスク */}
      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <SectionHeading icon="Package" title="納品済みタスク"><Badge value="done" label={`${doneCount} 件`} /></SectionHeading>
        {loading ? <div style={card}><Skeleton width="30%" height={18} /><Skeleton width="70%" height={14} /></div>
          : !error && done.length === 0 ? <div style={{ ...card, padding: 0 }}><EmptyState compact icon="Package" title="納品済みのタスクはまだありません" description="上の未納品タスクで［納品する］を押すとここに移ります。" /></div>
          : done.map((g) => {
            const open = openGroups[g.group] ?? false; const today = g.group === "今日の納品";
            return (
              <div key={g.group} style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
                <button type="button" aria-expanded={open} onClick={() => setOpenGroups({ ...openGroups, [g.group]: !open })} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minHeight: 48, padding: "0 16px", border: 0, background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "inherit" }}>
                  {today ? <L.Package size={16} strokeWidth={1.75} color="var(--muted-foreground)" aria-hidden /> : <L.CalendarDays size={16} strokeWidth={1.75} color="var(--muted-foreground)" aria-hidden />}
                  <span style={{ fontSize: 15, lineHeight: "22px", fontWeight: 600 }}>{g.group}</span>
                  <span style={{ height: 20, minWidth: 24, padding: "0 6px", borderRadius: 9999, background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, lineHeight: "20px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{g.items.length}</span>
                  <span style={{ flex: 1 }} />
                  {open ? <L.ChevronUp size={16} color="var(--muted-foreground)" aria-hidden /> : <L.ChevronDown size={16} color="var(--muted-foreground)" aria-hidden />}
                </button>
                {open ? g.items.map((it, i) => {
                  const ed = editing === it.id;
                  return (
                    <div key={it.id} style={{ borderTop: "1px solid var(--border)", padding: 16, display: "flex", flexDirection: "column", gap: 12, borderLeft: "3px solid var(--positive)" }}>
                      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "flex-start", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}><TaskMeta t={it} mobile={mobile} /></div>
                        {/* 右上: CR / PM / 戻す（secondary / secondary / ghost、同じ順） */}
                        <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                          <Button size="sm" variant="secondary" icon="ExternalLink" disabled={!it.crUrl} onClick={() => toast({ kind: "info", message: "CR を開きます（別タブ）" })}>CR</Button>
                          <Button size="sm" variant="secondary" icon="ExternalLink" disabled={!it.pmUrl} onClick={() => toast({ kind: "info", message: "PM を開きます（別タブ）" })}>PM</Button>
                          <Button size="sm" variant="ghost" icon="Undo2" onClick={() => setConfirm({ g: g.group, item: it })}>戻す</Button>
                        </div>
                      </div>
                      {/* 下端左: URL を修正 → 編集パネル → 末尾「URL を更新」 */}
                      {ed ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 12, borderRadius: "var(--radius)", background: "var(--muted)" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={label}>CR URL</span><BigInput type="url" value={editVals.crUrl ?? ""} onChange={(e) => setEditVals({ ...editVals, crUrl: e.target.value })} aria-label="CR URL" /></div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><span style={label}>PM URL</span><BigInput type="url" value={editVals.pmUrl ?? ""} onChange={(e) => setEditVals({ ...editVals, pmUrl: e.target.value })} aria-label="PM URL" /></div>
                          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <Button variant="secondary" onClick={() => setEditing(null)}>キャンセル</Button>
                            <Button variant="primary" icon="Save" onClick={() => saveUrls(g.group, it)}>URLを更新</Button>
                          </div>
                        </div>
                      ) : <Button size="sm" variant="ghost" icon="Pencil" onClick={() => { setEditing(it.id); setEditVals({ crUrl: it.crUrl || "", pmUrl: it.pmUrl || "" }); }} style={{ alignSelf: "flex-start", marginLeft: -10 }}>URLを修正</Button>}
                    </div>
                  );
                }) : null}
              </div>
            );
          })}
      </section>
      {confirm ? <ConfirmDialog title="未納品に戻しますか？" description={`「${confirm.item.project} ${confirm.item.title}」を未納品タスクに戻します。担当者に通知されます。`} confirmLabel="戻す" onCancel={() => setConfirm(null)} onConfirm={() => revert(confirm.g, confirm.item)} /> : null}
    </ExternalShell>
  );
}

window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { ExternalShell, AssigneeListScreen, AssigneeDetailScreen });
