// ブラウザ直接実行用の "react" シム。import map から参照する。本番では不要。
const R = window.React;
export default R;
export const { useState, useEffect, useMemo, useRef, useCallback, useId, Fragment, createElement, forwardRef } = R;
