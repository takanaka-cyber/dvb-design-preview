import React, { useState } from "react";

const MEDIA = { FB: "fb", TikTok: "tiktok", Google: "google" };

/**
 * タスク1行。チェック / 本文 / 担当者チップ / 期限ピル（超過は negative）/ 媒体タグ / メニュー。
 * mode="edit" で行内追加の入力状態（案件 Select・担当 Select・本文・期限・追加）。
 */
export function TaskRow({ mode = "view", done, text, assignee, due, overdue, media, onToggle, onMenu, onSubmit, onCancel, projects = [], assignees = [], project, compact, style }) {
  const [hover, setHover] = useState(false);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Check = L && L.Check, More = L && L.Ellipsis, Cal = L && L.Calendar;
  const h = compact ? 36 : 44;

  if (mode === "edit") {
    const ctl = { height: 32, fontSize: 13, border: "1px solid var(--input)", borderRadius: "var(--radius-sm)", background: "var(--card)", color: "var(--foreground)", padding: "0 8px", outline: "none" };
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(new FormData(e.currentTarget)); }}
        style={{ display: "grid", gridTemplateColumns: "minmax(140px,180px) minmax(100px,140px) minmax(0,1fr) 130px auto auto", gap: 8, alignItems: "center", minHeight: h, padding: "6px 8px 6px 12px", background: "var(--primary-subtle)", borderRadius: "var(--radius-sm)", ...style }}>
        <select name="project" defaultValue={project || ""} required style={ctl}><option value="" disabled>案件</option>{projects.map((p) => <option key={p}>{p}</option>)}</select>
        <select name="assignee" defaultValue={assignee || ""} required style={ctl}><option value="" disabled>担当</option>{assignees.map((p) => <option key={p}>{p}</option>)}</select>
        <input name="text" autoFocus placeholder="タスクを入力（Enter で追加、Esc で閉じる）" required style={{ ...ctl, minWidth: 0 }} onKeyDown={(e) => { if (e.key === "Escape") onCancel && onCancel(); }} />
        <input name="due" type="date" aria-label="期限" style={{ ...ctl, fontVariantNumeric: "tabular-nums" }} />
        <button type="submit" style={{ height: 32, padding: "0 12px", borderRadius: "var(--radius-sm)", border: 0, background: "var(--primary)", color: "var(--primary-foreground)", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>追加</button>
        <button type="button" onClick={onCancel} style={{ height: 32, padding: "0 10px", borderRadius: "var(--radius-sm)", border: 0, background: "transparent", color: "var(--muted-foreground)", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>キャンセル</button>
      </form>
    );
  }

  const dueColor = done ? "var(--muted-foreground)" : overdue ? "var(--negative)" : "var(--muted-foreground)";
  return (
    <div role="row" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 10, minHeight: h, padding: "0 4px 0 8px", borderRadius: "var(--radius-sm)", background: hover ? "var(--accent)" : "transparent", transition: "background var(--duration) var(--ease)", ...style }}>
      <button type="button" role="checkbox" aria-checked={!!done} onClick={onToggle} aria-label={done ? "未完了に戻す" : "完了にする"}
        style={{ width: 18, height: 18, flexShrink: 0, borderRadius: 4, border: `1.5px solid ${done ? "var(--primary)" : "var(--muted-foreground)"}`, background: done ? "var(--primary)" : "var(--card)", color: "var(--primary-foreground)", display: "grid", placeItems: "center", cursor: "pointer", padding: 0 }}>
        {done && Check ? <Check size={12} strokeWidth={3} /> : null}
      </button>
      <span style={{ flex: 1, minWidth: 0, fontSize: 13, lineHeight: "18px", color: done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: done ? "line-through" : "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</span>
      {media ? <span style={{ height: 20, padding: "0 6px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 500, lineHeight: "20px", background: `var(--media-${MEDIA[media] || "other"})`, color: `var(--media-${MEDIA[media] || "other"}-foreground)`, whiteSpace: "nowrap" }}>{media}</span> : null}
      {assignee ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 22, padding: "0 8px 0 2px", borderRadius: 9999, background: "var(--muted)", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
          <span aria-hidden style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 600 }}>{assignee.slice(0, 1)}</span>{assignee}
        </span>
      ) : null}
      {due ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 8px", borderRadius: 9999, fontSize: 12, fontWeight: 500, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: dueColor, background: overdue && !done ? "var(--negative-subtle)" : "transparent", border: overdue && !done ? "1px solid transparent" : "1px solid var(--border)" }}>
          {Cal ? <Cal size={12} strokeWidth={2} /> : null}{due}{overdue && !done ? " 超過" : ""}
        </span>
      ) : null}
      <button type="button" aria-label="メニュー" onClick={onMenu} style={{ width: 28, height: 28, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer", opacity: hover ? 1 : 0.35 }}>
        {More ? <More size={16} /> : "…"}
      </button>
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.TaskRow = TaskRow; }
