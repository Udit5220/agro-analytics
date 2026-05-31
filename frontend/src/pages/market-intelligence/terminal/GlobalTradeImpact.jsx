import React, { useState } from 'react';
import { Globe, DollarSign, FileText, Anchor, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTradeData = [
  { country: 'Bangladesh', volume: 450, type: 'Export' },
  { country: 'Vietnam', volume: 320, type: 'Export' },
  { country: 'UAE', volume: 280, type: 'Export' },
  { country: 'Indonesia', volume: 190, type: 'Export' },
];

export default function GlobalTradeImpact() {
  const [activeTab, setActiveTab] = useState('import-export');

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">Global Trade Impact</h2>
          <p className="text-sm text-slate-400 mt-1">Analyze how international benchmarks, currency, and tariffs affect domestic prices.</p>
        </div>
        <select className="bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-1.5 focus:outline-none">
          <option>Wheat</option>
          <option>Cotton</option>
          <option>Soybean</option>
        </select>
      </div>

      <div className="flex gap-2 bg-[#1e293b] p-1 rounded-lg w-max flex-shrink-0">
        <button 
          onClick={() => setActiveTab('import-export')}
          className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${activeTab === 'import-export' ? 'bg-[#334155] text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <Globe className="h-4 w-4" /> Import / Export Flow
        </button>
        <button 
          onClick={() => setActiveTab('currency')}
          className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${activeTab === 'currency' ? 'bg-[#334155] text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <DollarSign className="h-4 w-4" /> Currency Impact
        </button>
        <button 
          onClick={() => setActiveTab('tariff')}
          className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${activeTab === 'tariff' ? 'bg-[#334155] text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <FileText className="h-4 w-4" /> Tariff & Duty Engine
        </button>
      </div>

      <div className="flex-1 bg-[#1e293b] border border-[#334155] rounded-xl p-6 overflow-y-auto">
        
        {/* ─── IMPORT / EXPORT TAB ────────────────────────────────────────── */}
        {activeTab === 'import-export' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0f172a] p-5 rounded border border-[#334155]">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Domestic Price (FOB)</div>
                <div className="text-2xl font-mono text-white font-black">₹2,480 <span className="text-sm text-slate-500 font-sans font-normal">/ qtl</span></div>
              </div>
              <div className="bg-[#0f172a] p-5 rounded border border-[#334155]">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Intl Benchmark (CIF)</div>
                <div className="text-2xl font-mono text-white font-black">₹2,350 <span className="text-sm text-slate-500 font-sans font-normal">/ qtl eq.</span></div>
              </div>
              <div className="bg-emerald-500/10 p-5 rounded border border-emerald-500/20">
                <div className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-2">Trade Viability</div>
                <div className="text-xl font-black text-emerald-400 uppercase">Export Viable</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Anchor className="h-4 w-4 text-indigo-400" />
                  Top Export Destinations (Current Month)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockTradeData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis type="category" dataKey="country" stroke="#64748b" tick={{fill: '#cbd5e1', fontSize: 12}} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                      <Bar dataKey="volume" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#0f172a] border border-[#334155] rounded p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trade Intelligence Note</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Domestic wheat prices are currently highly competitive in the South Asian market. Strong demand from Bangladesh is driving export volumes from eastern ports. A gap of ₹130/qtl exists against the international benchmark, making FOB shipments highly profitable.
                  </p>
                </div>
                <div className="text-center p-4 border border-dashed border-[#334155] rounded text-slate-500 text-sm">
                  Demo trade intelligence shown until live DGFT/APEDA data is connected.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── CURRENCY TAB ───────────────────────────────────────────────── */}
        {activeTab === 'currency' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f172a] p-6 rounded border border-[#334155] flex flex-col justify-center">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">USD / INR Spot Rate</div>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-mono text-white font-black">83.52</div>
                  <div className="text-emerald-400 font-bold mb-1">+0.15%</div>
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  A depreciating Rupee increases realization for exporters but raises the landed cost for edible oil importers.
                </p>
              </div>

              <div className="bg-[#0f172a] p-6 rounded border border-[#334155]">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Currency Impact on Commodity</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#1e293b] rounded">
                    <span className="text-slate-300">Net Export Margin Effect</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><ArrowRight className="h-4 w-4" /> Supportive</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1e293b] rounded">
                    <span className="text-slate-300">Import Cost Inflation</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1"><ArrowRight className="h-4 w-4" /> Marginal Increase</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TARIFF TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'tariff' && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-[#0f172a] border border-[#334155] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e293b] border-b border-[#334155]">
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">HS Code</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Basic Duty</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trade Restriction</th>
                    <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Impact Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]">
                  <tr className="hover:bg-[#334155]/30 text-sm">
                    <td className="p-4 font-bold text-white">Wheat</td>
                    <td className="p-4 font-mono text-slate-300">100199</td>
                    <td className="p-4 font-mono text-rose-400">40%</td>
                    <td className="p-4 text-amber-500 font-bold">Export Restricted</td>
                    <td className="p-4 text-slate-300">High duty strictly limits imports despite domestic shortfall.</td>
                  </tr>
                  <tr className="hover:bg-[#334155]/30 text-sm">
                    <td className="p-4 font-bold text-white">Cotton</td>
                    <td className="p-4 font-mono text-slate-300">120729</td>
                    <td className="p-4 font-mono text-slate-300">10%</td>
                    <td className="p-4 text-emerald-500 font-bold">None</td>
                    <td className="p-4 text-slate-300">Standard duty applies. OGL permissible.</td>
                  </tr>
                  <tr className="hover:bg-[#334155]/30 text-sm">
                    <td className="p-4 font-bold text-white">Soybean</td>
                    <td className="p-4 font-mono text-slate-300">120190</td>
                    <td className="p-4 font-mono text-slate-300">15%</td>
                    <td className="p-4 text-emerald-500 font-bold">None</td>
                    <td className="p-4 text-slate-300">Monitor crushing margin parity against imported edible oils.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#0f172a] p-5 rounded border border-[#334155]">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Cost Impact Estimate</h4>
              <p className="text-sm text-slate-400">
                A 40% BCD on Wheat implies a landed cost significantly higher than the domestic modal price, closing any arbitrage window for millers seeking imported stock.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
