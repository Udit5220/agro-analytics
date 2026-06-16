import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Activity, ThermometerSun, Sprout, 
  Loader2, AlertCircle, Sparkles, BarChart3, LineChart
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const diseaseData = [
  { month: 'Jan', rust: 12, blight: 5 },
  { month: 'Feb', rust: 15, blight: 8 },
  { month: 'Mar', rust: 22, blight: 15 },
  { month: 'Apr', rust: 18, blight: 25 },
  { month: 'May', rust: 10, blight: 35 },
  { month: 'Jun', rust: 5, blight: 40 },
];

export default function AgriculturalTrendIntelligence() {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const activeRole = localStorage.getItem('userRole') || 'Research Analyst';
        const response = await fetch('http://localhost:5000/api/research/trends', {
          headers: { 'x-user-role': activeRole }
        });
        
        if (response.ok) {
          const json = await response.json();
          setTrendData(json.trends || []);
        } else {
          throw new Error('Failed to fetch trends');
        }
      } catch(err) {
        console.error(err);
        setTrendData([
          { topic: 'Climate-Resilient Farming', growthScore: 92 },
          { topic: 'Precision Ag Tech', growthScore: 85 },
          { topic: 'Organic Yield Boosts', growthScore: 78 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2.5 bg-[#31572c]/10 rounded-xl">
          <TrendingUp className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Agricultural Trend Intelligence</h1>
          <p className="text-sm text-gray-500">Aggregate macro data across weather, disease, and commodity modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Full Width Charts */}
        <div className="w-full space-y-6">
          {/* Disease Trends */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-500" /> Disease Outbreak Trajectory (YTD)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={diseaseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRust" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="rust" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRust)" />
                  <Area type="monotone" dataKey="blight" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorBlight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Crop Trends */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sprout className="h-4 w-4 text-emerald-500" /> Rapidly Growing Research Topics
            </h3>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis dataKey="topic" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#334155' }} width={120} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="growthScore" radius={[0, 4, 4, 0]} barSize={24}>
                      {trendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#31572c" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
