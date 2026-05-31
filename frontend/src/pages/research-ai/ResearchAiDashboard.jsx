import React from "react";
import {
  Leaf,
  Search,
  FileText,
  Globe,
  Brain,
  Sparkles,
  Plus,
  ArrowRight,
} from "lucide-react";
import bannerImg from "../../assets/images/White Paper & Research AI.png";

export default function ResearchAiDashboard() {
  const metrics = [
    {
      label: "Indexed Papers",
      value: "450+",
      sub: "Scientific database",
      color: "text-[#31572c] bg-[#31572c]/10",
    },
    {
      label: "PDF Size Limit",
      value: "50 MB",
      sub: "Max storage capacity",
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Translation Nodes",
      value: "12 Languages",
      sub: "Bilingual engines",
      color: "text-sky-700 bg-sky-50",
    },
    {
      label: "RAG Search Logs",
      value: "48 queries",
      sub: "Optimized response",
      color: "text-amber-700 bg-amber-50",
    },
  ];

  const recentPapers = [
    {
      title: "Optimal Nitrogen Blends for Wheat Yields in Semi-Arid Soil",
      date: "May 2026",
      size: "4.2 MB",
      status: "Indexed",
    },
    {
      title:
        "Pathological Identification of Leaf Rust (Puccinia triticina) via CNNs",
      date: "April 2026",
      size: "8.1 MB",
      status: "Indexed",
    },
    {
      title: "Water Stagnation and Root Decay Tolerances in Oryza Sativa",
      date: "March 2026",
      size: "3.5 MB",
      status: "Indexed",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#f4f7f4] to-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 w-full md:w-2/3">
          <div>
            <div className="flex items-center gap-2.5">
              <Leaf className="h-6.5 w-6.5 text-[#31572c]" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
                <span>White Paper & Research AI</span>
                <span className="text-gray-300 font-light text-xl">|</span>
                <span className="text-[#31572c] font-bold text-sm md:text-base">
                  अनुसंधान एआई
                </span>
              </h1>
            </div>
            <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
              Query deep academic research papers, crop pathology reports, and
              state bulletins via retrieval-augmented generation.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 opacity-20 md:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10 md:hidden" />
          <img
            src={bannerImg}
            alt="Banner"
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-2 hover:shadow-md transition-shadow"
          >
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider block">
              {m.label}
            </span>
            <div>
              <h4 className="text-gray-900 text-xl font-black tracking-tight">
                {m.value}
              </h4>
              <span
                className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 ${m.color}`}
              >
                {m.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Research Interface Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive RAG Search Engine */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden flex flex-col h-[400px]">
          {/* Header */}
          <div className="bg-[#f4f7f4] border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4.5 w-4.5 text-[#31572c]" />
              <span className="text-xs font-black text-gray-800 uppercase tracking-widest">
                Document RAG Engine
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#31572c]">
              GPT-4o Deep Semantics
            </span>
          </div>

          {/* RAG Context Window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#31572c]/10 text-[#31572c] flex items-center justify-center shrink-0 font-bold text-[10px]">
                RAG
              </div>
              <div className="bg-[#f4f7f4] border border-gray-100 rounded-xl p-3 max-w-[85%]">
                <p className="font-bold text-gray-900 mb-1">
                  RAG Retrieval Core Initialized
                </p>
                <p className="text-gray-650 leading-relaxed font-medium">
                  Welcome to AgroIndia Pathology & Agronomic Research RAG.
                  Upload any PDF agronomy circular or search our national
                  directory. Ask me complex biological questions below.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 flex-row-reverse">
              <div className="h-7 w-7 rounded-lg bg-[#132a13] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">
                USER
              </div>
              <div className="bg-[#31572c] text-white rounded-xl p-3 max-w-[80%]">
                <p className="leading-relaxed font-semibold">
                  Summarize recommended treatments for Rice Bacterial Leaf
                  Blight based on Indian Council of Agricultural Research
                  guidelines.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#31572c]/10 text-[#31572c] flex items-center justify-center shrink-0 font-bold text-[10px]">
                RAG
              </div>
              <div className="bg-[#f4f7f4] border border-gray-100 rounded-xl p-3 max-w-[85%]">
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mb-2">
                  Retrieved 2 documents (ICAR Bulletin 2024; Pathology Circular
                  18)
                </span>
                <p className="text-gray-650 leading-relaxed font-medium">
                  According to the retrieved bulletins: <br />
                  1. Spray Agrimycin-100 (0.05%) paired with Copper Oxychloride
                  (0.3%) at first onset. <br />
                  2. Avoid excess Nitrogen application (limit top dressing
                  during humid weeks). <br />
                  3. Implement immediate field drainage and secure 2.5cm dry
                  period window.
                </p>
              </div>
            </div>
          </div>

          {/* RAG Query Input */}
          <div className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="Search research database or ask agricultural questions..."
              className="flex-1 bg-[#f4f7f4] border border-gray-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#31572c]"
            />
            <button className="p-2 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl shadow-sm transition-all flex items-center justify-center">
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Indexed PDFs Deck */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText size={13} className="text-[#31572c]" />
              <span>Indexed Literature</span>
            </h3>
            <button className="p-1.5 bg-[#f4f7f4] hover:bg-[#31572c]/10 rounded-lg text-[#31572c] transition-all">
              <Plus size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {recentPapers.map((paper, idx) => (
              <div
                key={idx}
                className="bg-[#f4f7f4] hover:bg-[#31572c]/5 border border-gray-150 p-3 rounded-xl flex flex-col justify-between hover:shadow-sm cursor-pointer transition-all"
              >
                <span className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight">
                  {paper.title}
                </span>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[9px] font-bold text-gray-400">
                    {paper.date} • {paper.size}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#31572c] bg-[#31572c]/10 px-1.5 py-0.5 rounded">
                    {paper.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
