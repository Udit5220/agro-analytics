import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  Percent,
  Warehouse,
  BarChart2,
  Cpu,
  Lightbulb
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList
} from "recharts";

// List of major districts for agribusiness sourcing
const SOURCING_REGIONS_DATABASE = [
  { name: "Ludhiana", coords: [30.901, 75.857], state: "Punjab", wheatSuitability: 95, riceSuitability: 90, infrastructureIndex: 92, farmerDensity: 78, contractAcres: 45000, primaryFpo: "Ludhiana Farmers Coop" },
  { name: "Bathinda", coords: [30.211, 74.945], state: "Punjab", wheatSuitability: 88, cottonSuitability: 92, infrastructureIndex: 85, farmerDensity: 82, contractAcres: 38000, primaryFpo: "Bathinda Agri Sourcing Ltd" },
  { name: "Karnal", coords: [29.686, 76.990], state: "Haryana", wheatSuitability: 96, riceSuitability: 94, infrastructureIndex: 90, farmerDensity: 85, contractAcres: 48000, primaryFpo: "Karnal Sourcing Cluster" },
  { name: "Indore", coords: [22.719, 75.857], state: "Madhya Pradesh", wheatSuitability: 82, oilseedsSuitability: 94, infrastructureIndex: 80, farmerDensity: 65, contractAcres: 35000, primaryFpo: "Indore Sourcing Federation" },
  { name: "Nagpur", coords: [21.145, 79.088], state: "Maharashtra", cottonSuitability: 89, oilseedsSuitability: 80, infrastructureIndex: 78, farmerDensity: 70, contractAcres: 24000, primaryFpo: "Nagpur Crop Source Hub" },
  { name: "Guntur", coords: [16.306, 80.436], state: "Andhra Pradesh", riceSuitability: 92, cottonSuitability: 85, infrastructureIndex: 83, farmerDensity: 88, contractAcres: 38000, primaryFpo: "Guntur Procurement Coop" }
];

