チャットパネル。分析（AI レポート）と研修 Q&A の 2 実装を 1 部品に。メッセージ列は上、入力は下端固定。

```jsx
<ChatPanel height={600} messages={msgs} value={q} onChange={setQ} onSend={ask} sending={busy}
  templates={["今週の利益増減の要因", "案件別の CPA 推移"]} activeTemplate={tpl} onTemplate={(t) => { setTpl(t); setQ(TEMPLATES[t]); }}
  emptyNode={<EmptyState icon="Bot" title="質問を入力すると、マニュアルと用語集をもとに答えます" />} />
```
- 自分の吹き出しは `--primary-subtle`（右寄せ）、AI は白 + `--border`（左寄せ、Bot アイコン）。文字 14px。
- 入力は Textarea 1〜4 行の自動拡張 + 送信 icon ボタン 44px（入力が空なら無効）。Enter 送信・Shift+Enter 改行。
- `sources` を渡すと吹き出し内に「出典: …」ボックス（`--muted`）。`streaming` で末尾に点滅カーソル。
- `actions` に［役に立った / 立たなかった］や［保存 / クリア］の ghost ボタンを置く。
- リッチ本文（表・見出し）は `content` に ReactNode。表は DataTable 相当の見た目（thead `--muted`、13px、tabular-nums）にする。
