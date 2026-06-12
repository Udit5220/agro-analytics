//   // ── Derived ─────────────────────────────────────────────────────────────────
//   const { topRising = [], topFalling = [], summary = {} } = dash || {};
//   const withTrend   = meta.filter(c => c.hasTrend);
//   const withFutures = meta.filter(c => c.hasFutures);

//   // KPI cards
//   const kpiCards = [
//     {
//       label: 'Commodities Tracked',
//       value: meta.length || summary.totalCommodities || '—',
//       sub:   `${withTrend.length} with trend data`,
//       icon:  Sprout,
//       color: 'bg-brand-dark/10 text-[#31572c]',
//     },
//     {
//       label: 'Active Mandis',
//       value: summary.totalMandis || spread?.mandis?.length || '—',
//       sub:   'Price reporting locations',
//       icon:  MapPin,
//       color: 'bg-blue-500/10 text-blue-600',
//     },
//     {
//       label: 'Price Records',
//       value: (summary.totalPriceRecords || 0) > 999
//         ? `${((summary.totalPriceRecords || 0) / 1000).toFixed(1)}K`
//         : (summary.totalPriceRecords || 0),
//       sub:   'Historical price data points',
//       icon:  BarChart3,
//       color: 'bg-violet-500/10 text-violet-600',
//     },
//     {
//       label: 'Futures Covered',
//       value: withFutures.length || '—',
//       sub:   'Commodities with contracts',
//       icon:  Activity,
//       color: 'bg-amber-500/10 text-amber-600',
//     },
//   ];

//   // ── Loading / Error ──────────────────────────────────────────────────────────
//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
//       <RefreshCw className="h-8 w-8 text-[#31572c] animate-spin" />
//       <p className="text-sm font-medium text-slate-500">Loading market data...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto mt-8 flex flex-col items-center gap-3">
//       <AlertCircle className="h-8 w-8 text-red-400" />
//       <p className="text-red-600 font-semibold text-sm">{error}</p>
//       <button onClick={fetchAll} className="px-5 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold hover:bg-[#4a7c59] transition-colors">
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="space-y-5 animate-fadeIn">

//       {/* ── Header ─────────────────────────────────────────────────────────── */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight">
//             Commodity Market Intelligence
//           </h1>
//           <p className="text-xs text-slate-500 mt-0.5">
//             Live mandi prices · price trends · futures · seasonality · spread analysis — all from real data
//           </p>
//         </div>
//         <button
//           onClick={fetchAll}
//           className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark/10 hover:bg-brand-dark/20 text-[#31572c] rounded-xl text-xs font-bold transition-colors"
//         >
//           <RefreshCw className="h-3.5 w-3.5" /> Refresh
//         </button>
//       </div>

//       {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {kpiCards.map(({ label, value, sub, icon: Icon, color }) => (
//           <Card key={label} className="flex items-start gap-3 p-4">
//             <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
//               <Icon className="h-5 w-5" />
//             </div>
//             <div className="min-w-0">
//               <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide truncate">{label}</p>
//               <p className="text-xl font-black text-slate-800 leading-tight">{value}</p>
//               <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub}</p>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* ── Market Movers + Mini Compare ──────────────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//         {/* Left: Rising + Falling */}
//         <div className="lg:col-span-1 space-y-4">
//           {/* Top Rising */}
//           <Card>
//             <SectionTitle icon={TrendingUp} title="Top Rising" />
//             {topRising.length === 0 ? (
//               <p className="text-xs text-slate-400 text-center py-3">No rising data</p>
//             ) : (
//               <div className="space-y-2">
//                 {topRising.map((c, i) => (
//                   <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
//                     <div>
//                       <p className="font-semibold text-slate-800 text-xs">{c._id}</p>
//                       <p className="text-[10px] text-slate-400">{c.mandiName} · ₹{c.modalPrice?.toLocaleString()}/qtl</p>
//                     </div>
//                     <span className="text-emerald-600 font-bold text-xs">+{c.maxChange?.toFixed(1)}%</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>

//           {/* Top Falling */}
//           <Card>
//             <SectionTitle icon={TrendingDown} title="Top Falling" />
//             {topFalling.length === 0 ? (
//               <p className="text-xs text-slate-400 text-center py-3">No falling data</p>
//             ) : (
//               <div className="space-y-2">
//                 {topFalling.map((c, i) => (
//                   <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
//                     <div>
//                       <p className="font-semibold text-slate-800 text-xs">{c._id}</p>
//                       <p className="text-[10px] text-slate-400">{c.mandiName} · ₹{c.modalPrice?.toLocaleString()}/qtl</p>
//                     </div>
//                     <span className="text-red-500 font-bold text-xs">{c.minChange?.toFixed(1)}%</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </Card>
//         </div>

