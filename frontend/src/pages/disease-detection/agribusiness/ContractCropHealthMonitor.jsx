import React from "react";
import { 
  Users, Briefcase, TrendingUp, ShieldCheck, 
  CheckCircle, AlertTriangle, FileCheck, Sprout, 
  ShieldAlert, Activity, HeartPulse 
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const CONTRACT_HEALTH_DATA = [
  { id: 1, group: "Ludhiana Wheat FPO", crop: "Wheat", pathogen: "Yellow Rust", status: "Low Risk", compliance: "98%", yield: "4.8 T/Ha" },
  { id: 2, group: "Bathinda Cotton Coop", crop: "Cotton", pathogen: "Bollworm Spores", status: "High Risk", compliance: "72%", yield: "3.2 T/Ha" },
  { id: 3, group: "Karnal Rice Progressive", crop: "Rice", pathogen: "Rice Blast", status: "Medium Risk", compliance: "88%", yield: "5.4 T/Ha" },
  { id: 4, group: "Indore Gram Union", crop: "Pulses", pathogen: "Fusarium Wilt", status: "Low Risk", compliance: "95%", yield: "2.1 T/Ha" },
  { id: 5, group: "Nagpur Orange Growers", crop: "Oranges", pathogen: "Citrus Canker", status: "Medium Risk", compliance: "90%", yield: "8.5 T/Ha" },
  { id: 6, group: "Nuh Mustard Cluster", crop: "Mustard", pathogen: "White Rust", status: "Low Risk", compliance: "96%", yield: "2.8 T/Ha" }
];

const COMPLIANCE_SECTORS = [
  { name: "Optimal Compliance (>90%)", value: 4, color: "#31572c" },
  { name: "Moderate Risk (80-89%)", value: 1, color: "#f59e0b" },
  { name: "Critical Deficit (<80%)", value: 1, color: "#ef4444" }
];

const IMPACT_FACTORS = [
  { factor: "Grower Spray Adoption", score: 92, status: "Excellent" },
  { factor: "Chemical Delivery Speed", score: 86, status: "Optimal" },
  { factor: "Water Availability", score: 72, status: "Moderate" },
  { factor: "FPO Communication Link", score: 94, status: "Excellent" }
];

const RECOVERY_TRACKING = [
  { disease: "Rice Blast", avgPeriod: "12 Days", status: "Optimal", rate: 92 },
  { disease: "Yellow Rust", avgPeriod: "14 Days", status: "On Track", rate: 88 },
  { disease: "Late Blight", avgPeriod: "10 Days", status: "Optimal", rate: 95 }
];

export default function ContractCropHealthMonitor() {
  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Contract Crop Health Monitor</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Review contract compliance index, evaluate crop pathogen spread, and assess sourcing readiness.
        </p>
      </div>

      {/* Contract Portfolio KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Contract Compliance"
          value="94.2%"
          trend="Optimal"
          trendType="success"
          subtext="Signed grower deliverables"
          icon={<CheckCircle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Sourcing Acreage"
          value="8,450 ac"
          trend="+12% MoM"
          trendType="success"
          subtext="Wheat, Rice, and Mustard"
          icon={<Sprout className="text-[#31572c]" />}
        />
        <StatsCard
          title="Spore Warnings"
          value="120 ppm"
          trend="Elevated"
          trendType="danger"
          subtext="Wheat Rust pathogen alert"
          icon={<ShieldAlert className="text-[#31572c]" />}
        />
        <StatsCard
          title="Target Sourcing Yield"
          value="4.8 T/Ha"
          trend="Avg target"
          trendType="neutral"
          subtext="Expected harvest yield"
          icon={<Activity className="text-[#31572c]" />}
        />
      </div>

      {/* Main Grid: FPO Risks & Compliance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#31572c]" /> FPO Pathogen Risk & Compliance
          </h3>
          <GenericTable
            columns={[
              { header: "Contract FPO / Coop", accessor: "group", className: "font-black text-slate-900" },
              { header: "Crop Type", accessor: "crop" },
              { header: "Pathogen Inspected", accessor: "pathogen" },
              {
                header: "Pathogen Risk Status",
                accessor: "status",
                cell: (val) => (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    val === "High Risk" ? "bg-red-105 text-red-700" : val === "Medium Risk" ? "bg-amber-105 text-amber-700" : "bg-emerald-105 text-emerald-700"
                  }`}>
                    {val}
                  </span>
                )
              },
              { header: "Deliverable Yield", accessor: "yield" }
            ]}
            data={CONTRACT_HEALTH_DATA}
            showSearch={true}
            itemsPerPage={6}
          />
        </div>

        {/* Compliance Analytics (Recharts Pie Chart) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-[#31572c]" /> Contract Compliance Share
          </h3>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPLIANCE_SECTORS}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {COMPLIANCE_SECTORS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-slate-900">83%</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase">Optimal Rate</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[9px] font-bold text-slate-500 pt-2 border-t border-slate-100">
            {COMPLIANCE_SECTORS.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}</span>
                <span>{item.value} FPOs</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sourcing Readiness score & Recovery Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sourcing Readiness Details */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-[#31572c]" /> Sourcing Readiness Factors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            {IMPACT_FACTORS.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100/60 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-[11px] text-slate-800">
                  <span>{item.factor}</span>
                  <span className="text-[#31572c]">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-brand-dark h-full" style={{ width: `${item.score}%` }}></div>
                </div>
                <span className="text-[9px] text-[#31572c] font-black uppercase tracking-wider block">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pathogen Recovery Tracking */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#31572c]" /> Pathogen Recovery Index
          </h3>
          <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
            {RECOVERY_TRACKING.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <div>
                  <span className="font-bold text-slate-900 block">{item.disease}</span>
                  <span className="text-[10px] text-slate-400">Avg recovery: {item.avgPeriod}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-[#31572c] block">{item.rate}% Recovery</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-1.5 py-0.5 rounded font-black uppercase">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
