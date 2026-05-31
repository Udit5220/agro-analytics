import React from 'react';
import { GitCompare, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockSpreadTrend = [
  { date: '1 Jun', spread: 150 },
  { date: '2 Jun', spread: 170 },
  { date: '3 Jun', spread: 140 },
  { date: '4 Jun', spread: 190 },
  { date: '5 Jun', spread: 230 },
  { date: '6 Jun', spread: 210 },
  { date: '7 Jun', spread: 250 },
];

const mockSpreadRanking = [
  { commodity: 'Soybean', spot: 4280, future: 4510, basis: -230, spread: 230, signal: 'Future Premium' },
  { commodity: 'Wheat', spot: 2340, future: 2410, basis: -70, spread: 70, signal: 'Future Premium' },
  { commodity: 'Sugar', spot: 3850, future: 3900, basis: -50, spread: 50, signal: 'Mild Premium' },
  { commodity: 'Cotton', spot: 58200, future: 57900, basis: 300, spread: -300, signal: 'Weak Future' },
];

export default function SpreadAnalysis() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Spread & Basis Analysis</h2>
          <p className="text-sm text-slate-400 mt-1">Identify arbitrage opportunities by comparing Spot vs Futures pricing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Spread Table */}
        <div className="xl:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0f172a]">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-emerald-500" />
              Spot vs Future Spread Ranking
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e293b] border-b border-[#334155]">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spot Price</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Nearest Future</th>
                  <th className="p-4 text-xs font-bold text-emerald-500 uppercase tracking-wider text-right">Spread</th>
                  <th className="p-4 text-xs font-bold text-amber-500 uppercase tracking-wider text-right">Basis</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {mockSpreadRanking.map((s) => (
                  <tr key={s.commodity} className="hover:bg-[#334155]/30">
                    <td className="p-4 font-bold text-white">{s.commodity}</td>
                    <td className="p-4 text-right font-mono text-slate-400">₹{s.spot}</td>
                    <td className="p-4 text-right font-mono text-slate-400">₹{s.future}</td>
                    <td className="p-4 text-right font-mono font-bold">
                      <span className={s.spread > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {s.spread > 0 ? '+' : ''}₹{s.spread}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <span className={s.basis > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {s.basis > 0 ? '+' : ''}₹{s.basis}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        s.spread > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {s.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Spread Chart & Formula */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Soybean Spread Trend
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSpreadTrend}>
                  <defs>
                    <linearGradient id="colorSpread" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="spread" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpread)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Formula Reference
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="p-3 bg-[#1e293b] rounded border border-[#334155]">
                <div className="text-slate-400 mb-1 font-sans text-xs uppercase tracking-wider">Spread</div>
                <div className="text-emerald-400">= Futures Price - Spot Price</div>
              </div>
              <div className="p-3 bg-[#1e293b] rounded border border-[#334155]">
                <div className="text-slate-400 mb-1 font-sans text-xs uppercase tracking-wider">Basis</div>
                <div className="text-amber-400">= Spot Price - Nearest Futures Price</div>
              </div>
              <p className="text-xs font-sans text-slate-500 mt-2">
                A widening positive spread indicates strong future demand (Contango), while a negative spread (Backwardation) indicates immediate spot shortage.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
