// WaterSecurity.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Droplet, Layers, AlertCircle, Compass, Calculator, Wrench, Shield, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell
} from "recharts";
import { COLORS } from "./utils/constants";
import seededData from "../../../seed-json/seededData.json";

const WATER_CONSUMPTION_DATA = seededData.cropRecommendation1.government.waterConsumptionAlternatives;
const AQUIFER_STRESS_DATABASE = seededData.cropRecommendation1.government.aquiferStressDatabase;

export default function WaterSecurity() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  // Replacement Calculator parameter
  const [paddyReductionPct, setPaddyReductionPct] = useState(15);

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Punjab") || selectedState.includes("Rajasthan") || selectedState.includes("Haryana")) return 1.35;
    return 0.85;
  }, [selectedState]);

  const simulatedWaterSavings = useMemo(() => {
    // 15% reduction of Paddy yields 22% aquifer extraction drop
    const rate = Math.round(paddyReductionPct * 1.46 * zoneMultiplier);
    return Math.min(95, rate);
  }, [paddyReductionPct, zoneMultiplier]);

  const kpis = [
    <StatsCard 
      key="1"
      title="Groundwater Stress Avg" 
      value={`${Math.round(68 * zoneMultiplier)}%`} 
      trend="OVER-EXPLOITED" 
      trendType="danger" 
      subtext="Of safety extraction index limit" 
      icon={<Droplet className="w-12 h-12 text-[#ef4444]" />} 
    />,
    <StatsCard 
      key="2"
      title="Irrigation Efficiency" 
      value="34%" 
      trend="LOW EFFICIENCY" 
      trendType="warning" 
      subtext="Flood-irrigation saturation" 
      icon={<Layers className="w-12 h-12 text-[#f97316]" />} 
    />,
    <StatsCard 
      key="3"
      title="Water Demand Forecast" 
      value={`${(84.5 * zoneMultiplier).toFixed(1)} B m³`} 
      trend="RABI SEASON PROJECTED" 
      trendType="success" 
      subtext="Includes canals & tube wells draw" 
      icon={<Activity className="w-12 h-12 text-[#3b82f6]" />} 
    />,
    <StatsCard 
      key="4"
      title="Sustainability Index" 
      value={`${Math.round(52 / zoneMultiplier)}/100`} 
      trend={zoneMultiplier > 1.0 ? "CRITICAL" : "STABLE"} 
      trendType={zoneMultiplier > 1.0 ? "danger" : "success"} 
      subtext="Aquifer resilience score" 
      icon={<Shield className="w-12 h-12 text-[#31572c]" />} 
    />
  ];

  const chartData = useMemo(() => {
    return [
      { name: "Paddy", Baseline: 3400, Simulated: Math.round(3400 * (1 - paddyReductionPct / 100)) },
      { name: "Sugarcane", Baseline: 2800, Simulated: 2800 },
      { name: "Wheat", Baseline: 1500, Simulated: 1500 },
      { name: "Mustard", Baseline: 700, Simulated: 700 },
      { name: "Millets", Baseline: 450, Simulated: Math.round(450 + (3400 - 450) * (paddyReductionPct / 100) * 0.15) }
    ];
  }, [paddyReductionPct]);

  const tableDataForPdf = AQUIFER_STRESS_DATABASE.map((a) => [a.name, a.state, `${a.extractionRate}%`, a.stressLevel, `${a.bufferMonths} Mos`]);

  const aiSectionConfig = {
    title: "AI Water Policy Advisor",
    buttonLabel: "Query Conservation Audit",
    prompt: `Analyze aquifer stress under a simulated ${paddyReductionPct}% Paddy acreage shift to Pearl Millet for ${selectedState} (${selectedDistrict}). Detail estimated savings, and water-pricing directives.`,
  };

  return (
    <GovernmentLayout 
      pageName="Water Security Center" 
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Aquifer Sourcing Zone", "State", "Extraction Rate", "Stress Level", "Buffer Months"]}
    >
      <div className="space-y-6">
        
        {/* Replacement Engine & Footprints */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Replacement Calculator */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Calculator className="w-4.5 h-4.5 text-[#31572c]" /> Crop Water Replacement Engine
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Slide to reduce Paddy (Rice) acreage and model the simulated reduction in regional aquifer drawdown.
            </p>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Paddy Acreage Reduction Target:</span>
                  <span className="text-[#31572c] font-black">{paddyReductionPct}% Area Shifting</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={paddyReductionPct}
                  onChange={(e) => setPaddyReductionPct(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-emerald-50 text-emerald-950 p-4 border border-emerald-150 rounded-xl text-xs space-y-2">
                <span className="font-black uppercase tracking-wider block text-[9px] text-[#31572c]">Simulated Conservation Gains</span>
                <div className="flex justify-between font-semibold">
                  <span>Potential Groundwater Savings:</span>
                  <span className="font-mono text-emerald-700 font-black">+{simulatedWaterSavings}% Aquifer Reserve</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                  *Equivalent to saving approximately {(paddyReductionPct * 1.8 * zoneMultiplier).toFixed(1)} Billion liters of ground water reserves.
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Commodity Irrigation Water Footprints (Liters/Kg)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(v) => `${v} Liters/Kg`} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Baseline" name="Baseline Footprint" fill="#e07a5f" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Simulated" name="Simulated Footprint" fill="#31572c" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Aquifer stress listings & alternatives */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3">Critical Aquifer Extraction Stress Logs</h3>
            <GenericTable
              columns={[
                { header: "Aquifer Basin", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { 
                  header: "Extraction Rate (%)", 
                  accessor: "extractionRate", 
                  cell: (v) => <span className={v >= 100 ? "text-red-750 font-black" : "text-gray-700 font-bold"}>{v}% of Recharge</span>
                },
                { 
                  header: "Stress Level", 
                  accessor: "stressLevel", 
                  cell: (v) => {
                    const badge = v.includes("Critical") ? "bg-red-50 text-red-800 border-red-200" : "bg-amber-50 text-amber-800 border-amber-200";
                    return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                  }
                },
                { header: "Buffer Safety Months", accessor: "bufferMonths", cell: (v) => `${v} Months` }
              ]}
              data={AQUIFER_STRESS_DATABASE}
              showSearch={false}
              itemsPerPage={5}
            />
          </div>

          {/* Alternatives Table */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Wrench className="w-4.5 h-4.5 text-[#31572c]" /> Water-Saving Alternatives
            </h3>
            <div className="space-y-3">
              {WATER_CONSUMPTION_DATA.map((item, i) => (
                <div key={i} className="border p-3.5 rounded-xl space-y-2 bg-gray-50/50">
                  <div className="flex justify-between text-xs font-black text-gray-900">
                    <span>{item.crop}</span>
                    <span className="text-[#31572c] font-bold">{item.footprint} L/kg</span>
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold space-y-1">
                    <div className="flex justify-between text-emerald-800">
                      <span>Alternative Alt: {item.alternative}</span>
                      <span>{item.altFootprint} L/kg</span>
                    </div>
                    <div className="flex justify-between text-[#31572c] font-black border-t pt-1 mt-1">
                      <span>Potential Savings:</span>
                      <span>{item.savings}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </GovernmentLayout>
  );
}
