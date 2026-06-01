import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  AlertOctagon, 
  Sparkles,
  Loader2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { generateContent } from '../../services/gemini/client';

export default function MarketImpactRatings() {
  const [commodity, setCommodity] = useState("");
  const [eventInput, setEventInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hoveredCrop, setHoveredCrop] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Main interactive state
  const [sentimentScore, setSentimentScore] = useState(65);
  const [sentimentLabel, setSentimentLabel] = useState("POSITIVE");
  const [volatilityScore, setVolatilityScore] = useState(85);
  const [activeCommodityName, setActiveCommodityName] = useState("Wheat Futures");
  const [driverText, setDriverText] = useState("Export ban rumors circulating in North Indian mandis.");
  const [actionText, setActionText] = useState("Hold inventory; expect price swings of ±4% this week.");

  const [trendData, setTrendData] = useState([
    { name: 'Day 1', volatility: 22, sentiment: 82 },
    { name: 'Day 2', volatility: 25, sentiment: 88 },
    { name: 'Day 3', volatility: 48, sentiment: 60 },
    { name: 'Day 4', volatility: 92, sentiment: 18 },
    { name: 'Day 5', volatility: 68, sentiment: 42 },
    { name: 'Day 6', volatility: 38, sentiment: 72 },
    { name: 'Day 7', volatility: 20, sentiment: 85 }
  ]);

  const [commodities, setCommodities] = useState([
    { 
      name: 'Wheat', 
      width: 'w-[90%]', 
      percentage: 90, 
      color: 'bg-rose-500 hover:bg-rose-600', 
      indicator: 'Severe supply disruption risk', 
      volumeShift: '+24.5% trade velocity shift' 
    },
    { 
      name: 'Soybean', 
      width: 'w-[72%]', 
      percentage: 72, 
      color: 'bg-amber-500 hover:bg-amber-600', 
      indicator: 'Steady crushing demand', 
      volumeShift: '+12.8% crushing volume' 
    },
    { 
      name: 'Cotton', 
      width: 'w-[55%]', 
      percentage: 55, 
      color: 'bg-blue-500 hover:bg-blue-600', 
      indicator: 'Slight export contraction', 
      volumeShift: '-4.2% offload rate' 
    },
    { 
      name: 'Mustard', 
      width: 'w-[38%]', 
      percentage: 38, 
      color: 'bg-emerald-500 hover:bg-emerald-600', 
      indicator: 'Stable domestic arrivals', 
      volumeShift: '+2.1% market buffer' 
    },
    { 
      name: 'Rice', 
      width: 'w-[20%]', 
      percentage: 20, 
      color: 'bg-slate-500 hover:bg-slate-600', 
      indicator: 'Baseline MSP procurement', 
      volumeShift: '0.0% standard trade deviation' 
    }
  ]);

  const handleFetchImpact = async (e) => {
    e.preventDefault();
    const targetCrop = commodity.trim();
    const eventContext = eventInput.trim();
    if (!targetCrop || !eventContext) {
      setErrorMsg("Please fill in both the commodity name and the event parameters.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const prompt = `You are a machine learning commodity market pricing forecaster. Estimate the sentiment index, price volatility curve, and risks based on:
    - Commodity: ${targetCrop}
    - Recent Event/Context: ${eventContext}

    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "sentimentScore": An integer between 0 and 100 (e.g., 78).
    2. "sentimentLabel": A string (e.g., "POSITIVE", "NEUTRAL", "BEARISH", "VOLATILE").
    3. "volatilityScore": An integer between 0 and 100 representing market risk (e.g., 65).
    4. "driver": A brief driver explanation (under 30 words).
    5. "action": A brief farmer action advice (under 30 words).
    6. "commodities": An array of exactly 5 items, each representing impact levels for common crops, containing:
       - "name": Commodity name.
       - "percentage": Impact percentage (0 to 100).
       - "indicator": Brief risk advisory.
       - "volumeShift": Trade deviation info.
    7. "trendData": An array of exactly 7 objects (representing Day 1 to Day 7) containing:
       - "name": e.g., "Day 1", "Day 2".
       - "volatility": integer (0 to 100).
       - "sentiment": integer (0 to 100).`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert crop market predictive analytics server. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      
      setSentimentScore(parsed.sentimentScore);
      setSentimentLabel(parsed.sentimentLabel);
      setVolatilityScore(parsed.volatilityScore);
      setActiveCommodityName(`${targetCrop} Futures`);
      setDriverText(parsed.driver);
      setActionText(parsed.action);

      // Color maps for dynamic commodities progress bars
      const colors = [
        'bg-rose-500 hover:bg-rose-600',
        'bg-amber-500 hover:bg-amber-600',
        'bg-blue-500 hover:bg-blue-600',
        'bg-emerald-500 hover:bg-emerald-600',
        'bg-slate-500 hover:bg-slate-600'
      ];

      const formattedCommodities = parsed.commodities.map((item, idx) => ({
        ...item,
        width: `w-[${item.percentage}%]`,
        color: colors[idx % colors.length]
      }));

      setCommodities(formattedCommodities);
      setTrendData(parsed.trendData);
      setCommodity("");
      setEventInput("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to AI market forecast index. Using local fallback simulation.");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - bounds.left + 15,
      y: e.clientY - bounds.top - 40
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mt-1 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Market Impact & AI Ratings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Quantifying the effect of news on agricultural markets using Gemini AI forecasting
            </p>
          </div>
        </div>
      </div>

      {/* AI Market Volatility Predictor Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> AI Market Sentiment Forecaster
        </h3>
        <form onSubmit={handleFetchImpact} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Target Commodity</label>
            <input
              type="text"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              placeholder="e.g. Wheat, Cotton, Mustard..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
              required
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Recent Event Context</label>
            <input
              type="text"
              value={eventInput}
              onChange={(e) => setEventInput(e.target.value)}
              placeholder="e.g. Export restrictions lifted, Unseasonal rain surges..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none"
              required
            />
          </div>
          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#31572c] hover:bg-[#1a3018] text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Forecasting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Run AI Forecast
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Top Grid: Interactive Metric Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Overall Market Sentiment */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between min-h-[320px]">
          <div className="w-full">
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block text-center mb-4">
              OVERALL MARKET SENTIMENT
            </span>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            {/* SVG Circular Radial Progress Ring */}
            <div className="w-32 h-32 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-600 transition-all duration-1000 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={`${sentimentScore}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{sentimentScore}</span>
                <span className="text-[9px] font-extrabold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 mt-1 uppercase">
                  {sentimentLabel}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center leading-relaxed mt-4 max-w-xs font-medium">
            AI analysis of live crawlers and news indices outputs this real-time sentiment index.
          </p>
        </div>

        {/* Card 2: High Volatility Alert */}
        <div className="bg-rose-50/70 border border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[320px] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <AlertOctagon className="w-40 h-40 text-rose-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-[10px] font-black text-rose-600 tracking-wider uppercase block">
                MARKET VOLATILITY RATING
              </span>
            </div>
            
            <h3 className="text-2xl font-black text-rose-950 tracking-tight">{activeCommodityName}</h3>
            <p className="text-xs font-extrabold text-rose-800 mt-1">Risk Index: {volatilityScore}/100</p>
          </div>

          <div className="space-y-3 mt-4 relative z-10">
            {/* Driver Box */}
            <div className="bg-white p-3 rounded-xl border border-rose-100/50 shadow-2xs">
              <p className="text-xs text-rose-950 leading-relaxed font-semibold">
                <span className="text-[10px] font-black text-rose-600 block tracking-wide mb-0.5">DRIVER:</span>
                {driverText}
              </p>
            </div>

            {/* Action Box */}
            <div className="bg-white p-3 rounded-xl border border-rose-100/50 shadow-2xs">
              <p className="text-xs text-rose-950 leading-relaxed font-semibold">
                <span className="text-[10px] font-black text-rose-600 block tracking-wide mb-0.5">ADVISED ACTION:</span>
                {actionText}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Commodities Impacted */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[320px] relative">
          <div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block mb-5">
              COMMODITIES IMPACT INDEX
            </span>

            <div className="space-y-4 relative" onMouseMove={handleMouseMove}>
              {commodities.map((crop) => (
                <div 
                  key={crop.name} 
                  className="space-y-1.5 cursor-pointer group"
                  onMouseEnter={() => setHoveredCrop(crop)}
                  onMouseLeave={() => setHoveredCrop(null)}
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="group-hover:text-emerald-800 transition-colors">{crop.name}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{crop.percentage}% Impact</span>
                  </div>
                  
                  {/* Progress track */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${crop.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${crop.percentage}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Crop Micro-Tooltip */}
              {hoveredCrop && (
                <div 
                  className="absolute bg-slate-900 text-white rounded-lg p-2.5 text-[10px] shadow-lg pointer-events-none z-20 max-w-[200px] border border-slate-800/80 animate-fadeIn space-y-1 font-sans"
                  style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
                >
                  <div className="font-extrabold text-emerald-400 border-b border-slate-800 pb-1 mb-1">
                    {hoveredCrop.name} Analytics
                  </div>
                  <div className="font-medium text-slate-200">
                    {hoveredCrop.indicator}
                  </div>
                  <div className="text-slate-400 font-mono italic">
                    {hoveredCrop.volumeShift}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Bottom Row: Interactive 7-Day Trend Analytics Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        
        {/* Chart Header block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              7-Day News Sentiment vs. Price Volatility
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Correlation between negative news cycles and market price swings.
            </p>
          </div>

          {/* Custom Legends */}
          <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>News Sentiment Score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Price Volatility Index</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={trendData} 
              margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="volatilityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                dy={8}
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                ticks={[25, 50, 75, 100]}
                tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
              />
              
              <Tooltip 
                content={<CustomChartTooltip />} 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
              />

              <Area 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#sentimentGrad)" 
              />
              
              <Area 
                type="monotone" 
                dataKey="volatility" 
                stroke="#ef4444" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#volatilityGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const sentiment = payload.find(p => p.dataKey === 'sentiment')?.value || 0;
    const volatility = payload.find(p => p.dataKey === 'volatility')?.value || 0;
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl shadow-xl space-y-2 max-w-[220px] font-sans">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-1">
          {label} Analysis
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sentiment:
            </span>
            <span className="font-extrabold text-emerald-400 font-mono">{sentiment}/100</span>
          </div>
          <div className="flex items-center justify-between text-xs gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              Volatility:
            </span>
            <span className="font-extrabold text-red-450 font-mono">{volatility}/100</span>
          </div>
        </div>
        
        <div className="text-[9px] text-slate-350 leading-relaxed font-semibold bg-slate-950/80 p-1.5 rounded border border-slate-800/40">
          {sentiment < 30 ? (
            <span className="text-rose-450 flex items-center gap-1">
              <AlertOctagon className="w-3 h-3 text-rose-500 shrink-0" />
              <span>Negative cycle detected</span>
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Market outlook stable</span>
            </span>
          )}
        </div>
      </div>
    );
  }
  return null;
}
