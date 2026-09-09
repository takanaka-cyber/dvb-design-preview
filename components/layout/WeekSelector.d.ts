import * as React from "react";
/** 週セレクタ。ページ上部 1 箇所だけ。週の表記はここ以外に書かない（「対象週」の重複表記をしない）。 */
export interface Week { key?: string; /** "9/1（月）〜 9/7（日）" */ label: string; current?: boolean; }
export interface WeekSelectorProps {
  /** 新しい順（index 0 が最新） */
  weeks: Week[];
  index?: number;
  /** reason === "more" は「過去の週を見る…」が選ばれたとき */
  onChange?: (index: number, reason?: "more") => void;
  /** ◀ ▶ のみ（スマホ） */
  compact?: boolean; /** "week"(既定) | "month" — 現在バッジの表記（今週/今月） */ unit?: "week" | "month";
  style?: React.CSSProperties;
}
export declare function WeekSelector(props: WeekSelectorProps): JSX.Element;
