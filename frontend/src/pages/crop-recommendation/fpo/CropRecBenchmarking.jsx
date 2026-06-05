// CropRecBenchmarking.jsx
import React, { useState, useMemo } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import {
  Trophy,
  Award,
  TrendingUp,
  Leaf,
  Compass,
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  IndianRupee,
  Activity,
  Briefcase,
  DollarSign,
  TrendingDown,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Helper to format currency
const formatINR = (value) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString()}`;
  }
};

// Crop Margin Data
const CROP_MARGIN_DATA = [
  { crop: "Soybean", cost: 26000, price: 43500, yield: 2.2, revenue: 95700, profit: 69700, margin: 72.8 },
  { crop: "Mustard", cost: 22000, price: 55200, yield: 1.8, revenue: 99360, profit: 77360, margin: 77.8 },
  { crop: "Maize", cost: 18000, price: 21500, yield: 4.5, revenue: 96750, profit: 78750, margin: 81.3 },
  { crop: "Wheat", cost: 24000, price: 23200, yield: 3.8, revenue: 88160, profit: 64160, margin: 72.7 },
  { crop: "Chickpea", cost: 21000, price: 53000, yield: 1.5, revenue: 79500, profit: 58500, margin: 73.5 },
];

const HISTORICAL_INCOME_TREND = [
  { year: "2022", avgIncome: 48500, fpoRev: 14500000, margin: 14.5 },
  { year: "2023", avgIncome: 52100, fpoRev: 16800000, margin: 15.2 },
  { year: "2024", avgIncome: 58400, fpoRev: 19400000, margin: 16.8 },
  { year: "2025", avgIncome: 68400, fpoRev: 22400000, margin: 18.5 },
];

export default function CropRecBenchmarking() {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState("");

  // Simulator state
  const [priceAdjustment, setPriceAdjustment] = useState(0); // in percent (-20% to +30%)
  const [adoptionTarget, setAdoptionTarget] = useState(58); // in percent (20% to 100%)
  const [cropMixShift, setCropMixShift] = useState(10); // shift to high profit crops (0% to 50%)

  const triggerToast = (msg) => {
    // Basic trigger stub for compatibility if needed
  };

  const simulationResults = useMemo(() => {
    const baseAvgIncome = 68400;
    const baseFpoRev = 22400000;
    const baseMargin = 18.5;

    // Calculations
    const priceMult = 1 + priceAdjustment / 100;
    
    // Adoption yields 0.35% income boost for every 1% above base 58%
    const adoptionBonus = 1 + ((adoptionTarget - 58) * 0.35) / 100;
    
    // Crop mix shift towards high margin crops yields 0.55% boost per 1% shift above base 10%
    const cropMixBonus = 1 + ((cropMixShift - 10) * 0.55) / 100;

    const simulatedIncome = Math.round(baseAvgIncome * priceMult * adoptionBonus * cropMixBonus);
    
    // FPO Revenue: adoption adds 0.5% boost, crop mix adds 0.7% boost
    const simulatedFpoRev = Math.round(
      baseFpoRev * priceMult * (1 + ((adoptionTarget - 58) * 0.5) / 100) * (1 + ((cropMixShift - 10) * 0.7) / 100)
    );

    const simulatedMargin = parseFloat((baseMargin + (adoptionTarget - 58) * 0.05 + (cropMixShift - 10) * 0.08).toFixed(1));

    return {
      avgIncome: simulatedIncome,
      fpoRev: simulatedFpoRev,
      margin: simulatedMargin,
      incomeGrowth: (((simulatedIncome - baseAvgIncome) / baseAvgIncome) * 100).toFixed(1),
      revGrowth: (((simulatedFpoRev - baseFpoRev) / baseFpoRev) * 100).toFixed(1),
    };
  }, [priceAdjustment, adoptionTarget, cropMixShift]);

  const queryAiInsights = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiReport(`### **AI BUSINESS OUTCOME ADVISORY**

1. **Margin Maximization strategy**: Mustard (77.8% profit margin) and Soybean (72.8%) represent the highest returns per hectare in our cluster. By shifting 15% more acreage to oilseeds (Mustard/Soybean) and raising adoption target to 75%, average farmer net income will increase to **₹77,500** (+13.3% growth).

2. **Offtake & Contract Linkage Leverage**: Private buyer premiums (ITC, Adani) yield ₹1,200/MT above spot prices. Shifting 30% of sales volume into contract channels guarantees margins against spot market dips.

3. **Storage Credit Facility**: Advise farmers to hold Mustard for 45 days post-harvest. The cold-chain storage fee (₹150/bag) is offset by the projected +18% price premium in August.

