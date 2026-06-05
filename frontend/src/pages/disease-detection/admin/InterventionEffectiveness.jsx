import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  Search,
  Filter,
  Download,
  Award,
  Calendar,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  MapPin,
  TrendingDown
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function InterventionEffectiveness() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedMapLayer, setSelectedMapLayer] = useState("Campaigns");

  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Map Initialization
  useEffect(() => {
    if (loading || !mapRef.current || !window.L) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([22.5937, 78.9629], 5);

    mapInstance.current = map;

    const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp";
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
      {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
        maxZoom: 18
      }
    ).addTo(map);

    // Dynamic layers rendering representing active/contained/unprotected zones
    const campaignsZones = [
      { coords: [30.9, 75.8], name: "Punjab Rice Belt", status: "Protected", color: "#10b981", desc: "Rice Blast contained (94% coverage)" },
      { coords: [26.7, 83.3], name: "UP Wheat Cluster", status: "Active Campaign", color: "#f59e0b", desc: "Leaf Rust spray campaign ongoing" },
      { coords: [21.1, 79.0], name: "Vidarbha Cotton Pocket", status: "Unprotected High-Risk", color: "#64748b", desc: "Cotton Curl threat rising, no campaign" }
    ];

    campaignsZones.forEach(z => {
      const circle = window.L.circle(z.coords, {
        color: z.color,
        fillColor: z.color,
        fillOpacity: 0.45,
        radius: 70000,
        weight: 1.5
      }).addTo(map);
      circle.bindTooltip(`<b>${z.name}</b><br/>Status: ${z.status}<br/>${z.desc}`);
    });

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading]);

  const kpis = [
    { label: "Active Campaigns", val: "24", arrow: "↑", change: "4", status: "Healthy" },
    { label: "Farmers Reached", val: "3,42,000", arrow: "↑", change: "18%", status: "Healthy" },
    { label: "Disease Cases Prevented", val: "8,240", arrow: "↑", change: "22%", status: "Healthy" },
    { label: "Yield Saved", val: "1.8M MT", arrow: "↑", change: "14%", status: "Healthy" },
    { label: "Revenue Protected", val: "₹2,140 Cr", arrow: "↑", change: "19%", status: "Healthy" }
  ];

  const campaignTracker = [
    { name: "Rice Blast Preventive Spray", disease: "Rice Blast", region: "Ludhiana, Punjab", start: "2026-05-01", coverage: 94, reached: "18,400", reduction: 42, status: "Active" },
    { name: "BPH Emergency Quarantine", disease: "Brown Plant Hopper", region: "Cuttack, Odisha", start: "2026-04-15", coverage: 88, reached: "12,200", reduction: 35, status: "Completed" },
    { name: "Leaf Rust Fungicide Buffer", disease: "Leaf Rust", region: "Nagpur, Maharashtra", start: "2026-05-10", coverage: 75, reached: "8,400", reduction: 28, status: "At Risk" },
    { name: "Yellow Mosaic Vector Block", disease: "Yellow Mosaic", region: "Patna, Bihar", start: "2026-05-18", coverage: 62, reached: "5,800", reduction: 12, status: "At Risk" }
  ];

  // Cases Prevented: projected vs actual gap
  const casesData = [
    { name: "Day 10", Projected: 1200, Actual: 1200 },
    { name: "Day 30", Projected: 3400, Actual: 2800 },
    { name: "Day 60", Projected: 6800, Actual: 4200 },
    { name: "Day 90", Projected: 12000, Actual: 8240 }
  ];

  // Yield Impact by Crop: red (At Risk) vs green (Saved)
  const yieldImpactData = [
    { crop: "Rice", AtRisk: 1.2, Saved: 0.9 },
    { crop: "Wheat", AtRisk: 0.8, Saved: 0.6 },
    { crop: "Cotton", AtRisk: 0.5, Saved: 0.3 },
    { crop: "Maize", AtRisk: 0.3, Saved: 0.2 },
    { crop: "Pulses", AtRisk: 0.2, Saved: 0.1 }
  ];

  // ROI Dashboard campaigns table
  const roiData = [
    { campaign: "Rice Blast Prevent", cost: 12, saved: 0.9, val: 1040, roi: 866 },
    { campaign: "BPH Quarantine", cost: 8.5, saved: 0.6, val: 620, roi: 729 },
    { campaign: "Leaf Rust Buffer", cost: 5.2, saved: 0.3, val: 310, roi: 596 },
    { campaign: "Yellow Mosaic Block", cost: 3.8, saved: 0.1, val: 120, roi: 315 }
  ];

  // Impact timeline (12 months)
  const monthlyTimeline = [
    { month: "Jun 25", reached: 80000, revenue: 450, cases: 1800 },
    { month: "Sep 25", reached: 140000, revenue: 820, cases: 3200 },
    { month: "Dec 25", reached: 210000, revenue: 1240, cases: 5400 },
    { month: "Mar 26", reached: 290000, revenue: 1840, cases: 7100 },
    { month: "Jun 26", reached: 342000, revenue: 2140, cases: 8240 }
  ];

  // Top Impact Campaigns ranked list
  const topCampaigns = [
    { rank: 1, name: "Rice Blast Preventive Spray", region: "Punjab", disease: "Rice Blast", reached: "18.4K", roi: 866, outcome: "Outbreak Contained" },
    { rank: 2, name: "BPH Emergency Quarantine", region: "Odisha", disease: "Brown Hopper", reached: "12.2K", roi: 729, outcome: "Outbreak Contained" },
    { rank: 3, name: "Leaf Rust Fungicide Buffer", region: "Maharashtra", disease: "Leaf Rust", reached: "8.4K", roi: 596, outcome: "Ongoing" },
    { rank: 4, name: "Yellow Mosaic Vector Block", region: "Bihar", disease: "Yellow Mosaic", reached: "5.8K", roi: 315, outcome: "Partially Effective" }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Campaign,Target,Region,Coverage,Farmers,Reduction,Status\n" +
      campaignTracker.map(c => `"${c.name}","${c.disease}","${c.region}",${c.coverage}%,${c.reached},-${c.reduction}%,${c.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Intervention_Campaign_Tracker.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCampaigns = campaignTracker.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.disease.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-[400px] bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Hero Header Banner */}
      <div className="bg-[#132a13] rounded-2xl p-6 text-white border border-[#31572c]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="flex flex-col space-y-1.5 z-10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
            Operational Intelligence
          </span>
          <h2 className="text-xl font-black tracking-tight">
            Intervention Effectiveness Dashboard
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Row 1 — 5 Intervention KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
            <span className="text-2xl font-black text-slate-950 tracking-tight font-mono my-2">{card.val}</span>
            <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-0.5">
              {card.arrow} {card.change} <span className="text-gray-400 font-normal normal-case">vs last 30d</span>
            </span>
          </div>
        ))}
      </div>

      {/* Row 2 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[460px]">
        {/* Left: Intervention Coverage Map */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full relative">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Intervention Coverage Mapping</h3>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden text-[8px] font-black">
              {["Campaigns", "Containment", "Vulnerabilities"].map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedMapLayer(t)}
                  className={`px-2 py-1 transition ${
                    selectedMapLayer === t ? "bg-[#31572c] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div ref={mapRef} className="w-full h-[340px] rounded-xl overflow-hidden border border-gray-200 z-0" />
        </div>

        {/* Right: Campaign Tracker table */}
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Campaign Tracker</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 pr-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-bold px-2 py-1 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="At Risk">At Risk</option>
              </select>
              <button onClick={handleExportCSV} className="p-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900" title="Export Tracker">
                <Download size={13} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 scrollbar-thin">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-2.5 pl-4 text-gray-400 font-bold uppercase">Campaign</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase">Target</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase text-right">Coverage</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase text-right">Reduction</th>
                  <th className="p-2.5 text-gray-400 font-bold uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 font-semibold text-gray-700">
                    <td className="p-2.5 pl-4 font-black text-gray-950 truncate max-w-[120px]">{row.name}</td>
                    <td className="p-2.5 text-gray-500 font-mono uppercase">{row.disease.split(" ")[0]}</td>
                    <td className="p-2.5 text-right font-mono font-bold">{row.coverage}%</td>
                    <td className="p-2.5 text-right font-mono text-emerald-600 font-black">-{row.reduction}%</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                        row.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 'bg-amber-50 text-amber-900'
                      }`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[320px]">
        {/* Col 1: Cases Prevented Analytics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
              Cases Prevented Analytics
            </h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={casesData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" style={{ fontSize: "8px" }} />
                  <YAxis style={{ fontSize: "8px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                  <Area type="monotone" dataKey="Projected" stroke="#ef4444" fill="transparent" strokeDasharray="4 4" name="Projected Cases" />
                  <Area type="monotone" dataKey="Actual" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Actual Cases" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">
              Shaded gap represents disease outbreaks contained
            </p>
          </div>
        </div>

        {/* Col 2: Yield Impact by Crop */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
              Yield Saved by Crop (MT)
            </h4>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldImpactData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="crop" style={{ fontSize: "8px", fontWeight: "bold" }} />
                  <YAxis style={{ fontSize: "8px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                  <Bar dataKey="AtRisk" fill="#ef4444" name="Yield at Risk" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Saved" fill="#10b981" name="Yield Saved" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Impact Timeline */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-2">
            Intervention Impact Timeline (12 Months)
          </h4>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTimeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Line type="monotone" dataKey="reached" stroke="#4f772d" strokeWidth={2} name="Farmers Reached" />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Protected (₹Cr)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Top Impact Campaigns */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-3">
              Top Impact Campaigns (Ranked)
            </h4>
            <div className="space-y-3.5 max-h-48 overflow-y-auto scrollbar-thin">
              {topCampaigns.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="h-5 w-5 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0">
                      #{row.rank}
                    </span>
                    <div>
                      <span className="font-bold text-gray-950 block">{row.name}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">
                        {row.region} • {row.reached} reached • {row.roi}% ROI
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                    row.outcome === 'Outbreak Contained' ? 'bg-emerald-50 text-emerald-800' :
                    row.outcome === 'Ongoing' ? 'bg-blue-50 text-blue-800' : 'bg-amber-50 text-amber-900'
                  }`}>{row.outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 5 — Full Width: Economic ROI Ledger */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-5">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
            Economic ROI Ledger
          </h4>
          <span className="text-xs font-black text-emerald-705 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm font-mono">
            Overall Economic ROI: 742% ROI
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                <th className="p-3 pl-6 uppercase font-black tracking-wider text-[10px]">Campaign Name</th>
                <th className="p-3 uppercase font-black tracking-wider text-[10px] text-right">Campaign Cost</th>
                <th className="p-3 uppercase font-black tracking-wider text-[10px] text-right">Yield Saved Value</th>
                <th className="p-3 uppercase font-black tracking-wider text-[10px] text-right">ROI Percentage</th>
              </tr>
            </thead>
            <tbody>
              {roiData.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-[#4f772d]/5 transition-colors font-semibold text-gray-700">
                  <td className="p-3 pl-6 font-bold text-gray-950">{row.campaign}</td>
                  <td className="p-3 text-right font-mono">₹{row.cost} Lakh</td>
                  <td className="p-3 text-right font-mono text-emerald-600">₹{(row.cost * row.roi / 100).toFixed(1)} Lakh</td>
                  <td className="p-3 text-right font-mono font-black text-[#31572c]">{row.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
