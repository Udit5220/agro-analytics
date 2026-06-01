import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { commodityApi } from '../../../services/apiService';

const COMMODITIES = ['Wheat', 'Onion', 'Maize', 'Paddy', 'Turmeric', 'Tomato', 'Soybean', 'Cotton', 'Groundnut', 'Bajra'];
const ALERT_TYPES = ['Spot Price', 'Futures Price', 'Spread', 'Market Signal', 'Currency Impact'];
const CONDITIONS = ['Crosses Above', 'Drops Below', 'Spread Above', 'Spread Below', 'Signal Turns Bullish', 'Signal Turns Bearish'];
const NOTIFICATION_METHODS = ['In-app', 'Email', 'SMS', 'WhatsApp'];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [form, setForm] = useState({
    commodity: 'Wheat',
    alertType: 'Spot Price',
    condition: 'Crosses Above',
    targetValue: '',
    notificationMethod: 'In-app',
    status: 'Active'
  });

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await commodityApi.getPriceAlerts();
      // Only keep 'active' alerts, map backend format if necessary
      const activeAlerts = (res.data || []).filter(a => a.status === 'Active' || a.status === 'active');
      setAlerts(activeAlerts);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchAlerts(); 
  }, []);

  const openModal = () => {
    setForm({
      commodity: 'Wheat',
      alertType: 'Spot Price',
      condition: 'Crosses Above',
      targetValue: '',
      notificationMethod: 'In-app',
      status: 'Active'
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 5000);
  };

  const validateForm = () => {
    if (!form.commodity || !form.alertType || !form.condition) {
      return "All select fields are required.";
    }
    const isSignalAlert = form.condition.includes('Signal');
    if (!isSignalAlert && (!form.targetValue || isNaN(form.targetValue))) {
      return "Target value is required and must be a number for price/spread alerts.";
    }
    return null;
  };

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg('');
    setSaving(true);
    try {
      const payload = {
        commodity: form.commodity,
        alertType: form.alertType,
        condition: form.condition,
        targetValue: form.targetValue ? Number(form.targetValue) : null,
        notificationMethod: form.notificationMethod,
        status: form.status
      };
      
      const res = await commodityApi.createCommodityAlert(payload);
      
      if (res.alert) {
        // Optimistically add to top of list
        setAlerts([res.alert, ...alerts]);
      }
      
      const msg = res.message?.includes('locally') 
        ? "Alert created locally. Backend save unavailable." 
        : `Alert created successfully. Token: ${res.token}`;
        
      showToast(msg);
      closeModal();
    } catch (e) { 
      console.error(e);
      setErrorMsg('Failed to save alert. Please try again.');
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id) => {
    try {
      // updatePriceAlert exists, try it
      await commodityApi.updatePriceAlert(id, { status: 'deleted' }).catch(() => {});
      setAlerts(a => a.filter(item => (item.id || item._id) !== id));
      showToast("Alert removed successfully");
    } catch (e) { 
      console.error(e);
      // fallback local remove
      setAlerts(a => a.filter(item => (item.id || item._id) !== id));
      showToast("Alert removed successfully (locally)");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* TOAST MESSAGE */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-[#0A0D14] border border-emerald-500/30 text-emerald-600 px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slideInRight">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Alerts & Notifications</h2>
          <p className="text-sm text-slate-400 mt-1">Set automated triggers for price, spread, and market signal changes.</p>
        </div>
        <button 
          onClick={openModal}
          className="px-4 py-2 bg-[#0A0D14] hover:hover:bg-[#1e293b] text-white rounded text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create New Alert
        </button>
      </div>

      {/* Main Table Area */}
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0A0D14]">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-500" />
            Manage Alerts
          </h3>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e293b] border-b border-[#334155]">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Commodity / Asset</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Alert Type</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Condition</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {alerts.map((a) => {
                const uid = a.id || a._id;
                // Fallbacks for older alerts missing these fields
                const displayType = a.alertType || 'Price Alert';
                let displayCondition = a.condition;
                if (!displayCondition) {
                  displayCondition = (a.targetPrice) ? `Target ₹${a.targetPrice}` : 'Threshold Alert';
                }

                return (
                  <tr key={uid} className="hover:hover:bg-[#0f172a]">
                    <td className="p-4 font-bold text-slate-200">{a.commodity}</td>
                    <td className="p-4 text-slate-300 text-sm">{displayType}</td>
                    <td className="p-4 text-slate-300 font-mono text-sm">
                      {displayCondition}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        (a.status === 'Active' || a.status === 'active') ? 'bg-emerald-100 border-emerald-200 text-emerald-800' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                      }`}>
                        {(a.status === 'Active' || a.status === 'active') && <CheckCircle2 className="h-3 w-3" />}
                        {a.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(uid)} className="text-slate-500 hover:text-rose-600 transition-colors p-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No active alerts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0A0D14] border border-[#334155] rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform animate-scaleIn">
            <div className="px-5 py-4 border-b border-[#334155] flex justify-between items-center bg-[#1e293b]">
              <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider">Create New Alert</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-200 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSaveAlert} className="space-y-5">
                
                {errorMsg && (
                  <div className="px-4 py-2 bg-rose-100 border border-rose-200 rounded text-rose-800 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Commodity</label>
                  <select 
                    value={form.commodity} 
                    onChange={e => setForm({ ...form, commodity: e.target.value })} 
                    className="w-full bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alert Type</label>
                  <select 
                    value={form.alertType} 
                    onChange={e => setForm({ ...form, alertType: e.target.value })} 
                    className="w-full bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    {ALERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Condition</label>
                    <select 
                      value={form.condition} 
                      onChange={e => setForm({ ...form, condition: e.target.value, targetValue: e.target.value.includes('Signal') ? '' : form.targetValue })} 
                      className="w-full bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                    >
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Value</label>
                    <input 
                      type="number" 
                      value={form.targetValue} 
                      onChange={e => setForm({ ...form, targetValue: e.target.value })} 
                      placeholder="e.g. 2400" 
                      disabled={form.condition.includes('Signal')}
                      className="w-full bg-[#1e293b] border border-[#334155] text-slate-200 font-mono text-sm rounded px-3 py-2.5 focus:outline-none focus:border-emerald-500 disabled:opacity-40" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notification Method</label>
                  <select 
                    value={form.notificationMethod} 
                    onChange={e => setForm({ ...form, notificationMethod: e.target.value })} 
                    className="w-full bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded px-3 py-2.5 focus:outline-none focus:border-emerald-500"
                  >
                    {NOTIFICATION_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={closeModal} 
                    className="px-4 py-2 text-slate-300 hover:text-slate-200 transition-colors text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="px-6 py-2 bg-[#0A0D14] hover:hover:bg-[#1e293b] text-white rounded text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Alert'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
