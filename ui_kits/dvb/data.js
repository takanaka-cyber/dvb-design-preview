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
export const NAV_TO_SCREEN = { board: "board", project: "board-v2", mbo: "mbo", weekly: "weekly", goal: "goal", commit: "commit", dashboard: "dashboard", tasks: "tasks" };

/* ====================== バッチ 1（2026-09-10 追記）: タスク管理 / 課のタスク詳細 / ダッシュボード / コミットメント ====================== */
export const TODAY_ISO = "2026-09-09";
/** アセクリ（外部制作パートナー。個人名は置かない） */
export const ASSIGNEES = ["制作A社", "制作B社", "制作C社", "制作D社"];
export const TASK_OPTIONS = { target: ["新規", "既存"], type: ["CR", "LP", "記事", "バナー"], priority: ["高", "中", "低"] };
/** 課の構成（GG 実在 7 名。課分けは仮） */
export const SECTIONS = [{ name: "GG 1課", members: ["白井", "古木", "大倉", "太一"] }, { name: "GG 2課", members: ["岩崎", "三冨", "高橋"] }];

/** タスク入力（スプレッドシート風。下書き中の行） */
export const TASK_INPUT_ROWS = [
  { id: "i1", project: "A社 記事LP", target: "既存", type: "CR", title: "夏季CPN_v4", detail: "型C の勝ちパターン横展開 2 本", priority: "高", assignee: "制作A社", due: "2026-09-16" },
  { id: "i2", project: "C社 美容D2C", target: "新規", type: "LP", title: "", detail: "", priority: "中", assignee: "", due: "" },
  { id: "i3", project: "", target: "", type: "", title: "", detail: "", priority: "中", assignee: "", due: "" },
];
/** 今週タスク（9/8〜9/14）。owner = GG メンバー、due は ISO */
export const WEEK_TASKS = [
  { id: "t1", owner: "白井", project: "A社 記事LP", target: "既存", type: "CR", title: "夏季CPN_v3", detail: "型B → 型C 差し替え 3 本", priority: "高", assignee: "制作A社", due: "2026-09-10", done: false, dashboard: true },
  { id: "t2", owner: "白井", project: "A社 記事LP", target: "既存", type: "LP", title: "記事LP", detail: "見出し AB 追加", priority: "中", assignee: "制作B社", due: "2026-09-12", done: true, dashboard: true },
  { id: "t3", owner: "古木", project: "C社 美容D2C", target: "新規", type: "CR", title: "TikTok 新規", detail: "縦型 15 秒 2 本", priority: "高", assignee: "制作C社", due: "2026-09-11", done: false, dashboard: true },
  { id: "t4", owner: "古木", project: "C社 美容D2C", target: "既存", type: "バナー", title: "リタゲ", detail: "静止画 4 枚", priority: "低", assignee: "制作A社", due: "2026-09-12", done: true, dashboard: false },
  { id: "t5", owner: "大倉", project: "B社 通販", target: "既存", type: "記事", title: "比較記事", detail: "導入文の改稿", priority: "中", assignee: "制作B社", due: "2026-09-09", done: false, dashboard: true },
  { id: "t6", owner: "岩崎", project: "D社 サプリ", target: "既存", type: "LP", title: "商品LP", detail: "遷移率改善 FV 差し替え", priority: "高", assignee: "制作D社", due: "2026-09-05", done: false, dashboard: true },
  { id: "t7", owner: "白井", project: "E社 保険比較", target: "新規", type: "CR", title: "検証CP", detail: "訴求 3 案", priority: "低", assignee: "制作C社", due: "2026-09-14", done: true, dashboard: false },
  { id: "t8", owner: "岩崎", project: "D社 サプリ", target: "既存", type: "バナー", title: "Google", detail: "レスポンシブ 2 セット", priority: "中", assignee: "制作D社", due: "2026-09-13", done: true, dashboard: true },
];
/** 課のタスク（今週タスク + 三冨の 2 件） */
export const SECTION_TASKS = [
  ...WEEK_TASKS,
  { id: "t9", owner: "三冨", project: "F社 紐付けCP", target: "新規", type: "CR", title: "紐付け検証", detail: "訴求軸 2 案の比較", priority: "中", assignee: "制作C社", due: "2026-09-12", done: false, dashboard: true },
  { id: "t10", owner: "三冨", project: "B社 通販", target: "既存", type: "バナー", title: "秋物", detail: "季節バナー 3 枚", priority: "低", assignee: "制作B社", due: "2026-09-14", done: true, dashboard: false },
];
export const OTHER_CATEGORIES = ["事務", "学習", "その他"];
export const OTHER_TASKS = [
  { id: "o1", text: "9月度 経費精算", category: "事務", status: "未着手", subtasks: ["領収書の回収"] },
  { id: "o2", text: "Meta 認定資格の更新", category: "学習", status: "進行中", subtasks: [] },
];
/** アセクリ稼働状況: 9/8（月）〜 9/21（日）の納品予定件数（決定的な擬似値） */
export const LOAD_DAYS = Array.from({ length: 14 }, (_, i) => { const d = 8 + i; const day = d > 30 ? d - 30 : d; const dow = ["日", "月", "火", "水", "木", "金", "土"][d % 7]; return { key: `d${d}`, label: `9/${day}（${dow}）`, weekend: dow === "土" || dow === "日" }; });
export const ASSIGNEE_LOAD = ASSIGNEES.map((name, i) => ({ id: name, name, ...Object.fromEntries(LOAD_DAYS.map((x, j) => [x.key, x.weekend ? 0 : ((i * 3 + j * 2) % 7)])) }));
/** 過去のタスク（週アコーディオン） */
export const PAST_WEEKS = WEEKS.slice(1, 5).map((w, i) => ({ ...w, total: 7 - (i % 2), done: 7 - (i % 2) - (i === 1 ? 1 : 0), tasks: WEEK_TASKS.slice(0, 3).map((t) => ({ ...t, id: `${w.key}-${t.id}`, done: true })) }));

/* ---------- ダッシュボード ---------- */
export const CAL_WEEK = [8, 9, 10, 11, 12, 13, 14].map((d) => ({ d, dow: ["日", "月", "火", "水", "木", "金", "土"][d % 7] }));
export const CAL_EVENTS = [
  { d: 9, label: "B社 比較記事 改稿", kind: "task" }, { d: 10, label: "A社 CR 差し替え 3 本", kind: "task" }, { d: 10, label: "C社 縦型 撮影", kind: "shoot" },
  { d: 11, label: "C社 TikTok 新規 CR", kind: "task" }, { d: 12, label: "A社 見出し AB", kind: "task" }, { d: 12, label: "週次レポート 締切", kind: "deadline" }, { d: 14, label: "E社 訴求 3 案", kind: "task" },
];
export const TEAM_PROGRESS = GG_MEMBERS.map((name) => { const ts = SECTION_TASKS.filter((t) => t.owner === name); return { name, total: ts.length, done: ts.filter((t) => t.done).length }; });

/* ---------- コミットメント ---------- */
export const COMMIT_MONTHS = [{ key: "2026-09", label: "2026年9月", current: true }, { key: "2026-08", label: "2026年8月" }, { key: "2026-07", label: "2026年7月" }, { key: "2026-06", label: "2026年6月" }];
/** 自分（大倉）のコミットメント。type 毎日 = ✓ トグル、週次/月次 = −/＋ カウンタ */
export const MY_COMMITMENTS = [
  { id: "c1", title: "毎日 18:00 までに日報を送信する", type: "毎日", value: 5, max: 7, doneToday: true, late: false, reason: "", reflection: "" },
  { id: "c2", title: "週 2 本の新規 CR を配信開始する", type: "週次", value: 1, max: 2, late: true, missStreak: 2, reason: "制作C社の納品が 9/8 → 9/11 にずれた", reflection: "" },
  { id: "c3", title: "検証 CP の結果を金曜にまとめる", type: "週次", value: 1, max: 1, late: false, reason: "", reflection: "金曜 15 時に枠を固定したら回った" },
  { id: "c4", title: "D社の主因切り分けを月内に完了する", type: "月次", value: 0, max: 1, late: false, reason: "", reflection: "" },
];
export const TEAM_COMMITMENTS = {
  "事業部A": [
    { name: "白井", title: "週 2 本の新規 CR を配信開始", value: 2, max: 2, late: false },
    { name: "古木", title: "TikTok CPN の入札を毎朝確認", value: 2, max: 5, late: true, missStreak: 3 },
    { name: "三冨", title: "検証 CP の結果を金曜にまとめる", value: 1, max: 1, late: false },
  ],
  "事業部B": [
    { name: "岩崎", title: "D社の切り分けを日次で更新", value: 4, max: 5, late: false },
  ],
};

