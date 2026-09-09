import * as React from "react";
/**
 * @startingPoint section="Data" subtitle="ラベル / 主値 / 増減 / 補足" viewport="700x160"
 */
export interface KpiDelta { value: number; unit?: string; prefix?: string; digits?: number; invert?: boolean; format?: (n: number) => string; }
export interface KpiCardProps { label: string; value?: string | number; unit?: string; delta?: KpiDelta; note?: string; loading?: boolean; error?: boolean; style?: React.CSSProperties; }
export declare function KpiCard(props: KpiCardProps): JSX.Element;
