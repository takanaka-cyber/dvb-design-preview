import * as React from "react";
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> { invalid?: boolean; numeric?: boolean; size?: "md" | "sm"; icon?: string; }
export declare function Input(props: InputProps): JSX.Element;
