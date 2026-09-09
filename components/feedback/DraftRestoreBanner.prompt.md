ブラウザに退避した未保存入力があるときのバナー。PageHeader 直下に1本だけ（複数欄があっても 1 本）。`--warning-subtle` 背景 + 左 3px `--warning` バー + lucide `History`。復元 → 「復元しました」トースト 3 秒。破棄 → 確認なしで即消える。

```jsx
<DraftRestoreBanner time="9/8 22:14" onRestore={restore} onDiscard={() => setDraft(null)} />
```
