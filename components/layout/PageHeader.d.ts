import * as React from "react";
/**
 * @startingPoint section="Layout" subtitle="アイコン + タイトル + 説明 + アクション≤3" viewport="700x120"
 */
export interface PageHeaderProps { icon?: string; title: string; description?: string; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
