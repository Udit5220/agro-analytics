import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CircleDollarSign, 
  Activity, 
  FolderKanban, 
  Warehouse, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  Map,
  MapPin,
  ChevronRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";

export default function GovGovernanceCommandCenter() {
  const [activeLayer, setActiveLayer] = useState("coverage"); // coverage, budget, fpos, infrastructure
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Mock data for heat map districts
  const districts = [
    { id: "hry-01", name: "Sonipat", coverage: "84%", budget: "₹72.8 Cr", fpos: "12 Active", infra: "45 Units", colorMap: { coverage: "bg-[#132a13]", budget: "bg-[#31572c]", fpos: "bg-[#4f772d]", infra: "bg-[#90a955]" }, text: "Excellent PMFBY and KCC scheme adoption. Top ROI in warehouse setups." },
    { id: "hry-02", name: "Rohtak", coverage: "71%", budget: "₹48.2 Cr", fpos: "8 Active", infra: "28 Units", colorMap: { coverage: "bg-[#31572c]", budget: "bg-[#4f772d]", fpos: "bg-[#90a955]", infra: "bg-[#4f772d]" }, text: "Moderate scheme penetration. High requirement for cold chain links." },
    { id: "hry-03", name: "Jhajjar", coverage: "58%", budget: "₹31.5 Cr", fpos: "5 Active", infra: "12 Units", colorMap: { coverage: "bg-[#4f772d]", budget: "bg-[#90a955]", fpos: "bg-amber-600/70", infra: "bg-[#90a955]" }, text: "Declining micro-irrigation applications. Subsidies underutilized." },
    { id: "hry-04", name: "Panipat", coverage: "42%", budget: "₹18.9 Cr", fpos: "3 Active", infra: "8 Units", colorMap: { coverage: "bg-[#90a955]", budget: "bg-amber-600/70", fpos: "bg-red-600/70", infra: "bg-amber-600/70" }, text: "Critical need for crop insurance campaign. High percentage of marginal farmers." },
    { id: "hry-05", name: "Karnal", coverage: "89%", budget: "₹94.5 Cr", fpos: "15 Active", infra: "62 Units", colorMap: { coverage: "bg-[#132a13]", budget: "bg-[#132a13]", fpos: "bg-[#31572c]", infra: "bg-[#132a13]" }, text: "Highest budget utilization. Excellent solar energy grid integration." }
  ];

  const layerOptions = [
    { id: "coverage", label: "Scheme Coverage %" },
    { id: "budget", label: "Budget Utilized" },
    { id: "fpos", label: "FPO Density" },
    { id: "infrastructure", label: "Infrastructure Assets" }
  ];

  const briefPoints = [
    { type: "warning", text: "District Panipat has the lowest PMFBY adoption. Campaign recommended." },
    { type: "info", text: "₹120 Cr remains unused in processing infrastructure support statewide." },
    { type: "warning", text: "Three districts (Jhajjar, Rohtak, Panipat) show declining scheme utilization." },
    { type: "success", text: "Warehouse investments are generating the highest ROI statewide (+24% YoY)." },
    { type: "success", text: "Farmer scheme coverage improved by 7.2% overall this quarter." }
  ];

  const trendData = [
    { month: "Jan", budgetUtil: 45, applications: 2300 },
    { month: "Feb", budgetUtil: 52, applications: 3100 },
    { month: "Mar", budgetUtil: 60, applications: 4200 },
    { month: "Apr", budgetUtil: 72, applications: 5600 },
    { month: "May", budgetUtil: 84, applications: 7800 },
    { month: "Jun", budgetUtil: 91, applications: 9400 }
  ];

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      {/* Page Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#4f772d]" />
            Agricultural Governance Command Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time executive oversight, financial health monitoring, and geospatial insights of government programs.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-bold bg-[#132a13]/10 text-[#132a13] px-3.5 py-1.5 rounded-xl border border-[#132a13]/15 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#4f772d]" /> Haryana State Control Panel
          </span>
        </div>
      </div>

      {/* KPI Layer */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatsCard 
          title="Total Farmers" 
          value="4.2 Lakh" 
          trend="84% Eligible" 
          subtext="Registered: 3.5L"
          icon={<Users className="text-[#4f772d]" />}
        />
        <StatsCard 
          title="Total FPOs" 
          value="45 Active" 
          trend="+5 this Q" 
          subtext="Funded: 28 FPOs"
          icon={<Building2 className="text-[#4f772d]" />}
        />
        <StatsCard 
          title="Government Budget" 
          value="₹245.5 Cr" 
          trend="91% Utilized" 
          subtext="Released: ₹220 Cr"
          icon={<CircleDollarSign className="text-[#4f772d]" />}
        />
        <StatsCard 
          title="Active Schemes" 
          value="18 Running" 
          trend="12 High-Perf" 
          subtext="Under-perf: 2"
          icon={<Activity className="text-[#4f772d]" />}
        />
        <StatsCard 
          title="Application Pipeline" 
          value="12,450" 
          trend="4.5 Days Avg" 
          subtext="Approved: 9,210"
          icon={<FolderKanban className="text-[#4f772d]" />}
        />
        <StatsCard 
          title="Infrastructure Created" 
          value="155 Assets" 
          trend="+18% YoY" 
          subtext="Storage, Processing, Solar"
          icon={<Warehouse className="text-[#4f772d]" />}
        />
      </div>

      {/* Main Grid: Heat Map & AI Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heat Map Column */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-[#132a13] text-sm flex items-center gap-1.5">
                <Map className="w-4 h-4 text-[#4f772d]" /> State Geospatial Intelligence Layer
              </h3>
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1 gap-1">
                {layerOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setActiveLayer(opt.id)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                      activeLayer === opt.id 
                        ? "bg-[#132a13] text-white" 
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Heat Map */}
            <div className="relative border border-gray-100 bg-[#f4f7f4]/20 rounded-2xl h-80 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[#f4f7f4]/40 opacity-40 bg-[radial-gradient(#d1e2d1_1.5px,transparent_1.5px)] [background-size:20px_20px]"></div>
              
              {/* Simulated Map Districts */}
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <div className="grid grid-cols-5 gap-3 max-w-md w-full relative z-10">
                  {districts.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDistrict(d)}
                      className={`h-24 rounded-2xl ${d.colorMap[activeLayer]} text-white p-3 flex flex-col justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none ring-offset-2 ${
                        selectedDistrict?.id === d.id ? "ring-2 ring-[#132a13]" : ""
                      }`}
                    >
                      <span className="text-[10px] font-bold tracking-wider opacity-85 uppercase">{d.name}</span>
                      <div className="text-left">
                        <p className="text-xs font-black">
                          {activeLayer === "coverage" && d.coverage}
                          {activeLayer === "budget" && d.budget}
                          {activeLayer === "fpos" && d.fpos}
                          {activeLayer === "infrastructure" && d.infra}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Float Overlay Info */}
              {selectedDistrict && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur border border-gray-150 p-4 rounded-xl shadow-md z-20 flex justify-between items-center animate-slideUp">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#132a13]">{selectedDistrict.name} District Analysis</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{selectedDistrict.text}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedDistrict(null)}
                    className="text-[10px] font-black text-gray-400 hover:text-gray-600 px-2.5 py-1 hover:bg-gray-100 rounded-lg"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Brief Column */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#4f772d]" /> AI Governance Brief
            </h3>
            <p className="text-[10px] text-gray-400 mb-4 leading-normal">
              Machine learning analytics generated from real-time district feeds and budget utilization telemetry.
            </p>
            <div className="space-y-3">
              {briefPoints.map((pt, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition ${
                    pt.type === "warning" 
                      ? "bg-amber-50/50 border-amber-100/50 text-amber-900" 
                      : pt.type === "success" 
                        ? "bg-emerald-50/50 border-emerald-100/50 text-emerald-950" 
                        : "bg-blue-50/50 border-blue-100/50 text-blue-950"
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    pt.type === "warning" ? "text-amber-600" : pt.type === "success" ? "text-emerald-700" : "text-blue-600"
                  }`} />
                  <p className="text-[11px] font-medium leading-relaxed">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quarterly Budget Utilization Progress</h4>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" vertical={false} />
                  <XAxis dataKey="month" hide />
                  <YAxis hide />
                  <Tooltip formatter={(value) => `${value}%`} labelClassName="text-[10px]" />
                  <Area type="monotone" dataKey="budgetUtil" stroke="#4f772d" fill="#ecf39e" fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
