import React, { useState, useEffect } from "react";
import {
  CloudLightning,
  Thermometer,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Landmark,
  Loader2,
  FileText,
  TrendingDown,
  CloudOff,
  Droplets,
} from "lucide-react";
import { profileApi } from "../../../services/apiService";

// ─── CROP VULNERABILITY MATRIX ─────────────────────────────────────
const CROP_CLIMATE_DATA = [
  {
    id: "rice", name: "Rice", hindi: "धान",
    heatStress: 65, drought: 85, flood: 30, frost: 90, hailstorm: 55,
    baseYield: 22, criticalTemp: 35, floodTolerance: "High", droughtTolerance: "Very Low",
  },
  {
    id: "wheat", name: "Wheat", hindi: "गेहूं",
    heatStress: 80, drought: 60, flood: 70, frost: 40, hailstorm: 75,
    baseYield: 19, criticalTemp: 32, floodTolerance: "Low", droughtTolerance: "Medium",
  },
  {
    id: "maize", name: "Maize", hindi: "मक्का",
    heatStress: 70, drought: 70, flood: 65, frost: 85, hailstorm: 60,
    baseYield: 21, criticalTemp: 38, floodTolerance: "Low", droughtTolerance: "Medium",
  },
  {
    id: "cotton", name: "Cotton", hindi: "कपास",
    heatStress: 40, drought: 55, flood: 75, frost: 95, hailstorm: 80,
    baseYield: 8.5, criticalTemp: 40, floodTolerance: "Very Low", droughtTolerance: "Medium",
  },
  {
    id: "mustard", name: "Mustard", hindi: "सरसों",
    heatStress: 75, drought: 30, flood: 60, frost: 55, hailstorm: 70,
    baseYield: 7.5, criticalTemp: 30, floodTolerance: "Low", droughtTolerance: "High",
  },
  {
    id: "sugarcane", name: "Sugarcane", hindi: "गन्ना",
    heatStress: 35, drought: 80, flood: 40, frost: 85, hailstorm: 45,
    baseYield: 340, criticalTemp: 42, floodTolerance: "Medium", droughtTolerance: "Low",
  },
  {
    id: "bajra", name: "Bajra", hindi: "बाजरा",
    heatStress: 20, drought: 15, flood: 80, frost: 75, hailstorm: 50,
    baseYield: 9.2, criticalTemp: 45, floodTolerance: "Very Low", droughtTolerance: "Very High",
  },
  {
    id: "soybean", name: "Soybean", hindi: "सोयाबीन",
    heatStress: 60, drought: 65, flood: 70, frost: 80, hailstorm: 65,
    baseYield: 12, criticalTemp: 36, floodTolerance: "Low", droughtTolerance: "Medium",
  },
];

// ─── HISTORICAL CLIMATE EVENTS ─────────────────────────────────────
const HISTORICAL_EVENTS = [
  { year: 2024, event: "Late Monsoon Drought", type: "Drought", duration: "45 days", impact: "22% yield loss in Kharif cereals", severity: "High", region: "Haryana, Rajasthan" },
  { year: 2023, event: "Unseasonal Hailstorm", type: "Hailstorm", duration: "3 days", impact: "Wheat crop damaged across 12,000 hectares", severity: "Critical", region: "Punjab, Haryana" },
  { year: 2023, event: "Western Disturbance Frost", type: "Frost", duration: "8 days", impact: "Mustard flowering stage severely affected", severity: "High", region: "North India" },
  { year: 2022, event: "Flash Flood — Yamuna Belt", type: "Flood", duration: "12 days", impact: "Complete crop loss in 6,500+ acres", severity: "Critical", region: "Faridabad, Palwal" },
  { year: 2022, event: "Heat Wave Event", type: "Heat", duration: "18 days", impact: "Wheat grain shriveling, 15% yield drop", severity: "High", region: "Central India" },
  { year: 2021, event: "Extended Monsoon Excess", type: "Flood", duration: "25 days", impact: "Rice waterlogging caused 18% loss", severity: "Medium", region: "Eastern Haryana" },
];

const getSeverityBadge = (sev) => {
  if (sev === "Critical") return "bg-red-50 text-red-950 border border-red-300";
  if (sev === "High") return "bg-amber-50 text-amber-950 border border-amber-300";
  if (sev === "Medium") return "bg-[#ecf39e] text-[#132a13] border border-[#90a955]/40";
  return "bg-emerald-50 text-emerald-950 border border-emerald-300";
};

