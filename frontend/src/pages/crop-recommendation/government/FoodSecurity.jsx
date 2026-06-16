// FoodSecurity.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Shield, Activity, TrendingUp, Layers, AlertCircle, Plus, Landmark, AlertTriangle, Compass } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { COLORS } from "./utils/constants";

import seededData from "../../../seed-json/seededData.json";

const BASE_FOOD_SECURITY_MATRIX = seededData.cropRecommendation1.government.baseFoodSecurityMatrix;
const STOCKS_DATABASE = seededData.cropRecommendation1.government.foodSecurityStocksDatabase;

export default function FoodSecurity() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Punjab") || selectedState.includes("Haryana") || selectedState.includes("Uttar Pradesh")) return 1.2;
    return 0.85;
  }, [selectedState]);

  // Recalculate metrics based on multipliers
  const computedMatrix = useMemo(() => {
    return BASE_FOOD_SECURITY_MATRIX.map((c) => {
      const prod = parseFloat((c.prod * zoneMultiplier).toFixed(1));
      const demand = parseFloat((c.demand * 1.0).toFixed(1));
      const gap = parseFloat((prod - demand).toFixed(1));
      const status = gap >= 10 ? "SAFE" : gap >= 0 ? "STABLE" : "WATCH";

      return {
        ...c,
        prod,
        demand,
        gap: gap >= 0 ? `+${gap}M MT` : `${gap}M MT`,
        status,
        gapNum: gap
      };
    });
  }, [zoneMultiplier]);

  const computedStocks = useMemo(() => {
    return STOCKS_DATABASE.map((s) => {
      const stock = parseFloat((s.currentStock * zoneMultiplier).toFixed(1));
      const req = s.requiredStock;
      const coverage = parseFloat(((stock / req) * 4).toFixed(1));
      return {
        ...s,
        currentStock: stock,
        monthsCoverage: coverage
      };
    });
  }, [zoneMultiplier]);

  const activeShortageCount = useMemo(() => {
    return computedMatrix.filter(c => c.gapNum < 0).length;
  }, [computedMatrix]);

  const aiSectionConfig = {
    title: "Food Security AI Policy Engine",
    buttonLabel: "Generate Security Analysis",
    prompt: "Analyze current safety reserves and deficit crop profiles (Pulses, Oilseeds). Recommend: 1) Potential shortages 2) Risk states 3) Import thresholds 4) Policy actions.",
  };

  const kpis = [
    <StatsCard 
      key="1"
      title="Food Security Score" 
      value="91 / 100" 
      trend="OPTIMAL" 
      trendType="success" 
      subtext="National safety index rating" 
    />,
    <StatsCard 
      key="2"
      title="National Supply Coverage" 
      value={`${Math.round(104 * zoneMultiplier)}%`} 
      trend="STABLE" 
      trendType="success" 
      subtext="Total production vs demand cover" 
    />,
    <StatsCard 
      key="3"
      title="Strategic Reserve Capacity" 
      value={`${computedStocks.reduce((sum, s) => sum + s.currentStock, 0).toFixed(1)}M MT`} 
      trend="FCI STOCKS ACTIVE" 
      trendType="success" 
      subtext="Stored in central silo grids" 
    />,
    <StatsCard 
      key="4"
      title="Deficit Commodities" 
      value={`${activeShortageCount} Crops`} 
      trend={activeShortageCount > 0 ? "HEDGING ENFORCED" : "ALL SECURE"} 
      trendType={activeShortageCount > 0 ? "warning" : "success"} 
      subtext="Required pulse & oilseed buffer" 
    />
  ];

  return (
    <GovernmentLayout 
      pageName="National Food Security Center" 
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
    >
      <div className="space-y-6">
        
        {/* Food Security Matrix & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Matrix Card */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-[#31572c]" /> Commodity Food Security Matrix
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Compares national production output vs consumer demand forecasts (M MT).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {computedMatrix.map((c, i) => (
                <div key={i} className="border rounded-xl p-3.5 space-y-2 bg-gray-50/50 hover:shadow-sm transition">
                  <div className="flex justify-between text-xs font-black text-gray-900">
                    <span>{c.crop}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-bold border ${
                      c.status === "SAFE" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : c.status === "STABLE" ? "bg-blue-50 text-blue-800 border-blue-200" : "bg-red-50 text-red-800 border-red-200"
                    }`}>{c.status}</span>
                  </div>
                  <div className="text-[10px] text-gray-600 space-y-1 font-semibold">
                    <div className="flex justify-between">
                      <span>Production:</span>
                      <span className="text-gray-900 font-bold">{c.prod}M MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Consumption:</span>
                      <span className="text-gray-900 font-bold">{c.demand}M MT</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 mt-1 font-black">
                      <span>Gap:</span>
                      <span className={c.gapNum >= 0 ? "text-emerald-700 font-bold" : "text-red-750 font-bold"}>{c.gap}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#31572c]" /> Regional Production vs Demand
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Wheat", Production: computedMatrix[0].prod, Demand: computedMatrix[0].demand },
                  { name: "Rice", Production: computedMatrix[1].prod, Demand: computedMatrix[1].demand },
                  { name: "Pulses", Production: computedMatrix[3].prod, Demand: computedMatrix[3].demand },
                  { name: "Oilseeds", Production: computedMatrix[4].prod, Demand: computedMatrix[4].demand },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Production" fill={COLORS.primary} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Demand" fill={COLORS.accentGold} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Strategic Reserve Planner & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Reserve Planner Table */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#31572c]" /> FCI Strategic Reserve Planner
            </h3>
            <GenericTable
              columns={[
                { header: "Commodity", accessor: "crop", className: "font-black" },
                { header: "Current Stocks", accessor: "currentStock", cell: (v) => `${v}M MT` },
                { header: "Required Stock Margin", accessor: "requiredStock", cell: (v) => `${v}M MT` },
                { 
                  header: "Months of Sourcing Cover", 
                  accessor: "monthsCoverage", 
                  cell: (v) => {
                    const color = v >= 4 ? "text-emerald-700 font-bold" : v >= 3 ? "text-amber-600 font-bold" : "text-red-700 font-bold";
                    return <span className={color}>{v} Months</span>;
                  }
                },
                { 
                  header: "Status", 
                  accessor: "monthsCoverage", 
                  cell: (v) => {
                    const label = v >= 4 ? "Optimal" : v >= 3 ? "Tight" : "Alert";
                    const badge = label === "Optimal" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : label === "Tight" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-red-50 text-red-800 border-red-200";
                    return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{label}</span>;
                  }
                }
              ]}
              data={computedStocks}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>

          {/* Risk Alerts Panel */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-600" /> Security Risk Alerts
            </h3>
            <div className="space-y-3">
              {computedMatrix.filter(c => c.gapNum < 0).map((c, idx) => (
                <div key={idx} className="bg-red-50/50 border border-red-200/50 p-3 rounded-xl flex items-start gap-2 text-[11px] font-semibold text-red-950">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">{c.crop} Shortage Alert</span>
                    <p className="text-gray-600 mt-0.5">Deficit of {Math.abs(c.gapNum)}M MT. Import dependency stands at {c.importDependency}. Policy intervention required.</p>
                  </div>
                </div>
              ))}
              {computedMatrix.filter(c => c.gapNum < 0).length === 0 && (
                <div className="bg-emerald-50/50 border border-emerald-250 p-4 rounded-xl text-emerald-850 font-semibold text-xs flex gap-2">
                  <Shield className="w-5 h-5 shrink-0 text-emerald-700" />
                  <span>All safety buffers are fully stocked. Sourcing targets are operating inside normal parameters.</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </GovernmentLayout>
  );
}
