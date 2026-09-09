import * as React from "react";
export interface TaskRowProps { mode?: "view" | "edit"; done?: boolean; text?: string; assignee?: string; due?: string; overdue?: boolean; media?: "FB" | "TikTok" | "Google" | string; onToggle?: () => void; onMenu?: () => void; onSubmit?: (data: FormData) => void; onCancel?: () => void; projects?: string[]; assignees?: string[]; project?: string; compact?: boolean; style?: React.CSSProperties; }
export declare function TaskRow(props: TaskRowProps): JSX.Element;
