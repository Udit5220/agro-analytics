import React from 'react';
import { Map, Layers, Wifi, Info } from 'lucide-react';

export default function RadarMaps() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Radar & Maps</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Live weather radar and geographical overlays</p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">Live Radar Integration Coming Soon</p>
          <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">Live weather radar from IMD and satellite maps will be integrated in the next phase. Currently showing placeholder tiles.</p>
        </div>
      </div>

      {/* Placeholder Map Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: 'Rain Radar', sub: 'IMD Doppler radar overlay', icon: Wifi, color: 'from-blue-500/20 to-blue-600/5' },
          { title: 'Temperature Map', sub: 'District-level heatmap', icon: Layers, color: 'from-amber-500/20 to-orange-500/5' },
          { title: 'Wind Flow', sub: 'Wind speed and direction overlay', icon: Map, color: 'from-teal-500/20 to-cyan-500/5' },
          { title: 'Reservoir Map', sub: 'Major dam and reservoir locations', icon: Map, color: 'from-brand-medium/20 to-brand-light/5' },
        ].map(({ title, sub, icon: Icon, color }) => (
          <div key={title} className={`bg-gradient-to-br ${color} border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[200px] hover:shadow-md transition-all`}>
            <div className="h-14 w-14 rounded-2xl bg-white/50 dark:bg-brand-dark/30 flex items-center justify-center mb-4">
              <Icon className="h-7 w-7 text-brand-medium dark:text-brand-accent" />
            </div>
            <p className="font-bold text-slate-800 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>
            <span className="mt-3 text-xs bg-white/60 dark:bg-brand-dark/40 text-slate-500 px-3 py-1 rounded-full">Coming Soon</span>
          </div>
        ))}
      </div>

      {/* Links to external resources */}
      <div className="bg-white dark:bg-brand-darkest/60 border border-slate-100 dark:border-brand-dark/30 rounded-2xl p-5">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">Useful External Weather Resources</h2>
        <div className="space-y-2">
          {[
            { name: 'IMD Agromet Advisory', url: 'https://internal.imd.gov.in/pages/agromet_main_mausam.php', desc: 'Official IMD agro-meteorological advisory' },
            { name: 'India WRIS', url: 'https://indiawris.gov.in', desc: 'Water resources information system — reservoir data' },
            { name: 'CWC Flood Portal', url: 'https://cwc.gov.in', desc: 'Central Water Commission flood and reservoir monitoring' },
          ].map(({ name, url, desc }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-brand-dark/20 hover:bg-slate-100 dark:hover:bg-brand-dark/30 transition-colors group">
              <div>
                <p className="font-semibold text-brand-medium dark:text-brand-accent text-sm group-hover:underline">{name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
              <span className="text-slate-300 dark:text-slate-600 text-xs">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
