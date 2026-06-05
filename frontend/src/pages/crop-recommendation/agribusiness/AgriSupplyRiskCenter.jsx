import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Info,
  Bug,
  Thermometer,
  AlertTriangle,
  Compass
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// Mock districts with specific risk details
const DISTRICT_RISKS_DATABASE = [
  { name: "Ludhiana", coords: [30.901, 75.857], state: "Punjab", droughtRisk: 15, floodRisk: 22, pestRisk: 30, logisticDelayRisk: 12, supplyChainRisk: 18, riskLevel: "Low", mitigation: "Deploy local weather telemetry trackers" },
  { name: "Bathinda", coords: [30.211, 74.945], state: "Punjab", droughtRisk: 62, floodRisk: 10, pestRisk: 48, logisticDelayRisk: 25, supplyChainRisk: 52, riskLevel: "High", mitigation: "Procure insurance hedges, diversify sourcing" },
  { name: "Karnal", coords: [29.686, 76.990], state: "Haryana", droughtRisk: 12, floodRisk: 18, pestRisk: 25, logisticDelayRisk: 15, supplyChainRisk: 16, riskLevel: "Low", mitigation: "No immediate hedging needed" },
  { name: "Indore", coords: [22.719, 75.857], state: "Madhya Pradesh", droughtRisk: 45, floodRisk: 20, pestRisk: 35, logisticDelayRisk: 30, supplyChainRisk: 38, riskLevel: "Medium", mitigation: "Build buffer reserves at local warehouse hubs" },
  { name: "Nagpur", coords: [21.145, 79.088], state: "Maharashtra", droughtRisk: 50, floodRisk: 15, pestRisk: 42, logisticDelayRisk: 28, supplyChainRisk: 45, riskLevel: "Medium", mitigation: "Shift dispatch schedule to early mornings" },
  { name: "Guntur", coords: [16.306, 80.436], state: "Andhra Pradesh", droughtRisk: 25, floodRisk: 75, pestRisk: 55, logisticDelayRisk: 40, supplyChainRisk: 64, riskLevel: "High", mitigation: "Relocate buffer stocks out of low-lying hubs" }
];

