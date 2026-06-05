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

export default function DiseaseIntelligence() {
  const [diseaseFilter, setDiseaseFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const outbreakTrends = [
    { month: "Jan", "Rice Blast": 1400, "Late Blight": 900, "Cotton Whitefly": 400 },
    { month: "Feb", "Rice Blast": 1800, "Late Blight": 1200, "Cotton Whitefly": 600 },
    { month: "Mar", "Rice Blast": 2300, "Late Blight": 1900, "Cotton Whitefly": 1100 },
    { month: "Apr", "Rice Blast": 3400, "Late Blight": 2800, "Cotton Whitefly": 1800 },
    { month: "May", "Rice Blast": 4900, "Late Blight": 3200, "Cotton Whitefly": 2200 },
    { month: "Jun", "Rice Blast": 6120, "Late Blight": 4050, "Cotton Whitefly": 3110 }
  ];

  const cropImpactData = [
    { crop: "Rice", AffectedArea: 14200, PreventedLoss: 89000 },
    { crop: "Potato", AffectedArea: 8400, PreventedLoss: 62000 },
    { crop: "Cotton", AffectedArea: 11500, PreventedLoss: 74000 },
    { crop: "Wheat", AffectedArea: 4200, PreventedLoss: 38000 },
    { crop: "Soybean", AffectedArea: 6100, PreventedLoss: 45000 }
  ];

  const diseaseAlerts = [
    { id: "ALT-701", name: "Rice Blast Outbreak Warning", severity: "Critical", region: "Punjab (Amritsar, Patiala)", crop: "Rice", action: "Pesticide advisory triggered" },
    { id: "ALT-702", name: "Late Blight Spreading Condition", severity: "High", region: "Uttar Pradesh (Agra)", crop: "Potato", action: "Cold weather warnings sent" },
    { id: "ALT-703", name: "Cotton Whitefly Anomaly Detected", severity: "High", region: "Maharashtra (Amravati)", crop: "Cotton", action: "Neem oil advisory broadcast" },
    { id: "ALT-704", name: "Yellow Rust Humidity Risk", severity: "Medium", region: "Haryana (Karnal)", crop: "Wheat", action: "Monitoring sensor networks" },
    { id: "ALT-705", name: "Soybean Leaf Spot Outbreak", severity: "Medium", region: "Madhya Pradesh (Indore)", crop: "Soybean", action: "Advisory issued via FPOs" }
  ];

  const filteredAlerts = diseaseAlerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = diseaseFilter === "All" || alert.severity === diseaseFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="animate-fadeIn space-y-6 w-full font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
            Disease Intelligence Outbreak Center
          </h1>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed mt-0.5">
            Real-time geospatial tracking of crop diseases, regional alerts, and projected outbreak hotspots.
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="bg-white border border-gray-200 text-gray-700 font-bold text-[11px] uppercase tracking-wider px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-gray-50">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Outbreak Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Disease Detections (30d)"
          value="42,408"
          trend="â†‘ 18.2%"
          trendType="danger"
          subtext="Total scans matched to target pathogens"
          icon={
            <svg className="w-8 h-8 text-red-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatsCard
          title="Active Disease Alerts"
          value="14"
          trend="+2 New"
          trendType="danger"
          subtext="High-risk warnings sent to regional FPOs"
          icon={
            <svg className="w-8 h-8 text-amber-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          }
        />
        <StatsCard
          title="Outbreak Accuracy"
          value="95.8%"
          trend="â†‘ 0.8%"
          trendType="success"
          subtext="Drift-corrected diagnostic matching precision"
          icon={
            <svg className="w-8 h-8 text-emerald-500/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Yield Loss Prevented"
          value="â‚¹8.4M"
          trend="â†‘ 12%"
          trendType="success"
          subtext="Estimated crops saved from infection"
          icon={
            <svg className="w-8 h-8 text-[#90a955]/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16c1.657 0 3-.895 3-2s-1.343-2-3-2" />
            </svg>
          }
        />
      </div>

      {/* AI Insights panel */}
      <div className="bg-[#132a13] text-white p-5 rounded-2xl shadow-sm border border-[#31572c]/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">Epidemiological Outbreak Insights</h4>
          <p className="text-[11px] text-white/95 leading-relaxed">
            High humidity conditions in <strong className="text-[#ecf39e]">Agra</strong> have triggered a critical warning for **Late Blight**. Farmers are advised to apply preventive copper fungicide sprays immediately.
          </p>
        </div>
        <div className="bg-[#4f772d]/40 border border-[#90a955]/30 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>Outbreak Sensors: Active</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Disease Outbreak Trends (Area Chart) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">6-Month Pathogen Detection Trends</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={outbreakTrends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBlast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#132a13" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#132a13" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#90a955" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#90a955" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Area type="monotone" dataKey="Rice Blast" stroke="#132a13" strokeWidth={2} fillOpacity={1} fill="url(#colorBlast)" />
                <Area type="monotone" dataKey="Late Blight" stroke="#90a955" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBlight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Crop Impact Analysis (Bar Chart) */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">Acreage Affected vs Prevented Financial Loss</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropImpactData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Bar dataKey="AffectedArea" name="Affected Area (Acres)" fill="#132a13" radius={[4, 4, 0, 0]} />
                <Bar dataKey="PreventedLoss" name="Prevented Loss (â‚¹k)" fill="#90a955" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Disease Outbreak Ledger */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">Active Outbreak Warnings & System Interventions</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search region or disease..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full sm:w-48 font-semibold focus:outline-none focus:border-[#31572c]"
            />
            <select
              value={diseaseFilter}
              onChange={(e) => setDiseaseFilter(e.target.value)}
              className="text-[11px] bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold focus:outline-none focus:border-[#31572c]"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-3.5">Alert ID</th>
                <th className="p-3.5">Pathogen Outbreak Threat</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Outbreak Region</th>
                <th className="p-3.5">Target Crop</th>
                <th className="p-3.5 text-right">System Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
              {filteredAlerts.map((row) => (
                <tr key={row.id} className="hover:bg-[#4f772d]/5 transition-colors duration-150">
                  <td className="p-3.5 font-mono text-gray-500">{row.id}</td>
                  <td className="p-3.5 font-black text-gray-900 tracking-tight">{row.name}</td>
                  <td className="p-3.5">
                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                      row.severity === "Critical" ? "bg-red-50 text-red-700 border-red-100" :
                      row.severity === "High" ? "bg-amber-50 text-amber-900 border-amber-200" :
                      "bg-blue-50 text-blue-800 border-blue-100"
                    }`}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-600">{row.region}</td>
                  <td className="p-3.5 text-gray-600">{row.crop}</td>
                  <td className="p-3.5 text-right text-emerald-700 font-bold">{row.action}</td>
                </tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-semibold italic">
                    No active warnings matching active filter queries found.
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
