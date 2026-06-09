import React, { useState } from "react";
import {
  BrainCircuit,
  Sliders,
  Target,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  PlayCircle,
  Save,
  CheckCircle2,
  BarChart4
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Legend
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";

const GovPolicyCommand = () => {
  const [budgetAllocation, setBudgetAllocation] = useState(500);
  const [targetDemographic, setTargetDemographic] = useState("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);

  const policyIntelligenceStats = [
    {
      title: "POLICY EFFECTIVENESS SCORE",
      value: "82/100",
      trend: "+4 pts YoY",
      trendType: "success",
      subtext: "AI composite score",
      icon: <BrainCircuit className="text-[#132a13]" />
    },
    {
      title: "RECOMMENDED ADJUSTMENTS",
      value: "3",
      trend: "High priority",
      trendType: "neutral",
      subtext: "Pending executive review",
      icon: <Lightbulb className="text-amber-500" />
    },
    {
      title: "PROJECTED ROI (FY26)",
      value: "2.4x",
      trend: "+0.2x from FY25",
      trendType: "success",
      subtext: "Economic return on grants",
      icon: <TrendingUp className="text-[#31572c]" />
    },
    {
      title: "AT-RISK METRICS",
      value: "12%",
      trend: "-2% from last quarter",
      trendType: "success",
      subtext: "Key performance indicators",
      icon: <Target className="text-[#4f772d]" />
    }
  ];

  const historicalImpactData = [
    { year: "2022", allocation: 350, impact: 280, baseline: 250 },
    { year: "2023", allocation: 400, impact: 350, baseline: 280 },
    { year: "2024", allocation: 480, impact: 420, baseline: 310 },
    { year: "2025", allocation: 550, impact: 510, baseline: 340 },
    { year: "2026 (Proj)", allocation: budgetAllocation, impact: Math.floor(budgetAllocation * 0.95), baseline: 370 },
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResults({
        projectedReach: Math.floor(budgetAllocation * 1200),
        estimatedRoi: (budgetAllocation / 200).toFixed(1),
        riskFactor: budgetAllocation > 800 ? "High" : budgetAllocation > 500 ? "Medium" : "Low",
        timelineToImpact: "18-24 Months"
      });
    }, 1500);
  };

  const aiInsights = [
    {
      type: "opportunity",
      title: "Reallocate Unused PMFME Funds",
      desc: "Reallocating ₹45 Cr from unused PMFME urban zones to rural infrastructure could increase overall farmer reach by 18%.",
      impact: "High"
    },
    {
      type: "risk",
      title: "Solar Pump Subsidy Bottleneck",
      desc: "Current approval workflow for PM Kusum is causing a 4-month delay. Streamlining documentation could unlock 12,000 pending applications.",
      impact: "Critical"
    },
    {
      type: "success",
      title: "Warehouse Grant Optimization",
      desc: "AIF warehouse grants in Karnal district achieved a 3.2x ROI. Recommend replicating this model in Hisar and Rohtak.",
      impact: "Medium"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-[#4f772d]" />
          Policy Intelligence & Simulation Command
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          AI-driven predictive modeling and strategic recommendations for agricultural policy formulation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {policyIntelligenceStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulation Engine */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
            <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
              <Sliders size={16} />
              Policy Parameter Sandbox
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Budget Allocation Simulation (₹ Crores)
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={budgetAllocation}
                    onChange={(e) => setBudgetAllocation(Number(e.target.value))}
                    className="flex-1 accent-[#4f772d]"
                  />
                  <span className="font-bold text-[#132a13] w-12">₹{budgetAllocation}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Target Demographic Focus
                </label>
                <select 
                  value={targetDemographic}
                  onChange={(e) => setTargetDemographic(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#4f772d]"
                >
                  <option value="all">Universal (All Farmers)</option>
                  <option value="small_marginal">Small & Marginal Farmers</option>
                  <option value="fpo">FPOs & Cooperatives</option>
                  <option value="women">Women Agri-Entrepreneurs</option>
                </select>
              </div>

              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className={`w-full py-2.5 rounded-xl text-sm font-bold text-white flex justify-center items-center gap-2 transition ${
                  isSimulating ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#132a13] hover:bg-[#31572c]'
                }`}
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running Simulation...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <PlayCircle size={16} />
                    Run AI Simulation
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Results */}
          {simulationResults && (
            <div className="bg-[#f8faf8] p-5 rounded-2xl border border-[#4f772d]/20 shadow-sm animate-scaleUp">
              <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
                <BarChart4 size={16} />
                Projected Outcomes
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-xs text-gray-600">Projected Reach</span>
                  <span className="font-bold text-[#132a13]">{simulationResults.projectedReach.toLocaleString()} Farmers</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-xs text-gray-600">Estimated Economic ROI</span>
                  <span className="font-bold text-green-600">{simulationResults.estimatedRoi}x</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-xs text-gray-600">Implementation Risk</span>
                  <span className={`font-bold ${
                    simulationResults.riskFactor === 'High' ? 'text-red-600' :
                    simulationResults.riskFactor === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {simulationResults.riskFactor}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Timeline to Impact</span>
                  <span className="font-bold text-[#132a13]">{simulationResults.timelineToImpact}</span>
                </div>
                <button className="w-full mt-2 py-2 border border-[#4f772d] text-[#4f772d] rounded-xl text-xs font-bold hover:bg-[#4f772d] hover:text-white transition flex justify-center items-center gap-2">
                  <Save size={14} />
                  Save as Policy Draft
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Recommendations & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
            <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-500" />
              AI Strategic Recommendations
            </h3>
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className={`p-4 rounded-xl border-l-4 ${
                  insight.type === 'opportunity' ? 'border-l-blue-500 bg-blue-50' :
                  insight.type === 'risk' ? 'border-l-red-500 bg-red-50' :
                  'border-l-green-500 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                      {insight.type === 'opportunity' && <TrendingUp size={14} className="text-blue-500" />}
                      {insight.type === 'risk' && <AlertCircle size={14} className="text-red-500" />}
                      {insight.type === 'success' && <CheckCircle2 size={14} className="text-green-500" />}
                      {insight.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      insight.impact === 'Critical' ? 'bg-red-100 text-red-700' :
                      insight.impact === 'High' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {insight.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {insight.desc}
                  </p>
                  <button className="mt-3 text-[10px] font-bold text-[#132a13] hover:text-[#4f772d] flex items-center gap-1">
                    Review Detailed Proposal <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
            <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
              <TrendingUp size={16} />
              Historical Impact vs Simulated Projection (₹ Crores)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={historicalImpactData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f1" />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 10, paddingTop: '10px' }} />
                  <Bar dataKey="allocation" name="Budget Allocation" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="impact" name="Economic Impact Generated" stroke="#4f772d" strokeWidth={3} dot={{ r: 4 }} />
                  <Area type="monotone" dataKey="baseline" name="Baseline (Without Intervention)" fill="#f1f3f1" stroke="none" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovPolicyCommand;
