import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  MapPin,
  TrendingUp,
  BarChart2,
  IndianRupee,
  LineChart,
  Sprout,
  AlertTriangle,
  Layers,
  Settings,
  Plus,
  Download,
  Share2,
  Calendar,
  FileText,
  Sparkles,
  X,
  ChevronUp,
  ChevronDown,
  ShieldAlert,
  Droplet,
  CloudRain,
  Loader2,
  HelpCircle,
  Activity,
  ArrowRight,
  TrendingDown,
  Info,
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
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Treemap,
} from "recharts";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { callGeminiFlash } from "../../../services/geminiService";

import seededData from "../../../seed-json/seededData.json";

const {
  villageTelemetryData: VILLAGE_DATA,
  cropDistributionMetrics: CROP_DISTRIBUTION_DATA,
} = seededData.cropRecommendation1.fpo;

// Helper to format currency in INR Lakhs/Crores
const formatINR = (value) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString()}`;
  }
};

export default function CropRecDashboard() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayer, setActiveLayer] = useState("yield"); // yield | production | revenue | risk | crop
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [activeTabRank, setActiveTabRank] = useState("yield"); // yield | revenue | adoption | risk

  // Sorting Table
  const [sortField, setSortField] = useState("revenue");
  const [sortOrder, setSortOrder] = useState("desc");

  // AI Panel States
  const [aiReport, setAiReport] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const circlesRef = useRef([]);
  const hasFetchedRef = useRef(false);

  // Toast Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Dynamic calculations for overall FPO cluster
  const kpiData = useMemo(() => {
    const totalFarmers = 12450; // Hardcoded scaling target
    const activeFarmersPct = 92;
    const totalAcreage = VILLAGE_DATA.reduce((sum, v) => sum + v.acreage, 0);
    const totalProduction = VILLAGE_DATA.reduce(
      (sum, v) => sum + v.production,
      0,
    );
    const totalRevenue = VILLAGE_DATA.reduce((sum, v) => sum + v.revenue, 0);
    const averageYield = parseFloat(
      (totalProduction / totalAcreage).toFixed(1),
    );
    const adoptionRate = 78;
    const businessHealthScore = Math.round(
      (85 * 0.2) + (adoptionRate * 0.25) + (88 * 0.2) + (81 * 0.15) + (68 * 0.15) - (38 * 0.1) + 10
    ); // ~83%

    return {
      totalFarmers,
      activeFarmersPct,
      totalAcreage,
      totalProduction,
      totalRevenue,
      averageYield,
      adoptionRate,
      businessHealthScore,
    };
  }, []);

  // Dynamically inject Leaflet assets
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
      if (window.L) {
        setMapLoaded(true);
      }
    };

    script.addEventListener("load", handleLoad);

    const interval = setInterval(() => {
      if (checkLeaflet()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      if (script) {
        script.removeEventListener("load", handleLoad);
      }
      clearInterval(interval);
    };
  }, []);

  // Initialize Map once
  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;

    let map = null;
    const timer = setTimeout(() => {
      if (!mapRef.current) return;
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }

      // Set center coordinates of Haryana region (approx)
      map = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([28.4089, 77.2978], 11);

      leafletMapInstance.current = map;

      // Use MapTiler Satellite Map
      window.L.tileLayer(
        `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
          maxZoom: 18,
        },
      ).addTo(map);

      // Refresh overlay markers
      renderMapOverlays();

      // Force Leaflet to recalculate container bounds
      map.invalidateSize();

      const resizeObserver = new ResizeObserver(() => {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapRef.current);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
    };
  }, [mapLoaded]);

  // Update overlays when activeLayer changes
  useEffect(() => {
    if (leafletMapInstance.current) {
      renderMapOverlays();
    }
  }, [activeLayer]);

  // Render Overlays Based on Layer
  const renderMapOverlays = () => {
    if (!leafletMapInstance.current || !window.L) return;

    // Clear old layers
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];

    VILLAGE_DATA.forEach((v) => {
      let color = "#4f772d"; // default green
      let radius = 600;

      // Color coding rule logic
      if (activeLayer === "yield") {
        if (v.yield >= 4.2)
          color = "#132a13"; // Dark Green
        else if (v.yield >= 2.5)
          color = "#4f772d"; // Medium Green
        else color = "#dc2626"; // Red
        radius = 500 + v.yield * 100;
      } else if (activeLayer === "risk") {
        if (v.riskScore >= 60) color = "#dc2626";
        else if (v.riskScore >= 30) color = "#d97706";
        else color = "#4f772d";
        radius = 400 + v.riskScore * 10;
      } else if (activeLayer === "revenue") {
        color = "#0284c7"; // Blue
        radius = 400 + (v.revenue / 3000000) * 800;
      } else if (activeLayer === "production") {
        color = "#7c3aed"; // Purple
        radius = 400 + (v.production / 24000) * 800;
      } else if (activeLayer === "crop") {
        const cropColors = {
          Rice: "#1d4ed8",
          Wheat: "#eab308",
          Bajra: "#ec4899",
          Maize: "#14b8a6",
          Sugarcane: "#10b981",
          Cotton: "#64748b",
        };
        color = cropColors[v.dominantCrop] || "#6b7280";
        radius = 700;
      }

      const circle = window.L.circle(v.coordinates, {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius,
      }).addTo(leafletMapInstance.current);

      // Tooltip HTML content
      const tooltipContent = `
        <div class="p-2 font-sans text-gray-900 leading-normal">
          <h4 class="font-extrabold text-sm border-b pb-1 mb-1">${v.name}</h4>
          <p class="text-xs"><strong>Farmers:</strong> ${v.farmersCount.toLocaleString()}</p>
          <p class="text-xs"><strong>Acreage:</strong> ${v.acreage.toLocaleString()} Ha</p>
          <p class="text-xs"><strong>Yield:</strong> ${v.yield} T/Ha</p>
          <p class="text-xs"><strong>Production:</strong> ${v.production.toLocaleString()} Tons</p>
          <p class="text-xs"><strong>Revenue:</strong> ${formatINR(v.revenue * 83)}</p>
          <p class="text-xs"><strong>Risk Index:</strong> ${v.riskScore}%</p>
          <span class="text-[9px] font-black uppercase text-emerald-800 tracking-wider mt-1 block">Click to Drilldown &rarr;</span>
        </div>
      `;

      // Render tooltips below the cluster for northern villages to prevent clipping at the top boundary
      const tooltipDirection = v.coordinates[0] > 28.42 ? "bottom" : "top";

      circle.bindTooltip(tooltipContent, {
        permanent: false,
        direction: tooltipDirection,
      });

      circle.on("click", () => {
        setSelectedVillage(v);
      });

      circlesRef.current.push(circle);
    });
  };

  // Fetch AI Insights from Gemini
  const fetchAiInsights = async () => {
    setAiLoading(true);
    try {
      const summaryPayload = {
        kpis: {
          ...kpiData,
          totalRevenue: formatINR(kpiData.totalRevenue * 83),
        },
        villageSummaries: VILLAGE_DATA.map((v) => ({
          name: v.name,
          farmers: v.farmersCount,
          yield: v.yield,
          status: v.status,
          risk: v.riskScore,
        })),
      };

      const systemPrompt =
        "You are a senior agricultural economist and FPO cluster auditor. Always return ONLY raw JSON, no markdown formatting, no backticks, no comments.";
      const userPrompt = `Audit this FPO cluster data: ${JSON.stringify(summaryPayload)}. Report values in ₹ INR (Lakhs/Crores).
      Generate a professional JSON report with these exact fields:
      {
        "executiveSummary": "Overall cluster status, yield index forecasts, and structural stability notes (approx 60 words).",
        "findings": [
          "Regional production leader name and total contribution details",
          "Highest performing financial cluster and its absolute margins",
          "Fastest growing crop variety and its spatial uptake rate",
          "Highest advisory adoption zone and the associated yield surge"
        ],
        "opportunities": [
          "Yield improvement opportunities in lower-density sectors",
          "Water usage optimization recommendations based on soil profiles",
          "Crop diversification opportunities to mitigate pricing vulnerabilities",
          "Market linkage pathways to secure contract rates"
        ],
        "risks": [
          "Water tables depletion details in clay-heavy zones",
          "Pest/vector outbreak threats identified in humid blocks",
          "Market margin drop probability due to unseasonal inflows",
          "Climate alerts (delayed monsoon/hail risks)"
        ],
        "interventions": [
          "Actionable suggestion A (e.g. promoting drip grids)",
          "Actionable suggestion B (e.g. accelerating pulse rotation)",
          "Actionable suggestion C (e.g. installing digital traps)"
        ]
      }`;

      const res = await callGeminiFlash(userPrompt, systemPrompt);
      if (res && res.executiveSummary) {
        setAiReport(res);
        triggerToast("AI Insights refreshed from Gemini!");
      }
    } catch (err) {
      console.error("Gemini failed to audit cluster:", err);
      triggerToast("Gemini offline. Loaded cached agricultural audit.");
    } finally {
      setAiLoading(false);
    }
  };

  // Run initial AI audit once
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAiInsights();
  }, []);

  // Static Fallback Report
  const fallbackReport = useMemo(
    () => ({
      executiveSummary:
        "FPO Cluster health remains stable. Yield forecasts are exceeding seasonal averages by 4.5% due to high advisory adoption. However, pockets in the West Highlands and Southern Clay Belt require immediate soil correction.",
      findings: [
        "Top Region: East River Basin contributing 23,400 Tons of high-grade paddy.",
        "Highest Revenue: East River Basin generating ₹25.73 Cr in gross market transactions.",
        "Fastest Growing Crop: Sugarcane with adoption growing 14% year-over-year in Golden Meadows.",
        "Highest Adoption: East River Basin at 91% implementation of nitrogen balancing recommendations.",
      ],
      opportunities: [
        "Acreage expansion in West Highlands for climate-resilient millets.",
        "Water audit in Central Oasis using soil tension telemetry to cut consumption by 20%.",
        "Diversification to Mustard in wheat-saturated soils to capture winter premium pricing.",
        "Direct B2B supply agreements for FPO members to skip local middleman commissions.",
      ],
      risks: [
        "Critical moisture deficits detected in Dry Hill Ridge due to water table drop.",
        "Aphid invasion warning issued for Southern Clay Belt under current humidity levels.",
        "Market volatility in paddy prices due to unexpected central procurement delays.",
        "Late-stage temperature anomalies during wheat grain filling window.",
      ],
      interventions: [
        "Deploy mobile precision sprinkler carts to low-water zones.",
        "Increase acreage of drought-tolerant mustard crops by 800 Hectares.",
        "Deploy village-level digital pest scanning arrays.",
      ],
    }),
    [],
  );

  const report = aiReport || fallbackReport;

  // Sorting Handler
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Sorted Village List
  const sortedVillages = useMemo(() => {
    return [...VILLAGE_DATA].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }, [sortField, sortOrder]);

  // Village Rankings Data based on active tab
  const rankingData = useMemo(() => {
    let sortedList = [...VILLAGE_DATA];
    if (activeTabRank === "yield") {
      sortedList.sort((a, b) => b.yield - a.yield);
      return sortedList.map((v) => ({
        name: v.name,
        value: v.yield,
        unit: "T/Ha",
      }));
    } else if (activeTabRank === "revenue") {
      sortedList.sort((a, b) => b.revenue - a.revenue);
      return sortedList.map((v) => ({
        name: v.name,
        value: (v.revenue * 83) / 10000000,
        unit: " Cr",
      }));
    } else if (activeTabRank === "adoption") {
      sortedList.sort((a, b) => b.adoptionRate - a.adoptionRate);
      return sortedList.map((v) => ({
        name: v.name,
        value: v.adoptionRate,
        unit: "%",
      }));
    } else {
      sortedList.sort((a, b) => a.riskScore - b.riskScore); // lowest risk is best
      return sortedList.map((v) => ({
        name: v.name,
        value: 100 - v.riskScore,
        unit: " Rating",
      }));
    }
  }, [activeTabRank]);

  // Risk Overview calculations (40% Climate, 30% Pest, 20% Water, 10% Market)
  const riskMetrics = useMemo(() => {
    const avgRisk = Math.round(
      VILLAGE_DATA.reduce((sum, v) => sum + v.riskScore, 0) /
        VILLAGE_DATA.length,
    );
    const affectedVillages = VILLAGE_DATA.filter(
      (v) => v.riskScore > 50,
    ).length;

    // Weight breakdowns
    const climateRisk = Math.round(avgRisk * 1.1);
    const pestRisk = Math.round(avgRisk * 0.95);
    const waterRisk = Math.round(avgRisk * 1.2);
    const marketRisk = Math.round(avgRisk * 0.7);

    // Formula: 40% Climate, 30% Pest, 20% Water, 10% Market
    const calculatedRiskScore = Math.round(
      0.4 * climateRisk + 0.3 * pestRisk + 0.2 * waterRisk + 0.1 * marketRisk,
    );

    return {
      overallScore: calculatedRiskScore,
      climateRisk,
      pestRisk,
      waterRisk,
      marketRisk,
      affectedVillages,
    };
  }, []);

  // Adoption Funnel Data
  const funnelData = [
    { name: "Generated", value: 15400, fill: "#132a13" },
    { name: "Accepted", value: 13200, fill: "#31572c" },
    { name: "Rejected", value: 2200, fill: "#dc2626" },
    { name: "Implemented", value: 10300, fill: "#4f772d" },
  ];

  const acceptanceRate = ((13200 / 15400) * 100).toFixed(1);
  const implementationRate = ((10300 / 13200) * 100).toFixed(1);

  // PDF Export
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("FPO Cluster Intelligence Report", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
    doc.text(
      "Operational Authority: Farmer Producer Organization (Haryana Cluster)",
      14,
      31,
    );

    // KPI Strip Text
    doc.text(
      `Farmers: ${kpiData.totalFarmers} (Active: ${kpiData.activeFarmersPct}%)`,
      14,
      40,
    );
    doc.text(
      `Acreage: ${kpiData.totalAcreage.toLocaleString()} Ha | Yield: ${kpiData.averageYield} T/Ha`,
      14,
      45,
    );
    doc.text(
      `Exp. Production: ${kpiData.totalProduction.toLocaleString()} Tons | Exp. Revenue: ${formatINR(kpiData.totalRevenue * 83)}`,
      14,
      50,
    );

    // Village Performance Table
    const tableColumn = [
      "Village Cluster",
      "Farmers",
      "Acreage (Ha)",
      "Production (Tons)",
      "Revenue (INR)",
      "Yield (T/Ha)",
      "Status",
    ];
    const tableRows = VILLAGE_DATA.map((v) => [
      v.name,
      v.farmersCount,
      v.acreage,
      v.production,
      formatINR(v.revenue * 83),
      v.yield,
      v.status,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 58,
      theme: "striped",
      headStyles: { fillColor: [19, 42, 19] }, // Forest green header
    });

    // Save report
    doc.save(
      `FPO_Cluster_Intelligence_${new Date().toISOString().split("T")[0]}.pdf`,
    );
    triggerToast("PDF downloaded successfully!");
  };

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Village Cluster",
      "Farmers",
      "Acreage (Ha)",
      "Production (Tons)",
      "Revenue (INR)",
      "Yield (T/Ha)",
      "Status",
      "Risk Score (%)",
      "Adoption Rate (%)",
    ];
    const rows = VILLAGE_DATA.map((v) => [
      v.name,
      v.farmersCount,
      v.acreage,
      v.production,
      v.revenue * 83,
      v.yield,
      v.status,
      v.riskScore,
      v.adoptionRate,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `FPO_Cluster_Performance_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Excel/CSV data exported successfully!");
  };

  // Generate full AI Report Modal Trigger
  const handleGenerateAIReport = () => {
    fetchAiInsights();
    triggerToast("AI Engine generating deep cluster report...");
  };

  return (
    <div className="space-y-6 antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      {/* ─── TOAST NOTIFICATION ─── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#132a13] text-white border border-[#ecf39e]/30 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#ecf39e] animate-pulse" />
          <span className="text-xs font-black tracking-wide">
            {toastMessage}
          </span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-[#31572c]" />
            <span>FPO Cluster Intelligence Dashboard</span>
            <span className="text-gray-300 font-light text-xl">|</span>
            <span className="text-[#31572c] font-black text-sm md:text-base uppercase tracking-wider">
              हरियाणा संकुल केंद्र
            </span>
          </h1>
          <p className="text-gray-600 text-[11px] md:text-xs font-semibold mt-1">
            Enterprise command center monitoring village performance, production
            forecasts, and spatial crop yield telemetry.
          </p>
        </div>

        {/* Sync telemetry action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAiInsights}
            disabled={aiLoading}
            className="flex items-center space-x-1.5 text-[11px] font-black tracking-wider uppercase border border-gray-300 bg-white hover:bg-gray-50 rounded-xl px-4 py-2 text-gray-950 active:scale-[0.98] disabled:opacity-70 cursor-pointer shadow-sm"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#31572c]" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#31572c] animate-pulse" />
                <span>Audited By Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── SECTION 1: EXECUTIVE KPI STRIP ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Farmers */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Farmers
          </span>
          <h3 className="text-lg font-black text-gray-950 mt-2">
            {kpiData.totalFarmers.toLocaleString()}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            Total registered members
          </p>
          <div className="absolute top-3 right-3 text-emerald-700 bg-emerald-50 border border-emerald-200 text-[9px] font-black px-1.5 py-0.5 rounded">
            +8.2%
          </div>
        </div>

        {/* Card 2: Active Farmers */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm relative overflow-hidden hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Active Farmers
          </span>
          <h3 className="text-lg font-black text-gray-950 mt-2">
            {kpiData.activeFarmersPct}%
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            {(11454).toLocaleString()} in cycle
          </p>
          <div className="absolute top-3 right-3 h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>

        {/* Card 3: Acreage */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Acreage
          </span>
          <h3 className="text-lg font-black text-gray-950 mt-2">
            45k <span className="text-xs font-bold text-gray-600">Ha</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            {kpiData.totalAcreage.toLocaleString()} Ha registered
          </p>
        </div>

        {/* Card 4: Expected Production */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Expected Prod.
          </span>
          <h3 className="text-lg font-black text-gray-950 mt-2">
            180k <span className="text-xs font-bold text-gray-600">Tons</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            {kpiData.totalProduction.toLocaleString()} Tons estimated
          </p>
        </div>

        {/* Card 5: Expected Revenue */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Expected Revenue
          </span>
          <h3 className="text-lg font-black text-emerald-800 mt-2">
            {formatINR(kpiData.totalRevenue * 83)}
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            Target spot valuation
          </p>
        </div>

        {/* Card 6: Average Yield */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Avg Yield
          </span>
          <h3 className="text-lg font-black text-gray-950 mt-2">
            {kpiData.averageYield}{" "}
            <span className="text-xs font-bold text-gray-600">T/Ha</span>
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            FPO baseline productivity
          </p>
        </div>

        {/* Card 7: Adoption Rate */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Adoption Rate
          </span>
          <h3 className="text-lg font-black text-indigo-700 mt-2">
            {kpiData.adoptionRate}%
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            Recommendations implemented
          </p>
        </div>

        {/* Card 8: Business Health Score */}
        <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm relative overflow-hidden hover:shadow-md transition-all">
          <span className="text-[9px] font-black text-gray-700 uppercase tracking-wider block">
            Business Health Score
          </span>
          <h3 className="text-lg font-black text-[#31572c] mt-2">
            {kpiData.businessHealthScore}%
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-1">
            Agribusiness performance index
          </p>
          <div className="absolute top-3 right-3 text-emerald-700 bg-emerald-50 border border-emerald-250 text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">
            Optimal
          </div>
        </div>
      </div>

      {/* ─── DUAL SPLIT CANVAS: MAP + AI PANEL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left Column: Satellite Map Panel */}
        <div className="space-y-4">
          {/* Map Controls Card */}
          <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#31572c]" />
                  Cluster Performance Map
                </h3>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                  Overlaying soil yield indicators onto MapTiler satellite maps.
                </p>
              </div>

              {/* Layer Selection buttons */}
              <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-xl border border-gray-200">
                {[
                  { id: "yield", label: "Yield" },
                  { id: "production", label: "Volume" },
                  { id: "revenue", label: "Revenue" },
                  { id: "risk", label: "Risk" },
                  { id: "crop", label: "Crop" },
                ].map((lyr) => (
                  <button
                    key={lyr.id}
                    onClick={() => setActiveLayer(lyr.id)}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                      activeLayer === lyr.id
                        ? "bg-[#132a13] text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {lyr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Canvas Div */}
            <div
              id="fpo-map"
              ref={mapRef}
              className="w-full h-[460px] rounded-2xl border border-gray-300 bg-slate-950 overflow-hidden relative z-10"
              style={{ minHeight: "460px" }}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-20 space-y-2.5">
                  <Loader2 className="w-8 h-8 animate-spin text-[#ecf39e]" />
                  <span className="text-xs font-black tracking-widest uppercase">
                    Initializing Satellite Maps...
                  </span>
                </div>
              )}
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[10px] text-gray-500 border-t border-gray-100 font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#132a13]" />
                <span>High Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#4f772d]" />
                <span>Medium Performance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#dc2626]" />
                <span>Underperforming / At Risk</span>
              </div>
              <div className="text-[9px] bg-gray-100 px-2 py-0.5 rounded border">
                MapTiler satellite overlay active
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Insight Panel (Sticky on Desktop) */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          <div className="bg-[#132a13] text-white border border-[#132a13]/30 rounded-3xl p-5 shadow-xl space-y-4 max-h-[570px] overflow-y-auto scroll-thin">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ecf39e]" />
                <h3 className="text-xs font-black uppercase tracking-wider">
                  AI Cluster Intelligence
                </h3>
              </div>
              {aiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#ecf39e]" />
              ) : (
                <button
                  onClick={fetchAiInsights}
                  className="text-[10px] font-black text-[#ecf39e] hover:underline cursor-pointer"
                >
                  Refresh
                </button>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ecf39e]/70">
                Executive Summary
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                {report.executiveSummary}
              </p>
            </div>

            {/* Findings */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ecf39e]/70">
                Key Findings
              </span>
              <ul className="space-y-2">
                {report.findings.map((f, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-200 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-[#ecf39e] font-black select-none mt-0.5">
                      •
                    </span>
                    <span className="font-semibold">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ecf39e]/70">
                Opportunities
              </span>
              <ul className="space-y-2">
                {report.opportunities.map((o, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-200 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-emerald-400 font-black select-none mt-0.5">
                      ✓
                    </span>
                    <span className="font-semibold">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ecf39e]/70 text-red-400">
                Active Risks
              </span>
              <ul className="space-y-2">
                {report.risks.map((r, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-200 leading-relaxed flex items-start gap-2"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interventions */}
            <div className="space-y-1.5 pt-2 border-t border-white/10 pt-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ecf39e]/70">
                Suggested Interventions
              </span>
              <ul className="space-y-2">
                {report.interventions.map((iv, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-200 leading-relaxed flex items-start gap-2 bg-white/5 border border-white/10 p-2.5 rounded-xl"
                  >
                    <Sprout className="w-4 h-4 text-[#ecf39e] shrink-0 mt-0.5" />
                    <span className="font-semibold">{iv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── SECTION 4: DETAILED CLUSTER PERFORMANCE TABLE ─── */}
      <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-[#31572c]" />
              Detailed Cluster Performance
            </h3>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              Individual village cluster yield registers, transaction sizes, and
              status indexes.
            </p>
          </div>
        </div>

        {/* Village performance table layout */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50 text-[10px] font-black uppercase text-gray-700 tracking-wider">
                <th
                  className="p-3.5 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  Village Cluster{" "}
                  {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("farmersCount")}
                >
                  Farmers{" "}
                  {sortField === "farmersCount" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("acreage")}
                >
                  Acreage (Ha){" "}
                  {sortField === "acreage" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("production")}
                >
                  Production (Tons){" "}
                  {sortField === "production" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("revenue")}
                >
                  Revenue (INR){" "}
                  {sortField === "revenue" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("yield")}
                >
                  Yield (T/Ha){" "}
                  {sortField === "yield" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3.5 text-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  Status{" "}
                  {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-xs font-semibold text-gray-900">
              {sortedVillages.map((v) => {
                const statusStyles = {
                  Optimal: "bg-emerald-50 text-emerald-950 border-emerald-300",
                  Watch: "bg-yellow-50 text-yellow-950 border-yellow-300",
                  "At Risk": "bg-orange-50 text-orange-950 border-orange-300",
                  Critical: "bg-red-50 text-red-950 border-red-300",
                };

                return (
                  <tr
                    key={v.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-3.5 font-bold text-gray-950">{v.name}</td>
                    <td className="p-3.5 text-center">
                      {v.farmersCount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      {v.acreage.toLocaleString()} Ha
                    </td>
                    <td className="p-3.5 text-center">
                      {v.production.toLocaleString()} Tons
                    </td>
                    <td className="p-3.5 text-center text-emerald-800 font-extrabold">
                      {formatINR(v.revenue * 83)}
                    </td>
                    <td className="p-3.5 text-center font-bold text-[#31572c]">
                      {v.yield} T/Ha
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${statusStyles[v.status] || "bg-gray-100"}`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedVillage(v)}
                        className="text-[#31572c] hover:text-[#132a13] font-black hover:underline cursor-pointer uppercase tracking-wider text-[10px]"
                      >
                        Drilldown
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SECTION 5: CLUSTER RANKINGS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#31572c]" />
                Top 10 Village Clusters
              </h3>
              <p className="text-[10px] text-gray-500 font-bold mt-0.5">
                Ranking village units across key parameters.
              </p>
            </div>

            {/* Rank Parameter tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
              {[
                { id: "yield", label: "Yield" },
                { id: "revenue", label: "Revenue" },
                { id: "adoption", label: "Adoption" },
                { id: "risk", label: "Lowest Risk" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabRank(tab.id)}
                  className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-lg cursor-pointer ${
                    activeTabRank === tab.id
                      ? "bg-[#132a13] text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Ranking Bars */}
          <div className="space-y-3.5">
            {rankingData.map((item, idx) => {
              const maxVal = Math.max(...rankingData.map((d) => d.value));
              const widthPct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-800">
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-400 bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-extrabold text-[#31572c]">
                      {activeTabRank === "revenue"
                        ? `₹${item.value.toFixed(2)} Cr`
                        : `${item.value}${item.unit}`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#4f772d] to-[#132a13] transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── SECTION 7: RISK OVERVIEW ─── */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-700" />
              Risk Intelligence Command
            </h3>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              Weighted risk score: 40% Climate, 30% Pest, 20% Water, 10% Market.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 items-center">
            {/* Risk Gauge */}
            <div className="flex flex-col items-center justify-center p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-800">
                Weighted Score
              </span>
              <div className="relative h-24 w-24 flex items-center justify-center mt-3">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="6"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="transparent"
                    stroke={
                      riskMetrics.overallScore >= 60
                        ? "#dc2626"
                        : riskMetrics.overallScore >= 35
                          ? "#d97706"
                          : "#4f772d"
                    }
                    strokeWidth="6"
                    pathLength="100"
                    strokeDasharray={`${riskMetrics.overallScore}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-lg font-black text-gray-950">
                  {riskMetrics.overallScore}%
                </span>
              </div>
              <span className="text-[10px] font-black text-red-700 mt-2 block">
                {riskMetrics.affectedVillages} Villages Affected (&gt;50)
              </span>
            </div>

            {/* Risk Breakdown progress sliders */}
            <div className="space-y-4">
              {[
                {
                  label: "Climate Risk (40%)",
                  value: riskMetrics.climateRisk,
                  icon: <CloudRain className="w-3.5 h-3.5 text-blue-600" />,
                },
                {
                  label: "Pest & Disease Risk (30%)",
                  value: riskMetrics.pestRisk,
                  icon: <ShieldAlert className="w-3.5 h-3.5 text-red-600" />,
                },
                {
                  label: "Water Depletion Risk (20%)",
                  value: riskMetrics.waterRisk,
                  icon: <Droplet className="w-3.5 h-3.5 text-sky-600" />,
                },
                {
                  label: "Market Price Risk (10%)",
                  value: riskMetrics.marketRisk,
                  icon: (
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  ),
                },
              ].map((r, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-black text-gray-800">
                    <span className="flex items-center gap-1.5">
                      {r.icon}
                      {r.label}
                    </span>
                    <span>{r.value}%</span>
                  </div>
                  <div className="w-full bg-gray-150 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        r.value >= 60
                          ? "bg-red-500"
                          : r.value >= 35
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 6: PRODUCTION & REVENUE DISTRIBUTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Distribution Area/Pie */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">
              Crop Area Distribution
            </h3>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              Cultivated acreage share per crop.
            </p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CROP_DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="area"
                >
                  {CROP_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val) => `${val.toLocaleString()} Ha`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[9px] font-black text-gray-700 uppercase">
            {CROP_DISTRIBUTION_DATA.slice(0, 6).map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Production Treemap representation */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">
              Production Volume Share
            </h3>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              Total metric tons of crop yield share.
            </p>
          </div>

          <div className="h-64 overflow-hidden rounded-xl border border-gray-200">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={CROP_DISTRIBUTION_DATA}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#31572c"
              >
                <RechartsTooltip
                  formatter={(val) => `${val.toLocaleString()} Tons`}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
          <div className="text-[9px] text-gray-400 font-bold text-center">
            Treemap sizes proportional to harvested volume (Tons)
          </div>
        </div>

        {/* Revenue Distribution Bar */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">
              Revenue Contribution
            </h3>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              Estimated gross transactions in ₹ INR.
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CROP_DISTRIBUTION_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 900 }} />
                <YAxis
                  tickFormatter={(val) => {
                    const inrVal = val * 83;
                    if (inrVal >= 10000000)
                      return `₹${(inrVal / 10000000).toFixed(1)} Cr`;
                    if (inrVal >= 100000)
                      return `₹${(inrVal / 100000).toFixed(1)} L`;
                    return `₹${inrVal}`;
                  }}
                  tick={{ fontSize: 9 }}
                />
                <RechartsTooltip formatter={(val) => formatINR(val * 83)} />
                <Bar dataKey="revenue" fill="#132a13" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── SECTION 8: ADOPTION FUNNEL & ANALYTICS ─── */}
      <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-5">
        <div>
          <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-[#31572c]" />
            Agronomic Recommendation Adoption Funnel
          </h3>
          <p className="text-[10px] text-gray-500 font-bold mt-0.5">
            Tracing advisory generated, accepted, and implemented rates across
            clusters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-center">
          {/* Funnel chart mockup */}
          <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-2xl">
            {funnelData.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs font-black">
                <div className="flex justify-between text-gray-800">
                  <span>{item.name}</span>
                  <span>{item.value.toLocaleString()} advisories</span>
                </div>
                <div className="w-full bg-gray-200 h-6 rounded-md overflow-hidden relative flex items-center pl-3">
                  <div
                    className="absolute left-0 top-0 bottom-0 transition-all opacity-85"
                    style={{
                      width: `${(item.value / 15400) * 100}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                  <span className="relative text-[9px] font-black text-white mix-blend-difference">
                    {Math.round((item.value / 15400) * 100)}% of generated
                  </span>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-gray-200">
              <div>
                <span className="text-[9px] font-black text-gray-500 uppercase block">
                  Acceptance Rate
                </span>
                <span className="text-sm font-black text-[#132a13]">
                  {acceptanceRate}%
                </span>
              </div>
              <div>
                <span className="text-[9px] font-black text-gray-500 uppercase block">
                  Implementation
                </span>
                <span className="text-sm font-black text-emerald-800">
                  {implementationRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Village comparison bar chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={VILLAGE_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 8, fontWeight: 900 }} />
                <YAxis unit="%" tick={{ fontSize: 9 }} />
                <RechartsTooltip formatter={(val) => `${val}%`} />
                <Bar
                  dataKey="adoptionRate"
                  fill="#4f772d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── ACTION CENTER (FAB) ─── */}
      <div className="fixed bottom-6 right-6 z-40">
        {actionMenuOpen && (
          <div className="absolute bottom-16 right-0 bg-white border border-gray-300 rounded-2xl shadow-2xl p-3 w-56 flex flex-col space-y-1.5 animate-fadeIn text-xs font-semibold text-gray-900">
            <div className="px-3 py-1.5 border-b border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              Cluster Actions
            </div>
            <button
              onClick={() => {
                handleGenerateAIReport();
                setActionMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-left cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#31572c]" />
              Generate AI Report
            </button>
            <button
              onClick={() => {
                exportPDF();
                setActionMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-left cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#31572c]" />
              Export PDF Report
            </button>
            <button
              onClick={() => {
                exportCSV();
                setActionMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-left cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#31572c]" />
              Export Excel (CSV)
            </button>
            <button
              onClick={() => {
                setActionMenuOpen(false);
                triggerToast(
                  "Scheduled review invitation sent to village leads!",
                );
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-left cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#31572c]" />
              Schedule Review
            </button>
            <button
              onClick={() => {
                setActionMenuOpen(false);
                navigator.clipboard.writeText(window.location.href);
                triggerToast("Dashboard link copied to clipboard!");
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl text-left cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#31572c]" />
              Share Dashboard
            </button>
          </div>
        )}
        <button
          onClick={() => setActionMenuOpen(!actionMenuOpen)}
          className="w-14 h-14 bg-[#132a13] hover:bg-[#31572c] text-[#ecf39e] border border-[#ecf39e]/20 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer z-50"
          title="FPO Action Center"
        >
          {actionMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Settings className="w-6 h-6 animate-spin-slow" />
          )}
        </button>
      </div>

      {/* ─── VILLAGE DETAIL MODAL (Level 1 Drilldown) ─── */}
      {selectedVillage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn text-left">
          <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto scroll-thin space-y-6 relative">
            <button
              onClick={() => {
                setSelectedVillage(null);
                setSelectedFarmer(null);
              }}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-250 border rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>

            {/* Modal Title */}
            <div>
              <span className="text-[9px] font-black uppercase text-gray-500 bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-md">
                Level 1 Drilldown: Village Cluster Profile
              </span>
              <h2 className="text-xl font-extrabold text-gray-950 mt-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#31572c]" />
                {selectedVillage.name}
              </h2>
            </div>

            {/* Grid stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 border p-3.5 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-gray-700">
                  Farmers
                </span>
                <p className="text-base font-black text-gray-950 mt-1">
                  {selectedVillage.farmersCount}
                </p>
              </div>
              <div className="bg-gray-50 border p-3.5 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-gray-700">
                  Total Land
                </span>
                <p className="text-base font-black text-gray-950 mt-1">
                  {selectedVillage.acreage} Ha
                </p>
              </div>
              <div className="bg-gray-50 border p-3.5 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-gray-700">
                  Yield Index
                </span>
                <p className="text-base font-black text-gray-950 mt-1">
                  {selectedVillage.yield} T/Ha
                </p>
              </div>
              <div className="bg-gray-50 border p-3.5 rounded-2xl">
                <span className="text-[9px] font-black uppercase text-gray-700">
                  Dominant Crop
                </span>
                <p className="text-base font-black text-indigo-700 mt-1">
                  {selectedVillage.dominantCrop}
                </p>
              </div>
            </div>

            {/* Farmers Table (Level 2 Drilldown) */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-[#31572c]" />
                Registered Farmers in Cluster
              </h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[9px] font-black text-gray-700 uppercase border-b border-gray-300">
                      <th className="p-3">Farmer Name</th>
                      <th className="p-3 text-center">Land Acreage</th>
                      <th className="p-3 text-center">Crop Preference</th>
                      <th className="p-3 text-center">Yield Projection</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-semibold text-gray-900 divide-y divide-gray-250">
                    {selectedVillage.farmers.map((frm) => (
                      <tr
                        key={frm.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-bold">{frm.name}</td>
                        <td className="p-3 text-center">{frm.acreage} Acres</td>
                        <td className="p-3 text-center">{frm.crop}</td>
                        <td className="p-3 text-center text-[#31572c] font-bold">
                          {frm.yield} T/Ha
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedFarmer(frm)}
                            className="text-[#31572c] hover:underline font-black uppercase text-[10px]"
                          >
                            Select Farmer &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Farmer Profile detail (Level 3 Drilldown) */}
            {selectedFarmer && (
              <div className="bg-gradient-to-br from-[#132a13]/5 to-[#4f772d]/5 border border-[#31572c]/20 p-5 rounded-2xl space-y-4 animate-fadeIn">
                <div>
                  <span className="text-[9px] font-black uppercase text-gray-500 bg-white border border-gray-300 px-2.5 py-0.5 rounded">
                    Level 2/3 Drilldown: Farmer & Crop Profile
                  </span>
                  <h4 className="text-sm font-black text-gray-950 mt-2 flex items-center gap-1.5">
                    <Sprout className="w-4.5 h-4.5 text-[#31572c]" />
                    {selectedFarmer.name} — Crop Analysis
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-gray-800">
                  <div>
                    <span className="text-[9px] font-black text-gray-600 uppercase block">
                      Land Scale
                    </span>
                    <span className="font-black text-gray-950 block mt-0.5">
                      {selectedFarmer.acreage} Acres
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-600 uppercase block">
                      Primary Crop
                    </span>
                    <span className="font-black text-indigo-700 block mt-0.5">
                      {selectedFarmer.crop}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-gray-600 uppercase block">
                      Contact Number
                    </span>
                    <span className="font-bold text-gray-950 block mt-0.5">
                      {selectedFarmer.phone}
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-250 p-4 rounded-xl space-y-2 text-xs">
                  <h5 className="font-black text-gray-950 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <LineChart className="w-3.5 h-3.5 text-[#4f772d]" />
                    Yield Projection Analysis
                  </h5>
                  <p className="text-gray-700 font-semibold leading-normal">
                    This farm's {selectedFarmer.crop} crop expects a projected
                    yield of{" "}
                    <span className="text-[#31572c] font-black">
                      {selectedFarmer.yield} T/Ha
                    </span>
                    . Advisory recommendations (nitrogen balance optimization
                    and weather-triggered irrigation scheduling) are actively
                    logged.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
