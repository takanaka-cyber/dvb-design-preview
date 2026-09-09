import * as React from "react";
export interface ToastProps { kind?: "success" | "undo" | "error" | "info"; message: string; actionLabel?: string; onAction?: () => void; onClose?: () => void; style?: React.CSSProperties; }
export declare function Toast(props: ToastProps): JSX.Element;
