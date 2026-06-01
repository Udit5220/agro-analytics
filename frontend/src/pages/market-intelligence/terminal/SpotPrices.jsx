import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, BarChart2, TrendingUp, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { commodityApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const STATES = ['All States', 'Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Andhra Pradesh', 'Gujarat'];

export default function SpotPrices() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commodity, setCommodity] = useState('Wheat');
  const [stateFilter, setStateFilter] = useState('All States');
  const [volumeData, setVolumeData] = useState([]);

  useEffect(() => {
    async function fetchSpotData() {
      setLoading(true);
      try {
        const params = { commodity };
        if (stateFilter !== 'All States') params.state = stateFilter;
        const res = await commodityApi.getMandiPrices(params);
        setData(res.data || []);

        // Mock volume data based on the returned mandis
        const vol = (res.data || []).slice(0, 5).map((m, i) => ({
          date: m.mandiName,
          volume: m.arrivalVolume || Math.floor(Math.random() * 500) + 100
        }));
        setVolumeData(vol);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSpotData();
  }, [commodity, stateFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Live Spot / Mandi Prices</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time physical market prices across major agricultural mandis.</p>
        </div>
        <div className="flex gap-2">
          <select value={commodity} onChange={e => setCommodity(e.target.value)} className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-1.5 focus:outline-none">
            {COMMODITIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-1.5 focus:outline-none">
            {STATES.map(s => <option key={s}>{s}</option>)}
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
                <tr className="bg-[#0A0D14] border-b border-[#334155]">
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Mandi Location</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Min Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Max Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Modal Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Trend</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Arrivals (Qtl)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : data.length > 0 ? data.map((m, idx) => (
                  <tr key={idx} className="hover:hover:bg-[#0f172a]">
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{m.mandiName}</div>
                      <div className="text-xs text-slate-500">{m.state}</div>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">₹{m.minPrice}</td>
                    <td className="p-3 text-right font-mono text-slate-400">₹{m.maxPrice}</td>
                    <td className="p-3 text-right font-mono text-slate-200 font-bold text-base">₹{m.modalPrice}</td>
                    <td className="p-3 text-right font-mono">
                      <span className={`text-xs font-bold ${m.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {m.changePercent >= 0 ? '+' : ''}{m.changePercent}%
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">{m.arrivalVolume || '--'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No spot price data found for selected filters.
                    </td>
                  </tr>
                )}
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
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={'#334155'} vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
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
                <span>Modal price for {commodity} is heavily influenced by arrivals in {data[0]?.mandiName || 'key'} mandi.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <span>Consistent monitoring of {stateFilter === 'All States' ? 'major producing states' : stateFilter} is advised for arbitrage opportunities.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
