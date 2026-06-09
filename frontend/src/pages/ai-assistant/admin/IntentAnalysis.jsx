import React from "react";
import StatsCard from "../../../components/partials/StatsCard";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function IntentAnalysis() {
  // Core metrics
  const summaryMetrics = [
    {
      title: "Intent Accuracy",
      value: "96.4%",
      trend: "+0.4%",
      trendType: "success",
      subtext: "Correct classification threshold",
    },
    {
      title: "Intent Resolution Rate",
      value: "89.2%",
      trend: "+1.2%",
      trendType: "success",
      subtext: "Auto-resolved on first query",
    },
    {
      title: "Emerging Intent Rate",
      value: "+24% MoM",
      trend: "Spike",
      trendType: "danger",
      subtext: "Locust & drought alert topics",
    },
    {
      title: "Total Classified Intents",
      value: "158,400",
      trend: "+15.3%",
      trendType: "success",
      subtext: "Assigned to ag-taxonomy",
    },
  ];

  // Intent Distribution
  const intentDistribution = [
    { name: "Disease Diagnosis", value: 28, color: "#132a13" },
    { name: "Pest Management", value: 20, color: "#31572c" },
    { name: "Crop Recommendation", value: 18, color: "#4f772d" },
    { name: "Weather Advisory", value: 14, color: "#90a955" },
    { name: "Market Intelligence", value: 10, color: "#cbd5e1" },
    { name: "Other Advisories", value: 10, color: "#8a9a86" },
  ];

  // 6-Month Intent Growth Trend
  const growthTrendData = [
    { month: "Jan", disease: 12000, pest: 8000, weather: 10000, market: 4000 },
    { month: "Feb", disease: 14200, pest: 9500, weather: 11000, market: 4200 },
    { month: "Mar", disease: 18000, pest: 13000, weather: 14000, market: 5100 },
    { month: "Apr", disease: 25000, pest: 19000, weather: 17000, market: 6300 },
    { month: "May", disease: 32000, pest: 24000, weather: 22000, market: 8200 },
    { month: "Jun", disease: 44352, pest: 31600, weather: 27720, market: 15840 },
  ];

  // Intent Resolution Heatmap Grid Rows
  const heatmapRows = [
    {
      intent: "Disease Diagnosis",
      volume: "44,352",
      accuracy: "97.2%",
      resolution: "91.5%",
      escalation: "4.2%",
      status: "OPTIMIZED",
      bgClass: "bg-emerald-100 text-emerald-800",
    },
    {
      intent: "Pest Management",
      volume: "31,600",
      accuracy: "94.8%",
      resolution: "88.2%",
      escalation: "6.8%",
      status: "OPTIMIZED",
      bgClass: "bg-emerald-100 text-emerald-800",
    },
    {
      intent: "Crop Recommendation",
      volume: "28,512",
      accuracy: "96.1%",
      resolution: "89.4%",
      escalation: "3.5%",
      status: "OPTIMIZED",
      bgClass: "bg-emerald-100 text-emerald-800",
    },
    {
      intent: "Weather Advisory",
      volume: "22,176",
      accuracy: "98.4%",
      resolution: "96.8%",
      escalation: "0.5%",
      status: "OPTIMIZED",
      bgClass: "bg-emerald-100 text-emerald-800",
    },
    {
      intent: "Market Intelligence",
      volume: "15,840",
      accuracy: "95.5%",
      resolution: "86.1%",
      escalation: "7.4%",
      status: "OPTIMIZED",
      bgClass: "bg-emerald-100 text-emerald-800",
    },
    {
      intent: "Irrigation Advisory",
      volume: "7,920",
      accuracy: "91.2%",
      resolution: "79.0%",
      escalation: "11.2%",
      status: "REVIEW REQ",
      bgClass: "bg-amber-100 text-amber-900",
    },
    {
      intent: "Fertilizer Guidance",
      volume: "4,752",
      accuracy: "92.0%",
      resolution: "81.3%",
      escalation: "9.5%",
      status: "OPTIMIZED",
      bgClass: "bg-emerald-100 text-emerald-800",
    },
    {
      intent: "Insurance Support",
      volume: "2,376",
      accuracy: "86.5%",
      resolution: "64.2%",
      escalation: "24.8%",
      status: "ACTION REQ",
      bgClass: "bg-red-100 text-red-700",
    },
    {
      intent: "Government Schemes",
      volume: "1,584",
      accuracy: "89.0%",
      resolution: "71.0%",
      escalation: "18.6%",
      status: "REVIEW REQ",
      bgClass: "bg-amber-100 text-amber-900",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Title Header Grid without filters, state toggle, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Agricultural Intent Taxonomy & Analysis
        </h1>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">
          Monitors natural language classification accuracy, resolution latency, and emerging intent spikes.
        </p>
      </div>

      {/* HUD Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((metric, idx) => (
          <StatsCard
            key={idx}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            trendType={metric.trendType}
            subtext={metric.subtext}
          />
        ))}
      </div>

      {/* AI Insights Panel */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
        <div className="w-6 h-6 rounded bg-[#132a13] flex items-center justify-center flex-shrink-0 text-white text-xs">
          ★
        </div>
        <div>
          <h4 className="text-xs font-black text-gray-955">AI Intent Outbreak Warning</h4>
          <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed font-semibold">
            Emerging intent detection flagged a **24%** spike in **Insurance Support** queries in the Southern Maharashtra cluster. This coincides with localized crop inundation reports. The classification accuracy has remained stable at **96.4%** following model tuning.
          </p>
        </div>
      </div>

      {/* Donut and Line Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intent Distribution Donut */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Intent Distribution
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Breakdown of classified queries by agricultural intent category
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={intentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {intentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-4 border-t border-gray-50 pt-3">
            {intentDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px] font-semibold">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 truncate">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intent Growth Trends over 6 months */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Intent Growth Trend
            </h3>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
              Volume progression of critical intents over the last 6 months
            </p>
          </div>

          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                <Line type="monotone" dataKey="disease" name="Disease Diagnosis" stroke="#132a13" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pest" name="Pest Management" stroke="#31572c" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="weather" name="Weather Advisory" stroke="#90a955" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="market" name="Market Price" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Intent Resolution Heatmap Grid */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div>
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-3">
            Intent Resolution Heatmap Matrix
          </h3>
          <p className="text-[11px] font-semibold text-gray-500 mb-4 leading-normal">
            Analysis of classification accuracy, resolution rates, and human escalations per intent type
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3">Agricultural Intent</th>
                <th className="p-3 text-center">Consultation Volume</th>
                <th className="p-3 text-center">Classification Accuracy</th>
                <th className="p-3 text-center">Auto-Resolution Rate</th>
                <th className="p-3 text-center">Escalation Rate</th>
                <th className="p-3 text-right">Optimization Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {heatmapRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#4f772d]/5 transition-colors">
                  <td className="p-3 font-bold text-gray-900">{row.intent}</td>
                  <td className="p-3 text-center font-mono">{row.volume}</td>
                  <td className="p-3 text-center font-mono">{row.accuracy}</td>
                  <td className="p-3 text-center font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${row.bgClass}`}>
                      {row.resolution}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-red-600">{row.escalation}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${
                      row.status === "OPTIMIZED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100/50"
                        : row.status === "REVIEW REQ"
                        ? "bg-amber-50 text-amber-900 border-amber-200"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
