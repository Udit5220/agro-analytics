import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  Filter,
  Download,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  MessageSquare,
  Mail,
  Smartphone,
  PhoneCall,
  Calendar,
  Layers,
  MapPin
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

const COLORS = ["#4f772d", "#90a955", "#ecf39e", "#3b82f6", "#e74c3c"];
const sparklineData = [{ val: 20 }, { val: 25 }, { val: 22 }, { val: 30 }, { val: 28 }, { val: 35 }, { val: 32 }];

export default function AlertOperations() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mapLayer, setMapLayer] = useState("Volume");

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

    // Mock alert hotzones
    const alertZones = [
      { coords: [30.9, 75.8], name: "Ludhiana (Punjab)", vol: 4800, rate: "96%", open: "84%" },
      { coords: [26.7, 83.3], name: "Gorakhpur (UP)", vol: 3200, rate: "92%", open: "72%" },
      { coords: [21.1, 79.0], name: "Nagpur (Maharashtra)", vol: 1800, rate: "95%", open: "68%" },
      { coords: [20.4, 85.8], name: "Cuttack (Odisha)", vol: 2400, rate: "94%", open: "76%" }
    ];

    alertZones.forEach(z => {
      const radius = z.vol * 15;
      const circle = window.L.circle(z.coords, {
        color: "#4f772d",
        fillColor: "#4f772d",
        fillOpacity: 0.45,
        radius: radius,
        weight: 1.5
      }).addTo(map);
      circle.bindTooltip(`<b>${z.name}</b><br/>Alert Volume: ${z.vol}<br/>Delivery: ${z.rate}<br/>Open Rate: ${z.open}`);
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
    { label: "Generated (MTD)", val: "18,420", arrow: "↑", change: "14%", status: "Healthy", state: "healthy" },
    { label: "Delivered", val: "17,284", sub: "(93.8%)", arrow: "↓", change: "0.4%", status: "Healthy", state: "healthy" },
    { label: "Read / Opened", val: "11,630", sub: "(67.3%)", arrow: "↑", change: "2.1%", status: "Healthy", state: "healthy" },
    { label: "Acknowledged", val: "8,140", sub: "(47.0%)", arrow: "↑", change: "3.4%", status: "Healthy", state: "healthy" },
    { label: "Failed Deliveries", val: "1,136", sub: "(6.2%)", arrow: "↑", change: "0.4%", status: "Warning", state: "warning" }
  ];

  const sourceData = [
    { name: "Disease Detection AI", value: 42 },
    { name: "Forecast Model Triggers", value: 28 },
    { name: "Satellite Stress Signals", value: 18 },
    { name: "Weather Risk Triggers", value: 12 }
  ];

  const funnelData = [
    { name: "Generated", value: 18420, pct: "100%", drop: "0%" },
    { name: "Delivered", value: 17284, pct: "93.8%", drop: "6.2%" },
    { name: "Opened", value: 11630, pct: "67.3%", drop: "26.5%" },
    { name: "Acted Upon", value: 8140, pct: "47.0%", drop: "20.3%" }
  ];

  const channelPerformance = [
    { channel: "SMS", sent: 8400, delivered: 8100, failed: 300, pct: "96.4%", state: "Healthy", icon: MessageSquare },
    { channel: "Email", sent: 6200, delivered: 5800, failed: 400, pct: "93.5%", state: "Healthy", icon: Mail },
    { channel: "Push", sent: 2800, delivered: 2480, failed: 320, pct: "88.6%", state: "Healthy", icon: Smartphone },
    { channel: "WhatsApp", sent: 1020, delivered: 904, failed: 116, pct: "88.6%", state: "Warning", icon: PhoneCall }
  ];

  const overTimeData = [
    { name: "Day 5", Generated: 3200, Delivered: 3050, Opened: 2100, Acted: 1500 },
    { name: "Day 10", Generated: 4100, Delivered: 3820, Opened: 2540, Acted: 1890 },
    { name: "Day 15", Generated: 3900, Delivered: 3650, Opened: 2480, Acted: 1720 },
    { name: "Day 20", Generated: 4820, Delivered: 4480, Opened: 3120, Acted: 2240 },
    { name: "Day 25", Generated: 5200, Delivered: 4890, Opened: 3450, Acted: 2540 },
    { name: "Day 30", Generated: 18420, Delivered: 17284, Opened: 11630, Acted: 8140 }
  ];

  // Failed alert rows
  const [failures, setFailures] = useState([
    { id: "ALT-098", customer: "Ludhiana Rice FPO", disease: "Rice Blast", channel: "WhatsApp", sentAt: "10m ago", reason: "Rate limit hit", retries: 1, status: "Failed" },
    { id: "ALT-084", customer: "Harit Krishi Cooperative", disease: "Leaf Rust", channel: "SMS", sentAt: "1h ago", reason: "Invalid number", retries: 4, status: "Critical" },
    { id: "ALT-076", customer: "Nagpur Bio-Foods Ltd", disease: "BPH Vector", channel: "Push", sentAt: "3h ago", reason: "Push token expired", retries: 3, status: "Failed" },
    { id: "ALT-065", customer: "Deccan Cotton Mills", disease: "Yellow Mosaic", channel: "Email", sentAt: "6h ago", reason: "Email bounced", retries: 0, status: "Failed" },
    { id: "ALT-042", customer: "Narmada Valley Agribusiness", disease: "Late Blight", channel: "WhatsApp", sentAt: "1d ago", reason: "WhatsApp opt-out", retries: 4, status: "Critical" }
  ]);

  const handleRetry = (id) => {
    alert(`Retrying alert ${id} delivery pipeline...`);
    setFailures(prev => prev.map(f => f.id === id ? { ...f, retries: f.retries + 1, status: "Retrying" } : f));
  };

  const handleResolve = (id) => {
    alert(`Marking alert ${id} as resolved manually.`);
    setFailures(prev => prev.filter(f => f.id !== id));
  };

  const filteredFailures = failures.filter(f => {
    const matchSearch = f.customer.toLowerCase().includes(searchQuery.toLowerCase()) || f.disease.toLowerCase().includes(searchQuery.toLowerCase());
    const matchChannel = channelFilter === "All" || f.channel === channelFilter;
    const matchStatus = statusFilter === "All" ||
      (statusFilter === "Critical" && f.retries > 3) ||
      (statusFilter === "Failed" && f.retries <= 3);
    return matchSearch && matchChannel && matchStatus;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Alert ID,Customer,Disease,Channel,Sent At,Failure Reason,Retries\n" +
      failures.map(f => `"${f.id}","${f.customer}","${f.disease}","${f.channel}","${f.sentAt}","${f.reason}",${f.retries}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Failed_Alert_Analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
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
            Disease Warning Alert Operations
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Row 1 — 5 Alert KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((card, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-snug">{card.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                card.state === 'healthy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
              }`}>{card.status}</span>
            </div>
            
            <div className="flex items-baseline justify-between mt-3 mb-1">
              <div>
                <span className="text-2xl font-black text-gray-950 tracking-tight font-mono">{card.val}</span>
                {card.sub && <span className="text-[10px] font-extrabold text-slate-400 block -mt-1 font-mono">{card.sub}</span>}
              </div>
              <div className="w-12 h-5 shrink-0 opacity-70">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line type="monotone" dataKey="val" stroke={card.state === 'warning' ? '#f59e0b' : '#4f772d'} strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center text-[9px] font-bold text-gray-400">
              <span className={`font-black mr-0.5 ${card.arrow === '↑' && card.state === 'warning' ? 'text-red-500' : 'text-emerald-500'}`}>
                {card.arrow} {card.change}
              </span>
              <span>vs last 30d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 — 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Col 1: Alert Source Breakdown */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[300px]">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
            Alert Source Breakdown
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} fill="#8884d8" paddingAngle={4} dataKey="value">
                  {sourceData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[8px] font-black uppercase text-slate-500">
            {sourceData.map((s, idx) => (
              <div key={s.name} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Alert Funnel */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm h-[300px] flex flex-col justify-between">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
            Alert Funnel Drop-off
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" style={{ fontSize: "8px", fontWeight: "bold" }} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Bar dataKey="value" fill="#4f772d" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#ecf39e' : '#4f772d'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] font-black uppercase text-slate-400 flex justify-between px-1">
            <span>Generated: {funnelData[0].value}</span>
            <span className="text-red-500 font-extrabold">Final conversion: 47%</span>
          </div>
        </div>

        {/* Col 3: Channel Delivery Performance */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm h-[300px] flex flex-col justify-between">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
            Channel Delivery performance
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin pr-1 mt-2">
            {channelPerformance.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div key={idx} className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-[#4f772d]/10 flex items-center justify-center text-[#31572c]">
                      <Icon size={13} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">{row.channel}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Sent: {row.sent} | Fail: {row.failed}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-slate-900 block">{row.pct}</span>
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      row.state === 'Healthy' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-900'
                    }`}>{row.state}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[460px]">
        {/* Left: Regional Alert Map */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-full">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2.5">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Regional Alert Volume</h3>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden text-[8px] font-black">
              {["Volume", "Delivery", "Engagement"].map(layer => (
                <button
                  key={layer}
                  onClick={() => setMapLayer(layer)}
                  className={`px-2 py-1 transition ${
                    mapLayer === layer ? "bg-[#31572c] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>
          <div ref={mapRef} className="w-full h-[340px] rounded-xl overflow-hidden border border-gray-200 z-0" />
        </div>

        {/* Right: Alert Performance Over Time */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-between">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2.5">
            Alert Performance Over Time (30D)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overTimeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" style={{ fontSize: "9px" }} />
                <YAxis style={{ fontSize: "9px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                <Line type="monotone" dataKey="Generated" stroke="#4f772d" strokeWidth={2} />
                <Line type="monotone" dataKey="Delivered" stroke="#90a955" strokeWidth={2} />
                <Line type="monotone" dataKey="Opened" stroke="#ecf39e" strokeWidth={2} />
                <Line type="monotone" dataKey="Acted" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4 — Full width: Alert Failure Analysis table */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Alert Failure & Delivery Operations</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
              />
            </div>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold px-2 py-1.5 focus:outline-none"
            >
              <option value="All">All Channels</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
              <option value="Push">Push</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-bold px-2 py-1.5 focus:outline-none"
            >
              <option value="All">All Severity</option>
              <option value="Critical">Critical (&gt;3 retries)</option>
              <option value="Failed">Failed (Normal)</option>
            </select>
            <button onClick={handleExportCSV} className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900" title="Export CSV">
              <Download size={14} />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5 pl-6">Alert ID</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Customer</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Disease</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Channel</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Sent At</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Failure Reason</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5 text-center">Retries</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5">Status</th>
                <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFailures.map((row, idx) => {
                const isCritical = row.retries > 3;
                return (
                  <tr key={idx} className={`text-xs font-semibold hover:bg-[#4f772d]/5 transition-colors border-b border-gray-100/60 ${
                    isCritical ? "bg-red-50 text-red-950" : "text-gray-700"
                  }`}>
                    <td className="p-3 pl-6 font-bold font-mono text-gray-900">{row.id}</td>
                    <td className="p-3 font-bold text-gray-800">{row.customer}</td>
                    <td className="p-3">{row.disease}</td>
                    <td className="p-3 font-bold">{row.channel}</td>
                    <td className="p-3 font-mono text-gray-500">{row.sentAt}</td>
                    <td className="p-3 text-red-600 font-bold">{row.reason}</td>
                    <td className="p-3 text-center font-mono font-bold">{row.retries}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        isCritical ? "bg-red-100 text-red-800 border border-red-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>{row.status}</span>
                    </td>
                    <td className="p-3 text-center flex items-center justify-center gap-1.5">
                      <button onClick={() => handleRetry(row.id)} className="p-1 bg-gray-50 border border-gray-200 rounded text-slate-700 hover:text-[#31572c] hover:bg-gray-100 transition active:scale-95" title="Retry Dispatch">
                        <RefreshCw size={11} />
                      </button>
                      <button onClick={() => handleResolve(row.id)} className="p-1 bg-gray-50 border border-gray-200 rounded text-slate-700 hover:text-emerald-600 hover:bg-gray-100 transition active:scale-95" title="Mark Resolved">
                        <CheckCircle size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
