import React from "react";
import { 
  TrendingUp, ShoppingCart, Award, Sparkles, 
  Map, Calendar, Package, ArrowUpRight, CheckCircle, Ship 
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const DEMAND_TREND = [
  { week: "Wk 1", fungicide: 120, pesticide: 90 },
  { week: "Wk 2", fungicide: 150, pesticide: 110 },
  { week: "Wk 3", fungicide: 240, pesticide: 140 },
  { week: "Wk 4", fungicide: 380, pesticide: 190 },
  { week: "Wk 5", fungicide: 520, pesticide: 230 },
  { week: "Wk 6", fungicide: 640, pesticide: 290 }
];

const PRODUCT_OPPORTUNITIES = [
  { id: 1, product: "Copper Oxychloride", category: "Fungicide", gap: "12.5 Tons Needed", urgency: "Critical", marketVal: "₹38,00,000" },
  { id: 2, product: "Hexaconazole 5% EC", category: "Fungicide", gap: "8.2 Tons Needed", urgency: "High", marketVal: "₹24,50,000" },
  { id: 3, product: "Imidacloprid 17.8% SL", category: "Insecticide", gap: "4.5 Tons Needed", urgency: "Moderate", marketVal: "₹18,20,000" },
  { id: 4, product: "Trichoderma Viride", category: "Bio-Control", gap: "3.0 Tons Needed", urgency: "Low", marketVal: "₹6,40,000" }
];

const INVENTORY_PLANNING = [
  { center: "Ludhiana FPO Sourcing", stockStatus: "Optimal", currentVal: "4.2 Tons", required: "4.5 Tons" },
  { center: "Kharindwa Spore Center", stockStatus: "Stock Deficit", currentVal: "1.5 Tons", required: "8.0 Tons" },
  { center: "Bhucho Depot Station", stockStatus: "Optimal", currentVal: "5.8 Tons", required: "6.0 Tons" }
];

export default function ProductDemand() {
  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Disease-Driven Input Demand</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Review projected treatment demands, check local input inventories, and identify sales opportunity pipelines.
        </p>
      </div>

      {/* Input Demand KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Fungicide Demand Est."
          value="24.8 Tons"
          trend="Hexaconazole focus"
          trendType="neutral"
          subtext="Projected spray requirements"
          icon={<ShoppingCart className="text-[#31572c]" />}
        />
        <StatsCard
          title="Bio-Control Demand"
          value="4.5 Tons"
          trend="Trichoderma Viride"
          trendType="success"
          subtext="Organic preventative demands"
          icon={<Sparkles className="text-[#31572c]" />}
        />
        <StatsCard
          title="Supply Shortfall Gap"
          value="9.8 Tons"
          trend="Kharindwa Block"
          trendType="danger"
          subtext="Local input depot deficits"
          icon={<Package className="text-[#31572c]" />}
        />
        <StatsCard
          title="Opportunity Pipeline"
          value="₹87.1 Lacs"
          trend="Target volume"
          trendType="success"
          subtext="Input manufacturer contracts"
          icon={<TrendingUp className="text-[#31572c]" />}
        />
      </div>

      {/* Demand Spikes & Inventory Plan Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Demand Trend Analytics (Recharts Area Chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#31572c]" /> 6-Week Treatment Demand Forecast Spike (Tons)
          </h3>
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMAND_TREND}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#31572c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#31572c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={8} fontWeight="bold" />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '10px' }} />
                <Area type="monotone" dataKey="fungicide" stroke="#31572c" strokeWidth={3} fillOpacity={1} fill="url(#demandGrad)" name="Fungicide Demand" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Input Inventory Planning Dashboard */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#31572c]" /> FPO Input Stock Levels
          </h3>
          <div className="space-y-3.5 text-xs text-slate-700 font-semibold pt-1">
            {INVENTORY_PLANNING.map((item, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{item.center}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    item.stockStatus.includes("Deficit") ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {item.stockStatus}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Current: {item.currentVal}</span>
                  <span>Required: {item.required}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Product Opportunities Engine */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#31572c]" /> Input Sales Opportunities Engine
        </h3>
        <GenericTable
          columns={[
            { header: "Chemical Compound", accessor: "product", className: "font-black text-slate-900" },
            { header: "Treatment Category", accessor: "category" },
            { header: "Sourcing Supply Gap", accessor: "gap" },
            { header: "Urgency Rating", accessor: "urgency", cell: (val) => (
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                val === "Critical" ? "bg-red-105 text-red-700" : val === "High" ? "bg-orange-105 text-orange-700" : "bg-emerald-105 text-emerald-700"
              }`}>{val}</span>
            )},
            { header: "Est. Sourcing Value", accessor: "marketVal", className: "font-black text-[#31572c]" }
          ]}
          data={PRODUCT_OPPORTUNITIES}
          showSearch={false}
        />
      </div>
    </div>
  );
}
