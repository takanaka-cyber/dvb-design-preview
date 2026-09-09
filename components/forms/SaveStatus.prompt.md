自動保存の状態。PageHeader の右端に固定する（入力欄ごとの「保存中…」は出さない）。idle「入力内容は自動保存されます」→ saving → saved HH:MM → error「保存に失敗しました。入力内容はブラウザに退避済みです［再試行］」。

```jsx
<PageHeader icon="BarChart3" title="週次レポート"><SaveStatus state="saved" time="15:56" /></PageHeader>
```
