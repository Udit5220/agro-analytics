import React, { useState, useEffect } from 'react';
import { Truck, RefreshCw, AlertTriangle, ChevronDown } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const statusColors = {
  created: 'bg-slate-100 dark:bg-brand-dark/30 text-slate-500',
  confirmed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  packed: 'bg-amber-500/10 text-amber-600',
  dispatched: 'bg-violet-500/10 text-violet-600',
  in_transit: 'bg-violet-500/10 text-violet-600',
  delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  cancelled: 'bg-red-500/10 text-red-500',
  disputed: 'bg-red-500/10 text-red-500',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await marketplaceApi.getOrders(filterStatus ? { status: filterStatus } : {});
      setOrders(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [filterStatus]);

  const updateStatus = async (id, status) => {
    try {
      await marketplaceApi.updateOrder(id, { orderStatus: status });
      setOrders(os => os.map(o => o._id === id ? { ...o, orderStatus: status } : o));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">My Orders</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{orders.length} orders</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-white dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
          <option value="">All Statuses</option>
          {['created','confirmed','packed','dispatched','in_transit','delivered','cancelled'].map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl"><Truck className="h-10 w-10 mx-auto mb-3 opacity-40" /><p className="text-slate-400 font-semibold">No orders found</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className={`bg-white dark:bg-brand-darkest/60 border rounded-2xl p-5 ${o.weatherRiskNote ? 'border-amber-200 dark:border-amber-800/30' : 'border-slate-100 dark:border-brand-dark/30'}`}>
              {/* Weather Risk */}
              {o.weatherRiskNote && (
                <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 mb-3 text-xs text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                  <span>{o.weatherRiskNote}</span>
                </div>
              )}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-slate-800 dark:text-white">{o.commodity}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[o.orderStatus] || ''}`}>{o.orderStatus?.replace('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-400">{o.orderNumber}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Buyer: {o.buyerName} · Seller: {o.sellerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-800 dark:text-white">₹{o.totalAmount?.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{o.quantity} {o.unit} @ ₹{Math.round(o.finalPrice)}/qtl</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Pickup:</span> {o.pickupLocation || '—'}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Delivery:</span> {o.deliveryLocation}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Payment:</span> <span className={`font-bold capitalize ${o.paymentStatus === 'paid' ? 'text-emerald-600' : o.paymentStatus === 'pending' ? 'text-amber-500' : 'text-slate-400'}`}>{o.paymentStatus}</span></span>
              </div>

              {/* Status update dropdown */}
              {!['delivered','cancelled'].includes(o.orderStatus) && (
                <div className="mt-3 flex gap-2">
                  <select value={o.orderStatus} onChange={e => updateStatus(o._id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none focus:border-brand-medium">
                    {['created','confirmed','packed','dispatched','in_transit','delivered','cancelled'].map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-400 self-center">Update status</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
