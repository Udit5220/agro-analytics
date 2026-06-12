// SubsidySchemeIntelligence.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Coins, Users, CreditCard, ShieldCheck, Landmark, Compass, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";
import { COLORS } from "./utils/constants";
import seededData from "../../../seed-json/seededData.json";

const AUDIT_DATABASE = seededData.cropRecommendation1.government.subsidyAuditDatabase;
const chartData = seededData.cropRecommendation1.government.subsidyChartData;

export default function SubsidySchemeIntelligence() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Uttar Pradesh") || selectedState.includes("Bihar")) return 1.25;
    if (selectedState.includes("Punjab") || selectedState.includes("Haryana")) return 1.1;
    return 0.8;
  }, [selectedState]);

  const kpis = [
    <StatsCard
      key="1"
      title="Direct Cash Transfer"
      value={`₹${(58.4 * zoneMultiplier).toFixed(1)}K Cr`}
      trend="PM-KISAN DISBURSED"
      trendType="success"
      subtext="99.4% Aadhaar verified payouts"
      icon={<Coins className="w-12 h-12 text-emerald-600" />}
    />,
    <StatsCard
      key="2"
      title="Active KCC Cards"
      value={`${(7.4 * zoneMultiplier).toFixed(1)} Crore`}
      trend="+4.2% YoY growth"
      trendType="success"
      subtext="Formal institutional credit line"
      icon={<CreditCard className="w-12 h-12 text-[#31572c]" />}
    />,
    <StatsCard
      key="3"
      title="PMFBY Insured Area"
      value={`${(42.5 * zoneMultiplier).toFixed(1)}M Ha`}
      trend="94.8% COVERAGE"
      trendType="success"
      subtext="Strategic crop risk cushioning"
      icon={<ShieldCheck className="w-12 h-12 text-emerald-600" />}
    />,
    <StatsCard
      key="4"
      title="Subsidy Efficiency"
      value={`${Math.round(Math.min(98, 92 * zoneMultiplier))} / 100`}
      trend="MINIMAL LEAKAGE"
      trendType="success"
      subtext="Direct benefits audit rating"
      icon={<Landmark className="w-12 h-12 text-[#3b82f6]" />}
    />
  ];

  const tableDataForPdf = AUDIT_DATABASE.map((a) => [a.scheme, a.targetGroup, a.allocation, a.payoutSuccess, a.leakageRate, `${a.auditScore}/100`]);

  const aiSectionConfig = {
    title: "AI Subsidy & Scheme Analyst",
    buttonLabel: "Query Scheme Effectiveness Report",
    prompt: `Analyze central scheme implementation and direct benefits transfer efficiency profiles for ${selectedState} (${selectedDistrict}). Focus on leakage mitigation, active KCC lines, and crop insurance coverage density.`,
  };

  return (
    <GovernmentLayout
      pageName="Subsidy & Scheme Intelligence"
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Scheme", "Target Group", "Allocation", "Payout Success", "Leakage Rate", "Audit Score"]}
    >
      <div className="space-y-6">
        
        {/* Charts & Audits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Budget Utilization Chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Scheme Budget Allocations vs Disbursements (₹Cr)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Allocated (₹Cr)" fill="#7f8c8d" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Utilized (₹Cr)" fill="#31572c" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audit Metrics Panel */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-[#31572c]" /> Direct Benefit Audit Summary
              </h3>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">PM-KISAN Aadhaar Linkage</span>
                  <p className="font-semibold text-gray-700">99.8% of disbursement accounts verified via biometrics, eliminating shell farmer lists.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Interest Subvention (KCC)</span>
                  <p className="font-semibold text-gray-700">3% prompt repayment rebate pushed directly to active accounts to lower borrowing stress.</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => alert("Audit log report downloaded successfully.")}
              className="bg-brand-dark hover:bg-[#132a13] text-white border rounded-xl py-2 text-[10px] font-bold text-center active:scale-95 transition cursor-pointer"
            >
              Export Comprehensive Audit Log
            </button>
          </div>

        </div>

        {/* Audit Details Table */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black border-b pb-3 mb-4">Centrally-Sponsored Scheme Performance Matrix</h3>
          <GenericTable
            columns={[
              { header: "Central Scheme", accessor: "scheme", className: "font-black text-gray-900" },
              { header: "Target Sourcing Group", accessor: "targetGroup" },
              { header: "Budget Allocation", accessor: "allocation", cellClassName: "font-bold text-gray-800" },
              { header: "Payout Success Rate", accessor: "payoutSuccess", cellClassName: "text-emerald-700 font-bold" },
              { header: "Leakage Deviation", accessor: "leakageRate", cellClassName: "text-red-750 font-bold" },
              {
                header: "Audit Score",
                accessor: "auditScore",
                cell: (v) => (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-dark h-full" style={{ width: `${v}%` }}></div>
                    </div>
                    <span className="font-bold">{v}/100</span>
                  </div>
                )
              }
            ]}
            data={AUDIT_DATABASE}
            showSearch={false}
            itemsPerPage={5}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
