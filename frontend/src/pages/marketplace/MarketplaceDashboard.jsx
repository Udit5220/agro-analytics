import React from "react";
import { Store, ShoppingBag, Tractor, Truck, ArrowUpRight, Award, ShieldCheck, MapPin } from "lucide-react";

export default function MarketplaceDashboard() {
  const metrics = [
    { label: "Active Listings", value: "84 Trades", sub: "B2B / B2C produce deals", color: "text-[#31572c] bg-[#31572c]/10" },
    { label: "Logistics Tracking", value: "14 Trucks", sub: "In-transit telemetry", color: "text-emerald-700 bg-emerald-50" },
    { label: "Pending Inputs", value: "2 Orders", sub: "Seed / fertilizer stocks", color: "text-sky-700 bg-sky-50" },
    { label: "Total Traded Vol", value: "4.8K Tons", sub: "Completed transactions", color: "text-amber-700 bg-amber-50" },
  ];

  const trades = [
    { item: "Premium Basmati Rice (Paddy)", volume: "80 Tons", price: "₹28,500 / Ton", status: "In Transit" },
    { item: "Organic Wheat Seeds (Kalyansona)", volume: "120 Bags", price: "₹1,200 / Bag", status: "Processing" },
    { item: "NPK 12-32-16 Fertilizer (50kg)", volume: "200 Bags", price: "₹1,450 / Bag", status: "Dispatched" },
    { item: "Raw Cotton (Shankar-6)", volume: "45 Tons", price: "₹68,000 / Ton", status: "Ready for Pickup" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Store className="h-6.5 w-6.5 text-[#31572c]" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
            <span>Marketplace Module</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-bold text-sm md:text-base">
              कृषि बाज़ार
            </span>
          </h1>
        </div>
        <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-1.5">
          Trade certified farm produce, buy verified fertilizers and seed inputs, and track regional logistics.
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

      {/* Trades & Logistics Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Trades Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 overflow-hidden">
          <span className="text-sm font-bold text-gray-800 tracking-wide mb-1 block">
            Active Trading Listings & Inputs Purchase Ledgers
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3 pl-1">Trading Commodity / Input</th>
                  <th className="p-3">Order Volume</th>
                  <th className="p-3">Price / Rate</th>
                  <th className="p-3 text-right pr-2">Logistics Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60">
                {trades.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f4f7f4]/30 transition-colors text-xs font-semibold">
                    <td className="p-3 pl-1 text-gray-900 font-bold">{item.item}</td>
                    <td className="p-3 text-gray-550">{item.volume}</td>
                    <td className="p-3 text-emerald-700 font-black">{item.price}</td>
                    <td className="p-3 text-right pr-2">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Ready for Pickup' ? 'bg-[#31572c] text-white' :
                        item.status === 'In Transit' ? 'bg-sky-50 text-sky-700' :
                        item.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Logistics Telemetry Warnings */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Tractor size={13} className="text-[#31572c]" />
            <span>Logistics & Escrow Guard</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-[#f4f7f4] border border-gray-150 p-3 rounded-xl flex gap-2.5">
              <ShieldCheck size={18} className="text-[#31572c] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">Escrow Payments Enabled</span>
                <span className="text-[11px] text-gray-650 block mt-0.5 leading-relaxed font-semibold">
                  Buyer funds are secured. Release occurs automatically upon Mandi digital receipt verification.
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex gap-2.5">
              <MapPin size={18} className="text-[#31572c] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-[#132a13] block">GPS Telemetry Check</span>
                <span className="text-[11px] text-gray-650 block mt-0.5 leading-relaxed font-medium">
                  Truck HR-38-Y-9204 has departed Delhi NH warehouse. In-transit temperature monitored at stable 24°C.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
