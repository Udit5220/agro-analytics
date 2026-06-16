// PolicySimulationLab.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import { Cpu, DollarSign, Sprout, Droplet, UserCheck, ShieldAlert, BarChart3, HelpCircle, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
  Legend
} from "recharts";
import { COLORS } from "./utils/constants";

export default function PolicySimulationLab() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  // Macro-level policy inputs
  const [subsidy, setSubsidy] = useState(40);
  const [waterIncentives, setWaterIncentives] = useState(30);
  const [insurance, setInsurance] = useState(60);
  const [inputSupport, setInputSupport] = useState(50);
  const [cropDiversification, setCropDiversification] = useState(20);

  // Simulate Yields, Footprints and Budgets based on input sliders
  const simOutputs = useMemo(() => {
    // Dynamic multiplier depending on selected state
    let stateMultiplier = 1.0;
    if (selectedState === "Punjab" || selectedState === "Haryana") stateMultiplier = 1.15;
    if (selectedState === "Rajasthan") stateMultiplier = 0.8;

    const productionDev = parseFloat((stateMultiplier * (inputSupport * 0.35 + subsidy * 0.15 - cropDiversification * 0.08)).toFixed(1));
    const foodSecurityDev = parseFloat((stateMultiplier * (productionDev * 0.75 + cropDiversification * 0.2)).toFixed(1));
    const waterUsageDev = parseFloat((stateMultiplier * (waterIncentives * -0.35 - cropDiversification * 0.4 + inputSupport * 0.15)).toFixed(1));
    const incomeDev = parseFloat((stateMultiplier * (subsidy * 0.4 + insurance * 0.2 + inputSupport * 0.2)).toFixed(1));
    
    // Budget Cost (₹ Cr)
    const budgetCost = Math.round(stateMultiplier * (subsidy * 280 + waterIncentives * 120 + insurance * 160 + inputSupport * 190 + cropDiversification * 70));
    
    // Carbon Impact (%)
    const carbonImpact = parseFloat((stateMultiplier * (inputSupport * 0.4 - cropDiversification * 0.5 - waterIncentives * 0.1)).toFixed(1));
    
    // Climate Resilience Score (100)
    const resilienceScore = Math.round(Math.min(100, (30 + waterIncentives * 0.3 + insurance * 0.25 + cropDiversification * 0.25) * stateMultiplier));

    return {
      productionDev,
      foodSecurityDev,
      waterUsageDev,
      incomeDev,
      budgetCost,
      carbonImpact,
      resilienceScore
    };
  }, [subsidy, waterIncentives, insurance, inputSupport, cropDiversification, selectedState]);

  const aiSectionConfig = {
    title: "AI Policy Simulation Advisor",
    buttonLabel: "Query Policy Simulation Audit",
    prompt: `We simulated a policy configuration: Subsidy=${subsidy}%, Water Incentives=${waterIncentives}%, Insurance=${insurance}%, Input Support=${inputSupport}%, Crop Diversification=${cropDiversification}%. Model yields are projecting a ${simOutputs.productionDev}% production change, ${simOutputs.waterUsageDev}% water change, and a Budget Cost of ₹${simOutputs.budgetCost} Cr. Please draft expected agricultural impacts, carbon profiles, and long-term recommendations.`,
  };

  const chartData = [
    { name: "Production Change", Value: simOutputs.productionDev, fill: "#31572c" },
    { name: "Food Security", Value: simOutputs.foodSecurityDev, fill: "#4f772d" },
    { name: "Water Consumption", Value: simOutputs.waterUsageDev, fill: "#3b82f6" },
    { name: "Farmer Income Change", Value: simOutputs.incomeDev, fill: "#132a13" },
    { name: "Carbon Impact", Value: simOutputs.carbonImpact, fill: "#ef4444" }
  ];

  return (
    <GovernmentLayout
      pageName="Policy Simulation Lab"
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
    >
      <div className="space-y-6">
        
        {/* Lab Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Slider Controls */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-black flex items-center gap-2 text-[#31572c]">
                <Cpu className="w-5 h-5" /> Policy Inputs Configuration
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                Configure macro-level subsidies to model national index variations
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Subsidy Level:</span>
                  <span className="text-[#31572c] font-mono">{subsidy}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={subsidy}
                  onChange={(e) => setSubsidy(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Water Incentives:</span>
                  <span className="text-[#31572c] font-mono">{waterIncentives}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={waterIncentives}
                  onChange={(e) => setWaterIncentives(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Insurance (PMFBY):</span>
                  <span className="text-[#31572c] font-mono">{insurance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={insurance}
                  onChange={(e) => setInsurance(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Input Support (Seeds/Fertilizer):</span>
                  <span className="text-[#31572c] font-mono">{inputSupport}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputSupport}
                  onChange={(e) => setInputSupport(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-700">
                  <span>Crop Diversification Level:</span>
                  <span className="text-[#31572c] font-mono">{cropDiversification}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cropDiversification}
                  onChange={(e) => setCropDiversification(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Simulation Output Dashboard */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-[#31572c]" /> Projected Policy Outcomes (%)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: "Deviation %", angle: -90, position: "insideLeft", fontSize: 10 }} />
                  <RechartsTooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="Value" radius={[3, 3, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Comprehensive Outputs Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <StatsCard
                title="Budget Cost Impact"
                value={`₹${simOutputs.budgetCost.toLocaleString()} Cr`}
                subtext="Projected fiscal outlay"
                icon={<DollarSign className="w-12 h-12" />}
              />
              <StatsCard
                title="Water Consumption"
                value={simOutputs.waterUsageDev > 0 ? `+${simOutputs.waterUsageDev}%` : `${simOutputs.waterUsageDev}%`}
                trend={simOutputs.waterUsageDev <= 0 ? "OPTIMAL" : "STRESS"}
                trendType={simOutputs.waterUsageDev <= 0 ? "success" : "danger"}
                subtext="Aquifer drawdown deviation"
                icon={<Droplet className="w-12 h-12" />}
              />
              <StatsCard
                title="Carbon Emissions"
                value={simOutputs.carbonImpact > 0 ? `+${simOutputs.carbonImpact}%` : `${simOutputs.carbonImpact}%`}
                trend={simOutputs.carbonImpact <= 0 ? "SAVINGS" : "IMPACT"}
                trendType={simOutputs.carbonImpact <= 0 ? "success" : "danger"}
                subtext="Soil emission equivalents"
                icon={<Activity className="w-12 h-12" />}
              />
              <StatsCard
                title="Climate Resilience"
                value={`${simOutputs.resilienceScore}/100`}
                trend={simOutputs.resilienceScore >= 70 ? "HIGH" : "MEDIUM"}
                trendType="success"
                subtext="Composite buffer index"
                icon={<ShieldAlert className="w-12 h-12" />}
              />
            </div>
          </div>

        </div>

      </div>
    </GovernmentLayout>
  );
}
