import React from 'react';
import { TrendingUp, TrendingDown, Activity, Globe, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { time: '10:00', Wheat: 2320, Cotton: 58000, Soybean: 4200 },
  { time: '11:00', Wheat: 2325, Cotton: 58100, Soybean: 4220 },
  { time: '12:00', Wheat: 2335, Cotton: 58150, Soybean: 4250 },
  { time: '13:00', Wheat: 2330, Cotton: 58050, Soybean: 4270 },
  { time: '14:00', Wheat: 2340, Cotton: 58200, Soybean: 4280 },
];

export default function Overview() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Market Mood', value: 'Bullish', valueColor: 'text-emerald-500', icon: TrendingUp },
          { label: 'Most Active', value: 'Wheat', valueColor: 'text-white', icon: Activity },
          { label: 'Biggest Gainer', value: 'Sugar +3.2%', valueColor: 'text-emerald-500', icon: TrendingUp },
          { label: 'Biggest Loser', value: 'Cotton -1.4%', valueColor: 'text-rose-500', icon: TrendingDown },
          { label: 'Highest Spread', value: 'Soybean +₹240', valueColor: 'text-amber-500', icon: Activity },
          { label: 'Currency Impact', value: 'USD/INR +0.4%', valueColor: 'text-slate-300', icon: Globe },
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
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 h-[400px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Multi-Commodity Intraday Trend</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="Wheat" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Cotton" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Soybean" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Top Gainers</h3>
              <div className="space-y-3">
                {[
                  { name: 'Sugar', price: '₹3,850', change: '+3.2%' },
                  { name: 'Soybean', price: '₹4,280', change: '+2.6%' },
                  { name: 'Wheat', price: '₹2,340', change: '+1.2%' },
                ].map(c => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-mono">{c.price}</span>
                      <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{c.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Top Losers</h3>
              <div className="space-y-3">
                {[
                  { name: 'Cotton', price: '₹58,200', change: '-1.4%' },
                  { name: 'Chana', price: '₹5,900', change: '-1.1%' },
                  { name: 'Mustard', price: '₹5,100', change: '-0.8%' },
                ].map(c => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-mono">{c.price}</span>
                      <span className="text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 rounded">{c.change}</span>
                    </div>
                  </div>
                ))}
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
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              AI Market Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4 relative z-10">
              The broader agricultural market is currently exhibiting a <span className="text-emerald-400 font-bold">Bullish</span> momentum, led primarily by Sugar and Soybean complexes. 
              <br/><br/>
              Wheat prices are finding strong support at ₹2300 amidst stable arrival volumes, while Cotton continues to face downward pressure due to weaker global cues and higher domestic arrivals.
              <br/><br/>
              The slight depreciation in the Rupee (USD/INR at 83.52) is providing a buffer for export-oriented commodities like Cotton and Soybean meal.
            </p>
            <div className="bg-[#0A0D14] rounded p-3 border border-[#334155] mt-6">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Suggested Focus</span>
              <span className="text-sm text-white">Monitor Soybean spread expansion and Wheat resistance at ₹2400.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
