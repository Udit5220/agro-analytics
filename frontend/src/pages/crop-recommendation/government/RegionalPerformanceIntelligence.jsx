// RegionalPerformanceIntelligence.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Award, Target, Landmark, Compass, Droplet, Sprout, ShieldAlert, BarChart3 } from "lucide-react";
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

const COMPETITIVENESS_LEADERBOARD = seededData.cropRecommendation1.government.regionalPerformance.competitivenessLeaderboard;

export default function RegionalPerformanceIntelligence() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Punjab") || selectedState.includes("Haryana")) return 1.2;
    if (selectedState.includes("Rajasthan")) return 0.7;
    return 0.9;
  }, [selectedState]);

  const kpis = [
    <StatsCard
      key="1"
      title="National Yield Average"
      value={`${(3.1 * zoneMultiplier).toFixed(2)} MT/Ha`}
      trend="YIELD INDEX NORMAL"
      trendType="success"
      subtext="Strategic target: 3.5 MT/Ha"
      icon={<Sprout className="w-12 h-12 text-[#31572c]" />}
    />,
    <StatsCard
      key="2"
      title="Sourcing Index"
      value={`${Math.round(76 * zoneMultiplier)} / 100`}
      trend="COMPETITIVE BASE"
      trendType="success"
      subtext="Consolidated logistics rating"
      icon={<Target className="w-12 h-12 text-emerald-600" />}
    />,
    <StatsCard
      key="3"
      title="Sustainability Rating"
      value={`${Math.round(81 * zoneMultiplier)} / 100`}
      trend="ON TRACK"
      trendType="success"
      subtext="Resource footprint conservation rating"
      icon={<Landmark className="w-12 h-12 text-emerald-600" />}
    />,
    <StatsCard
      key="4"
      title="Climate Resilience"
      value={`${Math.round(73 * zoneMultiplier)} / 100`}
      trend="STABLE PROFILE"
      trendType="success"
      subtext="District level mitigation buffer"
      icon={<ShieldAlert className="w-12 h-12 text-[#3b82f6]" />}
    />
  ];

  const chartData = COMPETITIVENESS_LEADERBOARD.map((item) => ({
    name: item.region,
    "Yield Index": item.yieldIndex,
    "Water Efficiency": item.waterEfficiency,
    "Sustainability Score": item.sustainabilityScore
  }));

  const tableDataForPdf = COMPETITIVENESS_LEADERBOARD.map((c) => [c.rank, c.region, c.state, `${c.yieldIndex}/100`, `${c.waterEfficiency}/100`, `${c.sustainabilityScore}/100`, `${c.compositeScore}/100`]);

  const aiSectionConfig = {
    title: "AI Competitiveness Benchmarker",
    buttonLabel: "Query Performance Audit",
    prompt: `Analyze sourcing region output competitiveness for ${selectedState} (${selectedDistrict}). Benchmark local yield efficiency vs groundwater depletion indexes, and recommend policy directives.`,
  };

  return (
    <GovernmentLayout
      pageName="Regional Performance Intelligence"
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Rank", "Region Hub", "State", "Yield Index", "Water Efficiency", "Sustainability Score", "Composite Score"]}
    >
      <div className="space-y-6">
        
        {/* Leaderboard and Recharts Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Competitiveness Graph */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-[#31572c]" /> Regional Competitiveness Benchmarking (Normalized Index)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Yield Index" fill="#31572c" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Water Efficiency" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Sustainability Score" fill="#ecf39e" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Intervention scorecard alerts */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
                <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Regional Sourcing Directives
              </h3>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">High Sourcing Efficiency</span>
                  <p className="font-semibold text-gray-700">Punjab and Haryana show highest yield density but lowest water efficiency. Focus on immediate water metering.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Ecological Sustainability Focus</span>
                  <p className="font-semibold text-gray-700">Madhya Pradesh Narmada Corridor ranks highest in sustainability due to organic pulse crop rotations.</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => alert("Performance report shared with state agricultural heads.")}
              className="bg-[#31572c] hover:bg-[#132a13] text-white border rounded-xl py-2 text-[10px] font-bold text-center active:scale-95 transition cursor-pointer"
            >
              Share Benchmarks with State Boards
            </button>
          </div>

        </div>

        {/* Competitiveness scorecards leaderboard */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black border-b pb-3 mb-4 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-[#31572c]" /> Regional Competitiveness Leaderboard Scorecard
          </h3>
          <GenericTable
            columns={[
              { header: "Rank", accessor: "rank", cell: (v) => <span className="font-black text-gray-800">#{v}</span> },
              { header: "Region Hub", accessor: "region", cellClassName: "font-black text-gray-900" },
              { header: "State", accessor: "state" },
              { header: "Yield Index (100)", accessor: "yieldIndex", cellClassName: "font-bold text-emerald-800" },
              { header: "Water Efficiency (100)", accessor: "waterEfficiency", cellClassName: "font-bold text-blue-700" },
              { header: "Sustainability Index (100)", accessor: "sustainabilityScore", cellClassName: "font-bold text-yellow-750" },
              {
                header: "Composite Competitiveness Score",
                accessor: "compositeScore",
                cell: (v) => (
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#31572c] h-full" style={{ width: `${v}%` }}></div>
                    </div>
                    <span className="font-bold">{v}/100</span>
                  </div>
                )
              }
            ]}
            data={COMPETITIVENESS_LEADERBOARD}
            showSearch={false}
            itemsPerPage={6}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
