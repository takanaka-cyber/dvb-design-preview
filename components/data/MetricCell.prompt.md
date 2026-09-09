テーブル用「主値 + 増減」2段セル。右寄せ tabular。主値 13px、増減 12px を意味色で。

```jsx
<MetricCell value={1204300} delta={120400} unit="¥" previous={1083900} />  {/* 先週値は title ツールチップ */}
<MetricCell value={311.7} delta={-4.1} unit="%" digits={1} deltaUnit="pt" />
```
