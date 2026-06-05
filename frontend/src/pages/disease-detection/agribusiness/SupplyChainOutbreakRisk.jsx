import React from "react";
import { 
  AlertTriangle, Map, Warehouse, ShieldCheck, 
  ArrowUpRight, ArrowDownRight, Truck, Globe, BarChart2, 
  Settings, ShieldAlert, Thermometer, Shield 
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const SUPPLY_GAP_DATA = [
  { crop: "Rice (Paddy)", target: 1200, actual: 1080 },
  { crop: "Wheat", target: 1500, actual: 1440 },
  { crop: "Potato", target: 800, actual: 750 },
  { crop: "Mustard", target: 600, actual: 590 }
];

const WAREHOUSE_RISK = [
  { id: 1, name: "Ludhiana Regional Silo", capacity: "5,000 MT", threat: "Low", vectors: "Inactive", temp: "22°C" },
  { id: 2, name: "Kharindwa Buffer Depot", capacity: "2,000 MT", threat: "Critical", vectors: "Spore Detected", temp: "27°C" },
  { id: 3, name: "Bathinda Storage Hub", capacity: "3,500 MT", threat: "High", vectors: "Insect Activity", temp: "25°C" }
];

const SUPPLY_DEFICIT_MITIGATION = [
  { id: 1, region: "Punjab West Cluster", crop: "Wheat", risk: "Low", capacity: "2,400 tons", status: "Active Alternative" },
  { id: 2, region: "Haryana North Zone", crop: "Rice", risk: "Moderate", capacity: "1,800 tons", status: "Active Alternative" },
  { id: 3, region: "UP Central Region", crop: "Mustard", risk: "Low", capacity: "950 tons", status: "Ready Standby" },
  { id: 4, region: "Maharashtra Orange Belt", crop: "Oranges", risk: "High", capacity: "600 tons", status: "Review Required" }
];

export default function SupplyChainOutbreakRisk() {
  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Supply Chain Outbreak Risk Center</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Monitor supply chain deficit impact, analyze buffer stockpiles, and review alternative sourcing routes.
        </p>
      </div>

      {/* Stats KPI grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Sourcing Deficit Threat"
          value="450 tons"
          trend="High priority"
          trendType="danger"
          subtext="Rice Blast volume threat"
          icon={<AlertTriangle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Intercepted Routes"
          value="3 Routes"
          trend="Rerouting active"
          trendType="neutral"
          subtext="Outbreak buffer zone detours"
          icon={<Map className="text-[#31572c]" />}
        />
        <StatsCard
          title="Reserve Stock Level"
          value="1,200 tons"
          trend="Adequate buffer"
          trendType="success"
          subtext="Emergency buffer reserve"
          icon={<Warehouse className="text-[#31572c]" />}
        />
        <StatsCard
          title="Supply Impact Rating"
          value="Low Risk"
          trend="Stable"
          trendType="success"
          subtext="Overall logistics index"
          icon={<ShieldCheck className="text-[#31572c]" />}
        />
      </div>

      {/* Sourcing Deficits, Warehouses & Alternative Sourcing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Logistics & Alternative Sourcing */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#31572c]" /> Alternative Sourcing Locations (Outbreak-Free Zones)
          </h3>
          <GenericTable
            columns={[
              { header: "Alternative Sourcing Zone", accessor: "region", className: "font-black text-slate-900" },
              { header: "Backup Crop", accessor: "crop" },
              { 
                header: "Outbreak Risk", 
                accessor: "risk",
                cell: (val) => (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    val === "High" ? "bg-red-105 text-red-700" : val === "Moderate" ? "bg-amber-105 text-amber-700" : "bg-emerald-105 text-emerald-700"
                  }`}>
                    {val} Risk
                  </span>
                )
              },
              { header: "Supply Capacity", accessor: "capacity" },
              { header: "Allocation Status", accessor: "status" }
            ]}
            data={SUPPLY_DEFICIT_MITIGATION}
            showSearch={true}
            itemsPerPage={5}
          />
        </div>

        {/* Supply Chain Risk Score & Inventory Exposure */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#31572c]" /> Supply Chain Risk Score
            </h3>
            
            <div className="flex flex-col items-center py-4 border-b border-slate-100/60">
              <span className="text-4xl font-black text-red-600">38</span>
              <span className="text-[9px] font-black uppercase tracking-wider text-red-500 mt-1">Moderate Threat Level</span>
            </div>

            <div className="space-y-3 pt-2 text-xs font-semibold text-slate-705">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Inventory Exposure</span>
              <div className="flex justify-between items-center">
                <span>Monitored Contract Stock</span>
                <span className="font-bold text-slate-900">4,500 MT</span>
              </div>
              <div className="flex justify-between items-center text-red-650">
                <span>Pathogen Exposed Stock</span>
                <span className="font-bold text-red-700">540 MT</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl mt-4 space-y-1 text-[10px]">
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Logistics Advisory</span>
            <p className="leading-relaxed font-bold text-slate-600">
              Consider shifting 120 tons of sourcing allocation from Ludhiana Wheat FPO to Punjab West Cluster to bypass the yellow rust quarantine routes.
            </p>
          </div>
        </div>

      </div>

      {/* Warehouse Risks & Supply Gap Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Warehouse Risk Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Warehouse className="w-4 h-4 text-[#31572c]" /> Warehouse Storage Vulnerabilities
          </h3>
          <GenericTable
            columns={[
              { header: "Warehouse Depot", accessor: "name", className: "font-black text-slate-900" },
              { header: "Storage Capacity", accessor: "capacity" },
              { 
                header: "Outbreak Threat", 
                accessor: "threat",
                cell: (val) => (
                  <span className={`px-2 py-0.5 rounded text-[8.5px] font-black uppercase ${
                    val === "Critical" ? "bg-red-105 text-red-700" : val === "High" ? "bg-orange-105 text-orange-700" : "bg-emerald-105 text-emerald-700"
                  }`}>
                    {val}
                  </span>
                )
              },
              { header: "Biosecurity Vectors", accessor: "vectors" },
              { header: "Temp Control", accessor: "temp" }
            ]}
            data={WAREHOUSE_RISK}
            showSearch={false}
          />
        </div>

        {/* Supply Gap Analysis (Recharts) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#31572c]" /> Target vs Actual Sourcing Gap (Tons)
          </h3>
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUPPLY_GAP_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="crop" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '10px' }} />
                <Bar dataKey="target" fill="#90a955" name="Target (Tons)" rx={2} />
                <Bar dataKey="actual" fill="#31572c" name="Actual (Tons)" rx={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
