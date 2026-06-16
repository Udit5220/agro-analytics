import React, { useState } from 'react';
import { X, Clock, HelpCircle, CheckCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function CourseQuizView({ language, setActiveView, data, loading, error }) {
  const isHindi = language === 'Hindi';
  const [selectedOption, setSelectedOption] = useState(null);

  if (loading || !data) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 md:p-6 animate-pulse">
        <div className="bg-white w-full max-w-3xl rounded-3xl h-[80vh] flex flex-col">
          <div className="h-16 bg-gray-100 border-b border-gray-200"></div>
          <div className="flex-1 p-6 md:p-10 space-y-8">
            <div className="h-8 bg-gray-200 w-1/3 mx-auto rounded"></div>
            <div className="h-24 bg-gray-200 w-full rounded-xl"></div>
            <div className="space-y-4">
               {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl"></div>)}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const { course_title, question, options, img } = data;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-fadeIn p-4 md:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-full">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
              {course_title || (isHindi ? "सतत खेती" : "Sustainable Farming")}
            </p>
            <h2 className="font-bold text-gray-900 text-sm md:text-base">
              {isHindi ? "प्रश्न अभ्यास" : "Practice Question"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>08:45</span>
            </div>
            <button 
              onClick={() => setActiveView('dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="w-full bg-gray-100 h-1">
          <div className="bg-emerald-500 h-1 transition-all duration-500 w-[40%]"></div>
        </div>

        {/* Main Quiz Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Question Header */}
            <div className="space-y-4 text-center">
              <span className="inline-block bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                {isHindi ? "ज्ञान की जांच" : "Knowledge Check"}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                {question}
              </h3>
            </div>

            {img && (
              <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner relative">
                <img 
                  src={img} 
                  alt="Context" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" /> {isHindi ? "संदर्भ छवि" : "Context Image"}
                </div>
              </div>
            )}

            {/* Options Grid */}
            <div className="space-y-3 pt-2">
              {(options || []).map((option) => {
                const isActive = selectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full flex items-center text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'border-emerald-500 bg-emerald-50 shadow-sm' 
                        : 'border-gray-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isActive ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {option.id}
                    </div>
                    <span className={`ml-4 flex-1 font-semibold text-sm md:text-base ${
                      isActive ? 'text-emerald-950' : 'text-gray-700'
                    }`}>
                      {option.text}
                    </span>
                    {isActive && (
                      <CheckCircle className="w-6 h-6 text-emerald-500 ml-4 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center shrink-0">
          <button className="text-sm font-bold text-gray-500 hover:text-gray-800 px-4 py-2 transition-colors">
            {isHindi ? "पिछला प्रश्न" : "Previous"}
          </button>
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
              selectedOption 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isHindi ? "आगे बढ़ें" : "Continue"}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
