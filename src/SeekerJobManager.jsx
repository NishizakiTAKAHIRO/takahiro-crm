import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://tghjsquavgavtymsyknb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGpzcXVhdmdhdnR5bXN5a25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM5MTEsImV4cCI6MjA4ODU2OTkxMX0.7y5zxa3LJam6utP5OLjEdTYTQ5RjJ6lRRQWkm1aWO5g"
);

const SEEKER_STATUS = { "登録済": "#60a5fa", "面談済": "#f59e0b", "紹介中": "#9333ea", "成約": "#22c55e", "辞退": "#ef4444", "Indeed応募": "#0ea5e9" };
const JOB_STATUS = { "下書き": "#94a3b8", "掲載中": "#22c55e", "停止": "#f59e0b", "終了": "#ef4444" };

function Badge({ label, color }) {
  return <span style={{ background: color || "#64748b", color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>;
}

function F({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>
      {children}
    </div>
  );
}

const inp = { padding: "7px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: "100%", boxSizing: "border-box" };

// ── 求職者管理 ────────────────────────────────────────────────
const SK0 = { name: "", age: "", gender: "未回答", phone: "", email: "", desired_job_type: "", desired_location: "", desired_salary: "", employment_type: "正社員", work_history: "", skills: "", self_pr: "", status: "登録済", source: "直接", notes: "" };

export function SeekerManagement() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(SK0);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("すべて");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("job_seekers").select("*").order("created_at", { ascending: false });
    if (data) setList(data);
    setLoading(false);
  }

  async function save() {
    if (!form.name) { alert("氏名は必須です"); return; }
    setSaving(true);
    const row = { ...form, age: form.age ? Number(form.age) : null, updated_at: new Date().toISOString() };
    if (form.id) {
      await sb.from("job_seekers").update(row).eq("id", form.id);
    } else {
      const { id, ...ins } = row;
      await sb.from("job_seekers").insert(ins);
    }
    setSaving(false);
    setForm(SK0);
    setShowForm(false);
    load();
  }

  async function updateStatus(id, status) {
    await sb.from("job_seekers").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setList(l => l.map(x => x.id === id ? { ...x, status } : x));
  }

  const filtered = filter === "すべて" ? list : list.filter(s => s.status === filter);

  return (
    <div>
      {/* サマリー */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {[
          { label: "総登録数", value: list.length, color: "#2563eb" },
          { label: "面談済", value: list.filter(s => s.status === "面談済").length, color: "#f59e0b" },
          { label: "紹介中", value: list.filter(s => s.status === "紹介中").length, color: "#9333ea" },
          { label: "成約", value: list.filter(s => s.status === "成約").length, color: "#22c55e" },
          { label: "Indeed応募", value: list.filter(s => s.source === "Indeed").length, color: "#0ea5e9" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${c.color}`, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* フィルター＋追加ボタン */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["すべて", ...Object.keys(SEEKER_STATUS)].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filter === s ? "#2563eb" : "#f1f5f9", color: filter === s ? "#fff" : "#475569" }}>
              {s}{s !== "すべて" && ` (${list.filter(x => x.status === s).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => { setForm(SK0); setShowForm(true); }} style={{ padding: "8px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>＋ 求職者を登録</button>
      </div>

      {/* フォーム */}
      {showForm && (
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{form.id ? "求職者情報を編集" : "求職者を新規登録"}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8" }}>✕</button>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>📋 基本情報</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
            <F label="氏名" required><input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="山田 太郎" /></F>
            <F label="年齢"><input style={inp} type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="30" /></F>
            <F label="性別">
              <select style={inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                {["男性", "女性", "未回答"].map(o => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="電話番号"><input style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="090-0000-0000" /></F>
            <F label="メールアドレス"><input style={inp} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></F>
            <F label="入口（どこから来たか）">
              <select style={inp} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                {["直接", "Indeed", "紹介", "その他"].map(o => <option key={o}>{o}</option>)}
              </select>
            </F>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>💼 希望条件</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
            <F label="希望職種"><input style={inp} value={form.desired_job_type} onChange={e => setForm(f => ({ ...f, desired_job_type: e.target.value }))} placeholder="営業、事務など" /></F>
            <F label="希望勤務地"><input style={inp} value={form.desired_location} onChange={e => setForm(f => ({ ...f, desired_location: e.target.value }))} placeholder="東京都内など" /></F>
            <F label="希望給与"><input style={inp} value={form.desired_salary} onChange={e => setForm(f => ({ ...f, desired_salary: e.target.value }))} placeholder="月30万円〜" /></F>
            <F label="希望雇用形態">
              <select style={inp} value={form.employment_type} onChange={e => setForm(f => ({ ...f, employment_type: e.target.value }))}>
                {["正社員", "派遣社員", "契約社員", "アルバイト・パート", "業務委託"].map(o => <option key={o}>{o}</option>)}
              </select>
            </F>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>📝 経歴・スキル</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <F label="職歴"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.work_history} onChange={e => setForm(f => ({ ...f, work_history: e.target.value }))} placeholder="〇〇株式会社にて営業5年..." /></F>
            <F label="スキル・資格"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="Excel, 普通自動車免許..." /></F>
            <div style={{ gridColumn: "1/-1" }}>
              <F label="自己PR"><textarea style={{ ...inp, resize: "vertical" }} rows={3} value={form.self_pr} onChange={e => setForm(f => ({ ...f, self_pr: e.target.value }))} placeholder="自己PR文..." /></F>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>⚙️ 管理情報</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
            <F label="ステータス">
              <select style={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.keys(SEEKER_STATUS).map(o => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="備考"><input style={inp} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="備考メモ" /></F>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "8px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>キャンセル</button>
            <button onClick={save} disabled={saving} style={{ padding: "8px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "保存中..." : form.id ? "更新" : "登録"}
            </button>
          </div>
        </div>
      )}

      {/* $��覧 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 12 }}>
          {filter === "すべて" ? "求職者がまだ登録されていません" : `「${filter}」の求職者はいません`}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: (SEEKER_STATUS[s.status] || "#64748b") + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {s.gender === "女性" ? "👩" : "👨"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>
                      {s.age && `${s.age}歳`}{s.desired_job_type && ` / ${s.desired_job_type}`}{s.desired_location && ` / ${s.desired_location}`}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge label={s.status} color={SEEKER_STATUS[s.status]} />
                  {s.source === "Indeed" && <Badge label="Indeed" color="#0ea5e9" />}
                  <select value={s.status} onChange={e => updateStatus(s.id, e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, cursor: "pointer" }}>
                    {Object.keys(SEEKER_STATUS).map(st => <option key={st}>{st}</option>)}
                  </select>
                  <button onClick={() => { setForm({ ...s, age: s.age || "" }); setShowForm(true); }} style={{ padding: "5px 12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>編集</button>
                </div>
              </div>
              x(s.skills || s.employment_type || s.desired_salary) && (
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {s.employment_type && <span style={{ background: "#f1f5f9", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#64748b" }}>🏢 {s.employment_type}</span>}
                  {s.desired_salary && <span style={{ background: "#f1f5f9", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#64748b" }}>💴 {s.desired_salary}</span>}
                  {s.skills && <span style={{ background: "#f1f5f9", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#64748b" }}>🔧 {s.skills.slice(0, 50)}{s.skills.length > 50 ? "..." : ""}</span>}
                </div>
              )}
              {s.notes && <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>📝 {s.notes}</div>}
              <div style={{ marginTop: 6, fontSize: 11, color: "#cbd5e1" }}>登録日: {new Date(s.created_at).toLocaleDateString("ja-JP")}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 求人案件管理 ──────────────────────────────────────────────
const JB0 = { company_name: "", job_title: "", location: "", salary_min: "", salary_max: "", employment_type: "正社員", work_hours: "", job_description: "", required_skills: "", benefits: "", status: "下書き", indeed_posted: false, indeed_url: "", applicant_count: 0, assigned_to: "" };

export function JobPostingManagement() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(JB0);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("すべて");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("job_postings").select("*").order("created_at", { ascending: false });
    if (data) setList(data);
    setLoading(false);
  }

  async function save() {
    if (!form.company_name || !form.job_title) { alert("会社名と職種は必須です"); return; }
    setSaving(true);
    const row = { ...form, salary_min: form.salary_min ? Number(form.salary_min) : null, salary_max: form.salary_max ? Number(form.salary_max) : null, applicant_count: Number(form.applicant_count) || 0, updated_at: new Date().toISOString() };
    if (form.id) {
      await sb.from("job_postings").update(row).eq("id", form.id);
    } else {
      const { id, ...ins } = row;
      await sb.from("job_postings").insert(ins);
    }
    setSaving(false);
    setForm(JB0);
    setShowForm(false);
    load();
  }

  async function updateStatus(id, status) {
    await sb.from("job_postings").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setList(l => l.map(x => x.id === id ? { ...x, status } : x));
  }

  const filtered = filter === "すべて" ? list : list.filter(j => j.status === filter);

  return (
    <div>
      {/* サマリー */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {[
          { label: "総案件数", value: list.length, color: "#2563eb" },
          { label: "掲載中", value: list.filter(j => j.status === "掲載中").length, color: "#22c55e" },
          { label: "Indeed掲載済", value: list.filter(j => j.indeed_posted).length, color: "#0ea5e9" },
          { label: "総応募数", value: list.reduce((s, j) => s + (j.applicant_count || 0), 0), color: "#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${c.color}`, flex: 1, minWidth: 110 }}>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Indeed フィード案内 */}
      <div style={{ background: "#eff6ff", borderRadius: 10, padding: "12px 16px", marginBottom: 16, border: "1px solid #bfdbfe", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 20 }}>📡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8" }}>Indeed XMLフィード（掲載中の案件を自動配信）</div>
          <div style={{ fontSize: 11, color: "#3b82f6", wordBreak: "break-all" }}>https://takahiro-crm.vercel.app/api/jobs-feed</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Indeedの「求人フィード」設定でこのURLを登録してください</div>
        </div>
        <button onClick={() => { try { navigator.clipboard.writeText("https://takahiro-crm.vercel.app/api/jobs-feed"); } catch(e) {} }} style={{ padding: "5px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>コピー</button>
      </div>

      {/* フィルター＋追加ボタン */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["すべて", ...Object.keys(JOB_STATUS)].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filter === s ? "#2563eb" : "#f1f5f9", color: filter === s ? "#fff" : "#475569" }}>
              {s}{s !== "すべて" && ` (${list.filter(j => j.status === s).length})`}
            </button>
          ))}
        </div>
        <button onClick={() => { setForm(JB0); setShowForm(true); }} style={{ padding: "8px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>＋ 案件を登録</button>
      </div>

      {/* フォーム */}
      {showForm && (
        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 20, marginBottom: 20, border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{form.id ? "案件を編集" : "求人案件を新規登録"}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8" }}>✕</button>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>📋 基本情報</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
            <F label="会社名" required><input style={inp} value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="株式会社〇〇" /></F>
            <F label="職種・ポジション" required><input style={inp} value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))} placeholder="営業職、エンジニアなど" /></F>
            <F label="勤務地"><input style={inp} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="東京都渋谷区" /></F>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>💴 条件</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
            <F label="給与（下限）円"><input style={inp} type="number" value={form.salary_min} onChange={e => setForm(f => ({ ...f, salary_min: e.target.value }))} placeholder="250000" /></F>
            <F label="給与（上限）円"><input style={inp} type="number" value={form.salary_max} onChange={e => setForm(f => ({ ...f, salary_max: e.target.value }))} placeholder="400000" /></F>
            <F label="雇用形態">
              <select style={inp} value={form.employment_type} onChange={e => setForm(f => ({ ...f, employment_type: e.target.value }))}>
                {["正社員", "派遣社員", "契約社員", "アルバイト・パート", "業務委託"].map(o => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="勤務時間"><input style={inp} value={form.work_hours} onChange={e => setForm(f => ({ ...f, work_hours: e.target.value }))} placeholder="9:00〜18:00（土日休み）" /></F>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>📝 詳細</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <F label="仕事内容"><textarea style={{ ...inp, resize: "vertical" }} rows={4} value={form.job_description} onChange={e => setForm(f => ({ ...f, job_description: e.target.value }))} placeholder="業務内容の詳細..." /></F>
            <F label="求める人材"><textarea style={{ ...inp, resize: "vertical" }} rows={4} value={form.required_skills} onChange={e => setForm(f => ({ ...f, required_skills: e.target.value }))} placeholder="必要なスキル・経験..." /></F>
            <div style={{ gridColumn: "1/-1" }}>
              <F label="福利厚生"><textarea style={{ ...inp, resize: "vertical" }} rows={2} value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} placeholder="社会保険完備、交通費支給..." /></F>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: 8, marginBottom: 12 }}>⚙️ 管理情報</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            <F label="掲載状態">
              <select style={inp} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {Object.keys(JOB_STATUS).map(o => <option key={o}>{o}</option>)}
              </select>
            </F>
            <F label="担当者"><input style={inp} value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))} placeholder="担当者名" /></F>
            <F label="応募数"><input style={inp} type="number" value={form.applicant_count} onChange={e => setForm(f => ({ ...f, applicant_count: e.target.value }))} placeholder="0" /></F>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569" }}>
                <input type="checkbox" checked={form.indeed_posted} onChange={e => setForm(f => ({ ...f, indeed_posted: e.target.checked }))} style={{ width: 16, height: 16 }} />
                Indeed掲載済み
              </label>
            </div>
            {form.indeed_posted && (
              <div style={{ gridColumn: "1/-1" }}>
                <F label="Indeed URL"><input style={inp} value={form.indeed_url} onChange={e => setForm(f => ({ ...f, indeed_url: e.target.value }))} placeholder="https://jp.indeed.com/..." /></F>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setShowForm(false)} style={{ padding: "8px 20px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>キャンセル</button>
            <button onClick={save} disabled={saving} style={{ padding: "8px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "保存中..." : form.id ? "更新" : "登録"}
            </button>
          </div>
        </div>
      )}

      {/* 一覧 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 12 }}>
          {filter === "すべて" ? "求人案件がまだ登録されていません" : `「${filter}」の案件はありません`}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(j => (
            <div key={j.id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", border: `1px solid ${j.status === "掲載中" ? "#bbf7d0" : "#e2e8f0"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>{j.job_title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>🏢 {j.company_name}{j.location && ` / 📍 ${j.location}`}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                    {j.salary_min && `💴 月給 ${j.salary_min.toLocaleString()}円〜${j.salary_max ? j.salary_max.toLocaleString() + "円" : ""}`}
                    {j.employment_type && ` / ${j.employment_type}`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Badge label={j.status} color={JOB_STATUS[j.status]} />
                  {j.indeed_posted && <Badge label="Indeed掲載中" color="#0ea5e9" />}
                  {j.applicant_count > 0 && <Badge label={`応募 ${j.applicant_count}件`} color="#f59e0b" />}
                  <select value={j.status} onChange={e => updateStatus(j.id, e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, cursor: "pointer" }}>
                    {Object.keys(JOB_STATUS).map(st => <option key={st}>{st}</option>)}
                  </select>
                  <button onClick={() => { setForm({ ...j, salary_min: j.salary_min || "", salary_max: j.salary_max || "" }); setShowForm(true); }} style={{ padding: "5px 12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>編集</button>
                  {j.indeed_url && <a href={j.indeed_url} target="_blank" rel="noreferrer" style={{ padding: "5px 12px", background: "#0ea5e9", color: "#fff", borderRadius: 6, fontSize: 12, textDecoration: "none", fontWeight: 600 }}>Indeed ↗</a>}
                </div>
              </div>
              {j.job_description && (
                <div style={{ marginTop: 10, fontSize: 12, color: "#64748b", background: "#f8fafc", borderRadius: 6, padding: "8px 10px" }}>
                  {j.job_description.slice(0, 120)}{j.job_description.length > 120 ? "..." : ""}
                </div>
              )}
              <div style={{ marginTop: 6, display: "flex", gap: 12, fontSize: 11, color: "#cbd5e1", flexWrap: "wrap" }}>
                {j.assigned_to && <span>担当: {j.assigned_to}</span>}
                <span>登録日: {new Date(j.created_at).toLocaleDateString("ja-JP")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
