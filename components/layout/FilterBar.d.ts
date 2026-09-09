import * as React from "react";
export interface FilterChip { label: string; active?: boolean; count?: number; }
export interface FilterBarProps { period?: string; onPrev?: () => void; onNext?: () => void; onToday?: () => void; chips?: FilterChip[]; onChip?: (label: string) => void; children?: React.ReactNode; right?: React.ReactNode; style?: React.CSSProperties; }
export declare function FilterBar(props: FilterBarProps): JSX.Element;
