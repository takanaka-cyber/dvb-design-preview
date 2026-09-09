// UI キット用モックデータ（実データの形は uploads/…項目一覧.md に準拠）
export const NAMES = ["三冨", "古木", "大倉", "太一", "岩崎", "白井", "高橋"]; // GG 事業部の実在7名（本番 org マスタ準拠）
export const PROJECTS = ["A社 記事LP", "B社 通販", "C社 美容D2C", "D社 サプリ", "E社 保険比較", "F社 紐付けCP"];

// 行 = 案件。owner はマスタの現担当者（1人）。tasks[].assignee が「今週タスクを持つ人」（複数可）。
// note は展開領域に出す備考／フォーカス、cp は検証CP要約。
export const BOARD_ROWS = [
  { id: 1, name: "A社 記事LP", rank: "S", owner: "白井", profit: 1204300, dp: 120400, lastProfit: 1083900, roas: 311.7, dr: 12.3, lastRoas: 299.4, spend: 8090909, ds: -38200, lastSpend: 8129109, cv: 412, dc: 18, lastCv: 394,
    note: "型C が伸びている。記事LPの見出しABは 9/12 まで様子見。", cp: { count: 3, profit: 934300 },
    tasks: [{ id: 11, text: "CR 差し替え（型B → 型C）", assignee: "白井", due: "9/10", done: false }, { id: 12, text: "記事LP の見出し AB 追加", assignee: "三冨", due: "9/12", done: true }, { id: 13, text: "類似1% の予算 1.5 倍", assignee: "古木", due: "9/11", done: false }] },
  { id: 2, name: "C社 美容D2C", rank: "A", owner: "大倉", profit: 964200, dp: 88600, lastProfit: 875600, roas: 245.0, dr: 6.8, lastRoas: 238.2, spend: 4120000, ds: 210000, lastSpend: 3910000, cv: 388, dc: 41, lastCv: 347,
    note: "TikTok 新規 CPN の入札が高止まり。", cp: { count: 2, profit: 402100 },
    tasks: [{ id: 21, text: "TikTok 新規 CPN の入札調整", assignee: "大倉", due: "9/5", done: false, overdue: true }, { id: 22, text: "縦文字展開の CR 3本", assignee: "太一", due: "9/11", done: false }] },
  { id: 3, name: "B社 通販", rank: "A", owner: "岩崎", profit: 834900, dp: -52100, lastProfit: 887000, roas: 188.2, dr: -4.1, lastRoas: 192.3, spend: 2210000, ds: 150000, lastSpend: 2060000, cv: 96, dc: -7, lastCv: 103,
    note: "", cp: { count: 1, profit: 120400 }, tasks: [] },
  { id: 4, name: "D社 サプリ", rank: "B", owner: "高橋", profit: 402100, dp: -98400, lastProfit: 500500, roas: 142.9, dr: -18.6, lastRoas: 161.5, spend: 1890000, ds: -320000, lastSpend: 2210000, cv: 71, dc: -22, lastCv: 93,
    note: "シュリンク要因が媒体か LP か未切り分け。", cp: { count: 2, profit: -18000 },
    tasks: [{ id: 41, text: "シュリンク要因の切り分け（媒体 or LP）", assignee: "高橋", due: "9/9", done: false }, { id: 42, text: "LP ファーストビュー差し替え案", assignee: "岩崎", due: "9/12", done: false }] },
  { id: 5, name: "E社 保険比較", rank: "C", owner: "三冨", profit: 118000, dp: 3400, lastProfit: 114600, roas: 121.0, dr: 0.4, lastRoas: 120.6, spend: 640000, ds: 12000, lastSpend: 628000, cv: 22, dc: 1, lastCv: 21,
    note: "", cp: { count: 1, profit: 8000 }, tasks: [{ id: 51, text: "撤退判断の材料まとめ", assignee: "三冨", due: "9/12", done: false }] },
  { id: 6, name: "F社 紐付けCP", rank: "停止", owner: "古木", profit: null, roas: null, spend: null, cv: null, note: "", cp: { count: 0, profit: null }, tasks: [] },
];

export const CPN_ROWS = [
  { id: 1, name: "TM2-2_白井_夏季CPN_v3", spend: 2104300, imp: 1384200, click: 18420, mcv: 1240, cv: 188, cpa: 11193, cpc: 114, ctr: 1.33, profit: 604200, roas: 128.7 },
  { id: 2, name: "TM2-2_白井_型C検証", spend: 812000, imp: 602300, click: 9050, mcv: 610, cv: 74, cpa: 10973, cpc: 90, ctr: 1.50, profit: 288100, roas: 135.5 },
  { id: 3, name: "TM2-2_白井_記事LP_AB", spend: 388000, imp: 240100, click: 3110, mcv: 190, cv: 21, cpa: 18476, cpc: 125, ctr: 1.30, profit: 42000, roas: 110.8 },
];

export const ADSET_ROWS = [
  { id: 1, name: "AS_25-34F_興味関心", cpn: "TM2-2_白井_夏季CPN_v3", spend: 1204000, imp: 802300, click: 10200, result: 112, cpr: 10750, cpc: 118, ctr: 1.27, cpm: 1501 },
  { id: 2, name: "AS_35-44F_類似1%", cpn: "TM2-2_白井_夏季CPN_v3", spend: 900300, imp: 581900, click: 8220, result: 76, cpr: 11846, cpc: 110, ctr: 1.41, cpm: 1547 },
];

export const MBO_RECENT = [
  { date: "2026年9月7日（月）", good: "【行ったこと(事実)】\nAI系記事関連\n・AI系記事15件の売上を更新し、累計11,897,525円を確認した", bad: "【改善点】\nFrameFlow\n・利用者が迷わず使えるかを確認し、必要な表示を整える" },
  { date: "2026年9月4日（金）", good: "週次レポートの施策コメントを全案件分記入。B社の消化増の要因を媒体別に切り分けた。", bad: "D社のシュリンク要因の切り分けが金曜までに終わらず、来週頭に持ち越し。" },
];

export const NAV_GROUPS = [
  { label: "毎日", items: [
    { key: "dashboard", label: "ダッシュボード", icon: "LayoutDashboard" },
    { key: "tasks", label: "タスク管理", icon: "ListChecks", badge: 3 },
    { key: "mbo", label: "日報", icon: "BookOpen" },
  ] },
  { label: "週次", items: [
    { key: "weekly", label: "週次レポート", icon: "BarChart3" },
    { key: "project", label: "案件別まとめ", icon: "FolderKanban" }, // 着地は GG 週次案件ボード。1案件ページはボードから開く詳細
    { key: "hit", label: "ヒット施策", icon: "Sparkles" },
    { key: "knowledge", label: "検証ナレッジ", icon: "Search" },
    { key: "analytics", label: "分析", icon: "Activity" },
  ] },
  { label: "目標・評価", items: [
    { key: "commit", label: "コミットメント", icon: "Target", badge: 1, badgeTone: "negative" },
    { key: "goal", label: "目標", icon: "Flag" },
  ] },
  { label: "研修", items: [
    { key: "training", label: "研修", icon: "GraduationCap" },
    { key: "shoot", label: "撮影スケジュール", icon: "Camera" },
  ] },
  { label: "管理", items: [
    { key: "admin", label: "管理", icon: "Settings" },
  ] },
];
