トグル。即時に効く 2 値の設定に使う（保存ボタンが要るものは Checkbox）。ON = `--primary`。

```jsx
<Switch checked={onlyOpen} onChange={setOnlyOpen} label="未完了だけ表示" />
```
- 設定のトグル、管理の有効/無効、チェックリストの表示切替。
- ラベルは動詞ではなく状態（「未完了だけ表示」「通知を受け取る」）。
