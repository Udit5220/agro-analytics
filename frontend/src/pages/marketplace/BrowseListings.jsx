import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Store, TrendingUp, TrendingDown, Minus, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const SellerBadge = ({ type }) => {
  const cfg = { farmer: 'bg-brand-medium/10 text-brand-medium dark:text-brand-accent', fpo: 'bg-blue-500/10 text-blue-600', trader: 'bg-amber-500/10 text-amber-600', dealer: 'bg-violet-500/10 text-violet-600' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg[type] || cfg.farmer}`}>{type}</span>;
};

const PriceComparison = ({ pct }) => {
  if (!pct && pct !== 0) return null;
  if (pct > 0) return <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+{pct}% vs Mandi</span>;
  if (pct < 0) return <span className="text-xs text-red-500 font-bold">{pct}% vs Mandi</span>;
  return <span className="text-xs text-slate-400 font-semibold">= Mandi Price</span>;
};

export default function BrowseListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ commodity: '', district: '', listingType: '', sellerType: '' });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await marketplaceApi.getListings({ ...filters, page, limit: 12 });
      setListings(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetch_(); }, [fetch_]);
  const onFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Browse Listings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{total} active listings from verified farmers &amp; traders</p>
        </div>
        <button onClick={() => navigate('/module/marketplace/sell')} className="flex items-center gap-2 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">
          + Sell
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'listingType', label: 'Type', opts: [['', 'All Types'], ['produce', 'Produce'], ['input', 'Inputs'], ['service', 'Services']] },
            { key: 'sellerType', label: 'Seller', opts: [['', 'All Sellers'], ['farmer', 'Farmer'], ['fpo', 'FPO'], ['trader', 'Trader'], ['dealer', 'Dealer']] },
          ].map(({ key, label, opts }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-slate-400 mb-1 block">{label}</label>
              <select value={filters[key]} onChange={e => onFilter(key, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Commodity</label>
            <input value={filters.commodity} onChange={e => onFilter('commodity', e.target.value)}
              placeholder="Search commodity..." className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">District</label>
            <input value={filters.district} onChange={e => onFilter('district', e.target.value)}
              placeholder="Search district..." className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl">
          <Store className="h-10 w-10 mx-auto mb-3 opacity-40" /><p className="font-semibold text-slate-500">No listings found</p>
          <button onClick={() => setFilters({ commodity: '', district: '', listingType: '', sellerType: '' })} className="mt-3 text-brand-medium dark:text-brand-accent text-sm font-semibold hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <div key={l._id} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 hover:border-brand-medium/40 hover:shadow-md transition-all flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <SellerBadge type={l.sellerType} />
                {l.isVerifiedSeller && <CheckCircle className="h-4 w-4 text-brand-medium dark:text-brand-accent" title="Verified Seller" />}
              </div>

              <h3 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{l.productName}</h3>
              <p className="text-xs text-slate-400 mb-3">{l.sellerName} · {l.district}, {l.state}</p>

              {/* Price */}
              <div className="flex items-end gap-2 mb-1">
                <span className="text-2xl font-black text-slate-800 dark:text-white">₹{l.expectedPrice?.toLocaleString()}</span>
                <span className="text-sm text-slate-400 pb-0.5">/ {l.unit}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <PriceComparison pct={l.priceComparisonPercent} />
                {l.mandiBenchmarkPrice > 0 && <span className="text-xs text-slate-400">Mandi: ₹{l.mandiBenchmarkPrice?.toLocaleString()}</span>}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-1">
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Qty:</span> {l.quantity} {l.unit}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Grade:</span> {l.grade}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Variety:</span> {l.variety}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Views:</span> {l.viewCount}</span>
              </div>

              {/* CTA */}
              <button onClick={() => navigate(`/module/marketplace/listings?id=${l._id}`)}
                className="w-full py-2 rounded-xl bg-brand-medium text-white text-sm font-bold hover:bg-brand-dark transition-colors mt-auto">
                View &amp; Make Offer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">Page {page} of {totalPages} · {total} listings</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 rounded-lg bg-white dark:bg-brand-dark/20 border border-slate-200 dark:border-brand-dark/40 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-white dark:bg-brand-dark/20 border border-slate-200 dark:border-brand-dark/40 disabled:opacity-40 hover:bg-slate-50 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
