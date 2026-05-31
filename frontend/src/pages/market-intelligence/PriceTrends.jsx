import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3 } from 'lucide-react';
import { commodityApi } from '../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const MANDIS = ['Indore', 'Nashik', 'Kota', 'Nagpur', 'Akola', 'Lasalgaon', 'Jaipur', 'Bhopal', 'Guntur', 'Rajkot'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-brand-darkest border border-slate-200 dark:border-brand-dark/40 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-bold text-slate-700 dark:text-white mb-1">{new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">₹{p.value?.toLocaleString()}/qtl ({p.name})</p>
      ))}
    </div>
  );
};

export default function PriceTrends() {
  const [commodity, setCommodity] = useState('Wheat');
  const [mandi, setMandi] = useState('Indore');
  const [days, setDays] = useState(30);
  const [trendData, setTrendData] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTrend = async () => {
    setLoading(true);
    try {
      const res = await commodityApi.getPriceTrends(commodity, mandi, days);
      const formatted = (res.data || []).map(d => ({
        ...d,
        date: new Date(d.priceDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        rawDate: d.priceDate,
      }));
      setTrendData(formatted);
      setSuggestion(res.suggestion?.text || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrend(); }, [commodity, mandi, days]);

  const latestPrice = trendData[trendData.length - 1];
  const firstPrice = trendData[0];
  const overallChange = latestPrice && firstPrice ? (((latestPrice.modalPrice - firstPrice.modalPrice) / firstPrice.modalPrice) * 100).toFixed(1) : 0;
  const isPositive = parseFloat(overallChange) >= 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Price Trends & Forecasting</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historical price trends with AI-assisted insights</p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Commodity</label>
            <select value={commodity} onChange={e => setCommodity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              {COMMODITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Mandi</label>
            <select value={mandi} onChange={e => setMandi(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              {MANDIS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Period</label>
            <select value={days} onChange={e => setDays(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Current Price', val: latestPrice ? `₹${latestPrice.modalPrice?.toLocaleString()}` : '--', sub: '/quintal' },
          { label: `${days}-day Change`, val: `${isPositive ? '+' : ''}${overallChange}%`, sub: 'vs period start', color: isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500' },
          { label: 'Period High', val: trendData.length ? `₹${Math.max(...trendData.map(d => d.maxPrice || 0)).toLocaleString()}` : '--', sub: 'Maximum price' },
          { label: 'Period Low', val: trendData.length ? `₹${Math.min(...trendData.filter(d => d.minPrice).map(d => d.minPrice)).toLocaleString()}` : '--', sub: 'Minimum price' },
        ].map(({ label, val, sub, color }) => (
          <div key={label} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className={`text-xl font-black mt-1 ${color || 'text-slate-800 dark:text-white'}`}>{val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Price Chart */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-white">{commodity} — {mandi} Mandi</h2>
          {loading && <RefreshCw className="h-4 w-4 text-brand-medium animate-spin" />}
        </div>
        {trendData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center"><BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-40" /><p>No data for this selection</p></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f772d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f772d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="modalPrice" name="Modal Price" stroke="#4f772d" fill="url(#modalGrad)" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="maxPrice" name="Max Price" stroke="#90a955" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="minPrice" name="Min Price" stroke="#ecf39e" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* AI Insight */}
      {suggestion && (
        <div className="bg-brand-medium/8 dark:bg-brand-dark/30 border border-brand-medium/20 dark:border-brand-medium/30 rounded-2xl p-5 flex items-start gap-3">
          <div className="h-8 w-8 rounded-xl bg-brand-medium/15 flex items-center justify-center flex-shrink-0">
            {isPositive ? <TrendingUp className="h-4 w-4 text-brand-medium dark:text-brand-accent" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
          </div>
          <div>
            <p className="text-xs font-bold text-brand-dark dark:text-brand-accent uppercase tracking-wider mb-1">Market Insight</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
