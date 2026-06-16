import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  Warehouse,
  AlertTriangle,
  TrendingUp,
  Percent,
  CheckCircle,
  FileText,
  Compass
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
  PieChart,
  Pie,
  Cell
} from "recharts";

// List of corporate warehouse units
const WAREHOUSE_INVENTORY_DATABASE = [
  { name: "Ludhiana Mega Silo", coords: [30.901, 75.857], state: "Punjab", capacityMT: 150000, currentStockMT: 120000, bufferDays: 140, agingUnder30: 60, aging30to90: 40, agingOver90: 20, status: "Optimal" },
  { name: "Bathinda Grain Depot", coords: [30.211, 74.945], state: "Punjab", capacityMT: 100000, currentStockMT: 55000, bufferDays: 90, agingUnder30: 30, aging30to90: 15, agingOver90: 10, status: "Low Stock Alert" },
  { name: "Karnal Rice & Grain Hub", coords: [29.686, 76.990], state: "Haryana", capacityMT: 150000, currentStockMT: 135000, bufferDays: 160, agingUnder30: 80, aging30to90: 45, agingOver90: 10, status: "Optimal" },
  { name: "Indore Feed Stock Silo", coords: [22.719, 75.857], state: "Madhya Pradesh", capacityMT: 80000, currentStockMT: 72000, bufferDays: 110, agingUnder30: 30, aging30to90: 30, agingOver90: 12, status: "Overstock Alert" },
  { name: "Nagpur Oilseed Depot", coords: [21.145, 79.088], state: "Maharashtra", capacityMT: 60000, currentStockMT: 42000, bufferDays: 95, agingUnder30: 20, aging30to90: 15, agingOver90: 7, status: "Optimal" },
  { name: "Guntur Cold Storage Hub", coords: [16.306, 80.436], state: "Andhra Pradesh", capacityMT: 80000, currentStockMT: 52000, bufferDays: 85, agingUnder30: 25, aging30to90: 15, agingOver90: 12, status: "Optimal" }
];

const COLORS_PIE = ["#31572c", "#4f772d", "#90a955", "#ecf39e"];

