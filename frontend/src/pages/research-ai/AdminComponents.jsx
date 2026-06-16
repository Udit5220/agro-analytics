import React, { useState, useEffect } from 'react';
import { Activity, Database, TerminalSquare, Settings, CheckCircle2, AlertTriangle, Upload, Globe2, Save, BarChart3, Users, Clock, ShieldCheck, Zap } from 'lucide-react';

export const ComprehensiveAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, performance, monitoring, kpis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/analytics/comprehensive', {
          headers: { 'x-user-role': 'Company Admin' }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-50 rounded-xl"><Activity className="h-6 w-6 text-emerald-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Administration & Analytics</h1>
          <p className="text-sm text-gray-500">Comprehensive overview of system performance, usage, and business KPIs.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-200 pb-4 mb-6">
        {['analytics', 'performance', 'monitoring', 'kpis'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {tab === 'kpis' ? 'Success Metrics (KPIs)' : tab.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Aggregating real-time AI analytics...</div>
      ) : data ? (
        <div className="space-y-6">
          
          {/* TAB 1: Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Total Queries</h4>
                 <div className="text-2xl font-black text-gray-900">{data.analytics.totalQueries}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Daily Active Users</h4>
                 <div className="text-2xl font-black text-emerald-600">{data.analytics.dailyActiveUsers}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Avg Session</h4>
                 <div className="text-2xl font-black text-gray-900">{data.analytics.averageSessionDuration}</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                 <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">User Retention</h4>
                 <div className="text-2xl font-black text-blue-600">{data.analytics.userRetention}</div>
              </div>
              
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-2">
                 <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-500" /> User Role Distribution</h4>
                 <div className="flex gap-4">
                    {data.analytics.userRoleDistribution.map((r, i) => (
                      <div key={i} className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                         <div className="text-xl font-black text-emerald-600 mb-1">{r.percentage}</div>
                         <div className="text-xs font-bold text-gray-500 uppercase">{r.role}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Performance Dashboard */}
          {activeTab === 'performance' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
               <div className="bg-gradient-to-br from-teal-900 to-teal-950 p-6 rounded-3xl text-white shadow-lg flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-4 h-4" /> AI Accuracy</h4>
                  <div className="text-4xl font-black text-white">{data.aiPerformance.responseAccuracy}</div>
                  <p className="text-xs text-teal-200 mt-4 opacity-80">Based on vector relevance and user upvotes.</p>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Response Time</h4>
                  <div className="text-4xl font-black text-emerald-600">{data.aiPerformance.responseTime}</div>
                  <p className="text-xs text-gray-400 mt-4 font-medium">Average LLM inference + DB latency.</p>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Query Success</h4>
                  <div className="text-4xl font-black text-blue-600">{data.aiPerformance.querySuccessRate}</div>
                  <p className="text-xs text-gray-400 mt-4 font-medium">Successfully handled without fallbacks.</p>
               </div>
               <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Escalation Rate</h4>
                  <div className="text-4xl font-black text-rose-600">{data.aiPerformance.escalationRate}</div>
                  <p className="text-xs text-rose-400 mt-4 font-medium">Queries routed to human agronomists.</p>
               </div>
               <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between lg:col-span-2">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">User Satisfaction Score (CSAT)</h4>
                  <div className="text-5xl font-black text-amber-600">{data.aiPerformance.userSatisfactionScore}</div>
                  <p className="text-xs text-amber-600 mt-4 font-medium">Derived from post-query feedback mechanisms.</p>
               </div>
             </div>
          )}

          {/* TAB 3: Monitoring & Operations */}
          {activeTab === 'monitoring' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> System Health</h3>
                 <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm font-bold text-gray-600">Gemini API Health</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">{data.monitoring.apiHealth}</span>
                 </div>
                 <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm font-bold text-gray-600">ChromaDB Vector Store</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">{data.monitoring.kbHealth}</span>
                 </div>
                 <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <span className="text-sm font-bold text-gray-600">LLM Inference Engine</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">{data.monitoring.modelPerformance}</span>
                 </div>
               </div>
               
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                 <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500"/> Resource Consumption</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                       <div className="text-xs font-bold text-rose-400 uppercase mb-1">Error Logs (24h)</div>
                       <div className="text-2xl font-black text-rose-600">{data.monitoring.errorLogs}</div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                       <div className="text-xs font-bold text-emerald-500 uppercase mb-1">Tokens Used</div>
                       <div className="text-2xl font-black text-emerald-700">{data.monitoring.tokenConsumption}</div>
                    </div>
                    <div className="col-span-2 bg-gray-900 p-4 rounded-xl text-white">
                       <div className="text-xs font-bold text-gray-400 uppercase mb-1">Estimated Usage Cost</div>
                       <div className="text-3xl font-black text-emerald-400">{data.monitoring.usageCosts}</div>
                    </div>
                 </div>
               </div>
             </div>
          )}

          {/* TAB 4: Success Metrics (KPIs) */}
          {activeTab === 'kpis' && (
             <div className="space-y-6 animate-fadeIn">
               {/* User KPIs */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4 text-emerald-700">User KPIs</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="p-4 bg-gray-50 rounded-xl"><div className="text-xs text-gray-500 font-bold uppercase mb-1">DAU</div><div className="text-xl font-black">{data.successMetrics.userKPIs.dau}</div></div>
                     <div className="p-4 bg-gray-50 rounded-xl"><div className="text-xs text-gray-500 font-bold uppercase mb-1">Queries / User</div><div className="text-xl font-black">{data.successMetrics.userKPIs.queriesPerUser}</div></div>
                     <div className="p-4 bg-gray-50 rounded-xl"><div className="text-xs text-gray-500 font-bold uppercase mb-1">Satisfaction</div><div className="text-xl font-black text-emerald-600">{data.successMetrics.userKPIs.userSatisfaction}</div></div>
                     <div className="p-4 bg-gray-50 rounded-xl"><div className="text-xs text-gray-500 font-bold uppercase mb-1">Adoption Rate</div><div className="text-xl font-black text-blue-600">{data.successMetrics.userKPIs.recommendationAdoptionRate}</div></div>
                  </div>
               </div>
               {/* Business KPIs */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4 text-blue-700">Business KPIs</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="p-4 bg-blue-50 rounded-xl"><div className="text-xs text-blue-500 font-bold uppercase mb-1">Yield Imprv.</div><div className="text-xl font-black text-blue-700">{data.successMetrics.businessKPIs.farmerYieldImprovement}</div></div>
                     <div className="p-4 bg-blue-50 rounded-xl"><div className="text-xs text-blue-500 font-bold uppercase mb-1">Profit Imprv.</div><div className="text-xl font-black text-blue-700">{data.successMetrics.businessKPIs.farmerProfitImprovement}</div></div>
                     <div className="p-4 bg-emerald-50 rounded-xl"><div className="text-xs text-emerald-500 font-bold uppercase mb-1">Cost Reduction</div><div className="text-xl font-black text-emerald-700">{data.successMetrics.businessKPIs.procurementCostReduction}</div></div>
                     <div className="p-4 bg-purple-50 rounded-xl"><div className="text-xs text-purple-500 font-bold uppercase mb-1">Productivity</div><div className="text-xl font-black text-purple-700">{data.successMetrics.businessKPIs.researchProductivityIncrease}</div></div>
                  </div>
               </div>
               {/* Technical KPIs */}
               <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4 text-gray-700">Technical KPIs</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="p-4 bg-gray-900 text-white rounded-xl"><div className="text-xs text-gray-400 font-bold uppercase mb-1">Accuracy</div><div className="text-xl font-black text-emerald-400">{data.successMetrics.technicalKPIs.responseAccuracy}</div></div>
                     <div className="p-4 bg-gray-900 text-white rounded-xl"><div className="text-xs text-gray-400 font-bold uppercase mb-1">Response</div><div className="text-xl font-black text-emerald-400">{data.successMetrics.technicalKPIs.responseTime}</div></div>
                     <div className="p-4 bg-gray-900 text-white rounded-xl"><div className="text-xs text-gray-400 font-bold uppercase mb-1">Cost / Query</div><div className="text-xl font-black text-emerald-400">{data.successMetrics.technicalKPIs.aiCostPerQuery}</div></div>
                     <div className="p-4 bg-gray-900 text-white rounded-xl"><div className="text-xs text-gray-400 font-bold uppercase mb-1">Availability</div><div className="text-xl font-black text-emerald-400">{data.successMetrics.technicalKPIs.systemAvailability}</div></div>
                  </div>
               </div>
             </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export const KnowledgeBaseManager = () => {
  const [text, setText] = useState('');
  const [docType, setDocType] = useState('Research Paper');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/knowledge-base/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'Company Admin' },
        body: JSON.stringify({ text, documentType: docType, filename: "manual_upload.txt" })
      });
      if (res.ok) {
        const json = await res.json();
        setResult(json.processedMetadata);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 rounded-xl"><Database className="h-6 w-6 text-blue-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Management</h1>
          <p className="text-sm text-gray-500">Ingest varied document types (SOPs, Papers) and manage automated FAQs.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="mb-4">
             <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Document Type</label>
             <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-blue-500 focus:border-blue-500 font-bold text-gray-700">
                <option>Research Paper</option>
                <option>Government Document</option>
                <option>SOP (Standard Operating Procedure)</option>
                <option>Market Report</option>
             </select>
          </div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Paste Document Text</label>
          <textarea 
            rows={10} 
            value={text} 
            onChange={e => setText(e.target.value)} 
            placeholder={`Paste ${docType} text here...`}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-blue-500 focus:border-blue-500 mb-4 custom-scrollbar"
          />
          <button onClick={handleUpload} disabled={loading || !text} className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
            {loading ? <span className="animate-pulse">Processing Document...</span> : <><Upload className="w-4 h-4" /> Run AI Processing Pipeline</>}
          </button>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Extracted Metadata Tags</h4>
              <div className="flex flex-wrap gap-2">
                {result.metadataTags?.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold rounded-lg">{tag}</span>
                ))}
              </div>
            </div>
            <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Document Summary</h4>
               <p className="text-sm text-gray-800 leading-relaxed p-4 bg-gray-50 border border-gray-100 rounded-2xl">{result.documentSummary}</p>
            </div>
            <div>
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  Auto-Generated FAQs
                  <button className="text-blue-600 hover:text-blue-800 lowercase text-[10px] bg-blue-50 px-2 py-1 rounded">Edit FAQs</button>
               </h4>
               <ul className="space-y-3">
                 {result.suggestedFAQ?.map((faq, i) => (
                   <li key={i} className="flex gap-3 text-sm text-gray-700 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> 
                     <span className="font-medium">{faq}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PromptManager = () => {
  const [role, setRole] = useState('Research Analyst');
  const [instruction, setInstruction] = useState('');
  const [rules, setRules] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const res = await fetch('http://localhost:5000/api/admin/prompts/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-role': 'Company Admin' },
        body: JSON.stringify({ role, systemInstruction: instruction, safetyRules: rules, guidelines })
      });
      if (res.ok) setStatus('Saved successfully.');
      else setStatus('Failed to save.');
    } catch (err) {
      console.error(err);
      setStatus('Error saving template.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-pink-50 rounded-xl"><TerminalSquare className="h-6 w-6 text-pink-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompt Management</h1>
          <p className="text-sm text-gray-500">Configure Role-Based Prompts, Guidelines, and Safety Rules.</p>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-4xl">
        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Configure Target Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full md:w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:ring-pink-500 focus:border-pink-500">
               <option>Research Analyst</option>
               <option>Agribusiness Manager</option>
               <option>Government Official</option>
               <option>Farmer</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><TerminalSquare className="w-4 h-4"/> System Instruction Template</label>
               <textarea rows={6} value={instruction} onChange={e => setInstruction(e.target.value)} placeholder="You are an expert... Provide deep analysis." className="w-full bg-gray-900 text-pink-100 border border-gray-800 rounded-xl p-4 text-sm font-mono focus:ring-pink-500 custom-scrollbar" />
             </div>
             
             <div className="space-y-6">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Response Guidelines</label>
                 <textarea rows={3} value={guidelines} onChange={e => setGuidelines(e.target.value)} placeholder="Always use professional tone. Cite sources." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-pink-500 focus:border-pink-500" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Strict Safety Rules</label>
                 <textarea rows={3} value={rules} onChange={e => setRules(e.target.value)} placeholder="Do not hallucinate. Do not provide medical advice." className="w-full bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm font-mono text-rose-900 focus:ring-rose-500 focus:border-rose-500" />
               </div>
             </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <button onClick={handleSave} className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 flex items-center gap-2 transition-all"><Save className="w-4 h-4"/> Save Configuration</button>
            <span className="text-sm font-bold text-pink-600">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIModelLanguageManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/model/settings', {
          headers: { 'x-user-role': 'Company Admin' }
        });
        if (res.ok) {
          const json = await res.json();
          setSettings(json.settings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-50 rounded-xl"><Globe2 className="h-6 w-6 text-purple-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Model & Language Management</h1>
          <p className="text-sm text-gray-500">Configure LLMs, token limits, AI workflows, and multi-lingual voice engines.</p>
        </div>
      </div>
      
      {loading ? (
         <div className="h-40 flex items-center justify-center text-gray-400 text-sm animate-pulse">Loading core configurations...</div>
      ) : settings ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* AI Model Management */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-purple-500"/> AI Model Workflows</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary LLM Provider & Model</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:ring-purple-500 focus:border-purple-500">
                    <option>{settings.activeModel} (Google Gemini)</option>
                    <option>gemini-1.5-pro-latest (Google Gemini)</option>
                 </select>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Context Window (Tokens)</label>
                   <input type="number" defaultValue={settings.tokenLimit} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-purple-500 focus:border-purple-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Temperature (Creativity)</label>
                   <input type="number" step="0.1" defaultValue={settings.temperature} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-purple-500 focus:border-purple-500" />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Configure AI Workflows</label>
                 <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                       <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                       <span className="text-sm font-medium text-gray-700">Enable Hybrid RAG Search Fallback</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                       <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500" />
                       <span className="text-sm font-medium text-gray-700">Auto-Escalate Failed Vector Queries</span>
                    </label>
                 </div>
               </div>
            </div>
            
            <button className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 mt-4 transition-colors">Update Model Configuration</button>
          </div>

          {/* Language Management */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2"><Globe2 className="w-4 h-4 text-blue-500"/> Language & Voice Management</h3>
            
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Supported Languages ({settings.translationEngines.length})</label>
               <div className="flex flex-wrap gap-2">
                  {settings.translationEngines.map((lang, i) => (
                     <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold rounded-lg flex items-center gap-2">
                        {lang} <button className="hover:text-blue-900"><AlertTriangle className="w-3 h-3 opacity-0"/></button>
                     </span>
                  ))}
                  <button className="px-3 py-1.5 border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition-colors">+ Add Language</button>
               </div>
            </div>
            
            <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Translation Engine</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:ring-blue-500 focus:border-blue-500">
                    <option>Gemini Neural Translation</option>
                    <option>Google Cloud Translation API</option>
                 </select>
            </div>

            <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Voice Model (Text-to-Speech)</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-700 focus:ring-blue-500 focus:border-blue-500">
                    <option>Google Wavenet Multilingual</option>
                    <option>Standard TTS Fallback</option>
                 </select>
            </div>
            
             <button className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 mt-4 transition-colors">Update Language Config</button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
