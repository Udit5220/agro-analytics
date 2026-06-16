import React, { useState, useEffect } from "react";
import {
  Archive,
  Calendar,
  Filter,
  Database,
  TrendingUp,
  ShieldAlert,
  Search,
  Clock,
  Bell,
  Download,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Info
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { callGeminiFlash } from "../../../services/geminiService";

// ------------------------------------------------------------------
// MOCK DATA (Historical Intelligence - India)
// ------------------------------------------------------------------

const HISTORICAL_DB = [
  { disease: "Rice Blast", state: "Punjab", crop: "Rice", season: "Kharif", area: "3,42,000 Ha", loss: "2.4M MT", year: 2024 },
  { disease: "Brown Plant Hopper", state: "Uttar Pradesh", crop: "Rice", season: "Kharif", area: "2,78,000 Ha", loss: "1.8M MT", year: 2024 },
  { disease: "Leaf Rust", state: "Maharashtra", crop: "Wheat", season: "Rabi", area: "1,89,000 Ha", loss: "1.1M MT", year: 2024 },
  { disease: "Yellow Mosaic", state: "Karnataka", crop: "Pulses", season: "Kharif", area: "1,67,000 Ha", loss: "0.8M MT", year: 2024 },
  { disease: "Rice Blast", state: "Odisha", crop: "Rice", season: "Kharif", area: "1,54,000 Ha", loss: "0.9M MT", year: 2023 },
  { disease: "Late Blight", state: "West Bengal", crop: "Potato", season: "Rabi", area: "1,12,000 Ha", loss: "0.5M MT", year: 2023 },
  { disease: "Yellow Mosaic", state: "Bihar", crop: "Pulses", season: "Kharif", area: "98,000 Ha", loss: "0.4M MT", year: 2023 },
  { disease: "Leaf Rust", state: "Madhya Pradesh", crop: "Wheat", season: "Rabi", area: "76,000 Ha", loss: "0.3M MT", year: 2023 },
  { disease: "Rice Blast", state: "Haryana", crop: "Rice", season: "Kharif", area: "1,24,000 Ha", loss: "0.8M MT", year: 2022 },
  { disease: "Brown Plant Hopper", state: "Odisha", crop: "Rice", season: "Kharif", area: "2,10,000 Ha", loss: "1.4M MT", year: 2022 },
  { disease: "Late Blight", state: "Uttar Pradesh", crop: "Potato", season: "Rabi", area: "84,000 Ha", loss: "0.3M MT", year: 2022 },
  { disease: "Yellow Mosaic", state: "Madhya Pradesh", crop: "Pulses", season: "Kharif", area: "1,18,000 Ha", loss: "0.6M MT", year: 2021 },
  { disease: "Leaf Rust", state: "Punjab", crop: "Wheat", season: "Rabi", area: "1,42,000 Ha", loss: "0.9M MT", year: 2021 },
  { disease: "Rice Blast", state: "Tamil Nadu", crop: "Rice", season: "Kharif", area: "92,000 Ha", loss: "0.5M MT", year: 2020 },
  { disease: "Brown Plant Hopper", state: "Andhra Pradesh", crop: "Rice", season: "Kharif", area: "1,76,000 Ha", loss: "1.1M MT", year: 2019 }
];

const TREND_MONTHLY = [
  { month: "Jan", Blast: 10, BPH: 5, Rust: 45 },
  { month: "Feb", Blast: 12, BPH: 8, Rust: 60 },
  { month: "Mar", Blast: 18, BPH: 12, Rust: 80 },
  { month: "Apr", Blast: 15, BPH: 10, Rust: 40 },
  { month: "May", Blast: 22, BPH: 25, Rust: 15 },
  { month: "Jun", Blast: 85, BPH: 65, Rust: 10 },
  { month: "Jul", Blast: 110, BPH: 95, Rust: 5 },
  { month: "Aug", Blast: 95, BPH: 120, Rust: 5 },
  { month: "Sep", Blast: 70, BPH: 85, Rust: 15 },
  { month: "Oct", Blast: 45, BPH: 40, Rust: 35 },
  { month: "Nov", Blast: 20, BPH: 15, Rust: 55 },
  { month: "Dec", Blast: 12, BPH: 8, Rust: 50 }
];

const TREND_SEASONAL = [
  { name: "Kharif", Blast: 240, BPH: 180, Rust: 20 },
  { name: "Rabi", Blast: 45, BPH: 25, Rust: 310 },
  { name: "Zaid", Blast: 15, BPH: 10, Rust: 12 }
];

const TREND_YEARLY = [
  { year: "2019", Blast: 120, BPH: 90, Rust: 150 },
  { year: "2020", Blast: 140, BPH: 110, Rust: 160 },
  { year: "2021", Blast: 185, BPH: 130, Rust: 195 },
  { year: "2022", Blast: 210, BPH: 185, Rust: 220 },
  { year: "2023", Blast: 260, BPH: 220, Rust: 265 },
  { year: "2024", Blast: 342, BPH: 278, Rust: 189 }
];

const TREND_5YEAR = [
  { year: "2020", area: 4.2 },
  { year: "2021", area: 5.8 },
  { year: "2022", area: 7.1 },
  { year: "2023", area: 9.4 },
  { year: "2024", area: 12.4 }
];

const RECURRING_DISEASES = [
  { name: "Rice Blast", freq: "Every Kharif", states: "Punjab, Haryana, UP, Odisha" },
  { name: "Brown Plant Hopper", freq: "Every Kharif/Late-Monsoon", states: "Odisha, AP, WB, UP" },
  { name: "Leaf Rust", freq: "Every Rabi", states: "Maharashtra, MP, Punjab, Rajasthan" },
  { name: "Late Blight", freq: "Every Rabi (Potato)", states: "WB, UP, Bihar" }
];

const VULNERABLE_STATES = [
  { name: "Uttar Pradesh", count: 142 },
  { name: "Punjab", count: 124 },
  { name: "Odisha", count: 98 },
  { name: "Maharashtra", count: 87 },
  { name: "West Bengal", count: 82 },
  { name: "Bihar", count: 76 },
  { name: "Karnataka", count: 68 },
  { name: "Madhya Pradesh", count: 61 }
];

const VULNERABLE_CROPS = [
  { name: "Kharif Paddy (Rice)", avgLoss: "14.2%" },
  { name: "Rabi Wheat", avgLoss: "8.5%" },
  { name: "Potato", avgLoss: "12.4%" },
  { name: "Cotton", avgLoss: "9.8%" }
];

const EMERGING_THREATS = [
  { name: "Wheat Blast", year: 2023, rate: "Fast" },
  { name: "Cotton Leaf Curl Virus", year: 2022, rate: "Moderate" },
  { name: "Late Blight (Resistant Strain)", year: 2024, rate: "Fast" }
];

const FORECAST_ACCURACY = [
  { disease: "Rice Blast", prediction: "Severe", actual: "Severe", accuracy: 94, fp: 2, fn: 1 },
  { disease: "Brown Plant Hopper", prediction: "Severe", actual: "Severe", accuracy: 89, fp: 3, fn: 2 },
  { disease: "Leaf Rust", prediction: "Moderate", actual: "Moderate", accuracy: 91, fp: 2, fn: 1 },
  { disease: "Yellow Mosaic", prediction: "Moderate", actual: "Moderate", accuracy: 86, fp: 4, fn: 2 },
  { disease: "Late Blight", prediction: "High", actual: "Moderate", accuracy: 78, fp: 5, fn: 3 },
  { disease: "Powdery Mildew", prediction: "Low", actual: "Low", accuracy: 84, fp: 2, fn: 2 },
  { disease: "Sheath Blight", prediction: "Low", actual: "Low", accuracy: 81, fp: 3, fn: 2 },
  { disease: "False Smut", prediction: "Low", actual: "Low", accuracy: 77, fp: 4, fn: 3 }
];

const CLIMATE_IMPACT = [
  { id: "temp", label: "Avg Temp Change", value: "+1.4°C", sub: "10yr warming trend", color: "#e74c3c", trend: [1.1, 1.2, 1.2, 1.3, 1.3, 1.4] },
  { id: "rain", label: "Rainfall Variance", value: "-8.2%", sub: "Monsoon deficit trend", color: "#3b82f6", trend: [-5.1, -6.2, -6.8, -7.5, -8.0, -8.2] },
  { id: "evolution", label: "Disease Evolution Index", value: "6.8/10", sub: "Resistance rising", color: "#f39c12", trend: [5.2, 5.5, 6.0, 6.2, 6.5, 6.8] },
  { id: "future", label: "Future Risk Indicator", value: "High", sub: "Composite projection", color: "#dc2626", trend: [70, 72, 75, 78, 80, 82] }
];

const DEFAULT_STRATEGIC_INSIGHTS = [
  "Rice Blast incidents increased 87% between 2020-2024, correlating with extended late monsoons.",
  "Eastern coastal belts registered 156% increase in BPH affected acreage due to microclimate shifts.",
  "Wheat rust path complex expanded southward by 240 km over the 5-year study timeframe.",
  "Direct climate-driven pathogen pressure increased 34% across all major agrarian zones.",
  "Fungicide resistance in Sheath Blight samples rose from 12% in 2019 to 42% in 2024."
];

const DEFAULT_STRATEGIC_THREATS = [
  { disease: "Ug99 Stem Rust", timeline: "2025-2027 Peak", risk: "Critical" },
  { disease: "Transboundary Hopper Plagues", timeline: "Late 2026", risk: "High" },
  { disease: "Virulent Rice Blast Variant", timeline: "Kharif 2025", risk: "Critical" }
];

const FILTER_YEARS = ["All", "2024", "2023", "2022", "2021", "2020", "2019"];
const FILTER_STATES = ["All", "Punjab", "Uttar Pradesh", "Maharashtra", "Odisha", "Karnataka", "West Bengal", "Bihar", "Haryana", "Madhya Pradesh"];
const FILTER_CROPS = ["All", "Rice", "Wheat", "Cotton", "Potato", "Pulses"];
const FILTER_DISEASES = ["All", "Rice Blast", "Brown Plant Hopper", "Leaf Rust", "Yellow Mosaic", "Late Blight"];

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
          {title}
        </h1>
        <span className="text-xs font-black text-[#31572c] uppercase font-mono tracking-wider pl-3 ml-3 border-l-2 border-gray-300">
          {subtitle}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Secure Govt Network
        </span>
      </div>
    </div>
  );
};

