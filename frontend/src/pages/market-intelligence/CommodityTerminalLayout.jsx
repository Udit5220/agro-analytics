import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, List, MapPin, Activity, BarChart2, GitCompare, Target, Globe, MessageSquare, 
  Bell, Search, RefreshCw, AlertTriangle, ArrowLeft, X, Send, Bot, User, CheckCircle2
} from 'lucide-react';
import { commodityApi } from '../../services/apiService';

const MENU_ITEMS = [
  { name: 'Overview', path: '/module/market-intelligence', icon: LayoutDashboard },
  { name: 'Watchlist', path: '/module/market-intelligence/watchlist', icon: List },
  { name: 'Spot Prices', path: '/module/market-intelligence/spot', icon: MapPin },
  { name: 'Futures Prices', path: '/module/market-intelligence/futures', icon: Activity },
  { name: 'Advanced Charts', path: '/module/market-intelligence/charts', icon: BarChart2 },
  { name: 'Spread Analysis', path: '/module/market-intelligence/spreads', icon: GitCompare },
  { name: 'Market Signals', path: '/module/market-intelligence/signals', icon: Target },
  { name: 'Global Trade Impact', path: '/module/market-intelligence/trade', icon: Globe },
  { name: 'AI Commentary', path: '/module/market-intelligence/ai', icon: MessageSquare },
  { name: 'Alerts', path: '/module/market-intelligence/alerts', icon: Bell },
];

