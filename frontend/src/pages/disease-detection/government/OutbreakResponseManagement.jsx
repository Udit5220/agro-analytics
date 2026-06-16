import React, { useState, useEffect } from "react";
import {
  Activity,
  Flame,
  CheckCircle,
  Clock,
  Bell,
  Download,
  ShieldAlert,
  Shield,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  TrendingDown
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

// ------------------------------------------------------------------
// MOCK DATA (Emergency operations center - India national scale)
// ------------------------------------------------------------------

const OUTBREAK_KPI = [
  { id: "active", label: "Active Responses", value: "12", sub: "Teams deployed", trend: "danger", icon: Activity },
  { id: "emergency", label: "Emergency Cases", value: "3", sub: "P0 priority", trend: "danger", icon: ShieldAlert },
  { id: "contained", label: "Contained Outbreaks", value: "8", sub: "Last 7 days", trend: "success", icon: CheckCircle },
  { id: "resolved", label: "Resolved Outbreaks", value: "21", sub: "Season total", trend: "success", icon: Shield }
];

const RESPONSE_TABLE = [
  { id: 1, disease: "Rice Blast", region: "Ludhiana, Punjab", severity: "Critical", status: "Escalated", team: "PPS Squad Alpha", update: "10 mins ago" },
  { id: 2, disease: "Brown Plant Hopper", region: "Gorakhpur, UP", severity: "Critical", status: "Response Started", team: "State RRU 1", update: "32 mins ago" },
  { id: 3, disease: "Leaf Rust", region: "Nagpur, Maharashtra", severity: "High", status: "Response Started", team: "Central Crop Cell", update: "1 hr ago" },
  { id: 4, disease: "Yellow Mosaic", region: "Mandya, Karnataka", severity: "High", status: "Contained", team: "District Field Team 3", update: "2 hrs ago" },
  { id: 5, disease: "Sheath Blight", region: "Cuttack, Odisha", severity: "Medium", status: "Contained", team: "State RRU 2", update: "3 hrs ago" },
  { id: 6, disease: "Rice Blast", region: "Ambala, Haryana", severity: "High", status: "Response Started", team: "PPS Squad Beta", update: "5 hrs ago" },
  { id: 7, disease: "Brown Plant Hopper", region: "Patna, Bihar", severity: "High", status: "Escalated", team: "Emergency Task Force", update: "6 hrs ago" },
  { id: 8, disease: "Powdery Mildew", region: "Jaipur, Rajasthan", severity: "Low", status: "Monitoring", team: "District Field Team 7", update: "12 hrs ago" },
  { id: 9, disease: "Late Blight", region: "Hooghly, West Bengal", severity: "Critical", status: "Response Started", team: "East Zone Division", update: "18 hrs ago" },
  { id: 10, disease: "Yellow Mosaic", region: "Rohtas, Bihar", severity: "High", status: "Monitoring", team: "District Field Team 2", update: "24 hrs ago" }
];

const LIFECYCLE_STEPS = [
  { stage: "Detected", count: 23, status: "completed" },
  { stage: "Verified", count: 19, status: "completed" },
  { stage: "Escalated", count: 7, status: "completed" },
  { stage: "Response Started", count: 12, status: "active" },
  { stage: "Contained", count: 8, status: "pending" },
  { stage: "Resolved", count: 21, status: "pending" }
];

const PROGRESS_METRICS = {
  coverage: 76,
  containment: 64,
  recovery: 88
};

const ANALYTICS_DATA = [
  { label: "Avg Response Time", value: "4.2 hrs", sub: "Target <6 hrs", trend: [12, 10, 8, 7, 5, 4.5, 4.2] },
  { label: "Containment Rate", value: "73%", sub: "Target >80%", trend: [55, 58, 62, 65, 68, 71, 73] },
  { label: "Success Rate", value: "87%", sub: "Target >90%", trend: [80, 81, 83, 85, 84, 86, 87] }
];

const LIVE_RESPONSE_FEED = [
  { id: 1, time: "10 mins ago", team: "PPS Squad Alpha", action: "Completed emergency fungicide quarantine belt", district: "Ludhiana", status: "critical" },
  { id: 2, time: "32 mins ago", team: "State RRU 1", action: "Initiated barrier spraying on border corridors", district: "Gorakhpur", status: "critical" },
  { id: 3, time: "1 hour ago", team: "Central Crop Cell", action: "Delivered regional crop stress advisory via SMS", district: "Nagpur", status: "high" },
  { id: 4, time: "2 hours ago", team: "DFT 3", action: "Confirmed secondary vector containment in zone 4", district: "Mandya", status: "contained" },
  { id: 5, time: "3 hours ago", team: "State RRU 2", action: "Completed field inspection in waterlogged basin", district: "Cuttack", status: "contained" },
  { id: 6, time: "5 hours ago", team: "PPS Squad Beta", action: "Vector control chemical sprays deployed", district: "Ambala", status: "high" },
  { id: 7, time: "6 hours ago", team: "Emergency Task Force", action: "Dispatched 2 field units with spore traps", district: "Patna", status: "critical" },
  { id: 8, time: "12 hours ago", team: "DFT 7", action: "Completed routine inspection with clean result", district: "Jaipur", status: "monitored" },
  { id: 9, time: "18 hours ago", team: "East Zone Division", action: "Quarantined 25 acres of potato seed beds", district: "Hooghly", status: "critical" },
  { id: 10, time: "24 hours ago", team: "DFT 2", action: "Vector traps checked; counts below warning line", district: "Rohtas", status: "monitored" }
];

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
          {title}
        </h1>
        <span className="text-xs font-black text-[#31572c] uppercase font-mono tracking-wider pl-3 ml-3 border-l-2 border-gray-300">
          {subtitle}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Secure Govt Network
        </span>
      </div>
    </div>
  );
};


