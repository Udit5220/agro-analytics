import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, Bot, Activity, FileSpreadsheet, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getPortfolioAndSignals, getSpreadData } from '../../../services/commodityIntelligence.mock';

export default function CommodIqPowerMode({ onToggleMode }) {
  const [data, setData] = useState(null);
  const [spreadData, setSpreadData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcode Top Ticker
  const topTicker = [
    { name: 'Wheat', price: 2485, pct: 1.24 },
    { name: 'Chana', price: 5310, pct: -0.82 },
    { name: 'Soybean', price: 4720, pct: 2.10 },
    { name: 'Cotton', price: 58400, pct: -1.05 },
    { name: 'Turmeric', price: 14250, pct: 3.42 },
    { name: 'Jeera', price: 26800, pct: 0.65 },
    { name: 'Mustard', price: 6120, pct: -0.40 },
    { name: 'Sugar', price: 3890, pct: 0.95 },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [portfolioData, spread] = await Promise.all([
          getPortfolioAndSignals(),
          getSpreadData()
        ]);
        setData(portfolioData);
        setSpreadData(spread);
      } catch (err) {
        console.error("Failed to fetch power mode data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-[#0A0D14] min-h-screen font-sans text-slate-300 animate-fadeIn">
      {/* ── Top Ticker ── */}
      <div className="bg-[#0f141e] border-b border-[#1e293b] flex items-center px-4 py-1.5 text-xs font-bold font-mono tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
        {topTicker.map((t, i) => (
          <div key={i} className="flex items-center gap-2 mr-6">
            <span className="text-slate-400 uppercase">{t.name}</span>
            <span className="text-slate-200">₹{t.price.toLocaleString()}</span>
            <span className={t.pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
              {t.pct >= 0 ? '+' : ''}{t.pct}%
            </span>
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <header className="bg-[#0A0D14] border-b border-[#1e293b] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between sticky top-0 z-10 gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded text-[#0A0D14]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl text-white tracking-tight flex items-center gap-2">
              CommodIQ <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">Power Mode</span>
            </span>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="bg-[#141b2d] border border-[#2d3748] rounded-lg flex items-center px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-slate-200 ml-2 w-full" />
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm font-bold text-slate-400">
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors" onClick={onToggleMode}>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div> Standard View
          </span>
          <span className="flex items-center gap-1.5 cursor-pointer text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> LIVE RT</span>
          <div className="h-7 w-7 rounded-full bg-emerald-500 text-[#0A0D14] font-black flex items-center justify-center text-xs">RK</div>
        </div>
      </header>

      {/* ── Layout Grid ── */}
      <main className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:col-span-3 xl:col-span-2 space-y-6">
          {/* Watchlist */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 flex justify-between items-center border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">Watchlist</h4>
             </div>
             <div className="divide-y divide-[#1e293b]">
               {topTicker.map(w => (
                 <div key={w.name} className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-[#1a2336] transition-colors">
                   <div>
                     <p className="font-bold text-sm text-slate-300">{w.name}</p>
                     <p className="font-bold text-xs text-slate-500">₹{w.price.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${w.pct >= 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : w.pct < 0 ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                       {w.pct >= 0 ? 'BULL' : w.pct < 0 ? 'BEAR' : 'NEUT'}
                     </span>
                     <p className={`text-xs font-bold mt-1 ${w.pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{w.pct >= 0 ? '+' : ''}{w.pct}%</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* My Portfolio Summary */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-500" /> My Portfolio</h4>
             </div>
             <div className="p-4">
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Total Value</p>
               <p className="text-2xl font-black text-white mb-4">₹8,42,300</p>
               
               <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-slate-400">Day's P&L</span>
                 <span className="text-sm font-bold text-emerald-500">+₹12,450</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-400">Overall P&L</span>
                 <span className="text-sm font-bold text-emerald-500">+₹68,920</span>
               </div>
             </div>
          </div>
        </div>

        {/* ── CENTRAL MAIN AREA ── */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
          
          {/* Multi-Commodity Portfolio View */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
            <div className="bg-[#171f32] p-4 border-b border-[#1e293b] flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">Multi-Commodity Portfolio View</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#0f141e] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Commodity</th>
                    <th className="px-4 py-3">Exch</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Avg Buy</th>
                    <th className="px-4 py-3">LTP</th>
                    <th className="px-4 py-3">P&L ₹</th>
                    <th className="px-4 py-3">P&L %</th>
                    <th className="px-4 py-3">AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]">
                  {loading ? (
                    <tr><td colSpan="8" className="p-4 text-center text-slate-500">Loading portfolio...</td></tr>
                  ) : (
                    data?.portfolio?.map((p) => (
                      <tr key={p.id} className="hover:bg-[#1a2336] transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-200">{p.commodity}</td>
                        <td className="px-4 py-3 text-slate-400">{p.exchange}</td>
                        <td className="px-4 py-3 text-slate-300">{p.qty}</td>
                        <td className="px-4 py-3 text-slate-300">{p.avgBuy.toLocaleString()}</td>
                        <td className="px-4 py-3 text-white font-bold">{p.ltp.toLocaleString()}</td>
                        <td className={`px-4 py-3 font-bold ${p.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{p.pnl >= 0 ? '+' : ''}{p.pnl.toLocaleString()}</td>
                        <td className={`px-4 py-3 font-bold ${p.pnlPct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${p.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : p.signal === 'SELL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                            {p.signal}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spread Calculator */}
            <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#171f32] p-4 border-b border-[#1e293b]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">Spread Calculator</h3>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Commodity 1</p>
                    <select className="w-full bg-[#0f141e] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-slate-300 outline-none">
                      <option>MCX Chana</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Commodity 2</p>
                    <select className="w-full bg-[#0f141e] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-slate-300 outline-none">
                      <option>NCDEX Chana</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 flex justify-between items-center mb-4">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Spread</span>
                  <span className="text-xl font-black text-white">₹145<span className="text-sm text-slate-500 font-normal">/qtl</span></span>
                </div>

                <div className="flex-1 min-h-[100px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spreadData}>
                      <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                      <Line type="monotone" dataKey="spread" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">OPPORTUNITY</p>
                  <p className="text-[11px] text-emerald-600/70 mt-0.5">Spread above 3-month average</p>
                </div>
              </div>
            </div>

            {/* P&L Impact Calculator */}
            <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col">
              <div className="bg-[#171f32] p-4 border-b border-[#1e293b]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">P&L Impact Calculator</h3>
              </div>
              <div className="p-4 flex-1">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Quantity</p>
                    <input type="text" defaultValue="50" className="w-full bg-[#0f141e] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-white font-bold outline-none" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Entry Price</p>
                    <input type="text" defaultValue="2,410" className="w-full bg-[#0f141e] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-white font-bold outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Target Price</p>
                    <input type="text" defaultValue="2,600" className="w-full bg-[#0f141e] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-emerald-500 font-bold outline-none" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Stop Loss</p>
                    <input type="text" defaultValue="2,320" className="w-full bg-[#0f141e] border border-[#2d3748] rounded-lg px-3 py-2 text-sm text-rose-500 font-bold outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Profit</p>
                    <p className="text-sm font-black text-emerald-500">+₹9,500</p>
                  </div>
                  <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Max Loss</p>
                    <p className="text-sm font-black text-rose-500">-₹4,500</p>
                  </div>
                  <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">R:R</p>
                    <p className="text-sm font-black text-amber-500">2.1</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex gap-4 mt-2">
            <button className="flex-1 bg-[#111726] border border-[#1e293b] rounded-xl py-3 text-sm font-bold text-slate-300 hover:bg-[#1a2336] transition-colors flex justify-center items-center gap-2"><Download className="w-4 h-4"/> Export to Excel</button>
            <button className="flex-1 bg-[#111726] border border-[#1e293b] rounded-xl py-3 text-sm font-bold text-slate-300 hover:bg-[#1a2336] transition-colors flex justify-center items-center gap-2"><FileSpreadsheet className="w-4 h-4"/> Export to CSV</button>
            <button className="flex-1 bg-[#111726] border border-[#1e293b] rounded-xl py-3 text-sm font-bold text-slate-300 hover:bg-[#1a2336] transition-colors flex justify-center items-center gap-2"><RefreshCw className="w-4 h-4"/> API Data Feed</button>
            <button className="flex-1 bg-[#111726] border border-[#1e293b] rounded-xl py-3 text-sm font-bold text-slate-300 hover:bg-[#1a2336] transition-colors flex justify-center items-center gap-2"><Bell className="w-4 h-4"/> Set Alert</button>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-6">
          
          {/* AI Trading Signals */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><Bot className="w-4 h-4 text-emerald-500" /> AI Trading Signals</h4>
             </div>
             <div className="divide-y divide-[#1e293b]">
               {loading ? (
                 <div className="p-4 text-center text-slate-500 text-sm">Loading signals...</div>
               ) : (
                 data?.signals?.map((s, i) => (
                   <div key={i} className="p-4">
                     <div className="flex justify-between items-start mb-2">
                       <p className="text-sm font-bold text-white">{s.commodity}</p>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${s.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : s.signal === 'SELL' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                         {s.signal}
                       </span>
                     </div>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Confidence: {s.confidence}</p>
                     <p className="text-xs text-slate-300 leading-snug">{s.reasoning}</p>
                   </div>
                 ))
               )}
             </div>
          </div>

          {/* Active Alerts (reused style from standard view) */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b] flex justify-between items-center">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><Bell className="w-4 h-4 text-emerald-500" /> Active Alerts</h4>
             </div>
             <div className="p-2 space-y-2">
               <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 flex justify-between items-center">
                 <div>
                   <p className="text-xs font-bold text-emerald-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Wheat &gt; ₹2,480</p>
                   <p className="text-[10px] text-slate-500 mt-1">Triggered 12 min ago</p>
                 </div>
               </div>
               <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 flex justify-between items-center">
                 <div>
                   <p className="text-xs font-bold text-slate-300 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Cotton &lt; ₹58,000</p>
                   <p className="text-[10px] text-slate-500 mt-1">Watching</p>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
