import React, { useState } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  HelpCircle, 
  PlayCircle,
  Star, 
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Video
} from 'lucide-react';
import bannerImg from "../../assets/images/Learning Hub.png";

export default function LearningHubDashboard() {
  const [selectedLecture, setSelectedLecture] = useState(null);

  const metrics = [
    {
      label: "VIDEO LECTURES",
      value: "5,000+",
      badge: "MULTILINGUAL LIBRARY",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200"
    },
    {
      label: "KNOWLEDGE BASE",
      value: "12 Crops",
      badge: "DEEP AGRONOMIC ARTICLES",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-100"
    },
    {
      label: "INTERACTIVE QUIZZES",
      value: "24 Modules",
      badge: "VERIFY PEST/SOWING SKILL",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-100"
    },
    {
      label: "FARMERS ENROLLED",
      value: "1,450+",
      badge: "ACTIVE CERTIFICATIONS",
      badgeClass: "bg-orange-50 text-orange-850 border-orange-100"
    }
  ];

  const lectures = [
    {
      id: 1,
      title: "Scientific Sowing Guidelines for Paddy Crops",
      language: "Hindi (हिंदी)",
      category: "Video Lecture",
      rating: "4.8 / 5.0",
      description: "Comprehensive practical walkthrough on paddy nursery preparation, seed treatment protocols, optimal transplantation spacing, and water management in the early growth phases.",
      duration: "45 mins",
      author: "Dr. Ramesh Prasad, ICAR Central Rice Research Institute"
    },
    {
      id: 2,
      title: "Recognizing Leaf Pathogens & Rust Fungi Early",
      language: "English",
      category: "Microscopy Lab",
      rating: "4.9 / 5.0",
      description: "Visual analysis course detailing early indications of yellow rust, leaf blast, and bacterial blight. Covers sampling protocols and digital microscopic identification methods.",
      duration: "1 hour 15 mins",
      author: "Prof. Sarah Jenkins, Crop Pathology Department, IARI"
    },
    {
      id: 3,
      title: "Drip Irrigation Layouts & Tubewell Pressure Specs",
      language: "Punjabi (ਪੰਜਾਬੀ)",
      category: "Practical Guide",
      rating: "4.7 / 5.0",
      description: "Engineering guide for custom drip layouts, pump horsepower selection, filter maintenance, and pressure monitoring calculations for semi-arid sandy clay soils.",
      duration: "30 mins",
      author: "Er. Gurpreet Singh, Punjab Agricultural University"
    },
    {
      id: 4,
      title: "NPK Chemical Mixing and Soil pH Correction",
      language: "Haryanvi (हरयाणवी)",
      category: "Interactive Q&A",
      rating: "4.6 / 5.0",
      description: "Live Q&A archive covering fertilizer calculation models, micro-nutrient application intervals, and lime/gypsum soil amendments based on Soil Health Card readouts.",
      duration: "55 mins",
      author: "Shri Om Prakash, Senior Agronomist, Haryana Krishi Vigyan Kendra"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      
      {/* 1. Page Header & Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 to-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between min-h-[140px]">
        <div className="relative z-10 w-full md:w-2/3 pr-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#31572c]/10 rounded-xl text-[#31572c]">
              <GraduationCap className="h-6.5 w-6.5" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex flex-wrap items-baseline gap-2.5">
              <span>Learning Hub</span>
              <span className="text-slate-300 font-light hidden sm:inline">|</span>
              <span className="text-[#31572c] font-bold text-sm md:text-base font-hindi">
                शिक्षण केंद्र
              </span>
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-xl leading-relaxed">
            Enroll in agricultural classes, complete pest risk certification courses, and review expert crop webinars.
          </p>
        </div>
        
        {/* Right-aligned image card overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 opacity-15 md:opacity-100 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent z-10 hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-transparent z-10 md:hidden" />
          <img
            src={bannerImg}
            alt="Agronomic training field scene"
            className="w-full h-full object-cover object-right"
          />
        </div>
      </div>

      {/* 2. Top Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-100 p-5 rounded-2xl shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            <div>
              <span className="text-[10px] font-black text-slate-400 tracking-wider block mb-1">
                {m.label}
              </span>
              <span className="text-xl font-extrabold text-slate-900 block">
                {m.value}
              </span>
            </div>
            <div className={`mt-3 self-start text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border ${m.badgeClass}`}>
              {m.badge}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom dual-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Top Training Video Lectures (2/3 width) */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Top Training Video Lectures & Practical Field Guides
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-1">Lecture Topic</th>
                  <th className="pb-3">Language</th>
                  <th className="pb-3">Training Mode</th>
                  <th className="pb-3 text-right pr-2">Student Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lectures.map((lecture) => (
                  <tr 
                    key={lecture.id}
                    onClick={() => setSelectedLecture(lecture)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-1 font-bold text-slate-900 leading-snug max-w-[280px] group-hover:text-[#31572c] transition-colors flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>{lecture.title}</span>
                    </td>
                    <td className="py-4 text-slate-600 font-medium">
                      {lecture.language}
                    </td>
                    <td className="py-4 text-[#31572c] font-bold">
                      {lecture.category}
                    </td>
                    <td className="py-4 text-right pr-2 text-emerald-800 font-extrabold flex items-center justify-end gap-1.5 mt-1 sm:mt-0">
                      <Star className="w-3.5 h-3.5 fill-emerald-800 text-emerald-800" />
                      <span>{lecture.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Certifications & Upcoming Events (1/3 width) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-450 font-bold text-xs uppercase tracking-wider mb-5">
              <span>📋 INTERACTIVE CERTIFICATIONS</span>
            </div>

            <div className="space-y-4">
              {/* Block 1 (Active Certificate Secured) */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Active Certificate Secured</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Suresh Kumar completed 'Pathological Leaf Spot Identification' with 90% accuracy score.
                  </p>
                </div>
              </div>

              {/* Block 2 (Upcoming Live Webinar) */}
              <div className="p-4 bg-white border border-slate-150 rounded-2xl flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Upcoming Live Webinar</h3>
                  <p className="text-xs text-slate-550 mt-1 leading-relaxed">
                    ICAR agronomy research panel will hold a live Q&A session on Smart crop rotations next Monday at 10 AM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Streaming / Practical Guide Modal Workspace */}
      {selectedLecture && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end z-50 animate-fadeIn">
          {/* Overlay Click Close */}
          <div className="absolute inset-0" onClick={() => setSelectedLecture(null)} />
          
          <div className="bg-white h-full max-w-xl w-full border-l border-slate-100 shadow-2xl relative z-10 flex flex-col justify-between p-6 sm:p-8 animate-slideOver">
            
            <div>
              {/* Close Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-850 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  {selectedLecture.category} Stream Node
                </span>
                <button 
                  onClick={() => setSelectedLecture(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedLecture.language} • {selectedLecture.duration}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 leading-snug">{selectedLecture.title}</h3>
                  <p className="text-xs font-semibold text-[#31572c] mt-2 italic">Instructor: {selectedLecture.author}</p>
                </div>

                {/* Simulated Player Viewport */}
                <div className="relative aspect-video w-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-slate-900 shadow-sm overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-bold text-emerald-450 tracking-wider flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      READY TO STREAM
                    </span>
                  </div>
                  
                  <PlayCircle className="w-14 h-14 text-white/90 cursor-pointer hover:scale-115 transition-transform duration-300 relative z-10" />
                  
                  <span className="text-[11px] text-slate-400 font-mono mt-3 relative z-10">Click to connect to live regional CDN node</span>
                </div>

                {/* Overview Block */}
                <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-emerald-800" />
                    <span>CURRICULUM SYLLABUS OVERVIEW</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedLecture.description}
                  </p>
                </div>

                {/* Practical Rating metrics */}
                <div className="flex items-center justify-between p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-emerald-800 text-emerald-800" />
                    <span className="text-xs font-extrabold text-slate-700">Course Rating: {selectedLecture.rating}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Validated by 240+ Farmers</span>
                </div>
              </div>
            </div>

            {/* Bottom Done trigger */}
            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedLecture(null)}
                className="w-full bg-[#31572c] hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                Close Stream
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
