import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import {
  TrendingUp,
  Sliders,
  DollarSign,
  AlertTriangle,
  Award,
  ChevronRight,
  Calculator,
  Compass
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList
} from "recharts";

// Static database of crop factors
const BASE_CROP_FACTORS = [
  { crop: "Wheat", baseDemand: 80, baseSupply: 80, basePrice: 5200, exportPotential: 75, climateRisk: 25, baseFeasibility: 85 },
  { crop: "Rice", baseDemand: 90, baseSupply: 88, basePrice: 4200, exportPotential: 85, climateRisk: 40, baseFeasibility: 75 },
  { crop: "Cotton", baseDemand: 72, baseSupply: 65, basePrice: 7100, exportPotential: 78, climateRisk: 30, baseFeasibility: 60 },
  { crop: "Maize", baseDemand: 68, baseSupply: 70, basePrice: 2200, exportPotential: 65, climateRisk: 35, baseFeasibility: 68 },
  { crop: "Mustard", baseDemand: 85, baseSupply: 60, basePrice: 5600, exportPotential: 60, climateRisk: 20, baseFeasibility: 50 },
  { crop: "Sugarcane", baseDemand: 55, baseSupply: 92, basePrice: 3100, exportPotential: 50, climateRisk: 45, baseFeasibility: 40 },
  { crop: "Pulses", baseDemand: 78, baseSupply: 55, basePrice: 6800, exportPotential: 55, climateRisk: 35, baseFeasibility: 30 },
  { crop: "Oilseeds", baseDemand: 75, baseSupply: 50, basePrice: 6200, exportPotential: 70, climateRisk: 28, baseFeasibility: 20 }
];

// Price history for selected commodity
const MOCK_PRICE_HISTORY = {
  Wheat: [
    { month: "Jan", SpotPrice: 5000, FuturesPrice: 5150 },
    { month: "Feb", SpotPrice: 5100, FuturesPrice: 5200 },
    { month: "Mar", SpotPrice: 5250, FuturesPrice: 5300 },
    { month: "Apr", SpotPrice: 5350, FuturesPrice: 5450 },
    { month: "May", SpotPrice: 5200, FuturesPrice: 5320 },
    { month: "Jun", SpotPrice: 5280, FuturesPrice: 5400 }
  ],
  Rice: [
    { month: "Jan", SpotPrice: 4000, FuturesPrice: 4100 },
    { month: "Feb", SpotPrice: 4050, FuturesPrice: 4120 },
    { month: "Mar", SpotPrice: 4120, FuturesPrice: 4250 },
    { month: "Apr", SpotPrice: 4180, FuturesPrice: 4300 },
    { month: "May", SpotPrice: 4200, FuturesPrice: 4350 },
    { month: "Jun", SpotPrice: 4250, FuturesPrice: 4400 }
  ],
  Cotton: [
    { month: "Jan", SpotPrice: 6800, FuturesPrice: 7000 },
    { month: "Feb", SpotPrice: 6900, FuturesPrice: 7100 },
    { month: "Mar", SpotPrice: 7000, FuturesPrice: 7250 },
    { month: "Apr", SpotPrice: 7150, FuturesPrice: 7300 },
    { month: "May", SpotPrice: 7100, FuturesPrice: 7280 },
    { month: "Jun", SpotPrice: 7200, FuturesPrice: 7420 }
  ],
  Maize: [
    { month: "Jan", SpotPrice: 2000, FuturesPrice: 2100 },
    { month: "Feb", SpotPrice: 2050, FuturesPrice: 2150 },
    { month: "Mar", SpotPrice: 2100, FuturesPrice: 2200 },
    { month: "Apr", SpotPrice: 2150, FuturesPrice: 2250 },
    { month: "May", SpotPrice: 2200, FuturesPrice: 2300 },
    { month: "Jun", SpotPrice: 2250, FuturesPrice: 2380 }
  ],
  Mustard: [
    { month: "Jan", SpotPrice: 5300, FuturesPrice: 5500 },
    { month: "Feb", SpotPrice: 5420, FuturesPrice: 5600 },
    { month: "Mar", SpotPrice: 5500, FuturesPrice: 5750 },
    { month: "Apr", SpotPrice: 5550, FuturesPrice: 5800 },
    { month: "May", SpotPrice: 5600, FuturesPrice: 5900 },
    { month: "Jun", SpotPrice: 5700, FuturesPrice: 6020 }
  ],
  Sugarcane: [
    { month: "Jan", SpotPrice: 2950, FuturesPrice: 3000 },
    { month: "Feb", SpotPrice: 3000, FuturesPrice: 3050 },
    { month: "Mar", SpotPrice: 3050, FuturesPrice: 3100 },
    { month: "Apr", SpotPrice: 3100, FuturesPrice: 3150 },
    { month: "May", SpotPrice: 3120, FuturesPrice: 3180 },
    { month: "Jun", SpotPrice: 3150, FuturesPrice: 3220 }
  ],
  Pulses: [
    { month: "Jan", SpotPrice: 6400, FuturesPrice: 6600 },
    { month: "Feb", SpotPrice: 6500, FuturesPrice: 6700 },
    { month: "Mar", SpotPrice: 6620, FuturesPrice: 6850 },
    { month: "Apr", SpotPrice: 6700, FuturesPrice: 6900 },
    { month: "May", SpotPrice: 6800, FuturesPrice: 7050 },
    { month: "Jun", SpotPrice: 6900, FuturesPrice: 7120 }
  ],
  Oilseeds: [
    { month: "Jan", SpotPrice: 5800, FuturesPrice: 6000 },
    { month: "Feb", SpotPrice: 5900, FuturesPrice: 6150 },
    { month: "Mar", SpotPrice: 6050, FuturesPrice: 6200 },
    { month: "Apr", SpotPrice: 6100, FuturesPrice: 6300 },
    { month: "May", SpotPrice: 6200, FuturesPrice: 6450 },
    { month: "Jun", SpotPrice: 6320, FuturesPrice: 6585 }
  ]
};

