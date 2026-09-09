import * as React from "react";
export interface SelectProps { value?: string; defaultValue?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; options?: Array<string | { value: string; label: string }>; placeholder?: string; disabled?: boolean; size?: "md" | "sm"; width?: number | string; style?: React.CSSProperties; }
export declare function Select(props: SelectProps): JSX.Element;
