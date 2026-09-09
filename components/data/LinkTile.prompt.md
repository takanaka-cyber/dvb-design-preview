リンク集のタイル。カテゴリごとに `SectionHeading` の下へ 3〜4 列グリッドで並べる。カテゴリの色ドットは使わない（見出しだけで区別）。

```jsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8 }}>
  {links.map((l) => <LinkTile key={l.id} name={l.name} icon={l.icon} href={l.url} hidden={l.hidden}
    editing={editing} onEdit={() => edit(l)} onToggleHidden={() => toggle(l)} onDelete={() => askDelete(l)} />)}
</div>
```
- 高さ 44、アイコン 18px + 名前 14px。hover で `--muted` + 右端に ExternalLink。
- 編集モード: 左にドラッグハンドル（dnd 並べ替え）、右端に ✏️（編集）👁（表示/非表示）🗑（削除、`--negative`）の 32px アイコン 3 つ。削除は `ConfirmDialog` を経由。
- 非表示のタイルは opacity 0.55 で編集モードのときだけ見える。
