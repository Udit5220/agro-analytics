import React, { useState, useEffect } from 'react';
import { Bell, Plus, RefreshCw, Pause, Play, CheckCircle } from 'lucide-react';
import { commodityApi } from '../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const MANDIS = ['Indore', 'Nashik', 'Kota', 'Nagpur', 'Akola', 'Lasalgaon', 'Jaipur', 'Bhopal', 'Guntur', 'Rajkot'];

const StatusBadge = ({ status }) => {
  const cfg = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    paused: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    triggered: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg[status] || cfg.active}`}>{status}</span>;
};

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ commodity: 'Wheat', mandiName: 'Indore', targetPrice: '', alertType: 'above', notificationMethod: 'app' });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await commodityApi.getPriceAlerts();
      setAlerts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.targetPrice) return;
    setSaving(true);
    try {
      await commodityApi.createPriceAlert(form);
      setShowForm(false);
      setForm({ commodity: 'Wheat', mandiName: 'Indore', targetPrice: '', alertType: 'above', notificationMethod: 'app' });
      await fetchAlerts();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (alert) => {
    const newStatus = alert.status === 'active' ? 'paused' : 'active';
    try {
      await commodityApi.updatePriceAlert(alert._id, { status: newStatus });
      setAlerts(a => a.map(al => al._id === alert._id ? { ...al, status: newStatus } : al));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Price Alerts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get notified when commodity prices reach your target</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">
          <Plus className="h-4 w-4" /> New Alert
        </button>
      </div>

      {/* Alert Form */}
      {showForm && (
        <div className="bg-white dark:bg-brand-darkest/60 border border-brand-medium/30 rounded-2xl p-5">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Create Price Alert</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Commodity', key: 'commodity', type: 'select', options: COMMODITIES },
              { label: 'Mandi', key: 'mandiName', type: 'select', options: MANDIS },
              { label: 'Alert Type', key: 'alertType', type: 'select', options: ['above', 'below'] },
              { label: 'Notification Method', key: 'notificationMethod', type: 'select', options: ['app', 'sms', 'email'] },
            ].map(({ label, key, type, options }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">{label}</label>
                <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium capitalize">
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Target Price (₹/qtl)</label>
              <input type="number" required value={form.targetPrice} onChange={e => setForm(f => ({ ...f, targetPrice: e.target.value }))}
                placeholder={`Alert when price goes ${form.alertType} this value`}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors disabled:opacity-60">
                {saving ? 'Creating...' : 'Create Alert'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-slate-100 dark:bg-brand-dark/30 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl">
          <Bell className="h-10 w-10 mx-auto mb-3 text-slate-300 dark:text-brand-dark/50" />
          <p className="font-semibold text-slate-600 dark:text-slate-400">No price alerts yet</p>
          <p className="text-sm text-slate-400 mt-1 mb-4">Set alerts to get notified about price changes</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">Create First Alert</button>
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-brand-dark/20 border-b border-slate-100 dark:border-brand-dark/30">
                  {['Commodity', 'Mandi', 'Alert Type', 'Target Price', 'Method', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-brand-dark/10">
                {alerts.map((alert) => (
                  <tr key={alert._id} className="hover:bg-slate-50 dark:hover:bg-brand-dark/10 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">{alert.commodity}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{alert.mandiName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${alert.alertType === 'above' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                        {alert.alertType === 'above' ? '↑ Above' : '↓ Below'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-slate-800 dark:text-white">₹{alert.targetPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 capitalize">{alert.notificationMethod}</td>
                    <td className="px-4 py-3"><StatusBadge status={alert.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(alert)}
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-brand-dark/20 text-slate-500 hover:text-brand-medium dark:hover:text-brand-accent transition-colors">
                        {alert.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
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
