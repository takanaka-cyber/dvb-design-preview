// UI キット用モックデータ（実データの形は uploads/…項目一覧.md に準拠）
export const NAMES = ["三冨", "古木", "大倉", "太一", "岩崎", "白井", "高橋"]; // GG 事業部の実在7名（本番 org マスタ準拠）
/** GG メンバー（日報 月別・週次レポートのメンバー切替で使う）。NAMES と同じ 7 名 */
export const GG_MEMBERS = NAMES;
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

/* ---------- 週（WeekSelector 用。新しい順、index 0 = 今週） ---------- */
export const WEEKS = (() => {
  const d = (m, day) => `${m}/${day}`;
  const starts = [[9, 8], [9, 1], [8, 25], [8, 18], [8, 11], [8, 4], [7, 28], [7, 21], [7, 14], [7, 7], [6, 30], [6, 23]];
  const ends = [[9, 14], [9, 7], [8, 31], [8, 24], [8, 17], [8, 10], [8, 3], [7, 27], [7, 20], [7, 13], [7, 6], [6, 29]];
  return starts.map(([m, day], i) => ({ key: `${m}-${day}`, label: `${d(m, day)}（月）〜 ${d(ends[i][0], ends[i][1])}（日）`, current: i === 0 }));
})();

/* ---------- 週次レポート ---------- */
const MEDIA = ["FB", "TikTok", "Google", "その他"];
const ABBR = { "A社 記事LP": "A社_記事LP", "C社 美容D2C": "C社_美容", "B社 通販": "B社_通販", "D社 サプリ": "D社_サプリ", "E社 保険比較": "E社_保険" };
/** 利益 TOP10。案件名・CPN 名は BOARD_ROWS から生成。数値は決定的（乱数なし）。 */
export const WEEKLY_TOP10 = BOARD_ROWS.filter((r) => r.profit != null).flatMap((r, i) => [0, 1].map((k) => {
  const share = k === 0 ? 0.62 : 0.38;
  const spend = Math.round(r.spend * share * (k === 0 ? 0.31 : 0.26));
  const profit = Math.round(r.profit * share);
  const revenue = spend + profit;
  const cv = Math.round(r.cv * share);
  const imp = Math.round(spend / (11 + i)) * 10;
  const clicks = Math.round(imp * (0.011 + i * 0.002));
  const mcv = Math.round(cv * 6.5);
  return {
    id: `${r.id}-${k}`, project: r.name, owner: r.owner, media: MEDIA[(i + k) % 4],
    name: `TM2-${(i % 3) + 1}_${r.owner}_${ABBR[r.name]}_${k === 0 ? "夏季CPN_v3_興味関心_25-34F_リタゲ除外" : "型C検証_類似1%_35-44F"}`,
    spend, revenue, profit, roas: +(revenue / spend * 100).toFixed(1), cv, cpa: Math.round(spend / cv), imp, clicks,
    ctr: +(clicks / imp * 100).toFixed(2), cpc: Math.round(spend / clicks), cpm: Math.round(spend / imp * 1000), mcv, mcpa: Math.round(spend / mcv), cvr: +(cv / clicks * 100).toFixed(2),
  };
})).sort((a, b) => b.profit - a.profit).slice(0, 10);

export const WEEKLY_KPI = { profit: 3523500, dp: 61900, spend: 16950909, ds: 13800, roas: 206.4, dr: 3.2, cv: 989, dc: 31 };
export const MONTHLY_GOAL = { target: 12000000, actual: 3523500 };
export const WEEKLY_MEDIA = [
  { media: "FB", spend: 9840000, ds: -120000, revenue: 20110000, dr: 410000, profit: 2130000, dp: 88000, roas: 204.4, droas: 2.1 },
  { media: "TikTok", spend: 4120000, ds: 210000, revenue: 8480000, dr: 630000, profit: 964200, dp: 41000, roas: 205.8, droas: 4.0 },
  { media: "Google", spend: 2350000, ds: -76000, revenue: 4650000, dr: -140000, profit: 402100, dp: -62000, roas: 197.9, droas: -1.9 },
  { media: "その他", spend: 640909, ds: -200, revenue: 668000, dr: 5000, profit: 27200, dp: -5100, roas: 104.2, droas: 0.8 },
];
export const SHARED_CPN = [
  { id: "s1", name: "TM2-共有_ブランドキーワード_Google", owner: "共有", spend: 420000, profit: 188000, roas: 144.8 },
  { id: "s2", name: "TM2-共有_リマケ_FB", owner: "共有", spend: 220909, profit: 64000, roas: 129.0 },
];
export const AI_RESULT = {
  title: "利益は前週比 +1.8%。C社（TikTok）の伸びが D社の減少を打ち消した",
  body: "C社 美容D2C は TikTok 新規 CPN の入札調整で CV +41。D社 サプリは Google の CPA が ¥4,000 台に上がり利益 −¥98,400。来週は D社の LP 側（記事 → 商品）の遷移率を先に切り分けると、媒体か LP かの判断が 1 日で付きます。",
  at: "9/8 10:12",
};

