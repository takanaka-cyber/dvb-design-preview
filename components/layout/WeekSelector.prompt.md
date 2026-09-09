週セレクタ。週次レポート・案件別まとめの上部 1 箇所。週の表示は 16px / 600、今週は「今週」バッジ。← → キーで前後週。スマホは `compact`（◀ ▶ のみ、Select 省略）。

```jsx
<WeekSelector weeks={WEEKS} index={i} onChange={(n, reason) => reason === "more" ? openPicker() : setI(n)} />
```
