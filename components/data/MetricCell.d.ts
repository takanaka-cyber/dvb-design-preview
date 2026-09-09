import * as React from "react";
export interface MetricCellProps { value?: number | string | null; delta?: number | null; unit?: string; deltaUnit?: string; digits?: number; invert?: boolean; empty?: string; /** 先週値。列を増やさず title ツールチップに出す */ previous?: number | string | null; previousLabel?: string; style?: React.CSSProperties; }
export declare function MetricCell(props: MetricCellProps): JSX.Element;