/* ====================== バッチ 2（2026-09-10 追記）: 目標 / ヒット施策 / 検証ナレッジ / 先週比較タスク / 分析 / 撮影 / リンク集 / マニュアル / 設定 ====================== */
/** ナビ → 画面（追記。目標は評価シート本描きへ） */
Object.assign(NAV_TO_SCREEN, { goal: "evaluation", hit: "hit", knowledge: "knowledge", analytics: "analytics", shoot: "shoot", links: "links", manual: "manual" });

/* ---------- 目標（評価シート） ---------- */
export const EVAL_QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
export const EVAL_MONTHS = { Q1: ["4月", "5月", "6月"], Q2: ["7月", "8月", "9月"], Q3: ["10月", "11月", "12月"], Q4: ["1月", "2月", "3月"] };
/** ステータス → [表示, Badge value] */
export const EVAL_STATUS = { draft: ["DRAFT", "neutral"], self: ["自己評価中", "todo"], first: ["一次評価中", "info"], final: ["最終評価中", "info"], returned: ["差し戻し", "late"], fixed: ["確定", "done"] };
/** 評価者は役職のみ（個人名は置かない） */
export const EVAL_INFO = { name: "大倉 一郎", status: "self", quarter: "Q2", year: 2026, dept: "GG 1課", grade: "G3", evaluator: "一次: 部長 / 最終: 事業部長", weight: 100 };
export const EVAL_COMPANY_GOALS = { company: "商材粗利 年 ¥1.6 億。新規検証 CP を月 8 本配信し、勝ちパターンを全社で共有する", dept: "GG: 月次商材粗利 ¥12,000,000 を Q2 の 3 か月連続で達成。D2C 領域の勝ちパターンを 2 型に整理する" };
export const EVAL_SCALE = ["S", "A", "B", "C", "D"];
export const EVAL_RESULT_GOALS = [
  { id: "r1", title: "担当案件の商材粗利 月 ¥12,000,000 を 3 か月連続で達成する", weight: 50, criteria: "S: 3 か月達成 / A: 2 か月 / B: 1 か月 / C: 0 か月", self: "A", selfNote: "7・8 月は達成。9 月は 9/8 時点で進捗 29%。", first: "", final: "" },
  { id: "r2", title: "D社 サプリのシュリンク主因を切り分け、LP 改修まで完了する", weight: 30, criteria: "S: 改修後 CPA 20% 改善 / A: 改修完了 / B: 主因特定 / C: 未着手", self: "B", selfNote: "Google の CPA 上昇が主因と特定。LP 遷移率の切り分けは未着手。", first: "", final: "" },
  { id: "r3", title: "新規検証 CP を四半期 24 本（月 8 本）配信開始する", weight: 20, criteria: "S: 24 本以上 / A: 20 本 / B: 16 本 / C: 16 本未満", self: "A", selfNote: "9/8 時点 17 本。9 月中に 4 本追加予定。", first: "", final: "" },
];
export const EVAL_BEHAVIOR_GOALS = {
  G2: [{ id: "b1", title: "担当 CPN の数値を毎朝確認し、異常を当日中に報告する", self: "A", first: "" }, { id: "b2", title: "検証結果をナレッジ DB に月 2 件以上登録する", self: "B", first: "" }],
  G3: [{ id: "b1", title: "課のタスクの期限超過を週次で確認し、遅れを先回りして潰す", self: "A", first: "" }, { id: "b2", title: "検証結果をナレッジ DB に週 1 件以上登録する", self: "B", first: "" }, { id: "b3", title: "後輩の日報に週 2 回以上コメントする", self: "A", first: "" }],
  G4: [{ id: "b1", title: "部の粗利目標に対する打ち手を月初に決め、週次で修正する", self: "B", first: "" }, { id: "b2", title: "新領域の検証テーマを四半期 1 件立ち上げる", self: "B", first: "" }],
};
export const GRADE_TABLE = [
  { id: "G1", grade: "G1", role: "指示のもとで運用を回す", expect: "担当 CPN の日次確認・報告" },
  { id: "G2", grade: "G2", role: "案件を 1 人で回す", expect: "案件粗利の月次目標達成" },
  { id: "G3", grade: "G3", role: "課のタスクとメンバーを見る", expect: "課の粗利目標・後輩育成" },
  { id: "G4", grade: "G4", role: "部の数値責任を持つ", expect: "部粗利・新領域の立ち上げ" },
  { id: "G5", grade: "G5", role: "事業部の戦略を決める", expect: "事業部 P/L" },
];

/* ---------- ヒット施策 ---------- */
export const HIT_COUNTS = { waiting: 2, approval: 1, done: 12 };
export const HIT_REQUESTS_TO_ME = [
  { id: "hr1", project: "A社 記事LP", from: "白井", due: "9/12", note: "型C の勝ちパターン（訴求・構成）をまとめてください" },
  { id: "hr2", project: "C社 美容D2C", from: "古木", due: "9/15", note: "TikTok 入札調整の手順を再現できる形で" },
];
export const HIT_MY_REQUESTS = [
  { id: "mr1", to: "岩崎", project: "D社 サプリ", due: "9/19", status: "todo" },
  { id: "mr2", to: "三冨", project: "B社 通販", due: "9/5", status: "done" },
];
export const HIT_APPROVALS = [
  { id: "ap1", by: "古木", project: "C社 美容D2C", title: "TikTok 新規 CPN の入札を CPA 目標の 80% で開始", at: "9/9 11:20", before: "入札は CPA 目標の 100% で開始し、3 日後に調整する", after: "入札は CPA 目標の 80% で開始し、初日は配信量を見て 20% ずつ引き上げる" },
];
export const HIT_MEASURES = [
  { id: "h1", month: "2026年9月", project: "A社 記事LP", media: "FB", title: "型B → 型C の CR 差し替えで CPA 18% 改善", author: "白井", date: "9/8", content: "冒頭 3 秒を「悩みの提示」から「結果の提示」に変更。記事 LP の見出しも同じ順に揃えた。", before: 13200, after: 10800, point: "CR と LP の見出しの順序を揃えること。CR だけ変えると CTR は上がるが CVR が落ちる。" },
  { id: "h2", month: "2026年9月", project: "C社 美容D2C", media: "TikTok", title: "新規 CPN の入札を CPA 目標の 80% で開始し初日から利益", author: "古木", date: "9/5", content: "入札を目標 CPA の 80% で開始し、配信量を見ながら 20% ずつ引き上げた。", before: 9800, after: 7900, point: "初日の配信量が目標の半分以下なら翌朝に 20% 上げる。1 日 2 回以上は触らない。" },
  { id: "h3", month: "2026年8月", project: "B社 通販", media: "Google", title: "比較記事の導入文改稿で CVR 1.9% → 2.6%", author: "大倉", date: "8/28", content: "導入文を「3 商品の比較表」から「選び方 3 つの基準」に変更。", before: 11400, after: 8600, point: "比較記事は表より基準の提示が先。表は 2 スクロール目以降に。" },
  { id: "h4", month: "2026年8月", project: "E社 保険比較", media: "FB", title: "年代別 CR 3 本の出し分けで CPA 12% 改善", author: "白井", date: "8/14", content: "25-34 / 35-44 / 45-54 で訴求を分け、広告セットごとに 1 本ずつ。", before: 18200, after: 16000, point: "年代で訴求を分けるなら広告セットも分ける。1 セットに 3 本入れると学習が割れる。" },
  { id: "h5", month: "2026年7月", project: "D社 サプリ", media: "Google", title: "検索 KW の除外を週次で回して CPA 9% 改善", author: "岩崎", date: "7/22", content: "検索語句レポートを毎週金曜に確認し、CV 0 の KW を除外。", before: 4400, after: 4000, point: "除外は週 1 回まとめて。日次でやると学習がリセットされる。" },
];

