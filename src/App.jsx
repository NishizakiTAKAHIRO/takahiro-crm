import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ── Initial Data ─────────────────────────────────────────────
const INIT = {
  kimero: {
    contacts: [
      { id: 1, company: "株式会社サンプルA", person: "田中部長", type: "人材派遣", status: "商談中", date: "2026-03-06", note: "3名派遣希望" },
      { id: 2, company: "合同会社サンプルB", person: "鈴木社長", type: "職業紹介", status: "提案済", date: "2026-03-07", note: "営業職1名紹介希望" },
      { id: 3, company: "株式会社サンプルC", person: "佐藤課長", type: "業務委託", status: "初回コンタクト", date: "2026-03-08", note: "システム開発案件" },
    ],
    seekers: [
      { id: 1, name: "山田一郎", skill: "営業・販売", status: "活動中", desired: "正社員", note: "経験5年" },
      { id: 2, name: "伊藤花子", skill: "事務・管理", status: "マッチング中", desired: "派遣", note: "PC操作得意" },
    ],
    monthlyRevenue: [
      { month: "3月", target: 300000, actual: 0 },
      { month: "4月", target: 600000, actual: 0 },
      { month: "5月", target: 1000000, actual: 0 },
      { month: "6月", target: 1500000, actual: 0 },
    ],
  },
  smile: {
    sales: [
      { id: 1, date: "2026-03-06", staff: "長沼、角田", shoku: 46, cash: 11050, paypay: 36100 },
      { id: 2, date: "2026-03-07", staff: "長沼", shoku: 38, cash: 9500, paypay: 28000 },
      { id: 3, date: "2026-03-08", staff: "角田", shoku: 41, cash: 10200, paypay: 31000 },
    ],
    clients: [
      { id: 1, name: "候補：近隣A社", type: "企業弁当", status: "未アプローチ", meals: 50, note: "" },
      { id: 2, name: "候補：B福祉施設", type: "施設向け", status: "未アプローチ", meals: 80, note: "" },
    ],
  },
  huppy: {
    revenue: [
      { month: "1月", total: 980000, personal: 210000 },
      { month: "2月", total: 1050000, personal: 230000 },
      { month: "3月", total: 1100000, personal: 240000 },
    ],
    partners: [
      { id: 1, name: "パートナーA", type: "タイアップ", status: "交渉中", value: "30万円", note: "" },
      { id: 2, name: "ブランドB", type: "スポンサー", status: "打診済", value: "50万円", note: "" },
    ],
  },
  tasks: [
    { id: 1, text: "【キメロ】新規コンタクト3件", biz: "キメロ", done: false },
    { id: 2, text: "【スマイル】法人提案1件", biz: "スマイル", done: false },
    { id: 3, text: "【フーピー】SNS投稿", biz: "フーピー", done: false },
    { id: 4, text: "夜の振り返り（5分）", biz: "個人", done: false },
  ],
};

const STATUS_COLOR = {
  "初回コンタクト": "#94a3b8", "提案済": "#60a5fa", "商談中": "#f59e0b",
  "契約済": "#22c55e", "失注": "#ef4444",
  "活動中": "#60a5fa", "マッチング中": "#f59e0b", "成約済": "#22c55e",
  "未アプローチ": "#94a3b8", "交渉中": "#f59e0b", "打診済": "#60a5fa",
};
const BIZ_COLOR = { キメロ: "#2563eb", スマイル: "#16a34a", フーピー: "#9333ea", 個人: "#f59e0b" };

