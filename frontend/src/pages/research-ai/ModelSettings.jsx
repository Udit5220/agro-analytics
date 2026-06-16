import React, { useState } from 'react';
import { Settings, Server, Globe, Cpu, Save, ShieldCheck } from 'lucide-react';

export default function ModelSettings() {
  const [model, setModel] = useState('gemini-1.5-flash');
  const [language, setLanguage] = useState('English');
  const [temperature, setTemperature] = useState(0.7);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulated save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 antialiased">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gray-900 rounded-xl">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Model & Language Configuration</h1>
          <p className="text-sm text-gray-500">Configure global AI parameters for the entire organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Model Selection */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-500" /> Primary AI Engine
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Gemini 1.5 Flash</p>
                  <p className="text-xs text-gray-500">Optimized for speed and high-throughput RAG queries.</p>
                </div>
                <input type="radio" name="model" checked={model === 'gemini-1.5-flash'} onChange={() => setModel('gemini-1.5-flash')} className="w-5 h-5 text-indigo-600" />
              </label>
              
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900">Gemini 1.5 Pro</p>
                  <p className="text-xs text-gray-500">Deep reasoning for complex multi-document scientific analysis.</p>
                </div>
                <input type="radio" name="model" checked={model === 'gemini-1.5-pro'} onChange={() => setModel('gemini-1.5-pro')} className="w-5 h-5 text-indigo-600" />
              </label>
            </div>
          </div>

          {/* RAG Settings */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Server className="h-4 w-4 text-emerald-500" /> Advanced RAG Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-gray-700">Model Temperature</label>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="1" step="0.1" 
                  value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">Higher values produce more creative summaries, lower values are more deterministic.</p>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">Max Token Output Limit</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option>2048 Tokens</option>
                  <option>4096 Tokens</option>
                  <option>8192 Tokens (Pro Only)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Preference */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" /> Default Translations
            </h3>
            <p className="text-xs text-gray-500 mb-4">Set the baseline language for user interfaces that do not have explicit preferences set.</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="radio" name="lang" checked={language === 'English'} onChange={() => setLanguage('English')} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">English (Global)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="radio" name="lang" checked={language === 'Hindi'} onChange={() => setLanguage('Hindi')} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">Hindi (India)</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-3xl text-white shadow-lg">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">Save Configuration</h3>
            <p className="text-xs text-gray-400 mb-6">Changes will propagate immediately to all active AI inference endpoints.</p>
            <button 
              onClick={handleSave}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {saved ? "Configuration Saved!" : <><Save className="h-4 w-4" /> Apply Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
