import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Clock, Sprout } from 'lucide-react';
import { weatherApi } from '../../services/apiService';

const TYPE_LABELS = {
  heavy_rain: 'Heavy Rain', heatwave: 'Heatwave', frost: 'Frost', strong_wind: 'Strong Wind',
  hailstorm: 'Hailstorm', low_reservoir: 'Low Reservoir', irrigation_warning: 'Irrigation Warning',
  harvesting_risk: 'Harvesting Risk', cyclone: 'Cyclone', fog: 'Dense Fog',
};

const RISK_CONFIG = {
  high: { card: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30', badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200', icon: 'text-red-500' },
  medium: { card: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30', badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200', icon: 'text-amber-500' },
  low: { card: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200', icon: 'text-emerald-500' },
};

export default function WeatherAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('');

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await weatherApi.getAlerts(filterRisk ? { riskLevel: filterRisk } : {});
      setAlerts(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [filterRisk]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Weather Alerts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{alerts.length} active alerts across India</p>
        </div>
        <div className="flex gap-2">
          {['', 'high', 'medium', 'low'].map(r => (
            <button key={r} onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${filterRisk === r ? 'bg-brand-medium text-white border-brand-medium' : 'bg-white dark:bg-brand-dark/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-brand-dark/40 hover:border-brand-medium/40'}`}>
              {r === '' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl">
          <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="font-semibold text-slate-600 dark:text-slate-400">No active alerts</p>
          <p className="text-sm text-slate-400 mt-1">Current weather conditions are favorable</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((a, i) => {
            const cfg = RISK_CONFIG[a.riskLevel] || RISK_CONFIG.low;
            const start = new Date(a.startTime);
            const end = new Date(a.endTime);
            return (
              <div key={i} className={`border rounded-2xl p-5 ${cfg.card}`}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${cfg.icon}`} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-800 dark:text-white">{a.alertTitle}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>{a.riskLevel?.toUpperCase()} RISK</span>
                        <span className="text-xs bg-white/60 dark:bg-brand-dark/30 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">{TYPE_LABELS[a.alertType] || a.alertType}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{a.district}, {a.state}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} — {end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{a.description}</p>

                {a.recommendedAction && (
                  <div className="mt-3 pt-3 border-t border-white/30 dark:border-brand-dark/20 flex items-start gap-2">
                    <Sprout className="h-4 w-4 text-brand-medium dark:text-brand-accent flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Action: </span>{a.recommendedAction}</p>
                  </div>
                )}

                {a.affectedCrops?.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-semibold">Affected Crops:</span>
                    {a.affectedCrops.map(c => (
                      <span key={c} className="text-xs bg-white/60 dark:bg-brand-dark/30 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">{c}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
