import React, { useState, useEffect } from 'react';
import { MessageSquare, Cpu, TrendingUp, RefreshCw } from 'lucide-react';
import { analyticsApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Cotton', 'Soybean', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];

const DRIVERS_MAP = {
  Wheat:    [{ label: 'Spot Demand', level: 85, color: 'emerald', text: 'Strong' }, { label: 'Futures Premium', level: 70, color: 'emerald', text: 'Expanding' }, { label: 'Global Parity', level: 50, color: 'amber', text: 'Neutral' }, { label: 'Policy Impact', level: 80, color: 'rose', text: 'Restrictive' }],
  Cotton:   [{ label: 'Spot Demand', level: 40, color: 'rose', text: 'Weak' }, { label: 'Futures Premium', level: 30, color: 'rose', text: 'Discount' }, { label: 'Global Parity', level: 45, color: 'amber', text: 'Bearish' }, { label: 'Policy Impact', level: 60, color: 'slate', text: 'Neutral' }],
  Soybean:  [{ label: 'Crush Demand', level: 55, color: 'amber', text: 'Moderate' }, { label: 'Futures Premium', level: 65, color: 'amber', text: 'Mild' }, { label: 'Import Parity', level: 50, color: 'amber', text: 'Watching' }, { label: 'Policy Impact', level: 50, color: 'slate', text: 'Neutral' }],
};

const DEFAULT_DRIVERS = [
  { label: 'Price Trend', level: 60, color: 'amber', text: 'Moderate' },
  { label: 'Market Spread', level: 55, color: 'slate', text: 'Stable' },
  { label: 'Global Parity', level: 50, color: 'amber', text: 'Neutral' },
  { label: 'Policy Impact', level: 50, color: 'slate', text: 'Neutral' },
];

const colorClass = (c) => ({
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600' },
  amber:   { bar: 'bg-amber-500',   text: 'text-amber-500'   },
  rose:    { bar: 'bg-rose-500',    text: 'text-rose-600'    },
  slate:   { bar: 'bg-slate-500',   text: 'text-slate-400'   },
}[c] || { bar: 'bg-slate-500', text: 'text-slate-400' });

export default function AiCommentary() {
  const [commodity, setCommodity] = useState('Wheat');
  const [commentary, setCommentary] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const res = await analyticsApi.getAiCommentary(commodity);
        setCommentary(res.data?.commentary || '');
        setTimestamp(res.data?.timestamp ? new Date(res.data.timestamp).toLocaleTimeString() : '');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [commodity]);

  const drivers = DRIVERS_MAP[commodity] || DEFAULT_DRIVERS;

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-200">AI Market Commentary</h2>
          <p className="text-sm text-slate-400 mt-1">Deep-dive algorithmic analysis of price drivers and market dynamics.</p>
        </div>
        <select value={commodity} onChange={e => setCommodity(e.target.value)} className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-1.5 focus:outline-none">
          {COMMODITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Col: The detailed commentary */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cpu className="h-48 w-48 text-emerald-500" />
          </div>
          
          <div className="p-6 border-b border-[#334155] bg-[#0A0D14] relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-bold text-emerald-600">{commodity} Market Overview {timestamp ? `(Updated: ${timestamp})` : ''}</h3>
            </div>
            <p className="text-sm text-slate-400">
              Algorithmic analysis based on spot prices, futures contracts, and global parity metrics.
            </p>
          </div>

          <div className="p-8 space-y-6 text-slate-300 leading-relaxed text-sm relative z-10 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
              </div>
            ) : (
              <>
                {commentary.split('. ').reduce((acc, sentence, idx) => {
                  const paraIdx = Math.floor(idx / 2);
                  if (!acc[paraIdx]) acc[paraIdx] = [];
                  acc[paraIdx].push(sentence);
                  return acc;
                }, []).map((sentences, idx) => (
                  <p key={idx}>{sentences.join('. ')}{sentences.length > 0 && !sentences[sentences.length - 1].endsWith('.') ? '.' : ''}</p>
                ))}

                <div className="bg-[#0A0D14] border border-[#334155] p-5 rounded-lg mt-8">
                  <h4 className="text-emerald-600 font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Market Intelligence Summary
                  </h4>
                  <p className="text-slate-400 text-xs">
                    ⚠️ This commentary is generated algorithmically from price trend data and is strictly for <strong>informational purposes only</strong>. 
                    It does not constitute financial or investment advice. Always verify market depth before executing trades.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Col: Sentiment drivers summary */}
        <div className="space-y-6">
          <div className="bg-[#0A0D14] border border-[#334155] rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sentiment Drivers</h3>
            <div className="space-y-4">
              {drivers.map((d) => {
                const cls = colorClass(d.color);
                return (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{d.label}</span>
                      <span className={`${cls.text} font-bold`}>{d.text}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                      <div className={`h-full ${cls.bar}`} style={{ width: `${d.level}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1e293b] border border-amber-200 rounded-xl p-5">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3">Risk Disclosure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Market signals are generated from historical price data and technical indicators. 
              They are <strong className="text-slate-200">informational only</strong> and do not constitute trading advice. 
              Commodity markets carry significant risk. Please exercise your own due diligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
