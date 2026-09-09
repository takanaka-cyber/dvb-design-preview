ページ内の第 2 階層ナビ（研修の左サブナビ）。サイドバー（第 1 階層）の右、本文の左に置く。

```jsx
<SubNav activeKey={page} onSelect={setPage} groups={[
  { items: [{ key: "home", label: "ホーム", icon: "House" }] },
  { label: "進める", items: [{ key: "schedule", label: "スケジュール", icon: "CalendarDays" }, { key: "learning", label: "学習リスト", icon: "BookOpen", progress: "12/30" }] },
  { label: "記録する", items: [{ key: "values", label: "バリュー振り返り", icon: "Heart", dot: "info" }] },
  { label: "調べる", items: [{ key: "qa", label: "Q&A", icon: "MessageSquare", dot: "warning" }] },
]} />
<SubNav compact groups={...} activeKey={page} onSelect={setPage} />  {/* 1024 未満 */}
```
- 幅 200。グループ見出しは 11px `--muted-foreground`（大文字化しない）。項目は高さ 36、lucide アイコン + ラベル + 右端に 進捗「3/8」（tabular）か 未読ドット（8px、`dot: "info"` = 上長 FB / `"warning"` = 未回答）。
- アクティブ = `--primary-subtle` 背景 + 左 2px `--primary` + 太字。hover は `--muted`。
- `compact` は上部の横スクロール Tabs（高さ 44、スクロールバー非表示）。スマホ 393 / 430 と 1024 未満で使う。
- 第 1 階層（サイドバー）や同じデータの見方切替（SegmentedControl）には使わない。
