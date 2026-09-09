import React, { useEffect, useRef } from "react";

const CSS = ".dvb-tabs::-webkit-scrollbar{display:none}";
/**
 * 下線型タブ。ページ内の「別の内容」への切替（同じデータの見方なら SegmentedControl）。
 * アクティブ = 文字 --primary + 下 2px --primary。高さ 40。横スクロール可（スクロールバー非表示）。lucide アイコン・件数は任意。
 * items は文字列か { value, label, icon?, count?, disabled? }
 */
export function Tabs({ items = [], value, onChange, "aria-label": ariaLabel, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const ref = useRef(null);
  useEffect(() => { if (typeof document !== "undefined" && !document.getElementById("dvb-tabs-css")) { const s = document.createElement("style"); s.id = "dvb-tabs-css"; s.textContent = CSS; document.head.appendChild(s); } }, []);
  const list = items.map((t) => (typeof t === "string" ? { value: t, label: t } : t));
  const onKey = (e) => {
    const i = list.findIndex((t) => t.value === value); if (i < 0) return;
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (!dir) return;
    e.preventDefault(); let n = i; do { n = (n + dir + list.length) % list.length; } while (list[n].disabled && n !== i);
    onChange && onChange(list[n].value);
    const btn = ref.current && ref.current.children[n]; btn && btn.focus();
  };
  return (
    <div ref={ref} role="tablist" aria-label={ariaLabel} className="dvb-tabs" onKeyDown={onKey}
      style={{ display: "flex", alignItems: "stretch", height: 40, borderBottom: "1px solid var(--border)", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", fontFamily: "var(--font-sans)", ...style }}>
      {list.map((t) => {
        const on = t.value === value; const I = t.icon && L && L[t.icon];
        return (
          <button key={t.value} type="button" role="tab" aria-selected={on} tabIndex={on ? 0 : -1} disabled={t.disabled} onClick={() => onChange && onChange(t.value)}
            style={{ height: 40, padding: "0 16px", border: 0, borderBottom: `2px solid ${on ? "var(--primary)" : "transparent"}`, marginBottom: -1, background: "transparent", color: t.disabled ? "var(--disabled-foreground)" : on ? "var(--primary)" : "var(--muted-foreground)", fontSize: 14, fontWeight: on ? 600 : 500, lineHeight: 1, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 6, cursor: t.disabled ? "not-allowed" : "pointer", flexShrink: 0, transition: "color var(--duration) var(--ease)" }}>
            {I ? <I size={16} strokeWidth={1.75} aria-hidden /> : null}
            {t.label}
            {t.count != null ? <span style={{ height: 18, minWidth: 20, padding: "0 6px", borderRadius: 9999, background: on ? "var(--primary-subtle)" : "var(--muted)", color: on ? "var(--primary-subtle-foreground)" : "var(--muted-foreground)", fontSize: 12, lineHeight: "18px", fontVariantNumeric: "tabular-nums", textAlign: "center" }}>{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.Tabs = Tabs; }
