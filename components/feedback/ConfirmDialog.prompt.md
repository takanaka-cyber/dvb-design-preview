破壊操作の確認。window.confirm の代替。タイトルは「◯◯を削除しますか？」、本文は何が消えるか + 取り消せない旨。

```jsx
<ConfirmDialog open={open} title="タスクを削除しますか？" description="「…」が削除されます。この操作は取り消せません。" onConfirm={del} onCancel={close} />
```
- 軽い操作は確認せず、取り消しつき Toast にする。
