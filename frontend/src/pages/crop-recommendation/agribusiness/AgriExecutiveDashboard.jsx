import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  Users,
  Sprout,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Coins,
  Percent,
  Warehouse
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
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const MOCK_DISTRICTS = [
  { name: "Ludhiana", coords: [30.901, 75.857], wheatAcreage: 45000, riceAcreage: 38000, cottonAcreage: 12000, maizeAcreage: 8000, mustardAcreage: 5000, sugarcaneAcreage: 18000, pulsesAcreage: 10000, oilseedsAcreage: 6000, adoption: 88, crop: "Wheat" },
  { name: "Bathinda", coords: [30.211, 74.945], wheatAcreage: 38000, riceAcreage: 22000, cottonAcreage: 32000, maizeAcreage: 5000, mustardAcreage: 8000, sugarcaneAcreage: 2000, pulsesAcreage: 12000, oilseedsAcreage: 11000, adoption: 82, crop: "Cotton" },
  { name: "Karnal", coords: [29.686, 76.990], wheatAcreage: 48000, riceAcreage: 42000, cottonAcreage: 1000, maizeAcreage: 9000, mustardAcreage: 4000, sugarcaneAcreage: 15000, pulsesAcreage: 8000, oilseedsAcreage: 5000, adoption: 85, crop: "Rice" },
  { name: "Indore", coords: [22.719, 75.857], wheatAcreage: 32000, riceAcreage: 5000, cottonAcreage: 15000, maizeAcreage: 22000, mustardAcreage: 12000, sugarcaneAcreage: 8000, pulsesAcreage: 28000, oilseedsAcreage: 35000, adoption: 78, crop: "Oilseeds" },
  { name: "Nagpur", coords: [21.145, 79.088], wheatAcreage: 12000, riceAcreage: 15000, cottonAcreage: 42000, maizeAcreage: 18000, mustardAcreage: 2000, sugarcaneAcreage: 14000, pulsesAcreage: 22000, oilseedsAcreage: 24000, adoption: 74, crop: "Cotton" },
  { name: "Guntur", coords: [16.306, 80.436], wheatAcreage: 2000, riceAcreage: 48000, cottonAcreage: 38000, maizeAcreage: 15000, mustardAcreage: 1000, sugarcaneAcreage: 12000, pulsesAcreage: 14000, oilseedsAcreage: 8000, adoption: 80, crop: "Rice" }
];

const CROP_COLORS = {
  Wheat: "#f5cc00",
  Rice: "#00f0ff",
  Cotton: "#ffffff",
  Maize: "#ff5722",
  Mustard: "#ffeb3b",
  Sugarcane: "#00e676",
  Pulses: "#e040fb",
  Oilseeds: "#29b6f6"
};

const COMMODITY_DISTRIBUTION = [
  { subject: "Wheat", A: 120, B: 110, fullMark: 150 },
  { subject: "Rice", A: 98, B: 130, fullMark: 150 },
  { subject: "Cotton", A: 86, B: 130, fullMark: 150 },
  { subject: "Maize", A: 99, B: 100, fullMark: 150 },
  { subject: "Mustard", A: 85, B: 90, fullMark: 150 },
  { subject: "Sugarcane", A: 65, B: 85, fullMark: 150 }
];

const OPPORTUNITY_RANKINGS = [
  { rank: 1, crop: "Mustard", index: "94/100", margin: "32%", potential: "High Potential" },
  { rank: 2, crop: "Pulses", index: "91/100", margin: "30%", potential: "High Potential" },
  { rank: 3, crop: "Wheat", index: "88/100", margin: "25%", potential: "Stable Sourcing" },
  { rank: 4, crop: "Maize", index: "85/100", margin: "28%", potential: "Emerging Cluster" }
];

const PRODUCTION_TREND = [
  { year: "2022", Output: 620 },
  { year: "2023", Output: 690 },
  { year: "2024", Output: 740 },
  { year: "2025", Output: 790 },
  { year: "2026 (Est)", Output: 850 }
];

const COVERAGE_DATA = [
  { month: "June", Coverage: 3.2 },
  { month: "July", Coverage: 3.5 },
  { month: "August", Coverage: 3.8 },
  { month: "September", Coverage: 4.2 }
];

