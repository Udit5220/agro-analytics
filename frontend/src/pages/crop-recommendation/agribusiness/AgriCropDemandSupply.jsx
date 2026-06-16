import React, { useState } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  MapPin,
  HelpCircle,
  FileText
} from "lucide-react";

const SUPPLY_CARDS = [
  { name: "Wheat", currentAc: "85,000 Ac", recAc: "98,000 Ac", prod: "3.2 Lakh MT", window: "Apr - May", confidence: 92 },
  { name: "Rice", currentAc: "74,000 Ac", recAc: "62,000 Ac", prod: "2.1 Lakh MT", window: "Nov - Dec", confidence: 88 },
  { name: "Cotton", currentAc: "28,000 Ac", recAc: "34,000 Ac", prod: "68,000 MT", window: "Oct - Feb", confidence: 81 },
  { name: "Maize", currentAc: "15,000 Ac", recAc: "22,000 Ac", prod: "48,000 MT", window: "Aug - Sep", confidence: 85 },
  { name: "Mustard", currentAc: "32,000 Ac", recAc: "44,000 Ac", prod: "82,000 MT", window: "Mar - Apr", confidence: 90 },
  { name: "Sugarcane", currentAc: "22,050 Ac", recAc: "18,000 Ac", prod: "8.4 Lakh MT", window: "Jan - Mar", confidence: 94 }
];

const MATRIX_DATA = [
  { crop: "Wheat", demand: 350000, supply: 320000, gap: -30000, status: "Deficit" },
  { crop: "Rice", demand: 200000, supply: 210000, gap: 10000, status: "Surplus" },
  { crop: "Cotton", demand: 60000, supply: 68000, gap: 8000, status: "Surplus" },
  { crop: "Maize", demand: 55000, supply: 48000, gap: -7000, status: "Deficit" },
  { crop: "Mustard", demand: 85000, supply: 82000, gap: -3000, status: "Deficit" },
  { crop: "Sugarcane", demand: 800000, supply: 840000, gap: 40000, status: "Surplus" }
];

