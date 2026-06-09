import React, { useState } from "react";
import { 
  Warehouse, 
  Map, 
  Plus, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Layers, 
  Clock,
  Sparkles,
  Search
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

export default function GovInfrastructureIntelligence() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Commissioning state
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionType, setCommissionType] = useState("Cold Storage");
  const [commissionDistrict, setCommissionDistrict] = useState("Sonipat");
  const [commissionCapacity, setCommissionCapacity] = useState(500);
  const [commissionCost, setCommissionCost] = useState(45); // in Lakhs
  const [commissionProgress, setCommissionProgress] = useState(false);
  const [commissionSuccess, setCommissionSuccess] = useState(false);

  // Asset list state
  const [assets, setAssets] = useState([
    { id: "ast-01", name: "Sonipat Central Warehouse", type: "Warehouse", location: "Sonipat", capacity: "2,500 MT", cost: "₹45 Lakh", utilization: 92, beneficiaries: 420, status: "High-Performing" },
    { id: "ast-02", name: "Karnal Food Processing Cluster", type: "Processing Unit", location: "Karnal", capacity: "500 MT/day", cost: "₹80 Lakh", utilization: 85, beneficiaries: 680, status: "High-Performing" },
    { id: "ast-03", name: "Rohtak Cold Chain Link", type: "Cold Storage", location: "Rohtak", capacity: "200 MT", cost: "₹65 Lakh", utilization: 74, beneficiaries: 210, status: "Moderate" },
    { id: "ast-04", name: "Jhajjar Solar Grid Link A", type: "Solar Installation", location: "Jhajjar", capacity: "150 kW", cost: "₹25 Lakh", utilization: 58, beneficiaries: 95, status: "Underutilized" },
    { id: "ast-05", name: "Panipat Custom Hiring Center", type: "Custom Hiring Center", location: "Panipat", capacity: "12 Tractors", cost: "₹30 Lakh", utilization: 42, beneficiaries: 180, status: "Underutilized" }
  ]);

  const columns = [
    { header: "ASSET NAME", accessor: "name", sortable: true, cell: (v) => <span className="font-bold text-gray-800">{v}</span> },
    { header: "TYPE", accessor: "type", sortable: true },
    { header: "LOCATION", accessor: "location", sortable: true },
    { header: "DESIGN CAPACITY", accessor: "capacity", sortable: true },
    { header: "UTILIZATION RATE", accessor: "utilization", sortable: true, cell: (v) => (
      <div className="flex items-center gap-2">
        <span className="font-black text-[#132a13]">{v}%</span>
        <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className={`h-full ${v >= 80 ? "bg-[#4f772d]" : v >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${v}%` }} />
        </div>
      </div>
    )},
    { header: "BENEFICIARIES", accessor: "beneficiaries", sortable: true },
    { header: "ASSET STATUS", accessor: "status", sortable: true, cell: (v) => (
      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
        v === "High-Performing" ? "bg-emerald-50 text-emerald-700" : v === "Moderate" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-650"
      }`}>{v}</span>
    )}
  ];

  const handleCommissionSubmit = (e) => {
    e.preventDefault();
    setCommissionProgress(true);
    setCommissionSuccess(false);

    setTimeout(() => {
      const newAsset = {
        id: `ast-0${assets.length + 1}`,
        name: `${commissionDistrict} Commissioned ${commissionType}`,
        type: commissionType,
        location: commissionDistrict,
        capacity: `${commissionCapacity} MT/units`,
        cost: `₹${commissionCost} Lakh`,
        utilization: 10,
        beneficiaries: 0,
        status: "Moderate"
      };

      setAssets(prev => [...prev, newAsset]);
      setCommissionProgress(false);
      setCommissionSuccess(true);
      setTimeout(() => {
        setShowCommissionModal(false);
        setCommissionSuccess(false);
      }, 1500);
    }, 1500);
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn text-[#132a13]">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-[#4f772d]" />
            Infrastructure Development Intelligence
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor state-funded physical assets, storage capacities, cold storage operations, and commission agricultural processing nodes.
          </p>
        </div>
        <button
          onClick={() => setShowCommissionModal(true)}
          className="flex items-center gap-2 bg-[#132a13] hover:bg-[#31572c] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Commission New Asset
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Funded Assets" value={assets.length.toString()} subtext="Warehouses, Cold Rooms, Processors" icon={<Warehouse className="text-[#4f772d]" />} />
        <StatsCard title="Storage Capacity" value="3,800 MT" trend="Target: 5,000 MT" trendType="success" subtext="Calculated from active grids" />
        <StatsCard title="Avg Asset Utilization" value="70.2%" trend="Idle: 2 units" trendType="danger" subtext="Across all districts" />
        <StatsCard title="Total Public Funding" value="₹2.45 Cr" subtext="Subsidies & direct investments" />
        <StatsCard title="Beneficiaries Linked" value="1,585 Farmers" subtext="Active FPO members utilizing" />
      </div>

      {/* Capacity gaps & visual layers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Capacity Analytics */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between col-span-1 lg:col-span-2">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3">State Storage Capacity & Utilization</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Warehouse Storage Capacity</span>
                  <span>2,500 MT / 92% Utilized</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#132a13] h-full" style={{ width: "92%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Cold Room Storage Capacity</span>
                  <span>200 MT / 74% Utilized</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#31572c] h-full" style={{ width: "74%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Processing Cluster Output</span>
                  <span>500 MT/day / 85% Utilized</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#4f772d] h-full" style={{ width: "85%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 bg-[#f4f7f4]/40 p-3.5 rounded-xl text-xs space-y-1">
            <p className="font-bold text-[#132a13] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#4f772d]" /> Infrastructure Gap recommendation:
            </p>
            <p className="text-gray-500 leading-normal">
              State cold storages show high utilization (95%) in Sonipat outskirts, indicating critical demand for commissioning additional pack houses in adjoining blocks.
            </p>
          </div>
        </div>

        {/* Asset status log */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm mb-3">Asset Performance Summary</h3>
            <div className="space-y-2">
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-red-800">Idle Asset Triggered</p>
                <p className="text-gray-500 font-semibold">Jhajjar Solar Grid Link A shows only 58% output. Inverter calibration required.</p>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-amber-800">Underutilized Custom Hiring Center</p>
                <p className="text-gray-500 font-semibold">Panipat Tractor Center shows only 42% booking rate. Local FPO training dispatch recommended.</p>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs space-y-1">
                <p className="font-bold text-emerald-800">Outstanding ROI Asset</p>
                <p className="text-gray-500 font-semibold">Sonipat Central Warehouse reaches 92% capacity utilization. Generating ₹1.2 Cr in member savings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-[#132a13] text-sm">Funded Asset Directory</h3>
          <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 px-3 py-1.5 rounded-xl w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full"
            />
          </div>
        </div>

        <GenericTable 
          columns={columns}
          data={filteredAssets}
          itemsPerPage={5}
          showSearch={false}
          showSort={true}
          emptyMessage="No assets found."
        />
      </div>

      {/* Commissioning Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowCommissionModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <Plus className="w-5 h-5 transform rotate-45" />
            </button>

            <h2 className="text-base font-bold text-[#132a13] mb-2">Commission New Public Asset</h2>
            <p className="text-xs text-gray-500 mb-4">Launch a new state-funded warehousing, processing, or energy asset to reduce infrastructure deficit.</p>

            {commissionSuccess ? (
              <div className="text-center py-6 space-y-3 bg-[#f4f7f4]/45 border border-[#4f772d]/10 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-gray-900 text-xs">Asset Commissioned Successfully!</h4>
                <p className="text-[10px] text-gray-500 leading-normal">
                  Added new {commissionType} proposal to {commissionDistrict} District registry for immediate release of ₹{commissionCost} Lakhs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCommissionSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Asset Category</label>
                    <select 
                      value={commissionType}
                      onChange={(e) => setCommissionType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                    >
                      <option>Warehouse</option>
                      <option>Cold Storage</option>
                      <option>Processing Unit</option>
                      <option>Custom Hiring Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Location District</label>
                    <select 
                      value={commissionDistrict}
                      onChange={(e) => setCommissionDistrict(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d] bg-white"
                    >
                      <option>Sonipat</option>
                      <option>Karnal</option>
                      <option>Panipat</option>
                      <option>Rohtak</option>
                      <option>Jhajjar</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Design Capacity (MT/units)</label>
                    <input 
                      type="number"
                      value={commissionCapacity}
                      onChange={(e) => setCommissionCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Public Subsidy Cost (₹ Lakhs)</label>
                    <input 
                      type="number"
                      value={commissionCost}
                      onChange={(e) => setCommissionCost(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4f772d]"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-[10px] text-gray-400 leading-normal font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4f772d] shrink-0" />
                  <span>By submitting this form, you authorize district engineers to dispatch construction blueprints and release mobilization funds.</span>
                </div>

                <button
                  type="submit"
                  disabled={commissionProgress}
                  className="w-full text-xs font-bold text-center py-2.5 bg-[#132a13] hover:bg-[#31572c] text-white rounded-xl transition"
                >
                  {commissionProgress ? "Commissioning..." : "Approve and Release Funds"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
