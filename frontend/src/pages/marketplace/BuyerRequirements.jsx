import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, RefreshCw, CheckCircle } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const STATES = ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Gujarat', 'Andhra Pradesh', 'Delhi', 'Kerala', 'Karnataka'];
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium transition-colors";

export default function BuyerRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCommodity, setFilterCommodity] = useState('');
  const [form, setForm] = useState({ buyerName: '', buyerType: 'trader', commodity: 'Wheat', variety: 'Any', grade: 'FAQ', quantity: '', unit: 'Quintal', targetPrice: '', deliveryLocation: '', district: '', state: 'Madhya Pradesh', notes: '', contactNumber: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await marketplaceApi.getBuyerRequirements(filterCommodity ? { commodity: filterCommodity } : {});
      setRequirements(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [filterCommodity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await marketplaceApi.createBuyerRequirement({ ...form, quantity: Number(form.quantity), targetPrice: Number(form.targetPrice) });
      setShowForm(false);
      await fetch_();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Buyer Requirements</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Active purchase requirements from traders, processors & exporters</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-medium text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition-colors">
          <Plus className="h-4 w-4" /> Post Requirement
        </button>
      </div>

      {/* Commodity Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {['', ...COMMODITIES].map(c => (
          <button key={c} onClick={() => setFilterCommodity(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${filterCommodity === c ? 'bg-brand-medium text-white border-brand-medium' : 'bg-white dark:bg-brand-dark/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-brand-dark/40 hover:border-brand-medium/40'}`}>
            {c || 'All'}
          </button>
        ))}
      </div>

      {/* Post Requirement Form */}
      {showForm && (
        <div className="bg-white dark:bg-brand-darkest/60 border border-brand-medium/30 rounded-2xl p-5">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Post Purchase Requirement</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Buyer Name *</label><input required value={form.buyerName} onChange={e => set('buyerName', e.target.value)} className={inputCls} placeholder="Company / Person name" /></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Buyer Type</label><select value={form.buyerType} onChange={e => set('buyerType', e.target.value)} className={inputCls}>{['trader','processor','retailer','fpo','exporter','other'].map(o => <option key={o}>{o}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Commodity *</label><select required value={form.commodity} onChange={e => set('commodity', e.target.value)} className={inputCls}>{COMMODITIES.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Grade</label><select value={form.grade} onChange={e => set('grade', e.target.value)} className={inputCls}>{['FAQ','Grade-A','Any','Export Grade','Crushing Grade'].map(g => <option key={g}>{g}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Quantity *</label><input required type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} placeholder="e.g. 1000" /></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Target Price (₹/qtl) *</label><input required type="number" value={form.targetPrice} onChange={e => set('targetPrice', e.target.value)} className={inputCls} placeholder="Max price you'll pay" /></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Delivery Location *</label><input required value={form.deliveryLocation} onChange={e => set('deliveryLocation', e.target.value)} className={inputCls} placeholder="Factory / Warehouse address" /></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">State *</label><select required value={form.state} onChange={e => set('state', e.target.value)} className={inputCls}>{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">District *</label><input required value={form.district} onChange={e => set('district', e.target.value)} className={inputCls} placeholder="District name" /></div>
            <div><label className="text-xs font-semibold text-slate-400 mb-1 block">Contact Number</label><input type="tel" value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} className={inputCls} placeholder="10-digit number" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-semibold text-slate-400 mb-1 block">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} className={`${inputCls} resize-none`} rows={2} placeholder="Quality specs, payment terms, etc." /></div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-brand-medium text-white rounded-xl font-bold text-sm disabled:opacity-60 hover:bg-brand-dark transition-colors">{saving ? 'Posting...' : 'Post Requirement'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 bg-slate-100 dark:bg-brand-dark/30 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : requirements.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl"><ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" /><p className="text-slate-400">No active requirements</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {requirements.map((r) => (
            <div key={r._id} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 hover:border-brand-medium/30 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full capitalize">{r.buyerType}</span>
                  <p className="font-bold text-slate-800 dark:text-white mt-1">{r.buyerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-800 dark:text-white">₹{r.targetPrice?.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">/qtl target</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Commodity:</span> {r.commodity}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Grade:</span> {r.grade}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">Quantity:</span> {r.quantity} {r.unit}</span>
                <span><span className="font-semibold text-slate-600 dark:text-slate-300">By:</span> {r.requiredByDate ? new Date(r.requiredByDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Flexible'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{r.district}, {r.state}</span>
                <button onClick={() => window.location.href = `tel:${r.contactNumber}`} className="flex items-center gap-1.5 text-brand-medium dark:text-brand-accent font-bold hover:underline">Contact Buyer →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
