import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, Edit3, Pause, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { marketplaceApi } from '../../services/apiService';

const StatusBadge = ({ status }) => {
  const cfg = { active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', draft: 'bg-slate-100 dark:bg-brand-dark/30 text-slate-500', paused: 'bg-amber-500/10 text-amber-600', sold: 'bg-blue-500/10 text-blue-600', expired: 'bg-red-500/10 text-red-500' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg[status] || cfg.active}`}>{status}</span>;
};

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

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
    </div>
  );
}
