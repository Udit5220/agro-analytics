import React, { useState, useEffect } from "react";
import {
  TrendingDown,
  Users,
  ShieldAlert,
  AlertTriangle,
  Wheat,
  Clock,
  Bell,
  Download,
  Percent,
  TrendingUp,
  MapPin,
  ArrowRight,
  Info
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// ------------------------------------------------------------------
// MOCK DATA (Food security - India national scale)
// ------------------------------------------------------------------

const FOOD_SECURITY_KPI = [
  { id: "production", label: "Production Risk", value: "4.2M MT", sub: "Est. loss volume", trend: "danger", icon: Wheat },
  { id: "supply", label: "Supply Risk Index", value: "6.7/10", sub: "Amber threshold", trend: "warning", icon: ShieldAlert },
  { id: "yield", label: "Estimated Yield Loss", value: "6.3%", sub: "National composite", trend: "danger", icon: Percent },
  { id: "population", label: "Population Impact", value: "12.4M people", sub: "Vulnerable clusters", trend: "danger", icon: Users }
];

const BASELINE_PRODUCTION = 284; // Million MT total expected
const RISK_VOL = 4.2;
const SAVED_VOL = 1.8;
const SAFE_VOL = BASELINE_PRODUCTION - RISK_VOL - SAVED_VOL;

const PRODUCTION_PIE_DATA = [
  { name: "Safe Production", value: SAFE_VOL, color: "#4f772d" },
  { name: "Production Saved", value: SAVED_VOL, color: "#90a955" },
  { name: "Production At Risk", value: RISK_VOL, color: "#e74c3c" }
];

const CROP_IMPACT_RANKINGS = [
  { crop: "Rice", area: "18.4L Ha", loss: "2.4M MT", riskPct: 8.5, impact: "Critical" },
  { crop: "Wheat", area: "11.2L Ha", loss: "1.1M MT", riskPct: 6.2, impact: "High" },
  { crop: "Cotton", area: "8.9L Ha", loss: "0.4M MT", riskPct: 5.8, impact: "Medium" },
  { crop: "Pulses", area: "5.6L Ha", loss: "0.2M MT", riskPct: 7.1, impact: "High" },
  { crop: "Oilseeds", area: "4.8L Ha", loss: "0.1M MT", riskPct: 4.3, impact: "Medium" },
  { crop: "Sugarcane", area: "3.2L Ha", loss: "0.05M MT", riskPct: 1.2, impact: "Low" },
  { crop: "Maize", area: "4.1L Ha", loss: "0.08M MT", riskPct: 3.5, impact: "Medium" }
];

const VULNERABLE_STATES = [
  { rank: 1, name: "Uttar Pradesh", score: 94, barWidth: "94%" },
  { rank: 2, name: "Punjab", score: 91, barWidth: "91%" },
  { rank: 3, name: "Bihar", score: 86, barWidth: "86%" },
  { rank: 4, name: "Odisha", score: 82, barWidth: "82%" },
  { rank: 5, name: "West Bengal", score: 79, barWidth: "79%" },
  { rank: 6, name: "Madhya Pradesh", score: 72, barWidth: "72%" },
  { rank: 7, name: "Maharashtra", score: 68, barWidth: "68%" },
  { rank: 8, name: "Rajasthan", score: 61, barWidth: "61%" }
];

const VULNERABLE_CROPS = [
  { name: "Kharif Rice (Fine)", loss: "1.8M MT", share: "8.2% of nat. production" },
  { name: "Paddy (Coarse)", loss: "0.6M MT", share: "5.4% of nat. production" },
  { name: "Durum Wheat", loss: "0.8M MT", share: "4.1% of nat. production" },
  { name: "Lentils / Arhar", loss: "0.2M MT", share: "9.3% of nat. production" },
  { name: "Soybean", loss: "0.1M MT", share: "3.2% of nat. production" }
];

const SUPPLY_CHAIN_CARDS = [
  {
    title: "Procurement Risk",
    severity: "High",
    desc: "Delayed procurement in 6 states due to quality standard checks and fungal spot thresholds.",
    states: "Punjab, Haryana, UP, Bihar, Odisha, WB",
    action: "Fast-track moisture relaxations"
  },
  {
    title: "Storage Risk",
    severity: "Medium",
    desc: "12% buffer stock levels below minimum threshold in central zone warehouses.",
    states: "MP, Maharashtra, Chhattisgarh",
    action: "Initiate stock reallocation"
  },
  {
    title: "Distribution Risk",
    severity: "High",
    desc: "3 critical highway corridors affected by localized quarantine restrictions.",
    states: "NH-44 Corridor, East-West Link, Odisha Coastal",
    action: "Issue emergency transport passes"
  }
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


export default function FoodSecurityImpactMonitor() {
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
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const getImpactBadge = (impact) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-200",
      Medium: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[impact] || styles.Low}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Food Security Impact Monitor" subtitle="खाद्य सुरक्षा प्रभाव मॉनिटर" />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {FOOD_SECURITY_KPI.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                <div className="p-1.5 bg-brand-medium/10 rounded-lg text-[#31572c]">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</span>
                <span className="text-[10px] font-bold text-gray-400">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Crop Production Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Proportions Stat cards */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Crop Production Proportions</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Expected Production</span>
                <p className="text-2xl font-black text-gray-950 mt-1">{BASELINE_PRODUCTION}M MT</p>
                <span className="text-[9px] text-gray-500 font-bold block mt-1">National Baseline</span>
              </div>
              <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-center">
                <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider">Production At Risk</span>
                <p className="text-2xl font-black text-red-700 mt-1">{RISK_VOL}M MT</p>
                <span className="text-[9px] text-red-500 font-bold block mt-1">Pathogen Exposure</span>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center">
                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider">Production Saved</span>
                <p className="text-2xl font-black text-emerald-800 mt-1">{SAVED_VOL}M MT</p>
                <span className="text-[9px] text-emerald-600 font-bold block mt-1">Intervention Output</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50/50 border border-gray-100 rounded-xl text-xs text-gray-600 font-semibold leading-relaxed">
            Target containment efforts show 42% reduction in potential yield losses.
          </div>
        </div>

        {/* Right PieChart */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3 text-center">Loss/Save Balance</h2>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={PRODUCTION_PIE_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={56} paddingAngle={2} dataKey="value">
                  {PRODUCTION_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}M MT`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-gray-600 border-t pt-2 mt-2">
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-brand-medium" />Safe</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#90a955]" />Saved</div>
            <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#e74c3c]" />At Risk</div>
          </div>
        </div>
      </div>

      {/* Row 3 — Crop Impact Rankings (full width table) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Crop Impact & Loss Assessment</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pl-6">Crop</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Affected Area (Ha)</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Expected Loss (MT)</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Risk Percentage</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pr-6">Food Security Impact</th>
              </tr>
            </thead>
            <tbody>
              {CROP_IMPACT_RANKINGS.map((row, idx) => (
                <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-brand-medium/5 transition-colors border-b border-gray-100/60">
                  <td className="p-3.5 pl-6 font-bold text-gray-950">{row.crop}</td>
                  <td className="p-3.5 font-mono text-gray-900 font-bold">{row.area}</td>
                  <td className="p-3.5 font-mono text-gray-900 font-bold">{row.loss}</td>
                  <td className="p-3.5 font-mono text-red-600 font-extrabold">{row.riskPct}%</td>
                  <td className="p-3.5 pr-6">{getImpactBadge(row.impact)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Most Vulnerable States */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Most Vulnerable States</h2>
          <div className="space-y-3.5">
            {VULNERABLE_STATES.map((st) => (
              <div key={st.rank} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#31572c] bg-[#ecf39e] h-4.5 w-4.5 rounded-full flex items-center justify-center">{st.rank}</span>
                    <span className="font-bold text-gray-900">{st.name}</span>
                  </span>
                  <span className="font-bold text-gray-950 font-mono">Index: {st.score}</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-dark h-full rounded-full" style={{ width: st.barWidth }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Vulnerable Crops */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Most Vulnerable Crop Varieties</h2>
            <div className="space-y-3.5">
              {VULNERABLE_CROPS.map((cr, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-gray-50 pb-2.5 text-xs font-semibold">
                  <div>
                    <span className="text-gray-950 font-bold">{cr.name}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{cr.share}</p>
                  </div>
                  <span className="text-red-700 font-extrabold font-mono shrink-0">{cr.loss} loss</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t text-[10px] text-gray-400 text-center font-mono">
            Analyzed by AgroAnalytics AI Crop Modeling Center
          </div>
        </div>
      </div>

      {/* Row 5 — Supply Chain Impact */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Supply Chain Logistics Vulnerabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SUPPLY_CHAIN_CARDS.map((card, idx) => (
            <div key={idx} className="bg-gray-50 border border-gray-200/60 rounded-xl p-4 flex flex-col justify-between hover:shadow-sm transition">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-black text-gray-900">{card.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                    card.severity === "High" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-900 border-amber-200"
                  }`}>
                    {card.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed mb-3">{card.desc}</p>
                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Affected Zones</p>
                <p className="text-xs text-gray-800 font-bold mb-3">{card.states}</p>
              </div>
              <button className="w-full bg-white hover:bg-brand-dark hover:text-white border border-gray-200 text-[#31572c] text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-lg shadow-2xs transition active:scale-95">
                {card.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
