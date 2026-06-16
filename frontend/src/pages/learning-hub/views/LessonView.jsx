import React, { useState } from 'react';
import { Play, Pause, Maximize, Volume2, ChevronRight, FileText, CheckCircle2, Lock, Download, AlertTriangle, Clock, TrendingUp, ArrowLeft } from 'lucide-react';

export default function LessonView({ language, setActiveView, data, loading, error }) {
  const isHindi = language === 'Hindi';
  const [activeTab, setActiveTab] = useState('notes');
  const [isPlaying, setIsPlaying] = useState(false);

  if (loading || !data) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 animate-pulse p-4">
        <div className="flex-1 space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="w-full aspect-video bg-gray-200 rounded-3xl"></div>
          <div className="bg-gray-100 rounded-3xl h-64"></div>
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-gray-100 rounded-3xl h-96"></div>
        </div>
      </div>
    );
  }

  const { module_title, tags, duration, notes, key_insight, timeline } = data;

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
      
      {/* Left/Main Column: Media Player & Content */}
      <div className="flex-1 space-y-6">
        
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center text-xs font-bold text-gray-400 mb-2 gap-2 cursor-pointer">
            <span className="hover:text-emerald-600 transition-colors flex items-center gap-1" onClick={() => setActiveView('dashboard')}>
              <ArrowLeft className="w-3.5 h-3.5" />
              {isHindi ? "डैशबोर्ड" : "Dashboard"}
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-emerald-600 transition-colors">
              {module_title || (isHindi ? "कमोडिटी मूल्य पूर्वानुमान" : "Commodity Price Forecasting")}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {module_title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              {isHindi ? "लाइव टॉपिक" : "Live Topic"}
            </span>
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {duration || '24 mins'}
            </span>
            {(tags || []).map((tag, idx) => (
              <span key={idx} className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                <TrendingUp className="w-3.5 h-3.5" /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Media Player Container */}
        <div className="w-full aspect-video bg-gray-900 rounded-3xl overflow-hidden relative shadow-md group">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=1200&q=80" 
            alt="Video Thumbnail" 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-40' : 'opacity-80'}`}
          />
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center transition-colors shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
              </button>
              <div className="flex-1 px-6">
                <div className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer">
                  <div className="h-full bg-emerald-500 rounded-full w-[33%] relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white">
                <Volume2 className="w-5 h-5 cursor-pointer hover:text-emerald-400" />
                <Maximize className="w-5 h-5 cursor-pointer hover:text-emerald-400" />
              </div>
            </div>
          </div>
          {/* Play Overlay if not playing */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Play className="w-8 h-8 text-white fill-white ml-2" />
              </div>
            </div>
          )}
        </div>

        {/* Tabbed Navigation Component */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center border-b border-gray-100 bg-gray-50/50">
            {['notes', 'q&a', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
                  activeTab === tab
                    ? 'text-emerald-700 bg-white border-b-2 border-emerald-500'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isHindi 
                  ? (tab === 'notes' ? "टिप्पणियाँ" : tab === 'q&a' ? "प्रश्नोत्तर" : "संसाधन")
                  : tab.replace('&', ' & ')}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {module_title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {notes}
                </p>
                
                {/* Stylized Key Insight Callout Blockout Box */}
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-2xl shadow-inner my-6">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2 text-sm">
                    <AlertTriangle className="w-5 h-5 text-emerald-600" />
                    {isHindi ? "मुख्य अंतर्दृष्टि" : "Key Insight"}
                  </div>
                  <p className="text-emerald-900/80 text-sm font-medium leading-relaxed italic">
                    {key_insight}
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'q&a' && (
              <div className="text-center py-10 text-gray-400 text-sm font-semibold">
                {isHindi ? "इस पाठ के लिए अभी तक कोई प्रश्न नहीं है।" : "No questions asked yet for this lesson."}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="text-center py-10 text-gray-400 text-sm font-semibold">
                {isHindi ? "इस मॉड्यूल के साथ डाउनलोड करने योग्य पीडीएफ संलग्न हैं।" : "Downloadable PDFs are attached with this module."}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Sidebar: Curriculum Panel */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-6 space-y-6">
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
              {isHindi ? "पाठ्य सामग्री" : "Lesson Contents"}
            </h3>
            
            <div className="space-y-4 relative">
               <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-gray-100 z-0"></div>
               
               {(timeline || []).map((item, idx) => {
                 if (item.status === 'completed') {
                   return (
                     <div key={idx} className="flex items-start gap-4 relative z-10 cursor-pointer group">
                       <div className="bg-white p-0.5 mt-0.5 rounded-full shrink-0">
                         <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-emerald-800 line-through decoration-emerald-200">
                           {item.title}
                         </h4>
                         <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
                       </div>
                     </div>
                   );
                 } else if (item.status === 'active') {
                   return (
                     <div key={idx} className="flex items-start gap-4 relative z-10 bg-emerald-50/50 p-3 -mx-3 rounded-xl border border-emerald-100">
                       <div className="bg-white p-0.5 mt-0.5 rounded-full shrink-0 border-2 border-emerald-500 w-5 h-5 flex items-center justify-center">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-gray-900">
                           {item.title}
                         </h4>
                         <p className="text-xs text-emerald-600 mt-0.5 font-semibold">{item.duration} • Active</p>
                       </div>
                     </div>
                   );
                 } else {
                   return (
                     <div key={idx} className="flex items-start gap-4 relative z-10 opacity-50 cursor-not-allowed group">
                       <div className="bg-gray-50 border border-gray-200 p-0.5 mt-0.5 rounded-full shrink-0 w-5 h-5 flex items-center justify-center">
                         <Lock className="w-2.5 h-2.5 text-gray-400" />
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-gray-600">
                           {item.title}
                         </h4>
                         <p className="text-xs text-gray-400 mt-0.5">{item.duration}</p>
                       </div>
                       <button 
                        className="absolute right-0 top-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => setActiveView('quiz')}
                       >
                         Take Quiz
                       </button>
                     </div>
                   );
                 }
               })}
            </div>

            <button 
              onClick={() => setActiveView('quiz')}
              className="mt-6 w-full py-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 font-bold text-sm transition-all flex items-center justify-center"
            >
              Take Assessment
            </button>
          </div>

          <button 
            onClick={() => alert(isHindi ? "कार्यपुस्तिका सफलतापूर्वक डाउनलोड हो गई!" : "Workbook PDF successfully downloaded!")}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
          >
            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            {isHindi ? "कार्यपुस्तिका डाउनलोड करें" : "Download Workbook PDF"}
          </button>

        </div>
      </div>

    </div>
  );
}
