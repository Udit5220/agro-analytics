import React, { useState } from 'react';
import { 
  Ship, 
  TrendingUp, 
  Anchor, 
  Package, 
  ArrowUpRight,
  Sparkles,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { generateContent } from '../../services/gemini/client';

export default function CommodityExportTrends() {
  const [commodity, setCommodity] = useState("Basmati Rice");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [portVolume, setPortVolume] = useState("1.2M MT");
  const [portGrowth, setPortGrowth] = useState("+14.5% MoM Growth");
  const [clearanceTime, setClearanceTime] = useState("1.4 days");

  const [exportData, setExportData] = useState([
    { month: 'Jan 2026', volume: 380, price: 1050 },
    { month: 'Feb 2026', volume: 410, price: 1080 },
    { month: 'Mar 2026', volume: 450, price: 1110 },
    { month: 'Apr 2026', volume: 390, price: 1150 },
    { month: 'May 2026', volume: 420, price: 1130 },
    { month: 'Jun 2026', volume: 440, price: 1170 }
  ]);

  const handlePredictExports = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const prompt = `You are a global agricultural shipping logistics forecaster at APEDA. Predict the export volume and FOB prices over the next 6 months (Jan 2026 to Jun 2026) for the commodity: "${commodity}".
    Also predict the port congestion and customs clearance metrics at Kandla Port for this commodity.

    Structure your response as a valid JSON object. Do not include markdown tags (like \`\`\`json). Return ONLY the raw JSON string.
    The JSON object must have exactly these keys:
    1. "portVolume": Total volume shipped through Kandla Port (e.g. "1.4M MT").
    2. "portGrowth": Month-over-month growth percentage (e.g. "+16.8% MoM Growth").
    3. "clearanceTime": Average customs clearance time in days (e.g. "1.2 days").
    4. "exportData": An array of exactly 6 objects representing monthly forecasts, containing:
       - "month": String (e.g. "Jan 2026", "Feb 2026").
       - "volume": Integer volume value in '000 MT (e.g. 420).
       - "price": Integer FOB price value in $/MT (e.g. 1100).`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an agricultural exports forecasting agent. Always return response as raw JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      
      setPortVolume(parsed.portVolume);
      setPortGrowth(parsed.portGrowth);
      setClearanceTime(parsed.clearanceTime);
      setExportData(parsed.exportData);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to export forecasting node. Showing default Basmati Rice indexes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-start space-x-4 z-10">
          <div className="p-3 bg-brand-dark/10 text-[#31572c] rounded-xl mt-1 shrink-0">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Commodity Export Trends</h1>
            <p className="text-sm text-slate-500 mt-1">
              Global trade analytics and port status predictions (Data: APEDA)
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Export Trend Forecaster Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-[#31572c]" /> AI Export Trend forecaster
        </h3>
        <form onSubmit={handlePredictExports} className="flex flex-col sm:flex-row gap-3">
          <select
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] outline-none text-gray-800"
          >
            <option value="Basmati Rice">Basmati Rice</option>
            <option value="Non-Basmati Rice">Non-Basmati Rice</option>
            <option value="Spices (Cumin / Turmeric)">Spices (Cumin / Turmeric)</option>
            <option value="Castor Oil">Castor Oil</option>
            <option value="Soybean Meal">Soybean Meal</option>
            <option value="Wheat Flour">Wheat Flour</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-dark hover:bg-[#1a3018] text-white py-3 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-xs shrink-0 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Fetching Trade Data...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Predict Export Trends
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Grid: 2/3 Left (composed chart) and 1/3 Right (Port status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Composed Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {commodity} Export Volume vs International Price
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tracking volume (in '000 MT) against average FOB price ($/MT)
                </p>
              </div>

              {/* Custom Legend Indicators */}
              <div className="flex items-center gap-4 text-[11px] font-extrabold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-800" />
                  <span>Export Vol ('000 MT)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>Avg FOB Price ($/MT)</span>
                </div>
              </div>
            </div>

            {/* Interactive Composed Line / Bar Graph */}
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={exportData} margin={{ top: 10, right: -5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 605 }} 
                    dy={8}
                  />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 605 }} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 605 }} 
                  />
                  
                  <Tooltip 
                    content={<CustomComposedTooltip />}
                    cursor={{ stroke: '#e2e8f0', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  />

                  <Bar 
                    yAxisId="left" 
                    dataKey="volume" 
                    fill="#1b4332" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32} 
                  />

                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#fbbf24" 
                    strokeWidth={3} 
                    dot={{ stroke: '#fbbf24', strokeWidth: 3, r: 4, fill: '#fff' }} 
                    activeDot={{ r: 6, stroke: '#fbbf24', strokeWidth: 2, fill: '#fff' }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Card: Kandla Port Status Telemetry (1/3 width) */}
        <div className="bg-gradient-to-br from-[#1b4332] to-[#2d5a27] rounded-3xl overflow-hidden shadow-sm relative flex flex-col justify-between p-6 min-h-[360px] group border border-[#1b4332]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Content */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-white/80">
              <Anchor className="h-4.5 w-4.5 text-emerald-450" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">
                ⚓ KANDLA PORT STATUS
              </span>
            </div>

            <div className="pt-2">
              <h3 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                {portVolume}
              </h3>
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-2.5">
                <span className="text-sm font-black">↗</span> {portGrowth}
              </p>
            </div>
          </div>

          <div className="py-6 flex justify-center items-center opacity-10">
            <Ship className="w-28 h-28 text-white" />
          </div>

          {/* Bottom Status Notification Box (Frosted Glass Blur) */}
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-white text-xs font-extrabold tracking-tight">
                  Customs Clearance
                </h4>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  Currently averaging {clearanceTime} (Fast Track active)
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

function CustomComposedTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const volume = payload.find(p => p.dataKey === 'volume')?.value || 0;
    const price = payload.find(p => p.dataKey === 'price')?.value || 0;
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl shadow-xl space-y-1.5 max-w-[200px] font-sans">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1 mb-1">
          {label} Trade Report
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-650" />
              Volume:
            </span>
            <span className="font-extrabold text-white font-mono">{volume}k MT</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-450" />
              FOB Price:
            </span>
            <span className="font-extrabold text-amber-400 font-mono">${price} / MT</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
