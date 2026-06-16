import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Play,
  TrendingUp,
  MapPin,
  FileSpreadsheet,
  Plus,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

export default function GlobalDiseaseMap() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [timeframe, setTimeframe] = useState("30D");
  const [forecastTab, setForecastTab] = useState("7D");
  
  // Layer Toggles
  const [layers, setLayers] = useState({
    hotspots: true,
    density: false,
    forecast: true,
    farmer: true,
    gov: false,
    cropStress: false,
    weather: false,
    unserved: true
  });

  const [selectedDistrict, setSelectedDistrict] = useState(null);

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
    }).setView([20.5937, 78.9629], 5);

    mapInstance.current = map;

    const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp";
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
      {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
        maxZoom: 18
      }
    ).addTo(map);

    // Dynamic layers rendering
    const markers = [];

    // Hotspots Layer
    if (layers.hotspots) {
      const hotspots = [
        { coords: [30.901, 75.8573], name: "Ludhiana, Punjab", severity: "Critical", count: 184, score: 96 },
        { coords: [26.7606, 83.3732], name: "Gorakhpur, Uttar Pradesh", severity: "Critical", count: 142, score: 94 },
        { coords: [21.1458, 79.0882], name: "Nagpur, Maharashtra", severity: "High", count: 87, score: 86 }
      ];
      hotspots.forEach(h => {
        const c = window.L.circle(h.coords, {
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 0.5,
          radius: 50000,
          weight: 1.5
        }).addTo(map);
        c.bindTooltip(`<b>${h.name}</b><br/>Severity: ${h.severity}<br/>Risk: ${h.score}/100`);
        c.on("click", () => {
          setSelectedDistrict(h);
        });
        markers.push(c);
      });
    }

    // Forecast layer (Pulsing spread indicator animation simulated)
    if (layers.forecast) {
      const forecastPoints = [
        { coords: [31.2, 76.2], name: "Jalandhar Forecast Area" },
        { coords: [26.3, 82.8], name: "Basti Forecast Area" }
      ];
      forecastPoints.forEach(p => {
        const c = window.L.circle(p.coords, {
          color: "#f59e0b",
          fillColor: "#f59e0b",
          fillOpacity: 0.25,
          radius: 40000,
          weight: 1,
          dashArray: "5, 5"
        }).addTo(map);
        c.bindTooltip(`Forecast Spread: ${p.name}`);
        markers.push(c);
      });
    }

    // Farmer Reports (Blue Dots)
    if (layers.farmer) {
      const farmerPoints = [
        { coords: [20.4625, 85.883], name: "Cuttack Farmer Outpost" },
        { coords: [12.5218, 76.8973], name: "Mandya Farmer Cluster" }
      ];
      farmerPoints.forEach(p => {
        const c = window.L.circleMarker(p.coords, {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.8,
          radius: 6,
          weight: 1
        }).addTo(map);
        c.bindTooltip(`Farmer Incident: ${p.name}`);
        markers.push(c);
      });
    }

    // Unserved Regions Overlay (Gray Hatched/Translucent overlay)
    if (layers.unserved) {
      const unservedPoints = [
        { coords: [20.0, 77.0], name: "Vidarbha (Unserved High Severity)" }
      ];
      unservedPoints.forEach(p => {
        const c = window.L.circle(p.coords, {
          color: "#64748b",
          fillColor: "#64748b",
          fillOpacity: 0.2,
          radius: 80000,
          weight: 1.5,
          dashArray: "2, 2"
        }).addTo(map);
        c.bindTooltip(`<b>Unserved Region</b><br/>${p.name}`);
        markers.push(c);
      });
    }

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [loading, layers]);

  // Mock table data by timeframe
  const regionalDataByTime = {
    "7D": [
      { region: "Ludhiana, Punjab", count: 42, acreage: 3100, severity: "Critical", growth: 4, score: 91 },
      { region: "Gorakhpur, UP", count: 28, acreage: 2100, severity: "Critical", growth: 2, score: 85 },
      { region: "Nagpur, Maharashtra", count: 18, acreage: 1400, severity: "High", growth: 1, score: 80 },
      { region: "Cuttack, Odisha", count: 22, acreage: 1300, severity: "High", growth: 3, score: 82 },
      { region: "Mandya, Karnataka", count: 12, acreage: 800, severity: "Medium", growth: 0, score: 75 },
      { region: "Patna, Bihar", count: 15, acreage: 900, severity: "Medium", growth: -1, score: 71 },
      { region: "Indore, MP", count: 11, acreage: 700, severity: "Medium", growth: -2, score: 68 },
      { region: "Jaipur, Rajasthan", count: 8, acreage: 400, severity: "Low", growth: -5, score: 58 },
      { region: "Guntur, AP", count: 6, acreage: 300, severity: "Low", growth: -7, score: 52 }
    ],
    "30D": [
      { region: "Ludhiana, Punjab", count: 184, acreage: 12400, severity: "Critical", growth: 14, score: 96 },
      { region: "Gorakhpur, UP", count: 142, acreage: 9800, severity: "Critical", growth: 12, score: 94 },
      { region: "Nagpur, Maharashtra", count: 87, acreage: 6200, severity: "High", growth: 8, score: 86 },
      { region: "Cuttack, Odisha", count: 98, acreage: 5800, severity: "High", growth: 5, score: 89 },
      { region: "Mandya, Karnataka", count: 68, acreage: 4400, severity: "Medium", growth: 2, score: 84 },
      { region: "Patna, Bihar", count: 76, acreage: 3800, severity: "Medium", growth: 0, score: 78 },
      { region: "Indore, MP", count: 61, acreage: 2900, severity: "Medium", growth: -3, score: 75 },
      { region: "Jaipur, Rajasthan", count: 42, acreage: 1800, severity: "Low", growth: -8, score: 62 },
      { region: "Guntur, AP", count: 35, acreage: 1200, severity: "Low", growth: -12, score: 55 }
    ],
    "90D": [
      { region: "Ludhiana, Punjab", count: 486, acreage: 38400, severity: "Critical", growth: 28, score: 98 },
      { region: "Gorakhpur, UP", count: 382, acreage: 28000, severity: "Critical", growth: 24, score: 96 },
      { region: "Nagpur, Maharashtra", count: 240, acreage: 18400, severity: "High", growth: 18, score: 91 },
      { region: "Cuttack, Odisha", count: 284, acreage: 16200, severity: "High", growth: 15, score: 93 },
      { region: "Mandya, Karnataka", count: 195, acreage: 12100, severity: "Medium", growth: 9, score: 88 },
      { region: "Patna, Bihar", count: 210, acreage: 10400, severity: "Medium", growth: 5, score: 82 },
      { region: "Indore, MP", count: 180, acreage: 8900, severity: "Medium", growth: 2, score: 79 },
      { region: "Jaipur, Rajasthan", count: 110, acreage: 5400, severity: "Low", growth: -2, score: 68 },
      { region: "Guntur, AP", count: 95, acreage: 3800, severity: "Low", growth: -6, score: 60 }
    ]
  };

  const regionalData = regionalDataByTime[timeframe] || regionalDataByTime["30D"];

  // Bar Chart Distribution Data
  const distributionData = [
    { name: "Rice Blast", count: 230, spread: 85 },
    { name: "BPH", count: 190, spread: 92 },
    { name: "Leaf Rust", count: 120, spread: 64 },
    { name: "Yellow Mosaic", count: 90, spread: 48 },
    { name: "Late Blight", count: 75, spread: 35 },
    { name: "Sheath Blight", count: 60, spread: 21 }
  ];

  // Forecast Timeline Area Data by tab
  const areaForecastDataByTab = {
    "7D": [
      { name: "D1", area: 24000 },
      { name: "D2", area: 28000 },
      { name: "D3", area: 33000 },
      { name: "D4", area: 39000 },
      { name: "D5", area: 44000 },
      { name: "D6", area: 52000 },
      { name: "D7", area: 60000 }
    ],
    "14D": [
      { name: "D2", area: 28000 },
      { name: "D4", area: 39000 },
      { name: "D6", area: 52000 },
      { name: "D8", area: 68000 },
      { name: "D10", area: 82000 },
      { name: "D12", area: 95000 },
      { name: "D14", area: 110000 }
    ],
    "30D": [
      { name: "D3", area: 33000 },
      { name: "D6", area: 52000 },
      { name: "D9", area: 75000 },
      { name: "D12", area: 95000 },
      { name: "D15", area: 115000 },
      { name: "D18", area: 130000 },
      { name: "D21", area: 145000 },
      { name: "D24", area: 160000 },
      { name: "D27", area: 172000 },
      { name: "D30", area: 185000 }
    ]
  };

  const areaForecastData = areaForecastDataByTab[forecastTab] || areaForecastDataByTab["7D"];

  // Unserved Sales Intel List
  const salesIntel = [
    { name: "Vidarbha, Maharashtra", disease: "Cotton Leaf Curl", count: 94, farmers: "18,000", score: 92 },
    { name: "Bhiwani, Haryana", disease: "Wheat Rust", count: 68, farmers: "12,000", score: 85 },
    { name: "Kurnool, AP", disease: "Downy Mildew", count: 57, farmers: "9,500", score: 79 },
    { name: "Raichur, Karnataka", disease: "BPH Vector", count: 42, farmers: "8,100", score: 74 },
    { name: "Purnia, Bihar", disease: "Late Blight", count: 39, farmers: "7,400", score: 71 }
  ];

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Region,Count,Acreage,Severity,Growth,Score\n" +
      regionalData.map(r => `"${r.region}",${r.count},${r.acreage},"${r.severity}",${r.growth}%,${r.score}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Global_Disease_Registry_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegions = regionalData.filter(r => {
    const matchSearch = r.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = severityFilter === "All" || r.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-[450px] bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
          <div className="h-48 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">

      {/* Hero Header Banner */}
      <div className="bg-[#132a13] rounded-2xl p-6 text-white border border-[#31572c]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="flex flex-col space-y-1.5 z-10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
            Disease Geography
          </span>
          <h2 className="text-xl font-black tracking-tight">
            Global Disease Distribution Registry
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Dynamic layout split: Map dominant */}
      <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
        {/* Left Side: Map with Toggles */}
        <div className="flex-1 bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden relative flex flex-col justify-between">
          
          {/* Layer controls floating panel */}
          <div className="absolute top-3 left-3 z-10 bg-white/95 p-3.5 rounded-2xl border border-gray-200/60 shadow-lg text-[10px] font-black tracking-wider uppercase space-y-2 text-slate-800">
            <span className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5 mb-2 text-[#31572c]">
              <Layers size={13} /> Map Layers
            </span>
            {[
              { id: "hotspots", label: "Disease Hotspots (Red)", color: "border-red-500" },
              { id: "forecast", label: "Forecast Risk (Amber)", color: "border-amber-500" },
              { id: "farmer", label: "Farmer Reports (Blue)", color: "border-blue-500" },
              { id: "unserved", label: "Unserved Zones (Gray)", color: "border-slate-500" }
            ].map(l => (
              <label key={l.id} className="flex items-center space-x-2 cursor-pointer hover:text-slate-600 transition">
                <input
                  type="checkbox"
                  checked={layers[l.id]}
                  onChange={() => setLayers(prev => ({ ...prev, [l.id]: !prev[l.id] }))}
                  className="rounded text-[#31572c] focus:ring-[#31572c]"
                />
                <span className={`border-b-2 ${l.color} pb-0.5`}>{l.label}</span>
              </label>
            ))}
          </div>

          <div ref={mapRef} className="w-full h-full z-0" />

          {/* Collapsible district detail side drawer overlay */}
          {selectedDistrict && (
            <div className="absolute bottom-4 right-4 z-10 bg-white/95 border border-gray-200 shadow-xl rounded-2xl p-4 w-72 text-xs font-bold animate-fadeIn">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                <span className="font-black text-gray-900">{selectedDistrict.name}</span>
                <button onClick={() => setSelectedDistrict(null)} className="text-gray-400 hover:text-gray-600 font-black">✕</button>
              </div>
              <p className="text-gray-600">Active Disease Count: <span className="text-[#31572c] font-black">{selectedDistrict.count}</span></p>
              <p className="text-gray-600">Severity Rating: <span className="text-red-600 font-black">{selectedDistrict.severity}</span></p>
              <p className="text-gray-600">Calculated Risk Index: <span className="text-gray-900 font-mono font-black">{selectedDistrict.score}/100</span></p>
            </div>
          )}
        </div>

        {/* Right Side Panel: Regional ranking & filters */}
        <div className="w-full lg:w-96 bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 flex flex-col justify-start space-y-4">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Regional Rankings</h3>
              <div className="flex gap-2">
                {["7D", "30D", "90D"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setTimeframe(tab)}
                    className={`text-[8px] font-black px-2 py-1 rounded transition ${
                      timeframe === tab ? "bg-[#31572c] text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search regions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-bold px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
              <button onClick={handleExport} className="p-1 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900" title="Export csv">
                <Download size={13} />
              </button>
            </div>

            {/* Regional Ranking Table */}
            <div className="overflow-y-auto overflow-x-hidden flex-1 max-h-[460px] pr-1 scrollbar-thin">
              <table className="w-full text-left text-[10px] border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-2 text-gray-400 font-bold uppercase">Region</th>
                    <th className="p-2 text-gray-400 font-bold uppercase text-right">Count</th>
                    <th className="p-2 text-gray-400 font-bold uppercase text-right">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegions.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 transition-colors font-semibold text-gray-700">
                      <td className="p-2 font-black text-gray-900">{row.region}</td>
                      <td className="p-2 text-right font-mono">{row.count}</td>
                      <td className="p-2 text-right">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                          row.severity === "Critical" ? "bg-red-50 text-red-700" :
                          row.severity === "High" ? "bg-amber-50 text-amber-900" : "bg-blue-50 text-blue-800"
                        }`}>
                          {row.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Spread Forecast full width */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
            Spread Forecast
          </h4>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden text-[8px] font-black">
            {["7D", "14D", "30D"].map(t => (
              <button
                key={t}
                onClick={() => setForecastTab(t)}
                className={`px-2 py-1 transition ${
                  forecastTab === t ? "bg-[#31572c] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-44 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaForecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" style={{ fontSize: "8px" }} />
              <YAxis style={{ fontSize: "8px" }} />
              <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
              <Area type="monotone" dataKey="area" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Projected Area (Ha)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">
          Forecast window: cumulative affected acres
        </p>
      </div>

      {/* Distribution & Spread full width */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
          Distribution & Spread
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" style={{ fontSize: "9px", fontWeight: "bold" }} />
              <YAxis style={{ fontSize: "9px" }} />
              <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="count" fill="#4f772d" name="Incident Count" radius={[3, 3, 0, 0]} />
              <Bar dataKey="spread" fill="#90a955" name="Spread Rate %" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emerging Threat and Sales Intel in 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Col 1: Emerging Threat Engine */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-72">
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
              Emerging Threat Engine
            </h4>
            <div className="space-y-2.5 max-h-48 overflow-y-auto scrollbar-thin">
              {[
                { name: "Jalandhar cluster", disease: "Rice Blast", date: "03 Jun", velocity: "14% daily" },
                { name: "Basti district", disease: "BPH Vector", date: "02 Jun", velocity: "11% daily" },
                { name: "Akola pocket", disease: "Cotton Curl", date: "01 Jun", velocity: "8% daily" }
              ].map((threat, idx) => (
                <div key={idx} className="bg-red-50 border border-red-100 rounded-xl p-2.5 text-xs">
                  <div className="flex justify-between font-bold text-red-950">
                    <span>{threat.name}</span>
                    <span className="font-mono text-[9px]">{threat.date}</span>
                  </div>
                  <p className="text-[10px] text-red-900 mt-1">Disease: {threat.disease} | Spread: {threat.velocity}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase py-1.5 rounded-lg shadow transition">
              Alert Customers
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-gray-200 transition">
              Monitor
            </button>
          </div>
        </div>

        {/* Col 2: Sales Intel: Unserved Zones */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-72">
          <div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">
              Sales Intel: Unserved Zones
            </h4>
            <div className="space-y-2 max-h-44 overflow-y-auto scrollbar-thin">
              {salesIntel.map((zone, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                  <div>
                    <span className="font-bold text-slate-800 block">{zone.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {zone.disease} • {zone.farmers} Smallholders
                    </span>
                  </div>
                  <button className="bg-[#ecf39e]/80 hover:bg-[#ecf39e] text-slate-950 font-black text-[9px] uppercase px-2 py-1 rounded-lg transition active:scale-95">
                    Add Pipe
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
