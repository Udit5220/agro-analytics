import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Flame,
  Bell,
  Clock,
  Download,
  Calendar,
  Zap,
  TrendingUp,
  MapPin,
  TrendingDown,
  CloudRain,
  Droplets,
  Thermometer,
  Wind,
  Satellite,
  Compass,
  ArrowRight,
  Info
} from "lucide-react";

// ------------------------------------------------------------------
// MOCK DATA (Predictive intelligence - India national scale)
// ------------------------------------------------------------------

const EARLY_WARNING_KPI = [
  { id: "risks", label: "Emerging Risks", value: "18", sub: "New triggers detected", trend: "danger", icon: AlertTriangle },
  { id: "predicted", label: "Predicted Outbreaks", value: "7", sub: "Next 14 days", trend: "danger", icon: Flame },
  { id: "regions", label: "High Risk Regions", value: "24", sub: "Across 8 states", trend: "warning", icon: MapPin },
  { id: "alerts", label: "Warning Alerts Issued", value: "142", sub: "This kharif season", trend: "success", icon: Bell }
];

const FORECAST_TABLE = [
  { disease: "Rice Blast", probability: 82, date: "12 Jun", severity: "Critical", states: "Punjab, Haryana", confidence: 88 },
  { disease: "Leaf Rust", probability: 67, date: "18 Jun", severity: "High", states: "UP, MP", confidence: 79 },
  { disease: "Yellow Mosaic", probability: 54, date: "25 Jun", severity: "High", states: "Bihar, Jharkhand", confidence: 71 },
  { disease: "Brown Plant Hopper", probability: 48, date: "30 Jun", severity: "Medium", states: "Odisha, WB", confidence: 65 },
  { disease: "Late Blight", probability: 42, date: "05 Jul", severity: "Medium", states: "West Bengal, Assam", confidence: 62 },
  { disease: "Powdery Mildew", probability: 38, date: "09 Jul", severity: "Low", states: "Rajasthan, Gujarat", confidence: 59 },
  { disease: "Sheath Blight", probability: 35, date: "14 Jul", severity: "Low", states: "Andhra Pradesh, Tamil Nadu", confidence: 55 },
  { disease: "False Smut", probability: 29, date: "20 Jul", severity: "Low", states: "Chhattisgarh, Odisha", confidence: 51 }
];

const FORECAST_TIMELINES = {
  "7D": [
    { disease: "Rice Blast", location: "Ludhiana, Punjab", severity: "Critical", onset: "2 Days" },
    { disease: "Brown Plant Hopper", location: "Cuttack, Odisha", severity: "High", onset: "4 Days" },
    { disease: "Late Blight", location: "Hooghly, WB", severity: "Medium", onset: "6 Days" }
  ],
  "14D": [
    { disease: "Leaf Rust", location: "Nagpur, Maharashtra", severity: "High", onset: "9 Days" },
    { disease: "Yellow Mosaic", location: "Patna, Bihar", severity: "High", onset: "11 Days" },
    { disease: "Rice Blast", location: "Ambala, Haryana", severity: "Critical", onset: "13 Days" }
  ],
  "30D": [
    { disease: "Yellow Mosaic", location: "Mandya, Karnataka", severity: "Medium", onset: "18 Days" },
    { disease: "Late Blight", location: "Gaya, Bihar", severity: "High", onset: "22 Days" },
    { disease: "Powdery Mildew", location: "Indore, MP", severity: "Low", onset: "27 Days" }
  ],
  "Seasonal": [
    { disease: "Rice Blast", location: "Northwest India", severity: "Critical", onset: "Kharif Peak" },
    { disease: "Brown Plant Hopper", location: "Coastal AP & Odisha", severity: "High", onset: "Aug - Oct" },
    { disease: "Leaf Rust", location: "Central India Wheat Belt", severity: "Medium", onset: "Post-Monsoon" }
  ]
};

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


