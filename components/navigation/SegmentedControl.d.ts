import * as React from "react";
/**
 * @startingPoint section="Navigation" subtitle="muted 枠 / 選択中は白 + shadow-sm / 高さ 32" viewport="700x80"
 */
export interface SegmentedOption { value: string; label: string; icon?: string; }
export interface SegmentedControlProps { options: Array<string | SegmentedOption>; value?: string; onChange?: (value: string) => void; "aria-label"?: string; style?: React.CSSProperties; }
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
