import React, { useState } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import GenericTable from "../../../components/partials/GenericTable";
import {
  MapPin,
  TrendingUp,
  Award,
  Globe,
  Sparkles
} from "lucide-react";

const REGIONAL_RANKS = [
  { rank: 1, state: "Punjab", topDistrict: "Ludhiana", cropCluster: "Kharif Rice / Rabi Wheat", suitability: "94/100" },
  { rank: 2, state: "Haryana", topDistrict: "Karnal", cropCluster: "Basmati Rice / Mustard", suitability: "91/100" },
  { rank: 3, state: "Uttar Pradesh", topDistrict: "Meerut", cropCluster: "Sugarcane Belt", suitability: "89/100" },
  { rank: 4, state: "Madhya Pradesh", topDistrict: "Indore", cropCluster: "Soybean / Pulses Corridor", suitability: "85/100" },
  { rank: 5, state: "Maharashtra", topDistrict: "Nagpur", cropCluster: "Bt Cotton / Citrus Fruits", suitability: "81/100" },
  { rank: 6, state: "Rajasthan", topDistrict: "Sri Ganganagar", cropCluster: "Mustard / Pearl Millet", suitability: "78/100" }
];

const MATRIX_DATA = [
  { district: "Ludhiana", Wheat: 96, Rice: 88, Cotton: 64, Maize: 75, Mustard: 70, Sugarcane: 78 },
  { district: "Bathinda", Wheat: 89, Rice: 70, Cotton: 92, Maize: 68, Mustard: 85, Sugarcane: 45 },
  { district: "Karnal", Wheat: 94, Rice: 91, Cotton: 52, Maize: 80, Mustard: 78, Sugarcane: 82 },
  { district: "Indore", Wheat: 84, Rice: 42, Cotton: 78, Maize: 88, Mustard: 75, Sugarcane: 62 },
  { district: "Nagpur", Wheat: 62, Rice: 72, Cotton: 89, Maize: 70, Mustard: 60, Sugarcane: 70 },
  { district: "Nuh", Wheat: 78, Rice: 65, Cotton: 58, Maize: 74, Mustard: 91, Sugarcane: 50 },
  { district: "Sri Ganganagar", Wheat: 82, Rice: 50, Cotton: 85, Maize: 60, Mustard: 89, Sugarcane: 40 }
];

const EXPANSION_OPPORTUNITIES = [
  { region: "Narmada Valley, MP", crop: "Premium Soybean", acreage: "45,000 Acres", potential: "High Potential", note: "Deep black soil matches early rainfall trends." },
  { region: "Bundelkhand East, UP", crop: "Desi Chickpea", acreage: "28,000 Acres", potential: "Emerging Cluster", note: "Drought resilience allows high yields in dry seasons." },
  { region: "South Coastal, AP", crop: "Organic Maize", acreage: "35,000 Acres", potential: "High Potential", note: "Favorable water-table conditions match winter rotations." },
  { region: "Western Drylands, RJ", crop: "Hybrid Mustard", acreage: "50,000 Acres", potential: "Emerging Cluster", note: "Low groundwater consumption matches saline-tolerant seeds." }
];

export default function AgriRegionalSuitability() {
  const [selectedCrop, setSelectedCrop] = useState("Wheat");

  const aiSectionConfig = {
    title: "AI Regional Intelligence",
    buttonLabel: "Identify Expansion Zones",
    prompt: `Analyze the crop suitability matrix for districts. Suggest the top 3 expansion regions for contract farming based on soil and water compatibility.`
  };

  return (
    <AgribusinessLayout
      pageName="Regional Crop Suitability Intelligence"
      aiSection={aiSectionConfig}
      tableDataForPdf={MATRIX_DATA.map((row) => [row.district, row.Wheat, row.Rice, row.Cotton, row.Maize, row.Mustard, row.Sugarcane])}
      pdfHeaders={["District", "Wheat Score", "Rice Score", "Cotton Score", "Maize Score", "Mustard Score", "Sugarcane Score"]}
    >
      <div className="space-y-6">
        
        {/* Suitability Matrix and Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Suitability Matrix Table */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-800" /> Crop Suitability Matrix
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Suitability Score (0-100)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">District</th>
                    <th className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Wheat</th>
                    <th className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Rice</th>
                    <th className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Cotton</th>
                    <th className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Maize</th>
                    <th className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Mustard</th>
                    <th className="py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">Sugarcane</th>
                  </tr>
                </thead>
                <tbody>
                  {MATRIX_DATA.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                      <td className="text-left py-3 px-3 text-xs font-bold text-gray-800">{row.district}</td>
                      {[row.Wheat, row.Rice, row.Cotton, row.Maize, row.Mustard, row.Sugarcane].map((score, sIdx) => {
                        let colorClass = "text-red-700 bg-red-50";
                        if (score >= 85) colorClass = "text-emerald-800 bg-emerald-50 font-bold";
                        else if (score >= 70) colorClass = "text-amber-700 bg-amber-50";

                        return (
                          <td key={sIdx} className="p-1">
                            <div className={`text-xs rounded-lg py-1.5 text-center ${colorClass}`}>
                              {score}
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

          {/* Regional Rankings */}
          <div className="bg-white border border-gray-250 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#31572c]" /> Regional Rankings
            </h3>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              Top Sourcing Zones
            </p>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {REGIONAL_RANKS.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <div>
                    <span className="font-black text-gray-900">{idx + 1}. {item.state}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Top: {item.topDistrict} | {item.cropCluster}</span>
                  </div>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-lg">
                    {item.suitability}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expansion Opportunities */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-800 border-b pb-3 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-800" /> Sourcing Expansion Opportunities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPANSION_OPPORTUNITIES.map((opp, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-150 p-4 rounded-xl flex flex-col justify-between h-36">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 text-xs">{opp.region}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                      opp.potential === "High Potential" ? "bg-emerald-100 text-emerald-850" : "bg-blue-100 text-blue-800"
                    }`}>{opp.potential}</span>
                  </div>
                  <span className="text-[10px] text-[#31572c] font-bold block mt-1">Crop: {opp.crop}</span>
                  <p className="text-[10px] text-gray-500 font-semibold mt-1.5 leading-relaxed">{opp.note}</p>
                </div>
                <div className="text-[9px] text-gray-400 font-bold border-t border-gray-200/60 pt-2">
                  Target Acreage: {opp.acreage}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AgribusinessLayout>
  );
}