/* ---------- 検証ナレッジ ---------- */
export const AD_ROWS = [
  { id: 1, name: "AD_型C_訴求A_15s", adset: "AS_25-34F_興味関心", spend: 640000, imp: 420300, click: 5600, result: 61, cpr: 10492, ctr: 1.33, cpc: 114, cpm: 1523 },
  { id: 2, name: "AD_型C_訴求B_15s", adset: "AS_25-34F_興味関心", spend: 564000, imp: 382000, click: 4600, result: 51, cpr: 11059, ctr: 1.20, cpc: 123, cpm: 1476 },
  { id: 3, name: "AD_型B_旧_30s", adset: "AS_35-44F_類似1%", spend: 900300, imp: 581900, click: 8220, result: 76, cpr: 11846, ctr: 1.41, cpc: 110, cpm: 1547 },
];
export const KNOWLEDGE_FILTERS = { media: ["FB", "TikTok", "Google", "その他"], dept: ["GG 1課", "GG 2課"] };
export const KNOWLEDGE_RESULTS = [
  { id: "k1", project: "A社 記事LP", media: "FB", owner: "白井", dept: "GG 1課", period: "8/25〜9/7", title: "型C 検証（訴求 3 案）", hypothesis: "冒頭を結果提示にすると CTR が上がり、CVR は維持できる", result: "CTR 1.30 → 1.50%、CPA ¥13,200 → ¥10,800。訴求 A を採用" },
  { id: "k2", project: "C社 美容D2C", media: "TikTok", owner: "古木", dept: "GG 1課", period: "8/18〜8/31", title: "縦型 15 秒 × 入札 80% 開始", hypothesis: "低入札で開始しても配信量は出る", result: "初日から利益。CPA ¥9,800 → ¥7,900" },
  { id: "k3", project: "D社 サプリ", media: "Google", owner: "岩崎", dept: "GG 2課", period: "8/11〜8/24", title: "検索 KW 除外の頻度比較（日次 vs 週次）", hypothesis: "週次除外のほうが学習が安定する", result: "週次のほうが CPA 9% 低い。日次は学習リセットで変動大" },
  { id: "k4", project: "B社 通販", media: "Google", owner: "大倉", dept: "GG 1課", period: "8/4〜8/17", title: "比較記事 導入文 AB", hypothesis: "基準の提示を先にすると CVR が上がる", result: "CVR 1.9 → 2.6%。表は 2 スクロール目に移動" },
];

/* ---------- 案件別まとめ 先週比較: 案件タスク（下部セクション） ---------- */
export const PROJECT_TASKS = [
  { id: "p1", project: "A社 記事LP", text: "CR 差し替え（型B → 型C）3 本の配信確認", assignee: "白井", due: "9/10", done: false },
  { id: "p2", project: "C社 美容D2C", text: "TikTok 新規 CPN の入札を 20% 引き上げ", assignee: "古木", due: "9/9", done: true },
  { id: "p3", project: "B社 通販", text: "比較記事の導入文 改稿を入稿", assignee: "大倉", due: "9/11", done: false },
  { id: "p4", project: "D社 サプリ", text: "LP 遷移率の切り分け（記事 → 商品）", assignee: "岩崎", due: "9/5", done: false, overdue: true },
  { id: "p5", project: "E社 保険比較", text: "年代別 CR の 3 本目を追加", assignee: "白井", due: "9/12", done: false },
  { id: "p6", project: "A社 記事LP", text: "見出し AB の結果を週次レポートに反映", assignee: "白井", due: "9/8", done: true },
];

/* ---------- 分析（AI レポート） ---------- */
export const ANALYTICS_TEMPLATE_GROUPS = [
  { key: "weekly", label: "週次", items: [
    { title: "今週の利益増減の要因", body: "今週の案件別の粗利増減を、媒体・CR・LP の 3 観点で要因分解してください。増減が大きい上位 3 案件を優先。" },
    { title: "来週の一手", body: "今週の数値から、来週最初に手を付けるべき施策を案件ごとに 1 つずつ挙げてください。" },
    { title: "先週比較の異常値", body: "先週比で ROAS が ±10pt 以上動いた CPN を一覧にし、考えられる原因を書いてください。" },
  ] },
  { key: "project", label: "案件", items: [
    { title: "案件の CPA 推移", body: "指定案件の CPA を過去 4 週で並べ、上昇局面の共通点を挙げてください。" },
    { title: "媒体別の相性", body: "指定案件で媒体ごとの ROAS・CV を比較し、予算配分の見直し案を出してください。" },
    { title: "CR の勝ちパターン", body: "指定案件で CTR・CVR の両方が平均以上の CR を抽出し、共通する訴求・構成を書いてください。" },
  ] },
  { key: "member", label: "メンバー", items: [
    { title: "担当案件の月次まとめ", body: "指定メンバーの担当案件について、当月の粗利・ROAS・実施施策を 1 枚にまとめてください。" },
    { title: "タスク完了率", body: "指定メンバーの今週タスクの完了率と期限超過を一覧にしてください。" },
    { title: "日報からの課題抽出", body: "指定メンバーの直近 2 週間の日報から、繰り返し出ている課題を 3 つ抽出してください。" },
  ] },
];
export const ANALYTICS_HISTORY = [
  { id: "ah1", question: "今週の利益増減の要因を教えて", at: "9/8 10:12" },
  { id: "ah2", question: "D社 サプリの CPA 上昇はどの媒体が原因？", at: "9/4 17:40" },
  { id: "ah3", question: "白井さんの担当案件の 8 月まとめ", at: "9/1 09:15" },
];
export const ANALYTICS_REPORT = {
  question: "今週の利益増減の要因を教えて", at: "9/8 10:12",
  summary: "利益は前週比 +1.8%（+¥61,900）。C社（TikTok）の伸びが D社（Google）の減少を打ち消した。",
  table: { columns: ["案件", "今週粗利", "増減", "主因"], rows: [["A社 記事LP", "¥1,204,300", "+¥120,400", "CR 型C 差し替え（CPA −18%）"], ["C社 美容D2C", "¥964,200", "+¥88,600", "TikTok 新規 CPN の入札調整（CV +41）"], ["B社 通販", "¥834,900", "−¥52,100", "消化増に CV が追随せず"], ["D社 サプリ", "¥402,100", "−¥98,400", "Google CPA ¥4,000 台に上昇"]] },
  factors: ["C社: TikTok 新規 CPN を入札 80% で開始 → 初日から利益、CV +41", "D社: Google の CPA が ¥3,120 → ¥4,080。検索 KW の除外が 2 週止まっていた", "B社: 消化 +¥150,000 に対し CV −7。記事 LP の導入文改稿が入稿前"],
  next: ["D社: 検索 KW 除外を金曜に再開し、LP 遷移率（記事 → 商品）を先に切り分ける", "B社: 導入文の改稿を 9/11 までに入稿", "A社: 型C を E社にも横展開（年代別 3 本）"],
};

/* ---------- 撮影スケジュール（2026 年 9 月。data.js の暦: 9/1 = 月） ---------- */
export const SHOOT_EVENTS = [
  { id: "s1", d: 3, time: "10:00", title: "A社 型C 撮影（都内スタジオ）", kind: "shoot", project: "A社 記事LP", owner: "白井", memo: "訴求 3 案 × 15 秒" },
  { id: "s2", d: 10, time: "14:00", title: "C社 縦型 15 秒 撮影", kind: "shoot", project: "C社 美容D2C", owner: "古木", memo: "モデル 2 名、自社スタジオ" },
  { id: "s3", d: 12, time: "", title: "週次レポート 締切", kind: "deadline", project: "", owner: "", memo: "" },
  { id: "s4", d: 16, time: "13:00", title: "D社 商品 撮影（自社）", kind: "shoot", project: "D社 サプリ", owner: "岩崎", memo: "物撮り、白背景" },
  { id: "s5", d: 18, time: "", title: "A社 CR 納品 締切", kind: "deadline", project: "A社 記事LP", owner: "白井", memo: "制作A社 → 3 本" },
  { id: "s6", d: 24, time: "10:30", title: "B社 秋物 バナー撮影", kind: "shoot", project: "B社 通販", owner: "三冨", memo: "" },
  { id: "s7", d: 30, time: "", title: "月次 振り返り 締切", kind: "deadline", project: "", owner: "", memo: "" },
];

