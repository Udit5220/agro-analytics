import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, Bot, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Target, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getTraderNewsAndAlerts, getMockMSPData } from '../../../services/commodityIntelligence.mock';
import { analyticsApi } from '../../../services/apiService';

const fmtDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

export default function CommodIqView({ selectedCommodity, onCommodityChange, onToggleMode }) {
  const [activeTab, setActiveTab] = useState('Spot Price');
  const [traderData, setTraderData] = useState(null);
  const [msp, setMsp] = useState(2015);
  const [trendData, setTrendData] = useState([]);
  const [spotPrice, setSpotPrice] = useState(2180);
  const [priceChange, setPriceChange] = useState({ value: 42, pct: 1.97 });
  const [loading, setLoading] = useState(true);

  // Hardcode Top Ticker
  const topTicker = [
    { name: 'Wheat', price: 2180, pct: 1.2 },
    { name: 'Chana', price: 5420, pct: -0.8 },
    { name: 'Soybean', price: 4890, pct: 2.1 },
    { name: 'Cotton', price: 62500, pct: 0.4 },
    { name: 'Turmeric', price: 14200, pct: -1.5 },
    { name: 'Crude Palm', price: 890, pct: 0.9 },
  ];

  // Hardcode Watchlist and Mandi list to match screenshots
  const watchlist = [
    { name: 'Wheat', price: 2180, pct: 1.2 },
    { name: 'Chana', price: 5420, pct: -0.8 },
    { name: 'Soybean', price: 4890, pct: 2.1 },
    { name: 'Cotton', price: 62500, pct: 0.4 },
    { name: 'Turmeric', price: 14200, pct: -1.5 },
    { name: 'Palm Oil', price: 890, pct: 0.9 },
    { name: 'Maize', price: 2090, pct: 0.6 }
  ];

  const mandis = [
    { name: 'Khanna', price: 2210, up: true },
    { name: 'Karnal', price: 2195, up: true },
    { name: 'Indore', price: 2160, up: false },
    { name: 'Kota', price: 2145, up: true },
    { name: 'Ujjain', price: 2130, up: false }
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [news, mspData, compare] = await Promise.all([
          getTraderNewsAndAlerts(selectedCommodity),
          getMockMSPData(selectedCommodity),
          analyticsApi.compare(selectedCommodity, 30)
        ]);

        setTraderData(news);
        setMsp(mspData);
        
        const seriesData = compare?.data?.series?.[selectedCommodity]?.data || [];
        if (seriesData.length > 0) {
          setTrendData(seriesData.map(d => ({ date: d.date, price: d.price })));
          const last = seriesData[seriesData.length - 1];
          const first = seriesData[0];
          setSpotPrice(last.price);
          setPriceChange({
            value: last.price - first.price,
            pct: first.price ? ((last.price - first.price) / first.price * 100) : 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch trader data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCommodity]);

  return (
    <div className="bg-[#0A0D14] min-h-screen font-sans text-slate-300 animate-fadeIn">
      {/* ── Top Ticker ── */}
      <div className="bg-[#0f141e] border-b border-[#1e293b] flex items-center px-4 py-1.5 text-xs font-bold font-mono tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-2 mr-6 text-amber-500">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> LIVE
        </div>
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
          <div className="bg-amber-500 p-1.5 rounded text-[#0A0D14]">
            <Activity className="w-5 h-5" />
          </div>
          <span className="font-black text-xl text-white tracking-tight">CommodIQ</span>
          <span className="ml-2 text-[10px] uppercase font-bold tracking-widest text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10 cursor-pointer" onClick={onToggleMode}>Power Mode</span>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="bg-[#141b2d] border border-[#2d3748] rounded-lg flex items-center px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search 100+ commodities..." className="bg-transparent border-none outline-none text-sm text-slate-200 ml-2 w-full placeholder-slate-600" />
          </div>
        </div>

        <div className="flex items-center gap-5 text-sm font-bold text-slate-400">
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"><StarIcon /> Watchlist</span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"><Bell className="w-4 h-4" /> Alerts</span>
          <button className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20">
            <Bot className="w-4 h-4" /> AI Chat
          </button>
          <Settings className="w-4 h-4 cursor-pointer hover:text-white" />
          <div className="h-7 w-7 rounded-full bg-amber-500 text-[#0A0D14] font-black flex items-center justify-center text-xs">RK</div>
        </div>
      </header>

      {/* ── Layout Grid ── */}
      <main className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:col-span-3 xl:col-span-2 space-y-6">
          
          {/* Watchlist */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 flex justify-between items-center border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><StarIcon /> Watchlist</h4>
               <span className="text-slate-500 cursor-pointer">+</span>
             </div>
             <div className="divide-y divide-[#1e293b]">
               {watchlist.map(w => (
                 <div key={w.name} onClick={() => onCommodityChange(w.name)} className={`px-4 py-3 flex justify-between items-center cursor-pointer transition-colors ${selectedCommodity === w.name ? 'bg-[#1e293b]' : 'hover:bg-[#1a2336]'}`}>
                   <div>
                     <p className={`font-bold text-sm ${selectedCommodity === w.name ? 'text-white' : 'text-slate-300'}`}>{w.name}</p>
                   </div>
                   <div className="text-right">
                     <p className={`font-bold text-sm ${selectedCommodity === w.name ? 'text-white' : 'text-slate-300'}`}>₹{w.price.toLocaleString()}</p>
                     <p className={`text-xs font-bold ${w.pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{w.pct >= 0 ? '+' : ''}{w.pct}%</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Mandi Prices */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-500" /> Mandi Prices</h4>
               <p className="text-[10px] text-slate-500 mt-1 uppercase">Top mandis - {selectedCommodity}</p>
             </div>
             <div className="divide-y divide-[#1e293b] p-2">
               {mandis.map((m, i) => (
                 <div key={i} className="px-2 py-2.5 flex justify-between items-center hover:bg-[#1a2336] rounded-lg transition-colors">
                   <p className="font-semibold text-xs text-slate-300">{m.name}</p>
                   <div className="flex items-center gap-2">
                     <p className="font-bold text-xs text-white">₹{m.price.toLocaleString()}</p>
                     {m.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-rose-500" />}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* ── CENTRAL MAIN AREA ── */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
          
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden flex flex-col flex-1">
            
            {/* Main Header inside Card */}
            <div className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-black text-white">{selectedCommodity}</h2>
                    <div className="flex gap-1.5">
                      {['NCDEX', 'Spot', 'MCX'].map(t => (
                        <span key={t} className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${t === 'Spot' ? 'bg-[#2d3748] text-white border-[#4a5568]' : 'bg-[#1a202c] text-slate-400 border-[#2d3748]'}`}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white">₹{spotPrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">/qtl</span>
                    <span className={`text-sm font-bold ml-2 flex items-center ${priceChange.value >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {priceChange.value >= 0 ? '+' : ''}₹{Math.abs(priceChange.value)} ({priceChange.value >= 0 ? '+' : ''}{priceChange.pct.toFixed(2)}%)
                      {priceChange.value >= 0 ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
                    </span>
                  </div>
                </div>
                
                {/* Timeframe Selector */}
                <div className="flex bg-[#1a202c] rounded-lg p-1 border border-[#2d3748]">
                  {['1D', '1W', '1M', '3M', '1Y', '5Y'].map(t => (
                    <button key={t} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${t === '1W' ? 'bg-[#2d3748] text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[350px] p-4 relative mt-4">
               {loading ? (
                 <div className="w-full h-full flex items-center justify-center">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                 </div>
               ) : (
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" tickFormatter={fmtDate} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} minTickGap={30} />
                      <YAxis domain={['dataMin - 100', 'dataMax + 100']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f141e', borderColor: '#2d3748', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      />
                      <ReferenceLine y={msp} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `MSP ₹${msp}`, fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#0f141e', strokeWidth: 2 }} />
                    </LineChart>
                 </ResponsiveContainer>
               )}
            </div>

            {/* AI Auto Commentary Box inside chart area */}
            <div className="m-6 mt-0 bg-[#162032] border border-blue-900/30 rounded-xl p-4 flex gap-4">
               <div className="bg-blue-600 p-2 rounded-lg text-white h-fit"><Bot className="w-5 h-5" /></div>
               <div>
                 <h4 className="text-sm font-bold text-blue-400 mb-1">AI Auto-Commentary</h4>
                 <p className="text-sm text-slate-300 leading-relaxed">
                   {selectedCommodity} prices are up {priceChange.pct.toFixed(1)}% this week due to FCI procurement surge in Punjab and Haryana. Arrivals are 18% below last year's pace, tightening near-term supply.
                 </p>
               </div>
            </div>

            {/* Bottom Tabs */}
            <div className="bg-[#171f32] border-t border-[#1e293b] flex overflow-x-auto no-scrollbar">
              {['Spot Price', 'Futures', 'Spread Analysis', 'Seasonal', 'Compare', 'AI Forecast'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${activeTab === t ? 'text-amber-500 border-amber-500 bg-[#1e293b]' : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#1a2336]'}`}
                >
                  {t}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-6">
          
          {/* AI Commentary Panel */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><Bot className="w-4 h-4 text-blue-400" /> AI Commentary</h4>
             </div>
             <div className="p-5 flex gap-4">
               <div className="bg-blue-600 p-2 rounded-full text-white h-fit mt-1"><Bot className="w-4 h-4" /></div>
               <div>
                 <p className="text-sm text-slate-300 leading-relaxed font-medium">
                   {loading ? 'Analyzing market conditions...' : traderData?.aiCommentary}
                 </p>
               </div>
             </div>
             <div className="px-5 pb-5">
                <div className="bg-[#0f141e] border border-[#2d3748] rounded-lg flex items-center px-3 py-2">
                  <input type="text" placeholder={`Ask AI about ${selectedCommodity}...`} className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder-slate-600" />
                </div>
             </div>
          </div>

          {/* News Feed */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b]">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4 text-amber-500" /> News Feed</h4>
             </div>
             <div className="divide-y divide-[#1e293b]">
               {loading ? (
                 [1,2,3].map(i => <div key={i} className="h-20 animate-pulse bg-[#162032] m-2 rounded-lg"></div>)
               ) : (
                 traderData?.news?.map(n => (
                   <div key={n.id} className="p-4 hover:bg-[#1a2336] transition-colors cursor-pointer group">
                     <p className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors leading-snug">{n.title}</p>
                     <div className="flex justify-between items-center mt-3">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{n.source} · {n.time}</p>
                       {n.sentiment && (
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1 ${n.sentiment === 'BULLISH' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-rose-500/10 text-rose-500 border-rose-500/30'}`}>
                           {n.sentiment} {n.sentimentValue}
                         </span>
                       )}
                     </div>
                   </div>
                 ))
               )}
             </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-[#111726] border border-[#1e293b] rounded-xl overflow-hidden">
             <div className="bg-[#171f32] px-4 py-3 border-b border-[#1e293b] flex justify-between items-center">
               <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2"><Bell className="w-4 h-4 text-amber-500" /> Active Alerts</h4>
             </div>
             <div className="p-2 space-y-2">
               {loading ? null : (
                 traderData?.alerts?.map(a => (
                   <div key={a.id} className="bg-[#0f141e] border border-[#2d3748] rounded-lg p-3 flex justify-between items-center">
                     <div>
                       <p className="text-xs font-bold text-slate-200">{a.text}</p>
                       <p className="text-[10px] text-slate-500 mt-1">{a.subtext}</p>
                     </div>
                     {a.status === 'active' ? (
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Active</span>
                     ) : (
                       <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider bg-slate-500/10 text-slate-400 border-slate-500/30">Watching</span>
                     )}
                   </div>
                 ))
               )}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Icon helper
const StarIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>;
