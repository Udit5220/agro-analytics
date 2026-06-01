import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, TrendingDown, Activity, Globe, MessageSquare, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { commodityApi } from '../../../services/apiService';

export default function Overview() {
  const { globalCommodity, currency } = useOutletContext() || { globalCommodity: 'Wheat', currency: { rate: 83.52, loading: false } };
  const [data, setData] = useState({ topRising: [], topFalling: [], summary: {} });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch KPI data once
  useEffect(() => {
    async function fetchKpis() {
      try {
        const res = await commodityApi.getDashboard();
        setData(res.data || { topRising: [], topFalling: [], summary: {} });
      } catch (e) {
        console.error('Failed to fetch dashboard data:', e);
      }
    }
    fetchKpis();
  }, []);

  // Fetch chart data when globalCommodity changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!globalCommodity) return;
      try {
        setLoading(true);
        const trendRes = await commodityApi.getPriceTrends(globalCommodity, 'all', 30);
        if (trendRes.data) {
          // Map and deduplicate by date to prevent chart looping
          const raw = trendRes.data.map(d => ({
            time: new Date(d.priceDate).getTime(),
            label: new Date(d.priceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: d.modalPrice,
          })).sort((a, b) => a.time - b.time);

          const unique = [];
          for (const item of raw) {
            const last = unique[unique.length - 1];
            if (last && last.label === item.label) {
              last.price = item.price; // or average it
            } else {
              unique.push(item);
            }
          }
          setChartData(unique);
        }
      } catch (e) {
        console.error('Failed to fetch trend data:', e);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [globalCommodity]);

  if (!data.summary.totalCommodities && loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Market Mood', value: data.summary.avgDailyChangePercent >= 0 ? 'Bullish' : 'Bearish', valueColor: data.summary.avgDailyChangePercent >= 0 ? 'text-emerald-500' : 'text-rose-500', icon: data.summary.avgDailyChangePercent >= 0 ? TrendingUp : TrendingDown },
          { label: 'Total Comm.', value: data.summary.totalCommodities || '--', valueColor: 'text-slate-200', icon: Activity },
          { label: 'Biggest Gainer', value: data.topRising[0] ? `${data.topRising[0]._id} +${data.topRising[0].changePercent}%` : '--', valueColor: 'text-emerald-500', icon: TrendingUp },
          { label: 'Biggest Loser', value: data.topFalling[0] ? `${data.topFalling[0]._id} ${data.topFalling[0].changePercent}%` : '--', valueColor: 'text-rose-500', icon: TrendingDown },
          { label: 'Total Mandis', value: data.summary.totalMandis || '--', valueColor: 'text-amber-500', icon: Activity },
          { 
            label: 'Currency Impact', 
            value: currency?.loading ? 'Loading...' : `USD/INR ${currency?.changePct >= 0 ? '+' : ''}${currency?.changePct?.toFixed(2)}%`, 
            valueColor: currency?.changePct >= 0 ? 'text-emerald-600' : 'text-rose-600', 
            icon: Globe 
          },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <kpi.icon className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">{kpi.label}</span>
            </div>
            <div className={`text-lg font-bold ${kpi.valueColor}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Multi-Commodity Trend */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 h-[400px] flex flex-col relative">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
              {globalCommodity || 'Commodity'} Price Movement - Last 30 Days
            </h3>
            {loading && (
               <div className="absolute inset-0 bg-[#1e293b]/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                 <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin" />
               </div>
            )}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPriceDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={'#334155'} vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} minTickGap={20} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} domain={['dataMin - 50', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#cbd5e1', fontWeight: 'bold' }}
                    formatter={v => [`₹${v}`, globalCommodity]}
                  />
                  <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPriceDashboard)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Top Gainers</h3>
              <div className="space-y-3">
                {data.topRising.length > 0 ? data.topRising.slice(0, 5).map(c => (
                  <div key={c._id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{c._id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-200 font-mono">₹{c.modalPrice}</span>
                      <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">+{c.changePercent}%</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-slate-500 text-sm">No data available</div>
                )}
              </div>
            </div>
            
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Top Losers</h3>
              <div className="space-y-3">
                {data.topFalling.length > 0 ? data.topFalling.slice(0, 5).map(c => (
                  <div key={c._id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{c._id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-200 font-mono">₹{c.modalPrice}</span>
                      <span className="text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">{c.changePercent}%</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-slate-500 text-sm">No data available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] border border-[#334155] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MessageSquare className="h-24 w-24 text-emerald-500" />
            </div>
            <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Market Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 relative z-10">
              The broader agricultural market is currently exhibiting a <span className="text-emerald-600 font-bold">Bullish</span> momentum, led primarily by Sugar and Soybean complexes. 
              <br/><br/>
              Wheat prices are finding strong support at ₹2300 amidst stable arrival volumes, while Cotton continues to face downward pressure due to weaker global cues and higher domestic arrivals.
              <br/><br/>
              The slight depreciation in the Rupee (USD/INR at 83.52) is providing a buffer for export-oriented commodities like Cotton and Soybean meal.
            </p>
            <div className="bg-[#0A0D14] rounded p-3 border border-[#334155] mt-6">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Suggested Focus</span>
              <span className="text-sm text-slate-200">Monitor Soybean spread expansion and Wheat resistance at ₹2400.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