/* ---------- リンク集（カテゴリ 6。色ドットなし、見出しだけで区別） ---------- */
export const LINK_CATEGORIES = [
  { key: "ad", label: "広告", icon: "Megaphone", links: [{ id: "l1", name: "Meta 広告マネージャ", icon: "Megaphone" }, { id: "l2", name: "TikTok Ads Manager", icon: "Video" }, { id: "l3", name: "Google 広告", icon: "Search" }, { id: "l4", name: "AXAD 集計", icon: "Database" }] },
  { key: "review", label: "精査", icon: "ClipboardCheck", links: [{ id: "l5", name: "CP 精査シート", icon: "FileSpreadsheet" }, { id: "l6", name: "命名規則チェック", icon: "ListChecks" }, { id: "l7", name: "計測タグ 確認手順", icon: "FileText" }] },
  { key: "request", label: "依頼", icon: "Send", links: [{ id: "l8", name: "アセクリ発注フォーム", icon: "PenLine" }, { id: "l9", name: "撮影 依頼シート", icon: "Camera" }, { id: "l10", name: "チャットワーク（GG 1課）", icon: "MessageSquare" }] },
  { key: "production", label: "制作", icon: "Image", links: [{ id: "l11", name: "CR 素材ドライブ", icon: "Folder" }, { id: "l12", name: "LP テンプレ", icon: "LayoutTemplate" }, { id: "l13", name: "記事 LP 構成メモ", icon: "FileText" }, { id: "l14", name: "旧 CP 管理シート", icon: "FileSpreadsheet", hidden: true }] },
  { key: "analysis", label: "分析", icon: "BarChart3", links: [{ id: "l15", name: "週次レポート（Looker）", icon: "BarChart3" }, { id: "l16", name: "媒体別 ダッシュボード", icon: "PieChart" }, { id: "l17", name: "検証ナレッジ DB", icon: "Search" }] },
  { key: "mine", label: "マイリンク", icon: "Star", links: [{ id: "l18", name: "自分の案件シート", icon: "FileSpreadsheet" }, { id: "l19", name: "日報テンプレ", icon: "BookOpen" }] },
];
export const PERSONAL_LINK_SETTINGS = { sheet: "https://docs.google.com/spreadsheets/d/1AbC…/edit", drive: "https://drive.google.com/drive/folders/…", chatwork: "https://www.chatwork.com/#!rid312345678" };
export const SHARED_LINK_URLS = { manual: "https://docs.google.com/document/d/…", knowledge: "https://axis.example/reports/knowledge" };

/* ---------- マニュアル（TOC + 本文ブロック） ---------- */
export const MANUAL_SECTIONS = [
  { id: "m1", num: "1", title: "AXIS とは", blocks: [{ t: "p", text: "AXIS は GG の日次業務を 1 か所で回すための社内ツールです。日報・タスク・週次レポート・案件別まとめを同じ画面群で扱います。" }, { t: "p", text: "数値は AXAD の集計を毎朝 6:00 に同期します。同期後の数値は「鮮度」バッジで確認できます。" }] },
  { id: "m2", num: "2", title: "毎日の流れ", blocks: [{ t: "ul", items: ["朝: ダッシュボードで今日のタスクとチェックリストを確認", "日中: タスク管理で進捗を更新。アセクリへの発注はタスク行から送信", "18:00 まで: 日報を書いて送信（送信すると上長のチャットワークに通知）", "金曜: 今週タスクの完了チェックと週次レポートのコメント記入"] }, { t: "quote", text: "日報は「行ったこと（事実）」と「改善点」の 2 欄。書き終えたら［完了して送信］1 回で終わります。" }] },
  { id: "m3", num: "3", title: "タスク管理", blocks: [{ t: "h3", text: "3.1 タスク入力" }, { t: "p", text: "スプレッドシート風の 1 行入力です。案件名 → 対象 → 種別 → 本編名 → 施策内容 → 優先度 → アセクリ → 期限日 の順に入力し、右下の［保存］で確定します。空の行は保存されません。" }, { t: "table", columns: ["列", "入力", "例"], rows: [["対象", "新規 / 既存", "既存"], ["種別", "CR / LP / 記事 / バナー", "CR"], ["優先度", "高 / 中 / 低", "高"], ["期限日", "日付", "2026-09-16"]] }, { t: "h3", text: "3.2 発注送信" }, { t: "p", text: "今週タスクの行を展開し、発注メモを書いて［発注送信］。アセクリのチャットワークに定型文で送られます。" }, { t: "code", text: "【発注】A社 記事LP / CR / 夏季CPN_v3\n施策: 型B → 型C 差し替え 3 本\n期限: 9/10（水）\n参考: 前回 v3 の 2 本目" }] },
  { id: "m4", num: "4", title: "週次レポート", blocks: [{ t: "p", text: "毎週月曜に先週分が生成されます。KPI 4 → 月間目標 → 振り返り 3 欄 → AI 分析 → 利益 TOP10 の順に読み、振り返りは自動保存です。" }, { t: "ul", items: ["振り返りは入力ごとに保存されます（右上の保存状態を確認）", "AI 分析は［分析を実行］で 30 秒ほど", "共有 CP は既定で閉じています。必要なときだけ開く"] }] },
  { id: "m5", num: "5", title: "用語", blocks: [{ t: "table", columns: ["用語", "意味"], rows: [["CPA", "最終 CV 1 件あたりの広告費"], ["mCPA", "中間 CV（記事 LP の遷移など）1 件あたりの広告費"], ["ROAS", "広告費に対する売上の割合（%）"], ["アセクリ", "外部の制作パートナー"], ["CP / CPN", "キャンペーン"]] }, { t: "p", text: "計算式は 研修 → 用語集 → KPI にまとまっています。" }] },
  { id: "m6", num: "6", title: "困ったとき", blocks: [{ t: "ul", items: ["保存に失敗した: 入力はブラウザに退避されています。再読み込み後に上部の「下書きを復元」から戻せます", "数値が古い: 鮮度バッジが「6:00 更新」以外なら、設定 → システム設定 → 追加取得 を確認", "画面が見つからない: サイドバーの検索、または本マニュアルの目次から"] }, { t: "quote", text: "それでも解決しないときは GG 1課 のチャットワークに画面のスクリーンショットを貼ってください。" }] },
];

/* ---------- 設定 ---------- */
export const SETTINGS_PROFILE = { name: "大倉 一郎", email: "okura@example.com", dept: "GG 1課", role: "リーダー" };
export const SETTINGS_CHATWORK = { roomId: "312345678", accountId: "1234567", reportTargets: [{ id: "cw1", roomId: "312345678", accountId: "7654321", label: "GG 1課 タスク報告" }, { id: "cw2", roomId: "398765432", accountId: "", label: "日報" }] };
export const SETTINGS_SHEETS = [{ id: "sh1", project: "A社 記事LP", url: "https://docs.google.com/spreadsheets/d/1Abc…/edit" }, { id: "sh2", project: "C社 美容D2C", url: "https://docs.google.com/spreadsheets/d/1Def…/edit" }];

/* ====================== バッチ 3（2026-09-10 追記）: 研修 / ログイン・登録 / アセクリ ====================== */
/** ナビ → 画面（追記。研修はホームへ） */
Object.assign(NAV_TO_SCREEN, { training: "training-home" });

