import React, { useState, useEffect } from 'react';
import { Waves, RefreshCw, Filter, TrendingDown, AlertTriangle } from 'lucide-react';
import { weatherApi } from '../../services/apiService';

const StatusBadge = ({ status }) => {
  const cfg = {
    normal: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
    low: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30',
    critical: 'bg-red-500/10 text-red-500 border-red-200 dark:border-red-800/30',
    overflow: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg[status] || cfg.normal} capitalize`}>{status}</span>;
};

const ProgressBar = ({ pct, status }) => {
  const color = status === 'critical' ? 'bg-red-500' : status === 'low' ? 'bg-amber-500' : status === 'overflow' ? 'bg-blue-500' : 'bg-emerald-500';
  return (
    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-brand-dark/30 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
};

export default function ReservoirLevels() {
  const [reservoirs, setReservoirs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await weatherApi.getReservoirs({ status: filterStatus, limit: 20 });
      setReservoirs(res.data || []);
      setSummary(res.summary || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [filterStatus]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Reservoir & Dam Levels</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Major Indian reservoirs — live storage monitoring</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-white dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
          <option value="">All Statuses</option>
          <option value="critical">Critical</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="overflow">Overflow</option>
        </select>
      </div>

      {/* Summary KPIs */}
      {Object.keys(summary).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Avg. Storage', value: `${summary.avgStorage?.toFixed(0) || 0}%`, sub: 'National average' },
            { label: 'Critical', value: summary.critical || 0, sub: 'reservoirs', color: 'text-red-500' },
            { label: 'Low', value: summary.low || 0, sub: 'reservoirs', color: 'text-amber-500' },
            { label: 'Normal / Overflow', value: (summary.normal || 0) + (summary.overflow || 0), sub: 'reservoirs', color: 'text-emerald-600' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-medium">{label}</p>
              <p className={`text-2xl font-black mt-0.5 ${color || 'text-slate-800 dark:text-white'}`}>{value}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : reservoirs.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><Waves className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>No reservoirs found</p></div>
      ) : (
        <div className="space-y-4">
          {reservoirs.map((r, i) => (
            <div key={i} className={`bg-white dark:bg-brand-darkest/60 border rounded-2xl p-5 hover:shadow-md transition-all
              ${r.status === 'critical' ? 'border-red-200 dark:border-red-800/30' : r.status === 'low' ? 'border-amber-200 dark:border-amber-800/30' : 'border-slate-100 dark:border-brand-dark/30'}`}>
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{r.damName}</p>
                  <p className="text-xs text-slate-400">{r.district}, {r.state} · {r.river} River</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.status} />
                  {r.status === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Live Storage</span>
                  <span className="font-black text-slate-800 dark:text-white">{r.storagePercentage}%</span>
                </div>
                <ProgressBar pct={r.storagePercentage} status={r.status} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><p className="text-xs text-slate-400">Live Storage</p><p className="font-bold text-slate-700 dark:text-slate-300">{r.liveStorage} BCM</p></div>
                <div><p className="text-xs text-slate-400">Capacity</p><p className="font-bold text-slate-700 dark:text-slate-300">{r.storageCapacity} BCM</p></div>
                <div><p className="text-xs text-slate-400">vs Last Year</p><p className={`font-bold ${r.liveStorage >= r.previousYearStorage ? 'text-emerald-600' : 'text-red-500'}`}>{r.previousYearStorage} BCM</p></div>
                <div><p className="text-xs text-slate-400">10yr Average</p><p className="font-bold text-slate-700 dark:text-slate-300">{r.tenYearAvgStorage} BCM</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
