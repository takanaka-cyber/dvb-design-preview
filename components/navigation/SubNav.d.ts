import * as React from "react";
/**
 * @startingPoint section="Navigation" subtitle="幅 200 / グループ見出し 11px / 項目 36 / 右端に進捗か未読ドット / compact で横スクロール Tabs" viewport="700x360"
 */
export interface SubNavItem { key: string; label: string; icon?: string; /** 右端の進捗「3/8」 */ progress?: string; /** 右端の未読ドット。true = info */ dot?: boolean | "info" | "warning"; }
export interface SubNavGroup { label?: string; items: SubNavItem[]; }
export interface SubNavProps { groups: SubNavGroup[]; activeKey?: string; onSelect?: (key: string) => void; /** 1024 未満: 上部の横スクロール Tabs に畳む */ compact?: boolean; "aria-label"?: string; style?: React.CSSProperties; }
export declare function SubNav(props: SubNavProps): JSX.Element;
