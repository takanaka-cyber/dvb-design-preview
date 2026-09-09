import * as React from "react";
export interface SectionHeadingProps { icon?: string; title: string; count?: number | string; description?: string; children?: React.ReactNode; level?: 2 | 3; style?: React.CSSProperties; }
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
