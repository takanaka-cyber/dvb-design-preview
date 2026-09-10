ページヘッダ。帯色なし。右アクションは最大3（primary 1 + secondary 2）。`backLink` を渡すと h1 の上に「← 戻る」（13px muted、32px 高）を置く。課タスク詳細・アセクリ詳細・1 案件で使用。位置は h1 の左上で固定（右アクションと同じ行には置かない）。

```jsx
<PageHeader icon="BookOpen" title="日報" description="毎日の振り返り"><Button>月別管理</Button></PageHeader>
<PageHeader backLink={{ label: "タスク管理に戻る", onClick: goBack }} title="課のタスク詳細一覧" description="9/8（月）〜 9/14（日）" />
```
