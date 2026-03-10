import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SeekerManagement, JobPostingManagement } from "./SeekerJobManager";

// ââ Supabase ââââââââââââââââââââââââââââââââââââââââââââââââââ
const SUPABASE_URL = "https://tghjsquavgavtymsyknb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGpzcXVhdmdhdnR5bXN5a25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM5MTEsImV4cCI6MjA4ODU2OTkxMX0.7y5zxa3LJam6utP5OLjEdTYTQ5RjJ6lRRQWkm1aWO5g";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ââ Initial Data âââââââââââââââââââââââââââââââââââââââââââââ
const INIT = {
  kimero: {
    contacts: [
      { id: 1, company: "æ ªå¼ä¼ç¤¾ãµã³ãã«A", person: "ç°ä¸­é¨é·", contact: "03-1234-5678", type: "äººææ´¾é£", prefecture: "æ±äº¬é½", city: "æ¸è°·åº", status: "åè«ä¸­", jobStatus: "æ±äººãã", date: "2026-03-06", nextAction: "2026-03-15", note: "3åæ´¾é£å¸æ" },
      { id: 2, company: "ååä¼ç¤¾ãµã³ãã«B", person: "é´æ¨ç¤¾é·", contact: "", type: "è·æ¥­ç´¹ä»", prefecture: "å¤§éªåº", city: "å¤§éªå¸ååº", status: "ææ¡æ¸", jobStatus: "ç¢ºèªä¸­", date: "2026-03-07", nextAction: "", note: "å¶æ¥­è·1åç´¹ä»å¸æ" },
      { id: 3, company: "æ ªå¼ä¼ç¤¾ãµã³ãã«C", person: "ä½è¤èª²é·", contact: "090-0000-1111", type: "æ¥­åå§è¨", prefecture: "æ±äº¬é½", city: "æ°å®¿åº", status: "ååã³ã³ã¿ã¯ã", jobStatus: "ç¢ºèªä¸­", date: "2026-03-08", nextAction: "", note: "ã·ã¹ãã éçºæ¡ä»¶" },
    ],
    seekers: [
      { id: 1, name: "å±±ç°ä¸é", skill: "å¶æ¥­ã»è²©å£²", status: "æ´»åä¸­", desired: "æ­£ç¤¾å¡", note: "çµé¨5å¹´" },
      { id: 2, name: "ä¼è¤è±å­", skill: "äºåã»ç®¡ç", status: "ãããã³ã°ä¸­", desired: "æ´¾é£", note: "PCæä½å¾æ" },
    ],
    monthlyRevenue: [
      { month: "3æ", target: 300000, actual: 0 },
      { month: "4æ", target: 600000, actual: 0 },
      { month: "5æ", target: 1000000, actual: 0 },
      { month: "6æ", target: 1500000, actual: 0 },
    ],
    kpi: [
      { id: 1, name: "æ°è¦ã¯ã©ã¤ã¢ã³ãéæ", target: 20, actual: 3, unit: "ä»¶", period: "ææ¬¡", category: "RAå¶æ¥­", icon: "ð¢" },
      { id: 2, name: "æ±äººæ¡ä»¶ç²å¾æ°", target: 10, actual: 1, unit: "ä»¶", period: "ææ¬¡", category: "RAå¶æ¥­", icon: "ð" },
      { id: 3, name: "ææ¡ã»éå®¢æ°", target: 15, actual: 2, unit: "ä»¶", period: "ææ¬¡", category: "RAå¶æ¥­", icon: "ð¤" },
      { id: 4, name: "æ±è·èç»é²æ°", target: 10, actual: 2, unit: "äºº", period: "ææ¬¡", category: "CA", icon: "ð¤" },
      { id: 5, name: "æ±è·èé¢è«æ°", target: 15, actual: 0, unit: "ä»¶", period: "ææ¬¡", category: "CA", icon: "ð¤" },
      { id: 6, name: "ãããã³ã°æç«æ°", target: 5, actual: 0, unit: "ä»¶", period: "ææ¬¡", category: "ææ", icon: "â" },
      { id: 7, name: "æç´ã»åå®æ°", target: 3, actual: 0, unit: "ä»¶", period: "ææ¬¡", category: "ææ", icon: "ð¯" },
      { id: 8, name: "ææ¬¡å£²ä¸", target: 300000, actual: 0, unit: "å", period: "ææ¬¡", category: "å£²ä¸", icon: "ð°" },
    ],
  },
  smile: {
    sales: [
      { id: 1, date: "2026-03-06", staff: "é·æ²¼ãè§ç°", shoku: 46, cash: 11050, paypay: 36100 },
      { id: 2, date: "2026-03-07", staff: "é·æ²¼", shoku: 38, cash: 9500, paypay: 28000 },
      { id: 3, date: "2026-03-08", staff: "è§ç°", shoku: 41, cash: 10200, paypay: 31000 },
    ],
    clients: [
      { id: 1, name: "åè£ï¼è¿é£Aç¤¾", type: "ä¼æ¥­å¼å½", status: "æªã¢ãã­ã¼ã", meals: 50, note: "" },
      { id: 2, name: "åè£ï¼Bç¦ç¥æ½è¨­", type: "æ½è¨­åã", status: "æªã¢ãã­ã¼ã", meals: 80, note: "" },
    ],
  },
  huppy: {
    revenue: [
      { month: "1æ", total: 980000, personal: 210000 },
      { month: "2æ", total: 1050000, personal: 230000 },
      { month: "3æ", total: 1100000, personal: 240000 },
    ],
    partners: [
      { id: 1, name: "ãã¼ããã¼A", type: "ã¿ã¤ã¢ãã", status: "äº¤æ¸ä¸­", value: "30ä¸å", note: "" },
      { id: 2, name: "ãã©ã³ãB", type: "ã¹ãã³ãµã¼", status: "æè¨ºæ¸", value: "50ä¸å", note: "" },
    ],
  },
  tasks: [
    { id: 1, text: "ãã­ã¡ã­ãæ°è¦ã³ã³ã¿ã¯ã3ä»¶", biz: "ã­ã¡ã­", done: false },
    { id: 2, text: "ãã¹ãã¤ã«ãæ³äººææ¡1ä»¶", biz: "ã¹ãã¤ã«", done: false },
    { id: 3, text: "ããã¼ãã¼ãSNSæç¨¿", biz: "ãã¼ãã¼", done: false },
    { id: 4, text: "å¤ã®æ¯ãè¿ãï¼5åï¼", biz: "åäºº", done: false },
  ],
};