export default function AgriOpportunityEngine() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");

  // Dynamic weight settings adjusted by corporate analyst
  const [weights, setWeights] = useState({
    demand: 0.25,
    margin: 0.25,
    export: 0.15,
    climateRisk: 0.15,
    feasibility: 0.20
  });

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.15;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  // Recalculate opportunity scores based on sliders & zone factors
  const calculatedOpportunities = useMemo(() => {
    const weightSum = weights.demand + weights.margin + weights.export + weights.climateRisk + weights.feasibility;
    const normalizedWeights = weightSum > 0 ? {
      demand: weights.demand / weightSum,
      margin: weights.margin / weightSum,
      export: weights.export / weightSum,
      climateRisk: weights.climateRisk / weightSum,
      feasibility: weights.feasibility / weightSum
    } : weights;

    return BASE_CROP_FACTORS.map((crop) => {
      // Calculate margins dynamically based on price tiering
      const marginFactor = Math.min(35, Math.round((crop.baseDemand / 3) + (crop.baseFeasibility / 6)));
      
      // Calculate dynamic risk based on climate base risk and zone modifiers
      const finalClimateRisk = Math.min(100, Math.round(crop.climateRisk * (2 - zoneMultiplier)));

      // Formula: Score out of 100 using normalized weights
      const score = Math.round(
        (crop.baseDemand * normalizedWeights.demand) +
        (marginFactor * 2.8 * normalizedWeights.margin) +
        (crop.exportPotential * normalizedWeights.export) +
        ((100 - finalClimateRisk) * normalizedWeights.climateRisk) +
        (crop.baseFeasibility * normalizedWeights.feasibility)
      );

      // Sourcing Recommendation logic
      let recommendation = "Hold Sourcing";
      if (score >= 85) recommendation = "Aggressive Buy";
      else if (score >= 75) recommendation = "Strategic Contract";
      else if (score >= 65) recommendation = "Limited Procurement";

      return {
        ...crop,
        margin: `${marginFactor}%`,
        climateRisk: finalClimateRisk,
        score,
        recommendation,
        marketPrice: Math.round(crop.basePrice * zoneMultiplier)
      };
    }).sort((a, b) => b.score - a.score);
  }, [weights, zoneMultiplier]);

  const activeOpportunityData = useMemo(() => {
    return calculatedOpportunities.find((o) => o.crop === selectedCommodity) || calculatedOpportunities[0];
  }, [calculatedOpportunities, selectedCommodity]);

  const kpiList = [
    <StatsCard
      key="1"
      title="Top Opportunity Sourcing"
      value={calculatedOpportunities[0]?.crop || "N/A"}
      trend={`Score: ${calculatedOpportunities[0]?.score}/100`}
      trendType="success"
      subtext="Maximum procurement priority"
    />,
    <StatsCard
      key="2"
      title="Projected Profit Margin"
      value={activeOpportunityData.margin}
      trend="HIGH VIABILITY"
      trendType="success"
      subtext={`Based on current ${selectedCommodity} prices`}
    />,
    <StatsCard
      key="3"
      title="Market Spot Index"
      value={`₹${activeOpportunityData.marketPrice.toLocaleString()} / MT`}
      trend="+4.8%"
      trendType="success"
      subtext="Weighted regional average"
    />,
    <StatsCard
      key="4"
      title="Sourcing Feasibility"
      value={`${activeOpportunityData.baseFeasibility}/100`}
      trend="STABLE GRID"
      trendType="success"
      subtext="FPO connection status"
    />
  ];

  const chartPriceData = MOCK_PRICE_HISTORY[selectedCommodity] || MOCK_PRICE_HISTORY.Wheat;

  const tableRowsForPdf = calculatedOpportunities.map((o) => [
    o.crop,
    o.score,
    `₹${o.marketPrice}/MT`,
    o.margin,
    o.recommendation
  ]);

  return (
    <AgribusinessLayout
      pageName="Commodity Opportunity Engine"
      kpiStrip={kpiList}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableRowsForPdf}
      pdfHeaders={["Commodity", "Opportunity Score", "Market Price", "Margin", "Directives"]}
    >
      <div className="space-y-6">
        
        {/* Row 1: Weight Tuner (1/3) & Sourcing Matrix (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weight Adjuster Box */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#31572c]" /> Score Weight Calibration
              </h3>
              <button 
                onClick={() => setWeights({ demand: 0.25, margin: 0.25, export: 0.15, climateRisk: 0.15, feasibility: 0.20 })}
                className="text-[9px] font-black text-[#31572c] uppercase hover:underline"
              >
                Reset weights
              </button>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Drag indicators to recalibrate the sourcing algorithms based on current corporate directives (Total weights sum to 1.0).
            </p>
            
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Demand Weight</span>
                  <span>{Math.round(weights.demand * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.demand}
                  onChange={(e) => setWeights({ ...weights, demand: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Margin Weight</span>
                  <span>{Math.round(weights.margin * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.margin}
                  onChange={(e) => setWeights({ ...weights, margin: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Export potential Weight</span>
                  <span>{Math.round(weights.export * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.export}
                  onChange={(e) => setWeights({ ...weights, export: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Climate Hedging Weight</span>
                  <span>{Math.round(weights.climateRisk * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.climateRisk}
                  onChange={(e) => setWeights({ ...weights, climateRisk: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                  <span>Logistics Feasibility Weight</span>
                  <span>{Math.round(weights.feasibility * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.feasibility}
                  onChange={(e) => setWeights({ ...weights, feasibility: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
                />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3 flex items-start gap-2 mt-4 text-[10px] text-emerald-800">
              <Calculator className="w-4 h-4 shrink-0 text-[#31572c]" />
              <div className="font-semibold">
                <strong>Simulated Priority:</strong> Sourcing priority for {calculatedOpportunities[0]?.crop} has climbed. Proceed with forward purchase contracts.
              </div>
            </div>

          </div>

          {/* Sourcing potential Matrix chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> Sourcing Opportunity Matrix
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Plots commodities based on Sourcing Feasibility (X-axis) vs Opportunity Score (Y-axis).
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="baseFeasibility" domain={[0, 100]} name="Feasibility" unit="/100" tick={{ fontSize: 10 }} label={{ value: 'Feasibility', position: 'bottom', offset: 0, fontSize: 10 }} />
                  <YAxis type="number" dataKey="score" domain={[0, 100]} name="Opportunity Score" unit="/100" tick={{ fontSize: 10 }} label={{ value: 'Opportunity', angle: -90, position: 'left', fontSize: 10 }} />
                  <ZAxis type="number" range={[100, 400]} />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Commodities" data={calculatedOpportunities} fill="#31572c">
                    <LabelList dataKey="crop" position="top" style={{ fontSize: 9, fontWeight: 'bold', fill: '#132a13' }} offset={10} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Row 2: Table Leaderboard (2/3) & Pricing Trend Analysis (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table Leaderboard */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#31572c]" /> Opportunity Scoreboard & Rankings
              </h3>
            </div>
            <GenericTable
              columns={[
                { header: "Rank", accessor: "rank", cell: (v, row) => <span className="font-black text-gray-800">#{(calculatedOpportunities.indexOf(row) + 1)}</span> },
                { header: "Commodity", accessor: "crop", cellClassName: "font-black text-gray-900" },
                { 
                  header: "Opportunity Score", 
                  accessor: "score", 
                  cell: (v) => (
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-150 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#31572c] h-full" style={{ width: `${v}%` }}></div>
                      </div>
                      <span className="font-bold">{v}/100</span>
                    </div>
                  )
                },
                { header: "Market Price", accessor: "marketPrice", cell: (v) => `₹${v.toLocaleString()}/MT` },
                { header: "Projected Margin", accessor: "margin", cellClassName: "text-emerald-700 font-bold" },
                { 
                  header: "Strategic Directives", 
                  accessor: "recommendation", 
                  cell: (v) => {
                    const badgeClass = v === "Aggressive Buy" 
                      ? "bg-red-50 text-red-800 border-red-200" 
                      : v === "Strategic Contract" 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : "bg-gray-50 text-gray-650 border-gray-200";
                    return <span className={`px-2.5 py-0.5 border rounded-lg font-bold text-[9px] uppercase tracking-wider ${badgeClass}`}>{v}</span>;
                  }
                }
              ]}
              data={calculatedOpportunities}
              showSearch={false}
              itemsPerPage={8}
            />
          </div>

          {/* Pricing Trend Analysis */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#31572c]" /> {selectedCommodity} Spot vs Futures Market
              </h3>
              <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-black tracking-wider uppercase">
                Zone: {selectedZone}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Price trend line showing spot market transactions vs future pricing trends to identify hedging gaps.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartPriceData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                  <RechartsTooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" name="Spot Price" dataKey="SpotPrice" stroke="#31572c" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" name="Futures Price" dataKey="FuturesPrice" stroke="#e07a5f" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
