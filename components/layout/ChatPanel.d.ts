import * as React from "react";
/**
 * @startingPoint section="Layout" subtitle="自分 = primary-subtle / AI = 白 + border / 下端固定の入力 + 送信 44 / テンプレチップ / 出典 / 点滅カーソル" viewport="700x560"
 */
export interface ChatMessage {
  id: string | number;
  role: "user" | "ai";
  /** プレーンテキスト（pre-wrap） */
  text?: string;
  /** レポートなどリッチ本文（text より優先） */
  content?: React.ReactNode;
  /** 出典ボックス「出典: マニュアル §3.2 / 用語集」 */
  sources?: string[];
  /** ストリーミング中 = 末尾に点滅カーソル */
  streaming?: boolean;
  at?: string;
  /** 吹き出し下の操作（役に立った / 立たなかった、保存 / クリア） */
  actions?: React.ReactNode;
}
export interface ChatTemplate { label: string; body?: string; }
export interface ChatPanelProps {
  messages?: ChatMessage[];
  value?: string; onChange?: (value: string) => void;
  /** Enter または送信ボタン */
  onSend?: (value: string) => void;
  sending?: boolean; disabled?: boolean; placeholder?: string;
  templates?: Array<string | ChatTemplate>; activeTemplate?: string; onTemplate?: (t: string | ChatTemplate) => void;
  header?: React.ReactNode; emptyNode?: React.ReactNode;
  /** パネル全体の高さ（既定 560。本文全高なら "100%"） */
  height?: number | string;
  maxRows?: number;
  /** スマホは 16（iOS ズーム防止） */
  inputFontSize?: number;
  style?: React.CSSProperties;
}
export declare function ChatPanel(props: ChatPanelProps): JSX.Element;