4. **Strategic Directives**:
   - Provide cooperative advances to farmers to prevent early post-harvest panic selling.
   - Negotiate bulk seed purchases for Soybean LS-21 to reduce costs by 15%, increasing farmer profit margin by 3.2%.`);
      setAiLoading(false);
    }, 1500);
  };

  const marginColumns = [
    { header: "Crop Type", accessor: "crop", className: "font-bold text-gray-900" },
    { header: "Production Cost (₹/Ha)", accessor: "cost", cell: (val) => `₹${val.toLocaleString()}` },
    { header: "Avg Sowing Price (₹/MT)", accessor: "price", cell: (val) => `₹${val.toLocaleString()}` },
    { header: "Yield (MT/Ha)", accessor: "yield", cell: (val) => `${val} MT/Ha` },
    { header: "Gross Revenue (₹/Ha)", accessor: "revenue", cell: (val) => `₹${val.toLocaleString()}`, className: "font-semibold" },
    { header: "Net Profit (₹/Ha)", accessor: "profit", cell: (val) => `₹${val.toLocaleString()}`, className: "font-bold text-emerald-800" },
    {
      header: "Profit Margin (%)",
      accessor: "margin",
      cell: (val) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
          {val}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#31572c]" />
          <span>Farmer Income & Agribusiness Performance</span>
          <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
            | AGRIBUSINESS OPERATIONS
          </span>
        </h1>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Monitor average farmer margins · Interactive income projections · Crop cost & profit ledger
        </p>
      </div>

      {/* SECTION 1 - EXECUTIVE PERFORMANCE KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          title="Avg Farmer Income"
          value="₹68,400"
          subtext="Net annual average"
          icon={<IndianRupee className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Income Growth Rate"
          value="+14.2%"
          subtext="Year-on-year increase"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Total FPO Revenue"
          value="₹2.24 Cr"
          subtext="Aggregated output value"
          icon={<Briefcase className="w-5 h-5 text-[#31572c]" />}
        />
        <StatsCard
          title="Agribusiness Margin"
          value="18.5%"
          subtext="Cooperative net margin"
          icon={<Activity className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Average ROI"
          value="2.1x"
          subtext="Cost recovery index"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* SECTION 2 - CROP MARGIN LEDGER */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-5 h-5 text-[#31572c]" />
            Crop-wise Cost & Profit Margin Analysis
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
            Detailed ledger of input costs, yields, gross revenue, and profit percentages per hectare
          </p>
        </div>

        <GenericTable
          columns={marginColumns}
          data={CROP_MARGIN_DATA}
          itemsPerPage={5}
          showSearch={false}
          emptyMessage="No crop margin statistics found"
        />
      </div>

      {/* SECTION 3 - STATEFUL FARMER INCOME SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulator controls */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-5 h-5 text-[#31572c]" />
              Farmer Income Simulator
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 mb-4">
              Simulate net farmer earnings & FPO revenues based on price, adoption, and crop shifts
            </p>

            <div className="space-y-4">
              {/* Slider 1: Price */}
              <div className="bg-gray-50 border rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-700">Market Price Adjustment</span>
                  <span className={`text-xs font-black ${priceAdjustment >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {priceAdjustment >= 0 ? `+${priceAdjustment}%` : `${priceAdjustment}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="30"
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 rounded-lg"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-bold mt-1">
                  <span>-20% (Spot Lows)</span>
                  <span>0% (MSP/Base)</span>
                  <span>+30% (Market Peak)</span>
                </div>
              </div>

              {/* Slider 2: Adoption */}
              <div className="bg-gray-50 border rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-700">FPO Adoption Target</span>
                  <span className="text-xs font-black text-[#31572c] font-mono">
                    {adoptionTarget}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={adoptionTarget}
                  onChange={(e) => setAdoptionTarget(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 rounded-lg"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-bold mt-1">
                  <span>20% (Minimum)</span>
                  <span>58% (Current)</span>
                  <span>100% (Maximum)</span>
                </div>
              </div>

              {/* Slider 3: Crop Mix Shift */}
              <div className="bg-gray-50 border rounded-xl p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-700">Shift to High-Profit Crops</span>
                  <span className="text-xs font-black text-[#31572c] font-mono">
                    {cropMixShift}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cropMixShift}
                  onChange={(e) => setCropMixShift(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 rounded-lg"
                />
                <div className="flex justify-between text-[8px] text-gray-400 font-bold mt-1">
                  <span>0% (Status Quo)</span>
                  <span>10% (Baseline)</span>
                  <span>50% (Agribusiness Max)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t text-[10px] text-gray-500 font-bold">
            💡 Sliders recalculate values based on regional crop budgets
          </div>
        </div>

        {/* Simulator Outputs */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4">
              Simulated Financial Projections
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Farmer Income card */}
              <div className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/50">
                <span className="text-[10px] text-emerald-800 font-black block uppercase tracking-wider">Simulated Farmer Income</span>
                <span className="text-2xl font-black text-emerald-950 mt-1 block">
                  ₹{simulationResults.avgIncome.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                  {parseFloat(simulationResults.incomeGrowth) >= 0 ? `+${simulationResults.incomeGrowth}%` : `${simulationResults.incomeGrowth}%`} vs base
                </span>
              </div>

              {/* FPO revenue card */}
              <div className="border border-blue-100 rounded-xl p-4 bg-blue-50/50">
                <span className="text-[10px] text-blue-800 font-black block uppercase tracking-wider">Simulated FPO Revenue</span>
                <span className="text-2xl font-black text-blue-950 mt-1 block">
                  {formatINR(simulationResults.fpoRev)}
                </span>
                <span className="text-[10px] text-blue-700 font-bold block mt-1">
                  {parseFloat(simulationResults.revGrowth) >= 0 ? `+${simulationResults.revGrowth}%` : `${simulationResults.revGrowth}%`} vs base
                </span>
              </div>
            </div>

            {/* Simulated Margin Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Simulated FPO Net Margin:</span>
                <span className="text-[#31572c] font-black">{simulationResults.margin}%</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(simulationResults.margin / 30) * 100}%` }}></div>
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Scale: 0% to 30% Net Margin</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t text-[10px] text-gray-400 font-bold uppercase flex justify-between">
            <span>Model: Agribusiness v2.4</span>
            <span className="text-emerald-700">ACTIVE OUTCOMES RUNNING</span>
          </div>
        </div>
      </div>

      {/* SECTION 4 - HISTORICAL REVENUE COMPARISONS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Agribusiness Historical Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50/50 p-4 border rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Average Farmer Net Income Progression (₹)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HISTORICAL_INCOME_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <RechartsTooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="avgIncome" fill="#31572c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50/50 p-4 border rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Cooperative FPO Revenue Growth (₹)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={HISTORICAL_INCOME_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <RechartsTooltip formatter={(v) => formatINR(v)} />
                  <Line type="monotone" dataKey="fpoRev" name="FPO Revenue" stroke="#31572c" strokeWidth={2.5} dot={true} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 - AI BUSINESS ADVISOR */}
      <div className="bg-[#4f772d]/5 border border-[#31572c]/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#31572c] to-[#4f772d] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">
              AI Business Performance Advisor
            </h2>
          </div>
          <button
            onClick={queryAiInsights}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition disabled:opacity-50 text-xs font-black"
          >
            {aiLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            <span>Generate Business Plan</span>
          </button>
        </div>

        {aiLoading && (
          <div className="p-12 text-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#31572c] mb-2" />
            <p className="text-xs font-bold text-gray-800">
              Consulting AI Agribusiness Consultant...
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Analyzing cost-per-hectare records, price anomalies, and crop budget allocations
            </p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="p-6 bg-white space-y-4">
            {aiReport
              .split("\n\n")
              .filter(Boolean)
              .map((para, idx) => {
                const cleaned = para.replace(/[#*]/g, "").trim();
                const isHeading =
                  para.startsWith("#") ||
                  (para.startsWith("**") && para.endsWith("**"));

                if (isHeading) {
                  return (
                    <h4
                      key={idx}
                      className="text-xs font-black text-[#31572c] uppercase tracking-wider mt-4 first:mt-0"
                    >
                      {cleaned}
                    </h4>
                  );
                }

                let borderColor = "border-l-emerald-600";
                if (cleaned.startsWith("1")) borderColor = "border-l-yellow-600";
                else if (cleaned.startsWith("2")) borderColor = "border-l-orange-500";
                else if (cleaned.startsWith("3")) borderColor = "border-l-emerald-600";
                else if (cleaned.startsWith("4")) borderColor = "border-l-indigo-500";

                return (
                  <div
                    key={idx}
                    className={`pl-3.5 border-l-4 ${borderColor} py-1.5 text-xs font-semibold leading-relaxed text-gray-700`}
                  >
                    {cleaned}
                  </div>
                );
              })}
          </div>
        )}

        {!aiReport && !aiLoading && (
          <div className="p-12 text-center text-gray-500 bg-white">
            <Sparkles className="w-6 h-6 text-[#31572c] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-gray-600">
              Click "Generate Business Plan" to run AI agribusiness analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
