import React, { useState } from "react";

/**
 * サイドバー。幅 248 / 折りたたみ 56 / スマホは drawer（幅 280、背景 40% 黒）。
 * groups: [{ label, items: [{ key, label, icon, badge, badgeTone }] }]
 * 現在地は --primary-subtle 背景 + 左 2px --primary バー。グループ見出し 12px / muted-foreground / 上余白 16。折りたたみ時は 1px 区切り線。
 * 下端: ユーザー名 + ロール Badge + 設定。
 */
export function Sidebar({ groups = [], activeKey, onSelect, collapsed = false, onToggle, user, date, time, height = "100%", drawer = false, open = false, onClose, onSettings, style }) {
  const [hover, setHover] = useState(null);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Toggle = L && (collapsed ? L.PanelLeftOpen : L.PanelLeftClose);
  const Settings = L && L.Settings, X = L && L.X;
  const c = collapsed && !drawer;
  const w = drawer ? 280 : c ? 56 : 248;
  const nav = (
    <nav aria-label="メインナビゲーション" style={{ width: w, minWidth: w, height: drawer ? "100%" : height, display: "flex", flexDirection: "column", background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)", color: "var(--sidebar-foreground)", fontFamily: "var(--font-sans)", transition: "width var(--duration) var(--ease)", overflow: "hidden", ...(drawer ? {} : style) }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: c ? "center" : "space-between", height: 56, padding: c ? 0 : "0 12px 0 16px", borderBottom: "1px solid var(--sidebar-border)", flexShrink: 0 }}>
        {!c ? <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.04em", color: "var(--foreground)" }}>AXIS</span> : null}
        {drawer
          ? <button type="button" onClick={onClose} aria-label="メニューを閉じる" style={{ width: 44, height: 44, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer", marginRight: -8 }}>{X ? <X size={20} /> : "×"}</button>
          : <button type="button" onClick={onToggle} aria-label={c ? "サイドバーを開く" : "サイドバーを閉じる"} style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>{Toggle ? <Toggle size={16} /> : "≡"}</button>}
      </div>
      {!c && (date || time) ? (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--sidebar-border)", display: "flex", alignItems: "baseline", gap: 8, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{date}</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>{time}</span>
        </div>
      ) : null}
      <div style={{ flex: 1, overflowY: "auto", padding: c ? "8px 8px" : "0 12px 8px" }}>
        {groups.map((g, gi) => (
          <div key={g.label}>
            {!c ? <div style={{ padding: `${gi === 0 ? 12 : 16}px 8px 4px`, fontSize: 12, lineHeight: "16px", fontWeight: 500, color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.label}</div> : gi > 0 ? <div style={{ height: 1, background: "var(--sidebar-border)", margin: "8px 4px" }} /> : null}
            {g.items.map((it) => {
              const active = it.key === activeKey;
              const I = L && L[it.icon];
              const h = drawer ? 44 : 36;
              return (
                <button key={it.key} type="button" aria-current={active ? "page" : undefined} title={c ? it.label : undefined} onClick={() => onSelect && onSelect(it.key)}
                  onMouseEnter={() => setHover(it.key)} onMouseLeave={() => setHover(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", height: h, padding: c ? 0 : "0 8px", justifyContent: c ? "center" : "flex-start",
                    border: 0, borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, textAlign: "left", position: "relative",
                    background: active ? "var(--sidebar-accent)" : hover === it.key ? "var(--muted)" : "transparent",
                    color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)", transition: "background var(--duration) var(--ease)",
                  }}>
                  {active ? <span aria-hidden style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, borderRadius: 1, background: "var(--sidebar-primary)" }} /> : null}
                  {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0, marginLeft: active && !c ? 2 : 0 }} /> : null}
                  {!c ? <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span> : null}
                  {!c && it.badge != null ? <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 9999, background: it.badgeTone === "negative" ? "var(--negative-subtle)" : "var(--muted)", color: it.badgeTone === "negative" ? "var(--negative-subtle-foreground)" : "var(--muted-foreground)", fontSize: 11, fontWeight: 600, lineHeight: "20px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{it.badge}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {user ? (
        <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: c ? "8px" : "10px 12px", display: "flex", alignItems: "center", gap: 10, justifyContent: c ? "center" : "flex-start" }}>
          <span aria-hidden style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{user.name.slice(0, 1)}</span>
          {!c ? <>
            <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</span>
              {user.role ? <span style={{ height: 20, padding: "0 8px", borderRadius: 9999, background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, lineHeight: "20px", whiteSpace: "nowrap", flexShrink: 0 }}>{user.role}</span> : null}
            </span>
            <button type="button" aria-label="設定" title="設定" onClick={onSettings} style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer", flexShrink: 0 }}>{Settings ? <Settings size={16} strokeWidth={1.75} /> : "⚙"}</button>
          </> : null}
        </div>
      ) : null}
    </nav>
  );
  if (!drawer) return nav;
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="メニュー" style={{ position: "absolute", inset: 0, zIndex: 50, display: "flex", ...style }}>
      <div style={{ boxShadow: "0 8px 24px oklch(0 0 0 / 0.16)", height: "100%" }}>{nav}</div>
      <button type="button" aria-label="メニューを閉じる" onClick={onClose} style={{ flex: 1, border: 0, background: "oklch(0 0 0 / 0.4)", cursor: "pointer", padding: 0 }} />
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Sidebar = Sidebar; }