const getVulnBadge = (score) => {
  if (score >= 80) return { label: "Critical", style: "bg-red-50 text-red-950 border border-red-300" };
  if (score >= 60) return { label: "High", style: "bg-amber-50 text-amber-950 border border-amber-300" };
  if (score >= 35) return { label: "Medium", style: "bg-[#ecf39e] text-[#132a13] border border-[#90a955]/40" };
  return { label: "Low", style: "bg-emerald-50 text-emerald-950 border border-emerald-300" };
};

const getBarColor = (score) => {
  if (score >= 80) return "bg-red-500";
  if (score >= 60) return "bg-amber-500";
  if (score >= 35) return "bg-yellow-400";
  return "bg-emerald-500";
};

const getRiskIcon = (type) => {
  switch (type) {
    case "Heat": return <Sun className="w-3.5 h-3.5" />;
    case "Drought": return <CloudOff className="w-3.5 h-3.5" />;
    case "Flood": return <Droplets className="w-3.5 h-3.5" />;
    case "Frost": return <Snowflake className="w-3.5 h-3.5" />;
    case "Hailstorm": return <CloudLightning className="w-3.5 h-3.5" />;
    default: return <AlertTriangle className="w-3.5 h-3.5" />;
  }
};

export default function ClimateRiskSimulator() {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Scenario control sliders
  const [tempDeviation, setTempDeviation] = useState(2);
  const [rainfallDeviation, setRainfallDeviation] = useState(-20);
  const [droughtDays, setDroughtDays] = useState(15);
  const [floodDays, setFloodDays] = useState(0);

  useEffect(() => {
    const loadFarms = async () => {
      try {
        setIsLoading(true);
        const res = await profileApi.getProfile();
        if (res?.success && res?.data?.farms?.length > 0) {
          setFarms(res.data.farms);
          setSelectedFarmId(res.data.farms[0]._id);
        }
      } catch (err) {
        console.warn("Profile offline — using standalone mode.");
      } finally {
        setIsLoading(false);
      }
    };
    loadFarms();
  }, []);

  // Calculate yield impact per crop based on scenario
  const getYieldImpact = (crop) => {
    let loss = 0;
    // Heat stress impact
    if (tempDeviation > 0) {
      loss += (crop.heatStress / 100) * tempDeviation * 4;
    }
    // Drought impact
    if (droughtDays > 0) {
      loss += (crop.drought / 100) * (droughtDays / 30) * 25;
    }
    // Flood impact
    if (floodDays > 0) {
      loss += (crop.flood / 100) * (floodDays / 15) * 20;
    }
    // Rainfall deviation impact
    if (rainfallDeviation < 0) {
      loss += (crop.drought / 100) * Math.abs(rainfallDeviation) * 0.15;
    } else if (rainfallDeviation > 0) {
      loss += (crop.flood / 100) * rainfallDeviation * 0.1;
    }
    // Frost from negative temp
    if (tempDeviation < -2) {
      loss += (crop.frost / 100) * Math.abs(tempDeviation) * 5;
    }
    return Math.min(95, Math.round(loss));
  };

  // Compute overall risk level
  const avgYieldLoss = Math.round(
    CROP_CLIMATE_DATA.reduce((sum, c) => sum + getYieldImpact(c), 0) / CROP_CLIMATE_DATA.length
  );

  const overallRisk = avgYieldLoss >= 30 ? "Critical" : avgYieldLoss >= 15 ? "High" : avgYieldLoss >= 5 ? "Medium" : "Low";

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <CloudLightning className="h-6 w-6 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Climate Risk Simulator</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-black text-sm md:text-base">
              जलवायु जोखिम सिम्युलेटर
            </span>
          </h1>
        </div>
        <p className="text-gray-800 text-[11px] md:text-xs font-semibold mt-1.5">
          Simulate extreme weather scenarios and assess crop vulnerability, projected yield loss, and mitigation strategies.
        </p>
      </div>

      {/* Farm Selector */}
      {farms.length > 0 && (
        <div className="bg-white border border-gray-300 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#31572c]/10 rounded-xl text-[#31572c]">
              <Landmark size={18} />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-800 uppercase block tracking-wider">Active Farm</label>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="mt-1 appearance-none bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c] cursor-pointer min-w-[240px]"
              >
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.totalLand} Acres)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${getSeverityBadge(overallRisk)}`}>
            Overall Risk: {overallRisk}
          </div>
        </div>
      )}

      {/* Scenario Controls */}
      <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
        <h2 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
          <Wind className="w-4 h-4 text-[#31572c]" />
          Climate Scenario Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Temperature Deviation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-red-600" />
                Temp Deviation
              </label>
              <span className={`text-xs font-black ${tempDeviation > 0 ? "text-red-700" : tempDeviation < 0 ? "text-blue-700" : "text-gray-700"}`}>
                {tempDeviation > 0 ? "+" : ""}{tempDeviation}°C
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="8"
              value={tempDeviation}
              onChange={(e) => setTempDeviation(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-red-600"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #e5e7eb 35%, #ef4444 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-gray-600 font-bold mt-1">
              <span>−5°C (Cold)</span>
              <span>+8°C (Heat)</span>
            </div>
          </div>

          {/* Rainfall Deviation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                Rainfall Shift
              </label>
              <span className={`text-xs font-black ${rainfallDeviation > 0 ? "text-blue-700" : rainfallDeviation < 0 ? "text-amber-700" : "text-gray-700"}`}>
                {rainfallDeviation > 0 ? "+" : ""}{rainfallDeviation}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={rainfallDeviation}
              onChange={(e) => setRainfallDeviation(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #f59e0b 0%, #e5e7eb 50%, #3b82f6 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-gray-600 font-bold mt-1">
              <span>−50% (Drought)</span>
              <span>+50% (Excess)</span>
            </div>
          </div>

          {/* Drought Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Drought Days
              </label>
              <span className="text-xs font-black text-amber-700">{droughtDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={droughtDays}
              onChange={(e) => setDroughtDays(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-amber-600"
              style={{
                background: `linear-gradient(to right, #31572c ${(droughtDays / 60) * 100}%, #e5e7eb ${(droughtDays / 60) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-gray-600 font-bold mt-1">
              <span>0 days</span>
              <span>60 days</span>
            </div>
          </div>

          {/* Flood Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                Flood Days
              </label>
              <span className="text-xs font-black text-blue-700">{floodDays} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={floodDays}
              onChange={(e) => setFloodDays(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, #31572c ${(floodDays / 30) * 100}%, #e5e7eb ${(floodDays / 30) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-gray-600 font-bold mt-1">
              <span>0 days</span>
              <span>30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerability Matrix + Yield Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* Vulnerability Table */}
        <div className="bg-white border border-gray-300 rounded-2xl p-1 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-100">
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase bg-gray-200 border-r border-gray-300">Crop</th>
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase text-center">
                    <div className="flex items-center justify-center gap-1"><Thermometer className="w-3 h-3 text-red-600" /> Heat</div>
                  </th>
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase text-center">
                    <div className="flex items-center justify-center gap-1"><Sun className="w-3 h-3 text-amber-600" /> Drought</div>
                  </th>
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase text-center">
                    <div className="flex items-center justify-center gap-1"><Droplets className="w-3 h-3 text-blue-600" /> Flood</div>
                  </th>
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase text-center">
                    <div className="flex items-center justify-center gap-1"><Snowflake className="w-3 h-3 text-cyan-600" /> Frost</div>
                  </th>
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase text-center">
                    <div className="flex items-center justify-center gap-1"><CloudLightning className="w-3 h-3 text-purple-600" /> Hail</div>
                  </th>
                  <th className="p-3.5 text-[10px] font-black text-gray-950 tracking-wider uppercase text-center">Est. Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {CROP_CLIMATE_DATA.map((crop) => {
                  const yieldLoss = getYieldImpact(crop);
                  return (
                    <tr key={crop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3.5 bg-gray-50 border-r border-gray-200">
                        <span className="text-xs font-black text-gray-950">{crop.name}</span>
                        <span className="text-[10px] font-bold text-gray-600 ml-1">{crop.hindi}</span>
                      </td>
                      {[crop.heatStress, crop.drought, crop.flood, crop.frost, crop.hailstorm].map((score, i) => {
                        const badge = getVulnBadge(score);
                        return (
                          <td key={i} className="p-3.5 text-center">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${badge.style}`}>
                              {badge.label}
                            </span>
                          </td>
                        );
                      })}
                      <td className="p-3.5 text-center">
                        <span className={`text-sm font-black ${yieldLoss >= 25 ? "text-red-700" : yieldLoss >= 10 ? "text-amber-700" : "text-emerald-700"}`}>
                          −{yieldLoss}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yield Loss Bar Chart */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <TrendingDown className="w-4 h-4 text-red-600" />
            Projected Yield Loss
          </h3>
          <div className="space-y-3">
            {CROP_CLIMATE_DATA.map((crop) => {
              const loss = getYieldImpact(crop);
              return (
                <div key={crop.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-black text-gray-800">
                    <span>{crop.name}</span>
                    <span className={loss >= 25 ? "text-red-700" : loss >= 10 ? "text-amber-700" : "text-emerald-700"}>
                      −{loss}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getBarColor(loss)}`}
                      style={{ width: `${Math.max(3, loss)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 text-center">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Average Loss: </span>
            <span className={`text-sm font-black ${avgYieldLoss >= 20 ? "text-red-700" : avgYieldLoss >= 10 ? "text-amber-700" : "text-emerald-700"}`}>
              −{avgYieldLoss}%
            </span>
          </div>
        </div>
      </div>

      {/* Historical Events + Mitigation Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Historical Climate Events */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[11px] font-black text-gray-950 uppercase tracking-wider flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Regional Climate Event History
          </h3>
          <div className="space-y-2.5">
            {HISTORICAL_EVENTS.map((evt, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-start gap-3">
                <div className={`p-1.5 rounded-lg mt-0.5 ${evt.severity === "Critical" ? "bg-red-100 text-red-700" : evt.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {getRiskIcon(evt.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-gray-950">{evt.event}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${getSeverityBadge(evt.severity)}`}>
                      {evt.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-600 font-bold">
                    <span>{evt.year}</span>
                    <span>·</span>
                    <span>{evt.duration}</span>
                    <span>·</span>
                    <span>{evt.region}</span>
                  </div>
                  <p className="text-[10px] text-gray-700 font-semibold mt-1">{evt.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation Strategies + Insurance */}
        <div className="space-y-5">
          {/* Mitigation Strategies */}
          <div className="bg-[#4f772d]/[0.06] border border-gray-300 rounded-2xl p-5 space-y-3">
            <h3 className="text-[11px] font-black text-[#132a13] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#31572c]" />
              Mitigation Strategies
            </h3>
            <div className="space-y-2.5">
              {tempDeviation > 3 && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Thermometer className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-gray-950">Heat Wave Defense</h4>
                    <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                      Apply protective irrigation during 12–3 PM. Use heat-tolerant varieties (HD 3226 for wheat, Pusa Basmati 1121 for rice). Mulching reduces soil temperature by 3–5°C.
                    </p>
                  </div>
                </div>
              )}
              {droughtDays > 10 && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Sun className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-gray-950">Drought Resilience</h4>
                    <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                      Switch to drought-tolerant crops (Bajra, Mustard). Implement micro-irrigation (drip/sprinkler). Apply potassium-rich fertilizers to improve water-use efficiency.
                    </p>
                  </div>
                </div>
              )}
              {floodDays > 5 && (
                <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Droplets className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-gray-950">Flood Protection</h4>
                    <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                      Maintain proper drainage channels. Raise nursery beds 15–20cm above field level. Store seeds on elevated platforms. Apply fungicide post-flood to prevent root rot.
                    </p>
                  </div>
                </div>
              )}
              <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#31572c] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-gray-950">Crop Diversification</h4>
                  <p className="text-[10px] text-gray-700 font-semibold mt-0.5">
                    Growing 2–3 different crops across seasons reduces overall climate risk exposure by <span className="text-[#31572c] font-black">35–50%</span> compared to monoculture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Advisory */}
          <div className="bg-white border border-[#31572c]/20 rounded-2xl p-5 space-y-3">
            <h3 className="text-[11px] font-black text-[#132a13] uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#31572c]" />
              Insurance Coverage Advisory
            </h3>
            <div className="bg-[#31572c]/5 border border-[#31572c]/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Scheme</span>
                <span className="font-black text-gray-950 block mt-0.5">Pradhan Mantri Fasal Bima Yojana</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Premium</span>
                <span className="font-black text-[#31572c] block mt-0.5">
                  {avgYieldLoss >= 20 ? "₹3,200/acre (High risk)" : avgYieldLoss >= 10 ? "₹2,500/acre (Moderate)" : "₹1,800/acre (Standard)"}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Recommendation</span>
                <span className={`font-black block mt-0.5 ${avgYieldLoss >= 15 ? "text-red-700" : "text-emerald-700"}`}>
                  {avgYieldLoss >= 15 ? "Strongly Recommended" : "Optional — Low Exposure"}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-gray-700 font-semibold">
              Deadline for Kharif enrollment: <span className="text-amber-700 font-black">31st July 2026</span> · 
              Rabi enrollment: <span className="text-amber-700 font-black">31st December 2026</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
