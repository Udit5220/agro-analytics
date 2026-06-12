import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  Mail,
  Phone,
  User,
  Sliders,
  TrendingUp,
  TrendingDown,
  Calendar,
  X,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ReferenceArea
} from "recharts";

export default function CustomerRiskMonitor() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [selectedCust, setSelectedCust] = useState(null);

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

    // Customer markers
    const customers = [
      { coords: [30.9, 75.8], name: "Punjab Grain Growers FPO", type: "FPO", risk: "Critical", outbreaks: 12, login: "2h ago" },
      { coords: [26.7, 83.3], name: "Harit Krishi Cooperative", type: "FPO", risk: "Critical", outbreaks: 8, login: "5m ago" },
      { coords: [21.1, 79.0], name: "Nagpur Bio-Foods Ltd", type: "Agribusiness", risk: "High", outbreaks: 4, login: "1d ago" },
      { coords: [22.7, 75.8], name: "Narmada Valley Agribusiness", type: "Agribusiness", risk: "Moderate", outbreaks: 2, login: "3h ago" },
      { coords: [12.5, 76.8], name: "Mandya Paddy Cooperative", type: "FPO", risk: "Healthy", outbreaks: 0, login: "12m ago" }
    ];

    customers.forEach(c => {
      const color = c.risk === "Critical" ? "#ef4444" : c.risk === "High" ? "#f59e0b" : c.risk === "Moderate" ? "#3b82f6" : "#10b981";
      const marker = window.L.circleMarker(c.coords, {
        color: color,
        fillColor: color,
        fillOpacity: 0.85,
        radius: 8,
        weight: 1.5
      }).addTo(map);
      marker.bindTooltip(`<b>${c.name}</b><br/>Outbreaks: ${c.outbreaks}<br/>Risk: ${c.risk}`);
      marker.on("click", () => {
        setSelectedCust(c);
      });
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

  // Customer portfolio list
  const customerList = [
    { name: "Punjab Grain Growers FPO", type: "FPO", state: "Punjab", outbreaks: 12, riskScore: 94, alertSent: 15, alertOpened: 80, login: "2h ago", csm: "Ramesh Sharma", arr: "₹45L", arrVal: 45 },
    { name: "Harit Krishi Cooperative", type: "FPO", state: "UP", outbreaks: 8, riskScore: 88, alertSent: 12, alertOpened: 75, login: "5m ago", csm: "Neha Singh", arr: "₹38L", arrVal: 38 },
    { name: "Nagpur Bio-Foods Ltd", type: "Agribusiness", state: "Maharashtra", outbreaks: 4, riskScore: 78, alertSent: 9, alertOpened: 67, login: "1d ago", csm: "Neha Singh", arr: "₹85L", arrVal: 85 },
    { name: "Narmada Valley Agribusiness", type: "Agribusiness", state: "MP", outbreaks: 2, riskScore: 56, alertSent: 4, alertOpened: 50, login: "3h ago", csm: "Amit Verma", arr: "₹62L", arrVal: 62 },
    { name: "Mandya Paddy Cooperative", type: "FPO", state: "Karnataka", outbreaks: 0, riskScore: 18, alertSent: 1, alertOpened: 100, login: "12m ago", csm: "Amit Verma", arr: "₹30L", arrVal: 30 },
    { name: "UP Agri Directorate", type: "Government", state: "UP", outbreaks: 0, riskScore: 12, alertSent: 0, alertOpened: 0, login: "4d ago", csm: "Ramesh Sharma", arr: "₹1.2Cr", arrVal: 120 }
  ];

  // Scatter data (Customer Risk Matrix)
  const matrixData = customerList.map(c => ({
    name: c.name,
    risk: c.riskScore,
    health: 100 - (c.outbreaks * 6 + (c.riskScore > 80 ? 20 : 0)), // Health proxy
    arr: c.arrVal,
    csm: c.csm
  }));

  // Engagement Trend (4 lines)
  const engagementTrend = [
    { name: "W1", FPO: 65, Agribusiness: 55, Government: 80, Farmer: 70 },
    { name: "W2", FPO: 72, Agribusiness: 58, Government: 82, Farmer: 75 },
    { name: "W3", FPO: 68, Agribusiness: 62, Government: 85, Farmer: 72 },
    { name: "W4", FPO: 78, Agribusiness: 67, Government: 88, Farmer: 82 }
  ];

  // Top Churn Risk Customers
  const churnRiskList = [
    { name: "Punjab Grain Growers FPO", reason: "Rice Blast in Ludhiana + No login 7d", arr: "₹45.0 L", csm: "Ramesh Sharma", severity: "Critical" },
    { name: "Harit Krishi Cooperative", reason: "Leaf Rust outbreak + Low alert open rate", arr: "₹38.0 L", csm: "Neha Singh", severity: "Critical" },
    { name: "Nagpur Bio-Foods Ltd", reason: "Late Blight spreading in Vidarbha region", arr: "₹85.0 L", csm: "Neha Singh", severity: "High" }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Organization,Type,State,Active Outbreaks,Risk Score,CSM Owner,ARR\n" +
      customerList.map(c => `"${c.name}","${c.type}","${c.state}",${c.outbreaks},${c.riskScore},"${c.csm}","${c.arr}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Customer_Risk_Telemetry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customerList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "All" || c.type === filterType;
    const matchRisk = filterRisk === "All" ||
      (filterRisk === "Critical" && c.riskScore >= 80) ||
      (filterRisk === "High" && c.riskScore >= 60 && c.riskScore < 80) ||
      (filterRisk === "Healthy" && c.riskScore < 40);
    return matchSearch && matchType && matchRisk;
  });

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-[400px] bg-slate-200 rounded-2xl" />
          <div className="h-[400px] bg-slate-200 rounded-2xl" />
        </div>
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
            Customer Intelligence
          </span>
          <h2 className="text-xl font-black tracking-tight">
            Customer Risk & Retention Monitor
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Row 1 — Customer Portfolio Summary (5 KPI cards) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {[
            { label: "Total Customers", val: "1,284", delta: "↑8%", status: "Healthy", state: "healthy" },
            { label: "Healthy (No Outbreak)", val: "847", delta: "66%", status: "Healthy", state: "healthy" },
            { label: "Moderate Risk", val: "284", delta: "22%", status: "Warning", state: "warning" },
            { label: "High Risk", val: "118", delta: "9%", status: "Critical", state: "critical" },
            { label: "Critical Risk", val: "35", delta: "3%", status: "Immediate Action", state: "critical" }
          ].map((card, idx) => (
            <div key={idx} className="bg-slate-50 border border-gray-100 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{card.label}</span>
              <span className="text-2xl font-black text-slate-950 tracking-tight font-mono my-1.5">{card.val}</span>
              <span className={`text-[9px] font-black uppercase ${
                card.state === 'critical' ? 'text-red-600' : card.state === 'warning' ? 'text-amber-600' : 'text-emerald-600'
              }`}>{card.delta} — {card.status}</span>
            </div>
          ))}
        </div>

        {/* Horizontal Risk Distribution Bar */}
        <div className="w-full h-3.5 bg-gray-100 rounded-full flex overflow-hidden shadow-inner mt-4">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: "66%" }} title="Healthy: 66%" />
          <div className="h-full bg-amber-400 transition-all duration-500" style={{ width: "22%" }} title="Moderate: 22%" />
          <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: "9%" }} title="High: 9%" />
          <div className="h-full bg-red-600 transition-all duration-500" style={{ width: "3%" }} title="Critical: 3%" />
        </div>
        <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase mt-2">
          <span>Healthy (66%)</span>
          <span>Moderate (22%)</span>
          <span>High (9%)</span>
          <span>Critical (3%)</span>
        </div>
      </div>

      {/* Row 2 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left (55%): Customer Risk Map */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm overflow-hidden flex flex-col relative">
          <div>
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2.5 flex items-center justify-between">
              <span>Customer Risk Mapping</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase">Click pins to inspect FPOs</span>
            </h3>
            <div ref={mapRef} className="w-full h-[360px] rounded-xl overflow-hidden border border-gray-200 z-0" />
          </div>

          {/* Map details drawer */}
          {selectedCust && (
            <div className="absolute top-16 right-4 z-10 bg-white border border-gray-200 shadow-xl rounded-xl p-3 w-64 text-xs font-bold animate-fadeIn">
              <div className="flex justify-between items-center border-b border-gray-100 pb-1.5 mb-1.5">
                <span className="font-black text-gray-900">{selectedCust.name}</span>
                <button onClick={() => setSelectedCust(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-gray-600">Active Outbreaks: <span className="text-red-600 font-black">{selectedCust.outbreaks}</span></p>
              <p className="text-gray-600">Risk Severity: <span className="text-amber-600 font-black">{selectedCust.risk}</span></p>
              <p className="text-gray-600">Last Active Session: <span className="text-slate-500">{selectedCust.login}</span></p>
            </div>
          )}
        </div>

        {/* Right (45%): Customer Risk Matrix */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col">
          <div>
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2.5">
              Customer Engagement vs Risk Score
            </h3>
            <div className="h-[360px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 10, bottom: 20, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" dataKey="risk" name="Disease Risk Score" domain={[0, 100]} label={{ value: "Disease Risk →", position: "insideBottom", offset: -5, fontSize: "9px", fontWeight: "bold" }} style={{ fontSize: "9px" }} />
                  <YAxis type="number" dataKey="health" name="Customer Health Score" domain={[0, 100]} label={{ value: "Customer Engagement →", angle: -90, position: "insideLeft", fontSize: "9px", fontWeight: "bold" }} style={{ fontSize: "9px" }} />
                  <ZAxis type="number" dataKey="arr" range={[60, 300]} />
                  
                  {/* Quadrant color blocks */}
                  <ReferenceArea x1={50} x2={100} y1={0} y2={50} fill="#fef2f2" fillOpacity={0.6} />
                  <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill="#fffbeb" fillOpacity={0.6} />
                  <ReferenceArea x1={0} x2={50} y1={0} y2={50} fill="#eff6ff" fillOpacity={0.6} />
                  <ReferenceArea x1={0} x2={50} y1={50} y2={100} fill="#f0fdf4" fillOpacity={0.6} />

                  <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#132a13] text-white p-2.5 rounded-lg text-[9px] shadow-lg border border-[#31572c]/40">
                          <p className="font-bold">{d.name}</p>
                          <p>Risk Score: {d.risk}</p>
                          <p>Health score: {d.health}%</p>
                          <p>ARR Tier: ₹{d.arr}L</p>
                          <p>CSM: {d.csm}</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Scatter data={matrixData} fill="#4f772d">
                    {matrixData.map((entry, idx) => (
                      <Line key={`cell-${idx}`} fill={entry.risk >= 80 ? '#ef4444' : '#10b981'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              <div className="absolute top-2 left-6 text-[8px] font-black text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded">Healthy</div>
              <div className="absolute top-2 right-2 text-[8px] font-black text-amber-700 bg-amber-50 px-1 py-0.5 rounded">Engaged Under Pressure</div>
              <div className="absolute bottom-10 left-6 text-[8px] font-black text-blue-700 bg-blue-50 px-1 py-0.5 rounded">At Risk: Disengaged</div>
              <div className="absolute bottom-10 right-2 text-[8px] font-black text-red-700 bg-red-50 px-1 py-0.5 rounded">URGENT: Churn Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Customer Table (full width) */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Customer Risk Operations Ledger</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold px-2 py-1.5 focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="FPO">FPO</option>
              <option value="Agribusiness">Agribusiness</option>
              <option value="Government">Government</option>
            </select>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold px-2 py-1.5 focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Healthy">Healthy</option>
            </select>
            <button onClick={handleExportCSV} className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900" title="Export Ledger">
              <Download size={14} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5 pl-6">Organization</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Type</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5 text-right">Active Outbreaks</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Risk Score</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Alerts (Sent/Opened)</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Last Login</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">CSM Owner</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((row, idx) => {
                const isCritical = row.riskScore >= 80;
                const isHigh = row.riskScore >= 60 && row.riskScore < 80;

                return (
                  <tr
                    key={idx}
                    className={`text-xs font-semibold hover:bg-brand-medium/5 transition-colors border-b border-gray-100/60 ${
                      isCritical ? "bg-red-50/30 text-red-950" : isHigh ? "bg-amber-50/20 text-amber-950" : "text-gray-700"
                    }`}
                  >
                    <td className="p-3 pl-6 font-black text-gray-950">{row.name}</td>
                    <td className="p-3 font-mono text-[10px] text-gray-500 uppercase">{row.type}</td>
                    <td className="p-3 text-right font-mono">{row.outbreaks}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2 w-28">
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isHigh ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${row.riskScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] font-black">{row.riskScore}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-gray-500">
                      {row.alertSent} sent / <span className="text-[#31572c] font-black">{row.alertOpened}% open</span>
                    </td>
                    <td className="p-3 font-mono text-gray-500">{row.login}</td>
                    <td className="p-3 font-bold text-slate-800">{row.csm}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert(`CSM alerted to contact: ${row.name}`)}
                        className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border transition ${
                          isCritical
                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm"
                            : "bg-gray-50 border-gray-200 text-slate-700 hover:bg-gray-100"
                        }`}
                      >
                        Contact Now
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Col 1: Customer Engagement Analytics */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-2">
            Customer Engagement Analytics
          </h4>
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { val: "4.2x/wk", lbl: "Login Freq", change: "+14%", state: "up" },
              { val: "67%", lbl: "Alert Open", change: "+2.1%", state: "up" },
              { val: "43%", lbl: "Forecast Use", change: "-0.8%", state: "down" },
              { val: "28%", lbl: "AI Scan Use", change: "+5.4%", state: "up" }
            ].map((metric, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-xl p-2">
                <span className="text-xs font-black text-slate-900 block font-mono">{metric.val}</span>
                <span className="text-[8px] font-bold text-gray-400 block uppercase my-0.5">{metric.lbl}</span>
                <span className={`text-[8px] font-black ${metric.state === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {metric.change}
                </span>
              </div>
            ))}
          </div>

          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Line type="monotone" dataKey="FPO" stroke="#4f772d" strokeWidth={1.5} />
                <Line type="monotone" dataKey="Agribusiness" stroke="#90a955" strokeWidth={1.5} />
                <Line type="monotone" dataKey="Government" stroke="#e74c3c" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Col 2: Churn Risk Intelligence */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest">
                Churn Risk Intelligence
              </h4>
              <span className="text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 shadow-sm font-mono">
                ARR at Risk: ₹1.68 Cr
              </span>
            </div>
            
            <div className="space-y-3.5 max-h-48 overflow-y-auto scrollbar-thin">
              {churnRiskList.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">{row.name}</span>
                      <span className="bg-red-100 text-red-700 text-[8px] font-black px-1.5 py-0.5 rounded">
                        {row.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">{row.reason}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Owner: {row.csm} • ARR: {row.arr}</p>
                  </div>
                  <button
                    onClick={() => alert(`Scheduling urgent intervention call with ${row.name}`)}
                    className="bg-brand-dark hover:bg-brand-medium text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg transition active:scale-95"
                  >
                    Schedule Call
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
