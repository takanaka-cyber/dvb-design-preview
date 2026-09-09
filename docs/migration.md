# 置き換え順の推奨

事故が少ない順。各段で「見た目が変わらない or 意図した変化だけ」を確認して次へ。
順序（2026-09-09 改訂）: **土台 → 日報 → 案件別まとめ → 週次レポート → サイドバー**。運用者アンケートの最優先 3 つ（①入力が消えない・保存が見える ②週次レポートを読める ③日報と数値確認がスマホで成立する）に沿う。

## 0. 土台（画面を触らない）
1. `deliverables/globals.css` を `app/globals.css` に置き換え。`next/font/google` で Geist / Geist Mono / Noto Sans JP を変数化し `<html lang="ja">` に付与。
2. `next-themes` は配線しない（ライト固定）。`.dark` 変数は残すだけ。
3. `components/ui/*`（shadcn）はそのまま。`--primary` が黒→青になるので Button/リンク/フォーカスが一斉に青くなる。ここだけ目視。
4. 機械置換（意味が1対1のもの）を先に流す。

| 旧 | 新 |
|---|---|
| `bg-white` | `bg-card` |
| `bg-gray-50` `bg-slate-50` | `bg-background`（ページ）/ `bg-muted`（帯） |
| `bg-gray-100` `bg-gray-200` | `bg-muted` |
| `border-gray-200` `border-gray-300` | `border-border` |
| `text-gray-900/800/700` | `text-foreground` |
| `text-gray-600/500` | `text-muted-foreground` |
| `text-gray-400/300` | `text-disabled-foreground`（無効以外は `text-muted-foreground` に上げる） |
| `bg-blue-600` `hover:bg-blue-700` | `bg-primary hover:bg-primary-hover` |
| `bg-blue-50` `bg-blue-100` | `bg-primary-subtle` |
| `text-emerald-700` `text-green-600` | `text-positive` |
| `text-red-600` `text-red-500` | `text-negative` |
| `text-xs` (テーブル内) `text-[10px]` | `text-sm` |
| `rounded-lg` `rounded-xl` | `rounded-md` |
| `shadow-md` `shadow-lg` `hover:shadow-*` | `shadow-card` / 削除 |

5. 入力の退避（localStorage / IndexedDB）と `SaveStatus` の error 文言「保存に失敗しました。入力内容はブラウザに退避済みです［再試行］」を共通フックにしておく。`DraftRestoreBanner` はこのフックの上に乗る。

## 1. 日報 `/mbo`（守る画面・最初の実地確認）
- 青帯ヘッダ → `PageHeader`（帯なし）。textarea は白背景のまま。「完了して送信」1ボタン・自動保存注記は変えない。
- `SaveStatus` を **PageHeader 右端に固定**（入力欄ごとの「保存中…」は出さない）。他画面の雛形にする。
- スマホ 393 / 430: `ui_kits/dvb/MboMobileScreen.jsx`。［完了して送信］は下端固定 48px + safe-area、textarea 16px（iOS ズーム防止）。「本日休み」はヘッダ右の ghost。0〜5 時は info 1 行。
- `/mbo/history` を復活（`MboHistoryScreen.jsx`）。`/mbo/monthly` は紫グラデ廃止、メンバー×日付グリッド（`MboMonthlyScreen.jsx`）。
- 確認・通知はここで統一: `window.confirm` → `ConfirmDialog`（破壊操作）、`alert` → `toast`。

## 2. 案件別まとめ `/reports/projects`
- 紺 + 青の帯を廃止。KPI 4 枚。生 `<table>` → `DataTable`（compact）。textarea の amber-50 を白に。
- 上部の週表記は `WeekSelector` 1 箇所に（「対象週」の重複表記をやめる）。
- スマホ 393: 閲覧のみ（`ProjectMobileScreen.jsx`）。ボード → 1 案件。タスクのチェックだけ操作可。

## 3. 週次レポート `/reports/weekly`（5,975 行。最大の変化）
- `WeeklyReportScreen.jsx` の順に並べ直す: PageHeader → コントロール行（WeekSelector / メンバー / CPデータ更新 + `FreshnessBadge`）→ 注意帯（命名不一致・鮮度）→ `DraftRestoreBanner` → KPI 4 → 月間目標 → 振り返り 3 欄（縦、枠色なし）→ AI 分析 → 利益 TOP10（金色帯廃止）→ 媒体別 / 案件別 / 共有CP（既定は閉）。
- 色は 5 系統以上 → primary + 状態色のみ。長文エラーの生表示はやめ、2 文 + ［設定を開く］に。
- スマホは 1〜6 のみ、振り返り以降は読み取り。
- 先週比較ボード（`/reports/projects/comparison`）は同じ `DataTable` 化の流れで続けて置き換える。

