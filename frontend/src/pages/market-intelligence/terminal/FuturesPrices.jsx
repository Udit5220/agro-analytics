import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldAlert, RefreshCw, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];

export default function FuturesPrices() {
  const [commodity, setCommodity] = useState('Wheat');
  const [contracts, setContracts] = useState([]);
  const [curveData, setCurveData] = useState([]);
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setMessage('');
      try {
        // API returns: { success, data: { commodity, contracts: [...], latestDate, portal, source, message } }
        const res = await analyticsApi.getFutures(commodity);
        const d = res.data;

        let contractList = d?.contracts || [];
        let src = res.source || 'gl_futures';

        if (d?.message) {
          setMessage(d.message);
        }

        setContracts(contractList);
        setSource(src);

        const curve = contractList.map(c => ({
          month: c.contractMonth || c.contract,
          price: parseFloat(c.futurePrice) || 0
        }));
        setCurveData(curve);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [commodity]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Futures Price Board</h2>
          <p className="text-sm text-slate-400 mt-1">Track active derivative contracts and futures curves.</p>
        </div>
        <div className="flex items-center gap-3">
          {source === 'seed_fallback' && (
            <span className="text-xs text-amber-500 bg-amber-500/10 border border-amber-200 px-2 py-1 rounded flex items-center gap-1">
              <Info className="h-3 w-3" /> Reference Data
            </span>
          )}
          <select value={commodity} onChange={e => setCommodity(e.target.value)} className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-1.5 focus:outline-none">
            {COMMODITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Contract Table */}
        <div className="xl:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              Active Contracts — {commodity}
            </h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A0D14] border-b border-[#334155]">
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Contract</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Expiry</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Future Price</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Change %</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Volume</th>
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <RefreshCw className="h-6 w-6 text-emerald-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : contracts.length > 0 ? contracts.map((c, idx) => {
                  const change = c.changePercent || 0;
                  const price = c.futurePrice || 0;
                  return (
                    <tr key={idx} className="hover:hover:bg-[#0f172a]">
                      <td className="p-3">
                        <div className="font-bold text-slate-200">{c.contract}</div>
                      </td>
                      <td className="p-3 text-slate-400 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {c.contractMonth || c.expiryDate || '--'}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-200 font-bold text-base">
                        ₹{price ? price.toLocaleString('en-IN') : '--'}
                      </td>
                      <td className="p-3 text-right font-mono">
                        <span className={`text-xs font-bold ${change > 0 ? 'text-emerald-500' : change < 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                          {change > 0 ? '+' : ''}{change}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-slate-300">{c.volume?.toLocaleString('en-IN') || '--'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${c.signal === 'Bullish' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : c.signal === 'Bearish' ? 'bg-rose-100 border-rose-200 text-rose-800' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                          {c.signal || 'Neutral'}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No futures contracts found for {commodity}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Futures Curve */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-emerald-500" />
              Futures Curve
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {curveData.length > 0 ? (
                  <AreaChart data={curveData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={'#334155'} vertical={false} />
                    <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} domain={['dataMin - 50', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                    Curve data unavailable
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-amber-500/30 rounded-xl p-5">
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Rollover Analytics
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {curveData.length >= 2 && curveData[0].price < curveData[curveData.length - 1].price
                ? <span>The market is in <strong className="text-emerald-600">Contango</strong>. Future prices are progressively higher than spot prices.</span>
                : curveData.length >= 2 && curveData[0].price > curveData[curveData.length - 1].price
                  ? <span>The market is in <strong className="text-rose-600">Backwardation</strong>. Near-term demand is stronger than forward expectations.</span>
                  : curveData.length >= 2
                    ? <span>The market is <strong className="text-slate-400">Flat</strong>. Near-term demand is equal to forward expectations.</span>
                    : <span>Insufficient contracts to determine curve shape.</span>
              }
            </p>
            {source === 'seed_fallback' && (
              <p className="text-xs text-amber-500/70 mt-2">Reference data used — live exchange OHLCV not yet available for this contract.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
