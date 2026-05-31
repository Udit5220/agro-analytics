import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, Trash2, TrendingUp, TrendingDown, Minus, RefreshCw, Star } from 'lucide-react';
import { commodityApi } from '../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const MANDIS = ['Indore', 'Nashik', 'Kota', 'Nagpur', 'Akola', 'Lasalgaon', 'Jaipur', 'Bhopal', 'Guntur', 'Rajkot'];

export default function MyWatchlist() {
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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">My Watchlist</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your favorite commodities and mandis</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white dark:bg-brand-darkest/60 border border-brand-medium/30 rounded-2xl p-5">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Add to Watchlist</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Commodity</label>
              <select value={form.commodity} onChange={e => setForm(f => ({ ...f, commodity: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
                {COMMODITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Mandi</label>
              <select value={form.mandiName} onChange={e => setForm(f => ({ ...f, mandiName: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
                {MANDIS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Target Price (₹/qtl, optional)</label>
              <input type="number" value={form.targetPrice} onChange={e => setForm(f => ({ ...f, targetPrice: e.target.value }))}
                placeholder="e.g. 2500" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Notes (optional)</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="e.g. Selling in 2 weeks" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium" />
            </div>
            <div className="sm:col-span-2 flex gap-3 pt-1">
              <button type="submit" disabled={saving}
                className="px-5 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors disabled:opacity-60">
                {saving ? 'Adding...' : 'Add to Watchlist'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-brand-dark/30 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-brand-dark/50 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : watchlist.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl">
          <Star className="h-10 w-10 mx-auto mb-3 text-slate-300 dark:text-brand-dark/50" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">Your watchlist is empty</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Add commodities to track prices easily</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">Add First Item</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item._id} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 relative hover:border-brand-medium/30 hover:shadow-md transition-all">
              <button onClick={() => handleRemove(item._id)} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-brand-medium/10 flex items-center justify-center">
                  <Bookmark className="h-4 w-4 text-brand-medium dark:text-brand-accent" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{item.commodity}</p>
                  <p className="text-xs text-slate-400">{item.mandiName} Mandi</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Price</span>
                  <span className="font-black text-slate-800 dark:text-white">₹{item.currentModalPrice?.toLocaleString() || '--'}/qtl</span>
                </div>
                {item.targetPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Price</span>
                    <span className="font-semibold text-brand-medium dark:text-brand-accent">₹{item.targetPrice?.toLocaleString()}/qtl</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Trend</span>
                  <span className={`font-bold ${item.trend === 'up' ? 'text-emerald-600' : item.trend === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
                    {item.trend === 'up' ? '↑ Rising' : item.trend === 'down' ? '↓ Falling' : '→ Stable'}
                  </span>
                </div>
                {item.notes && <p className="text-xs text-slate-400 pt-1 border-t border-slate-50 dark:border-brand-dark/20">{item.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
