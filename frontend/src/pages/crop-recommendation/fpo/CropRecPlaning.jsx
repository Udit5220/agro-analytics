import React, { useState, useMemo, useEffect, useRef } from "react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import {
  Sprout,
  Droplet,
  TrendingUp,
  IndianRupee,
  ShieldAlert,
  Map,
  Activity,
  Layers,
  AlertCircle,
  Sparkles,
  Plus,
  Loader2,
  Settings,
  Download,
  Share2,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const RechartsTooltip = Tooltip;
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Helper to format currency
const formatINR = (value) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString()}`;
  }
};

// Crop constants
const CROP_PROFILES = {
  Rice: { yield: 4.5, price: 22000, water: 12000 },
  Wheat: { yield: 3.8, price: 22750, water: 4500 },
  Sugarcane: { yield: 75.0, price: 3400, water: 25000 },
  Cotton: { yield: 2.2, price: 65000, water: 8000 },
  Maize: { yield: 4.8, price: 20900, water: 6000 },
  Mustard: { yield: 1.8, price: 54500, water: 3000 },
  Soybean: { yield: 2.0, price: 42000, water: 5000 },
  Pulse: { yield: 1.5, price: 60000, water: 3500 },
  Bajra: { yield: 1.6, price: 22500, water: 2500 },
  Groundnut: { yield: 1.8, price: 55000, water: 3500 },
  Sunflower: { yield: 1.4, price: 58000, water: 4000 },
  Gram: { yield: 1.2, price: 52000, water: 3000 },
};

const ALL_CROP_NAMES = Object.keys(CROP_PROFILES);

// ========== OPTIMAL CROP MIX DATA (from image) ==========
const OPTIMAL_CROP_MIX = [
  {
    rank: "#01",
    cropType: "Soybean (LS-21)",
    recArea: 4500,
    recAreaChange: "+12%",
    yield: 2.8,
    waterGap: -120,
    expROI: 2.4,
    marketConf: "HIGH",
    status: "OPTIMAL",
  },
  {
    rank: "#02",
    cropType: "Maize (Hybrid)",
    recArea: 3120,
    recAreaChange: "-5%",
    yield: 4.5,
    waterGap: 240,
    expROI: 1.8,
    marketConf: "HIGH",
    status: "OPTIMAL",
  },
  {
    rank: "#03",
    cropType: "Mustard (Oilseed)",
    recArea: 1450,
    recAreaChange: "+28%",
    yield: 1.2,
    waterGap: -450,
    expROI: 2.1,
    marketConf: "MEDIUM",
    status: "WATCH",
  },
  {
    rank: "#04",
    cropType: "Groundnut",
    recArea: 850,
    recAreaChange: "-",
    yield: 1.8,
    waterGap: -15,
    expROI: 1.5,
    marketConf: "MEDIUM",
    status: "WATCH",
  },
  {
    rank: "#05",
    cropType: "Cotton (Bt)",
    recArea: 620,
    recAreaChange: "-8%",
    yield: 2.2,
    waterGap: 95,
    expROI: 1.6,
    marketConf: "MEDIUM",
    status: "WATCH",
  },
  {
    rank: "#06",
    cropType: "Pigeon Pea",
    recArea: 480,
    recAreaChange: "+15%",
    yield: 1.1,
    waterGap: -210,
    expROI: 1.9,
    marketConf: "LOW",
    status: "WATCH",
  },
  {
    rank: "#07",
    cropType: "Sugarcane",
    recArea: 320,
    recAreaChange: "-22%",
    yield: 72.0,
    waterGap: 1250,
    expROI: 1.2,
    marketConf: "LOW",
    status: "AT RISK",
  },
  {
    rank: "#08",
    cropType: "Wheat (HD-2967)",
    recArea: 280,
    recAreaChange: "-35%",
    yield: 3.9,
    waterGap: -85,
    expROI: 1.4,
    marketConf: "MEDIUM",
    status: "AT RISK",
  },
  {
    rank: "#09",
    cropType: "Sunflower",
    recArea: 190,
    recAreaChange: "+42%",
    yield: 1.3,
    waterGap: -320,
    expROI: 2.2,
    marketConf: "HIGH",
    status: "OPTIMAL",
  },
  {
    rank: "#10",
    cropType: "Bajra (Pearl Millet)",
    recArea: 150,
    recAreaChange: "+5%",
    yield: 1.7,
    waterGap: -40,
    expROI: 1.3,
    marketConf: "LOW",
    status: "WATCH",
  },
  {
    rank: "#11",
    cropType: "Green Gram",
    recArea: 95,
    recAreaChange: "+18%",
    yield: 0.9,
    waterGap: -95,
    expROI: 1.7,
    marketConf: "MEDIUM",
    status: "WATCH",
  },
  {
    rank: "#12",
    cropType: "Sesame",
    recArea: 65,
    recAreaChange: "+55%",
    yield: 0.7,
    waterGap: -180,
    expROI: 2.0,
    marketConf: "HIGH",
    status: "OPTIMAL",
  },
];

export default function CropRecPlaning() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedVillageId, setSelectedVillageId] = useState("v-1");
  const [newCropName, setNewCropName] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showExtendedRankings, setShowExtendedRankings] = useState(false);
  const [targetAdoptionRate, setTargetAdoptionRate] = useState(55);

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const circlesRef = useRef([]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Village Data
  const [villages, setVillages] = useState([
    {
      id: "v-1",
      name: "Karanpur",
      coordinates: [28.3889, 77.2978],
      totalArea: 4500,
      focus: "Soybean",
      compliance: 94,
      yieldDev: 4.2,
      roi: 2.45,
      status: "OPTIMAL",
      allocations: { Soybean: 45, Wheat: 30, Pulse: 15, Rice: 5, Cotton: 5 },
    },
    {
      id: "v-2",
      name: "Bijalpur",
      coordinates: [28.4289, 77.3478],
      totalArea: 3800,
      focus: "Maize",
      compliance: 82,
      yieldDev: -1.5,
      roi: 1.82,
      status: "WATCH",
      allocations: {
        Maize: 50,
        Wheat: 20,
        Mustard: 15,
        Sugarcane: 10,
        Soybean: 5,
      },
    },
    {
      id: "v-3",
      name: "Sarvoday",
      coordinates: [28.3689, 77.2278],
      totalArea: 2900,
      focus: "Cotton",
      compliance: 64,
      yieldDev: -12.8,
      roi: 0.95,
      status: "AT RISK",
      allocations: { Cotton: 30, Bajra: 30, Maize: 20, Rice: 15, Pulse: 5 },
    },
    {
      id: "v-4",
      name: "East River Valley",
      coordinates: [28.4589, 77.2778],
      totalArea: 5200,
      focus: "Rice",
      compliance: 91,
      yieldDev: 3.8,
      roi: 2.3,
      status: "OPTIMAL",
      allocations: { Rice: 60, Wheat: 25, Sugarcane: 10, Pulse: 5 },
    },
    {
      id: "v-5",
      name: "Sunrise Belt",
      coordinates: [28.4789, 77.3578],
      totalArea: 4700,
      focus: "Cotton",
      compliance: 78,
      yieldDev: 1.2,
      roi: 2.1,
      status: "OPTIMAL",
      allocations: { Cotton: 40, Wheat: 30, Mustard: 20, Maize: 10 },
    },
  ]);

  const selectedVillage = useMemo(() => {
    return villages.find((v) => v.id === selectedVillageId) || villages[0];
  }, [villages, selectedVillageId]);

  // Overall FPO statistics
  const overallStats = useMemo(() => {
    let totalArea = villages.reduce((sum, v) => sum + v.totalArea, 0);
    let allocatedArea = 0;
    let totalProd = 0;
    let totalRev = 0;
    let totalWater = 0;
    let totalCost = 0;

    villages.forEach((v) => {
      let villageAllocated = 0;
      Object.entries(v.allocations).forEach(([crop, pct]) => {
        villageAllocated += pct;
        const area = (v.totalArea * pct) / 100;
        const profile = CROP_PROFILES[crop] || CROP_PROFILES.Wheat;
        const yieldVal = area * profile.yield;
        const revVal = yieldVal * profile.price;
        const waterVal = area * profile.water;
        const costVal = area * (profile.price * profile.yield * 0.45);
        totalProd += yieldVal;
        totalRev += revVal;
        totalWater += waterVal;
        totalCost += costVal;
      });
      allocatedArea += (v.totalArea * villageAllocated) / 100;
    });

    const allocationPct =
      totalArea > 0 ? ((allocatedArea / totalArea) * 100).toFixed(1) : "0.0";
    const avgRoi = totalCost > 0 ? (totalRev / totalCost).toFixed(1) : "0.0";

    return {
      totalArea,
      allocationPct,
      production: totalProd,
      revenue: totalRev,
      water: totalWater,
      roi: avgRoi,
    };
  }, [villages]);

  // Scenario Planning Data
  const scenarioData = useMemo(() => {
    const baseRevenue = overallStats.revenue;
    const baseProduction = overallStats.production;
    const baseWater = overallStats.water;

    const calculateMetrics = (rate) => {
      const adoption = rate / 100;
      const simRev = baseRevenue * (1 - adoption) + (baseRevenue * 1.35) * adoption;
      const simProd = baseProduction * (1 - adoption) + (baseProduction * 1.20) * adoption;
      const simWater = baseWater * (1 - adoption) + (baseWater * 0.75) * adoption;
      const savings = baseWater - simWater;
      return {
        adoptionRate: rate,
        revenue: Math.round(simRev),
        production: Math.round(simProd),
        waterDemand: Math.round(simWater),
        waterSavings: Math.round(savings),
      };
    };

    return {
      p30: calculateMetrics(30),
      p60: calculateMetrics(60),
      p90: calculateMetrics(90),
      simulated: calculateMetrics(targetAdoptionRate),
    };
  }, [overallStats, targetAdoptionRate]);

  // Map initialization
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
      script.removeEventListener("load", handleLoad);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L || !mapRef.current) return;
    let resizeObserver = null;
    const timer = setTimeout(() => {
      if (!mapRef.current) return;
      if (leafletMapInstance.current) {
        leafletMapInstance.current.remove();
        leafletMapInstance.current = null;
      }
      const map = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([28.4089, 77.2978], 11);
      leafletMapInstance.current = map;
      window.L.tileLayer(
        `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
        { attribution: "&copy; MapTiler", maxZoom: 18 },
      ).addTo(map);
      renderMapOverlays();
      map.invalidateSize();

      resizeObserver = new ResizeObserver(() => {
        if (leafletMapInstance.current) {
          leafletMapInstance.current.invalidateSize();
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

  useEffect(() => {
    if (leafletMapInstance.current) renderMapOverlays();
  }, [villages, selectedVillageId]);

  useEffect(() => {
    if (leafletMapInstance.current && selectedVillage) {
      leafletMapInstance.current.setView(selectedVillage.coordinates, 11, {
        animate: true,
      });
    }
  }, [selectedVillageId]);

  const renderMapOverlays = () => {
    if (!leafletMapInstance.current || !window.L) return;
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current = [];
    villages.forEach((v) => {
      const isSelected = v.id === selectedVillageId;
      let color =
        v.status === "OPTIMAL"
          ? "#10b981"
          : v.status === "WATCH"
            ? "#f59e0b"
            : "#ef4444";
      const circle = window.L.circle(v.coordinates, {
        color: isSelected ? "#3b82f6" : color,
        fillColor: color,
        fillOpacity: isSelected ? 0.75 : 0.45,
        radius: isSelected ? 700 : 500,
        weight: isSelected ? 3 : 1,
      }).addTo(leafletMapInstance.current);
      circle.bindTooltip(
        `<div class="p-2 font-sans"><b>${v.name}</b><br/>Focus: ${v.focus}<br/>Area: ${v.totalArea} Ha<br/>Status: ${v.status}</div>`,
        { direction: "top" },
      );
      circle.on("click", () => setSelectedVillageId(v.id));
      circlesRef.current.push(circle);
    });
  };

  const handleAllocationChange = (cropName, newPct) => {
    const currentAllocations = { ...selectedVillage.allocations };
    const otherCropsSum = Object.entries(currentAllocations)
      .filter(([c]) => c !== cropName)
      .reduce((sum, [_, val]) => sum + val, 0);
    if (otherCropsSum + newPct > 100) newPct = 100 - otherCropsSum;
    setVillages((prev) =>
      prev.map((v) => {
        if (v.id === selectedVillageId) {
          const updatedAllocations = { ...v.allocations, [cropName]: newPct };
          if (newPct === 0) delete updatedAllocations[cropName];
          const focusAcreagePct = updatedAllocations[v.focus] || 0;
          let compliance = 50 + (focusAcreagePct / 100) * 50;
          compliance = Math.round(Math.min(100, compliance));
          let status = "OPTIMAL";
          if (compliance < 70) status = "AT RISK";
          else if (compliance < 85) status = "WATCH";
          let totalCost = 0,
            totalRevenue = 0;
          Object.entries(updatedAllocations).forEach(([crop, pct]) => {
            const area = (v.totalArea * pct) / 100;
            const profile = CROP_PROFILES[crop] || CROP_PROFILES.Wheat;
            totalRevenue += area * profile.yield * profile.price;
            totalCost += area * (profile.price * profile.yield * 0.45);
          });
          const roi = totalCost > 0 ? totalRevenue / totalCost : 0;
          return {
            ...v,
            allocations: updatedAllocations,
            compliance,
            status,
            roi: parseFloat(roi.toFixed(2)),
          };
        }
        return v;
      }),
    );
  };

  const addCropToPlan = () => {
    if (!newCropName) return;
    setVillages((prev) =>
      prev.map((v) =>
        v.id === selectedVillageId
          ? { ...v, allocations: { ...v.allocations, [newCropName]: 0 } }
          : v,
      ),
    );
    triggerToast(`Added ${newCropName} to ${selectedVillage.name}`);
    setNewCropName("");
  };

  const chartData = useMemo(() => {
    return Object.entries(selectedVillage.allocations).map(([crop, pct]) => ({
      name: crop,
      percentage: pct,
      acreage: Math.round((selectedVillage.totalArea * pct) / 100),
    }));
  }, [selectedVillage]);

  const totalAllocatedPct = Object.values(selectedVillage.allocations).reduce(
    (sum, p) => sum + p,
    0,
  );

  const exportPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("FPO Crop Planning & Allocation Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
    doc.text(
      `Total Area: ${overallStats.totalArea.toLocaleString()} Ha | Revenue: ${formatINR(overallStats.revenue)}`,
      14,
      35,
    );
    doc.autoTable({
      head: [["Village", "Focus", "Area (Ha)", "Compliance", "ROI", "Status"]],
      body: villages.map((v) => [
        v.name,
        v.focus,
        v.totalArea,
        `${v.compliance}%`,
        v.roi,
        v.status,
      ]),
      startY: 45,
      theme: "striped",
      headStyles: { fillColor: [19, 42, 19] },
    });
    doc.save(`FPO_Plan_${new Date().toISOString().split("T")[0]}.pdf`);
    triggerToast("PDF downloaded!");
  };

  const displayedCrops = showExtendedRankings
    ? OPTIMAL_CROP_MIX
    : OPTIMAL_CROP_MIX.slice(0, 4);

  // Village compliance matrix columns removed


  const optimalCropColumns = [
    { header: "Rank", accessor: "rank", className: "font-mono font-black text-[#31572c]" },
    { header: "Crop Type", accessor: "cropType", className: "font-bold text-gray-900" },
    {
      header: "Rec. Area (Ha)",
      accessor: "recArea",
      cell: (val, row) => (
        <span>
          {val.toLocaleString()}
          <span className="text-[9px] text-[#31572c] ml-1 font-bold">
            {row.recAreaChange}
          </span>
        </span>
      )
    },
    { header: "Yield (MT/Ha)", accessor: "yield", cell: (val) => `${val} MT/Ha` },
    {
      header: "Water Gap",
      accessor: "waterGap",
      cell: (val) => (
        <span className={`font-mono font-bold ${val < 0 ? "text-red-600" : "text-blue-600"}`}>
          {val > 0 ? `+${val}` : val} m³
        </span>
      )
    },
    { header: "Exp. ROI", accessor: "expROI", cell: (val) => `${val}x`, className: "font-bold text-[#31572c]" },
    {
      header: "Status",
      accessor: "status",
      cell: (val) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            val === "OPTIMAL"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : val === "WATCH"
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 max-w-7xl mx-auto pb-16 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#132a13] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-[#ecf39e]" />
          <span className="text-xs font-black">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#31572c]" />
            <span>FPO Crop Planning Console</span>
            <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
              | OPTIMAL MIX ENGINE
            </span>
          </h1>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            Maximize revenue · Simulate allocations · Hydro-footprint compliance
          </p>
        </div>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 text-xs font-black border border-gray-300 bg-white rounded-xl px-4 py-2 shadow-sm hover:bg-gray-50"
        >
          <Download className="w-3.5 h-3.5" /> Export PDF
        </button>
      </div>

      {/* KPI Row using StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Area"
          value={`${overallStats.totalArea.toLocaleString()} Ha`}
          subtext="FPO managed"
          icon={<Sprout className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Allocated"
          value={`${overallStats.allocationPct}%`}
          subtext="Active acreage"
          icon={<Layers className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Production"
          value={`${(overallStats.production / 1000).toFixed(1)}k T`}
          subtext="Est. harvest"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Revenue"
          value={formatINR(overallStats.revenue)}
          subtext="Target valuation"
          icon={<IndianRupee className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Avg ROI"
          value={`${overallStats.roi}x`}
          subtext="Return index"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Water Demand"
          value={`${(overallStats.water / 1e6).toFixed(1)}M m³`}
          subtext="Hydro footprint"
          icon={<Droplet className="w-5 h-5 text-emerald-600" />}
        />
        <StatsCard
          title="Avg Compliance"
          value={`${(villages.reduce((a, b) => a + b.compliance, 0) / villages.length).toFixed(0)}%`}
          subtext="Target focus"
          icon={<ShieldAlert className="w-5 h-5 text-emerald-600" />}
        />
      </div>

      {/* Satellite Map (Full Width) */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-black flex items-center gap-2 mb-3">
          <Map className="w-5 h-5 text-[#31572c]" />
          Cluster Satellite Map
          <span className="text-[10px] font-normal text-gray-500 ml-2">
            Click village circles to select
          </span>
        </h3>
        <div
          ref={mapRef}
          className="w-full h-[480px] rounded-xl border bg-slate-800 relative"
          style={{ minHeight: "480px" }}
        >
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white rounded-xl">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading map...
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] font-bold">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#132a13]"></span>{" "}
            Optimal (≥85%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#d97706]"></span> Watch (70-85%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-[#dc2626]"></span> At Risk (&lt;70%)
          </span>
        </div>
      </div>

      {/* Cooperative Adoption & Scenario Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Planning Engine */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-[#31572c]" />
              Scenario Planning Engine
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">
              Estimated business output at different farmer adoption stages
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 30% Preset */}
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-gray-500 tracking-wide block">Low Adoption</span>
                  <span className="text-sm font-black text-gray-900 mt-1 block">30% Preset</span>
                </div>
                <div className="mt-4 space-y-2 text-[10px] font-medium text-gray-600">
                  <div>
                    <span className="text-gray-400 block text-[8px] uppercase font-bold">Est. Revenue</span>
                    <span className="font-bold text-gray-800">{formatINR(scenarioData.p30.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[8px] uppercase font-bold">Est. Production</span>
                    <span className="font-bold text-gray-800">{(scenarioData.p30.production / 1000).toFixed(1)}k MT</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[8px] uppercase font-black">Water Savings</span>
                    <span className="font-black text-emerald-700">{(scenarioData.p30.waterSavings / 1e6).toFixed(2)}M m³</span>
                  </div>
                </div>
              </div>

              {/* 60% Preset */}
              <div className="border border-brand-medium/30 rounded-xl p-3 bg-brand-medium/5 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-brand-medium tracking-wide block">Target Midpoint</span>
                  <span className="text-sm font-black text-[#31572c] mt-1 block">60% Preset</span>
                </div>
                <div className="mt-4 space-y-2 text-[10px] font-medium text-gray-600">
                  <div>
                    <span className="text-[#31572c]/70 block text-[8px] uppercase font-bold">Est. Revenue</span>
                    <span className="font-bold text-[#31572c]">{formatINR(scenarioData.p60.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-[#31572c]/70 block text-[8px] uppercase font-bold">Est. Production</span>
                    <span className="font-bold text-[#31572c]">{(scenarioData.p60.production / 1000).toFixed(1)}k MT</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[8px] uppercase font-black">Water Savings</span>
                    <span className="font-black text-emerald-700">{(scenarioData.p60.waterSavings / 1e6).toFixed(2)}M m³</span>
                  </div>
                </div>
              </div>

              {/* 90% Preset */}
              <div className="border border-[#132a13]/40 rounded-xl p-3 bg-[#132a13]/10 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black uppercase text-[#132a13] tracking-wide block">Cooperative Max</span>
                  <span className="text-sm font-black text-[#132a13] mt-1 block">90% Preset</span>
                </div>
                <div className="mt-4 space-y-2 text-[10px] font-medium text-gray-600">
                  <div>
                    <span className="text-[#132a13] block text-[8px] uppercase font-bold">Est. Revenue</span>
                    <span className="font-bold text-[#132a13]">{formatINR(scenarioData.p90.revenue)}</span>
                  </div>
                  <div>
                    <span className="text-[#132a13] block text-[8px] uppercase font-bold">Est. Production</span>
                    <span className="font-bold text-[#132a13]">{(scenarioData.p90.production / 1000).toFixed(1)}k MT</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[8px] uppercase font-black">Water Savings</span>
                    <span className="font-black text-emerald-700">{(scenarioData.p90.waterSavings / 1e6).toFixed(2)}M m³</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor Panel */}
          <div className="bg-[#132a13]/5 border border-[#132a13]/10 p-4 rounded-xl mt-4 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-black text-[#132a13] uppercase tracking-wide block">AI Planning Advisory</span>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                By targeting a <span className="font-bold text-[#31572c]">60%+ Member Adoption Rate</span>, the cooperative can expect to reduce total water demand by <span className="font-bold text-[#31572c]">{(scenarioData.p60.waterSavings / 1e6).toFixed(2)} Million m³</span> while boosting revenue by <span className="font-bold text-emerald-700">{formatINR(scenarioData.p60.revenue - overallStats.revenue)}</span>. Transitioning sugarcane crops in Bijalpur to oilseeds is highly recommended to bridge regional irrigation gaps.
              </p>
            </div>
          </div>
        </div>

        {/* Member Adoption Impact Simulator */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-[#31572c]" />
              Member Adoption Impact Simulator
            </h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4">
              Simulate FPO-wide business outcomes by adjusting overall farmer adoption target
            </p>

            <div className="space-y-4">
              {/* Adoption Slider */}
              <div className="bg-gray-50 border rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-gray-800">Target Member Adoption</span>
                  <span className="text-sm font-black text-[#31572c] bg-white border border-[#31572c]/20 px-2.5 py-0.5 rounded-full font-mono">
                    {targetAdoptionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={targetAdoptionRate}
                  onChange={(e) => setTargetAdoptionRate(parseInt(e.target.value))}
                  className="w-full accent-[#31572c] h-2 rounded-lg"
                />
                <div className="flex justify-between text-[9px] text-gray-400 font-bold mt-1 uppercase">
                  <span>0% (No Adoption)</span>
                  <span>50% (Baseline Goal)</span>
                  <span>100% (Full Adoption)</span>
                </div>
              </div>

              {/* Simulation Output Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-xl p-3 bg-brand-medium/5 border-brand-medium/20">
                  <span className="text-[10px] text-[#31572c] font-black uppercase tracking-wider block">Simulated FPO Revenue</span>
                  <span className="text-base font-black text-emerald-800 mt-1 block">
                    {formatINR(scenarioData.simulated.revenue)}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold">
                    +{(((scenarioData.simulated.revenue - overallStats.revenue) / (overallStats.revenue || 1)) * 100).toFixed(1)}% vs Current
                  </span>
                </div>

                <div className="border rounded-xl p-3 bg-blue-50 border-blue-100">
                  <span className="text-[10px] text-blue-800 font-black uppercase tracking-wider block">Simulated Water Savings</span>
                  <span className="text-base font-black text-blue-900 mt-1 block font-mono">
                    {(scenarioData.simulated.waterSavings / 1e6).toFixed(2)}M m³
                  </span>
                  <span className="text-[9px] text-blue-600 font-bold">
                    {((scenarioData.simulated.waterDemand / (overallStats.water || 1)) * 100).toFixed(0)}% of current volume
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t text-[10px] text-gray-500 flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Real-time projection based on selected village crop allocations</span>
            </span>
            <span className="font-black text-[#31572c]">ACTIVE SIMULATION</span>
          </div>
        </div>
      </div>

      {/* Village Selection & Allocation Simulator */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Village Selector & Allocations */}
          <div>
            <div className="border-b pb-2 mb-4">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Sprout className="w-4 h-4 text-[#31572c]" />
                Village Crop Allocator
              </h3>
            </div>

            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              className="w-full text-xs font-bold bg-gray-50 border rounded-xl px-3 py-2.5 mb-4"
            >
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} (Focus: {v.focus} | Status: {v.status})
                </option>
              ))}
            </select>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {ALL_CROP_NAMES.map((crop) => {
                const pct = selectedVillage.allocations[crop] ?? 0;
                if (pct === 0 && crop !== selectedVillage.focus) return null;
                return (
                  <div key={crop} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="flex items-center gap-1">
                        {crop}
                        {crop === selectedVillage.focus && (
                          <Sparkles className="w-3 h-3 text-amber-500" />
                        )}
                      </span>
                      <span className="text-[#31572c]">{pct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pct}
                      onChange={(e) =>
                        handleAllocationChange(crop, parseInt(e.target.value))
                      }
                      className="w-full accent-[#31572c] h-1.5 rounded-lg"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between items-center text-xs font-bold p-3 bg-gray-50 rounded-xl">
              <span>Total Allocated Acreage:</span>
              <span
                className={`flex items-center gap-1.5 ${
                  totalAllocatedPct === 100
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                <span>{totalAllocatedPct}%</span>
                {totalAllocatedPct === 100 ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fully Allocated</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Under-Allocated</span>
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-[1fr_80px] gap-2 mt-3">
              <select
                value={newCropName}
                onChange={(e) => setNewCropName(e.target.value)}
                className="text-xs font-medium border rounded-xl px-3 py-2 bg-white"
              >
                <option value="">+ Add new crop to plan</option>
                {ALL_CROP_NAMES.filter(
                  (c) => !selectedVillage.allocations[c],
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                onClick={addCropToPlan}
                disabled={!newCropName}
                className="bg-brand-dark hover:bg-[#132a13] text-white rounded-xl text-[10px] font-black disabled:opacity-50 transition"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1" /> Add
              </button>
            </div>
          </div>

          {/* Chart & Metrics */}
          <div>
            <div className="border-b pb-2 mb-4">
              <h3 className="text-sm font-black">
                Allocation Share (Hectares)
              </h3>
            </div>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fontWeight: 600 }}
                      angle={-25}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <RechartsTooltip
                      formatter={(val) => `${val.toLocaleString()} Ha`}
                    />
                    <Bar
                      dataKey="acreage"
                      fill="#31572c"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-bold">
                  No crops allocated yet
                </div>
              )}
            </div>

            <div className="bg-[#132a13]/5 border border-[#132a13]/10 p-4 rounded-xl mt-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase tracking-wide">
                    Est. Yield
                  </span>
                  <span className="font-black text-gray-900 text-lg">
                    {Math.round(
                      chartData.reduce(
                        (s, c) =>
                          s + c.acreage * (CROP_PROFILES[c.name]?.yield || 0),
                        0,
                      ),
                    ).toLocaleString()}{" "}
                    MT
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase tracking-wide">
                    Est. Revenue
                  </span>
                  <span className="font-black text-emerald-700 text-lg">
                    {formatINR(
                      chartData.reduce(
                        (s, c) =>
                          s +
                          c.acreage *
                            (CROP_PROFILES[c.name]?.yield || 0) *
                            (CROP_PROFILES[c.name]?.price || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimal Crop Mix Table (GenericTable) */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              Optimal Crop Mix Engine
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
              STRATEGY: MAXIMIZE REVENUE | SEASON OUTLOOK
            </p>
          </div>
          <button
            onClick={() => setShowExtendedRankings(!showExtendedRankings)}
            className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-gray-800 shadow-sm"
          >
            {showExtendedRankings
              ? "▼ SHOW TOP 4 RECOMMENDATIONS"
              : "▶ VIEW EXTENDED RANKINGS (12 CROPS)"}
          </button>
        </div>

        <GenericTable
          columns={optimalCropColumns}
          data={displayedCrops}
          itemsPerPage={6}
          showSearch={false}
          emptyMessage="No crop recommendations found"
        />

        <div className="mt-3 pt-3 border-t border-gray-100 text-[9px] text-gray-500 flex justify-between">
          <span className="flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-[#31572c] shrink-0" />
            <span>Market confidence based on futures & demand</span>
          </span>
          <span className="flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Water gap = deviation from baseline allocation</span>
          </span>
        </div>
      </div>
    </div>
  );
}
