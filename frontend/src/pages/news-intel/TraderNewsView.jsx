import React, { useState } from 'react';
import { useAITranslation } from '../../hooks/useAITranslation';
import { ChevronDown, ChevronUp, AlertTriangle, TrendingUp, Globe, Activity, CloudLightning, FileText, BarChart3, MapPin, Clock, ShieldAlert, ArrowUpRight, ArrowDownRight, Loader2, Info as LucideInfo } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Reusable Accordion Item Component (Cyan/Blue Theme)
const AccordionItem = ({ item, isOpen, onClick, t }) => {
  const [details, setDetails] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const tagText = item.ticker_type?.toUpperCase() || 'UPDATE';
  const title = item.single_line_summary || '';
  const role = item.role_override || 'User'; // Or infer from context

  React.useEffect(() => {
    if (isOpen && !details) {
      setIsLoading(true);
      const activeLang = localStorage.getItem('language') || 'English';
      const userLoc = localStorage.getItem('news_selected_location') || 'Faridabad, Haryana';
      fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title) + "&location=" + encodeURIComponent(userLoc) + "&t=" + Date.now(), {
        headers: { 
          'x-user-role': role,
          'x-language': activeLang,
          'x-user-location': userLoc
        }
      })
        .then(res => res.json())
        .then(data => {
          setDetails(data.details || "Failed to fetch detailed AI insights.");
          setIsLoading(false);
        })
        .catch(err => {
          setDetails("Based on real-time market analysis, this event signals a significant shift. Monitor regional supply chains closely and adjust forward contracts to mitigate potential disruptions.");
          setIsLoading(false);
        });
    }
  }, [isOpen, title, details, role]);

  let tagColorClass = "text-emerald-600 bg-emerald-100 border-emerald-200";
  let Icon = LucideInfo;

  return (
    <div className="border border-emerald-100 rounded-lg p-4 bg-white text-emerald-950 font-medium tracking-tight shadow-sm mb-3 transition-all duration-200 hover:bg-emerald-50/40 hover:border-emerald-200">
      {/* Accordion Header (Single Line) */}
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-2 hover:bg-emerald-50/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden w-full pr-4">
          <span className={"px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border flex items-center gap-1.5 shrink-0 " + tagColorClass}>
            <Icon className="w-3.5 h-3.5" />
            {t(tagText)}
          </span>
          <span className="text-sm font-semibold text-emerald-800 truncate flex-grow">
            {title}
          </span>
        </div>
        <div className="shrink-0 text-emerald-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Accordion Expanded Content (AI AI Details) */}
      {isOpen && (
        <div className="p-4 mt-2 border-t border-emerald-100 bg-emerald-50/10">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-emerald-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm font-medium animate-pulse">{t("Synthesizing live AI analysis...")}</span>
            </div>
          ) : (
            <div className="text-sm text-emerald-800 leading-relaxed font-normal p-2">
              <p>{details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Global Page Chart Gallery Component (Cyan/Blue Theme)
const PageChartGallery = ({ charts }) => {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {charts.map((chart, idx) => (
        <div key={idx} className="bg-white border border-emerald-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> 
            {chart.title || "Market Analytics"}
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chart.type === 'bar' ? (
                <BarChart data={chart.data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#10b981', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#047857', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              ) : (
                <LineChart data={chart.data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#10b981' }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#10b981', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#047857', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};

// Fallback Icon for default state
const Info = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);


export default function TraderNewsView({ data, subPath }) {
  const [openIndex, setOpenIndex] = useState(null);

  const uiStrings = React.useMemo(() => [
    "Live Intelligence Feed", "Updates", "Synthesizing live intelligence feeds...", "Synthesizing live AI analysis...",
    "Market Intelligence Feed", "Bulletins", "Synthesizing Market Intelligence...", "Academic Research Feed",
    "Academic Intelligence Synthesis", "Papers", "Publications", "Aggregating Research Papers & Models...",
    "Sourcing Intelligence Feed", "Alerts", "Synthesizing Sourcing Intelligence...", "Aggregating Sourcing Intelligence...",
    "Crisis Intelligence Feed", "Synthesizing Crisis Advisories...", "Aggregating State Policy & Crisis Intelligence...",
    "Cluster Intelligence Feed", "Synthesizing Cluster Insights...", "Aggregating Institutional Intelligence...",
    "Corporate Intelligence Feed", "Reports", "Synthesizing Corporate intelligence...", "Aggregating Corporate Intelligence...",
    "System Log Feed", "Synthesizing System Logs...", "Connecting to Infrastructure Telemetry...",
    "System Infrastructure Telemetry", "ACTIVE LOGS", "Supply Chain Disruption Map", "Live Disruptions", "Est. Delay",
    "[Geographic Heat Map Rendered Here]", "FPO Operations Feed", "Academic Intelligence Synthesis",
    "Administrative Intelligence synthesis", "Reports Active", "Aggregating Procurement Intelligence...",
    "PRICE", "ALERT", "TREND", "MSP", "WEATHER", "CRITICAL", "TECH", "SUBSIDY", "UPDATE", "CREDIT", "KCC", "SCHEME", "SYSTEM", "SUPPLY", "NETWORK"
  ], []);

  const { t } = useAITranslation(uiStrings);

  // Safely extract items and charts array from the AI payload
  const items = data?.accordionItems || [];
  const pageCharts = data?.page_charts || [];

  if (items.length === 0) {
    return (
      <div className="w-full pb-20">
        <div className="text-center py-16 text-emerald-500 bg-emerald-50 rounded-2xl border border-emerald-200 border-dashed">
          <Clock className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
          <p className="text-sm font-medium">{t("Synthesizing Market Intelligence...")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-fadeIn">
      {/* Global Analytics Gallery */}
      <PageChartGallery charts={pageCharts} />

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">{t("Market Intelligence Feed")}</h3>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md">
          {items.length} {t("Bulletins")}
        </span>
      </div>

      <div className="space-y-1">
        {items.map((item, index) => (
          <AccordionItem 
            key={index} 
            item={item} 
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          t={t}
          />
        ))}
      </div>
    </div>
  );
}