export default function AgriExecutiveDashboard() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedDistrict, setSelectedDistrict] = useState("Ludhiana");

  // Dynamic filter multiplier based on active region/crop selectors
  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.25;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  const mapCircles = useMemo(() => {
    return MOCK_DISTRICTS.map((d) => {
      let acreageKey = `${selectedCommodity.toLowerCase()}Acreage`;
      let acreageVal = d[acreageKey] || 10000;
      let radius = acreageVal * 2.5 * zoneMultiplier;
      const cropColor = CROP_COLORS[d.crop] || "#ffea00";

      return {
        name: d.name,
        coords: d.coords,
        color: cropColor,
        radius: Math.max(radius, 15000),
        weight: d.name === selectedDistrict ? 4 : 2.5,
        tooltip: `<div class="p-2 font-sans text-xs">
          <b>${d.name}</b><br/>
          Primary Crop: ${d.crop}<br/>
          Acreage: ${(acreageVal * zoneMultiplier).toLocaleString()} Acres<br/>
          Compliance Rate: ${d.adoption}%
        </div>`
      };
    });
  }, [selectedCommodity, selectedDistrict, zoneMultiplier]);

  const kpis = [
    <StatsCard key="1" title="Total Secured Acreage" value={`${Math.round(245000 * zoneMultiplier).toLocaleString()} Acres`} trend="+8.4%" trendType="success" subtext="Under active contract" />,
    <StatsCard key="2" title="Expected Procure Volume" value={`${Math.round(520000 * zoneMultiplier).toLocaleString()} MT`} trend="+9.2%" trendType="success" subtext="Pre-booked volumes" />,
    <StatsCard key="3" title="Production Forecast" value={`${Math.round(850000 * zoneMultiplier).toLocaleString()} MT`} trend="+12.4%" trendType="success" subtext="Estimated crop yield" />,
    <StatsCard key="4" title="Supply Readiness Score" value="88%" trend="OPTIMAL" trendType="success" subtext="FPO logistics setup" />
  ];

  return (
    <AgribusinessLayout
      pageName="Executive Dashboard"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={OPPORTUNITY_RANKINGS.map((o) => [o.rank, o.crop, o.index, o.margin, o.potential])}
      pdfHeaders={["Rank", "Commodity", "Exposure Index", "Margin", "Potential"]}
    >
      <div className="space-y-6">
        
        {/* Additional 6 Secondary KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Active Growers</span>
            <span className="text-lg font-black text-gray-900 mt-1">18,400</span>
            <span className="text-[9px] text-emerald-700 font-bold mt-1">+12% YoY</span>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Active FPOs</span>
            <span className="text-lg font-black text-gray-900 mt-1">148 Hubs</span>
            <span className="text-[9px] text-emerald-700 font-bold mt-1">Stable Sourcing</span>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Exposure Index</span>
            <span className="text-lg font-black text-gray-900 mt-1">42.5%</span>
            <span className="text-[9px] text-amber-700 font-bold mt-1">Hedge Recommended</span>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Risk Exposure</span>
            <span className="text-lg font-black text-gray-900 mt-1">24/100</span>
            <span className="text-[9px] text-emerald-700 font-bold mt-1">Low Danger</span>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Revenue Opportunity</span>
            <span className="text-lg font-black text-gray-900 mt-1">₹2,450 Cr</span>
            <span className="text-[9px] text-emerald-700 font-bold mt-1">+11.2% Gain</span>
          </div>
          <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Sourcing Coverage</span>
            <span className="text-lg font-black text-gray-900 mt-1">4.2 Months</span>
            <span className="text-[9px] text-emerald-700 font-bold mt-1">Buffer Safe</span>
          </div>
        </div>

        {/* Map & Sourcing Zone Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GIS map */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#31572c]" /> India Sourcing Heatmap & Distribution
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active: {selectedCommodity}</span>
            </div>
            <div className="relative">
              <AgriLeafletMap circles={mapCircles} onSelectCircle={(name) => setSelectedDistrict(name)} />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200 z-[1000] text-gray-850 shadow-md max-w-xs space-y-1">
                <div className="text-[10px] font-black uppercase text-[#31572c] border-b pb-1 mb-1">
                  Commodity Map Legend
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#f5cc00]"></span>
                  <span>Wheat sourcing hubs</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#00f0ff]"></span>
                  <span>Rice sourcing hubs</span>
                </div>
                <div className="text-[8px] text-gray-450 font-semibold block mt-1">
                  🖱️ Click district circles to inspect contracts
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing summary info */}
          <div className="bg-gradient-to-br from-[#132a13] to-[#254325] text-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b border-white/20 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black">Sourcing District: {selectedDistrict}</h3>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">Active</span>
              </div>
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Acreage Coverage</span>
                  <p className="font-semibold text-gray-150">Optimal acreage registered under bulk contract programs (approx. 45,000 Ac wheat).</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Supply Readiness</span>
                  <p className="font-semibold text-gray-150">Logistics centers, weigh-scales, and quality control buffers are 88% ready for dispatch.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#ecf39e] font-black uppercase block tracking-wider">Risk Exposure Evaluation</span>
                  <p className="font-semibold text-gray-150">Pest alerts are minimal; groundwater reserves stable matching seasonal projections.</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] text-gray-300">
              💡 <strong>Action:</strong> Coordinate arrival windows with local Ludhiana FPO directors.
            </div>
          </div>
        </div>

        {/* Charts & Opportunity Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Commodity Sourcing Ranks</h3>
            <GenericTable
              columns={[
                { header: "Crop", accessor: "crop", className: "font-black" },
                { header: "Exposure Index", accessor: "index" },
                { header: "Expected Margin", accessor: "margin" }
              ]}
              data={OPPORTUNITY_RANKINGS}
              showSearch={false}
              itemsPerPage={4}
            />
          </div>

          {/* Production trend curve */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Production Outlook (MT)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PRODUCTION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="Output" stroke="#31572c" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Procurement coverage chart */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">Procurement Coverage (Months)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COVERAGE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="Coverage" fill="#4f772d" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </AgribusinessLayout>
  );
}
