import * as React from "react";
export interface EmptyStateProps { icon?: string; title: string; description?: string; action?: React.ReactNode; variant?: "default" | "guide"; steps?: string[]; compact?: boolean; style?: React.CSSProperties; }
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
