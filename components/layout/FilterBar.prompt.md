フィルタバー。期間の前/次 + Select 群 + 担当者チップ（複数選択・URL 同期）。ページ上部1箇所に集約。

```jsx
<FilterBar period="今週（9/7〜9/13）" onPrev={prev} onNext={next} chips={names.map(n => ({ label: n, active: sel.includes(n) }))} onChip={toggle}><Select options={ranks} /></FilterBar>
```
