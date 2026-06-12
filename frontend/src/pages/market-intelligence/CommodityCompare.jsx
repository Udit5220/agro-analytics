import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare, TrendingUp, TrendingDown, Minus, RefreshCw, ChevronDown,
  X, ArrowLeft, Info, Activity, BarChart3, Zap, Store, AlertCircle,
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { analyticsApi } from '../../services/apiService';

// ─── Palette ──────────────────────────────────────────────────────────────────
const PALETTE = ['#31572c', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
const PALETTE_LIGHT = ['#31572c20', '#3b82f620', '#f59e0b20', '#8b5cf620', '#ef444420'];



// ─── Signal pill ──────────────────────────────────────────────────────────────
const SignalPill = ({ signal }) => {
  const cfg = {
    strong_buy: { label: '🟢 Strong Sell Now', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    buy:        { label: '📈 Good to Sell',    cls: 'bg-green-50 text-green-700 border-green-200'        },
    stable:     { label: '⚖️ Stable',           cls: 'bg-slate-100 text-slate-600 border-slate-200'       },
    caution:    { label: '⚠️ Monitor',          cls: 'bg-amber-50 text-amber-700 border-amber-200'        },
    hold:       { label: '🔴 Hold & Store',     cls: 'bg-red-50 text-red-700 border-red-200'              },
    neutral:    { label: '—  Neutral',          cls: 'bg-slate-50 text-slate-400 border-slate-200'        },
  };
  const c = cfg[signal] || cfg.neutral;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.cls}`}>
      {c.label}
    </span>
  );
};

// ─── Stat mini card ───────────────────────────────────────────────────────────
const StatMini = ({ label, value, sub, color = 'text-slate-800' }) => (
  <div className="text-center">
    <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
    <p className={`text-sm font-black ${color} leading-tight mt-0.5`}>{value ?? '—'}</p>
    {sub && <p className="text-[9px] text-slate-400">{sub}</p>}
  </div>
);

// ─── Tooltip ─────────────────────────────────────────────────────────────────
const CompareTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <p className="font-bold text-slate-600 mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold leading-relaxed">
          {p.name}: {p.value?.toFixed(1)} <span className="text-slate-400 font-normal">(idx 100 = start)</span>
        </p>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CommodityCompare() {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────────────────
  const [allMeta,   setAllMeta]   = useState([]);
  const [selected,  setSelected]  = useState(['Cotton', 'Wheat', 'Chana']);
  const [days,      setDays]      = useState(90);
  const [result,    setResult]    = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [dropOpen,  setDropOpen]  = useState(false);

  const DAY_OPTIONS = [
    { label: '7D',  value: 7   },
    { label: '30D', value: 30  },
    { label: '90D', value: 90  },
    { label: '180D',value: 180 },
    { label: '365D',value: 365 },
  ];

  // ── Load commodity meta (for dropdown) ───────────────────────────────────
  useEffect(() => {
    analyticsApi.getMeta({ type: 'agricultural' })
      .then(r => setAllMeta(r.data?.filter(c => c.hasTrend) || []))
      .catch(() => {})
      .finally(() => setMetaLoading(false));
  }, []);

  // ── Fetch comparison data ─────────────────────────────────────────────────
  const fetchCompare = useCallback(async () => {
    if (selected.length < 2) { setResult(null); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.compare(selected.join(','), days);
      setResult(res.data);
    } catch (e) {
      setError('Failed to load comparison data.');
    } finally {
      setLoading(false);
    }
  }, [selected, days]);

  useEffect(() => { fetchCompare(); }, [fetchCompare]);

  // ── Crop selection handlers ───────────────────────────────────────────────
  const toggleCrop = (name) => {
    setSelected(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : prev.length < 5 ? [...prev, name] : prev
    );
  };

  // ── Build chart data: merged by date ─────────────────────────────────────
  const chartData = React.useMemo(() => {
    if (!result?.series) return [];
    const dateMap = {};
    Object.entries(result.series).forEach(([name, s]) => {
      (s.data || []).forEach(d => {
        if (!dateMap[d.date]) dateMap[d.date] = { date: d.date };
        dateMap[d.date][name] = d.indexed;
      });
    });
    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [result]);

  // ── Format date for x-axis ────────────────────────────────────────────────
  const fmtDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/module/market-intelligence')}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-[#31572c]" />
              Multi-Crop Price Comparison
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select 2–5 crops · Prices normalized to index 100 at start for fair comparison
            </p>
          </div>
        </div>
        <button
          onClick={fetchCompare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark/10 hover:bg-brand-dark/20 text-[#31572c] rounded-xl text-xs font-bold transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">

          {/* Crop selector */}
          <div className="flex-1 min-w-[220px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
              Select Crops (2–5) · {selected.length} selected
            </label>
            <div className="relative">
              <button
                onClick={() => setDropOpen(d => !d)}
                className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-[#31572c]/40 transition-colors"
              >
                <span className="flex flex-wrap gap-1">
                  {selected.map((n, i) => (
                    <span
                      key={n}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white"
                      style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                    >
                      {n}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleCrop(n); }}
                        className="ml-0.5 hover:opacity-70"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  ))}
                  {selected.length === 0 && <span className="text-slate-400">Choose crops...</span>}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 ml-2 flex-shrink-0 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropOpen && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-2 max-h-60 overflow-y-auto">
                    <p className="text-[9px] text-slate-400 px-2 py-1 font-semibold uppercase tracking-wide">
                      Commodities with real trend data ({allMeta.length})
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {metaLoading ? (
                        <p className="text-xs text-slate-400 p-2 col-span-2">Loading...</p>
                      ) : (
                        allMeta.map(c => {
                          const isSelected = selected.includes(c.name);
                          const idx = selected.indexOf(c.name);
                          return (
                            <button
                              key={c.commodityId}
                              onClick={() => toggleCrop(c.name)}
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                                isSelected
                                  ? 'text-white'
                                  : 'text-slate-700 hover:bg-slate-50'
                              } ${!isSelected && selected.length >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
                              style={isSelected ? { backgroundColor: PALETTE[idx % PALETTE.length] } : {}}
                              disabled={!isSelected && selected.length >= 5}
                            >
                              <div
                                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: isSelected ? '#fff' : PALETTE[selected.length % PALETTE.length] }}
                              />
                              {c.name}
                              {c.hasFutures && <span className="text-[8px] opacity-70">F</span>}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 p-2 flex justify-end">
                    <button
                      onClick={() => setDropOpen(false)}
                      className="px-3 py-1 bg-brand-dark text-white text-xs font-bold rounded-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Days selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
              Time Period
            </label>
            <div className="flex gap-1">
              {DAY_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDays(value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    days === value
                      ? 'bg-brand-dark text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selected.length < 2 && (
          <div className="mt-3 flex items-center gap-2 text-amber-600 text-xs font-semibold">
            <Info className="h-3.5 w-3.5" />
            Select at least 2 crops to compare
          </div>
        )}
      </div>

      {/* ── Error ────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
          <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* ── Chart ────────────────────────────────────────────────────────── */}
      {selected.length >= 2 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Normalized Price Index</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                All crops start at 100 — shows % movement relative to start.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-[#31572c] animate-spin" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={fmtDate}
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  interval="preserveStartEnd"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={v => `${v}`}
                />
                <Tooltip content={<CompareTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                />
                {selected.map((name, i) => (
                  result?.series?.[name]?.data?.length ? (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={PALETTE[i % PALETTE.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ) : null
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No data for selected period
            </div>
          )}

          {/* Reference line at 100 note */}
          <p className="text-[9px] text-slate-400 mt-2">
            Index 100 = price at start of selected period. Values above 100 = price increased; below 100 = price decreased.
          </p>
        </div>
      )}

      {/* ── Per-commodity Stat Cards ──────────────────────────────────────── */}
      {result?.series && Object.keys(result.series).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(result.series).map(([name, s], i) => {
            const color = PALETTE[i % PALETTE.length];
            const stats = s.stats;
            return (
              <div key={name} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <h3 className="font-black text-slate-800 text-sm">{name}</h3>
                  </div>
                  <SignalPill signal={s.insight?.signal} />
                </div>

                {/* Stats grid */}
                {stats ? (
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-50">
                    <StatMini
                      label="Latest ₹"
                      value={`₹${stats.lastPrice?.toLocaleString()}`}
                      color="text-slate-800"
                    />
                    <StatMini
                      label={`${days}D Change`}
                      value={`${stats.changePct >= 0 ? '+' : ''}${stats.changePct}%`}
                      color={stats.changePct >= 0 ? 'text-emerald-600' : 'text-red-500'}
                    />
                    <StatMini
                      label="Volatility"
                      value={`${stats.volatility}%`}
                      color={stats.volatility > 15 ? 'text-red-500' : stats.volatility > 8 ? 'text-amber-600' : 'text-slate-600'}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-2">No price data</p>
                )}

                {/* AI Insight */}
                {s.insight?.text && (
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{s.insight.text}</p>
                )}

                {/* Records + mini actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                  <span className="text-[9px] text-slate-400">{s.records} records · {days}d window</span>
                  <button
                    onClick={() => navigate(`/module/marketplace/sell?commodity=${encodeURIComponent(name)}&price=${stats?.lastPrice || ''}`)}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#31572c] hover:text-[#4a7c59] transition-colors"
                  >
                    <Store className="h-3 w-3" /> Sell
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Compare Summary Banner ────────────────────────────────────────── */}
      {result?.summary && (
        <div className="bg-gradient-to-r from-[#31572c]/5 to-[#90be6d]/5 border border-[#31572c]/10 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#31572c]" />
            Market Intelligence Summary
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Rule-based · From real data</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: TrendingUp,
                label: 'Best to Sell Now',
                val: result.summary.bestToSell,
                sub: 'Highest current price',
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 border-emerald-200',
              },
              {
                icon: Activity,
                label: 'Strongest Trend',
                val: result.summary.strongestTrend,
                sub: 'Highest % gain in period',
                color: 'text-blue-600',
                bg: 'bg-blue-50 border-blue-200',
              },
              {
                icon: BarChart3,
                label: 'Most Volatile',
                val: result.summary.highestVolatility,
                sub: 'Higher risk · bigger swings',
                color: 'text-amber-600',
                bg: 'bg-amber-50 border-amber-200',
              },
            ].map(({ icon: Icon, label, val, sub, color, bg }) => (
              <div key={label} className={`${bg} border rounded-xl p-3 flex items-start gap-3`}>
                <Icon className={`h-4 w-4 ${color} mt-0.5 flex-shrink-0`} />
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
                  <p className={`text-base font-black ${color} leading-tight`}>{val || '—'}</p>
                  <p className="text-[9px] text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
