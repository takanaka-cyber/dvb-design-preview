import React, { useState } from "react";
import { LINK_CATEGORIES, PERSONAL_LINK_SETTINGS, SHARED_LINK_URLS } from "./data.js";

/* バッチ 2: リンク集 /links（通常・編集モード）。h1 を標準サイズに（E1）。カテゴリ色 6 種を廃止し SectionHeading のみ。タイルは LinkTile。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };
const ICONS = ["Link2", "FileSpreadsheet", "FileText", "Folder", "MessageSquare", "BarChart3", "Camera", "Megaphone", "Video", "Search", "Database", "BookOpen", "Star"];
const dashed = { height: 44, width: "100%", border: "1px dashed var(--border)", borderRadius: "var(--radius)", background: "transparent", color: "var(--muted-foreground)", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 };

export function LinksScreen({ state = "normal", toast, narrow }) {
  const { PageHeader, SectionHeading, Button, Input, Select, Field, LinkTile, Dialog, ConfirmDialog, Badge } = window.DVB;
  const { IconButton } = window.DVBKit;
  const L = window.LucideReact;
  const [editing, setEditing] = useState(state === "edit");
  const [cats, setCats] = useState(LINK_CATEGORIES);
  const [adding, setAdding] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [personalOpen, setPersonalOpen] = useState(false);
  const [personal, setPersonal] = useState(PERSONAL_LINK_SETTINGS);
  const [sharedOpen, setSharedOpen] = useState(false);
  const [shared, setShared] = useState(SHARED_LINK_URLS);
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const updLink = (cid, lid, patch) => setCats((cs) => cs.map((c) => (c.key !== cid ? c : { ...c, links: c.links.map((l) => (l.id === lid ? { ...l, ...patch } : l)) })));
  const delLink = (cid, lid) => setCats((cs) => cs.map((c) => (c.key !== cid ? c : { ...c, links: c.links.filter((l) => l.id !== lid) })));
  const addMine = () => { if (!newLink.name.trim()) return; setCats((cs) => cs.map((c) => (c.key !== "mine" ? c : { ...c, links: [...c.links, { id: "l" + Date.now(), name: newLink.name.trim(), url: newLink.url, icon: "Star" }] }))); setNewLink({ name: "", url: "" }); setAdding(false); toast({ kind: "success", message: "マイリンクを追加しました" }); };
  const cols = narrow ? 3 : 4;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ① h1 標準サイズ（E1）。右の 編集 / キャンセル・保存 は位置そのまま */}
      <PageHeader icon="Link2" title="リンク集" description="よく使う外部ツールとシート。編集モードで並べ替え・非表示">
        {editing ? (<>
          <Button variant="secondary" onClick={() => { setEditing(false); setCats(LINK_CATEGORIES); }}>キャンセル</Button>
          <Button variant="primary" icon="Save" loading={saving} onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); setEditing(false); toast({ kind: "success", message: "リンク集を保存しました" }); }, 700); }}>保存</Button>
        </>) : <Button variant="secondary" icon="Pencil" onClick={() => setEditing(true)}>編集</Button>}
      </PageHeader>
      {/* ② 編集モードのヒント帯（--info-subtle 13px） */}
      {editing ? <div role="status" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", fontSize: 13, lineHeight: "18px" }}><L.Info size={16} strokeWidth={1.75} aria-hidden />ドラッグで並べ替え、✏️ で名前と URL を編集、👁 で非表示、🗑 で削除。右上の［保存］で確定します。</div> : null}

      {/* ③ カテゴリ 6（見出しだけで区別。色ドットなし） */}
      {cats.map((c) => {
        const list = editing ? c.links : c.links.filter((l) => !l.hidden);
        return (
          <section key={c.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <SectionHeading icon={c.icon} title={c.label} count={list.length} />
            {list.length === 0 && !editing ? <div style={{ ...muted, padding: "4px 0" }}>リンクはありません</div> : (
              <div role="list" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 8 }}>
                {list.map((l) => <LinkTile key={l.id} name={l.name} icon={l.icon} href={l.url || "#"} hidden={l.hidden} editing={editing} onClick={(e) => { e.preventDefault(); toast({ kind: "info", message: `${l.name} を開きます` }); }}
                  onEdit={() => setEdit({ cid: c.key, ...l })} onToggleHidden={() => { updLink(c.key, l.id, { hidden: !l.hidden }); toast({ kind: "info", message: l.hidden ? `「${l.name}」を表示に戻しました` : `「${l.name}」を非表示にしました` }); }}
                  onDelete={() => setConfirm({ title: "リンクを削除しますか？", description: `「${l.name}」を${c.label}から削除します。この操作は取り消せません。`, onConfirm: () => { delLink(c.key, l.id); setConfirm(null); toast({ kind: "success", message: "リンクを削除しました" }); } })} />)}
              </div>
            )}
            {/* ④ マイリンクを追加（破線・全幅）→ 追加行 右に ＋/× */}
            {c.key === "mine" ? (adding ? (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr) 32px 32px", gap: 8, alignItems: "center" }}>
                <Input size="sm" value={newLink.name} placeholder="名前" aria-label="リンク名" autoFocus onChange={(e) => setNewLink({ ...newLink, name: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") addMine(); if (e.key === "Escape") setAdding(false); }} />
                <Input size="sm" value={newLink.url} placeholder="https://" aria-label="URL" onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") addMine(); }} />
                <IconButton icon="Plus" label="追加" onClick={addMine} disabled={!newLink.name.trim()} />
                <IconButton icon="X" label="閉じる" onClick={() => { setAdding(false); setNewLink({ name: "", url: "" }); }} />
              </div>
            ) : <button type="button" onClick={() => setAdding(true)} style={dashed}><L.Plus size={16} aria-hidden />マイリンクを追加</button>) : null}
          </section>
        );
      })}

      {/* ⑤ 個人リンク設定（purple → 白 + border、折りたたみ、下部 保存 全幅） */}
      <section style={{ ...card, gap: personalOpen ? 12 : 0 }}>
        <button type="button" aria-expanded={personalOpen} onClick={() => setPersonalOpen(!personalOpen)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", border: 0, background: "transparent", padding: 0, cursor: "pointer", textAlign: "left", color: "var(--foreground)" }}>
          <L.Settings2 size={16} color="var(--muted-foreground)" aria-hidden /><span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>個人リンク設定</span><span style={muted}>自分の案件シート・ドライブ・チャットワーク</span>
          <span style={{ marginLeft: "auto", color: "var(--muted-foreground)" }}>{personalOpen ? <L.ChevronUp size={16} aria-hidden /> : <L.ChevronDown size={16} aria-hidden />}</span>
        </button>
        {personalOpen ? (<>
          <Field label="自分の案件シート URL" htmlFor="pl-s"><Input id="pl-s" value={personal.sheet} onChange={(e) => setPersonal({ ...personal, sheet: e.target.value })} /></Field>
          <Field label="ドライブ URL" htmlFor="pl-d"><Input id="pl-d" value={personal.drive} onChange={(e) => setPersonal({ ...personal, drive: e.target.value })} /></Field>
          <Field label="チャットワーク URL" htmlFor="pl-c" help="マイリンク「チャットワーク」の遷移先"><Input id="pl-c" value={personal.chatwork} onChange={(e) => setPersonal({ ...personal, chatwork: e.target.value })} /></Field>
          <Button variant="primary" block icon="Save" onClick={() => toast({ kind: "success", message: "個人リンク設定を保存しました" })}>保存</Button>
        </>) : null}
      </section>

      {/* ⑥ 共有リンク URL 設定（ADMIN。破線 → 展開、下部 キャンセル → 保存） */}
      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sharedOpen ? (
          <div style={card}>
            <SectionHeading icon="Globe" title="共有リンク URL 設定" description="全員のリンク集に反映"><Badge value="neutral" label="ADMIN" /></SectionHeading>
            <Field label="マニュアル URL" htmlFor="sl-m"><Input id="sl-m" value={shared.manual} onChange={(e) => setShared({ ...shared, manual: e.target.value })} /></Field>
            <Field label="検証ナレッジ URL" htmlFor="sl-k"><Input id="sl-k" value={shared.knowledge} onChange={(e) => setShared({ ...shared, knowledge: e.target.value })} /></Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary" onClick={() => { setSharedOpen(false); setShared(SHARED_LINK_URLS); }}>キャンセル</Button>
              <Button variant="primary" icon="Save" onClick={() => { setSharedOpen(false); toast({ kind: "success", message: "共有リンク URL を保存しました" }); }}>保存</Button>
            </div>
          </div>
        ) : <button type="button" onClick={() => setSharedOpen(true)} style={dashed}><L.Globe size={16} aria-hidden />共有リンク URL 設定（ADMIN）</button>}
      </section>

      {edit ? (
        <Dialog open size="sm" title="リンクを編集" onClose={() => setEdit(null)} confirmLabel="保存" confirmDisabled={!edit.name.trim()} onConfirm={() => { updLink(edit.cid, edit.id, { name: edit.name, url: edit.url, icon: edit.icon }); setEdit(null); toast({ kind: "success", message: "リンクを更新しました" }); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="名前" htmlFor="le-n" required><Input id="le-n" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="URL" htmlFor="le-u"><Input id="le-u" value={edit.url || ""} placeholder="https://" onChange={(e) => setEdit({ ...edit, url: e.target.value })} /></Field>
            <Field label="アイコン" htmlFor="le-i"><Select id="le-i" value={edit.icon} options={ICONS} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} width="100%" /></Field>
          </div>
        </Dialog>
      ) : null}
      {confirm ? <ConfirmDialog title={confirm.title} description={confirm.description} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { LinksScreen });
