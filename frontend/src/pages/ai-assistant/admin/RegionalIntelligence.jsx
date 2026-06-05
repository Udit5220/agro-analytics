import React, { useState } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import { Chart } from "react-google-charts";
import seededData from "../../../seed-json/seededData.json";

const statsCounters = seededData.aiAssistant1.regionalStatsCounters;
const layersData = seededData.aiAssistant1.regionalLayersData;
const statePerformance = seededData.aiAssistant1.regionalStatePerformance;
const districtPerformance = seededData.aiAssistant1.regionalDistrictPerformance;
const villagePerformance = seededData.aiAssistant1.regionalVillagePerformance;
const outbreakAlerts = seededData.aiAssistant1.regionalOutbreakAlerts;

export default function RegionalIntelligence() {
  const [activeLayer, setActiveLayer] = useState("Query Density");
  const [drilldownState, setDrilldownState] = useState("India"); // India, State, District
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const mapOptions = {
    region: "IN",
    domain: "IN",
    resolution: "provinces",
    colorAxis: { colors: layersData[activeLayer].colors },
    backgroundColor: "transparent",
    datalessRegionColor: "#f1f5f9",
    defaultColor: "#f1f5f9",
  };

  const handleStateClick = (stateName) => {
    if (districtPerformance[stateName]) {
      setSelectedState(stateName);
      setDrilldownState("State");
    }
  };

  const handleDistrictClick = (districtName) => {
    if (villagePerformance[districtName]) {
      setSelectedDistrict(districtName);
      setDrilldownState("District");
    }
  };

  const resetDrilldown = () => {
    setDrilldownState("India");
    setSelectedState("");
    setSelectedDistrict("");
  };

  return (
    <div className="animate-fadeIn space-y-6 min-h-screen font-sans w-full">
      {/* Title Header without filters, state toggle, or export buttons */}
      <div className="bg-white border border-gray-200/60 p-5 rounded-2xl shadow-sm">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-955">
          Geospatial & Regional AI Intelligence
        </h1>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">
          Real-time crop heatmaps, pathogen hotspot alerts, and regional yield forecast tracking.
        </p>
      </div>

      {/* HUD Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCounters.map((item, idx) => (
          <StatsCard
            key={idx}
            title={item.title}
            value={item.value}
            trend={item.trend}
            trendType={item.trendType}
            subtext={item.subtext}
          />
        ))}
      </div>

      {/* AI Insights Outbreak Alerts */}
      <div className="bg-[#132a13] text-white rounded-2xl p-5 shadow-sm flex items-start gap-4">
        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-white">
          ðŸš¨
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-[#ecf39e]">Disease Spread Warning Feed</h4>
          <p className="text-xs text-white/90 leading-relaxed font-medium mt-1">
            **Late Blight pathogen spread models** predict spore expansion into Muktsar, Punjab within 48 hours due to north-westerly wind vectors. Dispatched immediate copper-based fungicide spray advisories to **14,500+** farmers in high-risk zones.
          </p>
        </div>
      </div>

      {/* Upgraded Map System Layer and Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Heatmap Map */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
                {layersData[activeLayer].title}
              </h3>
              <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                Click layers below to toggle map data overlay
              </p>
            </div>
          </div>

          {/* GeoChart Map Element */}
          <div className="w-full h-72 relative bg-slate-50/40 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-2">
            <Chart
              chartType="GeoChart"
              width="100%"
              height="100%"
              data={layersData[activeLayer].data}
              options={mapOptions}
            />

            {/* Legend/Status Box */}
            <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur border border-gray-200 p-2.5 rounded-xl shadow-xs font-sans text-[10px]">
              <span className="font-black text-gray-900 block">Current Layer:</span>
              <span className="text-[#31572c] font-black uppercase mt-0.5 block">{activeLayer}</span>
            </div>
          </div>

          {/* Layer Selection Buttons */}
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-50">
            {Object.keys(layersData).map((layer) => (
              <button
                key={layer}
                onClick={() => setActiveLayer(layer)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                  activeLayer === layer ? "bg-[#132a13] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>

        {/* Outbreak Alert Spread & Tracker list */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              High Risk Region Tracking
            </h3>
            <div className="space-y-3">
              {outbreakAlerts.map((alert, idx) => (
                <div key={idx} className="p-3 bg-red-50 rounded-xl border border-red-100 space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-red-900">{alert.threat}</span>
                    <span className="text-red-700 font-mono text-[10px]">{alert.id}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">{alert.region}</p>
                  <div className="text-[10px] text-red-800 leading-snug">
                    <span className="font-bold">Spread Velocity:</span> {alert.speed}
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 pt-1">
                    Action: {alert.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* State / District / Village Drilldown Simulation Table */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs font-black text-gray-955 uppercase tracking-widest">
              Interactive Drilldown Analysis: {drilldownState === "India" ? "India States" : drilldownState === "State" ? `${selectedState} Districts` : `${selectedDistrict} Villages`}
            </h3>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
              {drilldownState === "India"
                ? "Click on Maharashtra or Punjab in table below to drill down into districts."
                : drilldownState === "State"
                ? `Click on Pune or Bathinda to drill down into villages. Click reset to return to India level.`
                : `Showing village level query volumes. Click reset to return to India level.`}
            </p>
          </div>

          {drilldownState !== "India" && (
            <button
              onClick={resetDrilldown}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg border border-gray-200 transition"
            >
              â† Reset Map Drilldown
            </button>
          )}
        </div>

        {/* Rendering tables dynamically based on drilldown state */}
        {drilldownState === "India" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3">State Name</th>
                  <th className="p-3">Active Farmers</th>
                  <th className="p-3">Primary Crop</th>
                  <th className="p-3">Average CSAT Rating</th>
                  <th className="p-3">Outbreak Threat Risk</th>
                  <th className="p-3 text-right">Inquiry Resolution Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                {statePerformance.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#4f772d]/5 transition-colors">
                    <td className="p-3">
                      <button
                        onClick={() => handleStateClick(row.name)}
                        className="font-bold text-[#132a13] hover:underline cursor-pointer text-left font-sans text-xs"
                      >
                        {row.name} {districtPerformance[row.name] ? "â€º" : ""}
                      </button>
                    </td>
                    <td className="p-3 font-mono">{row.users}</td>
                    <td className="p-3">
                      <span className="bg-[#ecf39e]/40 text-[#31572c] px-2 py-0.5 rounded border border-[#ecf39e]/20 text-[10px] font-bold uppercase">
                        {row.topCrop}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{row.csat}</td>
                    <td className="p-3">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                        row.risk === "Normal" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {row.risk}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-gray-950">{row.resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {drilldownState === "State" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3">District Name</th>
                  <th className="p-3">Registered Farmers</th>
                  <th className="p-3">Primary Crop</th>
                  <th className="p-3">Outbreak Level</th>
                  <th className="p-3 text-center">IoT Active Sensors</th>
                  <th className="p-3 text-right">District Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                {districtPerformance[selectedState]?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#4f772d]/5 transition-colors">
                    <td className="p-3">
                      <button
                        onClick={() => handleDistrictClick(row.name)}
                        className="font-bold text-[#132a13] hover:underline cursor-pointer text-left font-sans text-xs"
                      >
                        {row.name} {villagePerformance[row.name] ? "â€º" : ""}
                      </button>
                    </td>
                    <td className="p-3 font-mono">{row.users}</td>
                    <td className="p-3">{row.primaryCrop}</td>
                    <td className="p-3 text-red-600 font-bold">{row.risk}</td>
                    <td className="p-3 text-center font-mono">{row.sensors}</td>
                    <td className="p-3 text-right">
                      <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                        row.status === "Stable" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : row.status === "Warning" ? "bg-amber-50 text-amber-900 border-amber-200" : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {drilldownState === "District" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-emerald-50/20 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-3">Village Name</th>
                  <th className="p-3">Active Cooperatives</th>
                  <th className="p-3">Primary Cultivated Crop</th>
                  <th className="p-3 text-right">Localized Outbreak Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold text-gray-700">
                {villagePerformance[selectedDistrict]?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#4f772d]/5 transition-colors">
                    <td className="p-3 font-bold text-gray-900">{row.name}</td>
                    <td className="p-3 font-mono">{row.users}</td>
                    <td className="p-3">{row.topCrop}</td>
                    <td className="p-3 text-right text-red-600 font-bold">{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
