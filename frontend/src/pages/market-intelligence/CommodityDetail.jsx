import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, TrendingUp, TrendingDown, RefreshCw, BarChart3, MapPin,
  Activity, Store, Calendar, AlertCircle, Info, ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, AreaChart, Area,
} from 'recharts';
import { analyticsApi } from '../../services/apiService';

// ─── Design tokens ────────────────────────────────────────────────────────────
const GREEN = '#31572c';
const GREEN_LIGHT = '#90be6d';
const DETAIL_DAYS = 90; // lookback period for detail page stats

// ─── Source badge ─────────────────────────────────────────────────────────────
const SourceBadge = ({ source }) => {
  const map = {
    gl_futures: { label: 'FUTURES', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
    gl_mandi: { label: 'MANDI', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    empty: { label: 'SOURCE', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
  };
  const info = map[source] || map.empty;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${info.cls}`}>
      {info.label}
    </span>
  );
};

// ─── Signal pill ──────────────────────────────────────────────────────────────
const SignalPill = ({ signal }) => {
  const cfg = {
    strong_buy: { label: '🟢 Strong — Sell Now', cls: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    buy:        { label: '📈 Good to Sell',       cls: 'bg-green-50 text-green-700 border-green-200'        },
    stable:     { label: '⚖️ Stable',              cls: 'bg-slate-100 text-slate-600 border-slate-200'       },
    caution:    { label: '⚠️ Monitor',             cls: 'bg-amber-50 text-amber-700 border-amber-200'        },
    hold:       { label: '🔴 Hold & Store',        cls: 'bg-red-50 text-red-700 border-red-200'              },
    neutral:    { label: '—  Neutral',             cls: 'bg-slate-50 text-slate-400 border-slate-200'        },
  };
  const c = cfg[signal] || cfg.neutral;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${c.cls}`}>
      {c.label}
    </span>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-100 rounded-2xl p-5 shadow-sm ${className}`}>{children}</div>
);

// ─── Section title ────────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, source, sub }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#31572c]" />
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        {source && <SourceBadge source={source} />}
      </div>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5 ml-6">{sub}</p>}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CommodityDetail() {
  const navigate  = useNavigate();
  // Try to get commodity from params or query string
  const params    = useParams();
  const queryName = new URLSearchParams(window.location.search).get('commodity');
  const commodityName = params?.commodity || queryName || 'Cotton';

  // ── State ─────────────────────────────────────────────────────────────────
  const [futures,    setFutures]    = useState(null);
  const [seasonality,setSeasonality]= useState(null);
  const [spread,     setSpread]     = useState(null);
  const [compare,    setCompare]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Fetch all data for this commodity ────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [futRes, seasonRes, spreadRes, compareRes] = await Promise.allSettled([
        analyticsApi.getFutures(commodityName),
        analyticsApi.getSeasonality(commodityName),
        analyticsApi.getMandiSpread(commodityName),
        analyticsApi.compare(commodityName, 90),
      ]);

      if (futRes.status === 'fulfilled')    setFutures(futRes.value.data);
      if (seasonRes.status === 'fulfilled') setSeasonality(seasonRes.value.data);
      if (spreadRes.status === 'fulfilled') setSpread(spreadRes.value.data);
      if (compareRes.status === 'fulfilled') setCompare(compareRes.value.data);
    } catch (e) {
      setError('Failed to load commodity data.');
    } finally {
      setLoading(false);
    }
  }, [commodityName]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const mySeries = compare?.series?.[commodityName];
  const stats    = mySeries?.stats;
  const insight  = mySeries?.insight;

  // Futures: get change direction
  const futureContracts = futures?.contracts || [];
  const hasFutures = futureContracts.length > 0;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-slate-100 rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl" />)}
      </div>
      <div className="h-48 bg-slate-100 rounded-2xl" />
      <div className="h-48 bg-slate-100 rounded-2xl" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center gap-3 py-12">
      <AlertCircle className="h-8 w-8 text-red-400" />
      <p className="text-red-600 text-sm font-semibold">{error}</p>
      <button onClick={fetchAll} className="px-5 py-2 bg-brand-dark text-white rounded-xl text-sm font-bold">Retry</button>
    </div>
  );

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/module/market-intelligence')}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-800">{commodityName}</h1>
              {insight && <SignalPill signal={insight.signal} />}
              {mySeries && <SourceBadge source={mySeries.source} />}
            </div>
            {stats && (
              <p className="text-xs text-slate-500 mt-0.5">
                ₹{stats.lastPrice?.toLocaleString()}/qtl · {DETAIL_DAYS}d change: {stats.changePct >= 0 ? '+' : ''}{stats.changePct}% · Volatility: {stats.volatility}%
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => navigate(`/module/marketplace/sell?commodity=${encodeURIComponent(commodityName)}&price=${stats?.lastPrice || ''}`)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-[#4a7c59] transition-colors"
          >
            <Store className="h-3.5 w-3.5" /> Sell on Marketplace
          </button>
        </div>
      </div>

      {/* ── KPI Strip ─────────────────────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Current Price', value: `₹${stats.lastPrice?.toLocaleString()}`, sub: 'per Quintal', color: 'text-slate-800' },
            { label: '90D Change',    value: `${stats.changePct >= 0 ? '+' : ''}${stats.changePct}%`, sub: `₹${stats.changeRs?.toLocaleString()} moved`, color: stats.changePct >= 0 ? 'text-emerald-600' : 'text-red-500' },
            { label: 'Volatility',    value: `${stats.volatility}%`, sub: stats.volatility > 15 ? 'High risk' : 'Normal range', color: stats.volatility > 15 ? 'text-red-500' : 'text-slate-700' },
            { label: 'Avg Price',     value: `₹${stats.avgPrice?.toLocaleString()}`, sub: '90d average', color: 'text-slate-700' },
          ].map(({ label, value, sub, color }) => (
            <Card key={label} className="p-4">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
              <p className={`text-lg font-black ${color} leading-tight mt-0.5`}>{value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
            </Card>
          ))}
        </div>
      )}

      {/* ── AI Insight ──────────────────────────────────────────────────────── */}
      {insight?.text && (
        <div className="bg-gradient-to-r from-[#31572c]/5 to-[#90be6d]/5 border border-[#31572c]/10 rounded-2xl p-4 flex items-start gap-3">
          <Info className="h-4 w-4 text-[#31572c] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#31572c] mb-0.5">Market Intelligence</p>
            <p className="text-xs text-slate-600 leading-relaxed">{insight.text}</p>
          </div>
        </div>
      )}

      {/* ── Futures Contracts ─────────────────────────────────────────────── */}
      <Card>
        <SectionTitle
          icon={Activity}
          title="Futures Contracts"
          source={hasFutures ? 'gl_futures' : 'empty'}
          sub={hasFutures ? `Latest as of ${futures.latestDate} · Portal: ${futures.portal?.toUpperCase()}` : undefined}
        />
        {!hasFutures ? (
          <div className="flex items-center gap-2 py-4 text-slate-400 text-xs">
            <Info className="h-4 w-4 flex-shrink-0" />
            No futures data available for {commodityName}. Only commodities traded on MCX/NCDEX/CBOT have contract data.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[560px]">
              <thead>
                <tr className="text-[10px] text-slate-400 border-b border-slate-100 font-semibold uppercase tracking-wide">
                  <th className="text-left py-2">Contract</th>
                  <th className="text-right py-2">Last ₹</th>
                  <th className="text-right py-2">Change</th>
                  <th className="text-right py-2">Open</th>
                  <th className="text-right py-2">High</th>
                  <th className="text-right py-2">Low</th>
                  <th className="text-right py-2">Volume</th>
                  <th className="text-right py-2">OI</th>
                </tr>
              </thead>
              <tbody>
                {futureContracts.map((c, i) => {
                  const chg = c.changeInPrice;
                  const isUp = chg > 0;
                  const isDown = chg < 0;
                  return (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 font-bold text-slate-700">{c.contract}</td>
                      <td className="py-2.5 text-right font-bold text-slate-800">
                        {c.lastPrice != null ? c.lastPrice.toLocaleString() : '—'}
                      </td>
                      <td className={`py-2.5 text-right font-bold ${isUp ? 'text-emerald-600' : isDown ? 'text-red-500' : 'text-slate-400'}`}>
                        {chg != null ? `${isUp ? '+' : ''}${chg}` : '—'}
                      </td>
                      <td className="py-2.5 text-right text-slate-500">{c.openPrice ?? '—'}</td>
                      <td className="py-2.5 text-right text-slate-500">{c.highPrice ?? '—'}</td>
                      <td className="py-2.5 text-right text-slate-500">{c.lowPrice ?? '—'}</td>
                      <td className="py-2.5 text-right text-slate-400">{c.volume != null ? c.volume.toLocaleString() : '—'}</td>
                      <td className="py-2.5 text-right text-slate-400">{c.openInterest != null ? c.openInterest.toLocaleString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Seasonality + Mandi Spread ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Seasonality Chart */}
        <Card>
          <SectionTitle
            icon={Calendar}
            title="Monthly Price Pattern (Seasonality)"
            source={seasonality?.source}
            sub={seasonality?.note}
          />
          {seasonality?.monthly?.some(m => m.avgPrice) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={seasonality.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }}
                    formatter={(val, key) => key === 'avgPrice' ? [`₹${val?.toLocaleString()}/qtl`, 'Avg Price'] : [val, key]}
                  />
                  <Bar dataKey="avgPrice" name="Avg Price" radius={[3, 3, 0, 0]}>
                    {seasonality.monthly.map((entry, i) => {
                      const allPrices = seasonality.monthly.map(m => m.avgPrice || 0);
                      const maxP = Math.max(...allPrices);
                      return (
                        <Cell
                          key={i}
                          fill={entry.avgPrice && entry.avgPrice >= maxP * 0.95 ? GREEN : GREEN_LIGHT}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[9px] text-slate-400 mt-2">
                Dark bars = peak price months · {seasonality.filledMonths}/12 months with data · {seasonality.totalRecords} records
              </p>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-xs text-center">
              <div>
                <Calendar className="h-6 w-6 mx-auto mb-2 opacity-40" />
                <p>No seasonal data available for {commodityName}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Mandi Spread Panel */}
        <Card>
          <SectionTitle
            icon={MapPin}
            title="Mandi Price Spread"
            source={spread?.source}
            sub={spread?.spreadNote}
          />
          {spread?.mandis?.length ? (
            <>
              <div className="space-y-2">
                {spread.mandis.slice(0, 8).map((m, i) => {
                  const maxP = spread.mandis[0].modalPrice;
                  const pct  = maxP > 0 ? (m.modalPrice / maxP) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-20 text-[10px] font-semibold text-slate-600 truncate">{m.mandiName}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: m.spreadPct >= 0 ? GREEN : '#ef4444',
                          }}
                        />
                      </div>
                      <div className="text-right w-24 flex-shrink-0">
                        <span className="text-[10px] font-bold text-slate-700">₹{m.modalPrice?.toLocaleString()}</span>
                        <span className={`ml-1 text-[9px] font-semibold ${m.spreadPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {m.spreadPct >= 0 ? '+' : ''}{m.spreadPct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-50 grid grid-cols-3 text-center gap-2">
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold">Best Mandi</p>
                  <p className="text-xs font-black text-[#31572c]">{spread.bestMandi}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold">Spread</p>
                  <p className="text-xs font-black text-slate-700">₹{spread.spreadRange?.toLocaleString()}/qtl</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold">Avg Price</p>
                  <p className="text-xs font-black text-slate-700">₹{spread.avgPrice?.toLocaleString()}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-400 text-xs text-center">
              <div>
                <MapPin className="h-6 w-6 mx-auto mb-2 opacity-40" />
                <p>No mandi spread data for {commodityName}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Sell CTA ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#31572c] to-[#4a7c59] rounded-2xl p-5 flex items-center justify-between text-white shadow-sm">
        <div>
          <h3 className="font-black text-base">Ready to sell your {commodityName}?</h3>
          <p className="text-white/70 text-xs mt-0.5">
            {stats ? `Current price: ₹${stats.lastPrice?.toLocaleString()}/qtl` : 'Check live prices before listing'}
            {spread?.bestMandi ? ` · Best mandi: ${spread.bestMandi}` : ''}
          </p>
        </div>
        <button
          onClick={() => navigate(`/module/marketplace/sell?commodity=${encodeURIComponent(commodityName)}&price=${stats?.lastPrice || ''}&mandi=${encodeURIComponent(spread?.bestMandi || '')}`)}
          className="flex items-center gap-2 bg-white text-[#31572c] font-black text-sm px-5 py-2.5 rounded-xl hover:bg-[#f0f7ee] transition-colors flex-shrink-0"
        >
          <Store className="h-4 w-4" /> Sell Now <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
}
