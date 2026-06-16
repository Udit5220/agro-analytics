import React, { useState } from 'react';
import { Play, Search, Medal, CheckCircle2, Clock, ChevronRight, BookOpen, Award, Droplets, Leaf, Shield, Crown } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function DashboardView({ language, setActiveView, setSelectedCourse, data, loading, error }) {
  const isHindi = language === 'Hindi';
  const userRole = localStorage.getItem('userRole') || 'Farmer';
  const [showAllBadges, setShowAllBadges] = useState(false);

  const allBadges = [
    { title: "Level 4 Learner", desc: "Completed 20 courses", icon: <Medal className="w-8 h-8 text-amber-500 mb-2" />, color: "bg-amber-50 border-amber-100", textColor: "text-amber-700", status: "Earned Oct 2025" },
    { title: "Soil Master", desc: "Expert in soil health", icon: <BookOpen className="w-8 h-8 text-emerald-600 mb-2" />, color: "bg-emerald-50 border-emerald-100", textColor: "text-emerald-800", status: "Earned Nov 2025" },
    { title: "Water Saver", desc: "Drip irrigation certified", icon: <Droplets className="w-8 h-8 text-blue-500 mb-2" />, color: "bg-blue-50 border-blue-100", textColor: "text-blue-700", status: "Earned Dec 2025" },
    { title: "Pest Defender", desc: "IPM trained", icon: <Shield className="w-8 h-8 text-rose-500 mb-2" />, color: "bg-rose-50 border-rose-100", textColor: "text-rose-700", status: "Earned Jan 2026" },
    { title: "Harvest King", desc: "Top 10% yield techniques", icon: <Crown className="w-8 h-8 text-purple-500 mb-2" />, color: "bg-purple-50 border-purple-100", textColor: "text-purple-700", status: "Earned Feb 2026" },
    { title: "Organic Guru", desc: "100% natural farming", icon: <Leaf className="w-8 h-8 text-teal-500 mb-2" />, color: "bg-teal-50 border-teal-100", textColor: "text-teal-700", status: "In Progress (80%)" }
  ];

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Skeleton for Header Banner */}
        <div className="bg-emerald-900/20 rounded-3xl h-48 w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl h-24 border border-gray-100 shadow-sm"></div>
            <div className="bg-white rounded-3xl h-48 border border-gray-100 shadow-sm"></div>
          </div>
          <div className="lg:col-span-2 space-y-4">
             <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="bg-white rounded-3xl h-56 border border-gray-100 shadow-sm"></div>
               <div className="bg-white rounded-3xl h-56 border border-gray-100 shadow-sm"></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const { banner_heading, banner_subtext, active_course, recommended_courses } = data;

  return (
    <div className="space-y-6 animate-fadeIn relative">
      
      {/* Badges Modal */}
      {showAllBadges && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-slideUp relative">
            <button onClick={() => setShowAllBadges(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
               ✕
            </button>
            <h2 className="text-2xl font-bold text-emerald-950 mb-2 flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-600" />
              {isHindi ? "मेरी उपलब्धियां और बैज" : "My Achievements & Badges"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {isHindi ? "विभिन्न कृषि मॉड्यूल में आपकी प्रगति के आधार पर आपके द्वारा अर्जित सभी बैज।" : "All the badges you have earned based on your progress across different agricultural modules."}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1 scrollbar-thin">
              {allBadges.map((badge, idx) => (
                <div key={idx} className={`flex flex-col items-center justify-center p-4 rounded-2xl border shadow-sm ${badge.color}`}>
                  {badge.icon}
                  <h4 className={`text-xs font-black uppercase text-center leading-tight mb-1 ${badge.textColor}`}>{badge.title}</h4>
                  <p className="text-[10px] text-gray-600 text-center mb-2 leading-tight">{badge.desc}</p>
                  <span className="text-[9px] font-bold bg-white/60 px-2 py-0.5 rounded-full text-gray-800">{badge.status}</span>
                </div>
              ))}
            </div>
            
            <button onClick={() => setShowAllBadges(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-colors mt-6 shadow-sm">
              {isHindi ? "बंद करें" : "Close"}
            </button>
          </div>
        </div>,
        document.body
      )}
      {/* Personalized Header Banner */}
      <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-800 to-transparent opacity-50 pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {banner_heading || (isHindi ? "वापसी पर स्वागत है!" : "Welcome back!")}
          </h1>
          <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
            {banner_subtext || "Unlock new learning modules based on your role."}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={() => {
                if (setSelectedCourse && active_course?.title) setSelectedCourse(active_course.title);
                setActiveView('lesson');
              }}
              className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-emerald-950" />
              {isHindi ? "सीखना जारी रखें" : "Continue Learning"}
            </button>
            <button 
              onClick={() => setActiveView('catalog')}
              className="bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-500/30 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isHindi ? "पाठ्यक्रम खोजें" : "Search Courses"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile & Progress */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Platform User</h3>
              <p className="text-sm text-gray-500 font-medium">{userRole}</p>
              <div className="mt-1 inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                <Medal className="w-3 h-3" /> Level 4 Learner
              </div>
            </div>
          </div>

          {/* My Progress Tracker */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-emerald-950">{isHindi ? "मेरी प्रगति" : "My Progress"}</h3>
              <span className="text-2xl font-black text-emerald-600">65%</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isHindi ? "सक्रिय पाठ्यक्रम" : "Active Course"}</p>
              <h4 className="font-bold text-gray-900 line-clamp-1">{active_course?.title || 'No active course'}</h4>
            </div>

            <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${active_course?.progress || 0}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Time Spent</span>
                <span className="font-bold text-gray-800 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-600"/> {active_course?.time_spent || '0h'}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</span>
                <span className="font-bold text-gray-800 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/> On Track</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              {isHindi ? "उपलब्धियां" : "Achievements"}
            </h3>
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center bg-amber-50 w-16 h-16 rounded-2xl border border-amber-100 shadow-sm">
                <Medal className="w-6 h-6 text-amber-500 mb-1" />
                <span className="text-[9px] font-black uppercase text-amber-700 text-center leading-none">Level 4<br/>Learner</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-emerald-50 w-16 h-16 rounded-2xl border border-emerald-100 shadow-sm">
                <BookOpen className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-[9px] font-black uppercase text-emerald-800 text-center leading-none">Soil<br/>Master</span>
              </div>
            </div>
            <button onClick={() => setShowAllBadges(true)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors flex items-center gap-1 pt-1 outline-none">
              {isHindi ? "सभी बैज देखें" : "View All Badges"} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column: Recommended Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-950">
              {isHindi ? "आपके लिए अनुशंसित" : "Recommended for You"}
            </h2>
            <button 
              onClick={() => setActiveView('catalog')}
              className="text-sm font-bold text-emerald-600 hover:text-emerald-800"
            >
              {isHindi ? "सभी देखें" : "View All"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(recommended_courses || []).map((course, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col cursor-pointer" onClick={() => {
                if (setSelectedCourse) setSelectedCourse(course.title);
                setActiveView('lesson');
              }}>
                <div className="h-32 w-full relative overflow-hidden bg-gray-100">
                  <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">
                    {course.badge}
                  </div>
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> {course.duration}
                    </span>
                    <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      {isHindi ? "शुरू करें" : "Start"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
