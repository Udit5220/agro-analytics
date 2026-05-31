import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus, Store, Navigation, RefreshCw } from 'lucide-react';
import { commodityApi } from '../../services/apiService';

const STATES = ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Gujarat', 'Andhra Pradesh'];
const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];

export default function NearbyMarkets() {
  const [mandis, setMandis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('Madhya Pradesh');
  const [commodity, setCommodity] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await commodityApi.getNearbyMandis({ state, commodity });
      setMandis(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [state, commodity]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Nearby Markets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Compare prices across mandis in your region</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">State / Region</label>
            <select value={state} onChange={e => setState(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Commodity (Optional)</label>
            <select value={commodity} onChange={e => setCommodity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              <option value="">All Commodities</option>
              {COMMODITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : mandis.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><Store className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>No mandis found for this selection</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mandis.map((m, i) => (
            <div key={i} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 hover:border-brand-medium/40 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-brand-medium/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-brand-medium dark:text-brand-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{m._id}</p>
                    <p className="text-xs text-slate-400">{m.district}, {m.state}</p>
                  </div>
                </div>
                {m.trend === 'up' ? <TrendingUp className="h-4 w-4 text-emerald-500" /> :
                  m.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-500" /> :
                    <Minus className="h-4 w-4 text-slate-400" />}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Commodity</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{m.commodity || 'Mixed'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Modal Price</span>
                  <span className="font-black text-slate-800 dark:text-white">₹{m.modalPrice?.toLocaleString()}/qtl</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Change</span>
                  <span className={`font-bold ${m.changePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                    {m.changePercent >= 0 ? '+' : ''}{m.changePercent?.toFixed(1)}%
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-medium/10 text-brand-medium dark:text-brand-accent text-sm font-semibold hover:bg-brand-medium/20 transition-colors">
                <Navigation className="h-3.5 w-3.5" /> Get Directions
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
