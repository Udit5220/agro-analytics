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
  Legend,
  Cell
} from "recharts";

export default function FarmerSuccess() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const roiTrend = [
    { month: "Jan", "Average Yield (Quintals/Acre)": 14.2, "Net Profit (â‚¹/Acre)": 12800 },
    { month: "Feb", "Average Yield (Quintals/Acre)": 14.8, "Net Profit (â‚¹/Acre)": 13400 },
    { month: "Mar", "Average Yield (Quintals/Acre)": 15.6, "Net Profit (â‚¹/Acre)": 14100 },
    { month: "Apr", "Average Yield (Quintals/Acre)": 16.9, "Net Profit (â‚¹/Acre)": 15900 },
    { month: "May", "Average Yield (Quintals/Acre)": 18.2, "Net Profit (â‚¹/Acre)": 17200 },
    { month: "Jun", "Average Yield (Quintals/Acre)": 19.8, "Net Profit (â‚¹/Acre)": 19400 }
  ];

  const savingsTrend = [
    { crop: "Rice", WaterSaved: 42, FertilizerSaved: 28 },
    { crop: "Wheat", WaterSaved: 35, FertilizerSaved: 22 },
    { crop: "Cotton", WaterSaved: 18, FertilizerSaved: 30 },
    { crop: "Potato", WaterSaved: 25, FertilizerSaved: 15 },
    { crop: "Soybean", WaterSaved: 12, FertilizerSaved: 18 }
  ];

  const successLedger = [
    { id: "FOC-301", farmer: "Ramesh Patidar", village: "Khandwa, MP", crop: "Soybean", yieldBoost: "+24.5%", profitGain: "+â‚¹18,500", waterSaved: "18%" },
    { id: "FOC-302", farmer: "Sukhwinder Singh", village: "Bhatinda, PB", crop: "Wheat", yieldBoost: "+18.2%", profitGain: "+â‚¹22,100", waterSaved: "22%" },
    { id: "FOC-303", farmer: "Anil Kulkarni", village: "Sangli, MH", crop: "Grapes", yieldBoost: "+32.1%", profitGain: "+â‚¹48,900", waterSaved: "15%" },
    { id: "FOC-304", farmer: "B. Ranga Reddy", village: "Guntur, AP", crop: "Chilli", yieldBoost: "+15.8%", profitGain: "+â‚¹14,200", waterSaved: "10%" },
    { id: "FOC-305", farmer: "Jitendra Prasad", village: "Basti, UP", crop: "Sugarcane", yieldBoost: "+21.4%", profitGain: "+â‚¹16,800", waterSaved: "25%" }
  ];

  const filteredSuccess = successLedger.filter(item => {
    const matchesSearch = item.farmer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.crop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === "All" || item.village.includes(regionFilter);
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="animate-fadeIn space-y-6 w-full font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
            Farmer Success & Sustainability Analytics
          </h1>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed mt-0.5">
            Measuring real-world economic returns, resource conservation volumes, and yield improvements generated via decision AI models.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-gray-50">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export ESG Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Average Yield Increase"
          value="+22.4%"
          trend="â†‘ 1.4%"
          trendType="success"
          subtext="Compared to historical pre-AI baseline"
          icon={
            <svg className="w-8 h-8 text-emerald-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatsCard
          title="Water Volume Saved"
          value="1.8M Liters"
          trend="â†‘ 14%"
          trendType="success"
          subtext="Saved via micro-advisory schedules"
          icon={
            <svg className="w-8 h-8 text-blue-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          }
        />
        <StatsCard
          title="Fertilizer Saved"
          value="450 Bags"
          trend="â†‘ 8%"
          trendType="success"
          subtext="Saved using NPK diagnostic balancing"
          icon={
            <svg className="w-8 h-8 text-[#90a955]/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          }
        />
        <StatsCard
          title="Avg Net Profit Increase"
          value="+â‚¹14,200"
          trend="â†‘ 4.2%"
          trendType="success"
          subtext="Additional income gain per acre"
          icon={
            <svg className="w-8 h-8 text-emerald-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* AI Insights panel */}
      <div className="bg-[#132a13] text-white p-5 rounded-2xl shadow-sm border border-[#31572c]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">Environmental ROI Insights</h4>
          <p className="text-[11px] text-white/95 leading-relaxed">
            Data aggregation indicates that <strong className="text-[#ecf39e]">Wheat farmers in Bhatinda</strong> reduced pumping electricity overheads by <strong>18%</strong> by adhering to the satellite rain prediction schedules.
          </p>
        </div>
        <div className="bg-[#4f772d]/40 border border-[#90a955]/30 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>ESG Metrics: Verified</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Net Profit & Yield Trend (Area Chart) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Yield (Q/Acre) & Net Profit (â‚¹/Acre) Growth Timeline</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roiTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#132a13" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#132a13" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Area type="monotone" dataKey="Net Profit (â‚¹/Acre)" stroke="#132a13" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                <Area type="monotone" dataKey="Average Yield (Quintals/Acre)" stroke="#90a955" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Resource Savings Trend (Bar Chart) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Resource Savings % by Crop Vertical</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Bar dataKey="WaterSaved" name="Water Saved (%)" fill="#132a13" radius={[4, 4, 0, 0]} />
                <Bar dataKey="FertilizerSaved" name="Fertilizer Saved (%)" fill="#90a955" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Success Ledger */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">Cooperative Success Records</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search farmer or crop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full sm:w-48 font-semibold focus:outline-none focus:border-[#31572c]"
            />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#31572c]"
            >
              <option value="All">All Regions</option>
              <option value="MP">Madhya Pradesh</option>
              <option value="PB">Punjab</option>
              <option value="MH">Maharashtra</option>
              <option value="AP">Andhra Pradesh</option>
              <option value="UP">Uttar Pradesh</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Farmer Name</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Crop</th>
                <th className="p-3.5">Yield Boost</th>
                <th className="p-3.5">Profit Gain</th>
                <th className="p-3.5 text-right">Water Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {filteredSuccess.map((row) => (
                <tr key={row.id} className="hover:bg-[#4f772d]/5 transition-colors duration-150">
                  <td className="p-3.5 font-mono text-gray-500">{row.id}</td>
                  <td className="p-3.5 font-black text-gray-900 tracking-tight">{row.farmer}</td>
                  <td className="p-3.5 text-gray-600">{row.village}</td>
                  <td className="p-3.5 text-gray-600">{row.crop}</td>
                  <td className="p-3.5 text-emerald-700 font-bold">{row.yieldBoost}</td>
                  <td className="p-3.5 text-emerald-700 font-bold">{row.profitGain}</td>
                  <td className="p-3.5 text-right font-mono text-gray-900">{row.waterSaved}</td>
                </tr>
              ))}
              {filteredSuccess.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-semibold italic">
                    No success records matching active filter queries found.
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
