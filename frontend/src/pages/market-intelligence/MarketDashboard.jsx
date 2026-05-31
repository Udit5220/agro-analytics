import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Minus, Store, Bell, Bookmark, BarChart3,
  RefreshCw, ArrowRight, Sprout, GitCompare, Zap, Activity, MapPin,
  ChevronRight, AlertCircle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { commodityApi, analyticsApi } from '../../services/apiService';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN = '#31572c';
const GREEN_LIGHT = '#4a7c59';

// ─── Section title ────────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#31572c]" />
      <h2 className="text-sm font-bold text-slate-800">{title}</h2>
    </div>
    {action}
  </div>
);
// ─── Trend badge ──────────────────────────────────────────────────────────────
const TrendBadge = ({ pct }) => {
  if (!pct && pct !== 0) return <span className="text-slate-300 text-xs">—</span>;
  const up = pct > 0;
  const down = pct < 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${up ? 'text-emerald-600' : down ? 'text-red-500' : 'text-slate-400'}`}>
      {up ? <TrendingUp className="h-3 w-3" /> : down ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
      {up ? '+' : ''}{pct?.toFixed(1)}%
    </span>
  );
};

// ─── Signal pill ──────────────────────────────────────────────────────────────
const SignalPill = ({ signal }) => {
  const cfg = {
    strong_buy: { label: 'Strong Sell Now', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    buy:        { label: 'Good to Sell',    cls: 'bg-green-50 text-green-700 border-green-200'        },
    stable:     { label: 'Stable',           cls: 'bg-slate-100 text-slate-600 border-slate-200'       },
    caution:    { label: 'Monitor',          cls: 'bg-amber-50 text-amber-700 border-amber-200'        },
    hold:       { label: 'Hold & Store',     cls: 'bg-red-50 text-red-700 border-red-200'              },
    neutral:    { label: 'Neutral',          cls: 'bg-slate-50 text-slate-500 border-slate-200'        },
  };
  const c = cfg[signal] || cfg.neutral;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.cls}`}>
      {c.label}
    </span>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ h = 'h-4', w = 'w-full', rounded = 'rounded' }) => (
  <div className={`${h} ${w} ${rounded} bg-slate-100 animate-pulse`} />
);

