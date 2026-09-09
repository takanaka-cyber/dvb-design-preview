import * as React from "react";
export interface SaveStatusProps { state?: "idle" | "saving" | "saved" | "error"; time?: string; onRetry?: () => void; style?: React.CSSProperties; }
export declare function SaveStatus(props: SaveStatusProps): JSX.Element;
