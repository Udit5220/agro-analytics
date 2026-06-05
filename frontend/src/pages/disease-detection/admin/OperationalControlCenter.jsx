import React, { useState, useEffect } from "react";
import {
  Server,
  Activity,
  Cpu,
  Database,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Terminal,
  Clock,
  HardDrive
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const SERVICES_TILES = [
  { name: "Disease Detection API", uptime: "99.98%", status: "Healthy", type: "API" },
  { name: "Forecast Engine", uptime: "99.95%", status: "Healthy", type: "Core" },
  { name: "Alert Dispatcher", uptime: "99.91%", status: "Healthy", type: "Notifications" },
  { name: "Satellite Ingestion", uptime: "94.12%", status: "Warning", type: "Pipeline" },
  { name: "Weather Feed", uptime: "100.00%", status: "Healthy", type: "Pipeline" },
  { name: "Image Classification", uptime: "99.87%", status: "Healthy", type: "ML" },
  { name: "Report Generator", uptime: "99.50%", status: "Healthy", type: "API" },
  { name: "Customer API", uptime: "99.99%", status: "Healthy", type: "API" },
  { name: "Mobile Push Service", uptime: "99.64%", status: "Healthy", type: "Notifications" },
  { name: "SMS Gateway", uptime: "99.12%", status: "Healthy", type: "Notifications" },
  { name: "Email Service", uptime: "98.92%", status: "Healthy", type: "Notifications" },
  { name: "WhatsApp Connector", uptime: "94.20%", status: "Warning", type: "Notifications" },
  { name: "Database Primary", uptime: "99.99%", status: "Healthy", type: "Database" },
  { name: "Database Replica", uptime: "98.80%", status: "Warning", type: "Database" },
  { name: "Redis Cache", uptime: "100.00%", status: "Healthy", type: "Database" },
  { name: "ML Inference Server", uptime: "99.95%", status: "Healthy", type: "ML" }
];

export default function OperationalControlCenter() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [pipelineUptime, setPipelineUptime] = useState(99.2);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const systemKpis = [
    { label: "API Health", val: "99.2%", arrow: "↑", status: "Healthy", state: "healthy" },
    { label: "DB Health", val: "98.8%", arrow: "↓", status: "Warning", sub: "lag 240ms", state: "warning" },
    { label: "Model Pipeline", val: "Operational", arrow: "→", status: "Healthy", state: "healthy" },
    { label: "Data Ingestion", val: "94.1%", arrow: "↓", status: "Warning", sub: "sat feed delayed", state: "warning" },
    { label: "Storage", val: "71%", arrow: "↑", status: "Warning", sub: "29% remaining", state: "warning" }
  ];

  // Pipeline telemetry table
  const pipelineSources = [
    { source: "Satellite (ISRO/Sentinel)", lastRun: "15min ago", count: "84,200", success: "99.1%", latency: "4.2s", status: "Healthy" },
    { source: "Weather (IMD)", lastRun: "8min ago", count: "12,400", success: "100.0%", latency: "0.8s", status: "Healthy" },
    { source: "Farmer Reports", lastRun: "2min ago", count: "1,240", success: "98.4%", latency: "0.2s", status: "Healthy" },
    { source: "Government Data", lastRun: "2h ago", count: "840", success: "94.2%", latency: "8.1s", status: "Warning" },
    { source: "FPO Network", lastRun: "4min ago", count: "3,200", success: "99.8%", latency: "0.4s", status: "Healthy" }
  ];

  // Active Incidents log
  const [incidents, setIncidents] = useState([
    { id: "INC-874", service: "Satellite Ingestion", severity: "High", desc: "Sentinel imagery chunk sync delayed", started: "25m ago", duration: "25m", status: "Investigating", owner: "DevOps A" },
    { id: "INC-852", service: "Database Replica", severity: "Medium", desc: "Replication lag breached 200ms threshold", started: "1h ago", duration: "1h", status: "Active", owner: "DBA lead" },
    { id: "INC-812", service: "WhatsApp Connector", severity: "Low", desc: "Provider callback rate limit hit", started: "3h ago", duration: "2h", status: "Resolved", owner: "DevOps B" }
  ]);

  const handleResolveIncident = (id) => {
    alert(`Resolving incident ${id} in operations ledger.`);
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: "Resolved" } : inc));
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchSearch = inc.service.toLowerCase().includes(search.toLowerCase()) || inc.desc.toLowerCase().includes(search.toLowerCase());
    const matchSev = filterSeverity === "All" || inc.severity === filterSeverity;
    return matchSearch && matchSev;
  });

  // 24H rolling metrics LineChart
  const metricsTrend = [
    { name: "00:00", requests: 1800, error: 0.1, latency: 120, success: 99.8 },
    { name: "04:00", requests: 920, error: 0.05, latency: 98, success: 100.0 },
    { name: "08:00", requests: 2200, error: 0.12, latency: 145, success: 99.4 },
    { name: "12:00", requests: 2840, error: 0.8, latency: 142, success: 94.1 }, // Ingestion delay spike
    { name: "16:00", requests: 2500, error: 0.3, latency: 130, success: 98.6 }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-[400px] bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Hero Header Banner */}
      <div className="bg-[#132a13] rounded-2xl p-6 text-white border border-[#31572c]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="flex flex-col space-y-1.5 z-10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
            Operational Intelligence
          </span>
          <h2 className="text-xl font-black tracking-tight">
            System Operations Control Center
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Row 1 — System Health KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {systemKpis.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                card.state === 'healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-900'
              }`}>{card.status}</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-3 mb-1.5">
              <span className="text-xl font-black text-gray-950 tracking-tight font-mono">{card.val}</span>
              <span className={`text-xs font-black ${card.arrow === '↓' ? 'text-red-500' : 'text-emerald-500'}`}>{card.arrow}</span>
            </div>

            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">
              {card.sub || "Uptime Index"}
            </span>
          </div>
        ))}
      </div>

      {/* Row 2 — Service Status Board (16 tiles grid) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
          <span>Service Status Board (4×4 Matrix)</span>
          <span className="text-[9px] bg-emerald-100 text-[#132a13] px-2.5 py-0.5 rounded font-black">All Systems Nominal</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES_TILES.map((service, idx) => {
            const isHealthy = service.status === "Healthy";
            const isWarning = service.status === "Warning";

            return (
              <div key={idx} className="bg-slate-50 border border-gray-200/50 p-3 rounded-xl flex items-center justify-between hover:bg-gray-100 transition shadow-sm">
                <div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight">{service.name}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">{service.type} • {service.uptime}</span>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  isHealthy ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : isWarning ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-red-500"
                }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[380px]">
        {/* Left: Infrastructure Monitoring */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-3">
            Infrastructure Resource metrics
          </h3>
          
          <div className="space-y-4 flex-1 justify-center flex flex-col">
            {[
              { label: "CPU Usage", val: 68, threshold: 70, color: "bg-amber-500" },
              { label: "Memory Usage", val: 54, threshold: 80, color: "bg-emerald-500" },
              { label: "Storage Capacity", val: 71, threshold: 75, color: "bg-amber-500" }
            ].map((res, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>{res.label}</span>
                  <span className="font-mono">{res.val}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                  <div className={`h-full rounded-full ${res.color}`} style={{ width: `${res.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase border-t border-gray-50 pt-3 mt-2 font-mono">
            <span>API Latency: 142ms</span>
            <span>Requests/min: 2,840 rps</span>
          </div>
        </div>

        {/* Right: Data Pipeline Monitoring */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Data Ingestion Pipelines</h3>
          </div>
          <div className="overflow-x-auto flex-1 scrollbar-thin">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-2.5 pl-4 text-gray-400 font-bold uppercase">Source</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase">Last Run</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase text-right">Records</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase text-right">Uptime</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {pipelineSources.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 font-semibold text-gray-700">
                    <td className="p-2.5 pl-4 font-black text-gray-905">{row.source}</td>
                    <td className="p-2.5 text-gray-400 font-mono">{row.lastRun}</td>
                    <td className="p-2.5 text-right font-mono">{row.count}</td>
                    <td className="p-2.5 text-right font-mono font-black text-[#31572c]">{row.success}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        row.status === 'Healthy' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                      }`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 4 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[460px]">
        {/* Left: Incident Center */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Incident Center</h3>
              <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 mt-1 inline-block">MTTR: 23 min</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none"
              />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-bold px-2 py-1 focus:outline-none"
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 scrollbar-thin pr-1 mt-2 space-y-3 p-4">
            {filteredIncidents.map((row, idx) => {
              const isResolved = row.status === "Resolved";
              return (
                <div key={idx} className={`p-3 border rounded-xl flex items-start justify-between text-xs gap-3 ${
                  isResolved ? "bg-emerald-50/50 border-emerald-100 text-emerald-950" : "bg-red-50 border-red-100 text-red-950"
                }`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className={isResolved ? "text-emerald-500 mt-0.5 shrink-0" : "text-red-500 mt-0.5 shrink-0"} />
                    <div>
                      <p className="font-bold">{row.service} Incident</p>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5">{row.desc}</p>
                      <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-wider mt-1">
                        Started: {row.started} • MTTR: {row.duration} • Assigned: {row.owner}
                      </span>
                    </div>
                  </div>
                  {!isResolved && (
                    <button
                      onClick={() => handleResolveIncident(row.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[8px] font-black uppercase px-2 py-1 rounded transition active:scale-95 shrink-0"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Operational Metrics Trend */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-between">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2.5">
            Operational Metrics Trend (24H)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="API Requests" />
                <Line type="monotone" dataKey="latency" stroke="#f59e0b" strokeWidth={2} name="Avg Latency (ms)" />
                <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Ingestion Success %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 5 — Daily Operations Summary card */}
      <div className="bg-[#132a13] text-white rounded-2xl p-6 border border-[#31572c]/40 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          {/* Yesterday's Stats */}
          <div className="space-y-2 border-r border-[#31572c]/30 pr-6">
            <h4 className="text-[10px] font-black text-[#ecf39e] uppercase tracking-widest mb-2">Yesterday's Telemetry</h4>
            <div className="flex justify-between">
              <span className="text-slate-400">Total API calls:</span>
              <span className="font-bold font-mono">4.12 Million</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Records Processed:</span>
              <span className="font-bold font-mono">124.8 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Gateway Uptime:</span>
              <span className="font-bold font-mono text-emerald-400">99.98%</span>
            </div>
          </div>

          {/* Today So Far */}
          <div className="space-y-2 border-r border-[#31572c]/30 px-6">
            <h4 className="text-[10px] font-black text-[#ecf39e] uppercase tracking-widest mb-2">Today So Far</h4>
            <div className="flex justify-between">
              <span className="text-slate-400">Inbound Requests:</span>
              <span className="font-bold font-mono">2.84 Million</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Records Processed:</span>
              <span className="font-bold font-mono">92.4 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Incidents:</span>
              <span className="font-bold font-mono text-red-400">2 unresolved</span>
            </div>
          </div>

          {/* Action Items */}
          <div className="space-y-2 pl-6">
            <h4 className="text-[10px] font-black text-[#ecf39e] uppercase tracking-widest mb-2">Action Items (CTO Queue)</h4>
            <div className="space-y-1.5 text-[10px] font-bold text-slate-300">
              <p className="hover:text-white cursor-pointer">• Double Database replica memory allocation</p>
              <p className="hover:text-white cursor-pointer">• Audit WhatsApp connector rate limiting configs</p>
              <p className="hover:text-white cursor-pointer">• Re-establish ISRO Sentinel chunk sync pipeline</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
