import React, { useState, useEffect, useRef } from "react";
import { GG_MEMBERS, USER_ROLES, DEPARTMENTS, ADMIN_USERS, ORGANIZATION, CHATWORK_ROOMS, ADMIN_ASSIGNEES, TIER_SUMMARY, EVAL_QUARTERS, EVAL_STATUS, EVAL_ADMIN_QUARTER_GOALS, EVAL_ADMIN_MEMBERS, EVALUATOR_OPTIONS, EVAL_ADMIN_ASSIGNMENTS, SYS_CANDIDATES, SYS_REQUESTS, META_BMS, META_FETCH_JOBS, TIKTOK_BCS, TIKTOK_FETCH_JOBS, TRAINEES, TRAINING_STEPS, TRAINING_ITEMS, TRAINING_VALUES, CR_OUTPUTS, CR_TARGET, TRAINING_FEEDBACK } from "./data.js";

/* バッチ 4（続き）: ユーザー管理 / アセクリ・ルーム管理 / 目標設定 / システム設定 / 研修管理 */
const card = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)", padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const muted = { fontSize: 13, lineHeight: "18px", color: "var(--muted-foreground)" };
const mono = { fontFamily: "var(--font-mono)", fontSize: 13, fontVariantNumeric: "tabular-nums" };
const flush = { ...card, padding: 0, gap: 0, overflow: "hidden" };
const tableFlush = { border: 0, borderRadius: 0, boxShadow: "none", borderTop: "1px solid var(--border)" };
const HEAD = { padding: "12px 16px" };

