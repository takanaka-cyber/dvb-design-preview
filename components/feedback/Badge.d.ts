import * as React from "react";
/**
 * @startingPoint section="Feedback" subtitle="rank / media / status / assignee / count / tier / role" viewport="700x240"
 */
export type BadgeStatus = "todo" | "done" | "late" | "info" | "neutral"
  | "pending" | "training" | "approved" | "rejected" /* 承認待ち / 研修中 / 承認済 / 却下 */
  | "sent" | "missing" | "off" /* 送信済 / 未記載 / 休 */
  | "undelivered" | "delivered" | "none" /* 未納品 / 納品済 / タスクなし */;
export interface BadgeProps {
  kind?: "rank" | "media" | "status" | "assignee" | "count" | "tier" | "role";
  /** status はキーか日本語ラベル（"承認待ち" など）、tier は "Tier 1" | "Tier 2" | "Tier 3"、role は ADMIN / MANAGER / LEADER / MEMBER / TRAINEE / VIEWER */
  value?: BadgeStatus | string | number | null; label?: string; size?: "md" | "sm"; style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
