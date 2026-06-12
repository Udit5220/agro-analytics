import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  MapPin,
  Flame,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";

// Mock Sparkline Data
const sparklineData = [
  { val: 30 },
  { val: 40 },
  { val: 35 },
  { val: 50 },
  { val: 45 },
  { val: 60 },
  { val: 55 },
];

export default function ExecutiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30D");
  const [selectedLayer, setSelectedLayer] = useState("Hotspots");
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Simulated count-up state
  const [farmersProtected, setFarmersProtected] = useState(0);
  const [yieldSaved, setYieldSaved] = useState(0);
  const [revProtected, setRevProtected] = useState(0);
  const [outbreaksPrevented, setOutbreaksPrevented] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Count up animation effect
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setFarmersProtected((prev) =>
        prev < 842000 ? Math.min(prev + 42100, 842000) : 842000,
      );
      setYieldSaved((prev) => (prev < 2.1 ? Math.min(prev + 0.1, 2.1) : 2.1));
      setRevProtected((prev) =>
        prev < 4840 ? Math.min(prev + 242, 4840) : 4840,
      );
      setOutbreaksPrevented((prev) =>
        prev < 1240 ? Math.min(prev + 62, 1240) : 1240,
      );
    }, 30);

    return () => clearInterval(interval);
  }, [loading]);

  // Leaflet MapTiler Initializer
  useEffect(() => {
    if (loading || !mapRef.current || !window.L) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Set view centered on central India
    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([21.1458, 79.0882], 5);

    mapInstance.current = map;

    // Use MapTiler key from env
    const mapTilerKey =
      import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp";
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${mapTilerKey}`,
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
        maxZoom: 18,
      },
    ).addTo(map);

    // Mock clusters
    const clusters = [
      {
        coords: [30.901, 75.8573],
        status: "critical",
        label: "Ludhiana Cluster: Critical Outbreak (Rice Blast)",
        color: "#ef4444",
      },
      {
        coords: [26.7606, 83.3732],
        status: "warning",
        label: "Gorakhpur FPO Zone: Leaf Rust High Risk",
        color: "#f59e0b",
      },
      {
        coords: [20.4625, 85.883],
        status: "healthy",
        label: "Cuttack Co-operative: Contained BPH Outbreak",
        color: "#10b981",
      },
      {
        coords: [15.3173, 75.7139],
        status: "warning",
        label: "Karnataka Agribusiness Belt: Moderate Yellow Mosaic",
        color: "#f59e0b",
      },
    ];

    clusters.forEach((c) => {
      const circle = window.L.circle(c.coords, {
        color: c.color,
        fillColor: c.color,
        fillOpacity: 0.45,
        radius: 60000,
        weight: 2,
      }).addTo(map);
      circle.bindTooltip(`<b>${c.label}</b>`);
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
  }, [loading, selectedLayer]);

  // Risk Matrix Bubble Data
  const scatterData = [
    {
      name: "Ludhiana Rice FPO",
      risk: 85,
      impact: 90,
      size: 12000,
      quadrant: "Q1",
    },
    {
      name: "Bhatinda Cotton Cluster",
      risk: 78,
      impact: 82,
      size: 8400,
      quadrant: "Q1",
    },
    {
      name: "Gurdaspur Co-operative",
      risk: 75,
      impact: 79,
      size: 9100,
      quadrant: "Q1",
    },
    {
      name: "Gorakhpur Wheat Belt",
      risk: 65,
      impact: 40,
      size: 6800,
      quadrant: "Q2",
    },
    {
      name: "Basti Pulses FPO",
      risk: 58,
      impact: 32,
      size: 4500,
      quadrant: "Q2",
    },
    {
      name: "Nagpur Orange Co-op",
      risk: 25,
      impact: 88,
      size: 14000,
      quadrant: "Q3",
    },
    {
      name: "Akola Cotton FPO",
      risk: 20,
      impact: 75,
      size: 10500,
      quadrant: "Q3",
    },
    {
      name: "Baramati Sugar Mills",
      risk: 15,
      impact: 20,
      size: 3800,
      quadrant: "Q4",
    },
  ];

  // Performance Trend Data
  const trendData = [
    {
      name: "W1",
      incidents: 3400,
      alerts: 1200,
      resolved: 800,
      accuracy: 82.5,
    },
    {
      name: "W2",
      incidents: 3800,
      alerts: 1450,
      resolved: 950,
      accuracy: 83.1,
    },
    {
      name: "W3",
      incidents: 3600,
      alerts: 1600,
      resolved: 1100,
      accuracy: 82.9,
    },
    {
      name: "W4",
      incidents: 3847,
      alerts: 1720,
      resolved: 1240,
      accuracy: 83.4,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-[450px] bg-slate-200 rounded-2xl" />
          <div className="h-[450px] bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Impact Banner */}
      <div className="bg-[#132a13] rounded-2xl p-6 text-white border border-[#31572c]/40 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="flex flex-col space-y-1.5 z-10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
            Company Intelligence
          </span>
          <h2 className="text-xl font-black tracking-tight">
            Disease Intelligence Platform
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>

        {/* 4 Large Impact Numbers Inline */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 max-w-4xl px-4 z-10">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Farmers Protected
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              {farmersProtected.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Yield Saved
            </span>
            <span className="text-xl font-black text-[#ecf39e] tracking-tight">
              {yieldSaved.toFixed(1)}M MT
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Revenue Protected
            </span>
            <span className="text-xl font-black text-[#90a955] tracking-tight">
              ₹{revProtected.toLocaleString("en-IN")} Cr
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              Outbreaks Prevented
            </span>
            <span className="text-xl font-black text-white tracking-tight">
              {outbreaksPrevented.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Circular Health Score Dial */}
        <div className="flex items-center space-x-3 z-10 shrink-0 border-l border-[#31572c]/40 pl-6">
          <div className="relative h-16 w-16 flex items-center justify-center">
            {/* Circular Track */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#224222"
                strokeWidth="4.5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#ecf39e"
                strokeWidth="4.5"
                fill="transparent"
                strokeDasharray="163"
                strokeDashoffset="21"
              />
            </svg>
            <span className="text-sm font-black text-[#ecf39e] font-mono">87%</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#ecf39e]">
              Platform Health
            </span>
            <span className="text-xs font-bold text-emerald-500">
              EXCELLENT
            </span>
          </div>
        </div>
      </div>

      {/* Row 1 — 8 Executive KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Disease Incidents (MTD)",
            val: "3,847",
            arrow: "↑",
            pct: "12%",
            status: "Warning",
            state: "warning",
          },
          {
            label: "Active Outbreaks",
            val: "234",
            arrow: "↑",
            pct: "8%",
            status: "Warning",
            state: "warning",
          },
          {
            label: "Predicted Outbreaks",
            val: "89",
            arrow: "↓",
            pct: "3%",
            status: "Healthy",
            state: "healthy",
          },
          {
            label: "Resolved Outbreaks",
            val: "1,240",
            arrow: "↑",
            pct: "22%",
            status: "Healthy",
            state: "healthy",
          },
          {
            label: "Critical Customer Regions",
            val: "47",
            arrow: "↑",
            pct: "5%",
            status: "Critical",
            state: "critical",
          },
          {
            label: "High-Risk Customers",
            val: "128",
            arrow: "↓",
            pct: "11%",
            status: "Improving",
            state: "improving",
          },
          {
            label: "AI Forecast Accuracy",
            val: "83.4%",
            arrow: "↑",
            pct: "1.2%",
            status: "Healthy",
            state: "healthy",
          },
          {
            label: "Alert Success Rate",
            val: "91.2%",
            arrow: "↓",
            pct: "0.8%",
            status: "Healthy",
            state: "healthy",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200/60 rounded-2xl shadow-sm p-4 hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {card.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                  card.state === "critical"
                    ? "bg-red-50 text-red-700"
                    : card.state === "warning"
                      ? "bg-amber-50 text-amber-700"
                      : card.state === "improving"
                        ? "bg-blue-50 text-blue-800"
                        : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {card.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-3 mb-1">
              <span className="text-2xl font-black text-gray-950 tracking-tight font-mono">
                {card.val}
              </span>

              {/* Mini Sparkline Chart */}
              <div className="w-14 h-5 shrink-0 opacity-70">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="val"
                      stroke={card.state === "critical" ? "#ef4444" : "#4f772d"}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center text-[10px] font-bold text-gray-400">
              <span
                className={
                  card.arrow === "↑"
                    ? "text-red-500 mr-0.5"
                    : "text-emerald-500 mr-0.5"
                }
              >
                {card.arrow} {card.pct}
              </span>
              <span>vs last 30d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (60%): Ecosystem Coverage Map */}
        <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[500px]">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">
                Ecosystem Coverage Map
              </h3>
              <div className="flex gap-2">
                {["Hotspots", "Farmers", "Agribusinesses"].map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setSelectedLayer(layer)}
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border transition ${
                      selectedLayer === layer
                        ? "bg-brand-dark border-[#31572c] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>
            {/* Leaflet container */}
            <div
              ref={mapRef}
              className="w-full h-[320px] rounded-xl overflow-hidden border border-gray-200/60 shadow-inner z-0"
            />
          </div>

          {/* Bottom stats strip */}
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            {[
              { val: "18", lbl: "States" },
              { val: "284", lbl: "Districts" },
              { val: "12,400", lbl: "Villages" },
              { val: "84,000", lbl: "Active Farms" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-xl py-2 shadow-sm"
              >
                <span className="text-sm font-black text-slate-800 block font-mono">
                  {stat.val}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.lbl}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right (40%): Executive Risk Matrix */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[500px]">
          <div>
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-3">
              Executive Risk Matrix
            </h3>
            <div className="h-[380px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    dataKey="impact"
                    name="Impact"
                    unit="%"
                    domain={[0, 100]}
                    label={{
                      value: "Impact →",
                      position: "insideBottom",
                      offset: -5,
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                    style={{ fontSize: "9px" }}
                  />
                  <YAxis
                    type="number"
                    dataKey="risk"
                    name="Risk"
                    unit="%"
                    domain={[0, 100]}
                    label={{
                      value: "Risk →",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                    style={{ fontSize: "9px" }}
                  />
                  <ZAxis type="number" dataKey="size" range={[50, 400]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-[10px] shadow-lg border border-slate-800">
                            <p className="font-bold">{data.name}</p>
                            <p>Risk Score: {data.risk}%</p>
                            <p>Impact Score: {data.impact}%</p>
                            <p>
                              Affected Area: {data.size.toLocaleString()} Ha
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Quadrant Background colors simulated using Reference Areas */}
                  <ReferenceArea
                    x1={50}
                    x2={100}
                    y1={50}
                    y2={100}
                    fill="#fef2f2"
                    fillOpacity={0.5}
                  />
                  <ReferenceArea
                    x1={0}
                    x2={50}
                    y1={50}
                    y2={100}
                    fill="#fffbeb"
                    fillOpacity={0.5}
                  />
                  <ReferenceArea
                    x1={50}
                    x2={100}
                    y1={0}
                    y2={50}
                    fill="#f0fdf4"
                    fillOpacity={0.5}
                  />
                  <ReferenceArea
                    x1={0}
                    x2={50}
                    y1={0}
                    y2={50}
                    fill="#f8fafc"
                    fillOpacity={0.5}
                  />

                  <Scatter
                    name="FPOs & Customers"
                    data={scatterData}
                    fill="#4f772d"
                  >
                    {scatterData.map((entry, index) => (
                      <Line
                        key={`cell-${index}`}
                        fill={
                          entry.quadrant === "Q1"
                            ? "#ef4444"
                            : entry.quadrant === "Q2"
                              ? "#f59e0b"
                              : "#10b981"
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>

              {/* Quadrant Labels overlay */}
              <div className="absolute top-2 left-6 text-[8px] font-black text-amber-700 bg-amber-50 px-1 py-0.5 rounded">
                Q2 Monitor
              </div>
              <div className="absolute top-2 right-2 text-[8px] font-black text-red-700 bg-red-50 px-1 py-0.5 rounded">
                Q1 Critical
              </div>
              <div className="absolute bottom-10 left-6 text-[8px] font-black text-slate-500 bg-slate-50 px-1 py-0.5 rounded">
                Q4 Stable
              </div>
              <div className="absolute bottom-10 right-2 text-[8px] font-black text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
                Q3 Healthy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Ecosystem Activity Timeline */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col h-[320px]">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-3">
            Ecosystem Activity Timeline
          </h3>
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 space-y-3.5">
            {[
              {
                type: "outbreak",
                icon: "🔴",
                label: "New Outbreak Detected",
                desc: "Rice Blast, Ludhiana, Punjab cluster",
                time: "Just now",
              },
              {
                type: "forecast",
                icon: "🟡",
                label: "Forecast Alert Issued",
                desc: "Leaf Rust risk rising, UP cluster",
                time: "14 min ago",
              },
              {
                type: "resolved",
                icon: "🟢",
                label: "Outbreak Resolved",
                desc: "BPH contained, Cuttack, Odisha",
                time: "1 hr ago",
              },
              {
                type: "prediction",
                icon: "🔵",
                label: "AI Prediction Updated",
                desc: "Yellow Mosaic, 78% probability, Bihar",
                time: "2 hrs ago",
              },
              {
                type: "report",
                icon: "⚪",
                label: "New Customer Report",
                desc: "FPO submitted field observation, MP",
                time: "4 hrs ago",
              },
            ].map((evt, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs">
                <span className="text-sm shrink-0">{evt.icon}</span>
                <div className="flex-1 border-b border-gray-50 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{evt.label}</span>
                    <span className="text-[9px] font-mono text-gray-400">
                      {evt.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-[10px] font-black text-[#31572c] uppercase hover:underline text-center mt-3 pt-2 border-t border-gray-100">
            View All Activity
          </button>
        </div>

        {/* Right: AI Executive Recommendations */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col h-[320px] justify-between">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-3">
            AI Executive Recommendations
          </h3>
          <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 space-y-3">
            {[
              {
                priority: "URGENT",
                text: "6 customer clusters in Punjab showing Rice Blast spike — trigger CSM outreach",
                metric: "CSM SLA at risk",
              },
              {
                priority: "HIGH",
                text: "Leaf Rust model accuracy dropped to 71% in Rabi data — queue training",
                metric: "Model accuracy",
              },
              {
                priority: "HIGH",
                text: "3 high-value FPO customers in critical outbreak zones — at churn risk",
                metric: "₹1.2 Cr ARR",
              },
              {
                priority: "MEDIUM",
                text: "Unserved Vidarbha region shows high disease density — expansion opportunity",
                metric: "Expansion potential",
              },
            ].map((rec, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-gray-200/50 p-2.5 rounded-xl flex items-center justify-between text-xs gap-3"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-black text-white shrink-0 ${
                      rec.priority === "URGENT"
                        ? "bg-red-600"
                        : rec.priority === "HIGH"
                          ? "bg-amber-500"
                          : "bg-brand-medium"
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <div>
                    <p className="text-[11px] text-slate-800 font-bold leading-snug">
                      {rec.text}
                    </p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {rec.metric}
                    </span>
                  </div>
                </div>
                <button className="text-[9px] font-black uppercase text-[#31572c] hover:underline shrink-0 flex items-center gap-0.5">
                  Take Action <ArrowRight size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4 — Full-width: Platform Performance Trend */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">
            Platform Performance Trend
          </h3>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden text-[9px] font-black">
            {["30D", "90D", "6M", "1Y"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 transition ${
                  dateRange === range
                    ? "bg-brand-dark text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                style={{ fontSize: "10px", fontWeight: "bold" }}
              />
              <YAxis style={{ fontSize: "10px", fontWeight: "bold" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#132a13",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                  fontSize: "10px",
                }}
              />
              <Legend
                iconSize={8}
                wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="incidents"
                stroke="#4f772d"
                strokeWidth={2}
                name="Disease Incidents"
              />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="#90a955"
                strokeWidth={2}
                name="Alerts Generated"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="#ecf39e"
                strokeWidth={2}
                name="Outbreaks Resolved"
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#e74c3c"
                strokeWidth={2}
                name="AI Accuracy %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
