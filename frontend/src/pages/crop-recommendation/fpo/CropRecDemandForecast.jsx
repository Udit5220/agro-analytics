// CropRecDemandForecast.jsx
import React, { useState, useMemo } from "react";
import {
  Sprout,
  FlaskConical,
  Droplet,
  Warehouse,
  AlertTriangle,
  IndianRupee,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Loader2,
  Calendar,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";

// Mock demand forecast timeline datasets
const TIMELINE_DATA = {
  "30D": [
    { name: "Wk 1", seeds: 1200, fertilizer: 45, pesticide: 180, stock: 24, min: 20, spend: 8 },
    { name: "Wk 2", seeds: 1400, fertilizer: 52, pesticide: 210, stock: 28, min: 20, spend: 12 },
    { name: "Wk 3", seeds: 1560, fertilizer: 61, pesticide: 234, stock: 18, min: 20, spend: 10 },
    { name: "Wk 4", seeds: 1720, fertilizer: 68, pesticide: 260, stock: 15, min: 20, spend: 14 },
  ],
  "60D": [
    { name: "Wk 1", seeds: 1200, fertilizer: 45, pesticide: 180, stock: 24, min: 20, spend: 8 },
    { name: "Wk 2", seeds: 1350, fertilizer: 50, pesticide: 200, stock: 28, min: 20, spend: 10 },
    { name: "Wk 3", seeds: 1500, fertilizer: 58, pesticide: 220, stock: 22, min: 20, spend: 9 },
    { name: "Wk 4", seeds: 1650, fertilizer: 64, pesticide: 240, stock: 19, min: 20, spend: 12 },
    { name: "Wk 5", seeds: 1800, fertilizer: 72, pesticide: 265, stock: 16, min: 20, spend: 11 },
    { name: "Wk 6", seeds: 1920, fertilizer: 78, pesticide: 280, stock: 14, min: 20, spend: 15 },
    { name: "Wk 7", seeds: 2100, fertilizer: 85, pesticide: 300, stock: 12, min: 20, spend: 13 },
    { name: "Wk 8", seeds: 2340, fertilizer: 92, pesticide: 320, stock: 25, min: 20, spend: 18 },
  ],
  "90D": [
    { name: "Month 1", seeds: 1500, fertilizer: 58, pesticide: 210, stock: 24, min: 20, spend: 18 },
    { name: "Month 2", seeds: 2400, fertilizer: 94, pesticide: 340, stock: 14, min: 20, spend: 28 },
    { name: "Month 3", seeds: 4280, fertilizer: 186, pesticide: 520, stock: 29, min: 20, spend: 34 },
  ],
  "180D": [
    { name: "Month 1", seeds: 1500, fertilizer: 58, pesticide: 210, stock: 24, min: 20, spend: 18 },
    { name: "Month 2", seeds: 2400, fertilizer: 94, pesticide: 340, stock: 14, min: 20, spend: 28 },
    { name: "Month 3", seeds: 4280, fertilizer: 186, pesticide: 520, stock: 29, min: 20, spend: 34 },
    { name: "Month 4", seeds: 3100, fertilizer: 140, pesticide: 410, stock: 22, min: 20, spend: 20 },
    { name: "Month 5", seeds: 2100, fertilizer: 98, pesticide: 290, stock: 18, min: 20, spend: 15 },
    { name: "Month 6", seeds: 1600, fertilizer: 74, pesticide: 200, stock: 26, min: 20, spend: 12 },
  ],
};

const SEED_DATA = [
  { crop: "Wheat", area: 420, rate: 12, req: 5040, stock: 4800, gap: -240 },
  { crop: "Rice", area: 380, rate: 8, req: 3040, stock: 3200, gap: 160 },
  { crop: "Mustard", area: 210, rate: 5, req: 1050, stock: 900, gap: -150 },
  { crop: "Chickpea", area: 180, rate: 18, req: 3240, stock: 3500, gap: 260 },
  { crop: "Soybean", area: 160, rate: 25, req: 4000, stock: 3600, gap: -400 },
  { crop: "Maize", area: 140, rate: 20, req: 2800, stock: 3000, gap: 200 },
];

const PESTICIDE_DATA = [
  { name: "Chlorpyrifos", forecast: 480, inventory: 350, deficit: -130, cost: 52000 },
  { name: "Mancozeb", forecast: 320, inventory: 400, deficit: 80, cost: 28800 },
  { name: "Imidacloprid", forecast: 260, inventory: 180, deficit: -80, cost: 44200 },
  { name: "Cypermethrin", forecast: 380, inventory: 420, deficit: 40, cost: 30400 },
  { name: "Carbendazim", forecast: 210, inventory: 160, deficit: -50, cost: 18900 },
  { name: "Thiamethoxam", forecast: 290, inventory: 310, deficit: 20, cost: 46400 },
  { name: "Profenophos", forecast: 180, inventory: 120, deficit: -60, cost: 32400 },
  { name: "Hexaconazole", forecast: 140, inventory: 160, deficit: 20, cost: 22450 },
];

const WATER_CHART_DATA = [
  { month: "Jan", demand: 1200, avail: 1800 },
  { month: "Feb", demand: 1400, avail: 1600 },
  { month: "Mar", demand: 2800, avail: 1500 },
  { month: "Apr", demand: 3200, avail: 1200 },
  { month: "May", demand: 3600, avail: 900 },
  { month: "Jun", demand: 2400, avail: 2800 },
  { month: "Jul", demand: 1800, avail: 3600 },
  { month: "Aug", demand: 1500, avail: 3900 },
  { month: "Sep", demand: 2100, avail: 3100 },
  { month: "Oct", demand: 2600, avail: 1900 },
  { month: "Nov", demand: 1900, avail: 1400 },
  { month: "Dec", demand: 1300, avail: 1700 },
];

const OPPORTUNITY_CARDS = [
  { title: "Soybean Seed Bulk Deal", desc: "Save ₹24,000", badge: "12% Discount", color: "emerald" },
  { title: "Nitrogen Fertilizer Contract", desc: "Save ₹42,000", badge: "8% Discount", color: "amber" },
  { title: "Combined Order Bundle", desc: "Save ₹18,400 extra", badge: "Extra Saving", color: "sky" },
];

const PROCUREMENT_TABLE = [
  { name: "Nitrogen Fertilizer", qty: "14 MT", date: "15-Jul", supplier: "AgroMart", discount: "8%", savings: 42000, status: "READY" },
  { name: "Soybean Seed", qty: "400 kg", date: "01-Jul", supplier: "SeedCo", discount: "12%", savings: 24000, status: "READY" },
  { name: "Chlorpyrifos", qty: "130 L", date: "10-Jul", supplier: "ChemCorp", discount: "6%", savings: 12000, status: "PARTIAL" },
  { name: "Mustard Seed", qty: "150 kg", date: "05-Jul", supplier: "LocalFarm", discount: "5%", savings: 7500, status: "PARTIAL" },
  { name: "Imidacloprid", qty: "80 L", date: "12-Jul", supplier: "AgriChem", discount: "7%", savings: 8400, status: "NOT READY" },
  { name: "Wheat Seed", qty: "240 kg", date: "20-Jul", supplier: "SeedCo", discount: "10%", savings: 18000, status: "READY" },
];

export default function CropRecDemandForecast() {
  const [timelinePeriod, setTimelinePeriod] = useState("90D");
  const [aiReport, setAiReport] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const activeTimeline = useMemo(() => TIMELINE_DATA[timelinePeriod], [timelinePeriod]);

  const totalPesticideCost = useMemo(() => PESTICIDE_DATA.reduce((sum, item) => sum + item.cost, 0), []);
  const totalPesticideDeficit = useMemo(() => PESTICIDE_DATA.reduce((sum, item) => sum + (item.deficit < 0 ? item.deficit : 0), 0), []);

  const queryAiInsights = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiReport(`### **AI DEMAND INTEGRATION INTELLIGENCE**

1. **Inventory Risks**: Critical inventory shortages detected in Soybean seeds (400kg deficit) and Nitrogen fertilizer (14 MT gap) which could delay Kharif sowing by 10-14 days. Immediate bulk procurement is required.

2. **Supply Chain Risks**: ChemCorp and AgriChem suppliers are marked as PARTIAL and NOT READY respectively, jeopardizing timely delivery of Chlorpyrifos and Imidacloprid. Re-route emergency logistics to AgroMart.

3. **Procurement Opportunities**: Consolidating the seed and fertilizer purchases with SeedCo and AgroMart yields an additional bulk discount of 10-12%, generating ₹84,400 in direct savings.

4. **Cost Optimization**: Standardizing NPK blends and purchasing raw chemicals directly reduces FPO procurement costs by 18.5%.

5. **Inventory Recommendations**: Establish safety reorder stock levels at 20% of peak seasonal demand for nitrogen fertilizer and 15% for soybean seeds.`);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sprout className="h-6 w-6 text-[#31572c]" />
          <span>Input Demand Forecast Console</span>
          <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
            | DEMAND ENGINE
          </span>
        </h1>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Monitor volumetric FPO seed demand · NPK balances · Chemical requirements
        </p>
      </div>

      {/* SECTION 1 - INPUT KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {[
          { title: "Seed Demand", val: "4,280 kg", trend: "+8.4%", type: "success", icon: <Sprout size={16} /> },
          { title: "Fertilizer Demand", val: "186 MT", trend: "+6.2%", type: "warning", icon: <FlaskConical size={16} /> },
          { title: "Pesticide Demand", val: "2,340 L", trend: "+4.1%", type: "warning", icon: <FlaskConical size={16} /> },
          { title: "Water Demand", val: "18,400 ML", trend: "HIGH DEMAND", type: "warning", icon: <Droplet size={16} /> },
          { title: "Current Inventory", val: "₹28.4L", trend: "MODERATE", type: "info", icon: <Warehouse size={16} /> },
          { title: "Inventory Gap", val: "₹6.2L", trend: "DEFICIT", type: "danger", icon: <AlertTriangle size={16} /> },
          { title: "Procurement Cost", val: "₹34.6L", trend: "Saving Active", type: "warning", icon: <IndianRupee size={16} /> },
          { title: "Readiness Score", val: "68%", trend: "MODERATE", type: "warning", icon: <CheckCircle size={16} />, progress: 68 },
        ].map((c, i) => (
          <div key={i} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{c.title}</span>
              <div className="text-lg font-black mt-1 text-gray-900">{c.val}</div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              {c.progress !== undefined ? (
                <div className="w-full">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${c.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  c.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" :
                  c.type === "danger" ? "bg-red-50 text-red-700 border border-red-100" :
                  c.type === "warning" ? "bg-amber-50 text-amber-900 border border-amber-200" : "bg-blue-5 text-blue-800 border border-blue-100"
                }`}>{c.trend}</span>
              )}
              <span className="text-[#31572c]/40">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2 - INPUT FORECAST TIMELINE */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-sm font-black text-gray-900">Input Demand Forecast Timeline</h2>
          <div className="flex gap-1.5">
            {["30D", "60D", "90D", "180D"].map((d) => (
              <button
                key={d}
                onClick={() => setTimelinePeriod(d)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  timelinePeriod === d ? "bg-[#31572c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1 */}
          <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Input Demand Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", color: "#1e293b" }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="seeds" name="Seeds (kg)" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="fertilizer" name="Fertilizer (MT)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pesticide" name="Pesticide (L)" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Inventory Level Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", color: "#1e293b" }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Line type="monotone" dataKey="stock" name="Current Stock" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="min" name="Minimum Min" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3 */}
          <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl space-y-2">
            <h3 className="text-xs font-bold text-gray-700">Procurement Value Trend (₹L)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", color: "#1e293b" }} />
                  <Bar dataKey="spend" name="Spend (₹L)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3 - SEED DEMAND ANALYSIS TABLE */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Seed Demand Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Area (ha)</th>
                <th className="py-2.5 px-3">Seed Rate (kg/ha)</th>
                <th className="py-2.5 px-3">Required (kg)</th>
                <th className="py-2.5 px-3">Stock (kg)</th>
                <th className="py-2.5 px-3">Gap (kg)</th>
              </tr>
            </thead>
            <tbody>
              {SEED_DATA.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{row.crop}</td>
                  <td className="py-3 px-3 font-mono">{row.area}</td>
                  <td className="py-3 px-3 font-mono">{row.rate}</td>
                  <td className="py-3 px-3 font-mono">{row.req.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono">{row.stock.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-black ${
                      row.gap < 0 ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                    }`}>
                      {row.gap > 0 ? `+${row.gap}` : row.gap} {row.gap < 0 && "DEFICIT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 - FERTILIZER ANALYSIS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Fertilizer NPK Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card N */}
          <div className="border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.08)] rounded-2xl p-4 bg-gray-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">Nitrogen (N)</span>
              <div className="text-2xl font-extrabold text-gray-900">82 MT</div>
              <div className="text-xs font-bold text-red-600">Stock: 68 MT | Gap: -14 MT</div>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r="22" stroke="#ef4444" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - 0.83)} />
              </svg>
              <span className="absolute text-[10px] font-black text-red-600">83%</span>
            </div>
          </div>

          {/* Card P */}
          <div className="border border-emerald-500/30 rounded-2xl p-4 bg-gray-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Phosphorus (P)</span>
              <div className="text-2xl font-extrabold text-gray-900">54 MT</div>
              <div className="text-xs font-bold text-emerald-600">Stock: 61 MT | Gap: +7 MT</div>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r="22" stroke="#10b981" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={0} />
              </svg>
              <span className="absolute text-[10px] font-black text-emerald-600">113%</span>
            </div>
          </div>

          {/* Card K */}
          <div className="border border-amber-500/30 rounded-2xl p-4 bg-gray-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Potassium (K)</span>
              <div className="text-2xl font-extrabold text-gray-900">50 MT</div>
              <div className="text-xs font-bold text-amber-600">Stock: 47 MT | Gap: -3 MT</div>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r="22" stroke="#f59e0b" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - 0.94)} />
              </svg>
              <span className="absolute text-[10px] font-black text-amber-600">94%</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl">
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Nitrogen (N)", Required: 82, Available: 68 },
                { name: "Phosphorus (P)", Required: 54, Available: 61 },
                { name: "Potassium (K)", Required: 50, Available: 47 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} label={{ value: 'MT Volume', angle: -90, position: 'insideLeft' }} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Required" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Available" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 5 - PESTICIDE REQUIREMENT TABLE */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Pesticide & Chemical Requirement</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th className="py-2.5 px-3">Chemical</th>
                <th className="py-2.5 px-3">Forecast (L)</th>
                <th className="py-2.5 px-3">Inventory (L)</th>
                <th className="py-2.5 px-3">Deficit (L)</th>
                <th className="py-2.5 px-3">Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {PESTICIDE_DATA.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{row.name}</td>
                  <td className="py-3 px-3 font-mono">{row.forecast}</td>
                  <td className="py-3 px-3 font-mono">{row.inventory}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-black ${
                      row.deficit < 0 ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                    }`}>
                      {row.deficit > 0 ? `+${row.deficit}` : row.deficit}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-700">₹{row.cost.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-gray-50/50 font-bold border-t-2 border-gray-200">
                <td className="py-3.5 px-3 text-gray-900 uppercase text-xs">Total Requirement</td>
                <td className="py-3.5 px-3 font-mono">1,980 L</td>
                <td className="py-3.5 px-3 font-mono">1,820 L</td>
                <td className="py-3.5 px-3 text-red-600 font-mono font-black">{totalPesticideDeficit} L</td>
                <td className="py-3.5 px-3 text-[#31572c] font-mono font-black">₹{totalPesticideCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6 - WATER DEMAND ANALYSIS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Water Demand Analysis</h2>
        <div className="h-64 bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WATER_CHART_DATA}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
              <YAxis stroke="#64748b" fontSize={9} />
              <RechartsTooltip />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Area type="monotone" dataKey="demand" name="Water Demand (ML)" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorDemand)" />
              <Area type="monotone" dataKey="avail" name="Water Availability (ML)" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAvail)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-gray-200/60 p-4 rounded-xl bg-gray-50/50">
            <span className="text-[10px] font-bold text-gray-500 block uppercase">Water Stress Index</span>
            <div className="text-lg font-black mt-1 text-gray-900">71/100</div>
            <div className="w-full mt-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "71%" }}></div>
            </div>
            <span className="text-[9px] text-amber-700 font-bold block mt-1.5 uppercase">HIGH VULNERABILITY</span>
          </div>

          <div className="border border-gray-200/60 p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Deficit Volume</span>
              <div className="text-lg font-black mt-1 text-red-600 font-mono">2,840 ML</div>
            </div>
            <span className="text-[9px] font-black text-red-600 mt-2 uppercase flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Deficit Alert</span>
            </span>
          </div>

          <div className="border border-gray-200/60 p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Groundwater Dependency</span>
              <div className="text-lg font-black mt-1 text-amber-600 font-mono">68%</div>
            </div>
            <span className="text-[9px] font-black text-amber-600 mt-2 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Critical Exploitation</span>
            </span>
          </div>

          <div className="border border-gray-200/60 p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Surface Water Available</span>
              <div className="text-lg font-black mt-1 text-sky-600 font-mono">5,920 ML</div>
            </div>
            <span className="text-[9px] font-black text-sky-650 mt-2 uppercase flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Safe Surface Cap</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 7 - PROCUREMENT PLANNING */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Procurement Planning & Schedule</h2>

        {/* Gantt Timeline */}
        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-200/60 space-y-4">
          <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span>Kharif Inputs Timeline</span>
            <div className="flex gap-4">
              <span>Jul 1-10</span>
              <span>Jul 11-20</span>
              <span>Jul 21-30</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Nitrogen Fertilizer", color: "bg-red-500", width: "w-5/12", left: "ml-4/12", badge: "Jul 10-15 (Critical)" },
              { label: "Soybean Seed", color: "bg-orange-500", width: "w-2/12", left: "ml-0", badge: "Jul 1-5 (Urgent)" },
              { label: "Chlorpyrifos", color: "bg-amber-500", width: "w-3/12", left: "ml-3/12", badge: "Jul 8-12" },
              { label: "Mustard Seed", color: "bg-emerald-500", width: "w-2/12", left: "ml-1/12", badge: "Jul 3-8" },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-[130px_1fr] items-center gap-4 text-[10px] font-bold">
                <span className="text-gray-800">{row.label}</span>
                <div className="h-6 w-full bg-gray-100 rounded-lg relative overflow-hidden flex items-center pl-2 border border-gray-200/40">
                  <div className={`h-full ${row.color} rounded absolute opacity-85 flex items-center justify-center text-[8px] text-white px-2 font-black ${row.width} ${row.left}`}>
                    {row.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th className="py-2.5 px-3">Input</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-3">Discount</th>
                <th className="py-2.5 px-3">Savings</th>
                <th className="py-2.5 px-3">Supplier Status</th>
              </tr>
            </thead>
            <tbody>
              {PROCUREMENT_TABLE.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 transition">
                  <td className="py-3 px-3 font-bold text-gray-900">{row.name}</td>
                  <td className="py-3 px-3 font-mono">{row.qty}</td>
                  <td className="py-3 px-3 font-bold text-amber-600">{row.date}</td>
                  <td className="py-3 px-3 font-semibold">{row.supplier}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 font-bold">{row.discount}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600">₹{row.savings.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      row.status === "READY" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      row.status === "PARTIAL" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-red-50 text-red-700 border border-red-100"
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {OPPORTUNITY_CARDS.map((item, idx) => (
            <div key={idx} className="border border-gray-200/60 p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between min-h-[90px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-extrabold text-gray-900">{item.title}</span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-black border border-emerald-100">{item.badge}</span>
              </div>
              <div className="text-xs text-[#31572c] font-black mt-2">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 8 - AI PROCUREMENT INSIGHTS */}
      <div className="bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#31572c] to-[#4f772d] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">AI Procurement Intelligence</h2>
          </div>
          <button
            onClick={queryAiInsights}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-gray-900 hover:bg-gray-950 text-white rounded-xl border border-white/20 transition disabled:opacity-50 text-xs font-black"
          >
            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            <span>Generate Procurement Insights</span>
          </button>
        </div>

        {aiLoading && (
          <div className="p-12 text-center bg-white/40">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#31572c] mb-2" />
            <p className="text-xs font-bold text-gray-700">Consulting AI Policy Advisor...</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Analyzing seed, chemical, and NPK deficit profiles</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="p-6 bg-white/50 space-y-4">
            {aiReport.split("\n\n").filter(Boolean).map((para, idx) => {
              const cleaned = para.replace(/[#*]/g, "").trim();
              const isHeading = para.startsWith("#") || (para.startsWith("**") && para.endsWith("**"));

              if (isHeading) {
                return (
                  <h4 key={idx} className="text-xs font-black text-[#31572c] uppercase tracking-wider mt-4 first:mt-0">
                    {cleaned}
                  </h4>
                );
              }

              let borderColor = "border-l-emerald-500";
              if (cleaned.startsWith("1")) borderColor = "border-l-red-500";
              else if (cleaned.startsWith("2")) borderColor = "border-l-orange-500";
              else if (cleaned.startsWith("3")) borderColor = "border-l-emerald-500";
              else if (cleaned.startsWith("4")) borderColor = "border-l-amber-500";
              else if (cleaned.startsWith("5")) borderColor = "border-l-blue-500";

              return (
                <div key={idx} className={`pl-3.5 border-l-4 ${borderColor} py-1.5 text-xs font-semibold leading-relaxed text-gray-700`}>
                  {cleaned}
                </div>
              );
            })}
          </div>
        )}

        {!aiReport && !aiLoading && (
          <div className="p-12 text-center text-gray-500 bg-white/20">
            <Sparkles className="w-6 h-6 text-[#31572c] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-gray-700">Click "Generate Insights" to run AI recommendations</p>
          </div>
        )}
      </div>

    </div>
  );
}