export default function CommodityTerminalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [globalCommodity, setGlobalCommodity] = useState('Wheat');
  const [currency, setCurrency] = useState({ rate: 83.52, changePct: 0, loading: true });
  const [tickerData, setTickerData] = useState([]);

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hello! I am the AgroIndia AI Assistant. How can I help you understand market signals, spreads, or prices today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [lastDataSource, setLastDataSource] = useState(null);
  const messagesEndRef = useRef(null);

  const pageContext = location.pathname.split('/').pop() || 'overview';

  useEffect(() => {
    async function fetchCurrency() {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data?.rates?.INR) {
          const currentRate = data.rates.INR;
          const dayOfMonth = new Date().getDate();
          const pseudoRandomShift = (dayOfMonth % 11 - 5) / 1000;
          const previousRate = currentRate / (1 + pseudoRandomShift);
          const changePct = ((currentRate - previousRate) / previousRate) * 100;
          setCurrency({ rate: currentRate, changePct, loading: false });
        }
      } catch (e) {
        setCurrency(prev => ({ ...prev, loading: false }));
      }
    }
    fetchCurrency();
    const interval = setInterval(fetchCurrency, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await commodityApi.getDashboard();
        if (res.data) {
          const combined = [...(res.data.topRising || []), ...(res.data.topFalling || [])].filter(Boolean);
          if (combined.length > 0) setTickerData(combined);
        }
      } catch (e) { }
    }
    fetchTicker();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading]);

  const handleSendChat = async (text) => {
    const msg = text || chatInput;
    if (!msg.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const payload = {
        message: msg,
        commodity: globalCommodity,
        userType: 'trader', // Could be made selectable in UI
        pageContext: pageContext
      };
      
      const res = await commodityApi.chatWithCommodityAI(payload);
      
      if (res.success) {
        setChatMessages(prev => [...prev, { role: 'ai', text: res.answer, source: res.dataSource }]);
        setLastDataSource(res.dataSource);
      } else {
        throw new Error(res.message);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'AI assistant is temporarily unavailable. Please try again later.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickQuestions = [
    "What does spread mean?",
    "Explain this page",
    "What should a farmer monitor?",
    "Why is USD/INR important?"
  ];

  return (
    <div className="flex h-screen bg-[#0A0D14] text-slate-300 font-sans overflow-hidden">
      
      {/* ─── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 border-r border-[#1e293b] flex flex-col bg-[#0f172a]">
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
          <div>
            <h1 className="text-emerald-500 font-black text-lg tracking-tight">AgroIndia Terminal</h1>
            <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Trading Terminal Pro</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="p-1.5 hover:bg-[#1e293b] rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {MENU_ITEMS.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/module/market-intelligence'}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                        : 'text-slate-400 hover:bg-[#1e293b] hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#1e293b]">
          <div className="bg-[#1A3A1A] border border-[#334155] rounded p-3">
            <div className="flex items-start gap-2 text-amber-500/80 mb-1">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Market Risk Disclaimer</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Market data and signals are for informational purposes only. Commodity prices are volatile.
            </p>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-14 border-b border-[#1e293b] bg-[#0A0D14] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                value={globalCommodity}
                onChange={e => setGlobalCommodity(e.target.value)}
                placeholder="Search commodity..." 
                className="pl-9 pr-4 py-1.5 bg-[#1e293b] border border-[#334155] rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
            <div className="h-4 w-px bg-[#0f172a]"></div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="px-2 py-1 rounded bg-[#1e293b]">NCDEX / MCX</span>
              <span className="flex items-center gap-1">
                USD/INR: {currency.loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : currency.rate.toFixed(2)}
              </span>
              <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-900 bg-emerald-900/20 text-emerald-500 text-xs font-mono">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MARKET OPEN
            </div>
          </div>
        </header>

        {/* Ticker Strip */}
        <div className="h-8 border-b border-[#1e293b] bg-[#0A0D14] flex items-center overflow-hidden flex-shrink-0 px-2 font-mono text-xs whitespace-nowrap">
          <div className="animate-ticker inline-block">
            {tickerData.length > 0 ? (
              <>
                {tickerData.map((item, i) => (
                  <span key={i} className="mx-4">
                    <span className="text-white font-semibold">{item._id?.toUpperCase()}</span> ₹{item.modalPrice}{' '}
                    <span className={item.changePercent > 0 ? "text-emerald-500" : "text-rose-500"}>{item.changePercent > 0 ? '+' : ''}{item.changePercent}%</span>
                  </span>
                ))}
                {tickerData.map((item, i) => (
                  <span key={`dup-${i}`} className="mx-4">
                    <span className="text-white font-semibold">{item._id?.toUpperCase()}</span> ₹{item.modalPrice}{' '}
                    <span className={item.changePercent > 0 ? "text-emerald-500" : "text-rose-500"}>{item.changePercent > 0 ? '+' : ''}{item.changePercent}%</span>
                  </span>
                ))}
              </>
            ) : <span className="mx-4 text-slate-500">Loading Live Market Data...</span>}
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">
          <Outlet context={{ globalCommodity, setGlobalCommodity, currency }} />
          
          {/* Floating AI Chatbot Button */}
          {!isChatOpen && (
            <button 
              onClick={() => setIsChatOpen(true)}
              className="absolute bottom-6 right-6 h-14 w-14 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center text-white transition-all transform hover:scale-105 z-40 group"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="absolute right-16 bg-indigo-900/90 text-indigo-100 text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-indigo-700">
                Ask AgroIndia AI
              </span>
            </button>
          )}
        </div>

      </main>

      {/* ─── AI CHAT PANEL (SLIDE IN) ─────────────────────────────────────── */}
      {isChatOpen && (
        <div className="absolute top-0 right-0 h-full w-[400px] bg-[#0A0D14] border-l border-[#1e293b] shadow-2xl flex flex-col z-50 animate-slideInRight">
          
          {/* Header */}
          <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0A0D14]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                <Bot className="h-5 w-5 text-slate-200" />
              </div>
              <div>
                <h3 className="font-bold text-slate-200 text-sm">AgroIndia AI Assistant</h3>
                <p className="text-[10px] text-slate-400">Ask about {globalCommodity} on {pageContext}</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide flex flex-col">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="h-6 w-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex flex-shrink-0 items-center justify-center mt-1">
                    <Bot className="h-3 w-3 text-indigo-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#0A0D14] text-white rounded-tr-none' 
                    : 'bg-[#1e293b] text-slate-200 border border-[#334155] rounded-tl-none'
                }`}>
                  {msg.text}
                  {msg.source && (
                    <div className="mt-2 pt-2 border-t border-slate-600/50 flex justify-between items-center opacity-60">
                      <span className="text-[9px] uppercase font-bold tracking-wider">
                        {msg.source === 'live_data' ? 'Live Data' : msg.source === 'mixed' ? 'Mixed Data' : 'Demo Data'}
                      </span>
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-6 w-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mt-1">
                  <Bot className="h-3 w-3 text-indigo-400" />
                </div>
                <div className="bg-[#1e293b] text-slate-200 border border-[#334155] rounded-xl rounded-tl-none px-4 py-3 flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {chatMessages.length < 3 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map(q => (
                <button 
                  key={q} 
                  onClick={() => handleSendChat(q)}
                  disabled={isChatLoading}
                  className="text-[10px] bg-[#1e293b] hover:hover:bg-[#0f172a] border border-[#334155] text-slate-300 px-2.5 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Warning Banner */}
          <div className="px-4 py-1.5 bg-amber-500/10 border-y border-amber-200 flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span className="text-[9px] text-amber-500 uppercase tracking-wider font-bold">AI answers are informational, not financial advice</span>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#0A0D14]">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
              className="flex items-center gap-2 relative"
            >
              <input 
                type="text" 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about spreads, signals, prices..."
                className="w-full bg-[#1e293b] border border-[#334155] text-slate-200 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={isChatLoading}
              />
              <button 
                type="submit" 
                disabled={!chatInput.trim() || isChatLoading}
                className="absolute right-1 h-10 w-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </button>
            </form>
          </div>

        </div>
      )}

      <style jsx="true">{`
        .animate-ticker { animation: ticker 30s linear infinite; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-slideInRight { animation: slideIn 0.3s ease-out forwards; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
