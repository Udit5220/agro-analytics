// PestDiseaseMonitor.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Bug, ShieldAlert, Activity, AlertCircle, Plus, Compass, Wrench } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell
} from "recharts";
import seededData from "../../../seed-json/seededData.json";

const OUTBREAKS_DATABASE = seededData.cropRecommendation1.government.pestDiseaseOutbreaksDatabase;

export default function PestDiseaseMonitor() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Karnataka") || selectedState.includes("Maharashtra")) return 1.2;
    return 0.85;
  }, [selectedState]);

  const activeOutbreaks = useMemo(() => {
    return OUTBREAKS_DATABASE.filter((o) => {
      if (selectedState === "All India") return true;
      return o.state === selectedState;
    });
  }, [selectedState]);

  const kpis = [
    <StatsCard 
      key="1"
      title="Active Outbreaks" 
      value={`${activeOutbreaks.length} Vectors`} 
      trend={activeOutbreaks.some(o => o.severity >= 70) ? "CRITICAL OUTBREAK" : "STABLE CONTROL"} 
      trendType={activeOutbreaks.some(o => o.severity >= 70) ? "danger" : "success"} 
      subtext="Monitored in current crop cycle" 
      icon={<Bug className="w-12 h-12 text-[#ef4444]" />} 
    />,
    <StatsCard 
      key="2"
      title="Quarantine Zones" 
      value={`${Math.round(14 * zoneMultiplier)} Districts`} 
      trend="RESTRICTION ACTIVE" 
      trendType="danger" 
      subtext="Crop dispatch isolation blocks" 
      icon={<ShieldAlert className="w-12 h-12 text-[#ef4444]" />} 
    />,
    <StatsCard 
      key="3"
      title="Bio-Pesticide Dispatches" 
      value="78% Progress" 
      trend="ON TRACK" 
      trendType="success" 
      subtext="Buffer stocks release levels" 
      icon={<Activity className="w-12 h-12 text-[#3b82f6]" />} 
    />,
    <StatsCard 
      key="4"
      title="Biosecurity Alert Status" 
      value="HIGH WATCH" 
      trend="VECTOR SURVEILLANCE ON" 
      trendType="warning" 
      subtext="FPO satellite tracking enabled" 
      icon={<AlertCircle className="w-12 h-12 text-[#f97316]" />} 
    />
  ];

  const chartData = activeOutbreaks.map((o) => ({
    name: o.crop,
    Severity: o.severity
  }));

  const tableDataForPdf = activeOutbreaks.map((o) => [o.crop, o.pathogen, `${o.severity}%`, o.location, o.advisoryAppStatus, o.status]);

  const aiSectionConfig = {
    title: "AI Biosecurity Emergency Response",
    buttonLabel: "Query Quarantine Directives",
    prompt: `Analyze active biosecurity outbreaks for ${selectedState} (${selectedDistrict}). Detail quarantine boundaries, bio-spray frequencies, and pesticide support funding.`,
  };

  return (
    <GovernmentLayout 
      pageName="Pest & Disease Monitor" 
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["Crop", "Vector pathogen", "Severity", "Location Hub", "Advisory Status", "Status Tier"]}
    >
      <div className="space-y-6">
        
        {/* Outbreak charts & details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Vector Pathogen Severity Index (%)
            </h3>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip />
                    <Bar dataKey="Severity" fill="#e07a5f" radius={[3, 3, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.Severity >= 70 ? '#ef4444' : entry.Severity >= 50 ? '#f97316' : '#31572c'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex justify-center items-center text-xs font-semibold text-gray-450 border border-dashed rounded-xl bg-gray-50/50">
                No active vector outbreaks reported in the selected state.
              </div>
            )}
          </div>

          {/* Containment Recommendations Box */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
                <Wrench className="w-4.5 h-4.5 text-[#31572c]" /> Emergency Response Containment
              </h3>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Biosecurity Quarantine Directive</span>
                  <p className="font-semibold text-gray-700">Enforce immediate 10km buffer isolation circles around active infestation coordinates to halt agricultural transits.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">FPO Digital Advisory Alerts</span>
                  <p className="font-semibold text-gray-700">Push emergency bio-spray recipes and pesticide application guides to active mobile devices in high-vulnerability blocks.</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => alert("Emergency alert pushed to 15,000+ local growers.")}
              className="bg-brand-dark hover:bg-[#132a13] text-white border rounded-xl py-2 text-[10px] font-bold text-center active:scale-95 transition"
            >
              Push Emergency App Alert
            </button>
          </div>

        </div>

        {/* Outbreak table */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black border-b pb-3 mb-4">Biosecurity Outbreaks & Quarantine Registry</h3>
          <GenericTable
            columns={[
              { header: "Crop Type", accessor: "crop", className: "font-black" },
              { header: "Infestation pathogen", accessor: "pathogen", cellClassName: "font-bold text-gray-800" },
              { 
                header: "Severity Index", 
                accessor: "severity", 
                cell: (v) => <span className={v >= 70 ? "text-red-750 font-black" : v >= 50 ? "text-orange-600 font-bold" : "text-gray-700 font-semibold"}>{v}%</span>
              },
              { header: "Outbreak Location Coordinates", accessor: "location" },
              { 
                header: "App Alert Status", 
                accessor: "advisoryAppStatus", 
                cell: (v) => (
                  <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${
                    v === "Sent" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>{v}</span>
                )
              },
              { 
                header: "Status Tier", 
                accessor: "status", 
                cell: (v) => {
                  const badge = v.includes("Critical") ? "bg-red-50 text-red-800 border-red-200" : v.includes("High") ? "bg-orange-50 text-orange-850 border-orange-200" : "bg-blue-50 text-blue-800 border-blue-200";
                  return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                }
              }
            ]}
            data={activeOutbreaks}
            showSearch={false}
            itemsPerPage={6}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
