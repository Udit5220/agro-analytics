import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, Waves, RefreshCw, ArrowRight } from 'lucide-react';
import { weatherApi } from '../../services/apiService';

const DISTRICTS = ['Indore', 'Nashik', 'Jaipur', 'Nagpur', 'Guntur'];

const WeatherIcon = ({ condition, className = 'h-8 w-8' }) => {
  if (condition?.includes('Rain')) return <CloudRain className={`${className} text-blue-500`} />;
  if (condition?.includes('Cloud')) return <Cloud className={`${className} text-slate-400`} />;
  return <Sun className={`${className} text-amber-400`} />;
};

const RiskBadge = ({ level }) => {
  const cfg = { low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', high: 'bg-red-500/10 text-red-500' };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${cfg[level] || cfg.low}`}>{level} Risk</span>;
};

export default function WeatherDashboard() {
  const navigate = useNavigate();
  const [district, setDistrict] = useState('Indore');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reservoirs, setReservoirs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [curr, fc, al, res] = await Promise.all([
        weatherApi.getCurrentWeather(district),
        weatherApi.getForecast(district, 3),
        weatherApi.getAlerts({ district }),
        weatherApi.getReservoirs({ page: 1, limit: 3 }),
      ]);
      setCurrent(curr.data);
      setForecast(fc.data || []);
      setAlerts(al.data || []);
      setReservoirs(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [district]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Weather & Reservoir Intelligence</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time weather, reservoir levels & irrigation advisories</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={district} onChange={e => setDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-white dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
            {DISTRICTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <button onClick={fetchData} className="p-2 rounded-xl bg-brand-medium/10 text-brand-medium dark:text-brand-accent hover:bg-brand-medium/20 transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Current Weather Card */}
      {current ? (
        <div className="bg-gradient-to-br from-brand-dark to-brand-darkest rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
            <Sun className="h-full w-full" />
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-brand-accent/80 font-semibold text-sm">{current.locationName || district}, {current.state}</p>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-6xl font-black">{current.currentTemp}°</span>
                  <div className="pb-2">
                    <p className="text-brand-accent/70 text-sm">Min {current.minTemp}° / Max {current.maxTemp}°</p>
                    <p className="text-white/80 text-sm font-medium">{current.weatherCondition}</p>
                  </div>
                </div>
              </div>
              <WeatherIcon condition={current.weatherCondition} className="h-20 w-20 opacity-80" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-300" />
                <div><p className="text-xs text-white/60">Humidity</p><p className="font-bold">{current.humidity}%</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-white/70" />
                <div><p className="text-xs text-white/60">Wind</p><p className="font-bold">{current.windSpeed} km/h {current.windDirection}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-blue-300" />
                <div><p className="text-xs text-white/60">Rain Prob.</p><p className="font-bold">{current.rainProbability}%</p></div>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="h-48 flex items-center justify-center"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : (
        <div className="bg-slate-100 dark:bg-brand-dark/30 rounded-2xl p-6 text-center text-slate-400">No weather data available</div>
      )}

      {/* 3-Day Forecast Preview */}
      {forecast.length > 0 && (
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">3-Day Outlook</h2>
            <button onClick={() => navigate('/module/weather-reservoir/forecast')} className="text-sm text-brand-medium dark:text-brand-accent font-semibold flex items-center gap-1 hover:underline">
              Full Forecast <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {forecast.slice(0, 3).map((day, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-brand-dark/20">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {new Date(day.forecastDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                </p>
                <WeatherIcon condition={day.weatherCondition} className="h-8 w-8 mx-auto my-2" />
                <p className="font-bold text-slate-800 dark:text-white text-sm">{day.maxTemp}°</p>
                <p className="text-xs text-slate-400">{day.minTemp}°</p>
                <p className="text-xs text-blue-500 mt-1">{day.rainProbability}% rain</p>
                <RiskBadge level={day.riskLevel} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" />Active Alerts ({alerts.length})</h2>
            <button onClick={() => navigate('/module/weather-reservoir/weather-alerts')} className="text-sm text-brand-medium dark:text-brand-accent font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></button>
          </div>
          {alerts.slice(0, 2).map((a, i) => (
            <div key={i} className={`border rounded-2xl p-4 ${a.riskLevel === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30'}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${a.riskLevel === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{a.alertTitle}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{a.recommendedAction}</p>
                </div>
                <RiskBadge level={a.riskLevel} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservoir Summary */}
      {reservoirs.length > 0 && (
        <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2"><Waves className="h-4 w-4 text-blue-500" />Reservoir Levels</h2>
            <button onClick={() => navigate('/module/weather-reservoir/reservoirs')} className="text-sm text-brand-medium dark:text-brand-accent font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="h-3 w-3" /></button>
          </div>
          <div className="space-y-3">
            {reservoirs.slice(0, 3).map((r, i) => {
              const pct = r.storagePercentage || 0;
              const color = pct < 30 ? 'bg-red-500' : pct < 60 ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{r.damName}</span>
                    <span className={`font-bold ${pct < 30 ? 'text-red-500' : pct < 60 ? 'text-amber-500' : 'text-emerald-600'}`}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-brand-dark/30">
                    <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{r.state} • {r.liveStorage} BCM of {r.storageCapacity} BCM</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
