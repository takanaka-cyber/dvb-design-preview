import React, { useState } from "react";
import { REGISTER_DEFAULT } from "./data.js";

/* バッチ 3: ログイン /login（PC 1440 + スマホ 393・430）と 登録申請 /register（PC + スマホ 393）。
   サイドバーなし。骨格・ボタン位置は現状維持、AuthCard に載せて見た目だけ変える。入力 高さ 44 / 16px（iOS ズーム防止）。 */
/** 高さ 44 / 16px の 1 行入力（Input と同じ見た目。iOS ズーム防止。認証・アセクリの入力に使う） */
export function BigInput({ value, onChange, placeholder, type = "text", invalid, numeric, disabled, readOnly, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} readOnly={readOnly} aria-invalid={invalid || undefined} inputMode={numeric ? "numeric" : undefined}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ width: "100%", height: 44, padding: "0 12px", fontSize: 16, lineHeight: "24px", fontFamily: "inherit", color: disabled ? "var(--disabled-foreground)" : "var(--foreground)", background: disabled ? "var(--muted)" : "var(--card)",
        border: `1px solid ${invalid ? "var(--negative)" : focus ? "var(--ring)" : "var(--input)"}`, boxShadow: focus ? `0 0 0 3px ${invalid ? "var(--negative-subtle)" : "var(--primary-subtle)"}` : "none", borderRadius: "var(--radius)", outline: "none", boxSizing: "border-box",
        fontVariantNumeric: numeric ? "tabular-nums" : undefined, transition: "border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)", ...style }} {...rest} />
  );
}
/** 認証ページの外枠（--background、中央寄せ。スマホは左右 16px） */
export function AuthPage({ mobile, children }) {
  return (
    <div style={{ flex: 1, minHeight: mobile ? "100%" : 860, display: "flex", alignItems: mobile ? "flex-start" : "center", justifyContent: "center", padding: mobile ? "32px 16px 24px" : "48px 24px", background: "var(--background)", boxSizing: "border-box", overflow: "auto" }}>
      {children}
    </div>
  );
}

