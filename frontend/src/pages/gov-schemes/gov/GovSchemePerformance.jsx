import React, { useState } from "react";
import { 
  Activity, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  TrendingDown
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import GenericTable from "../../../components/partials/GenericTable";

export default function GovSchemePerformance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRank, setSelectedRank] = useState("all");

  // Reallocation slider states
  const [allocationPMKisan, setAllocationPMKisan] = useState(80); // values in Cr
  const [allocationPMFBY, setAllocationPMFBY] = useState(60);
  const [allocationKCC, setAllocationKCC] = useState(50);

  const schemes = [
    { name: "PM Kisan Samman Nidhi", allocated: 120, released: 100, utilized: 95, beneficiaries: "3.2L", coverage: 89, approval: 96, time: "3.5 Days", impact: 94, rank: "top" },
    { name: "Pradhan Mantri Fasal Bima Yojana", allocated: 90, released: 80, utilized: 72, beneficiaries: "2.8L", coverage: 74, approval: 91, time: "5.2 Days", impact: 88, rank: "top" },
    { name: "Kisan Credit Card (KCC)", allocated: 80, released: 70, utilized: 58, beneficiaries: "2.4L", coverage: 68, approval: 88, time: "6.0 Days", impact: 81, rank: "moderate" },
    { name: "PM Kusum Solar Pump Subsidies", allocated: 45, released: 35, utilized: 18, beneficiaries: "85k", coverage: 42, approval: 78, time: "12 Days", impact: 64, rank: "underperforming" },
    { name: "PMKSY Micro Irrigation Support", allocated: 35, released: 30, utilized: 12, beneficiaries: "60k", coverage: 35, approval: 82, time: "9.5 Days", impact: 58, rank: "underperforming" }
  ];

  const columns = [
    { header: "SCHEME NAME", accessor: "name", sortable: true, cell: (v) => <span className="font-bold text-gray-800">{v}</span> },
    { header: "ALLOCATED", accessor: "allocated", sortable: true, cell: (v) => `₹${v} Cr` },
    { header: "UTILIZED", accessor: "utilized", sortable: true, cell: (v) => `₹${v} Cr` },
    { header: "BENEFICIARIES", accessor: "beneficiaries", sortable: true },
    { header: "COVERAGE %", accessor: "coverage", sortable: true, cell: (v) => (
      <div className="flex items-center gap-2">
        <span className="font-black text-[#132a13]">{v}%</span>
        <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-medium h-full" style={{ width: `${v}%` }} />
        </div>
      </div>
    )},
    { header: "APPROVAL RATE", accessor: "approval", sortable: true, cell: (v) => <span className="text-emerald-700 font-bold">{v}%</span> },
    { header: "TIME", accessor: "time", sortable: true },
    { header: "IMPACT SCORE", accessor: "impact", sortable: true, cell: (v) => (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
        v >= 85 ? "bg-emerald-50 text-emerald-700" : v >= 70 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-650"
      }`}>{v}/100</span>
    )}
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = selectedRank === "all" || s.rank === selectedRank;
    return matchesSearch && matchesRank;
  });

  // Calculate simulated outcomes based on sliders
  const totalSimulatedAllocation = allocationPMKisan + allocationPMFBY + allocationKCC;
  const originalAllocation = 120 + 90 + 80; // PMKisan, PMFBY, KCC
  const projectedFarmersCovered = Math.floor((allocationPMKisan * 3000) + (allocationPMFBY * 2500) + (allocationKCC * 2000));
  const efficiencyImprovement = (((totalSimulatedAllocation - originalAllocation) / originalAllocation) * 100).toFixed(1);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-medium" />
          Scheme Performance Intelligence Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Evaluate public expenditure effectiveness, program health indicators, and operational throughput of active schemes.
        </p>
      </div>

      {/* Stats and Ranking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Performance ranking dashboard */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3">Health Category Indexes</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setSelectedRank("all")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                selectedRank === "all" ? "bg-[#132a13]/10 border-brand-medium/30" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <span>All Active Programs</span>
              <span className="bg-[#132a13] text-white px-2 py-0.5 rounded-full">5</span>
            </button>
            <button 
              onClick={() => setSelectedRank("top")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                selectedRank === "top" ? "bg-emerald-50 border-emerald-200/50" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <span className="text-emerald-800 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" /> Top Performing Schemes
              </span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full">2</span>
            </button>
            <button 
              onClick={() => setSelectedRank("moderate")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                selectedRank === "moderate" ? "bg-amber-50 border-amber-200/50" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <span className="text-amber-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-600" /> Moderate Performing Schemes
              </span>
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full">1</span>
            </button>
            <button 
              onClick={() => setSelectedRank("underperforming")}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition ${
                selectedRank === "underperforming" ? "bg-red-50 border-red-200/50" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <span className="text-red-800 flex items-center gap-1.5">
                <ArrowDownRight className="w-4 h-4 text-red-500" /> Underperforming Schemes
              </span>
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full">2</span>
            </button>
          </div>
        </div>

        {/* Scheme Lifecycle chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm col-span-1 md:col-span-2">
          <h3 className="font-bold text-[#132a13] text-sm mb-3">Scheme Lifecycle Processing Stages (State Average)</h3>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">STAGE 1</span>
              <span className="text-gray-800 block">Submitted</span>
              <span className="text-brand-medium text-xs font-black mt-1 block">100%</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">STAGE 2</span>
              <span className="text-gray-800 block">Verification</span>
              <span className="text-brand-medium text-xs font-black mt-1 block">88%</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">STAGE 3</span>
              <span className="text-gray-800 block">Approval</span>
              <span className="text-brand-medium text-xs font-black mt-1 block">79%</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">STAGE 4</span>
              <span className="text-gray-800 block">Disbursed</span>
              <span className="text-brand-medium text-xs font-black mt-1 block">74%</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">STAGE 5</span>
              <span className="text-gray-800 block">Outcome</span>
              <span className="text-brand-medium text-xs font-black mt-1 block">68%</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50/50 border border-amber-100/50 rounded-xl flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold text-amber-900">Bottleneck Identified: 12% drop-off during local inspection verify stage. Verification cycle requires digitizing.</span>
          </div>
        </div>
      </div>

      {/* Interactive Reallocation Simulator */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders */}
        <div className="space-y-4">
          <h3 className="font-bold text-[#132a13] text-sm flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-brand-medium" /> Budget Reallocation Simulator
          </h3>
          <p className="text-[10px] text-gray-400 leading-normal">
            Adjust budget pools to simulate scheme adoption growth and outcome metrics on local agriculture.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>PM Kisan Pool</span>
                <span className="text-brand-medium">₹{allocationPMKisan} Cr</span>
              </div>
              <input 
                type="range" min="50" max="200" 
                value={allocationPMKisan} 
                onChange={(e) => setAllocationPMKisan(Number(e.target.value))}
                className="w-full accent-[#4f772d] cursor-pointer"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>PMFBY Pool</span>
                <span className="text-brand-medium">₹{allocationPMFBY} Cr</span>
              </div>
              <input 
                type="range" min="30" max="150" 
                value={allocationPMFBY} 
                onChange={(e) => setAllocationPMFBY(Number(e.target.value))}
                className="w-full accent-[#4f772d] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>KCC Credit Pool</span>
                <span className="text-brand-medium">₹{allocationKCC} Cr</span>
              </div>
              <input 
                type="range" min="20" max="120" 
                value={allocationKCC} 
                onChange={(e) => setAllocationKCC(Number(e.target.value))}
                className="w-full accent-[#4f772d] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Projected Outcomes */}
        <div className="lg:col-span-2 bg-[#f4f7f4]/45 border border-brand-medium/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
            <h4 className="text-xs font-bold text-[#132a13]">Simulated Intelligence Output</h4>
            <span className="text-[10px] font-mono text-gray-500 uppercase">Live calculations</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 my-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">PROJECTED FARMERS REACHED</p>
              <p className="text-2xl font-black text-[#132a13] mt-0.5">{projectedFarmersCovered.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">BUDGET VARIANCE</p>
              <p className={`text-2xl font-black mt-0.5 flex items-center gap-1 ${
                Number(efficiencyImprovement) >= 0 ? "text-emerald-700" : "text-amber-700"
              }`}>
                {Number(efficiencyImprovement) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {efficiencyImprovement}%
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-150 p-3 rounded-xl text-xs space-y-1.5 shadow-sm">
            <p className="font-bold text-[#132a13] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-brand-medium" /> AI Actionable Insights
            </p>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              Based on your reallocation of <span className="font-bold text-gray-700">₹{totalSimulatedAllocation} Cr</span>, the target efficiency changes. Promoting PM-Kisan yields faster cash distribution, whereas shifting funds to PMFBY lowers regional drought exposure index.
            </p>
          </div>
        </div>
      </div>

      {/* Scheme health table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-[#132a13] text-sm">Scheme Performance Directory</h3>
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 px-3 py-1.5 rounded-xl w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search schemes..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full"
            />
          </div>
        </div>

        <GenericTable 
          columns={columns}
          data={filteredSchemes}
          itemsPerPage={5}
          showSearch={false}
          showSort={true}
          emptyMessage="No schemes found matching the filters."
        />
      </div>
    </div>
  );
}
