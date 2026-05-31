import React from 'react';
import { Target, Bell, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const mockWatchlist = [
  { id: 1, name: 'Wheat', spot: 2340, future: 2410, spread: 70, change: 1.2, signal: 'Bullish', spark: [10, 12, 15, 14, 18, 22] },
  { id: 2, name: 'Soybean', spot: 4280, future: 4510, spread: 230, change: 2.6, signal: 'Bullish', spark: [5, 8, 12, 20, 24, 28] },
  { id: 3, name: 'Cotton', spot: 58200, future: 57900, spread: -300, change: -0.7, signal: 'Bearish', spark: [30, 28, 25, 26, 22, 19] },
  { id: 4, name: 'Sugar', spot: 3850, future: 3900, spread: 50, change: 0.8, signal: 'Neutral', spark: [15, 15, 16, 15, 16, 17] },
  { id: 5, name: 'CPO', spot: 9300, future: 9350, spread: 50, change: 0.4, signal: 'Bullish', spark: [20, 22, 21, 23, 24, 25] },
];

export default function Watchlist() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Commodity Watchlist</h2>
          <p className="text-sm text-slate-400 mt-1">Track your saved commodities, spot vs futures spread, and market signals.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-semibold transition-colors">
          + Add to Watchlist
        </button>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f172a] border-b border-[#334155]">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">7D Trend</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spot Price</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Nearest Future</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spread</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Change %</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Market Signal</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {mockWatchlist.map((item) => (
              <tr key={item.id} className="hover:bg-[#334155]/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-xs text-slate-500">NCDEX</div>
                </td>
                <td className="p-4 w-32">
                  <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={item.spark.map((val, i) => ({ val, i }))}>
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke={item.change >= 0 ? '#10b981' : '#ef4444'} 
                          strokeWidth={2} 
                          dot={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>
                <td className="p-4 text-right font-mono text-slate-300">₹{item.spot.toLocaleString()}</td>
                <td className="p-4 text-right font-mono text-slate-300">₹{item.future.toLocaleString()}</td>
                <td className="p-4 text-right font-mono">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.spread > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.spread > 0 ? '+' : ''}₹{item.spread}
                  </span>
                </td>
                <td className="p-4 text-right font-mono">
                  <span className={`flex items-center justify-end gap-1 ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.change}%
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.signal === 'Bullish' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    item.signal === 'Bearish' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                  }`}>
                    <Target className="h-3 w-3" />
                    {item.signal}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-3 text-slate-400">
                    <button className="hover:text-amber-400 transition-colors" title="Set Alert"><Bell className="h-4 w-4" /></button>
                    <button className="hover:text-white transition-colors"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
