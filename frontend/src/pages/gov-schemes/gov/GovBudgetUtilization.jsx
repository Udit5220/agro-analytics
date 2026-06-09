import React, { useState } from "react";
import { 
  CircleDollarSign, 
  TrendingUp, 
  AlertCircle, 
  Sliders, 
  Sparkles, 
  ArrowUpRight, 
  Calculator,
  Search
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

export default function GovBudgetUtilization() {
  const [forecastMonths, setForecastMonths] = useState(6); // 3, 6, 9, 12 months forecast
  const [searchTerm, setSearchTerm] = useState("");

  const budgetSummary = {
    allocated: "₹245.5 Cr",
    released: "₹220.0 Cr",
    utilized: "₹185.4 Cr",
    remaining: "₹60.1 Cr",
    rate: "75.5%"
  };

  const categoryData = [
    { name: "Infrastructure", allocated: 95, utilized: 72 },
    { name: "Insurance Support", allocated: 60, utilized: 54 },
    { name: "Credit/Loans", allocated: 50, utilized: 38 },
    { name: "Technology", allocated: 25, utilized: 14 },
    { name: "Capacity Building", allocated: 15, utilized: 7.4 }
  ];

  const geographyData = [
    { district: "Sonipat", allocated: 75, utilized: 72.8, pct: 97, risk: "Low" },
    { district: "Karnal", allocated: 95, utilized: 94.5, pct: 99, risk: "Low" },
    { district: "Rohtak", allocated: 55, utilized: 48.2, pct: 87, risk: "Medium" },
    { district: "Jhajjar", allocated: 40, utilized: 31.5, pct: 78, risk: "Medium" },
    { district: "Panipat", allocated: 35, utilized: 18.9, pct: 54, risk: "High" }
  ];

  const columns = [
    { header: "DISTRICT", accessor: "district", sortable: true, cell: (v) => <span className="font-bold text-gray-800">{v}</span> },
    { header: "ALLOCATED POOL", accessor: "allocated", sortable: true, cell: (v) => `₹${v} Cr` },
    { header: "UTILIZED POOL", accessor: "utilized", sortable: true, cell: (v) => `₹${v} Cr` },
    { header: "UTILIZATION RATE", accessor: "pct", sortable: true, cell: (v) => (
      <div className="flex items-center gap-2">
        <span className="font-black text-[#132a13]">{v}%</span>
        <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${v >= 80 ? "bg-[#4f772d]" : v >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${v}%` }} />
        </div>
      </div>
    )},
    { header: "EXPENDITURE RISK", accessor: "risk", sortable: true, cell: (v) => (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
        v === "Low" ? "bg-emerald-50 text-emerald-700" : v === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-650"
      }`}>{v} Risk</span>
    )}
  ];

  const riskAlerts = [
    { title: "Panipat Sub-plan Delay", desc: "₹16.1 Cr remain unspent in Panipat micro-irrigation accounts. Capital deployment index is 54%.", type: "danger" },
    { title: "Slow-moving Capacity Funds", desc: "State level farmer training allocations show only 49% utilization with only 3 months left in fiscal cycle.", type: "warning" },
    { title: "Disbursement Lag", desc: "PMFBY seasonal claim clearance shows average 15 days delay in 4 central cooperative banks.", type: "warning" }
  ];

  const filteredGeoData = geographyData.filter(g => 
    g.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Forecast calculations
  const baselineRate = 18.5; // Cr per month
  const projectedSpend = (baselineRate * forecastMonths).toFixed(1);
  const projectedShortfall = (Number(projectedSpend) > 60.1) 
    ? (Number(projectedSpend) - 60.1).toFixed(1) 
    : "0.0";
  const statusFlag = Number(projectedShortfall) > 0 ? "Shortfall Warning" : "Optimal Utilization";

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <CircleDollarSign className="w-5 h-5 text-[#4f772d]" />
          Budget Utilization & Financial Intelligence
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Track public expenditures, verify geographic allocation pools, identify capital blockages, and model fiscal runway.
        </p>
      </div>

      {/* Financial summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Allocated Budget" value={budgetSummary.allocated} subtext="Total state sanction pool" icon={<CircleDollarSign className="text-[#4f772d]" />} />
        <StatsCard title="Released Pool" value={budgetSummary.released} subtext="Expedited to district offices" />
        <StatsCard title="Utilized Pool" value={budgetSummary.utilized} trend={budgetSummary.rate} trendType="success" subtext="Direct benefit transfers & asset builds" />
        <StatsCard title="Unspent Balance" value={budgetSummary.remaining} subtext="Remaining fiscal balance" />
        <StatsCard title="Runway Remaining" value="3.2 Months" subtext="Calculated from baseline speed" />
      </div>

      {/* Charts & Risk Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Category breakdown bar chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3">Utilization by Program Category (₹ Cr)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: "bold" }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip formatter={(value) => `₹${value} Cr`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="allocated" name="Allocated Pool" fill="#90a955" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilized" name="Utilized Pool" fill="#132a13" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Risk Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#4f772d]" /> Financial Risk alerts
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Telemetry monitoring indicating delayed capital disbursement, slow audits, or low utilization rates.
            </p>
            <div className="space-y-3">
              {riskAlerts.map((alert, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border space-y-1 ${
                    alert.type === "danger" ? "bg-red-50/50 border-red-100 text-red-950" : "bg-amber-50/50 border-amber-100 text-amber-950"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{alert.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.25 rounded-md ${
                      alert.type === "danger" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>Warning</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-normal font-semibold">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Forecasting slider tool & Geography Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expenditure forecasting calculator */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#4f772d]" /> Fiscal Runway Forecaster
            </h3>
            <p className="text-[10px] text-gray-400 mb-4">
              Select future forecast duration to estimate cumulative expenditures and budget shortfalls.
            </p>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Forecast Months</span>
                  <span className="text-[#4f772d]">{forecastMonths} Months</span>
                </div>
                <input 
                  type="range" min="3" max="12" step="3"
                  value={forecastMonths} 
                  onChange={(e) => setForecastMonths(Number(e.target.value))}
                  className="w-full accent-[#4f772d] cursor-pointer"
                />
              </div>

              <div className="bg-gray-50 border border-gray-150 p-3.5 rounded-xl space-y-2 text-[11px]">
                <div className="flex justify-between text-gray-500">
                  <span>Forecast Period:</span>
                  <span className="font-bold text-gray-800">{forecastMonths} Months</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Projected Expenditure:</span>
                  <span className="font-bold text-[#132a13]">₹{projectedSpend} Cr</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Unspent Balance:</span>
                  <span className="font-bold text-gray-800">₹{budgetSummary.remaining}</span>
                </div>
                <div className="border-t border-gray-200/50 pt-2 flex justify-between font-bold text-gray-700">
                  <span>Projected Shortfall:</span>
                  <span className={Number(projectedShortfall) > 0 ? "text-red-600" : "text-emerald-700"}>
                    {Number(projectedShortfall) > 0 ? `₹${projectedShortfall} Cr` : "None"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 text-amber-900 rounded-xl p-3 text-[10px] leading-relaxed mt-4">
            <span className="font-bold">Fiscal Advice:</span> {
              Number(projectedShortfall) > 0 
                ? "Disbursements exceed balance reserves. Seek additional central scheme allocations."
                : "Remaining balance reserves sufficient for projected period. Maintain current speed."
            }
          </div>
        </div>

        {/* District utilization table */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h3 className="font-bold text-[#132a13] text-sm">Geographical Utilization Table</h3>
            <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 px-3 py-1.5 rounded-xl w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search districts..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-xs focus:outline-none w-full"
              />
            </div>
          </div>

          <GenericTable 
            columns={columns}
            data={filteredGeoData}
            itemsPerPage={5}
            showSearch={false}
            showSort={true}
            emptyMessage="No districts found matching filters."
          />
        </div>
      </div>
    </div>
  );
}
