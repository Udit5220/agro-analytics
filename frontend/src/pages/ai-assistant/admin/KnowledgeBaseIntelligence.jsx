import React, { useState } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function KnowledgeBaseIntelligence() {
  const [topicFilter, setTopicFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const searchCategories = [
    { category: "Pest Mgmt", Volume: 14200 },
    { category: "NPK Ratios", Volume: 11200 },
    { category: "Gov Subsidies", Volume: 9800 },
    { category: "APMC Prices", Volume: 8400 },
    { category: "Irrigation", Volume: 7100 }
  ];

  const missingTopicsData = [
    { name: "Organic Pesticides", value: 35, color: "#132a13" },
    { name: "Micro-financing", value: 25, color: "#31572c" },
    { name: "Export Protocols", value: 20, color: "#90a955" },
    { name: "Cold-chain local", value: 20, color: "#cbd5e1" }
  ];

  const missingTopics = [
    { id: "MIS-101", topic: "Bio-rational pesticides for organic chilli", category: "Pest Mgmt", searchFails: 840, priority: "High", action: "Assigned to Agronomist" },
    { id: "MIS-102", topic: "Export licensing for grapes to EU", category: "Export Protocols", searchFails: 620, priority: "High", action: "Drafting article" },
    { id: "MIS-103", topic: "Micro-irrigation subsidy in West Bengal", category: "Gov Subsidies", searchFails: 410, priority: "Medium", action: "Syncing Gov Database" },
    { id: "MIS-104", topic: "Aflatoxin sampling standards in Mandis", category: "Silo Management", searchFails: 290, priority: "Medium", action: "Reviewing standard manuals" },
    { id: "MIS-105", topic: "Organic soil amendments for salty soils", category: "NPK Ratios", searchFails: 180, priority: "Low", action: "Pending review" }
  ];

  const filteredMissing = missingTopics.filter(item => {
    const matchesSearch = item.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = topicFilter === "All" || item.priority === topicFilter;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="animate-fadeIn space-y-6 w-full font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
            Knowledge Base Intelligence
          </h1>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed mt-0.5">
            Tracking search performance, content retrieval rates, and identifying content gaps in agricultural crop planning and disease diagnostics databases.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-gray-50">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="KB Articles Accessed"
          value="24,108"
          trend="↑ 12.1%"
          trendType="success"
          subtext="Total knowledge base retrievals"
          icon={
            <svg className="w-8 h-8 text-emerald-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatsCard
          title="Most Used Recommendation"
          value="NPK Balancing"
          trend="45% share"
          trendType="success"
          subtext="Highest utility rating from cooperatives"
          icon={
            <svg className="w-8 h-8 text-blue-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
        />
        <StatsCard
          title="Failed Searches"
          value="12"
          trend="↓ 8%"
          trendType="success"
          subtext="Inquiries returning zero database matches"
          icon={
            <svg className="w-8 h-8 text-[#90a955]/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Missing Topics Identified"
          value="6"
          trend="Action items"
          trendType="danger"
          subtext="Gaps requiring immediate editorial draft"
          icon={
            <svg className="w-8 h-8 text-red-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* AI Insights panel */}
      <div className="bg-[#132a13] text-white p-5 rounded-2xl shadow-sm border border-[#31572c]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">Knowledge Retrieval Insights</h4>
          <p className="text-[11px] text-white/95 leading-relaxed">
            Pest control inquiries spiked by <strong className="text-[#ecf39e]">35%</strong> this week. The search fails indicate a critical information gap regarding **Bio-rational chilli pesticides** in Guntur AP, requiring immediate article publication.
          </p>
        </div>
        <div className="bg-brand-medium/40 border border-[#90a955]/30 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>KB Engine: Synced</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Search Volumes (Bar Chart) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Topic Retrieval Frequencies</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchCategories} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="Volume" fill="#132a13" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Missing Topics Category Breakdown (Pie Chart) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Missing knowledge area shares</h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={missingTopicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {missingTopicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 9, fontWeight: 700 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Missing Topics Ledger */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">Identified Agricultural Knowledge Gaps</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search topic or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full sm:w-48 font-semibold focus:outline-none focus:border-[#31572c]"
            />
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#31572c]"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Unresolved Search Query Topic</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Failed Inquiries</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5 text-right">Resolution Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {filteredMissing.map((row) => (
                <tr key={row.id} className="hover:bg-brand-medium/5 transition-colors duration-150">
                  <td className="p-3.5 font-mono text-gray-500">{row.id}</td>
                  <td className="p-3.5 font-black text-gray-900 tracking-tight">{row.topic}</td>
                  <td className="p-3.5 text-gray-600">{row.category}</td>
                  <td className="p-3.5 font-mono text-gray-900">{row.searchFails}</td>
                  <td className="p-3.5">
                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                      row.priority === "High" ? "bg-red-50 text-red-700 border-red-100" :
                      row.priority === "Medium" ? "bg-amber-50 text-amber-900 border-amber-200" :
                      "bg-blue-50 text-blue-800 border-blue-100"
                    }`}>
                      {row.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-emerald-700 font-bold">{row.action}</td>
                </tr>
              ))}
              {filteredMissing.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-semibold italic">
                    No missing topics matching active filter queries found.
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
