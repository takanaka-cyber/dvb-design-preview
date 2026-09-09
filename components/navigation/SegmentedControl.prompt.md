セグメント切替。同じデータの見方を 2〜6 個で切り替える（表示モード・並び替え・期間単位）。ページ移動には使わない（それは Tabs）。

```jsx
<SegmentedControl aria-label="表示" options={["全て", "案件別", "優先度別"]} value={view} onChange={setView} />
<SegmentedControl options={[{ value: "month", label: "月", icon: "Calendar" }, { value: "week", label: "週" }]} value={unit} onChange={setUnit} />
```
- 高さ 32。選択中は白 + shadow-sm、それ以外は muted-foreground。
- 撮影の 月/週/日、課タスクの 全て/案件別/優先度別、バリュー振り返りのラウンド、研修管理の 6 切替。
