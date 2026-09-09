import React, { useState, useEffect } from "react";
import { PROJECTS, SETTINGS_PROFILE, SETTINGS_CHATWORK, SETTINGS_SHEETS, PERSONAL_LINK_SETTINGS } from "./data.js";

/* バッチ 2: 設定 /settings（通常・保存成功・エラー）。max-w-2xl 1 カラム、Card 5 枚、画面下 sticky「すべての設定を保存」全幅。 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, color: "var(--muted-foreground)" };

export function SettingsScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Input, Select, Field, Badge, DraftRestoreBanner } = window.DVB;
  const { IconButton, ErrorBand } = window.DVBKit;
  const error = state === "error";
  const [draft, setDraft] = useState(state === "normal");
  const [profile, setProfile] = useState(SETTINGS_PROFILE);
  const [pw, setPw] = useState({ cur: "", next: "", conf: "" });
  const [cw, setCw] = useState(SETTINGS_CHATWORK);
  const [links, setLinks] = useState(PERSONAL_LINK_SETTINGS);
  const [sheets, setSheets] = useState(SETTINGS_SHEETS);
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  useEffect(() => { if (state === "success") toast({ kind: "success", message: "設定を保存しました" }); }, []);
  const saveAll = () => { setSaving(true); setTimeout(() => { setSaving(false); toast({ kind: "success", message: "設定を保存しました" }); }, 900); };
  const pwOk = pw.cur && pw.next.length >= 8 && pw.next === pw.conf;
  const updTarget = (id, k, v) => setCw({ ...cw, reportTargets: cw.reportTargets.map((t) => (t.id === id ? { ...t, [k]: v } : t)) });

  return (
    <div style={{ maxWidth: 672, display: "flex", flexDirection: "column", gap: 16, position: "relative", paddingBottom: 72 }}>
      {/* ① h1 + 説明 */}
      <PageHeader icon="Settings" title="設定" description="プロフィール・パスワード・チャットワーク連携・個人用リンク・制作シート" />
      {/* DraftRestoreBanner を PageHeader 直下に */}
      {draft ? <DraftRestoreBanner time="9/8 22:14" onRestore={() => { setCw({ ...cw, reportTargets: [...cw.reportTargets, { id: "cw3", roomId: "355512345", accountId: "", label: "アセクリ 発注" }] }); setDraft(false); toast({ kind: "success", message: "下書きを復元しました" }); }} onDiscard={() => setDraft(false)} /> : null}
      {/* ② エラー帯（成功は Toast のみ） */}
      {error ? <ErrorBand message="設定を保存できませんでした。入力内容はブラウザに退避済みです" onRetry={saveAll} /> : null}

      {/* ③ Card 5 枚 */}
      <section style={card}>
        <SectionHeading icon="User" title="プロフィール"><Badge value="neutral" label={profile.role} /></SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="氏名" htmlFor="pf-n" required><Input id="pf-n" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
          <Field label="メールアドレス" htmlFor="pf-e" required error={error ? "このメールアドレスは使用できません" : undefined}><Input id="pf-e" type="email" value={profile.email} invalid={error} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></Field>
        </div>
        <Field label="部署" htmlFor="pf-d" help="部署の変更は管理者に依頼してください"><Input id="pf-d" value={profile.dept} disabled /></Field>
      </section>

      <section style={card}>
        <SectionHeading icon="KeyRound" title="パスワード変更" description="8 文字以上" />
        <Field label="現在のパスワード" htmlFor="pw-c"><Input id="pw-c" type="password" value={pw.cur} autoComplete="current-password" onChange={(e) => setPw({ ...pw, cur: e.target.value })} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="新しいパスワード" htmlFor="pw-n"><Input id="pw-n" type="password" value={pw.next} autoComplete="new-password" onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
          <Field label="新しいパスワード（確認）" htmlFor="pw-r" error={pw.conf && pw.conf !== pw.next ? "一致しません" : undefined}><Input id="pw-r" type="password" value={pw.conf} invalid={!!pw.conf && pw.conf !== pw.next} autoComplete="new-password" onChange={(e) => setPw({ ...pw, conf: e.target.value })} /></Field>
        </div>
        <Button variant="secondary" block icon="KeyRound" disabled={!pwOk} loading={pwSaving} onClick={() => { setPwSaving(true); setTimeout(() => { setPwSaving(false); setPw({ cur: "", next: "", conf: "" }); toast({ kind: "success", message: "パスワードを変更しました" }); }, 900); }}>パスワードを変更</Button>
      </section>

      <section style={card}>
        <SectionHeading icon="MessageSquare" title="チャットワーク連携" description="日報・タスクの通知先" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="ルーム ID" htmlFor="cw-r" help="自分の日報が届くルーム"><Input id="cw-r" numeric value={cw.roomId} onChange={(e) => setCw({ ...cw, roomId: e.target.value })} /></Field>
          <Field label="アカウント ID" htmlFor="cw-a" help="TO を付ける自分の ID"><Input id="cw-a" numeric value={cw.accountId} onChange={(e) => setCw({ ...cw, accountId: e.target.value })} /></Field>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>タスク報告先</span>
          <Button size="sm" variant="secondary" icon="Plus" onClick={() => setCw({ ...cw, reportTargets: [...cw.reportTargets, { id: "cw" + Date.now(), roomId: "", accountId: "", label: "" }] })}>追加</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 140px 140px 32px", gap: 8, ...muted }}><span>ラベル</span><span>ルーム ID</span><span>アカウント ID</span><span /></div>
          {cw.reportTargets.map((t) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 140px 140px 32px", gap: 8, alignItems: "center" }}>
              <Input size="sm" value={t.label} placeholder="例: GG 1課 タスク報告" aria-label="ラベル" onChange={(e) => updTarget(t.id, "label", e.target.value)} />
              <Input size="sm" numeric value={t.roomId} placeholder="ルーム ID" aria-label="ルーム ID" onChange={(e) => updTarget(t.id, "roomId", e.target.value)} />
              <Input size="sm" numeric value={t.accountId} placeholder="任意" aria-label="アカウント ID" onChange={(e) => updTarget(t.id, "accountId", e.target.value)} />
              <IconButton icon="Trash2" label="この報告先を削除" tone="destructive" disabled={cw.reportTargets.length <= 1} onClick={() => { setCw({ ...cw, reportTargets: cw.reportTargets.filter((x) => x.id !== t.id) }); toast({ kind: "undo", message: "報告先を削除しました", actionLabel: "元に戻す", onAction: () => setCw((c) => ({ ...c, reportTargets: [...c.reportTargets, t] })) }); }} />
            </div>
          ))}
        </div>
      </section>

      <section style={card}>
        <SectionHeading icon="Link2" title="個人用リンク" description="リンク集の「マイリンク」に表示" />
        <Field label="自分の案件シート URL" htmlFor="ln-s"><Input id="ln-s" value={links.sheet} onChange={(e) => setLinks({ ...links, sheet: e.target.value })} /></Field>
        <Field label="ドライブ URL" htmlFor="ln-d"><Input id="ln-d" value={links.drive} onChange={(e) => setLinks({ ...links, drive: e.target.value })} /></Field>
        <Field label="チャットワーク URL" htmlFor="ln-c"><Input id="ln-c" value={links.chatwork} onChange={(e) => setLinks({ ...links, chatwork: e.target.value })} /></Field>
      </section>

      <section style={card}>
        <SectionHeading icon="FileSpreadsheet" title="制作シート" count={sheets.length} description="案件ごとの制作管理シート">
          <Button size="sm" variant="secondary" icon="Plus" onClick={() => setSheets([...sheets, { id: "sh" + Date.now(), project: "", url: "" }])}>追加</Button>
        </SectionHeading>
        {sheets.length === 0 ? <div style={{ ...muted, padding: "4px 0" }}>制作シートはまだ登録されていません。右上の［追加］から。</div> : sheets.map((s) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "200px minmax(0,1fr) 32px", gap: 8, alignItems: "center" }}>
            <Select size="sm" value={s.project} placeholder="案件を選ぶ" options={PROJECTS} onChange={(e) => setSheets(sheets.map((x) => (x.id === s.id ? { ...x, project: e.target.value } : x)))} width="100%" aria-label="案件" />
            <Input size="sm" value={s.url} placeholder="https://docs.google.com/spreadsheets/…" aria-label="シート URL" onChange={(e) => setSheets(sheets.map((x) => (x.id === s.id ? { ...x, url: e.target.value } : x)))} />
            <IconButton icon="Trash2" label="このシートを削除" tone="destructive" onClick={() => { setSheets(sheets.filter((x) => x.id !== s.id)); toast({ kind: "undo", message: "制作シートを削除しました", actionLabel: "元に戻す", onAction: () => setSheets((ss) => [...ss, s]) }); }} />
          </div>
        ))}
      </section>

      {/* ④ 画面下 sticky（白 + 上 border + shadow）。ボタンは primary、位置そのまま */}
      <div style={{ position: "sticky", bottom: 0, marginTop: 8, padding: 12, background: "var(--card)", borderTop: "1px solid var(--border)", boxShadow: "0 -4px 16px oklch(0 0 0 / 0.06)", borderRadius: "var(--radius) var(--radius) 0 0", zIndex: 5 }}>
        <Button variant="primary" block icon="Save" loading={saving} onClick={saveAll}>すべての設定を保存</Button>
      </div>
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { SettingsScreen });