/* ---------- 研修（研修生・上長の個人名は置かない） ---------- */
export const TRAINEE = { label: "研修生A", start: "2026-09-01", startLabel: "9/1（月）", day: 7, mentor: "上長" };
/** SubNav のグループ（§3.3.1）。progress / dot は画面側で埋める */
export const TRAINING_NAV = [
  { items: [{ key: "training-home", label: "ホーム", icon: "House" }] },
  { label: "進める", items: [
    { key: "training-schedule", label: "スケジュール", icon: "CalendarDays" },
    { key: "training-learning", label: "学習リスト", icon: "BookOpen" },
    { key: "training-checklist", label: "チェックリスト", icon: "ListChecks" },
    { key: "training-quiz", label: "理解度チェック", icon: "CircleHelp" },
  ] },
  { label: "記録する", items: [
    { key: "training-values", label: "バリュー振り返り", icon: "Heart" },
    { key: "training-cr", label: "CRアウトプット", icon: "Image" },
  ] },
  { label: "調べる", items: [
    { key: "training-glossary", label: "用語集", icon: "BookMarked" },
    { key: "training-qa", label: "Q&A", icon: "MessageSquare" },
  ] },
];
/** スケジュール（Day 1〜）。status: done / current / future。links = 学習リスト・理解度チェックへの導線 */
export const TRAINING_STEPS = [
  { id: "s1", day: 1, date: "9/1（月）", title: "AXIS と GG の業務を知る", minutes: 90, status: "done", lectures: 2, assignments: 0, note: "マニュアル §1〜§2 を読む。ダッシュボードと日報の使い方" },
  { id: "s2", day: 2, date: "9/2（火）", title: "広告運用の基本用語", minutes: 120, status: "done", lectures: 3, assignments: 1, note: "CPA / mCPA / ROAS の計算式。用語集 KPI で確認" },
  { id: "s3", day: 3, date: "9/3（水）", title: "Meta 広告マネージャの構造", minutes: 150, status: "done", lectures: 3, assignments: 1, note: "CPN → 広告セット → 広告。命名規則" },
  { id: "s4", day: 5, date: "9/5（金）", title: "記事 LP の構成と検証の考え方", minutes: 120, status: "current", lectures: 3, assignments: 1, quiz: true, note: "型B / 型C の違い。検証ナレッジ DB の読み方。終わったら理解度チェック", external: { label: "検証ナレッジ DB を開く" } },
  { id: "s5", day: 8, date: "9/8（月）", title: "CR 制作の流れとアセクリ発注", minutes: 90, status: "future", lectures: 2, assignments: 1, note: "タスク管理からの発注送信。CR アウトプット 150 件の始め方" },
  { id: "s6", day: 10, date: "9/10（水）", title: "TikTok 運用の基礎", minutes: 120, status: "future", lectures: 3, assignments: 0, note: "縦型 CR、入札の開始値" },
  { id: "s7", day: 12, date: "9/12（金）", title: "週次レポートの読み方・書き方", minutes: 90, status: "future", lectures: 2, assignments: 1, note: "KPI 4 → 月間目標 → 振り返り 3 欄" },
  { id: "s8", day: 15, date: "9/15（月）", title: "バリュー振り返り ラウンド 1", minutes: 60, status: "future", lectures: 0, assignments: 0, note: "5 バリューの自己評価。上長との 1on1" },
];
/** 学習リスト（講義 + 課題）。kind: lecture / assignment。read = 読了、summary = まとめ、fb = 上長 FB */
export const TRAINING_ITEMS = [
  { id: "l1", category: "基礎", kind: "lecture", title: "AXIS の全体像と毎日の流れ", minutes: 30, read: true, hasDoc: true, hasVideo: true, summary: "日報・タスク・週次レポートが 1 か所に。朝はダッシュボード、18 時までに日報。", fb: { by: "上長", at: "9/2 10:15", text: "要点が押さえられています。日報は「事実」と「改善点」を分けて書く癖をつけましょう。" } },
  { id: "l2", category: "基礎", kind: "lecture", title: "広告用語 CPA / mCPA / ROAS", minutes: 40, read: true, hasDoc: true, hasVideo: true, summary: "CPA = 広告費 ÷ CV。mCPA は中間 CV。ROAS = 売上 ÷ 広告費 × 100。", fb: null },
  { id: "a1", category: "基礎", kind: "assignment", title: "課題: 用語集 KPI の式を自分の言葉で説明する", minutes: 30, read: true, hasDoc: true, hasVideo: false, summary: "", fb: null },
  { id: "l3", category: "Meta 広告", kind: "lecture", title: "CPN / 広告セット / 広告 の構造", minutes: 45, read: true, hasDoc: true, hasVideo: true, summary: "CPN で目的・予算、広告セットで配信先、広告で CR。", fb: { by: "上長", at: "9/4 18:30", text: "OK。次は命名規則（TM2-2_担当_案件_訴求）も一緒に覚えてください。" } },
  { id: "l4", category: "Meta 広告", kind: "lecture", title: "命名規則と計測タグの確認", minutes: 30, read: true, hasDoc: true, hasVideo: false, summary: "", fb: null },
  { id: "a2", category: "Meta 広告", kind: "assignment", title: "課題: A社 記事LP の CPN 構造を図にする", minutes: 60, read: false, hasDoc: true, hasVideo: false, summary: "", fb: null },
  { id: "l5", category: "記事 LP・検証", kind: "lecture", title: "型B と 型C の違い", minutes: 40, read: true, hasDoc: true, hasVideo: true, summary: "型B は悩み提示から、型C は結果提示から。CR と LP の見出し順を揃える。", fb: null },
  { id: "l6", category: "記事 LP・検証", kind: "lecture", title: "検証ナレッジ DB の読み方", minutes: 30, read: false, hasDoc: true, hasVideo: true, summary: "", fb: null },
  { id: "l7", category: "記事 LP・検証", kind: "lecture", title: "検証の設計（仮説 → 結果）", minutes: 45, read: false, hasDoc: true, hasVideo: false, summary: "", fb: null },
  { id: "a3", category: "記事 LP・検証", kind: "assignment", title: "課題: 直近の検証 1 件を仮説・結果で要約する", minutes: 60, read: false, hasDoc: true, hasVideo: false, summary: "", fb: null },
  { id: "l8", category: "CR 制作", kind: "lecture", title: "CR 制作の流れとアセクリ発注", minutes: 40, read: false, hasDoc: true, hasVideo: true, summary: "", fb: null },
  { id: "l9", category: "CR 制作", kind: "lecture", title: "CR アウトプット 150 件の進め方", minutes: 20, read: false, hasDoc: true, hasVideo: false, summary: "", fb: null },
  { id: "a4", category: "CR 制作", kind: "assignment", title: "課題: 9:16 静止画 CR を 3 案つくる", minutes: 120, read: false, hasDoc: true, hasVideo: false, summary: "", fb: null },
];
export const TRAINING_ITEM_TOTAL = 30;
/** チェックリスト（カテゴリ別）。link = 関連画面 */
export const TRAINING_CHECKLIST = [
  { category: "アカウント", items: [{ id: "c1", label: "AXIS にログインし、設定でチャットワーク ID を登録", done: true, link: "settings" }, { id: "c2", label: "Meta 広告マネージャの閲覧権限をもらう", done: true }, { id: "c3", label: "TikTok Ads Manager の閲覧権限をもらう", done: true }, { id: "c4", label: "Google 広告の閲覧権限をもらう", done: false }, { id: "c5", label: "CR 素材ドライブに招待される", done: true, link: "links" }] },
  { category: "毎日の業務", items: [{ id: "c6", label: "日報を 3 日連続で 18:00 までに送信", done: true, link: "mbo" }, { id: "c7", label: "ダッシュボードで今日のタスクを確認する習慣", done: true, link: "dashboard" }, { id: "c8", label: "タスク管理で 1 行入力して保存", done: true, link: "tasks" }, { id: "c9", label: "アセクリに発注送信を 1 回", done: false, link: "tasks" }] },
  { category: "数値を読む", items: [{ id: "c10", label: "週次レポートの KPI 4 つを説明できる", done: true, link: "weekly" }, { id: "c11", label: "案件別まとめで担当案件の粗利を確認", done: true, link: "project" }, { id: "c12", label: "先週比較ボードで増減の大きい案件を 1 つ挙げる", done: false, link: "board-v2" }, { id: "c13", label: "検証ナレッジ DB で 1 件読む", done: false, link: "knowledge" }] },
  { category: "研修", items: [{ id: "c14", label: "講義「AXIS の全体像」を読了", done: true }, { id: "c15", label: "課題「KPI の式を説明」を提出", done: true }, { id: "c16", label: "講義「CPN / 広告セット / 広告」を読了", done: true }, { id: "c17", label: "理解度チェック（基礎）を受ける", done: false }, { id: "c18", label: "バリュー振り返り ラウンド 1 を記入", done: false }, { id: "c19", label: "CR アウトプットを 10 件登録", done: true }] },
  { category: "コミュニケーション", items: [{ id: "c20", label: "GG 1課 のチャットワークに自己紹介", done: true }, { id: "c21", label: "上長との 1on1 を 1 回", done: true }, { id: "c22", label: "Q&A で 1 回質問する", done: true }, { id: "c23", label: "撮影に 1 回同行", done: false }, { id: "c24", label: "ヒット施策を 1 件読む", done: true }] },
];
/** バリュー 5 つ（ラウンド 1〜3）。self = 自己評価、fb = 上長 FB */
export const TRAINING_VALUE_ROUNDS = ["ラウンド 1", "ラウンド 2", "ラウンド 3"];
export const TRAINING_VALUES = [
  { id: "v1", name: "事実で話す", desc: "感想より数値と事実。日報も報告も「行ったこと（事実）」から", self: "B", note: "日報の 1 行目を数値から書くようにした。まだ「〜と思う」が混じる。", fb: { by: "上長", at: "9/8 19:10", text: "日報の書き方は良くなっています。報告のときも「CPA が ¥400 上がった」から始めましょう。" } },
  { id: "v2", name: "先に切り分ける", desc: "問題は媒体か LP か、まず分ける。全部を一度に触らない", self: "C", note: "D社の要因分解を横で見た。自分では未実施。", fb: null },
  { id: "v3", name: "小さく速く検証する", desc: "1 回の検証は 1 変数。結果が出たら次へ", self: "", note: "", fb: null },
  { id: "v4", name: "共有して勝ちパターンにする", desc: "うまくいった施策はヒット施策・検証ナレッジに残す", self: "B", note: "ヒット施策を 2 件読んで、自分の言葉でまとめた。", fb: { by: "上長", at: "9/5 12:00", text: "読むだけでなく、次は自分の検証を 1 件登録してみましょう。" } },
  { id: "v5", name: "期限を守る", desc: "18:00 の日報、金曜の週次コメント。遅れるなら先に言う", self: "A", note: "日報は毎日 18:00 前に送信できている。", fb: null },
];
/** CR アウトプット（9:16 サムネ。150 件 / 30 日目標） */
export const CR_TARGET = { done: 40, total: 150, days: 30, deadline: "10/1（水）" };
export const CR_OUTPUTS = Array.from({ length: 12 }, (_, i) => {
  const projects = ["A社 記事LP", "C社 美容D2C", "B社 通販", "D社 サプリ"];
  const appeals = ["結果提示", "悩み提示", "比較", "権威", "限定", "手順"];
  return { id: `cr${i + 1}`, no: 40 - i, project: projects[i % 4], appeal: appeals[i % 6], type: i % 3 === 0 ? "動画 15s" : "静止画", date: `9/${9 - Math.floor(i / 2)}`, memo: i % 4 === 0 ? "型C の冒頭を参考に。数値は仮" : "", fb: i === 1 ? { by: "上長", at: "9/9 11:40", text: "訴求は良い。文字量を半分にして、数値を大きく。" } : null, tone: i % 5 };
});
/** 用語集: KPI（式カード）/ 業界用語 / 社内用語 */
export const GLOSSARY_KPI = [
  { id: "g1", term: "CPA", formula: "広告費 ÷ CV", desc: "最終 CV 1 件あたりの広告費。低いほど良い" },
  { id: "g2", term: "mCPA", formula: "広告費 ÷ mCV", desc: "中間 CV（記事 LP → 商品 LP の遷移など）1 件あたりの広告費" },
  { id: "g3", term: "ROAS", formula: "売上 ÷ 広告費 × 100", desc: "広告費に対する売上の割合（%）。100% で費用と売上が同額" },
  { id: "g4", term: "CTR", formula: "クリック ÷ インプレッション × 100", desc: "表示に対するクリック率（%）" },
  { id: "g5", term: "CVR", formula: "CV ÷ クリック × 100", desc: "クリックに対する CV 率（%）" },
  { id: "g6", term: "CPC", formula: "広告費 ÷ クリック", desc: "1 クリックあたりの広告費" },
  { id: "g7", term: "CPM", formula: "広告費 ÷ インプレッション × 1,000", desc: "1,000 表示あたりの広告費" },
  { id: "g8", term: "粗利", formula: "売上 − 広告費", desc: "案件の利益。週次レポート・案件別まとめの主指標" },
];
export const GLOSSARY_INDUSTRY = [
  { id: "i1", term: "CPN（キャンペーン）", desc: "広告アカウント内の最上位。目的と予算を持つ。配下に広告セット → 広告" },
  { id: "i2", term: "広告セット", desc: "配信先（ターゲット・配置・入札）の単位。1 セットに CR を詰めすぎると学習が割れる" },
  { id: "i3", term: "記事 LP", desc: "商品 LP の前に置く記事型のページ。悩み → 解決 → 商品の順で読ませる" },
  { id: "i4", term: "型B / 型C", desc: "CR の構成型。型B = 悩み提示から、型C = 結果提示から始める" },
  { id: "i5", term: "リタゲ（リターゲティング）", desc: "一度サイトに来た人に再配信すること" },
  { id: "i6", term: "類似（Lookalike）", desc: "CV した人に似た属性の人へ配信する設定。1% が最も近い" },
  { id: "i7", term: "学習期間", desc: "広告セット作成・変更後、配信が安定するまでの期間。頻繫な変更でリセットされる" },
  { id: "i8", term: "検索語句レポート", desc: "Google 広告で実際に検索された語句の一覧。CV 0 の語句を除外する" },
];
export const GLOSSARY_INTERNAL = [
  { id: "n1", term: "AXIS", desc: "この社内ツール。デイリー業務一元管理システム" },
  { id: "n2", term: "AXAD", desc: "媒体の数値を集計する社内基盤。毎朝 6:00 に AXIS へ同期" },
  { id: "n3", term: "アセクリ", desc: "外部の制作パートナー。タスク管理から発注送信、納品はアセクリ画面で受ける" },
  { id: "n4", term: "GG", desc: "この事業部の略称。1課・2課" },
  { id: "n5", term: "日報（MBO）", desc: "毎日 18:00 までに送る 2 欄の報告。行ったこと（事実）と改善点" },
  { id: "n6", term: "コミットメント", desc: "月ごとに自分で決める行動目標。毎日 / 週次 / 月次" },
  { id: "n7", term: "ヒット施策", desc: "うまくいった施策の共有。記入依頼 → 記入 → 承認" },
  { id: "n8", term: "CR アウトプット", desc: "研修生が 30 日で 150 件つくる CR 案。9:16 のサムネで登録" },
  { id: "n9", term: "共有 CP", desc: "担当者をまたいで使うキャンペーン（ブランド KW など）" },
];
/** Q&A 履歴（日付グループ）と会話 */
export const QA_HISTORY = [
  { date: "今日 9/9", items: [{ id: "q5", q: "型B と 型C はどう使い分ける？", unanswered: true }, { id: "q4", q: "mCPA が高いときは何を見る？" }] },
  { date: "9/8（月）", items: [{ id: "q3", q: "発注送信はどこから？" }] },
  { date: "9/4（木）", items: [{ id: "q2", q: "CPA と mCPA の違いは？" }, { id: "q1", q: "日報の「事実」と「改善点」の書き分け" }] },
];
export const QA_THREADS = {
  q5: [{ id: 1, role: "user", text: "型B と 型C はどう使い分ける？", at: "15:52" }],
  q4: [
    { id: 1, role: "user", text: "mCPA が高いときは何を見る？", at: "11:20" },
    { id: 2, role: "ai", text: "mCPA は記事 LP から商品 LP への遷移 1 件あたりの広告費です。高いときは 2 段階で見ます。\n1. CTR が低い → CR と記事 LP の見出しがずれていないか（型B / 型C の順序）\n2. CTR は普通で遷移率が低い → 記事 LP の導入文と 1 スクロール目。表より基準の提示を先に\nまず A社 記事LP の検証ナレッジ「型C 検証」を読むと具体例があります。", sources: ["マニュアル §5 用語", "検証ナレッジ k1", "用語集 KPI"], at: "11:20" },
  ],
  q3: [
    { id: 1, role: "user", text: "発注送信はどこから？", at: "9/8 14:02" },
    { id: 2, role: "ai", text: "タスク管理 → 今週タスクの行を展開 → 発注メモを書いて［発注送信］です。アセクリのチャットワークに定型文で送られます。送信前に期限日とアセクリの選択を確認してください。", sources: ["マニュアル §3.2 発注送信"], at: "9/8 14:02" },
  ],
  q2: [
    { id: 1, role: "user", text: "CPA と mCPA の違いは？", at: "9/4 10:05" },
    { id: 2, role: "ai", text: "CPA は最終 CV 1 件あたりの広告費、mCPA は中間 CV（記事 LP の遷移など）1 件あたりの広告費です。記事 LP 案件では mCPA → CPA の両方を見ます。", sources: ["マニュアル §5 用語", "用語集 KPI"], at: "9/4 10:05" },
  ],
  q1: [
    { id: 1, role: "user", text: "日報の「事実」と「改善点」の書き分け", at: "9/4 09:40" },
    { id: 2, role: "ai", text: "「行ったこと（事実）」は数値と行動だけ（例: AI系記事 15 件の売上を更新し累計 ¥11,897,525）。「改善点」は明日変える行動を 1 つ（例: LP 側の切り分けを先にやる）。感想は書かなくて大丈夫です。", sources: ["マニュアル §2 毎日の流れ"], at: "9/4 09:40" },
  ],
};
export const QA_TEMPLATES = ["用語の意味", "画面の場所", "数値の見方"];
/** 上長からのフィードバック（ホーム。未読 3 件） */
export const TRAINING_FEEDBACK = [
  { id: "f1", screen: "training-cr", label: "CRアウトプット #39", text: "訴求は良い。文字量を半分にして、数値を大きく。", at: "9/9 11:40", unread: true },
  { id: "f2", screen: "training-values", label: "バリュー振り返り「事実で話す」", text: "日報の書き方は良くなっています。報告のときも数値から。", at: "9/8 19:10", unread: true },
  { id: "f3", screen: "training-learning", label: "学習リスト「CPN / 広告セット / 広告」", text: "OK。次は命名規則も一緒に覚えてください。", at: "9/4 18:30", unread: true },
];

