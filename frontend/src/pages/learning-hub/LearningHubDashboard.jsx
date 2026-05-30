import React from "react";
import { GraduationCap, BookOpen, Video, Award, ArrowUpRight, HelpCircle, CheckCircle2, MonitorPlay } from "lucide-react";

export default function LearningHubDashboard() {
  const metrics = [
    { label: "Video Lectures", value: "5,000+", sub: "Multilingual library", color: "text-[#31572c] bg-[#31572c]/10" },
    { label: "Knowledge Base", value: "12 Crops", sub: "Deep agronomic articles", color: "text-emerald-700 bg-emerald-50" },
    { label: "Interactive Quizzes", value: "24 Modules", sub: "Verify pest/sowing skill", color: "text-sky-700 bg-sky-50" },
    { label: "Farmers Enrolled", value: "1,450+", sub: "Active certifications", color: "text-amber-700 bg-amber-50" },
  ];

  const lectures = [
    { title: "Scientific Sowing Guidelines for Paddy Crops", language: "Hindi (हिंदी)", category: "Video Lecture", rating: "4.8 / 5.0" },
    { title: "Recognizing Leaf Pathogens & Rust Fungi Early", language: "English", category: "Microscopy Lab", rating: "4.9 / 5.0" },
    { title: "Drip Irrigation Layouts & Tubewell Pressure Specs", language: "Punjabi (ਪੰਜਾਬੀ)", category: "Practical Guide", rating: "4.7 / 5.0" },
    { title: "NPK Chemical Mixing and Soil pH Correction", language: "Haryanvi (हरियाणवी)", category: "Interactive Q&A", rating: "4.6 / 5.0" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <GraduationCap className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Learning Hub</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              शिक्षण केंद्र
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Enroll in agricultural classes, complete pest risk certification courses, and review expert crop webinars.
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

      {/* Lectures Grid & Quizzes Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Lectures List Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
            Top Training Video Lectures & Practical Field Guides
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3 pl-1">Lecture Topic</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Training Mode</th>
                  <th className="p-3 text-right pr-2">Student Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {lectures.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f4f7f4]/30 transition-colors text-xs font-semibold">
                    <td className="p-3 pl-1 text-gray-900 font-bold flex items-center gap-2">
                      <MonitorPlay size={13} className="text-[#31572c] shrink-0" />
                      <span>{item.title}</span>
                    </td>
                    <td className="p-3 text-gray-550">{item.language}</td>
                    <td className="p-3 text-[#31572c] font-black">{item.category}</td>
                    <td className="p-3 text-right pr-2 text-emerald-700 font-black">{item.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Quiz Certifications */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award size={13} className="text-[#31572c]" />
            <span>Interactive Certifications</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-2.5">
              <CheckCircle2 size={18} className="text-[#31572c] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">Active Certificate Secured</span>
                <span className="text-[11px] text-gray-600 block mt-0.5 leading-relaxed font-semibold">
                  Suresh Kumar completed "Pathological Leaf Spot identification" with 90% accuracy score.
                </span>
              </div>
            </div>

            <div className="bg-[#f4f7f4] border border-gray-150 p-3 rounded-xl flex gap-2.5">
              <HelpCircle size={18} className="text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-gray-800 block">Upcoming Live Webinar</span>
                <span className="text-[11px] text-gray-550 block mt-0.5 leading-relaxed font-medium">
                  ICAR agronomy research panel will hold a live Q&A session on Smart crop rotations next Monday at 10 AM.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
