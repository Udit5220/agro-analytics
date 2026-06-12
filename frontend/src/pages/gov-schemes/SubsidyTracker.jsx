import React, { useState } from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  Filter,
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function SubsidyTracker() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTracker, setSelectedTracker] = useState("KUSUM-SOLAR-092");

  // AI Assistant States
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Top metric highlights matching the layout theme
  const summaryMetrics = [
    { label: "TOTAL CLAIMS SUBMITTED", value: "3", subtext: "All-time tracking active", color: "text-slate-900" },
    { label: "DISBURSED AMOUNT", value: "₹45,000", subtext: "Credited via DBT", color: "text-emerald-700" },
    { label: "PENDING AUTHORIZATION", value: "₹1,20,000", subtext: "Awaiting final state release", color: "text-amber-700" }
  ];

  // Primary active tracking workflows
  const [trackers, setTrackers] = useState([
    {
      id: "KUSUM-SOLAR-092",
      schemeName: "Solar Pump Subsidy (KUSUM)",
      applicationDate: "May 12, 2026",
      currentStage: 3, // Stage index out of 4
      stages: [
        { title: "Application Submitted", updated: "May 12", status: "completed" },
        { title: "Document Verification", updated: "May 19", status: "completed" },
        { title: "Field Inspection Mandate", updated: "May 28", status: "active" },
        { title: "Fund Disbursal (DBT)", updated: "Pending", status: "upcoming" }
      ],
      amountRequested: "₹1,20,000",
      authority: "MNRE / State Discom"
    },
    {
      id: "SEEDER-HR-881",
      schemeName: "Super-Seeder Machine Subsidy",
      applicationDate: "Mar 04, 2026",
      currentStage: 4,
      stages: [
        { title: "Application Submitted", updated: "Mar 04", status: "completed" },
        { title: "Document Verification", updated: "Mar 10", status: "completed" },
        { title: "Field Inspection Mandate", updated: "Mar 22", status: "completed" },
        { title: "Fund Disbursal (DBT)", updated: "Apr 02", status: "completed" }
      ],
      amountRequested: "₹45,000",
      authority: "Department of Agriculture, Haryana"
    }
  ]);

  // Handle refresh simulation
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const activeTrackerData = trackers.find(t => t.id === selectedTracker) || trackers[0];

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim() || loadingAi) return;

    setLoadingAi(true);
    setAiResponse("");

    const currentActiveStage = activeTrackerData.stages[activeTrackerData.currentStage - 1] || activeTrackerData.stages[0];

    const prompt = `Provide actionable guidance for an Indian farmer tracking their subsidy application:
    - Application ID: ${activeTrackerData.id}
    - Scheme Name: ${activeTrackerData.schemeName}
    - Nodal Authority: ${activeTrackerData.authority}
    - Requested Amount: ${activeTrackerData.amountRequested}
    - Current Active Stage: ${currentActiveStage.title} (Status: ${currentActiveStage.status}, Last Updated: ${currentActiveStage.updated})
    
    User Question: "${aiQuery.trim()}"

    Respond as a helpful, expert DBT and agricultural subsidy coordinator. Provide bullet points indicating what steps they can take, what documents they should keep ready, or how to expedite the process based on their current stage. Keep the answer concise (under 120 words) and specific.`;

    try {
      const result = await generateContent(prompt, {
        system_instruction: "You are a state agricultural DBT officer helper. Give practical, simple, direct guidance.",
        temperature: 0.3
      });
      setAiResponse(result);
    } catch (err) {
      console.error(err);
      setAiResponse("Could not contact the DBT Helper. Please verify your internet and try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-800 animate-fadeIn">
      
      {/* 1. Header with Live Refresh Control */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subsidy Lifecycle Tracker</h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time validation tracking for direct benefit transfers and equipment applications.</p>
        </div>
        <button 
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className="self-start sm:self-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold shadow-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? "Updating Registry..." : "Refresh Status"}</span>
        </button>
      </div>

      {/* 2. Top Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {summaryMetrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider block mb-1">{metric.label}</span>
            <span className={`text-2xl font-extrabold ${metric.color} block`}>{metric.value}</span>
            <span className="text-xs text-slate-400 block mt-1">{metric.subtext}</span>
          </div>
        ))}
      </div>

      {/* 3. Main Dashboard Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Applications Selection Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-50 gap-3 mb-4">
              <h2 className="text-sm font-bold text-slate-900">Active Applications Ledger</h2>
              
              {/* Search filter inline */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Filter by scheme name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-800 w-full sm:w-56"
                />
              </div>
            </div>

            <div className="space-y-3">
              {trackers
                .filter(item => item.schemeName.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setSelectedTracker(item.id);
                      setAiResponse("");
                    }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      selectedTracker === item.id 
                        ? 'border-emerald-850 bg-emerald-50/20 shadow-sm' 
                        : 'border-slate-100 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400 font-mono tracking-wide">{item.id}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <span className="text-xs font-medium text-slate-500">{item.applicationDate}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{item.schemeName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Disbursal Tier: <span className="font-semibold text-slate-600">{item.amountRequested}</span></p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        item.currentStage === 4 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {item.currentStage === 4 ? "Disbursed" : `Stage ${item.currentStage}/4: Processing`}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selectedTracker === item.id ? 'transform translate-x-1 text-emerald-800' : ''}`} />
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Interactive Dynamic Vertical Stepper */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-slate-100 mb-6">
              <span className="text-[10px] font-bold text-emerald-800 tracking-wider font-mono block">TRACKING ID: {activeTrackerData.id}</span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">Live Verification Pipeline</h2>
              <p className="text-xs text-slate-400 mt-1">Nodal Authority: {activeTrackerData.authority}</p>
            </div>

            {/* Stepper Node Logic */}
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {activeTrackerData.stages.map((stage, sIdx) => (
                <div key={sIdx} className="relative group">
                  
                  {/* Absolute positioning of milestone icon bubbles */}
                  <div className="absolute -left-[23px] top-0.5 z-10">
                    {stage.status === 'completed' && (
                      <div className="p-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {stage.status === 'active' && (
                      <div className="p-0.5 bg-amber-100 text-amber-700 rounded-full border border-amber-300 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {stage.status === 'upcoming' && (
                      <div className="w-4 h-4 rounded-full bg-slate-200 border border-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between space-x-2">
                      <h4 className={`text-xs font-bold ${
                        stage.status === 'completed' ? 'text-slate-900' : 
                        stage.status === 'active' ? 'text-amber-800 font-extrabold' : 'text-slate-400'
                      }`}>
                        {stage.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{stage.updated}</span>
                    </div>
                    {stage.status === 'active' && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        Local administrative inspectors are verifying land dimension mappings against your uploaded Khasra records.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Advisor inside Stepper Card */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-800" />
                <span>AI DBT Advisor</span>
              </h4>

              <form onSubmit={handleAskAI} className="flex gap-2">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask AI: e.g. 'How can I speed up my inspection?'"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-850"
                />
                <button
                  type="submit"
                  disabled={loadingAi || !aiQuery.trim()}
                  className="bg-brand-dark hover:bg-[#1a3018] text-white p-2.5 rounded-xl shadow-xs transition flex items-center justify-center shrink-0 disabled:opacity-50"
                >
                  {loadingAi ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {aiResponse && (
                <div className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl animate-fadeIn">
                  <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">
                    {aiResponse}
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Stepper Footer Notice Banner */}
          {activeTrackerData.currentStage !== 4 && (
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Next automation check scheduled in 48 hours.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}