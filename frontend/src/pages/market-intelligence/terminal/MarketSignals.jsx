import React, { useState, useEffect } from 'react';
import { Target, Activity, ArrowRight, ShieldAlert, RefreshCw } from 'lucide-react';
import { analyticsApi } from '../../../services/apiService';

export default function MarketSignals() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSignals() {
      setLoading(true);
      try {
        const commodities = ['Wheat', 'Cotton', 'Soybean'];
        const results = await Promise.all(
          commodities.map(c => analyticsApi.getMarketSignals(c))
        );
        setSignals(results.map(r => r.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSignals();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Market Signals</h2>
          <p className="text-sm text-slate-400 mt-1">Algorithmic indicators combining Spot, Futures, and Volume data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {signals.map((s) => {
          const isBull = s.signal === 'Bullish';
          const isBear = s.signal === 'Bearish';
          
          return (
            <div key={s.commodity} className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
              <div className="p-5 border-b border-[#334155] flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{s.commodity}</h3>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    isBull ? 'bg-emerald-100 border-emerald-200 text-emerald-800' :
                    isBear ? 'bg-rose-100 border-rose-200 text-rose-800' :
                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                  }`}>
                    <Target className="h-4 w-4" />
                    {s.signal}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Confidence</div>
                  <div className="text-2xl font-black text-slate-200">{s.confidence}%</div>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0A0D14] p-3 rounded border border-[#334155]">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Support</div>
                    <div className="text-lg font-mono text-emerald-600">₹{s.support}</div>
                  </div>
                  <div className="bg-[#0A0D14] p-3 rounded border border-[#334155]">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Resistance</div>
                    <div className="text-lg font-mono text-rose-600">₹{s.resistance}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">Key Drivers</div>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#0A0D14] p-3 rounded border border-[#334155]">
                    {s.reason || "Algorithmic analysis of price, volume, and spread patterns indicates this signal."}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0A0D14] border-t border-[#334155]">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Suggested Action:</span>
                  <span className="text-slate-200 font-medium flex items-center gap-1">
                    <ArrowRight className="h-4 w-4 text-indigo-400" />
                    {s.action}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-500/10 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
        <ShieldAlert className="h-6 w-6 text-amber-500 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Important Risk Disclosure</h4>
          <p className="text-sm text-amber-500/80 leading-relaxed">
            Market Signals are generated automatically based on technical indicators (Spot-Futures convergence, moving averages, and volume spikes). 
            They are strictly for informational purposes and <strong>do not constitute financial or investment advice</strong>. 
            AgroIndia is not liable for any trading losses incurred. Always verify market depth before executing trades.
          </p>
        </div>
      </div>
    </div>
  );
}