## 4. サイドバー・ページヘッダ
- ナビ定義を 1 ファイルに集約（`ui_kits/dvb/data.js` の `NAV_GROUPS` と同じ形）。グループ: 毎日 / 週次 / 目標・評価 / ツール / 研修（研修生・管理者のみ）/ 管理（ADMIN）。
- 折りたたみ 56 は tooltip、スマホはハンバーガー → 左ドロワー 280。下端はユーザー名 + ロール Badge + 設定。

## 5. Wave 2（ラフあり: `Wave2Screens.jsx`）
- 目標: Q タブ維持、「Q の目標」→「今月の振り返り」を上下に。月別グリッド 13px。未入力は「未入力」表記。
- コミットメント: 帯廃止、自分のカード + チーム（事業部ごと折りたたみ）。「連続未達」は negative Badge。
- ダッシュボード: 白カードに置換のみ。空状態に「日報を書く」導線 1 つ。

## 6. 仕上げ
- 絵文字見出し → lucide。`▶` 文字 → `ChevronRight`。`text-[10px]` の残りを lint（`_adherence` ルール）で潰す。
- タスク管理・研修・分析・撮影スケジュール・リンク集・マニュアル・管理画面はトークン置換のみ。

## 7. 第 2 弾（2026-09-10 全画面設計書 v1.1）: バッチ 1〜4 の実装順

順序: **土台 → 日報 → 案件別まとめ → 週次レポート → サイドバー → タスク管理 → ダッシュボード・コミットメント・目標 → ツール群 → 研修・外部 → 管理**。
0〜4 は上のとおり。以降は「骨格・ボタン位置は動かさず、帯・色・部品だけ置換」（設計書 §1.1 / §1.2）。

### 7.1 バッチ 1: 毎日使う画面（`ui_kits/dvb/TasksScreen.jsx` `DashboardScreenV2.jsx` `CommitScreenV2.jsx`）
- 追加部品を先に入れる: `Progress` / `SegmentedControl` / `Dialog` / `Switch` / `Checkbox`（`components/data|navigation|feedback|forms`）。
- タスク管理 `/tasks`: 帯 3 本（濃紺・slate・紫）→ `SectionHeading`。「保存」primary（amber 廃止）・「行追加」ghost・「発注送信」primary。表 5 つ → `DataTable`（入力表は行内 Select / Input、稼働マトリクスは sticky 第 1 列）。フィルタチップ → `FilterBar`、課タスクの 4 切替 → `SegmentedControl`、凡例 → `--rank-*`。confirm 4・alert 11 → `ConfirmDialog` / `Toast`。絵文字📝 → `ListChecks`。
- 課のタスク詳細: 戻る ghost は左のまま、カード帯 → 白 + `SectionHeading` + 件数 `Badge`。優先度は `--rank-*`（高 = S 塗り / 中 = A / 低 = B 枠）、種別は `--info`。
- ダッシュボード: h1 追加（E2）。「当日タスク送信」は PageHeader 右の primary、送信済みは同じ位置で `--positive` Badge。帯 5 本 → `SectionHeading`。チェックリスト 2 枚は白 + 左 3px（完了で `--positive`）。タスク進捗 → `Progress`。空 = 「今日やること: 日報を書く」。
- コミットメント: 月送りは同じ位置・帯なし（`WeekSelector compact` に月配列。実装時は `unit="month"` を足して「前月/次月」ラベルにする）。バッジ = 達成 `--positive` / 遅れ・連続未達 `--negative`。進捗 → `Progress`（type 別 3 色グラデ廃止）。「保存」×2 は secondary、Textarea 右横のまま。チーム 3 列は `repeat(3, minmax(0,1fr))`、1280 でも折れない。
- キット内で仮置きした既存部品の拡張（実装時に本体へ）: `Badge` の `status` / `tier` / `role` kind、`PageHeader` の `backLink`（キットでは ghost Button を h1 の上に置いた）、`DataTable` の行内インライン編集の見本（バッチ 4 型 A で描く）。

### 7.2 バッチ 2: 週次・ツール（目標 / ヒット施策 / 検証ナレッジ / 先週比較のタスク節 / 分析 / 撮影 / リンク集 / マニュアル / 設定）
- 追加部品: `Tabs` / `ChatPanel` / `LinkTile`。CP判断は描かない（休眠）。

### 7.3 バッチ 3: 研修（全面再設計・`SubNav`）/ ログイン・登録（`AuthCard`）/ アセクリ（サイドバーなしレイアウト）

### 7.4 バッチ 4: 管理 13 画面（型 A〜D の 4 見本 + 差分）
