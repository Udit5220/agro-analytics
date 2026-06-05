import React, { useState, useEffect } from "react";
import {
  Activity,
  Map,
  MapPin,
  Users,
  Sprout,
  AlertTriangle,
  TrendingDown,
  ShieldAlert,
  ArrowUpRight,
  Bell,
  Download,
  Clock,
  TrendingUp,
  Brain,
  CheckCircle,
  FileText
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// ------------------------------------------------------------------
// MOCK DATA (Government-grade realistic for India)
// ------------------------------------------------------------------

const KPI_DATA = [
  { id: "outbreaks", label: "Active Outbreaks", value: "23", trend: "+3", trendType: "danger", icon: Activity },
  { id: "states", label: "Affected States", value: "14", trend: "Stable", trendType: "neutral", icon: Map },
  { id: "districts", label: "Affected Districts", value: "87", trend: "+5", trendType: "danger", icon: MapPin },
  { id: "farmers", label: "Affected Farmers", value: "4,82,000", trend: "+12k", trendType: "danger", icon: Users },
  { id: "acreage", label: "Affected Acreage", value: "12.4L Ha", trend: "+0.8L", trendType: "danger", icon: Sprout },
  { id: "alerts", label: "Critical Alerts", value: "6", trend: "Active", trendType: "danger", icon: AlertTriangle },
  { id: "loss", label: "Predicted Yield Loss", value: "8.3%", trend: "+1.2%", trendType: "danger", icon: TrendingDown },
  { id: "security", label: "Food Security Risk Score", value: "67/100", trend: "Amber", trendType: "warning", icon: ShieldAlert },
];

const CROP_HEALTH_INDEX = 61;

const DISEASE_DISTRIBUTION = [
  { name: "Rice Blast", affectedArea: 480000, spreadRate: 8.2 },
  { name: "Brown Plant Hopper", affectedArea: 320000, spreadRate: 12.5 },
  { name: "Leaf Rust", affectedArea: 210000, spreadRate: 5.1 },
  { name: "Yellow Mosaic", affectedArea: 190000, spreadRate: 6.8 },
  { name: "Late Blight", affectedArea: 140000, spreadRate: 4.3 }
];

const TOP_THREATS = [
  { disease: "Rice Blast", state: "Punjab", district: "Ludhiana", severity: "Critical", affectedArea: "3,42,000 Ha", trend: "↑↑" },
  { disease: "Brown Plant Hopper", state: "Uttar Pradesh", district: "Gorakhpur", severity: "High", affectedArea: "2,78,000 Ha", trend: "↑" },
  { disease: "Leaf Rust", state: "Maharashtra", district: "Nagpur", severity: "Medium", affectedArea: "1,89,000 Ha", trend: "→" },
  { disease: "Yellow Mosaic", state: "Karnataka", district: "Mandya", severity: "High", affectedArea: "1,67,000 Ha", trend: "↑" },
  { disease: "Rice Blast", state: "Odisha", district: "Cuttack", severity: "High", affectedArea: "1,54,000 Ha", trend: "↑" },
  { disease: "Late Blight", state: "West Bengal", district: "Hooghly", severity: "Medium", affectedArea: "1,12,000 Ha", trend: "→" },
  { disease: "Yellow Mosaic", state: "Bihar", district: "Patna", severity: "Critical", affectedArea: "98,000 Ha", trend: "↑↑" },
  { disease: "Leaf Rust", state: "Madhya Pradesh", district: "Indore", severity: "Low", affectedArea: "76,000 Ha", trend: "↓" },
];

const EMERGENCY_REGIONS = [
  { state: "Punjab", district: "Ludhiana", disease: "Rice Blast", severity: "Critical" },
  { state: "Uttar Pradesh", district: "Gorakhpur", disease: "BPH Outbreak", severity: "Critical" },
  { state: "Bihar", district: "Patna", disease: "Yellow Mosaic", severity: "High" }
];

const ESCALATED_OUTBREAKS = [
  "Rice Blast in Amritsar, Punjab: 18% increase in leaf stress index over 48h.",
  "BPH in Baleswar, Odisha: Spore count counts rising; pesticide coverage at 42%.",
  "Yellow Mosaic in Rohtas, Bihar: High vector density registered in low-lying tracts."
];

const EMERGENCY_RECOMMENDATIONS = [
  "Restrict movement of agricultural machinery from critical outbreak buffer zones.",
  "Deploy central fungicide buffer stock to the cooperative distribution centers immediately.",
  "Issue regional advisory to shift irrigation schedules to evening hours to prevent spore germination."
];

const ALERT_ITEMS = [
  { id: 1, severity: "Critical", time: "10 mins ago", loc: "Ludhiana, Punjab", disease: "Rice Blast", msg: "NDVI stress levels breached 0.35 threshold in block 4." },
  { id: 2, severity: "High", time: "32 mins ago", loc: "Gorakhpur, UP", disease: "Brown Plant Hopper", msg: "Rapid spore multiplier detected in surveillance traps." },
  { id: 3, severity: "Critical", time: "1 hour ago", loc: "Patna, Bihar", disease: "Yellow Mosaic", msg: "Whitefly count exceeded 15 per plant in major clusters." },
  { id: 4, severity: "Medium", time: "2 hours ago", loc: "Nagpur, Maharashtra", disease: "Leaf Rust", msg: "Favorable humidity (84%) forecast for spore dispersal." },
  { id: 5, severity: "High", time: "3 hours ago", loc: "Cuttack, Odisha", disease: "Rice Blast", msg: "Secondary infection vectors active in waterlogged rice paddies." },
  { id: 6, severity: "Low", time: "5 hours ago", loc: "Indore, MP", disease: "Leaf Rust", msg: "Prophylactic spray programs completed in southern blocks." },
  { id: 7, severity: "Medium", time: "6 hours ago", loc: "Mandya, Karnataka", disease: "Yellow Mosaic", msg: "Moderate incidence reported in sugar-rice crop rotation blocks." },
  { id: 8, severity: "High", time: "8 hours ago", loc: "Ambala, Haryana", disease: "Rice Blast", msg: "Spore trap counts showing exponential rise in boundary zones." },
  { id: 9, severity: "Critical", time: "12 hours ago", loc: "Hooghly, West Bengal", disease: "Late Blight", msg: "Emergency quarantine declared in potato seed nursery." },
  { id: 10, severity: "Low", time: "24 hours ago", loc: "Jaipur, Rajasthan", disease: "Powdery Mildew", msg: "Routine surveillance confirms trace levels below hazard index." }
];

const AI_RECOMMENDATIONS = [
  { icon: Sprout, title: "Deploy Emergency Teams", rationale: "Punjab & Haryana Rice Blast spread vector control", action: "Deploy to Punjab/Haryana" },
  { icon: ShieldAlert, title: "Release Crop Advisory", rationale: "Yellow Mosaic advisory for UP & Bihar kharif belt", action: "Release Advisory" },
  { icon: Activity, title: "Increase Surveillance", rationale: "Coastal Odisha BPH risk simulation indicates threat rise", action: "Escalate Monitoring" },
  { icon: FileText, title: "Allocate Fungicide Stock", rationale: "Distribute emergency reserves to 6 critical districts", action: "Allocate Stock" }
];

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

export default function CommandCenter() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-14 bg-gray-200 rounded-xl mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-80 bg-gray-200 rounded-2xl" />
          <div className="h-80 col-span-2 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const getSeverityBadge = (severity) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-200",
      Medium: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[severity] || styles.Low}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  const getTrendColor = (trend) => {
    if (trend === "↑↑") return "text-red-600 font-bold";
    if (trend === "↑") return "text-amber-600 font-semibold";
    if (trend === "↓") return "text-emerald-600 font-semibold";
    return "text-gray-400";
  };

  // Dial calculations for score 61
  const needleAngle = (CROP_HEALTH_INDEX / 100) * 180 - 90; // needle rot angle (90 deg offset)
  const angleRad = (needleAngle * Math.PI) / 180;
  const needleX2 = 60 + 38 * Math.sin(angleRad);
  const needleY2 = 65 - 38 * Math.cos(angleRad);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="National Command Center" subtitle="राष्ट्रीय कमान केंद्र" />

      {/* Row 1 — 8 KPI cards (4+4 grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPI_DATA.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                <div className="p-1.5 bg-[#4f772d]/10 rounded-lg text-[#31572c]">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</span>
                <span className={`text-[10px] font-extrabold ${card.trendType === "danger" ? "text-red-600" : card.trendType === "warning" ? "text-amber-600" : "text-gray-500"}`}>
                  {card.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — 2 cols (Health Index arc + Recharts Composed Disease Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left: Crop Health Index */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">National Crop Health Index</h2>
            <div className="flex flex-col items-center justify-center mt-2">
              <div className="w-48 h-28">
                <svg viewBox="0 0 120 70" className="w-full h-full">
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#e74c3c" />
                      <stop offset="50%" stopColor="#f39c12" />
                      <stop offset="100%" stopColor="#4f772d" />
                    </linearGradient>
                  </defs>
                  {/* Background track */}
                  <path
                    d="M 15 65 A 45 45 0 0 1 105 65"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Active track */}
                  <path
                    d="M 15 65 A 45 45 0 0 1 105 65"
                    fill="none"
                    stroke="url(#gauge-grad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="141.37"
                    strokeDashoffset={141.37 - (CROP_HEALTH_INDEX / 100) * 141.37}
                  />
                  {/* Needle */}
                  <line x1="60" y1="65" x2={needleX2} y2={needleY2} stroke="#132a13" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="60" cy="65" r="4.5" fill="#132a13" />
                </svg>
              </div>
              <div className="text-center mt-3 z-10">
                <span className="text-3xl font-black text-gray-950 tracking-tight">{CROP_HEALTH_INDEX}/100</span>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 font-mono">Moderate Risk Zone</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">Healthy Regions</span>
              <span className="font-extrabold text-gray-950">42% (15 States)</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-1.5">
              <span className="flex items-center gap-1.5 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">Warning Level</span>
              <span className="font-extrabold text-gray-950">35% (12 States)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[10px]">Critical Level</span>
              <span className="font-extrabold text-gray-950">23% (9 States)</span>
            </div>
          </div>
        </div>

        {/* Right: Recharts Composed Disease Distribution */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">National Disease Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DISEASE_DISTRIBUTION} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <YAxis yAxisId="left" stroke="#4f772d" style={{ fontSize: "9px", fontWeight: "bold" }} tickFormatter={(v) => `${v / 1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#f39c12" style={{ fontSize: "9px", fontWeight: "bold" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#132a13", borderRadius: "12px", border: "none", color: "#fff", fontSize: "11px" }}
                  formatter={(value, name) => [name === "affectedArea" ? `${value.toLocaleString()} Ha` : `${value}%`, name === "affectedArea" ? "Affected Area" : "Spread Rate"]}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Bar yAxisId="left" dataKey="affectedArea" fill="#4f772d" name="Affected Area (Ha)" radius={[4, 4, 0, 0]} barSize={25} />
                <Line yAxisId="right" type="monotone" dataKey="spreadRate" name="Spread Rate (%)" stroke="#f39c12" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3 — Top Threats Table (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Top Threats · Outbreak Matrix</h2>
          <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-black border border-red-100">8 PRIMARY HAZARDS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pl-6">Disease</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">State</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">District</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Severity</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Affected Area</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pr-6">Trend</th>
              </tr>
            </thead>
            <tbody>
              {TOP_THREATS.map((threat, idx) => (
                <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-[#4f772d]/5 transition-colors border-b border-gray-100/60">
                  <td className="p-3.5 pl-6 font-bold text-gray-950">{threat.disease}</td>
                  <td className="p-3.5">{threat.state}</td>
                  <td className="p-3.5">{threat.district}</td>
                  <td className="p-3.5">{getSeverityBadge(threat.severity)}</td>
                  <td className="p-3.5 font-mono text-[11px] font-extrabold text-gray-900">{threat.affectedArea}</td>
                  <td className="p-3.5 pr-6 font-mono font-bold"><span className={getTrendColor(threat.trend)}>{threat.trend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4 — 2 cols (Emergency Panel + Alert Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Emergency Situation Panel */}
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 bg-red-100 text-red-700 rounded-lg"><AlertTriangle size={16} /></span>
              <h2 className="text-xs font-black text-red-950 uppercase tracking-widest">Emergency Situation Room</h2>
            </div>
            
            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-2">Highest Risk Sectors</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {EMERGENCY_REGIONS.map((reg, idx) => (
                <div key={idx} className="bg-white border border-red-100 p-3 rounded-xl shadow-xs">
                  <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">{reg.state}</span>
                  <p className="text-xs font-black text-gray-950 truncate mt-0.5">{reg.district}</p>
                  <p className="text-[10px] text-red-700 font-bold mt-1 truncate">{reg.disease}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-2">Escalated Outbreaks (Last 72 Hours)</p>
            <ol className="list-decimal list-inside space-y-2 mb-4 text-xs font-medium text-red-900">
              {ESCALATED_OUTBREAKS.map((esc, i) => (
                <li key={i} className="leading-relaxed pl-1">{esc}</li>
              ))}
            </ol>
          </div>

          <div>
            <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-2">Urgent Emergency Directives</p>
            <div className="space-y-2">
              {EMERGENCY_RECOMMENDATIONS.map((rec, i) => (
                <div key={i} className="bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: National Alert Feed (scrollable h-64) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-gray-100 flex justify-between items-center mb-3">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">National Live Alert Feed</h2>
            <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
          </div>
          <div className="h-[320px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
            {ALERT_ITEMS.map((alert) => {
              const borderStyles = {
                Critical: "border-l-4 border-red-600 bg-red-50/40",
                High: "border-l-4 border-amber-500 bg-amber-50/30",
                Medium: "border-l-4 border-blue-500 bg-blue-50/20",
                Low: "border-l-4 border-emerald-500 bg-emerald-50/20",
              };
              return (
                <div key={alert.id} className={`p-3 rounded-xl border border-gray-100 ${borderStyles[alert.severity] || "border-l-4 border-gray-400 bg-gray-50"} shadow-xs flex flex-col justify-between`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-gray-400">{alert.time}</span>
                    <span className="text-[9px] font-black uppercase text-gray-800 tracking-wider">📍 {alert.loc}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-950">{alert.disease}</p>
                  <p className="text-[11px] text-gray-600 font-medium mt-1 leading-snug">{alert.msg}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 5 — AI Government Recommendations (4 cards in a row) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
          <span className="p-1 bg-[#4f772d]/10 text-[#31572c] rounded-lg"><Brain size={16} /></span>
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">AI Government Policy & Intervention Engine</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AI_RECOMMENDATIONS.map((rec, idx) => {
            const Icon = rec.icon;
            return (
              <div key={idx} className="border-l-4 border-[#31572c] bg-gray-50/50 hover:bg-[#4f772d]/5 p-4 rounded-r-xl border border-y-gray-200 border-r-gray-200 flex flex-col justify-between transition-all group">
                <div>
                  <div className="text-[#31572c] mb-2"><Icon size={18} /></div>
                  <p className="text-xs font-black text-gray-900 group-hover:text-[#31572c] transition-colors">{rec.title}</p>
                  <p className="text-[11px] text-gray-600 font-medium leading-snug mt-1.5">{rec.rationale}</p>
                </div>
                <button className="mt-4 w-full bg-white hover:bg-[#31572c] hover:text-white border border-gray-200 text-[#31572c] text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-lg shadow-2xs transition active:scale-95">
                  {rec.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
