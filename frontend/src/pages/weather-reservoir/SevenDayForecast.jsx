import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Droplets, Wind, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { weatherApi } from '../../services/apiService';

const DISTRICTS = ['Indore', 'Nashik', 'Jaipur', 'Nagpur', 'Guntur'];

const WeatherIcon = ({ cond, size = 'h-10 w-10' }) => {
  if (cond?.includes('Rain')) return <CloudRain className={`${size} text-blue-500`} />;
  if (cond?.includes('Cloud')) return <Cloud className={`${size} text-slate-400`} />;
  return <Sun className={`${size} text-amber-400`} />;
};

const ActivityBadge = ({ risk }) => {
  if (risk === 'high') return <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded-full">⚠ High Risk</span>;
  if (risk === 'medium') return <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">Caution</span>;
  return <span className="text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">✓ Good</span>;
};

export default function SevenDayForecast() {
  const [district, setDistrict] = useState('Indore');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await weatherApi.getForecast(district, 7);
      setForecast(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, [district]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">7-Day Weather Forecast</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Plan your farm activities with confidence</p>
        </div>
        <select value={district} onChange={e => setDistrict(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-brand-dark/40 bg-white dark:bg-brand-dark/20 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-medium">
          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><RefreshCw className="h-7 w-7 text-brand-medium animate-spin" /></div>
      ) : forecast.length === 0 ? (
        <div className="text-center py-16 text-slate-400"><Cloud className="h-10 w-10 mx-auto mb-3 opacity-40" /><p>No forecast data available</p></div>
      ) : (
        <div className="space-y-3">
          {forecast.map((day, i) => (
            <div key={i} className={`bg-white dark:bg-brand-darkest/60 border rounded-2xl p-5 transition-all hover:shadow-md
              ${day.riskLevel === 'high' ? 'border-red-200 dark:border-red-800/30' : day.riskLevel === 'medium' ? 'border-amber-200 dark:border-amber-800/30' : 'border-slate-100 dark:border-brand-dark/30'}`}>
              <div className="flex items-center gap-4 flex-wrap">
                {/* Date */}
                <div className="w-24 flex-shrink-0">
                  <p className="font-bold text-slate-800 dark:text-white">{new Date(day.forecastDate).toLocaleDateString('en-IN', { weekday: 'long' })}</p>
                  <p className="text-xs text-slate-400">{new Date(day.forecastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>

                {/* Icon */}
                <WeatherIcon cond={day.weatherCondition} />

                {/* Condition */}
                <div className="flex-1 min-w-[120px]">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{day.weatherCondition}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{day.recommendation}</p>
                </div>

                {/* Temp */}
                <div className="text-center">
                  <p className="text-2xl font-black text-slate-800 dark:text-white">{day.maxTemp}°</p>
                  <p className="text-sm text-slate-400">{day.minTemp}°</p>
                </div>

                {/* Rain */}
                <div className="flex items-center gap-2 text-sm text-blue-500">
                  <Droplets className="h-4 w-4" />
                  <div>
                    <p className="font-bold">{day.rainProbability}%</p>
                    <p className="text-xs text-slate-400">{day.expectedRainfall} mm</p>
                  </div>
                </div>

                {/* Wind */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Wind className="h-4 w-4" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-slate-300">{day.windSpeed} km/h</p>
                    <p className="text-xs">{day.windDirection}</p>
                  </div>
                </div>

                {/* Risk */}
                <ActivityBadge risk={day.riskLevel} />
              </div>

              {/* Farming Activity */}
              {day.farmingActivity && (
                <div className="mt-3 pt-3 border-t border-slate-50 dark:border-brand-dark/20 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-3.5 w-3.5 text-brand-medium dark:text-brand-accent flex-shrink-0" />
                  <span><span className="font-semibold text-slate-700 dark:text-slate-300">Farm Activity:</span> {day.farmingActivity}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
