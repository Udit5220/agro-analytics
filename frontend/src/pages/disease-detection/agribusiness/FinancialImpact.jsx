import React, { useState } from "react";
import { 
  DollarSign, TrendingUp, ShieldCheck, AlertTriangle, 
  ArrowUpRight, BarChart2, Info, Percent, Settings 
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const REVENUE_AT_RISK_LIST = [
  { id: 1, group: "Ludhiana Wheat FPO", crop: "Wheat", riskVal: "₹42,50,000", treatedVal: "₹38,00,000", roi: "8.9x" },
  { id: 2, group: "Karnal Rice Progressive", crop: "Rice", riskVal: "₹18,50,000", treatedVal: "₹16,20,000", roi: "8.7x" },
  { id: 3, group: "Bathinda Cotton Coop", crop: "Cotton", riskVal: "₹12,40,000", treatedVal: "₹8,50,000", roi: "6.8x" },
  { id: 4, group: "Raman Potato Growers", crop: "Potato", riskVal: "₹8,20,000", treatedVal: "₹7,80,000", roi: "9.5x" }
];

export default function FinancialImpact() {
  const [yieldLossPct, setYieldLossPct] = useState(15); // Slider from 5% to 50%

  // Financial model variables based on the yield loss slider
  const totalContractValue = 85000000; // ₹8.5 Crore total contract sourcing portfolio
  const calculatedLoss = Math.round(totalContractValue * (yieldLossPct / 100));
  const estimatedCampaignSpend = Math.round(calculatedLoss * 0.12); // Spend is roughly 12% of risk values
  const estimatedSavings = Math.round(calculatedLoss * 0.88); // Net savings are 88%

  const formatCurrency = (val) => {
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif]">
      {/* Title Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-black text-[#132a13] tracking-tight">Executive Financial Impact & ROI</h1>
        <p className="text-slate-500 text-xs font-semibold mt-1">
          Review capital revenue at risk, track treatment campaigns ROI, and perform scenario planning.
        </p>
      </div>

      {/* Stats KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Revenue Exposure"
          value="₹81.6 Lacs"
          trend="At risk"
          trendType="danger"
          subtext="Total pathogen exposure value"
          icon={<AlertTriangle className="text-[#31572c]" />}
        />
        <StatsCard
          title="Revenue Protected"
          value="₹70.5 Lacs"
          trend="8.8x leverage"
          trendType="success"
          subtext="Value saved via interventions"
          icon={<ShieldCheck className="text-[#31572c]" />}
        />
        <StatsCard
          title="Campaign Cost"
          value="₹11.1 Lacs"
          trend="12.5% of risk"
          trendType="neutral"
          subtext="Chemicals, labor, and dispatch"
          icon={<DollarSign className="text-[#31572c]" />}
        />
        <StatsCard
          title="Financial ROI"
          value="785%"
          trend="Top tier ROI"
          trendType="success"
          subtext="Return on intervention spend"
          icon={<TrendingUp className="text-[#31572c]" />}
        />
      </div>

      {/* CFO Scenario Simulator */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-[#31572c]" /> CFO Sourcing Deficit Scenario Simulator
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Slider input */}
          <div className="lg:col-span-2 space-y-4 bg-slate-50 p-4.5 rounded-xl border border-slate-100/60">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-800">Simulated Outbreak Yield Loss %</span>
              <span className="text-lg font-black text-red-650">{yieldLossPct}%</span>
            </div>
            
            <input
              type="range"
              min="5"
              max="50"
              value={yieldLossPct}
              onChange={(e) => setYieldLossPct(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
            />
            
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
              <span>5% (Low Outbreaks)</span>
              <span>25% (Moderate Outbreaks)</span>
              <span>50% (Severe Crisis)</span>
            </div>
          </div>

          {/* Simulated Outcomes */}
          <div className="space-y-3.5 text-xs font-semibold text-slate-700 bg-slate-50 p-4.5 rounded-xl border border-slate-100/60">
            <div className="flex justify-between">
              <span>Simulated Gross Loss:</span>
              <span className="font-black text-red-650">{formatCurrency(calculatedLoss)}</span>
            </div>
            <div className="flex justify-between">
              <span>Required Spray Budget:</span>
              <span className="font-black text-slate-800">{formatCurrency(estimatedCampaignSpend)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-[#31572c]">
              <span className="font-bold">Net Revenue Protected:</span>
              <span className="font-black">{formatCurrency(estimatedSavings)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Sourcing Exposure & CFO Commentary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sourcing Revenue Exposure List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-[#31572c]" /> FPO Capital Risk & ROI Rankings
          </h3>
          <GenericTable
            columns={[
              { header: "Contract FPO / Coop", accessor: "group", className: "font-black text-slate-900" },
              { header: "Crop Type", accessor: "crop" },
              { header: "Capital Exposed", accessor: "riskVal" },
              { header: "Simulated Net Protected", accessor: "treatedVal", className: "text-[#31572c]" },
              { header: "Intervention ROI", accessor: "roi", className: "font-black text-slate-900" }
            ]}
            data={REVENUE_AT_RISK_LIST}
            showSearch={false}
          />
        </div>

        {/* CFO Brief */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-500" /> Executive Financial Commentary
            </h3>
            <p className="text-[10px] text-slate-605 font-bold leading-relaxed mt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100/50">
              Active campaigns in wheat and rice sectors show a consolidated ROI of 8.8x. Every ₹1,000 spent on preventative chemical spraying prevents roughly ₹8,800 in contract yield loss penalties. Sourcing deficits are fully modeled and remain within the 15% budget buffer tolerance levels.
            </p>
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-3.5 mt-2">
            <span>Corporate Finance Division</span>
            <span className="text-[#31572c] font-black">Stable Outlook</span>
          </div>
        </div>

      </div>
    </div>
  );
}
