import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Tractor,
  Truck,
  AlertTriangle,
  Layers,
  MapPin,
  Clock,
  Bell,
  Download,
  CheckCircle,
  HelpCircle,
  Compass,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

// ------------------------------------------------------------------
// MOCK DATA (Logistics & field operations - India national scale)
// ------------------------------------------------------------------

const RESOURCE_KPI = [
  { id: "officers", label: "Field Officers", value: "1,240", sub: "Deployed: 847", trend: "success", icon: Users },
  { id: "teams", label: "Inspection Teams", value: "86", sub: "Active: 61", trend: "success", icon: Compass },
  { id: "vehicles", label: "Vehicles Available", value: "340", sub: "In use: 218", trend: "warning", icon: Truck },
  { id: "kits", label: "Emergency Resources", value: "42 kits", sub: "Deployed: 28", trend: "danger", icon: AlertTriangle }
];

const STATE_RESOURCES = [
  { state: "Uttar Pradesh", officers: 284, teams: 18, vehicles: 76, status: "Stretched" },
  { state: "Punjab", officers: 194, teams: 14, vehicles: 54, status: "Critical Shortage" },
  { state: "Madhya Pradesh", officers: 182, teams: 12, vehicles: 48, status: "Adequate" },
  { state: "Maharashtra", officers: 167, teams: 11, vehicles: 42, status: "Adequate" },
  { state: "Karnataka", officers: 112, teams: 8, vehicles: 31, status: "Adequate" },
  { state: "Odisha", officers: 98, teams: 7, vehicles: 24, status: "Stretched" },
  { state: "Bihar", officers: 84, teams: 6, vehicles: 22, status: "Critical Shortage" },
  { state: "Haryana", officers: 78, teams: 5, vehicles: 19, status: "Adequate" },
  { state: "West Bengal", officers: 72, teams: 4, vehicles: 18, status: "Adequate" },
  { state: "Chhattisgarh", officers: 54, teams: 3, vehicles: 12, status: "Stretched" }
];

const TEAM_MANAGEMENT = {
  Assigned: [
    { officer: "Dr. A. Sharma", task: "Spores Trap Check", district: "Ludhiana", crop: "Rice", due: "06 Jun", priority: "High" },
    { officer: "Sh. R. Patel", task: "Soil Wetness Profiling", district: "Gorakhpur", crop: "Wheat", due: "06 Jun", priority: "High" },
    { officer: "Smt. K. Reddy", task: "Canopy Scanning", district: "Nagpur", crop: "Cotton", due: "07 Jun", priority: "Medium" },
    { officer: "Dr. H. Singh", task: "Fungicide Spray Audit", district: "Patna", crop: "Maize", due: "07 Jun", priority: "High" },
    { officer: "Sh. V. Sen", district: "Cuttack", task: "Vector Trap Setup", crop: "Rice", due: "08 Jun", priority: "Low" }
  ],
  Completed: [
    { officer: "Dr. V. Prasad", task: "Blast Diagnostic", district: "Amritsar", crop: "Rice", due: "04 Jun", priority: "High" },
    { officer: "Sh. P. Maurya", task: "Farmer Training", district: "Bhopal", crop: "Soybean", due: "04 Jun", priority: "Medium" },
    { officer: "Smt. M. Rao", task: "Leaf Sample Collect", district: "Guntur", crop: "Cotton", due: "04 Jun", priority: "High" },
    { officer: "Dr. S. Mishra", task: "Drone Survey Set", district: "Karnal", crop: "Rice", due: "05 Jun", priority: "Medium" },
    { officer: "Sh. T. Deshmukh", district: "Indore", task: "FPO Outreach", crop: "Wheat", due: "05 Jun", priority: "Low" }
  ],
  Pending: [
    { officer: "Dr. K. Swamy", task: "Pesticide Stock Audit", district: "Mandya", crop: "Sugarcane", due: "09 Jun", priority: "Medium" },
    { officer: "Sh. N. Verma", task: "Sowing Health Check", district: "Rohtas", crop: "Rice", due: "09 Jun", priority: "High" },
    { officer: "Smt. A. Roy", task: "Spore Density Audit", district: "Nadia", crop: "Jute", due: "10 Jun", priority: "High" },
    { officer: "Dr. B. Yadav", task: "Outbreak Index Calc", district: "Agra", crop: "Potato", due: "10 Jun", priority: "Low" },
    { officer: "Sh. J. Nair", district: "Palakkad", task: "Rust Spreading Diagnostic", crop: "Rice", due: "11 Jun", priority: "Medium" }
  ]
};

