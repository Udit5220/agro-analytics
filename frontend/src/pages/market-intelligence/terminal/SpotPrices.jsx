import React from 'react';
import { MapPin, ArrowRight, BarChart2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockSpotData = [
  { mandi: 'Rajkot', min: 2200, max: 2400, modal: 2340, arrivals: 450, trend: '+1.2%' },
  { mandi: 'Indore', min: 2150, max: 2350, modal: 2280, arrivals: 320, trend: '+0.5%' },
  { mandi: 'Kota', min: 2250, max: 2450, modal: 2390, arrivals: 510, trend: '+1.8%' },
  { mandi: 'Karnal', min: 2100, max: 2300, modal: 2210, arrivals: 280, trend: '-0.4%' },
];

const mockVolumeData = [
  { date: 'Mon', volume: 1200 },
  { date: 'Tue', volume: 1450 },
  { date: 'Wed', volume: 1100 },
  { date: 'Thu', volume: 1600 },
  { date: 'Fri', volume: 1850 },
];

export default function SpotPrices() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Live Spot / Mandi Prices</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time physical market prices across major agricultural mandis.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-1.5 focus:outline-none">
            <option>Wheat</option>
            <option>Cotton</option>
            <option>Soybean</option>
          </select>
          <select className="bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-1.5 focus:outline-none">
            <option>All States</option>
            <option>Gujarat</option>
            <option>Madhya Pradesh</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Mandi Table */}
        <div className="xl:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-500" />
              Mandi Comparison
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f172a] border-b border-[#334155]">
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Mandi Location</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Min Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Max Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Modal Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Trend</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Arrivals (Qtl)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {mockSpotData.map((m) => (
                  <tr key={m.mandi} className="hover:bg-[#334155]/30">
                    <td className="p-3">
                      <div className="font-bold text-white">{m.mandi}</div>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">₹{m.min}</td>
                    <td className="p-3 text-right font-mono text-slate-400">₹{m.max}</td>
                    <td className="p-3 text-right font-mono text-white font-bold text-base">₹{m.modal}</td>
                    <td className="p-3 text-right font-mono">
                      <span className={`text-xs font-bold ${m.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {m.trend}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">{m.arrivals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Volume/Insights */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <BarChart2 className="h-4 w-4 text-emerald-500" />
              Arrival Volume (5 Days)
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Spot Intelligence
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Modal price in <strong>Kota</strong> is trading at a premium due to high mill demand.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <span>Arrivals in Karnal dropped 15% WoW, providing strong price support at ₹2200.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
