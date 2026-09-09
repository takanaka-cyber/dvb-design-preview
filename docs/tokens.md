# DVB トークン表

変数名 / ライト / ダーク / 用途 / 置き換える既存クラス。値は `tokens/colors.css`（=`deliverables/globals.css`）が正。

## 表面・文字

| 変数 | ライト | ダーク | 用途 | 置き換え |
|---|---|---|---|---|
| `--background` | #F8FAFC | #020617 | ページ背景 | `bg-gray-50` `bg-slate-50` |
| `--card` | #FFFFFF | #0F172A | カード・テーブル・入力欄の白 | `bg-white` |
| `--muted` | #F1F5F9 | #1E293B | テーブルヘッダ帯・行ホバー・無効背景・スケルトン | `bg-gray-100` `bg-gray-200` `bg-blue-900`(thead) |
| `--border` | #E2E8F0 | #334155 | 罫線・入力枠 | `border-gray-200` `border-gray-300` |
| `--foreground` | #0F172A | #F1F5F9 | 本文・数値本体 | `text-gray-900` `text-gray-800` `text-gray-700` |
| `--muted-foreground` | #475569 | #BFC9D9 | 補助ラベル・単位・説明文（白地 7.6:1） | `text-gray-600` `text-gray-500` |
| `--disabled-foreground` | #94A3B8 | #64748B | 無効・プレースホルダのみ | `text-gray-400` `text-gray-300` |

## ブランド

| 変数 | ライト | ダーク | 用途 | 置き換え |
|---|---|---|---|---|
| `--primary` | #2563EB | #60A5FA | 主ボタン・リンク・現在地・フォーカスリング | `bg-blue-600` `text-blue-600` |
| `--primary-hover` | #1D4ED8 | #93C5FD | 主ボタン hover | `hover:bg-blue-700` |
| `--primary-subtle` | #EFF6FF | #1E3A8A | 選択行・現在地背景・info バッジ | `bg-blue-50` `bg-blue-100` |
| `--primary-subtle-foreground` | #1E40AF | #BFDBFE | subtle 背景上の文字 | `text-blue-800` `text-blue-700` |
| `--ring` | = primary | = primary | :focus-visible | — |

## 状態（意味色）

| 変数 | ライト | ダーク | 用途 | 置き換え |
|---|---|---|---|---|
| `--positive` | #15803D | #4ADE80 | 増益・完了の**文字色**。金額本体には付けない | `text-emerald-700` `text-green-600` |
| `--positive-subtle` / `-foreground` | #F0FDF4 / #166534 | #14532D / #86EFAC | 完了バッジ | `bg-green-100 text-green-800` |
| `--negative` | #DC2626 | #F87171 | 減益・期限超過・エラー文字 | `text-red-600` `text-red-500` |
| `--negative-subtle` / `-foreground` | #FEF2F2 / #991B1B | #450A0A / #FECACA | 遅れバッジ・エラー帯 | `bg-red-100 text-red-800` |
| `--warning` | #B45309 | #FBBF24 | 未完了・注意 | `text-orange-600` `text-amber-600` |
| `--warning-subtle` / `-foreground` | #FFFBEB / #92400E | #451A03 / #FDE68A | 未完了バッジ | `bg-amber-50` `bg-orange-100` |
| `--info` 系 | = primary 系 | = primary 系 | 案内 | `bg-blue-50 text-blue-700` |
| `--destructive` | #DC2626 | #F87171 | 削除ボタン | `bg-red-600` |

## ラベル

| 変数 | ライト | ダーク | 用途 |
|---|---|---|---|
| `--rank-s` / `-foreground` | #1D4ED8 / #FFF | #60A5FA / #020617 | ランク S（塗り） |
| `--rank-a` / `-foreground` | #DBEAFE / #1E40AF | #1E3A8A / #BFDBFE | ランク A（薄塗り） |
| `--rank-b` / `-foreground` / `-border` | #FFF / #1D4ED8 / #93C5FD | #0F172A / #93C5FD / #1D4ED8 | ランク B（青枠） |
| `--rank-c` / `-foreground` / `-border` | #FFF / #334155 / #CBD5E1 | #0F172A / #CBD5E1 / #475569 | ランク C（灰枠） |
| `--rank-stop` / `-foreground` | #E2E8F0 / #475569 | #1E293B / #94A3B8 | 停止 |
| `--media-fb` / `-foreground` | #DBEAFE / #1E40AF | #1E3A8A / #BFDBFE | FB（旧 `bg-blue-500`） |
| `--media-tiktok` / `-foreground` | #FCE7F3 / #9D174D | #500724 / #FBCFE8 | TikTok（旧 `bg-pink-500`） |
| `--media-google` / `-foreground` | #DCFCE7 / #166534 | #14532D / #86EFAC | Google |
| `--media-other` / `-foreground` | #F1F5F9 / #334155 | #1E293B / #CBD5E1 | その他（旧 `bg-gray-500`） |
| `--chart-1..5` | 青 / ティール / 琥珀 / ローズ / スレート | 明度上げ | グラフ系列 |

## 寸法・文字

| 変数 | 値 | 用途 |
|---|---|---|
| `--text-xs/sm/base/md/lg/xl` | 12 / 13 / 14 / 16 / 20 / 24 | テーブル本文は `sm`(13) 以上。`text-[10px]` `text-2xl+` は廃止 |
| `--font-sans` | Geist → Noto Sans JP → Hiragino → Yu Gothic | `next/font/google` で3書体を変数化 |
| `--radius` | 8px | `rounded-lg` `rounded-xl` → `rounded-md` |
| `--shadow-card` | 0 1px 2px / 6% | `shadow-md` `shadow-lg` `hover:shadow-*` → `shadow-card` |
| `--spacing-row` / `-compact` | 44px / 36px | テーブル行。セル padding 12×12 / 8×8 |
| `--spacing-control` | 36px | Input / Select / Button |
| `--spacing-sidebar` | 248px（折りたたみ 56px） | サイドバー |

## 使い方の原則

- 正負は **文字色のみ** に付け、`+`/`−` と `▲`/`▼` を併記する（色だけで伝えない）。金額本体は `--foreground`。
- 帯色（thead の blue-900、セクション見出しの色背景、画面ごとのヘッダ帯）は全廃。thead は `--muted` 背景 + `--muted-foreground` 文字。
- `--disabled-foreground` は無効・プレースホルダ以外に使わない（`text-gray-400` の乱用の代替ではない）。
- `:root` に `--x: var(--y)` を書かない。Tailwind への公開は `@theme inline` だけ。
