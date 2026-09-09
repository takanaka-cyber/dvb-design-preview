import React, { useEffect, useRef, useState } from "react";

const CSS = "@keyframes dvb-blink{0%,49%{opacity:1}50%,100%{opacity:0}}@keyframes dvb-chat-spin{to{transform:rotate(360deg)}}";
/**
 * チャットパネル。分析（AI レポート）と研修 Q&A の共通部品。
 * メッセージ列（自分 = --primary-subtle、AI = 白 + border）、下端固定の入力（Textarea 1〜4 行 + 送信 icon ボタン 44）、
 * テンプレチップ列（任意）、出典ボックス（任意）、ストリーミング中の点滅カーソル。Enter 送信・Shift+Enter 改行。
 * messages: [{ id, role: "user" | "ai", text?, content?, sources?: string[], streaming?, at?, actions? }]
 */
export function ChatPanel({ messages = [], value = "", onChange, onSend, sending, disabled, placeholder = "質問を入力（Enter で送信・Shift+Enter で改行）", templates = [], activeTemplate, onTemplate, header, emptyNode, height = 560, maxRows = 4, inputFontSize = 14, style }) {
  const D = typeof window !== "undefined" ? window.DVB : null;
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const Send = L && L.SendHorizontal, Book = L && L.BookOpen, Bot = L && L.Bot;
  const listRef = useRef(null);
  const [focus, setFocus] = useState(false);
  useEffect(() => { if (typeof document !== "undefined" && !document.getElementById("dvb-chat-css")) { const s = document.createElement("style"); s.id = "dvb-chat-css"; s.textContent = CSS; document.head.appendChild(s); } }, []);
  useEffect(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages.length, messages[messages.length - 1] && messages[messages.length - 1].text]);
  const rows = Math.min(maxRows, Math.max(1, (value.match(/\n/g) || []).length + 1));
  const canSend = !!value.trim() && !sending && !disabled;
  const send = () => { if (canSend && onSend) onSend(value); };
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } };
  const Cursor = () => <span aria-hidden style={{ display: "inline-block", width: 2, height: 14, marginLeft: 2, verticalAlign: "text-bottom", background: "var(--foreground)", animation: "dvb-blink 1s steps(1) infinite" }} />;

  return (
    <section aria-label="チャット" style={{ display: "flex", flexDirection: "column", height, minHeight: 0, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", fontFamily: "var(--font-sans)", color: "var(--foreground)", overflow: "hidden", ...style }}>
      {header ? <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>{header}</div> : null}
      <div ref={listRef} role="log" aria-live="polite" style={{ flex: 1, minHeight: 0, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && emptyNode ? <div style={{ margin: "auto 0" }}>{emptyNode}</div> : null}
        {messages.map((m) => {
          const me = m.role === "user";
          return (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "80%", flexDirection: me ? "row-reverse" : "row" }}>
                {!me ? <span aria-hidden style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--muted)", color: "var(--muted-foreground)", display: "grid", placeItems: "center", flexShrink: 0 }}>{Bot ? <Bot size={15} strokeWidth={1.75} /> : "AI"}</span> : null}
                <div style={{ padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: "22px", whiteSpace: m.content ? "normal" : "pre-wrap", wordBreak: "break-word", minWidth: 0,
                  background: me ? "var(--primary-subtle)" : "var(--card)", color: me ? "var(--primary-subtle-foreground)" : "var(--foreground)", border: me ? "1px solid transparent" : "1px solid var(--border)",
                  borderBottomRightRadius: me ? 4 : 12, borderBottomLeftRadius: me ? 12 : 4 }}>
                  {m.content || m.text}{m.streaming ? <Cursor /> : null}
                  {m.sources && m.sources.length ? (
                    <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: "var(--radius-sm)", background: "var(--muted)", fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)", display: "flex", gap: 6, alignItems: "flex-start" }}>
                      {Book ? <Book size={14} strokeWidth={1.75} aria-hidden style={{ marginTop: 2, flexShrink: 0 }} /> : null}
                      <span>出典: {m.sources.join(" / ")}</span>
                    </div>
                  ) : null}
                </div>
              </div>
              {(m.at || m.actions) ? <div style={{ display: "flex", alignItems: "center", gap: 8, padding: me ? "0 4px" : "0 0 0 36px", fontSize: 12, color: "var(--muted-foreground)" }}>{m.at ? <span style={{ fontVariantNumeric: "tabular-nums" }}>{m.at}</span> : null}{m.actions}</div> : null}
            </div>
          );
        })}
      </div>
      <div style={{ flexShrink: 0, borderTop: "1px solid var(--border)", padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "var(--card)" }}>
        {templates.length ? (
          <div role="group" aria-label="テンプレート" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {templates.map((t) => { const label = typeof t === "string" ? t : t.label; const on = activeTemplate === label; return (
              <button key={label} type="button" aria-pressed={on} onClick={() => onTemplate && onTemplate(typeof t === "string" ? t : t)} style={{ height: 28, padding: "0 10px", borderRadius: 9999, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", border: `1px solid ${on ? "var(--primary)" : "var(--border)"}`, background: on ? "var(--primary-subtle)" : "var(--card)", color: on ? "var(--primary-subtle-foreground)" : "var(--foreground)" }}>{label}</button>
            ); })}
          </div>
        ) : null}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <textarea value={value} rows={rows} disabled={disabled} placeholder={placeholder} aria-label="メッセージ" onChange={(e) => onChange && onChange(e.target.value)} onKeyDown={onKey} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ flex: 1, minHeight: 44, padding: "11px 12px", resize: "none", fontFamily: "inherit", fontSize: inputFontSize, lineHeight: "22px", color: "var(--foreground)", background: "var(--card)", border: `1px solid ${focus ? "var(--ring)" : "var(--input)"}`, borderRadius: "var(--radius)", outline: "none", boxShadow: focus ? "0 0 0 3px var(--primary-subtle)" : "none" }} />
          <button type="button" aria-label="送信" disabled={!canSend} onClick={send} style={{ width: 44, height: 44, flexShrink: 0, display: "grid", placeItems: "center", border: 0, borderRadius: "var(--radius)", background: canSend ? "var(--primary)" : "var(--muted)", color: canSend ? "var(--primary-foreground)" : "var(--disabled-foreground)", cursor: canSend ? "pointer" : "not-allowed", transition: "background var(--duration) var(--ease)" }}>
            {sending ? <span aria-hidden style={{ width: 16, height: 16, border: "2px solid currentColor", borderRightColor: "transparent", borderRadius: "50%", animation: "dvb-chat-spin 0.8s linear infinite" }} /> : Send ? <Send size={18} strokeWidth={1.75} /> : "→"}
          </button>
        </div>
      </div>
    </section>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.ChatPanel = ChatPanel; }