export default function EarlyWarningCenter() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("7D");
  const [expandedCard, setExpandedCard] = useState("whyRisk");

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

  const getSeverityBadge = (severity) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-200",
      Medium: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${styles[severity] || styles.Low}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Early Warning Center" subtitle="प्रारंभिक चेतावनी केंद्र" />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {EARLY_WARNING_KPI.map((card) => {
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

      {/* Row 2 — Forecast Dashboard table (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Early Warning Outbreak Forecast Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pl-6">Disease</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Probability</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Expected Date</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Expected Severity</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Affected States</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pr-6">Confidence Score</th>
              </tr>
            </thead>
            <tbody>
              {FORECAST_TABLE.map((row, idx) => (
                <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-brand-medium/5 transition-colors border-b border-gray-100/60">
                  <td className="p-3.5 pl-6 font-bold text-gray-950">{row.disease}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold w-8">{row.probability}%</span>
                      <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.probability > 75 ? "bg-red-500" : row.probability > 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                          style={{ width: `${row.probability}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">{row.date}</td>
                  <td className="p-3.5">{getSeverityBadge(row.severity)}</td>
                  <td className="p-3.5 font-bold text-gray-800">{row.states}</td>
                  <td className="p-3.5 pr-6 font-mono text-gray-900 font-extrabold">{row.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Disease Drivers panel */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Key Climatic Risk Drivers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Rainfall</span>
                <span className="p-1 bg-brand-medium/10 text-[#31572c] rounded-md"><CloudRain size={14} /></span>
              </div>
              <p className="text-xl font-black text-gray-950 tracking-tight">142 mm</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-red-600 font-bold flex items-center gap-0.5"><TrendingUp size={10} /> High Risk</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">Th: &gt;120mm</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Humidity</span>
                <span className="p-1 bg-brand-medium/10 text-[#31572c] rounded-md"><Droplets size={14} /></span>
              </div>
              <p className="text-xl font-black text-gray-950 tracking-tight">84%</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full font-bold">Critical Threshold</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">Th: &gt;75%</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Temperature</span>
                <span className="p-1 bg-brand-medium/10 text-[#31572c] rounded-md"><Thermometer size={14} /></span>
              </div>
              <p className="text-xl font-black text-gray-950 tracking-tight">34°C</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">Warning</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">Range: 22-35°C</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Wind Vector</span>
                <span className="p-1 bg-brand-medium/10 text-[#31572c] rounded-md"><Wind size={14} /></span>
              </div>
              <p className="text-xl font-black text-gray-950 tracking-tight">18 km/h</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5"><TrendingDown size={10} /> Moderate</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">West to East</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex flex-col justify-between md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase">NDVI Stress Signal</span>
                <span className="p-1 bg-brand-medium/10 text-[#31572c] rounded-md"><Satellite size={14} /></span>
              </div>
              <p className="text-xl font-black text-[#e74c3c] tracking-tight">0.42</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-red-600 font-bold">Vegetation stress detected in kharif rice canopy</span>
                <span className="text-[9px] font-mono text-gray-400 font-bold">Expected: 0.65</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Forecast Timeline tabs */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Forecast Timeline</h2>
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold text-gray-600 mb-4">
              {["7D", "14D", "30D", "Seasonal"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1 rounded-md text-[10px] uppercase tracking-wider ${
                    activeTab === tab ? "bg-brand-dark text-white font-extrabold" : "hover:text-gray-900"
                  }`}
                >
                  {tab === "7D" ? "7 Days" : tab === "14D" ? "14 Days" : tab === "30D" ? "30 Days" : "Seasonal"}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {FORECAST_TIMELINES[activeTab].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2.5 text-xs font-semibold">
                  <div>
                    <span className="text-gray-950 font-bold">{item.disease}</span>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5 flex items-center gap-1"><MapPin size={10} />{item.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(item.severity)}
                    <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-md font-mono text-[10px] font-black">{item.onset}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t text-[10px] text-gray-400 text-center font-mono">
            Projections valid for June Kharif sowing belt
          </div>
        </div>
      </div>

      {/* Row 4 — AI Warning Explanations */}
      <div className="space-y-4">
        {/* Why Risk is Increasing */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedCard(expandedCard === "whyRisk" ? "" : "whyRisk")}
            className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-brand-medium/5 transition"
          >
            <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-widest">
              <Zap size={14} className="text-[#31572c]" />
              <span>Diagnostic: Why Risk is Increasing</span>
            </div>
            <span className="text-gray-400 font-black text-xs">{expandedCard === "whyRisk" ? "▲" : "▼"}</span>
          </button>
          {expandedCard === "whyRisk" && (
            <div className="p-4 border-t border-gray-100 text-xs font-medium text-gray-700 space-y-2 leading-relaxed">
              <p>1. Extended monsoon withdrawal leading to prolonged leaf wetness period (+14 days vs 5-year average).</p>
              <p>2. Elevated minimum night temperatures (24.2°C) creating highly favorable conditions for blast sporulation.</p>
              <p>3. NDVI anomalies detected across 31 districts, indicating extensive crop stress vulnerability before pathogens attack.</p>
              <p>4. Prevailing wind vectors from the Bay of Bengal actively transport inoculum northward along standard corridors.</p>
            </div>
          )}
        </div>

        {/* Expected Spread Pattern */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedCard(expandedCard === "spread" ? "" : "spread")}
            className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-brand-medium/5 transition"
          >
            <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-widest">
              <Compass size={14} className="text-[#31572c]" />
              <span>Simulated: Expected Spread Pattern</span>
            </div>
            <span className="text-gray-400 font-black text-xs">{expandedCard === "spread" ? "▲" : "▼"}</span>
          </button>
          {expandedCard === "spread" && (
            <div className="p-4 border-t border-gray-100 text-xs font-medium text-gray-700 space-y-2 leading-relaxed">
              <p>1. Northwest to Southeast Trajectory: Initial outbreaks predicted in Punjab (Ludhiana, Amritsar) → Haryana (Karnal) → Western UP.</p>
              <p>2. Secondary wind-assisted dispersal into Central Uttar Pradesh (Kanpur, Lucknow) expected within 14 days of local triggers.</p>
              <p>3. Vector migration model indicates high probability of BPH spread across eastern coastal corridors at 3 districts/day.</p>
            </div>
          )}
        </div>

        {/* Recommended Actions */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={() => setExpandedCard(expandedCard === "actions" ? "" : "actions")}
            className="w-full flex justify-between items-center p-4 bg-gray-50/50 hover:bg-brand-medium/5 transition"
          >
            <div className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-widest">
              <Info size={14} className="text-[#31572c]" />
              <span>Directive: Recommended Actions</span>
            </div>
            <span className="text-gray-400 font-black text-xs">{expandedCard === "actions" ? "▲" : "▼"}</span>
          </button>
          {expandedCard === "actions" && (
            <div className="p-4 border-t border-gray-100 space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-semibold border-b border-gray-50 pb-2">
                <span className="bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0">URGENT</span>
                <p className="leading-relaxed">Pre-position systemic fungicide reserves (Tricyclazole) at cooperative depots in Ludhiana and Gorakhpur circles.</p>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-semibold border-b border-gray-50 pb-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0">HIGH PRIORITY</span>
                <p className="leading-relaxed">Broadcast regional radio and SMS advisory urging farmers to maintain thin water films in paddy fields to discourage hoppers.</p>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-semibold">
                <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0">MEDIUM</span>
                <p className="leading-relaxed">Initiate prophylactic border spray protocols along standard wind entry coordinates in Haryana.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
