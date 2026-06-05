import React, { useState } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell
} from "recharts";

export default function ModelIntelligence() {
  const [modelType, setModelType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const accuracyData = [
    { month: "Jan", "Disease Diagnosis": 92.1, "Crop Rec": 90.5, "Weather Advisory": 91.2 },
    { month: "Feb", "Disease Diagnosis": 93.4, "Crop Rec": 91.8, "Weather Advisory": 91.5 },
    { month: "Mar", "Disease Diagnosis": 94.2, "Crop Rec": 92.4, "Weather Advisory": 92.1 },
    { month: "Apr", "Disease Diagnosis": 95.0, "Crop Rec": 92.9, "Weather Advisory": 92.0 },
    { month: "May", "Disease Diagnosis": 95.8, "Crop Rec": 93.5, "Weather Advisory": 92.3 },
    { month: "Jun", "Disease Diagnosis": 96.2, "Crop Rec": 93.8, "Weather Advisory": 92.5 }
  ];

  const precisionRecallData = [
    { module: "Disease", Precision: 96.2, Recall: 94.8 },
    { module: "Crop Rec", Precision: 93.8, Recall: 92.1 },
    { module: "Weather", Precision: 92.5, Recall: 91.0 },
    { module: "Market", Precision: 89.4, Recall: 87.5 },
    { module: "Fertilizer", Precision: 94.1, Recall: 93.2 },
    { module: "Irrigation", Precision: 95.3, Recall: 94.0 }
  ];

  const modelsList = [
    { id: "M-GEM-3.1", name: "AgroIndia-Vision-3.1-Lite", task: "Disease & Pest Detection", accuracy: "96.2%", latency: "180ms", status: "Active", drift: "0.02%" },
    { id: "M-AGRI-REC", name: "AgroIndia-Rec-Optimizer-v2", task: "Crop & Fertilizer Planning", accuracy: "94.1%", latency: "240ms", status: "Active", drift: "0.08%" },
    { id: "M-WEATHER-L", name: "AgroIndia-Weather-Advisory-v1.4", task: "Weather Risk Translation", accuracy: "92.5%", latency: "150ms", status: "Active", drift: "0.15%" },
    { id: "M-MARKET-P", name: "AgroIndia-Market-Forecaster-v3.1", task: "Commodity Spot Pricing", accuracy: "89.4%", latency: "310ms", status: "Active", drift: "0.22%" },
    { id: "M-NLP-BERT", name: "AgroIndia-Hindi-Translator-mBERT", task: "Vernacular Chat Support", accuracy: "91.8%", latency: "95ms", status: "Active", drift: "0.05%" }
  ];

  const filteredModels = modelsList.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          model.task.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = modelType === "All" || model.task.includes(modelType);
    return matchesSearch && matchesType;
  });

  return (
    <div className="animate-fadeIn space-y-6 w-full font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
            Model Intelligence Dashboard
          </h1>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed mt-0.5">
            Real-time tracking of agricultural decision intelligence weights, precision metrics, and latency logs.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-gray-50">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Weights</span>
          </button>
          <button className="bg-[#132a13] hover:bg-[#31572c] text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-sm transition">
            Force Re-Training
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Overall Model Accuracy"
          value="94.6%"
          trend="â†‘ 0.4%"
          trendType="success"
          subtext="Standard weighted benchmark score"
          icon={
            <svg className="w-8 h-8 text-emerald-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          }
        />
        <StatsCard
          title="Disease Detection F1-Score"
          value="96.2%"
          trend="â†‘ 1.1%"
          trendType="success"
          subtext="Late blight & rust prediction weight"
          icon={
            <svg className="w-8 h-8 text-blue-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
            </svg>
          }
        />
        <StatsCard
          title="Avg Model Latency"
          value="182ms"
          trend="â†“ 8ms"
          trendType="success"
          subtext="GPU inference time per token response"
          icon={
            <svg className="w-8 h-8 text-[#90a955]/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Hallucination & Safety"
          value="0.12%"
          trend="â†“ 0.05%"
          trendType="success"
          subtext="Safety guardrail infraction rate"
          icon={
            <svg className="w-8 h-8 text-red-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      {/* AI generated insights panel */}
      <div className="bg-[#132a13] text-white p-5 rounded-2xl shadow-sm border border-[#31572c]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">AI System Performance Insight</h4>
          <p className="text-[11px] text-white/95 leading-relaxed">
            Inference accuracy on <strong className="text-[#ecf39e]">Pest Diagnosis</strong> increased by <strong>1.4%</strong> following the integration of custom Fine-Tuned LoRA weights on regional cotton field outbreaks. Latency remains optimal below safety thresholds.
          </p>
        </div>
        <div className="bg-[#4f772d]/40 border border-[#90a955]/30 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>Inference Engine: Stable</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recharts Area/Line Chart */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Accuracy trends by task</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Line type="monotone" dataKey="Disease Diagnosis" stroke="#132a13" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Crop Rec" stroke="#90a955" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Weather Advisory" stroke="#cbd5e1" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Precision vs Recall across Decision Models</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={precisionRecallData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="module" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Bar dataKey="Precision" fill="#132a13" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recall" fill="#90a955" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Performance ledger */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">Active Models & Weight Drift Ledger</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search model registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full sm:w-48 font-semibold focus:outline-none focus:border-[#31572c]"
            />
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#31572c]"
            >
              <option value="All">All Tasks</option>
              <option value="Disease">Disease Detection</option>
              <option value="Crop">Crop & Fertilizer</option>
              <option value="Weather">Weather Risk</option>
              <option value="Pricing">Commodity Pricing</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3.5">Model ID</th>
                <th className="p-3.5">Model Name</th>
                <th className="p-3.5">Primary Task</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">Avg Latency</th>
                <th className="p-3.5">Drift (30d)</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {filteredModels.map((row) => (
                <tr key={row.id} className="hover:bg-[#4f772d]/5 transition-colors duration-150">
                  <td className="p-3.5 font-mono text-gray-500">{row.id}</td>
                  <td className="p-3.5 font-black text-gray-900 tracking-tight">{row.name}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/40 px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase">
                      {row.task}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-gray-900">{row.accuracy}</td>
                  <td className="p-3.5 font-mono text-gray-500">{row.latency}</td>
                  <td className="p-3.5 font-mono text-red-600">{row.drift}</td>
                  <td className="p-3.5 text-right">
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 uppercase text-[9px] font-black tracking-wide">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredModels.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-semibold italic">
                    No models matching active filter queries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