// ─── Card wrapper ─────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm ${className}`}>
    {children}
  </div>
);


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function MarketDashboard() {
  const navigate = useNavigate();

  // ── State ───────────────────────────────────────────────────────────────────
  const [dash,       setDash]       = useState(null);
  const [prices,     setPrices]     = useState([]);
  const [meta,       setMeta]       = useState([]);
  const [compareData,setCompareData]= useState(null);
  const [spread,     setSpread]     = useState(null);
  const [seasonality,setSeasonality]= useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Default crops for the mini compare panel on dashboard
  const FEATURED_CROPS = 'Cotton,Wheat,Chana';
  const SPREAD_CROP    = 'Cotton';
  const SEASON_CROP    = 'Cotton';

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, priceRes, metaRes, compareRes, spreadRes, seasonRes] = await Promise.allSettled([
        commodityApi.getDashboard(),
        commodityApi.getMandiPrices({ limit: 8 }),
        analyticsApi.getMeta({ type: 'agricultural', activeOnly: 'true' }),
        analyticsApi.compare(FEATURED_CROPS, 90),
        analyticsApi.getMandiSpread(SPREAD_CROP),
        analyticsApi.getSeasonality(SEASON_CROP),
      ]);

      if (dashRes.status === 'fulfilled')    setDash(dashRes.value.data);
      if (priceRes.status === 'fulfilled')   setPrices(priceRes.value.data || []);
      if (metaRes.status === 'fulfilled')    setMeta(metaRes.value.data || []);
      if (compareRes.status === 'fulfilled') setCompareData(compareRes.value.data);
      if (spreadRes.status === 'fulfilled')  setSpread(spreadRes.value.data);
      if (seasonRes.status === 'fulfilled')  setSeasonality(seasonRes.value.data);
    } catch (e) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived ─────────────────────────────────────────────────────────────────
  const { topRising = [], topFalling = [], summary = {} } = dash || {};
  const withTrend   = meta.filter(c => c.hasTrend);
  const withFutures = meta.filter(c => c.hasFutures);

  // KPI cards
  const kpiCards = [
    {
      label: 'Commodities Tracked',
      value: meta.length || summary.totalCommodities || '—',
      sub:   `${withTrend.length} with trend data`,
      icon:  Sprout,
      color: 'bg-[#31572c]/10 text-[#31572c]',
    },
    {
      label: 'Active Mandis',
      value: summary.totalMandis || spread?.mandis?.length || '—',
      sub:   'Price reporting locations',
      icon:  MapPin,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Price Records',
      value: (summary.totalPriceRecords || 0) > 999
        ? `${((summary.totalPriceRecords || 0) / 1000).toFixed(1)}K`
        : (summary.totalPriceRecords || 0),
      sub:   'Historical price data points',
      icon:  BarChart3,
      color: 'bg-violet-500/10 text-violet-600',
    },
    {
      label: 'Futures Covered',
      value: withFutures.length || '—',
      sub:   'Commodities with contracts',
      icon:  Activity,
      color: 'bg-amber-500/10 text-amber-600',
    },
  ];

  // ── Loading / Error ──────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-fadeIn">
      <RefreshCw className="h-8 w-8 text-[#31572c] animate-spin" />
      <p className="text-sm font-medium text-slate-500">Loading market data...</p>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto mt-8 flex flex-col items-center gap-3">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="text-red-600 font-semibold text-sm">{error}</p>
      <button onClick={fetchAll} className="px-5 py-2 bg-[#31572c] text-white rounded-xl text-sm font-bold hover:bg-[#4a7c59] transition-colors">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Commodity Market Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live mandi prices · price trends · futures · seasonality · spread analysis — all from real data
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#31572c]/10 hover:bg-[#31572c]/20 text-[#31572c] rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="flex items-start gap-3 p-4">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide truncate">{label}</p>
              <p className="text-xl font-black text-slate-800 leading-tight">{value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Market Movers + Mini Compare ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Rising + Falling */}
        <div className="lg:col-span-1 space-y-4">
          {/* Top Rising */}
          <Card>
            <SectionTitle icon={TrendingUp} title="Top Rising" />
            {topRising.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No rising data</p>
            ) : (
              <div className="space-y-2">
                {topRising.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{c._id}</p>
                      <p className="text-[10px] text-slate-400">{c.mandiName} · ₹{c.modalPrice?.toLocaleString()}/qtl</p>
                    </div>
                    <span className="text-emerald-600 font-bold text-xs">+{c.maxChange?.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Top Falling */}
          <Card>
            <SectionTitle icon={TrendingDown} title="Top Falling" />
            {topFalling.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">No falling data</p>
            ) : (
              <div className="space-y-2">
                {topFalling.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{c._id}</p>
                      <p className="text-[10px] text-slate-400">{c.mandiName} · ₹{c.modalPrice?.toLocaleString()}/qtl</p>
                    </div>
                    <span className="text-red-500 font-bold text-xs">{c.minChange?.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Mini 90-day Compare Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <SectionTitle
              icon={GitCompare}
              title="90-Day Price Trend Comparison"
              action={
                <button
                  onClick={() => navigate('/module/market-intelligence/commodity-compare')}
                  className="flex items-center gap-1 text-[10px] text-[#31572c] font-bold hover:underline"
                >
                  Full Compare <ArrowRight className="h-3 w-3" />
                </button>
              }
            />

            {compareData ? (
              <>
                {/* Series legend */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {Object.entries(compareData.series || {}).map(([name, s], i) => {
                    const colors = [GREEN, '#3b82f6', '#f59e0b'];
                    return (
                      <div key={name} className="flex items-center gap-1.5">
                        <div className="h-2 w-4 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-[10px] font-semibold text-slate-600">{name}</span>
                        {s.stats && <TrendBadge pct={s.stats.changePct} />}
                      </div>
                    );
                  })}
                </div>

                {/* Chart */}
                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        {Object.keys(compareData.series || {}).map((name, i) => {
                          const colors = [GREEN, '#3b82f6', '#f59e0b'];
                          const c = colors[i % colors.length];
                          return (
                            <linearGradient key={name} id={`grad_${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                              <stop offset="95%" stopColor={c} stopOpacity={0} />
                            </linearGradient>
                          );
                        })}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9, fill: '#94a3b8' }}
                        interval="preserveStartEnd"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff' }}
                        formatter={(val, name) => [`${val?.toFixed(1)} (idx)`, name]}
                      />
                      {Object.entries(compareData.series || {}).map(([name, s], i) => {
                        const colors = [GREEN, '#3b82f6', '#f59e0b'];
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
                      })}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary row */}
                {compareData.summary && (
                  <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Best to Sell', val: compareData.summary.bestToSell },
                      { label: 'Strongest Trend', val: compareData.summary.strongestTrend },
                      { label: 'Most Volatile', val: compareData.summary.highestVolatility },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                        <p className="text-xs font-black text-[#31572c]">{val || '—'}</p>
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
      </div>

      {/* ── Mandi Spread + Seasonality ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Mandi Spread Panel */}
        <Card>
          <SectionTitle
            icon={MapPin}
            title={`${SPREAD_CROP} — Mandi Price Spread`}
            action={
              <span className="text-[10px] text-slate-400 font-medium">
                {spread?.spreadNote || ''}
              </span>
            }
          />
          {spread?.mandis?.length ? (
            <>
              <div className="space-y-2 mt-1">
                {spread.mandis.slice(0, 6).map((m, i) => {
                  const maxP = spread.mandis[0].modalPrice;
                  const pct  = maxP > 0 ? (m.modalPrice / maxP) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-20 text-[10px] font-semibold text-slate-600 truncate">{m.mandiName}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: m.spreadPct >= 0 ? GREEN : '#ef4444' }}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-[10px] font-bold text-slate-700">₹{m.modalPrice?.toLocaleString()}</span>
                        <TrendBadge pct={m.spreadPct} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-50 flex justify-between text-[10px] text-slate-400">
                <span>Best: <strong className="text-[#31572c]">{spread.bestMandi}</strong></span>
                <span>Spread: <strong className="text-slate-600">₹{spread.spreadRange?.toLocaleString()}/qtl</strong></span>
                <span>Avg: <strong className="text-slate-600">₹{spread.avgPrice?.toLocaleString()}</strong></span>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No mandi spread data available</p>
          )}
        </Card>

        {/* Seasonality Panel */}
        <Card>
          <SectionTitle
            icon={BarChart3}
            title={`${SEASON_CROP} — Monthly Price Pattern`}
            action={
              seasonality?.note && (
                <span className="text-[9px] text-slate-400 max-w-[180px] truncate" title={seasonality.note}>
                  {seasonality.note}
                </span>
              )
            }
          />
          {seasonality?.monthly?.some(m => m.avgPrice) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={seasonality.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="monthName" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                  formatter={(val) => [`₹${val?.toLocaleString()}/qtl`, 'Avg Price']}
                />
                <Bar dataKey="avgPrice" radius={[3, 3, 0, 0]}>
                  {seasonality.monthly.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.avgPrice
                        ? (entry.avgPrice >= Math.max(...seasonality.monthly.map(m => m.avgPrice || 0)) * 0.95 ? GREEN : GREEN_LIGHT)
                        : '#e2e8f0'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No seasonal data available</p>
          )}
        </Card>
      </div>

      {/* ── Live Mandi Prices Table ───────────────────────────────────────── */}
      <Card>
        <SectionTitle
          icon={Zap}
          title="Live Mandi Prices"
          action={
            <button
              onClick={() => navigate('/module/market-intelligence/live-prices')}
              className="flex items-center gap-1 text-[10px] text-[#31572c] font-bold hover:underline"
            >
              View All <ArrowRight className="h-3 w-3" />
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="text-[10px] text-slate-400 border-b border-slate-100 font-semibold uppercase tracking-wide">
                <th className="text-left py-2">Commodity</th>
                <th className="text-left py-2">Mandi</th>
                <th className="text-right py-2">Modal ₹</th>
                <th className="text-right py-2">Min ₹</th>
                <th className="text-right py-2">Max ₹</th>
                <th className="text-right py-2">Trend</th>
                <th className="text-right py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {prices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">No price data available</td>
                </tr>
              ) : (
                prices.map((p, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-[#f0f7ee]/50 transition-colors group">
                    <td className="py-2.5 font-bold text-slate-800">{p.commodity}</td>
                    <td className="py-2.5 text-slate-500">{p.mandiName}</td>
                    <td className="py-2.5 text-right font-black text-slate-800">₹{p.modalPrice?.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-slate-400">₹{p.minPrice?.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-slate-400">₹{p.maxPrice?.toLocaleString()}</td>
                    <td className="py-2.5 text-right">
                      <TrendBadge pct={p.trend === 'up' ? Math.abs(p.changePercent) : p.trend === 'down' ? -Math.abs(p.changePercent) : 0} />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => navigate(`/module/marketplace/sell?commodity=${encodeURIComponent(p.commodity)}&price=${p.modalPrice}&mandi=${encodeURIComponent(p.mandiName)}`)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[#31572c] hover:text-[#4a7c59] flex items-center gap-0.5 ml-auto"
                      >
                        Sell <ChevronRight className="h-2.5 w-2.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Quick Action Cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Compare Crops',
            sub:   'Multi-crop trend analysis',
            icon:  GitCompare,
            path:  'commodity-compare',
            color: 'bg-[#31572c]/10 text-[#31572c]',
            badge: `${withTrend.length} crops`,
          },
          {
            label: 'Set Price Alert',
            sub:   'Get notified on price change',
            icon:  Bell,
            path:  'price-alerts',
            color: 'bg-amber-500/10 text-amber-600',
          },
          {
            label: 'My Watchlist',
            sub:   'Track favourite commodities',
            icon:  Bookmark,
            path:  'watchlist',
            color: 'bg-violet-500/10 text-violet-600',
          },
          {
            label: 'Sell on Marketplace',
            sub:   'List your produce for buyers',
            icon:  Store,
            path:  '/module/marketplace/sell',
            color: 'bg-emerald-500/10 text-emerald-700',
            external: true,
          },
        ].map(({ label, sub, icon: Icon, path, color, external, badge }) => (
          <button
            key={label}
            onClick={() => navigate(external ? path : `/module/market-intelligence/${path}`)}
            className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 hover:border-[#31572c]/30 hover:shadow-md transition-all text-left group"
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-800 text-xs group-hover:text-[#31572c] transition-colors truncate">{label}</p>
              <p className="text-[10px] text-slate-400 truncate">{sub}</p>
            </div>
            {badge && (
              <span className="text-[9px] font-bold text-[#31572c] bg-[#31572c]/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

    </div>
  );
}
