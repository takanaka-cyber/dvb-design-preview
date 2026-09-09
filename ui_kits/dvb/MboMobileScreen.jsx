import React, { useState } from "react";
import { MBO_HISTORY } from "./data.js";

/** 日報 スマホ（393 / 430）。MboScreen の骨格を縦 1 カラムに。［完了して送信］は画面下端に固定。state: normal | empty | sent | night(0〜5時) */
export function MboMobileScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, Button, Field, Textarea, SaveStatus, ConfirmDialog } = window.DVB;
  const L = window.LucideReact; const Check = L.Check, Chev = L.ChevronRight;
  const empty = state === "empty", night = state === "night";
  const [good, setGood] = useState(empty || night ? "" : "【行ったこと(事実)】\nD社 サプリのシュリンク要因を媒体別に分解。Google の CPA 上昇が主因と判明");
  const [bad, setBad] = useState(empty || night ? "" : "LP 側の切り分けまで進められなかった");
  const [save, setSave] = useState(empty || night ? "idle" : "saved");
  const [sent, setSent] = useState(state === "sent");
  const [off, setOff] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [touched, setTouched] = useState(false);
  const onEdit = (set) => (e) => { set(e.target.value); setSave("saving"); clearTimeout(onEdit.t); onEdit.t = setTimeout(() => setSave("saved"), 900); };
  const badMissing = touched && !bad.trim();
  const submit = () => { setTouched(true); if (!good.trim() || !bad.trim()) { toast({ kind: "error", message: "必須項目が未入力です" }); return; } setConfirm(true); };
  const doSend = () => { setConfirm(false); setSent(true); toast({ kind: "success", message: "送信しました。チャットワークに通知されます" }); };
  const boss = MBO_HISTORY.find((h) => h.d === 8)?.comment;
  const taStyle = { fontSize: 16, lineHeight: "24px", minHeight: 160 };
  const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <PageHeader title={"日報 9/9（火）"} style={{ alignItems: "center" }}>
          <SaveStatus state={sent ? "saved" : save} time={sent ? "18:42" : undefined} />
          {!sent ? <Button size="sm" variant="ghost" aria-pressed={off} onClick={() => { setOff(!off); toast({ kind: off ? "success" : "undo", message: off ? "休みを解除しました" : "本日を休みとして登録しました", actionLabel: off ? undefined : "元に戻す", onAction: () => setOff(false) }); }}>{off ? "休みを解除" : "本日休み"}</Button> : null}
        </PageHeader>
        <a href="#screen=mbo-history" onClick={(e) => { e.preventDefault(); onNavigate ? onNavigate("mbo-history") : toast({ kind: "info", message: "履歴一覧を開く" }); }} style={{ display: "inline-flex", alignItems: "center", gap: 2, minHeight: 44, fontSize: 14, fontWeight: 500, color: "var(--primary)", textDecoration: "none", alignSelf: "flex-start" }}>過去の日報<Chev size={16} /></a>

        {night ? <div role="status" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", fontSize: 14, lineHeight: "20px" }}><L.Info size={16} strokeWidth={1.75} aria-hidden style={{ color: "var(--info)", flexShrink: 0 }} />この日報は 9/8（月）分として保存されます</div> : null}

        {off ? (
          <div role="status" style={{ padding: "12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", fontSize: 14, lineHeight: "20px" }}>本日は休みとして登録されています。日報リマインドは届きません。</div>
        ) : (
          <>
            <Field label="良かった動き / 学んだこと" required htmlFor="m-good">
              <Textarea id="m-good" rows={6} value={good} onChange={onEdit(setGood)} readOnly={sent} placeholder="今日うまく行ったこと、学んだこと" style={taStyle} />
            </Field>
            <Field label="反省点 / 改善点" required htmlFor="m-bad" error={badMissing && !sent ? "反省点 / 改善点を入力してください" : undefined}>
              <Textarea id="m-bad" rows={6} value={bad} onChange={onEdit(setBad)} readOnly={sent} invalid={badMissing && !sent} placeholder="反省点や次に改善したいこと" style={taStyle} />
            </Field>
            {!sent ? <p style={{ margin: 0, fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" }}>入力内容は自動保存されます。「完了して送信」を押すとチャットワークに通知されます。</p> : null}
          </>
        )}

        {boss && !empty && !night ? (
          <section style={{ ...card, gap: 6 }} aria-label="上長コメント">
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <L.MessageSquare size={16} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" />
              <span style={{ fontWeight: 600 }}>{boss.by}</span>
              <span style={{ color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{boss.at}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "22px" }}>{boss.text}</p>
          </section>
        ) : null}
      </div>

      {!off ? (
        <div style={{ position: "sticky", bottom: 0, margin: "16px -16px 0", padding: "12px 16px calc(12px + 34px)", background: "var(--card)", borderTop: "1px solid var(--border)" }}>
          {sent ? <div role="status" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 48, borderRadius: "var(--radius)", background: "var(--positive-subtle)", color: "var(--positive-subtle-foreground)", fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}><Check size={18} strokeWidth={2.25} />送信済み 18:42</div>
            : <Button variant="primary" block icon="Send" onClick={submit} style={{ height: 48, fontSize: 16 }}>完了して送信</Button>}
        </div>
      ) : <div style={{ height: 16 }} />}
      {confirm ? <ConfirmDialog destructive={false} title="日報を送信しますか？" description="送信後は内容を変更できません。チャットワークに通知されます。" confirmLabel="完了して送信" onConfirm={doSend} onCancel={() => setConfirm(false)} /> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; window.DVBKit.MboMobileScreen = MboMobileScreen;
