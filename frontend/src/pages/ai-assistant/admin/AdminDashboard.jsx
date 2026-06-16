import React, { useState } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [activeTableTab, setActiveTableTab] = useState("alerts");

  // Agricultural KPI Data
  const kpis = [
    {
      title: "Farmers Assisted",
      value: "182,490",
      trend: "+12.4%",
      trendType: "success",
      subtext: "Total active farmer accounts",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20.8M4.12 18.546a9.09 9.09 0 012.222-1.472 9.09 9.09 0 013.747-.81c1.233 0 2.426.246 3.517.693m-8.6 3.069A11.393 11.393 0 0010 21.75c2.586 0 4.984-.85 6.911-2.285M15 8.25a3 3 0 11-6 0 3 3 0 016 0zm6 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM5.25 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      title: "AI Interventions",
      value: "428,110",
      trend: "+18.2%",
      trendType: "success",
      subtext: "Queries resolved by AI models",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.97-9.75H13.63l.971-7.071L5.63 14.002h5.158z" />
        </svg>
      ),
    },
    {
      title: "Disease Alerts Generated",
      value: "12,490",
      trend: "+5.3%",
      trendType: "danger",
      subtext: "Active pathogen outbreaks flagged",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.105-2.596-.307-3.85A11.96 11.96 0 0112 2.964zM12 16.5h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      title: "Crop Recommendations Issued",
      value: "84,200",
      trend: "+14.1%",
      trendType: "success",
      subtext: "Soil & variety advisory reports",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v3.75m-9.75-3h.008v.008h-.008V6.75z" />
        </svg>
      ),
    },
    {
      title: "Weather Advisories Delivered",
      value: "156,000",
      trend: "+9.8%",
      trendType: "success",
      subtext: "Hyperlocal weather risk warnings",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
        </svg>
      ),
    },
    {
      title: "Market Advisories Generated",
      value: "92,300",
      trend: "+11.2%",
      trendType: "success",
      subtext: "Mandi price forecasting alerts",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M4.5 19.5h15M5.25 4.5v15m13.5-15v15M9.75 8.25v4.5m4.5-4.5v4.5M3 9h18M3 14h18" />
        </svg>
      ),
    },
    {
      title: "Rec. Acceptance Rate",
      value: "84.6%",
      trend: "+2.1%",
      trendType: "success",
      subtext: "Advisories implemented by farmers",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "AI Accuracy Score",
      value: "94.2%",
      trend: "+0.8%",
      trendType: "success",
      subtext: "Validated diagnosis and advice",
      icon: (
        <svg className="w-10 h-10 text-gray-200/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  // 1. Farmer Adoption Trend over 6 months
  const adoptionTrendData = [
    { month: "Jan", small: 12000, medium: 8000, large: 4000, fpos: 120 },
    { month: "Feb", small: 15400, medium: 9200, large: 4300, fpos: 150 },
    { month: "Mar", small: 21000, medium: 11500, large: 4900, fpos: 180 },
    { month: "Apr", small: 26000, medium: 12400, large: 5100, fpos: 210 },
    { month: "May", small: 32000, medium: 14000, large: 5600, fpos: 260 },
    { month: "Jun", small: 38420, medium: 16100, large: 6200, fpos: 310 },
  ];

  // 2. Advisory Distribution
  const advisoryDistributionData = [
    { name: "Disease Diagnostics", value: 35, color: "#132a13" },
    { name: "Crop Recommendations", value: 25, color: "#31572c" },
    { name: "Weather Advisories", value: 20, color: "#4f772d" },
    { name: "Market Prices", value: 12, color: "#90a955" },
    { name: "Irrigation & Fertilizer", value: 8, color: "#cbd5e1" },
  ];

  // 3. Disease Alert Trend over 6 months
  const diseaseTrendData = [
    { month: "Jan", blight: 120, rust: 80, mildew: 60 },
    { month: "Feb", blight: 140, rust: 95, mildew: 75 },
    { month: "Mar", blight: 210, rust: 150, mildew: 90 },
    { month: "Apr", blight: 340, rust: 280, mildew: 130 },
    { month: "May", blight: 510, rust: 420, mildew: 190 },
    { month: "Jun", blight: 480, rust: 390, mildew: 160 },
  ];

  // 4. Recommendation Acceptance Trend
  const acceptanceTrendData = [
    { month: "Jan", rate: 76 },
    { month: "Feb", rate: 78 },
    { month: "Mar", rate: 81 },
    { month: "Apr", rate: 83 },
    { month: "May", rate: 85 },
    { month: "Jun", rate: 84.6 },
  ];

  // Recent Activity Feed
  const feedItems = [
    {
      id: 1,
      status: "danger",
      type: "Pathogen Outbreak",
      context: "Late Blight pathogen detected via image scan in Bathinda, Punjab. Crop advisory dispatched.",
      time: "2m ago",
    },
    {
      id: 2,
      status: "warning",
      type: "Weather Alert",
      context: "Frost warning advisory issued for Wheat growers in Haryana region. Recommend light irrigation.",
      time: "14m ago",
    },
    {
      id: 3,
      status: "success",
      type: "Rec. Acceptance",
      context: "FPO in Akola, Maharashtra implemented Nitrogen fertilizer dosage adjustment recommendation.",
      time: "28m ago",
    },
    {
      id: 4,
      status: "success",
      type: "Market Intelligence",
      context: "Market advisory generated: Turmeric price forecasting model triggers breakout signal in Nanded Mandi.",
      time: "1h ago",
    },
  ];

  // Recent Interactions (Agricultural Context)
  const recentInteractions = [
    {
      id: "INT_01",
      user: "Ramesh Patel",
      role: "FPO Lead",
      crop: "Cotton",
      query: "Pest detection: Pink Bollworm control guidance",
      status: "Accepted",
      duration: "2.1s response",
    },
    {
      id: "INT_02",
      user: "Sukhdev Singh",
      role: "Farmer (Medium)",
      crop: "Rice",
      query: "Blight lesion diagnostic help via Leaf Photo scan",
      status: "Accepted",
      duration: "1.8s response",
    },
    {
      id: "INT_03",
      user: "Naveen Agrawal",
      role: "Agribusiness Rep",
      crop: "Wheat",
      query: "Mandi price forecasting Akola vs Pune markets",
      status: "Ignored",
      duration: "3.2s response",
    },
    {
      id: "INT_04",
      user: "Dr. K. Rao",
      role: "Agronomist / Gov",
      crop: "Sugarcane",
      query: "Weather & Irrigation advisories for Kolhapur cluster",
      status: "Accepted",
      duration: "2.5s response",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Page Title & Subtitle Header without state-controller, filters, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Agricultural AI Command Center
        </h1>
        <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
          Executive performance indicators, recommendation tracking, and disease monitoring.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {kpis.map((metric, idx) => (
          <StatsCard
            key={idx}
            title={metric.title}
            value={metric.value}
            trend={metric.trend}
            trendType={metric.trendType}
            subtext={metric.subtext}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* AI Insights & Highlights Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-fadeIn">
        <div className="bg-emerald-50 border border-emerald-200/60 p-4 rounded-xl space-y-1">
          <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Top Emerging Disease</span>
          <h4 className="text-xs font-black text-gray-955">Late Blight (Punjab Potato)</h4>
          <p className="text-[11px] font-semibold text-emerald-900 mt-1 leading-relaxed">
            Humidity levels above 85% in Bathinda cluster are accelerating blight spore maturation.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-xl space-y-1">
          <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest block">High Risk Region</span>
          <h4 className="text-xs font-black text-gray-955">Cotton Whitefly (Gujarat)</h4>
          <p className="text-[11px] font-semibold text-amber-950 mt-1 leading-relaxed">
            High regional temperatures are driving rapid whitefly infestation. Dispatched pest advisory to 14,000+ growers.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200/60 p-4 rounded-xl space-y-1">
          <span className="text-[9px] font-black text-blue-800 uppercase tracking-widest block">Most Requested Crop</span>
          <h4 className="text-xs font-black text-gray-955">Sugarcane (Kolhapur)</h4>
          <p className="text-[11px] font-semibold text-blue-900 mt-1 leading-relaxed">
            FPOs asking for drought-resilient seed varieties and subsurface drip irrigation layouts.
          </p>
        </div>
        <div className="bg-[#132a13] text-white p-4 rounded-xl space-y-1 relative overflow-hidden">
          <span className="text-[9px] font-black text-[#ecf39e] uppercase tracking-widest block">User Growth Signal</span>
          <h4 className="text-xs font-bold text-white">FPO Network Expansion</h4>
          <p className="text-[11px] font-medium text-white/90 mt-1 leading-relaxed">
            FPO onboarding is up <strong className="text-[#ecf39e]">+32% MoM</strong>. Central Maharashtra cluster is leading cooperative participation.
          </p>
        </div>
      </div>

      {/* Charts Row 1: Adoption & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        {/* Farmer Adoption Trend */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                Farmer Adoption Trend
              </h3>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                Platform adoption and active usage by farmer type
              </p>
            </div>
            <div className="flex gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
              <span className="text-[#132a13]">Small</span>
              <span className="text-[#90a955]">Medium</span>
              <span className="text-gray-300">Large</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adoptionTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="small" stackId="a" fill="#132a13" />
                <Bar dataKey="medium" stackId="a" fill="#90a955" />
                <Bar dataKey="large" stackId="a" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advisory Distribution Breakdown */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Advisory Distribution
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Breakdown of AI advisories generated
            </p>
          </div>
          <div className="h-44 w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={advisoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {advisoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {advisoryDistributionData.map((item, idx) => (
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
      </div>

      {/* Charts Row 2: Disease Alert & Acceptance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        {/* Disease Alert Trend */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Disease Alert Trend
            </h3>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
              Monthly trend of active pathogen scans flagged by AI models
            </p>
          </div>
          <div className="h-56 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diseaseTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                <Line type="monotone" dataKey="blight" name="Potato Blight" stroke="#132a13" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rust" name="Wheat Rust" stroke="#90a955" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mildew" name="Powdery Mildew" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendation Acceptance Trend */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Recommendation Acceptance Trend
            </h3>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
              Acceptance score over time
            </p>
          </div>
          <div className="h-44 w-full flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={acceptanceTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <YAxis domain={[70, 90]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" name="Acceptance %" stroke="#132a13" strokeWidth={3} dot={{ r: 4, strokeWidth: 1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl mt-2 text-center">
            <p className="text-[10px] font-semibold text-emerald-800 italic">
              Acceptance rate target is 85%. AI model improvements in June brought us within 0.4% of goal.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Table and Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
        {/* Live Outbreak Alert Feed */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest mb-4">
              Live Outbreak Alert Feed
            </h3>
            <div className="space-y-3">
              {feedItems.map((item) => (
                <div key={item.id} className="flex gap-2.5 pb-2.5 border-b border-gray-50 last:border-b-0">
                  <span className={`w-2 h-2 rounded-full block mt-1.5 flex-shrink-0 ${item.status === "danger" ? "bg-red-500 animate-pulse" : item.status === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black text-gray-900 tracking-tight uppercase block">
                      {item.type}
                    </span>
                    <p className="text-[11px] font-semibold text-gray-500 mt-0.5 leading-snug">
                      {item.context}
                    </p>
                    <span className="text-[9px] font-bold text-gray-400 font-mono block mt-0.5">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry and Interactions Ledger */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                Telemetry & Interactions Ledger
              </h3>
              <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                Real-time transaction tracking of farmer consulting events
              </p>
            </div>
            <div className="bg-gray-150 p-0.5 rounded-lg flex gap-0.5 border border-gray-200/40 self-start sm:self-auto text-[10px] font-bold">
              <button
                onClick={() => setActiveTableTab("alerts")}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${activeTableTab === "alerts" ? "bg-white text-gray-955 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                Active Outbreaks
              </button>
              <button
                onClick={() => setActiveTableTab("interactions")}
                className={`px-3 py-1 rounded-md transition cursor-pointer ${activeTableTab === "interactions" ? "bg-white text-gray-955 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                Recent Consultations
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[180px]">
            {activeTableTab === "alerts" ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Severity</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target Crop</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Geographic Region</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">Time Issued</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                  <tr className="hover:bg-[#4f772d]/5 transition-colors">
                    <td className="p-2.5 text-red-600 font-bold uppercase">CRITICAL</td>
                    <td className="p-2.5">Wheat (Rust)</td>
                    <td className="p-2.5">Ferozepur, Punjab</td>
                    <td className="p-2.5 text-right font-mono text-gray-400">10 mins ago</td>
                  </tr>
                  <tr className="hover:bg-[#4f772d]/5 transition-colors">
                    <td className="p-2.5 text-amber-600 font-bold uppercase">HIGH</td>
                    <td className="p-2.5">Cotton (Whitefly)</td>
                    <td className="p-2.5">Rajkot, Gujarat</td>
                    <td className="p-2.5 text-right font-mono text-gray-400">22 mins ago</td>
                  </tr>
                  <tr className="hover:bg-[#4f772d]/5 transition-colors">
                    <td className="p-2.5 text-blue-600 font-bold uppercase">MEDIUM</td>
                    <td className="p-2.5">Sugarcane (Borer)</td>
                    <td className="p-2.5">Kolhapur, Maharashtra</td>
                    <td className="p-2.5 text-right font-mono text-gray-400">1 hour ago</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Crop Focus</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider">AI Consultation Query</th>
                    <th className="p-2.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-right">Model Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                  {recentInteractions.map((item) => (
                    <tr key={item.id} className="hover:bg-[#4f772d]/5 transition-colors">
                      <td className="p-2.5 font-bold text-gray-955">{item.user}</td>
                      <td className="p-2.5 text-[10px] text-gray-500 uppercase">{item.role}</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-100">
                          {item.crop}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-600 truncate max-w-[200px]">{item.query}</td>
                      <td className="p-2.5 text-right font-mono text-gray-400">{item.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