/* ---------- ログイン・登録 ---------- */
export const REGISTER_DEFAULT = { name: "", email: "", password: "", roomId: "", accountId: "", reportRoomId: "", reportAccountIds: [""] };

/* ====================== バッチ 4（2026-09-10 追記）: 管理 13 画面 ====================== */
/** ナビ → 画面（追記）。利用状況 /admin/access-logs はナビに載せない（導線は担当者判断） */
Object.assign(NAV_TO_SCREEN, { "admin-users": "admin-users", "admin-projects": "admin-projects", "admin-project-summary": "admin-projects", "admin-assets": "admin-assignees", "admin-weekly": "admin-weekly", "admin-training": "admin-training", "admin-goals": "admin-goals", "admin-system": "admin-system" });

/* ---------- 案件マスタ（型 A 見本） ---------- */
export const ADMIN_PROJECTS = PROJECTS.map((name, i) => ({ id: `pj${i + 1}`, name, owner: GG_MEMBERS[i % GG_MEMBERS.length], createdAt: ["2026-04-01", "2026-04-01", "2026-05-12", "2026-06-03", "2026-07-21", "2026-08-18"][i], active: i < 5 }));

/* ---------- ユーザー管理（GG 5 名 + 役職。承認待ち・研修中・却下は個人名なしのラベル） ---------- */
export const USER_ROLES = ["ADMIN", "MANAGER", "LEADER", "MEMBER", "TRAINEE", "VIEWER"];
export const DEPARTMENTS = ["GG 1課", "GG 2課"];
export const ADMIN_USERS = {
  pending: [
    { id: "u-p1", name: "申請者A", email: "applicant-a@example.com", requestedAt: "9/9 10:42", roomId: "355512345" },
    { id: "u-p2", name: "申請者B", email: "applicant-b@example.com", requestedAt: "9/8 17:05", roomId: "" },
  ],
  training: [{ id: "u-t1", name: "研修生A", email: "trainee-a@example.com", dept: "GG 1課", role: "TRAINEE", start: "9/1", day: 7 }],
  approved: [
    { id: "u1", name: "大倉", email: "okura@example.com", dept: "GG 1課", role: "LEADER", lastActive: "9/9 15:56" },
    { id: "u2", name: "白井", email: "shirai@example.com", dept: "GG 1課", role: "MEMBER", lastActive: "9/9 15:40" },
    { id: "u3", name: "古木", email: "furuki@example.com", dept: "GG 1課", role: "MEMBER", lastActive: "9/9 14:12" },
    { id: "u7", name: "太一", email: "taichi@example.com", dept: "GG 1課", role: "MEMBER", lastActive: "9/9 13:30" },
    { id: "u4", name: "岩崎", email: "iwasaki@example.com", dept: "GG 2課", role: "LEADER", lastActive: "9/9 11:03" },
    { id: "u5", name: "三冨", email: "mitomi@example.com", dept: "GG 2課", role: "MEMBER", lastActive: "9/8 18:50" },
    { id: "u8", name: "高橋", email: "takahashi@example.com", dept: "GG 2課", role: "MEMBER", lastActive: "9/8 17:10" },
    { id: "u6", name: "管理者", email: "admin@example.com", dept: "—", role: "ADMIN", lastActive: "9/9 15:58" },
  ],
  rejected: [{ id: "u-r1", name: "申請者C", email: "applicant-c@example.com", rejectedAt: "8/28", reason: "社外ドメイン" }],
};
/** 組織: 部 → 課（ml-6 入れ子）。リーダーは課ごと */
export const ORGANIZATION = [
  { id: "d1", name: "GG（ジェネラルグロース）", sections: [{ id: "s1", name: "GG 1課", members: 4, leader: "大倉" }, { id: "s2", name: "GG 2課", members: 3, leader: "岩崎" }] },
  { id: "d2", name: "管理部", sections: [{ id: "s3", name: "管理課", members: 1, leader: "" }] },
];