const CALENDAR_DATA = [
  { crop: "Wheat", schedule: ["G", "G", "G", "H", "H", "S", "S", "G", "G", "G", "G", "G"] },
  { crop: "Rice", schedule: ["H", "H", "S", "G", "G", "G", "G", "G", "G", "H", "H", "H"] },
  { crop: "Cotton", schedule: ["G", "G", "H", "H", "S", "S", "G", "G", "G", "G", "G", "G"] },
  { crop: "Maize", schedule: ["G", "G", "S", "G", "G", "G", "H", "H", "S", "G", "G", "G"] },
  { crop: "Mustard", schedule: ["G", "G", "H", "H", "S", "S", "G", "G", "G", "G", "G", "G"] },
  { crop: "Sugarcane", schedule: ["H", "H", "H", "S", "G", "G", "G", "G", "G", "G", "G", "G"] }
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DISTRICT_SHORTAGES = [
  { district: "Ludhiana", crop: "Wheat", deficit: "-8,500 MT", risk: "Critical" },
  { district: "Bathinda", crop: "Mustard", deficit: "-2,400 MT", risk: "Moderate" },
  { district: "Karnal", crop: "Maize", deficit: "-3,800 MT", risk: "High" },
  { district: "Indore", crop: "Wheat", deficit: "-5,200 MT", risk: "High" },
  { district: "Nagpur", crop: "Pulses", deficit: "-4,100 MT", risk: "High" },
  { district: "Nuh", crop: "Wheat", deficit: "-1,800 MT", risk: "Low" }
];

export default function AgriCropDemandSupply() {
  const aiSectionConfig = {
    title: "AI Procurement Planner Suggestions",
    buttonLabel: "Optimize Sourcing Channels",
    prompt: "Based on expected deficits in wheat, maize, and mustard, suggest: 1) Alternative sourcing regions 2) Alternative crops to offset deficit 3) FPO partnerships to form."
  };

  return (
    <AgribusinessLayout
      pageName="Crop Demand & Supply Planning"
      aiSection={aiSectionConfig}
      tableDataForPdf={MATRIX_DATA.map((row) => [row.crop, row.demand.toLocaleString(), row.supply.toLocaleString(), row.gap.toLocaleString(), row.status])}
      pdfHeaders={["Crop", "Expected Demand (MT)", "Expected Supply (MT)", "Gap (MT)", "Status"]}
    >
      <div className="space-y-6">
        
        {/* Supply Forecast Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">
            Supply Forecast Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPLY_CARDS.map((crop, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <span className="text-sm font-black text-gray-900">{crop.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Window: {crop.window}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Current Acreage</span>
                      <span className="font-bold text-gray-800">{crop.currentAc}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Recommended Acreage</span>
                      <span className="font-bold text-[#31572c]">{crop.recAc}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-gray-100">
                      <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Forecast Production</span>
                      <span className="font-bold text-gray-900 text-sm">{crop.prod}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                    <span>Procurement Confidence</span>
                    <span className="text-[#31572c]">{crop.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#90a955] to-[#31572c] h-full rounded-full"
                      style={{ width: `${crop.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand vs Supply Matrix & Deficit Heatmap list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matrix table */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">
              Demand vs Supply Matrix
            </h3>
            <GenericTable
              columns={[
                { header: "Crop", accessor: "crop", className: "font-black" },
                { header: "Expected Demand (MT)", accessor: "demand", cell: (v) => v.toLocaleString() },
                { header: "Expected Supply (MT)", accessor: "supply", cell: (v) => v.toLocaleString() },
                {
                  header: "Gap (MT)",
                  accessor: "gap",
                  cell: (v) => (
                    <span className={`font-bold ${v < 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {v > 0 ? `+${v.toLocaleString()}` : v.toLocaleString()}
                    </span>
                  )
                },
                {
                  header: "Status",
                  accessor: "status",
                  cell: (v) => (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      v === "Surplus" ? "bg-emerald-50 text-emerald-750 border border-emerald-100" : "bg-red-50 text-red-750 border border-red-100"
                    }`}>
                      {v}
                    </span>
                  )
                }
              ]}
              data={MATRIX_DATA}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>

          {/* Shortages board */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Procurement Gap Dashboard
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              District-Level Deficits
            </p>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {DISTRICT_SHORTAGES.map((item, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-150 p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                  <div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#31572c]" />
                      <span className="font-bold text-gray-900">{item.district}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Crop: {item.crop}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-650 font-bold block">{item.deficit}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded mt-0.5 inline-block ${
                      item.risk === "Critical" ? "bg-red-100 text-red-800" : item.risk === "High" ? "bg-amber-100 text-amber-800" : "bg-gray-200 text-gray-700"
                    }`}>{item.risk} Risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 12-Month Crop Availability Calendar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#31572c]" /> Crop Availability Calendar
            </h3>
            <div className="flex gap-4 mt-2 text-[10px] font-bold text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-emerald-700 rounded"></span> Sowing (S)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-amber-400 rounded"></span> Growing (G)
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded"></span> Harvest (H)
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider w-32">Crop</th>
                  {MONTHS.map((m, i) => (
                    <th key={i} className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CALENDAR_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                    <td className="text-left py-3 px-3 text-xs font-bold text-gray-800">{row.crop}</td>
                    {row.schedule.map((val, mIdx) => {
                      let bgClass = "bg-gray-100 text-gray-400";
                      if (val === "S") bgClass = "bg-emerald-700 text-white font-bold";
                      if (val === "G") bgClass = "bg-amber-400 text-gray-950 font-bold";
                      if (val === "H") bgClass = "bg-orange-500 text-white font-bold";

                      return (
                        <td key={mIdx} className="p-1">
                          <div className={`text-[10px] rounded-lg py-1.5 text-center ${bgClass}`}>
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AgribusinessLayout>
  );
}
