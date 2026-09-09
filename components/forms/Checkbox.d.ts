import * as React from "react";
/**
 * @startingPoint section="Forms" subtitle="18px / ON = primary / indeterminate" viewport="700x80"
 */
export interface CheckboxProps { checked?: boolean; indeterminate?: boolean; onChange?: (checked: boolean) => void; disabled?: boolean; label?: React.ReactNode; id?: string; style?: React.CSSProperties; }
export declare function Checkbox(props: CheckboxProps): JSX.Element;
