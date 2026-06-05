import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";
import {
  TrendingUp,
  Sliders,
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

const BASE_CROPS = [
  { crop: "Wheat", area: "98,000 Ac", baseYield: 3.8, baseProduction: 320000, baseRevenue: 720, confidence: 92 },
  { crop: "Rice", area: "62,000 Ac", baseYield: 4.2, baseProduction: 210000, baseRevenue: 510, confidence: 88 },
  { crop: "Cotton", area: "34,000 Ac", baseYield: 2.2, baseProduction: 68000, baseRevenue: 480, confidence: 81 },
  { crop: "Maize", area: "22,000 Ac", baseYield: 3.5, baseProduction: 48000, baseRevenue: 120, confidence: 85 },
  { crop: "Mustard", area: "44,000 Ac", baseYield: 1.8, baseProduction: 82000, baseRevenue: 410, confidence: 90 },
  { crop: "Sugarcane", area: "18,000 Ac", baseYield: 45.0, baseProduction: 840000, baseRevenue: 210, confidence: 94 },
  { crop: "Pulses", area: "28,000 Ac", baseYield: 1.5, baseProduction: 42000, baseRevenue: 285, confidence: 87 },
  { crop: "Oilseeds", area: "35,000 Ac", baseYield: 1.9, baseProduction: 66500, baseRevenue: 412, confidence: 89 }
];

const TIME_HORIZONS = [
  { name: "30 Days", Wheat: 45, Rice: 20, Cotton: 10, Maize: 15, Mustard: 30, Sugarcane: 150, Pulses: 12, Oilseeds: 18 },
  { name: "90 Days", Wheat: 120, Rice: 80, Cotton: 30, Maize: 25, Mustard: 50, Sugarcane: 320, Pulses: 22, Oilseeds: 35 },
  { name: "180 Days", Wheat: 280, Rice: 170, Cotton: 55, Maize: 38, Mustard: 72, Sugarcane: 650, Pulses: 35, Oilseeds: 54 },
  { name: "365 Days", Wheat: 320, Rice: 210, Cotton: 68, Maize: 48, Mustard: 82, Sugarcane: 840, Pulses: 42, Oilseeds: 66 }
];

export default function AgriYieldProduction() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");

  const [rainfall, setRainfall] = useState(100); // % of normal (80% - 120%)
  const [temperature, setTemperature] = useState(25); // °C (20°C - 35°C)
  const [water, setWater] = useState(100); // % of normal (60% - 120%)

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.25;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  // Compute a dynamic multiplier based on simulator inputs and selected zone
  const simulatedMultiplier = useMemo(() => {
    const rainDev = (rainfall - 100) * 0.005; // +/- 10% change
    const tempDev = (temperature - 25) * -0.02; // heating drops yield
    const waterDev = (water - 100) * 0.008; // irrigation impact
    return Math.max(0.5, Math.min(1.5, (1 + rainDev + tempDev + waterDev) * zoneMultiplier));
  }, [rainfall, temperature, water, zoneMultiplier]);

  const simulatedCrops = useMemo(() => {
    return BASE_CROPS.map((c) => {
      const isTarget = c.crop === selectedCommodity;
      const targetMult = isTarget ? simulatedMultiplier * 1.1 : simulatedMultiplier;
      const prod = Math.round(c.baseProduction * targetMult);
      const rev = Math.round(c.baseRevenue * targetMult);
      const yld = (c.baseYield * targetMult).toFixed(1);

      return {
        ...c,
        yield: `${yld} T/Ac`,
        production: `${prod.toLocaleString()} MT`,
        revenue: `₹${rev.toLocaleString()} Cr`,
        isTarget
      };
    });
  }, [simulatedMultiplier, selectedCommodity]);

  const activeCropData = useMemo(() => {
    return simulatedCrops.find((c) => c.crop === selectedCommodity) || simulatedCrops[0];
  }, [simulatedCrops, selectedCommodity]);

  const simulatedChartData = useMemo(() => {
    return TIME_HORIZONS.map((t) => {
      return {
        name: t.name,
        [selectedCommodity]: Math.round((t[selectedCommodity] || t.Wheat) * simulatedMultiplier),
        Average: Math.round(((t.Wheat + t.Rice + t.Mustard) / 3) * simulatedMultiplier)
      };
    });
  }, [simulatedMultiplier, selectedCommodity]);

  const aiSectionConfig = {
    title: "AI Production Insights",
    buttonLabel: "Query Production Analysis",
    prompt: `Analyze crop yields with a simulated multiplier of ${simulatedMultiplier.toFixed(2)} for ${selectedCommodity} in ${selectedZone}. Suggest water-saving irrigation policies and harvest scheduling adjustments for regions showing variance.`
  };

  const kpiList = [
    <StatsCard
      key="1"
      title={`${selectedCommodity} Forecast Yield`}
      value={activeCropData.yield}
      trend="+5.2%"
      trendType="success"
      subtext={`Simulated ${selectedZone} target`}
    />,
    <StatsCard
      key="2"
      title={`${selectedCommodity} Est. Production`}
      value={activeCropData.production}
      trend={simulatedMultiplier > 1 ? "INCREASING" : "STABLE"}
      trendType={simulatedMultiplier > 1 ? "success" : "warning"}
      subtext="Projected sourcing quantity"
    />,
    <StatsCard
      key="3"
      title="Yield Variance Index"
      value={`${(simulatedMultiplier - 1 >= 0 ? "+" : "")}${Math.round((simulatedMultiplier - 1) * 100)}%`}
      trend={simulatedMultiplier >= 1.0 ? "OPTIMAL" : "WARNING"}
      trendType={simulatedMultiplier >= 1.0 ? "success" : "danger"}
      subtext="Deviation from baseline model"
    />,
    <StatsCard
      key="4"
      title="Confidence Score"
      value={`${activeCropData.confidence}%`}
      trend="STABLE"
      trendType="success"
      subtext="Historical predictive reliability"
    />
  ];

  return (
    <AgribusinessLayout
      pageName="Yield & Production Intelligence"
      kpiStrip={kpiList}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      aiSection={aiSectionConfig}
      tableDataForPdf={simulatedCrops.map((row) => [row.crop, row.area, row.yield, row.production, row.revenue, `${row.confidence}%`])}
      pdfHeaders={["Crop", "Area", "Expected Yield", "Simulated Production", "Simulated Revenue", "Confidence"]}
    >
      <div className="space-y-6">
        
        {/* Forecast Timeline & Scenario Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Production Forecast Center (Chart) */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">
              Production Delivery Timeline: {selectedCommodity} (MT)
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulatedChartData}>
                  <defs>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#31572c" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#31572c" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e07a5f" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#e07a5f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Area type="monotone" name={`${selectedCommodity} Volume`} dataKey={selectedCommodity} stroke="#31572c" fillOpacity={1} fill="url(#colorTarget)" />
                  <Area type="monotone" name="Global Average Sourcing" dataKey="Average" stroke="#e07a5f" fillOpacity={1} fill="url(#colorAverage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scenario Simulator */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black border-b border-white/20 pb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#ecf39e]" /> Scenario Simulator
              </h3>
              <p className="text-[10px] text-gray-300 font-semibold uppercase tracking-wider mt-1.5">
                Modify climate factors for {selectedZone}
              </p>
            </div>

            <div className="space-y-4 my-2">
              {/* Rainfall Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Rainfall Deviation</span>
                  <span className="text-[#ecf39e]">{rainfall}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="120"
                  value={rainfall}
                  onChange={(e) => setRainfall(Number(e.target.value))}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Temperature</span>
                  <span className="text-[#ecf39e]">{temperature}°C</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="35"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>

              {/* Water Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Water Availability</span>
                  <span className="text-[#ecf39e]">{water}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  value={water}
                  onChange={(e) => setWater(Number(e.target.value))}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <span className="text-[9px] text-[#ecf39e] font-black uppercase tracking-wider block">Aggregate Yield Multiplier</span>
              <span className="text-2xl font-black">{simulatedMultiplier.toFixed(2)}x</span>
              <span className="text-[10px] text-gray-300 block mt-1">Includes regional soil & climate index</span>
            </div>
          </div>
        </div>

        {/* Crop-wise Forecast Table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-800 border-b pb-3">
            Commodity Sourcing Volume & Revenue Projections
          </h3>
          <GenericTable
            columns={[
              { 
                header: "Crop", 
                accessor: "crop", 
                cell: (v, row) => (
                  <span className={`font-black ${row.isTarget ? 'text-[#31572c] underline decoration-wavy font-black' : 'text-gray-900'}`}>
                    {v} {row.isTarget ? ' (Active)' : ''}
                  </span>
                )
              },
              { header: "Contracted Area", accessor: "area" },
              { header: "Simulated Yield", accessor: "yield" },
              { header: "Expected Production", accessor: "production" },
              { header: "Simulated Sourcing Revenue", accessor: "revenue" },
              {
                header: "Confidence Score",
                accessor: "confidence",
                cell: (v) => (
                  <span className="font-bold text-gray-850">{v}%</span>
                )
              }
            ]}
            data={simulatedCrops}
            showSearch={false}
            itemsPerPage={8}
          />
        </div>

      </div>
    </AgribusinessLayout>
  );
}
