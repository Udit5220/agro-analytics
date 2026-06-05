// PAGE 2 — Outbreak Monitoring
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/OutbreakMonitoring.jsx

import React, { useState, useEffect } from "react";
import seededData from "../../../seed-json/seededData.json";
import StatsCard from "../../../components/partials/StatsCard";
import { 
  Activity, Shield, AlertTriangle, CheckCircle, Search, 
  ChevronDown, ChevronUp, Calendar, Filter, RefreshCw 
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const trendData = [
  { day: "Day 1", cases: 4 },
  { day: "Day 2", cases: 6 },
  { day: "Day 3", cases: 3 },
  { day: "Day 4", cases: 5 },
  { day: "Day 5", cases: 8 },
  { day: "Day 6", cases: 12 },
  { day: "Day 7", cases: 14 },
  { day: "Day 8", cases: 9 },
  { day: "Day 9", cases: 6 },
  { day: "Day 10", cases: 5 },
  { day: "Day 11", cases: 8 },
  { day: "Day 12", cases: 4 },
  { day: "Day 13", cases: 3 },
  { day: "Day 14", cases: 2 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#132a13] text-white p-3 rounded-xl shadow-lg border border-emerald-800 text-xs font-semibold">
        <p className="font-black text-emerald-400">{label}</p>
        <p className="mt-1">Active Cases: <span className="text-red-400 font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export default function OutbreakMonitoring() {
  const [dataState, setDataState] = useState(() => {
    const saved = localStorage.getItem("fpoDiseaseDetectionState");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse FPO state", e);
      }
    }
    return seededData.fpoDiseaseDetection;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("fpoDiseaseDetectionState");
      if (saved) {
        try {
          setDataState(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse FPO state from storage event", e);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const outbreaks = dataState.outbreaks || [];

  const setOutbreaks = (newOutbreaksOrFn) => {
    setDataState(prev => {
      const nextOutbreaks = typeof newOutbreaksOrFn === "function" ? newOutbreaksOrFn(prev.outbreaks) : newOutbreaksOrFn;
      const updated = { ...prev, outbreaks: nextOutbreaks };
      localStorage.setItem("fpoDiseaseDetectionState", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return updated;
    });
  };

  const [expandedId, setExpandedId] = useState(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [cropFilter, setCropFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pipelineFilter, setPipelineFilter] = useState(null);

  // Calculate dynamic stats
  const statCards = [
    { label: "Active Outbreaks", value: outbreaks.filter(o => o.status !== "Resolved").length },
    { label: "Contained", value: outbreaks.filter(o => o.status === "Contained").length },
    { label: "Escalated", value: outbreaks.filter(o => o.status === "Containment Started" || o.status === "Verified" || o.status === "Escalated").length },
    { label: "Resolved", value: outbreaks.filter(o => o.status === "Resolved").length }
  ];

  // Lifecycle Tracker counts
  const pipelineStages = [
    { stage: "Detected", count: outbreaks.filter(o => o.status === "Detected").length },
    { stage: "Verified", count: outbreaks.filter(o => o.status === "Verified").length },
    { stage: "Escalated", count: outbreaks.filter(o => o.status === "Escalated").length },
    { stage: "Containment Started", count: outbreaks.filter(o => o.status === "Containment Started").length },
    { stage: "Contained", count: outbreaks.filter(o => o.status === "Contained").length },
    { stage: "Resolved", count: outbreaks.filter(o => o.status === "Resolved").length }
  ];

  // Row Action Handlers
  const handleStatusChange = (id, newStatus) => {
    setOutbreaks(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleEscalate = (id) => handleStatusChange(id, "Escalated");
  const handleContain = (id) => handleStatusChange(id, "Containment Started");
  const handleResolve = (id) => handleStatusChange(id, "Resolved");

  // Filtering Logic
  const filteredOutbreaks = outbreaks.filter(o => {
    const matchesSearch = o.disease.toLowerCase().includes(search.toLowerCase()) || o.village.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === "All" || o.severity === severityFilter;
    const matchesCrop = cropFilter === "All" || o.crop === cropFilter;
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesPipeline = !pipelineFilter || o.status === pipelineFilter;
    return matchesSearch && matchesSeverity && matchesCrop && matchesStatus && matchesPipeline;
  });

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Page Title */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">Outbreak Surveillance Registry</h1>
        <p className="text-slate-500 text-xs font-semibold">
          Coordinate containment lifecycles, monitor regional spread coordinates, and assign control resources.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = idx === 0 ? Activity : idx === 1 ? Shield : idx === 2 ? AlertTriangle : CheckCircle;
          return (
            <StatsCard
              key={idx}
              title={card.label}
              value={card.value}
              icon={<Icon className="text-emerald-700" />}
              subtext="Updated in real-time"
            />
          );
        })}
      </div>

      {/* Outbreak Lifecycle Pipeline Tracker */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3.5">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Outbreak Lifecycle Tracker Pipeline
          </h3>
          {pipelineFilter && (
            <button 
              type="button" 
              onClick={() => setPipelineFilter(null)}
              className="text-[9px] font-black text-red-600 uppercase flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Clear Stage Filter
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3.5 pt-2">
          {pipelineStages.map((stage, idx) => (
            <div 
              key={idx} 
              onClick={() => setPipelineFilter(stage.stage)}
              className={`flex-1 w-full sm:w-auto p-3 rounded-xl border text-center cursor-pointer transition-all hover:translate-y-[-2px] ${
                pipelineFilter === stage.stage ? "bg-[#31572c] text-white border-[#31572c]" : "bg-slate-50 border-slate-100 text-slate-700"
              }`}
            >
              <span className="text-[14px] font-black block">{stage.count}</span>
              <span className="text-[9px] font-black block uppercase tracking-wider mt-1">{stage.stage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-wrap items-center gap-3.5">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search disease or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
          />
        </div>

        <select 
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-white"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>

        <select 
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-white"
        >
          <option value="All">All Crops</option>
          <option value="Rice (Paddy)">Rice (Paddy)</option>
          <option value="Wheat">Wheat</option>
          <option value="Potato">Potato</option>
          <option value="Bajra">Bajra</option>
          <option value="Cotton">Cotton</option>
        </select>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Detected">Detected</option>
          <option value="Verified">Verified</option>
          <option value="Containment Started">Containment Started</option>
          <option value="Contained">Contained</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Main Table & Details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
          Live Outbreak Table Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-2.5">Disease</th>
                <th className="py-2.5">Village</th>
                <th className="py-2.5">Crop</th>
                <th className="py-2.5 text-center">Farmers</th>
                <th className="py-2.5 text-center">Acres</th>
                <th className="py-2.5 text-center">Severity</th>
                <th className="py-2.5 text-center">Detected</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {filteredOutbreaks.map((o) => {
                const isExpanded = expandedId === o.id;
                const rowBg = o.severity === "Critical" ? "hover:bg-red-500/5" : o.severity === "High" ? "hover:bg-amber-500/5" : "hover:bg-slate-50";

                return (
                  <React.Fragment key={o.id}>
                    <tr 
                      className={`cursor-pointer transition-colors ${rowBg} ${isExpanded ? "bg-slate-50/50" : ""}`}
                      onClick={() => setExpandedId(isExpanded ? null : o.id)}
                    >
                      <td className="py-3.5 text-slate-900 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#31572c]" /> {o.disease}
                      </td>
                      <td className="py-3.5 text-slate-550">{o.village}</td>
                      <td className="py-3.5 text-slate-550">{o.crop}</td>
                      <td className="py-3.5 text-center text-slate-700">{o.farmers}</td>
                      <td className="py-3.5 text-center text-slate-700">{o.acres} ac</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          o.severity === "Critical" ? "bg-red-100 text-red-700" : o.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {o.severity}
                        </span>
                      </td>
                      <td className="py-3.5 text-center text-slate-450">{o.detected}</td>
                      <td className="py-3.5 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${
                          o.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button 
                          type="button" 
                          onClick={() => setExpandedId(isExpanded ? null : o.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable details panel inline */}
                    {isExpanded && (
                      <tr className="bg-slate-50/50">
                        <td colSpan="9" className="p-4 border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-black">Outbreak Description</span>
                              <p className="leading-relaxed">{o.details}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center justify-end h-fit pt-2">
                              <button 
                                type="button" 
                                onClick={() => handleEscalate(o.id)}
                                disabled={o.status === "Escalated"}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                              >
                                Escalate
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleContain(o.id)}
                                disabled={o.status === "Containment Started"}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                              >
                                Contain
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleResolve(o.id)}
                                disabled={o.status === "Resolved"}
                                className="px-3 py-1.5 bg-[#31572c] hover:bg-[#132a13] disabled:opacity-40 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                              >
                                Resolve
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid containing Daily chart and Village comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Cases Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              Daily Case Trend (14 Days)
            </h3>
            <div className="flex gap-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <span>Growth: <span className="text-red-500">+8.5%</span></span>
              <span>Containment: <span className="text-emerald-600">92%</span></span>
            </div>
          </div>

          <div className="h-44 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="caseTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="cases" 
                  fill="url(#caseTrendGrad)" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Village comparison cases count bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100">
            Active Cases Per Village
          </h3>

          <div className="space-y-3.5 text-xs font-semibold">
            {[
              { village: "Kharindwa Block", active: 18, color: "bg-red-500" },
              { village: "Bhucho Mandi Sector", active: 12, color: "bg-amber-500" },
              { village: "Raman Farm Area", active: 8, color: "bg-blue-500" },
              { village: "Shirur Block", active: 3, color: "bg-emerald-500" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between">
                  <span>{item.village}</span>
                  <span>{item.active} Active Cases</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.active / 20) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
