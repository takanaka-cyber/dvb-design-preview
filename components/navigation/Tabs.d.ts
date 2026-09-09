import * as React from "react";
/**
 * @startingPoint section="Navigation" subtitle="下線型 / アクティブ = primary 文字 + 下 2px / 高さ 40 / 横スクロール可" viewport="700x100"
 */
export interface TabItem { value: string; label: string; icon?: string; count?: number | string; disabled?: boolean; }
export interface TabsProps { items: Array<string | TabItem>; value?: string; onChange?: (value: string) => void; "aria-label"?: string; style?: React.CSSProperties; }
export declare function Tabs(props: TabsProps): JSX.Element;
