フォーム用モーダル。確認だけなら `ConfirmDialog`。本文は Field の縦積み、フッタは 左に破壊系・右に キャンセル（secondary）+ 確定（primary）の順で固定。

```jsx
<Dialog open={open} size="md" title="撮影予定を編集" onClose={close} confirmLabel="更新" onConfirm={save} confirmLoading={saving}
  destructive={{ label: "削除", onClick: askDelete }}>
  <Field label="タイトル" htmlFor="t"><Input id="t" defaultValue="C社 縦型 撮影" /></Field>
</Dialog>
```
- 幅は sm 480（1 入力）/ md 640（フォーム）/ lg 95vw（拡大表示）の 3 つだけ。
- 本文はスクロール、ヘッダ・フッタは固定。× と背景クリックで閉じる。
- 用途: ヒット施策の記入・承認、ユーザー追加、撮影予定の作成/編集、CR アウトプットの拡大、カテゴリ追加。
