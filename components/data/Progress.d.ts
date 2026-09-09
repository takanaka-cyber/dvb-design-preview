import * as React from "react";
/**
 * @startingPoint section="Data" subtitle="高さ 8 / 達成 positive / 超過 negative / ラベル 12/30（40%）" viewport="700x120"
 */
export interface ProgressProps { value?: number; max?: number; overdue?: boolean; label?: string; showLabel?: boolean; size?: "sm" | "md"; width?: number | string; style?: React.CSSProperties; }
export declare function Progress(props: ProgressProps): JSX.Element;
