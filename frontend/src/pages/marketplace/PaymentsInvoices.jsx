import React, { useState, useEffect } from 'react';
import { Receipt, RefreshCw, Download } from 'lucide-react';
import { marketplaceApi } from '../../services/apiService';

const PaymentBadge = ({ status }) => {
  const cfg = { paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', pending: 'bg-amber-500/10 text-amber-600', failed: 'bg-red-500/10 text-red-500', refunded: 'bg-blue-500/10 text-blue-600' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg[status] || cfg.pending}`}>{status}</span>;
};

export default function PaymentsInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    marketplaceApi.getInvoices().then(r => { setInvoices(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalPaid = invoices.filter(i => i.paymentStatus === 'paid').reduce((s, i) => s + i.totalAmount, 0);
  const totalPending = invoices.filter(i => i.paymentStatus === 'pending').reduce((s, i) => s + i.totalAmount, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Payments & Invoices</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{invoices.length} invoices total</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Invoices', value: invoices.length, color: '' },
          { label: 'Amount Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Pending', value: `₹${totalPending.toLocaleString()}`, color: 'text-amber-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4 text-center">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className={`text-xl font-black mt-1 ${color || 'text-slate-800 dark:text-white'}`}>{value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl"><Receipt className="h-10 w-10 mx-auto mb-3 opacity-40" /><p className="text-slate-400">No invoices yet</p></div>
      ) : (
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-brand-dark/20 border-b border-slate-100 dark:border-brand-dark/30">
                  {['Invoice #', 'Commodity', 'Buyer', 'Seller', 'Qty', 'Amount', 'Tax', 'Total', 'Payment', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-brand-dark/10">
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-50 dark:hover:bg-brand-dark/10 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 font-bold text-slate-800 dark:text-white">{inv.commodity}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{inv.buyerName}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{inv.sellerName}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{inv.quantity} {inv.unit}</td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">₹{inv.amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{inv.taxRate}% (₹{inv.taxAmount?.toLocaleString()})</td>
                    <td className="px-4 py-3 font-black text-slate-800 dark:text-white whitespace-nowrap">₹{inv.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3"><PaymentBadge status={inv.paymentStatus} /></td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-dark/30 text-slate-400 hover:text-brand-medium dark:hover:text-brand-accent transition-colors" title="Download Invoice">
                        <Download className="h-4 w-4" />
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
