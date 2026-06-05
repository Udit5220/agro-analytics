import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  ShoppingCart,
  TrendingUp,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  TrendingDown,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// List of procurement collection centers
const PROCUREMENT_CENTERS_DATABASE = [
  { name: "Ludhiana Central Mandi", coords: [30.901, 75.857], state: "Punjab", volumeProcured: 85000, targetVolume: 100000, avgCost: 5100, freightCost: 220, status: "Active" },
  { name: "Bathinda Sourcing Hub", coords: [30.211, 74.945], state: "Punjab", volumeProcured: 52000, targetVolume: 80000, avgCost: 5250, freightCost: 310, status: "Active" },
  { name: "Karnal Storage Unit", coords: [29.686, 76.990], state: "Haryana", volumeProcured: 92000, targetVolume: 100000, avgCost: 5050, freightCost: 190, status: "Active" },
  { name: "Indore Processing Depot", coords: [22.719, 75.857], state: "Madhya Pradesh", volumeProcured: 38000, targetVolume: 50000, avgCost: 6100, freightCost: 420, status: "Active" },
  { name: "Nagpur Crushing Hub", coords: [21.145, 79.088], state: "Maharashtra", volumeProcured: 18000, targetVolume: 30000, avgCost: 6300, freightCost: 450, status: "Active" },
  { name: "Guntur Sourcing Ginnery", coords: [16.306, 80.436], state: "Andhra Pradesh", volumeProcured: 25000, targetVolume: 40000, avgCost: 6900, freightCost: 510, status: "Active" }
];