const STATUS_COLOR = {
  "ååã³ã³ã¿ã¯ã": "#94a3b8", "ææ¡æ¸": "#60a5fa", "åè«ä¸­": "#f59e0b",
  "å¥ç´æ¸": "#22c55e", "å¤±æ³¨": "#ef4444",
  "æ´»åä¸­": "#60a5fa", "ãããã³ã°ä¸­": "#f59e0b", "æç´æ¸": "#22c55e",
  "æªã¢ãã­ã¼ã": "#94a3b8", "äº¤æ¸ä¸­": "#f59e0b", "æè¨ºæ¸": "#60a5fa",
};
const BIZ_COLOR = { ã­ã¡ã­: "#2563eb", ã¹ãã¤ã«: "#16a34a", ãã¼ãã¼: "#9333ea", åäºº: "#f59e0b" };
const CAT_COLOR = { "RAå¶æ¥­": "#2563eb", "CA": "#9333ea", "ææ": "#22c55e", "å£²ä¸": "#f59e0b" };
const JOB_STATUS_COLOR = { "æ±äººãã": "#16a34a", "æ±äººãªã": "#94a3b8", "ç¢ºèªä¸­": "#f59e0b" };
const PREFECTURES = ["åæµ·é","éæ£®ç","å²©æç","å®®åç","ç§ç°ç","å±±å½¢ç","ç¦å³¶ç","è¨åç","æ æ¨ç","ç¾¤é¦¬ç","å¼çç","åèç","æ±äº¬é½","ç¥å¥å·ç","æ°æ½ç","å¯å±±ç","ç³å·ç","ç¦äºç","å±±æ¢¨ç","é·éç","å²éç","éå²¡ç","æç¥ç","ä¸éç","æ»è³ç","äº¬é½åº","å¤§éªåº","åµåº«ç","å¥è¯ç","åæ­å±±ç","é³¥åç","å³¶æ ¹ç","å²¡å±±ç","åºå³¶ç","å±±å£ç","å¾³å³¶ç","é¦å·ç","æåªç","é«ç¥ç","ç¦å²¡ç","ä½è³ç","é·å´ç","çæ¬ç","å¤§åç","å®®å´ç","é¹¿åå³¶ç","æ²ç¸ç"];
function extractPrefecture(addr) {
  if (!addr) return "";
  for (const p of PREFECTURES) { if (addr.startsWith(p)) return p; }
  return "";
}
function extractCity(addr, pref) {
  if (!addr || !pref) return "";
  const rest = addr.slice(pref.length);
  const m = rest.match(/^([^\dï¼-ï¼a-zA-ï¼¡-ï¼º]+(?:å¸|åº|çº|æ))/);
  return m ? m[1] : rest.split(/[\dï¼-ï¼]/)[0] || "";
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

// ââ SHARE VIEWï¼ä»è¤ããå°ç¨ã»èª­ã¿åãå°ç¨ï¼ ââââââââââââââââââââ
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
        èª­ã¿è¾¼ã¿ä¸­...
      </div>
    );
  }

  if (!snap || !snap.kimero?.kpi || snap.kimero.kpi.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "'Hiragino Sans', Arial, sans-serif", color: "#64748b", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 40 }}>ð</div>
        <div>ãã¼ã¿æºåä¸­ã§ãããã°ãããå¾ã¡ãã ããã</div>
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
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>ð ã­ã¡ã­ã³ã¹ã¡ é²æããã·ã¥ãã¼ã</div>
          <div style={{ color: "#93c5fd", fontSize: 12, marginTop: 4, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span>{new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}</span>
            {lastUpdated && <span>æçµæ´æ°: {lastUpdated.toLocaleString("ja-JP")}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {/* å¨ä½éæç */}
        <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginBottom: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600, marginBottom: 8 }}>ä»æã®ç·åéæç</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: overallPct >= 80 ? "#22c55e" : overallPct >= 50 ? "#f59e0b" : "#ef4444", lineHeight: 1 }}>
            {overallPct}%
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 10, height: 14, margin: "16px 0 8px", overflow: "hidden" }}>
            <div style={{ width: `${overallPct}%`, height: "100%", background: overallPct >= 80 ? "#22c55e" : overallPct >= 50 ? "#f59e0b" : "#ef4444", borderRadius: 10, transition: "width 0.6s" }} />
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{kpi.length}é ç®ã®KPIãè¿½è·¡ä¸­</div>
        </div>

        {/* ã«ãã´ãªå¥ãµããªã¼ */}
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

        {/* KPIè©³ç´° */}
        {categories.map(cat => (
          <Section key={cat} title={`${cat} KPI`} color={CAT_COLOR[cat] || "#2563eb"}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {kpi.filter(k => k.category === cat).map(k => {
                const pct = k.target > 0 ? Math.min(100, Math.round((k.actual / k.target) * 100)) : 0;
                const color = pct >= 100 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
                const isMoney = k.unit === "å";
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
                      <span style={{ color: "#64748b" }}>å®ç¸¾: <strong style={{ color }}>{isMoney ? `Â¥${k.actual.toLocaleString()}` : `${k.actual}${k.unit}`}</strong></span>
                      <span style={{ color: "#94a3b8" }}>ç®æ¨: {isMoney ? `Â¥${k.target.toLocaleString()}` : `${k.target}${k.unit}`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        ))}

        {/* æ±è·èãã¤ãã©ã¤ã³ */}
        {seekers.length > 0 && (
          <Section title="ð¤ æ±è·èãã¤ãã©ã¤ã³" color="#9333ea">
            <Table
              headers={["æ°å", "ã¹ã­ã«ã»çµé¨", "ã¹ãã¼ã¿ã¹", "å¸æå½¢æ", "ã¡ã¢"]}
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

        {/* ä¼æ¥­ã³ã³ã¿ã¯ã */}
        {contacts.length > 0 && (
          <Section title="ð¢ ä¼æ¥­ã³ã³ã¿ã¯ã" color="#2563eb">
            <Table
              headers={["ä¼ç¤¾å", "æå½è", "ç¨®å¥", "ã¹ãã¼ã¿ã¹", "æ¥ä»"]}
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
          UCHIWA_CRM â ã­ã¡ã­ã³ã¹ã¡ é²æã¬ãã¼ãï¼èª­ã¿åãå°ç¨ï¼
        </div>
      </div>
    </div>
  );
}

// ââ KPI PANEL ââââââââââââââââââââââââââââââââââââââââââââââââ
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
            <Card key={cat} title={`${cat} éæç`} value={`${avgPct}%`}
              sub={`${items.length}KPI`} color={CAT_COLOR[cat] || "#64748b"} icon={
                cat === "RAå¶æ¥­" ? "ð¢" : cat === "CA" ? "ð¤" : cat === "ææ" ? "ð¯" : "ð°"
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
              const isMoneyKPI = k.unit === "å";
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
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>å®ç¸¾</div>
                      {editing?.id === k.id && editing?.field === "actual" ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                            autoFocus style={{ width: 80, padding: "3px 6px", borderRadius: 6, border: "2px solid #2563eb", fontSize: 13, fontWeight: 700 }} />
                          <button onClick={saveEdit} style={{ padding: "3px 8px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>â</button>
                        </div>
                      ) : (
                        <div onClick={() => startEdit(k.id, "actual", k.actual)}
                          style={{ fontSize: 22, fontWeight: 800, color, cursor: "pointer", display: "flex", alignItems: "baseline", gap: 2 }} title="ã¯ãªãã¯ãã¦ç·¨é">
                          {isMoneyKPI ? `Â¥${k.actual.toLocaleString()}` : i.actual}
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>{!isMoneyKPI && k.unit}</span>
                          <span style={{ fontSize: 11, color: "#cbd5e1", marginLeft: 4 }}>âï¸</span>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color, opacity: 0.15 }}>/</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2 }}>ç®æ¨</div>
                      {editing?.id === k.id && editing?.field === "target" ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <input type="number" value={editVal} onChange={e => setEditVal(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                            autoFocus style={{ width: 80, padding: "3px 6px", borderRadius: 6, border: "2px solid #94a3b8", fontSize: 13 }} />
                          <button onClick={saveEdit} style={{ padding: "3px 8px", background: "#64748b", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>â</button>
                        </div>
                      ) : (
                        <div onClick={() => startEdit(k.id, "target", k.target)}
                          style={{ fontSize: 16, fontWeight: 700, color: "#64748b", cursor: "pointer" }} title="ã¯ãªãã¯ãã¦ç®æ¨ãç·¨é">
                          {isMoneyKPI ? `Â¥${k.target.toLocaleString()}` : `${k.target}${k.unit}`}
                          <span style={{ fontSize: 11, color: "#cbd5e1", marginLeft: 4 }}>âï¸</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: color + "22", borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color }}>{pct}%</div>
                      <div style={{ fontSize: 10, color: "#94a3b8" }}>éæç</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      ))}
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginTop: 8, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
        ð¡ å®ç¸¾ã»ç®æ¨ã®æ°å­ãã¯ãªãã¯ããã¨ç·¨éã§ãã¾ã
      </div>
    </div>
  );
}

// ââ COMPANY LIST ââââââââââââââââââââââââââââââââââââââââââââ
const CONTACT_STATUS_OPTIONS = ["æªã¢ãã­ã¼ã", "ã¢ãã­ã¼ãæ¸", "åè«ä¸­", "æç´", "è¦éã"];
const JOB_STATUS_OPTIONS = ["è¦ç¢ºèª", "æ±äººãã", "æ±äººãªã", "ç¢ºèªæ¸"];
const CONTACT_STATUS_COLOR = {
  "æªã¢ãã­ã¼ã": "#94a3b8", "ã¢ãã­ã¼ãæ¸": "#60a5fa", "åè«ä¸­": "#f59e0b", "æç´": "#22c55e", "è¦éã": "#ef4444",
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

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>â³ èª­ã¿è¾¼ã¿ä¸­...</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#1e3a5f" }}>ð¢ ä¼æ¥­ãªã¹ã</div>
        <div style={{ background: "#dbeafe", color: "#1d4ed8", borderRadius: 12, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
          {filtered.length}ä»¶ / å¨{companies.length}ä»¶
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="ð ç¤¾åã»ä½æã§æ¤ç´¢..."
          style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, width: 220, outline: "none" }}
        />
        <select
          value={filterIndustry}
          onChange={e => { setFilterIndustry(e.target.value); setPage(0); }}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569", background: "#fff" }}
        >
          <option value="">æ¥­ç¨®ï¼å¨ã¦ï¼</option>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <select
          value={filterContact}
          onChange={e => { setFilterContact(e.target.value); setPage(0); }}
          style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#475569", background: "#fff" }}
        >
          <option value="">ã¢ãã­ã¼ãç¶æ³ï¼å¨ã¦ï¼</option>
          {CONTACT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {(search || filterIndustry || filterContact) && (
          <button onClick={() => { setSearch(""); setFilterIndustry(""); setFilterContact(""); setPage(0); }}
            style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            â ã¯ãªã¢
          </button>
        )}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
              {["ç¤¾å", "æ¥­ç¨®ï¼å¤§ï¼", "æ¥­ç¨®ï¼å°ï¼", "ç´¹ä»å®ç¸¾", "æ±äººç¶æ³", "ã¢ãã­ã¼ãç¶æ³", "ã¡ã¢", "æä½"].map(h => (
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
                      <a href={c.website} target="_blank" rel="noreferrer" style={{ marginLeft: 6, fontSize: 10, color: "#60a5fa" }}>ð</a>
                    )}
                    {c.phone && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{c.phone}</div>}
                  </td>
                  <td style={{ padding: "9px 12px", color: "#475569", whiteSpace: "nowrap" }}>{c.industry_major || "â"}</td>
                  <td style={{ padding: "9px 12px", color: "#64748b", whiteSpace: "nowrap" }}>{c.industry_minor || "â"}</td>
                  <td style={{ padding: "9px 12px", textAlign: "center" }}>
                    {c.referral_record === "â" ? <span style={{ color: "#22c55e", fontWeight: 700 }}>â</span> : <span style={{ color: "#cbd5e1" }}>â</span>}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    {isEditing ? (
                      <select value={editRow.job_status} onChange={e => setEditRow(r => ({ ...r, job_status: e.target.value }))}
                        style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}>
                        {JOB_STATUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <span style={{ fontSize: 11, color: "#475569" }}>{c.job_status || "è¦ç¢ºèª"}</span>
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
                        {c.contact_status || "æªã¢ãã­ã¼ã"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px", maxWidth: 200 }}>
                    {isEditing ? (
                      <input value={editRow.notes} onChange={e => setEditRow(r => ({ ...r, notes: e.target.value }))}
                        style={{ width: "100%", padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 12 }}
                        placeholder="ã¡ã¢ãå¥å..." />
                    ) : (
                      <span style={{ color: "#64748b", fontSize: 11 }}>{c.notes || ""}</span>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                    {isEditing ? (
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => saveEdit(c.id)} disabled={saving}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          {saving ? "â¦" : "ä¿å­"}
                        </button>
                        <button onClick={cancelEdit}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 11, cursor: "pointer" }}>
                          â
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: 4, flexWrap: "nowrap" }}>
                        <button onClick={() => startEdit(c)}
                          style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", fontSize: 11, cursor: "pointer" }}>
                          ç·¨é
                        </button>
                        {onAddContact && (
                          <button onClick={() => onAddContact(c)}
                            style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                            ï¼ã³ã³ã¿ã¯ã
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
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page === 0 ? "#f1f5f9" : "#fff", color: page === 0 ? "#cbd5e1" : "#475569", cursor: page === 0 ? "default" : "pointer", fontSize: 12 }}>Â«</button>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page === 0 ? "#f1f5f9" : "#fff", color: page === 0 ? "#cbd5e1" : "#475569", cursor: page === 0 ? "default" : "pointer", fontSize: 12 }}>â¹</button>
          <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{page + 1} / {totalPages}ãã¼ã¸</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page >= totalPages - 1 ? "#f1f5f9" : "#fff", color: page >= totalPages - 1 ? "#cbd5e1" : "#475569", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 12 }}>âº</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: page >= totalPages - 1 ? "#f1f5f9" : "#fff", color: page >= totalPages - 1 ? "#cbd5e1" : "#475569", cursor: page >= totalPages - 1 ? "default" : "pointer", fontSize: 12 }}>Â»</button>
        </div>
      )}
    </div>
  );
}

