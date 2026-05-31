import React, { useState, useEffect } from 'react';
import { CloudRain, Droplets, RefreshCw, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { weatherApi } from '../../services/apiService';

const DISTRICTS = ['Indore', 'Nashik', 'Jaipur', 'Nagpur', 'Guntur'];

const IntensityBadge = ({ mm }) => {
  if (mm >= 50) return <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">Extreme</span>;
  if (mm >= 20) return <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full">Heavy</span>;
  if (mm >= 8) return <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">Moderate</span>;
  if (mm >= 2) return <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">Light</span>;
  return <span className="text-xs bg-slate-100 dark:bg-brand-dark/30 text-slate-500 font-bold px-2 py-0.5 rounded-full">Trace</span>;
};

const getBarColor = (mm) => {
  if (mm >= 50) return '#ef4444';
  if (mm >= 20) return '#f97316';
  if (mm >= 8) return '#f59e0b';
  if (mm >= 2) return '#3b82f6';
  return '#94a3b8';
};

export default function RainfallForecast() {
  const [district, setDistrict] = useState('Indore');
  const [rainfall, setRainfall] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await weatherApi.getRainfall(district, 14);
      const formatted = (res.data || []).map(d => ({
        ...d,
        date: new Date(d.forecastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      }));
      setRainfall(formatted);
      setSummary(res.summary || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [district]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Rainfall Forecast</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">14-day rainfall forecast for your region</p>
        </div>
        <select value={district} onChange={e => setDistrict(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-white dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Expected', value: `${summary.totalExpectedRainfall || 0} mm`, icon: CloudRain, color: 'text-blue-500' },
          { label: 'Avg Rain Prob.', value: `${summary.avgRainProbability || 0}%`, icon: Droplets, color: 'text-blue-400' },
          { label: 'Heavy Rain Days', value: summary.heavyRainDays || 0, icon: AlertTriangle, color: 'text-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-4 text-center">
            <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
            <p className="text-xl font-black text-slate-800 dark:text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Rainfall Chart */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Rainfall Intensity — {district}</h2>
        {loading ? (
          <div className="h-64 flex items-center justify-center"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rainfall} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} unit=" mm" />
              <Tooltip formatter={(v) => [`${v} mm`, 'Rainfall']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="expectedRainfall" radius={[6, 6, 0, 0]}>
                {rainfall.map((entry, i) => <Cell key={i} fill={getBarColor(entry.expectedRainfall)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Rainfall Table */}
      {!loading && rainfall.length > 0 && (
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-brand-dark/20 border-b border-slate-100 dark:border-brand-dark/30">
                  {['Date', 'Condition', 'Expected Rainfall', 'Rain Prob.', 'Risk', 'Intensity'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-brand-dark/10">
                {rainfall.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-brand-dark/10 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{d.date}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{d.weatherCondition}</td>
                    <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">{d.expectedRainfall} mm</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{d.rainProbability}%</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${d.riskLevel === 'high' ? 'bg-red-100 text-red-600' : d.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {d.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3"><IntensityBadge mm={d.expectedRainfall} /></td>
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
