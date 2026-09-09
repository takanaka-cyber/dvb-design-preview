チェックボックス。複数選択・完了チェック・一括操作の選択に使う。ON = `--primary`。全選択の一部は indeterminate。

```jsx
<Checkbox checked={done} onChange={setDone} label="Meta 広告マネージャの権限を確認" />
<Checkbox indeterminate onChange={toggleAll} aria-label="すべて選択" />
```
- チェックリスト（研修）、削除送信の選択、アセクリ管理の有効/無効。
- 行全体をクリックで切り替えたい場合はラベルに行内容を入れる。
