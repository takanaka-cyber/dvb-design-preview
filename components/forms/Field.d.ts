import * as React from "react";
export interface FieldProps { label: string; required?: boolean; help?: string; error?: string; htmlFor?: string; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function Field(props: FieldProps): JSX.Element;
