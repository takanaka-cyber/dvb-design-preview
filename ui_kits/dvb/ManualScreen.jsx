import React, { useState, useRef } from "react";
import { MANUAL_SECTIONS } from "./data.js";

/* バッチ 2: マニュアル /manual。左 260 の固定 TOC（sticky）+ 右 本文 max-w-4xl。負マージンの全画面レイアウトは維持。lg 未満は TOC → PageHeader 右の「目次」ボタン（Dialog）。 */
const muted = { fontSize: 13, color: "var(--muted-foreground)" };

function Block({ b }) {
  if (b.t === "p") return <p style={{ margin: 0, fontSize: 14, lineHeight: "24px" }}>{b.text}</p>;
  if (b.t === "h3") return <h3 style={{ margin: "8px 0 0", fontSize: 16, lineHeight: "24px", fontWeight: 600, paddingLeft: 10, borderLeft: "3px solid var(--border)" }}>{b.text}</h3>;
  if (b.t === "ul") return <ul style={{ margin: 0, paddingLeft: 22, fontSize: 14, lineHeight: "24px", display: "grid", gap: 2 }}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>;
  if (b.t === "quote") return <blockquote style={{ margin: 0, padding: "10px 14px", borderLeft: "3px solid var(--info)", borderRadius: "0 var(--radius) var(--radius) 0", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", fontSize: 14, lineHeight: "22px" }}>{b.text}</blockquote>;
  if (b.t === "code") return <pre style={{ margin: 0, padding: "12px 14px", borderRadius: "var(--radius)", background: "var(--muted)", color: "var(--foreground)", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: "20px", overflow: "auto", whiteSpace: "pre-wrap" }}>{b.text}</pre>;
  if (b.t === "table") {
    const th = { background: "var(--muted)", color: "var(--muted-foreground)", fontSize: 12, fontWeight: 500, padding: "6px 12px", textAlign: "left", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" };
    const td = { padding: "8px 12px", fontSize: 13, lineHeight: "18px", borderBottom: "1px solid var(--border)", verticalAlign: "top" };
    return (
      <div style={{ overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
        <table style={{ borderCollapse: "separate", borderSpacing: 0, width: "100%" }}>
          <thead><tr>{b.columns.map((c) => <th key={c} style={th}>{c}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ ...td, fontWeight: j === 0 ? 500 : 400, borderBottom: i === b.rows.length - 1 ? 0 : td.borderBottom }}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  return null;
}

export function ManualScreen({ state = "normal", toast, narrow }) {
  const { PageHeader, Button, Dialog } = window.DVB;
  const compact = state === "compact";
  const [active, setActive] = useState(MANUAL_SECTIONS[0].id);
  const [tocOpen, setTocOpen] = useState(false);
  const refs = useRef({});
  const go = (id) => { setActive(id); setTocOpen(false); const el = refs.current[id]; if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 64; window.scrollTo({ top, behavior: "smooth" }); } };
  const toc = (inDialog) => (
    <nav aria-label="目次" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {!inDialog ? <div style={{ ...muted, fontWeight: 500, padding: "0 12px 8px" }}>目次</div> : null}
      {MANUAL_SECTIONS.map((s) => { const on = s.id === active; return (
        <button key={s.id} type="button" aria-current={on ? "true" : undefined} onClick={() => go(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, height: 36, padding: "0 12px", border: 0, borderLeft: `2px solid ${on ? "var(--primary)" : "transparent"}`, borderRadius: "0 var(--radius-sm) var(--radius-sm) 0", background: on ? "var(--primary-subtle)" : "transparent", color: on ? "var(--primary-subtle-foreground)" : "var(--foreground)", fontSize: 14, fontWeight: on ? 600 : 500, textAlign: "left", cursor: "pointer", whiteSpace: "nowrap" }}>
          <span style={{ fontVariantNumeric: "tabular-nums", color: on ? "var(--primary)" : "var(--muted-foreground)", minWidth: 16 }}>{s.num}</span>{s.title}
        </button>
      ); })}
    </nav>
  );
  return (
    <div style={{ margin: -24, display: "flex", minHeight: "calc(100% + 48px)" }}>
      {/* 左 260 TOC（sticky）。compact（lg 未満）では非表示 */}
      {compact ? null : (
        <aside style={{ width: 260, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--card)" }}>
          <div style={{ position: "sticky", top: 40, padding: "24px 12px 24px 16px" }}>{toc(false)}</div>
        </aside>
      )}
      <div style={{ flex: 1, minWidth: 0, padding: 24 }}>
        <div style={{ maxWidth: 896, display: "flex", flexDirection: "column", gap: 24 }}>
          <PageHeader icon="FileText" title="マニュアル" description="AXIS の使い方。更新: 2026/09/08">
            {compact ? <Button variant="secondary" icon="List" onClick={() => setTocOpen(true)}>目次</Button> : null}
          </PageHeader>
          <article style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <h1 style={{ margin: 0, paddingBottom: 10, fontSize: 24, lineHeight: "32px", fontWeight: 700, letterSpacing: "-0.01em", borderBottom: "2px solid var(--primary)" }}>AXIS 利用マニュアル</h1>
            {MANUAL_SECTIONS.map((s) => (
              <section key={s.id} id={s.id} ref={(el) => { refs.current[s.id] = el; }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ margin: 0, paddingBottom: 8, fontSize: 20, lineHeight: "28px", fontWeight: 600, borderBottom: "1px solid var(--border)", display: "flex", gap: 10 }}><span style={{ color: "var(--muted-foreground)", fontVariantNumeric: "tabular-nums" }}>{s.num}.</span>{s.title}</h2>
                {s.blocks.map((b, i) => <Block key={i} b={b} />)}
              </section>
            ))}
          </article>
        </div>
      </div>
      {tocOpen ? <Dialog open size="sm" title="目次" onClose={() => setTocOpen(false)} hideFooter>{toc(true)}</Dialog> : null}
    </div>
  );
}
window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { ManualScreen });
