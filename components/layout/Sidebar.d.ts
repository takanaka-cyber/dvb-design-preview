import * as React from "react";
/**
 * @startingPoint section="Layout" subtitle="248px / 折りたたみ 56px / スマホ drawer 280px、6グループ" viewport="700x420"
 */
export interface SidebarItem { key: string; label: string; icon?: string; badge?: number | string; badgeTone?: "neutral" | "negative"; }
export interface SidebarGroup { label: string; items: SidebarItem[]; /** 研修生・管理者のみ等、呼び出し側でロール判定して groups から除く */ }
export interface SidebarProps {
  groups: SidebarGroup[]; activeKey?: string; onSelect?: (key: string) => void;
  collapsed?: boolean; onToggle?: () => void;
  user?: { name: string; role?: string }; date?: string; time?: string; height?: number | string;
  /** スマホ: 左ドロワー（幅 280、背景 40% 黒）。親を position: relative にする（本番は fixed に置き換え可） */
  drawer?: boolean; open?: boolean; onClose?: () => void;
  onSettings?: () => void;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element | null;
