import React from "react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function CommunicationIntelligence() {
  // Top agricultural query metrics
  const stats = [
    {
      title: "Disease Diagnostics",
      value: "24,180",
      trend: "↑ 14.2% MoM",
      trendType: "danger",
      subtext: "Crop pathogen photo scans",
    },
    {
      title: "Pest Control Queries",
      value: "15,800",
      trend: "↑ 8.5%",
      trendType: "danger",
      subtext: "Infestation mitigation requests",
    },
    {
      title: "Market Price Queries",
      value: "28,110",
      trend: "↑ 12.1%",
      trendType: "success",
      subtext: "Mandi price & forecast lookup",
    },
    {
      title: "Scheme & Subsidy Queries",
      value: "11,400",
      trend: "↑ 18.4%",
      trendType: "success",
      subtext: "Government financial assistance",
    },
  ];

  // Seasonal inquiry volumes across cycles (Kharif, Rabi, Zaid)
  const seasonalTrendData = [
    { cycle: "2024-C1", kharif: 32000, rabi: 28000, zaid: 8000 },
    { cycle: "2024-C2", kharif: 38000, rabi: 31000, zaid: 9200 },
    { cycle: "2025-C1", kharif: 44000, rabi: 36000, zaid: 11000 },
    { cycle: "2025-C2", kharif: 51000, rabi: 42000, zaid: 12500 },
    { cycle: "2026-C1", kharif: 58402, rabi: 49100, zaid: 14800 },
  ];

  // Most Asked Topics dataset
  const askedTopics = [
    {
      topic: "Yellow Rust warning signs in wheat leaf photo",
      volume: "8,402",
      confidence: "96.4%",
      resolution: "91.2%",
      status: "OPTIMIZED",
    },
    {
      topic: "Indore Mandi price trends for Soybean today",
      volume: "6,911",
      confidence: "98.5%",
      resolution: "97.4%",
      status: "OPTIMIZED",
    },
    {
      topic: "Subsurface drip irrigation layouts for Sugarcane",
      volume: "4,120",
      confidence: "84.2%",
      resolution: "79.5%",
      status: "REVIEW REQ",
    },
    {
      topic: "NPK fertilizer ratio adjustments for 40-day Cotton",
      volume: "3,890",
      confidence: "89.1%",
      resolution: "85.2%",
      status: "OPTIMIZED",
    },
    {
      topic: "PM Kisan Samman Nidhi installment status check",
      volume: "3,210",
      confidence: "99.1%",
      resolution: "98.4%",
      status: "OPTIMIZED",
    },
  ];

  // Most Escalated Agricultural Topics dataset
  const escalatedTopics = [
    {
      topic: "Unidentified white spots on Organic Tomato leaf scan",
      escalations: "420",
      reason: "Model confidence below 60% threshold",
      urgency: "HIGH",
      agronomist: "Dr. Sunil Sen",
    },
    {
      topic: "PM Fasal Bima Yojana crop loss claim verification",
      escalations: "380",
      reason: "Complex legal document extraction failed",
      urgency: "CRITICAL",
      agronomist: "Gov Liaison Desk",
    },
    {
      topic: "Soil micro-nutrient imbalance diagnosis with high salt",
      escalations: "180",
      reason: "Custom fertilizer formulation required",
      urgency: "MEDIUM",
      agronomist: "Dr. Elena Rossi",
    },
  ];

  const renderStatusBadge = (value) => {
    let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200/40";
    if (value === "OPTIMIZED") {
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100/50";
    } else if (value === "REVIEW REQ") {
      badgeStyle = "bg-amber-50 text-amber-900 border-amber-200";
    }

    return (
      <span className={`inline-block text-[9px] font-black tracking-wide px-2 py-0.5 rounded border uppercase ${badgeStyle}`}>
        {value}
      </span>
    );
  };

  const askedColumns = [
    {
      header: "Inquiry Topic",
      accessor: "topic",
      className: "w-1/2 min-w-[250px]",
      cellClassName: "font-semibold text-gray-700 text-xs py-3",
    },
    {
      header: "Volume",
      accessor: "volume",
      className: "w-1/8 text-left",
      cellClassName: "font-bold text-gray-900 font-mono text-xs py-3",
    },
    {
      header: "AI Confidence",
      accessor: "confidence",
      className: "w-1/8 text-left",
      cellClassName: "font-semibold text-gray-600 font-mono text-xs py-3",
    },
    {
      header: "Resolution Rate",
      accessor: "resolution",
      className: "w-1/8 text-left",
      cellClassName: "font-semibold text-gray-600 font-mono text-xs py-3",
    },
    {
      header: "Status",
      accessor: "status",
      className: "w-1/8 text-left",
      cellClassName: "py-3",
      cell: (value) => renderStatusBadge(value),
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Title Header Section without filters, state toggle, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Agricultural Inquiry Intelligence
        </h1>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">
          Traces incoming farmer question streams, seasonal crop query shifts, and agronomist escalations.
        </p>
      </div>

      {/* Top HUD metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <StatsCard
            key={idx}
            title={item.title}
            value={item.value}
            trend={item.trend}
            trendType={item.trendType}
            subtext={item.subtext}
          />
        ))}
      </div>

      {/* AI Insights & Dynamic Seasonal Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seasonal Query Trends Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                Seasonal Query Analysis (Kharif, Rabi, Zaid)
              </h3>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                Query load trend comparison across crop cycles (Kharif peak June-Oct, Rabi Nov-April)
              </p>
            </div>
            <span className="text-[9px] font-bold text-gray-600 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded-lg">
              Seasonal Monitor
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKharif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#132a13" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#132a13" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRabi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#90a955" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#90a955" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="cycle" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
                <Area type="monotone" dataKey="kharif" name="Kharif Season" stroke="#132a13" fillOpacity={1} fill="url(#colorKharif)" />
                <Area type="monotone" dataKey="rabi" name="Rabi Season" stroke="#90a955" fillOpacity={1} fill="url(#colorRabi)" />
                <Area type="monotone" dataKey="zaid" name="Zaid Season" stroke="#cbd5e1" strokeDasharray="3 3" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Seasonal Summary */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3.5">
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Agricultural AI Inquiries Panel
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 leading-normal">
              Real-time observation of language query patterns.
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <h4 className="text-xs font-bold text-[#132a13]">Rabi Season Surge Alert</h4>
                <p className="text-[11px] text-emerald-800 mt-1 leading-normal">
                  Wheat rust inquiries surged by **34%** during cycle **2026-C1**. Promptly integrated local pest advice modules to prevent crop degradation.
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <h4 className="text-xs font-bold text-amber-900">Mandi Price Forecasting Demand</h4>
                <p className="text-[11px] text-amber-800 mt-1 leading-normal">
                  Traders are requesting price volatility trends before harvests. Market queries represent **35%** of inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section: Most Asked & Most Escalated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Asked Topics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-3">
              Most Asked Agricultural Topics
            </h3>
            <p className="text-[11px] font-semibold text-gray-500 mb-4 leading-normal">
              High-frequency questions identified by AI categorizers
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase">Topic</th>
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase text-right">Volume</th>
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase text-right">Confidence</th>
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                  {askedTopics.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#4f772d]/5 transition-colors">
                      <td className="p-2 truncate max-w-[200px]">{item.topic}</td>
                      <td className="p-2 text-right font-mono text-gray-900">{item.volume}</td>
                      <td className="p-2 text-right font-mono text-gray-600">{item.confidence}</td>
                      <td className="p-2 text-right">{renderStatusBadge(item.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Most Escalated Agricultural Topics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-3">
              Most Escalated Agricultural Topics
            </h3>
            <p className="text-[11px] font-semibold text-gray-500 mb-4 leading-normal">
              Inquiries routed to agricultural extension specialists
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase">Escalated Query</th>
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase text-right">Escalations</th>
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase">Root Cause</th>
                    <th className="p-2 text-[9px] font-bold text-gray-400 uppercase text-right">Expert Assigned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                  {escalatedTopics.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#4f772d]/5 transition-colors">
                      <td className="p-2 font-bold text-gray-900 truncate max-w-[150px]">{item.topic}</td>
                      <td className="p-2 text-right font-mono text-red-600">{item.escalations}</td>
                      <td className="p-2 text-gray-500 truncate max-w-[120px]">{item.reason}</td>
                      <td className="p-2 text-right">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-100">
                          {item.agronomist}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