/* ================= ログイン ================= */
export function LoginScreen({ state = "normal", toast, mobile, onNavigate }) {
  const { AuthCard, Field, Button } = window.DVB; const Input = BigInput;
  const [email, setEmail] = useState(state === "error" ? "okura@example.com" : "");
  const [pw, setPw] = useState(state === "error" ? "********" : "");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(state === "error" ? "メールアドレスまたはパスワードが違います" : null);
  const submit = (e) => { e && e.preventDefault(); if (!email || !pw) { setErr("メールアドレスとパスワードを入力してください"); return; } setLoading(true); setTimeout(() => { setLoading(false); setErr(null); toast({ kind: "success", message: "ログインしました" }); onNavigate && onNavigate("dashboard"); }, 900); };
  const link = (label, to) => <a href={`#screen=${to}`} onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate(to) : toast({ kind: "info", message: label }); }} style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>{label}</a>;
  return (
    <AuthPage mobile={mobile}>
      <AuthCard mobile={mobile} description="デイリー業務一元管理システム" error={err} footer={<span>アカウントをお持ちでない方は {link("登録申請", "register")}</span>}>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Field label="メールアドレス" htmlFor="lg-email"><Input id="lg-email" type="email" autoComplete="email" value={email} invalid={!!err && !email} placeholder="name@example.com" onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="パスワード" htmlFor="lg-pw">
            <span style={{ position: "relative", display: "flex" }}>
              <Input id="lg-pw" type={show ? "text" : "password"} autoComplete="current-password" value={pw} invalid={!!err && !pw} onChange={(e) => setPw(e.target.value)} />
              <button type="button" aria-label={show ? "パスワードを隠す" : "パスワードを表示"} aria-pressed={show} onClick={() => setShow(!show)} style={{ position: "absolute", right: 4, top: 6, width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>{show ? <window.LucideReact.EyeOff size={16} strokeWidth={1.75} /> : <window.LucideReact.Eye size={16} strokeWidth={1.75} />}</button>
            </span>
          </Field>
          <Button type="submit" variant="primary" block loading={loading} style={{ height: 44, fontSize: 15 }}>ログイン</Button>
        </form>
      </AuthCard>
    </AuthPage>
  );
}

/* ================= 登録申請 ================= */
export function RegisterScreen({ state = "normal", toast, mobile, onNavigate }) {
  const { AuthCard, Field, Button, DraftRestoreBanner } = window.DVB; const Input = BigInput;
  const { IconButton } = window.DVBKit;
  const L = window.LucideReact;
  const [f, setF] = useState(REGISTER_DEFAULT);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(state === "success");
  const [draft, setDraft] = useState(state === "error");
  const [err, setErr] = useState(state === "error" ? "送信に失敗しました。入力内容はブラウザに退避済みです。" : null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const setAcc = (i, v) => setF({ ...f, reportAccountIds: f.reportAccountIds.map((x, j) => (j === i ? v : x)) });
  const valid = f.name && f.email && f.password.length >= 8;
  const submit = (e) => { e && e.preventDefault(); if (!valid) { setErr("お名前・メールアドレス・パスワード（8 文字以上）は必須です"); return; } setLoading(true); setTimeout(() => { setLoading(false); setErr(null); setDone(true); }, 900); };
  const link = (label, to) => <a href={`#screen=${to}`} onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate(to) : toast({ kind: "info", message: label }); }} style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>{label}</a>;
  const divider = (label) => <div role="separator" style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}><span style={{ flex: 1, height: 1, background: "var(--border)" }} /><span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{label}</span><span style={{ flex: 1, height: 1, background: "var(--border)" }} /></div>;
  const help = { fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" };

  if (done) {
    return (
      <AuthPage mobile={mobile}>
        <AuthCard mobile={mobile} icon="CircleCheck" iconTone="positive" title="申請完了" description="管理者が承認するとログインできます。承認はチャットワークで通知されます。">
          <Button variant="secondary" block style={{ height: 44 }} onClick={() => onNavigate && onNavigate("login")}>ログイン画面に戻る</Button>
        </AuthCard>
      </AuthPage>
    );
  }
  return (
    <AuthPage mobile={mobile}>
      <AuthCard mobile={mobile} title="登録申請" description="承認後にログインできます" error={err} footer={<span>すでにアカウントがある方は {link("ログイン", "login")}</span>}>
        {draft ? <DraftRestoreBanner time="9/9 15:40" onRestore={() => { setF({ ...REGISTER_DEFAULT, name: "研修生A", email: "trainee-a@example.com", roomId: "312345678", accountId: "1234567", reportRoomId: "312345678", reportAccountIds: ["7654321"] }); setDraft(false); setErr(null); toast({ kind: "success", message: "入力内容を復元しました" }); }} onDiscard={() => setDraft(false)} /> : null}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 基本情報 */}
          <Field label="お名前" htmlFor="rg-name" required><Input id="rg-name" value={f.name} onChange={set("name")} placeholder="姓 名" autoComplete="name" /></Field>
          <Field label="メールアドレス" htmlFor="rg-email" required><Input id="rg-email" type="email" value={f.email} onChange={set("email")} placeholder="name@example.com" autoComplete="email" /></Field>
          <Field label="パスワード" htmlFor="rg-pw" required help="8 文字以上">
            <span style={{ position: "relative", display: "flex" }}>
              <Input id="rg-pw" type={show ? "text" : "password"} value={f.password} onChange={set("password")} autoComplete="new-password" />
              <button type="button" aria-label={show ? "パスワードを隠す" : "パスワードを表示"} aria-pressed={show} onClick={() => setShow(!show)} style={{ position: "absolute", right: 4, top: 6, width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>{show ? <L.EyeOff size={16} strokeWidth={1.75} /> : <L.Eye size={16} strokeWidth={1.75} />}</button>
            </span>
          </Field>
          {/* 区切り: チャットワーク設定 */}
          {divider("チャットワーク設定")}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <Field label="ルーム ID" htmlFor="rg-room" help="自分の日報が届くルーム"><Input id="rg-room" value={f.roomId} onChange={set("roomId")} placeholder="312345678" numeric /></Field>
            <Field label="アカウント ID" htmlFor="rg-acc" help="チャットワークのアカウント ID"><Input id="rg-acc" value={f.accountId} onChange={set("accountId")} placeholder="1234567" numeric /></Field>
          </div>
          <Field label="タスク報告先 ルーム ID" htmlFor="rg-rroom" help="タスク送信の通知先。空欄なら上のルーム ID と同じ"><Input id="rg-rroom" value={f.reportRoomId} onChange={set("reportRoomId")} placeholder="312345678" numeric /></Field>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label htmlFor="rg-racc-0" style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500 }}>タスク報告先 アカウント ID</label>
              <Button size="sm" variant="ghost" icon="Plus" onClick={() => setF({ ...f, reportAccountIds: [...f.reportAccountIds, ""] })}>追加</Button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {f.reportAccountIds.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Input id={`rg-racc-${i}`} value={v} onChange={(e) => setAcc(i, e.target.value)} placeholder="7654321" numeric aria-label={`タスク報告先 アカウント ID ${i + 1}`} />
                  {f.reportAccountIds.length > 1 ? <IconButton icon="Trash2" label="この行を削除" tone="destructive" onClick={() => setF({ ...f, reportAccountIds: f.reportAccountIds.filter((_, j) => j !== i) })} /> : null}
                </div>
              ))}
            </div>
            <p style={{ margin: 0, ...help }}>タスク送信時に TO を付ける相手。上長のアカウント ID を入れてください</p>
          </div>
          <Button type="submit" variant="primary" block loading={loading} style={{ height: 44, fontSize: 15 }}>登録申請</Button>
          <p style={{ margin: 0, ...help, textAlign: "center" }}>申請後、管理者の承認をお待ちください。承認まで 1〜2 営業日かかることがあります。</p>
        </form>
      </AuthCard>
    </AuthPage>
  );
}

window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { AuthPage, BigInput, LoginScreen, RegisterScreen });