/* ---------- アセクリ・ルーム管理（2 カラム） ---------- */
export const CHATWORK_ROOMS = [
  { id: "r1", name: "GG 1課 タスク報告", roomId: "312345678", use: "タスク報告" },
  { id: "r2", name: "GG 2課 タスク報告", roomId: "398765432", use: "タスク報告" },
  { id: "r3", name: "アセクリ 発注（制作A社）", roomId: "355512345", use: "発注" },
  { id: "r4", name: "アセクリ 発注（制作B社）", roomId: "355598765", use: "発注" },
  { id: "r5", name: "日報 通知", roomId: "301122334", use: "日報" },
];
export const TIER_SUMMARY = [{ tier: "Tier 1", count: 2 }, { tier: "Tier 2", count: 2 }, { tier: "Tier 3", count: 0 }];
// ADMIN_ASSIGNEES は ASSIGNEE_LIST（バッチ 3）の後で定義（ファイル末尾）

/* ---------- 週次まとめ管理（型 D 見本） ---------- */
export const WEEKLY_ADMIN_KPI = { written: 4, members: 5, comments: 12, aiDone: 3, sharedCpn: SHARED_CPN.length };
export const WEEKLY_ADMIN_MEMBERS = GG_MEMBERS.map((name, i) => ({
  id: `wm${i + 1}`, name, dept: SECTIONS.find((s) => s.members.includes(name)).name, status: i === 4 ? "missing" : "sent", updatedAt: i === 4 ? "" : `9/${8 + (i % 2)} ${["18:42", "09:15", "19:30", "17:05"][i % 4]}`,
  profit: [1204300, 964200, 834900, 402100, 0][i], dp: [120400, 88600, -52100, -98400, 0][i],
  factors: i === 4 ? [] : [
    { tone: "positive", text: ["型C 差し替えで CPA 18% 改善", "TikTok 新規 CPN が初日から利益", "比較記事の導入文改稿で CVR 2.6%", "検索 KW 除外を再開"][i] },
    { tone: "negative", text: ["E社 年代別 CR の 3 本目が未入稿", "リタゲの静止画 4 枚が納品待ち", "消化増に CV が追随せず", "Google CPA が ¥4,000 台に上昇"][i] },
  ],
}));

