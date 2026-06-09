import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import {
  Award,
  AlertTriangle,
  TrendingUp,
  Percent,
  CheckCircle,
  FileText,
  Compass,
  ArrowRight,
  UserCheck,
  Zap
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// List of supplier FPOs and performance scorecards
const FPO_PERFORMANCE_DATABASE = [
  { name: "Ludhiana Farmers Coop", state: "Punjab", reliabilityScore: 94, qualityScore: 92, deliveryPunctuality: 96, averageGrade: "A+", deficitRate: 1.5, status: "Active" },
  { name: "Bathinda Agri Sourcing Ltd", state: "Punjab", reliabilityScore: 82, qualityScore: 84, deliveryPunctuality: 80, averageGrade: "B", deficitRate: 3.2, status: "Watchlist" },
  { name: "Karnal Sourcing Cluster", state: "Haryana", reliabilityScore: 96, qualityScore: 95, deliveryPunctuality: 94, averageGrade: "A+", deficitRate: 1.1, status: "Active" },
  { name: "Indore Sourcing Federation", state: "Madhya Pradesh", reliabilityScore: 85, qualityScore: 82, deliveryPunctuality: 88, averageGrade: "B+", deficitRate: 2.5, status: "Active" },
  { name: "Nagpur Crop Source Hub", state: "Maharashtra", reliabilityScore: 72, qualityScore: 75, deliveryPunctuality: 78, averageGrade: "C", deficitRate: 4.8, status: "Critical Watch" },
  { name: "Guntur Procurement Coop", state: "Andhra Pradesh", reliabilityScore: 88, qualityScore: 90, deliveryPunctuality: 86, averageGrade: "A", deficitRate: 2.1, status: "Active" }
];

export default function AgriSupplierPerformance() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedFpo, setSelectedFpo] = useState("Karnal Sourcing Cluster");

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.15;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  const computedPerformance = useMemo(() => {
    return FPO_PERFORMANCE_DATABASE.map((f) => {
      // Modify score metrics dynamically based on selected crop
      let qualityMultiplier = 1.0;
      if (selectedCommodity === "Rice" && f.name.includes("Ludhiana")) qualityMultiplier = 1.02;
      if (selectedCommodity === "Cotton" && f.name.includes("Nagpur")) qualityMultiplier = 0.9;
      if (selectedCommodity === "Mustard" && f.name.includes("Bathinda")) qualityMultiplier = 1.05;

      const rel = Math.min(100, Math.round(f.reliabilityScore * zoneMultiplier));
      const qual = Math.min(100, Math.round(f.qualityScore * qualityMultiplier));
      const punc = Math.min(100, Math.round(f.deliveryPunctuality * zoneMultiplier));

      const finalScore = Math.round((rel + qual + punc) / 3);
      const deficit = (f.deficitRate * (2 - zoneMultiplier)).toFixed(1);

      let status = "Active";
      if (finalScore < 75) status = "Critical Watch";
      else if (finalScore < 85) status = "Watchlist";

      // Filter based on zone
      let isVisible = true;
      if (selectedZone === "North Zone" && f.state !== "Punjab" && f.state !== "Haryana") isVisible = false;
      if (selectedZone === "Central Zone" && f.state !== "Madhya Pradesh") isVisible = false;
      if (selectedZone === "West Zone" && f.state !== "Maharashtra") isVisible = false;
      if (selectedZone === "South Zone" && f.state !== "Andhra Pradesh") isVisible = false;

      return {
        ...f,
        reliabilityScore: rel,
        qualityScore: qual,
        deliveryPunctuality: punc,
        finalScore,
        deficitRate: parseFloat(deficit),
        status,
        visible: isVisible
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
  }, [selectedCommodity, selectedZone, zoneMultiplier]);

  const activeFpoData = useMemo(() => {
    return computedPerformance.find((f) => f.name === selectedFpo) || computedPerformance[0];
  }, [computedPerformance, selectedFpo]);

  // Aggregate stats
  const avgSupplierScore = useMemo(() => {
    const visibleFpos = computedPerformance.filter((f) => f.visible);
    if (visibleFpos.length === 0) return 0;
    return Math.round(visibleFpos.reduce((sum, f) => sum + f.finalScore, 0) / visibleFpos.length);
  }, [computedPerformance]);

  const topPerformanceFpoName = useMemo(() => {
    const activeList = computedPerformance.filter((f) => f.visible);
    return activeList[0]?.name || "N/A";
  }, [computedPerformance]);

  const avgDeficitRate = useMemo(() => {
    const visibleFpos = computedPerformance.filter((f) => f.visible);
    if (visibleFpos.length === 0) return 0;
    return (visibleFpos.reduce((sum, f) => sum + f.deficitRate, 0) / visibleFpos.length).toFixed(1);
  }, [computedPerformance]);

  const riskyCount = useMemo(() => {
    return computedPerformance.filter((f) => f.visible && f.status === "Critical Watch").length;
  }, [computedPerformance]);

  const kpis = [
    <StatsCard
      key="1"
      title="Avg. Supplier Score"
      value={`${avgSupplierScore}%`}
      trend="STABLE QUALITY"
      trendType="success"
      subtext="Quality & reliability aggregate"
    />,
    <StatsCard
      key="2"
      title="Top Sourcing Supplier"
      value={topPerformanceFpoName.replace(" Farmers Coop", "").replace(" Sourcing Cluster", "")}
      trend="GRADE A+"
      trendType="success"
      subtext="Highest delivery compliance"
    />,
    <StatsCard
      key="3"
      title="Quality Deficit Rate"
      value={`${avgDeficitRate}%`}
      trend="-0.4% this quarter"
      trendType="success"
      subtext="Aggregate moisture & foreign matter"
    />,
    <StatsCard
      key="4"
      title="Critical Suppliers watch"
      value={`${riskyCount} FPOs`}
      trend={riskyCount > 0 ? "RE-AUDIT MANDATORY" : "ALL SYSTEMS GREEN"}
      trendType={riskyCount > 0 ? "danger" : "success"}
      subtext="Sub-75% performance score"
    />
  ];

  // Radar chart evaluation data
  const fpoRadarData = useMemo(() => {
    return [
      { subject: "Delivery Reliability", A: activeFpoData.reliabilityScore, B: 85 },
      { subject: "Grade Quality Match", A: activeFpoData.qualityScore, B: 85 },
      { subject: "Punctual Arrival", A: activeFpoData.deliveryPunctuality, B: 80 },
      { subject: "Low Deficit Compliance", A: Math.round((10 - activeFpoData.deficitRate) * 10), B: 80 }
    ];
  }, [activeFpoData]);

  // Deficit Rate comparison chart
  const deficitChartData = useMemo(() => {
    return computedPerformance.filter((f) => f.visible).map((f) => ({
      name: f.name.replace(" Coop", "").replace(" Ltd", "").replace(" Cluster", "").replace(" Federation", "").replace(" Hub", ""),
      "Quality Deficit %": f.deficitRate
    }));
  }, [computedPerformance]);

  const tableDataForPdf = computedPerformance
    .filter((f) => f.visible)
    .map((f) => [f.name, f.state, `${f.finalScore}%`, `${f.deficitRate}%`, f.averageGrade, f.status]);

  return (
    <AgribusinessLayout
      pageName="Supplier Performance Intelligence"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["FPO Partner", "State", "Performance Score", "Deficit Rate", "Grade", "Audit Status"]}
    >
      <div className="space-y-6">
        
        {/* Leaderboard and radar breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FPO Leaderboard table */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#31572c]" /> FPO Sourcing Scorecard Leaderboard
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active: {selectedCommodity}</span>
            </div>
            <GenericTable
              columns={[
                { header: "FPO Supplier Partner", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { 
                  header: "Performance Score", 
                  accessor: "finalScore", 
                  cell: (v) => (
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#31572c] h-full" style={{ width: `${v}%` }}></div>
                      </div>
                      <span className="font-bold text-gray-800">{v}%</span>
                    </div>
                  )
                },
                { header: "Quality Deficit", accessor: "deficitRate", cell: (v) => `${v}%` },
                { header: "Grade", accessor: "averageGrade", cellClassName: "font-bold text-emerald-800" },
                { 
                  header: "Audit Status", 
                  accessor: "status", 
                  cell: (v) => {
                    const badge = v === "Critical Watch" ? "bg-red-50 text-red-800 border-red-200" : v === "Watchlist" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200";
                    return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                  }
                }
              ]}
              data={computedPerformance.filter((f) => f.visible)}
              showSearch={false}
              itemsPerPage={6}
              onRowClick={(row) => setSelectedFpo(row.name)}
            />
          </div>

          {/* Supplier details Radar chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#31572c]" /> {activeFpoData.name} Scorecard
                </h3>
                <span className="text-[10px] bg-gray-100 text-gray-650 px-2 py-0.5 rounded font-black">
                  Grade: {activeFpoData.averageGrade}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 font-semibold leading-relaxed mt-1">
                Visualizing the supplier scorecard metrics compared to baseline quality standards.
              </p>
              <div className="h-48 flex justify-center items-center mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" radius="70%" data={fpoRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7 }} />
                    <Radar name={activeFpoData.name} dataKey="A" stroke="#31572c" fill="#31572c" fillOpacity={0.4} />
                    <Radar name="Target Standards" dataKey="B" stroke="#e07a5f" fill="#e07a5f" fillOpacity={0.15} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-[#31572c] text-white border rounded-xl p-3 text-[10px] text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#224222] transition-colors">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span>Request Quality Audit & Re-inspection</span>
            </div>
          </div>

        </div>

        {/* Quality Deficit comparisons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Risky supplier alerts list */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" /> Supplier Warnings & Audit Logs
            </h3>
            <div className="space-y-3">
              {computedPerformance.filter(f => f.status !== "Active" && f.visible).map((f, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-red-50/50 border border-red-200/50 rounded-xl">
                  <div>
                    <span className="text-xs font-black text-gray-900">{f.name}</span>
                    <p className="text-[10px] text-red-800/80 font-bold mt-0.5">Warning: Quality Deficit Rate at {f.deficitRate}% exceeds acceptable 2.0% threshold.</p>
                  </div>
                  <button 
                    onClick={() => alert(`Supplier re-audit directive issued to ${f.name}.`)}
                    className="bg-red-850 hover:bg-red-900 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl border border-red-200 transition shrink-0"
                  >
                    Issue Audit Notice
                  </button>
                </div>
              ))}
              {computedPerformance.filter(f => f.status !== "Active" && f.visible).length === 0 && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/50 border border-emerald-200/40 rounded-xl p-4">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>No suppliers are currently marked under critical quality warnings for the selected filters.</span>
                </div>
              )}
            </div>
          </div>

          {/* Deficit bar chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> Deficit Rate Comparison (%)
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Comparison of crop impurity/moisture rejection percentages across FPOs.
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deficitChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Quality Deficit %" fill="#e07a5f" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
