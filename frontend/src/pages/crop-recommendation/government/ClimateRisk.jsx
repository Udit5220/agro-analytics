// ClimateRisk.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { ShieldAlert, Droplet, Activity, AlertCircle, Plus, Compass } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { COLORS } from "./utils/constants";
import seededData from "../../../seed-json/seededData.json";

const REGIONAL_CLIMATE_VULNERABILITY = seededData.cropRecommendation1.government.climateRisk.regionalClimateVulnerability;

export default function ClimateRisk() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  // Simulation parameters
  const [tempIncrease, setTempIncrease] = useState(1.5);
  const [rainDeficit, setRainDeficit] = useState(15);

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Rajasthan") || selectedState.includes("Maharashtra")) return 1.3;
    return 0.85;
  }, [selectedState]);

  const yieldLoss = parseFloat((tempIncrease * 8.5 * zoneMultiplier + rainDeficit * 0.4 * zoneMultiplier).toFixed(1));
  const revenueLoss = parseFloat((yieldLoss * 0.08).toFixed(2));

  const kpis = [
    <StatsCard 
      key="1"
      title="Climate Risk Index" 
      value={`${Math.round(42 * zoneMultiplier)} / 100`} 
      subtext="National threat rating" 
      icon={<ShieldAlert className="w-12 h-12 text-[#ef4444]" />} 
    />,
    <StatsCard 
      key="2"
      title="Drought Index Status" 
      value={`${Math.round(48 * zoneMultiplier)} / 100`} 
      subtext="Ground water aquifer warning" 
      icon={<Droplet className="w-12 h-12 text-[#3b82f6]" />} 
    />,
    <StatsCard 
      key="3"
      title="Heat Stress Index" 
      value={`${Math.round(64 * zoneMultiplier)} / 100`} 
      subtext="Peak vegetative temperatures" 
      icon={<AlertCircle className="w-12 h-12 text-[#f97316]" />} 
    />,
    <StatsCard 
      key="4"
      title="Rainfall Anomaly" 
      value={`${(-4.2 * zoneMultiplier).toFixed(1)}%`} 
      subtext="Deviation from monsoon norm" 
      icon={<Plus className="w-12 h-12 text-[#6366f1]" />} 
    />
  ];

  const tableDataForPdf = REGIONAL_CLIMATE_VULNERABILITY.map((v) => [v.name, v.state, `${v.droughtIndex}%`, `${v.heatStress}%`, `${v.floodExposure}%`, `${v.totalIndex}/100`, v.category]);

  const aiSectionConfig = {
    title: "AI Climate Resilience Advisor",
    buttonLabel: "Query Resilient Measures",
    prompt: `Analyze climate risks with temp increase of +${tempIncrease}°C and rain deficit of -${rainDeficit}% in ${selectedState} (${selectedDistrict}). Suggest seed replacement configurations and drought adaptation guidelines.`,
  };

  const chartData = useMemo(() => {
    return [
      { name: "Jun", Temp: parseFloat((34 + tempIncrease).toFixed(1)), Rain: Math.round(180 * (1 - rainDeficit / 100)) },
      { name: "Jul", Temp: parseFloat((32 + tempIncrease).toFixed(1)), Rain: Math.round(290 * (1 - rainDeficit / 100)) },
      { name: "Aug", Temp: parseFloat((31 + tempIncrease).toFixed(1)), Rain: Math.round(260 * (1 - rainDeficit / 100)) },
      { name: "Sep", Temp: parseFloat((30 + tempIncrease).toFixed(1)), Rain: Math.round(190 * (1 - rainDeficit / 100)) },
    ];
  }, [tempIncrease, rainDeficit]);

  return (
    <GovernmentLayout 
      pageName="Climate Risk Center" 
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["District", "State", "Drought Index", "Heat Stress", "Flood Exposure", "Total Index", "Category"]}
    >
      <div className="space-y-6">
        
        {/* Simulator & Telemetry Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Simulator Box */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-[#31572c]" /> Climate Anomaly Simulator
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Adjust baseline weather variables to estimate national crop output and revenue damages.
            </p>
            <div className="space-y-4 pt-2">
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Temperature Increase</span>
                  <span className="text-orange-650 font-mono">+{tempIncrease}°C</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={tempIncrease}
                  onChange={(e) => setTempIncrease(parseFloat(e.target.value))}
                  className="w-full accent-orange-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Rainfall Deficit Deviation</span>
                  <span className="text-sky-650 font-mono">-{rainDeficit}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={rainDeficit}
                  onChange={(e) => setRainDeficit(parseInt(e.target.value))}
                  className="w-full accent-sky-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-red-50 text-red-950 p-4 border border-red-150 rounded-xl text-xs space-y-2.5">
                <span className="font-black uppercase tracking-wider block text-[10px] text-red-800">Simulated Outcomes</span>
                <div className="flex justify-between font-semibold">
                  <span>Estimated Cereal Yield Loss:</span>
                  <span className="font-mono text-red-700 font-black">-{yieldLoss}%</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Revenue Loss Impact:</span>
                  <span className="font-mono text-red-700 font-black">-₹{revenueLoss} Lakh Cr</span>
                </div>
              </div>

            </div>
          </div>

          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Seasonal Temperature & Rainfall Anomaly Mappings
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" name="Temperature (°C)" dataKey="Temp" stroke={COLORS.danger} strokeWidth={3} />
                  <Line type="monotone" name="Rainfall (mm)" dataKey="Rain" stroke={COLORS.info} strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* District Climate Rankings Table */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black border-b pb-3 mb-4">Vulnerable District Climate Rankings</h3>
          <GenericTable
            columns={[
              { header: "District", accessor: "name", cellClassName: "font-black text-gray-900" },
              { header: "State", accessor: "state" },
              { header: "Drought Index", accessor: "droughtIndex", cell: (v) => `${v}%` },
              { header: "Heat Stress Anomaly", accessor: "heatStress", cell: (v) => `${v}%` },
              { header: "Flood Threat", accessor: "floodExposure", cell: (v) => `${v}%` },
              { 
                header: "Vulnerability Score", 
                accessor: "totalIndex", 
                cell: (v) => (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: `${v}%` }}></div>
                    </div>
                    <span className="font-bold">{v}/100</span>
                  </div>
                )
              },
              { 
                header: "Strategic Risk Tier", 
                accessor: "category", 
                cell: (v) => {
                  const badge = v === "Critical" ? "bg-red-50 text-red-800 border-red-200" : v === "High Risk" ? "bg-orange-50 text-orange-850 border-orange-200" : "bg-emerald-50 text-emerald-800 border-emerald-200";
                  return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                }
              }
            ]}
            data={REGIONAL_CLIMATE_VULNERABILITY}
            showSearch={false}
            itemsPerPage={5}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
