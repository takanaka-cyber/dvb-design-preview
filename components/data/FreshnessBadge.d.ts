import * as React from "react";
/** データ鮮度バッジ。「CPデータ更新」ボタンの横。 */
export interface FreshnessBadgeProps {
  state?: "fresh" | "stale" | "none";
  /** 取得時刻 "9/9 08:12"。none のときは無視 */
  time?: string;
  style?: React.CSSProperties;
}
export declare function FreshnessBadge(props: FreshnessBadgeProps): JSX.Element;
/** 古い・未取得のとき KPI の上に出す 1 行の注意帯。閉じるボタン無し。 */
export interface FreshnessNoticeProps { onRefresh?: () => void; loading?: boolean; style?: React.CSSProperties; }
export declare function FreshnessNotice(props: FreshnessNoticeProps): JSX.Element;