//         {/* Right: Mini 90-day Compare Chart */}
//         <div className="lg:col-span-2">
//           <Card className="h-full flex flex-col">
//             <SectionTitle
//               icon={GitCompare}
//               title="90-Day Price Trend Comparison"
//               action={
//                 <button
//                   onClick={() => navigate('/module/market-intelligence/commodity-compare')}
//                   className="flex items-center gap-1 text-[10px] text-[#31572c] font-bold hover:underline"
//                 >
//                   Full Compare <ArrowRight className="h-3 w-3" />
//                 </button>
//               }
//             />

//             {compareData ? (
//               <>
//                 {/* Series legend */}
//                 <div className="flex flex-wrap gap-3 mb-3">
//                   {Object.entries(compareData.series || {}).map(([name, s], i) => {
//                     const colors = [GREEN, '#3b82f6', '#f59e0b'];
//                     return (
//                       <div key={name} className="flex items-center gap-1.5">
//                         <div className="h-2 w-4 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
//                         <span className="text-[10px] font-semibold text-slate-600">{name}</span>
//                         {s.stats && <TrendBadge pct={s.stats.changePct} />}
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Chart */}
//                 <div className="flex-1 min-h-[160px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                       <defs>
//                         {Object.keys(compareData.series || {}).map((name, i) => {
//                           const colors = [GREEN, '#3b82f6', '#f59e0b'];
//                           const c = colors[i % colors.length];
//                           return (
//                             <linearGradient key={name} id={`grad_${i}`} x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor={c} stopOpacity={0.15} />
//                               <stop offset="95%" stopColor={c} stopOpacity={0} />
//                             </linearGradient>
//                           );
//                         })}
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                       <XAxis
//                         dataKey="date"
//                         tick={{ fontSize: 9, fill: '#94a3b8' }}
//                         interval="preserveStartEnd"
//                         tickLine={false}
//                         axisLine={false}
//                       />
//                       <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
//                       <Tooltip
//                         contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff' }}
//                         formatter={(val, name) => [`${val?.toFixed(1)} (idx)`, name]}
//                       />
//                       {Object.entries(compareData.series || {}).map(([name, s], i) => {
//                         const colors = [GREEN, '#3b82f6', '#f59e0b'];
//                         const c = colors[i % colors.length];
//                         return (
//                           <Area
//                             key={name}
//                             data={s.data}
//                             dataKey="indexed"
//                             name={name}
//                             stroke={c}
//                             strokeWidth={2}
//                             fill={`url(#grad_${i})`}
//                             dot={false}
//                             activeDot={{ r: 4 }}
//                           />
//                         );
//                       })}
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Summary row */}
//                 {compareData.summary && (
//                   <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-3 gap-2 text-center">
//                     {[
//                       { label: 'Best to Sell', val: compareData.summary.bestToSell },
//                       { label: 'Strongest Trend', val: compareData.summary.strongestTrend },
//                       { label: 'Most Volatile', val: compareData.summary.highestVolatility },
//                     ].map(({ label, val }) => (
//                       <div key={label}>
//                         <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
//                         <p className="text-xs font-black text-[#31572c]">{val || '—'}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="flex-1 flex items-center justify-center text-slate-300 text-sm py-8">
//                 No comparison data available
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>

//       {/* ── Mandi Spread + Seasonality ────────────────────────────────────── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

//         {/* Mandi Spread Panel */}
//         <Card>
//           <SectionTitle
//             icon={MapPin}
//             title={`${SPREAD_CROP} — Mandi Price Spread`}
//             action={
//               <span className="text-[10px] text-slate-400 font-medium">
//                 {spread?.spreadNote || ''}
//               </span>
//             }
//           />
//           {spread?.mandis?.length ? (
//             <>
//               <div className="space-y-2 mt-1">
//                 {spread.mandis.slice(0, 6).map((m, i) => {
//                   const maxP = spread.mandis[0].modalPrice;
//                   const pct  = maxP > 0 ? (m.modalPrice / maxP) * 100 : 0;
//                   return (
//                     <div key={i} className="flex items-center gap-2">
//                       <div className="w-20 text-[10px] font-semibold text-slate-600 truncate">{m.mandiName}</div>
//                       <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
//                         <div
//                           className="h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${pct}%`, backgroundColor: m.spreadPct >= 0 ? GREEN : '#ef4444' }}
//                         />
//                       </div>
//                       <div className="w-20 text-right">
//                         <span className="text-[10px] font-bold text-slate-700">₹{m.modalPrice?.toLocaleString()}</span>
//                         <TrendBadge pct={m.spreadPct} />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="mt-3 pt-2 border-t border-slate-50 flex justify-between text-[10px] text-slate-400">
//                 <span>Best: <strong className="text-[#31572c]">{spread.bestMandi}</strong></span>
//                 <span>Spread: <strong className="text-slate-600">₹{spread.spreadRange?.toLocaleString()}/qtl</strong></span>
//                 <span>Avg: <strong className="text-slate-600">₹{spread.avgPrice?.toLocaleString()}</strong></span>
//               </div>
//             </>
//           ) : (
//             <p className="text-xs text-slate-400 text-center py-6">No mandi spread data available</p>
//           )}
//         </Card>