/** 行右 `⋯` ドロップダウン（権限 / 所属 / 研修中 / パスワードリセット / 無効化）。位置は現状どおり行の右端 */
function RowMenu({ items, label = "その他の操作" }) {
  const { IconButton, Ic } = window.DVBKit;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { if (!open) return; const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex" }}>
      <IconButton icon="Ellipsis" label={label} active={open} onClick={() => setOpen(!open)} />
      {open ? (
        <div role="menu" style={{ position: "absolute", right: 0, top: 36, zIndex: 20, minWidth: 200, padding: 4, background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)", display: "flex", flexDirection: "column" }}>
          {items.map((it, i) => it === "-" ? <hr key={i} style={{ border: 0, borderTop: "1px solid var(--border)", margin: "4px 0" }} /> : (
            <button key={it.label} type="button" role="menuitem" onClick={() => { setOpen(false); it.onClick && it.onClick(); }} style={{ display: "flex", alignItems: "center", gap: 8, height: 36, padding: "0 10px", border: 0, borderRadius: "var(--radius-sm)", background: "transparent", color: it.destructive ? "var(--negative)" : "var(--foreground)", fontSize: 13, textAlign: "left", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--muted)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <Ic name={it.icon} size={16} />{it.label}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
}

/* ================= ユーザー管理 /admin/users（A + C。組織管理・リーダー管理を内包） ================= */
export function AdminUsersScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Badge, DataTable, Dialog, ConfirmDialog, Input, Select, Field, Tabs, EmptyState } = window.DVB;
  const { AdminPage, IconButton, CrudList } = window.DVBKit;
  const empty = state === "empty";
  const [users, setUsers] = useState(empty ? { pending: [], training: [], approved: ADMIN_USERS.approved.filter((u) => u.role === "ADMIN"), rejected: [] } : ADMIN_USERS);
  const [open, setOpen] = useState(state === "dialog");
  const [form, setForm] = useState({ name: "", email: "", dept: DEPARTMENTS[0], role: "MEMBER" });
  const [dept, setDept] = useState("all");
  const [confirm, setConfirm] = useState(null);
  const [orgs, setOrgs] = useState(ORGANIZATION);
  const [newDept, setNewDept] = useState("");
  const [leaders, setLeaders] = useState(Object.fromEntries(ORGANIZATION.flatMap((d) => d.sections).map((s) => [s.id, s.leader])));
  const move = (from, to, u, patch = {}) => setUsers((s) => ({ ...s, [from]: s[from].filter((x) => x.id !== u.id), [to]: [{ ...u, ...patch }, ...s[to]] }));
  const approve = (u) => { move("pending", "training", u, { dept: DEPARTMENTS[0], role: "TRAINEE", start: "9/9", day: 1 }); toast({ kind: "success", message: `${u.name} を承認し、研修中にしました` }); };
  const reject = (u) => { move("pending", "rejected", u, { rejectedAt: "9/9", reason: "" }); toast({ kind: "undo", message: `${u.name} を却下しました`, actionLabel: "元に戻す", onAction: () => move("rejected", "pending", u) }); };
  const finishTraining = (u) => { move("training", "approved", u, { role: "MEMBER", lastActive: "—" }); toast({ kind: "success", message: `${u.name} の研修を終了しました` }); };
  const addUser = () => { setUsers((s) => ({ ...s, approved: [{ id: "u" + Date.now(), ...form, lastActive: "—" }, ...s.approved] })); setOpen(false); setForm({ name: "", email: "", dept: DEPARTMENTS[0], role: "MEMBER" }); toast({ kind: "success", message: `${form.name} を追加しました。招待メールを送信します` }); };
  const menu = (u) => [
    { icon: "Shield", label: "権限を変更", onClick: () => toast({ kind: "info", message: `${u.name} の権限を変更（Dialog）` }) },
    { icon: "Building2", label: "所属を変更", onClick: () => toast({ kind: "info", message: `${u.name} の所属を変更（Dialog）` }) },
    { icon: "GraduationCap", label: "研修中にする", onClick: () => { move("approved", "training", u, { role: "TRAINEE", start: "9/9", day: 1 }); toast({ kind: "success", message: `${u.name} を研修中にしました` }); } },
    { icon: "KeyRound", label: "パスワードリセット", onClick: () => toast({ kind: "success", message: `${u.name} にリセットメールを送信しました` }) },
    "-",
    { icon: "UserX", label: "無効化", destructive: true, onClick: () => setConfirm(u) },
  ];
  const approvedRows = users.approved.filter((u) => dept === "all" || u.dept === dept);
  const approvedCols = [
    { key: "name", label: "名前", render: (u) => <span style={{ fontWeight: 500 }}>{u.name}</span> },
    { key: "email", label: "メール", render: (u) => <span style={{ ...mono, color: "var(--muted-foreground)" }}>{u.email}</span> },
    { key: "dept", label: "所属", width: 100 },
    { key: "role", label: "権限", width: 100, render: (u) => <Badge kind="role" value={u.role} /> },
    { key: "lastActive", label: "最終アクセス", width: 130, render: (u) => <span style={mono}>{u.lastActive}</span> },
    { key: "ops", label: "", width: 44, align: "right", render: (u) => <RowMenu items={menu(u)} /> },
  ];
  const Row = ({ children }) => <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, padding: "0 12px 0 16px", borderTop: "1px solid var(--border)" }}>{children}</div>;
  return (
    <AdminPage>
      <PageHeader icon="Users" title="ユーザー管理" description="承認 → 研修 → 所属と権限。組織とリーダーもここで">
        <Button variant="primary" icon="UserPlus" onClick={() => setOpen(true)}>ユーザー追加</Button>
      </PageHeader>

      {/* ① 承認待ち（黄カード → 白 + status Badge） */}
      <section style={flush}>
        <SectionHeading icon="UserCheck" title="承認待ち" count={users.pending.length} style={HEAD}>{users.pending.length ? <Badge kind="status" value="pending" /> : null}</SectionHeading>
        {users.pending.length === 0 ? <div style={{ borderTop: "1px solid var(--border)" }}><EmptyState compact icon="UserCheck" title="承認待ちの申請はありません" /></div> : users.pending.map((u) => (
          <Row key={u.id}>
            <span style={{ fontWeight: 500, minWidth: 80 }}>{u.name}</span>
            <span style={{ ...mono, color: "var(--muted-foreground)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
            <span style={{ ...muted, whiteSpace: "nowrap" }}>申請 {u.requestedAt}</span>
            {u.roomId ? <Badge value="info" label="Chatwork 設定済" /> : <Badge value="neutral" label="Chatwork 未設定" />}
            <span style={{ display: "inline-flex", gap: 4 }}>
              <Button size="sm" variant="primary" icon="Check" onClick={() => approve(u)}>承認</Button>
              <Button size="sm" variant="ghost" icon="X" style={{ color: "var(--negative)" }} onClick={() => reject(u)}>却下</Button>
            </span>
          </Row>
        ))}
      </section>

      {/* ② 研修中（青カード → 白 + status Badge） */}
      <section style={flush}>
        <SectionHeading icon="GraduationCap" title="研修中" count={users.training.length} style={HEAD}>{users.training.length ? <Badge kind="status" value="training" /> : null}</SectionHeading>
        {users.training.length === 0 ? <div style={{ borderTop: "1px solid var(--border)" }}><EmptyState compact icon="GraduationCap" title="研修中のユーザーはいません" /></div> : users.training.map((u) => (
          <Row key={u.id}>
            <span style={{ fontWeight: 500, minWidth: 80 }}>{u.name}</span>
            <span style={{ ...mono, color: "var(--muted-foreground)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
            <span style={muted}>{u.dept}</span>
            <span style={{ ...muted, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>開始 {u.start} · {u.day} 日目</span>
            <Badge kind="role" value={u.role} />
            <Button size="sm" variant="secondary" icon="Check" onClick={() => finishTraining(u)}>研修を終了</Button>
          </Row>
        ))}
      </section>

      {/* ③ 承認済み（部署 Tabs + DataTable、行右 ⋯） */}
      <section style={{ ...flush, overflow: "visible" }}>
        <SectionHeading icon="Users" title="承認済み" count={users.approved.length} style={HEAD} />
        <Tabs aria-label="部署" value={dept} onChange={setDept} style={{ padding: "0 8px" }} items={[{ value: "all", label: "すべて", count: users.approved.length }, ...DEPARTMENTS.map((d) => ({ value: d, label: d, count: users.approved.filter((u) => u.dept === d).length })), { value: "—", label: "所属なし", count: users.approved.filter((u) => u.dept === "—").length }]} />
        <DataTable columns={approvedCols} rows={approvedRows} density="compact" style={{ ...tableFlush, borderTop: 0, overflow: "visible" }} emptyNode={<EmptyState compact icon="Users" title="この部署のユーザーはいません" description="右上の［ユーザー追加］か、承認待ちの承認から。" />} />
      </section>

      {/* ④ 却下済み（薄） */}
      <section style={{ ...flush, opacity: users.rejected.length ? 0.85 : 1 }}>
        <SectionHeading icon="UserX" title="却下済み" count={users.rejected.length} style={HEAD} />
        {users.rejected.length === 0 ? <div style={{ borderTop: "1px solid var(--border)", padding: "10px 16px", ...muted }}>却下した申請はありません。</div> : users.rejected.map((u) => (
          <Row key={u.id}>
            <span style={{ fontWeight: 500, minWidth: 80, color: "var(--muted-foreground)" }}>{u.name}</span>
            <span style={{ ...mono, color: "var(--muted-foreground)", flex: 1 }}>{u.email}</span>
            <span style={muted}>{u.rejectedAt} 却下{u.reason ? ` · ${u.reason}` : ""}</span>
            <Badge kind="status" value="rejected" />
            <Button size="sm" variant="ghost" icon="Undo2" onClick={() => { move("rejected", "pending", u); toast({ kind: "success", message: `${u.name} を承認待ちに戻しました` }); }}>承認待ちに戻す</Button>
          </Row>
        ))}
      </section>

      {/* ⑤ 組織管理（slate 帯・indigo→purple 廃止。部 → 課は ml 入れ子のまま） */}
      <section style={flush}>
        <SectionHeading icon="Building2" title="組織管理" description="部 → 課。課は部の中に入れ子" style={HEAD} />
        <div style={{ display: "flex", gap: 8, padding: "0 16px 12px", alignItems: "center" }}>
          <Input value={newDept} placeholder="新しい部の名前" aria-label="新しい部の名前" onChange={(e) => setNewDept(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && newDept.trim()) { setOrgs([...orgs, { id: "d" + Date.now(), name: newDept, sections: [] }]); setNewDept(""); toast({ kind: "success", message: "部を追加しました" }); } }} />
          <Button variant="primary" icon="Plus" disabled={!newDept.trim()} onClick={() => { setOrgs([...orgs, { id: "d" + Date.now(), name: newDept, sections: [] }]); setNewDept(""); toast({ kind: "success", message: "部を追加しました" }); }}>登録</Button>
        </div>
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {orgs.map((d) => (
            <div key={d.id} style={{ borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, padding: "0 12px 0 16px" }}>
                <span style={{ width: 20, height: 20, borderRadius: 4, background: "var(--muted)", color: "var(--muted-foreground)", display: "grid", placeItems: "center" }}>{React.createElement(window.LucideReact.Building2, { size: 12, strokeWidth: 1.75 })}</span>
                <span style={{ fontWeight: 600, flex: 1 }}>{d.name}</span>
                <span style={muted}>{d.sections.length} 課 · {d.sections.reduce((n, s) => n + s.members, 0)} 名</span>
                <Button size="sm" variant="ghost" icon="Plus" onClick={() => { setOrgs(orgs.map((x) => (x.id === d.id ? { ...x, sections: [...x.sections, { id: "s" + Date.now(), name: `${d.name.split("（")[0]} ${x.sections.length + 1}課`, members: 0, leader: "" }] } : x))); toast({ kind: "success", message: "課を追加しました" }); }}>課を追加</Button>
                <IconButton icon="Pencil" label="部名を編集" onClick={() => toast({ kind: "info", message: "部名をインライン編集（型 A と同じ）" })} />
                <IconButton icon="Trash2" label="部を削除" tone="destructive" disabled={d.sections.length > 0} onClick={() => { setOrgs(orgs.filter((x) => x.id !== d.id)); toast({ kind: "success", message: "部を削除しました" }); }} />
              </div>
              {d.sections.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 40, padding: "0 12px 0 46px", borderTop: "1px solid var(--border)", background: "var(--background)" }}>
                  <span style={{ flex: 1, fontSize: 14 }}>{s.name}</span>
                  <span style={muted}>{s.members} 名</span>
                  <IconButton icon="Pencil" label="課名を編集" onClick={() => toast({ kind: "info", message: "課名をインライン編集" })} />
                  <IconButton icon="Trash2" label="課を削除" tone="destructive" disabled={s.members > 0} onClick={() => { setOrgs(orgs.map((x) => (x.id === d.id ? { ...x, sections: x.sections.filter((y) => y.id !== s.id) } : x))); toast({ kind: "success", message: "課を削除しました" }); }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ⑥ リーダー管理（課ごとに 1 名） */}
      <section style={flush}>
        <SectionHeading icon="Crown" title="リーダー管理" description="課ごとのリーダー。日報コメントと週次まとめの確認者" style={HEAD} />
        <DataTable density="compact" style={tableFlush} rows={orgs.flatMap((d) => d.sections.map((s) => ({ ...s, dept: d.name })))}
          columns={[
            { key: "dept", label: "部", width: 220, render: (r) => <span style={muted}>{r.dept}</span> },
            { key: "name", label: "課", render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
            { key: "leader", label: "リーダー", width: 200, render: (r) => <Select size="sm" aria-label={`${r.name} のリーダー`} value={leaders[r.id] || ""} placeholder="未設定" options={GG_MEMBERS} width="100%" onChange={(e) => { setLeaders({ ...leaders, [r.id]: e.target.value }); toast({ kind: "success", message: `${r.name} のリーダーを${e.target.value ? `${e.target.value} に` : "解除"}しました` }); }} /> },
            { key: "state", label: "", width: 96, render: (r) => (leaders[r.id] ? <Badge kind="role" value="LEADER" /> : <Badge value="neutral" label="未設定" />) },
          ]} />
      </section>

      <Dialog open={open} size="sm" title="ユーザーを追加" description="招待メールを送ります。パスワードは本人が設定" onClose={() => setOpen(false)} confirmLabel="追加" confirmDisabled={!form.name.trim() || !form.email.includes("@")} onConfirm={addUser}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="名前" htmlFor="nu-name" required><Input id="nu-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="メールアドレス" htmlFor="nu-email" required><Input id="nu-email" type="email" value={form.email} placeholder="name@example.com" onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="所属" htmlFor="nu-dept"><Select id="nu-dept" value={form.dept} options={[...DEPARTMENTS, "—"]} onChange={(e) => setForm({ ...form, dept: e.target.value })} width="100%" /></Field>
            <Field label="権限" htmlFor="nu-role"><Select id="nu-role" value={form.role} options={USER_ROLES} onChange={(e) => setForm({ ...form, role: e.target.value })} width="100%" /></Field>
          </div>
        </div>
      </Dialog>
      <ConfirmDialog open={!!confirm} destructive title="ユーザーを無効化しますか？" description={confirm ? `${confirm.name}（${confirm.email}）はログインできなくなります。データは残ります。` : ""} confirmLabel="無効化" onConfirm={() => { const u = confirm; setUsers((s) => ({ ...s, approved: s.approved.filter((x) => x.id !== u.id) })); setConfirm(null); toast({ kind: "undo", message: `${u.name} を無効化しました`, actionLabel: "元に戻す", onAction: () => setUsers((s) => ({ ...s, approved: [u, ...s.approved] })) }); }} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
}

/* ================= アセクリ・ルーム管理 /admin/assignees（型 A × 2、2 カラム） ================= */
/** リスト + 下部全幅 secondary「追加」→ 破線パネルのフォーム。追加ボタンの位置は現状（リストの下・全幅）を維持 */
function ListColumn({ icon, title, count, children, addLabel, form, onAdd, canAdd, emptyNode, toast }) {
  const { SectionHeading, Button } = window.DVB;
  const [adding, setAdding] = useState(false);
  return (
    <section style={{ ...flush, alignSelf: "start" }}>
      <SectionHeading icon={icon} title={title} count={count} style={HEAD} />
      <div style={{ borderTop: "1px solid var(--border)" }}>{count === 0 ? emptyNode : children}</div>
      <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
        {adding ? (
          <div style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: 12, display: "flex", flexDirection: "column", gap: 10, background: "var(--background)" }}>
            {form}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => setAdding(false)}>キャンセル</Button>
              <Button size="sm" variant="primary" icon="Plus" disabled={!canAdd} onClick={() => { onAdd(); setAdding(false); }}>追加</Button>
            </div>
          </div>
        ) : <Button variant="secondary" block icon="Plus" onClick={() => setAdding(true)}>{addLabel}</Button>}
      </div>
    </section>
  );
}
export function AdminAssigneesScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Badge, Input, Select, Field, ConfirmDialog, EmptyState, Switch } = window.DVB;
  const { AdminPage, IconButton, Ic } = window.DVBKit;
  const empty = state === "empty";
  const [rooms, setRooms] = useState(empty ? [] : CHATWORK_ROOMS);
  const [assignees, setAssignees] = useState(empty ? [] : ADMIN_ASSIGNEES);
  const [rf, setRf] = useState({ name: "", roomId: "", use: "発注" });
  const [af, setAf] = useState({ name: "", tier: "Tier 2", room: "" });
  const [confirm, setConfirm] = useState(null);
  const [editing, setEditing] = useState(null);
  const roomOpts = [{ value: "", label: "ルーム未設定" }, ...rooms.map((r) => ({ value: r.id, label: r.name }))];
  const tiers = TIER_SUMMARY.map((t) => ({ ...t, count: assignees.filter((a) => a.tier === t.tier).length }));
  const del = () => { const c = confirm; if (c.kind === "room") setRooms(rooms.filter((r) => r.id !== c.row.id)); else setAssignees(assignees.filter((a) => a.id !== c.row.id)); setConfirm(null); toast({ kind: "undo", message: `${c.row.name} を削除しました`, actionLabel: "元に戻す", onAction: () => (c.kind === "room" ? setRooms((rs) => [...rs, c.row]) : setAssignees((as) => [...as, c.row])) }); };
  const row = { display: "flex", alignItems: "center", gap: 10, minHeight: 48, padding: "0 8px 0 16px", borderBottom: "1px solid var(--border)" };
  return (
    <AdminPage>
      <PageHeader icon="Images" title="アセクリ・ルーム管理" description="左: 発注先の Chatwork ルーム / 右: アセクリ（外部制作パートナー）と Tier" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 16, alignItems: "start" }}>
        <ListColumn icon="MessageSquare" title="Chatwork ルーム" count={rooms.length} addLabel="ルームを追加" canAdd={rf.name.trim() && rf.roomId.trim()} toast={toast}
          emptyNode={<EmptyState compact icon="MessageSquare" title="ルームはまだありません" description="下の［ルームを追加］から。" />}
          onAdd={() => { setRooms([...rooms, { id: "r" + Date.now(), ...rf }]); setRf({ name: "", roomId: "", use: "発注" }); toast({ kind: "success", message: "ルームを追加しました" }); }}
          form={<>
            <Field label="ルーム名" htmlFor="rf-n" required><Input id="rf-n" size="sm" value={rf.name} placeholder="例: アセクリ 発注（制作E社）" onChange={(e) => setRf({ ...rf, name: e.target.value })} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Field label="ルーム ID" htmlFor="rf-id" required><Input id="rf-id" size="sm" numeric value={rf.roomId} style={mono} onChange={(e) => setRf({ ...rf, roomId: e.target.value })} /></Field>
              <Field label="用途" htmlFor="rf-u"><Select id="rf-u" size="sm" value={rf.use} options={["発注", "タスク報告", "日報"]} onChange={(e) => setRf({ ...rf, use: e.target.value })} width="100%" /></Field>
            </div>
          </>}>
          {rooms.map((r) => (
            <div key={r.id} style={row}>
              {editing === r.id ? <Input size="sm" defaultValue={r.name} autoFocus aria-label="ルーム名" onKeyDown={(e) => { if (e.key === "Enter") { setRooms(rooms.map((x) => (x.id === r.id ? { ...x, name: e.target.value } : x))); setEditing(null); toast({ kind: "success", message: "ルーム名を更新しました" }); } if (e.key === "Escape") setEditing(null); }} style={{ flex: 1 }} /> : (
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                  <span style={{ ...mono, fontSize: 12, color: "var(--muted-foreground)" }}>{r.roomId}</span>
                </span>
              )}
              <Badge value={r.use === "発注" ? "info" : "neutral"} label={r.use} />
              {editing === r.id ? <><Button size="sm" variant="primary" icon="Check" aria-label="確定" style={{ width: 32, minWidth: 32, padding: 0 }} onClick={() => { setEditing(null); toast({ kind: "success", message: "ルーム名を更新しました" }); }} /><IconButton icon="X" label="キャンセル" onClick={() => setEditing(null)} /></>
                : <><IconButton icon="Pencil" label="編集" onClick={() => setEditing(r.id)} /><IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm({ kind: "room", row: r })} /></>}
            </div>
          ))}
        </ListColumn>

        <ListColumn icon="Images" title="アセクリ" count={assignees.length} addLabel="アセクリを追加" canAdd={af.name.trim()} toast={toast}
          emptyNode={<EmptyState compact icon="Images" title="アセクリはまだありません" description="下の［アセクリを追加］から。" />}
          onAdd={() => { setAssignees([...assignees, { id: "as" + Date.now(), name: af.name, tier: af.tier, room: af.room, token: false, active: true, undelivered: 0, delivered: 0 }]); setAf({ name: "", tier: "Tier 2", room: "" }); toast({ kind: "success", message: "アセクリを追加しました。アクセス URL を発行してください" }); }}
          form={<>
            <Field label="名前" htmlFor="af-n" required help="個人名ではなく会社名・屋号"><Input id="af-n" size="sm" value={af.name} placeholder="例: 制作E社" onChange={(e) => setAf({ ...af, name: e.target.value })} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Field label="Tier" htmlFor="af-t"><Select id="af-t" size="sm" value={af.tier} options={["Tier 1", "Tier 2", "Tier 3"]} onChange={(e) => setAf({ ...af, tier: e.target.value })} width="100%" /></Field>
              <Field label="発注ルーム" htmlFor="af-r"><Select id="af-r" size="sm" value={af.room} options={roomOpts} onChange={(e) => setAf({ ...af, room: e.target.value })} width="100%" /></Field>
            </div>
          </>}>
          {assignees.map((a) => (
            <div key={a.id} style={row}>
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</span>
                <span style={{ ...muted, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}><Ic name={a.token ? "Link2" : "Link2Off"} size={12} color={a.token ? "var(--positive)" : "var(--muted-foreground)"} />{a.token ? "URL 発行済" : "URL 未発行"}</span>
              </span>
              <Badge kind="tier" value={a.tier} />
              <Select size="sm" aria-label={`${a.name} の発注ルーム`} value={a.room} options={roomOpts} width={132} onChange={(e) => { setAssignees(assignees.map((x) => (x.id === a.id ? { ...x, room: e.target.value } : x))); toast({ kind: "success", message: "発注ルームを更新しました" }); }} />
              <IconButton icon="Pencil" label="編集" onClick={() => toast({ kind: "info", message: "名前・Tier をインライン編集（型 A と同じ）" })} />
              <IconButton icon="Trash2" label="削除" tone="destructive" onClick={() => setConfirm({ kind: "assignee", row: a })} />
            </div>
          ))}
        </ListColumn>
      </div>
      {/* 下部: Tier 集計 */}
      <section style={card}>
        <SectionHeading icon="Layers" title="Tier 集計" description="Tier 1 = 優先発注 / Tier 2 = 通常 / Tier 3 = 試用" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
          {tiers.map((t) => (
            <div key={t.tier} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
              <Badge kind="tier" value={t.tier} />
              <span style={{ ...mono, fontSize: 20, fontWeight: 600, marginLeft: "auto" }}>{t.count}</span><span style={muted}>社</span>
            </div>
          ))}
        </div>
      </section>
      <ConfirmDialog open={!!confirm} destructive title={confirm && confirm.kind === "room" ? "ルームを削除しますか？" : "アセクリを削除しますか？"} description={confirm ? (confirm.kind === "room" ? `「${confirm.row.name}」を削除します。このルームを発注先にしているアセクリは未設定になります。` : `「${confirm.row.name}」を削除します。未納品 ${confirm.row.undelivered || 0} 件のタスクは担当なしになります。`) : ""} confirmLabel="削除" onConfirm={del} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
}

/* ================= 目標設定 /admin/evaluation-settings（B + D） ================= */
export function AdminGoalsScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Badge, DataTable, Textarea, Input, Field, Select, Tabs, SegmentedControl, EmptyState, KpiCard } = window.DVB;
  const { AdminPage } = window.DVBKit;
  const empty = state === "empty";
  const [q, setQ] = useState(empty ? "Q3" : "Q2");
  const [tab, setTab] = useState("goals");
  const [goals, setGoals] = useState(EVAL_ADMIN_QUARTER_GOALS);
  const [assign, setAssign] = useState(EVAL_ADMIN_ASSIGNMENTS);
  const [saving, setSaving] = useState(false);
  const g = goals[q] || { company: "", dept: "", deadline: "" };
  const upd = (k, v) => setGoals({ ...goals, [q]: { ...g, [k]: v } });
  const save = () => { setSaving(true); setTimeout(() => { setSaving(false); toast({ kind: "success", message: `${q} の四半期目標を保存しました` }); }, 900); };
  const members = q === "Q2" ? EVAL_ADMIN_MEMBERS : EVAL_ADMIN_MEMBERS.map((m) => ({ ...m, status: "draft", updatedAt: "—" }));
  const counts = Object.keys(EVAL_STATUS).map((k) => [k, members.filter((m) => m.status === k).length]);
  return (
    <AdminPage>
      <PageHeader icon="Flag" title="目標設定" description="四半期目標の配信、メンバーの評価シート進捗、評価者の割当">
        <span style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>2026 年度</span>
        <SegmentedControl aria-label="四半期" options={EVAL_QUARTERS} value={q} onChange={setQ} />
      </PageHeader>
      <Tabs aria-label="目標設定の内容" value={tab} onChange={setTab} items={[{ value: "goals", label: "四半期目標", icon: "Flag" }, { value: "progress", label: "進捗一覧", icon: "ClipboardCheck", count: members.length }, { value: "assign", label: "評価者割当", icon: "UserCheck" }]} />

      {tab === "goals" ? (<>
        <section style={card}>
          <SectionHeading icon="Building2" title={`${q} の全社・部門目標`} description="評価シートの上部に表示" />
          <Field label="全社目標" htmlFor="g-company" required><Textarea id="g-company" rows={3} value={g.company} placeholder="例: 商材粗利 年 ¥1.6 億。新規検証 CP を月 8 本配信し…" onChange={(e) => upd("company", e.target.value)} /></Field>
          <Field label="部門目標（GG）" htmlFor="g-dept" required><Textarea id="g-dept" rows={3} value={g.dept} placeholder="例: 月次商材粗利 ¥12,000,000 を 3 か月連続で達成…" onChange={(e) => upd("dept", e.target.value)} /></Field>
        </section>
        <section style={card}>
          <SectionHeading icon="CalendarClock" title="提出期限" description="期限を過ぎた自己評価は評価者に通知" />
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12 }}>
            <Field label="自己評価の期限" htmlFor="g-dl" required><Input id="g-dl" type="date" value={g.deadline} onChange={(e) => upd("deadline", e.target.value)} /></Field>
            <Field label="通知" htmlFor="g-nt"><Select id="g-nt" defaultValue="3 日前 / 前日 / 当日" options={["3 日前 / 前日 / 当日", "前日 / 当日", "なし"]} width="100%" /></Field>
          </div>
        </section>
        <div><Button variant="primary" icon="Save" loading={saving} disabled={!g.company.trim() || !g.dept.trim() || !g.deadline} onClick={save}>保存</Button></div>
      </>) : tab === "progress" ? (<>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
          <KpiCard label="自己評価 提出済" value={members.filter((m) => m.status !== "draft").length} unit={`/ ${members.length} 名`} note={q === "Q2" ? "期限 9/30" : "未開始"} />
          <KpiCard label="一次評価 待ち" value={members.filter((m) => m.status === "first").length} unit="名" />
          <KpiCard label="差し戻し" value={members.filter((m) => m.status === "returned").length} unit="名" />
          <KpiCard label="確定" value={members.filter((m) => m.status === "fixed").length} unit="名" />
        </div>
        <section style={flush}>
          <SectionHeading icon="ClipboardCheck" title={`${q} 評価シート 進捗`} count={members.length} style={HEAD}>
            <span style={{ display: "inline-flex", gap: 6 }}>{counts.filter(([, n]) => n).map(([k, n]) => <Badge key={k} value={EVAL_STATUS[k][1]} label={`${EVAL_STATUS[k][0]} ${n}`} size="sm" />)}</span>
          </SectionHeading>
          <DataTable density="compact" style={tableFlush} rows={members} columns={[
            { key: "name", label: "名前", render: (m) => <span style={{ fontWeight: 500 }}>{m.name}</span> },
            { key: "dept", label: "所属", width: 120 },
            { key: "grade", label: "等級", width: 80, render: (m) => <span style={mono}>{m.grade}</span> },
            { key: "status", label: "ステータス", width: 130, render: (m) => <Badge value={EVAL_STATUS[m.status][1]} label={EVAL_STATUS[m.status][0]} /> },
            { key: "updatedAt", label: "更新日", width: 130, render: (m) => <span style={{ ...mono, color: "var(--muted-foreground)" }}>{m.updatedAt}</span> },
            { key: "ops", label: "", width: 100, align: "right", render: (m) => <Button size="sm" variant="ghost" icon="ExternalLink" onClick={() => toast({ kind: "info", message: `${m.name} の評価シートを開く` })}>開く</Button> },
          ]} emptyNode={<EmptyState compact icon="ClipboardCheck" title="評価対象のメンバーがいません" />} />
        </section>
      </>) : (
        <section style={flush}>
          <SectionHeading icon="UserCheck" title="評価者割当" description="一次 / 最終。役職で指定（個人名は置かない）" style={HEAD} />
          <DataTable density="compact" style={tableFlush} rows={assign} columns={[
            { key: "name", label: "被評価者", render: (a) => <span style={{ fontWeight: 500 }}>{a.name}</span> },
            { key: "first", label: "一次評価者", width: 220, render: (a) => <Select size="sm" aria-label={`${a.name} の一次評価者`} value={a.first} options={EVALUATOR_OPTIONS} width="100%" onChange={(e) => { setAssign(assign.map((x) => (x.id === a.id ? { ...x, first: e.target.value } : x))); toast({ kind: "success", message: "一次評価者を更新しました" }); }} /> },
            { key: "final", label: "最終評価者", width: 220, render: (a) => <Select size="sm" aria-label={`${a.name} の最終評価者`} value={a.final} options={EVALUATOR_OPTIONS} width="100%" onChange={(e) => { setAssign(assign.map((x) => (x.id === a.id ? { ...x, final: e.target.value } : x))); toast({ kind: "success", message: "最終評価者を更新しました" }); }} /> },
          ]} />
        </section>
      )}
    </AdminPage>
  );
}

/* ================= システム設定 /admin/settings（max-w-2xl、Card 8 枚縦積み。順序維持） ================= */
export function AdminSystemScreen({ state = "normal", toast }) {
  const { PageHeader, SectionHeading, Button, Badge, EmptyState } = window.DVB;
  const { AdminPage, CrudList, FetchJobsPanel, ChatworkSettingsForm, META_ACCOUNTS, TIKTOK_ACCOUNTS, Ic } = window.DVBKit;
  const [cands, setCands] = useState(SYS_CANDIDATES);
  const [reqs, setReqs] = useState(SYS_REQUESTS);
  const [detecting, setDetecting] = useState(false);
  const detect = () => { setDetecting(true); setTimeout(() => { setDetecting(false); toast({ kind: "info", message: "新しい CPN は見つかりませんでした" }); }, 900); };
  const rowS = { display: "flex", alignItems: "center", gap: 10, minHeight: 48, padding: "0 12px 0 16px", borderTop: "1px solid var(--border)" };
  return (
    <AdminPage width={672}>
      <PageHeader icon="Settings" title="システム設定" description="登録候補・追加依頼・媒体アカウント・追加取得・チャットワーク連携" />
      {/* ① 登録候補（右上「検出」） */}
      <section style={flush}>
        <SectionHeading icon="Radar" title="登録候補" count={cands.length} description="AXAD で見つかった未登録 CPN" style={HEAD}><Button size="sm" variant="secondary" icon="ScanSearch" loading={detecting} onClick={detect}>検出</Button></SectionHeading>
        {cands.length === 0 ? <div style={{ borderTop: "1px solid var(--border)" }}><EmptyState compact icon="Radar" title="登録候補はありません" description="毎朝 6:00 の同期後に自動で検出します。" /></div> : cands.map((c) => (
          <div key={c.id} style={rowS}>
            <Badge kind="media" value={c.media} />
            <span style={{ flex: 1, minWidth: 0, ...mono, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
            <span style={{ ...muted, whiteSpace: "nowrap" }}>検出 {c.detectedAt}</span>
            <Button size="sm" variant="primary" icon="Plus" onClick={() => { setCands(cands.filter((x) => x.id !== c.id)); toast({ kind: "success", message: "案件マスタに登録しました" }); }}>登録</Button>
            <Button size="sm" variant="ghost" onClick={() => { setCands(cands.filter((x) => x.id !== c.id)); toast({ kind: "undo", message: "候補を無視しました", actionLabel: "元に戻す", onAction: () => setCands((cs) => [...cs, c]) }); }}>無視</Button>
          </div>
        ))}
      </section>
      {/* ② 追加依頼（黄カード → 白 + warning Badge） */}
      <section style={flush}>
        <SectionHeading icon="Inbox" title="追加依頼" count={reqs.length} description="メンバーからの媒体アカウント追加依頼" style={HEAD}>{reqs.length ? <Badge value="todo" label="対応待ち" /> : null}</SectionHeading>
        {reqs.length === 0 ? <div style={{ borderTop: "1px solid var(--border)", padding: "10px 16px", ...muted }}>対応待ちの依頼はありません。</div> : reqs.map((r) => (
          <div key={r.id} style={rowS}>
            <Badge kind="assignee" value={r.from} />
            <span style={{ flex: 1, fontSize: 14 }}>{r.target}</span>
            <span style={{ ...muted, whiteSpace: "nowrap" }}>{r.at}</span>
            <Button size="sm" variant="primary" icon="Check" onClick={() => { setReqs(reqs.filter((x) => x.id !== r.id)); toast({ kind: "success", message: "依頼を承認し、アカウントを追加しました" }); }}>承認</Button>
            <Button size="sm" variant="ghost" icon="X" style={{ color: "var(--negative)" }} onClick={() => { setReqs(reqs.filter((x) => x.id !== r.id)); toast({ kind: "undo", message: "依頼を却下しました", actionLabel: "元に戻す", onAction: () => setReqs((rs) => [...rs, r]) }); }}>却下</Button>
          </div>
        ))}
      </section>
      {/* ③ Meta BM（型 A）④ 追加取得 Meta（型 C） */}
      <CrudList noun="Meta BM" icon="Facebook" density="compact" embedded toast={toast} rows={META_BMS} fields={[{ key: "name", label: "BM 名", placeholder: "例: GG 新規 BM" }, { key: "bmId", label: "BM ID", width: 180, mono: true, placeholder: "数字 13 桁" }]} extraColumns={[{ key: "accounts", label: "アカウント", width: 100, align: "right", render: (r) => <span style={mono}>{r.accounts ?? 0}</span> }]} />
      <FetchJobsPanel media="Meta" embedded jobs={META_FETCH_JOBS} accounts={META_ACCOUNTS} toast={toast} />
      {/* ⑤ TikTok BC（型 A）⑥ 追加取得 TikTok（型 C）— Meta と同じ見た目 */}
      <CrudList noun="TikTok BC" icon="Music2" density="compact" embedded toast={toast} rows={TIKTOK_BCS} fields={[{ key: "name", label: "BC 名", placeholder: "例: GG TikTok BC 2" }, { key: "bcId", label: "BC ID", width: 200, mono: true, placeholder: "数字 19 桁" }]} extraColumns={[{ key: "accounts", label: "アカウント", width: 100, align: "right", render: (r) => <span style={mono}>{r.accounts ?? 0}</span> }]} />
      <FetchJobsPanel media="TikTok" embedded jobs={TIKTOK_FETCH_JOBS} accounts={TIKTOK_ACCOUNTS} toast={toast} />
      {/* ⑦ チャットワーク連携（型 B、下部 保存） */}
      <ChatworkSettingsForm toast={toast} embedded />
      {/* ⑧ ヘルプ */}
      <section style={card}>
        <SectionHeading icon="CircleHelp" title="ヘルプ" />
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6, fontSize: 14, lineHeight: "20px" }}>
          {[["数値が古いとき", "追加取得で期間を指定して再取得。同期は毎朝 6:00"], ["CPN が案件に紐付かないとき", "登録候補で案件に登録。命名規則は マニュアル §3.1"], ["通知が届かないとき", "チャットワーク連携の API トークンとルーム ID を確認"]].map(([t, d]) => (
            <li key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><Ic name="ChevronRight" size={16} color="var(--muted-foreground)" style={{ marginTop: 2, flexShrink: 0 }} /><span><span style={{ fontWeight: 500 }}>{t}</span><span style={{ color: "var(--muted-foreground)" }}> — {d}</span></span></li>
          ))}
        </ul>
        <div><Button size="sm" variant="secondary" icon="FileText" onClick={() => toast({ kind: "info", message: "マニュアルを開く" })}>マニュアルを開く</Button></div>
      </section>
    </AdminPage>
  );
}

/* ================= 研修管理 /admin/onboarding（型 D。研修生 Select + §3.3.1 の SubNav 閲覧モード、FB 記入だけ可） ================= */
function FbComposer({ placeholder, toast, target }) {
  const { Textarea, Button } = window.DVB;
  const [v, setV] = useState("");
  const [sending, setSending] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--background)" }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>フィードバックを書く{target ? <span style={muted}> · {target}</span> : null}</span>
      <Textarea rows={2} value={v} placeholder={placeholder || "研修生に届きます。事実 → 次の一手 の順で"} onChange={(e) => setV(e.target.value)} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}><Button size="sm" variant="primary" icon="Send" disabled={!v.trim()} loading={sending} onClick={() => { setSending(true); setTimeout(() => { setSending(false); setV(""); toast({ kind: "success", message: "フィードバックを送信しました" }); }, 800); }}>送信</Button></div>
    </div>
  );
}
export function AdminOnboardingScreen({ state = "normal", toast, onNavigate }) {
  const { PageHeader, SectionHeading, Button, Badge, Select, SubNav, Progress, DataTable, EmptyState, KpiCard } = window.DVB;
  const { AdminPage, navGroups, trainingStats, Ic } = window.DVBKit;
  const empty = state === "empty";
  const [trainee, setTrainee] = useState(TRAINEES[0].id);
  const [page, setPage] = useState("training-home");
  const t = TRAINEES.find((x) => x.id === trainee);
  const s = trainingStats(empty);
  const groups = navGroups(empty);
  const current = TRAINING_STEPS.find((x) => x.status === "current");
  const readonlyNote = <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: "var(--radius)", background: "var(--info-subtle)", color: "var(--info-subtle-foreground)", fontSize: 13, lineHeight: "18px" }}><Ic name="Eye" size={14} />閲覧モード。研修生の画面と同じ内容を読み取り専用で表示し、フィードバックだけ記入できます。</div>;
  const body = () => {
    if (empty) return <EmptyState icon="GraduationCap" title="研修生がいません" description="ユーザー管理で承認したユーザーを「研修中」にすると、ここに進捗が表示されます。" action={<Button variant="secondary" icon="Users" onClick={() => onNavigate && onNavigate("admin-users")}>ユーザー管理へ</Button>} />;
    switch (page) {
      case "training-learning": {
        const rows = TRAINING_ITEMS;
        return (<>
          {readonlyNote}
          <section style={flush}>
            <SectionHeading icon="BookOpen" title="学習リスト" count={`${s.items[0]}/${s.items[1]}`} style={HEAD} />
            <DataTable density="compact" style={tableFlush} rows={rows} columns={[
              { key: "title", label: "タイトル", render: (r) => <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Badge value={r.kind === "lecture" ? "info" : "neutral"} label={r.kind === "lecture" ? "講義" : "課題"} size="sm" /><span style={{ fontWeight: 500 }}>{r.title}</span></span> },
              { key: "category", label: "カテゴリ", width: 120, render: (r) => <span style={muted}>{r.category}</span> },
              { key: "read", label: "読了", width: 72, render: (r) => (r.read ? <Badge value="done" label="読了" size="sm" /> : <Badge value="neutral" label="未読" size="sm" />) },
              { key: "summary", label: "まとめ", width: 96, render: (r) => (r.summary ? <Badge value="done" label="提出済" size="sm" /> : <Badge value="todo" label="未提出" size="sm" />) },
              { key: "fb", label: "FB", width: 80, render: (r) => (r.fb ? <span style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>{r.fb.at.split(" ")[0]}</span> : <span style={{ color: "var(--muted-foreground)" }}>—</span>) },
            ]} />
          </section>
          <FbComposer toast={toast} target="学習リスト「CPN / 広告セット / 広告」" />
        </>);
      }
      case "training-values": return (<>
        {readonlyNote}
        <section style={flush}>
          <SectionHeading icon="Heart" title="バリュー振り返り ラウンド 1" style={HEAD} />
          <div style={{ borderTop: "1px solid var(--border)" }}>{TRAINING_VALUES.map((v, i) => (
            <div key={v.id} style={{ display: "grid", gridTemplateColumns: "24px 160px minmax(0,1fr) 110px", gap: 12, alignItems: "start", padding: "12px 16px", borderBottom: i < TRAINING_VALUES.length - 1 ? "1px solid var(--border)" : 0 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--muted)", color: "var(--muted-foreground)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{i + 1}</span>
              <span style={{ fontSize: 14, fontWeight: 600, lineHeight: "24px" }}>{v.name}</span>
              <span style={{ fontSize: 14, lineHeight: "20px", paddingTop: 2, color: v.note ? "var(--foreground)" : "var(--muted-foreground)" }}>{v.note || "未記入"}</span>
              <span style={{ display: "flex", justifyContent: "flex-end" }}>{v.self ? <Badge value={{ S: "done", A: "done", B: "info", C: "todo", D: "late" }[v.self]} label={`自己評価 ${v.self}`} /> : <Badge value="neutral" label="未記入" />}</span>
            </div>
          ))}</div>
        </section>
        <FbComposer toast={toast} target="バリュー「先に切り分ける」" />
      </>);
      case "training-cr": return (<>
        {readonlyNote}
        <Progress value={CR_TARGET.done} max={CR_TARGET.total} label={`${CR_TARGET.done}/${CR_TARGET.total}（${Math.round(CR_TARGET.done / CR_TARGET.total * 100)}%） · 期限 ${CR_TARGET.deadline}`} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 10 }}>
          {CR_OUTPUTS.slice(0, 6).map((c) => (
            <div key={c.id} style={{ ...card, padding: 0, gap: 0, overflow: "hidden" }}>
              <div style={{ aspectRatio: "9 / 16", background: `oklch(0.94 0.02 ${[250, 200, 160, 60, 20][c.tone]})`, display: "grid", placeItems: "center", color: "var(--muted-foreground)", fontSize: 12 }}>#{c.no}</div>
              <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.project}</span><span style={{ ...muted, fontSize: 12 }}>{c.appeal} · {c.date}</span></div>
            </div>
          ))}
        </div>
        <FbComposer toast={toast} target="CRアウトプット #40" />
      </>);
      case "training-home": return (<>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
          <KpiCard label="スケジュール" value={s.steps[0]} unit={`/ ${s.steps[1]} Step`} note={`Day ${t.day}`} />
          <KpiCard label="学習リスト" value={s.items[0]} unit={`/ ${s.items[1]}`} note="読了" />
          <KpiCard label="チェックリスト" value={s.checks[0]} unit={`/ ${s.checks[1]}`} note={`${Math.round(s.checks[0] / s.checks[1] * 100)}%`} />
          <KpiCard label="CRアウトプット" value={s.cr[0]} unit={`/ ${s.cr[1]}`} note={`期限 ${CR_TARGET.deadline}`} />
        </div>
        <section style={card}>
          <SectionHeading icon="Play" title="今の Step"><Badge value="info" label="今ここ" /></SectionHeading>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>Day {current.day} · {current.date} · 約 {current.minutes} 分</span>
              <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>{current.title}</span>
              <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>{current.note}</span>
            </div>
            <Button variant="ghost" icon="CalendarDays" onClick={() => setPage("training-schedule")}>スケジュール</Button>
          </div>
        </section>
        <section style={{ ...card, gap: 4 }}>
          <SectionHeading icon="MessageSquareText" title="送ったフィードバック" count={TRAINING_FEEDBACK.length} style={{ marginBottom: 4 }} />
          {TRAINING_FEEDBACK.map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 8px", minHeight: 44 }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: f.unread ? "var(--warning)" : "var(--positive)" }} title={f.unread ? "未読" : "既読"} />
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}><span style={{ fontSize: 14, fontWeight: 500 }}>{f.label}</span><span style={{ ...muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.text}</span></span>
              <span style={{ ...muted, fontVariantNumeric: "tabular-nums" }}>{f.at}</span>
            </div>
          ))}
        </section>
      </>);
      default: return (<>
        {readonlyNote}
        <section style={{ ...card, minHeight: 240, justifyContent: "center" }}>
          <EmptyState compact icon="Eye" title={`${groups.flatMap((g) => g.items).find((i) => i.key === page)?.label} を閲覧モードで表示`} description="研修生の画面（§3.3.1）と同じレイアウト。入力欄は読み取り専用、フィードバック欄だけ記入できます。" />
        </section>
        <FbComposer toast={toast} />
      </>);
    }
  };
  return (
    <AdminPage width={1144}>
      {/* E3: h1 は PageHeader 標準（text-xl → 標準）。表示名「研修生の進捗」は担当者確認 */}
      <PageHeader icon="BookOpenCheck" title="研修生の進捗" description={empty ? "研修中のユーザーはいません" : `${t.label} · ${t.dept} · 開始 ${t.start} · ${t.day} 日目`}>
        <Select aria-label="研修生" value={trainee} disabled={empty} options={TRAINEES.map((x) => ({ value: x.id, label: `${x.label}（${x.dept}）` }))} onChange={(e) => setTrainee(e.target.value)} width={220} />
      </PageHeader>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <SubNav aria-label="研修（閲覧）" groups={groups} activeKey={page} onSelect={setPage} style={{ position: "sticky", top: 64 }} />
        <div style={{ flex: 1, minWidth: 0, maxWidth: 896, display: "flex", flexDirection: "column", gap: 16 }}>{body()}</div>
      </div>
    </AdminPage>
  );
}

window.DVBKit = window.DVBKit || {}; Object.assign(window.DVBKit, { AdminUsersScreen, AdminAssigneesScreen, AdminGoalsScreen, AdminSystemScreen, AdminOnboardingScreen });
