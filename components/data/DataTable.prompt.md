データテーブル。thead は --muted、数値は右寄せ tabular、並べ替え矢印は sortable 列だけ。行 44px（compact 36px）。loading / error / 空の3状態を内包。

```jsx
<DataTable columns={[{ key:"name", label:"案件名", sticky:true }, { key:"profit", label:"今週粗利", align:"right", sortable:true, render: r => <MetricCell value={r.profit} delta={r.dp} unit="¥" /> }]} rows={rows} sortKey="profit" sortDir="desc" onSort={setSort} />
```