// ââ TABS ââââââââââââââââââââââââââââââââââââââââââââââââââââ
const TABS = [
  { id: "dashboard", label: "ð ããã·ã¥ãã¼ã" },
  { id: "kimero", label: "ð ã­ã¡ã­ã³ã¹ã¡" },
  { id: "smile", label: "ð± ã¹ãã¤ã«&ããªãã·ã¥" },
  { id: "huppy", label: "ðµ ãã¼ãã¼" },
  { id: "tasks", label: "ð¥ TODAY" },
];

// ââ DASHBOARD ââââââââââââââââââââââââââââââââââââââââââââââ
function Dashboard({ data }) {
  const smileMonthly = data.smile.sales.reduce((s, d) => s + d.cash + d.paypay, 0);
  const huppyCurrent = data.huppy.revenue[data.huppy.revenue.length - 1];
  const kimeroDeals = data.kimero.contacts.filter(c => c.status === "åè«ä¸­").length;
  const taskDone = data.tasks.filter(t => t.done).length;
  const taskTotal = data.tasks.length;
  const kpiAvg = Math.round(
    data.kimero.kpi.reduce((s, k) => s + Math.min(100, k.target > 0 ? (k.actual / k.target) * 100 : 0), 0) / data.kimero.kpi.length
  );
  const bizData = [
    { name: "ãã¼ãã¼", å£²ä¸: huppyCurrent.total, åäººå ±é¬: huppyCurrent.personal },
    { name: "ã¹ãã¤ã«", å£²ä¸: smileMonthly, åäººå ±é¬: 0 },
    { name: "ã­ã¡ã­", å£²ä¸: 0, åäººå ±é¬: 0 },
  ];
  const goalData = [
    { name: "ãã¼ãã¼", ç¾å¨: huppyCurrent.personal, ç®æ¨: 500000 },
    { name: "ã­ã¡ã­", ç¾å¨: 0, ç®æ¨: 400000 },
    { name: "ã¹ãã¤ã«", ç¾å¨: 0, ç®æ¨: 150000 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1e293b" }}>å¨ç¤¾ããã·ã¥ãã¼ã</h2>
        <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>æå100ä¸åéæã­ã¼ãããã</p>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <Card title="åäººå ±é¬åè¨ï¼ä»æï¼" value={`${((huppyCurrent.personal)/10000).toFixed(0)}ä¸å`} sub="ç®æ¨ï¼100ä¸å" color="#2563eb" icon="ð°" />
        <Card title="ãã¼ãã¼å£²ä¸" value={`${(huppyCurrent.total/10000).toFixed(0)}ä¸å`} sub={`åäººå ±é¬ ${(huppyCurrent.personal/10000).toFixed(0)}ä¸å`} color="#9333ea" icon="ðµ" />
        <Card title="ã­ã¡ã­ åè«ä¸­" value={`${kimeroDeals}ä»¶`} sub="æç´ç®æ¨ï¼æ3ä»¶" color="#f59e0b" icon="ð" />
        <Card title="ã¹ãã¤ã«ä»æå£²ä¸" value={`${(smileMonthly/10000).toFixed(1)}ä¸å`} sub={`${data.smile.sales.reduce((s,d)=>s+d.shoku,0)}é£ / ${data.smile.sales.length}æ¥`} color="#16a34a" icon="ð±" />
        <Card title="ã­ã¡ã­ KPIéæç" value={`${kpiAvg}%`} sub={`${data.kimero.kpi.length}KPIè¿½è·¡ä¸­`} color={kpiAvg >= 80 ? "#22c55e" : kpiAvg >= 50 ? "#f59e0b" : "#ef4444"} icon="ð¯" />
        <Card title="ä»æ¥ã®TASKéæ" value={`${taskDone}/${taskTotal}`} sub={`${Math.round(taskDone/taskTotal*100)}%`} color="#ef4444" icon="ð¥" />
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)", marginBottom: 20 }}>
        <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>ð ã­ã¡ã­ã³ã¹ã¡ KPIé²æï¼ä»æï¼</h4>
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
                  {k.unit === "å" ? `Â¥${k.actual.toLocaleString()} / Â¥${k.target.toLocaleString()}` : `${k.actual} / ${k.target}${k.unit}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>äºæ¥­å¥å£²ä¸ï¼ä»æï¼</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bizData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/10000).toFixed(0)}ä¸`} />
              <Tooltip formatter={v => `Â¥${v.toLocaleString()}`} />
              <Bar dataKey="å£²ä¸" fill="#2563eb" radius={[4,4,0,0]} />
              <Bar dataKey="åäººå ±é¬" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
          <h4 style={{ margin: "0 0 16px", fontSize: 13, color: "#475569", fontWeight: 700 }}>ç®æ¨éæç</h4>
          {goalData.map(g => {
            const pct = Math.min(100, Math.round(g.ç¾å¨ / g.ç®æ¨ * 100));
            return (
              <div key={g.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{g.name}</span>
                  <span style={{ color: "#64748b" }}>Â¥{g.ç¾å¨.toLocaleString()} / Â¥{g.ç®æ¨.toLocaleString()}</span>
                </div>
                <div style={{ background: "#f1f5f9", borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: BIZ_COLOR[g.name === "ãã¼ãã¼" ? "ãã¼ãã¼" : g.name === "ã­ã¡ã­" ? "ã­ã¡ã­" : "ã¹ãã¤ã«"] || "#2563eb", borderRadius: 6 }} />
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

// ââ KIMERO âââââââââââââââââââââââââââââââââââââââââââââââââ
function Kimero({ data, setData }) {
  const [tab, setTab] = useState("kpi");
  const EMPTY_FORM = { company_id: null, company: "", person: "", contact: "", type: "äººææ´¾é£", prefecture: "", city: "", status: "ååã³ã³ã¿ã¯ã", jobStatus: "ç¢ºèªä¸­", date: new Date().toISOString().split("T")[0], nextAction: "", note: "" };
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

  const statusCount = ["ååã³ã³ã¿ã¯ã","ææ¡æ¸","åè«ä¸­","å¥ç´æ¸"].map(s => ({
    status: s, count: contacts.filter(c => c.status === s).length
  }));

  const usedPrefs = [...new Set(contacts.map(c => c.prefecture).filter(Boolean))].sort();

  const today = new Date().toISOString().split("T")[0];
  const filtered = contacts.filter(c => {
    const ms = !search || (c.company_name||"").includes(search) || (c.person||"").includes(search) || (c.contact_info||"").includes(search);
    return ms && (!filterPref || c.prefecture === filterPref) && (!filterType || c.type === filterType) && (!filterStatus || c.status === filterStatus) && (!filterJob || c.job_status === filterJob);
  });
  const sorted = [...filtered].sort((a, b) => {
    if (a.next_action && b.next_action) return a.next_action.localeCompare(b.next_action);
    if (a.next_action) return -1;
    if (b.next_action) return 1;
    return (b.contact_date || b.created_at || "").localeCompare(a.contact_date || a.created_at || "");
  });

  const inp = (extra) => ({ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, ...extra });
  const sel = { padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 };
  const lbl = { fontSize: 11, color: "#64748b", marginBottom: 4 };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {statusCount.map(s => (
          <Card key={s.status} title={s.status} value={`${s.count}ä»¶`} color={STATUS_COLOR[s.status] || "#64748b"} icon="" />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["kpi","contacts","seekers","jobs","revenue","companies"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12, background: tab === t ? "#2563eb" : "#f1f5f9", color: tab === t ? "#fff" : "#475569" }}>
            {t === "kpi" ? "ð¯ KPIç®¡ç" : t === "contacts" ? "ð¢ ä¼æ¥­ã³ã³ã¿ã¯ã" : t === "seekers" ? "ð¤ æ±è·èç®¡ç" : t === "jobs" ? "ð æ±äººæ¡ä»¶" : t === "revenue" ? "ð å£²ä¸æ¨ç§»" : "ð¢ ä¼æ¥­ãªã¹ã"}
          </button>
        ))}
      </div>
      {tab === "kpi" && <KpiPanel kpi={data.kimero.kpi} setData={setData} />}
      {tab === "contacts" && (
        <Section title="ä¼æ¥­ã³ã³ã¿ã¯ãç®¡ç" color="#2563eb">
          {/* ââ æ°è¦è¿½å ãã©ã¼ã  ââ */}
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 10 }}>ï¼ æ°è¦ã³ã³ã¿ã¯ãè¿½å </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
              {/* ä¼ç¤¾åï¼ãµã¸ã§ã¹ãï¼ */}
              <div style={{ position: "relative" }}>
                <div style={lbl}>ä¼ç¤¾å * <span style={{ color: "#93c5fd", fontSize: 10 }}>â ä¼æ¥­ãªã¹ãããåè£è¡¨ç¤º</span></div>
                <input value={form.company} onChange={e => handleCompanyInput(e.target.value)} onBlur={() => setTimeout(() => setSuggestions([]), 150)} placeholder="ä¼ç¤¾åãå¥å..." style={inp({ width: 200 })} />
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
              <div><div style={lbl}>æå½èå</div><input value={form.person} onChange={e => setForm(f=>({...f,person:e.target.value}))} placeholder="ç°ä¸­é¨é·" style={inp({ width: 110 })} /></div>
              <div><div style={lbl}>é£çµ¡å</div><input value={form.contact} onChange={e => setForm(f=>({...f,contact:e.target.value}))} placeholder="03-xxxx-xxxx" style={inp({ width: 140 })} /></div>
              <div><div style={lbl}>ç¨®å¥</div>
                <select value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} style={sel}>
                  {["äººææ´¾é£","è·æ¥­ç´¹ä»","æ¥­åå§è¨","BPO"].map(t => <option key={t}>{t}</option>)}
                </select></div>
              <div><div style={lbl}>é½éåºç <span style={{ color: "#93c5fd", fontSize: 10 }}>èªåå¥å</span></div>
                <input value={form.prefecture} onChange={e => setForm(f=>({...f,prefecture:e.target.value}))} placeholder="æ±äº¬é½" style={inp({ width: 90 })} /></div>
              <div><div style={lbl}>å¸åºçºæ</div><input value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))} placeholder="æ¸è°·åº" style={inp({ width: 100 })} /></div>
              <div><div style={lbl}>ã¹ãã¼ã¿ã¹</div>
                <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))} style={sel}>
                  {["ååã³ã³ã¿ã¯ã","ææ¡æ¸","åè«ä¸­","å¥ç´æ¸","å¤±æ³¨"].map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><div style={lbl}>æ±äººç¶æ³</div>
                <select value={form.jobStatus} onChange={e => setForm(f=>({...f,jobStatus:e.target.value}))} style={sel}>
                  {["ç¢ºèªä¸­","æ±äººãã","æ±äººãªã"].map(s => <option key={s}>{s}</option>)}
                </select></div>
              <div><div style={lbl}>æ¥ä»</div><input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} style={inp({})} /></div>
              <div><div style={lbl}>æ¬¡åã¢ã¯ã·ã§ã³æ¥ ð</div><input type="date" value={form.nextAction} onChange={e => setForm(f=>({...f,nextAction:e.target.value}))} style={inp({})} /></div>
              <div><div style={lbl}>ã¡ã¢</div><input value={form.note} onChange={e => setForm(f=>({...f,note:e.target.value}))} placeholder="åè" style={inp({ width: 150 })} /></div>
              <button onClick={addContact} disabled={saving} style={{ padding: "7px 22px", background: saving ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: 13 }}>{saving ? "ä¿å­ä¸­..." : "è¿½å "}</button>
            </div>
          </div>
          {/* ââ ãã£ã«ã¿ã¼ãã¼ ââ */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 12, padding: "10px 14px", background: "#eff6ff", borderRadius: 8, border: "1px solid #bfdbfe" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>ð çµãè¾¼ã¿</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ä¼ç¤¾åã»æå½èã»é£çµ¡å" style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12, width: 170 }} />
            <select value={filterPref} onChange={e => setFilterPref(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
              <option value="">é½éåºç å¨ã¦</option>
              {usedPrefs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
              <option value="">ç¨®å¥ å¨ã¦</option>
              {["äººææ´¾é£","è·æ¥­ç´¹ä»","æ¥­åå§è¨","BPO"].map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
              <option value="">ã¹ãã¼ã¿ã¹ å¨ã¦</option>
              {["ååã³ã³ã¿ã¯ã","ææ¡æ¸","åè«ä¸­","å¥ç´æ¸","å¤±æ³¨"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterJob} onChange={e => setFilterJob(e.target.value)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #bfdbfe", fontSize: 12 }}>
              <option value="">æ±äººç¶æ³ å¨ã¦</option>
              {["ç¢ºèªä¸­","æ±äººãã","æ±äººãªã"].map(s => <option key={s}>{s}</option>)}
            </select>
            {(search||filterPref||filterType||filterStatus||filterJob) && (
              <button onClick={() => { setSearch(""); setFilterPref(""); setFilterType(""); setFilterStatus(""); setFilterJob(""); }} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #fca5a5", background: "#fff7f7", color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>â ãªã»ãã</button>
            )}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748b", fontWeight: 600 }}>{sorted.length}ä»¶</span>
          </div>
          {/* ââ ã³ã³ã¿ã¯ãä¸è¦§ãã¼ãã« ââ */}
          {loadingContacts ? (
            <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>â³ èª­ã¿è¾¼ã¿ä¸­...</div>
          ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f1f5f9" }}>
                  {["ä¼ç¤¾å","æå½è","é£çµ¡å","ç¨®å¥","é½éåºç","å¸åºçºæ","ã¹ãã¼ã¿ã¹","æ±äººç¶æ³","æ¥ä»","æ¬¡åAK ð","ã¡ã¢"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748b", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => {
                  const isUrgent = c.next_action && c.next_action <= today;
                  const isSoon = c.next_action && c.next_action > today && c.next_action <= new Date(Date.now() + 3*86400000).toISOString().split("T")[0];
                  return (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: "#1e3a5f", whiteSpace: "nowrap" }}>{c.company_name}</td>
                      <td style={{ padding: "8px 10px", color: "#475569" }}>{c.person || "â"}</td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12 }}>{c.contact_info || "â"}</td>
                      <td style={{ padding: "8px 10px" }}><Badge label={c.type || "â"} color="#2563eb" /></td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12 }}>{c.prefecture || "â"}</td>
                      <td style={{ padding: "8px 10px", color: "#475569", fontSize: 12 }}>{c.city || "â"}</td>
                      <td style={{ padding: "8px 10px" }}><Badge label={c.status} color={STATUS_COLOR[c.status] || "#94a3b8"} /></td>
                      <td style={{ padding: "8px 10px" }}>{c.job_status ? <Badge label={c.job_status} color={JOB_STATUS_COLOR[c.job_status] || "#94a3b8"} /> : "â"}</td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 12, whiteSpace: "nowrap" }}>{c.contact_date || "â"}</td>
                      <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                        {c.next_action
                          ? <span style={{ color: isUrgent ? "#ef4444" : isSoon ? "#f59e0b" : "#2563eb", fontWeight: isUrgent || isSoon ? 700 : 400, fontSize: 12 }}>{isUrgent ? "ð´ " : isSoon ? "ð¡ " : ""}{c.next_action}</span>
                          : <span style={{ color: "#cbd5e1" }}>â</span>}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#64748b", fontSize: 12, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notes || "â"}</td>
                    </tr>
                  );
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={11} style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>è©²å½ããã³ã³ã¿ã¯ããããã¾ãã</td></tr>
                )}
              </tbody>
            </table>
          </div>
          )}
        </Section>
      )}
      {tab === "seekers" && <SeekerManagement />}
      {tab === "jobs" && <JobPostingManagement />}
      {tab === "revenue" && (
        <Section title="å£²ä¸ç®æ¨ vs å®ç¸¾" color="#2563eb">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.kimero.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={v => `${(v/10000).toFixed(0)}ä¸`} />
              <Tooltip formatter={v => `Â¥${v.toLocaleString()}`} />
              <Bar dataKey="target" fill="#dbeafe" radius={[4,4,0,0]} name="ç®æ¨" />
              <Bar dataKey="actual" fill="#2563eb" radius={[4,4,0,0]} name="å®ç¸¾" />
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

// ââ SMILE ââââââââââââââââââââââââââââââââââââââââââââââââââ
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
        <Card title="ä»æåè¨å£²ä¸" value={`Â¥${(totalCash+totalPP).toLocaleString()}`} color="#16a34a" icon="ð´" />
        <Card title="ç¾éåè¨" value={`Â¥${totalCash.toLocaleString()}`} color="#16a34a" icon="ðµ" />
        <Card title="PayPayåè¨" value={`Â¥${totalPP.toLocaleString()}`} color="#0ea5e9" icon="ð±" />
        <Card title="åè¨é£æ°" value={`${totalShoku}é£`} color="#f59e0b" icon="ð±" />
        <Card title="æ³äººã¯ã©ã¤ã¢ã³ã" value={`${data.smile.clients.filter(c=>c.status==="å¥ç´æ¸").length}ç¤¾`} sub="ç®æ¨ï¼5ç¤¾" color="#9333ea" icon="ð¢" />
      </div>
      <Section title="å£²ä¸å ±åå¥åï¼LINEããè»¢è¨ï¼" color="#16a34a">
        <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 16, marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>æ¥ä»</div><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>ã¹ã¿ãã *</div><input value={form.staff} onChange={e=>setForm(f=>({...f,staff:e.target.value}))} placeholder="é·æ²¼ãè§ç°" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 130 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>é£æ°</div><input type="number" value={form.shoku} onChange={e=>setForm(f=>({...f,shoku:e.target.value}))} placeholder="46" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 70 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>ç¾é</div><input type="number" value={form.cash} onChange={e=>setForm(f=>({...f,cash:e.target.value}))} placeholder="11050" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 90 }} /></div>
          <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>PayPay</div><input type="number" value={form.paypay} onChange={e=>setForm(f=>({...f,paypay:e.target.value}))} placeholder="36100" style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 90 }} /></div>
          <button onClick={addSale} style={{ padding: "7px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>è¿½å </button>
        </div>
        <Table
          headers={["æ¥ä»", "ã¹ã¿ãã", "é£æ°", "ç¾é", "PayPay", "åè¨"]}
          rows={data.smile.sales.map(s => [
            s.date, s.staff, `${s.shoku}é£`,
            `Â¥${s.cash.toLocaleString()}`,
            `Â¥${s.paypay.toLocaleString()}`,
            <span style={{ fontWeight: 700, color: "#16a34a" }}>Â¥{(s.cash+s.paypay).toLocaleString()}</span>,
          ])}
        />
      </Section>
    </div>
  );
}

