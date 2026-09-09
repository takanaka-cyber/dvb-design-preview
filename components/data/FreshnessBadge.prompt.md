データ鮮度。fresh（positive）/ stale（warning、24時間以上前）/ none（未取得）。stale・none のときは `FreshnessNotice` を KPI の上に 1 本。更新が成功したら両方 fresh に戻す。

```jsx
<Button icon="RefreshCw" onClick={refresh}>CPデータ更新</Button>
<FreshnessBadge state="stale" time="9/7 18:40" />
{fresh !== "fresh" ? <FreshnessNotice onRefresh={refresh} /> : null}
```
