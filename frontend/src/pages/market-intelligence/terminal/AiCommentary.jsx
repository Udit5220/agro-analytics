import React from 'react';
import { MessageSquare, Cpu, TrendingUp } from 'lucide-react';

export default function AiCommentary() {
  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">AI Market Commentary</h2>
          <p className="text-sm text-slate-400 mt-1">Deep-dive algorithmic analysis of price drivers and market dynamics.</p>
        </div>
        <select className="bg-[#1e293b] border border-[#334155] text-white text-sm rounded px-3 py-1.5 focus:outline-none">
          <option>Wheat</option>
          <option>Cotton</option>
          <option>Soybean</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Left Col: The detailed commentary */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Cpu className="h-48 w-48 text-emerald-500" />
          </div>
          
          <div className="p-6 border-b border-[#334155] bg-[#0f172a] relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-bold text-emerald-400">Wheat Market Overview (Generated just now)</h3>
            </div>
            <p className="text-sm text-slate-400">
              Analysis based on 23,450 spot records, 11 active futures contracts, and global parity metrics.
            </p>
          </div>

          <div className="p-8 space-y-6 text-slate-300 leading-relaxed text-sm relative z-10 overflow-y-auto flex-1">
            <p>
              Spot prices are rising steadily while futures reflect a widening premium. Arrival volumes remain stable across major mandis in Madhya Pradesh and Rajasthan, but government procurement targets are heavily influencing the floor price.
            </p>
            <p>
              The market is currently in <strong className="text-emerald-400">Contango</strong>, with the spread between Spot (₹2,340) and the nearest June Futures contract (₹2,410) standing at +₹70. This positive basis suggests that the market expects tighter supplies or higher holding costs moving into the monsoon season.
            </p>
            <p>
              On the global front, the slight depreciation in USD/INR (currently 83.52) is generally supportive for exports. However, the current Basic Customs Duty (BCD) of 40% and export restrictions cap the upside potential by preventing a complete alignment with the CIF benchmark (₹2,350/qtl eq).
            </p>
            <div className="bg-[#0f172a] border border-[#334155] p-5 rounded-lg mt-8">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> AI Conclusion
              </h4>
              <p className="text-slate-400">
                The momentum remains <strong className="text-white">Bullish</strong>. Millers should look for slight dips toward the ₹2,350 support level for procurement. Exercise caution with aggressive short positions as policy interventions (FCI open market sales) are the only major downward risk currently visible in the data model.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Key drivers summary */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Sentiment Drivers</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Spot Demand</span>
                  <span className="text-emerald-400 font-bold">Strong</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Futures Premium</span>
                  <span className="text-emerald-400 font-bold">Expanding</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[70%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Global Parity</span>
                  <span className="text-amber-500 font-bold">Neutral</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[50%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Policy Impact</span>
                  <span className="text-rose-400 font-bold">Restrictive</span>
                </div>
                <div className="h-1.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
