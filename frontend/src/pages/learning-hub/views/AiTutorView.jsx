import React, { useState } from 'react';
import { Send, Mic, Paperclip, Clock, CheckCircle2, PlayCircle, FileText, HelpCircle, History, Bot } from 'lucide-react';

export default function AiTutorView({ language }) {
  const isHindi = language === 'Hindi';
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: isHindi 
        ? "नमस्ते! मैं आपका एग्रो एआई ट्यूटर हूं। आप आज क्या सीखना चाहेंगे?"
        : "Hello! I'm your Agro AI Tutor. What would you like to learn today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;
    
    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const activeRole = localStorage.getItem('userRole') || 'Farmer';
      const response = await fetch('http://localhost:5000/api/learning/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.text,
          role: activeRole,
          language: language,
          context: 'Organic Farming / Sustainable Practices'
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', text: data.data }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Network error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[400px]">
      
      {/* Left/Center: Chat Pane */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="bg-emerald-950 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800/50 rounded-xl border border-emerald-500/30">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight tracking-wide">
                {isHindi ? "एग्रो एआई ट्यूटर" : "Agro AI Tutor"}
              </h2>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                {isHindi ? "सक्रिय शिक्षण सत्र" : "Active Learning Session"}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-emerald-100 hover:text-white transition-colors text-sm font-bold bg-emerald-900/50 px-3 py-1.5 rounded-lg border border-emerald-800/50">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">{isHindi ? "हाल का इतिहास" : "Recents"}</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 scrollbar-thin">
          
          {messages.map((msg, idx) => (
            msg.role === 'user' ? (
              <div key={idx} className="flex justify-end animate-slideUp">
                <div className="bg-gray-100 text-gray-800 px-5 py-3.5 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm text-sm font-medium">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={idx} className="flex justify-start animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex gap-3 max-w-[90%]">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-emerald-50/80 border border-emerald-100 px-6 py-5 rounded-3xl rounded-tl-sm shadow-sm">
                      <div className="text-gray-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}

          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-3 max-w-[90%]">
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="bg-emerald-50/80 border border-emerald-100 px-6 py-3 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Input Panel */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-2 py-1.5 focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-sm transition-all">
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors shrink-0">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={isHindi ? "AI ट्यूटर से कुछ भी पूछें..." : "Ask the AI Tutor anything about your crops..."}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-800 placeholder-gray-400 px-2 py-2"
            />
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors shrink-0">
              <Mic className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className={`p-2.5 rounded-full transition-all shrink-0 ${query.trim() && !isLoading ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700' : 'bg-emerald-100 text-emerald-400'}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Context & Actions */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* Course Progress Tracker */}
        <div className="bg-emerald-950 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-800 rounded-full blur-2xl opacity-50"></div>
          <h3 className="text-sm font-bold text-emerald-100 mb-4 flex items-center gap-2 relative z-10">
            <Clock className="w-4 h-4" /> {isHindi ? "वर्तमान पाठ्यक्रम प्रगति" : "Current Course Progress"}
          </h3>
          <div className="relative z-10">
            <h4 className="font-bold text-lg leading-snug mb-1">Organic Wheat Farming</h4>
            <p className="text-xs text-emerald-300 mb-4">Module 3: Soil Preparation</p>
            
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>{isHindi ? "पूर्ण" : "Completed"}</span>
              <span className="text-emerald-400">65%</span>
            </div>
            <div className="h-1.5 w-full bg-emerald-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[65%]"></div>
            </div>
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-1">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
            {isHindi ? "अगला अनुशंसित" : "Recommended Next"}
          </h3>
          
          <div className="space-y-3">
            <div className="flex gap-3 p-3 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800">Irrigation Tips for Rabi</h4>
                <p className="text-xs text-gray-500 mt-0.5">Video Lesson • 8 mins</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800">Organic Pesticides</h4>
                <p className="text-xs text-gray-500 mt-0.5">Quick Quiz • 5 Questions</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-2xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-800">Soil NPK Ratios Guide</h4>
                <p className="text-xs text-gray-500 mt-0.5">PDF Resource • 2 pages</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