// ââ HUPPY ââââââââââââââââââââââââââââââââââââââââââââââââââ
function Huppy({ data }) {
  const latest = data.huppy.revenue[data.huppy.revenue.length - 1];
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <Card title="ä»æå£²ä¸" value={`Â¥${(latest.total/10000).toFixed(0)}ä¸`} color="#9333ea" icon="ðµ" />
        <Card title="åäººå ±é¬" value={`Â¥${(latest.personal/10000).toFixed(0)}ä¸`} sub="ç®æ¨ï¼40ã50ä¸å" color="#9333ea" icon="ð°" />
        <Card title="å ±é¬ç" value={`${Math.round(latest.personal/latest.total*100)}%`} sub="ç®æ¨ï¼40%+" color="#f59e0b" icon="ð" />
        <Card title="ãã¼ããã¼äº¤æ¸ä¸­" value={`${data.huppy.partners.filter(p=>p.status==="äº¤æ¸ä¸­").length}ä»¶`} color="#9333ea" icon="ð¤" />
      </div>
      <Section title="ææ¬¡æ¨ç§»" color="#9333ea">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.huppy.revenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={v => `${(v/10000).toFixed(0)}ä¸`} />
            <Tooltip formatter={v => `Â¥${v.toLocaleString()}`} />
            <Bar dataKey="total" fill="#e9d5ff" radius={[4,4,0,0]} name="å£²ä¸" />
            <Bar dataKey="personal" fill="#9333ea" radius={[4,4,0,0]} name="åäººå ±é¬" />
          </BarChart>
        </ResponsiveContainer>
      </Section>
      <Section title="ãã¼ããã¼ã»æ¡ä»¶ç®¡ç" color="#9333ea">
        <Table
          headers={["ãã¼ããã¼å", "ç¨®å¥", "ã¹ãã¼ã¿ã¹", "æ³å®éé¡", "ã¡ã¢"]}
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

// ââ TODAY TASKS âââââââââââââââââââââââââââââââââââââââââââââ
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
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>ð¥ ä»æ¥ã®TASK</h3>
          <span style={{ fontSize: 24, fontWeight: 800, color: pct === 100 ? "#22c55e" : "#2563eb" }}>{pct}%</span>
        </div>
        <div style={{ background: "#f1f5f9", borderRadius: 8, height: 12, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct===100 ? "#22c55e" : "#2563eb", borderRadius: 8, transition: "width 0.4s" }} />
        </div>
        {data.tasks.map(t => (
          <div key={t.id} onClick={() => toggle(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, marginBottom: 8, cursor: "pointer", background: t.done ? "#f0fdf4" : "#f8fafc", border: `1px solid ${t.done ? "#bbf7d0" : "#e2e8f0"}` }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${t.done ? "#22c55e" : "#cbd5e1"}`, background: t.done ? "#22c55e" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {t.done && <span style={{ color: "white", fontSize: 13, fontWeight: 800 }}>â</span>}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.done ? "#86efac" : "#1e293b", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
            <Badge label={t.biz} color={BIZ_COLOR[t.biz]} />
          </div>
        ))}
        {pct === 100 && (
          <div style={{ textAlign: "center", padding: 16, color: "#22c55e", fontWeight: 800, fontSize: 16 }}>ð ä»æ¥ã®ã¿ã¹ã¯å¨å®äºï¼ãç²ãæ§ã§ããï¼</div>
        )}
      </div>
    </div>
  );
}

// ââ LOGIN ââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
      setErr("ã¦ã¼ã¶ã¼åã¾ãã¯ãã¹ã¯ã¼ããéãã¾ã");
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: "48px 40px", width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1e3a5f" }}>UCHIWA_CRM</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>æå100ä¸åéæããã·ã¥ãã¼ã</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>ã¡ã¼ã«ã¢ãã¬ã¹</label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              placeholder="ã¡ã¼ã«ã¢ãã¬ã¹ãå¥å"
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>ãã¹ã¯ã¼ã</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              placeholder="ãã¹ã¯ã¼ããå¥å"
            />
          </div>
          {err && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 16, textAlign: "center" }}>{err}</div>}
          <button
            type="submit"
            style={{ width: "100%", padding: "12px", background: "#1e3a5f", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}
          >
            ã­ã°ã¤ã³
          </button>
        </form>
      </div>
    </div>
  );
}

// ââ APP ââââââââââââââââââââââââââââââââââââââââââââââââââââ
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

  // ååãã¦ã³ã: Supabaseããå¨ãã¼ã¿ãã­ã¼ãï¼ã·ã§ã¢ãã¥ã¼ã¯ã¹ã­cãï¼
  useEffect(() => {
    if (isShare) { setReady(true); return; }
    (async () => {
      const { data: row } = await supabase
        .from("app_snapshot").select("data").eq("id", 1).single();
      if (row?.data) setData(row.data);
      setReady(true);
    })();
  }, []);

  // localStorage ä¿å­ï¼ã·ã§ã¢ãã¥ã¼ã¯ã¹ã­cãûï"B\ÙQYXÝ


HOÂY
\XYH\ÔÚ\JH]\ÂHÈØØ[ÝÜYÙKÙ]][JÕÔQÑWÒÑVKÓÓÝ[ÚYJ]JJNÈHØ]Ú
JHßBKÙ]KXYWJNÂËÈÝ\X\ÙH9aj8àáøàï8à¯ùd#9§'ûï"8à­øà©øà¨¸àäøàéxàï8àkøà®xà«xààøàåûï"B\ÙQYXÝ


HOÂY
\XYH\ÔÚ\JH]\Â]Ø[Ù[YH[ÙNÂ
\Þ[È

HOÂÙ]Þ[ÔÝ]\ÊÞ[Ú[ÈNÂÛÛÝÈ\ÜHH]ØZ]Ý\X\ÙKÛJ\ÜÛ\ÚÝK\Ù\
ÂYK]K\]YØ]]È]J
KÒTÓÔÝ[Ê
KJNÂY
XØ[Ù[Y
HÙ]Þ[ÔÝ]\Ê\ÜÈ\ÜÚÈNÂY
XØ[Ù[Y
HÙ][Y[Ý]


HOÙ]Þ[ÔÝ]\ÊYHKÌ
NÂJJ
NÂ]\

HOÈØ[Ù[YHYNÈNÂKÙ]KXYWJNÂËÈ8à­øà©øà¨¸àäøàéxàï9b)9k¦»ï"ÛÚÜøàk¹o£;ï"BY
\ÔÚ\JH]\Ú\UY]ÈÏÂY
X]]Y
H]\ÙÚ[ØÜY[ÛÙÚ[^Ê
HOÙ]]]Y
YJ_HÏÂÛÛÝXÛÛ[HÂ\ÚØ\\ÚØ\]O^Ù]_HÏÚ[Y\ÎÚ[Y\È]O^Ù]_HÙ]]O^ÜÙ]]_HÏÛZ[NÛZ[H]O^Ù]_HÙ]]O^ÜÙ]]_HÏ\N\H]O^Ù]_HÏ\ÚÜÎÙ^H]O^Ù]_HÙ]]O^ÜÙ]]_HÏNÂ]\
]Ý[O^ÞÈÛ[Z[NÒ\YÚ[ÈØ[ÉË	Ö]HÛÝXÉË\X[Ø[Ë\Ù\YXÚÙÜÝ[ÙYYHZ[ZYÚL_O]Ý[O^ÞÈXÚÙÜÝ[ÌYLØMYY[ÎM\Ü^N^[YÛ][\ÎÙ[\Ø\MÞÚYÝÎØJH_O]]Ý[O^ÞÈÛÛÜÙÛÙZYÚÛÚ^NN]\ÜXÚ[ÎH_OPÒUÐWÐÔOÙ]]Ý[O^ÞÈÛÛÜÎLØÍYÛÚ^NLKX\Ú[ÜH_O¹§"9cãL9.!ùa¡º`e9¢$8àà8ààøà­øàéxàç8àï8àâOÙ]Ù]]Ý[O^ÞÈX\Ú[Y]]È\Ü^N^[YÛ][\ÎÙ[\Ø\L_OÜÞ[ÔÝ]\ÈOOHÞ[Ú[È	Ü[Ý[O^ÞÈÛÚ^NLKÛÛÜÎLØÍY_O¸£ìÈ9d#9§'ù.+KÜÜ[BÜÞ[ÔÝ]\ÈOOHÚÈ	Ü[Ý[O^ÞÈÛÚ^NLKÛÛÜÎ
YXÈ_O¸§$È9d#9§'ùk£9.¡ÜÜ[BÜÞ[ÔÝ]\ÈOOH\Ü	Ü[Ý[O^ÞÈÛÚ^NLKÛÛÜÙØMXMH_O¸¦¨9d#9§'øàª8àêxàïÜÜ[B]Ý[O^ÞÈÛÛÜÎLØÍYÛÚ^NL_OÛ]È]J
KÓØØ[Q]TÝ[ÊKRÈYX\[Y\XÈ[ÛÛÈ^N[Y\XÈÙYZÙ^NÚÜJ_OÙ]Ù]Ù]]Ý[O^ÞÈXÚÙÜÝ[ÙÜ\ÝÛN\ÛÛYÙLNY[Î\Ü^N^Ø\
Ý\ÝÖ]]È_OÕPËX\
O
]ÛÙ^O^ÝYHÛÛXÚÏ^Ê
HOÙ]XY
_HÝ[O^ÞÈY[ÎLMXÚÙÜÝ[ÛHÜ\ÛHÝ\ÛÜÚ[\ÛÚ^NLËÛÙZYÚ
ÛÛÜXOOHYÈÌMÙXÍ
ÍÜ\ÝÛNXOOHYÈÛÛYÌMÙXÛÛY[Ü\[Ú]TÜXÙNÝÜ\_OÝX[BØ]Û
J_BÙ]]Ý[O^ÞÈX^ÚYLLX\Ú[]]ÈY[Î_OÝXÛÛ[ÝX_BÙ]Ù]
NÂB
