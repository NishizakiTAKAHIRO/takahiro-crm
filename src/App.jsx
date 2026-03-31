import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { SeekerManagement, JobPostingManagement } from "./SeekerJobManager";

// ── Supabase ──────────────────────────────────────────────────
const SUPABASE_URL = "https://tghjsquavgavtymsyknb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGpzcXVhdmdhdnR5bXN5a25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM5MTEsImV4cCI6MjA4ODU2OTkxMX0.7y5zxa3LJam6utP5OLjEdTYTQ5RjJ6lRRQWkm1aWO5g";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Initial Data ─────────────────────────────────────────────
const INIT = {
  kimero: {
    contacts: [
      { id: 1, company: "株式会社サンプルA", person: "田中部長", contact: "03-1234-5678", type: "人材派遣", prefecture: "東京都", city: "渋谷区", status: "商談中", jobStatus: "求人あり", date: "2026-03-06", nextAction: "2026-03-15", note: "3名派遣希望" },
      { id: 2, company: "合同会社サンプルB", person: "鈴木社長", contact: "", type: "職業紹介", prefecture: "大阪府", city: "大阪市北区", status: "提案済", jobStatus: "確認中", date: "2026-03-07", nextAction: "", note: "営業職1名紹介希望" },
      { id: 3, company: "株式会社サンプルC", person: "佐藤課長", contact: "090-0000-1111", type: "業務委託", prefecture: "東京都", city: "新宿区", status: "初回コンタクト", jobStatus: "確認中", date: "2026-03-08", nextAction: "", note: "システム開発案件" },
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
    kpi: [
      { id: 1, name: "新規クライアント開拓", target: 20, actual: 3, unit: "件", period: "月次", category: "RA営業", icon: "🏢" },
      { id: 2, name: "求人案件獲得数", target: 10, actual: 1, unit: "件", period: "月次", category: "RA営業", icon: "📋" },
      { id: 3, name: "提案・送客数", target: 15, actual: 2, unit: "件", period: "月次", category: "RA営業", icon: "📤" },
      { id: 4, name: "求職者登録数", target: 10, actual: 2, unit: "人", period: "月次", category: "CA", icon: "👤" },
      { id: 5, name: "求職者面談数", target: 15, actual: 0, unit: "件", period: "月次", category: "CA", icon: "🤝" },
      { id: 6, name: "マッチング成立数", target: 5, actual: 0, unit: "件", period: "月次", category: "成果", icon: "✅" },
      { id: 7, name: "成約・内定数", target: 3, actual: 0, unit: "件", period: "月次", category: "成果", icon: "🎯" },
      { id: 8, name: "月次売上", target: 300000, actual: 0, unit: "円", period: "月次", category: "売上", icon: "💰" },
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
const CAT_COLOR = { "RA営業": "#2563eb", "CA": "#9333ea", "成果": "#22c55e", "売上": "#f59e0b" };
const JOB_STATUS_COLOR = { "求人あり": "#16a34a", "求人なし": "#94a3b8", "確認中": "#f59e0b" };
const PREFECTURES = ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県","茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県","新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
function extractPrefecture(addr) {
  if (!addr) return "";
  for (const p of PREFECTURES) { if (addr.startsWith(p)) return p; }
  return "";
}
function extractCity(addr, pref) {
  if (!addr || !pref) return "";
  const rest = addr.slice(pref.length);
  const m = rest.match(/^([^\d０-９a-zA-Ａ-Ｚ]+(?:市|区|町|村))/);
  return m ? m[1] : rest.split(/[\d０-９]/)[0] || "";
}

function Badge({ label, color }) {
  return (
    <span style={{ background: `${color || "#6366f1"}22`, color: color || "#6366f1", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", border: `1px solid ${color || "#6366f1"}44`, backdropFilter: "blur(4px)" }}>
      {label}
    </span>
  );
}

function Card({ title, value, sub, color = "#6366f1", icon }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "20px 22px", boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.8)", flex: 1, minWidth: 140, transition: "transform 0.2s, box-shadow 0.2s" }}>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 800, background: `linear-gradient(135deg, ${color}, ${color}cc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.2, marginTop: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, color = "#6366f1", children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 6, height: 24, background: `linear-gradient(180deg, ${color}, ${color}88)`, borderRadius: 3 }} />
        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#1e293b", letterSpacing: -0.3 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: 14, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>{headers.map((h, i) => (
            <th key={i} style={{ background: "rgba(241,245,249,0.8)", padding: "10px 14px", textAlign: "left", color: "#475569", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", borderBottom: "2px solid #e2e8f0" }}>{h}</th>
          ))}</tr>
        </thead>
        <tbody>{rows.map((row, i) => (
          <tr key={i} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "transparent" : "rgba(248,250,252,0.5)", transition: "background 0.15s" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "10px 14px", color: "#1e293b" }}>{cell}</td>
            ))}
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ── SHARE VIEW（今藤さん専用・読み取り専用） ────────────────────
function ShareView() {
  const [snap, setSnap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [realContacts, setRealContacts] = useState([]);

  async function fetchData() {
    const { data, error } = await supabase
      .from("app_snapshot")
      .select("data, updated_at")
      .eq("id", 1)
      .single();
    if (data) {
      setSnap(data.data);
      setLastUpdated(new Date(data.updated_at));
    }
    setLoading(false);
  }

  async function fetchContacts() {
    const { data: rows } = await supabase
      .from("contacts")
      .select("company_name, person, contact_info, type, status, contact_date")
      .order("contact_date", { ascending: false })
      .limit(1000);
    if (rows) setRealContacts(rows);
  }

  useEffect(() => {
    fetchData();
    fetchContacts();
    const timer = setInterval(() => { fetchData(); fetchContacts(); }, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Hiragino Sans', Arial, sans-serif", color: "#64748b" }}>
        読み込み中...
      </div>
    );
  }

  if (!snap || !snap.kimero?.kpi || snap.kimero.kpi.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Hiragino Sans', Arial, sans-serif", color: "#64748b", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 40 }}>📊</div>
        <div>データ準備中です。しばらくお待ちください。</div>
      </div>
    );
  }

  const kpi = snap.kimero.kpi;
  const contacts = snap.kimero.contacts || [];
  const seekers = snap.kimero.seekers || [];
  const categories = [...new Set(kpi.map(k => k.category))];

  const overallPct = Math.round(
    kpi.reduce((s, k) => s + Math.min(100, k.target > 0 ? (k.actual / k.target) * 100 : 0), 0) / kpi.length
  );

  return (
    <div style={{ fontFamily: "'Inter', 'Hiragino Sans', 'Yu Gothic', -apple-system, sans-serif", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 40%, #fff5f5 70%, #f0fdf4 100%)", minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');`}</style>
      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", padding: "18px 24px", borderBottom: "1px solid rgba(226,232,240,0.6)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>👔 キメロコスメ 進捗ダッシュボード</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4, display: "flex", gap: 16, flexWrap: "wrap", fontWeight: 500 }}>
            <span>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</span>
            {lastUpdated && <span>最終更新: {lastUpdated.toLocaleString("ja-JP")}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {/* 全体達成率 */}
        <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.8)", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>今月の総合達成率</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: overallPct >= 80 ? "#22c55e" : overallPct >= 50 ? "#f59e0b" : "#ef4444", lineHeight: 1 }}>
            {overallPct}%
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 10, height: 14, margin: "16px 0 8px", overflow: "hidden" }}>
            <div style={{ width: `${overallPct}%`, height: "100%", background: overallPct >= 80 ? "#22c55e" : overallPct >= 50 ? "#f59e0b" : "#ef4444", borderRadius: 10, transition: "width 0.6s" }} />
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{kpi.length}項目のKPIを追跡中</div>
        </div>

        {/* カテゴリ別サマリー */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {categories.map(cat => {
            const items = kpi.filter(k => k.category === cat);
            const avgPct = Math.round(items.reduce((s, k) => s + Math.min(100, k.target > 0 ? (k.actual / k.target) * 100 : 0), 0) / items.length);
            return (
              <div key={cat} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${CAT_COLOR[cat] || "#64748b"}`, flex: 1, minWidth: 130 }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{cat}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: CAT_COLOR[cat] || "#64748b", lineHeight: 1.2, margin: "4px 0" }}>{avgPct}%</div>
                <div style={{ background: "#f1f5f9", borderRadius: 6, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${avgPct}%`, height: "100%", background: CAT_COLOR[cat] || "#64748b", borderRadius: 6 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* KPI詳細 */}
        {categories.map(cat => (
          <Section key={cat} title={`${cat} KPI`} color={CAT_COLOR[cat] || "#2563eb"}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {kpi.filter(k => k.category === cat).map(k => {
                const pct = k.target > 0 ? Math.min(100, Math.round((k.actual / k.target) * 100)) : 0;
                const color = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
                const isMoney = k.unit === "円";
                return (
                  <div key={k.id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", border: `1px solid ${pct >= 100 ? "#bbf7d0" : "#e2e8f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>{k.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", flex: 1 }}>{k.name}</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color }}>{pct}%</span>
                    </div>
                    <div style={{ background: "#f1f5f9", borderRadius: 6, height: 8, marginBottom: 10, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.4s" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ color: "#64748b" }}>実績: <strong style={{ color }}>{isMoney ? `¥${k.actual.toLocaleString()}` : `${k.actual}${k.unit}`}</strong></span>
                      <span style={{ color: "#94a3b8" }}>目標: {isMoney ? `¥${k.target.toLocaleString()}` : `${k.target}${k.unit}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        ))}

        {/* 求職者パイプライン */}
        {seekers.length > 0 && (
          <Section title="👤 求職者パイプライン" color="#9333ea">
            <Table
              headers={["氏名", "スキル・経験", "ステータス", "希望形態", "メモ"]}
              rows={seekers.map(s => [
                <span style={{ fontWeight: 600 }}>{s.name}</span>,
                s.skill,
                <Badge label={s.status} color={STATUS_COLOR[s.status]} />,
                s.desired,
                s.note,
              ])}
            />
          </Section>
        )}

        {/* 企業コンタクト */}
        {realContacts.length > 0 && (
          <Section title="🏢 企業コンタクト" color="#2563eb">
            <Table
              headers={["会社名", "担当者", "連絡先", "ステータス", "日付"]}
              rows={realContacts.map(c => [
                <span style={{ fontWeight: 600 }}>{c.company_name}</span>,
                c.person || "—",
                c.contact_info || "—",
                <Badge label={c.status} color={STATUS_COLOR[c.status]} />,
                c.contact_date || "—",
              ])}
            />
          </Section>
        )}

        <div style={{ textAlign: "center", fontSize: 12, color: "#cbd5e1", marginTop: 32, paddingBottom: 24 }}>
          UCHIWA_CRM — キメロコスメ 進捗レポート（読み取り専用）
        </div>
      </div>
    </div>
  );
}

// ── KPI PANEL ────────────────────────────────────────────────
function KpiPanel({ kpi, setData }) {
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");

  function startEdit(id, field, current) {
    setEditing({ id, field });
    setEditVal(String(current));
  }

  function saveEdit() {
    if (!editing) return;
    const val = Number(editVal);
    if (isNaN(val)) { setEditing(null); return; }
    setData(d => ({
      ...d,
      kimero: {
        ...d.kimero,
        kpi: d.kimero.kpi.map(k => k.id === editing.id ? { ...k, [editing.field]: val } : k),
      },
    }));
    setEditing(null);
  }

  const categories = [...new Set(kpi.map(k => k.category))];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        {categories.map(cat => {
          const items = kpi.filter(k => k.category === cat);
          const avgPct = Math.round(items.reduce((s, k) => s + Math.min(100, k.target > 0 ? (k.actual / k.target) * 100 : 0), 0) / items.length);
          return (
            <Card key={cat} title={`${cat} 達成率`} value={`${avgPct}%`}
              sub={`${items.length}KPI`} color={CAT_COLOR[cat] || "#64748b"} icon={
                cat === "RA営業" ? "🏢" : cat === "CA" ? "👤" : cat === "成果" ? "🎯" : "💰"
              } />
          );
        })}
      </div>

      {categories.map(cat => (
        <Section key={cat} title={`${cat} KPI`} color={CAT_COLOR[cat] || "#2563eb"}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {kpi.filter(k => k.category === cat).map(k => {
              const pct = k.target > 0 ? Math.min(100, Math.round((k.actual / k.target) * 100)) : 0;
              const color = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
              const isMoneyKPI = k.unit === "円";
              return (
                <div key={k.id} style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: `1px solid ${pct >= 100 ? "#bbf7d0" : "rgba(255,255,255,0.8)"}`, transition: "transform 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{k.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{k.name}</span>
                    <Badge label={k.period} color={CAT_COLOR[cat] || "#64748b"} />
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, marginBottom: 10, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 8, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>実績</div>
                      {editing?.id === k.id && editing?.field === "actual" ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                            autoFocus style={{ width: 80, padding: "3px 6px", borderRadius: 6, border: "2px solid #2563eb", fontSize: 13, fontWeight: 700 }} />
                          <button onClick={saveEdit} style={{ padding: "3px 8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>✓</button>
                        </div>
                      ) : (
                        <div onClick={() => startEdit(k.id, "actual", k.actual)}
                          style={{ fontSize: 22, fontWeight: 800, color, cursor: "pointer", display: "flex", alignItems: "baseline", gap: 2 }} title="クリックして編集">
                          {isMoneyKPI ? `¥${k.actual.toLocaleString()}` : k.actual}
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>{!isMoneyKPI && k.unit}</span>
                          <span style={{ fontSize: 11, color: "#cbd5e1", marginLeft: 4 }}>✏️</span>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color, opacity: 0.15 }}>/</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>目標</div>
                      {editing?.id === k.id && editing?.field === "target" ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                            autoFocus style={{ width: 80, padding: "3px 6px", borderRadius: 6, border: "2px solid #94a3b8", fontSize: 13 }} />
                          <button onClick={saveEdit} style={{ padding: "3px 8px", background: "#64748b", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>✓</button>
                        </div>
                      ) : (
                        <div onClick={() => startEdit(k.id, "target", k.target)}
                          style={{ fontSize: 16, fontWeight: 700, color: "#64748b", cursor: "pointer" }} title="クリックして目標を編集">
                          {isMoneyKPI ? `¥${k.target.toLocaleString()}` : `${k.target}${k.unit}`}
                          <span style={{ fontSize: 11, color: "#cbd5e1", marginLeft: 4 }}>✏️</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: color + "22", borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color }}>{pct}%</div>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>達成率</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      ))}
      <div style={{ background: "rgba(248,250,252,0.6)", backdropFilter: "blur(8px)", borderRadius: 12, padding: 12, marginTop: 8, fontSize: 12, color: "#94a3b8", textAlign: "center", border: "1px solid rgba(226,232,240,0.4)" }}>
        💡 実績・目標の数字をクリックすると編集できます
      </div>
    </div>
  );
}

// ── COMPANY LIST ────────────────────────────────────────────
const CONTACT_STATUS_OPTIONS = ["未アプローチ", "アプローチ済", "商談中", "成約", "見送り"];
const JOB_STATUS_OPTIONS = ["要確認", "求人あり", "求人なし", "確認済"];
const CONTACT_STATUS_COLOR = {
  "未アプローチ": "#94a3b8", "アプローチ済": "#60a5fa", "商談中": "#f59e0b", "成約": "#22c55e", "見送り": "#ef4444",
};

function CompanyList({ onAddContact }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterContact, setFilterContact] = useState("");
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [saving, setSaving] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [bulkRegistering, setBulkRegistering] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);
  const PAGE_SIZE = 50;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) {
        setCompanies(data);
        const unique = [...new Set(data.map(c => c.industry_major).filter(Boolean))].sort();
        setIndustries(unique);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name.includes(search) || (c.address || "").includes(search);
    const matchIndustry = !filterIndustry || c.industry_major === filterIndustry;
    const matchContact = !filterContact || c.contact_status === filterContact;
    return matchSearch && matchIndustry && matchContact;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditRow({ contact_status: c.contact_status, notes: c.notes || "", job_status: c.job_status });
  };

  const cancelEdit = () => { setEditingId(null); setEditRow({}); };

  const bulkRegister = async () => {
    if (!window.confirm(`企業リストの全${companies.length}社を企業コンタクトに一括登録しますか？\n（既に登録済みの会社はスキップされます）`)) return;
    setBulkRegistering(true);
    setBulkResult(null);
    const { data: existing } = await supabase.from("contacts").select("company_id");
    const existingIds = new Set((existing || []).map(c => c.company_id).filter(Boolean));
    const today = new Date().toISOString().split("T")[0];
    const toInsert = companies.filter(c => !existingIds.has(c.id)).map(c => {
      const pref = extractPrefecture(c.address || "");
      const city = extractCity(c.address || "", pref);
      return { company_id: c.id, company_name: c.name, prefecture: pref || null, city: city || null, status: "初回コンタクト", contact_date: today };
    });
    if (toInsert.length === 0) { setBulkResult("✅ 全社登録済みです"); setBulkRegistering(false); return; }
    const BATCH = 50;
    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const { error } = await supabase.from("contacts").insert(toInsert.slice(i, i + BATCH));
      if (!error) inserted += Math.min(BATCH, toInsert.length - i);
    }
    setBulkResult(`✅ ${inserted}社を登録しました`);
    setBulkRegistering(false);
  };

  const saveEdit = async (id) => {
    setSaving(true);
    const { error } = await supabase.from("companies").update({
      contact_status: editRow.contact_status,
      job_status: editRow.job_status,
      notes: editRow.notes,
    }).eq("id", id);
    if (!error) {
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...editRow } : c));
      setEditingId(null);
      setEditRow({});
    }
    setSaving(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>⏳ 読み込み中...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 18, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🏢 企業リスト</div>
        <div style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 12, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
          {filtered.length}件 / 全{companies.length}件
        </div>
        <button onClick={bulkRegister} disabled={bulkRegistering} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#15803d", fontSize: 12, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>
          {bulkRegistering ? "⏳ 登録中..." : "📋 一括コンタクト登録"}
        </button>
        {bulkResult && <span style={{ fontSize: 12, color: "#15803d", fontWeight: 600 }}>{bulkResult}</span>}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="🔍 社名・住所で検索..."
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, width: 220, outline: "none" }}
        />
        <select
          value={filterIndustry}
          onChange={e => { setFilterIndustry(e.target.value); setPage(0); }}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569", background: "#fff" }}
        >
          <option value="">業種（全て）</option>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select
          value={filterContact}
          onChange={e => { setFilterContact(e.target.value); setPage(0); }}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569", background: "#fff" }}
        >
          <option value="">アプローチ状況（全て）</option>
          {CONTACT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterIndustry || filterContact) && (
          <button onClick={() => { setSearch(""); setFilterIndustry(""); setFilterContact(""); setPage(0); }}
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            ✕ クリア
          </button>
        )}
      </div>

      <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.8)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "rgba(241,245,249,0.8)", borderBottom: "2px solid #e2e8f0" }}>
              {["社名", "業種（大）", "業種（小）", "紹介実績", "求人状況", "アプローチ状況", "メモ", "操作"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#475569", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((c, i) => {
              const isEditing = editingId === c.id;
              return (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                  <td style={{ padding: "9px 12px", fontWeight: 600, color: "#1e293b", maxWidth: 180 }}>
                    {c.name}
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer" style={{ marginLeft: 6, fontSize: 10, color: "#60a5fa" }}>🔗</a>
                    )}
                    {c.phone && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{c.phone}</div>}
                  </td>
                  <td style={{ padding: "9px 12px", color: "#475569", whiteSpace: "nowrap" }}>{c.industry_major || "—"}</td>
                  <td style={{ padding: "9px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{c.industry_minor || "—"}</td>
                  <td style={{ padding: "9px 12px", textAlign: "center" }}>
                    {c.referral_record === "○" ? <span style={{ color: "#22c55e", fontWeight: 700 }}>○</span> : <span style={{ color: "#cbd5e1" }}>—</span>}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    {isEditing ? (
                      <select value={editRow.job_status} onChange={e => setEditRow(r => ({ ...r, job_status: e.target.value }))}
                        style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}>
                        {JOB_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <span style={{ fontSize: 11, color: "#475569" }}>{c.job_status || "要確認"}</span>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    {isEditing ? (
                      <select value={editRow.contact_status} onChange={e => setEditRow(r => ({ ...r, contact_status: e.target.value }))}
                        style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}>
                        {CONTACT_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <span style={{ background: CONTACT_STATUS_COLOR[c.contact_status] || "#94a3b8", color: "#fff", borderRadius: 10, padding: "2px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
                        {c.contact_status || "未アプローチ"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px", maxWidth: 200 }}>
                    {isEditing ? (
                      <input value={editRow.notes} onChange={e => setEditRow(r => ({ ...r, notes: e.target.value }))}
                        style={{ width: "100%", padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}
                        placeholder="メモを入力..." />
                    ) : (
                      <span style={{ color: "#64748b", fontSize: 11 }}>{c.notes || ""}</span>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => saveEdit(c.id)} disabled={saving}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          {saving ? "…" : "保存"}
                        </button>
                        <button onClick={cancelEdit}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 11, cursor: "pointer" }}>
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 4, flexWrap: "nowrap" }}>
                        <button onClick={() => startEdit(c)}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 11, cursor: "pointer" }}>
                          編集
                        </button>
                        {onAddContact && (
                          <button onClick={() => onAddContact(c)}
                            style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                            ＋コンタクト
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 }}>
          <button onClick={() => setPage(0)} disabled={page === 0}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page === 0 ? "#f1f5f9" : "#fff", color: page === 0 ? "#cbd5e1" : "#475569", cursor: page === 0 ? "default" : "pointer", fontSize: 12 }}>«</button>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page === 0 ? "#f1f5f9" : "#fff", color: page === 0 ? "#cbd5e1" : "#475569", cursor: page === 0 ? "default" : "pointer", fontSize: 12 }}>‹</button>
          <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{page + 1} / {totalPages}ページ</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page >= totalPages - 1 ? "#f1f5f9" : "#fff", color: page >= totalPages - 1 ? "#cbd5e1" : "#475569", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 12 }}>›</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page >= totalPages - 1 ? "#f1f5f9" : "#fff", color: page >= totalPages - 1 ? "#cbd5e1" : "#475569", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 12 }}>»</button>
        </div>
      )}
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
  const kpiAvg = Math.round(
    data.kimero.kpi.reduce((s, k) => s + Math.min(100, k.target > 0 ? (k.actual / k.target) * 100 : 0), 0) / data.kimero.kpi.length
  );
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
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e293b", letterSpacing: -0.5 }}>全社ダッシュボード</h2>
        <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>月収100万円達成ロードマップ</p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <Card title="個人報酬合計（今月）" value={`${((huppyCurrent.personal)/10000).toFixed(0)}万円`} sub="目標：100万円" color="#2563eb" icon="💰" />
        <Card title="フーピー売上" value={`${(huppyCurrent.total/10000).toFixed(0)}万円`} sub={`個人報酬 ${(huppyCurrent.personal/10000).toFixed(0)}万円`} color="#9333ea" icon="🎵" />
        <Card title="キメロ 商談中" value={`${kimeroDeals}件`} sub="成約目標：月3件" color="#f59e0b" icon="👔" />
        <Card title="スマイル今月売上" value={`${(smileMonthly/10000).toFixed(1)}万円`} sub={`${data.smile.sales.reduce((s,d)=>s+d.shoku,0)}食 / ${data.smile.sales.length}日`} color="#16a34a" icon="🍱" />
        <Card title="キメロ KPI達成率" value={`${kpiAvg}%`} sub={`${data.kimero.kpi.length}KPI追跡中`} color={kpiAvg >= 80 ? "#22c55e" : kpiAvg >= 50 ? "#f59e0b" : "#ef4444"} icon="🎯" />
        <Card title="今日のTASK達成" value={`${taskDone}/${taskTotal}`} sub={`${Math.round(taskDone/taskTotal*100)}%`} color="#ef4444" icon="🔥" />
      </div>
      <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.8)", marginBottom: 24 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 14, color: "#475569", fontWeight: 700 }}>👔 キメロコスメ KPI進捗（今月）</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {data.kimero.kpi.map(k => {
            const pct = k.target > 0 ? Math.min(100, Math.round((k.actual / k.target) * 100)) : 0;
            const color = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
            return (
              <div key={k.id} style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{k.icon} {k.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div style={{ background: "#e2e8f0", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                  {k.unit === "円" ? `¥${k.actual.toLocaleString()} / ¥${k.target.toLocaleString()}` : `${k.actual} / ${k.target}${k.unit}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, color: "#475569", fontWeight: 700 }}>事業別売上（今月）</h4>
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
        <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderRadius: 16, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.04)", border: "1px solid rgba(255,255,255,0.8)" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 14, color: "#475569", fontWeight: 700 }}>目標達成率</h4>
          {goalData.map(g => {
            const pct = Math.min(100, Math.round(g.現在 / g.目標 * 100));
            return (
              <div key={g.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{g.name}</span>
                  <span style={{ color: "#64748b" }}>¥{g.現在.toLocaleString()} / ¥{g.目標.toLocaleString()}</span>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: BIZ_COLOR[g.name === "フーピー" ? "フーピー" : g.name === "キメロ" ? "キメロ" : "スマイル"] || "#2563eb", borderRadius: 6 }} />
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── KIMERO ─────────────────────────────────────────────────
function Kimero({ data, setData }) {
  const [tab, setTab] = useState("kpi");
  const EMPTY_FORM = { company_id: null, company: "", person: "", contact: "", type: "人材派遣", prefecture: "", city: "", status: "初回コンタクト", jobStatus: "確認中", date: new Date().toISOString().split("T")[0], nextAction: "", note: "" };
  const [form, setForm] = useState(EMPTY_FORM);
  const [suggestions, setSuggestions] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterPref, setFilterPref] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [search, setSearch] = useState("");
  const [editingContactId, setEditingContactId] = useState(null);
  const [editContactRow, setEditContactRow] = useState({});
  const [savingContact, setSavingContact] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [contactPage, setContactPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  // ── 新機能 state ────────────────────────────
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterNextFrom, setFilterNextFrom] = useState("");
  const [filterNextTo, setFilterNextTo] = useState("");
  const [searchMode, setSearchMode] = useState("OR");
  const [viewMode, setViewMode] = useState("table");
  const [savedFilters, setSavedFilters] = useState(() => { try { return JSON.parse(localStorage.getItem("crm_saved_filters") || "[]"); } catch { return []; } });
  const [filterName, setFilterName] = useState("");
  const [showFilterSave, setShowFilterSave] = useState(false);
  const [tags, setTags] = useState(() => { try { return JSON.parse(localStorage.getItem("crm_tags") || "{}"); } catch { return {}; } });
  const [editingTagId, setEditingTagId] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [contactHistory, setContactHistory] = useState(() => { try { return JSON.parse(localStorage.getItem("crm_history") || "{}"); } catch { return {}; } });
  const [showHistoryId, setShowHistoryId] = useState(null);
  const [showMailId, setShowMailId] = useState(null);
  const [filterTag, setFilterTag] = useState("");
  const [dragOverStatus, setDragOverStatus] = useState(null);
  const [notifEnabled, setNotifEnabled] = useState(typeof Notification !== "undefined" && Notification.permission === "granted");

  useEffect(() => {
    supabase.from("companies").select("id, name, address").order("id", { ascending: true }).then(({ data: rows }) => {
      if (rows) setAllCompanies(rows);
    });
  }, []);

  useEffect(() => {
    (async () => {
      setLoadingContacts(true);
      const { data: rows } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (rows) setContacts(rows);
      setLoadingContacts(false);
    })();
  }, []);

  // ── ブラウザ通知 ──
  useEffect(() => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted" || contacts.length === 0) return;
    const today = new Date().toISOString().split("T")[0];
    const urgent = contacts.filter(c => c.next_action && c.next_action <= today && c.status !== "契約済" && c.status !== "失注");
    if (urgent.length > 0) {
      try { new Notification("UCHIWA CRM 🔔", { body: `本日アクション予定: ${urgent.length}件`, icon: "" }); } catch {}
    }
  }, [contacts.length]);

  // ── タグ管理 ──
  function addTag(contactId, tagText) {
    const key = String(contactId);
    const t = tagText.trim();
    if (!t) return;
    setTags(prev => {
      const next = { ...prev, [key]: [...new Set([...(prev[key] || []), t])] };
      localStorage.setItem("crm_tags", JSON.stringify(next));
      return next;
    });
  }
  function removeTag(contactId, tagText) {
    const key = String(contactId);
    setTags(prev => {
      const next = { ...prev, [key]: (prev[key] || []).filter(t => t !== tagText) };
      localStorage.setItem("crm_tags", JSON.stringify(next));
      return next;
    });
  }

  // ── 保存フィルター ──
  function saveCurrentFilter() {
    if (!filterName.trim()) return;
    const f = { name: filterName.trim(), search, filterPref, filterType, filterStatus, filterJob, filterDateFrom, filterDateTo, filterNextFrom, filterNextTo, filterTag, searchMode };
    setSavedFilters(prev => { const next = [...prev, f]; localStorage.setItem("crm_saved_filters", JSON.stringify(next)); return next; });
    setFilterName(""); setShowFilterSave(false);
  }
  function loadFilter(f) {
    setSearch(f.search || ""); setFilterPref(f.filterPref || ""); setFilterType(f.filterType || "");
    setFilterStatus(f.filterStatus || ""); setFilterJob(f.filterJob || "");
    setFilterDateFrom(f.filterDateFrom || ""); setFilterDateTo(f.filterDateTo || "");
    setFilterNextFrom(f.filterNextFrom || ""); setFilterNextTo(f.filterNextTo || "");
    setFilterTag(f.filterTag || ""); setSearchMode(f.searchMode || "OR");
  }
  function deleteSavedFilter(idx) {
    setSavedFilters(prev => { const next = prev.filter((_,i) => i !== idx); localStorage.setItem("crm_saved_filters", JSON.stringify(next)); return next; });
  }

  // ── メールテンプレート ──
  const MAIL_TEMPLATES = {
    "初回コンタクト": (c) => `件名: 【ご挨拶】${c.company_name || "貴社"}様へのご提案

${c.person ? `${c.person}様\n\n` : ""}お世話になっております。
キメロコスメ　営業担当と申します。

この度は弊社サービスについてご案内させていただきたくご連絡いたしました。
人材派遣・職業紹介のご支援を通じて、貴社の採用課題解決のお力になれればと存じます。

ご都合のよろしい際に、一度お打ち合わせのお時間をいただけますでしょうか。

何卒よろしくお願いいたします。`,
    "フォローアップ": (c) => `件名: 【ご確認】先日ご提案の件について

${c.person ? `${c.person}様\n\n` : ""}先日はお時間をいただきありがとうございました。

先日ご提案させていただいた件について、ご検討状況はいかがでしょうか。
ご不明な点がございましたら、お気軽にご連絡ください。

引き続きよろしくお願いいたします。`,
    "商談後御礼": (c) => `件名: 【御礼】本日はありがとうございました

${c.person ? `${c.person}様\n\n` : ""}本日はお忙しい中、貴重なお時間をいただきありがとうございました。

ご提示いただいたご要望につきまして、弊社にて対応可能な内容をご提案させていただきたく存じます。
近日中に詳細をお送りいたします。

今後ともどうぞよろしくお願いいたします。`,
    "提案書送付": (c) => `件名: 【ご提案】${c.company_name || "貴社"}様向け人材サービスのご案内

${c.person ? `${c.person}様\n\n` : ""}お世話になっております。

ご要望いただいた内容に基づき、提案書を作成いたしましたのでご送付いたします。
${c.type ? `今回は「${c.type}」のご提案となっております。\n` : ""}
ご確認いただき、ご意見・ご要望がございましたらお気軽にご連絡ください。

よろしくお願いいたします。`
  };

  function handleCompanyInput(val) {
    setForm(f => ({ ...f, company: val, company_id: null }));
    if (val.length >= 1) {
      setSuggestions(allCompanies.filter(c => c.name.includes(val)).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }

  function selectCompany(c) {
    const pref = extractPrefecture(c.address || "");
    const city = extractCity(c.address || "", pref);
    setForm(f => ({ ...f, company: c.name, company_id: c.id, prefecture: pref, city }));
    setSuggestions([]);
  }

  async function addContact() {
    if (!form.company || saving) return;
    setSaving(true);
    const insertData = {
      company_id: form.company_id || null,
      company_name: form.company,
      person: form.person || null,
      contact_info: form.contact || null,
      type: form.type,
      prefecture: form.prefecture || null,
      city: form.city || null,
      status: form.status,
      job_status: form.jobStatus,
      contact_date: form.date || null,
      next_action: form.nextAction || null,
      notes: form.note || null,
    };
    const { data: newRow, error } = await supabase.from("contacts").insert(insertData).select().single();
    if (!error && newRow) {
      setContacts(prev => [newRow, ...prev]);
    }
    setSaving(false);
    setForm(EMPTY_FORM);
    setSuggestions([]);
  }

  function startEditContact(c) {
    setEditingContactId(c.id);
    setEditContactRow({
      company_name: c.company_name || "",
      person: c.person || "",
      contact_info: c.contact_info || "",
      type: c.type || "人材派遣",
      prefecture: c.prefecture || "",
      city: c.city || "",
      status: c.status || "初回コンタクト",
      job_status: c.job_status || "確認中",
      contact_date: c.contact_date || "",
      next_action: c.next_action || "",
      notes: c.notes || "",
    });
  }

  function cancelEditContact() {
    setEditingContactId(null);
    setEditContactRow({});
  }

  async function saveEditContact(id) {
    setSavingContact(true);
    const { error } = await supabase.from("contacts").update({
      company_name: editContactRow.company_name,
      person: editContactRow.person || null,
      contact_info: editContactRow.contact_info || null,
      type: editContactRow.type,
      prefecture: editContactRow.prefecture || null,
      city: editContactRow.city || null,
      status: editContactRow.status,
      job_status: editContactRow.job_status || null,
      contact_date: editContactRow.contact_date || null,
      next_action: editContactRow.next_action || null,
      notes: editContactRow.notes || null,
    }).eq("id", id);
    if (!error) {
      const oldContact = contacts.find(c => c.id === id);
      if (oldContact) {
        const changes = [];
        if (oldContact.status !== editContactRow.status) changes.push(`ステータス: ${oldContact.status} → ${editContactRow.status}`);
        if ((oldContact.next_action || "") !== (editContactRow.next_action || "")) changes.push(`次回AK: ${oldContact.next_action || "なし"} → ${editContactRow.next_action || "なし"}`);
        if ((oldContact.person || "") !== (editContactRow.person || "")) changes.push(`担当者: ${oldContact.person || "なし"} → ${editContactRow.person || "なし"}`);
        if ((oldContact.job_status || "") !== (editContactRow.job_status || "")) changes.push(`求人状況: ${oldContact.job_status || "なし"} → ${editContactRow.job_status || "なし"}`);
        if (changes.length > 0) {
          setContactHistory(prev => {
            const key = String(id);
            const entry = { date: new Date().toISOString().slice(0, 16).replace("T", " "), changes };
            const next = { ...prev, [key]: [entry, ...(prev[key] || [])].slice(0, 50) };
            localStorage.setItem("crm_history", JSON.stringify(next));
            return next;
          });
        }
      }
      setContacts(prev => prev.map(c => c.id === id ? { ...c, ...editContactRow } : c));
      setEditingContactId(null);
      setEditContactRow({});
    }
    setSavingContact(false);
  }

  // ── CSV エクスポート ──
  function exportCSV() {
    const headers = ["会社名","担当者","連絡先","種別","都道府県","市区町村","ステータス","求人状況","日付","次回アクション","メモ"];
    const rows = sorted.map(c => [
      c.company_name, c.person||"", c.contact_info||"", c.type||"",
      c.prefecture||"", c.city||"", c.status||"", c.job_status||"",
      c.contact_date||"", c.next_action||"", (c.notes||"").replace(/"/g,'""')
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `contacts_${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  // ── CSV インポート ──
  async function importCSV(e) {
    const file = e.target.files[0]; if (!file) return;
    setImportMsg("読み込み中...");
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parse = line => { const cols = []; let cur="",inQ=false; for(const ch of line){ if(ch==='"'){inQ=!inQ;}else if(ch===','&&!inQ){cols.push(cur.trim());cur="";}else{cur+=ch;} } cols.push(cur.trim()); return cols.map(c=>c.replace(/^"|"$/g,"").replace(/""/g,'"').trim()); };
    const rows = lines.slice(1).map(line => {
      const c = parse(line);
      return { company_name:c[0]||"", person:c[1]||null, contact_info:c[2]||null, type:c[3]||"人材派遣", prefecture:c[4]||null, city:c[5]||null, status:c[6]||"初回コンタクト", job_status:c[7]||null, contact_date:c[8]||null, next_action:c[9]||null, notes:c[10]||null };
    }).filter(r => r.company_name);
    if (rows.length === 0) { setImportMsg("有効なデータがありません"); e.target.value=""; return; }
    const { data: inserted, error } = await supabase.from("contacts").insert(rows).select();
    if (error) { setImportMsg("エラー: " + error.message); }
    else { setContacts(prev => [...inserted, ...prev]); setImportMsg(`✅ ${inserted.length}件インポート完了`); }
    e.target.value="";
    setTimeout(() => setImportMsg(""), 4000);
  }

  // ── 一括削除 ──
  async function bulkDelete() {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`選択した${selectedIds.size}件を削除しますか？この操作は元に戻せません。`)) return;
    setBulkDeleting(true);
    const ids = [...selectedIds];
    const { error } = await supabase.from("contacts").delete().in("id", ids);
    if (!error) { setContacts(prev => prev.filter(c => !selectedIds.has(c.id))); setSelectedIds(new Set()); }
    setBulkDeleting(false);
  }

  // ── 一括ステータス変更 ──
  async function bulkChangeStatus() {
    if (selectedIds.size === 0 || !bulkStatus) return;
    const ids = [...selectedIds];
    const { error } = await supabase.from("contacts").update({ status: bulkStatus }).in("id", ids);
    if (!error) { setContacts(prev => prev.map(c => selectedIds.has(c.id) ? {...c, status: bulkStatus} : c)); setSelectedIds(new Set()); setBulkStatus(""); }
  }

  const statusCount = ["初回コンタクト","提案済","商談中","契約済"].map(s => ({
    status: s, count: contacts.filter(c => c.status === s).length
  }));

  const usedPrefs = [...new Set(contacts.map(c => c.prefecture).filter(Boolean))].sort();

  const today = new Date().toISOString().split("T")[0];
  const allTags = [...new Set(Object.values(tags).flat())].sort();
  const filtered = contacts.filter(c => {
    const searchTerms = search.trim().split(/\s+/).filter(Boolean);
    const searchField = `${c.company_name||""} ${c.person||""} ${c.contact_info||""} ${c.notes||""}`.toLowerCase();
    const ms = searchTerms.length === 0 || (
      searchMode === "AND"
        ? searchTerms.every(t => searchField.includes(t.toLowerCase()))
        : searchTerms.some(t => searchField.includes(t.toLowerCase()))
    );
    const cTags = tags[String(c.id)] || [];
    return ms
      && (!filterPref || c.prefecture === filterPref)
      && (!filterType || c.type === filterType)
      && (!filterStatus || c.status === filterStatus)
      && (!filterJob || c.job_status === filterJob)
      && (!filterDateFrom || (c.contact_date && c.contact_date >= filterDateFrom))
      && (!filterDateTo || (c.contact_date && c.contact_date <= filterDateTo))
      && (!filterNextFrom || (c.next_action && c.next_action >= filterNextFrom))
      && (!filterNextTo || (c.next_action && c.next_action <= filterNextTo))
      && (!filterTag || cTags.includes(filterTag));
  });
  const sorted = [...filtered].sort((a, b) => {
    if (a.next_action && b.next_action) return a.next_action.localeCompare(b.next_action);
    if (a.next_action) return -1;
    if (b.next_action) return 1;
    return (b.contact_date || b.created_at || "").localeCompare(a.contact_date || a.created_at || "");
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const safeContactPage = Math.min(contactPage, Math.max(0, totalPages - 1));
  const pagedContacts = sorted.slice(safeContactPage * pageSize, (safeContactPage + 1) * pageSize);

  const inp = (extra) => ({ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, ...extra });
  const sel = { padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 };
  const lbl = { fontSize: 11, color: "#64748b", marginBottom: 4 };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {statusCount.map(s => (
          <Card key={s.status} title={s.status} value={`${s.count}件`} color={STATUS_COLOR[s.status] || "#64748b"} icon="" />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["kpi","contacts","seekers","jobs","revenue","companies"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: tab === t ? "#2563eb" : "#f1f5f9", color: tab === t ? "#fff" : "#475569" }}>
            {t === "kpi" ? "🎯 KPI管理" : t === "contacts" ? "🏢 企業コンタクト" : t === "seekers" ? "👤 求職者管理" : t === "jobs" ? "📋 求人案件" : t === "revenue" ? "📈 売上推移" : "🏢 企業リスト"}
          </button>
        ))}
      </div>
      {tab === "kpi" && <KpiPanel kpi={data.kimero.kpi} setData={setData} />}
      {tab === "contacts" && (
        <Section title="企業コンタクト管理" color="#2563eb">
          {/* ── 新規追加フォーム ── */}
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 10 }}>＋ 新規コンタクト追加</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
              {/* 会社名（サジェスト） */}
              <div style={{ position: "relative" }}>
                <div style={lbl}>会社名 * <span style={{ color: "#93c5fd", fontSize: 10 }}>← 企業リストから候補表示</span></div>
                <input value={form.company} onChange={e => handleCompanyInput(e.target.value)} onBlur={() => setTimeout(() => setSuggestions([]), 150)} placeholder="会社名を入力..." style={inp({ width: 200 })} />
                {suggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, minWidth: 240, background: "#fff", border: "1px solid #bfdbfe", borderRadius: 8, zIndex: 200, boxShadow: "0 4px 16px rgba(37,99,235,0.12)", maxHeight: 220, overflowY: "auto" }}>
                    {suggestions.map((c, i) => (
                      <div key={i} onMouseDown={() => selectCompany(c)} style={{ padding: "8px 12px", cursor: "pointer", fontSize: 13, borderBottom: "1px solid #f1f5f9", display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, color: "#1e3a5f" }}>{c.name}</span>
                        {c.address && <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.address.slice(0, 20)}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div><div style={lbl}>担当者名</div><input value={form.person} onChange={e => setForm(f=>({...f,person:e.target.value}))} placeholder="田中部長" style={inp({ width: 110 })} /></div>
              <div><div style={lbl}>連絡先</div><input value={form.contact} onChange={e => setForm(f=>({...f,contact:e.target.value}))} placeholder="03-xxxx-xxxx" style={inp({ width: 140 })} /></div>
              <div><div style={lbl}>種別</div>
                <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={sel}>
                  {["人材派遣","職業紹介","業務委託","BPO"].map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><div style={lbl}>都道府県 <span style={{ color: "#93c5fd", fontSize: 10 }}>自動入力</span></div>
                <input value={form.prefecture} onChange={e => setForm(f=>({...f,prefecture:e.target.value}))} placeholder="東京都" style={inp({ width: 90 })} /></div>
              <div><div style={lbl}>市区町村</div><input value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))} placeholder="渋谷区" style={inp({ width: 100 })} /></div>
              <div><div style={lbl}>ステータス</div>
                <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))} style={sel}>
                  {["初回コンタクト","提案済","商談中","契約済","失注"].map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><div style={lbl}>求人状況</div>
                <select value={form.jobStatus} onChange={e => setForm(f=>({...f,jobStatus:e.target.value}))} style={sel}>
                  {["確認中","求人あり","求人なし"].map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><div style={lbl}>日付</div><input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} style={inp({})} /></div>
              <div><div style={lbl}>次回アクション日 🔔</div><input type="date" value={form.nextAction} onChange={e => setForm(f=>({...f,nextAction:e.target.value}))} style={inp({})} /></div>
              <div><div style={lbl}>メモ</div><input value={form.note} onChange={e => setForm(f=>({...f,note:e.target.value}))} placeholder="備考" style={inp({ width: 150 })} /></div>
              <button onClick={addContact} disabled={saving} style={{ padding: "7px 22px", background: saving ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 13 }}>{saving ? "保存中..." : "追加"}</button>
            </div>
          </div>
          {/* ── フィルターバー ── */}
          <div style={{ background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe", marginBottom: 12, overflow: "hidden" }}>
            {/* 1行目: 基本フィルター */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #bfdbfe" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>🔍</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="会社名・担当者・メモ…" style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12, width: 180 }} />
                <button onClick={() => setSearchMode(m => m === "OR" ? "AND" : "OR")} title="検索モード切替" style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #bfdbfe", background: searchMode === "AND" ? "#2563eb" : "#fff", color: searchMode === "AND" ? "#fff" : "#2563eb", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{searchMode}</button>
              </div>
              <select value={filterPref} onChange={e => setFilterPref(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
                <option value="">都道府県 全て</option>
                {usedPrefs.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
                <option value="">種別 全て</option>
                {["人材派遣","職業紹介","業務委託","BPO"].map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
                <option value="">ステータス 全て</option>
                {["初回コンタクト","提案済","商談中","契約済","失注"].map(s => <option key={s}>{s}</option>)}
              </select>
              <select value={filterJob} onChange={e => setFilterJob(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
                <option value="">求人状況 全て</option>
                {["確認中","求人あり","求人なし"].map(s => <option key={s}>{s}</option>)}
              </select>
              {allTags.length > 0 && (
                <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #c4b5fd", fontSize: 12 }}>
                  <option value="">🏷 タグ 全て</option>
                  {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              {(search||filterPref||filterType||filterStatus||filterJob||filterDateFrom||filterDateTo||filterNextFrom||filterNextTo||filterTag) && (
                <button onClick={() => { setSearch(""); setFilterPref(""); setFilterType(""); setFilterStatus(""); setFilterJob(""); setFilterDateFrom(""); setFilterDateTo(""); setFilterNextFrom(""); setFilterNextTo(""); setFilterTag(""); }} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fff7f7", color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✕ リセット</button>
              )}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>表示:</span>
                {[10, 25, 50, 100].map(n => (
                  <button key={n} onClick={() => { setPageSize(n); setContactPage(0); }} style={{ padding: "3px 9px", borderRadius: 6, border: "1px solid", fontSize: 11, fontWeight: 700, cursor: "pointer", background: pageSize === n ? "#2563eb" : "#fff", color: pageSize === n ? "#fff" : "#475569", borderColor: pageSize === n ? "#2563eb" : "#cbd5e1" }}>{n}</button>
                ))}
                <span style={{ marginLeft: 4, fontSize: 12, color: "#64748b", fontWeight: 600 }}>{sorted.length}件</span>
              </div>
            </div>
            {/* 2行目: 日付フィルター */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "8px 14px", borderBottom: "1px solid #bfdbfe", background: "#f8faff" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>📅 日付範囲</span>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>コンタクト日:</span>
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #bfdbfe", fontSize: 12 }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>〜</span>
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #bfdbfe", fontSize: 12 }} />
              <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>次回AK:</span>
              <input type="date" value={filterNextFrom} onChange={e => setFilterNextFrom(e.target.value)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #bfdbfe", fontSize: 12 }} />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>〜</span>
              <input type="date" value={filterNextTo} onChange={e => setFilterNextTo(e.target.value)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #bfdbfe", fontSize: 12 }} />
              {/* 今週のAK */}
              <button onClick={() => { const d = new Date(); const mon = new Date(d); mon.setDate(d.getDate() - d.getDay() + 1); const sun = new Date(mon); sun.setDate(mon.getDate() + 6); setFilterNextFrom(mon.toISOString().split("T")[0]); setFilterNextTo(sun.toISOString().split("T")[0]); }} style={{ padding: "3px 9px", borderRadius: 5, border: "1px solid #bfdbfe", background: "#fff", color: "#2563eb", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>今週</button>
              <button onClick={() => { setFilterNextFrom(today); setFilterNextTo(today); }} style={{ padding: "3px 9px", borderRadius: 5, border: "1px solid #fca5a5", background: "#fff7f7", color: "#ef4444", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>🔴 本日</button>
            </div>
            {/* 3行目: アクションボタン + 保存フィルター */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", padding: "8px 14px" }}>
              <button onClick={exportCSV} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📤 CSV出力</button>
              <label style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                📥 CSV取込 <input type="file" accept=".csv" onChange={importCSV} style={{ display: "none" }} />
              </label>
              {importMsg && <span style={{ fontSize: 11, color: importMsg.startsWith("✅") ? "#16a34a" : "#ef4444", fontWeight: 600 }}>{importMsg}</span>}
              <button onClick={() => setShowAnalytics(a => !a)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e9d5ff", background: showAnalytics ? "#9333ea" : "#faf5ff", color: showAnalytics ? "#fff" : "#9333ea", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📊 分析</button>
              <button onClick={() => setViewMode(v => v === "table" ? "kanban" : "table")} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #fde68a", background: viewMode === "kanban" ? "#f59e0b" : "#fffbeb", color: viewMode === "kanban" ? "#fff" : "#d97706", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🗂 {viewMode === "table" ? "カンバン表示" : "テーブル表示"}</button>
              <button onClick={() => { if (!notifEnabled) { Notification.requestPermission().then(p => { if (p === "granted") setNotifEnabled(true); }); } }} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #fde68a", background: notifEnabled ? "#f59e0b" : "#fffbeb", color: notifEnabled ? "#fff" : "#d97706", fontSize: 12, cursor: notifEnabled ? "default" : "pointer", fontWeight: 600 }}>{notifEnabled ? "🔔 通知ON" : "🔔 通知許可"}</button>
              <button onClick={() => setShowFilterSave(s => !s)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>📌 フィルター保存</button>
              {savedFilters.length > 0 && savedFilters.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <button onClick={() => loadFilter(f)} style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #cbd5e1", background: "#f8fafc", color: "#2563eb", fontSize: 11, cursor: "pointer" }}>📌 {f.name}</button>
                  <button onClick={() => deleteSavedFilter(i)} style={{ padding: "2px 5px", borderRadius: 5, border: "none", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>✕</button>
                </div>
              ))}
              {showFilterSave && (
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="フィルター名" style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #bfdbfe", fontSize: 12, width: 120 }} onKeyDown={e => e.key === "Enter" && saveCurrentFilter()} />
                  <button onClick={saveCurrentFilter} style={{ padding: "4px 10px", borderRadius: 5, border: "none", background: "#2563eb", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>保存</button>
                </div>
              )}
            </div>
          </div>
          {/* ── 分析グラフ ── */}
          {showAnalytics && (() => {
            // 月別登録推移データ
            const monthlyMap = {};
            contacts.forEach(c => {
              const m = (c.contact_date || c.created_at || "").slice(0, 7);
              if (m) monthlyMap[m] = (monthlyMap[m] || 0) + 1;
            });
            const monthlyData = Object.entries(monthlyMap).sort().slice(-12).map(([m, n]) => ({ name: m.replace("-", "/"), 件数: n }));
            // 都道府県別ランキング (上位10)
            const prefMap = {};
            contacts.forEach(c => { if (c.prefecture) prefMap[c.prefecture] = (prefMap[c.prefecture] || 0) + 1; });
            const prefData = Object.entries(prefMap).sort((a,b) => b[1]-a[1]).slice(0,10).map(([p,n]) => ({ name: p, 件数: n }));
            // ファネル（ステータス進捗）
            const statuses = ["初回コンタクト","提案済","商談中","契約済","失注"];
            const funnelColors = ["#94a3b8","#60a5fa","#f59e0b","#22c55e","#ef4444"];
            const funnelData = statuses.map((s,i) => ({ name: s, 件数: contacts.filter(c=>c.status===s).length, color: funnelColors[i] }));
            return (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                  <div style={{ flex: 1, minWidth: 260, background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e9d5ff" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#9333ea", marginBottom: 8 }}>ステータス別件数</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={funnelData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={90} style={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="件数" radius={[0,4,4,0]}>
                          {funnelData.map((d,i) => <Cell key={i} fill={d.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, minWidth: 260, background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #bfdbfe" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 8 }}>種別件数</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={["人材派遣","職業紹介","業務委託","BPO"].map(t => ({ name: t, 件数: contacts.filter(c=>c.type===t).length }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" style={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="件数" fill="#2563eb" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, minWidth: 260, background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>求人状況</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={["確認中","求人あり","求人なし"].map(j => ({ name: j, 件数: contacts.filter(c=>c.job_status===j).length }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" style={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="件数" fill="#16a34a" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 2, minWidth: 300, background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #fde68a" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", marginBottom: 8 }}>📈 月別登録推移（直近12ヶ月）</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" style={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="件数" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ flex: 1, minWidth: 260, background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #fecdd3" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>🗺 都道府県別ランキング（上位10）</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={prefData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={70} style={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="件数" fill="#dc2626" radius={[0,4,4,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* ファネル分析 */}
                <div style={{ background: "#fff", borderRadius: 10, padding: 16, border: "1px solid #e2e8f0", marginTop: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12 }}>🎯 ファネル分析（ステータス進捗）</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 100 }}>
                    {(() => {
                      const max = Math.max(...funnelData.map(d => d.件数), 1);
                      return funnelData.map((d,i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{d.件数}</span>
                          <div style={{ width: "100%", height: Math.max(8, d.件数 / max * 80), background: d.color, borderRadius: "4px 4px 0 0", transition: "height 0.3s" }} />
                          <span style={{ fontSize: 9, color: "#64748b", textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap" }}>{d.name}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            );
          })()}
          {/* ── カンバンビュー ── */}
          {viewMode === "kanban" && (
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
              {["初回コンタクト","提案済","商談中","契約済","失注"].map(status => {
                const colContacts = filtered.filter(c => c.status === status);
                const colColor = STATUS_COLOR[status] || "#94a3b8";
                return (
                  <div key={status}
                    onDragOver={e => { e.preventDefault(); setDragOverStatus(status); }}
                    onDragLeave={() => setDragOverStatus(null)}
                    onDrop={async e => {
                      e.preventDefault(); setDragOverStatus(null);
                      const id = parseInt(e.dataTransfer.getData("contactId"));
                      if (!id) return;
                      const { error } = await supabase.from("contacts").update({ status }).eq("id", id);
                      if (!error) {
                        const old = contacts.find(c => c.id === id);
                        if (old && old.status !== status) {
                          setContactHistory(prev => {
                            const key = String(id);
                            const entry = { date: new Date().toISOString().slice(0, 16).replace("T"," "), changes: [`ステータス: ${old.status} → ${status}`] };
                            const next = { ...prev, [key]: [entry, ...(prev[key] || [])].slice(0, 50) };
                            localStorage.setItem("crm_history", JSON.stringify(next));
                            return next;
                          });
                        }
                        setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
                      }
                    }}
                    style={{ minWidth: 200, maxWidth: 220, background: dragOverStatus === status ? "#f0f9ff" : "#f8fafc", borderRadius: 10, border: `2px solid ${dragOverStatus === status ? colColor : "#e2e8f0"}`, flexShrink: 0, overflow: "hidden", transition: "border-color 0.15s" }}>
                    <div style={{ background: colColor, color: "#fff", padding: "8px 12px", fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
                      <span>{status}</span><span>{colContacts.length}件</span>
                    </div>
                    <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, maxHeight: 500, overflowY: "auto" }}>
                      {colContacts.slice(0, 30).map(c => {
                        const cTags = tags[String(c.id)] || [];
                        const isUrgent = c.next_action && c.next_action <= today;
                        return (
                          <div key={c.id} draggable
                            onDragStart={e => { e.dataTransfer.setData("contactId", String(c.id)); }}
                            style={{ background: "#fff", borderRadius: 7, padding: "8px 10px", border: "1px solid #e2e8f0", cursor: "grab", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                            <div style={{ fontWeight: 700, fontSize: 12, color: "#1e3a5f", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.company_name}</div>
                            {c.person && <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>{c.person}</div>}
                            {c.next_action && <div style={{ fontSize: 11, color: isUrgent ? "#ef4444" : "#f59e0b", fontWeight: 700 }}>{isUrgent ? "🔴 " : "🟡 "}{c.next_action}</div>}
                            {cTags.length > 0 && <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>{cTags.map(t => <span key={t} style={{ padding: "1px 6px", borderRadius: 10, background: "#ede9fe", color: "#7c3aed", fontSize: 10 }}>{t}</span>)}</div>}
                          </div>
                        );
                      })}
                      {colContacts.length > 30 && <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center" }}>+{colContacts.length - 30}件</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* ── 一括操作バー ── */}
          {selectedIds.size > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#1e3a5f", borderRadius: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>✅ {selectedIds.size}件 選択中</span>
              <button onClick={() => setSelectedIds(new Set())} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#475569", color: "#fff", fontSize: 12, cursor: "pointer" }}>選択解除</button>
              <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 12 }}>
                <option value="">ステータスを選択…</option>
                {["初回コンタクト","提案済","商談中","契約済","失注"].map(s => <option key={s}>{s}</option>)}
              </select>
              <button onClick={bulkChangeStatus} disabled={!bulkStatus} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: bulkStatus ? "#2563eb" : "#475569", color: "#fff", fontSize: 12, cursor: bulkStatus ? "pointer" : "default", fontWeight: 700 }}>一括変更</button>
              <button onClick={bulkDelete} disabled={bulkDeleting} style={{ padding: "4px 12px", borderRadius: 6, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, cursor: "pointer", fontWeight: 700, marginLeft: "auto" }}>{bulkDeleting ? "削除中..." : "🗑 一括削除"}</button>
            </div>
          )}
          {/* ── コンタクト一覧テーブル ── */}
          {loadingContacts ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>⏳ 読み込み中...</div>
          ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  <th style={{ padding: "8px 10px", borderBottom: "2px solid #e2e8f0" }}>
                    <input type="checkbox" checked={pagedContacts.length > 0 && pagedContacts.every(c => selectedIds.has(c.id))} onChange={e => {
                      const next = new Set(selectedIds);
                      pagedContacts.forEach(c => e.target.checked ? next.add(c.id) : next.delete(c.id));
                      setSelectedIds(next);
                    }} style={{ cursor: "pointer" }} />
                  </th>
                  {["会社名","担当者","連絡先","種別","都道府県","市区町村","ステータス","求人状況","日付","次回AK 🔔","メモ","🏷 タグ","操作"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedContacts.map((c, i) => {
                  const isUrgent = c.next_action && c.next_action <= today;
                  const isSoon = c.next_action && c.next_action > today && c.next_action <= new Date(Date.now() + 3*86400000).toISOString().split("T")[0];
                  const isEditing = editingContactId === c.id;
                  const eInp = { padding: "4px 6px", borderRadius: 5, border: "1px solid #93c5fd", fontSize: 12, background: "#fff", width: "100%" };
                  const eSel = { padding: "4px 6px", borderRadius: 5, border: "1px solid #93c5fd", fontSize: 12, background: "#fff" };
                  return (
                    <tr key={c.id} style={{ background: isEditing ? "#eff6ff" : selectedIds.has(c.id) ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px 10px" }}>
                        <input type="checkbox" checked={selectedIds.has(c.id)} onChange={e => {
                          const next = new Set(selectedIds);
                          e.target.checked ? next.add(c.id) : next.delete(c.id);
                          setSelectedIds(next);
                        }} style={{ cursor: "pointer" }} />
                      </td>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "#1e3a5f", whiteSpace: "nowrap", minWidth: 120 }}>
                        {isEditing ? <input value={editContactRow.company_name} onChange={e => setEditContactRow(r => ({ ...r, company_name: e.target.value }))} style={eInp} /> : c.company_name}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#475569", minWidth: 80 }}>
                        {isEditing ? <input value={editContactRow.person} onChange={e => setEditContactRow(r => ({ ...r, person: e.target.value }))} placeholder="担当者名" style={eInp} /> : (c.person || "—")}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12, minWidth: 110 }}>
                        {isEditing ? <input value={editContactRow.contact_info} onChange={e => setEditContactRow(r => ({ ...r, contact_info: e.target.value }))} placeholder="電話番号" style={eInp} /> : (c.contact_info || "—")}
                      </td>
                      <td style={{ padding: "8px 10px", minWidth: 90 }}>
                        {isEditing ? (
                          <select value={editContactRow.type} onChange={e => setEditContactRow(r => ({ ...r, type: e.target.value }))} style={eSel}>
                            {["人材派遣","職業紹介","業務委託","BPO"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        ) : <Badge label={c.type || "—"} color="#2563eb" />}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12, minWidth: 80 }}>
                        {isEditing ? <input value={editContactRow.prefecture} onChange={e => setEditContactRow(r => ({ ...r, prefecture: e.target.value }))} placeholder="東京都" style={{ ...eInp, width: 70 }} /> : (c.prefecture || "—")}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12, minWidth: 80 }}>
                        {isEditing ? <input value={editContactRow.city} onChange={e => setEditContactRow(r => ({ ...r, city: e.target.value }))} placeholder="渋谷区" style={{ ...eInp, width: 80 }} /> : (c.city || "—")}
                      </td>
                      <td style={{ padding: "8px 10px", minWidth: 100 }}>
                        {isEditing ? (
                          <select value={editContactRow.status} onChange={e => setEditContactRow(r => ({ ...r, status: e.target.value }))} style={eSel}>
                            {["初回コンタクト","提案済","商談中","契約済","失注"].map(s => <option key={s}>{s}</option>)}
                          </select>
                        ) : <Badge label={c.status} color={STATUS_COLOR[c.status] || "#94a3b8"} />}
                      </td>
                      <td style={{ padding: "8px 10px", minWidth: 80 }}>
                        {isEditing ? (
                          <select value={editContactRow.job_status} onChange={e => setEditContactRow(r => ({ ...r, job_status: e.target.value }))} style={eSel}>
                            {["確認中","求人あり","求人なし"].map(s => <option key={s}>{s}</option>)}
                          </select>
                        ) : (c.job_status ? <Badge label={c.job_status} color={JOB_STATUS_COLOR[c.job_status] || "#94a3b8"} /> : "—")}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 12, whiteSpace: "nowrap", minWidth: 100 }}>
                        {isEditing ? <input type="date" value={editContactRow.contact_date} onChange={e => setEditContactRow(r => ({ ...r, contact_date: e.target.value }))} style={eInp} /> : (c.contact_date || "—")}
                      </td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap", minWidth: 100 }}>
                        {isEditing ? <input type="date" value={editContactRow.next_action} onChange={e => setEditContactRow(r => ({ ...r, next_action: e.target.value }))} style={eInp} /> : (
                          c.next_action
                            ? <span style={{ color: isUrgent ? "#ef4444" : isSoon ? "#f59e0b" : "#2563eb", fontWeight: isUrgent || isSoon ? 700 : 400, fontSize: 12 }}>{isUrgent ? "🔴 " : isSoon ? "🟡 " : ""}{c.next_action}</span>
                            : <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 12, minWidth: 120 }}>
                        {isEditing ? <input value={editContactRow.notes} onChange={e => setEditContactRow(r => ({ ...r, notes: e.target.value }))} placeholder="メモ" style={{ ...eInp, width: 120 }} /> : (
                          <span style={{ display: "block", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notes || "—"}</span>
                        )}
                      </td>
                      {/* タグ列 */}
                      <td style={{ padding: "8px 10px", minWidth: 100 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                          {(tags[String(c.id)] || []).map(t => (
                            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: "1px 6px", borderRadius: 10, background: "#ede9fe", color: "#7c3aed", fontSize: 10 }}>
                              {t}
                              <span onClick={() => removeTag(c.id, t)} style={{ cursor: "pointer", color: "#a78bfa", fontWeight: 700 }}>×</span>
                            </span>
                          ))}
                          {editingTagId === c.id ? (
                            <input autoFocus value={tagInput} onChange={e => setTagInput(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") { addTag(c.id, tagInput); setTagInput(""); setEditingTagId(null); } if (e.key === "Escape") { setTagInput(""); setEditingTagId(null); } }}
                              onBlur={() => { if (tagInput.trim()) addTag(c.id, tagInput); setTagInput(""); setEditingTagId(null); }}
                              style={{ width: 70, padding: "1px 5px", borderRadius: 5, border: "1px solid #c4b5fd", fontSize: 11 }} placeholder="タグ追加" />
                          ) : (
                            <span onClick={() => setEditingTagId(c.id)} style={{ cursor: "pointer", padding: "1px 5px", borderRadius: 10, border: "1px dashed #c4b5fd", color: "#a78bfa", fontSize: 10 }}>＋</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: 4 }}>
                            <button onClick={() => saveEditContact(c.id)} disabled={savingContact} style={{ padding: "4px 10px", background: savingContact ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: savingContact ? "not-allowed" : "pointer" }}>
                              {savingContact ? "保存中" : "💾 保存"}
                            </button>
                            <button onClick={cancelEditContact} style={{ padding: "4px 8px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: 3 }}>
                            <button onClick={() => startEditContact(c)} style={{ padding: "4px 8px", background: "#f1f5f9", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✏️</button>
                            <button onClick={() => setShowHistoryId(c.id)} title="履歴" style={{ padding: "4px 8px", background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>📋</button>
                            <button onClick={() => setShowMailId(c)} title="メールテンプレート" style={{ padding: "4px 8px", background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>📧</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={14} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>該当するコンタクトがありません</td></tr>
                )}
              </tbody>
            </table>
          </div>
          )}
          {/* ── ページネーション ── */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                {safeContactPage * pageSize + 1}〜{Math.min((safeContactPage + 1) * pageSize, sorted.length)} 件 / 全 {sorted.length} 件
              </span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <button onClick={() => setContactPage(0)} disabled={safeContactPage === 0} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", background: safeContactPage === 0 ? "#f1f5f9" : "#fff", color: safeContactPage === 0 ? "#cbd5e1" : "#475569", fontSize: 12, cursor: safeContactPage === 0 ? "default" : "pointer" }}>«</button>
                <button onClick={() => setContactPage(p => Math.max(0, p - 1))} disabled={safeContactPage === 0} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: safeContactPage === 0 ? "#f1f5f9" : "#fff", color: safeContactPage === 0 ? "#cbd5e1" : "#475569", fontSize: 12, cursor: safeContactPage === 0 ? "default" : "pointer" }}>‹ 前へ</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, j) => {
                  let p;
                  if (totalPages <= 7) p = j;
                  else if (safeContactPage < 4) p = j;
                  else if (safeContactPage > totalPages - 5) p = totalPages - 7 + j;
                  else p = safeContactPage - 3 + j;
                  return (
                    <button key={p} onClick={() => setContactPage(p)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid", fontSize: 12, fontWeight: 700, cursor: "pointer", background: safeContactPage === p ? "#2563eb" : "#fff", color: safeContactPage === p ? "#fff" : "#475569", borderColor: safeContactPage === p ? "#2563eb" : "#e2e8f0" }}>{p + 1}</button>
                  );
                })}
                <button onClick={() => setContactPage(p => Math.min(totalPages - 1, p + 1))} disabled={safeContactPage === totalPages - 1} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: safeContactPage === totalPages - 1 ? "#f1f5f9" : "#fff", color: safeContactPage === totalPages - 1 ? "#cbd5e1" : "#475569", fontSize: 12, cursor: safeContactPage === totalPages - 1 ? "default" : "pointer" }}>次へ ›</button>
                <button onClick={() => setContactPage(totalPages - 1)} disabled={safeContactPage === totalPages - 1} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #e2e8f0", background: safeContactPage === totalPages - 1 ? "#f1f5f9" : "#fff", color: safeContactPage === totalPages - 1 ? "#cbd5e1" : "#475569", fontSize: 12, cursor: safeContactPage === totalPages - 1 ? "default" : "pointer" }}>»</button>
              </div>
            </div>
          )}
          {/* ── 履歴モーダル ── */}
          {showHistoryId && (() => {
            const c = contacts.find(x => x.id === showHistoryId);
            const hist = contactHistory[String(showHistoryId)] || [];
            return (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowHistoryId(null)}>
                <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 420, maxWidth: "90vw", maxHeight: "70vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15 }}>📋 変更履歴 — {c?.company_name}</div>
                    <button onClick={() => setShowHistoryId(null)} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8" }}>✕</button>
                  </div>
                  <div style={{ overflowY: "auto", flex: 1 }}>
                    {hist.length === 0 ? (
                      <div style={{ color: "#94a3b8", textAlign: "center", padding: 24 }}>履歴がありません</div>
                    ) : hist.map((h, i) => (
                      <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{h.date}</div>
                        {h.changes.map((ch, j) => <div key={j} style={{ fontSize: 13, color: "#475569" }}>• {ch}</div>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
          {/* ── メールテンプレートモーダル ── */}
          {showMailId && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowMailId(null)}>
              <MailTemplateModal contact={showMailId} templates={MAIL_TEMPLATES} onClose={() => setShowMailId(null)} />
            </div>
          )}
        </Section>
      )}
      {tab === "seekers" && <SeekerManagement />}
      {tab === "jobs" && <JobPostingManagement />}
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
      {tab === "companies" && <CompanyList onAddContact={(c) => {
        const pref = extractPrefecture(c.address || "");
        const city = extractCity(c.address || "", pref);
        setForm({ ...EMPTY_FORM, company: c.name, company_id: c.id, prefecture: pref, city });
        setSuggestions([]);
        setTab("contacts");
      }} />}
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
            s.date, s.staff, `${s.shoku}食`,
            `¥${s.cash.toLocaleString()}`,
            `¥${s.paypay.toLocaleString()}`,
            <span style={{ fontWeight: 700, color: "#16a34a" }}>¥{(s.cash+s.paypay).toLocaleString()}</span>,
          ])}
        />
      </Section>
    </div>
  );
}

// ── EMANON 売上管理データ (Google Sheets連携) ──────────────
const EMANON_PL = [
  { month: "2025-05", label: "2025/5", revenue: 722434, payment: 234000, grossProfit: 488434, laborCost: 234115, netProfit: 254319, expenses: 0 },
  { month: "2025-06", label: "2025/6", revenue: 839385, payment: 263499, grossProfit: 575886, laborCost: 241969, netProfit: 333917, expenses: 0 },
  { month: "2025-07", label: "2025/7", revenue: 695809, payment: 350427, grossProfit: 345382, laborCost: 234790, netProfit: 110591, expenses: 0 },
  { month: "2025-08", label: "2025/8", revenue: 855538, payment: 501047, grossProfit: 354491, laborCost: 206347, netProfit: 148144, expenses: 30000 },
  { month: "2025-09", label: "2025/9", revenue: 1310417, payment: 988933, grossProfit: 321484, laborCost: 196445, netProfit: 125039, expenses: 30000 },
  { month: "2025-10", label: "2025/10", revenue: 1216339, payment: 765995, grossProfit: 450344, laborCost: 235103, netProfit: 215241, expenses: 30000 },
  { month: "2025-11", label: "2025/11", revenue: 1370180, payment: 738992, grossProfit: 631188, laborCost: 289356, netProfit: 341832, expenses: 30000 },
  { month: "2025-12", label: "2025/12", revenue: 2254721, payment: 1166829, grossProfit: 1087892, laborCost: 426367, netProfit: 661524, expenses: 30000 },
  { month: "2026-01", label: "2026/1", revenue: 1525138, payment: 1073845, grossProfit: 451293, laborCost: 235388, netProfit: 215905, expenses: 30000 },
  { month: "2026-02", label: "2026/2", revenue: 1488651, payment: 1006113, grossProfit: 482538, laborCost: 244761, netProfit: 237777, expenses: 30000 },
];

const EMANON_ENTERTAINERS = {
  "2025-07": [
    { name: "福禄寿", reward: 32070 }, { name: "大阪の村長", reward: 1732 }, { name: "o_van entertainment", reward: 10005 },
    { name: "EMANON Entertainment Odakei", reward: 12120 }, { name: "EMANON Entertainment Miguel", reward: 531 },
    { name: "EMANON Entertainment DJMARU", reward: 6120 }, { name: "EMANON Entertainment CHIHA", reward: 249191 },
    { name: "EMANON Entertainment", reward: 276634 }, { name: "DAIKI EMANON Entertainment", reward: 7052 },
    { name: "Bridge Stars Entertainment Japan", reward: 168332 },
  ],
  "2025-08": [
    { name: "福禄寿", reward: 5059 }, { name: "o_van entertainment", reward: 762 },
    { name: "EMANON Entertainment Odakei", reward: 2786 }, { name: "EMANON Entertainment DJMARU", reward: 3066 },
    { name: "EMANON Entertainment CHIHA", reward: 90577 }, { name: "EMANON Entertainment", reward: 280158 },
    { name: "DAIKI EMANON Entertainment", reward: 1809 }, { name: "Bridge Stars Entertainment Japan", reward: 470757 },
  ],
  "2025-09": [
    { name: "福禄寿", reward: 17356 }, { name: "o_van entertainment", reward: 4575 },
    { name: "EMANON Entertainment Odakei", reward: 6234 }, { name: "EMANON Entertainment Miguel", reward: 5292 },
    { name: "EMANON Entertainment DJMARU", reward: 1636 }, { name: "EMANON Entertainment CHIHA", reward: 307028 },
    { name: "EMANON Entertainment", reward: 474696 }, { name: "DAIKI EMANON Entertainment", reward: 3458 },
    { name: "Bridge Stars Entertainment Japan", reward: 489265 },
  ],
  "2025-10": [
    { name: "福禄寿", reward: 9316 }, { name: "大阪の村長", reward: 2102 }, { name: "o_van entertainment", reward: 7714 },
    { name: "ken", reward: 4076 }, { name: "EMANON Entertainment Odakei", reward: 11100 },
    { name: "EMANON Entertainment Miguel", reward: 488 }, { name: "EMANON Entertainment DJMARU", reward: 8055 },
    { name: "EMANON Entertainment CHIHA", reward: 77982 }, { name: "EMANON Entertainment", reward: 461556 },
    { name: "DAIKI EMANON Entertainment", reward: 5005 }, { name: "Bridge Stars Entertainment Japan", reward: 628945 },
  ],
  "2025-11": [
    { name: "福禄寿", reward: 10291 }, { name: "大阪の村長", reward: 540 }, { name: "o_van entertainment", reward: 3614 },
    { name: "ken", reward: 6270 }, { name: "EMANON Entertainment Odakei", reward: 14474 },
    { name: "EMANON Entertainment Miguel", reward: 438 }, { name: "EMANON Entertainment DJMARU", reward: 8001 },
    { name: "EMANON Entertainment CHIHA", reward: 72032 }, { name: "EMANON Entertainment", reward: 389625 },
    { name: "DAIKI EMANON Entertainment", reward: 2929 }, { name: "Bridge Stars Entertainment Japan", reward: 861966 },
  ],
  "2025-12": [
    { name: "福禄寿", reward: 14499 }, { name: "大阪の村長", reward: 1022 }, { name: "o_van entertainment", reward: 25102 },
    { name: "ken", reward: 9694 }, { name: "EMANON Entertainment Odakei", reward: 15746 },
    { name: "EMANON Entertainment Miguel", reward: 724 }, { name: "EMANON Entertainment DJMARU", reward: 3648 },
    { name: "EMANON Entertainment CHIHA", reward: 86261 }, { name: "EMANON Entertainment", reward: 661038 },
    { name: "DAIKI EMANON Entertainment", reward: 10133 }, { name: "Bridge Stars Entertainment Japan", reward: 1426854 },
  ],
  "2026-01": [
    { name: "福禄寿", reward: 10714 }, { name: "大阪の村長", reward: 1159 }, { name: "o_van entertainment", reward: 20476 },
    { name: "ken", reward: 7629 }, { name: "EMANON Entertainment Odakei", reward: 16001 },
    { name: "EMANON Entertainment Miguel", reward: 596 }, { name: "EMANON Entertainment DJMARU", reward: 6186 },
    { name: "EMANON Entertainment CHIHA", reward: 70131 }, { name: "EMANON Entertainment", reward: 319076 },
    { name: "DAIKI EMANON Entertainment", reward: 8429 }, { name: "Bridge Stars Entertainment Japan", reward: 1064740 },
  ],
  "2026-02": [
    { name: "福禄寿", reward: 13617 }, { name: "大阪の村長", reward: 490 }, { name: "o_van entertainment", reward: 14862 },
    { name: "ken", reward: 5561 }, { name: "EMANON Entertainment Odakei", reward: 11694 },
    { name: "EMANON Entertainment Miguel", reward: 381 }, { name: "EMANON Entertainment DJMARU", reward: 3226 },
    { name: "EMANON Entertainment CHIHA", reward: 77369 }, { name: "EMANON Entertainment", reward: 303481 },
    { name: "DAIKI EMANON Entertainment", reward: 6622 }, { name: "Bridge Stars Entertainment Japan", reward: 1051760 },
  ],
};

// ── HUPPY ──────────────────────────────────────────────────
function Huppy({ data }) {
  const [hTab, setHTab] = useState("summary");
  const [liveRecs, setLiveRecs] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddLive, setShowAddLive] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);
  const [editLive, setEditLive] = useState(null);
  const curMonth = new Date().toISOString().slice(0, 7);
  const blankLive = { creator_name: "", tiktok_username: "", year_month: curMonth, diamonds: "", live_count: "", live_hours: "", reward_yen: "", notes: "" };
  const blankSale = { channel: "tiktok_shop", product_name: "", amount: "", quantity: "1", sale_date: new Date().toISOString().split("T")[0], notes: "" };
  const [nLive, setNLive] = useState(blankLive);
  const [nSale, setNSale] = useState(blankSale);
  const [vitaTarget, setVitaTarget] = useState(300000);
  const VITA_PRODUCTS = ["ROYALHONEY VIP 1P","VITAMAX ENERGYHONEY FOR MEN","VITAMAX ENERGYHONEY FOR HER","VITAMAX ENERGYCOFFEE FOR MEN","VITAMAX ENERGYCOFFEE FOR HER","ROYALHONEY VIP PREMIUM 1P","キングハニーVIP 1箱12袋","キングハニーVIP 2箱24袋","キングハニーVIP 3箱36袋","キングハニーVIP 4箱48袋","キングハニーVIP 5箱60袋"];

  useEffect(() => { fetchHData(); }, []);

  async function fetchHData() {
    setLoading(true);
    const [{ data: lr }, { data: sl }] = await Promise.all([
      supabase.from("foopy_live_records").select("*").order("year_month", { ascending: false }),
      supabase.from("foopy_sales").select("*").order("sale_date", { ascending: false })
    ]);
    if (lr) setLiveRecs(lr);
    if (sl) setSales(sl);
    setLoading(false);
  }

  async function saveLive() {
    const rec = { ...nLive, diamonds: parseInt(nLive.diamonds)||0, live_count: parseInt(nLive.live_count)||0, live_hours: parseFloat(nLive.live_hours)||0, reward_yen: parseInt(nLive.reward_yen)||0 };
    if (editLive) {
      await supabase.from("foopy_live_records").update(rec).eq("id", editLive.id);
      setEditLive(null);
    } else {
      await supabase.from("foopy_live_records").insert(rec);
    }
    setShowAddLive(false); setNLive(blankLive); fetchHData();
  }

  async function deleteLive(id) {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("foopy_live_records").delete().eq("id", id);
    fetchHData();
  }

  async function saveSale() {
    await supabase.from("foopy_sales").insert({ ...nSale, amount: parseInt(nSale.amount)||0, quantity: parseInt(nSale.quantity)||1 });
    setShowAddSale(false); setNSale(blankSale); fetchHData();
  }

  async function deleteSale(id) {
    if (!window.confirm("削除しますか？")) return;
    await supabase.from("foopy_sales").delete().eq("id", id);
    fetchHData();
  }

  const thisMonthLive = liveRecs.filter(r => r.year_month === curMonth);
  const liveReward = thisMonthLive.reduce((s, r) => s + (r.reward_yen || 0), 0);
  const liveDiamonds = thisMonthLive.reduce((s, r) => s + (r.diamonds || 0), 0);
  const tktMonthly = sales.filter(s => s.channel === "tiktok_shop" && (s.sale_date||"").startsWith(curMonth)).reduce((s, r) => s + (r.amount||0), 0);
  const vitaSales = sales.filter(s => s.channel === "vitamax");
  const vitaMonthly = vitaSales.filter(s => (s.sale_date||"").startsWith(curMonth)).reduce((s, r) => s + (r.amount||0), 0);
  const ecMonthly = sales.filter(s => s.channel !== "tiktok_shop" && s.channel !== "vitamax" && (s.sale_date||"").startsWith(curMonth)).reduce((s, r) => s + (r.amount||0), 0);
  const totalMonthly = liveReward + tktMonthly + ecMonthly + vitaMonthly;

  const CHANNELS = { tiktok_shop: "TikTokショップ", base: "BASE", shopify: "Shopify", stores: "STORES", rakuten: "楽天", amazon: "Amazon", vitamax: "VITAMAX公式", other: "その他" };
  const CHAN_COLOR = { tiktok_shop: "#ff2d55", base: "#e07a5f", shopify: "#96bf48", stores: "#00b4d8", rakuten: "#bf0000", amazon: "#ff9900", vitamax: "#16a34a", other: "#9333ea" };

  const allMonths = [...new Set([...liveRecs.map(r => r.year_month), ...sales.map(s => (s.sale_date||"").slice(0,7))].filter(Boolean))].sort();
  const monthlyChart = allMonths.map(m => ({
    month: m.slice(5) + "月",
    LIVE: liveRecs.filter(r => r.year_month === m).reduce((s, r) => s + (r.reward_yen||0), 0),
    TikTok: sales.filter(s => s.channel === "tiktok_shop" && (s.sale_date||"").startsWith(m)).reduce((s, r) => s + (r.amount||0), 0),
    VITAMAX: sales.filter(s => s.channel === "vitamax" && (s.sale_date||"").startsWith(m)).reduce((s, r) => s + (r.amount||0), 0),
    EC: sales.filter(s => s.channel !== "tiktok_shop" && s.channel !== "vitamax" && (s.sale_date||"").startsWith(m)).reduce((s, r) => s + (r.amount||0), 0),
  }));

  const inp = { padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" };
  const hBtn = (color, active) => ({ padding: "6px 14px", background: active ? color : "#f1f5f9", color: active ? "#fff" : "#64748b", border: "none", borderRadius: 20, cursor: "pointer", fontWeight: 600, fontSize: 13 });
  const actBtn = (color) => ({ padding: "7px 16px", background: color, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <Card title="今月合計売上" value={`¥${(totalMonthly/10000).toFixed(1)}万`} color="#9333ea" icon="🎵" />
        <Card title="🎁 LIVEギフト報酬" value={`¥${(liveReward/10000).toFixed(1)}万`} sub={`${liveDiamonds.toLocaleString()}💎`} color="#a855f7" icon="💎" />
        <Card title="🛒 TikTokショップ" value={`¥${(tktMonthly/10000).toFixed(1)}万`} color="#ff2d55" icon="🛒" />
        <Card title="📦 ECサイト" value={`¥${(ecMonthly/10000).toFixed(1)}万`} color="#f59e0b" icon="📦" />
        <Card title="🛍️ VITAMAX公式" value={`¥${(vitaMonthly/10000).toFixed(1)}万`} sub={vitaTarget > 0 ? `目標: ${Math.round(vitaMonthly/vitaTarget*100)}%` : ""} color="#16a34a" icon="🛍️" />
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {[["summary","📊 サマリー"],["live","🎁 LIVEギフト"],["tkt","🛒 TikTokショップ"],["ec","📦 ECサイト"],["vitamax","🛍️ VITAMAX"],["partner","🤝 パートナー"]].map(([id, label]) => (
          <button key={id} onClick={() => setHTab(id)} style={hBtn(id==="vitamax" ? "#16a34a" : "#9333ea", hTab===id)}>{label}</button>
        ))}
      </div>

      {hTab === "summary" && (
        <Section title="月次推移（売上内訳）" color="#9333ea">
          {monthlyChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={v => `${(v/10000).toFixed(0)}万`} />
                <Tooltip formatter={v => `¥${v.toLocaleString()}`} />
                <Bar dataKey="LIVE" fill="#a855f7" radius={[0,0,0,0]} name="LIVEギフト" stackId="a" />
                <Bar dataKey="TikTok" fill="#ff2d55" radius={[0,0,0,0]} name="TikTokショップ" stackId="a" />
                <Bar dataKey="VITAMAX" fill="#16a34a" radius={[0,0,0,0]} name="VITAMAX公式" stackId="a" />
                <Bar dataKey="EC" fill="#f59e0b" radius={[4,4,0,0]} name="ECサイト" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>データを入力すると月次グラフが表示されます</div>
          )}
        </Section>
      )}

      {hTab === "live" && (() => {
        const plChart = EMANON_PL.map(d => ({
          month: d.label.split("/")[1] + "月",
          全体報酬: d.revenue,
          支払合計: d.payment,
          粗利益: d.grossProfit,
          純利益: d.netProfit,
        }));
        const totalRev = EMANON_PL.reduce((s, d) => s + d.revenue, 0);
        const totalProfit = EMANON_PL.reduce((s, d) => s + d.netProfit, 0);
        const totalGP = EMANON_PL.reduce((s, d) => s + d.grossProfit, 0);
        const avgProfit = Math.round(totalProfit / EMANON_PL.length);
        return (
          <div>
            <Section title="📈 EMANON 収支管理" color="#6366f1">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                <div style={{ flex: 1, minWidth: 140, background: "linear-gradient(135deg, #6366f1, #818cf8)", borderRadius: 12, padding: 16, color: "#fff" }}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>累計売上</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>¥{(totalRev/10000).toFixed(0)}万</div>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "linear-gradient(135deg, #10b981, #34d399)", borderRadius: 12, padding: 16, color: "#fff" }}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>累計純利益</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>¥{(totalProfit/10000).toFixed(0)}万</div>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "linear-gradient(135deg, #f59e0b, #fbbf24)", borderRadius: 12, padding: 16, color: "#fff" }}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>月平均利益</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>¥{(avgProfit/10000).toFixed(1)}万</div>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", borderRadius: 12, padding: 16, color: "#fff" }}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>粗利益率</div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{totalRev > 0 ? Math.round(totalGP/totalRev*100) : 0}%</div>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: "#4f46e5" }}>月次収支推移</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={plChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={v => `${(v/10000).toFixed(0)}万`} />
                  <Tooltip formatter={v => `¥${v.toLocaleString()}`} />
                  <Bar dataKey="全体報酬" fill="#818cf8" radius={[0,0,0,0]} stackId="b" />
                  <Bar dataKey="純利益" fill="#34d399" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>

              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 24, marginBottom: 10, color: "#4f46e5" }}>月別収支詳細</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#eef2ff" }}>
                      {["月", "全体報酬", "支払合計", "経費", "粗利益", "人件費", "純利益", "利益率"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: h === "月" ? "left" : "right", fontWeight: 700, color: "#4338ca", borderBottom: "2px solid #c7d2fe", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EMANON_PL.map((d, i) => (
                      <tr key={d.month} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                        <td style={{ padding: "7px 10px", fontWeight: 600, color: "#4f46e5" }}>{d.label}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right" }}>¥{d.revenue.toLocaleString()}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right" }}>¥{d.payment.toLocaleString()}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right" }}>¥{d.expenses.toLocaleString()}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right", color: "#059669", fontWeight: 600 }}>¥{d.grossProfit.toLocaleString()}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right" }}>¥{d.laborCost.toLocaleString()}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right", color: d.netProfit >= 0 ? "#059669" : "#dc2626", fontWeight: 700 }}>¥{d.netProfit.toLocaleString()}</td>
                        <td style={{ padding: "7px 10px", textAlign: "right", fontWeight: 600 }}>{d.revenue > 0 ? Math.round(d.netProfit/d.revenue*100) : 0}%</td>
                      </tr>
                    ))}
                    <tr style={{ background: "#eef2ff", fontWeight: 700 }}>
                      <td style={{ padding: "8px 10px", color: "#4338ca" }}>合計</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>¥{totalRev.toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>¥{EMANON_PL.reduce((s,d)=>s+d.payment,0).toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>¥{EMANON_PL.reduce((s,d)=>s+d.expenses,0).toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#059669" }}>¥{totalGP.toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>¥{EMANON_PL.reduce((s,d)=>s+d.laborCost,0).toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#059669" }}>¥{totalProfit.toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right" }}>{totalRev > 0 ? Math.round(totalProfit/totalRev*100) : 0}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ fontWeight: 700, fontSize: 15, marginTop: 24, marginBottom: 10, color: "#4f46e5" }}>エンターテイナー別報酬（直近月）</div>
              {(() => {
                const latestMonth = EMANON_PL[EMANON_PL.length - 1].month;
                const entertainers = EMANON_ENTERTAINERS[latestMonth] || [];
                const sorted = [...entertainers].sort((a,b) => b.reward - a.reward);
                const maxReward = sorted.length > 0 ? sorted[0].reward : 1;
                return (
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{EMANON_PL[EMANON_PL.length-1].label} の報酬内訳</div>
                    {sorted.map(e => (
                      <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 200, fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
                        <div style={{ flex: 1, background: "#e0e7ff", borderRadius: 4, height: 16, overflow: "hidden" }}>
                          <div style={{ width: `${(e.reward/maxReward*100)}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #818cf8)", borderRadius: 4 }} />
                        </div>
                        <div style={{ width: 100, textAlign: "right", fontSize: 12, fontWeight: 600, color: "#4f46e5" }}>¥{e.reward.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Section>
          </div>
        );
      })()}

      {hTab === "live" && (
        <Section title="🎁 LIVEギフト売上管理" color="#a855f7">
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => { setEditLive(null); setNLive(blankLive); setShowAddLive(true); }} style={actBtn("#a855f7")}>+ クリエイター追加</button>
          </div>
          {showAddLive && (
            <div style={{ background: "#faf5ff", border: "1px solid #d8b4fe", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>クリエイター名 *</div><input style={inp} value={nLive.creator_name} onChange={e => setNLive(p => ({...p, creator_name: e.target.value}))} placeholder="例：みい" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>TikTok ID</div><input style={inp} value={nLive.tiktok_username} onChange={e => setNLive(p => ({...p, tiktok_username: e.target.value}))} placeholder="@username" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>年月 *</div><input style={inp} type="month" value={nLive.year_month} onChange={e => setNLive(p => ({...p, year_month: e.target.value}))} /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>ダイヤモンド数</div><input style={inp} type="number" value={nLive.diamonds} onChange={e => setNLive(p => ({...p, diamonds: e.target.value}))} placeholder="0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>LIVE回数</div><input style={inp} type="number" value={nLive.live_count} onChange={e => setNLive(p => ({...p, live_count: e.target.value}))} placeholder="0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>LIVE時間</div><input style={inp} type="number" step="0.1" value={nLive.live_hours} onChange={e => setNLive(p => ({...p, live_hours: e.target.value}))} placeholder="0.0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>報酬（円）*</div><input style={inp} type="number" value={nLive.reward_yen} onChange={e => setNLive(p => ({...p, reward_yen: e.target.value}))} placeholder="0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>メモ</div><input style={inp} value={nLive.notes} onChange={e => setNLive(p => ({...p, notes: e.target.value}))} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveLive} style={actBtn("#a855f7")}>{editLive ? "更新" : "保存"}</button>
                <button onClick={() => { setShowAddLive(false); setEditLive(null); }} style={actBtn("#94a3b8")}>キャンセル</button>
              </div>
            </div>
          )}
          {loading ? <div style={{ color: "#94a3b8", padding: 20 }}>読み込み中...</div> : (
            <Table
              headers={["年月", "クリエイター", "TikTok ID", "💎 ダイヤ", "LIVE回数", "LIVE時間", "報酬（円）", "メモ", "操作"]}
              rows={liveRecs.map(r => [
                <span style={{ fontWeight: 600, color: "#7c3aed" }}>{r.year_month}</span>,
                r.creator_name,
                r.tiktok_username || "—",
                (r.diamonds||0).toLocaleString(),
                r.live_count || 0,
                r.live_hours || 0,
                <span style={{ color: "#7c3aed", fontWeight: 600 }}>¥{(r.reward_yen||0).toLocaleString()}</span>,
                r.notes || "—",
                <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => { setEditLive(r); setNLive({...r, diamonds: String(r.diamonds||""), live_count: String(r.live_count||""), live_hours: String(r.live_hours||""), reward_yen: String(r.reward_yen||"")}); setShowAddLive(true); }} style={{ padding: "2px 8px", background: "#f3e8ff", color: "#7c3aed", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>✏️</button>
                  <button onClick={() => deleteLive(r.id)} style={{ padding: "2px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>{"🗑"}</button>
                </div>
              ])}
            />
          )}
          {liveRecs.length === 0 && !loading && <div style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>データがありません。「クリエイター追加」から入力してください</div>}
        </Section>
      )}

      {hTab === "tkt" && (
        <Section title="🛒 TikTokショップ売上" color="#ff2d55">
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => { setNSale({ channel: "tiktok_shop", product_name: "", amount: "", quantity: "1", sale_date: new Date().toISOString().split("T")[0], notes: "" }); setShowAddSale(true); }} style={actBtn("#ff2d55")}>+ 売上追加</button>
          </div>
          {showAddSale && hTab === "tkt" && (
            <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>商品名</div><input style={inp} value={nSale.product_name} onChange={e => setNSale(p => ({...p, product_name: e.target.value}))} placeholder="商品名" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>売上金額（円）*</div><input style={inp} type="number" value={nSale.amount} onChange={e => setNSale(p => ({...p, amount: e.target.value}))} placeholder="0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>数量</div><input style={inp} type="number" value={nSale.quantity} onChange={e => setNSale(p => ({...p, quantity: e.target.value}))} /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>日付 *</div><input style={inp} type="date" value={nSale.sale_date} onChange={e => setNSale(p => ({...p, sale_date: e.target.value}))} /></div>
                <div style={{ gridColumn: "span 2" }}><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>メモ</div><input style={inp} value={nSale.notes} onChange={e => setNSale(p => ({...p, notes: e.target.value}))} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveSale} style={actBtn("#ff2d55")}>保存</button>
                <button onClick={() => setShowAddSale(false)} style={actBtn("#94a3b8")}>キャンセル</button>
              </div>
            </div>
          )}
          {loading ? <div style={{ color: "#94a3b8", padding: 20 }}>読み込み中...</div> : (
            <Table
              headers={["日付", "商品名", "売上金額", "数量", "メモ", "操作"]}
              rows={sales.filter(s => s.channel === "tiktok_shop").map(s => [
                s.sale_date,
                s.product_name || "—",
                <span style={{ color: "#e11d48", fontWeight: 600 }}>¥{(s.amount||0).toLocaleString()}</span>,
                s.quantity,
                s.notes || "—",
                <button onClick={() => deleteSale(s.id)} style={{ padding: "2px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>{"🗑"}</button>
              ])}
            />
          )}
          {sales.filter(s => s.channel === "tiktok_shop").length === 0 && !loading && <div style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>TikTokショップの売上データがありません</div>}
        </Section>
      )}

      {hTab === "ec" && (
        <Section title="📦 ECサイト売上" color="#f59e0b">
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => { setNSale({ channel: "base", product_name: "", amount: "", quantity: "1", sale_date: new Date().toISOString().split("T")[0], notes: "" }); setShowAddSale(true); }} style={actBtn("#f59e0b")}>+ 売上追加</button>
          </div>
          {showAddSale && hTab === "ec" && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>チャネル *</div>
                  <select style={inp} value={nSale.channel} onChange={e => setNSale(p => ({...p, channel: e.target.value}))}>
                    <option value="base">BASE</option><option value="shopify">Shopify</option><option value="stores">STORES</option><option value="rakuten">楽天</option><option value="amazon">Amazon</option><option value="other">その他</option>
                  </select>
                </div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>商品名</div><input style={inp} value={nSale.product_name} onChange={e => setNSale(p => ({...p, product_name: e.target.value}))} placeholder="商品名" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>売上金額（円）*</div><input style={inp} type="number" value={nSale.amount} onChange={e => setNSale(p => ({...p, amount: e.target.value}))} placeholder="0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>日付 *</div><input style={inp} type="date" value={nSale.sale_date} onChange={e => setNSale(p => ({...p, sale_date: e.target.value}))} /></div>
                <div style={{ gridColumn: "span 2" }}><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>メモ</div><input style={inp} value={nSale.notes} onChange={e => setNSale(p => ({...p, notes: e.target.value}))} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveSale} style={actBtn("#f59e0b")}>保存</button>
                <button onClick={() => setShowAddSale(false)} style={actBtn("#94a3b8")}>キャンセル</button>
              </div>
            </div>
          )}
          {loading ? <div style={{ color: "#94a3b8", padding: 20 }}>読み込み中...</div> : (
            <Table
              headers={["日付", "チャネル", "商品名", "売上金額", "メモ", "操作"]}
              rows={sales.filter(s => s.channel !== "tiktok_shop" && s.channel !== "vitamax").map(s => [
                s.sale_date,
                <Badge label={CHANNELS[s.channel] || s.channel} color={CHAN_COLOR[s.channel] || "#9333ea"} />,
                s.product_name || "—",
                <span style={{ color: "#d97706", fontWeight: 600 }}>¥{(s.amount||0).toLocaleString()}</span>,
                s.notes || "—",
                <button onClick={() => deleteSale(s.id)} style={{ padding: "2px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>{"🗑"}</button>
              ])}
            />
          )}
          {sales.filter(s => s.channel !== "tiktok_shop" && s.channel !== "vitamax").length === 0 && !loading && <div style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>ECサイトの売上データがありません</div>}
        </Section>
      )}

      {hTab === "vitamax" && (
        <Section title="🛍️ VITAMAX公式サイト管理" color="#16a34a">
          {/* クイックリンク */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <a href="https://vitamax-asia.com/wp-admin/admin.php?page=wc-reports" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "#16a34a", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>📊 WC注文確認</a>
            <a href="https://vitamax-asia.com/wp-admin/post-new.php?post_type=product" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "#15803d", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>+ 商品登録</a>
            <a href="https://vitamax-asia.com" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "#dcfce7", color: "#16a34a", border: "1px solid #86efac", borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>🌐 サイト確認</a>
            <a href="https://vitamax-asia.com/wp-admin/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac", borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>WP管理画面</a>
          </div>
          {/* 月次目標トラッカー */}
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>🎯 今月目標 vs 実績</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>月次目標:</span>
                <input type="number" value={vitaTarget} onChange={e => setVitaTarget(parseInt(e.target.value)||0)} style={{ width: 120, padding: "4px 8px", border: "1px solid #86efac", borderRadius: 6, fontSize: 13 }} step="10000" />
                <span style={{ fontSize: 12 }}>円</span>
              </div>
            </div>
            <div style={{ background: "#d1fae5", borderRadius: 8, height: 18, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ width: `${Math.min(100, vitaTarget > 0 ? vitaMonthly/vitaTarget*100 : 0)}%`, height: "100%", background: vitaMonthly >= vitaTarget ? "#15803d" : "#16a34a", borderRadius: 8, transition: "width 0.5s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ fontWeight: 700, color: "#16a34a" }}>¥{vitaMonthly.toLocaleString()}</span>
              <span style={{ color: "#64748b" }}>/ ¥{vitaTarget.toLocaleString()} ({vitaTarget > 0 ? Math.round(vitaMonthly/vitaTarget*100) : 0}%){vitaMonthly >= vitaTarget ? " 🎉目標達成！" : ""}</span>
            </div>
          </div>
          {/* 売上追加 */}
          <div style={{ marginBottom: 12 }}>
            <button onClick={() => { setNSale({ channel: "vitamax", product_name: "", amount: "", quantity: "1", sale_date: new Date().toISOString().split("T")[0], notes: "" }); setShowAddSale(true); }} style={{ padding: "7px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ 売上追加</button>
          </div>
          {showAddSale && hTab === "vitamax" && (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>商品名</div>
                  <input style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" }} list="vita-products" value={nSale.product_name} onChange={e => setNSale(p => ({...p, product_name: e.target.value}))} placeholder="商品を選択または直接入力" />
                  <datalist id="vita-products">{VITA_PRODUCTS.map(p => <option key={p} value={p} />)}</datalist>
                </div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>売上金額（円）*</div><input style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" }} type="number" value={nSale.amount} onChange={e => setNSale(p => ({...p, amount: e.target.value}))} placeholder="0" /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>数量</div><input style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" }} type="number" value={nSale.quantity} onChange={e => setNSale(p => ({...p, quantity: e.target.value}))} /></div>
                <div><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>日付 *</div><input style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" }} type="date" value={nSale.sale_date} onChange={e => setNSale(p => ({...p, sale_date: e.target.value}))} /></div>
                <div style={{ gridColumn: "span 2" }}><div style={{ fontSize: 12, marginBottom: 4, color: "#64748b" }}>メモ</div><input style={{ padding: "6px 10px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" }} value={nSale.notes} onChange={e => setNSale(p => ({...p, notes: e.target.value}))} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveSale} style={{ padding: "7px 16px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>保存</button>
                <button onClick={() => setShowAddSale(false)} style={{ padding: "7px 16px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>キャンセル</button>
              </div>
            </div>
          )}
          {/* 商品別実績 */}
          {vitaSales.length > 0 && (() => {
            const prodMap = {};
            vitaSales.forEach(s => { const k = s.product_name || "その他"; prodMap[k] = (prodMap[k]||0) + (s.amount||0); });
            const sorted = Object.entries(prodMap).sort((a,b) => b[1]-a[1]);
            return (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "#15803d" }}>📦 商品別売上実績</div>
                {sorted.map(([name, total]) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{name}</span>
                    <span style={{ fontWeight: 700, color: "#16a34a" }}>¥{total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            );
          })()}
          {/* 売上一覧 */}
          {loading ? <div style={{ color: "#94a3b8", padding: 20 }}>読み込み中...</div> : (
            <Table
              headers={["日付", "商品名", "売上金額", "数量", "メモ", "操作"]}
              rows={vitaSales.map(s => [
                s.sale_date,
                s.product_name || "—",
                <span style={{ color: "#16a34a", fontWeight: 600 }}>¥{(s.amount||0).toLocaleString()}</span>,
                s.quantity,
                s.notes || "—",
                <button onClick={() => deleteSale(s.id)} style={{ padding: "2px 8px", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>{"🗑"}</button>
              ])}
            />
          )}
          {vitaSales.length === 0 && !loading && <div style={{ textAlign: "center", color: "#94a3b8", padding: 30 }}>VITAMAX公式の売上データがありません。「売上追加」から入力してください</div>}
        </Section>
      )}

      {hTab === "partner" && (
        <Section title="🤝 パートナー・案件管理" color="#9333ea">
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
      )}
    </div>
  );
}

// ── TODAY TASKS ─────────────────────────────────────────────
function Today({ data, setData }) {
  const [reminders, setReminders] = useState([]);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const soon = new Date(Date.now() + 7*86400000).toISOString().split("T")[0];
    supabase.from("contacts").select("id,company_name,next_action,status").not("next_action","is",null).lte("next_action", soon).order("next_action", { ascending: true }).limit(30)
      .then(({ data: rows }) => { if (rows) setReminders(rows); });
  }, []);

  function toggle(id) {
    setData(d => ({ ...d, tasks: d.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) }));
  }
  const done = data.tasks.filter(t=>t.done).length;
  const pct = Math.round(done/data.tasks.length*100);
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

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
      {/* ── 次回アクション リマインダー ── */}
      {reminders.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>🔔 企業コンタクト アクション予定</h3>
          {reminders.map(r => {
            const isOver = r.next_action < today;
            const isToday = r.next_action === today;
            const isTomorrow = r.next_action === tomorrow;
            const bg = isOver ? "#fff7f7" : isToday ? "#fffbeb" : "#f0fdf4";
            const bd = isOver ? "#fca5a5" : isToday ? "#fde68a" : "#bbf7d0";
            const icon = isOver ? "🔴" : isToday ? "🟡" : "🟢";
            const label = isOver ? "期限切れ" : isToday ? "本日" : isTomorrow ? "明日" : `${r.next_action}`;
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, marginBottom: 6, background: bg, border: `1px solid ${bd}` }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontWeight: 700, color: "#1e3a5f", flex: 1, fontSize: 13 }}>{r.company_name}</span>
                <Badge label={r.status} color={STATUS_COLOR[r.status] || "#94a3b8"} />
                <span style={{ fontSize: 12, color: isOver ? "#ef4444" : isToday ? "#f59e0b" : "#16a34a", fontWeight: 700, whiteSpace: "nowrap" }}>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MAIL TEMPLATE MODAL ──────────────────────────────────────
function MailTemplateModal({ contact, templates, onClose }) {
  const [selected, setSelected] = useState(Object.keys(templates)[0]);
  const [copied, setCopied] = useState(false);
  const text = templates[selected](contact);
  function copy() {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 520, maxWidth: "90vw", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "#1e3a5f", fontSize: 15 }}>📧 メールテンプレート — {contact.company_name}</div>
        <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8" }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {Object.keys(templates).map(k => (
          <button key={k} onClick={() => setSelected(k)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid", fontSize: 12, cursor: "pointer", fontWeight: selected === k ? 700 : 400, background: selected === k ? "#2563eb" : "#f8fafc", color: selected === k ? "#fff" : "#475569", borderColor: selected === k ? "#2563eb" : "#e2e8f0" }}>{k}</button>
        ))}
      </div>
      <textarea readOnly value={text} style={{ flex: 1, minHeight: 240, padding: 12, borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "inherit", resize: "none", color: "#1e293b", background: "#f8fafc" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={copy} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: copied ? "#22c55e" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{copied ? "✅ コピー完了！" : "📋 クリップボードにコピー"}</button>
        <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, cursor: "pointer" }}>閉じる</button>
      </div>
    </div>
  );
}

// ── LOGIN ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (user === "sej.nishizaki@gmail.com" && pass === "Sb098098") {
      sessionStorage.setItem("crm_auth", "1");
      onLogin();
    } else {
      setErr("ユーザー名またはパスワードが違います");
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "48px 40px", width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1e3a5f" }}>UCHIWA_CRM</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>月収100万円達成ダッシュボード</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>メールアドレス</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              placeholder="メールアドレスを入力"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>パスワード</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              placeholder="パスワードを入力"
            />
          </div>
          {err && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{err}</div>}
          <button
            type="submit"
            style={{ width: "100%", padding: "12px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────
const STORAGE_KEY = "uchiwa_crm_data";

function loadLocalData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return INIT;
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [data, setData] = useState(loadLocalData);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | syncing | ok | error
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("crm_auth") === "1");

  const isShare = new URLSearchParams(window.location.search).get("view") === "share";

  // 初回マウント: Supabaseから全データをロード（シェアビューはスキップ）
  useEffect(() => {
    if (isShare) { setReady(true); return; }
    (async () => {
      const { data: row } = await supabase
        .from("app_snapshot").select("data").eq("id", 1).single();
      if (row?.data) setData(row.data);
      setReady(true);
    })();
  }, []);

  // localStorage 保存（シェアビューはスキップ）
  useEffect(() => {
    if (!ready || isShare) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
  }, [data, ready]);

  // Supabase 全データ同期（シェアビューはスキップ）
  useEffect(() => {
    if (!ready || isShare) return;
    let cancelled = false;
    (async () => {
      setSyncStatus("syncing");
      const { error } = await supabase.from("app_snapshot").upsert({
        id: 1, data, updated_at: new Date().toISOString(),
      });
      if (!cancelled) setSyncStatus(error ? "error" : "ok");
      if (!cancelled) setTimeout(() => setSyncStatus("idle"), 3000);
    })();
    return () => { cancelled = true; };
  }, [data, ready]);

  // シェアビュー判定（Hooksの後）
  if (isShare) return <ShareView />;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabContent = {
    dashboard: <Dashboard data={data} />,
    kimero: <Kimero data={data} setData={setData} />,
    smile: <Smile data={data} setData={setData} />,
    huppy: <Huppy data={data} />,
    tasks: <Today data={data} setData={setData} />,
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Hiragino Sans', 'Yu Gothic', -apple-system, sans-serif", background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 40%, #fff5f5 70%, #f0fdf4 100%)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @media (max-width: 768px) {
          .crm-tabs { overflow-x: auto; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; }
          .crm-tabs button { flex-shrink: 0; white-space: nowrap; }
          .crm-section { padding: 10px !important; }
          .crm-form-row { flex-direction: column !important; }
          .crm-header-title { font-size: 14px !important; }
          .crm-card-row { gap: 8px !important; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #a5b4fc; }
        .crm-tab-btn:hover { background: rgba(99,102,241,0.08) !important; }
      `}</style>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", padding: "16px 28px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid rgba(226,232,240,0.6)", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: -0.5, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>UCHIWA_CRM</div>
          <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 1, fontWeight: 500 }}>月収100万円達成ダッシュボード</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          {syncStatus === "syncing" && <span style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 600 }}>⏳ 同期中...</span>}
          {syncStatus === "ok" && <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>✓ 同期完了</span>}
          {syncStatus === "error" && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>⚠ 同期エラー</span>}
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(226,232,240,0.4)", padding: "0 28px", display: "flex", gap: 2, overflowX: "auto" }}>
        {TABS.map(t => (
          <button className="crm-tab-btn" key={t.id} onClick={() => setTab(t.id)} style={{ padding: "14px 18px", background: tab === t.id ? "rgba(99,102,241,0.1)" : "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? "#6366f1" : "#64748b", borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent", whiteSpace: "nowrap", borderRadius: "8px 8px 0 0", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {tabContent[tab]}
      </div>
    </div>
  );
}
