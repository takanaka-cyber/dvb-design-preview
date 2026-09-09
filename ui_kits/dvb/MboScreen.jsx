import React, { useState } from "react";
import { MBO_RECENT } from "./data.js";

/** 日報（/mbo）。守る: 自動保存の注記、「完了して送信」1ボタン、完了後は編集導線を出さない。 */
export function MboScreen({ state = "normal", toast, narrow }) {
  const { PageHeader, Button, Field, Textarea, SaveStatus, EmptyState, SectionHeading, Badge, ConfirmDialog } = window.DVB;
  const loading = state === "loading", error = state === "error", empty = state === "empty";
  const [good, setGood] = useState(empty || loading ? "" : "【行ったこと(事実)】\nGG 週次案件ボードの雛形を作り、A社・C社の今週タスクを入力した");
  const [bad, setBad] = useState("");
  const [save, setSave] = useState(error ? "error" : empty ? "idle" : "saved");
  const [sent, setSent] = useState(state === "sent");
  const [off, setOff] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const onEdit = (set) => (e) => { set(e.target.value); if (error) return; setSave("saving"); clearTimeout(onEdit.t); onEdit.t = setTimeout(() => setSave("saved"), 900); };
  const badMissing = touched && !bad.trim();
  const submit = () => { setTouched(true); if (!good.trim() || !bad.trim()) { toast({ kind: "error", message: "必須項目が未入力です" }); return; } setConfirm(true); };
  const doSend = () => { setConfirm(false); setSent(true); toast({ kind: "success", message: "送信しました。チャットワークに通知されます" }); };

  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: narrow ? 16 : 24, display: "flex", flexDirection: "column", gap: 16 };
  const L = window.LucideReact; const Check = L.Check;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 960 }}>
      <PageHeader icon="BookOpen" title="日報" description="毎日の振り返り">
        <SaveStatus state={sent ? "saved" : save} time={sent ? "送信 15:58" : "15:56"} onRetry={() => { setSave("saving"); setTimeout(() => setSave("error"), 800); }} />
        <Button icon="CalendarDays">月別管理</Button>
      </PageHeader>

      <section style={card} aria-busy={loading || undefined}>
        <SectionHeading icon="PenLine" title="2026年9月8日（火）の振り返り">
          {sent ? <Badge value="done" label="送信済み 15:58" /> : <Button size="sm" icon="Coffee" onClick={() => { setOff(!off); toast({ kind: off ? "success" : "undo", message: off ? "休みを解除しました" : "本日を休みとして登録しました", actionLabel: off ? undefined : "元に戻す", onAction: () => setOff(false) }); }} aria-pressed={off} disabled={loading}>{off ? "休みを解除" : "本日休み"}</Button>}
        </SectionHeading>

        {off ? (
          <div role="status" style={{ padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", fontSize: 14 }}>本日は休みとして登録されています。日報リマインドは届きません。</div>
        ) : loading ? (
          <div style={{ display: "grid", gap: 16 }}>{[0, 1].map((i) => <div key={i} style={{ display: "grid", gap: 8 }}><span style={{ height: 14, width: 240, background: "var(--muted)", borderRadius: 4 }} /><span style={{ height: 96, background: "var(--muted)", borderRadius: "var(--radius)" }} /></div>)}<span style={{ height: 44, background: "var(--muted)", borderRadius: "var(--radius)" }} /></div>
        ) : (
          <>
            {error ? <div role="alert" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--negative-subtle)", color: "var(--negative-subtle-foreground)", fontSize: 14 }}>保存できませんでした。入力内容はこの画面に残っています。接続を確認して「再試行」を押してください。</div> : null}
            <Field label="良かった動き / 学んだこと（うまく行った事）" required htmlFor="good">
              <Textarea id="good" rows={4} value={good} onChange={onEdit(setGood)} readOnly={sent} placeholder="今日うまく行ったこと、学んだことを記入してください" />
            </Field>
            <Field label="反省点 / 改善点（思うように上手く行かなかった事）" required htmlFor="bad" error={badMissing && !sent ? "反省点 / 改善点を入力してください" : undefined}>
              <Textarea id="bad" rows={4} value={bad} onChange={onEdit(setBad)} readOnly={sent} invalid={badMissing && !sent} placeholder="反省点や次に改善したいことを記入してください" />
            </Field>
            {sent ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: "var(--radius)", background: "var(--positive-subtle)", color: "var(--positive-subtle-foreground)", fontSize: 14, fontWeight: 500 }}><Check size={16} strokeWidth={2} />送信済みです。送信後の内容は変更できません。</div>
            ) : (
              <Button variant="primary" block icon="Send" onClick={submit} disabled={error}>完了して送信</Button>
            )}
            <p style={{ margin: 0, textAlign: "center", fontSize: 13, color: "var(--muted-foreground)" }}>入力内容は自動保存されます。「完了して送信」を押すとチャットワークに通知されます。</p>
          </>
        )}
      </section>

      <SectionHeading title="最近の振り返り" count={empty || error ? 0 : MBO_RECENT.length}><Button size="sm" variant="ghost" icon="History">履歴をすべて見る</Button></SectionHeading>
      {loading ? [0, 1].map((i) => <div key={i} style={{ ...card, gap: 8 }}><span style={{ height: 14, width: 160, background: "var(--muted)", borderRadius: 4 }} /><span style={{ height: 40, background: "var(--muted)", borderRadius: 4 }} /></div>)
        : error ? <div style={{ ...card, alignItems: "center", color: "var(--muted-foreground)", fontSize: 14 }}>最近の振り返りを取得できませんでした。<Button size="sm" onClick={() => toast({ kind: "info", message: "再読み込みしています…" })}>再読み込み</Button></div>
        : empty ? <div style={card}><EmptyState icon="BookOpen" title="まだ振り返りがありません。" description="今日の分を上で記入して送信すると、ここに並びます。" /></div>
        : MBO_RECENT.map((m) => (
          <article key={m.date} style={{ ...card, gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{m.date}</span><span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>送信済み</span></div>
            <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: 16 }}>
              <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>良かった動き / 学んだこと</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{m.good}</div></div>
              <div><div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", marginBottom: 4 }}>反省点 / 改善点</div><div style={{ fontSize: 14, lineHeight: "22px", whiteSpace: "pre-wrap" }}>{m.bad}</div></div>
            </div>
          </article>
        ))}

      {confirm ? <ConfirmDialog destructive={false} title="日報を送信しますか？" description="送信後は内容を変更できません。チャットワークに通知されます。" confirmLabel="完了して送信" onConfirm={doSend} onCancel={() => setConfirm(false)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.MboScreen = MboScreen;
