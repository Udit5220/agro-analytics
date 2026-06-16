import React, { useState } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";

export default function AdvisoryIntelligence() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const acceptanceTrend = [
    { month: "Jan", Generated: 12000, Accepted: 9800 },
    { month: "Feb", Generated: 15400, Accepted: 12800 },
    { month: "Mar", Generated: 21000, Accepted: 17900 },
    { month: "Apr", Generated: 28900, Accepted: 24200 },
    { month: "May", Generated: 36000, Accepted: 30800 },
    { month: "Jun", Generated: 42800, Accepted: 36209 }
  ];

  const categoryData = [
    { name: "Disease Advisory", count: 18400, color: "#132a13" },
    { name: "Crop Recs", count: 14200, color: "#31572c" },
    { name: "Weather advice", count: 24500, color: "#4f772d" },
    { name: "Market Price", count: 19800, color: "#90a955" },
    { name: "Fertilizer", count: 11200, color: "#cbd5e1" },
    { name: "Irrigation Scheduler", count: 15200, color: "#eef3eb" }
  ];

  const recentAdvisories = [
    { id: "ADV-902", topic: "Late Blight Fungicide Sprays", category: "Disease", accepted: "Yes", feedback: "Positive yield saved", crop: "Potato" },
    { id: "ADV-903", topic: "Crop switch: Sunflower selection", category: "Crop Recs", accepted: "Yes", feedback: "Sowed, healthy sprouts", crop: "Sunflower" },
    { id: "ADV-904", topic: "Postpone sowing: heavy rainfall warning", category: "Weather advice", accepted: "Yes", feedback: "Saved seed cost", crop: "Wheat" },
    { id: "ADV-905", topic: "Paddy APMC spread target: Latur APMC", category: "Market Price", accepted: "No", feedback: "Preferred local mandi", crop: "Rice" },
    { id: "ADV-906", topic: "Reduced Nitrogen limit mapping", category: "Fertilizer", accepted: "Yes", feedback: "Saves â‚¹800/acre input", crop: "Cotton" }
  ];

  const filteredAdvisories = recentAdvisories.filter(adv => {
    const matchesSearch = adv.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          adv.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || adv.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fadeIn space-y-6 w-full font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
            Advisory Intelligence Dashboard
          </h1>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed mt-0.5">
            Monitoring agricultural AI recommendations, outcome acceptance logs, and localized advisory performance metrics.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-gray-50">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Advisories</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Advisories Generated"
          value="1,42,800"
          trend="â†‘ 14.8%"
          trendType="success"
          subtext="Generated across all active state crop systems"
          icon={
            <svg className="w-8 h-8 text-emerald-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
        <StatsCard
          title="Acceptance Rate"
          value="84.6%"
          trend="â†‘ 2.1%"
          trendType="success"
          subtext="Recommendations adopted by farmers"
          icon={
            <svg className="w-8 h-8 text-blue-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
            </svg>
          }
        />
        <StatsCard
          title="Ignored Rate"
          value="10.2%"
          trend="â†“ 1.4%"
          trendType="success"
          subtext="Advisories read but not acted upon"
          icon={
            <svg className="w-8 h-8 text-[#90a955]/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatsCard
          title="Rejected Rate"
          value="5.2%"
          trend="â†“ 0.7%"
          trendType="success"
          subtext="Advisories explicitly marked incorrect"
          icon={
            <svg className="w-8 h-8 text-red-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* AI Insights panel */}
      <div className="bg-[#132a13] text-white p-5 rounded-2xl shadow-sm border border-[#31572c]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">AI Recommendation Insights</h4>
          <p className="text-[11px] text-white/95 leading-relaxed">
            Overall acceptance of <strong className="text-[#ecf39e]">Weather-influenced seed recommendations</strong> spiked following localized rain alerts in Punjab, preventing seed degradation loss estimated at â‚¹4,200/hectare.
          </p>
        </div>
        <div className="bg-[#4f772d]/40 border border-[#90a955]/30 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>FPO Sync: Active</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Volume Growth Trend (Area Chart) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Advisory Generation vs Acceptance trends</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={acceptanceTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#132a13" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#132a13" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#90a955" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#90a955" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Area type="monotone" dataKey="Generated" stroke="#132a13" strokeWidth={2} fillOpacity={1} fill="url(#colorGenerated)" />
                <Area type="monotone" dataKey="Accepted" stroke="#90a955" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAccepted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Advisory Category Breakdown */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Advisories by category</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Advisory Ledger */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">Recent Advisory Interventions</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search crop or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full sm:w-48 font-semibold focus:outline-none focus:border-[#31572c]"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#31572c]"
            >
              <option value="All">All Categories</option>
              <option value="Disease">Disease</option>
              <option value="Crop Recs">Crop Recommendation</option>
              <option value="Weather advice">Weather advice</option>
              <option value="Market Price">Market Price</option>
              <option value="Fertilizer">Fertilizer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Advisory Topic</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Target Crop</th>
                <th className="p-3.5">Accepted?</th>
                <th className="p-3.5 text-right">Farmer Outcome / Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {filteredAdvisories.map((row) => (
                <tr key={row.id} className="hover:bg-[#4f772d]/5 transition-colors duration-150">
                  <td className="p-3.5 font-mono text-gray-500">{row.id}</td>
                  <td className="p-3.5 font-black text-gray-900 tracking-tight">{row.topic}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/40 px-2 py-0.5 rounded text-[9px] font-black tracking-wide uppercase">
                      {advCategoryLabel(row.category)}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-600">{row.crop}</td>
                  <td className="p-3.5">
                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                      row.accepted === "Yes" ? "bg-emerald-50 text-emerald-700 border-emerald-150" : "bg-red-50 text-red-700 border-red-150"
                    }`}>
                      {row.accepted}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-gray-500 font-medium italic">{row.feedback}</td>
                </tr>
              ))}
              {filteredAdvisories.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-semibold italic">
                    No advisories matching active filter queries found.
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

function advCategoryLabel(val) {
  if (val === "Disease") return "Disease Control";
  if (val === "Crop Recs") return "Crop Selection";
  if (val === "Weather advice") return "Weather risk";
  if (val === "Market Price") return "APMC Market Intelligence";
  return val;
}
