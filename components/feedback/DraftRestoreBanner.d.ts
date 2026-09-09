import * as React from "react";
/** 未保存の下書き復元バナー。PageHeader 直下に1本だけ。高さ 44。 */
export interface DraftRestoreBannerProps {
  /** 退避時刻 "9/8 22:14" */
  time?: string;
  /** 復元後は呼び出し側で「復元しました」トースト 3 秒 */
  onRestore?: () => void;
  /** ConfirmDialog なしで即消える */
  onDiscard?: () => void;
  style?: React.CSSProperties;
}
export declare function DraftRestoreBanner(props: DraftRestoreBannerProps): JSX.Element;
