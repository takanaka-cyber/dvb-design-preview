認証カード。ログイン・登録申請・アセクリのアクセス拒否。サイドバーなしのページで `--background` の上に中央寄せ。

```jsx
<AuthCard description="デイリー業務一元管理システム" error={err && "メールアドレスまたはパスワードが違います"}
  footer={<a href="/register">アカウントをお持ちでない方は 登録申請</a>}>
  <Field label="メールアドレス" htmlFor="email"><Input id="email" type="email" style={{ fontSize: 16 }} /></Field>
  <Field label="パスワード" htmlFor="pw"><Input id="pw" type="password" /></Field>
  <Button variant="primary" block>ログイン</Button>
</AuthCard>
<AuthCard icon="Lock" iconTone="negative" title="アクセスできません" description="リンクの有効期限が切れています。担当者に再発行を依頼してください" />
```
- 幅 448（`max-width`、スマホは左右 16px 余白で全幅）。余白 32、`mobile` で 24。
- 「AXIS」は Geist 700 24px 黒（青文字・帯なし）。説明は 1 行 14px `--muted-foreground`。
- 入力は高さ 44・16px（iOS ズーム防止）。主ボタンは primary 全幅。エラーは `--negative-subtle` 帯（カード上部）。
- 成功画面（申請完了）は `icon="CircleCheck" iconTone="positive"`。