//         {/* Seasonality Panel */}
//         <Card>
//           <SectionTitle
//             icon={BarChart3}
//             title={`${SEASON_CROP} — Monthly Price Pattern`}
//             action={
//               seasonality?.note && (
//                 <span className="text-[9px] text-slate-400 max-w-[180px] truncate" title={seasonality.note}>
//                   {seasonality.note}
//                 </span>
//               )
//             }
//           />
//           {seasonality?.monthly?.some(m => m.avgPrice) ? (
//             <ResponsiveContainer width="100%" height={160}>
//               <BarChart data={seasonality.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis dataKey="monthName" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
//                 <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
//                 <Tooltip
//                   contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
//                   formatter={(val) => [`₹${val?.toLocaleString()}/qtl`, 'Avg Price']}
//                 />
//                 <Bar dataKey="avgPrice" radius={[3, 3, 0, 0]}>
//                   {seasonality.monthly.map((entry, i) => (
//                     <Cell
//                       key={i}
//                       fill={entry.avgPrice
//                         ? (entry.avgPrice >= Math.max(...seasonality.monthly.map(m => m.avgPrice || 0)) * 0.95 ? GREEN : GREEN_LIGHT)
//                         : '#e2e8f0'}
//                     />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           ) : (
//             <p className="text-xs text-slate-400 text-center py-6">No seasonal data available</p>
//           )}
//         </Card>
//       </div>

//       {/* ── Live Mandi Prices Table ───────────────────────────────────────── */}
//       <Card>
//         <SectionTitle
//           icon={Zap}
//           title="Live Mandi Prices"
//           action={
//             <button
//               onClick={() => navigate('/module/market-intelligence/live-prices')}
//               className="flex items-center gap-1 text-[10px] text-[#31572c] font-bold hover:underline"
//             >
//               View All <ArrowRight className="h-3 w-3" />
//             </button>
//           }
//         />
//         <div className="overflow-x-auto">
//           <table className="w-full text-xs min-w-[500px]">
//             <thead>
//               <tr className="text-[10px] text-slate-400 border-b border-slate-100 font-semibold uppercase tracking-wide">
//                 <th className="text-left py-2">Commodity</th>
//                 <th className="text-left py-2">Mandi</th>
//                 <th className="text-right py-2">Modal ₹</th>
//                 <th className="text-right py-2">Min ₹</th>
//                 <th className="text-right py-2">Max ₹</th>
//                 <th className="text-right py-2">Trend</th>
//                 <th className="text-right py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {prices.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-6 text-slate-400">No price data available</td>
//                 </tr>
//               ) : (
//                 prices.map((p, i) => (
//                   <tr key={i} className="border-b border-slate-50 hover:bg-[#f0f7ee]/50 transition-colors group">
//                     <td className="py-2.5 font-bold text-slate-800">{p.commodity}</td>
//                     <td className="py-2.5 text-slate-500">{p.mandiName}</td>
//                     <td className="py-2.5 text-right font-black text-slate-800">₹{p.modalPrice?.toLocaleString()}</td>
//                     <td className="py-2.5 text-right text-slate-400">₹{p.minPrice?.toLocaleString()}</td>
//                     <td className="py-2.5 text-right text-slate-400">₹{p.maxPrice?.toLocaleString()}</td>
//                     <td className="py-2.5 text-right">
//                       <TrendBadge pct={p.trend === 'up' ? Math.abs(p.changePercent) : p.trend === 'down' ? -Math.abs(p.changePercent) : 0} />
//                     </td>
//                     <td className="py-2.5 text-right">
//                       <button
//                         onClick={() => navigate(`/module/marketplace/sell?commodity=${encodeURIComponent(p.commodity)}&price=${p.modalPrice}&mandi=${encodeURIComponent(p.mandiName)}`)}
//                         className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#31572c] hover:text-[#4a7c59] flex items-center gap-0.5 ml-auto"
//                       >
//                         Sell <ChevronRight className="h-2.5 w-2.5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* ── Quick Action Cards ────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//         {[
//           {
//             label: 'Compare Crops',
//             sub:   'Multi-crop trend analysis',
//             icon:  GitCompare,
//             path:  'commodity-compare',
//             color: 'bg-brand-dark/10 text-[#31572c]',
//             badge: `${withTrend.length} crops`,
//           },
//           {
//             label: 'Set Price Alert',
//             sub:   'Get notified on price change',
//             icon:  Bell,
//             path:  'price-alerts',
//             color: 'bg-amber-500/10 text-amber-600',
//           },
//           {
//             label: 'My Watchlist',
//             sub:   'Track favourite commodities',
//             icon:  Bookmark,
//             path:  'watchlist',
//             color: 'bg-violet-500/10 text-violet-600',
//           },
//           {
//             label: 'Sell on Marketplace',
//             sub:   'List your produce for buyers',
//             icon:  Store,
//             path:  '/module/marketplace/sell',
//             color: 'bg-emerald-500/10 text-emerald-700',
//             external: true,
//           },
//         ].map(({ label, sub, icon: Icon, path, color, external, badge }) => (
//           <button
//             key={label}
//             onClick={() => navigate(external ? path : `/module/market-intelligence/${path}`)}
//             className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:border-[#31572c]/30 hover:shadow-md transition-all text-left group"
//           >
//             <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
//               <Icon className="h-4 w-4" />
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="font-bold text-slate-800 text-xs group-hover:text-[#31572c] transition-colors truncate">{label}</p>
//               <p className="text-[10px] text-slate-400 truncate">{sub}</p>
//             </div>
//             {badge && (
//               <span className="text-[9px] font-bold text-[#31572c] bg-brand-dark/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
//                 {badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//     </div>
//   );
// }
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  Bell,
  Bookmark,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Sprout,
  GitCompare,
  Activity,
  MapPin,
  AlertCircle,
  Award,
  Globe,
  Calculator,
  Briefcase,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { commodityApi, analyticsApi } from "../../services/apiService";
