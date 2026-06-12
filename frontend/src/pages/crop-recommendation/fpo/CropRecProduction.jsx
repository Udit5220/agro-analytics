// CropRecProduction.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import seededData from "../../../seed-json/seededData.json";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const RechartsTooltip = Tooltip;
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Droplet,
  Sun,
  Cloud,
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Leaf,
  IndianRupee,
  Factory,
  Truck,
  Package,
  Eye,
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Shield,
  Award,
} from "lucide-react";
// Pure Leaflet map component helper
function CropRecProductionMap({ center, zoom, villages }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const map = window.L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView(center, zoom);

    mapInstance.current = map;

    // Use MapTiler Satellite Map
    window.L.tileLayer(
      `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${import.meta.env.VITE_MAPTILER_KEY || "Js3t7mr8sd7cdIiAAyVp"}`,
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
        maxZoom: 18,
      },
    ).addTo(map);

    villages.forEach((village) => {
      const color = getCircleColor(village.level);
      const radius = getRadius(village.production);
      const marker = window.L.circleMarker([village.lat, village.lng], {
        radius,
        fillColor: color,
        color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6,
      }).addTo(map);

      marker.bindPopup(`
        <div class="text-sm p-1 text-slate-800">
          <strong>${village.name}</strong>
          <br />
          Production: ${village.production.toLocaleString()} MT
          <br />
          Revenue: ₹${(village.revenue * 100000).toLocaleString()}
          <br />
          Confidence: ${village.confidence}%
        </div>
      `);
      
      marker.bindTooltip(village.name, { direction: "top" });
    });

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, villages]);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} className="relative z-0" />;
}
import GenericTable from "../../../components/partials/GenericTable";
import StatsCard from "../../../components/partials/StatsCard";

// Helper functions
const formatINR = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

const formatNumber = (value) => value.toLocaleString();

// Sample data for charts
const generateTimeSeriesData = (days, baseValue, growthRate = 0.02) => {
  const data = [];
  for (let i = 0; i <= days; i += 7) {
    data.push({
      date: `Week ${Math.floor(i / 7) + 1}`,
      value: baseValue * (1 + growthRate * (i / 30)),
      revenue: baseValue * 75 * (1 + growthRate * (i / 30)),
      yield: 18.4 * (1 + growthRate * 0.3 * (i / 30)),
    });
  }
  return data;
};

const productionTrendData = generateTimeSeriesData(365, 2847, 0.012);
const revenueTrendData = generateTimeSeriesData(365, 4.2, 0.015);
const yieldTrendData = generateTimeSeriesData(365, 18.4, 0.008);

const {
  cropForecastData,
  villageForecastData,
  harvestCalendarData,
  weeklyHarvestData,
  monthlyHarvestData,
  accuracyData,
  villageCoordinates
} = seededData.cropRecommendation1.fpo;

