import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Coins, TrendingUp, Sparkles, Sprout, Wheat, BarChart3, HelpCircle } from 'lucide-react';

const CROP_PROFILES = [
  { id: 'rice', name: 'Rice (Paddy)', hindi: 'धान', baseYield: 22, pricePerQtl: 2200, icon: 'Wheat' },
  { id: 'wheat', name: 'Wheat', hindi: 'गेहूं', baseYield: 19, pricePerQtl: 2275, icon: 'Wheat' },
  { id: 'cotton', name: 'Cotton', hindi: 'कपास', baseYield: 8.5, pricePerQtl: 7000, icon: 'Sprout' },
  { id: 'maize', name: 'Maize (Corn)', hindi: 'मक्का', baseYield: 21, pricePerQtl: 2090, icon: 'Wheat' }
];

const SEED_GRADES = [
  { label: 'Basic', multiplier: 1.0, costPerAcre: 800, desc: 'Local standard seeds' },
  { label: 'Standard', multiplier: 1.15, costPerAcre: 1500, desc: 'Certified high germination' },
  { label: 'Premium', multiplier: 1.35, costPerAcre: 2400, desc: 'Hybrids with disease protection' }
];

export default function YieldRoiPredictor() {
  const [selectedCrop, setSelectedCrop] = useState(CROP_PROFILES[0]);
  const [acreage, setAcreage] = useState(5);
  const [seedGrade, setSeedGrade] = useState(SEED_GRADES[1]); // Standard
  const [fertilizerBudget, setFertilizerBudget] = useState(3500); // ₹ per acre

  // Simulation outputs
  const [outputs, setOutputs] = useState({
    totalYield: 0,
    totalCost: 0,
    grossRevenue: 0,
    netProfit: 0,
    efficiencyIndex: 0
  });

  useEffect(() => {
    // 1. Calculate fertilizer impact multiplier (optimum around ₹4,000/acre)
    let fertMultiplier = 1.0;
    if (fertilizerBudget < 3000) {
      fertMultiplier = 0.75 + (fertilizerBudget / 12000); // 0.83x to 1.0x
    } else if (fertilizerBudget >= 3000 && fertilizerBudget <= 5000) {
      fertMultiplier = 1.0 + ((fertilizerBudget - 3000) / 20000); // 1.0x to 1.1x
    } else {
      fertMultiplier = 1.1 + ((fertilizerBudget - 5000) / 50000); // Caps slightly at 1.15x (diminishing returns)
      if (fertMultiplier > 1.2) fertMultiplier = 1.2;
    }

    // 2. Base operations cost (tilling, irrigation, harvest labor): ₹4,000 / acre
    const baseOpsCostPerAcre = 4000;
    const totalCostPerAcre = seedGrade.costPerAcre + fertilizerBudget + baseOpsCostPerAcre;
    const totalCost = totalCostPerAcre * acreage;

    // 3. Yield calculation
    const totalYield = selectedCrop.baseYield * seedGrade.multiplier * fertMultiplier * acreage;

    // 4. Financial projections
    const grossRevenue = totalYield * selectedCrop.pricePerQtl;
    const netProfit = grossRevenue - totalCost;

    // 5. Efficiency Index (ROI percentage)
    const efficiencyIndex = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    setOutputs({
      totalYield: Math.round(totalYield * 10) / 10,
      totalCost: Math.round(totalCost),
      grossRevenue: Math.round(grossRevenue),
      netProfit: Math.round(netProfit),
      efficiencyIndex: Math.round(efficiencyIndex)
    });

  }, [selectedCrop, acreage, seedGrade, fertilizerBudget]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
          <CircleDollarSign className="h-6.5 w-6.5 text-[#31572c]" />
          <span>Yield & ROI Predictor</span>
        </h1>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1">
          Simulate crops, acreage, and agronomic seed grades to forecast expected yields and financial ROI.
        </p>
      </div>

      {/* 2-Column Responsive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">

        {/* ═══════════════════════════════════════════ */}
        {/* LEFT COLUMN: Input Matrix Form            */}
        {/* ═══════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-5">
          
          <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-2.5 border-b border-gray-100">
            <Coins className="h-4 w-4 text-[#4f772d]" />
            <span>Simulation Parameters</span>
          </h2>

          <div className="space-y-4">
            
            {/* Crop Profile Selection Cards */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Select Crop Profile
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CROP_PROFILES.map((crop) => (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => setSelectedCrop(crop)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 ${
                      selectedCrop.id === crop.id
                        ? 'bg-[#31572c]/10 border-[#31572c] text-[#132a13] font-bold shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#90a955] hover:text-[#31572c]'
                    }`}
                  >
                    <span className="text-xs block leading-tight font-extrabold">{crop.name}</span>
                    <span className="text-[9px] text-gray-400 font-bold tracking-wide mt-0.5 block">{crop.hindi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Land Area Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Cultivation Land Size
                </label>
                <span className="text-[#31572c] font-bold text-xs">{acreage} ACRES</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #31572c ${((acreage - 0.5) / 49.5) * 100}%, #f3f4f6 ${((acreage - 0.5) / 49.5) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
                <span>0.5 ac</span>
                <span>50 ac</span>
              </div>
            </div>

            {/* Seed Quality Grade Selector */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                Seed Quality Standard
              </label>
              <div className="space-y-2">
                {SEED_GRADES.map((grade) => (
                  <button
                    key={grade.label}
                    type="button"
                    onClick={() => setSeedGrade(grade)}
                    className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all duration-200 ${
                      seedGrade.label === grade.label
                        ? 'bg-[#31572c] border-[#31572c] text-white shadow-sm font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#90a955] hover:text-[#31572c]'
                    }`}
                  >
                    <div>
                      <span className="text-xs block leading-tight font-extrabold">{grade.label}</span>
                      <span className={`text-[9px] mt-0.5 block ${seedGrade.label === grade.label ? 'text-gray-100' : 'text-gray-400'}`}>
                        {grade.desc}
                      </span>
                    </div>
                    <span className="text-xs font-black shrink-0">
                      ₹{grade.costPerAcre}/ac
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fertilizer Budget Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Fertilizer & NPK Budget
                </label>
                <span className="text-[#31572c] font-bold text-xs">{formatCurrency(fertilizerBudget)}/acre</span>
              </div>
              <input
                type="range"
                min="1000"
                max="8000"
                step="250"
                value={fertilizerBudget}
                onChange={(e) => setFertilizerBudget(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-100 accent-[#31572c]"
                style={{
                  background: `linear-gradient(to right, #4f772d ${((fertilizerBudget - 1000) / 7000) * 100}%, #f3f4f6 ${((fertilizerBudget - 1000) / 7000) * 100}%)`
                }}
              />
              <div className="flex justify-between text-[9px] text-gray-400 mt-1 font-medium">
                <span>₹1,000/ac</span>
                <span>₹8,000/ac</span>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* RIGHT COLUMN: Output Dashboard Matrix       */}
        {/* ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          
          {/* Top Row: Profitability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Projected Net Profit Card */}
            <div className="bg-[#4f772d]/[0.08] border border-[#4f772d]/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Projected Net Profit</span>
                  <h3 className="text-2xl font-black text-emerald-700 leading-tight">
                    {formatCurrency(outputs.netProfit)}
                  </h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Estimated after all operations
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-700 rounded-xl">
                  <TrendingUp className="h-5 w-5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Total Yield Forecast */}
            <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Yield Estimation</span>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">
                    {outputs.totalYield} <span className="text-xs font-semibold text-gray-400">Quintals</span>
                  </h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                    Base yield: {selectedCrop.baseYield} qtl/acre
                  </p>
                </div>
                <div className="p-2.5 bg-[#4f772d]/10 text-[#31572c] rounded-xl">
                  <Wheat className="h-5 w-5" />
                </div>
              </div>
            </div>

          </div>

          {/* Middle Row: Live Cost & Revenue Breakdown */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-[#4f772d]" />
              <span>Rotational ROI Ledger Summary</span>
            </h3>

            <div className="space-y-3.5 pt-2">
              
              {/* Gross Revenues row */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
                <span className="text-gray-500 font-semibold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#90a955]" />
                  Projected Gross Revenues
                </span>
                <span className="text-gray-800 font-extrabold text-sm">
                  {formatCurrency(outputs.grossRevenue)}
                </span>
              </div>

              {/* Total Input Costs row */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-50">
                <span className="text-gray-500 font-semibold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Total Input Costs (Seed + NPK + Operations)
                </span>
                <span className="text-gray-800 font-extrabold text-sm text-red-600">
                  {formatCurrency(outputs.totalCost)}
                </span>
              </div>

              {/* Detail list itemizing costs */}
              <div className="bg-[#f4f7f4]/40 rounded-xl p-3 grid grid-cols-3 gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center">
                <div>
                  <p className="text-gray-400">Seed Costs</p>
                  <p className="text-gray-800 mt-0.5">{formatCurrency(seedGrade.costPerAcre * acreage)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fertilizers</p>
                  <p className="text-gray-800 mt-0.5">{formatCurrency(fertilizerBudget * acreage)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Operations</p>
                  <p className="text-gray-800 mt-0.5">{formatCurrency(4000 * acreage)}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Row: ROI Efficiency Ring */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#90a955]" />
                <span>ROI Efficiency Index</span>
              </h4>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed max-w-sm">
                Shows the returns yielded for every rupee invested. An index above 100% signifies doubling seed investment value.
              </p>
            </div>

            {/* Visual Indicator Progress Badge */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Efficiency Ratio</p>
                <p className="text-lg font-black text-[#132a13] leading-none mt-0.5">{outputs.efficiencyIndex}%</p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 flex items-center justify-center font-bold text-[10px] text-emerald-700 animate-spin-slow shrink-0" style={{ animationDuration: '6s' }}>
                ROI
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
