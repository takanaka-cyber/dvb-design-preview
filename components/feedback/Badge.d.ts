import * as React from "react";
/**
 * @startingPoint section="Feedback" subtitle="rank / media / status / assignee / count" viewport="700x200"
 */
export interface BadgeProps { kind?: "rank" | "media" | "status" | "assignee" | "count"; value?: string | number | null; label?: string; size?: "md" | "sm"; style?: React.CSSProperties; }
export declare function Badge(props: BadgeProps): JSX.Element;
