import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, TrendingUp, TrendingDown, Minus, RefreshCw, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import { commodityApi } from '../../services/apiService';

const TrendBadge = ({ trend, pct }) => {
  if (trend === 'up') return <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full"><TrendingUp className="h-3 w-3"/>+{Math.abs(pct).toFixed(1)}%</span>;
  if (trend === 'down') return <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full"><TrendingDown className="h-3 w-3"/>-{Math.abs(pct).toFixed(1)}%</span>;
  return <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-brand-dark/30 text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full"><Minus className="h-3 w-3"/>Stable</span>;
};

export default function LiveMandiPrices() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ commodity: '', state: '', mandi: '' });

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await commodityApi.getMandiPrices({ ...filters, page, limit: 20 });
      setPrices(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    commodityApi.getCommodities().then(r => setCommodities(r.data || []));
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  const handleFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Live Mandi Prices</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total.toLocaleString()} price records across Indian mandis</p>
        </div>
        <button onClick={fetchPrices} className="flex items-center gap-2 px-4 py-2 bg-brand-medium/10 text-brand-medium dark:text-brand-accent rounded-xl text-sm font-semibold hover:bg-brand-medium/20 transition-colors">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select value={filters.commodity} onChange={e => handleFilter('commodity', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              <option value="">All Commodities</option>
              {commodities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select value={filters.state} onChange={e => handleFilter('state', e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
              <option value="">All States</option>
              {['Madhya Pradesh','Maharashtra','Rajasthan','Gujarat','Andhra Pradesh'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <input value={filters.mandi} onChange={e => handleFilter('mandi', e.target.value)}
            placeholder="Search mandi..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
        ) : prices.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Store className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No price records found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-brand-dark/20 border-b border-slate-100 dark:border-brand-dark/30">
                  {['Commodity','Variety','Mandi','District','State','Min ₹','Max ₹','Modal ₹','Arrival (qtl)','Trend','Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-brand-dark/10">
                {prices.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-brand-dark/10 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white whitespace-nowrap">{p.commodity}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{p.variety}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{p.mandiName}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.district}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.state}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">₹{p.minPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">₹{p.maxPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 font-black text-slate-800 dark:text-white whitespace-nowrap">₹{p.modalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500">{p.arrivalVolume?.toLocaleString()}</td>
                    <td className="px-4 py-3"><TrendBadge trend={p.trend} pct={p.changePercent} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/module/marketplace/sell?commodity=${p.commodity}&price=${p.modalPrice}&mandi=${p.mandiName}`)}
                        className="text-xs text-brand-medium dark:text-brand-accent font-semibold hover:underline whitespace-nowrap">Sell →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-brand-dark/30">
            <p className="text-xs text-slate-400">Page {page} of {totalPages} · {total} records</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-brand-dark/20 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-brand-dark/30 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-brand-dark/20 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-brand-dark/30 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