import {
  formatINR,
  getMarketStatus,
  buildAIMarketSummary,
  buildMSPDecision,
  getTradeIntelligence,
  getPolicyAlerts,
  getBenchmarkParity,
  getProcurementInsights,
} from "./marketIntelligenceUtils";
import { QUICK_ACTIONS } from "./marketIntelligenceData";
import KisanView from "./components/KisanView";
import CommodIqView from "./components/CommodIqView";
import CommodIqPowerMode from "./components/CommodIqPowerMode";

const GREEN = "#31572c";
const GREEN_LIGHT = "#4a7c59";

const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#31572c]" />
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
    {action}
  </div>
);

const TrendBadge = ({ pct }) => {
  if (!pct && pct !== 0)
    return <span className="text-slate-300 text-xs">—</span>;
  const up = pct > 0;
  const down = pct < 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-bold ${up ? "text-emerald-600" : down ? "text-red-500" : "text-slate-400"}`}
    >
      {up ? (
        <TrendingUp className="h-3 w-3" />
      ) : down ? (
        <TrendingDown className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
      {up ? "+" : ""}
      {pct?.toFixed(1)}%
    </span>
  );
};

const SignalPill = ({ signal }) => {
  const cfg = {
    strong_buy: {
      label: "Strong Sell Now",
      cls: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    buy: {
      label: "Good to Sell",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    stable: {
      label: "Stable",
      cls: "bg-slate-100 text-slate-600 border-slate-200",
    },
    caution: {
      label: "Monitor",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    hold: {
      label: "Hold & Store",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
    neutral: {
      label: "Neutral",
      cls: "bg-slate-50 text-slate-500 border-slate-200",
    },
  };
  const c = cfg[signal] || cfg.neutral;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.cls}`}
    >
      {c.label}
    </span>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const iconMap = {
  GitCompare,
  Bell,
  Bookmark,
  Store,
  Award,
  Calculator,
  Briefcase,
  Zap,
};

