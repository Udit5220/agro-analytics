// CropIntelligence.jsx
import React, { useState, useMemo } from "react";
import GovernmentLayout from "./components/GovernmentLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { Layers, Sprout, TrendingUp, Activity, Plus, Compass } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { COLORS } from "./utils/constants";
import seededData from "../../../seed-json/seededData.json";

const { baseLedger, baseChartData, cropShifts } = seededData.cropRecommendation1.government.cropIntelligence;

export default function CropIntelligence() {
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const zoneMultiplier = useMemo(() => {
    if (selectedState === "All India") return 1.0;
    if (selectedState.includes("Punjab") || selectedState.includes("Haryana") || selectedState.includes("Uttar Pradesh")) return 1.25;
    return 0.85;
  }, [selectedState]);

  const computedLedger = useMemo(() => {
    return baseLedger.map(row => {
      let valStr = "";
      if (row.valueType === "Lakh Cr") {
        valStr = `₹${(row.baseValue * zoneMultiplier).toFixed(1)} Lakh Cr`;
      } else {
        valStr = `₹${((row.baseValue * zoneMultiplier) / 10000).toFixed(1)}K Cr`;
      }
      return {
        crop: row.crop,
        area: (row.baseArea * zoneMultiplier).toFixed(1),
        yield: row.yield,
        production: (row.baseProduction * zoneMultiplier).toFixed(1),
        value: valStr,
        growth: row.growth
      };
    });
  }, [zoneMultiplier]);

  const composedChartData = useMemo(() => {
    return baseChartData.map(row => ({
      name: row.name,
      area: parseFloat((row.baseArea * zoneMultiplier).toFixed(1)),
      yield: row.yield
    }));
  }, [zoneMultiplier]);

  const kpis = [
    <StatsCard 
      key="1"
      title="Total Crop Area" 
      value={`${(156.4 * zoneMultiplier).toFixed(1)}M Ha`} 
      subtext="Cultivated national acreage" 
      icon={<Layers className="w-12 h-12" />} 
    />,
    <StatsCard 
      key="2"
      title="Active Crop Varieties" 
      value="28 Types" 
      subtext="Cereals, pulses, and oilseeds" 
      icon={<Sprout className="w-12 h-12" />} 
    />,
    <StatsCard 
      key="3"
      title="Yield Forecast Avg" 
      value="2.1 T/Ha" 
      subtext="National base standard" 
      icon={<Activity className="w-12 h-12" />} 
    />,
    <StatsCard 
      key="4"
      title="Diversification Index" 
      value="74 / 100" 
      trend="STEADY RISE"
      trendType="success"
      subtext="Shift to high-margin pulses" 
      icon={<TrendingUp className="w-12 h-12" />} 
    />
  ];

  const pdfData = computedLedger.map((row) => [row.crop, `${row.area}M Ha`, `${row.yield}q/ha`, `${row.production}M MT`, row.value, row.growth]);

  return (
    <GovernmentLayout 
      pageName="National Crop Intelligence Center" 
      kpiStrip={kpis}
      selectedState={selectedState}
      setSelectedState={setSelectedState}
      selectedDistrict={selectedDistrict}
      setSelectedDistrict={setSelectedDistrict}
      tableDataForPdf={pdfData}
      pdfHeaders={["Crop Type", "Acreage (Ha)", "Yield", "Production", "Value", "CAGR %"]}
    >
      <div className="space-y-6">
        
        {/* Acreage composed chart & Switch intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-[#31572c]" /> Sown Acreage & Realized Yield Trends
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={composedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 9 }} label={{ value: 'Area (M Ha)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9 }} label={{ value: 'Yield (T/Ha)', angle: 90, position: 'insideRight' }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar yAxisId="left" dataKey="area" name="Sown Area" fill={COLORS.primaryLight} radius={[3, 3, 0, 0]} />
                  <Line yAxisId="right" type="monotone" name="Yield (T/Ha)" dataKey="yield" stroke={COLORS.accentGold} strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Switch Intelligence panel */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black border-b pb-3 flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-[#31572c]" /> Crop Shift Intelligence
            </h3>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              Tracking positive acreage migrations toward resource-protective commodities.
            </p>
            <div className="space-y-4 pt-1">
              {cropShifts.map((c, i) => (
                <div key={i} className="border-l-4 border-l-[#4f772d] pl-3 py-1 space-y-0.5">
                  <div className="flex justify-between text-xs font-black text-gray-900">
                    <span>{c.name}</span>
                    <span className={`font-black ${c.color}`}>{c.pct > 0 ? `+${c.pct}%` : `${c.pct}%`}</span>
                  </div>
                  <div className="text-[9px] font-bold text-gray-450 uppercase">{c.trend}</div>
                  <p className="text-[10px] text-gray-500 leading-normal">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Cultivation Ledger */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-black border-b pb-3 mb-4">Crop Cultivation Ledger</h3>
          <GenericTable
            columns={[
              { header: "Crop Type", accessor: "crop", className: "font-black" },
              { header: "National Area", accessor: "area", cell: (v) => `${v}M Ha` },
              { header: "Yield Average", accessor: "yield", cell: (v) => `${v} q/ha` },
              { header: "Production Output", accessor: "production", cell: (v) => `${v}M MT` },
              { header: "Estimated Value", accessor: "value", cellClassName: "font-bold text-gray-700" },
              { 
                header: "3-Season CAGR", 
                accessor: "growth", 
                cell: (v) => <span className={v.startsWith("+") ? "text-emerald-600 font-black" : "text-red-650 font-black"}>{v}</span> 
              },
            ]}
            data={computedLedger}
            showSearch={false}
            itemsPerPage={5}
          />
        </div>

      </div>
    </GovernmentLayout>
  );
}
