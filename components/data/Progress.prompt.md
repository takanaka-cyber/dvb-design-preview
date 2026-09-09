進捗バー。高さ 8、`--muted` の上に `--primary`。value >= max で `--positive`、overdue で `--negative`。ラベルは右に「12/30（40%）」（tabular-nums 13px）。

```jsx
<Progress value={12} max={30} />
<Progress value={3} max={5} overdue />
<Progress value={150} max={150} label="150/150 達成" width={200} />
```
- 用途: チェックリスト・課題の進捗、コミットメント達成率、ダッシュボードのタスク進捗、CR アウトプット 150 件目標。
- 色は 3 つだけ。type 別のグラデや任意色は渡せない。
