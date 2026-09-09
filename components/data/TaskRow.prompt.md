タスク1行。チェック / 本文 / 媒体タグ / 担当者チップ / 期限ピル（超過は negative）/ メニュー。mode="edit" で行内追加フォーム（Enter 追加・Esc 閉じる）。

```jsx
<TaskRow text="CR 差し替え" assignee="白井" due="9/10" media="FB" onToggle={toggle} />
<TaskRow mode="edit" projects={projects} assignees={names} onSubmit={add} onCancel={close} />
```
