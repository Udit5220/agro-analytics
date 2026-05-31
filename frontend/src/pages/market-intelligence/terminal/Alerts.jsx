import React from 'react';
import { Bell, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const mockAlerts = [
  { id: 1, commodity: 'Wheat', type: 'Price Alert', condition: 'Crosses above ₹2,400', status: 'Active' },
  { id: 2, commodity: 'Soybean', type: 'Spread Alert', condition: 'Basis widens past -₹200', status: 'Triggered' },
  { id: 3, commodity: 'Cotton', type: 'Signal Alert', condition: 'Changes to Bearish', status: 'Triggered' },
  { id: 4, commodity: 'USD/INR', type: 'Currency Alert', condition: 'Crosses above 84.00', status: 'Active' },
];

export default function Alerts() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Alerts & Notifications</h2>
          <p className="text-sm text-slate-400 mt-1">Set automated triggers for price, spread, and market signal changes.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create New Alert
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Active Alerts Table */}
        <div className="xl:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#334155] flex justify-between items-center bg-[#0f172a]">
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
                {mockAlerts.map((a) => (
                  <tr key={a.id} className="hover:bg-[#334155]/30">
                    <td className="p-4 font-bold text-white">{a.commodity}</td>
                    <td className="p-4 text-slate-300 text-sm">{a.type}</td>
                    <td className="p-4 text-slate-300 font-mono text-sm">{a.condition}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        a.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                      }`}>
                        {a.status === 'Active' && <CheckCircle2 className="h-3 w-3" />}
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-500 hover:text-rose-400 transition-colors p-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Create Alert Form Mock */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-5">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Quick Alert Setup</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Commodity</label>
                <select className="w-full bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500">
                  <option>Wheat</option>
                  <option>Cotton</option>
                  <option>Soybean</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alert Type</label>
                <select className="w-full bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500">
                  <option>Spot Price</option>
                  <option>Future Spread</option>
                  <option>Market Signal Change</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Condition</label>
                <div className="flex gap-2">
                  <select className="w-1/3 bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500">
                    <option>Crosses Above</option>
                    <option>Drops Below</option>
                  </select>
                  <input type="text" placeholder="Value (e.g. 2400)" className="w-2/3 bg-[#1e293b] border border-[#334155] text-white font-mono text-sm rounded px-3 py-2 focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <button className="w-full py-2 bg-[#334155] hover:bg-[#475569] text-white rounded text-sm font-bold transition-colors mt-2">
                Save Alert
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