export default function MarketDashboard() {
  const navigate = useNavigate();

  // ── View Mode: 'standard' | 'kisan' | 'trader' | 'power' ────────────────
  const [viewMode, setViewMode] = useState('standard');
  const [selectedCommodity, setSelectedCommodity] = useState('Wheat');

  const [dash, setDash] = useState(null);
  const [prices, setPrices] = useState([]);
  const [meta, setMeta] = useState([]);
  const [compareData, setCompareData] = useState(null);
  const [spread, setSpread] = useState(null);
  const [seasonality, setSeasonality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const FEATURED_CROPS = "Cotton,Wheat,Chana";
  const SPREAD_CROP = "Cotton";
  const SEASON_CROP = "Cotton";

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, priceRes, metaRes, compareRes, spreadRes, seasonRes] =
        await Promise.allSettled([
          commodityApi.getDashboard(),
          commodityApi.getMandiPrices({ limit: 12 }),
          analyticsApi.getMeta({ type: "agricultural", activeOnly: "true" }),
          analyticsApi.compare(FEATURED_CROPS, 90),
          analyticsApi.getMandiSpread(SPREAD_CROP),
          analyticsApi.getSeasonality(SEASON_CROP),
        ]);

      if (dashRes.status === "fulfilled") setDash(dashRes.value.data);
      if (priceRes.status === "fulfilled") setPrices(priceRes.value.data || []);
      if (metaRes.status === "fulfilled") setMeta(metaRes.value.data || []);
      if (compareRes.status === "fulfilled")
        setCompareData(compareRes.value.data);
      if (spreadRes.status === "fulfilled") setSpread(spreadRes.value.data);
      if (seasonRes.status === "fulfilled")
        setSeasonality(seasonRes.value.data);
      setLastUpdated(
        new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
      );
    } catch (e) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const {
    topRising = [],
    topFalling = [],
    summary = {},
    greenleafAvailable,
  } = dash || {};
  const withTrend = meta.filter((c) => c.hasTrend);
  const withFutures = meta.filter((c) => c.hasFutures);
  const marketStatus = getMarketStatus(greenleafAvailable);

  const aiSummary = buildAIMarketSummary(dash, compareData, {}, prices);
  const mspDecision = buildMSPDecision(prices);
  const tradeSignals = getTradeIntelligence();
  const policyAlerts = getPolicyAlerts();
  const benchmarkRows = getBenchmarkParity();
  const procurementItems = getProcurementInsights();

  const kpiCards = [
    {
      label: "Commodities Tracked",
      value: meta.length || summary.totalCommodities || "—",
      sub: `${withTrend.length} with trend data`,
      icon: Sprout,
      color: "bg-brand-dark/10 text-[#31572c]",
    },
    {
      label: "Active Mandis",
      value: summary.totalMandis || spread?.mandis?.length || "—",
      sub: "Price reporting locations",
      icon: MapPin,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Price Records",
      value:
        (summary.totalPriceRecords || 0) > 999
          ? `${((summary.totalPriceRecords || 0) / 1000).toFixed(1)}K`
          : summary.totalPriceRecords || 0,
      sub: "Historical price points",
      icon: BarChart3,
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Futures Covered",
      value: withFutures.length || "—",
      sub: "Commodities with contracts",
      icon: Activity,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "MSP Risk Crops",
      value:
        prices.filter((p) => p.modalPrice && p.changePercent > 1).length || "—",
      sub: "Potential MSP movement",
      icon: Award,
      color: "bg-emerald-500/10 text-emerald-700",
    },
    {
      label: "Import Parity",
      value:
        tradeSignals.filter((item) => item.signal.includes("Import")).length ||
        0,
      sub: "Near-term import indicators",
      icon: Globe,
      color: "bg-slate-100 text-slate-700",
    },
    {
      label: "Export Opportunities",
      value:
        tradeSignals.filter((item) => item.signal.includes("Export")).length ||
        0,
      sub: "Global demand indicators",
      icon: Briefcase,
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      label: "Policy Alerts",
      value: policyAlerts.length,
      sub: "Active alert items",
      icon: AlertCircle,
      color: "bg-rose-100 text-rose-700",
    },
  ];


  // ── Route to alternate views ──────────────────────────────────────────────
  if (viewMode === 'kisan') {
    return (
      <KisanView
        selectedCommodity={selectedCommodity}
        onCommodityChange={setSelectedCommodity}
        onToggleMode={() => setViewMode('trader')}
      />
    );
  }
  if (viewMode === 'trader') {
    return (
      <CommodIqView
        selectedCommodity={selectedCommodity}
        onCommodityChange={setSelectedCommodity}
        onToggleMode={() => setViewMode('power')}
      />
    );
  }
  if (viewMode === 'power') {
    return (
      <CommodIqPowerMode
        onToggleMode={() => setViewMode('trader')}
      />
    );
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
        <RefreshCw className="h-8 w-8 text-[#31572c] animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading market data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto mt-8 flex flex-col items-center gap-3">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="text-red-600 font-semibold text-sm">{error}</p>
        <button
          onClick={fetchAll}
          className="px-5 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold hover:bg-[#4a7c59] transition-colors"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Commodity Market Intelligence
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-2xl">
            Live mandi prices, MSP signals, futures & derivatives, trade parity,
            tariff insights, and AI advisory in one unified dashboard.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${marketStatus.color} border-slate-200`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${marketStatus.label === "Live" ? "bg-emerald-600" : marketStatus.label === "Delayed" ? "bg-slate-400" : "bg-amber-600"}`}
            />
            <span>{marketStatus.label}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <span className="font-semibold">Last updated:</span>
            <span>{lastUpdated}</span>
          </div>
          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2 text-sm font-bold text-white hover:bg-[#4a7c59] transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setViewMode('kisan')}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors bg-white text-emerald-700 shadow-sm hover:bg-emerald-50"
            >🧑‍🌾 Kisan Mode</button>
            <button
              onClick={() => setViewMode('trader')}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors text-slate-500 hover:bg-white hover:shadow-sm"
            >📈 CommodIQ</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="flex items-start gap-3 p-4">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide truncate">
                {label}
              </p>
              <p className="text-2xl font-black text-slate-900 leading-tight mt-1">
                {value}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 truncate">{sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                AI Market Intelligence
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                Market signal & opportunity
              </h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              AI Insight
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Overall Signal
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {aiSummary.marketSignal}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Top Opportunity
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {aiSummary.topOpportunity}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Top Risk
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {aiSummary.topRisk}
              </p>
            </div>
          </div>
          <div className="space-y-3 border-t border-slate-100 pt-3">
            {aiSummary.insights.map((insight, idx) => (
              <p key={idx} className="text-sm text-slate-600">
                {insight}
              </p>
            ))}
          </div>
          <div className="mt-4 rounded-3xl bg-[#f3faf4] p-4 border border-emerald-100">
            <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700">
              Action summary
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {aiSummary.suggestedAction}
            </p>
          </div>
        </Card>

        <Card>
          <SectionTitle icon={TrendingUp} title="Top Movers" />
          <div className="space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
                Rising commodities
              </p>
              <div className="space-y-3">
                {topRising.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item._id}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.mandiName} · ₹{item.modalPrice?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-emerald-600 font-bold">
                      +{item.maxChange?.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
                Falling commodities
              </p>
              <div className="space-y-3">
                {topFalling.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item._id}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.mandiName} · ₹{item.modalPrice?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-red-500 font-bold">
                      {item.minChange?.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7">
          <Card className="h-full flex flex-col">
            <SectionTitle
              icon={GitCompare}
              title="90-Day Price Trend Comparison"
              action={
                <button
                  onClick={() =>
                    navigate("/module/market-intelligence/commodity-compare")
                  }
                  className="flex items-center gap-1 text-[10px] text-[#31572c] font-bold hover:underline"
                >
                  Full Compare <ArrowRight className="h-3 w-3" />
                </button>
              }
            />
            {compareData ? (
              <>
                <div className="flex flex-wrap gap-3 mb-3">
                  {Object.entries(compareData.series || {}).map(
                    ([name, s], i) => {
                      const colors = [GREEN, "#3b82f6", "#f59e0b"];
                      return (
                        <div key={name} className="flex items-center gap-2">
                          <span
                            className="h-2 w-4 rounded-full"
                            style={{
                              backgroundColor: colors[i % colors.length],
                            }}
                          />
                          <span className="text-[10px] font-semibold text-slate-600">
                            {name}
                          </span>
                          {s.stats && <TrendBadge pct={s.stats.changePct} />}
                        </div>
                      );
                    },
                  )}
                </div>
                <div className="flex-1 min-h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                    >
                      <defs>
                        {Object.keys(compareData.series || {}).map(
                          (name, i) => {
                            const colors = [GREEN, "#3b82f6", "#f59e0b"];
                            const c = colors[i % colors.length];
                            return (
                              <linearGradient
                                key={name}
                                id={`grad_${i}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={c}
                                  stopOpacity={0.15}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={c}
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            );
                          },
                        )}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        interval="preserveStartEnd"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        tickLine={false}
                        axisLine={false}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip
                        contentStyle={{
                          fontSize: 11,
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                        }}
                        formatter={(val, name) => [
                          `${val?.toFixed(1)} (idx)`,
                          name,
                        ]}
                      />
                      <Legend
                        verticalAlign="top"
                        height={24}
                        wrapperStyle={{ fontSize: 11 }}
                      />
                      {Object.entries(compareData.series || {}).map(
                        ([name, s], i) => {
                          const colors = [GREEN, "#3b82f6", "#f59e0b"];
                          const c = colors[i % colors.length];
                          return (
                            <Area
                              key={name}
                              data={s.data}
                              dataKey="indexed"
                              name={name}
                              stroke={c}
                              strokeWidth={2}
                              fill={`url(#grad_${i})`}
                              dot={false}
                              activeDot={{ r: 4 }}
                            />
                          );
                        },
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {compareData.summary && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
                    {[
                      {
                        label: "Best to Sell",
                        val: compareData.summary.bestToSell,
                      },
                      {
                        label: "Strongest Trend",
                        val: compareData.summary.strongestTrend,
                      },
                      {
                        label: "Most Volatile",
                        val: compareData.summary.highestVolatility,
                      },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-[9px] font-semibold uppercase tracking-wide">
                          {label}
                        </p>
                        <p className="text-xs font-black text-[#31572c]">
                          {val || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-300 text-sm py-8">
                No comparison data available
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-5 grid grid-cols-1 gap-5">
          <Card>
            <SectionTitle
              icon={MapPin}
              title={`${SPREAD_CROP} — Mandi Price Spread`}
            />
            {spread?.mandis?.length ? (
              <>
                <div className="space-y-2 mt-1">
                  {spread.mandis.slice(0, 6).map((m, i) => {
                    const maxP = spread.mandis[0].modalPrice;
                    const pct = maxP > 0 ? (m.modalPrice / maxP) * 100 : 0;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-24 text-[10px] font-semibold text-slate-600 truncate">
                          {m.mandiName}
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              backgroundColor:
                                m.spreadPct >= 0 ? GREEN : "#ef4444",
                            }}
                          />
                        </div>
                        <div className="w-24 text-right">
                          <span className="text-[10px] font-bold text-slate-700">
                            ₹{m.modalPrice?.toLocaleString()}
                          </span>
                          <TrendBadge pct={m.spreadPct} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-2 text-[10px] text-slate-400 sm:flex-row sm:justify-between">
                  <span>
                    Best:{" "}
                    <strong className="text-[#31572c]">
                      {spread.bestMandi}
                    </strong>
                  </span>
                  <span>
                    Spread:{" "}
                    <strong className="text-slate-600">
                      ₹{spread.spreadRange?.toLocaleString()}/qtl
                    </strong>
                  </span>
                  <span>
                    Avg:{" "}
                    <strong className="text-slate-600">
                      ₹{spread.avgPrice?.toLocaleString()}
                    </strong>
                  </span>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                No mandi spread data available
              </p>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <SectionTitle
                icon={BarChart3}
                title={`${SEASON_CROP} — Monthly Price Pattern`}
              />
              {seasonality?.monthly?.some((m) => m.avgPrice) ? (
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart
                    data={seasonality.monthly}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="monthName"
                      tick={{ fontSize: 9, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: "#94a3b8" }}
                      tickLine={false}
                      axisLine={false}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 11,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                      formatter={(val) => [
                        `₹${val?.toLocaleString()}/qtl`,
                        "Avg Price",
                      ]}
                    />
                    <Bar dataKey="avgPrice" radius={[3, 3, 0, 0]}>
                      {seasonality.monthly.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.avgPrice
                              ? entry.avgPrice >=
                                Math.max(
                                  ...seasonality.monthly.map(
                                    (m) => m.avgPrice || 0,
                                  ),
                                ) *
                                  0.95
                                ? GREEN
                                : GREEN_LIGHT
                              : "#e2e8f0"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">
                  No seasonal data available
                </p>
              )}
            </Card>
            <Card>
              <SectionTitle icon={Globe} title="Benchmark Parity" />
              <div className="space-y-4">
                {benchmarkRows.map((row) => (
                  <div
                    key={row.commodity}
                    className="rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {row.commodity}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Benchmark premium
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${row.signal === "Export Friendly" ? "bg-emerald-100 text-emerald-700" : row.signal === "Import Pressure" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}
                      >
                        {row.signal}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                      <div>
                        India{" "}
                        <strong className="text-slate-900">
                          ₹{row.indiaPrice.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        Global{" "}
                        <strong className="text-slate-900">
                          ₹{row.globalBenchmark.toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        Premium{" "}
                        <strong className="text-slate-900">
                          {row.premiumDiscount}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-5">
          <SectionTitle icon={Award} title="MSP Decision Panel" />
          {mspDecision ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Commodity
                    </p>
                    <p className="mt-2 text-xl font-black text-slate-900">
                      {mspDecision.commodity}
                    </p>
                  </div>
                  <SignalPill
                    signal={
                      mspDecision.recommendedAction === "Sell Now"
                        ? "buy"
                        : mspDecision.recommendedAction === "Hold"
                          ? "hold"
                          : "caution"
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-600">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Market
                    </p>
                    <p className="mt-2 font-black text-slate-900">
                      {formatINR(mspDecision.marketPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      MSP
                    </p>
                    <p className="mt-2 font-black text-slate-900">
                      {formatINR(mspDecision.msp)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-[#f3faf4] p-4 border border-emerald-100">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-700">
                  AI Note
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {mspDecision.aiNote}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Not enough data to surface an MSP decision yet.
            </p>
          )}
        </Card>

        <Card className="xl:col-span-4">
          <SectionTitle icon={Activity} title="Futures & Trader Signal" />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Spot
                </p>
                <p className="mt-2 text-xl font-black text-slate-900">
                  {formatINR(prices[0]?.modalPrice || 6600)}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Futures price
                </p>
                <p className="mt-2 text-xl font-black text-slate-900">
                  {formatINR((prices[0]?.modalPrice || 0) + 120)}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-900">
                  Cotton Jul '26 basis
                </p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Contango
                </span>
              </div>
              <p className="text-sm text-slate-600">
                The nearest futures contract is trading above spot, indicating a
                rollover premium for exporters and traders.
              </p>
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-3">
          <SectionTitle icon={Briefcase} title="Procurement Intelligence" />
          <div className="space-y-4">
            {procurementItems.slice(0, 2).map((item) => (
              <div
                key={item.commodity}
                className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {item.commodity}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.supplier}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${item.status === "Saving" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Market
                    </p>
                    <p className="mt-2 font-black text-slate-900">
                      {formatINR(item.marketPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Procurement
                    </p>
                    <p className="mt-2 font-black text-slate-900">
                      {formatINR(item.procurementPrice)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {item.outlook} · Contract risk: {item.risk}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-5">
        <Card className="xl:col-span-4">
          <SectionTitle icon={AlertCircle} title="Policy & News Alerts" />
          <div className="space-y-4">
            {policyAlerts.map((alert) => (
              <div
                key={`${alert.type}-${alert.commodity}`}
                className="rounded-3xl border border-slate-100 p-4 hover:border-[#31572c]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {alert.type}
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {alert.commodity}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${alert.impact === "Bullish" ? "bg-emerald-100 text-emerald-700" : alert.impact === "Bearish" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    {alert.impact}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-3">{alert.reason}</p>
                <p className="text-[11px] text-slate-400 mt-3">{alert.time}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-3">
          <SectionTitle icon={Calculator} title="Tariff & Duty Calculator" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-500">
                  Commodity
                </label>
                <input
                  value="Rice"
                  readOnly
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">
                  HS Code
                </label>
                <input
                  value="1006"
                  readOnly
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">
                  CIF Price
                </label>
                <input
                  value="₹9,500"
                  readOnly
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500">
                  Quantity
                </label>
                <input
                  value="10"
                  readOnly
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-slate-50"
                />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div>BCD</div>
                <div className="text-right font-semibold">10%</div>
                <div>AIDC</div>
                <div className="text-right font-semibold">7.5%</div>
                <div>SWS</div>
                <div className="text-right font-semibold">2.5%</div>
                <div>IGST</div>
                <div className="text-right font-semibold">5%</div>
                <div>Port</div>
                <div className="text-right font-semibold">3.2%</div>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4 text-sm text-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span>Total landed cost</span>
                  <span className="font-black text-slate-900">₹11,650</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Import viability</span>
                  <span className="font-semibold text-emerald-700">Viable</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Live Mandi Prices
            </p>
            <h2 className="text-xl font-bold text-slate-900">
              Latest market prices across mandis
            </h2>
          </div>
          <button
            onClick={() => navigate("/module/market-intelligence/live-prices")}
            className="inline-flex items-center gap-1 rounded-full bg-brand-dark/10 px-4 py-2 text-xs font-bold text-[#31572c] hover:bg-brand-dark/20 transition-colors"
          >
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[960px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] text-slate-400 border-b border-slate-100 font-semibold uppercase tracking-wide">
                {[
                  "Commodity",
                  "Mandi",
                  "Modal ₹",
                  "Min ₹",
                  "Max ₹",
                  "Trend",
                  "MSP status",
                  "Arrival volume",
                  "AI signal",
                  "Action",
                ].map((h) => (
                  <th key={h} className="text-left py-3 px-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400">
                    No price data available
                  </td>
                </tr>
              ) : (
                prices.map((p, i) => {
                  const rowMsp =
                    p.commodity === "Wheat"
                      ? 2325
                      : p.commodity === "Chana"
                        ? 5250
                        : p.commodity === "Cotton"
                          ? 5800
                          : null;
                  const diff = rowMsp ? p.modalPrice - rowMsp : null;
                  const pct = rowMsp ? (diff / rowMsp) * 100 : null;
                  const trendSignal =
                    p.trend === "up"
                      ? "buy"
                      : p.trend === "down"
                        ? "hold"
                        : "stable";
                  return (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {p.commodity}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {p.mandiName}
                      </td>
                      <td className="py-3 px-2 font-black text-slate-900">
                        {formatINR(p.modalPrice)}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {formatINR(p.minPrice)}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {formatINR(p.maxPrice)}
                      </td>
                      <td className="py-3 px-2">
                        <TrendBadge
                          pct={
                            p.trend === "up"
                              ? Math.abs(p.changePercent)
                              : p.trend === "down"
                                ? -Math.abs(p.changePercent)
                                : 0
                          }
                        />
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {rowMsp ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${diff >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                          >
                            {diff >= 0 ? "+" : ""}
                            {pct?.toFixed(1)}% {diff >= 0 ? "above" : "below"}{" "}
                            MSP
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {p.arrivalVolume?.toLocaleString() || "—"}
                      </td>
                      <td className="py-3 px-2">
                        <SignalPill signal={trendSignal} />
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/module/marketplace/sell?commodity=${encodeURIComponent(p.commodity)}&price=${p.modalPrice}&mandi=${encodeURIComponent(p.mandiName)}`,
                            )
                          }
                          className="text-[10px] font-bold text-[#31572c] hover:text-[#4a7c59]"
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(({ label, sub, icon, path, external }) => {
          const Icon = iconMap[icon] || Zap;
          return (
            <button
              key={label}
              onClick={() =>
                navigate(
                  external ? path : `/module/market-intelligence/${path}`,
                )
              }
              className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:border-[#31572c]/30 hover:shadow-md transition-all text-left"
            >
              <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-slate-100 text-[#31572c]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 text-sm">{label}</p>
                <p className="text-[11px] text-slate-500 mt-1">{sub}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
