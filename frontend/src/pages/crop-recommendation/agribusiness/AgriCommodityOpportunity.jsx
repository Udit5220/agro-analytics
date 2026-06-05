import React from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";
import {
  TrendingUp,
  BarChart3,
  Percent,
  Coins,
  ChevronRight,
  TrendingDown
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

const RANKS = [
  { rank: 1, crop: "Mustard", demand: "High", supply: "Tight", yieldTrend: "Positive", priceTrend: "+6.8%", margin: "32%" },
  { rank: 2, crop: "Wheat", demand: "High", supply: "Stable", yieldTrend: "Stable", priceTrend: "+4.2%", margin: "25%" },
  { rank: 3, crop: "Maize", demand: "Medium", supply: "Tight", yieldTrend: "Positive", priceTrend: "+5.1%", margin: "28%" },
  { rank: 4, crop: "Pulses", demand: "Critical", supply: "Deficit", yieldTrend: "Stable", priceTrend: "+8.4%", margin: "30%" },
  { rank: 5, crop: "Cotton", demand: "Medium", supply: "Surplus", yieldTrend: "Negative", priceTrend: "-1.5%", margin: "18%" },
  { rank: 6, crop: "Rice", demand: "High", supply: "Surplus", yieldTrend: "Stable", priceTrend: "+1.2%", margin: "22%" }
];

const PRICE_TRENDS = [
  { name: "Baseline", Wheat: 2275, Mustard: 5450, Maize: 2090 },
  { name: "30 Days", Wheat: 2310, Mustard: 5620, Maize: 2120 },
  { name: "90 Days", Wheat: 2390, Mustard: 5800, Maize: 2190 },
  { name: "180 Days", Wheat: 2450, Mustard: 5950, Maize: 2260 }
];

const MARGIN_DATA = [
  { crop: "Mustard", Margin: 32 },
  { crop: "Pulses", Margin: 30 },
  { crop: "Maize", Margin: 28 },
  { crop: "Wheat", Margin: 25 },
  { crop: "Rice", Margin: 22 },
  { crop: "Cotton", Margin: 18 }
];

export default function AgriCommodityOpportunity() {
  const aiSectionConfig = {
    title: "AI Commodity Intelligence",
    buttonLabel: "Query Market Forecasts",
    prompt: "Provide corporate pricing guidance based on current pricing indices and procurement margins. Focus on Mustard, Wheat, and Maize procurement windows."
  };

  return (
    <AgribusinessLayout
      pageName="Commodity Opportunity Engine"
      aiSection={aiSectionConfig}
      tableDataForPdf={RANKS.map((row) => [row.rank, row.crop, row.demand, row.supply, row.priceTrend, row.margin])}
      pdfHeaders={["Rank", "Crop", "Demand", "Supply", "Price Trend", "Expected Margin"]}
    >
      <div className="space-y-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Commodity Index"
            value="148.5"
            trend="+2.4% Up"
            trendType="success"
            subtext="Weighted spot pricing indicator"
            icon={<Coins className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Price Forecast"
            value="₹2,450 / Qtl"
            trend="Upward"
            trendType="success"
            subtext="Wheat projected average price"
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Demand Score"
            value="88/100"
            trend="HIGH"
            trendType="success"
            subtext="Processing volume requirements"
            icon={<BarChart3 className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Margin Potential"
            value="28.5%"
            trend="+1.2%"
            trendType="success"
            subtext="Net corporate profit margin"
            icon={<Percent className="w-6 h-6 text-[#31572c]" />}
          />
        </div>

        {/* Price forecasts & Margin graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">
              Future Price Forecast (₹ / Qtl)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PRICE_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="Mustard" stroke="#31572c" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Wheat" stroke="#90a955" strokeWidth={2} />
                  <Line type="monotone" dataKey="Maize" stroke="#d4a373" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Margin chart */}
          <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">
              Margin Forecast Dashboard (%)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MARGIN_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="crop" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <RechartsTooltip />
                  <Bar dataKey="Margin" fill="#31572c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ranks Table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-800 border-b pb-3">
            Commodity Ranking Board
          </h3>
          <GenericTable
            columns={[
              { header: "Rank", accessor: "rank", className: "font-black w-16" },
              { header: "Crop", accessor: "crop", className: "font-black" },
              { header: "Demand Status", accessor: "demand" },
              { header: "Supply Volume", accessor: "supply" },
              { header: "Yield Trajectory", accessor: "yieldTrend" },
              {
                header: "Price Trend Forecast",
                accessor: "priceTrend",
                cell: (v) => (
                  <span className={`font-bold ${v.startsWith("+") ? "text-emerald-700" : "text-red-650"}`}>
                    {v}
                  </span>
                )
              },
              { header: "Projected Margin", accessor: "margin", cellClassName: "font-bold text-gray-900" }
            ]}
            data={RANKS}
            showSearch={false}
            itemsPerPage={6}
          />
        </div>

      </div>
    </AgribusinessLayout>
  );
}
