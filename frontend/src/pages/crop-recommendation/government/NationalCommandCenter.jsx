// NationalCommandCenter.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import GovLeafletMap from "./components/GovLeafletMap";
import { 
  Sprout, 
  TrendingUp, 
  Map as MapIcon, 
  Utensils, 
  Activity, 
  Users, 
  ShieldAlert, 
  Landmark, 
  FileText,
  AlertTriangle,
  Layers,
  Shield,
  Droplet,
  Flame,
  MousePointer
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
} from "recharts";
import { COLORS, STATE_AGRI_DATA } from "./utils/constants";
import seededData from "../../../seed-json/seededData.json";

const STATE_DETAILS = seededData.cropRecommendation1.government.nationalCommandCenter.stateDetails;

export default function NationalCommandCenter() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [activeMapLayer, setActiveMapLayer] = useState("PRODUCTION");

  // Handle dropdown state change mapping
  const activeStateName = selectedState === "All India" ? "Punjab" : selectedState;

  const selectedStateData = useMemo(() => {
    return STATE_AGRI_DATA.find((s) => s.name === activeStateName) || STATE_AGRI_DATA[0];
  }, [activeStateName]);

  const selectedStateDetails = useMemo(() => {
    return STATE_DETAILS[activeStateName] || STATE_DETAILS.Punjab;
  }, [activeStateName]);

  // Adjust coordinates/multiplier based on selectedState
  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    const stateObj = STATE_AGRI_DATA.find((s) => s.name === selectedState);
    return stateObj ? (stateObj.production / 25) : 1.0;
  }, [selectedState]);

  // Maps coordinates helper based on selected layer
  const mapCircles = useMemo(() => {
    return STATE_AGRI_DATA.map((state) => {
      let color = "#31572c";
      let radius = state.production * 11000;
      let tooltipText = `<b>${state.name}</b>`;

      if (activeMapLayer === "CLIMATE") {
        color = state.risk >= 70 ? "#ef4444" : state.risk >= 50 ? "#f97316" : "#60a5fa";
        radius = state.risk * 3500;
        tooltipText += `<br/>Climate Risk Index: ${state.risk}/100`;
      } else if (activeMapLayer === "WATER") {
        color = state.waterStress >= 80 ? "#ef4444" : state.waterStress >= 60 ? "#f97316" : "#3b82f6";
        radius = state.waterStress * 3000;
        tooltipText += `<br/>Water Stress: ${state.waterStress}%`;
      } else if (activeMapLayer === "SECURITY") {
        color = state.score >= 85 ? "#34d399" : state.score >= 75 ? "#60a5fa" : "#ef4444";
        radius = state.score * 4000;
        tooltipText += `<br/>Food Security Contrib: ${state.score}/100`;
      } else {
        // PRODUCTION
        color = "#31572c";
        radius = state.production * 7500;
        tooltipText += `<br/>Production: ${state.production}M MT`;
      }

      const isCurrentStateSelected = selectedState !== "All India" && state.name === selectedState;

      return {
        name: state.name,
        coords: state.coords,
        color,
        radius: Math.max(radius, 40000),
        weight: isCurrentStateSelected ? 6 : 2.5,
        tooltip: `<div class="p-2 font-sans text-xs">${tooltipText}</div>`,
      };
    });
  }, [activeMapLayer, selectedState]);

  const aiSectionConfig = {
    title: "AI National Command Briefing",
    buttonLabel: "Query Strategic Directives",
    prompt: `Generate an agricultural policy advisory briefing summarizing production forecasts, water conservation milestones, and food security exposure indexes for ${selectedState} (${selectedDistrict}).`,
  };

  const kpis = [
    <StatsCard
      key="1"
      title="National Production Forecast"
      value={`${Math.round(330.5 * zoneMultiplier).toLocaleString()}M MT`}
      trend="+4.8%"
      trendType="success"
      subtext="Estimated national yield output"
      icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
    />,
    <StatsCard
      key="2"
      title="Food Security Score"
      value="91 / 100"
      trend="OPTIMAL"
      trendType="success"
      subtext="Safety reserves & buffer status"
      icon={<Shield className="w-6 h-6 text-[#31572c]" />}
    />,
    <StatsCard
      key="3"
      title="Water Security Index"
      value="73 / 100"
      trend="-1.2% stress"
      trendType="danger"
      subtext="Aquifer drawdowns rate"
      icon={<Droplet className="w-6 h-6 text-[#3b82f6]" />}
    />,
    <StatsCard
      key="4"
      title="Climate Risk Index"
      value="42 / 100"
      trend="MODERATE"
      trendType="warning"
      subtext="Heat & anomaly warning levels"
      icon={<ShieldAlert className="w-6 h-6 text-[#ef4444]" />}
    />
  ];

  return (
    <GovernmentLayout
      pageName="National Command Center"
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      aiSection={aiSectionConfig}
    >
      <div className="space-y-6">
        
        {/* Additional 4 KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="National Sown Area"
            value="156.4M Ha"
            trend="+1.2% Sown"
            trendType="success"
            subtext="Baseline sown threshold"
            icon={<Sprout className="w-12 h-12 text-[#31572c]" />}
          />
          <StatsCard
            title="Digital Advisory Reach"
            value="84.2%"
            trend="2.4M SMS Pushed"
            trendType="success"
            subtext="Subscribed farming base"
            icon={<Users className="w-12 h-12 text-emerald-600" />}
          />
          <StatsCard
            title="Strategic Reserve Status"
            value="104% Cap"
            trend="Buffer Safe"
            trendType="success"
            subtext="National grain stock status"
            icon={<Shield className="w-12 h-12 text-[#31572c]" />}
          />
          <StatsCard
            title="Policy Effectiveness"
            value="88 / 100"
            trend="+4.2% Yield ROI"
            trendType="success"
            subtext="Advisory compliance rating"
            icon={<TrendingUp className="w-12 h-12 text-emerald-600" />}
          />
        </div>

        {/* Map and State Intelligence Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Map Area */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-sm font-black flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-[#31572c]" /> National Policy Decisions & GIS Map
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase">Layer:</span>
                <select
                  value={activeMapLayer}
                  onChange={(e) => setActiveMapLayer(e.target.value)}
                  className="text-xs bg-gray-50 border rounded-lg px-2.5 py-1 font-bold focus:outline-none"
                >
                  <option value="PRODUCTION">🌾 Crop Production Volume</option>
                  <option value="CLIMATE">🔥 Climate Risk Vulnerability</option>
                  <option value="WATER">💧 Water Stress Indices</option>
                  <option value="SECURITY">🛡️ Agri Security Contribution</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <GovLeafletMap 
                circles={mapCircles} 
                onSelectCircle={(name) => setSelectedState(name)}
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-2.5">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1">
                  Map Indicator Key
                </div>
                {activeMapLayer === "PRODUCTION" && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-bold text-gray-550 uppercase tracking-wider flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-[#31572c] shrink-0" />
                      <span>Crop Production Volume</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#31572c] border border-gray-300 opacity-80"></span>
                      <span>Circle Area ∝ Annual Output (M MT)</span>
                    </div>
                  </div>
                )}
                {activeMapLayer === "CLIMATE" && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-bold text-gray-550 uppercase tracking-wider flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>Climate Risk Index</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                      <span>High Risk (≥70)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#f97316]"></span>
                      <span>Medium Risk (50-70)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#60a5fa]"></span>
                      <span>Low Risk (&lt;50)</span>
                    </div>
                  </div>
                )}
                {activeMapLayer === "WATER" && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-bold text-gray-550 uppercase tracking-wider flex items-center gap-1">
                      <Droplet className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Water Stress Index</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                      <span>Critical depletion (≥80%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#f97316]"></span>
                      <span>Moderate watch (60-80%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                      <span>Sustainable (&lt;60%)</span>
                    </div>
                  </div>
                )}
                {activeMapLayer === "SECURITY" && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-bold text-gray-550 uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Agri Security Score</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#34d399]"></span>
                      <span>Optimal Secure (≥85)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#60a5fa]"></span>
                      <span>Stable (75-85)</span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold">
                      <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span>
                      <span>Vulnerable Risk (&lt;75)</span>
                    </div>
                  </div>
                )}
                <div className="text-[8px] text-gray-400 font-semibold pt-1.5 border-t border-gray-150 flex items-center gap-1">
                  <MousePointer className="w-3 h-3 text-gray-400 shrink-0" />
                  <span>Click state bubbles to reload metrics context</span>
                </div>
              </div>
            </div>
          </div>

          {/* State Intelligence Panel */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/20 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-[#ecf39e]" /> {activeStateName} Telemetry
                </h3>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  selectedStateData.status === "OPTIMAL" ? "bg-emerald-600 text-white" : selectedStateData.status === "STABLE" ? "bg-blue-600 text-white" : "bg-red-500 text-white"
                }`}>{selectedStateData.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <div className="text-[9px] text-gray-300 font-semibold uppercase tracking-wider">Production Output</div>
                  <div className="text-sm font-black text-[#ecf39e]">{selectedStateData.production}M MT</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <div className="text-[9px] text-gray-300 font-semibold uppercase tracking-wider">Sown Acreage</div>
                  <div className="text-sm font-black text-[#ecf39e]">{selectedStateData.area}M Ha</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <div className="text-[9px] text-gray-300 font-semibold uppercase tracking-wider">Water Stress</div>
                  <div className="text-sm font-black text-[#ecf39e]">{selectedStateData.waterStress}%</div>
                </div>
                <div className="bg-white/5 border border-white/10 p-2 rounded-xl">
                  <div className="text-[9px] text-gray-300 font-semibold uppercase tracking-wider">Security Score</div>
                  <div className="text-sm font-black text-[#ecf39e]">{selectedStateData.score}/100</div>
                </div>
              </div>

              <div className="space-y-3 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider mb-0.5">Focus Commodities</span>
                  <p className="text-gray-200 font-semibold">{selectedStateDetails.focusCrops}</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider mb-0.5">Water Advisories</span>
                  <p className="text-gray-200 font-semibold">{selectedStateDetails.waterIssues}</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider mb-0.5">Soil Quality Profile</span>
                  <p className="text-gray-200 font-semibold">{selectedStateDetails.soilHealth}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 text-[10px] text-gray-300 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#ecf39e]" />
              <span>Target: {selectedStateDetails.diversificationPlan}</span>
            </div>
          </div>

        </div>

        {/* State Performance Ledger & Food Security Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-800" /> Sourcing State Leaderboard & Security
              </h3>
            </div>
            <GenericTable
              columns={[
                { header: "State Name", accessor: "name", className: "font-black" },
                { header: "Production Output", accessor: "production", cell: (v) => `${v}M MT` },
                { header: "Cultivated Area", accessor: "area", cell: (v) => `${v}M Ha` },
                { header: "Water Table Stress", accessor: "waterStress", cell: (v) => `${v}/100` },
                { header: "Advisory Score", accessor: "score", cell: (v) => `${v}/100` },
                {
                  header: "Status Status",
                  accessor: "status",
                  cell: (v) => (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                      v === "OPTIMAL" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : v === "STABLE" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-red-50 text-red-700 border-red-200"
                    }`}>{v}</span>
                  ),
                },
              ]}
              data={STATE_AGRI_DATA}
              onRowClick={(row) => setSelectedState(row.name)}
              itemsPerPage={6}
            />
          </div>

          {/* Food Security Forecast */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#31572c]" /> Food Security Projections
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Cereals", Consumption: 220, Production: 245 },
                  { name: "Pulses", Consumption: 26, Production: 24 },
                  { name: "Oilseeds", Consumption: 32, Production: 29 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} label={{ value: 'M MT', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="Production" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Consumption" fill={COLORS.accentGold} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-amber-50 text-amber-950 p-3.5 border border-amber-100 rounded-xl text-[11px] font-semibold leading-relaxed flex gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Deficit Alert:</strong> Pulses & oilseeds forecast a 5M MT deficit. Dynamic support schemes are required next season.
              </span>
            </div>
          </div>

        </div>

      </div>
    </GovernmentLayout>
  );
}
