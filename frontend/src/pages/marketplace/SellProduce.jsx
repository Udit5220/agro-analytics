import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronDown } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const COMMODITIES = ['Wheat', 'Soybean', 'Cotton', 'Onion', 'Maize', 'Paddy', 'Chana', 'Mustard', 'Turmeric', 'Tomato'];
const STATES = { 'Madhya Pradesh': ['Indore','Bhopal','Dewas','Khandwa'], 'Maharashtra': ['Nashik','Nagpur','Akola','Pune'], 'Rajasthan': ['Jaipur','Kota','Ajmer'], 'Gujarat': ['Rajkot','Surat','Ahmedabad'], 'Andhra Pradesh': ['Guntur','Krishna','Kurnool'] };

const Field = ({ label, children, required }) => (
  <div><label className={`block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 ${required ? 'after:content-["*"] after:text-red-400 after:ml-0.5' : ''}`}>{label}</label>{children}</div>
);
const inputCls = "w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-slate-50 dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium transition-colors";

export default function SellProduce() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    sellerName: '', sellerType: 'farmer', listingType: 'produce',
    commodity: 'Wheat', productName: '', variety: '', grade: 'FAQ',
    quantity: '', unit: 'Quintal', expectedPrice: '',
    pickupLocation: '', district: '', state: 'Madhya Pradesh',
    description: '', contactPreference: 'call', contactNumber: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const selectedDistricts = STATES[form.state] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await marketplaceApi.createListing({ ...form, quantity: Number(form.quantity), expectedPrice: Number(form.expectedPrice) });
      setSuccess(true);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center h-full py-24 animate-fadeIn text-center">
      <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-black text-slate-800 dark:text-white">Listing Published!</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">Your produce listing is now live. Buyers can view and make offers.</p>
      <div className="flex gap-3 mt-8">
        <button onClick={() => navigate('/module/marketplace/my-listings')} className="px-5 py-2.5 bg-brand-medium text-white rounded-xl font-bold hover:bg-brand-dark transition-colors">My Listings</button>
        <button onClick={() => { setSuccess(false); setForm({ sellerName: '', sellerType: 'farmer', listingType: 'produce', commodity: 'Wheat', productName: '', variety: '', grade: 'FAQ', quantity: '', unit: 'Quintal', expectedPrice: '', pickupLocation: '', district: '', state: 'Madhya Pradesh', description: '', contactPreference: 'call', contactNumber: '' }); setStep(1); }}
          className="px-5 py-2.5 bg-slate-100 dark:bg-brand-dark/30 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 transition-colors">Add Another</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Sell Your Produce</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">List your produce to reach buyers across India</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-2">
        {['Details', 'Pricing', 'Contact'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step > i + 1 ? 'text-brand-medium dark:text-brand-accent' : step === i + 1 ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-brand-dark/50'}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black border-2 ${step === i + 1 ? 'border-brand-medium bg-brand-medium text-white' : step > i + 1 ? 'border-brand-medium/50 bg-brand-medium/10' : 'border-slate-200 dark:border-brand-dark/40'}`}>{step > i + 1 ? '✓' : i + 1}</div>
              <span className="text-sm font-semibold hidden sm:block">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${step > i + 1 ? 'bg-brand-medium/50' : 'bg-slate-200 dark:bg-brand-dark/30'}`} />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-6 space-y-5">
        {/* Step 1 — Product Details */}
        {step === 1 && (
          <>
            <Field label="Seller Name" required><input required value={form.sellerName} onChange={e => set('sellerName', e.target.value)} className={inputCls} placeholder="Your full name / FPO name" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Seller Type" required><select value={form.sellerType} onChange={e => set('sellerType', e.target.value)} className={inputCls}>{['farmer','fpo','trader','dealer','processor'].map(o => <option key={o} value={o} className="capitalize">{o}</option>)}</select></Field>
              <Field label="Listing Type" required><select value={form.listingType} onChange={e => set('listingType', e.target.value)} className={inputCls}>{['produce','input','service'].map(o => <option key={o} value={o} className="capitalize">{o}</option>)}</select></Field>
            </div>
            <Field label="Commodity" required><select value={form.commodity} onChange={e => set('commodity', e.target.value)} className={inputCls}>{COMMODITIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Product Name" required><input required value={form.productName} onChange={e => set('productName', e.target.value)} className={inputCls} placeholder="e.g. Wheat — Lok-1 Variety, Fresh Harvest" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Variety"><input value={form.variety} onChange={e => set('variety', e.target.value)} className={inputCls} placeholder="e.g. Lok-1, JS-335" /></Field>
              <Field label="Grade"><select value={form.grade} onChange={e => set('grade', e.target.value)} className={inputCls}>{['FAQ','Grade-A','Grade-B','Export Grade','Crushing Grade','Dal Grade'].map(g => <option key={g}>{g}</option>)}</select></Field>
            </div>
            <Field label="Description"><textarea value={form.description} onChange={e => set('description', e.target.value)} className={`${inputCls} resize-none`} rows={3} placeholder="Describe quality, freshness, special notes..." /></Field>
          </>
        )}

        {/* Step 2 — Pricing & Location */}
        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity" required><input required type="number" min={1} value={form.quantity} onChange={e => set('quantity', e.target.value)} className={inputCls} placeholder="e.g. 100" /></Field>
              <Field label="Unit"><select value={form.unit} onChange={e => set('unit', e.target.value)} className={inputCls}>{['Quintal','MT','Bag','Kg','Acre'].map(u => <option key={u}>{u}</option>)}</select></Field>
            </div>
            <Field label="Expected Price (₹)" required><input required type="number" min={1} value={form.expectedPrice} onChange={e => set('expectedPrice', e.target.value)} className={inputCls} placeholder="Price per unit in ₹" /></Field>
            <Field label="Pickup Location" required><input required value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)} className={inputCls} placeholder="Village / Taluka / Mandi address" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State" required><select value={form.state} onChange={e => { set('state', e.target.value); set('district', ''); }} className={inputCls}>{Object.keys(STATES).map(s => <option key={s}>{s}</option>)}</select></Field>
              <Field label="District" required><select required value={form.district} onChange={e => set('district', e.target.value)} className={inputCls}><option value="">Select district</option>{selectedDistricts.map(d => <option key={d}>{d}</option>)}</select></Field>
            </div>
          </>
        )}

        {/* Step 3 — Contact */}
        {step === 3 && (
          <>
            <Field label="Contact Preference"><select value={form.contactPreference} onChange={e => set('contactPreference', e.target.value)} className={inputCls}>{['call','whatsapp','chat'].map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}</select></Field>
            <Field label="Contact Number"><input type="tel" value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} className={inputCls} placeholder="10-digit mobile number" /></Field>
            <div className="bg-slate-50 dark:bg-brand-dark/20 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Listing Summary</p>
              <p>{form.productName} · {form.quantity} {form.unit} · ₹{form.expectedPrice}/{form.unit}</p>
              <p className="mt-0.5 text-xs">{form.pickupLocation}, {form.district}, {form.state}</p>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {step > 1 && <button type="button" onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 bg-slate-100 dark:bg-brand-dark/30 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-colors">Back</button>}
          {step < 3 && <button type="button" onClick={() => setStep(s => s + 1)} className="flex-1 py-2.5 bg-brand-medium text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors">Continue →</button>}
          {step === 3 && <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-brand-medium text-white rounded-xl font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-60">{saving ? 'Publishing...' : 'Publish Listing'}</button>}
        </div>
      </form>
    </div>
  );
}
