import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

// ── SHARE VIEW（今藤さん専用・読み取り専用） ────────────────────
function ShareView() {
  const [snap, setSnap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5 * 60 * 1000);
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
    <div style={{ fontFamily: "'Hiragino Sans', 'Yu Gothic', Arial, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#1e3a5f", padding: "16px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>👔 キメロコスメ 進捗ダッシュボード</div>
          <div style={{ color: "#93c5fd", fontSize: 12, marginTop: 4, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</span>
            {lastUpdated && <span>最終更新: {lastUpdated.toLocaleString("ja-JP")}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {/* 全体達成率 */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", textAlign: "center" }}>
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
        {contacts.length > 0 && (
          <Section title="🏢 企業コンタクト" color="#2563eb">
            <Table
              headers={["会社名", "担当者", "種別", "ステータス", "日付"]}
              rows={contacts.map(c => [
                <span style={{ fontWeight: 600 }}>{c.company}</span>,
                c.person,
                <Badge label={c.type} color="#2563eb" />,
                <Badge label={c.status} color={STATUS_COLOR[c.status]} />,
                c.date,
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
                <div key={k.id} style={{ background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", border: `1px solid ${pct >= 100 ? "#bbf7d0" : "#e2e8f0"}` }}>
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
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginTop: 8, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
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

function CompanyList() {
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
        <div style={{ fontWeight: 800, fontSize: 18, color: "#1e3a5f" }}>🏢 企業リスト</div>
        <div style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 12, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
          {filtered.length}件 / 全{companies.length}件
        </div>
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

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
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
                      <button onClick={() => startEdit(c)}
                        style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 11, cursor: "pointer" }}>
                        編集
                      </button>
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
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>全社ダッシュボード</h2>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>月収100万円達成ロードマップ</p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <Card title="個人報酬合計（今月）" value={`${((huppyCurrent.personal)/10000).toFixed(0)}万円`} sub="目標：100万円" color="#2563eb" icon="💰" />
        <Card title="フーピー売上" value={`${(huppyCurrent.total/10000).toFixed(0)}万円`} sub={`個人報酬 ${(huppyCurrent.personal/10000).toFixed(0)}万円`} color="#9333ea" icon="🎵" />
        <Card title="キメロ 商談中" value={`${kimeroDeals}件`} sub="成約目標：月3件" color="#f59e0b" icon="👔" />
        <Card title="スマイル今月売上" value={`${(smileMonthly/10000).toFixed(1)}万円`} sub={`${data.smile.sales.reduce((s,d)=>s+d.shoku,0)}食 / ${data.smile.sales.length}日`} color="#16a34a" icon="🍱" />
        <Card title="キメロ KPI達成率" value={`${kpiAvg}%`} sub={`${data.kimero.kpi.length}KPI追跡中`} color={kpiAvg >= 80 ? "#22c55e" : kpiAvg >= 50 ? "#f59e0b" : "#ef4444"} icon="🎯" />
        <Card title="今日のTASK達成" value={`${taskDone}/${taskTotal}`} sub={`${Math.round(taskDone/taskTotal*100)}%`} color="#ef4444" icon="🔥" />
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 20 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>👔 キメロコスメ KPI進捗（今月）</h4>
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
  const EMPTY_FORM = { company: "", person: "", contact: "", type: "人材派遣", prefecture: "", city: "", status: "初回コンタクト", jobStatus: "確認中", date: new Date().toISOString().split("T")[0], nextAction: "", note: "" };
  const [form, setForm] = useState(EMPTY_FORM);
  const [suggestions, setSuggestions] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [filterPref, setFilterPref] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("companies").select("name, address").order("id", { ascending: true }).then(({ data: rows }) => {
      if (rows) setAllCompanies(rows);
    });
  }, []);

  function handleCompanyInput(val) {
    setForm(f => ({ ...f, company: val }));
    if (val.length >= 1) {
      setSuggestions(allCompanies.filter(c => c.name.includes(val)).slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }

  function selectCompany(c) {
    const pref = extractPrefecture(c.address || "");
    const city = extractCity(c.address || "", pref);
    setForm(f => ({ ...f, company: c.name, prefecture: pref, city }));
    setSuggestions([]);
  }

  function addContact() {
    if (!form.company) return;
    setData(d => ({ ...d, kimero: { ...d.kimero, contacts: [...d.kimero.contacts, { ...form, id: Date.now() }] } }));
    setForm(EMPTY_FORM);
    setSuggestions([]);
  }

  const statusCount = ["初回コンタクト","提案済","商談中","契約済"].map(s => ({
    status: s, count: data.kimero.contacts.filter(c => c.status === s).length
  }));

  const usedPrefs = [...new Set(data.kimero.contacts.map(c => c.prefecture).filter(Boolean))].sort();

  const today = new Date().toISOString().split("T")[0];
  const filtered = data.kimero.contacts.filter(c => {
    const ms = !search || c.company.includes(search) || (c.person||"").includes(search) || (c.contact||"").includes(search);
    return ms && (!filterPref || c.prefecture === filterPref) && (!filterType || c.type === filterType) && (!filterStatus || c.status === filterStatus) && (!filterJob || c.jobStatus === filterJob);
  });
  const sorted = [...filtered].sort((a, b) => {
    if (a.nextAction && b.nextAction) return a.nextAction.localeCompare(b.nextAction);
    if (a.nextAction) return -1;
    if (b.nextAction) return 1;
    return (b.date || "").localeCompare(a.date || "");
  });

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
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 10 }}>＋ 新規コンタクト追加</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
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
              <button onClick={addContact} style={{ padding: "7px 22px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>追加</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12, padding: "10px 14px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>🔍 絞り込み</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="会社名・担当者・連絡先" style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12, width: 170 }} />
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
            {(search||filterPref||filterType||filterStatus||filterJob) && (
              <button onClick={() => { setSearch(""); setFilterPref(""); setFilterType(""); setFilterStatus(""); setFilterJob(""); }} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fff7f7", color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>✕ リセット</button>
            )}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{sorted.length}件</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  {["会社名","担当者","連絡先","種別","都道府県","市区町村","ステータス","求人状況","日付","次回AK 🔔","メモ"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => {
                  const isUrgent = c.nextAction && c.nextAction <= today;
                  const isSoon = c.nextAction && c.nextAction > today && c.nextAction <= new Date(Date.now() + 3*86400000).toISOString().split("T")[0];
                  return (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "#1e3a5f", whiteSpace: "nowrap" }}>{c.company}</td>
                      <td style={{ padding: "8px 10px", color: "#475569" }}>{c.person || "—"}</td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12 }}>{c.contact || "—"}</td>
                      <td style={{ padding: "8px 10px" }}><Badge label={c.type || "—"} color="#2563eb" /></td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12 }}>{c.prefecture || "—"}</td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12 }}>{c.city || "—"}</td>
                      <td style={{ padding: "8px 10px" }}><Badge label={c.status} color={STATUS_COLOR[c.status] || "#94a3b8"} /></td>
                      <td style={{ padding: "8px 10px" }}>{c.jobStatus ? <Badge label={c.jobStatus} color={JOB_STATUS_COLOR[c.jobStatus] || "#94a3b8"} /> : "—"}</td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 12, whiteSpace: "nowrap" }}>{c.date || "—"}</td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        {c.nextAction
                          ? <span style={{ color: isUrgent ? "#ef4444" : isSoon ? "#f59e0b" : "#2563eb", fontWeight: isUrgent || isSoon ? 700 : 400, fontSize: 12 }}>{isUrgent ? "🔴 " : isSoon ? "🟡 " : ""}{c.nextAction}</span>
                          : <span style={{ color: "#cbd5e1" }}>—</span>}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 12, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.note || "—"}</td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={11} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>該当するコンタクトがありません</td></tr>
                )}
              </tbody>
            </table>
          </div>
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
      {tab === "companies" && <CompanyList />}
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
    <div style={{ fontFamily: "'Hiragino Sans', 'Yu Gothic', Arial, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ background: "#1e3a5f", padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>UCHIWA_CRM</div>
          <div style={{ color: "#93c5fd", fontSize: 11, marginTop: 1 }}>月収100万円達成ダッシュボード</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          {syncStatus === "syncing" && <span style={{ fontSize: 11, color: "#93c5fd" }}>⏳ 同期中...</span>}
          {syncStatus === "ok" && <span style={{ fontSize: 11, color: "#86efac" }}>✓ 同期完了</span>}
          {syncStatus === "error" && <span style={{ fontSize: 11, color: "#fca5a5" }}>⚠ 同期エラー</span>}
          <div style={{ color: "#93c5fd", fontSize: 12 }}>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: tab === t.id ? "#2563eb" : "#64748b", borderBottom: tab === t.id ? "2px solid #2563eb" : "2px solid transparent", whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {tabContent[tab]}
      </div>
    </div>
  );
}
