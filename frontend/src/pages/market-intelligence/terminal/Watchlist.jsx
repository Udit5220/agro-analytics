import React, { useState, useEffect } from 'react';
import { Target, Bell, TrendingUp, TrendingDown, MoreVertical, Trash2, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { commodityApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const MANDIS = ['Indore', 'Nashik', 'Kota', 'Nagpur', 'Akola', 'Lasalgaon', 'Jaipur', 'Bhopal', 'Guntur', 'Rajkot'];

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ commodity: 'Wheat', mandiName: 'Indore', targetPrice: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await commodityApi.getWatchlist();
      setWatchlist(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await commodityApi.addToWatchlist(form);
      setShowForm(false);
      setForm({ commodity: 'Wheat', mandiName: 'Indore', targetPrice: '', notes: '' });
      await fetchWatchlist();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleRemove = async (id) => {
    try {
      await commodityApi.removeFromWatchlist(id);
      setWatchlist(w => w.filter(i => i._id !== id));
    } catch (e) { console.error(e); }
  };

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
          <h2 className="text-xl font-bold text-slate-200">Commodity Watchlist</h2>
          <p className="text-sm text-slate-400 mt-1">Track your saved commodities, spot vs futures spread, and market signals.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#0A0D14] hover:hover:bg-[#1e293b] text-white rounded text-sm font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add to Watchlist'}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-5 mb-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Commodity</label>
              <select value={form.commodity} onChange={e => setForm(f => ({ ...f, commodity: e.target.value }))}
                className="w-full px-3 py-2.5 rounded bg-[#0A0D14] border border-[#334155] text-slate-200 text-sm focus:outline-none focus:border-emerald-500">
                {COMMODITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">Mandi</label>
              <select value={form.mandiName} onChange={e => setForm(f => ({ ...f, mandiName: e.target.value }))}
                className="w-full px-3 py-2.5 rounded bg-[#0A0D14] border border-[#334155] text-slate-200 text-sm focus:outline-none focus:border-emerald-500">
                {MANDIS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 bg-[#0A0D14] text-white rounded text-sm font-bold hover:hover:bg-[#1e293b] transition-colors disabled:opacity-60">
                {saving ? 'Adding...' : 'Save to Watchlist'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A0D14] border-b border-[#334155]">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">7D Trend</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spot Price</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Nearest Future</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Spread</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Change %</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Market Signal</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#334155]">
            {watchlist.map((item) => {
              const spark = item.trend === 'up' ? [10, 15, 20, 25, 30] : item.trend === 'down' ? [30, 25, 20, 15, 10] : [20, 20, 20, 20, 20];
              const spread = 50; // Mock spread since watchlist API doesn't return futures natively yet
              const signal = item.trend === 'up' ? 'Bullish' : item.trend === 'down' ? 'Bearish' : 'Neutral';
              
              return (
                <tr key={item._id} className="hover:hover:bg-[#0f172a] transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{item.commodity}</div>
                    <div className="text-xs text-slate-500">{item.mandiName}</div>
                  </td>
                  <td className="p-4 w-32">
                    <div className="h-10 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={spark.map((val, i) => ({ val, i }))}>
                          <Line 
                            type="monotone" 
                            dataKey="val" 
                            stroke={item.trend === 'up' ? '#10b981' : item.trend === 'down' ? '#ef4444' : '#f59e0b'} 
                            strokeWidth={2} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-slate-300">₹{item.currentModalPrice ? item.currentModalPrice.toLocaleString() : '--'}</td>
                  <td className="p-4 text-right font-mono text-slate-300">₹{item.currentModalPrice ? (item.currentModalPrice + spread).toLocaleString() : '--'}</td>
                  <td className="p-4 text-right font-mono">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${spread > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {spread > 0 ? '+' : ''}₹{spread}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono">
                    <span className={`flex items-center justify-end gap-1 ${item.trend === 'up' ? 'text-emerald-500' : item.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                      {item.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : item.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                      {item.trend === 'up' ? 'Rising' : item.trend === 'down' ? 'Falling' : 'Stable'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      signal === 'Bullish' ? 'bg-emerald-100 border-emerald-200 text-emerald-800' :
                      signal === 'Bearish' ? 'bg-rose-100 border-rose-200 text-rose-800' :
                      'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>
                      <Target className="h-3 w-3" />
                      {signal}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-3 text-slate-400">
                      <button onClick={() => handleRemove(item._id)} className="hover:text-rose-500 transition-colors" title="Remove"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {watchlist.length === 0 && (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400">
                  Your watchlist is empty. Add a commodity to track it here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
