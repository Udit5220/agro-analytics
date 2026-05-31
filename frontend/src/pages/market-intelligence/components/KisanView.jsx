import React, { useState, useEffect } from 'react';
import { Mic, MapPin, TrendingUp, TrendingDown, Info, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getKisanAdvisory, getMockMSPData, getBestMandis } from '../../../services/commodityIntelligence.mock';
import { analyticsApi } from '../../../services/apiService';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const fmtDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { weekday: 'short' });
};

export default function KisanView({ selectedCommodity, onCommodityChange, onToggleMode }) {
  const [advisory, setAdvisory] = useState(null);
  const [msp, setMsp] = useState(2000);
  const [bestMandis, setBestMandis] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [spotPrice, setSpotPrice] = useState(2180);
  const [priceChange, setPriceChange] = useState({ value: 42, pct: 1.9 });
  const [loading, setLoading] = useState(true);

  // Hardcode "Indore" as per the screenshot
  const location = "Indore";
  const state = "Madhya Pradesh";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [adv, mspData, mandis, compare] = await Promise.all([
          getKisanAdvisory(selectedCommodity, location),
          getMockMSPData(selectedCommodity),
          getBestMandis(selectedCommodity, location),
          analyticsApi.compare(selectedCommodity, 7)
        ]);

        setAdvisory(adv);
        setMsp(mspData);
        setBestMandis(mandis);
        
        const seriesData = compare?.data?.series?.[selectedCommodity]?.data || [];
        if (seriesData.length > 0) {
          // Format for our area chart
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
        console.error("Failed to fetch kisan data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCommodity]);

  const mspDiff = spotPrice - msp;
  const mspDiffPct = (mspDiff / msp * 100).toFixed(1);
  const isAboveMsp = mspDiff >= 0;

  return (
    <div className="bg-[#f0f9f5] min-h-screen font-sans text-slate-800 pb-12 animate-fadeIn">
      {/* ── Header ── */}
      <header className="bg-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-lg text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="font-black text-xl text-emerald-800 tracking-tight">KisanMandi</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Search</span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg> Watchlist</span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Alerts</span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-emerald-600 transition-colors"><Cpu className="w-4 h-4" /> AI Chat</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">RK</div>
        </div>
      </header>

      {/* ── Top Bar ── */}
      <div className="bg-[#e2f1e8] border-b border-emerald-100/50 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 text-white p-1 rounded-md"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
              <h2 className="font-bold text-emerald-950 text-sm">Farmer View (Kisan Mode)</h2>
            </div>
            <p className="text-emerald-700/70 text-xs mt-0.5 ml-8">Simple & Local</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 bg-white/50 px-3 py-1.5 rounded-full border border-emerald-200/50">
            <span className="opacity-60 cursor-pointer" onClick={onToggleMode}>Trader View</span>
            <div className="w-8 h-4 bg-emerald-600 rounded-full relative cursor-pointer" onClick={onToggleMode}>
              <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
            <span>Kisan Mode</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        
        {/* ── Voice Input ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-2 pl-4 flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200">
            <Mic className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-slate-400 text-sm font-medium">Aaj mere gaon mein kya bhav hai? — Boliye ya type karein...</p>
            <p className="text-slate-300 text-[10px]">Ask in Hindi or English</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm">
            Poochiye
          </button>
        </div>

        {/* ── Location & Commodity Selection ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide uppercase text-emerald-800">My Location / Mera Sthaan</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{location}</h3>
            <p className="text-slate-500 text-sm">{state}</p>
            <svg className="w-4 h-4 text-slate-300 absolute top-5 right-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-5 relative">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
              <span className="text-xs font-bold tracking-wide uppercase text-amber-600">Selected Commodity / Fasal</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{selectedCommodity}</h3>
            <p className="text-slate-500 text-sm">
              {selectedCommodity === 'Wheat' ? 'Gehun (गेहूं)' : 
               selectedCommodity === 'Chana' ? 'Chana (चना)' : 
               selectedCommodity === 'Soybean' ? 'Soybean (सोयाबीन)' : 
               selectedCommodity === 'Cotton' ? 'Kapas (कपास)' : ''}
            </p>
            
            <select 
              value={selectedCommodity} 
              onChange={e => onCommodityChange(e.target.value)}
              className="absolute top-5 right-5 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Wheat">Change</option>
              <option value="Wheat">Wheat</option>
              <option value="Chana">Chana</option>
              <option value="Soybean">Soybean</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>
        </div>

        {/* ── Spot Price & MSP Indicator ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-emerald-800 mb-4">Aaj Ka Bhav — Today's Price</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#e2f1e8] flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{location} Mandi</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-800 tracking-tighter">₹{spotPrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-400">/qtl</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-lg ${priceChange.value >= 0 ? 'bg-emerald-100/50 text-emerald-600' : 'bg-red-100/50 text-red-500'}`}>
              {priceChange.value >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              {priceChange.value >= 0 ? '+' : ''}₹{Math.abs(priceChange.value)} <span className="text-xs font-bold opacity-70 mt-1">today</span>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${isAboveMsp ? 'bg-amber-50/50 border-amber-200/50 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <div className={`p-1.5 rounded-full mt-0.5 ${isAboveMsp ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[15px]">
                Aapka MSP: ₹{msp.toLocaleString()}/qtl — Aaj mandi mein ₹{Math.abs(mspDiff).toLocaleString()} {isAboveMsp ? 'ZYADA' : 'KAM'} mil raha hai! ({isAboveMsp ? '+' : '-'}{Math.abs(mspDiffPct)}%)
              </p>
              <p className="text-sm font-medium mt-1 flex items-center gap-1.5 opacity-80">
                <CheckCircle className="w-3.5 h-3.5" /> 
                {isAboveMsp ? 'Bechna faaydemand hai.' : 'Abhi rukna behtar ho sakta hai.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── 2-Column Section ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Best Mandis Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6 flex flex-col">
            <h4 className="text-sm font-bold text-emerald-800 mb-4 flex items-center gap-2">
              <Store className="w-4 h-4" /> Best Mandis to Sell
            </h4>
            
            <table className="w-full text-sm text-left mt-2">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-semibold w-1/3">Mandi</th>
                  <th className="pb-3 font-semibold text-center w-1/3">Distance</th>
                  <th className="pb-3 font-semibold text-right w-1/3">Price ₹/qtl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bestMandis.map((m, i) => (
                  <tr key={m.mandi} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-700">{m.mandi}</td>
                    <td className="py-3 text-center text-slate-500">{m.distance} km</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-black text-slate-800">₹{m.price.toLocaleString()}</span>
                        {m.tag && <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">{m.tag}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Advice & Trend */}
          <div className="space-y-4 flex flex-col">
            
            {/* AI Advice */}
            <div className="bg-[#f2f6ff] rounded-2xl shadow-sm border border-[#e5edff] p-6">
              <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                <div className="bg-blue-600 text-white p-1 rounded-md"><Cpu className="w-3.5 h-3.5" /></div> Kab Bechu? — When to Sell?
              </h4>
              {loading ? (
                <div className="h-20 animate-pulse bg-blue-100/50 rounded-xl"></div>
              ) : (
                <>
                  <p className="text-blue-950 font-bold leading-relaxed text-[15px]">
                    AI Salah: {advisory?.advice}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100/50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold">
                    <Info className="w-3.5 h-3.5" /> Confidence: {advisory?.confidence}%
                  </div>
                </>
              )}
            </div>

            {/* 7-Day Trend */}
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6 flex-1 flex flex-col">
               <h4 className="text-sm font-bold text-emerald-800 mb-1">
                 7-Day Price Trend — {selectedCommodity} ({location})
               </h4>
               <p className="text-[10px] text-slate-400 mb-4 uppercase tracking-wider font-semibold">₹/qtl</p>
               
               <div className="flex-1 w-full min-h-[140px] mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPriceKisan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" tickFormatter={fmtDate} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                      <YAxis domain={['dataMin - 50', 'dataMax + 50']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                        itemStyle={{ color: '#059669' }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorPriceKisan)" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

          </div>
        </div>

        {/* ── Samachar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-6">
          <h4 className="text-sm font-bold text-emerald-800 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg> 
            Samachar — News in Hindi
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
               [1,2].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-xl border border-slate-100"></div>)
            ) : (
               advisory?.news?.map((n, i) => (
                 <div key={n.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                   <div className="w-16 h-16 rounded-lg bg-[#e2f1e8] flex-shrink-0 flex items-center justify-center text-emerald-600">
                      {i === 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                   </div>
                   <div className="flex-1 py-1">
                     <h5 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors">{n.title}</h5>
                     <p className="text-[11px] text-slate-400 font-medium mt-1.5">{n.time} · {n.source}</p>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>

        {/* ── Footer / Language Switch ── */}
        <div className="flex flex-wrap items-center justify-between py-4 text-sm text-slate-500 font-semibold border-t border-emerald-100/50 mt-8">
           <div className="flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
             Bhasha / Language:
           </div>
           <div className="flex gap-2 mt-3 sm:mt-0">
             {['Hindi', 'English', 'Marathi', 'Punjabi', 'Telugu'].map((lang, i) => (
               <button key={lang} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-100/50'}`}>
                 {lang}
               </button>
             ))}
           </div>
        </div>

      </main>
    </div>
  );
}

// Dummy Store icon since we didn't import it at the top
const Store = (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