export default function AgriInventoryIntelligence() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedSilo, setSelectedSilo] = useState("Ludhiana Mega Silo");

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.25;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  const computedInventory = useMemo(() => {
    return WAREHOUSE_INVENTORY_DATABASE.map((w) => {
      // Modify inventory calculations dynamically based on commodity selection
      let commodityCapacityFactor = 1.0;
      if (selectedCommodity === "Rice") commodityCapacityFactor = 1.1;
      if (selectedCommodity === "Mustard") commodityCapacityFactor = 0.75;
      if (selectedCommodity === "Cotton") commodityCapacityFactor = 0.85;

      const finalCapacity = Math.round(w.capacityMT * commodityCapacityFactor);
      const finalStock = Math.min(finalCapacity, Math.round(w.currentStockMT * zoneMultiplier * (commodityCapacityFactor * 0.9)));
      const pctUsed = Math.round((finalStock / finalCapacity) * 100);

      let status = "Optimal";
      if (pctUsed >= 90) status = "Overstock Alert";
      else if (pctUsed <= 40) status = "Low Stock Alert";

      // Filter by zone
      let isVisible = true;
      if (selectedZone === "North Zone" && w.state !== "Punjab" && w.state !== "Haryana") isVisible = false;
      if (selectedZone === "Central Zone" && w.state !== "Madhya Pradesh") isVisible = false;
      if (selectedZone === "West Zone" && w.state !== "Maharashtra") isVisible = false;
      if (selectedZone === "South Zone" && w.state !== "Andhra Pradesh") isVisible = false;

      return {
        ...w,
        capacityMT: finalCapacity,
        currentStockMT: finalStock,
        pctUsed,
        status,
        visible: isVisible
      };
    });
  }, [selectedCommodity, selectedZone, zoneMultiplier]);

  const mapCircles = useMemo(() => {
    return computedInventory
      .filter((w) => w.visible)
      .map((w) => {
        const warehouseColor = w.status === "Overstock Alert" ? "#e07a5f" : w.status === "Low Stock Alert" ? "#ffb703" : "#31572c";
        return {
          name: w.name,
          coords: w.coords,
          color: warehouseColor,
          radius: w.capacityMT * 0.25,
          weight: w.name === selectedSilo ? 5 : 2.5,
          tooltip: `<div class="p-2 font-sans text-xs">
            <b>Warehouse: ${w.name}</b><br/>
            Capacity: ${w.capacityMT.toLocaleString()} MT<br/>
            Current Stock: ${w.currentStockMT.toLocaleString()} MT (${w.pctUsed}% Used)<br/>
            Coverage: ${w.bufferDays} Days<br/>
            Status: <b>${w.status}</b>
          </div>`
        };
      });
  }, [computedInventory, selectedSilo]);

  const activeSiloData = useMemo(() => {
    return computedInventory.find((w) => w.name === selectedSilo) || computedInventory[0];
  }, [computedInventory, selectedSilo]);

  // Aggregate numbers
  const totalCapacity = useMemo(() => {
    return computedInventory.filter((w) => w.visible).reduce((sum, w) => sum + w.capacityMT, 0);
  }, [computedInventory]);

  const totalStock = useMemo(() => {
    return computedInventory.filter((w) => w.visible).reduce((sum, w) => sum + w.currentStockMT, 0);
  }, [computedInventory]);

  const avgCapacityUsed = useMemo(() => {
    if (totalCapacity === 0) return 0;
    return Math.round((totalStock / totalCapacity) * 100);
  }, [totalCapacity, totalStock]);

  const avgBufferCoverage = useMemo(() => {
    const visibleWarehouses = computedInventory.filter((w) => w.visible);
    if (visibleWarehouses.length === 0) return 0;
    return Math.round(visibleWarehouses.reduce((sum, w) => sum + w.bufferDays, 0) / visibleWarehouses.length);
  }, [computedInventory]);

  const activeAlerts = useMemo(() => {
    return computedInventory.filter((w) => w.visible && w.status !== "Optimal").length;
  }, [computedInventory]);

  const kpis = [
    <StatsCard
      key="1"
      title="Total Stock Reserved"
      value={`${totalStock.toLocaleString()} MT`}
      trend="+14% vs Last Month"
      trendType="success"
      subtext={`Capacity: ${totalCapacity.toLocaleString()} MT`}
    />,
    <StatsCard
      key="2"
      title="Storage Capacity Used"
      value={`${avgCapacityUsed}%`}
      trend={avgCapacityUsed >= 85 ? "HIGH UTILIZATION" : "OPTIMAL"}
      trendType={avgCapacityUsed >= 85 ? "warning" : "success"}
      subtext="Across all regional silos"
    />,
    <StatsCard
      key="3"
      title="Buffer Reserve Coverage"
      value={`${(avgBufferCoverage / 30).toFixed(1)} Months`}
      trend="SAFE BUFFER"
      trendType="success"
      subtext={`Average of ${avgBufferCoverage} days supply`}
    />,
    <StatsCard
      key="4"
      title="Warehouse Shortage Alerts"
      value={`${activeAlerts} Silos`}
      trend={activeAlerts > 0 ? "ACTION REQ" : "ALL SYSTEMS GREEN"}
      trendType={activeAlerts > 0 ? "danger" : "success"}
      subtext="Sub-40% stock levels detected"
    />
  ];

  // Stock aging chart data for active warehouse
  const agingChartData = useMemo(() => {
    const totalAging = activeSiloData.agingUnder30 + activeSiloData.aging30to90 + activeSiloData.agingOver90;
    return [
      { name: "<30 Days Aging", value: Math.round((activeSiloData.agingUnder30 / totalAging) * activeSiloData.currentStockMT) },
      { name: "30-90 Days Aging", value: Math.round((activeSiloData.aging30to90 / totalAging) * activeSiloData.currentStockMT) },
      { name: ">90 Days Aging", value: Math.round((activeSiloData.agingOver90 / totalAging) * activeSiloData.currentStockMT) }
    ];
  }, [activeSiloData]);

  // Stock utilization chart data
  const utilizationChartData = useMemo(() => {
    return computedInventory.filter((w) => w.visible).map((w) => ({
      name: w.name.replace(" Mega Silo", "").replace(" Grain Depot", "").replace(" Rice & Grain Hub", "").replace(" Feed Stock Silo", "").replace(" Oilseed Depot", "").replace(" Cold Storage Hub", ""),
      Stock: w.currentStockMT,
      FreeCapacity: w.capacityMT - w.currentStockMT
    }));
  }, [computedInventory]);

  const tableDataForPdf = computedInventory
    .filter((w) => w.visible)
    .map((w) => [w.name, w.state, w.capacityMT, w.currentStockMT, `${w.pctUsed}%`, w.bufferDays, w.status]);

  return (
    <AgribusinessLayout
      pageName="Inventory Intelligence"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Warehouse Silo", "State", "Capacity (MT)", "Current Stock (MT)", "Pct Used", "Buffer Coverage", "Status"]}
    >
      <div className="space-y-6">
        
        {/* Map & Sourcing Zone Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sourcing Warehouse Map */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Warehouse className="w-4 h-4 text-[#31572c]" /> Regional Silos & Warehouse Hubs
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Commodity: {selectedCommodity}</span>
            </div>
            <div className="relative">
              <AgriLeafletMap circles={mapCircles} onSelectCircle={(name) => setSelectedSilo(name)} />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-1">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1 mb-1">
                  Storage Status Legend
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#31572c]"></span>
                  <span>Optimal Stock (40%-90%)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#ffb703]"></span>
                  <span>Low Stock Alert (&lt;40%)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#e07a5f]"></span>
                  <span>Overstock Alert (&gt;90%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warehouse details panel */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/20 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black">{activeSiloData.name}</h3>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">{activeSiloData.state}</span>
              </div>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Capacity Utilization</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#ecf39e] h-full" style={{ width: `${activeSiloData.pctUsed}%` }}></div>
                    </div>
                    <span className="font-bold shrink-0">{activeSiloData.pctUsed}%</span>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1">Stocked: {activeSiloData.currentStockMT.toLocaleString()} MT / Total: {activeSiloData.capacityMT.toLocaleString()} MT.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 bg-white/5 border border-white/10 p-2 rounded-xl text-[10px]">
                  <div>
                    <span className="text-gray-400 font-bold block">Reserve Coverage</span>
                    <span className="text-sm font-black text-[#ecf39e]">{activeSiloData.bufferDays} Days</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block">Status Tier</span>
                    <span className="text-sm font-black">{activeSiloData.status}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Quality Operations</span>
                  <p className="font-semibold text-gray-150">Acreage contract delivery completed. Quality reports show zero pest infestation in storage units.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => alert("Re-allocating stock margins among silos...")}
              className="bg-white hover:bg-gray-100 text-[#132a13] border rounded-xl py-2 text-[10px] font-bold text-center active:scale-95 transition"
            >
              Recalibrate Buffer Hedges
            </button>
          </div>

        </div>

        {/* Silos Table & Aging chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table list */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Warehouse Silo List</h3>
            <GenericTable
              columns={[
                { header: "Silo Warehouse", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "State", accessor: "state" },
                { header: "Capacity (MT)", accessor: "capacityMT", cell: (v) => v.toLocaleString() },
                { header: "Stock (MT)", accessor: "currentStockMT", cell: (v) => v.toLocaleString() },
                { 
                  header: "Utilization", 
                  accessor: "pctUsed", 
                  cell: (v) => (
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-gray-150 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#31572c] h-full" style={{ width: `${v}%` }}></div>
                      </div>
                      <span className="font-bold">{v}%</span>
                    </div>
                  )
                },
                { header: "Buffer Coverage", accessor: "bufferDays", cell: (v) => `${v} Days` },
                { 
                  header: "Alert Status", 
                  accessor: "status", 
                  cell: (v) => {
                    const badge = v === "Overstock Alert" ? "bg-red-50 text-red-800 border-red-200" : v === "Low Stock Alert" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200";
                    return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                  }
                }
              ]}
              data={computedInventory.filter((w) => w.visible)}
              showSearch={false}
              itemsPerPage={6}
              onRowClick={(row) => setSelectedSilo(row.name)}
            />
          </div>

          {/* Warehouse aging break down pie chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#31572c]" /> {activeSiloData.name} Aging Curve
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Distribution of grain storage duration to prevent mold and quality deterioration.
            </p>
            <div className="h-48 flex justify-center items-center">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={agingChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {agingChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(v) => `${v.toLocaleString()} MT`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex flex-col justify-center w-1/2 pl-2">
                {agingChartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-[10px] font-bold text-gray-650">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS_PIE[index] }}></span>
                    <span className="truncate">{entry.name}: {Math.round((entry.value / activeSiloData.currentStockMT) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
