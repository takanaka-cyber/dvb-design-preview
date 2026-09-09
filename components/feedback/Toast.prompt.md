トースト（sonner の見た目仕様）。success 3秒 / undo 6秒 + 「元に戻す」 / error は手動で閉じる。右下に積む。

```jsx
<Toast kind="undo" message="タスクを完了にしました" actionLabel="元に戻す" onAction={undo} />
```
