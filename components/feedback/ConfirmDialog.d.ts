import * as React from "react";
export interface ConfirmDialogProps { open?: boolean; title: string; description?: string; confirmLabel?: string; cancelLabel?: string; destructive?: boolean; loading?: boolean; onConfirm?: () => void; onCancel?: () => void; inline?: boolean; }
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element | null;