const LOGISTICS_TRANSFERS = [
  { origin: "Central Depot (Delhi)", dest: "Ludhiana Regional Base", item: "Tricyclazole (1,200 Litres)", status: "In Transit" },
  { origin: "State Depot (Lucknow)", dest: "Gorakhpur Field Hub", item: "Spore Trapping Traps (50 Units)", status: "Dispatched" },
  { origin: "Bhubaneswar Hub", dest: "Cuttack Paddy Field", item: "Vector Spraying Drones (4 Units)", status: "In Transit" },
  { origin: "Mumbai Central Warehouse", dest: "Nagpur Cotton Circle", item: "PPE & Sampling Kits (200 Packs)", status: "Pending Dispatch" }
];

const PENDING_DISPATCHES = [
  { dest: "Patna, Bihar", items: "Fungicides (400 Litres)", status: "Awaiting Truck Allocation" },
  { dest: "Jaipur, Rajasthan", items: "Foliar Fertilizer (800 kg)", status: "Under Security Packing" },
  { dest: "Ambala, Haryana", items: "Vector Bio-Controls (120 Kits)", status: "Awaiting QA Sign-off" }
];

const Header = ({ title, subtitle }) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight uppercase">
          {title}
        </h1>
        <span className="text-xs font-black text-[#31572c] uppercase font-mono tracking-wider pl-3 ml-3 border-l-2 border-gray-300">
          {subtitle}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Secure Govt Network
        </span>
      </div>
    </div>
  );
};