/* ---------- 目標設定（B + D） ---------- */
export const EVAL_ADMIN_QUARTER_GOALS = { Q2: { company: EVAL_COMPANY_GOALS.company, dept: EVAL_COMPANY_GOALS.dept, deadline: "2026-09-30" }, Q3: { company: "", dept: "", deadline: "" } };
export const EVAL_ADMIN_MEMBERS = GG_MEMBERS.map((name, i) => ({ id: `em${i + 1}`, name, dept: SECTIONS.find((s) => s.members.includes(name)).name, grade: ["G2", "G2", "G3", "G3", "G1"][i], status: ["self", "first", "self", "fixed", "draft"][i], updatedAt: ["9/8 10:12", "9/7 16:40", "9/9 09:30", "9/1 11:00", "—"][i] }));
export const EVALUATOR_OPTIONS = ["部長", "事業部長", "GG 1課 リーダー", "GG 2課 リーダー"];
export const EVAL_ADMIN_ASSIGNMENTS = GG_MEMBERS.map((name, i) => ({ id: `ea${i + 1}`, name, first: i < 3 ? "GG 1課 リーダー" : "GG 2課 リーダー", final: "部長" }));

/* ---------- システム設定（Card 8 枚） ---------- */
export const SYS_CANDIDATES = [{ id: "c1", name: "TM2-3_三冨_F社_紐付け検証", media: "FB", detectedAt: "9/9 06:00" }, { id: "c2", name: "TM2-1_白井_E社_年代別_45-54", media: "FB", detectedAt: "9/9 06:00" }];
export const SYS_REQUESTS = [{ id: "q1", from: "古木", target: "TikTok BC 「C社 美容 新規」", at: "9/8 14:20" }];
export const META_BMS = [{ id: "bm1", name: "GG メイン BM", bmId: "1023456789012", accounts: 6 }, { id: "bm2", name: "GG 検証 BM", bmId: "1098765432109", accounts: 2 }];
export const META_FETCH_JOBS = [{ id: "mf1", account: "A社 記事LP（act_1234）", range: "2026-08-01 〜 2026-08-31", status: "done", progress: [31, 31] }, { id: "mf2", account: "C社 美容D2C（act_5678）", range: "2026-09-01 〜 2026-09-08", status: "running", progress: [5, 8] }];
export const TIKTOK_BCS = [{ id: "bc1", name: "GG TikTok BC", bcId: "7012345678901234567", accounts: 3 }];
export const TIKTOK_FETCH_JOBS = [{ id: "tf1", account: "C社 美容 新規（adv_9012）", range: "2026-08-15 〜 2026-08-31", status: "error", progress: [9, 17] }];
export const SYS_CHATWORK = { token: "••••••••••••3f9a", notifyRoom: "301122334", mentionAdmin: true, dailyReminder: "17:30" };

/* ---------- 研修管理（研修生 Select + 閲覧モード SubNav） ---------- */
export const TRAINEES = [{ id: "tr1", label: "研修生A", start: "9/1（月）", day: 7, dept: "GG 1課" }, { id: "tr2", label: "研修生B", start: "9/8（月）", day: 2, dept: "GG 2課" }];

/* ---------- 利用状況（型 D。ナビには載せない） ---------- */
export const ACCESS_DAU = Array.from({ length: 14 }, (_, i) => { const d = 27 + i; const day = d > 31 ? d - 31 : d; const m = d > 31 ? 9 : 8; const dow = ["日", "月", "火", "水", "木", "金", "土"][(d + 4) % 7]; const weekend = dow === "土" || dow === "日"; return { key: `${m}/${day}`, label: `${m}/${day}`, dow, weekend, value: weekend ? [1, 0, 2, 1][i % 4] : [6, 7, 7, 5, 8, 7, 6, 8, 7, 8][i % 10] }; });
export const ACCESS_USERS = [...ADMIN_USERS.approved, { id: "u-t1", name: "研修生A", role: "TRAINEE" }].map((u, i) => ({ id: u.id, name: u.name, role: u.role, lastAccess: ["9/9 15:56", "9/9 15:40", "9/9 14:12", "9/9 11:03", "9/8 18:50", "9/9 15:58", "9/9 13:20"][i], d7: [5, 5, 5, 4, 3, 5, 5][i], d30: [21, 20, 22, 18, 12, 22, 7][i] }));
export const ACCESS_PAGES = [["/dashboard", 412], ["/mbo", 388], ["/tasks", 351], ["/reports/weekly", 204], ["/reports/projects", 166], ["/onboarding", 98], ["/commitment", 74], ["/links", 61], ["/hit-measures", 40], ["/analytics", 22]].map(([path, count], i) => ({ id: `pg${i + 1}`, rank: i + 1, path, count }));

/* ---------- アセクリ（外部。個人名なし） ---------- */
export const ASSIGNEE_LIST = [
  { id: "as1", name: "制作A社", tier: "Tier 1", undelivered: 3, delivered: 12, status: "undelivered" },
  { id: "as2", name: "制作B社", tier: "Tier 1", undelivered: 0, delivered: 8, status: "delivered" },
  { id: "as3", name: "制作C社", tier: "Tier 2", undelivered: 2, delivered: 5, status: "undelivered" },
  { id: "as4", name: "制作D社", tier: "Tier 2", undelivered: 0, delivered: 0, status: "none" },
];
/** アセクリ詳細（制作A社）。未納品は URL 入力を持つ */
export const ASSIGNEE_UNDELIVERED = [
  { id: "u1", project: "A社 記事LP", type: "CR", title: "夏季CPN_v3", detail: "型B → 型C 差し替え 3 本", due: "9/10（水）", overdue: false, crUrls: ["https://drive.google.com/file/d/1AbC…/view", ""], pmUrl: "", sheetUrl: "https://docs.google.com/spreadsheets/d/1Abc…/edit" },
  { id: "u2", project: "C社 美容D2C", type: "バナー", title: "リタゲ", detail: "静止画 4 枚", due: "9/12（金）", overdue: false, crUrls: [""], pmUrl: "", sheetUrl: "" },
  { id: "u3", project: "D社 サプリ", type: "LP", title: "商品LP", detail: "遷移率改善 FV 差し替え", due: "9/5（金）", overdue: true, crUrls: [""], pmUrl: "", sheetUrl: "" },
];
export const ASSIGNEE_DELIVERED = [
  { group: "今日の納品", items: [{ id: "d1", project: "A社 記事LP", type: "LP", title: "記事LP", detail: "見出し AB 追加", deliveredAt: "9/9 10:12", crUrl: "https://drive.google.com/file/d/…", pmUrl: "https://drive.google.com/…" }] },
  { group: "9/1（月）〜 9/7（日）", items: [
    { id: "d2", project: "E社 保険比較", type: "CR", title: "検証CP", detail: "訴求 3 案", deliveredAt: "9/5 17:40", crUrl: "https://drive.google.com/file/d/…", pmUrl: "" },
    { id: "d3", project: "A社 記事LP", type: "CR", title: "夏季CPN_v2", detail: "型B 2 本", deliveredAt: "9/2 15:05", crUrl: "https://drive.google.com/file/d/…", pmUrl: "https://drive.google.com/…" },
  ] },
  { group: "8/25（月）〜 8/31（日）", items: [{ id: "d4", project: "B社 通販", type: "バナー", title: "秋物", detail: "季節バナー 3 枚", deliveredAt: "8/28 11:30", crUrl: "https://drive.google.com/file/d/…", pmUrl: "" }] },
];
/** バッチ 4: アセクリ・ルーム管理の右カラム（ASSIGNEE_LIST + ルーム紐付け・トークン） */
export const ADMIN_ASSIGNEES = ASSIGNEE_LIST.map((a, i) => ({ ...a, room: ["r3", "r4", "", ""][i], token: i < 3, active: true }));
