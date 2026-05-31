import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  MapPin, 
  Activity, 
  BarChart2, 
  GitCompare, 
  Target, 
  Globe, 
  MessageSquare, 
  Bell,
  Search,
  RefreshCw,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

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
            className="p-1.5 hover:bg-[#1e293b] rounded text-slate-400 hover:text-white transition-colors"
            title="Back to AgroIndia Hub"
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
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
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
          <div className="bg-[#1e293b]/50 border border-[#334155] rounded p-3">
            <div className="flex items-start gap-2 text-amber-500/80 mb-1">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Market Risk Disclaimer</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Market data and signals are for informational purposes only. Commodity prices are volatile and subject to market risk.
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
                placeholder="Search commodity (e.g. Wheat, Cotton)..." 
                className="pl-9 pr-4 py-1.5 bg-[#1e293b] border border-[#334155] rounded text-sm text-white focus:outline-none focus:border-emerald-500 w-64"
              />
            </div>
            <div className="h-4 w-px bg-[#334155]"></div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="px-2 py-1 rounded bg-[#1e293b]">NCDEX / MCX</span>
              <span>USD/INR: 83.52</span>
              <span>{new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-900 bg-emerald-900/20 text-emerald-500 text-xs font-mono">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MARKET OPEN
            </div>
            <button className="p-1.5 hover:bg-[#1e293b] rounded text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Ticker Strip */}
        <div className="h-8 border-b border-[#1e293b] bg-[#0f172a] flex items-center overflow-hidden flex-shrink-0 px-2 font-mono text-xs whitespace-nowrap">
          <div className="animate-ticker inline-block">
            <span className="mx-4"><span className="text-white font-semibold">WHEAT</span> ₹2340 <span className="text-emerald-500">+1.2%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">COTTON</span> ₹58200 <span className="text-rose-500">-0.7%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">SOYBEAN</span> ₹4280 <span className="text-emerald-500">+2.6%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">SUGAR</span> ₹3850 <span className="text-emerald-500">+0.8%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">CHANA</span> ₹5900 <span className="text-rose-500">-1.1%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">CPO</span> ₹9300 <span className="text-emerald-500">+0.4%</span></span>
            {/* Duplicate for seamless scrolling loop */}
            <span className="mx-4"><span className="text-white font-semibold">WHEAT</span> ₹2340 <span className="text-emerald-500">+1.2%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">COTTON</span> ₹58200 <span className="text-rose-500">-0.7%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">SOYBEAN</span> ₹4280 <span className="text-emerald-500">+2.6%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">SUGAR</span> ₹3850 <span className="text-emerald-500">+0.8%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">CHANA</span> ₹5900 <span className="text-rose-500">-1.1%</span></span>
            <span className="mx-4"><span className="text-white font-semibold">CPO</span> ₹9300 <span className="text-emerald-500">+0.4%</span></span>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide relative">
          <Outlet />
          
          {/* Floating AI Chatbot Placeholder (as requested) */}
          <button className="absolute bottom-6 right-6 h-12 w-12 bg-indigo-600 hover:bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center text-white transition-all transform hover:scale-105 z-50">
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>

      </main>

      <style jsx="true">{`
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