function Badge({ label, color }) {
  return (
    <span style={{ background: color || "#64748b", color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function Card({ title, value, sub, color = "#2563eb", icon }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${color}`, flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: 0.5 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1.2, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, color = "#2563eb", children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 22, background: color, borderRadius: 2 }} />
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #e2e8f0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>{headers.map((h, i) => (
            <th key={i} style={{ background: "#f1f5f9", padding: "8px 12px", textAlign: "left", color: "#475569", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap" }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i} style={{ borderTop: "1px solid #e2e8f0", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "8px 12px", color: "#1e293b" }}>{cell}</td>
            ))}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ── TABS ────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "📊 ダッシュボード" },
  { id: "kimero", label: "👔 キメロコスメ" },
  { id: "smile", label: "🍱 スマイル&ナリッシュ" },
  { id: "huppy", label: "🎵 フーピー" },
  { id: "tasks", label: "🔥 TODAY" },
];

// ── DASHBOARD ──────────────────────────────────────────────
function Dashboard({ data }) {
  const smileMonthly = data.smile.sales.reduce((s, d) => s + d.cash + d.paypay, 0);
  const huppyCurrent = data.huppy.revenue[data.huppy.revenue.length - 1];
  const kimeroDeals = data.kimero.contacts.filter(c => c.status === "商談中").length;
  const taskDone = data.tasks.filter(t => t.done).length;
  const taskTotal = data.tasks.length;

  const bizData = [
    { name: "フーピー", 売上: huppyCurrent.total, 個人報酬: huppyCurrent.personal },
    { name: "スマイル", 売上: smileMonthly, 個人報酬: 0 },
    { name: "キメロ", 売上: 0, 個人報酬: 0 },
  ];

  const goalData = [
    { name: "フーピー", 現在: huppyCurrent.personal, 目標: 500000 },
    { name: "キメロ", 現在: 0, 目標: 400000 },
    { name: "スマイル", 現在: 0, 目標: 150000 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>全社ダッシュボード</h2>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>月収100万円達成ロードマップ</p>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <Card title="個人報酬合計（今月）" value={`${((huppyCurrent.personal)/10000).toFixed(0)}万円`} sub="目標：100万円" color="#2563eb" icon="💰" />
        <Card title="フーピー売上" value={`${(huppyCurrent.total/10000).toFixed(0)}万円`} sub={`個人報酬 ${(huppyCurrent.personal/10000).toFixed(0)}万円`} color="#9333ea" icon="🎵" />
        <Card title="キメロ 商談中" value={`${kimeroDeals}件`} sub="成約目標：月3件" color="#f59e0b" icon="👔" />
        <Card title="スマイル今月売上" value={`${(smileMonthly/10000).toFixed(1)}万円`} sub={`${data.smile.sales.reduce((s,d)=>s+d.shoku,0)}食 / ${data.smile.sales.length}日`} color="#16a34a" icon="🍱" />
        <Card title="今日のTASK達成" value={`${taskDone}/${taskTotal}`} sub={`${Math.round(taskDone/taskTotal*100)}%`} color="#ef4444" icon="🔥" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>事業別売上（今月）</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bizData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/10000).toFixed(0)}万`} />
              <Tooltip formatter={v => `¥${v.toLocaleString()}`} />
              <Bar dataKey="売上" fill="#2563eb" radius={[4,4,0,0]} />
              <Bar dataKey="個人報酬" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>目標達成率</h4>
          {goalData.map(g => {
            const pct = Math.min(100, Math.round(g.現在 / g.目標 * 100));
            return (
              <div key={g.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{g.name}</span>
                  <span style={{ color: "#64748b" }}>¥{g.現在.toLocaleString()} / ¥{g.目標.toLocaleString()}</span>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: BIZ_COLOR[g.name === "フーピー" ? "フーピー" : g.name === "キメロ" ? "キメロ" : "スマイル"] || "#2563eb", borderRadius: 6, transition: "width 0.5s" }} />
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>フーピー 月次推移</h4>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data.huppy.revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/10000).toFixed(0)}万`} />
            <Tooltip formatter={v => `¥${v.toLocaleString()}`} />
            <Line type="monotone" dataKey="total" stroke="#9333ea" strokeWidth={2} dot={{ r: 4 }} name="売上" />
            <Line type="monotone" dataKey="personal" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="個人報酬" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── KIMERO ─────────────────────────────────────────────────
function Kimero({ data, setData }) {
  const [tab, setTab] = useState("contacts");
  const [form, setForm] = useState({ company: "", person: "", type: "人材派遣", status: "初回コンタクト", date: new Date().toISOString().split("T")[0], note: "" });

  function addContact() {
    if (!form.company) return;
    const newC = { ...form, id: Date.now() };
    setData(d => ({ ...d, kimero: { ...d.kimero, contacts: [...d.kimero.contacts, newC] } }));
    setForm({ company: "", person: "", type: "人材派遣", status: "初回コンタクト", date: new Date().toISOString().split("T")[0], note: "" });
  }

  const statusCount = ["初回コンタクト","提案済","商談中","契約済"].map(s => ({
    status: s, count: data.kimero.contacts.filter(c => c.status === s).length
  }));

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {statusCount.map(s => (
          <Card key={s.status} title={s.status} value={`${s.count}件`} color={STATUS_COLOR[s.status] || "#64748b"} icon="" />
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["contacts", "seekers", "revenue"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: tab === t ? "#2563eb" : "#f1f5f9", color: tab === t ? "#fff" : "#475569" }}>
            {t === "contacts" ? "🏢 企業コンタクト" : t === "seekers" ? "👤 求職者" : "📈 売上推移"}
          </button>
        ))}
      </div>

      {tab === "contacts" && (
        <Section title="企業コンタクト管理" color="#2563eb">
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
            <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>会社名 *</div><input value={form.company} onChange={e => setForm(f=>({...f,company:e.target.value}))} placeholder="株式会社〇〇" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 160 }} /></div>
            <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>担当者名</div><input value={form.person} onChange={e => setForm(f=>({...f,person:e.target.value}))} placeholder="田中部長" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 120 }} /></div>
            <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>種別</div>
              <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 }}>
                {["人材派遣","職業紹介","業務委託"].map(t => <option key={t}>{t}</option>)}
              </select></div>
            <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>ステータス</div>
              <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 }}>
                {["初回コンタクト","提案済","商談中","契約済","失注"].map(s => <option key={s}>{s}</option>)}
              </select></div>
            <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>日付</div><input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 }} /></div>
            <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>メモ</div><input value={form.note} onChange={e => setForm(f=>({...f,note:e.target.value}))} placeholder="備考" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 140 }} /></div>
            <button onClick={addContact} style={{ padding: "7px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>追加</button>
          </div>
          <Table
            headers={["会社名", "担当者", "種別", "ステータス", "日付", "メモ"]}
            rows={data.kimero.contacts.map(c => [
              <span style={{ fontWeight: 600 }}>{c.company}</span>,
              c.person,
              <Badge label={c.type} color="#2563eb" />,
              <Badge label={c.status} color={STATUS_COLOR[c.status]} />,
              c.date,
              c.note,
            ])}
          />
        </Section>
      )}

      {tab === "seekers" && (
        <Section title="求職者データベース" color="#2563eb">
          <Table
            headers={["氏名", "スキル・経験", "ステータス", "希望雇用形態", "メモ"]}
            rows={data.kimero.seekers.map(s => [
              <span style={{ fontWeight: 600 }}>{s.name}</span>,
              s.skill,
              <Badge label={s.status} color={STATUS_COLOR[s.status]} />,
              s.desired,
              s.note,
            ])}
          />
        </Section>
      )}

      {tab === "revenue" && (
        <Section title="売上目標 vs 実績" color="#2563eb">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.kimero.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={v => `${(v/10000).toFixed(0)}万`} />
              <Tooltip formatter={v => `¥${v.toLocaleString()}`} />
              <Bar dataKey="target" fill="#dbeafe" radius={[4,4,0,0]} name="目標" />
              <Bar dataKey="actual" fill="#2563eb" radius={[4,4,0,0]} name="実績" />
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}
    </div>
  );
}

// ── SMILE ──────────────────────────────────────────────────
function Smile({ data, setData }) {
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], staff: "", shoku: "", cash: "", paypay: "" });

  function addSale() {
    if (!form.staff) return;
    const s = { ...form, id: Date.now(), shoku: Number(form.shoku)||0, cash: Number(form.cash)||0, paypay: Number(form.paypay)||0 };
    setData(d => ({ ...d, smile: { ...d.smile, sales: [...d.smile.sales, s] } }));
    setForm({ date: new Date().toISOString().split("T")[0], staff: "", shoku: "", cash: "", paypay: "" });
  }

  const totalCash = data.smile.sales.reduce((s,d) => s+d.cash, 0);
  const totalPP = data.smile.sales.reduce((s,d) => s+d.paypay, 0);
  const totalShoku = data.smile.sales.reduce((s,d) => s+d.shoku, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <Card title="今月合計売上" value={`¥${(totalCash+totalPP).toLocaleString()}`} color="#16a34a" icon="💴" />
        <Card title="現金合計" value={`¥${totalCash.toLocaleString()}`} color="#16a34a" icon="💵" />
        <Card title="PayPay合計" value={`¥${totalPP.toLocaleString()}`} color="#0ea5e9" icon="📱" />
        <Card title="合計食数" value={`${totalShoku}食`} color="#f59e0b" icon="🍱" />
        <Card title="法人クライアント" value={`${data.smile.clients.filter(c=>c.status==="契約済").length}社`} sub="目標：5社" color="#9333ea" icon="🏢" />
      </div>

      <Section title="売上報告入力（LINEから転記）" color="#16a34a">
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>日付</div><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>スタッフ *</div><input value={form.staff} onChange={e=>setForm(f=>({...f,staff:e.target.value}))} placeholder="長沼、角田" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 130 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>食数</div><input type="number" value={form.shoku} onChange={e=>setForm(f=>({...f,shoku:e.target.value}))} placeholder="46" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 70 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>現金</div><input type="number" value={form.cash} onChange={e=>setForm(f=>({...f,cash:e.target.value}))} placeholder="11050" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 90 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>PayPay</div><input type="number" value={form.paypay} onChange={e=>setForm(f=>({...f,paypay:e.target.value}))} placeholder="36100" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 90 }} /></div>
          <button onClick={addSale} style={{ padding: "7px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>追加</button>
        </div>
        <Table
          headers={["日付", "スタッフ", "食数", "現金", "PayPay", "合計"]}
          rows={data.smile.sales.map(s => [
            s.date, s.staff,
            `${s.shoku}食`,
            `¥${s.cash.toLocaleString()}`,
            `¥${s.paypay.toLocaleString()}`,
            <span style={{ fontWeight: 700, color: "#16a34a" }}>¥{(s.cash+s.paypay).toLocaleString()}</span>,
          ])}
        />
      </Section>
    </div>
  );
}

// ── HUPPY ──────────────────────────────────────────────────
function Huppy({ data }) {
  const latest = data.huppy.revenue[data.huppy.revenue.length - 1];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <Card title="今月売上" value={`¥${(latest.total/10000).toFixed(0)}万`} color="#9333ea" icon="🎵" />
        <Card title="個人報酬" value={`¥${(latest.personal/10000).toFixed(0)}万`} sub="目標：40〜50万円" color="#9333ea" icon="💰" />
        <Card title="報酬率" value={`${Math.round(latest.personal/latest.total*100)}%`} sub="目標：40%+" color="#f59e0b" icon="📊" />
        <Card title="パートナー交渉中" value={`${data.huppy.partners.filter(p=>p.status==="交渉中").length}件`} color="#9333ea" icon="🤝" />
      </div>

      <Section title="月次推移" color="#9333ea">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.huppy.revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={v => `${(v/10000).toFixed(0)}万`} />
            <Tooltip formatter={v => `¥${v.toLocaleString()}`} />
            <Bar dataKey="total" fill="#e9d5ff" radius={[4,4,0,0]} name="売上" />
            <Bar dataKey="personal" fill="#9333ea" radius={[4,4,0,0]} name="個人報酬" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section title="パートナー・案件管理" color="#9333ea">
        <Table
          headers={["パートナー名", "種別", "ステータス", "想定金額", "メモ"]}
          rows={data.huppy.partners.map(p => [
            <span style={{ fontWeight: 600 }}>{p.name}</span>,
            p.type,
            <Badge label={p.status} color={STATUS_COLOR[p.status]} />,
            p.value,
            p.note,
          ])}
        />
      </Section>
    </div>
  );
}

// ── TODAY TASKS ─────────────────────────────────────────────
function Today({ data, setData }) {
  function toggle(id) {
    setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  }
  const done = data.tasks.filter(t=>t.done).length;
  const pct = Math.round(done/data.tasks.length*100);

  return (
    <div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>🔥 今日のTASK</h3>
          <span style={{ fontSize: 24, fontWeight: 800, color: pct === 100 ? "#22c55e" : "#2563eb" }}>{pct}%</span>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 8, height: 12, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct===100 ? "#22c55e" : "#2563eb", borderRadius: 8, transition: "width 0.4s" }} />
        </div>
        {data.tasks.map(t => (
          <div key={t.id} onClick={() => toggle(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer", background: t.done ? "#f0fdf4" : "#f8fafc", border: `1px solid ${t.done ? "#bbf7d0" : "#e2e8f0"}` }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${t.done ? "#22c55e" : "#cbd5e1"}`, background: t.done ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {t.done && <span style={{ color: "white", fontSize: 13, fontWeight: 800 }}>✓</span>}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.done ? "#86efac" : "#1e293b", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            <Badge label={t.biz} color={BIZ_COLOR[t.biz]} />
          </div>
        ))}
        {pct === 100 && (
          <div style={{ textAlign: "center", padding: 16, color: "#22c55e", fontWeight: 800, fontSize: 16 }}>🎉 今日のタスク全完了！お疲れ様でした！</div>
        )}
      </div>
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(INIT);

  const tabContent = {
    dashboard: <Dashboard data={data} />,
    kimero: <Kimero data={data} setData={setData} />,
    smile: <Smile data={data} setData={setData} />,
    huppy: <Huppy data={data} />,
    tasks: <Today data={data} setData={setData} />,
  };

  return (
    <div style={{ fontFamily: "'Hiragino Sans', 'Yu Gothic', Arial, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#1e3a5f", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>たかひろ CRM</div>
          <div style={{ color: "#93c5fd", fontSize: 11, marginTop: 1 }}>月収100万円達成ダッシュボード</div>
        </div>
        <div style={{ marginLeft: "auto", color: "#93c5fd", fontSize: 12 }}>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</div>
      </div>

      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: tab === t.id ? "#2563eb" : "#64748b", borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent", whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {tabContent[tab]}
      </div>
    </div>
  );
}
