import * as React from "react";
/**
 * @startingPoint section="Layout" subtitle="アイコン + タイトル + 説明 + アクション≤3 / backLink" viewport="700x160"
 */
export interface PageHeaderBackLink { label?: string; href?: string; onClick?: () => void; }
export interface PageHeaderProps { icon?: string; title: string; description?: string; /** h1 の上に「← 戻る」（ghost 相当、13px muted）。文字列なら label 扱い */ backLink?: string | PageHeaderBackLink; children?: React.ReactNode; style?: React.CSSProperties; }
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
