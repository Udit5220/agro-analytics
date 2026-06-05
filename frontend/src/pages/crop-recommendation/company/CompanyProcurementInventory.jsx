import React, { useState } from "react";
import CompanyLayout from "./components/CompanyLayout";
import CompanyLeafletMap from "./components/CompanyLeafletMap";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Warehouse, 
  Truck, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap 
} from "lucide-react";

import seededData from "../../../seed-json/seededData.json";

const {
  pipelineNodes,
  warehouseOccupancy,
  inventoryForecast,
  inventoryKpis,
  inventoryMapCircles
} = seededData.cropRecommendation1.company.procurementInventory;

// Flow pipeline nodes dataset by crop
const getPipelineNodes = (commodity) => {
  return pipelineNodes[commodity] || pipelineNodes["Wheat"];
};

// Warehouse occupancy dataset by crop
const getWarehouseOccupancy = (commodity) => {
  return warehouseOccupancy[commodity] || warehouseOccupancy["Wheat"];
};

// 180-Day inventory forecast dataset by crop
const getInventoryForecast = (commodity) => {
  return inventoryForecast[commodity] || inventoryForecast["Wheat"];
};

// KPIs data dataset by crop
const getInventoryKpis = (commodity) => {
  return inventoryKpis[commodity] || inventoryKpis["Wheat"];
};

// Map circles coordinates by crop
const getInventoryMapCircles = (commodity) => {
  return inventoryMapCircles[commodity] || inventoryMapCircles["Wheat"];
};

export default function CompanyProcurementInventory() {
  const [selectedCommodity, setSelectedCommodity] = useState(() => {
    return localStorage.getItem("company_selectedCommodity") || "Wheat";
  });
  const [selectedZone, setSelectedZone] = useState(() => {
    return localStorage.getItem("company_selectedZone") || "All India";
  });

  const handleSetCommodity = (val) => {
    setSelectedCommodity(val);
    localStorage.setItem("company_selectedCommodity", val);
  };

  const handleSetZone = (val) => {
    setSelectedZone(val);
    localStorage.setItem("company_selectedZone", val);
  };

  const pipelineNodes = getPipelineNodes(selectedCommodity);
  const fullOccupancy = getWarehouseOccupancy(selectedCommodity);
  const warehouseOccupancy = fullOccupancy.filter(w => 
    selectedZone === "All India" || w.name.includes(selectedZone)
  );

  const inventoryForecast = getInventoryForecast(selectedCommodity);
  const kpis = getInventoryKpis(selectedCommodity);

  const fullCircles = getInventoryMapCircles(selectedCommodity);
  const circles = fullCircles.filter(c => 
    selectedZone === "All India" || c.name.includes(selectedZone)
  );

  const pdfHeaders = ["Warehouse Hub", "Current Occupancy (MT)", "Total Capacity (MT)", "Utilization Rate (%)"];
  const tableDataForPdf = warehouseOccupancy.map(w => {
    const rate = w.capacity !== 0 ? (w.current / w.capacity * 100).toFixed(1) : "0.0";
    return [w.name, `${w.current.toLocaleString()} MT`, `${w.capacity.toLocaleString()} MT`, `${rate}%`];
  });

  return (
    <CompanyLayout
      pageName="Procurement & Inventory Intelligence"
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={handleSetCommodity}
      selectedZone={selectedZone}
      setSelectedZone={handleSetZone}
      pdfHeaders={pdfHeaders}
      tableDataForPdf={tableDataForPdf}
      kpiStrip={
        <>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Procurement Volume</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.volume}</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">▲ 8.4% vs target arrivals</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <Warehouse className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Warehouse Capacity</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.capacity}</span>
            <span className="text-[9px] font-bold text-slate-500 block mt-0.5">Total storage network</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Inventory Utilization</span>
            <span className="text-xl font-extrabold text-slate-900 block mt-1">{kpis.utilization} Occupancy</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Optimal safety stock verified</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden group">
            <div className="absolute right-4 top-4 bg-emerald-50 text-emerald-800 p-2 rounded-xl group-hover:scale-110 transition">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block">Logistics Readiness</span>
            <span className="text-xl font-extrabold text-emerald-700 block mt-1">{kpis.readiness} Readiness</span>
            <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Primary transport lines scheduled</span>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Procurement Flow Engine Diagram */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Procurement Supply Flow Engine</h2>
            <p className="text-[10px] font-medium text-slate-500">Live operational throughput rates across core supply chain stages</p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
            {pipelineNodes.map((node, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center text-center p-4 bg-white border border-slate-200/80 rounded-2xl w-full lg:w-48 shadow-sm hover:shadow transition-all duration-350 relative overflow-hidden group hover:border-emerald-500/30">
                  {/* Premium top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#31572c]/80 group-hover:bg-emerald-600 transition-colors duration-300" />
                  
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg mb-2 shadow-sm group-hover:scale-110 transition duration-300">
                    {node.icon}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{node.step}</span>
                  <span className="text-xs font-black text-[#132a13] mt-1">{node.rate}</span>
                </div>
                {i < pipelineNodes.length - 1 && (
                  <div className="hidden lg:flex shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm">
                    <ArrowRight className="w-4 h-4 text-emerald-700 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 180-Day Inventory Forecast Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">180-Day Stock Level Forecast</h2>
            <p className="text-[10px] font-medium text-slate-500">Projected inventory stocks (MT) vs safety levels for {selectedCommodity}</p>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} />
                <Line type="monotone" dataKey="stock" stroke="#10b981" name="Projected Stock (MT)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="safetyStock" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} name="Safety Stock Floor (MT)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Warehouse Storage Utilization */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Storage Silo Occupancy</h2>
            <p className="text-[10px] font-medium text-slate-500">Warehouse occupancy vs total rated capacity (MT)</p>
          </div>

          <div className="h-[250px] w-full">
            {warehouseOccupancy.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={warehouseOccupancy} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                  <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                  <Bar dataKey="current" fill="#10b981" name="Current Stock" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacity" fill="#cbd5e1" name="Silo Capacity" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                No silo occupancy data found for this zone.
              </div>
            )}
          </div>
        </div>

        {/* Logistics Intelligence Map */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">Logistics Routing GIS Map</h2>
            <p className="text-[10px] font-medium text-slate-500">Transport pipelines, warehousing nodes, and shipping route layers</p>
          </div>

          <CompanyLeafletMap
            activeLayer="readiness"
            circles={circles}
            markers={[
              { name: "Silo Trucking Entry Gate", coords: [30.1241, 74.8214], icon: "🚛", tooltip: "Daily flow: 85 trucks" }
            ]}
          />
        </div>

      </div>
    </CompanyLayout>
  );
}
