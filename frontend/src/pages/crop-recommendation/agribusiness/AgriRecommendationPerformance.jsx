import React, { useState } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";
import {
  TrendingUp,
  Percent,
  TrendingDown,
  Layers,
  Activity,
  AlertTriangle,
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

const FUNNEL_STEPS = [
  { step: "Generated", value: 120000, pct: 100, color: "bg-[#132a13]" },
  { step: "Viewed", value: 102000, pct: 85, color: "bg-[#254325]" },
  { step: "Accepted", value: 81600, pct: 68, color: "bg-[#31572c]" },
  { step: "Implemented", value: 64800, pct: 54, color: "bg-[#4f772d]" },
  { step: "Harvested", value: 57600, pct: 48, color: "bg-[#90a955]" },
];

const FAILURE_REASONS = [
  { reason: "High Input Seed Cost", Count: 1420 },
  { reason: "Lack of Local Irrigation", Count: 1150 },
  { reason: "Credit Approval Barriers", Count: 980 },
  { reason: "Delayed Sowing Window", Count: 750 },
  { reason: "Local Market Disruption", Count: 520 },
];

const STATE_ADOPTION = [
  {
    name: "Punjab",
    crop: "Wheat",
    rate: "88%",
    yieldGain: "+18.2%",
    profitGain: "+22.5%",
  },
  {
    name: "Haryana",
    crop: "Mustard",
    rate: "84%",
    yieldGain: "+16.8%",
    profitGain: "+20.1%",
  },
  {
    name: "Madhya Pradesh",
    crop: "Soybean",
    rate: "78%",
    yieldGain: "+14.5%",
    profitGain: "+18.4%",
  },
  {
    name: "Maharashtra",
    crop: "Cotton",
    rate: "74%",
    yieldGain: "+11.2%",
    profitGain: "+14.0%",
  },
  {
    name: "Uttar Pradesh",
    crop: "Sugarcane",
    rate: "80%",
    yieldGain: "+15.8%",
    profitGain: "+19.2%",
  },
  {
    name: "Rajasthan",
    crop: "Mustard",
    rate: "72%",
    yieldGain: "+12.4%",
    profitGain: "+15.6%",
  },
];

export default function AgriRecommendationPerformance() {
  const [activeTab, setActiveTab] = useState("State");

  const aiSectionConfig = {
    title: "AI Optimization Engine Suggestions",
    buttonLabel: "Optimize Adoption Rates",
    prompt:
      "Given high dropoff between Accepted (68%) and Implemented (54%) and high seed cost failures, recommend mitigation strategies and seed distribution channel enhancements.",
  };

  return (
    <AgribusinessLayout
      pageName="Adoption & Outcome Analytics"
      aiSection={aiSectionConfig}
      tableDataForPdf={STATE_ADOPTION.map((row) => [
        row.name,
        row.crop,
        row.rate,
        row.yieldGain,
        row.profitGain,
      ])}
      pdfHeaders={[
        "Region",
        "Primary Crop",
        "Adoption Rate",
        "Yield Improvement",
        "Profit Margin Gain",
      ]}
    >
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Yield Improvement"
            value="+18.2%"
            trend="+2.1%"
            trendType="success"
            subtext="Average grower output boost"
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Revenue Improvement"
            value="+22.5%"
            trend="+3.4%"
            trendType="success"
            subtext="Corporate sourcing savings"
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Water Savings"
            value="32%"
            trend="HIGH"
            trendType="success"
            subtext="Drip compatibility gains"
            icon={<Percent className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Risk Reduction"
            value="-15.4%"
            trend="OPTIMAL"
            trendType="success"
            subtext="Pest & climate loss prevention"
            icon={<TrendingDown className="w-6 h-6 text-emerald-600" />}
          />
        </div>

        {/* Funnel & Failure analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Funnel */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#31572c]" /> Recommendation
              Funnel
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Lead Conversion Path
            </p>
            <div className="space-y-3.5">
              {FUNNEL_STEPS.map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{step.step}</span>
                    <span>
                      {step.value.toLocaleString()} ({step.pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-150 h-5 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${step.color} rounded-lg`}
                      style={{ width: `${step.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Failure reasons */}
          <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Failure
              Analysis (Farmer Count)
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Reasons Recommendations Failed
            </p>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FAILURE_REASONS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="reason" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <RechartsTooltip />
                  <Bar dataKey="Count" fill="#31572c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Adoption analytics table */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b pb-3 flex justify-between items-center">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-800" /> Regional Impact
              Metrics
            </h3>
            <div className="flex gap-2">
              {["State", "District", "Crop", "Farmer Type"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-xl transition ${
                    activeTab === tab
                      ? "bg-[#31572c] text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <GenericTable
            columns={[
              {
                header: "Region / Sourcing Cluster",
                accessor: "name",
                className: "font-black",
              },
              { header: "Key Crop", accessor: "crop" },
              {
                header: "Compliance Rate",
                accessor: "rate",
                cellClassName: "font-bold text-gray-800",
              },
              {
                header: "Yield Improvement",
                accessor: "yieldGain",
                cellClassName: "text-emerald-700 font-bold",
              },
              {
                header: "Profit Margin Gain",
                accessor: "profitGain",
                cellClassName: "text-[#31572c] font-black",
              },
            ]}
            data={STATE_ADOPTION}
            showSearch={false}
            itemsPerPage={6}
          />
        </div>
      </div>
    </AgribusinessLayout>
  );
}