export default function AgriSourcingRegions() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedRegion, setSelectedRegion] = useState("Karnal");

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.2;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  // Dynamic suitability scores and radius for map circles
  const processedRegions = useMemo(() => {
    return SOURCING_REGIONS_DATABASE.map((region) => {
      let suitabilityKey = `${selectedCommodity.toLowerCase()}Suitability`;
      let suitabilityVal = region[suitabilityKey] || 75;
      
      // Apply zone filter
      let isVisible = true;
      if (selectedZone === "North Zone" && region.state !== "Punjab" && region.state !== "Haryana") isVisible = false;
      if (selectedZone === "Central Zone" && region.state !== "Madhya Pradesh") isVisible = false;
      if (selectedZone === "West Zone" && region.state !== "Maharashtra") isVisible = false;
      if (selectedZone === "South Zone" && region.state !== "Andhra Pradesh") isVisible = false;

      return {
        ...region,
        suitability: Math.round(suitabilityVal * (isVisible ? 1 : 0.6)),
        visible: isVisible
      };
    });
  }, [selectedCommodity, selectedZone]);

  const mapCircles = useMemo(() => {
    return processedRegions
      .filter((r) => r.visible)
      .map((r) => {
        const suitabilityColor = r.suitability >= 90 ? "#1b4332" : r.suitability >= 80 ? "#4f772d" : "#e07a5f";
        return {
          name: r.name,
          coords: r.coords,
          color: suitabilityColor,
          radius: r.contractAcres * 3 * zoneMultiplier,
          weight: r.name === selectedRegion ? 5 : 2.5,
          tooltip: `<div class="p-2 font-sans text-xs">
            <b>Region: ${r.name} (${r.state})</b><br/>
            Sourcing Suitability: ${r.suitability}/100<br/>
            Logistics Index: ${r.infrastructureIndex}/100<br/>
            Contracted Sourcing: ${Math.round(r.contractAcres * zoneMultiplier).toLocaleString()} Acres
          </div>`
        };
      });
  }, [processedRegions, selectedRegion, zoneMultiplier]);

  const activeRegionData = useMemo(() => {
    return processedRegions.find((r) => r.name === selectedRegion) || processedRegions[0];
  }, [processedRegions, selectedRegion]);

  const kpis = [
    <StatsCard
      key="1"
      title="Top Sourcing Region"
      value={processedRegions.sort((a, b) => b.suitability - a.suitability)[0]?.name || "N/A"}
      trend="96/100 SUITABLE"
      trendType="success"
      subtext="Optimal soil & infrastructure"
    />,
    <StatsCard
      key="2"
      title="Avg. Soil Sourcing Score"
      value={`${Math.round(processedRegions.reduce((sum, r) => sum + r.suitability, 0) / processedRegions.length)}%`}
      trend="HIGH QUALITY"
      trendType="success"
      subtext="Macro nutrients status"
    />,
    <StatsCard
      key="3"
      title="Total Contracted Acres"
      value={`${Math.round(processedRegions.reduce((sum, r) => sum + r.contractAcres, 0) * zoneMultiplier).toLocaleString()} Ac`}
      trend="+14% YoY"
      trendType="success"
      subtext="Direct agribusiness tie-ups"
    />,
    <StatsCard
      key="4"
      title="Logistics Infrastructure"
      value="84.5 / 100"
      trend="WELL CONNECTED"
      trendType="success"
      subtext="Warehouse & road networks"
    />
  ];

  const tableDataForPdf = processedRegions
    .filter((r) => r.visible)
    .map((r) => [r.name, r.state, `${r.suitability}/100`, `${r.infrastructureIndex}/100`, r.primaryFpo]);

  return (
    <AgribusinessLayout
      pageName="Sourcing Region Intelligence"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Region", "State", "Suitability Index", "Logistics Index", "Primary FPO Supplier"]}
    >
      <div className="space-y-6">
        
        {/* Map & Sourcing Zone Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sourcing Suitability Map */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#31572c]" /> Regional Suitability & Logistics Hubs
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Commodity: {selectedCommodity}</span>
            </div>
            <div className="relative">
              <AgriLeafletMap circles={mapCircles} onSelectCircle={(name) => setSelectedRegion(name)} />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-1">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1 mb-1">
                  Suitability Legend
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#1b4332]"></span>
                  <span>High Suitability (&gt;90)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#4f772d]"></span>
                  <span>Moderate Suitability (80-90)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#e07a5f]"></span>
                  <span>Low Suitability (&lt;80)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Region details panel */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/20 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black">Selected Hub: {activeRegionData.name}</h3>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">{activeRegionData.state}</span>
              </div>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">FPO Sourcing Partner</span>
                  <p className="font-semibold text-gray-150">{activeRegionData.primaryFpo}</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Sourcing Suitability Index</span>
                  <p className="font-semibold text-gray-150">{activeRegionData.suitability} / 100 based on agronomic match, water tables, and temperature projections.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Infrastructure & Storage</span>
                  <p className="font-semibold text-gray-150">{activeRegionData.infrastructureIndex} / 100. Local weighing bridges, cold storages, and highways are accessible within a 15km radius.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-gray-300 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#ecf39e] shrink-0 mt-0.5" />
              <span><strong>CPO Directive:</strong> Expand contract allocation in {activeRegionData.name} by 8% to buffer production deficit in low-infrastructure zones.</span>
            </div>
          </div>

        </div>

        {/* Suitability Matrix & Infrastructure Scatter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table list */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Suitability Index Leaderboard</h3>
            <GenericTable
              columns={[
                { header: "Region", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { 
                  header: "Suitability", 
                  accessor: "suitability", 
                  cell: (v) => <span className="font-black text-emerald-800">{v}/100</span>
                },
                { 
                  header: "Logistics Score", 
                  accessor: "infrastructureIndex", 
                  cell: (v) => <span className="font-bold text-gray-700">{v}/100</span>
                },
                { header: "Sourcing Partner FPO", accessor: "primaryFpo" }
              ]}
              data={processedRegions.filter((r) => r.visible)}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>

          {/* Infrastructure vs density scatter chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-[#31572c]" /> Infrastructure vs Farmer Density
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Finds regions with high infrastructure (X) and high supplier density (Y).
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="infrastructureIndex" name="Logistics Index" unit="/100" tick={{ fontSize: 10 }} label={{ value: 'Logistics', position: 'bottom', offset: 0, fontSize: 10 }} />
                  <YAxis type="number" dataKey="farmerDensity" name="Farmer Density" unit="%" tick={{ fontSize: 10 }} label={{ value: 'Farmer Density', angle: -90, position: 'left', fontSize: 10 }} />
                  <ZAxis type="number" range={[100, 400]} />
                  <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Regions" data={processedRegions.filter((r) => r.visible)} fill="#31572c">
                    <LabelList dataKey="name" position="top" style={{ fontSize: 8, fontWeight: 'bold', fill: '#132a13' }} />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
