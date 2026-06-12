// StrategicInterventionCenter.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Activity, Sliders, ShieldAlert, Award, Compass, Calculator, Wrench, Coins } from "lucide-react";
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
import { COLORS } from "./utils/constants";
import seededData from "../../../seed-json/seededData.json";

const INTERVENTIONS_DATABASE = seededData.cropRecommendation1.government.interventionsDatabaseStates;
const REGIONAL_PRIORITIES = seededData.cropRecommendation1.government.regionalPriorities;

export default function StrategicInterventionCenter() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  // Local state sliders for simulated budget adjustments
  const [subsidyFactor, setSubsidyFactor] = useState(50); // % budget re-allocated to crop shifts
  const [irrigationFactor, setIrrigationFactor] = useState(30); // % budget for drip mandate

  const activeStateName = selectedState === "All India" ? "Punjab" : selectedState;

  const activeIntervention = useMemo(() => {
    return INTERVENTIONS_DATABASE[activeStateName] || INTERVENTIONS_DATABASE.Punjab;
  }, [activeStateName]);

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    const isHigh = activeIntervention.priority === "High";
    return isHigh ? 1.25 : 0.9;
  }, [selectedState, activeIntervention]);

  // Dynamic calculated outputs based on simulator sliders
  const simulatedOutcome = useMemo(() => {
    const waterSavings = Math.round(parseFloat(((irrigationFactor * 0.45) + (subsidyFactor * 0.15)).toFixed(1)) * zoneMultiplier);
    const budgetTotal = Math.round(activeIntervention.budget * (subsidyFactor / 50));
    const targetAcreage = Math.round(15000 * zoneMultiplier * (subsidyFactor / 50));

    return {
      waterSavings,
      budgetTotal,
      targetAcreage
    };
  }, [subsidyFactor, irrigationFactor, activeIntervention, zoneMultiplier]);

  const kpiList = [
    <StatsCard
      key="1"
      title="High-Priority Regions"
      value="5 Clusters"
      trend="INTERVENTION DEPLOYED"
      trendType="danger"
      subtext="Requires immediate budget funding"
    />,
    <StatsCard
      key="2"
      title="Projected Water Savings"
      value={`${simulatedOutcome.waterSavings}%`}
      trend="OPTIMAL"
      trendType="success"
      subtext={`Targeting ${activeStateName} aquifers`}
    />,
    <StatsCard
      key="3"
      title="Sourcing Re-routed"
      value={`${simulatedOutcome.targetAcreage.toLocaleString()} Ha`}
      trend="+14% YoY Shift"
      trendType="success"
      subtext="Acreage shifted to pulses/millets"
    />,
    <StatsCard
      key="4"
      title="Allocated Budget"
      value={`₹${simulatedOutcome.budgetTotal.toLocaleString()} Cr`}
      trend="FUNDS APPROVED"
      trendType="success"
      subtext="Direct crop diversification grants"
    />
  ];

  const chartData = [
    { name: "Direct Crop Subsidies", value: Math.round(simulatedOutcome.budgetTotal * 0.4) },
    { name: "Drip Mandate Support", value: Math.round(simulatedOutcome.budgetTotal * (irrigationFactor / 100)) },
    { name: "Advisory Outreach", value: Math.round(simulatedOutcome.budgetTotal * 0.1) },
    { name: "FPO Cold Chain Grants", value: Math.round(simulatedOutcome.budgetTotal * 0.2) }
  ];

  const tableDataForPdf = Object.keys(INTERVENTIONS_DATABASE).map((key) => {
    const item = INTERVENTIONS_DATABASE[key];
    return [key, item.issue, item.action, item.outcome, item.priority, `₹${item.budget}Cr`];
  });

  const aiSectionConfig = {
    title: "AI Policy Intervention Advisor",
    buttonLabel: "Query Action Plan",
    prompt: `Analyze agricultural policy interventions for ${selectedState} (${selectedDistrict}). The simulated budget is ₹${simulatedOutcome.budgetTotal}Cr. Suggest crop-switching timelines, FPO incentives, and aquifer preservation protocols.`,
  };

  return (
    <GovernmentLayout
      pageName="Strategic Intervention Center"
      kpiStrip={kpiList}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["State", "Current Problem", "Directives & Action", "Expected Outcome", "Priority", "Allocated Budget"]}
    >
      <div className="space-y-6">
        
        {/* State Intervention Engine & Budget Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* AI Intervention Engine details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Wrench className="w-4.5 h-4.5 text-[#31572c]" /> AI Intervention Engine
              </h3>
              <span className={`px-2.5 py-0.5 border rounded-lg font-bold text-[9px] uppercase tracking-wider ${
                activeIntervention.priority === "High" ? "bg-red-50 text-red-800 border-red-200" : "bg-amber-50 text-amber-800 border-amber-200"
              }`}>{activeIntervention.priority} Priority</span>
            </div>
            
            <div className="space-y-4 pt-1 text-xs">
              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Sourcing State Node</span>
                <p className="font-extrabold text-gray-900">{activeStateName}</p>
              </div>

              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Current Problem</span>
                <p className="font-semibold text-gray-700">{activeIntervention.issue}</p>
              </div>

              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Root Cause Analysis</span>
                <p className="font-semibold text-gray-700">{activeIntervention.cause}</p>
              </div>

              <div className="bg-brand-dark/5 border border-[#31572c]/10 rounded-xl p-3.5 space-y-1.5">
                <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider">Recommended Action Directive</span>
                <p className="font-bold text-gray-805 leading-relaxed">{activeIntervention.action}</p>
              </div>

              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider mb-0.5">Expected Policy Outcome</span>
                <p className="font-extrabold text-emerald-800">{activeIntervention.outcome}</p>
              </div>
            </div>
          </div>

          {/* Budget Allocation Engine Simulator */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black border-b border-white/20 pb-3 flex items-center gap-1.5">
                <Coins className="w-4.5 h-4.5 text-[#ecf39e]" /> Budget Allocation Engine
              </h3>
              <p className="text-[10px] text-gray-300 font-semibold leading-relaxed mt-1">
                Calibrate subsidy levels and micro-irrigation compliance funding for {activeStateName}.
              </p>
            </div>

            <div className="space-y-4 my-2">
              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span>Crop Diversification Subsidy</span>
                  <span className="text-[#ecf39e]">{subsidyFactor}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={subsidyFactor}
                  onChange={(e) => setSubsidyFactor(parseInt(e.target.value))}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold">
                  <span>Micro-Irrigation Funding Support</span>
                  <span className="text-[#ecf39e]">{irrigationFactor}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={irrigationFactor}
                  onChange={(e) => setIrrigationFactor(parseInt(e.target.value))}
                  className="w-full accent-[#ecf39e] h-1.5 rounded-lg bg-white/10"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <span className="text-[9px] text-[#ecf39e] font-black uppercase tracking-wider block">Policy Budget Forecast</span>
              <span className="text-2xl font-black">₹{simulatedOutcome.budgetTotal} Cr</span>
              <span className="text-[10px] text-gray-300 block mt-1">Models project {simulatedOutcome.waterSavings}% aquifer preservation rate.</span>
            </div>
          </div>

          {/* Allocation distribution chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Sourcing Allocation Breakdown
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Details simulated budget splits (₹Cr) across core policy initiatives.
            </p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 'bold' }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <RechartsTooltip formatter={(v) => `₹${v} Cr`} />
                  <Bar dataKey="value" fill="#4f772d" radius={[3, 3, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 1 ? '#31572c' : index === 3 ? '#e07a5f' : '#90a955'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Priority list of regions */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black border-b pb-3">National Sourcing Risk & Priority Rankings</h3>
          <GenericTable
            columns={[
              { header: "Rank", accessor: "rank", cell: (v) => <span className="font-black text-gray-800">#{v}</span> },
              { header: "Region Sourcing Hub", accessor: "region", cellClassName: "font-black text-gray-900" },
              { 
                header: "Vulnerability Index", 
                accessor: "riskScore", 
                cell: (v) => (
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-150 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full" style={{ width: `${v}%` }}></div>
                    </div>
                    <span className="font-bold text-gray-800">{v}/100</span>
                  </div>
                )
              },
              { 
                header: "Intervention Priority", 
                accessor: "priority", 
                cell: (v) => {
                  const badge = v.includes("High") ? "bg-red-50 text-red-800 border-red-200" : "bg-amber-50 text-amber-800 border-amber-200";
                  return <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase ${badge}`}>{v}</span>;
                }
              },
              { header: "Urgent Action Directives", accessor: "actionRequired" }
            ]}
            data={REGIONAL_PRIORITIES}
            showSearch={false}
            itemsPerPage={5}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
