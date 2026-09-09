import * as React from "react";
/**
 * @startingPoint section="Layout" subtitle="幅 448 中央 / AXIS Geist 700 24px / 説明 1 行 / error 帯 / footer リンク" viewport="520x560"
 */
export interface AuthCardProps {
  /** 既定 "AXIS" */
  brand?: string;
  /** 見出し（登録申請・申請完了・アクセスできません） */
  title?: string;
  /** 説明 1 行 */
  description?: string;
  /** 説明の上の lucide アイコン（アクセス拒否 = "Lock"、申請完了 = "CircleCheck"） */
  icon?: string;
  iconTone?: "muted" | "negative" | "positive";
  /** --negative-subtle 帯 */
  error?: React.ReactNode;
  /** Field の縦積み + 全幅 primary */
  children?: React.ReactNode;
  /** 下部リンク行 */
  footer?: React.ReactNode;
  /** 余白 32 → 24 */
  mobile?: boolean;
  style?: React.CSSProperties;
}
export declare function AuthCard(props: AuthCardProps): JSX.Element;
