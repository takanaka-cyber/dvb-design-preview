import React, { useState } from "react";

/**
 * リンク集のタイル。高さ 44、アイコン + 名前、hover で --muted。
 * 編集モード（editing）で左にドラッグハンドル、右端に ✏️ 👁 🗑 の 3 アイコン（32px）。カテゴリはドット色ではなく見出し（SectionHeading）だけで区別する。
 */
export function LinkTile({ name, icon = "Link2", href = "#", hidden, editing, onEdit, onToggleHidden, onDelete, onClick, style }) {
  const [h, setH] = useState(false);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = (L && L[icon]) || (L && L.Link2);
  const Ext = L && L.ExternalLink, Grip = L && L.GripVertical;
  const ops = [["Pencil", "編集", onEdit], [hidden ? "Eye" : "EyeOff", hidden ? "表示する" : "非表示にする", onToggleHidden], ["Trash2", "削除", onDelete, "var(--negative)"]];
  const base = { display: "flex", alignItems: "center", gap: 10, height: 44, padding: editing ? "0 4px 0 6px" : "0 12px", borderRadius: "var(--radius)", border: "1px solid var(--border)", background: h && !editing ? "var(--muted)" : "var(--card)", color: "var(--foreground)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", opacity: hidden ? 0.55 : 1, transition: "background var(--duration) var(--ease)", minWidth: 0, ...style };
  const body = (<>
    {editing && Grip ? <span aria-hidden style={{ display: "grid", placeItems: "center", width: 20, color: "var(--disabled-foreground)", cursor: "grab", flexShrink: 0 }}><Grip size={16} strokeWidth={1.75} /></span> : null}
    {I ? <I size={18} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" style={{ flexShrink: 0 }} /> : null}
    <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
    {editing ? (
      <span style={{ display: "inline-flex", flexShrink: 0 }}>
        {ops.map(([ic, label, fn, color]) => <OpButton key={ic} icon={ic} label={label} onClick={fn} color={color} />)}
      </span>
    ) : (h && Ext ? <Ext size={14} strokeWidth={1.75} aria-hidden color="var(--muted-foreground)" style={{ flexShrink: 0 }} /> : null)}
  </>);
  if (editing) return <div role="listitem" aria-label={name} style={base} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{body}</div>;
  return <a href={href} target="_blank" rel="noreferrer" onClick={onClick} style={base} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{body}</a>;
}
function OpButton({ icon, label, onClick, color }) {
  const [h, setH] = useState(false);
  const L = typeof window !== "undefined" ? window.LucideReact : null; const I = L && L[icon];
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, borderRadius: "var(--radius-sm)", background: h ? "var(--muted)" : "transparent", color: color || "var(--muted-foreground)", cursor: "pointer", padding: 0 }}>
      {I ? <I size={16} strokeWidth={1.75} aria-hidden /> : null}
    </button>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.LinkTile = LinkTile; }