/* ---------- 日報 履歴・月別 ---------- */
const DOW = ["日", "月", "火", "水", "木", "金", "土"];
/** 2026-09 の各日（設計書の表記に合わせ 9/9 = 火 とする） */
export const SEPT_DAYS = Array.from({ length: 30 }, (_, i) => { const d = i + 1; const dow = DOW[d % 7]; return { d, dow, weekend: dow === "土" || dow === "日" }; });
export const MBO_HISTORY = SEPT_DAYS.filter((x) => x.d <= 9).map((x) => {
  const st = x.weekend ? "off" : x.d === 3 ? "none" : x.d === 9 ? "draft" : "sent";
  const good = { 1: "GG 週次案件ボードの雛形を作り、A社・C社の今週タスクを入力した", 2: "A社 記事LP の CR 差し替え（型B → 型C）を FB で配信開始。初日 CTR 1.5%", 4: "週次レポートの施策コメントを全案件分記入。B社の消化増の要因を媒体別に切り分けた。", 7: "AI系記事15件の売上を更新し、累計11,897,525円を確認した", 8: "D社 サプリのシュリンク要因を媒体別に分解。Google の CPA 上昇が主因と判明" }[x.d] || "";
  const bad = { 1: "タスクの粒度が粗く、金曜に完了判定できない行があった", 2: "CR 差し替え後の計測タグ確認が後手になった", 4: "D社のシュリンク要因の切り分けが金曜までに終わらず、来週頭に持ち越し。", 7: "FrameFlow の利用者が迷わず使えるかの確認が未着手", 8: "LP 側の切り分けまで進められなかった" }[x.d] || "";
  return { ...x, date: `9/${x.d}（${x.dow}）`, status: st, good, bad, comment: x.d === 4 ? { by: "上長", at: "9/5 09:20", text: "媒体別の切り分け、良い動きです。D社は LP 側も先に見ておいてください。" } : x.d === 8 ? { by: "上長", at: "9/8 19:02", text: "主因の特定まで 1 日で進めたのは早い。次は LP 遷移率を。" } : null, sentAt: st === "sent" ? "18:42" : null };
});
/** 月別グリッド: メンバー × 日。sent / none / off */
export const MBO_MONTHLY = GG_MEMBERS.map((n, mi) => ({
  name: n,
  cells: SEPT_DAYS.map((x) => {
    if (x.d > 9) return { d: x.d, s: "future" };
    if (x.weekend) return { d: x.d, s: "off" };
    if (x.d === 9) return { d: x.d, s: (mi === 1 || mi === 3) ? "sent" : "none" };
    if ((x.d + mi) % 7 === 3) return { d: x.d, s: "none" };
    if (mi === 4 && x.d === 2) return { d: x.d, s: "off" };
    return { d: x.d, s: "sent" };
  }),
}));

/* ---------- サイドバー（2.7 再編） ---------- */
export const NAV_GROUPS = [
  { label: "毎日", items: [
    { key: "dashboard", label: "ダッシュボード", icon: "LayoutDashboard" },
    { key: "tasks", label: "タスク管理", icon: "ListTodo", badge: 3 },
    { key: "mbo", label: "日報", icon: "BookOpen" },
    { key: "commit", label: "コミットメント", icon: "Target", badge: 1, badgeTone: "negative" },
  ] },
  { label: "週次", items: [
    { key: "weekly", label: "週次レポート", icon: "BarChart3" },
    { key: "project", label: "案件別まとめ", icon: "FolderKanban" },
    { key: "hit", label: "ヒット施策", icon: "Sparkles" },
    { key: "knowledge", label: "検証ナレッジ", icon: "Search" },
  ] },
  { label: "目標・評価", items: [
    { key: "goal", label: "目標", icon: "ClipboardCheck" },
  ] },
  { label: "ツール", items: [
    { key: "analytics", label: "分析", icon: "Activity" },
    { key: "shoot", label: "撮影スケジュール", icon: "Camera" },
    { key: "links", label: "リンク集", icon: "Link2" },
    { key: "manual", label: "マニュアル", icon: "FileText" },
  ] },
  { label: "研修", items: [
    { key: "training", label: "研修", icon: "GraduationCap" },
  ] },
  { label: "管理（ADMIN）", items: [
    { key: "admin-users", label: "ユーザー管理", icon: "Users" },
    { key: "admin-projects", label: "案件マスタ", icon: "Database" },
    { key: "admin-project-summary", label: "案件別まとめ管理", icon: "FolderCog" },
    { key: "admin-assets", label: "アセクリ管理", icon: "Images" },
    { key: "admin-weekly", label: "週次まとめ管理", icon: "CalendarCog" },
    { key: "admin-training", label: "研修管理", icon: "BookOpenCheck" },
    { key: "admin-goals", label: "目標設定", icon: "Flag" },
    { key: "admin-system", label: "システム設定", icon: "Settings" },
  ] },
];
/** キット内で実画面があるナビ項目 → screen キー */
export const NAV_TO_SCREEN = { board: "board", project: "project", mbo: "mbo", weekly: "weekly", goal: "goal", commit: "commit", dashboard: "dashboard" };
