ボタン。1画面に primary は1つだけ（追加・送信）。他は secondary / ghost。高さ 36（sm 32）。

```jsx
<Button variant="primary" icon="Send" block>完了して送信</Button>
<Button size="sm" icon="Plus">追加</Button>
```
- loading でスピナー + disabled。destructive は ConfirmDialog 内でのみ使う。
