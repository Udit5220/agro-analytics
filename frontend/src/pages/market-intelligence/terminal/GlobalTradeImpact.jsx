import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, FileText, Anchor, ArrowRight, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Palm Oil'];

export default function GlobalTradeImpact() {
  const [activeTab, setActiveTab] = useState('import-export');
  const [commodity, setCommodity] = useState('Wheat');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await analyticsApi.getGlobalTradeImpact(commodity);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [commodity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  // Mock trade chart data based on API response
  const chartData = [
    { country: data.importExport?.country || 'Unknown', volume: 450, type: 'Export' },
    { country: 'UAE', volume: 280, type: 'Export' },
    { country: 'Indonesia', volume: 190, type: 'Export' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Global Trade Impact</h2>
          <p className="text-sm text-slate-400 mt-1">Analyze how international benchmarks, currency, and tariffs affect domestic prices.</p>
        </div>
        <select value={commodity} onChange={e => setCommodity(e.target.value)} className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-1.5 focus:outline-none">
          {COMMODITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex gap-2 bg-[#1e293b] p-1 rounded-lg w-max flex-shrink-0">
        <button 
          onClick={() => setActiveTab('import-export')}
          className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${activeTab === 'import-export' ? 'bg-[#0f172a] text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Globe className="h-4 w-4" /> Import / Export Flow
        </button>
        <button 
          onClick={() => setActiveTab('currency')}
          className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${activeTab === 'currency' ? 'bg-[#0f172a] text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <DollarSign className="h-4 w-4" /> Currency Impact
        </button>
        <button 
          onClick={() => setActiveTab('tariff')}
          className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 transition-colors ${activeTab === 'tariff' ? 'bg-[#0f172a] text-slate-200' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <FileText className="h-4 w-4" /> Tariff & Duty Engine
        </button>
      </div>

      <div className="flex-1 bg-[#1e293b] border border-[#334155] rounded-xl p-6 overflow-y-auto">
        
        {/* ─── IMPORT / EXPORT TAB ────────────────────────────────────────── */}
        {activeTab === 'import-export' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0A0D14] p-5 rounded border border-[#334155]">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Domestic Price (FOB)</div>
                <div className="text-2xl font-mono text-slate-200 font-black">₹{data.importExport?.domestic} <span className="text-sm text-slate-500 font-sans font-normal">/ qtl</span></div>
              </div>
              <div className="bg-[#0A0D14] p-5 rounded border border-[#334155]">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Intl Benchmark (CIF)</div>
                <div className="text-2xl font-mono text-slate-200 font-black">₹{data.importExport?.benchmark} <span className="text-sm text-slate-500 font-sans font-normal">/ qtl eq.</span></div>
              </div>
              <div className={`p-5 rounded border ${data.importExport?.impact.includes('Export') ? 'bg-emerald-500/10 border-emerald-200' : 'bg-rose-500/10 border-rose-200'}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${data.importExport?.impact.includes('Export') ? 'text-emerald-500' : 'text-rose-500'}`}>Trade Viability</div>
                <div className={`text-xl font-black uppercase ${data.importExport?.impact.includes('Export') ? 'text-emerald-600' : 'text-rose-600'}`}>{data.importExport?.impact}</div>
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
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={'#334155'} horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis type="category" dataKey="country" stroke="#64748b" tick={{fill: '#cbd5e1', fontSize: 12}} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                      <Bar dataKey="volume" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#0A0D14] border border-[#334155] rounded p-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trade Intelligence Note</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Domestic prices for {commodity} are interacting strongly with international benchmarks. Active trade flows noted with {data.importExport?.country}. 
                    A gap of ₹{Math.abs(data.importExport?.domestic - data.importExport?.benchmark)}/qtl exists against the international benchmark.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── CURRENCY TAB ───────────────────────────────────────────────── */}
        {activeTab === 'currency' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0A0D14] p-6 rounded border border-[#334155] flex flex-col justify-center">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{data.currency?.pair} Spot Rate</div>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-mono text-slate-200 font-black">{data.currency?.rate}</div>
                  <div className="text-emerald-600 font-bold mb-1">{data.currency?.trend}</div>
                </div>
                <p className="text-sm text-slate-400 mt-4">
                  {data.currency?.effect}
                </p>
              </div>

              <div className="bg-[#0A0D14] p-6 rounded border border-[#334155]">
                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Currency Impact on {commodity}</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#1e293b] rounded">
                    <span className="text-slate-300">Net Export Margin Effect</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1"><ArrowRight className="h-4 w-4" /> {data.currency?.trend.startsWith('+') ? 'Supportive' : 'Negative'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1e293b] rounded">
                    <span className="text-slate-300">Import Cost Inflation</span>
                    <span className="text-amber-600 font-bold flex items-center gap-1"><ArrowRight className="h-4 w-4" /> {data.currency?.trend.startsWith('+') ? 'Marginal Increase' : 'Decrease'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TARIFF TAB ─────────────────────────────────────────────────── */}
        {activeTab === 'tariff' && (
          <div className="space-y-6 animate-fadeIn">
            {data.tariff?.source && data.tariff.source !== 'seed_fallback' && (
              <div className="flex justify-end">
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${
                  data.tariff.source === 'live_data' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                  'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {data.tariff.source === 'live_data' ? 'Live Data' : 'Mixed Data'}
                </span>
              </div>
            )}
            <div className="bg-[#0A0D14] border border-[#334155] rounded-xl overflow-hidden">
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
                  <tr className="hover:hover:bg-[#0f172a] text-sm">
                    <td className="p-4 font-bold text-slate-200">{commodity}</td>
                    <td className="p-4 font-mono text-slate-300">{data.tariff?.hsCode || 'Data unavailable'}</td>
                    <td className="p-4 font-mono text-rose-600">{data.tariff?.basicDuty || 'Data unavailable'}</td>
                    <td className="p-4 text-amber-500 font-bold">{data.tariff?.tradeRestriction || 'Data unavailable'}</td>
                    <td className="p-4 text-slate-300">{data.tariff?.impactNote || 'Data unavailable'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#0A0D14] p-5 rounded border border-[#334155]">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Cost Impact Estimate</h4>
              <p className="text-sm text-slate-400">
                {data.tariff?.landedCostImpact || `Data unavailable for ${commodity}`}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
