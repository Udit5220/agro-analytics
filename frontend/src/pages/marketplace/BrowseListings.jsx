import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle, RefreshCw, ChevronLeft, ChevronRight, X, Eye, TrendingUp, TrendingDown, Minus, Phone } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const SellerBadge = ({ type }) => {
  const cfg = { farmer: 'bg-brand-medium/10 text-brand-medium dark:text-brand-accent', fpo: 'bg-blue-500/10 text-blue-600', trader: 'bg-amber-500/10 text-amber-600', dealer: 'bg-violet-500/10 text-violet-600' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg[type] || cfg.farmer}`}>{type}</span>;
};

const PriceComparison = ({ pct }) => {
  if (!pct && pct !== 0) return null;
  if (pct > 0) return <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><TrendingUp className="h-3 w-3" />+{pct}% vs Mandi</span>;
  if (pct < 0) return <span className="text-xs text-red-500 font-bold flex items-center gap-1"><TrendingDown className="h-3 w-3" />{pct}% vs Mandi</span>;
  return <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Minus className="h-3 w-3" />= Mandi Price</span>;
};

// ─── Inline Offer Modal ────────────────────────────────────────────────────────
function OfferModal({ listing, onClose, onOfferSubmitted }) {
  const [form, setForm] = useState({ buyerName: '', offerPrice: listing?.expectedPrice || '', quantity: listing?.quantity || '', unit: listing?.unit || 'Quintal', message: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium transition-colors";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await marketplaceApi.createOffer({ listingId: listing._id, ...form, offerPrice: Number(form.offerPrice), quantity: Number(form.quantity) });
      setSuccess(true);
      onOfferSubmitted();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-brand-darkest w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{listing.productName}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{listing.sellerName} · {listing.district}, {listing.state}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-brand-dark/30 text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Listing Info */}
        <div className="bg-slate-50 dark:bg-brand-dark/20 rounded-2xl p-4 space-y-3">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800 dark:text-white">₹{listing.expectedPrice?.toLocaleString()}</span>
            <span className="text-sm text-slate-400 pb-1">/ {listing.unit}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <PriceComparison pct={listing.priceComparisonPercent} />
            {listing.mandiBenchmarkPrice > 0 && <span className="text-xs text-slate-400">Mandi benchmark: ₹{listing.mandiBenchmarkPrice?.toLocaleString()}</span>}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-brand-dark/30">
            <span><span className="font-semibold text-slate-600 dark:text-slate-300">Qty:</span> {listing.quantity} {listing.unit}</span>
            <span><span className="font-semibold text-slate-600 dark:text-slate-300">Grade:</span> {listing.grade}</span>
            <span><span className="font-semibold text-slate-600 dark:text-slate-300">Variety:</span> {listing.variety || '—'}</span>
            <span><span className="font-semibold text-slate-600 dark:text-slate-300">Views:</span> {listing.viewCount}</span>
            <span className="col-span-2"><span className="font-semibold text-slate-600 dark:text-slate-300">Pickup:</span> {listing.pickupLocation}</span>
            {listing.description && <span className="col-span-2 italic text-slate-400">"{listing.description}"</span>}
          </div>
          {listing.contactNumber && (
            <a href={`tel:${listing.contactNumber}`} className="flex items-center gap-2 text-xs text-brand-medium dark:text-brand-accent font-semibold hover:underline">
              <Phone className="h-3.5 w-3.5" /> {listing.contactNumber} · {listing.contactPreference}
            </a>
          )}
        </div>

        {/* Offer Form */}
        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
            <p className="font-black text-slate-800 dark:text-white text-lg">Offer Submitted!</p>
            <p className="text-sm text-slate-400 mt-1">The seller will contact you shortly.</p>
            <button onClick={onClose} className="mt-4 px-5 py-2 bg-brand-medium text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors">Done</button>
          </div>
        ) : (
          <>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Make an Offer</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Your Name *</label>
                  <input required value={form.buyerName} onChange={e => set('buyerName', e.target.value)} className={inputCls} placeholder="Buyer / Company name" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Offer Price (₹) *</label>
                  <input required type="number" min={1} value={form.offerPrice} onChange={e => set('offerPrice', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Quantity *</label>
                  <input required type="number" min={1} max={listing.quantity} value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Unit</label>
                  <input readOnly value={form.unit} className={`${inputCls} opacity-60`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Message (optional)</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Any special requirements or notes..." />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 bg-brand-medium text-white rounded-xl font-black text-sm hover:bg-brand-dark transition-colors disabled:opacity-60">
                {saving ? 'Submitting...' : `Submit Offer @ ₹${Number(form.offerPrice).toLocaleString()}/${form.unit}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main BrowseListings Page ─────────────────────────────────────────────────
export default function BrowseListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ commodity: '', district: '', listingType: '', sellerType: '' });
  const [selectedListing, setSelectedListing] = useState(null);

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

  // When opening a listing, call getListingById to increment viewCount
  const openListing = async (listing) => {
    try {
      const res = await marketplaceApi.getListingById(listing._id);
      setSelectedListing({ ...listing, ...res.data, mandiBenchmarkPrice: res.mandiBenchmark?.modalPrice || listing.mandiBenchmarkPrice });
    } catch {
      setSelectedListing(listing);
    }
  };

  // After offer submitted, refresh listing offer count in local state
  const onOfferSubmitted = () => {
    setListings(ls => ls.map(l => l._id === selectedListing._id ? { ...l, offerCount: (l.offerCount || 0) + 1 } : l));
  };

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
                <div className="flex items-center gap-2">
                  {l.isVerifiedSeller && <CheckCircle className="h-4 w-4 text-brand-medium dark:text-brand-accent" title="Verified Seller" />}
                  <span className="text-xs text-slate-400 flex items-center gap-0.5"><Eye className="h-3 w-3" /> {l.viewCount || 0}</span>
                </div>
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
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Variety:</span> {l.variety || '—'}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Offers:</span> {l.offerCount || 0}</span>
              </div>

              {/* CTA */}
              <button
                onClick={() => openListing(l)}
                className="w-full py-2 rounded-xl bg-brand-medium text-white text-sm font-bold hover:bg-brand-dark transition-colors mt-auto"
              >
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

      {/* Offer Modal */}
      {selectedListing && (
        <OfferModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onOfferSubmitted={onOfferSubmitted}
        />
      )}
    </div>
  );
}
