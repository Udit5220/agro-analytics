import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  Globe,
  TrendingUp,
  MapPin,
  CheckCircle,
  AlertCircle,
  Sliders,
  Compass,
  ArrowUpRight
} from "lucide-react";
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

// List of potential expansion candidate districts
const EXPANSION_CANDIDATES_DATABASE = [
  { name: "Patiala", coords: [30.339, 76.386], state: "Punjab", untappedAcreage: 45000, currentAcreage: 5000, logisticsScore: 88, stabilityScore: 92, accessScore: 85, costIndex: 90 },
  { name: "Bhopal", coords: [23.259, 77.412], state: "Madhya Pradesh", untappedAcreage: 38000, currentAcreage: 0, logisticsScore: 78, stabilityScore: 85, accessScore: 70, costIndex: 95 },
  { name: "Amritsar", coords: [31.634, 74.872], state: "Punjab", untappedAcreage: 32000, currentAcreage: 2000, logisticsScore: 82, stabilityScore: 88, accessScore: 78, costIndex: 92 },
  { name: "Rajkot", coords: [22.303, 70.802], state: "Gujarat", untappedAcreage: 28000, currentAcreage: 0, logisticsScore: 85, stabilityScore: 82, accessScore: 74, costIndex: 88 },
  { name: "Jalandhar", coords: [31.326, 75.576], state: "Punjab", untappedAcreage: 24000, currentAcreage: 8000, logisticsScore: 90, stabilityScore: 94, accessScore: 89, costIndex: 85 },
  { name: "Vijayawada", coords: [16.506, 80.648], state: "Andhra Pradesh", untappedAcreage: 30000, currentAcreage: 3000, logisticsScore: 84, stabilityScore: 86, accessScore: 80, costIndex: 90 }
];

