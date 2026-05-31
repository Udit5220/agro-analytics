import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ClipboardList, Package, Truck, Receipt, TrendingUp, Plus, RefreshCw, ArrowRight } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 flex items-start gap-4">
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="h-5 w-5" /></div>
    <div><p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p><p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{value}</p>{sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}</div>
  </div>
);

export default function MarketplaceDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceApi.getDashboard().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="h-8 w-8 text-brand-medium animate-spin" /></div>;

  const { summary = {}, recentOrders = [], topDemandCommodities = [] } = data || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Marketplace</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Buy, sell & connect with farmers, traders and processors</p>
        </div>
        <button onClick={() => navigate('/module/marketplace/sell')} className="flex items-center gap-2 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">
          <Plus className="h-4 w-4" /> Sell Produce
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Listings" value={summary.activeListings || 0} icon={Store} color="bg-brand-medium/10 text-brand-medium dark:text-brand-accent" />
        <StatCard label="Buyer Requirements" value={summary.buyerRequirements || 0} icon={ClipboardList} color="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
        <StatCard label="My Offers" value={summary.totalOffers || 0} icon={Package} color="bg-violet-500/10 text-violet-600 dark:text-violet-400" />
        <StatCard label="Pending Payments" value={summary.pendingPayments || 0} icon={Receipt} color="bg-amber-500/10 text-amber-600 dark:text-amber-400" sub={summary.totalSalesValue ? `₹${summary.totalSalesValue.toLocaleString()} sold` : ''} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Browse Listings', icon: Store, path: 'listings', color: 'text-brand-medium dark:text-brand-accent bg-brand-medium/10' },
          { label: 'Post Requirement', icon: ClipboardList, path: 'buyer-requirements', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
          { label: 'Buy Inputs', icon: Package, path: 'buy-inputs', color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10' },
          { label: 'My Orders', icon: Truck, path: 'orders', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
        ].map(({ label, icon: Icon, path, color }) => (
          <button key={label} onClick={() => navigate(`/module/marketplace/${path}`)}
            className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-brand-medium/30 hover:shadow-md transition-all group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-brand-medium dark:group-hover:text-brand-accent transition-colors">{label}</p>
          </button>
        ))}
      </div>

      {/* Top Demand & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Demand */}
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand-medium dark:text-brand-accent" />Top Buyer Demand</h2>
            <button onClick={() => navigate('/module/marketplace/buyer-requirements')} className="text-xs text-brand-medium dark:text-brand-accent font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></button>
          </div>
          {topDemandCommodities.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No demand data yet</p>
          ) : (
            <div className="space-y-3">
              {topDemandCommodities.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-300 dark:text-brand-dark/50 w-6 text-center">{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{c._id}</p>
                    <p className="text-xs text-slate-400">{c.count} buyers · Avg target ₹{Math.round(c.avgTargetPrice).toLocaleString()}/qtl</p>
                  </div>
                  <button onClick={() => navigate('/module/marketplace/sell')} className="text-xs text-brand-medium dark:text-brand-accent font-bold hover:underline whitespace-nowrap">Sell Now →</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2"><Truck className="h-4 w-4 text-brand-medium dark:text-brand-accent" />Recent Orders</h2>
            <button onClick={() => navigate('/module/marketplace/orders')} className="text-xs text-brand-medium dark:text-brand-accent font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></button>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o, i) => {
                const statusColors = { created: 'text-slate-500', confirmed: 'text-blue-500', dispatched: 'text-amber-500', delivered: 'text-emerald-600', cancelled: 'text-red-500' };
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-brand-dark/20 last:border-0">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{o.commodity} — {o.quantity} qtl</p>
                      <p className="text-xs text-slate-400">{o.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold capitalize ${statusColors[o.orderStatus] || 'text-slate-500'}`}>{o.orderStatus?.replace('_', ' ')}</p>
                      <p className="text-xs text-slate-400">₹{o.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
