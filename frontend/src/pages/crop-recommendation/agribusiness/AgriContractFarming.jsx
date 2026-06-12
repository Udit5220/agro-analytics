import React from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";
import {
  Users,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  FileCheck
} from "lucide-react";

const PERFORMANCE_DATA = [
  { id: 1, group: "Ludhiana Wheat FPO", crop: "Wheat", rec: "WH-1105 seeds", status: "Adopted", yield: "4.8 T/Ha", risk: "Low" },
  { id: 2, group: "Bathinda Cotton Coop", crop: "Cotton", rec: "Bt Cotton hybrid", status: "In Progress", yield: "3.2 T/Ha", risk: "Medium" },
  { id: 3, group: "Karnal Rice Progressive", crop: "Rice", rec: "Pusa-1509 rice", status: "Adopted", yield: "5.4 T/Ha", risk: "Low" },
  { id: 4, group: "Indore Gram Union", crop: "Pulses", rec: "JG-14 Chickpea", status: "Pending", yield: "2.1 T/Ha", risk: "High" },
  { id: 5, group: "Nagpur Orange Growers", crop: "Pulses", rec: "Organic pigeon pea", status: "Adopted", yield: "2.4 T/Ha", risk: "Medium" },
  { id: 6, group: "Nuh Mustard Cluster", crop: "Mustard", rec: "RH-749 Mustard", status: "Adopted", yield: "2.8 T/Ha", risk: "Low" }
];

const READINESS_FACTORS = [
  { factor: "Weather Forecast Match", score: 88, status: "Optimal" },
  { factor: "Soil Health Compatibility", score: 94, status: "Excellent" },
  { factor: "Historic Yield Performance", score: 82, status: "High" },
  { factor: "Water Availability Index", score: 68, status: "Moderate" },
  { factor: "FPO Adoption Commitment", score: 91, status: "Excellent" }
];

const RISK_ENGINE = [
  { type: "Climate Risk", rating: "Moderate", score: 45, color: "text-amber-500 bg-amber-50 border-amber-100" },
  { type: "Pest & Disease Risk", rating: "Low", score: 28, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { type: "Yield Variance Risk", rating: "Low", score: 22, color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { type: "Sourcing Supply Risk", rating: "High", score: 74, color: "text-red-700 bg-red-50 border-red-100" }
];

export default function AgriContractFarming() {
  const aiSectionConfig = {
    title: "AI Contract Advisor",
    buttonLabel: "Evaluate Contract Terms",
    prompt: "Given 94% compliance in wheat but higher risks in cotton and pulses, suggest clause adjustments for pricing, quality specifications, and input subsidy provisions."
  };

  return (
    <AgribusinessLayout
      pageName="Contract Farming Recommendation Intelligence"
      aiSection={aiSectionConfig}
      tableDataForPdf={PERFORMANCE_DATA.map((row) => [row.group, row.crop, row.rec, row.status, row.yield, row.risk])}
      pdfHeaders={["Farmer Group", "Crop", "Recommendation", "Adoption Status", "Expected Yield", "Risk"]}
    >
      <div className="space-y-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Contract Farmers"
            value="18,400"
            trend="+12%"
            trendType="success"
            subtext="Signed grower network"
            icon={<Users className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Recommended Contracts"
            value="2,500"
            trend="+8.5%"
            trendType="success"
            subtext="Newly issued agreements"
            icon={<Briefcase className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Adoption Rate"
            value="82%"
            trend="HIGH"
            trendType="success"
            subtext="Contract compliance"
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Forecast Yield"
            value="4.2 T/Ha"
            trend="+5.4%"
            trendType="success"
            subtext="Est. average output"
            icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Contract Compliance"
            value="94%"
            trend="OPTIMAL"
            trendType="success"
            subtext="Deliveries on track"
            icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
          />
        </div>

        {/* Tables and Readiness details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Table */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">
              Contract Performance Table
            </h3>
            <GenericTable
              columns={[
                { header: "Farmer Group", accessor: "group", className: "font-black" },
                { header: "Crop", accessor: "crop" },
                { header: "Recommendation", accessor: "rec" },
                {
                  header: "Adoption Status",
                  accessor: "status",
                  cell: (v) => (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      v === "Adopted" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : v === "In Progress" ? "bg-blue-50 text-blue-750 border border-blue-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>{v}</span>
                  )
                },
                { header: "Expected Yield", accessor: "yield" },
                {
                  header: "Risk",
                  accessor: "risk",
                  cell: (v) => (
                    <span className={`font-bold ${v === "Low" ? "text-emerald-700" : v === "Medium" ? "text-amber-600" : "text-red-650"}`}>
                      {v}
                    </span>
                  )
                }
              ]}
              data={PERFORMANCE_DATA}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>

          {/* Contract Readiness score card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#31572c]" /> Contract Readiness Score
              </h3>
              <div className="flex flex-col items-center py-4 border-b border-gray-100">
                <span className="text-5xl font-black text-[#31572c]">85</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-1">Ready status</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1">Impact Factors</span>
              {READINESS_FACTORS.map((item, idx) => (
                <div key={idx} className="text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>{item.factor}</span>
                    <span className="text-gray-900">{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-brand-dark h-full" style={{ width: `${item.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contract Risk Engine */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Contract Risk Engine
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RISK_ENGINE.map((risk, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between h-28 ${risk.color}`}>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider block">{risk.type}</span>
                  <span className="text-2xl font-black block mt-1">{risk.rating}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold mt-2">
                  <span>Risk Index Score</span>
                  <span>{risk.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AgribusinessLayout>
  );
}
