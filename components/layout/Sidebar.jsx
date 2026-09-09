import React, { useState } from "react";

/**
 * サイドバー。幅 248 / 折りたたみ 56。groups: [{ label, items: [{ key, label, icon, badge }] }]
 * 現在地は --primary-subtle 背景 + --primary-subtle-foreground 文字 + 左 2px バー。
 */
export function Sidebar({ groups = [], activeKey, onSelect, collapsed = false, onToggle, user, date, time, height = "100%", style }) {
  const [hover, setHover] = useState(null);
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Toggle = L && (collapsed ? L.PanelLeftOpen : L.PanelLeftClose);
  const LogOut = L && L.LogOut;
  const w = collapsed ? 56 : 248;
  return (
    <nav aria-label="メインナビゲーション" style={{ width: w, minWidth: w, height, display: "flex", flexDirection: "column", background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)", color: "var(--sidebar-foreground)", fontFamily: "var(--font-sans)", transition: "width var(--duration) var(--ease)", overflow: "hidden", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", height: 56, padding: collapsed ? 0 : "0 12px 0 16px", borderBottom: "1px solid var(--sidebar-border)", flexShrink: 0 }}>
        {!collapsed ? <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.04em", color: "var(--foreground)" }}>AXIS</span> : null}
        <button type="button" onClick={onToggle} aria-label={collapsed ? "サイドバーを開く" : "サイドバーを閉じる"} style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>{Toggle ? <Toggle size={16} /> : "≡"}</button>
      </div>
      {!collapsed && (date || time) ? (
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--sidebar-border)", display: "flex", alignItems: "baseline", gap: 8, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{date}</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>{time}</span>
        </div>
      ) : null}
      <div style={{ flex: 1, overflowY: "auto", padding: collapsed ? "8px 8px" : "8px 12px" }}>
        {groups.map((g) => (
          <div key={g.label} style={{ marginBottom: 8 }}>
            {!collapsed ? <div style={{ padding: "8px 8px 4px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "var(--muted-foreground)" }}>{g.label}</div> : <div style={{ height: 1, background: "var(--sidebar-border)", margin: "8px 4px" }} />}
            {g.items.map((it) => {
              const active = it.key === activeKey;
              const I = L && L[it.icon];
              return (
                <button key={it.key} type="button" aria-current={active ? "page" : undefined} title={collapsed ? it.label : undefined} onClick={() => onSelect && onSelect(it.key)}
                  onMouseEnter={() => setHover(it.key)} onMouseLeave={() => setHover(null)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", height: 36, padding: collapsed ? 0 : "0 8px", justifyContent: collapsed ? "center" : "flex-start",
                    border: 0, borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, textAlign: "left", position: "relative",
                    background: active ? "var(--sidebar-accent)" : hover === it.key ? "var(--muted)" : "transparent",
                    color: active ? "var(--sidebar-accent-foreground)" : "var(--sidebar-foreground)", transition: "background var(--duration) var(--ease)",
                  }}>
                  {active ? <span aria-hidden style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, borderRadius: 1, background: "var(--sidebar-primary)" }} /> : null}
                  {I ? <I size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0, marginLeft: active && !collapsed ? 2 : 0 }} /> : null}
                  {!collapsed ? <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span> : null}
                  {!collapsed && it.badge != null ? <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 9999, background: it.badgeTone === "negative" ? "var(--negative-subtle)" : "var(--muted)", color: it.badgeTone === "negative" ? "var(--negative-subtle-foreground)" : "var(--muted-foreground)", fontSize: 11, fontWeight: 600, lineHeight: "20px", textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{it.badge}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {user ? (
        <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: collapsed ? "8px" : "10px 12px", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <span aria-hidden style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary-subtle)", color: "var(--primary-subtle-foreground)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{user.name.slice(0, 1)}</span>
          {!collapsed ? <><span style={{ flex: 1, minWidth: 0 }}><span style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</span>{user.role ? <span style={{ display: "block", fontSize: 12, color: "var(--muted-foreground)" }}>{user.role}</span> : null}</span>
            <button type="button" aria-label="ログアウト" style={{ width: 32, height: 32, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "var(--muted-foreground)", borderRadius: "var(--radius-sm)", cursor: "pointer" }}>{LogOut ? <LogOut size={16} /> : "⎋"}</button></> : null}
        </div>
      ) : null}
    </nav>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Sidebar = Sidebar; }
