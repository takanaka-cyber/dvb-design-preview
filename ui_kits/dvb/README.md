# DVB リファレンス画面

`index.html` を開く。上部バーで 画面 × 状態 × 幅（1440 / 1280 / 393 / 430）× ナビ（248 / 56）を切り替える。URL ハッシュに同期する（例: `#screen=weekly&state=empty&w=393&nav=full`）。393 / 430 はスマホ枠（ハンバーガー → 左ドロワー）で描く。

## 画面と現行の対応

| 画面 | 現行パス | 幅 | 状態 | 主な変更 |
|---|---|---|---|---|
| 案件別まとめ（GG 週次案件ボード）`BoardScreen.jsx` | `/reports/projects/comparison` | PC | 通常 / 空 / 読み込み / エラー | ナビ「案件別まとめ」の着地。thead → muted。14 列 → 「主値＋増減」2段セルで 8 列（先週値はツールチップ）。行の展開で備考・検証CP。担当者負荷＝今週タスクを持つ案件数。行内タスク追加 |
| 案件別まとめ ＞ 1案件 `ProjectScreen.jsx` / `ProjectMobileScreen.jsx` | `/reports/projects` | PC + スマホ | PC 4 状態 / スマホ 通常・空 | 帯廃止、KPI 4 枚、compact テーブル。スマホは閲覧のみ（タスクのチェックだけ可） |
| 週次レポート `WeeklyReportScreen.jsx` | `/reports/weekly` | PC + スマホ | PC 4 状態 + 閲覧モード / スマホ 通常・空 | 5 系統の色 → primary + 状態色。WeekSelector 1 箇所、FreshnessBadge、DraftRestoreBanner、振り返り 3 欄を縦、TOP10 の金色帯廃止、媒体別/案件別/共有CP は既定で閉 |
| 日報 `MboScreen.jsx` / `MboMobileScreen.jsx` | `/mbo` | PC + スマホ | PC 4 状態 + 送信済み / スマホ 通常・空・送信済み・0〜5時 | 守る対象。スマホは［完了して送信］を下端固定、textarea 16px、「本日休み」はヘッダ右 ghost |
| 日報 履歴 `MboHistoryScreen.jsx` | `/mbo/history`（復活） | PC + スマホ | PC 4 状態 / スマホ 通常・空 | 月切替 + 日付行（良かった動き / 反省点 1 行省略 / 状態 Badge / 上長コメント）。行クリックで右パネル |
| 日報 月別 `MboMonthlyScreen.jsx` | `/mbo/monthly` | PC | 4 状態 | メンバー × 日付グリッド（✓ / − / 休）、「今日の未記載 N 名」、セルクリックで右パネルにコメント入力。紫グラデ廃止 |
| Wave 2 ラフ `Wave2Screens.jsx` | `/goals` `/commitment` `/` | PC | 通常のみ | 目標（Q タブ + 上下配置）、コミットメント（帯廃止 + 事業部折りたたみ）、ダッシュボード（白カード + 日報導線）。ダッシュボード・コミットメントはバッチ 1 の本描きに置き換え（`dashboard-rough` / `commit-rough` で残置） |
| **バッチ 1** タスク管理 `TasksScreen.jsx` | `/tasks` | PC | 4 状態 | 骨格・ボタン位置は現状維持。帯 3 本 → SectionHeading、表 5 つ → DataTable、並び替え・課タスク切替 → SegmentedControl、凡例 → rank トーン、confirm/alert → ConfirmDialog/Toast |
| **バッチ 1** 課のタスク詳細 `TasksScreen.jsx` | `/tasks/section-detail` | PC | 通常・空 | 戻る ghost（左）→ h1 → 課ごとに h2 + メンバーカード 3 列。件数は Badge、優先度は rank トーン |
| **バッチ 1** ダッシュボード `DashboardScreenV2.jsx` | `/dashboard` | PC | 4 状態 | h1 追加（E2）、当日タスク送信 → 送信済み Badge（同位置）、帯 5 本 → SectionHeading、チェックリスト白 + 左 3px、タスク進捗 → Progress |
| **バッチ 1** コミットメント `CommitScreenV2.jsx` | `/commitment` | PC | 4 状態 | 月送りは同位置で帯なし、バッジ 3 つ、追加フォーム（破線 → 展開 → キャンセル/追加 半々）、行内 ✓ or −/＋ / 🗑、行展開に 達成/未達 + Textarea×2 + 右横 保存、チーム 3 列 minmax(0,1fr) |
| **バッチ 3** 研修 `TrainingScreens.jsx` `TrainingScreens2.jsx` | `/onboarding/*` | PC + スマホ（ホーム・Q&A） | 通常・空（学習リスト・Q&A は 4 状態、理解度チェック・用語集は通常のみ） | 全面再設計。SubNav 200 + 本文 max-w-4xl。トップはホーム（Progress 3 → 次にやること → FB / Q&A）。講義 + 課題 → 学習リスト、Q&A は左 240 に過去の質問を常設 |
| **バッチ 3** ログイン / 登録申請 `AuthScreens.jsx` | `/login` `/register` | PC + スマホ | 通常・エラー（登録は + 申請完了） | AuthCard（448、AXIS 黒）。入力 44 / 16px。サイドバーなし（`bare`） |
| **バッチ 3** アセクリ 一覧 / 詳細 `AssigneeScreens.jsx` | `/assignee` `/assignee/[id]` | PC（詳細はスマホ主） | 一覧: 通常・空・アクセス拒否 / 詳細: 4 状態 | サイドバーなし、ヘッダ AXIS のみ。納品する primary（スマホは全幅）、CR / PM / 戻す = secondary / secondary / ghost |