export default function ResourceFieldOperations() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Assigned");

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (loading || !mapContainerRef.current || !window.L || mapInstanceRef.current) return;

    const map = window.L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true
    }).setView([20.5937, 78.9629], 5);

    mapInstanceRef.current = map;

    window.L.tileLayer(
      "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=Js3t7mr8sd7cdIiAAyVp",
      {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        maxZoom: 18
      }
    ).addTo(map);

    const lg = window.L.layerGroup().addTo(map);
    layerGroupRef.current = lg;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapContainerRef.current);

    // Plot states resources
    const stateCoords = [
      { name: "UP", status: "Stretched", coords: [26.8467, 80.9462] },
      { name: "Punjab", status: "Critical Shortage", coords: [31.1471, 75.3412] },
      { name: "Maharashtra", status: "Adequate", coords: [19.7515, 75.7139] },
      { name: "Karnataka", status: "Adequate", coords: [15.3173, 75.7139] },
      { name: "Odisha", status: "Stretched", coords: [20.9517, 85.0985] },
      { name: "Bihar", status: "Critical Shortage", coords: [25.0961, 85.3131] },
      { name: "MP", status: "Adequate", coords: [22.9734, 78.6569] }
    ];

    stateCoords.forEach((st) => {
      const color = st.status === "Adequate" ? "#4f772d" : st.status === "Stretched" ? "#f39c12" : "#e74c3c";
      const marker = window.L.circle(st.coords, {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 30000,
        weight: 2
      });
      marker.bindTooltip(`<b>${st.name} Allocation</b><br/>Status: ${st.status}`, { direction: "top" });
      marker.addTo(lg);
    });

    return () => {
      observer.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-14 bg-gray-200 rounded-xl mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  const getStatusChip = (status) => {
    const styles = {
      Adequate: "bg-emerald-50 text-emerald-700 border-emerald-100",
      Stretched: "bg-amber-50 text-amber-900 border-amber-200",
      "Critical Shortage": "bg-red-50 text-red-700 border-red-100",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.Adequate}`}>
        {status}
      </span>
    );
  };

  const getPriorityChip = (prio) => {
    const styles = {
      High: "bg-red-50 text-red-700 border-red-100",
      Medium: "bg-blue-50 text-blue-700 border-blue-100",
      Low: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return (
      <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold border uppercase tracking-wider ${styles[prio] || styles.Low}`}>
        {prio}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-1 flex flex-col font-sans animate-fadeIn">
      <Header title="Resource & Field Operations" subtitle="संसाधन और क्षेत्र संचालन" />

      {/* Row 1 — 4 KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {RESOURCE_KPI.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
                <div className="p-1.5 bg-[#4f772d]/10 rounded-lg text-[#31572c]">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</span>
                <span className="text-[10px] font-bold text-gray-400">{card.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 2 — Resource Allocation (full width, 2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Left Map: India map placeholder with Leaflet Satellite */}
        <div className="lg:col-span-3 bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between h-[420px]">
          <div className="flex items-center justify-between mb-2 border-b pb-2">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">State Dispatch GIS Hotspots</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Adequate
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 ml-1.5" /> Stretched
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 ml-1.5" /> Shortage
            </div>
          </div>
          <div className="flex-1 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200/50">
            <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-gray-200" />
          </div>
        </div>

        {/* Right Table: State-wise resource table */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between h-[420px]">
          <div className="p-4 border-b border-gray-100 shrink-0">
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">State-wise Resource Registry</h2>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3 pl-4">State</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3">Officers</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3">Teams</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3">Vehicles</th>
                  <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase p-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {STATE_RESOURCES.map((st, idx) => (
                  <tr key={idx} className="text-xs font-semibold text-gray-700 hover:bg-[#4f772d]/5 transition-colors border-b border-gray-100/60">
                    <td className="p-3 pl-4 font-bold text-gray-900">{st.state}</td>
                    <td className="p-3 font-mono font-bold">{st.officers}</td>
                    <td className="p-3 font-mono">{st.teams}</td>
                    <td className="p-3 font-mono">{st.vehicles}</td>
                    <td className="p-3 pr-4">{getStatusChip(st.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Management */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest">Field Team Operations</h2>
              <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-bold text-gray-600">
                {["Assigned", "Completed", "Pending"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md text-[10px] uppercase tracking-wider ${
                      activeTab === tab ? "bg-[#31572c] text-white font-extrabold" : "hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {TEAM_MANAGEMENT[activeTab].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2.5 text-xs font-semibold">
                  <div>
                    <span className="text-gray-950 font-bold">{item.officer}</span>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">Task: {item.task}</p>
                    <p className="text-[9px] text-[#31572c] mt-0.5 font-bold">📍 {item.district} ({item.crop})</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityChip(item.priority)}
                    <span className="bg-gray-100 text-gray-900 px-2 py-0.5 rounded-md font-mono text-[10px] font-black">Due: {item.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logistics Dashboard */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
          <div>
            <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-3">Logistics Dispatch Center</h2>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Resource Transfers</p>
              {LOGISTICS_TRANSFERS.map((trans, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-xs font-semibold flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <span>{trans.origin}</span>
                      <ArrowRight size={10} className="text-gray-400" />
                      <span className="text-[#31572c]">{trans.dest}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 font-bold">Item: {trans.item}</p>
                  </div>
                  <span className="text-[9px] bg-blue-50 text-blue-800 border border-blue-100 px-2 py-0.5 rounded-md font-black shrink-0">{trans.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Emergency Equipment Status</span>
              <span className="text-xs font-black text-emerald-700">94% Operational</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94%" }} />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Dispatches</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {PENDING_DISPATCHES.map((pen, idx) => (
                <div key={idx} className="bg-amber-50/50 border border-amber-100 p-2 rounded-lg">
                  <p className="text-[10px] font-black text-gray-950 truncate">{pen.dest}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5 truncate">{pen.items}</p>
                  <span className="text-[8px] text-amber-700 font-extrabold block mt-1 uppercase truncate">{pen.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — Operational Coverage (3 progress bars, full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">National Operational Coverage Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black">
              <span className="text-gray-500">State Coverage</span>
              <span className="text-[#31572c]">87%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#31572c] h-full rounded-full" style={{ width: "87%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>28 / 32 States Registered</span>
              <span>Target: 100%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black">
              <span className="text-gray-500">District Coverage</span>
              <span className="text-[#31572c]">64%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#31572c] h-full rounded-full" style={{ width: "64%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>468 / 730 Districts Managed</span>
              <span>Target: 80%</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black">
              <span className="text-gray-500">Inspection Coverage</span>
              <span className="text-[#31572c]">71%</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#31572c] h-full rounded-full" style={{ width: "71%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>3,840 / 5,420 Farms Visited</span>
              <span>Target: 90%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