export default function AgriProcurementIntelligence() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedCenter, setSelectedCenter] = useState("Karnal Storage Unit");

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.2;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  const computedCenters = useMemo(() => {
    return PROCUREMENT_CENTERS_DATABASE.map((c) => {
      // Modify costs dynamically based on selected commodity
      let baseCostModifier = 1.0;
      if (selectedCommodity === "Rice") baseCostModifier = 0.85;
      if (selectedCommodity === "Cotton") baseCostModifier = 1.35;
      if (selectedCommodity === "Mustard") baseCostModifier = 1.1;

      // Apply zone filtering
      let isVisible = true;
      if (selectedZone === "North Zone" && c.state !== "Punjab" && c.state !== "Haryana") isVisible = false;
      if (selectedZone === "Central Zone" && c.state !== "Madhya Pradesh") isVisible = false;
      if (selectedZone === "West Zone" && c.state !== "Maharashtra") isVisible = false;
      if (selectedZone === "South Zone" && c.state !== "Andhra Pradesh") isVisible = false;

      const finalCost = Math.round(c.avgCost * baseCostModifier * zoneMultiplier);
      const finalFreight = Math.round(c.freightCost * zoneMultiplier);
      const procured = Math.round(c.volumeProcured * zoneMultiplier);
      const target = Math.round(c.targetVolume * zoneMultiplier);

      return {
        ...c,
        avgCost: finalCost,
        freightCost: finalFreight,
        volumeProcured: procured,
        targetVolume: target,
        progress: Math.round((procured / target) * 100),
        visible: isVisible
      };
    });
  }, [selectedCommodity, selectedZone, zoneMultiplier]);

  const mapCircles = useMemo(() => {
    return computedCenters
      .filter((c) => c.visible)
      .map((c) => {
        const progressColor = c.progress >= 90 ? "#1b4332" : c.progress >= 70 ? "#4f772d" : "#e07a5f";
        return {
          name: c.name,
          coords: c.coords,
          color: progressColor,
          radius: c.volumeProcured * 1.5,
          weight: c.name === selectedCenter ? 5 : 2.5,
          tooltip: `<div class="p-2 font-sans text-xs">
            <b>${c.name} (${c.state})</b><br/>
            Procured: ${c.volumeProcured.toLocaleString()} MT<br/>
            Target: ${c.targetVolume.toLocaleString()} MT<br/>
            Progress: ${c.progress}%<br/>
            Avg Price: ₹${c.avgCost.toLocaleString()} / MT
          </div>`
        };
      });
  }, [computedCenters, selectedCenter]);

  const activeCenterData = useMemo(() => {
    return computedCenters.find((c) => c.name === selectedCenter) || computedCenters[0];
  }, [computedCenters, selectedCenter]);

  // Aggregate values
  const totalProcured = useMemo(() => {
    return computedCenters.filter((c) => c.visible).reduce((sum, c) => sum + c.volumeProcured, 0);
  }, [computedCenters]);

  const totalTarget = useMemo(() => {
    return computedCenters.filter((c) => c.visible).reduce((sum, c) => sum + c.targetVolume, 0);
  }, [computedCenters]);

  const avgCostPerMt = useMemo(() => {
    const visibleCenters = computedCenters.filter((c) => c.visible);
    if (visibleCenters.length === 0) return 0;
    return Math.round(visibleCenters.reduce((sum, c) => sum + c.avgCost, 0) / visibleCenters.length);
  }, [computedCenters]);

  const avgFreightPerMt = useMemo(() => {
    const visibleCenters = computedCenters.filter((c) => c.visible);
    if (visibleCenters.length === 0) return 0;
    return Math.round(visibleCenters.reduce((sum, c) => sum + c.freightCost, 0) / visibleCenters.length);
  }, [computedCenters]);

  const kpis = [
    <StatsCard
      key="1"
      title="Avg Sourcing cost"
      value={`₹${avgCostPerMt.toLocaleString()} / MT`}
      trend="-3.2% vs Spot"
      trendType="success"
      subtext="Contract hedge cost savings"
    />,
    <StatsCard
      key="2"
      title="Total Procured Volume"
      value={`${totalProcured.toLocaleString()} MT`}
      trend={`${Math.round((totalProcured / totalTarget) * 100)}% Target`}
      trendType="success"
      subtext={`Target: ${totalTarget.toLocaleString()} MT`}
    />,
    <StatsCard
      key="3"
      title="Logistics Overhead"
      value={`₹${avgFreightPerMt.toLocaleString()} / MT`}
      trend="+4.8% fuel index"
      trendType="danger"
      subtext="Avg transport & handling overhead"
    />,
    <StatsCard
      key="4"
      title="Active Mandi Coverage"
      value={`${computedCenters.filter(c => c.visible).length} Hubs`}
      trend="STABLE GRID"
      trendType="success"
      subtext="Active collection points"
    />
  ];

  // Pipeline Stage Tracker Data
  const pipelineFlowData = [
    { stage: "Sowing", Volume: Math.round(totalTarget * 1.2), Loss: "0%" },
    { stage: "Vegetative", Volume: Math.round(totalTarget * 1.15), Loss: "4%" },
    { stage: "Pre-Harvest", Volume: Math.round(totalTarget * 1.1), Loss: "8%" },
    { stage: "Mandi Arrival", Volume: Math.round(totalTarget * 0.95), Loss: "15%" },
    { stage: "Weighing Hub", Volume: Math.round(totalTarget * 0.92), Loss: "17%" },
    { stage: "Processing Unit", Volume: totalProcured, Loss: "18%" }
  ];

  const tableDataForPdf = computedCenters
    .filter((c) => c.visible)
    .map((c) => [c.name, c.state, c.volumeProcured, c.targetVolume, `${c.progress}%`, `₹${c.avgCost}/MT`, `₹${c.freightCost}/MT`]);

  return (
    <AgribusinessLayout
      pageName="Procurement Intelligence Center"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Center Hub", "State", "Procured (MT)", "Target (MT)", "Progress", "Avg Cost", "Freight Cost"]}
    >
      <div className="space-y-6">
        
        {/* Map & Sourcing Zone Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sourcing Hubs Map */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-[#31572c]" /> Mandi & Storage Collection Centers
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active: {selectedCommodity}</span>
            </div>
            <div className="relative">
              <AgriLeafletMap circles={mapCircles} onSelectCircle={(name) => setSelectedCenter(name)} />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-1">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1 mb-1">
                  Target Progress Legend
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#1b4332]"></span>
                  <span>Target Fulfilled (&gt;90%)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#4f772d]"></span>
                  <span>On Track (70-90%)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#e07a5f]"></span>
                  <span>Critical Deficit (&lt;70%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center details panel */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/20 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black">{activeCenterData.name}</h3>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">{activeCenterData.state}</span>
              </div>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Procurement Target Progress</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ecf39e] h-full" style={{ width: `${activeCenterData.progress}%` }}></div>
                    </div>
                    <span className="font-bold shrink-0">{activeCenterData.progress}%</span>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1">Realized: {activeCenterData.volumeProcured.toLocaleString()} MT / Target: {activeCenterData.targetVolume.toLocaleString()} MT.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 p-2 rounded-xl text-[10px]">
                  <div>
                    <span className="text-gray-400 font-bold block">Avg Purchase Cost</span>
                    <span className="text-sm font-black">₹{activeCenterData.avgCost.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Transit Freight</span>
                    <span className="text-sm font-black">₹{activeCenterData.freightCost.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Logistics Flow Note</span>
                  <p className="font-semibold text-gray-150">Quality checkers report low moisture levels. Deliveries are routed straight to sorting belt unit 2.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => alert("Simulating dispatch window recalculation...")}
              className="bg-white hover:bg-gray-100 text-[#132a13] border rounded-xl py-2 text-[10px] font-bold text-center active:scale-95 transition"
            >
              Optimize Transit Schedule
            </button>
          </div>

        </div>

        {/* Pipeline Tracker & Cost Curves */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table list */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Procurement Hub Matrix</h3>
            <GenericTable
              columns={[
                { header: "Center Hub", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { header: "Procured (MT)", accessor: "volumeProcured", cell: (v) => v.toLocaleString() },
                { header: "Target (MT)", accessor: "targetVolume", cell: (v) => v.toLocaleString() },
                { 
                  header: "Progress Status", 
                  accessor: "progress", 
                  cell: (v) => (
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#31572c] h-full" style={{ width: `${v}%` }}></div>
                      </div>
                      <span className="font-bold">{v}%</span>
                    </div>
                  )
                },
                { header: "Price/MT", accessor: "avgCost", cell: (v) => `₹${v.toLocaleString()}` },
                { header: "Logistics/MT", accessor: "freightCost", cell: (v) => `₹${v.toLocaleString()}` }
              ]}
              data={computedCenters.filter((c) => c.visible)}
              showSearch={false}
              itemsPerPage={6}
              onRowClick={(row) => setSelectedCenter(row.name)}
            />
          </div>

          {/* Pipeline stages tracker chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#31572c]" /> Pipeline Delivery Flow (MT)
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Volume transitions from sowing, crop growth, harvest, collection, to arrival at storage.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="Volume" fill="#4f772d" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
