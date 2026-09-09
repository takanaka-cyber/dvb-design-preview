KPI カード。ラベル / 主値 24px tabular / 増減（色は増減だけ、▲▼ + 符号併記）/ 補足1行。横並び 4〜6 枚。

```jsx
<KpiCard label="対象週 ROAS" value="311.7" unit="%" delta={{ value: -4.1, unit: "pt" }} note="先週 315.8%" />
```
- CPA など下がると良い指標は delta.invert。
