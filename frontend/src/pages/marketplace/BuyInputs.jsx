import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

export default function BuyInputs() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceApi.getListings({ listingType: 'input', limit: 20 }).then(r => { setListings(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Buy Agricultural Inputs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Seeds, fertilizers, pesticides and equipment from verified dealers</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl">
          <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-slate-400 font-semibold">No input listings yet</p>
          <p className="text-sm text-slate-400 mt-1">Dealers can use "Sell Produce" → Input to add listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((l) => (
            <div key={l._id} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 hover:border-brand-medium/40 hover:shadow-md transition-all">
              <span className="text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">{l.category || 'Input'}</span>
              <h3 className="font-bold text-slate-800 dark:text-white mt-2 mb-1">{l.productName}</h3>
              <p className="text-xs text-slate-400 mb-3">{l.sellerName} · {l.district}, {l.state}</p>
              <p className="text-xl font-black text-slate-800 dark:text-white mb-1">₹{l.expectedPrice?.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mb-4">per {l.unit} · {l.quantity} {l.unit} available</p>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">{l.description}</div>
              <button className="w-full py-2 rounded-xl bg-brand-medium text-white text-sm font-bold hover:bg-brand-dark transition-colors">Contact Seller</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
