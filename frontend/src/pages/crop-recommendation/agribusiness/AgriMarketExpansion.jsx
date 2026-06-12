import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";
import {
  TrendingUp,
  MapPin,
  BarChart3,
  HelpCircle,
  Briefcase,
  Layers,
  Search
} from "lucide-react";

const MATRIX_DATA = [
  { crop: "Mustard", demand: "High", supply: "Tight", margin: "32%", potential: "94/100" },
  { crop: "Wheat", demand: "High", supply: "Stable", margin: "25%", potential: "88/100" },
  { crop: "Maize", demand: "Medium", supply: "Tight", margin: "28%", potential: "85/100" },
  { crop: "Pulses", demand: "Critical", supply: "Deficit", margin: "30%", potential: "91/100" },
  { crop: "Cotton", demand: "Medium", supply: "Surplus", margin: "18%", potential: "68/100" },
  { crop: "Rice", demand: "High", supply: "Surplus", margin: "22%", potential: "74/100" }
];

const OPPORTUNITIES = [
  { district: "Ludhiana", crop: "Wheat", acreage: 45000, revenue: 56.4, category: "High Growth" },
  { district: "Bathinda", crop: "Mustard", acreage: 38000, revenue: 42.8, category: "High Growth" },
  { district: "Karnal", crop: "Rice", acreage: 42000, revenue: 51.2, category: "High Adoption" },
  { district: "Indore", crop: "Pulses", acreage: 28000, revenue: 38.6, category: "Untapped" },
  { district: "Nagpur", crop: "Cotton", acreage: 24000, revenue: 34.5, category: "Untapped" },
  { district: "Nuh", crop: "Mustard", acreage: 28000, revenue: 28.4, category: "High Growth" }
];

export default function AgriMarketExpansion() {
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredOpportunities = useMemo(() => {
    if (filterCategory === "All") return OPPORTUNITIES;
    return OPPORTUNITIES.filter((o) => o.category === filterCategory);
  }, [filterCategory]);

  const aiSectionConfig = {
    title: "AI Expansion Recommendation Engine",
    buttonLabel: "Query Sourcing Expansion Directives",
    prompt: `For the current filter category ${filterCategory}, recommend the best district, target crops, expected contract acreage, and estimated gross revenue margins.`
  };

  return (
    <AgribusinessLayout
      pageName="Market Expansion & Opportunity Intelligence"
      aiSection={aiSectionConfig}
      tableDataForPdf={filteredOpportunities.map((row) => [row.district, row.crop, row.acreage.toLocaleString(), `₹${row.revenue} Cr`, row.category])}
      pdfHeaders={["District", "Target Crop", "Target Acreage", "Revenue Potential", "Category"]}
    >
      <div className="space-y-6">
        
        {/* Opportunity Scoreboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="High Growth Districts"
            value="14 Districts"
            trend="Active"
            trendType="success"
            subtext="Primary contract signing hubs"
            icon={<MapPin className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="High Adoption Regions"
            value="8 States"
            trend="Stable"
            trendType="success"
            subtext="Sowing compliance over 80%"
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Untapped Acreage"
            value="1.2 Lakh Acres"
            trend="+12%"
            trendType="success"
            subtext="Available contract extensions"
            icon={<Layers className="w-6 h-6 text-emerald-600" />}
          />
          <StatsCard
            title="Revenue Potential"
            value="₹450 Cr"
            trend="Estimated"
            trendType="success"
            subtext="Gross market value opportunity"
            icon={<Briefcase className="w-6 h-6 text-emerald-600" />}
          />
        </div>

        {/* Opportunities list & Crop opportunity matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sourcing Expansion Zones list */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#31572c]" /> Expansion Recommendation Engine
              </h3>
              <div className="flex gap-2">
                {["All", "High Growth", "High Adoption", "Untapped"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-xl transition ${
                      filterCategory === cat ? "bg-brand-dark text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <GenericTable
              columns={[
                { header: "District", accessor: "district", className: "font-black" },
                { header: "Target Crop", accessor: "crop" },
                { header: "Target Acreage", accessor: "acreage", cell: (v) => `${v.toLocaleString()} Ac` },
                { header: "Revenue Potential", accessor: "revenue", cell: (v) => `₹${v} Cr`, cellClassName: "font-black text-[#31572c]" },
                {
                  header: "Category",
                  accessor: "category",
                  cell: (v) => (
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      v === "High Growth" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : v === "High Adoption" ? "bg-blue-50 text-blue-800 border border-blue-100" : "bg-purple-50 text-purple-800 border border-purple-100"
                    }`}>{v}</span>
                  )
                }
              ]}
              data={filteredOpportunities}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>

          {/* Matrix board */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-800" /> Crop Opportunity Matrix
            </h3>
            <GenericTable
              columns={[
                { header: "Crop", accessor: "crop", className: "font-black" },
                { header: "Demand", accessor: "demand" },
                { header: "Margin", accessor: "margin", cellClassName: "font-bold text-gray-800" },
                { header: "Potential", accessor: "potential", cellClassName: "text-emerald-700 font-bold" }
              ]}
              data={MATRIX_DATA}
              showSearch={false}
              itemsPerPage={6}
            />
          </div>
        </div>

      </div>
    </AgribusinessLayout>
  );
}
