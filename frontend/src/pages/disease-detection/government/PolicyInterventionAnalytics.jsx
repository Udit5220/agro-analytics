import React, { useState, useEffect } from "react";
import {
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Shield,
  Users,
  MapPin,
  Clock,
  Bell,
  Download,
  Award,
  BookOpen,
  Send,
  Zap,
  Activity,
  Briefcase
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

// ------------------------------------------------------------------
// MOCK DATA (Policy & Interventions - India)
// ------------------------------------------------------------------

const POLICY_KPI = [
  { id: "interventions", label: "Interventions Launched", value: "24", sub: "8 schemes active", trend: "success", icon: FileText },
  { id: "subsidies", label: "Subsidies Released", value: "₹840 Cr", sub: "Direct Benefit Transfer", trend: "success", icon: DollarSign },
  { id: "active", label: "Programs Active", value: "18", sub: "Across 12 states", trend: "success", icon: Shield },
  { id: "utilization", label: "Budget Utilization", value: "76%", sub: "Target 85% by Q2", trend: "warning", icon: TrendingUp }
];

const BUDGET_TOTAL = 1100; // ₹ Cr
const BUDGET_USED = 840; // ₹ Cr
const BUDGET_REMAINING = 260; // ₹ Cr

const BUDGET_BREAKDOWNS = [
  { category: "Field Operations", allocated: 220, used: 180, barWidth: "81%" },
  { category: "Subsidies", allocated: 550, used: 420, barWidth: "76%" },
  { category: "Research & Development", allocated: 180, used: 130, barWidth: "72%" },
  { category: "Awareness Campaigns", allocated: 150, used: 110, barWidth: "73%" }
];

const AWARENESS_PROGRAMS = [
  { name: "Kisan Jagrukta Abhiyan", state: "Punjab, Haryana", reach: "6.2L farmers", status: "Active" },
  { name: "Pest Management Literacy", state: "UP, Bihar", reach: "4.1L farmers", status: "Active" },
  { name: "Digital Advisory Outreach", state: "Odisha, WB", reach: "2.1L farmers", status: "Completed" }
];

const DISEASE_CAMPAIGNS = [
  { name: "Blast Control Drive", disease: "Rice Blast", state: "Punjab", progress: 82 },
  { name: "BPH Vector Control", disease: "Brown Plant Hopper", state: "Odisha", progress: 67 },
  { name: "Rust Eradication", disease: "Leaf Rust", state: "Maharashtra", progress: 54 },
  { name: "Yellow Mosaic Shield", disease: "Yellow Mosaic", state: "Karnataka", progress: 48 }
];

const DISTRIBUTION_DATA = [
  { item: "Fungicides", distributed: 42000, label: "42,000 units" },
  { item: "Bio-Agents", distributed: 28400, label: "28,400 units" },
  { item: "Sprayers", distributed: 13800, label: "13,800 units" }
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


export default function PolicyInterventionAnalytics() {
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Policy & Intervention Analytics" subtitle="नीति और हस्तक्षेप विश्लेषण" />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {POLICY_KPI.map((card) => {
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

      {/* Row 2 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Policy Impact Analysis */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Intervention Outcome Analytics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Yield Saved</span>
                  <span className="text-emerald-600"><TrendingUp size={12} /></span>
                </div>
                <div>
                  <p className="text-xl font-black text-gray-950">2.1M MT</p>
                  <p className="text-[9px] text-emerald-600 font-extrabold mt-1">↑ 14% vs last year</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Protected</span>
                  <span className="text-emerald-600"><TrendingUp size={12} /></span>
                </div>
                <div>
                  <p className="text-xl font-black text-gray-950">34L farmers</p>
                  <p className="text-[9px] text-emerald-600 font-extrabold mt-1">↑ 8% protected</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Districts</span>
                  <span className="text-emerald-600"><TrendingUp size={12} /></span>
                </div>
                <div>
                  <p className="text-xl font-black text-gray-950">284 districts</p>
                  <p className="text-[9px] text-emerald-600 font-extrabold mt-1">↑ 22 protected</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-gray-400 border-t pt-3 font-mono">
            Direct outcome calculation from MoA disease control registrations.
          </div>
        </div>

        {/* Budget Analytics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Subsidies & Budget Allocation</h2>
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Allocated: ₹{BUDGET_TOTAL} Cr</span>
                <span className="text-[#31572c]">Used: ₹{BUDGET_USED} Cr (76%)</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex">
                <div className="bg-[#31572c] h-full" style={{ width: `${(BUDGET_USED / BUDGET_TOTAL) * 100}%` }} />
                <div className="bg-amber-100 h-full flex-1" />
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1">
                <span>Used: ₹{BUDGET_USED} Cr</span>
                <span>Remaining: ₹{BUDGET_REMAINING} Cr</span>
              </div>
            </div>

            <div className="space-y-2">
              {BUDGET_BREAKDOWNS.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-600">
                    <span>{item.category}</span>
                    <span>₹{item.used} Cr / ₹{item.allocated} Cr</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#4f772d] h-full rounded-full" style={{ width: item.barWidth }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Program Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Awareness Programs */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Awareness Campaigns</h2>
              <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">8 ACTIVE</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Reach: 12.4L Farmers | Comp: 67%</p>
            <div className="space-y-3">
              {AWARENESS_PROGRAMS.map((item, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-2 text-xs font-semibold flex justify-between items-center">
                  <div>
                    <span className="text-gray-900 font-bold">{item.name}</span>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">States: {item.state}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[9px] font-black uppercase shrink-0">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disease Campaigns */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Disease Campaigns</h2>
              <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">6 CAMPAIGNS</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">States: 11 | Target Diseases: 4</p>
            <div className="space-y-3">
              {DISEASE_CAMPAIGNS.map((item, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-2 text-xs font-semibold">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-gray-900 font-bold">{item.name}</span>
                      <p className="text-[9px] text-gray-400 font-bold mt-0.5">{item.disease} · {item.state}</p>
                    </div>
                    <span className="font-mono text-gray-950 font-black text-[10px]">{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 mt-1 rounded-full overflow-hidden">
                    <div className="bg-[#31572c] h-full rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input Distribution Programs */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Input Distribution</h2>
              <span className="text-[9px] font-black bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-100">142 DISTRICTS</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Items: 84.2K Units | Pending: 12.4K</p>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISTRIBUTION_DATA} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <XAxis dataKey="item" stroke="#64748b" style={{ fontSize: "9px", fontWeight: "bold" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#132a13", borderRadius: "8px", border: "none", color: "#fff", fontSize: "10px" }} />
                  <Bar dataKey="distributed" fill="#4f772d" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-2 text-center text-[10px] text-gray-400 font-mono">
            Pesticide & sprayer distribution counts
          </div>
        </div>
      </div>

      {/* Row 4 — AI Recommendation Engine (3 cards, full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">AI Policy & Funding Advisory Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="bg-gray-50 border-l-4 border-red-600 rounded-r-xl border border-y-gray-200 border-r-gray-200 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full text-[9px] font-bold">URGENT</span>
                <span className="text-xs font-black text-gray-900">Suggested Policies</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-gray-700 mb-4 leading-relaxed">
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Extend fungicide subsidy to 8 additional high-risk districts.</li>
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Mandate crop health reporting from FPOs in red-zone states.</li>
              </ul>
            </div>
            <button className="w-full bg-white hover:bg-[#31572c] hover:text-white border border-gray-200 text-[#31572c] text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-lg transition active:scale-95 flex items-center justify-center gap-1">
              <Send size={10} /> Send to Ministry
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-50 border-l-4 border-amber-500 rounded-r-xl border border-y-gray-200 border-r-gray-200 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full text-[9px] font-bold">HIGH PRIORITY</span>
                <span className="text-xs font-black text-gray-900">Funding Priorities</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-gray-700 mb-4 leading-relaxed">
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Field surveillance network expansion and spore trap purchase.</li>
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Emergency pesticide stockpile procurement and central buffer setup.</li>
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Farmer awareness campaigns in high-risk kharif paddy belts.</li>
              </ul>
            </div>
            <button className="w-full bg-white hover:bg-[#31572c] hover:text-white border border-gray-200 text-[#31572c] text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-lg transition active:scale-95 flex items-center justify-center gap-1">
              <Send size={10} /> Send to Ministry
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 border-l-4 border-blue-500 rounded-r-xl border border-y-gray-200 border-r-gray-200 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded-full text-[9px] font-bold">MEDIUM PRIORITY</span>
                <span className="text-xs font-black text-gray-900">Resource Priorities</span>
              </div>
              <ul className="space-y-2 text-xs font-medium text-gray-700 mb-4 leading-relaxed">
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Deploy 200 additional field officers to the UP-Bihar clusters.</li>
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Fast-track inspection vehicle procurement for state units.</li>
                <li className="flex items-start gap-1"><span className="text-[#31572c]">⤷</span> Satellite monitoring engine licensing and NDVI sensor integration.</li>
              </ul>
            </div>
            <button className="w-full bg-white hover:bg-[#31572c] hover:text-white border border-gray-200 text-[#31572c] text-[10px] font-bold tracking-wider uppercase py-1.5 rounded-lg transition active:scale-95 flex items-center justify-center gap-1">
              <Send size={10} /> Send to Ministry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
