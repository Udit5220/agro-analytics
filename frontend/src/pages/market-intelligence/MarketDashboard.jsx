import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Store, Bell, Bookmark, BarChart3, RefreshCw, ArrowRight, Sprout } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { commodityApi } from '../../services/apiService';

const TrendBadge = ({ trend, pct }) => {
  if (trend === 'up') return <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold"><TrendingUp className="h-3 w-3" />+{Math.abs(pct)}%</span>;
  if (trend === 'down') return <span className="inline-flex items-center gap-1 text-red-500 text-xs font-bold"><TrendingDown className="h-3 w-3" />-{Math.abs(pct)}%</span>;
  return <span className="inline-flex items-center gap-1 text-slate-400 text-xs font-bold"><Minus className="h-3 w-3" />0%</span>;
};

const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 flex items-start gap-4">
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
      <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default function MarketDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dash, priceRes] = await Promise.all([
        commodityApi.getDashboard(),
        commodityApi.getMandiPrices({ limit: 8 }),
      ]);
      setData(dash.data);
      setPrices(priceRes.data || []);
    } catch (e) {
      setError('Unable to load market data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="h-8 w-8 text-brand-medium animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading market data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl p-6 text-center max-w-lg mx-auto mt-8">
      <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
      <button onClick={fetchData} className="mt-4 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">Retry</button>
    </div>
  );

  const { topRising = [], topFalling = [], summary = {} } = data || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Commodity Market Intelligence</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live mandi prices, trends &amp; insights across India</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-brand-medium/10 hover:bg-brand-medium/20 text-brand-medium dark:text-brand-accent rounded-xl text-sm font-semibold transition-colors">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Commodities Tracked" value={summary.totalCommodities || 10} icon={Sprout} color="bg-brand-medium/10 text-brand-medium dark:text-brand-accent" />
        <StatCard label="Mandis Active" value={summary.totalMandis || 10} icon={Store} color="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
        <StatCard label="Price Records" value={(summary.totalPriceRecords || 0).toLocaleString()} icon={BarChart3} color="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard label="Avg. Daily Change" value={`${summary.avgDailyChangePercent >= 0 ? '+' : ''}${summary.avgDailyChangePercent || 0}%`} sub="Today's movement" icon={TrendingUp} color={`${summary.avgDailyChangePercent >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'} dark:text-white`} />
      </div>

      {/* Top Rising & Falling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rising */}
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Top Rising</h2>
          </div>
          {topRising.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No rising data today</p>
          ) : (
            <div className="space-y-3">
              {topRising.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-brand-dark/20 last:border-0">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{c._id}</p>
                    <p className="text-xs text-slate-400">{c.mandiName} — ₹{c.modalPrice}/qtl</p>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">+{c.maxChange?.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Falling */}
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Top Falling</h2>
          </div>
          {topFalling.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No falling data today</p>
          ) : (
            <div className="space-y-3">
              {topFalling.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-brand-dark/20 last:border-0">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{c._id}</p>
                    <p className="text-xs text-slate-400">{c.mandiName} — ₹{c.modalPrice}/qtl</p>
                  </div>
                  <span className="text-red-500 font-bold text-sm">{c.minChange?.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Prices Table */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">Recent Mandi Prices</h2>
          <button onClick={() => navigate('/module/market-intelligence/live-prices')} className="text-sm text-brand-medium dark:text-brand-accent font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-slate-100 dark:border-brand-dark/20">
                <th className="text-left py-2 font-semibold">Commodity</th>
                <th className="text-left py-2 font-semibold">Mandi</th>
                <th className="text-right py-2 font-semibold">Modal ₹</th>
                <th className="text-right py-2 font-semibold">Min ₹</th>
                <th className="text-right py-2 font-semibold">Max ₹</th>
                <th className="text-right py-2 font-semibold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p, i) => (
                <tr key={i} className="border-b border-slate-50 dark:border-brand-dark/10 hover:bg-slate-50 dark:hover:bg-brand-dark/10 transition-colors">
                  <td className="py-2.5 font-semibold text-slate-800 dark:text-white">{p.commodity}</td>
                  <td className="py-2.5 text-slate-500 dark:text-slate-400">{p.mandiName}</td>
                  <td className="py-2.5 text-right font-bold text-slate-800 dark:text-white">₹{p.modalPrice?.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-slate-500">₹{p.minPrice?.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-slate-500">₹{p.maxPrice?.toLocaleString()}</td>
                  <td className="py-2.5 text-right"><TrendBadge trend={p.trend} pct={Math.abs(p.changePercent)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Set Price Alert', sub: 'Get notified when prices change', icon: Bell, path: 'price-alerts', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          { label: 'My Watchlist', sub: 'Track your favorite commodities', icon: Bookmark, path: 'watchlist', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
          { label: 'Sell on Marketplace', sub: 'List your produce for buyers', icon: Store, path: '/module/marketplace/sell', color: 'bg-brand-medium/10 text-brand-medium dark:text-brand-accent', external: true },
        ].map(({ label, sub, icon: Icon, path, color, external }) => (
          <button key={label} onClick={() => navigate(external ? path : `/module/market-intelligence/${path}`)}
            className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 flex items-center gap-4 hover:border-brand-medium/40 hover:shadow-md transition-all text-left group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="h-5 w-5" /></div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-brand-medium dark:group-hover:text-brand-accent transition-colors">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
