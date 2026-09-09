import * as React from "react";
/**
 * @startingPoint section="Feedback" subtitle="sm 480 / md 640 / lg 95vw。フッタ 左 破壊・右 キャンセル + 確定" viewport="700x420"
 */
export interface DialogDestructive { label?: string; icon?: string; onClick?: () => void; disabled?: boolean; }
export interface DialogProps {
  open?: boolean; title: string; description?: string; size?: "sm" | "md" | "lg"; children?: React.ReactNode;
  onClose?: () => void; cancelLabel?: string; confirmLabel?: string; onConfirm?: () => void; confirmDisabled?: boolean; confirmLoading?: boolean;
  destructive?: DialogDestructive; hideFooter?: boolean; inline?: boolean; style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
