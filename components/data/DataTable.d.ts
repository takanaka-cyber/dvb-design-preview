import * as React from "react";
/**
 * @startingPoint section="Data" subtitle="sticky ヘッダ・第1列、並べ替え、密度2段、行の展開" viewport="700x320"
 */
export interface DataTableColumn<Row = any> { key: string; label: string; align?: "left" | "right"; sortable?: boolean; width?: number; sticky?: boolean; wrap?: boolean; render?: (row: Row) => React.ReactNode; }
export interface DataTableProps<Row = any> { columns: DataTableColumn<Row>[]; rows: Row[]; rowKey?: string; sortKey?: string; sortDir?: "asc" | "desc"; onSort?: (key: string, dir: "asc" | "desc") => void; density?: "standard" | "compact"; stickyHeader?: boolean; maxHeight?: number | string; loading?: boolean; /** スケルトン行数（既定 5） */ skeletonRows?: number; error?: string | boolean; emptyNode?: React.ReactNode; onRetry?: () => void; minWidth?: number; caption?: string; /** 行クリック（履歴一覧など） */ onRowClick?: (row: Row) => void; /** 選択行の rowKey 値。--primary-subtle で強調 */ selectedKey?: string | number; /** 展開中の行キー。renderExpanded と併用 */ expandedKeys?: Array<string | number>; renderExpanded?: (row: Row) => React.ReactNode; style?: React.CSSProperties; }
export declare function DataTable<Row = any>(props: DataTableProps<Row>): JSX.Element;
