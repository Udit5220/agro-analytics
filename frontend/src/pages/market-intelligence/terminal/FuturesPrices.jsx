import React from 'react';
import { Activity, Clock, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockFuturesData = [
  { contract: 'Wheat Jun', expiry: '28 Jun', price: 2410, change: 1.2, volume: '12.4K', signal: 'Bullish' },
  { contract: 'Wheat Jul', expiry: '28 Jul', price: 2455, change: 1.5, volume: '9.8K', signal: 'Premium' },
  { contract: 'Wheat Aug', expiry: '28 Aug', price: 2480, change: 1.7, volume: '7.2K', signal: 'Premium' },
  { contract: 'Wheat Sep', expiry: '28 Sep', price: 2510, change: 2.1, volume: '4.1K', signal: 'Strong' },
];

const mockCurveData = [
  { month: 'Jun', price: 2410 },
  { month: 'Jul', price: 2455 },
  { month: 'Aug', price: 2480 },
  { month: 'Sep', price: 2510 },
  { month: 'Oct', price: 2525 },
];

export default function FuturesPrices() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Futures Price Board</h2>
          <p className="text-sm text-slate-400 mt-1">Track active derivative contracts and futures curves for investment decisions.</p>
        </div>
        <select className="bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-1.5 focus:outline-none">
          <option>Wheat (NCDEX)</option>
          <option>Cotton (MCX)</option>
          <option>Soybean (NCDEX)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Contract Table */}
        <div className="xl:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              Active Contracts
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f172a] border-b border-[#334155]">
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Contract</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Future Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Change %</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Volume</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {mockFuturesData.map((c) => (
                  <tr key={c.contract} className="hover:bg-[#334155]/30">
                    <td className="p-3">
                      <div className="font-bold text-white">{c.contract}</div>
                    </td>
                    <td className="p-3 text-slate-400 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {c.expiry}
                    </td>
                    <td className="p-3 text-right font-mono text-white font-bold text-base">₹{c.price}</td>
                    <td className="p-3 text-right font-mono">
                      <span className={`text-xs font-bold ${c.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {c.change >= 0 ? '+' : ''}{c.change}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">{c.volume}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded bg-[#334155] text-slate-300 text-xs font-bold uppercase tracking-wider">
                        {c.signal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Futures Curve */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-emerald-500" />
              Futures Curve (Contango)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockCurveData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} domain={['dataMin - 50', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-amber-500/30 rounded-xl p-5">
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Rollover Analytics
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              The market is in <strong className="text-emerald-400">Contango</strong>. Future prices are progressively higher than spot prices. 
            </p>
            <div className="bg-[#0A0D14] p-3 rounded border border-[#334155] flex justify-between items-center">
              <span className="text-slate-400 text-sm">Implied Carry Return</span>
              <span className="text-emerald-500 font-bold font-mono">1.2% / month</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
