import React, { useState } from 'react';
import { 
  Settings, UploadCloud, FileText, Database, ShieldAlert,
  Save, CheckCircle2, Sliders, Tags
} from 'lucide-react';

export default function ResearchConfigPanel() {
  const [activeTab, setActiveTab] = useState('prompts');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock Prompt States
  const [analystPrompt, setAnalystPrompt] = useState("Act as a senior research analyst. Focus on statistical significance, data trends, and extracting comparative insights from the research.");
  const [agribusinessPrompt, setAgribusinessPrompt] = useState("Act as a commodity market analyst. Focus on market impacts, supply/demand, commercial viability, and investment opportunities.");
  const [governmentPrompt, setGovernmentPrompt] = useState("Act as a policy advisor. Focus on macro-economic impacts, district-level implications, and subsidy requirements.");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 rounded-xl">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Knowledge Configuration</h1>
            <p className="text-sm text-gray-500">Manage vector databases, configure AI prompts, and control document ingestion.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('prompts')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'prompts' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          Prompt Management
        </button>
        <button 
          onClick={() => setActiveTab('kb')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'kb' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          Knowledge Base (ChromaDB)
        </button>
        <button 
          onClick={() => setActiveTab('sources')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'sources' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
        >
          Source Whitelisting
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[500px]">
        
        {activeTab === 'prompts' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-emerald-500" /> AI Persona Instructions
                </h2>
                <p className="text-sm text-gray-500 mt-1">Configure the system instructions injected into Gemini API calls based on user roles.</p>
              </div>
              <button 
                onClick={handleSave}
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
              >
                {isSaving ? <span className="animate-pulse">Saving...</span> : saveSuccess ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
                {saveSuccess ? 'Saved!' : 'Save Config'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex justify-between">
                  Research Analyst Persona 
                  <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </label>
                <textarea 
                  value={analystPrompt}
                  onChange={(e) => setAnalystPrompt(e.target.value)}
                  className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex justify-between">
                  Agribusiness Persona
                  <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </label>
                <textarea 
                  value={agribusinessPrompt}
                  onChange={(e) => setAgribusinessPrompt(e.target.value)}
                  className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="space-y-3 lg:col-span-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex justify-between">
                  Government Official Persona
                  <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </label>
                <textarea 
                  value={governmentPrompt}
                  onChange={(e) => setGovernmentPrompt(e.target.value)}
                  className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3">
              <ShieldAlert className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="text-sm text-emerald-800">
                <span className="font-bold block mb-1">Safety Override Active</span>
                All prompts are automatically appended with structural instructions to prevent hallucinations and strictly return JSON when required by specific components.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kb' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" /> Vector Store Ingestion
              </h2>
              <p className="text-sm text-gray-500 mt-1">Upload institutional white papers, govt schemes, and market reports to index them into ChromaDB.</p>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className="h-16 w-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Drag & Drop Documents</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">Supports PDF, DOCX, and TXT. Documents will be chunked, vectorized, and made instantly available to the AI Engine.</p>
              <button className="mt-6 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all">
                Browse Files
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recently Ingested</h3>
              {[
                { name: "ICAR_Wheat_Guidelines_2025.pdf", chunks: 142, date: "Today, 09:42 AM" },
                { name: "Maharashtra_Water_Policy_Draft.pdf", chunks: 89, date: "Yesterday, 14:15 PM" }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-gray-800">{doc.name}</p>
                      <p className="text-xs text-gray-400">Indexed {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{doc.chunks} Vector Chunks</span>
                    <button className="text-xs font-bold text-teal-500 hover:text-teal-700 transition-colors">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-8 animate-fadeIn flex flex-col items-center justify-center py-12 text-center opacity-60">
             <Tags className="h-16 w-16 text-gray-300 mb-4" />
             <h3 className="text-lg font-bold text-gray-400">Source Configuration Coming Soon</h3>
             <p className="text-sm text-gray-400 mt-1 max-w-sm">Module for managing approved journals, whitelisting API endpoints, and blocking specific web domains from RAG searches.</p>
          </div>
        )}

      </div>
    </div>
  );
}