## 操作できるもの
- ボード: 担当者チップで絞り込み、列ヘッダで並べ替え、チェックで完了（取り消しトースト）、×で削除（ConfirmDialog）、「タスクを追加」で行内入力
- 案件別: 担当者タブ、textarea 入力で「保存中… → 保存済み」、タスク追加行。スマホは案件タップ → 1 案件、タスクのチェック
- 週次レポート: WeekSelector（← → キー可）、メンバー切替で閲覧モード、CPデータ更新で鮮度が最新に、下書きの復元 / 破棄、振り返りの自動保存、AI分析の実行、TOP10 の並べ替え、媒体別 / 案件別 / 共有CP の開閉
- 日報: 入力で自動保存表示、「完了して送信」→ 確認 → 送信済み、「本日休み」トグル。スマホは「過去の日報」→ 履歴
- 履歴: 月切替、行クリックで読み取り。月別: セルクリック → 右パネル、コメント送信、メンバー別 AI 分析
- スマホ: ハンバーガー → ドロワー（ナビ 6 グループ）
- タスク管理: 入力表の Select / Input 編集、行追加・削除（ConfirmDialog）、保存（spinner → Toast）、アセクリ管理 Popover（Checkbox）、今週タスクのチップ絞り込み・並び替え・展開パネル（保存 / 発注送信 → 確認）・完了（取り消し Toast）、その他の追加 / サブタスク / ステータス / 削除、カテゴリ追加 Dialog、課タスクの 4 切替、稼働マトリクスの横スクロール、過去の週アコーディオン
- ダッシュボード: 当日タスク送信 → 確認 → 送信済み Badge、チェックリストカードのリンク、進捗ボードのフィルタ・メンバー切替・完了の表示/非表示、カレンダー 週/月、その他、コミットメントの今日達成、チーム進捗の開閉
- コミットメント: 月送り、追加フォーム、✓ / −＋ / 🗑（ConfirmDialog）、行展開（達成/未達・未達理由・振り返り 保存）、事業部の開閉
- 研修: SubNav で画面移動、Progress カードのクリック、Step の完了、学習リストの絞り込み・読了・まとめ保存・下書き復元、チェックリストの Switch、バリューのアコーディオン・自動保存、CR の新規追加 Dialog・拡大・削除、用語集の検索、Q&A の過去の質問クリック・送信（ストリーミング → 出典）・役に立った。スマホは Tabs と履歴ドロワー
- ログイン / 登録: 送信で spinner → 遷移 / 申請完了、パスワード表示、報告先アカウント ID の追加・削除、下書き復元
- アセクリ: カードクリック → 詳細、CR URL の行追加・削除、納品する（CR URL 必須 → 納品済みへ移動）、週アコーディオン、戻す（ConfirmDialog）、URL を修正 → 更新

## サイドバーなしの画面（`bare`）
ログイン・登録・アセクリは `SCREENS` の `bare: true`。App はサイドバーとスマホヘッダを描かず、画面が自分のヘッダ（「AXIS」）と中央寄せを持つ。

## 上部バーのグループ
「毎日 / 週次・ツール / 研修・外部 / 管理」の 4 グループ（設計書 §5）。研修・外部 はバッチ 3 で 13 画面、管理 はバッチ 4 で埋まる。

## データ
`data.js`。週（`WEEKS`）、利益 TOP10（`WEEKLY_TOP10`、案件名・CPN 名は `BOARD_ROWS` から生成）、媒体別、履歴・月別グリッド、ナビ定義（`NAV_GROUPS`）。GG メンバーは既存 4 名 + 三冨の 5 名（残り 2 名は実データ接続時に差し替え）。
