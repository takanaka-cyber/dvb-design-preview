import React from "react";

/**
 * 認証カード。ログイン・登録申請・アセクリのアクセス拒否。
 * 幅 448、中央寄せ。上に「AXIS」（Geist 700 24px、帯なし・青文字なし）+ 説明 1 行。フォームは Field の縦積み、主ボタンは全幅。
 * error で --negative-subtle 帯、icon で説明の上に大きめアイコン（アクセス拒否 = Lock --negative）。footer は下部リンク行。
 */
export function AuthCard({ brand = "AXIS", title, description, icon, iconTone = "muted", error, children, footer, mobile = false, style }) {
  const L = typeof window !== "undefined" ? window.LucideReact : null;
  const I = icon && L && L[icon];
  const Warn = L && L.TriangleAlert;
  const tone = iconTone === "negative" ? ["var(--negative-subtle)", "var(--negative)"] : iconTone === "positive" ? ["var(--positive-subtle)", "var(--positive)"] : ["var(--muted)", "var(--muted-foreground)"];
  return (
    <section aria-label={title || brand} style={{ width: "100%", maxWidth: 448, margin: "0 auto", background: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: mobile ? 24 : 32, display: "flex", flexDirection: "column", gap: 20, fontFamily: "var(--font-sans)", boxSizing: "border-box", ...style }}>
      <header style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 4 }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 24, lineHeight: "32px", fontWeight: 700, letterSpacing: "0.04em", color: "var(--foreground)" }}>{brand}</div>
        {I ? <span style={{ width: 48, height: 48, borderRadius: "var(--radius)", background: tone[0], color: tone[1], display: "grid", placeItems: "center", margin: "12px 0 4px" }}><I size={24} strokeWidth={1.75} aria-hidden /></span> : null}
        {title ? <h1 style={{ margin: I ? 0 : "8px 0 0", fontSize: 18, lineHeight: "26px", fontWeight: 600, color: "var(--foreground)" }}>{title}</h1> : null}
        {description ? <p style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: "var(--muted-foreground)" }}>{description}</p> : null}
      </header>
      {error ? <div role="alert" style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: "var(--radius)", background: "var(--negative-subtle)", color: "var(--negative-subtle-foreground)", fontSize: 13, lineHeight: "18px" }}>{Warn ? <Warn size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0, marginTop: 1 }} /> : null}<span>{error}</span></div> : null}
      {children ? <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div> : null}
      {footer ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)", textAlign: "center" }}>{footer}</div> : null}
    </section>
  );
}
if (typeof window !== "undefined") { window.DVB = window.DVB || {}; window.DVB.AuthCard = AuthCard; }
