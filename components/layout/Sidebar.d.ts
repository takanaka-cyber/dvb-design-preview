import * as React from "react";
/**
 * @startingPoint section="Layout" subtitle="248px / 折りたたみ 56px、5グループ" viewport="700x420"
 */
export interface SidebarItem { key: string; label: string; icon?: string; badge?: number | string; badgeTone?: "neutral" | "negative"; }
export interface SidebarGroup { label: string; items: SidebarItem[]; }
export interface SidebarProps { groups: SidebarGroup[]; activeKey?: string; onSelect?: (key: string) => void; collapsed?: boolean; onToggle?: () => void; user?: { name: string; role?: string }; date?: string; time?: string; height?: number | string; style?: React.CSSProperties; }
export declare function Sidebar(props: SidebarProps): JSX.Element;
