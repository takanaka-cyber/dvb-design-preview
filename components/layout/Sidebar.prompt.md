サイドバー。グループは「毎日 / 週次 / 目標・評価 / ツール / 研修（研修生・管理者のみ）/ 管理（ADMIN）」。現在地は --primary-subtle 背景 + 左 2px バー。幅 248 / 折りたたみ 56（アイコンのみ、hover で tooltip）/ スマホは drawer 280。下端はユーザー名 + ロール Badge + 設定。

```jsx
<Sidebar groups={NAV_GROUPS} activeKey="mbo" onSelect={go} date="9/9 (火)" time="15:56" user={{ name: "髙仲 秀介", role: "リーダー" }} />
<Sidebar drawer open={menu} onClose={() => setMenu(false)} groups={NAV_GROUPS} activeKey="mbo" onSelect={go} user={user} />
```