const CircularProgress = ({ percentage, label, color }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percentage / 100) * circumference);
    }, 150);
    return () => clearTimeout(timer);
  }, [percentage, circumference]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black text-gray-900 leading-none">{percentage}%</span>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
};

export default function OutbreakResponseManagement() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-14 bg-gray-200 rounded-xl mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-60 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const getStatusChip = (status) => {
    const styles = {
      Escalated: "bg-red-50 text-red-700 border-red-100",
      "Response Started": "bg-blue-50 text-blue-800 border-blue-100",
      Contained: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Monitoring: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.Monitoring}`}>
        {status}
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      Critical: "bg-red-50 text-red-700 border-red-100",
      High: "bg-amber-50 text-amber-950 border-amber-200",
      Medium: "bg-blue-50 text-blue-800 border-blue-100",
      Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${styles[severity] || styles.Low}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Outbreak Response Management" subtitle="प्रकोप प्रतिक्रिया प्रबंधन" />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {OUTBREAK_KPI.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                <div className="p-1.5 bg-[#4f772d]/10 rounded-lg text-[#31572c]">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</span>
                <span className="text-[10px] font-bold text-gray-400">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Response Table (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Incident Command Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pl-6">Disease</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Region</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Severity</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Response Status</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5">Assigned Team</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3.5 pr-6">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {RESPONSE_TABLE.map((row) => (
                <tr key={row.id} className="text-xs font-semibold text-gray-700 hover:bg-[#4f772d]/5 transition-colors border-b border-gray-100/60">
                  <td className="p-3.5 pl-6 font-bold text-gray-950">{row.disease}</td>
                  <td className="p-3.5">{row.region}</td>
                  <td className="p-3.5">{getSeverityBadge(row.severity)}</td>
                  <td className="p-3.5">{getStatusChip(row.status)}</td>
                  <td className="p-3.5 text-[#31572c] font-black">{row.team}</td>
                  <td className="p-3.5 pr-6 font-mono text-[10px] text-gray-400 font-bold">{row.update}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3 — Outbreak Lifecycle pipeline (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 mb-6">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-6">Outbreak Lifecycle Pipeline</h2>
        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-200 z-0" />
          <div className="relative z-10 flex justify-between">
            {LIFECYCLE_STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1">
                <span className="text-[10px] font-black text-[#31572c] mb-2">{step.count} Case(s)</span>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 font-black text-xs transition-all ${
                  step.status === "active"
                    ? "bg-[#31572c] border-[#ecf39e] text-white shadow-md"
                    : step.status === "completed"
                      ? "bg-[#90a955] border-[#90a955] text-white"
                      : "bg-white border-gray-200 text-gray-400"
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider mt-2.5 text-center ${
                  step.status === "active" ? "text-[#31572c]" : "text-gray-400"
                }`}>
                  {step.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4 — 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress Rings */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4 text-center">Response Operational Progress</h2>
          <div className="flex justify-around items-center gap-2">
            <CircularProgress percentage={PROGRESS_METRICS.coverage} label="Coverage" color="#4f772d" />
            <CircularProgress percentage={PROGRESS_METRICS.containment} label="Containment" color="#f39c12" />
            <CircularProgress percentage={PROGRESS_METRICS.recovery} label="Recovery" color="#90a955" />
          </div>
          <div className="mt-4 bg-gray-50 border border-gray-100 p-3 rounded-xl text-center text-xs font-semibold text-gray-600">
            Pesticide & chemical containment targets on track
          </div>
        </div>

        {/* Response Analytics with Sparklines */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Response Velocity Analytics</h2>
          <div className="space-y-4">
            {ANALYTICS_DATA.map((card, idx) => {
              const sparkData = card.trend.map((v, i) => ({ x: i, y: v }));
              return (
                <div key={idx} className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{card.label}</span>
                    <p className="text-xl font-black text-[#132a13] mt-0.5">{card.value}</p>
                    <span className="text-[9px] text-gray-500 font-bold">{card.sub}</span>
                  </div>
                  <div className="h-8 w-20 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line type="monotone" dataKey="y" stroke="#31572c" strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Response Feed */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div className="pb-3 border-b border-gray-100 flex justify-between items-center mb-3">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Active Response Logs</h2>
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          </div>
          <div className="h-56 overflow-y-auto pr-1 space-y-3 scrollbar-thin">
            {LIVE_RESPONSE_FEED.map((feed) => (
              <div key={feed.id} className="text-xs border-b border-gray-50 pb-2">
                <div className="flex justify-between items-center text-[9px] font-black text-gray-400">
                  <span>{feed.time} · 📍 {feed.district}</span>
                  <span className={`px-1 rounded-sm uppercase ${
                    feed.status === "critical" ? "bg-red-50 text-red-700" : feed.status === "high" ? "bg-amber-50 text-amber-900" : "bg-emerald-50 text-emerald-700"
                  }`}>
                    {feed.team}
                  </span>
                </div>
                <p className="text-gray-700 font-semibold mt-1 leading-snug">{feed.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
