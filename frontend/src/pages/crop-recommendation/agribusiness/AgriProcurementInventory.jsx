import React from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";
import {
  TrendingUp,
  Warehouse,
  BarChart3,
  Calendar,
  AlertTriangle,
  MapPin,
  CheckCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

const PIPELINE_STEPS = [
  { label: "Growing", status: "Active Sowing", pct: 100, desc: "Growers applying recommended NPK" },
  { label: "Harvesting", status: "Window Open", pct: 85, desc: "Manual and mechanical harvests active" },
  { label: "Collection", status: "FPO Centers", pct: 60, desc: "Weighing and grading at regional hubs" },
  { label: "Storage", status: "Pre-allocated", pct: 45, desc: "Cold storage and grain silos locked" },
  { label: "Processing", status: "Milling Ready", pct: 20, desc: "Sourcing lots scheduled at corporate mill" }
];

const INVENTORY_FORECAST = [
  { name: "Current", Wheat: 45, Rice: 32, Mustard: 24 },
  { name: "30 Days", Wheat: 52, Rice: 28, Mustard: 35 },
  { name: "90 Days", Wheat: 85, Rice: 48, Mustard: 50 },
  { name: "180 Days", Wheat: 120, Rice: 68, Mustard: 75 }
];

const RISK_ZONES = [
  { region: "Bundelkhand Central, MP", crop: "Wheat", capacity: "12,000 MT", status: "High Supply Zone", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { region: "Malwa Southwest, MP", crop: "Pulses", capacity: "4,500 MT", status: "Low Supply Zone", color: "text-red-700 bg-red-50 border-red-100" },
  { region: "Doab East, UP", crop: "Rice", capacity: "18,000 MT", status: "High Supply Zone", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { region: "Western Arid, RJ", crop: "Mustard", capacity: "3,200 MT", status: "Low Supply Zone", color: "text-red-700 bg-red-50 border-red-100" }
];

export default function AgriProcurementInventory() {
  const aiSectionConfig = {
    title: "AI Procurement Planner",
    buttonLabel: "Query Inventory Directives",
    prompt: "Given 78% warehouse utilization and low supply risk in wheat but deficit trends in pulses, suggest storage plans, procurement timing, and alternate sourcing channels."
  };

  return (
    <AgribusinessLayout
      pageName="Procurement & Inventory Intelligence"
      aiSection={aiSectionConfig}
      tableDataForPdf={RISK_ZONES.map((row) => [row.region, row.crop, row.capacity, row.status])}
      pdfHeaders={["Sourcing Region", "Target Crop", "Logistics Capacity", "Supply Status"]}
    >
      <div className="space-y-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Procurement Volume"
            value="1.20 Lakh MT"
            trend="+8.5%"
            trendType="success"
            subtext="Realized corporate deliveries"
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Inventory Forecast"
            value="85,000 MT"
            trend="+12%"
            trendType="success"
            subtext="Projected monthly reserve"
            icon={<Warehouse className="w-6 h-6 text-[#31572c]" />}
          />
          <StatsCard
            title="Warehouse Utilization"
            value="78%"
            trend="OPTIMAL"
            trendType="success"
            subtext="Available cold & dry capacity"
            icon={<BarChart3 className="w-6 h-6 text-[#31572c]" />}
          />
          <StatsCard
            title="Supply Coverage"
            value="4.2 Months"
            trend="STABLE"
            trendType="success"
            subtext="Inventory coverage ratio"
            icon={<Calendar className="w-6 h-6 text-[#31572c]" />}
          />
        </div>

        {/* Pipeline Tracker */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-[#31572c]" /> Procurement Pipeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STEPS.map((step, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-xs">{step.label}</span>
                    <span className="text-[9px] font-black text-[#31572c] bg-emerald-50 px-1.5 py-0.2 rounded-lg border border-emerald-100">{step.pct}%</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-450 block mt-0.5">{step.status}</span>
                  <p className="text-[9px] text-gray-500 font-semibold mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#31572c] h-full" style={{ width: `${step.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Line chart and supply risk list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">
              Inventory Volume Forecast (K MT)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={INVENTORY_FORECAST}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="Wheat" stroke="#31572c" strokeWidth={2} />
                  <Line type="monotone" dataKey="Rice" stroke="#90a955" strokeWidth={1.8} />
                  <Line type="monotone" dataKey="Mustard" stroke="#d4a373" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Map List */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Supply Risk Map
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Sourcing Zones
            </p>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {RISK_ZONES.map((zone, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex flex-col justify-between h-22 ${zone.color}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1 text-xs font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{zone.region}</span>
                      </div>
                      <span className="text-[10px] font-semibold mt-0.5 block opacity-90">Crop: {zone.crop} | Cap: {zone.capacity}</span>
                    </div>
                  </div>
                  <div className="text-[9px] font-black uppercase text-right tracking-wider mt-2">
                    {zone.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AgribusinessLayout>
  );
}
