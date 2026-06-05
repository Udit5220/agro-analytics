import seededData from "../../../seed-json/seededData.json";

const {
  procurementTimelineData: TIMELINE_DATA,
  cropProcurementAnalysis: CROP_PROCUREMENT_DATA,
  villageProcurementPriority: VILLAGE_PROCUREMENT_PRIORITY,
  collectionCenters: COLLECTION_CENTERS,
  storageByCommodity: STORAGE_BY_COMMODITY,
  procurementPriceComparison: PRICE_COMPARISON_DATA,
  routesDispatchData: ROUTES_DATA,
  procurementVillageLocations: VILLAGE_LOCATIONS,
  procurementCenterLocations: CENTER_LOCATIONS,
  procurementConnections: CONNECTIONS,
} = seededData.cropRecommendation1.fpo;

export default function CropRecProcurement() {
  const [period, setPeriod] = useState("Weekly");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapObjects = useRef([]);

  const activeTimeline = useMemo(() => TIMELINE_DATA[period], [period]);

  // Leaflet Scripts Injector
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const checkLeaflet = () => {
      if (window.L) {
        setMapLoaded(true);
        return true;
      }
      return false;
    };

    if (checkLeaflet()) return;

    let script = document.getElementById("leaflet-js");
    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      document.body.appendChild(script);
    }

    const handleLoad = () => {
      if (window.L) setMapLoaded(true);
    };
    script.addEventListener("load", handleLoad);
    const interval = setInterval(() => {
      if (checkLeaflet()) clearInterval(interval);
    }, 100);
    return () => {
      if (script) script.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, []);

  // Map Initialization
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;
    let resizeObserver = null;
    const timer = setTimeout(() => {
      if (!mapRef.current) return;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const map = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([23.5, 78.5], 8);
      
      mapInstance.current = map;
      
      window.L.tileLayer(
        "https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=Js3t7mr8sd7cdIiAAyVp",
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
          maxZoom: 18,
        },
      ).addTo(map);

      // Render GIS markers & polylines
      renderMapElements();
      map.invalidateSize();

      resizeObserver = new ResizeObserver(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapRef.current);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [mapLoaded]);

  const renderMapElements = () => {
    if (!mapInstance.current || !window.L) return;
    
    // Clear previous items
    mapObjects.current.forEach((obj) => obj.remove());
    mapObjects.current = [];

    const L = window.L;
    const map = mapInstance.current;

    // 1. Plot routes polylines
    CONNECTIONS.forEach((conn) => {
      const color = conn.prio === "P1" ? "#ef4444" : conn.prio === "P2" ? "#f59e0b" : "#10b981";
      const poly = L.polyline([conn.from, conn.to], {
        color: color,
        weight: conn.prio === "P1" ? 4 : 2.5,
        opacity: 0.8,
        dashArray: conn.prio === "P3" ? "5, 5" : null,
      }).addTo(map);
      mapObjects.current.push(poly);
    });

    // 2. Plot Villages (green circles)
    VILLAGE_LOCATIONS.forEach((v) => {
      const circle = L.circleMarker(v.coords, {
        radius: v.prio === "P1" ? 9 : 7,
        fillColor: "#10b981",
        color: v.prio === "P1" ? "#ef4444" : "#1e293b",
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(map);
      
      circle.bindPopup(`
        <div style="color: #1e293b; font-family: sans-serif; font-size: 11px;">
          <h4 style="margin: 0; font-weight: bold; color:#1e293b;">Village: ${v.name}</h4>
          <p style="margin: 4px 0 0;"><b>Assigned Center:</b> ${v.center}</p>
          <p style="margin: 2px 0 0;"><b>Transit Distance:</b> ${v.dist}</p>
          <p style="margin: 2px 0 0;"><b>Priority:</b> <span style="color:${v.prio === "P1" ? "#ef4444" : "#f59e0b"}; font-weight:bold">${v.prio}</span></p>
        </div>
      `);
      mapObjects.current.push(circle);
    });

    // 3. Plot Collection Centers (blue squares)
    CENTER_LOCATIONS.forEach((c) => {
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: #0ea5e9; border: 2px solid #f9fafb; width: 12px; height: 12px; border-radius: 2px; box-shadow: 0 0 8px rgba(14,165,233,0.6);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      const marker = L.marker(c.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="color: #1e293b; font-family: sans-serif; font-size: 11px;">
          <h4 style="margin: 0; font-weight: bold; color:#0ea5e9;">${c.name}</h4>
          <p style="margin: 4px 0 0;"><b>Total Capacity:</b> ${c.cap}</p>
          <p style="margin: 2px 0 0;"><b>Expected Intake:</b> ${c.exp}</p>
          <p style="margin: 2px 0 0;"><b>Utilization:</b> <span style="font-weight:bold">${c.util}</span></p>
        </div>
      `);
      mapObjects.current.push(marker);
    });
  };

  const queryAiInsights = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiReport(`### **AI PROCUREMENT INTEGRATION INTELLIGENCE**

1. **Procurement Priorities**: Urgent collection is mandated for Govindpur and Rampur villages (Priority P1), which yield a combined 780 MT of harvest. Coordinate physical schedules during Week 1 to prevent post-harvest spoilage as monsoon advances.

2. **Storage Recommendations**: Center A (Rampur Hub) and Center F (Transit Point) are operating at critical 90% storage capacities. Re-route 120 MT of expected incoming volume to Center C (Govindpur Hub), which retains 18% available headroom.

3. **Collection Strategy**: Deploy vehicle fleets in three consecutive phases:
   - *Phase 1 (Week 1)*: Govindpur and Rampur collection centers.
   - *Phase 2 (Week 2)*: Chandpur, Krishnapur, and Sitapur loops.
   - *Phase 3 (Week 3)*: Devipur and Lakshmipur hubs.

4. **Market Opportunities**: Lock in sales contracts for Wheat and Rice immediately. Spot prices are averaging 3.2% above MSP due to export demand. Delay Mustard dispatch by 20 days as futures contracts indicate price rallies.

5. **Logistics Optimization**: Grouping truck allocations on the Govindpur-to-Center-E pipeline into 4 consolidated trips reduces total diesel consumption by 14.5% (approx 45 Litres saved).`);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6 text-[#31572c]" />
          <span>Procurement Intelligence Command</span>
          <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
            | LOGISTICS ENGINE
          </span>
        </h1>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          Monitor expected harvest yields · Collection center storage allocations · GIS route dispatch configurations
        </p>
      </div>

      {/* SECTION 1 - PROCUREMENT KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {[
          { title: "Expected Harvest", val: "3,240 MT", trend: "+8.7%", type: "success", icon: <Wheat size={16} /> },
          { title: "Expected Procure", val: "2,890 MT", trend: "89.2%", type: "info", icon: <ShoppingBag size={16} /> },
          { title: "Estimated Value", val: "₹5.8 Cr", trend: "REVENUE", type: "warning", icon: <Warehouse size={16} /> },
          { title: "Storage Cap", val: "4,500 MT", trend: "AVAILABLE", type: "success", icon: <Warehouse size={16} /> },
          { title: "Storage Util", val: "64%", trend: "MODERATE", type: "warning", icon: <Warehouse size={16} />, progress: 64 },
          { title: "Collection Centers", val: "12 Hubs", trend: "ACTIVE", type: "info", icon: <MapPin size={16} /> },
          { title: "Logistics Ready", val: "78%", trend: "GOOD", type: "success", icon: <Truck size={16} />, progress: 78 },
          { title: "Opportunity Score", val: "84/100", trend: "HIGH", type: "warning", icon: <Star size={16} /> },
        ].map((c, i) => (
          <div key={i} className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[110px]">
            <div>
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{c.title}</span>
              <div className="text-lg font-black mt-1 text-gray-900">{c.val}</div>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
              {c.progress !== undefined ? (
                <div className="w-full">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${c.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  c.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" :
                  c.type === "danger" ? "bg-red-50 text-red-700 border border-red-100" :
                  c.type === "warning" ? "bg-amber-50 text-amber-900 border border-amber-200" : "bg-blue-50 text-blue-800 border border-blue-100"
                }`}>{c.trend}</span>
              )}
              <span className="text-[#31572c]/40">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2 - HARVEST AVAILABILITY TIMELINE */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-sm font-black text-gray-900">Harvest Availability Timeline</h2>
          <div className="flex gap-1.5">
            {["Weekly", "Monthly", "Seasonal"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                  period === p ? "bg-[#31572c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={activeTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={9} label={{ value: 'Volume (MT)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 9 } }} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={9} label={{ value: 'Readiness (%)', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 9 } }} />
              <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Bar yAxisId="left" dataKey="harvest" name="Harvest Volume (MT)" fill="#31572c" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="readiness" name="Readiness %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 3 & 4 - CROP & VILLAGE PROCUREMENT TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Crop Analysis Table */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900">Crop-wise Procurement Analysis</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400">
                  <th className="py-2.5 px-3">Crop</th>
                  <th className="py-2.5 px-3">Production</th>
                  <th className="py-2.5 px-3">Procurement</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Window</th>
                  <th className="py-2.5 px-3">Demand</th>
                  <th className="py-2.5 px-3">Score</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 font-semibold">
                {CROP_PROCUREMENT_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 font-bold text-gray-900">{row.crop}</td>
                    <td className="py-3 px-3 font-mono">{row.prod} MT</td>
                    <td className="py-3 px-3 font-mono">{row.proc} MT</td>
                    <td className="py-3 px-3 font-mono">₹{row.rev}L</td>
                    <td className="py-3 px-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">{row.window}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">{row.demand}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded font-black ${
                        row.score > 80 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        row.score >= 60 ? "bg-amber-50 text-amber-900 border border-amber-200" :
                        "bg-red-50 text-red-700 border border-red-100"
                      }`}>{row.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Village Priority Table */}
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-black text-gray-900">Village-wise Procurement Priority</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400">
                  <th className="py-2.5 px-3">Village</th>
                  <th className="py-2.5 px-3">Production</th>
                  <th className="py-2.5 px-3">Revenue</th>
                  <th className="py-2.5 px-3">Harvest Window</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Priority</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 font-semibold">
                {VILLAGE_PROCUREMENT_PRIORITY.map((row, idx) => {
                  const isUrgent = row.prio === "P1";
                  const isStandard = row.prio === "P2";
                  const bgClass = isUrgent ? "bg-red-50/50" : isStandard ? "bg-amber-50/20" : "bg-transparent";
                  return (
                    <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50/50 transition ${bgClass}`}>
                      <td className="py-3 px-3 font-bold text-gray-900">{row.name}</td>
                      <td className="py-3 px-3 font-mono">{row.prod}</td>
                      <td className="py-3 px-3 font-mono">{row.rev}</td>
                      <td className="py-3 px-3 font-bold text-blue-700">{row.window}</td>
                      <td className="py-3 px-3 font-mono text-gray-500">{row.dist}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          isUrgent ? "bg-red-50 text-red-700 border border-red-100" :
                          isStandard ? "bg-amber-50 text-amber-900 border border-amber-200" :
                          "bg-emerald-55 text-emerald-700 border border-emerald-100/50"
                        }`}>{row.prio} {row.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 5 - COLLECTION CENTER ANALYTICS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Collection Center Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTION_CENTERS.map((c, idx) => {
            const isFull = c.status === "NEAR FULL";
            return (
              <div key={idx} className={`p-4 bg-gray-50/50 border rounded-2xl flex items-center justify-between transition hover:border-[#31572c]/30 ${
                isFull ? "border-amber-300 shadow-sm" : "border-gray-205 border-gray-200"
              }`}>
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{c.name}</span>
                  <div className="text-lg font-black text-gray-900">{c.exp} / {c.cap} MT</div>
                  <div className="text-[10px] text-gray-500">
                    Utilization: <span className={`font-bold ${isFull ? "text-amber-600" : "text-emerald-700"}`}>{c.util}%</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black ${
                    isFull ? "bg-amber-50 text-amber-900 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-100/55"
                  }`}>{c.status}</span>
                  {/* Gauge */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="14" stroke="#e2e8f0" strokeWidth="3" fill="transparent" />
                      <circle cx="20" cy="20" r="14" stroke={isFull ? "#f59e0b" : "#10b981"} strokeWidth="3" fill="transparent" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 * (1 - c.util / 100)} />
                    </svg>
                    <span className="absolute text-[8px] font-black text-gray-900">{c.util}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 6 - STORAGE CAPACITY INTELLIGENCE */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Storage Capacity Intelligence</h2>
        
        {/* Large Stacked Bar Visual */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-xs font-bold text-gray-800">
            <span>Capacity Breakdown (Total: 4,500 MT)</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-black">
              MEDIUM RISK: 1,620 MT shortfall forecasted
            </span>
          </div>

          <div className="h-8 w-full bg-gray-100 rounded-xl relative overflow-hidden flex border border-gray-200">
            <div className="h-full bg-blue-650 bg-blue-600 flex items-center pl-3 text-[10px] font-black text-white" style={{ width: "64%" }}>
              Occupied: 2,880 MT (64%)
            </div>
            <div className="h-full bg-emerald-605 bg-emerald-600 flex items-center pl-3 text-[10px] font-black text-white" style={{ width: "36%" }}>
              Available: 1,620 MT (36%)
            </div>
            
            {/* Forecast need dashed marker */}
            <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-red-500 z-10 flex flex-col justify-end" style={{ left: "72%" }}>
              <span className="bg-red-500 text-white font-black text-[7px] px-1 py-0.5 rounded absolute -bottom-1 left-1.5 whitespace-nowrap">Forecast Need: 3,240 MT</span>
            </div>
          </div>
        </div>

        {/* Commodity Bar Chart */}
        <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl">
          <h3 className="text-xs font-bold text-gray-700 mb-3">Storage by Commodity (MT)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={STORAGE_BY_COMMODITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0" }} />
                <Bar dataKey="amount" name="Stored Amount (MT)" fill="#31572c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 7 - TRANSPORTATION PLANNING MAP */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Transportation Route Planning</h2>
        
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-xl border bg-gray-100 border-gray-200/60 relative z-0"
          style={{ minHeight: "400px" }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-gray-800 rounded-xl">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading routing maps...
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="flex gap-4 text-[10px] font-bold border-b border-gray-200 pb-3 text-gray-805 text-gray-800">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#ef4444]"></span> P1 Urgent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span> P2 Standard
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#10b981]"></span> P3 Normal
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <span className="w-3.5 h-3.5 bg-[#0ea5e9] border border-white rounded-sm"></span> Hubs
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#10b981] border border-slate-900"></span> Villages
          </span>
        </div>

        {/* Route Summary Table */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-gray-750 text-gray-700 uppercase tracking-wider">Logistical Dispatch Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400">
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3">Vehicles</th>
                  <th className="py-2 px-3">Capacity/Trip</th>
                  <th className="py-2 px-3">Total Trips</th>
                  <th className="py-2 px-3">Fuel Estimate</th>
                  <th className="py-2 px-3">Schedule</th>
                  <th className="py-2 px-3">Priority</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 font-semibold">
                {ROUTES_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="py-2.5 px-3 font-bold text-gray-900">{row.route}</td>
                    <td className="py-2.5 px-3">{row.vehicles}</td>
                    <td className="py-2.5 px-3 font-mono">{row.cap}</td>
                    <td className="py-2.5 px-3 font-mono">{row.trips}</td>
                    <td className="py-2.5 px-3 font-mono text-gray-600">{row.fuel}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600">{row.sched}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                        row.prio === "P1" ? "bg-red-50 text-red-700 border border-red-100/50" :
                        row.prio === "P2" ? "bg-amber-50 text-amber-900 border border-amber-200/50" : "bg-emerald-55 text-emerald-700 border border-emerald-100/50"
                      }`}>{row.prio}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 8 - MARKET READINESS */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-6">
        <h2 className="text-sm font-black text-gray-900">Market Readiness Intelligence</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Expected Price", val: "₹2,010/MT", desc: "+4.2% Trend", type: "success" },
            { title: "Expected Revenue", val: "₹5.8 Cr", desc: "GOLD ACTIVE", type: "warning" },
            { title: "Demand Forecast", val: "3,100 MT", desc: "HIGH DEMAND", type: "info" },
            { title: "Active Buyers", val: "24 Buyers", desc: "REGISTERED", type: "success" },
          ].map((c, i) => (
            <div key={i} className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">{c.title}</span>
              <div className="text-xl font-extrabold mt-1 text-gray-900">{c.val}</div>
              <span className={`text-[9px] font-black mt-2 inline-block px-1.5 py-0.5 rounded ${
                c.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                c.type === "warning" ? "bg-amber-55 bg-amber-50 text-amber-900 border border-amber-200" : "bg-blue-50 text-blue-705 border border-blue-100"
              }`}>{c.desc}</span>
            </div>
          ))}
        </div>

        {/* Pricing Comparison Chart */}
        <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl">
          <h3 className="text-xs font-bold text-gray-705 text-gray-700 mb-3">MSP vs Market vs Expected Price Index (₹/MT)</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRICE_COMPARISON_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0" }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="MSP" fill="#64748b" name="Govt MSP (₹)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Market" fill="#0ea5e9" name="Market Wholesale (₹)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Expected" fill="#31572c" name="FPO Expected (₹)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Buyer Interest bar */}
          <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl flex flex-col justify-between min-h-[90px]">
            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Buyer Interest Profile</span>
              <span className="text-emerald-700 font-bold">84% HIGH</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: "84%" }}></div>
            </div>
            <span className="text-[9px] text-gray-500 font-bold uppercase mt-2">Based on historical transactions and active purchase bids</span>
          </div>

          {/* Market Readiness ring */}
          <div className="bg-gray-50/50 p-4 border border-gray-200/60 rounded-xl flex items-center justify-between min-h-[90px]">
            <div>
              <span className="text-xs font-bold text-gray-700 block">Overall Market Readiness Score</span>
              <span className="text-[9px] text-[#31572c] font-bold uppercase block mt-1">OPTIMAL POSITIONING</span>
            </div>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                <circle cx="28" cy="28" r="22" stroke="#10b981" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 22} strokeDashoffset={2 * Math.PI * 22 * (1 - 0.81)} />
              </svg>
              <span className="absolute text-[10px] font-black text-emerald-700 font-mono">81/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 9 - AI PROCUREMENT INSIGHTS */}
      <div className="bg-[#4f772d]/5 border border-[#31572c]/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#31572c] to-[#4f772d] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse text-white" />
            <h2 className="text-xs font-black uppercase tracking-wider text-white">AI Procurement Intelligence</h2>
          </div>
          <button
            onClick={queryAiInsights}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-4.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition disabled:opacity-50 text-xs font-black"
          >
            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            <span>Generate Procurement Intelligence</span>
          </button>
        </div>

        {aiLoading && (
          <div className="p-12 text-center bg-white">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#31572c] mb-2" />
            <p className="text-xs font-bold text-gray-800">Consulting AI Logistics Expert...</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Analyzing warehouse inventory load and route bottlenecks</p>
          </div>
        )}

        {aiReport && !aiLoading && (
          <div className="p-6 bg-white space-y-4">
            {aiReport.split("\n\n").filter(Boolean).map((para, idx) => {
              const cleaned = para.replace(/[#*]/g, "").trim();
              const isHeading = para.startsWith("#") || (para.startsWith("**") && para.endsWith("**"));

              if (isHeading) {
                return (
                  <h4 key={idx} className="text-xs font-black text-[#31572c] uppercase tracking-wider mt-4 first:mt-0">
                    {cleaned}
                  </h4>
                );
              }

              let borderColor = "border-l-emerald-600";
              if (cleaned.startsWith("1")) borderColor = "border-l-red-500";
              else if (cleaned.startsWith("2")) borderColor = "border-l-orange-500";
              else if (cleaned.startsWith("3")) borderColor = "border-l-emerald-600";
              else if (cleaned.startsWith("4")) borderColor = "border-l-amber-500";
              else if (cleaned.startsWith("5")) borderColor = "border-l-blue-500";

              return (
                <div key={idx} className={`pl-3.5 border-l-4 ${borderColor} py-1.5 text-xs font-semibold leading-relaxed text-gray-700`}>
                  {cleaned}
                </div>
              );
            })}
          </div>
        )}

        {!aiReport && !aiLoading && (
          <div className="p-12 text-center text-gray-500 bg-white">
            <Sparkles className="w-6 h-6 text-[#31572c] mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-gray-600">Click "Generate Insights" to run AI recommendations</p>
          </div>
        )}
      </div>

    </div>
  );
}
