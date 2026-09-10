データテーブル。thead は --muted、数値は右寄せ tabular、並べ替え矢印は sortable 列だけ。行 44px（compact 36px）。loading / error / 空の3状態を内包。

```jsx
<DataTable columns={[{ key:"name", label:"案件名", sticky:true }, { key:"profit", label:"今週粗利", align:"right", sortable:true, render: r => <MetricCell value={r.profit} delta={r.dp} unit="¥" /> }]} rows={rows} sortKey="profit" sortDir="desc" onSort={setSort} />
```

行内インライン編集（管理画面 型 A）: `editingKey` に一致する行は、列の `edit(row)` で描く（Input に変わる）。右端の操作列は ✏️🗑（ghost / ghost destructive）→ 編集中は ✓（primary）×（ghost）。🗑 は ConfirmDialog。

```jsx
<DataTable editingKey={editing} columns={[
  { key:"name", label:"案件名", edit: r => <Input size="sm" defaultValue={r.name} autoFocus /> },
  { key:"ops", label:"", width:80, align:"right", render: r => <>✏️ 🗑</>, edit: r => <>✓ ×</> },
]} rows={rows} />
```
