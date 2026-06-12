// PAGE 5 — Risk Forecasting
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/RiskForecasting.jsx

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  TrendingUp, AlertTriangle, ShieldCheck, Thermometer, 
  Droplets, CloudRain, Wind, Sparkles, Activity, Bell, CheckCircle, X
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import seededData from "../../../seed-json/seededData.json";
import { callGeminiFlash } from "../../../services/geminiService";

export default function RiskForecasting() {
  const [activeTimelineTab, setActiveTimelineTab] = useState(14); // 7, 14, 30 days
  const [notifiedDiseases, setNotifiedDiseases] = useState([]);
  const [alertModalData, setAlertModalData] = useState(null);

  const fallbackAiExplanation = {
    explanation: "Why Risk is Increasing: Sowing temperature humidity anomalies are registering a +4.2°C deviation. Coupled with prevailing North-West wind drifts blowing at 16 km/h, pathogen spore drifting vectors from adjoining Kharindwa clusters show a 92% transmission rate.",
    factors: ["Humidity >80%", "16 km/h Wind Vector", "Rust Spore Host"],
    accuracy: 94
  };

  const [aiExplanation, setAiExplanation] = useState(fallbackAiExplanation);
  const [loadingAi, setLoadingAi] = useState(false);

  // Load state from localStorage or seededData.fpoDiseaseDetection
  const [dataState] = useState(() => {
    const saved = localStorage.getItem("fpoDiseaseDetectionState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch (e) {
        console.error("Failed to parse local FPO state in RiskForecasting", e);
      }
    }
    return seededData.fpoDiseaseDetection || {};
  });

  // Call Gemini API on page load to generate the AI Risk Explanation dynamically
  useEffect(() => {
    let active = true;
    const fetchExplanation = async () => {
      setLoadingAi(true);
      try {
        const systemPrompt = "You are an AI agricultural epidemiology analyst. Always return ONLY raw JSON, no markdown, no backticks, just raw JSON.";
        const userPrompt = `Given local conditions:
- Temperature: 31.2°C (deviation: +4.2°C)
- Humidity: 82%
- Rainfall: 12mm
- Wind: 16 km/h North-West drift
- Top predicted threats: Rice Blast, Yellow Rust, Late Blight.
Return a JSON object in this exact format:
{
  "explanation": "A professional agronomical explanation of why disease risk is increasing in the region based on these parameters. Keep it under 60 words.",
  "factors": ["Factor tag 1", "Factor tag 2", "Factor tag 3"],
  "accuracy": 94
}
Make the tags short (1-3 words). Make the accuracy rating a number between 90 and 99.`;
        
        const data = await callGeminiFlash(userPrompt, systemPrompt);
        if (active && data && data.explanation) {
          setAiExplanation(data);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic AI explanation from Gemini API, using fallback", err);
      } finally {
        if (active) setLoadingAi(false);
      }
    };
    fetchExplanation();
    return () => { active = false; };
  }, []);

  const getKpiValue = (labelKey, fallback) => {
    if (!dataState.kpis) return fallback;
    if (Array.isArray(dataState.kpis)) {
      const item = dataState.kpis.find(k => k.label.toLowerCase().includes(labelKey.toLowerCase()));
      return item ? item.value : fallback;
    }
    return dataState.kpis[labelKey] || fallback;
  };

  const getKpiNumber = (labelKey, fallback) => {
    const val = getKpiValue(labelKey, fallback);
    if (typeof val === 'string') {
      return parseInt(val) || fallback;
    }
    return val;
  };

  // Overview Cards using the generic StatsCard component
  const overviewCards = [
    {
      title: "Predicted Outbreaks (14D)",
      value: dataState.predictions?.length || getKpiNumber("Outbreaks", 4),
      subtext: "High confidence clusters",
      icon: <Activity className="text-purple-600" />,
    },
    {
      title: "High Risk Villages",
      value: getKpiValue("highRiskVillages", 5),
      subtext: "Acreage risk index >70%",
      icon: <AlertTriangle className="text-red-600" />,
    },
    {
      title: "Risk Increase %",
      value: "+18.2%",
      subtext: "Atmospheric index spikes",
      icon: <TrendingUp className="text-amber-600" />,
    },
    {
      title: "Expected Yield Loss %",
      value: getKpiValue("predictedYieldLoss", "14.8%"),
      subtext: "With containment active",
      icon: <ShieldCheck className="text-emerald-600" />,
    },
  ];

  // Disease forecast table (dynamic predictions mapping)
  const forecasts = (dataState.predictions && dataState.predictions.length > 0)
    ? dataState.predictions.map(p => ({
        disease: p.disease,
        probability: p.probability,
        expectedDate: p.expectedDate,
        area: p.affectedArea || p.area || "Regional",
        confidence: typeof p.confidence === 'number' ? (p.confidence >= 85 ? "High" : p.confidence >= 70 ? "Medium" : "Low") : p.confidence
      }))
    : [
        { disease: "Rice Blast", probability: 88, expectedDate: "2026-06-08", area: "Kharindwa & Mehna", confidence: "High" },
        { disease: "Yellow Rust", probability: 74, expectedDate: "2026-06-12", area: "Bhucho Mandi", confidence: "Medium" },
        { disease: "Late Blight", probability: 60, expectedDate: "2026-06-10", area: "Raman Cluster", confidence: "High" },
        { disease: "Downy Mildew", probability: 45, expectedDate: "2026-06-15", area: "Shirur", confidence: "Low" },
        { disease: "Bacterial Leaf Spot", probability: 30, expectedDate: "2026-06-20", area: "Talwandi", confidence: "Medium" }
      ];

  // Village rankings mapped dynamically
  const rawVillages = dataState.riskVillages || dataState.highRiskVillages || [];
  const villageRankings = (rawVillages && rawVillages.length > 0)
    ? rawVillages.map((v, idx) => ({
        rank: idx + 1,
        name: v.name,
        score: v.risk || v.riskScore || 50,
        threat: v.disease || v.primaryDisease || "General Pathogen",
        trend: (v.risk || v.riskScore) >= 75 ? "up" : (v.risk || v.riskScore) <= 50 ? "down" : "stable"
      }))
    : [
        { rank: 1, name: "Kharindwa Block", score: 92, threat: "Rice Blast", trend: "up" },
        { rank: 2, name: "Talwandi Cluster", score: 84, threat: "Rice Blast", trend: "up" },
        { rank: 3, name: "Bhucho Mandi", score: 79, threat: "Yellow Rust", trend: "up" },
        { rank: 4, name: "Raman Sector", score: 71, threat: "Late Blight", trend: "stable" },
        { rank: 5, name: "Jandiali Block", score: 62, threat: "Sheath Blight", trend: "up" },
        { rank: 6, name: "Mehna Heights", score: 55, threat: "Downy Mildew", trend: "down" },
        { rank: 7, name: "Sangat Village", score: 48, threat: "Yellow Rust", trend: "stable" },
        { rank: 8, name: "Bhikhiwind Sector", score: 40, threat: "Fusarium Wilt", trend: "down" }
      ];

  // Weather grids
  const weatherFactors = [
    { name: "Temperature", current: "31.2°C", threshold: "28-30°C", contribution: 28, icon: Thermometer, color: "text-red-500 bg-red-55 animate-pulse" },
    { name: "Relative Humidity", current: "82%", threshold: "75%", contribution: 45, icon: Droplets, color: "text-blue-500 bg-blue-50" },
    { name: "Rainfall Accumulation", current: "12mm", threshold: "5mm", contribution: 18, icon: CloudRain, color: "text-indigo-500 bg-indigo-50" },
    { name: "Wind Speed / Spore Drift", current: "16 km/h", threshold: "10 km/h", contribution: 9, icon: Wind, color: "text-teal-500 bg-teal-50" }
  ];

  // Timeline probability graph helper
  const getTimelineProbabilityPoints = () => {
    if (activeTimelineTab === 7) {
      return [35, 48, 62, 58, 69, 74, 88];
    }
    if (activeTimelineTab === 14) {
      return [30, 38, 45, 52, 60, 68, 71, 75, 78, 80, 83, 85, 87, 88];
    }
    return [25, 29, 32, 36, 40, 43, 47, 51, 55, 58, 60, 62, 65, 68, 70, 72, 73, 75, 77, 79, 81, 82, 84, 85, 86, 88, 89, 90, 91, 92];
  };

  const getTimelineData = () => {
    const points = getTimelineProbabilityPoints();
    return points.map((p, idx) => ({
      day: `Day ${idx + 1}`,
      risk: p
    }));
  };

  const handleNotify = (disease) => {
    if (notifiedDiseases.includes(disease)) return;
    setNotifiedDiseases([...notifiedDiseases, disease]);
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif] p-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">AI Outbreak Risk Forecasting</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Predict pathogen hotspots up to 30 days in advance by correlating local meteorological parameters with spore vectors.
        </p>
      </div>

      {/* Row 1: Grid of Summary cards (using generic component) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, idx) => (
          <StatsCard
            key={idx}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendType={card.trend ? "danger" : "success"}
            subtext={card.subtext}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Row 2: Disease Probability Projections (Full Width) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-purple-650" /> Disease Probability Projections
        </h3>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-2.5">Disease Target</th>
                <th className="py-2.5">Probability</th>
                <th className="py-2.5 text-center">Expected Spread</th>
                <th className="py-2.5">Target Area</th>
                <th className="py-2.5 text-center">Confidence</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {forecasts.map((f, idx) => {
                const probColor = f.probability >= 80 ? "bg-red-500" : f.probability >= 50 ? "bg-amber-500" : "bg-blue-500";
                const isNotified = notifiedDiseases.includes(f.disease);

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 text-slate-900">{f.disease}</td>
                    <td className="py-3.5 w-32">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-500">{f.probability}%</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${probColor}`} style={{ width: `${f.probability}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-center text-slate-500">{f.expectedDate}</td>
                    <td className="py-3.5 text-slate-650">{f.area}</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        f.confidence === "High" ? "bg-emerald-100 text-emerald-700" : f.confidence === "Medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {f.confidence}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {isNotified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-black text-[10px] tracking-wider uppercase bg-emerald-50 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" /> Sent
                        </span>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => setAlertModalData({
                            disease: f.disease,
                            probability: f.probability,
                            expectedDate: f.expectedDate,
                            area: f.area,
                            message: `AI WARNING: High outbreak risk of ${f.disease} (${f.probability}% probability) predicted for the ${f.area} region around ${f.expectedDate}. Please deploy preventative spray controls immediately. Contact FPO technician for supply inputs.`
                          })}
                          className="px-2.5 py-1 bg-brand-dark hover:bg-[#132a13] text-white rounded font-black uppercase tracking-wider text-[9px] cursor-pointer transition-colors flex items-center gap-1.5"
                          title="Broadcast alerts to farmers in risk area"
                        >
                          <Bell className="w-3 h-3" /> Alert
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Weather Correlation Matrix (left) and Forecast Risk Timeline (right) - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weather Correlation Matrix */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
            Weather Correlation Matrix
          </h3>

          <div className="grid grid-cols-2 gap-3.5 mt-2">
            {weatherFactors.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-2 flex flex-col justify-between hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider leading-none">
                    {item.name.split(" ")[0]}
                  </span>
                  <item.icon className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div>
                  <span className="text-sm font-black text-slate-800 block">{item.current}</span>
                  <span className="text-[8.5px] text-slate-450 block leading-tight">Limit: {item.threshold}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200/50 flex justify-between text-[9px] font-bold text-red-655">
                  <span>Risk Contrib:</span>
                  <span>+{item.contribution}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Risk Timeline Graph */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 flex flex-col h-full justify-between">
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 flex-wrap gap-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Forecast Risk Timeline
              </h3>
              <div className="flex gap-1.5">
                {[7, 14, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTimelineTab(t)}
                    className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase transition cursor-pointer ${
                      activeTimelineTab === t ? "bg-brand-dark text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full pt-4 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getTimelineData()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} 
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} 
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      borderRadius: '8px', 
                      color: '#fff', 
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                    formatter={(value) => [`${value}%`, 'Risk Probability']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorRisk)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider mt-2 pt-2 border-t border-slate-50">
            Projected path showing escalation risk probability index over designated time horizons.
          </div>
        </div>
      </div>

      {/* Row 4: Village Risk Ranking (2/3 width) and AI Forecast Explanation Card (1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Village risk ranking */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
            Village Risk Ranking (1-10)
          </h3>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 mt-2 scroll-thin">
            {villageRankings.map((village) => (
              <div key={village.rank} className="flex items-center justify-between text-xs font-bold gap-3">
                <span className="h-5 w-5 bg-slate-100 text-slate-800 font-black rounded-lg flex items-center justify-center shrink-0">
                  {village.rank}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-800">{village.name}</span>
                    <span className="text-slate-400">{village.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        village.score >= 80 ? "bg-red-500" : village.score >= 60 ? "bg-amber-500" : "bg-blue-500"
                      }`} 
                      style={{ width: `${village.score}%` }} 
                    />
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-slate-50 rounded text-[9px] text-slate-450 uppercase shrink-0 font-extrabold">
                  {village.threat.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Forecast Explanation Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-[#132a13] to-[#254620] border border-[#31572c]/20 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#ecf39e] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ecf39e] animate-pulse" />
              AI Risk Explanation
            </h3>

            {loadingAi ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-2">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-[#ecf39e]" />
                <span className="text-[10px] font-bold text-emerald-250">Generating AI advisory...</span>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold leading-relaxed text-emerald-50/90">
                  {aiExplanation.explanation}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[8px] font-black text-white/50 uppercase tracking-widest block">Key Factors</span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiExplanation.factors?.map((factor, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white/10 text-[#ecf39e] rounded-full text-[9px] font-bold">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {!loadingAi && (
            <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-white/10 mt-4">
              <span className="text-white/60">Risk Confidence Score:</span>
              <span className="text-[#ecf39e] font-black">{aiExplanation.accuracy}% Accuracy Rating</span>
            </div>
          )}
        </div>

      </div>

      {/* Alert Dispatcher Modal - Rendered via React Portal */}
      {alertModalData && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#0A0D14]/70 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setAlertModalData(null)}
          />
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-[60] overflow-hidden animate-scaleIn border border-slate-100 flex flex-col font-['Plus_Jakarta_Sans',_sans-serif]">
            {/* Modal Header */}
            <div className="bg-[#132a13] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#ecf39e] animate-bounce" />
                <h3 className="text-sm font-black uppercase tracking-wider">Review & Dispatch AI Alert</h3>
              </div>
              <button 
                onClick={() => setAlertModalData(null)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700 text-left">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Recipient Audience</span>
                  <span className="text-slate-900 font-extrabold">{alertModalData.area} Farmers</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Channels</span>
                  <span className="text-slate-900 font-extrabold">SMS & WhatsApp Broadcast</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 uppercase font-black tracking-wider block">Alert Notification Message</label>
                <textarea
                  value={alertModalData.message}
                  onChange={(e) => setAlertModalData({ ...alertModalData, message: e.target.value })}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#31572c] focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-3.5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 leading-normal font-medium">
                  Dispatching this alert will send automated mobile push notifications and SMS warnings to all registered cooperative members inside the {alertModalData.area} cluster.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex gap-3 justify-end rounded-b-2xl shrink-0">
              <button
                type="button"
                onClick={() => setAlertModalData(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNotify(alertModalData.disease);
                  setAlertModalData(null);
                }}
                className="px-4 py-2 bg-brand-dark hover:bg-[#132a13] text-white rounded-lg text-xs font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" /> Send Alerts Now
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
