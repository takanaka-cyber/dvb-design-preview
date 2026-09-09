import * as React from "react";
/**
 * @startingPoint section="Forms" subtitle="36×20 / ON = primary / ラベル任意" viewport="700x80"
 */
export interface SwitchProps { checked?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean; label?: React.ReactNode; id?: string; size?: "sm" | "md"; style?: React.CSSProperties; }
export declare function Switch(props: SwitchProps): JSX.Element;
