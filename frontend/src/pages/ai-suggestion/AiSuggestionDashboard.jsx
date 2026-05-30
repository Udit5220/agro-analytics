import React from "react";
import { Bot, MessageSquare, ShieldAlert, Sparkles, Send, BrainCircuit, Lightbulb, Zap } from "lucide-react";

export default function AiSuggestionDashboard() {
  const metrics = [
    { label: "Active Sessions", value: "12", sub: "Advisory agents", color: "text-emerald-700 bg-emerald-50" },
    { label: "Climate Warnings", value: "4", sub: "Outbreaks monitored", color: "text-red-700 bg-red-50" },
    { label: "Soil Quality Status", value: "Optimal", sub: "Telemetry scan", color: "text-[#31572c] bg-[#31572c]/10" },
    { label: "Advice Queries Today", value: "148", sub: "Conversations processed", color: "text-sky-700 bg-sky-50" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Bot className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>AI Agriculture Assistant</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              कृषि एआई सहायक
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Consult 24/7 conversational multi-model LLM agronomists to optimize crop care and irrigation.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">
              {m.label}
            </span>
            <div>
              <h4 className="text-gray-900 text-xl font-black tracking-tight">{m.value}</h4>
              <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 ${m.color}`}>
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Chat Window Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col h-[400px]">
          {/* Header */}
          <div className="bg-[#f4f7f4] border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Llama-3 Agronomist Bot</span>
            </div>
            <span className="text-[10px] font-bold text-[#31572c]">Bilingual Advisor</span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#31572c]/10 text-[#31572c] flex items-center justify-center shrink-0 font-bold text-[10px]">AI</div>
              <div className="bg-[#f4f7f4] border border-gray-100 rounded-xl p-3 max-w-[80%]">
                <p className="font-bold text-gray-900 mb-1">Namaste! (नमस्ते!)</p>
                <p className="text-gray-650 leading-relaxed font-medium">
                  Welcome to AgroIndia AI. I have analyzed Faridabad region's soil matrices. Current nitrogen levels are optimal, but rainfall forecasts predict a humid spell next Tuesday. How can I help you manage your fields today?
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 flex-row-reverse">
              <div className="h-7 w-7 rounded-lg bg-[#132a13] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">SK</div>
              <div className="bg-[#31572c] text-white rounded-xl p-3 max-w-[80%]">
                <p className="leading-relaxed font-semibold">
                  What is the best NPK ratio and irrigation frequency for Wheat during vegetative stage?
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#31572c]/10 text-[#31572c] flex items-center justify-center shrink-0 font-bold text-[10px]">AI</div>
              <div className="bg-[#f4f7f4] border border-gray-100 rounded-xl p-3 max-w-[80%]">
                <p className="text-gray-650 leading-relaxed font-medium">
                  For Wheat in vegetative stage, the optimal NPK recipe is **120-60-40**. You should schedule irrigation cycles every 10–12 days based on current soil water retention bounds. Keep field moisture moderate, avoiding stagnation.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Agronomist Bot anything..."
              className="flex-1 bg-[#f4f7f4] border border-gray-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#31572c]"
            />
            <button className="p-2 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl shadow-sm transition-all flex items-center justify-center">
              <Send size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Key Advisories Deck */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <BrainCircuit size={13} className="text-[#31572c]" />
            <span>Agronomic Guidelines</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-2">
              <Lightbulb size={16} className="text-[#31572c] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">Irrigation Prompt</span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed">
                  Schedule water supply before morning sun to minimize evaporative loss.
                </span>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl flex gap-2">
              <Zap size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-amber-900 block">NPK Target Recommendation</span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed">
                  Nitrogen is slightly heavy. Divert to potash base next week to protect grain fill.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