export default function AgriExpansionStrategy() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedCandidate, setSelectedCandidate] = useState("Patiala");

  // Dynamic slider weights for calculating the Expansion Index
  const [weights, setWeights] = useState({
    logistics: 0.3,
    stability: 0.3,
    access: 0.2,
    cost: 0.2
  });

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.2;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  const computedCandidates = useMemo(() => {
    return EXPANSION_CANDIDATES_DATABASE.map((c) => {
      // Modify potential based on selected commodity
      let commodityMultiplier = 1.0;
      if (selectedCommodity === "Rice") commodityMultiplier = 1.15;
      if (selectedCommodity === "Mustard") commodityMultiplier = 0.8;
      if (selectedCommodity === "Oilseeds") commodityMultiplier = 1.1;

      // Filter based on zone
      let isVisible = true;
      if (selectedZone === "North Zone" && c.state !== "Punjab" && c.state !== "Haryana") isVisible = false;
      if (selectedZone === "Central Zone" && c.state !== "Madhya Pradesh") isVisible = false;
      if (selectedZone === "West Zone" && c.state !== "Gujarat" && c.state !== "Maharashtra") isVisible = false;
      if (selectedZone === "South Zone" && c.state !== "Andhra Pradesh") isVisible = false;

      // Calculate weighted index out of 100
      const expansionIndex = Math.round(
        (c.logisticsScore * weights.logistics) +
        (c.stabilityScore * weights.stability) +
        (c.accessScore * weights.access) +
        ((100 - c.costIndex + 50) * weights.cost)
      );

      const untapped = Math.round(c.untappedAcreage * commodityMultiplier * zoneMultiplier);
      const current = Math.round(c.currentAcreage * zoneMultiplier);

      return {
        ...c,
        untappedAcreage: untapped,
        currentAcreage: current,
        expansionIndex,
        visible: isVisible
      };
    }).sort((a, b) => b.expansionIndex - a.expansionIndex);
  }, [selectedCommodity, selectedZone, weights, zoneMultiplier]);

  const mapCircles = useMemo(() => {
    return computedCandidates
      .filter((c) => c.visible)
      .map((c) => {
        const potentialColor = c.expansionIndex >= 85 ? "#1b4332" : c.expansionIndex >= 75 ? "#4f772d" : "#e07a5f";
        return {
          name: c.name,
          coords: c.coords,
          color: potentialColor,
          radius: c.untappedAcreage * 2.5,
          weight: c.name === selectedCandidate ? 5 : 2.5,
          tooltip: `<div class="p-2 font-sans text-xs">
            <b>Candidate: ${c.name} (${c.state})</b><br/>
            Expansion Index: <b>${c.expansionIndex}/100</b><br/>
            Untapped Acres: ${c.untappedAcreage.toLocaleString()} Ac<br/>
            Logistics Rating: ${c.logisticsScore}/100
          </div>`
        };
      });
  }, [computedCandidates, selectedCandidate]);

  const activeCandidateData = useMemo(() => {
    return computedCandidates.find((c) => c.name === selectedCandidate) || computedCandidates[0];
  }, [computedCandidates, selectedCandidate]);

  // Aggregate numbers
  const totalUntapped = useMemo(() => {
    return computedCandidates.filter((c) => c.visible).reduce((sum, c) => sum + c.untappedAcreage, 0);
  }, [computedCandidates]);

  const avgExpansionScore = useMemo(() => {
    const visibleCandidates = computedCandidates.filter((c) => c.visible);
    if (visibleCandidates.length === 0) return 0;
    return Math.round(visibleCandidates.reduce((sum, c) => sum + c.expansionIndex, 0) / visibleCandidates.length);
  }, [computedCandidates]);

  const projectedGainVolume = useMemo(() => {
    return Math.round(totalUntapped * 1.8);
  }, [totalUntapped]);

  const kpis = [
    <StatsCard
      key="1"
      title="Top Expansion Cluster"
      value={computedCandidates[0]?.name || "N/A"}
      trend={`Score: ${computedCandidates[0]?.expansionIndex}/100`}
      trendType="success"
      subtext={`Optimal expansion for ${selectedCommodity}`}
    />,
    <StatsCard
      key="2"
      title="Untapped Sourcing Potential"
      value={`${totalUntapped.toLocaleString()} Ac`}
      trend="+32% expansion"
      trendType="success"
      subtext="Available contract farming land"
    />,
    <StatsCard
      key="3"
      title="Avg Expansion Feasibility"
      value={`${avgExpansionScore} / 100`}
      trend="STABLE ACCESS"
      trendType="success"
      subtext="Based on infrastructure & stability"
    />,
    <StatsCard
      key="4"
      title="Projected Supply Gain"
      value={`+${projectedGainVolume.toLocaleString()} MT`}
      trend="ESTIMATED YIELD"
      trendType="success"
      subtext="At full capacity delivery"
    />
  ];

  // Sourcing acreage comparison chart
  const comparisonChartData = useMemo(() => {
    return computedCandidates.filter((c) => c.visible).map((c) => ({
      name: c.name,
      "Current Contracted Acres": c.currentAcreage,
      "Untapped Potential Acres": c.untappedAcreage
    }));
  }, [computedCandidates]);

  const tableDataForPdf = computedCandidates
    .filter((c) => c.visible)
    .map((c) => [c.name, c.state, c.currentAcreage, c.untappedAcreage, `${c.expansionIndex}/100`, `${c.logisticsScore}/100`]);

  return (
    <AgribusinessLayout
      pageName="Expansion Strategy Intelligence"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Candidate", "State", "Current Acres", "Untapped Acres", "Expansion Index", "Logistics Rating"]}
    >
      <div className="space-y-6">
        
        {/* Map & Calibration Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sourcing Expansion Map */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#31572c]" /> India Untapped Sourcing Clusters
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Commodity: {selectedCommodity}</span>
            </div>
            <div className="relative">
              <AgriLeafletMap circles={mapCircles} onSelectCircle={(name) => setSelectedCandidate(name)} />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-1">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1 mb-1">
                  Expansion Index Legend
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#1b4332]"></span>
                  <span>Primary Candidates (&gt;85)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-brand-medium"></span>
                  <span>Secondary Candidates (75-85)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#e07a5f]"></span>
                  <span>Low Feasibility (&lt;75)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slider Tuner panel */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black border-b border-white/20 pb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#ecf39e]" /> Expansion Calibration
              </h3>
              <p className="text-[10px] text-gray-300 font-semibold leading-relaxed mt-1">
                Adjust criteria weights to compute the optimal expansion score index.
              </p>
            </div>

            <div className="space-y-3.5 my-2">
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span>Logistics Weight</span>
                  <span className="text-[#ecf39e]">{Math.round(weights.logistics * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.logistics}
                  onChange={(e) => setWeights({ ...weights, logistics: parseFloat(e.target.value) })}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span>Grower Stability Weight</span>
                  <span className="text-[#ecf39e]">{Math.round(weights.stability * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.stability}
                  onChange={(e) => setWeights({ ...weights, stability: parseFloat(e.target.value) })}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span>Sourcing Access Weight</span>
                  <span className="text-[#ecf39e]">{Math.round(weights.access * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.access}
                  onChange={(e) => setWeights({ ...weights, access: parseFloat(e.target.value) })}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span>Cost Competitiveness Weight</span>
                  <span className="text-[#ecf39e]">{Math.round(weights.cost * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={weights.cost}
                  onChange={(e) => setWeights({ ...weights, cost: parseFloat(e.target.value) })}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <span className="text-[9px] text-[#ecf39e] font-black uppercase tracking-wider block">Selected Candidate: {activeCandidateData.name}</span>
              <span className="text-xl font-black">{activeCandidateData.expansionIndex} / 100 Index</span>
              <span className="text-[10px] text-gray-300 block mt-1">Sourcing Potential: {activeCandidateData.untappedAcreage.toLocaleString()} untapped acres.</span>
            </div>
          </div>

        </div>

        {/* Comparison chart and candidates table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Untapped Acreage chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> Current vs Untapped Acreage (Ac)
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Comparison showing contracted sourcing limits vs potential expansion.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Current Contracted Acres" fill="#4f772d" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Untapped Potential Acres" fill="#e07a5f" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table list */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Sourcing Expansion Rankings</h3>
            <GenericTable
              columns={[
                { header: "Candidate", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { header: "Current Contract Acres", accessor: "currentAcreage", cell: (v) => v.toLocaleString() },
                { header: "Untapped Acres", accessor: "untappedAcreage", cell: (v) => v.toLocaleString() },
                { 
                  header: "Expansion Index", 
                  accessor: "expansionIndex", 
                  cell: (v) => <span className="font-black text-emerald-800">{v}/100</span>
                },
                { header: "Logistics Rating", accessor: "logisticsScore", cell: (v) => `${v}/100` }
              ]}
              data={computedCandidates.filter((c) => c.visible)}
              showSearch={false}
              itemsPerPage={6}
              onRowClick={(row) => setSelectedCandidate(row.name)}
            />
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
