import * as React from "react";
/**
 * @startingPoint section="Core" subtitle="primary / secondary / ghost / destructive / link" viewport="700x300"
 */
export interface ButtonProps { variant?: "primary" | "secondary" | "ghost" | "destructive" | "link"; size?: "md" | "sm"; icon?: string; loading?: boolean; disabled?: boolean; block?: boolean; type?: "button" | "submit" | "reset"; onClick?: () => void; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function Button(props: ButtonProps): JSX.Element;
