import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Database, Users, Activity, BrainCircuit, FileText, TrendingUp, Search, ShieldAlert, CheckCircle, XCircle
} from 'lucide-react';

const usageData = [
  { date: 'Mon', queries: 400, documents: 240 },
  { date: 'Tue', queries: 300, documents: 139 },
  { date: 'Wed', queries: 550, documents: 380 },
  { date: 'Thu', queries: 480, documents: 390 },
  { date: 'Fri', queries: 690, documents: 480 },
  { date: 'Sat', queries: 820, documents: 520 },
  { date: 'Sun', queries: 950, documents: 600 },
];

const popularTopics = [
  { name: 'Organic Fertilizers', count: 1240 },
  { name: 'Climate Resilient Seeds', count: 980 },
  { name: 'Solar Irrigation', count: 850 },
  { name: 'PM-Kisan Subsidies', count: 720 },
  { name: 'Fungal Pathogens', count: 650 },
];

const topPapers = [
  { id: "R-102", title: "Yield Impact of High-Density Cotton Planting", queries: 342, matchScore: "98%" },
  { id: "R-405", title: "Comparative Study of Drip vs Sprinkler in Arid Zones", queries: 289, matchScore: "95%" },
  { id: "R-711", title: "Microbial Soil Amendments for Phosphorus Uptake", queries: 215, matchScore: "91%" },
  { id: "R-882", title: "Economic Viability of Solar Pumps for Smallholders", queries: 198, matchScore: "88%" },
];

export default function AdminPanel() {
  const [adminData, setAdminData] = React.useState(null);

  React.useEffect(() => {
    const fetchAdminAnalytics = async () => {
      try {
        // We simulate the token header for testing Company Admin role
        const res = await fetch('http://localhost:5000/api/agribusiness/admin-analytics', {
          headers: { 'x-user-role': 'Company Admin' }
        });
        if (res.ok) {
          const json = await res.json();
          setAdminData(json.analytics);
        }
      } catch (err) {
        console.error("Failed to fetch admin analytics:", err);
      }
    };
    fetchAdminAnalytics();
  }, []);

  const displayTopics = adminData?.trendingCorporateProcurementTopics?.map(t => ({ name: t, count: Math.floor(Math.random()*500 + 500) })) || popularTopics;
  const displayReports = adminData?.mostViewedIndustryReports?.map((r, i) => ({
    id: `R-AGRI-${i+1}`,
    title: r.title,
    queries: r.views,
    matchScore: "99%"
  })) || topPapers;

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Activity className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Research Intelligence Analytics</h1>
            <p className="text-sm text-gray-500">Monitor RAG engine performance, user engagement, and knowledge base utilization.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> System Healthy
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Researchers', value: '4,281', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total AI Queries', value: '184.2K', icon: BrainCircuit, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Vector DB Documents', value: '12,504', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Query Latency', value: '1.2s', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Usage Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" /> Platform Usage & Query Volume (7 Days)
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="queries" name="RAG Queries" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="documents" name="Documents Parsed" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Search className="h-4 w-4 text-emerald-600" /> Trending Corporate Procurement Topics
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayTopics} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} width={120} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {displayTopics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#818cf8" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Viewed Papers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-500" /> Most Viewed Industry Reports
          </h3>
          <button className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
            View All Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="p-4 font-bold">Doc ID</th>
                <th className="p-4 font-bold">Document Title</th>
                <th className="p-4 font-bold">RAG Retrieval Count</th>
                <th className="p-4 font-bold">Avg Match Score</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {displayReports.map((paper, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                  <td className="p-4 text-emerald-600 font-black text-xs">{paper.id}</td>
                  <td className="p-4 font-bold text-gray-800">{paper.title}</td>
                  <td className="p-4 text-gray-600 font-semibold">{paper.queries}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black border border-emerald-100">
                      {paper.matchScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New AI Widgets for Company Admin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* System Health Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-600" /> AI System Health Alerts
          </h3>
          <ul className="space-y-4">
            {(adminData?.systemHealthAlerts || []).map((alert, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">{alert.alert}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  alert.severity === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                  alert.severity === 'Medium' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                  'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  {alert.severity}
                </span>
              </li>
            ))}
            {(!adminData?.systemHealthAlerts || adminData.systemHealthAlerts.length === 0) && (
              <p className="text-sm text-gray-500 italic">No health alerts generated.</p>
            )}
          </ul>
        </div>

        {/* Compliance Audit Metrics */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" /> Compliance Audit Metrics
          </h3>
          <ul className="space-y-4">
            {(adminData?.complianceAuditMetrics || []).map((metric, idx) => (
              <li key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">{metric.metric}</span>
                {metric.status === 'Pass' ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="h-3 w-3" /> Pass
                  </span>
                ) : metric.status === 'Fail' ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                    <XCircle className="h-3 w-3" /> Fail
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    <ShieldAlert className="h-3 w-3" /> Warning
                  </span>
                )}
              </li>
            ))}
            {(!adminData?.complianceAuditMetrics || adminData.complianceAuditMetrics.length === 0) && (
              <p className="text-sm text-gray-500 italic">No compliance metrics generated.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
