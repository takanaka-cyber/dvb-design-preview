import * as React from "react";
/**
 * @startingPoint section="Data" subtitle="高さ 44 / アイコン + 名前 / hover muted / 編集モードで ✏️👁🗑（32px）" viewport="700x200"
 */
export interface LinkTileProps {
  name: string;
  /** lucide アイコン名（既定 Link2） */
  icon?: string;
  href?: string;
  /** 非表示扱い（opacity 0.55、編集モードで Eye に切替） */
  hidden?: boolean;
  /** 編集モード: ドラッグハンドル + 右端 3 アイコン。リンクとしては動かない */
  editing?: boolean;
  onEdit?: () => void; onToggleHidden?: () => void; onDelete?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function LinkTile(props: LinkTileProps): JSX.Element;
