import React, { useState, useEffect } from 'react';
import { GitCompare, TrendingUp, AlertTriangle, RefreshCw, BarChart2, CheckCircle2, ArrowRightLeft, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Onion', 'Maize', 'Paddy', 'Turmeric', 'Tomato'];

export default function SpreadAnalysis() {
  const [activeTab, setActiveTab] = useState('spot_futures');
  const [spreadData, setSpreadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState('Wheat');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await analyticsApi.getSpreadAnalysisFull(selectedCommodity);
        if (result && result.success) {
          setSpreadData(result);
        } else {
          setError('Failed to load spread analysis data.');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to market analytics engine.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCommodity, refreshTrigger]);

  const renderSourceBadge = () => {
    if (!spreadData) return null;
    let badgeClass = "bg-slate-500/10 text-slate-400 border-slate-500/20";
    let text = "Unknown Data";
    
    if (spreadData.source === 'live_data') {
      badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
      text = "Live Data";
    } else if (spreadData.source === 'mixed') {
      badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
      text = "Mixed Data";
    } else if (spreadData.source === 'seed_fallback') {
      badgeClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      text = "Demo Data";
    }

    return (
      <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${badgeClass}`}>
        {text}
      </span>
    );
  };

  const formatPrice = (val) => {
    if (val === null || val === undefined) return 'Data unavailable';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200 flex items-center gap-3">
            Spread Analysis V2
            {renderSourceBadge()}
          </h2>
          <p className="text-sm text-slate-400 mt-1">Professional grade arbitrage and basis tracking across multiple markets.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={selectedCommodity} 
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
          >
            {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="p-2 bg-[#1e293b] hover:hover:bg-[#0f172a] border border-[#334155] rounded text-slate-300 transition-colors" title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#1e293b] rounded-lg p-1 border border-[#334155] max-w-2xl">
        <button 
          onClick={() => setActiveTab('spot_futures')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded text-sm font-semibold transition-all ${activeTab === 'spot_futures' ? 'bg-[#0f172a] text-slate-200 shadow' : 'text-slate-400 hover:text-slate-200 hover:hover:bg-[#0f172a]/50'}`}
        >
          <GitCompare className="h-4 w-4" /> Spot vs Futures
        </button>
        <button 
          onClick={() => setActiveTab('mandi_mandi')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded text-sm font-semibold transition-all ${activeTab === 'mandi_mandi' ? 'bg-[#0f172a] text-slate-200 shadow' : 'text-slate-400 hover:text-slate-200 hover:hover:bg-[#0f172a]/50'}`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Mandi vs Mandi
        </button>
        <button 
          onClick={() => setActiveTab('commodity_commodity')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded text-sm font-semibold transition-all ${activeTab === 'commodity_commodity' ? 'bg-[#0f172a] text-slate-200 shadow' : 'text-slate-400 hover:text-slate-200 hover:hover:bg-[#0f172a]/50'}`}
        >
          <Target className="h-4 w-4" /> Commodity Pairs
        </button>
      </div>

      {error ? (
        <div className="bg-rose-500/10 border border-rose-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-200 mb-2">Analysis Failed</h3>
          <p className="text-rose-600/80">{error}</p>
        </div>
      ) : loading && !spreadData ? (
        <div className="flex-1 bg-[#1e293b] border border-[#334155] rounded-xl flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
          
          {/* Main Data Table */}
          <div className="xl:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-4 border-b border-[#334155] bg-[#0A0D14]">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                {activeTab === 'spot_futures' && <><GitCompare className="h-4 w-4 text-emerald-500" /> Spot vs Futures Matrix</>}
                {activeTab === 'mandi_mandi' && <><ArrowRightLeft className="h-4 w-4 text-amber-500" /> Spatial Arbitrage Matrix</>}
                {activeTab === 'commodity_commodity' && <><Target className="h-4 w-4 text-indigo-500" /> Pair Ratio Analysis</>}
              </h3>
            </div>
            
            <div className="flex-1 overflow-x-auto p-4">
              {activeTab === 'spot_futures' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spot Price</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Nearest Future</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spread</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Basis</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Signal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {spreadData?.spotVsFutures?.rows?.map((row, idx) => (
                      <tr key={idx} className="hover:hover:bg-[#0f172a]/20">
                        <td className="py-4 font-bold text-slate-200">{row.commodity}</td>
                        <td className="py-4 text-right font-mono text-slate-300">{formatPrice(row.spotPrice)}</td>
                        <td className="py-4 text-right font-mono text-slate-300">{formatPrice(row.nearestFuture)}</td>
                        <td className="py-4 text-right font-mono">
                          <span className={row.spread > 0 ? 'text-emerald-600' : row.spread < 0 ? 'text-rose-600' : 'text-slate-400'}>
                            {row.spread > 0 ? '+' : ''}{row.spread !== null ? `₹${row.spread}` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 text-right font-mono text-amber-600">
                          {row.basis > 0 ? '+' : ''}{row.basis !== null ? `₹${row.basis}` : 'N/A'}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${
                            row.signal === 'Future Premium' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 
                            row.signal === 'Future Discount' ? 'bg-rose-100 border-rose-200 text-rose-800' : 
                            'bg-slate-500/10 border-slate-500/20 text-slate-400'
                          }`}>
                            {row.signal || 'Neutral'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!spreadData?.spotVsFutures?.rows || spreadData.spotVsFutures.rows.length === 0) && (
                      <tr><td colSpan={6} className="py-8 text-center text-slate-500">No data available</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'mandi_mandi' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Mandi A</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price A</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider pl-4">Mandi B</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price B</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spread</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Opportunity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {spreadData?.mandiVsMandi?.rows?.map((row, idx) => (
                      <tr key={idx} className="hover:hover:bg-[#0f172a]/20">
                        <td className="py-4 font-bold text-slate-200">{row.commodity}</td>
                        <td className="py-4 text-slate-300">{row.mandiA}</td>
                        <td className="py-4 text-right font-mono text-slate-400">{formatPrice(row.priceA)}</td>
                        <td className="py-4 text-slate-300 pl-4">{row.mandiB}</td>
                        <td className="py-4 text-right font-mono text-slate-400">{formatPrice(row.priceB)}</td>
                        <td className="py-4 text-right font-mono">
                          <span className={row.spread > 0 ? 'text-emerald-600' : row.spread < 0 ? 'text-rose-600' : 'text-slate-400'}>
                            {row.spread > 0 ? '+' : ''}{row.spread !== null ? `₹${row.spread}` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded ${
                            row.opportunity === 'Positive Spread' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 
                            row.opportunity === 'Negative Spread' ? 'bg-rose-100 border-rose-200 text-rose-800' : 
                            'bg-slate-500/10 border-slate-500/20 text-slate-400'
                          }`}>
                            {row.opportunity || 'Neutral'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!spreadData?.mandiVsMandi?.rows || spreadData.mandiVsMandi.rows.length === 0) && (
                      <tr><td colSpan={7} className="py-8 text-center text-slate-500">No data available</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'commodity_commodity' && (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#334155]">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity A</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price A</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider pl-4">Commodity B</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Price B</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spread</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ratio (A:B)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]">
                    {spreadData?.commodityPairs?.rows?.map((row, idx) => (
                      <tr key={idx} className="hover:hover:bg-[#0f172a]/20">
                        <td className="py-4 font-bold text-slate-200">{row.commodityA}</td>
                        <td className="py-4 text-right font-mono text-slate-400">{formatPrice(row.priceA)}</td>
                        <td className="py-4 text-slate-200 pl-4">{row.commodityB}</td>
                        <td className="py-4 text-right font-mono text-slate-400">{formatPrice(row.priceB)}</td>
                        <td className="py-4 text-right font-mono">
                          <span className={row.spread > 0 ? 'text-emerald-600' : row.spread < 0 ? 'text-rose-600' : 'text-slate-400'}>
                            {row.spread > 0 ? '+' : ''}{row.spread !== null ? `₹${row.spread}` : 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 text-right font-mono font-bold text-indigo-400">
                          {row.ratio ? row.ratio.toFixed(2) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {(!spreadData?.commodityPairs?.rows || spreadData.commodityPairs.rows.length === 0) && (
                      <tr><td colSpan={6} className="py-8 text-center text-slate-500">No data available</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right Col: Spread Trend Chart */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              {activeTab === 'spot_futures' ? spreadData?.spotVsFutures?.chartTitle : 
               activeTab === 'mandi_mandi' ? spreadData?.mandiVsMandi?.chartTitle : 
               spreadData?.commodityPairs?.chartTitle || 'Spread Trend'}
            </h3>
            
            <div className="flex-1 w-full min-h-[250px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                {(activeTab === 'spot_futures' ? spreadData?.spotVsFutures?.trend : 
                  activeTab === 'mandi_mandi' ? spreadData?.mandiVsMandi?.trend : 
                  spreadData?.commodityPairs?.trend)?.length > 0 ? (
                  <AreaChart 
                    data={activeTab === 'spot_futures' ? spreadData?.spotVsFutures?.trend : 
                          activeTab === 'mandi_mandi' ? spreadData?.mandiVsMandi?.trend : 
                          spreadData?.commodityPairs?.trend} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSpreadPos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSpreadNeg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={'#334155'} vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      tick={{fill: '#64748b', fontSize: 11}} 
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                      }}
                    />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 11}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      formatter={(value) => {
                        return [
                          <span className={value > 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                            {value > 0 ? '+' : ''}₹{value}
                          </span>, 
                          'Spread'
                        ];
                      }}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="spread" 
                      stroke={((activeTab === 'spot_futures' ? spreadData?.spotVsFutures?.trend : 
                                activeTab === 'mandi_mandi' ? spreadData?.mandiVsMandi?.trend : 
                                spreadData?.commodityPairs?.trend)?.slice(-1)[0]?.spread || 0) >= 0 ? '#10b981' : '#ef4444'} 
                      fill={((activeTab === 'spot_futures' ? spreadData?.spotVsFutures?.trend : 
                               activeTab === 'mandi_mandi' ? spreadData?.mandiVsMandi?.trend : 
                               spreadData?.commodityPairs?.trend)?.slice(-1)[0]?.spread || 0) >= 0 ? 'url(#colorSpreadPos)' : 'url(#colorSpreadNeg)'}
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                    Trend data unavailable
                  </div>
                )}
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#334155]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  <strong className="text-slate-200">Analysis Insight:</strong>{' '}
                  {activeTab === 'spot_futures' ? spreadData?.spotVsFutures?.insight : 
                   activeTab === 'mandi_mandi' ? spreadData?.mandiVsMandi?.insight : 
                   spreadData?.commodityPairs?.insight}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
