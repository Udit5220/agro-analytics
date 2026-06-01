import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, Pause, Trash2, Plus, MessageSquare, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketplaceApi } from '../../services/apiService';

// ─── Seller Offers Modal ──────────────────────────────────────────────────────
function SellerOffersModal({ listing, onClose, onRefresh }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (listing) {
      marketplaceApi.getOffers({ listingId: listing._id })
        .then(r => { setOffers(r.data || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [listing]);

  const handleAccept = async (offerId) => {
    setProcessing(true);
    try {
      await marketplaceApi.acceptOffer(offerId);
      setSuccessMsg('Order and invoice created successfully.');
      // Refresh offers
      const r = await marketplaceApi.getOffers({ listingId: listing._id });
      setOffers(r.data || []);
      onRefresh(); // Refresh parent listings
    } catch (e) {
      alert(e.message || 'Failed to accept offer');
    } finally {
      setProcessing(false);
    }
  };

  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div className="bg-white dark:bg-brand-darkest w-full max-w-2xl rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">Offers for "{listing.productName}"</h2>
            <p className="text-sm text-slate-500 mt-1">{offers.length} total offers</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-brand-dark/30 text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8"><RefreshCw className="h-6 w-6 text-brand-medium animate-spin" /></div>
        ) : offers.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No offers received yet.</div>
        ) : (
          <div className="space-y-3">
            {offers.map(o => (
              <div key={o._id} className="border border-slate-200 dark:border-brand-dark/40 rounded-2xl p-4 bg-slate-50 dark:bg-brand-dark/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{o.buyerName}</p>
                    <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${o.status === 'accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {o.status}
                  </span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <div className="text-2xl font-black text-slate-800 dark:text-white">₹{o.offerPrice?.toLocaleString()}</div>
                  <div className="text-sm text-slate-500 pb-0.5">for {o.quantity} {o.unit}</div>
                </div>
                {o.message && <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-3">"{o.message}"</p>}
                
                {o.status === 'pending' && !offers.some(x => x.status === 'accepted') && (
                  <button 
                    onClick={() => handleAccept(o._id)} 
                    disabled={processing}
                    className="w-full py-2 bg-brand-medium text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50"
                  >
                    Accept Offer & Create Order
                  </button>
                )}
                {o.status === 'accepted' && (
                  <div className="text-sm text-emerald-600 font-bold flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Offer Accepted</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const cfg = { active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', draft: 'bg-slate-100 dark:bg-brand-dark/30 text-slate-500', paused: 'bg-amber-500/10 text-amber-600', sold: 'bg-blue-500/10 text-blue-600', expired: 'bg-red-500/10 text-red-500' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg[status] || cfg.active}`}>{status}</span>;
};

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await marketplaceApi.getListings({ sellerId: 'guest', limit: 20 });
      setListings(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await marketplaceApi.updateListing(id, { status });
      setListings(ls => ls.map(l => l._id === id ? { ...l, status } : l));
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await marketplaceApi.deleteListing(id);
      setListings(ls => ls.filter(l => l._id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">My Listings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{listings.length} listings from your account</p>
        </div>
        <button onClick={() => navigate('/module/marketplace/sell')} className="flex items-center gap-2 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">
          <Plus className="h-4 w-4" /> Add Listing
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-slate-400 font-semibold">No listings yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Start selling your produce to buyers across India</p>
          <button onClick={() => navigate('/module/marketplace/sell')} className="px-5 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">Create First Listing</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-brand-dark/20 border-b border-slate-100 dark:border-brand-dark/30">
                  {['Product', 'Commodity', 'Qty', 'Price', 'Location', 'Views', 'Offers', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-brand-dark/10">
                {listings.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50 dark:hover:bg-brand-dark/10 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white whitespace-nowrap max-w-[200px] truncate">{l.productName}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{l.commodity}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{l.quantity} {l.unit}</td>
                    <td className="px-4 py-3 font-black text-slate-800 dark:text-white whitespace-nowrap">₹{l.expectedPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{l.district}, {l.state}</td>
                    <td className="px-4 py-3 text-slate-500">{l.viewCount || 0}</td>
                    <td className="px-4 py-3 text-slate-500">{l.offerCount || 0}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {l.offerCount > 0 && (
                           <button onClick={() => setSelectedListing(l)} className="mr-2 flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors">
                             <MessageSquare className="h-3 w-3" /> View Offers
                           </button>
                        )}
                        <button onClick={() => updateStatus(l._id, l.status === 'active' ? 'paused' : 'active')}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-dark/30 text-slate-400 hover:text-amber-500 transition-colors" title={l.status === 'active' ? 'Pause' : 'Activate'}>
                          <Pause className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(l._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedListing && (
        <SellerOffersModal 
          listing={selectedListing} 
          onClose={() => setSelectedListing(null)} 
          onRefresh={fetch_} 
        />
      )}
    </div>
  );
}
