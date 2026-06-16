import React, { useState } from 'react';
import { Users, Target, Award, AlertTriangle, TrendingUp, TrendingDown, BookOpen, Clock, Activity, CheckCircle2 } from 'lucide-react';

export default function LearningAnalyticsView({ language, data, loading, error }) {
  const isHindi = language === 'Hindi';
  const [activeTab, setActiveTab] = useState('All Users');

  const tabs = ['All Users', 'Farmers', 'FPOs', 'Traders'];
  
  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-20 bg-gray-100 rounded-3xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="h-80 bg-gray-100 rounded-3xl"></div>
           <div className="h-80 bg-gray-100 rounded-3xl"></div>
           <div className="h-80 bg-gray-100 rounded-3xl"></div>
           <div className="h-80 bg-gray-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const { total_learners, average_score, certificates_issued, at_risk_rate, top_performing_modules, course_completion_progress } = data;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Tab Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            {isHindi ? "शिक्षण एनालिटिक्स" : "Learning Analytics"}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            {isHindi ? "प्लेटफ़ॉर्म एंगेजमेंट का लाइव डायग्नोस्टिक पैनल" : "Live diagnostic panel of platform engagement"}
          </p>
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200/60 overflow-x-auto max-w-full scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-white text-emerald-800 shadow-sm border border-gray-100'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Total Learners */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{isHindi ? "कुल शिक्षार्थी" : "Total Learners"}</span>
              <h3 className="text-3xl font-extrabold text-gray-900">{total_learners || '0'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex border border-emerald-100/50">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
        </div>

        {/* Average Score */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{isHindi ? "औसत स्कोर" : "Average Score"}</span>
              <h3 className="text-3xl font-extrabold text-gray-900">{average_score || '0%'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md inline-flex border border-emerald-100/50">
            <CheckCircle2 className="w-3.5 h-3.5" /> High Performance
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
        </div>

        {/* Certificates Issued */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{isHindi ? "प्रमाणपत्र जारी किए गए" : "Certificates Issued"}</span>
              <h3 className="text-3xl font-extrabold text-gray-900">{certificates_issued || '0'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-flex border border-amber-100/50">
            <TrendingUp className="w-3.5 h-3.5" /> +8.2% historical avg
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
        </div>

        {/* At-Risk Rate */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">{isHindi ? "जोखिम दर" : "At-Risk Rate"}</span>
              <h3 className="text-3xl font-extrabold text-gray-900">{at_risk_rate || '0%'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md inline-flex border border-rose-100/50">
            <TrendingDown className="w-3.5 h-3.5" /> -1.5% dropout risk
          </div>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-rose-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
        </div>
      </div>

      {/* Graphical Layout Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Center-Left: Engagement Analytics Column Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-80">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">{isHindi ? "सगाई की प्रवृत्ति" : "Engagement Trends"}</h3>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">6-Month Historical</p>
            </div>
            <button className="text-gray-400 hover:text-emerald-600 transition-colors p-1">
              <Activity className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-2">
            {[40, 65, 45, 80, 95, 75].map((height, i) => {
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-3 group">
                  <div className="w-full bg-gray-50 rounded-t-xl flex items-end justify-center relative overflow-hidden group-hover:bg-gray-100 transition-colors h-40">
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-1000 ${i === 4 ? 'bg-emerald-500' : 'bg-emerald-200/70 group-hover:bg-emerald-300'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                    {/* Tooltip on hover */}
                    <div className="absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded">
                      {height}%
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{months[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center-Right: Top Performance Board */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-80">
          <div className="flex justify-between items-start mb-6 shrink-0">
            <div>
              <h3 className="text-base font-bold text-gray-900">{isHindi ? "शीर्ष प्रदर्शन करने वाले मॉड्यूल" : "Top Performing Modules"}</h3>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">Maximum Learner Engagement</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            {(top_performing_modules || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-50 hover:bg-emerald-50/50 p-3.5 rounded-2xl border border-transparent hover:border-emerald-100 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  idx === 0 ? 'bg-amber-100 text-amber-700' : 
                  idx === 1 ? 'bg-gray-200 text-gray-600' : 
                  idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                </div>
                <div className="text-sm font-black text-emerald-600">{item.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Left: Course Completion Progress */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-gray-900">{isHindi ? "पाठ्यक्रम पूर्णता" : "Course Completion Progress"}</h3>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">Absolute completion rates</p>
            </div>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-5">
            {(course_completion_progress || []).map((course, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700">{course.course_title}</span>
                  <span className="text-gray-900">{course.percent}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-500 rounded-full`} style={{ width: `${course.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Right: Activity Stream */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-gray-900">{isHindi ? "गतिविधि स्ट्रीम" : "Activity Stream"}</h3>
              <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">Recent System Actions</p>
            </div>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gray-100 pl-1">
            {[
              { icon: Award, bg: "bg-amber-100 text-amber-600", title: "Certificate Issued", desc: "Ramesh K. earned 'Soil Master'", time: "2 mins ago" },
              { icon: Target, bg: "bg-emerald-100 text-emerald-600", title: "Assessment Passed", desc: "15 users passed Pest Control", time: "1 hour ago" },
              { icon: BookOpen, bg: "bg-blue-100 text-blue-600", title: "New Enrollment", desc: "FPO Co-op enrolled 50 farmers", time: "3 hours ago" }
            ].map((log, idx) => {
              const Icon = log.icon;
              return (
                <div key={idx} className="flex items-start gap-4 relative z-10 py-3 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10 ${log.bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-gray-50/50 group-hover:bg-emerald-50/30 p-3 rounded-2xl border border-transparent group-hover:border-emerald-100 transition-colors -mt-1.5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-gray-900">{log.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400">{log.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{log.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