export default function HistoricalIntelligenceRepository() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Monthly");

  // Briefing state populated from Gemini API
  const [briefingData, setBriefingData] = useState({
    insights: DEFAULT_STRATEGIC_INSIGHTS,
    threats: DEFAULT_STRATEGIC_THREATS,
    outlookScore: 7.2,
    outlookSummary: "Historical analysis indicates a 5-year compound annual growth rate (CAGR) of 12.4% in crop disease incidents. Without interventions, projected economic impact could breach standard buffer reserves."
  });
  const [fetchingBriefing, setFetchingBriefing] = useState(false);

  // Filters
  const [selYear, setSelYear] = useState("All");
  const [selState, setSelState] = useState("All");
  const [selCrop, setSelCrop] = useState("All");
  const [selDisease, setSelDisease] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Gemini API Briefing generation
  useEffect(() => {
    if (loading) return;

    async function loadGeminiBriefing() {
      setFetchingBriefing(true);
      try {
        const systemPrompt = "You are a senior plant pathology briefing officer for the Ministry of Agriculture, Govt of India. Return ONLY raw JSON, no markdown, no explanation.";
        const userPrompt = `Analyze the historical crop health database and climate impact parameters. Generate a premium Strategic National Outlook briefing. Return this exact JSON format:
        {
          "insights": [
            "Insight 1 (realistic 1-sentence finding about transboundary vectors or climate triggers)",
            "Insight 2",
            "Insight 3",
            "Insight 4",
            "Insight 5"
          ],
          "threats": [
            { "disease": "Disease name", "timeline": "Projected timeline (e.g. Kharif 2025)", "risk": "Critical" },
            { "disease": "Disease name 2", "timeline": "Timeline 2", "risk": "High" },
            { "disease": "Disease name 3", "timeline": "Timeline 3", "risk": "Critical" }
          ],
          "outlookScore": 7.5,
          "outlookSummary": "A concise, formal 3-sentence summary paragraph explaining the national security level crop vulnerability indices."
        }
        Return ONLY valid JSON. Make it high-fidelity, agronomically accurate for India, and realistic.`;

        const res = await callGeminiFlash(userPrompt, systemPrompt);
        if (res && Array.isArray(res.insights) && Array.isArray(res.threats)) {
          setBriefingData({
            insights: res.insights,
            threats: res.threats,
            outlookScore: res.outlookScore || 7.5,
            outlookSummary: res.outlookSummary || briefingData.outlookSummary
          });
        }
      } catch (err) {
        console.warn("Could not retrieve AI briefing from Gemini, staying with fallback data:", err);
      } finally {
        setFetchingBriefing(false);
      }
    }

    loadGeminiBriefing();
  }, [loading]);

  const downloadReport = () => {
    const reportText = `
===========================================================
CROP HEALTH INTELLIGENCE PLATFORM - GOVERNMENT OF INDIA
STRATEGIC NATIONAL OUTLOOK & BIOSECURITY BRIEFING REPORT
===========================================================
Date: 05 JUN 2026
Classification: SECURE INTERNAL CIRCULATION ONLY
-----------------------------------------------------------

1. NATIONAL RISK OUTLOOK SCORE: ${briefingData.outlookScore}/10
Outlook Summary:
${briefingData.outlookSummary}

2. KEY STRATEGIC INSIGHTS:
${briefingData.insights.map((insight, idx) => `[${idx + 1}] ${insight}`).join("\n")}

3. PROJECTED FUTURE BIOTIC THREATS:
${briefingData.threats.map((thr, idx) => `[${idx + 1}] Disease Vector: ${thr.disease} | Timeline: ${thr.timeline} | Risk Rating: ${thr.risk}`).join("\n")}

-----------------------------------------------------------
AgroAnalytics National Command Center (NCC)
Directorate of Plant Protection, Quarantine & Storage
Ministry of Agriculture & Farmers Welfare, New Delhi
===========================================================
`;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Strategic_Crop_Biosecurity_Briefing_2026.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-14 bg-gray-200 rounded-xl mb-6" />
        <div className="h-[400px] bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // Filter logic
  const filteredData = HISTORICAL_DB.filter((row) => {
    if (selYear !== "All" && row.year.toString() !== selYear) return false;
    if (selState !== "All" && row.state !== selState) return false;
    if (selCrop !== "All" && row.crop !== selCrop) return false;
    if (selDisease !== "All" && row.disease !== selDisease) return false;
    return true;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getThreatBadge = (risk) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-200",
      Medium: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${styles[risk] || styles.Low}`}>
        {risk}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Historical Intelligence Repository" subtitle="ऐतिहासिक खुफिया भंडार" />

      {/* Row 1 — Historical Database (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[#31572c]" />
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Historical Disease Outbreak Registry</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <select value={selYear} onChange={(e) => { setSelYear(e.target.value); setPage(1); }} className="px-2.5 py-1 border border-gray-200 rounded-lg font-bold text-gray-700 focus:outline-none">
              <option value="All">Year: All</option>
              {FILTER_YEARS.slice(1).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={selState} onChange={(e) => { setSelState(e.target.value); setPage(1); }} className="px-2.5 py-1 border border-gray-200 rounded-lg font-bold text-gray-700 focus:outline-none">
              <option value="All">State: All</option>
              {FILTER_STATES.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={selCrop} onChange={(e) => { setSelCrop(e.target.value); setPage(1); }} className="px-2.5 py-1 border border-gray-200 rounded-lg font-bold text-gray-700 focus:outline-none">
              <option value="All">Crop: All</option>
              {FILTER_CROPS.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selDisease} onChange={(e) => { setSelDisease(e.target.value); setPage(1); }} className="px-2.5 py-1 border border-gray-200 rounded-lg font-bold text-gray-700 focus:outline-none">
              <option value="All">Disease: All</option>
              {FILTER_DISEASES.slice(1).map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pl-6">Disease</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">State</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Crop</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Season</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Affected Area</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Yield Loss</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pr-6">Year</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-[#4f772d]/5 transition-colors border-b border-gray-100/60">
                  <td className="p-3.5 pl-6 font-bold text-gray-950">{row.disease}</td>
                  <td className="p-3.5">{row.state}</td>
                  <td className="p-3.5">{row.crop}</td>
                  <td className="p-3.5 font-bold uppercase">{row.season}</td>
                  <td className="p-3.5 font-mono font-bold text-gray-900">{row.area}</td>
                  <td className="p-3.5 font-mono text-red-600 font-extrabold">{row.loss}</td>
                  <td className="p-3.5 pr-6 font-mono text-gray-400 font-black">{row.year}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs font-bold text-gray-400">No historical records matched selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs font-bold text-gray-600">
          <span>Showing {paginatedData.length} of {filteredData.length} records</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition active:scale-95"
            >
              Prev
            </button>
            <span className="flex items-center px-1">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 — Trend Analysis */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Incidence Trend Analysis</h2>
          <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold text-gray-600">
            {["Monthly", "Seasonal", "Yearly", "5-Year"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider ${
                  activeTab === tab ? "bg-[#31572c] text-white font-extrabold" : "hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          {activeTab === "Monthly" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_MONTHLY} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <YAxis stroke="#64748b" style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Line type="monotone" dataKey="Blast" stroke="#4f772d" strokeWidth={2} />
                <Line type="monotone" dataKey="BPH" stroke="#f39c12" strokeWidth={2} />
                <Line type="monotone" dataKey="Rust" stroke="#e74c3c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeTab === "Seasonal" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TREND_SEASONAL} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <YAxis stroke="#64748b" style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Bar dataKey="Blast" fill="#4f772d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="BPH" fill="#f39c12" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rust" fill="#e74c3c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "Yearly" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND_YEARLY} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <YAxis stroke="#64748b" style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Line type="monotone" dataKey="Blast" stroke="#4f772d" strokeWidth={2} />
                <Line type="monotone" dataKey="BPH" stroke="#f39c12" strokeWidth={2} />
                <Line type="monotone" dataKey="Rust" stroke="#e74c3c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {activeTab === "5-Year" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_5YEAR} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <YAxis stroke="#64748b" style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }} />
                <Area type="monotone" dataKey="area" name="Total Area Impacted (M Ha)" stroke="#31572c" fill="#ecf39e" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Disease Pattern Intelligence */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Disease Pattern Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Recurring Diseases</p>
              <div className="space-y-2">
                {RECURRING_DISEASES.map((dis, i) => (
                  <div key={i} className="text-xs font-semibold">
                    <span className="text-gray-900 font-bold block">{dis.name}</span>
                    <span className="text-[9px] text-[#31572c] font-black uppercase tracking-wider">{dis.freq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">High Risk Regions</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-bold text-gray-700">
                {VULNERABLE_STATES.map((st, i) => (
                  <div key={i} className="flex justify-between border-b border-gray-100/50 pb-0.5">
                    <span className="truncate">{st.name}</span>
                    <span className="text-[#31572c] font-mono font-extrabold">{st.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Most Vulnerable Crops</p>
              <div className="space-y-2">
                {VULNERABLE_CROPS.map((cr, i) => (
                  <div key={i} className="flex justify-between items-center text-xs font-semibold border-b border-gray-100/40 pb-1">
                    <span className="text-gray-900 font-bold">{cr.name}</span>
                    <span className="text-red-600 font-mono font-extrabold">{cr.avgLoss} loss</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Emerging Threats</p>
              <div className="space-y-2">
                {EMERGING_THREATS.map((thr, i) => (
                  <div key={i} className="text-xs font-semibold flex justify-between items-center">
                    <div>
                      <span className="text-gray-900 font-bold">{thr.name}</span>
                      <p className="text-[9px] text-gray-400">First detected: {thr.year}</p>
                    </div>
                    <span className="text-[9px] bg-red-50 text-red-700 px-1 rounded border border-red-100 font-black uppercase shrink-0">{thr.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Forecast Accuracy Analytics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-gray-100 shrink-0">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Forecast Accuracy Analytics</h2>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[220px] scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3 pl-4">Disease</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3">Prediction</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3">Actual</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3 pr-4">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {FORECAST_ACCURACY.map((row, idx) => (
                  <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-[#4f772d]/5 transition-colors border-b border-gray-100/60">
                    <td className="p-3 pl-4 font-bold text-gray-900">{row.disease}</td>
                    <td className="p-3">{row.prediction}</td>
                    <td className="p-3 uppercase font-bold text-gray-600">{row.actual}</td>
                    <td className="p-3 pr-4 font-mono font-black text-[#31572c]">{row.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3.5 bg-emerald-50 border-t border-emerald-100 text-center shrink-0">
            <span className="bg-[#31572c] text-[#ecf39e] font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
              Overall System Accuracy: 83.4% Accuracy
            </span>
          </div>
        </div>
      </div>

      {/* Row 4 — Climate Impact Analysis (4 metric cards with sparkline) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn">
        {CLIMATE_IMPACT.map((card) => {
          const sparkData = card.trend.map((val, idx) => ({ x: idx, y: val }));
          return (
            <div key={card.id} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                  <p className="text-2xl font-black text-gray-950 tracking-tight mt-1">{card.value}</p>
                </div>
                <div className="h-8 w-16 shrink-0 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line type="monotone" dataKey="y" stroke={card.color} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <span className="text-[9px] text-gray-400 font-bold block mt-1">{card.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Row 5 — Strategic Intelligence Panel */}
      <div className="bg-[#132a13] text-white rounded-2xl p-6 shadow-lg border border-[#31572c]/40">
        <h2 className="text-xs font-black text-[#ecf39e] uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b border-[#31572c] pb-3">
          <Info size={14} />
          <span>Strategic National Outlook & Intelligence Briefing</span>
          {fetchingBriefing && (
            <span className="text-[10px] font-bold text-gray-400 animate-pulse normal-case ml-2">(Generating AI Outlook...)</span>
          )}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
          {/* Key Insights */}
          <div className="space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Key Insights</p>
            <ul className="space-y-2.5 text-xs text-gray-300 font-medium">
              {briefingData.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#ecf39e] font-extrabold text-sm shrink-0">⤷</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Future Threats */}
          <div className="space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Projected Future Threats</p>
            <div className="space-y-3">
              {briefingData.threats.map((thr, idx) => (
                <div key={idx} className="bg-[#31572c]/30 border border-[#90a955]/20 p-3 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-white">{thr.disease}</span>
                    {getThreatBadge(thr.risk)}
                  </div>
                  <span className="text-[10px] text-[#ecf39e] font-bold">Projected onset: {thr.timeline}</span>
                </div>
              ))}
            </div>
          </div>

          {/* National Risk Outlook */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">National Risk Outlook</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-[#ecf39e]">{briefingData.outlookScore}</span>
                <span className="text-xs font-bold text-gray-400">/10 Severity index</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                {briefingData.outlookSummary}
              </p>
            </div>
            <button
              onClick={downloadReport}
              className="w-full bg-[#ecf39e] hover:bg-[#ecf39e]/90 text-[#132a13] font-black text-xs py-2 rounded-xl transition active:scale-95 shadow-md flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
            >
              <Download size={14} /> Download Full Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
