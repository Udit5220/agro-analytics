import React, { useState, useEffect } from 'react';
import { Droplets, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { weatherApi } from '../../services/apiService';

const DISTRICTS = ['Indore', 'Nashik', 'Jaipur', 'Nagpur', 'Guntur'];

const AdviceBadge = ({ advice }) => {
  const cfg = {
    irrigate_today: { bg: 'bg-blue-500/10 border-blue-200 text-blue-600', icon: <Droplets className="h-4 w-4 text-blue-500" />, label: 'Irrigate Today' },
    wait: { bg: 'bg-amber-500/10 border-amber-200 text-amber-600', icon: <Clock className="h-4 w-4 text-amber-500" />, label: 'Wait' },
    avoid: { bg: 'bg-red-500/10 border-red-200 text-red-500', icon: <XCircle className="h-4 w-4 text-red-500" />, label: 'Skip Irrigation' },
    reduce: { bg: 'bg-amber-500/10 border-amber-200 text-amber-600', icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, label: 'Reduce Water' },
    monitor: { bg: 'bg-emerald-500/10 border-emerald-200 text-emerald-600', icon: <CheckCircle className="h-4 w-4 text-emerald-500" />, label: 'Monitor' },
  };
  const c = cfg[advice] || cfg.monitor;
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold ${c.bg}`}>
      {c.icon} {c.label}
    </div>
  );
};

export default function IrrigationAdvisory() {
  const [district, setDistrict] = useState('Indore');
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await weatherApi.getIrrigationAdvisory(district);
      setAdvisories(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [district]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Irrigation Advisory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crop-specific irrigation recommendations based on weather & reservoir data</p>
        </div>
        <select value={district} onChange={e => setDistrict(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-white dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : advisories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl text-slate-400">
          <Droplets className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>No advisories available for {district}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {advisories.map((a, i) => (
            <div key={i} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{a.crop}</p>
                  <p className="text-xs text-slate-400">{a.locationName}, {a.state}</p>
                </div>
                <AdviceBadge advice={a.irrigationAdvice} />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{a.recommendation}</p>

              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-50 dark:border-brand-dark/20 pt-3">
                <div><span className="text-slate-400">Rain Expected</span><span className={`ml-1 font-bold ${a.rainExpected ? 'text-blue-500' : 'text-slate-500'}`}>{a.rainExpected ? `Yes (${a.rainProbability}%)` : 'No'}</span></div>
                <div><span className="text-slate-400">Soil Moisture</span><span className={`ml-1 font-bold ${a.soilMoistureLevel === 'dry' ? 'text-red-500' : a.soilMoistureLevel === 'wet' ? 'text-blue-500' : 'text-emerald-600'} capitalize`}>{a.soilMoistureLevel || 'N/A'}</span></div>
                <div><span className="text-slate-400">Reservoir</span><span className={`ml-1 font-bold ${a.reservoirStatus === 'critical' ? 'text-red-500' : a.reservoirStatus === 'low' ? 'text-amber-500' : 'text-emerald-600'} capitalize`}>{a.reservoirStatus}</span></div>
                <div><span className="text-slate-400">Risk Level</span><span className={`ml-1 font-bold ${a.riskLevel === 'high' ? 'text-red-500' : a.riskLevel === 'medium' ? 'text-amber-500' : 'text-emerald-600'} capitalize`}>{a.riskLevel}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info footer */}
      <div className="bg-brand-medium/8 dark:bg-brand-dark/30 border border-brand-medium/20 rounded-2xl p-4 flex items-start gap-3">
        <Droplets className="h-5 w-5 text-brand-medium dark:text-brand-accent flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Advisory Note: </span>
          Advisories are updated daily based on IMD weather data, reservoir levels from CWC, and soil moisture estimates. Always cross-check with local conditions before making irrigation decisions.
        </div>
      </div>
    </div>
  );
}
