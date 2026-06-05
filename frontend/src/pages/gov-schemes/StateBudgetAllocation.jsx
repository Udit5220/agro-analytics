import React, { useState, useEffect } from 'react';
import { 
  PieChart as PieChartIcon, 
  Landmark, 
  TrendingUp, 
  IndianRupee, 
  Loader2, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown,
  Info,
  Sparkles,
  Send
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { generateContent } from '../../services/gemini/client';

// Verified Mock Fallback Data (ensures dashboard works instantly even without API connection)
const DEFAULT_BUDGET_DATA = [
  { name: 'PM-KISAN (Direct Benefit Transfer)', value: 63500, color: '#0f5132', percentage: '49.9%' },
  { name: 'Modified Interest Subvention Scheme (MISS)', value: 22600, color: '#1e3f20', percentage: '17.8%' },
  { name: 'Crop Insurance Scheme (PMFBY)', value: 12242, color: '#3d5a37', percentage: '9.6%' },
  { name: 'Rashtriya Krishi Vikas Yojana (RKVY)', value: 8500, color: '#5b7a54', percentage: '6.7%' },
  { name: 'Krishonnati Yojana & Missions (Seeds/Pulses/Horticulture)', value: 8000, color: '#7ea176', percentage: '6.3%' },
  { name: 'Other Allied Agri-Welfare Programs', value: 12448, color: '#9ca3af', percentage: '9.7%' },
];

const DEFAULT_STATE_UTILIZATION = [
  { state: 'Madhya Pradesh', utilized: 88, pending: 12, details: 'Funds deployed primarily to Solar Pump infrastructure (KUSUM scheme match), micro-irrigation systems, and solar-powered post-harvest cold storage units.' },
  { state: 'Maharashtra', utilized: 84, pending: 16, details: 'Investment focused on organic farming certification grants, refrigeration networks, and establishing key horticulture hubs in Nashik and Pune.' },
  { state: 'Uttar Pradesh', utilized: 79, pending: 21, details: 'Funds allocated to direct input subsidies (DBT seeds/fertilizers), canal lining systems, and setting up rural primary sorting/grading hubs.' },
  { state: 'Haryana', utilized: 76, pending: 24, details: 'Primary focus on crop residue management (machinery subsidies to prevent stubble burning) and custom hiring centers near farm gates.' },
  { state: 'Punjab', utilized: 72, pending: 28, details: 'Deployment towards groundwater conservation networks, deep tube well electric subsidies, and crop diversification support away from paddy.' }
];

export default function StateBudgetAllocation() {
  const [budgetData, setBudgetData] = useState(DEFAULT_BUDGET_DATA);
  const [stateUtilization, setStateUtilization] = useState(DEFAULT_STATE_UTILIZATION);
  const [loading, setLoading] = useState(true);

  // Interaction States
  const [activeSector, setActiveSector] = useState(null); // stores hovered budget item
  const [expandedState, setExpandedState] = useState(null); // stores index of clicked state progress bar

  // AI Analyst States
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://agroindia-backend.onrender.com/api' : '/api');
        const response = await fetch(`${apiBase}/extended/budgets`);
        const result = await response.json();
        if (result.success && result.data) {
          // Format colors and percentages dynamically if needed, or use response
          const formattedBudget = result.data.budgetData.map((item, idx) => ({
            ...item,
            percentage: `${((item.value / 127290) * 100).toFixed(1)}%`
          }));
          setBudgetData(formattedBudget);
          setStateUtilization(result.data.stateUtilization);
        }
      } catch (error) {
        console.warn("Could not connect to backend API, utilizing static fallback data.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format utility for Indian Numbering System
  const formatIndianCurrency = (value) => {
    return `₹${value.toLocaleString('en-IN')} Cr`;
  };

  const handleStateClick = (stateName) => {
    setExpandedState(expandedState === stateName ? null : stateName);
  };

  const handlePieMouseEnter = (_, index) => {
    setActiveSector(budgetData[index]);
  };

  const handlePieMouseLeave = () => {
    setActiveSector(null);
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim() || loadingAi) return;

    setLoadingAi(true);
    setAiResponse("");

    const budgetContextStr = budgetData.map(b => `${b.name}: ${formatIndianCurrency(b.value)} (${b.percentage})`).join("\n");
    const utilizationContextStr = stateUtilization.map(s => `${s.state}: ${s.utilized}% utilized, pending ${s.pending}%`).join("\n");

    const prompt = `Analyze the Union Agriculture Budget and State Fund Utilization data:
    
    Union Budget Subsidies outlay:
    ${budgetContextStr}
    
    Top State Utilization index:
    ${utilizationContextStr}
    
    User Query: "${aiQuery.trim()}"

    Respond as an expert Indian agricultural policy and finance analyst. Break down the answer clearly, using concise, simple points. Keep it under 150 words.`;

    try {
      const result = await generateContent(prompt, {
        system_instruction: "You are an expert Union budget and agricultural DBT deployment analyst. Provide professional, direct, policy-backed answers.",
        temperature: 0.3
      });
      setAiResponse(result);
    } catch (err) {
      console.error(err);
      setAiResponse("Could not connect to the Budget Analyst. Please verify your internet and try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="h-8 w-8 text-[#31572c] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Union Budget Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Header section matching template layout */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="p-2.5 bg-[#31572c]/10 rounded-xl">
          <PieChartIcon className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">Union Budget Allocation</h1>
          <p className="text-sm text-gray-500">Agri-welfare distribution & state-level fund utilization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: FY 25–26 Subsidies (Pie/Donut Breakdown) - 6 Columns */}
        <div className="lg:col-span-6 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">FY 25–26 Subsidies</h2>
                <Info className="h-4 w-4 text-gray-400 cursor-help" title="Central Sector Schemes and Centrally Sponsored Schemes Outlay" />
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100/70 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +4.2% YoY
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Distribution of central agricultural welfare funds (in ₹ Crores)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Center Outlay & Recharts Donut */}
            <div className="relative h-60 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={handlePieMouseEnter}
                    onMouseLeave={handlePieMouseLeave}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="transition-all duration-300 cursor-pointer focus:outline-none"
                        style={{
                          filter: activeSector && activeSector.name === entry.name ? 'brightness(1.1) drop-shadow(0px 4px 10px rgba(0,0,0,0.15))' : 'none',
                          opacity: activeSector && activeSector.name !== entry.name ? 0.65 : 1
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatIndianCurrency(value)}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'sans-serif' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              
              {/* Absoluted Centered Total Outlay tracker text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
                {activeSector ? (
                  <div className="animate-fadeIn">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Hovered Fund</span>
                    <span className="text-xl font-black text-gray-950 block leading-tight">{formatIndianCurrency(activeSector.value)}</span>
                    <span className="text-xs font-bold text-gray-500 block mt-0.5" style={{ color: activeSector.color }}>{activeSector.percentage}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Total Outlay</span>
                    <span className="text-lg font-black text-gray-900 block leading-tight">₹1,27,290 Cr</span>
                    <span className="text-[10px] text-gray-500 font-bold block mt-0.5">FY 2025–2026</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Legends Panel */}
            <div className="space-y-3 pr-2">
              {budgetData.map((item, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveSector(item)}
                  onMouseLeave={handlePieMouseLeave}
                  className={`p-2 rounded-xl transition-all cursor-default border ${
                    activeSector && activeSector.name === item.name 
                      ? 'bg-slate-50 border-slate-200/80 shadow-xs' 
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-3 w-3 rounded-full shrink-0 mt-1" style={{ backgroundColor: item.color }} />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-gray-800 block truncate leading-tight" title={item.name}>
                        {item.name}
                      </span>
                      <span className="text-[11px] font-extrabold text-gray-900 mt-1 block">
                        {formatIndianCurrency(item.value)} <span className="text-gray-400 font-bold ml-1">{item.percentage}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: State Utilization Index (Bar/Progress Chart) - 6 Columns */}
        <div className="lg:col-span-6 bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-gray-900">State Utilization Index</h2>
              {/* Custom Legend circles */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200 inline-block" /> Pending (%)
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#104229] inline-block" /> Utilized (%)
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Percentage of allocated central funds utilized by Top 5 States</p>
          </div>

          <div className="space-y-4">
            {stateUtilization.map((stateData, idx) => {
              const isExpanded = expandedState === stateData.state;
              return (
                <div 
                  key={idx}
                  className={`border border-gray-100 rounded-2xl p-4 transition-all ${
                    isExpanded 
                      ? 'bg-slate-50/70 border-slate-200/80 shadow-xs' 
                      : 'hover:border-gray-200 bg-white'
                  }`}
                >
                  {/* Row content */}
                  <div 
                    onClick={() => handleStateClick(stateData.state)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="w-28 shrink-0">
                      <span className="text-sm font-bold text-gray-800">{stateData.state}</span>
                    </div>

                    {/* Stacked Progress Bar */}
                    <div className="flex-1 mx-4">
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex relative shadow-inner">
                        <div 
                          className="bg-[#104229] h-full transition-all duration-500" 
                          style={{ width: `${stateData.utilized}%` }}
                        />
                        <div 
                          className="bg-gray-200 h-full transition-all duration-500" 
                          style={{ width: `${stateData.pending}%` }}
                        />
                      </div>
                    </div>

                    {/* Percent labels and toggle icon */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-black text-gray-900">{stateData.utilized}%</span>
                        <span className="text-[10px] font-bold text-gray-400 block mt-0.5">util.</span>
                      </div>
                      <div className="text-gray-400 hover:text-gray-600 transition-colors">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable breakout panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-200/50 text-xs text-gray-600 leading-relaxed animate-fadeIn">
                      <div className="flex gap-2.5 items-start bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                        <div className="p-1 bg-emerald-50 text-emerald-700 rounded-md shrink-0 mt-0.5">
                          <Landmark className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block mb-1">State Utilization Brief</span>
                          {stateData.details}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* AI Union Budget Analyst widget */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4.5 h-4.5 text-emerald-800" />
          <span>AI Union Budget Analyst</span>
        </h3>
        
        <form onSubmit={handleAskAI} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask AI: e.g. 'Compare the budget share of Crop Insurance vs Interest Subvention' or 'Why did MP focus on solar pumps?'"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-850"
          />
          <button
            type="submit"
            disabled={loadingAi || !aiQuery.trim()}
            className="bg-[#31572c] hover:bg-[#1a3018] text-white font-bold p-3.5 rounded-xl shadow-xs transition flex items-center justify-center shrink-0 disabled:opacity-50"
          >
            {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {aiResponse && (
          <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl animate-fadeIn">
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider inline-block mb-2">
              BUDGET INSIGHTS
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold whitespace-pre-line">
              {aiResponse}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
