// PolicyImpactIntelligence.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { LineChart, BarChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import { TrendingUp, Activity, ShieldCheck, DollarSign, Compass, Award } from "lucide-react";
import { COLORS } from "./utils/constants";

import seededData from "../../../seed-json/seededData.json";

const BEFORE_AFTER_DATA = seededData.cropRecommendation1.government.policyBeforeAfterData;
const POLICY_ROI_DATABASE = seededData.cropRecommendation1.government.policyRoiDatabaseDetails;
const DISTRICT_OUTCOME_RANKINGS = seededData.cropRecommendation1.government.districtOutcomeRankings;

export default function PolicyImpactIntelligence() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Punjab") || selectedState.includes("Haryana")) return 1.2;
    return 0.85;
  }, [selectedState]);

  const kpis = [
    <StatsCard
      key="1"
      title="Yield Improvement"
      value={`+${(14.8 * zoneMultiplier).toFixed(1)}%`}
      trend="EXCELLENT"
      trendType="success"
      subtext="Average cereal output growth"
      icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
    />,
    <StatsCard
      key="2"
      title="Farmer Income Growth"
      value={`+${(22.4 * zoneMultiplier).toFixed(1)}%`}
      trend="INCOME CAGR UP"
      trendType="success"
      subtext="Realized value-addition gain"
      icon={<DollarSign className="w-6 h-6 text-[#31572c]" />}
    />,
    <StatsCard
      key="3"
      title="Volumetric Water Saved"
      value={`${(18.2 * zoneMultiplier).toFixed(1)}B Liters`}
      trend="AQUIFER PRESERVED"
      trendType="success"
      subtext="Cumulative groundwater savings"
      icon={<Activity className="w-6 h-6 text-[#3b82f6]" />}
    />,
    <StatsCard
      key="4"
      title="Carbon Offsets Index"
      value={`-${(12.4 * zoneMultiplier).toFixed(1)}%`}
      trend="EMISSIONS DROPPED"
      trendType="success"
      subtext="Nitrogen usage carbon deduction"
      icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
    />
  ];

  const chartData = POLICY_ROI_DATABASE.map((p) => ({
    name: p.policyName.substring(0, 15) + "...",
    "Budget (₹Cr)": p.investment,
    "Value Created (₹Cr)": p.valueCreated
  }));

  const tableDataForPdf = DISTRICT_OUTCOME_RANKINGS.map((d) => [d.rank, d.district, d.state, d.yieldGrowth, d.waterSaved, d.carbonOffset, `${d.score}/100`]);

  const aiSectionConfig = {
    title: "AI Policy ROI Analyst",
    buttonLabel: "Query Policy ROI Report",
    prompt: `Analyze agricultural policy outcomes and budget efficiencies for ${selectedState} (${selectedDistrict}). Detail budget investment vs value-creation indexes.`,
  };

  return (
    <GovernmentLayout
      pageName="Policy Impact Intelligence"
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Rank", "District", "State", "Yield Growth", "Water Saved", "Carbon Offset", "Score"]}
    >
      <div className="space-y-6">
        
        {/* Before vs After and ROI Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Before vs After Policy Indicators */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-[#31572c]" /> Before vs After Policy Comparison
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Comparison showing key telemetry index points before and after target policies were enforced.
            </p>
            <div className="space-y-3.5 pt-1">
              {BEFORE_AFTER_DATA.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs border-b pb-2 last:border-0 last:pb-0">
                  <div className="font-semibold text-gray-700">{item.indicator}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-bold">{item.before}</span>
                    <span className="text-gray-400 font-bold">→</span>
                    <span className="font-extrabold text-gray-900">{item.after}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      item.change.startsWith("+") ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
                    }`}>{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Policy ROI Dashboard Chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Policy ROI Evaluation (₹Cr)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Budget (₹Cr)" fill="#e07a5f" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Value Created (₹Cr)" fill="#31572c" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* District Impact Table */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black border-b pb-3 mb-4 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-[#31572c]" /> District Policy Effectiveness scorecards
          </h3>
          <GenericTable
            columns={[
              { header: "Rank", accessor: "rank", cell: (v) => <span className="font-black text-gray-800">#{v}</span> },
              { header: "District", accessor: "district", cellClassName: "font-black text-gray-900" },
              { header: "State", accessor: "state" },
              { header: "Yield Growth", accessor: "yieldGrowth", cellClassName: "text-emerald-700 font-bold" },
              { header: "Ground Water Saved", accessor: "waterSaved", cellClassName: "text-blue-700 font-bold" },
              { header: "Carbon Offset", accessor: "carbonOffset", cellClassName: "text-gray-700 font-semibold" },
              { 
                header: "Impact Rating Score", 
                accessor: "score", 
                cell: (v) => (
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-dark h-full" style={{ width: `${v}%` }}></div>
                    </div>
                    <span className="font-bold">{v}/100</span>
                  </div>
                )
              }
            ]}
            data={DISTRICT_OUTCOME_RANKINGS}
            showSearch={false}
            itemsPerPage={5}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
