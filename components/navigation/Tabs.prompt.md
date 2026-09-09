下線型タブ。ページ内で「別の内容」に切り替える（評価シートの Q1〜Q4、ユーザー管理の部署、案件別まとめ管理、研修管理の閲覧切替）。同じデータの見方を変えるだけなら `SegmentedControl`。

```jsx
<Tabs aria-label="四半期" items={["Q1", "Q2", "Q3", "Q4"]} value={q} onChange={setQ} />
<Tabs items={[{ value: "gg1", label: "GG 1課", count: 3 }, { value: "gg2", label: "GG 2課", count: 2, icon: "Users" }]} value={dept} onChange={setDept} />
```
- 高さ 40、下に 1px `--border`。アクティブは文字 `--primary` + 下 2px `--primary`、それ以外は `--muted-foreground`。
- 幅が足りない時は横スクロール（スクロールバー非表示）。← → キーで移動。
- 件数はタブ右に丸バッジ（任意）。ページ移動（サイドバー）や第 2 階層ナビ（SubNav）には使わない。