const getCircleColor = (level) => {
  switch (level) {
    case "high":
      return "#10b981";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

const getRadius = (production) => {
  return Math.min(Math.sqrt(production) * 1.5, 25);
};

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Crop table columns
const cropColumns = [
  { header: "Crop", accessor: "crop", className: "font-bold" },
  {
    header: "Cultivated Area (ha)",
    accessor: "area",
    cell: (val) => formatNumber(val),
  },
  { header: "Expected Yield (q/ha)", accessor: "yield", cell: (val) => val },
  {
    header: "Expected Production (MT)",
    accessor: "production",
    cell: (val) => formatNumber(val),
  },
  {
    header: "Expected Revenue (₹)",
    accessor: "revenue",
    cell: (val) => formatINR(val * 100000),
  },
  {
    header: "Growth %",
    accessor: "growth",
    cell: (val) => (
      <span
        className={`flex items-center gap-1 ${val >= 0 ? "text-[#10b981]" : "text-red-400"}`}
      >
        {val >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(val)}%
      </span>
    ),
  },
  {
    header: "Confidence %",
    accessor: "confidence",
    cell: (val) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#10b981] rounded-full"
            style={{ width: `${val}%` }}
          />
        </div>
        <span className="text-xs">{val}%</span>
      </div>
    ),
  },
];

// Village table columns
const villageColumns = [
  { header: "Village", accessor: "village", className: "font-bold" },
  { header: "Area (ha)", accessor: "area", cell: (val) => formatNumber(val) },
  { header: "Yield (q/ha)", accessor: "yield", cell: (val) => val },
  {
    header: "Production (MT)",
    accessor: "production",
    cell: (val) => formatNumber(val),
  },
  {
    header: "Revenue (₹)",
    accessor: "revenue",
    cell: (val) => formatINR(val * 100000),
  },
  {
    header: "Growth %",
    accessor: "growth",
    cell: (val) => (
      <span
        className={`flex items-center gap-1 ${val >= 0 ? "text-[#10b981]" : "text-red-400"}`}
      >
        {val >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(val)}%
      </span>
    ),
  },
  {
    header: "Confidence %",
    accessor: "confidence",
    cell: (val) => (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#10b981] rounded-full"
            style={{ width: `${val}%` }}
          />
        </div>
        <span className="text-xs">{val}%</span>
      </div>
    ),
  },
];

// Accuracy table columns
const accuracyColumns = [
  { header: "Month", accessor: "month", className: "font-bold" },
  {
    header: "Forecasted (MT)",
    accessor: "forecasted",
    cell: (val) => formatNumber(val),
  },
  {
    header: "Actual (MT)",
    accessor: "actual",
    cell: (val) => formatNumber(val),
  },
  {
    header: "Error (MT)",
    accessor: "error",
    cell: (val) => (
      <span className={val >= 0 ? "text-red-400" : "text-[#10b981]"}>
        {val >= 0 ? `+${formatNumber(val)}` : `-${formatNumber(Math.abs(val))}`}
      </span>
    ),
  },
  {
    header: "Accuracy %",
    accessor: "accuracy",
    cell: (val) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          val >= 90
            ? "bg-[#10b981]/20 text-[#10b981]"
            : val >= 75
              ? "bg-[#f59e0b]/20 text-[#f59e0b]"
              : "bg-red-500/20 text-red-400"
        }`}
      >
        {val}%
      </span>
    ),
  },
];

// Main Component
export default function CropRecProduction() {
  const [forecastPeriod, setForecastPeriod] = useState("90D");
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [mapCenter] = useState([23.5, 78.5]);
  const [mapZoom] = useState(7);

  const periodDays = useMemo(() => {
    switch (forecastPeriod) {
      case "30D": return 30;
      case "60D": return 60;
      case "90D": return 90;
      case "180D": return 180;
      case "365D": return 365;
      default: return 90;
    }
  }, [forecastPeriod]);

  const currentProductionTrendData = useMemo(() => {
    return generateTimeSeriesData(periodDays, 2847, 0.012);
  }, [periodDays]);

  const currentRevenueTrendData = useMemo(() => {
    return generateTimeSeriesData(periodDays, 4.2, 0.015);
  }, [periodDays]);

  const currentYieldTrendData = useMemo(() => {
    return generateTimeSeriesData(periodDays, 18.4, 0.008);
  }, [periodDays]);

  const generateAIInsights = async () => {
    setIsLoadingAI(true);

    // Simulate API call to Anthropic Claude
    setTimeout(() => {
      setAiInsights({
        opportunities: [
          "Strong demand for Mustard and Soybean in international markets - 12-15% price premium expected",
          "Early monsoon forecast suggests opportunity to expand Rabi acreage by 8-10%",
          "Contract farming opportunities emerging with major food processors in Madhya Pradesh region",
        ],
        growthRegions: [
          "Karanpur cluster showing 6.2% YoY growth - replicate water management practices",
          "Sunrise Belt emerging as high-potential zone with 9.2% production growth",
          "Eastern districts demonstrating consistent 5%+ growth in oilseed production",
        ],
        forecastRisks: [
          "Late monsoon withdrawal could impact Kharif harvest by 15-20 days",
          "Pest pressure expected high for Soybean in September-October window",
          "Storage capacity constraints may affect 30% of wheat production if harvest peaks overlap",
        ],
        expectedBottlenecks: [
          "Labor shortage expected during peak harvest (March-April) - 25% gap projected",
          "Transportation logistics constrained - railway siding utilization at 85% capacity",
          "Cold storage availability limited in River Bend region for perishables",
        ],
        revenueOpportunities: [
          "Premium pricing for organic wheat - ₹2,800-3,200/quintal vs standard ₹2,400",
          "Value addition through on-farm processing could increase margins by 18-22%",
          "Direct-to-consumer channels for pulses showing 35% higher realization",
        ],
        recommendedActions: [
          "Deploy harvest scheduling app to optimize labor allocation across villages",
          "Secure storage contracts with FCI before October for Rabi crops",
          "Invest in mobile drying units to reduce post-harvest losses by 8%",
          "Initiate forward contracts for 40% of Mustard production at current premium rates",
        ],
      });
      setIsLoadingAI(false);
    }, 2000);
  };

  const handleExportReport = () => {
    alert(
      "Export functionality - would generate PDF/Excel report of all forecast data",
    );
  };

  return (
    <div className="space-y-6 antialiased font-['Inter',sans-serif] text-gray-800 pb-16 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <span>Production Forecast Center</span>
            <span className="text-[#31572c] font-black text-sm uppercase tracking-wider">
              | FPO CLUSTER FORECASTS
            </span>
          </h1>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            Real-time production intelligence for FPO clusters
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm text-gray-800 text-xs font-black"
        >
          <Download size={14} />
          <span>Export Report</span>
        </button>
      </div>

      {/* SECTION 1 - KPI Strip using StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Expected Production"
          value="2,847 MT"
          trend="+8.7%"
          trendType="success"
          subtext="Total FPO production"
          icon={<Package size={16} />}
        />
        <StatsCard
          title="Expected Revenue"
          value="₹4.2 Cr"
          trend="+12.3%"
          trendType="success"
          subtext="Total FPO revenue"
          icon={<IndianRupee size={16} />}
        />
        <StatsCard
          title="Forecast Yield"
          value="18.4 q/ha"
          trend="+5.2%"
          trendType="success"
          subtext="Average across crops"
          icon={<Leaf size={16} />}
        />
        <StatsCard
          title="Yield Growth"
          value="+12.3%"
          trend="+2.1%"
          trendType="success"
          subtext="YoY improvement"
          icon={<TrendingUp size={16} />}
        />
        <StatsCard
          title="Production Growth"
          value="+8.7%"
          trend="+1.8%"
          trendType="success"
          subtext="Season over season"
          icon={<BarChart3 size={16} />}
        />
        <StatsCard
          title="Forecast Confidence"
          value="87%"
          trend="+3%"
          trendType="success"
          subtext="Model accuracy"
          icon={<Target size={16} />}
        />
        <StatsCard
          title="Harvest Readiness"
          value="73%"
          trend="+12%"
          trendType="success"
          subtext="Crops ready"
          icon={<Clock size={16} />}
        />
        <StatsCard
          title="Production Capacity"
          value="91%"
          trend="+5%"
          trendType="success"
          subtext="Utilization rate"
          icon={<Factory size={16} />}
        />
      </div>

      {/* SECTION 2 - Production Forecast Timeline */}
      <div className="bg-white border border-gray-250/80 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
            Production Forecast Timeline
          </h2>
          <div className="flex gap-1.5">
            {["30D", "60D", "90D", "180D", "365D"].map((period) => (
              <button
                key={period}
                onClick={() => setForecastPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  forecastPeriod === period
                    ? "bg-brand-dark text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Production Trend (MT)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentProductionTrendData}>
                <defs>
                  <linearGradient
                    id="productionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fill="url(#productionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Revenue Trend (₹ Lakhs)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentRevenueTrendData}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Yield Trend (q/ha)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentYieldTrendData}>
                <defs>
                  <linearGradient
                    id="yieldGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="yield"
                  stroke="#8b5cf6"
                  fill="url(#yieldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 3 - Crop-wise Forecast Table using GenericTable */}
      <div className="bg-white border border-gray-250/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4">
          Crop-wise Production Forecast
        </h2>
        <GenericTable
          columns={cropColumns}
          data={cropForecastData}
          itemsPerPage={10}
          showSearch={true}
          searchPlaceholder="Search crops..."
          emptyMessage="No crop data found"
        />
      </div>

      {/* SECTION 4 - Village-wise Forecast Table using GenericTable */}
      <div className="bg-white border border-gray-250/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4">
          Village-wise Production Forecast
        </h2>
        <GenericTable
          columns={villageColumns}
          data={villageForecastData}
          itemsPerPage={10}
          showSearch={true}
          searchPlaceholder="Search villages..."
          emptyMessage="No village data found"
        />
      </div>

      {/* SECTION 5 - Harvest Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white border border-gray-250/80 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4">Harvest Calendar</h2>
          <div className="grid grid-cols-12 gap-1 border border-gray-100 rounded-xl p-4 bg-gray-50/30">
            {months.map((month, idx) => (
              <div
                key={idx}
                className="text-center text-[10px] font-black uppercase text-gray-500 mb-2"
              >
                {month}
              </div>
            ))}
            {Object.entries(harvestCalendarData).map(([crop, data]) => (
              <React.Fragment key={crop}>
                <div className="col-span-12 text-xs font-bold text-gray-700 mt-2 mb-1 uppercase tracking-wide">
                  {crop}
                </div>
                {months.map((_, monthIdx) => (
                  <div key={monthIdx} className="col-span-1">
                    <div
                      className={`h-6 rounded transition-all ${data.months.includes(monthIdx + 1) ? "bg-opacity-80 scale-95 shadow-sm" : "bg-gray-100"}`}
                      style={{
                        backgroundColor: data.months.includes(monthIdx + 1)
                          ? data.color
                          : "#f1f5f9",
                      }}
                    ></div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
            {Object.entries(harvestCalendarData).map(([crop, data]) => (
              <div key={crop} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: data.color }}
                />
                <span className="text-xs text-gray-600 font-bold">{crop}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly & Monthly Harvest Charts */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-250/80 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
              Expected Weekly Harvest Volume
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={weeklyHarvestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white border border-gray-250/80 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
              Expected Monthly Harvest Volume
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthlyHarvestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
                <Bar dataKey="volume" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION 6 - Production Hotspots Map */}
      <div className="bg-white border border-gray-250/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Production Hotspots Map</h2>
          <p className="text-gray-500 text-xs mt-0.5">
            Production density across FPO clusters
          </p>
        </div>
        <div className="relative" style={{ height: "450px" }}>
          <CropRecProductionMap
            center={mapCenter}
            zoom={mapZoom}
            villages={villageCoordinates}
          />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3.5 border border-gray-200 z-[1000] text-gray-800 shadow-md">
            <div className="text-xs font-bold mb-2">Production Level</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="text-[10px] font-bold text-gray-600">High (&gt;5,000 MT)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <span className="text-[10px] font-bold text-gray-600">Medium (2,000-5,000 MT)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <span className="text-[10px] font-bold text-gray-600">Low (&lt;2,000 MT)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 7 - Forecast Accuracy Tracker using GenericTable */}
      <div className="bg-white border border-gray-250/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4">
          Forecast Accuracy Tracker
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis yAxisId="left" stroke="#64748b" />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="forecasted"
              name="Forecasted (MT)"
              fill="#3b82f6"
            />
            <Bar
              yAxisId="left"
              dataKey="actual"
              name="Actual (MT)"
              fill="#10b981"
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6">
          <GenericTable
            columns={accuracyColumns}
            data={accuracyData}
            itemsPerPage={10}
            showSearch={false}
            emptyMessage="No accuracy data found"
          />
        </div>
      </div>

      {/* SECTION 8 - AI Forecast Intelligence */}
      <div className="bg-gradient-to-br from-emerald-50/20 to-amber-50/15 border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-[#31572c] to-[#4f772d] p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-white animate-pulse" />
              <h2 className="text-xs font-black uppercase tracking-wider text-white">
                AI Forecast Intelligence
              </h2>
            </div>
            <button
              onClick={generateAIInsights}
              disabled={isLoadingAI}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition disabled:opacity-50 text-xs font-black text-white"
            >
              {isLoadingAI ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              <span>Generate Insights</span>
            </button>
          </div>
        </div>

        {aiInsights && (
          <div className="p-6 space-y-4 bg-white/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200/60 rounded-xl p-4 border-l-4 border-l-emerald-600 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-emerald-600" />
                  <h3 className="font-bold text-xs text-gray-900">Production Opportunities</h3>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 font-medium">
                  {aiInsights.opportunities.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-xl p-4 border-l-4 border-l-amber-500 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-amber-500" />
                  <h3 className="font-bold text-xs text-gray-900">Growth Regions</h3>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 font-medium">
                  {aiInsights.growthRegions.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-xl p-4 border-l-4 border-l-red-500 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-red-500" />
                  <h3 className="font-bold text-xs text-gray-900">Forecast Risks</h3>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 font-medium">
                  {aiInsights.forecastRisks.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-xl p-4 border-l-4 border-l-purple-500 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={14} className="text-purple-500" />
                  <h3 className="font-bold text-xs text-gray-900">Expected Bottlenecks</h3>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 font-medium">
                  {aiInsights.expectedBottlenecks.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-xl p-4 border-l-4 border-l-emerald-600 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee size={14} className="text-emerald-600" />
                  <h3 className="font-bold text-xs text-gray-900">Revenue Opportunities</h3>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 font-medium">
                  {aiInsights.revenueOpportunities.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-200/60 rounded-xl p-4 border-l-4 border-l-blue-500 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-blue-500" />
                  <h3 className="font-bold text-xs text-gray-900">Recommended Actions</h3>
                </div>
                <ul className="space-y-1 text-xs text-gray-600 font-medium">
                  {aiInsights.recommendedActions.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!aiInsights && !isLoadingAI && (
          <div className="p-12 text-center text-gray-400 bg-white/50">
            <Sparkles size={24} className="mx-auto mb-3 opacity-50 text-[#31572c]" />
            <p className="text-xs font-bold text-gray-600">
              Click "Generate Insights" to receive AI-powered forecast analysis
            </p>
            <p className="text-[10px] text-gray-450 mt-1">Powered by Anthropic Claude</p>
          </div>
        )}

        {isLoadingAI && (
          <div className="p-12 text-center bg-white/50">
            <Loader2
              size={24}
              className="mx-auto mb-3 animate-spin text-[#31572c]"
            />
            <p className="text-xs font-bold text-gray-600">Generating AI insights...</p>
            <p className="text-[10px] text-gray-400 mt-1">
              Analyzing production data across all clusters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