export default function AgriSupplyRiskCenter() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedDistrict, setSelectedDistrict] = useState("Bathinda");

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.2;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  // Recalculate risks based on commodity selectors
  const computedRisks = useMemo(() => {
    return DISTRICT_RISKS_DATABASE.map((d) => {
      // Modify risk indexes based on selected commodity traits
      let commodityRiskFactor = 1.0;
      if (selectedCommodity === "Rice") commodityRiskFactor = 1.2; // Rice requires heavy water, high flood risk
      if (selectedCommodity === "Mustard") commodityRiskFactor = 0.8; // Dry crop
      if (selectedCommodity === "Cotton") commodityRiskFactor = 1.15; // High pest vulnerability

      const drought = Math.min(100, Math.round(d.droughtRisk * commodityRiskFactor));
      const flood = Math.min(100, Math.round(d.floodRisk * commodityRiskFactor));
      const pest = Math.min(100, Math.round(d.pestRisk * commodityRiskFactor));
      const logistics = d.logisticDelayRisk;

      const avgRisk = Math.round((drought + flood + pest + logistics + d.supplyChainRisk) / 5);
      const riskLevel = avgRisk >= 50 ? "High" : avgRisk >= 30 ? "Medium" : "Low";

      // Apply zone filtering visibility
      let isVisible = true;
      if (selectedZone === "North Zone" && d.state !== "Punjab" && d.state !== "Haryana") isVisible = false;
      if (selectedZone === "Central Zone" && d.state !== "Madhya Pradesh") isVisible = false;
      if (selectedZone === "West Zone" && d.state !== "Maharashtra") isVisible = false;
      if (selectedZone === "South Zone" && d.state !== "Andhra Pradesh") isVisible = false;

      return {
        ...d,
        droughtRisk: drought,
        floodRisk: flood,
        pestRisk: pest,
        logisticDelayRisk: logistics,
        avgRisk,
        riskLevel,
        visible: isVisible
      };
    });
  }, [selectedCommodity, selectedZone]);

  const mapCircles = useMemo(() => {
    return computedRisks
      .filter((d) => d.visible)
      .map((d) => {
        const riskColor = d.riskLevel === "High" ? "#ef233c" : d.riskLevel === "Medium" ? "#ffb703" : "#38b000";
        return {
          name: d.name,
          coords: d.coords,
          color: riskColor,
          radius: d.avgRisk * 3000 * zoneMultiplier,
          weight: d.name === selectedDistrict ? 5 : 2.5,
          tooltip: `<div class="p-2 font-sans text-xs">
            <b>Region: ${d.name}</b><br/>
            Risk level: <b>${d.riskLevel} (${d.avgRisk}/100)</b><br/>
            Drought index: ${d.droughtRisk}%<br/>
            Pest hazard: ${d.pestRisk}%<br/>
            Supply chain delay: ${d.logisticDelayRisk}%
          </div>`
        };
      });
  }, [computedRisks, selectedDistrict, zoneMultiplier]);

  const activeDistrictData = useMemo(() => {
    return computedRisks.find((d) => d.name === selectedDistrict) || computedRisks[0];
  }, [computedRisks, selectedDistrict]);

  const activeRadarData = useMemo(() => {
    return [
      { subject: "Drought Exposure", A: activeDistrictData.droughtRisk, B: 40 },
      { subject: "Flood Vulnerability", A: activeDistrictData.floodRisk, B: 30 },
      { subject: "Pest Hazard Index", A: activeDistrictData.pestRisk, B: 45 },
      { subject: "Logistic Disruption", A: activeDistrictData.logisticDelayRisk, B: 25 },
      { subject: "Supply Chain Risk", A: activeDistrictData.supplyChainRisk, B: 35 }
    ];
  }, [activeDistrictData]);

  const kpis = [
    <StatsCard
      key="1"
      title="High-Risk Sourcing Hubs"
      value={`${computedRisks.filter((d) => d.riskLevel === "High" && d.visible).length} Districts`}
      trend="HEDGING STRATEGY ACTIVE"
      trendType="danger"
      subtext="Diversified contract networks"
    />,
    <StatsCard
      key="2"
      title="Avg Climate Risk Index"
      value={`${Math.round(computedRisks.reduce((sum, r) => sum + r.avgRisk, 0) / computedRisks.length)} / 100`}
      trend="MODERATE"
      trendType="warning"
      subtext={`Based on ${selectedCommodity} crop traits`}
    />,
    <StatsCard
      key="3"
      title="Secured Buffer Reserve"
      value="72% Volume"
      trend="SAFE INSIDE STORAGE"
      trendType="success"
      subtext="Hedged from immediate spots"
    />,
    <StatsCard
      key="4"
      title="Logistics Alert Status"
      value="NORMAL"
      trend="STABLE SUPPLY"
      trendType="success"
      subtext="Freight routes operational"
    />
  ];

  const tableDataForPdf = computedRisks
    .filter((d) => d.visible)
    .map((d) => [d.name, d.state, d.riskLevel, `${d.avgRisk}/100`, d.mitigation]);

  return (
    <AgribusinessLayout
      pageName="Climate & Supply Risk Center"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Region", "State", "Risk Level", "Risk Index", "Mitigation Directive"]}
    >
      <div className="space-y-6">
        
        {/* Map & Sourcing Zone Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sourcing Risk Map */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#31572c]" /> India Sourcing Hub Vulnerabilities
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active: {selectedCommodity}</span>
            </div>
            <div className="relative">
              <AgriLeafletMap circles={mapCircles} onSelectCircle={(name) => setSelectedDistrict(name)} />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-1">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1 mb-1">
                  Risk Level Legend
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#ef233c]"></span>
                  <span>High Risk Index (&gt;50)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#ffb703]"></span>
                  <span>Medium Risk Index (30-50)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#38b000]"></span>
                  <span>Low Risk Index (&lt;30)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Region details panel */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/20 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black">Region: {activeDistrictData.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${activeDistrictData.riskLevel === 'High' ? 'bg-red-600 text-white' : activeDistrictData.riskLevel === 'Medium' ? 'bg-amber-500 text-gray-900' : 'bg-emerald-600 text-white'}`}>
                  {activeDistrictData.riskLevel} Risk
                </span>
              </div>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Mitigation Directive</span>
                  <p className="font-semibold text-gray-150">{activeDistrictData.mitigation}</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Pest & Weather Alarms</span>
                  <p className="font-semibold text-gray-150">Pest Hazard Index is sitting at {activeDistrictData.pestRisk}% with ground temperature deviations of +1.8°C.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Supply Chain Logistics Delay</span>
                  <p className="font-semibold text-gray-150">Truck dispatch delay probability at local checkpoints: {activeDistrictData.logisticDelayRisk}%.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-gray-300">
              💡 <strong>Risk Mitigation:</strong> Secure alternative sourcing clusters inside the Central / West Zone to buffer high-risk spots.
            </div>
          </div>

        </div>

        {/* Risk Radar & Mitigations List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table list */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">District Sourcing Vulnerability Ratings</h3>
            <GenericTable
              columns={[
                { header: "District", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { 
                  header: "Vulnerability Index", 
                  accessor: "avgRisk", 
                  cell: (v) => <span className="font-black">{v} / 100</span>
                },
                { 
                  header: "Risk Tier", 
                  accessor: "riskLevel", 
                  cell: (v) => {
                    const badge = v === "High" ? "bg-red-50 text-red-800 border-red-200" : v === "Medium" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200";
                    return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                  }
                },
                { header: "Corporate Mitigation Directives", accessor: "mitigation" }
              ]}
              data={computedRisks.filter((r) => r.visible)}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>

          {/* Risk Breakdown Radar */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> {activeDistrictData.name} Risk breakdown
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Shows how the selected region stands across five core supply chain risk domains.
            </p>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={activeRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar name={activeDistrictData.name} dataKey="A" stroke="#ef233c" fill="#ef233c" fillOpacity={0.4} />
                  <Radar name="National Baseline" dataKey="B" stroke="#31572c" fill="#31572c" fillOpacity={0.15} />
                  <RechartsTooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
