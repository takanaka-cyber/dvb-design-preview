ラベル類。折り返し禁止。rank は S/A/B/C/停止（null で「未設定」）、media は FB/TikTok/Google/その他、status は todo/done/late/info/neutral に加えて 承認待ち(pending)/研修中(training)/承認済(approved)/却下(rejected)、送信済(sent)/未記載(missing)/休(off)、未納品(undelivered)/納品済(delivered)/タスクなし(none)。tier はアセクリ Tier（Tier 1 = primary-subtle）、role は ADMIN / MANAGER / LEADER / MEMBER / TRAINEE / VIEWER（mono 11px、ADMIN = primary-subtle、MANAGER・LEADER = info-subtle、他 = muted）。色は意味だけ（warning / positive / negative / info / muted / primary）。

```jsx
<Badge kind="rank" value="S" />
<Badge kind="media" value="TikTok" />
<Badge value="late" label="1件遅れ" />
<Badge kind="status" value="pending" />      // 承認待ち
<Badge kind="status" value="納品済" />        // 日本語ラベルでも引ける
<Badge kind="tier" value="Tier 1" />
<Badge kind="role" value="ADMIN" />
<Badge kind="assignee" value="白井" />
```
