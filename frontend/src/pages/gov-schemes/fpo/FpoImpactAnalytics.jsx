import React, { useState } from "react";
import { jsPDF } from "jspdf";
import {
  BarChart3,
  X,
  CheckCircle2,
  Download,
  TrendingUp,
  Users,
  Warehouse,
  DollarSign,
  Calendar,
  PieChart as PieChartIcon,
  Target,
  Building2,
  Clock,
  Eye,
  Loader2,
  LayoutDashboard,
  Award,
  ArrowUpRight,
  Package,
  Shield,
  Truck,
  Printer,
  Mail,
  Share2,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FpoUtilizationHeader } from "./FpoHelper";
import StatsCard from "../../../components/partials/StatsCard";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const FpoImpactAnalytics = () => {
  // Extract data from JSON
  const impactData = govtSchemeData.fpoImpactAnalyticsData || {};

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("FY2025-26");
  const [activeTab, setActiveTab] = useState("overview");

  // Get data with fallbacks
  const impactSecuredData = impactData.impactSecuredData || [];
  const schemeROI = impactData.schemeROI || [];
  const memberImpactData = impactData.memberImpactData || [];
  const infraMetrics = impactData.infraMetrics || [];
  const jobCreationData = impactData.jobCreationData || [];
  const predictiveImpact = impactData.predictiveImpact || [];
  const exportQualityMetrics = impactData.exportQualityMetrics || [];
  const comparativeBenchmark = impactData.comparativeBenchmark || {};
  const statsCards = impactData.statsCards || [];

  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    setDownloadProgress(true);

    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        // Brand Header Banner
        doc.setFillColor(19, 42, 19); // #132a13
        doc.rect(0, 0, 210, 20, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text("AgroAnalytics FPO Economic Impact Audit", 15, 13);

        // Subtitle Metadata
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(180, 200, 180);
        doc.text(`Period: ${fiscalYear} | Exported: ${new Date().toLocaleDateString()}`, 130, 13);

        // Reset text color
        doc.setTextColor(60, 60, 60);

        let y = 35;

        // Section 1: Executive KPI Metrics
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(19, 42, 19);
        doc.text("1. Executive KPI Metrics", 15, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);

        statsCards.forEach((card) => {
          doc.text(`• ${card.title}: ${card.value} (${card.trend} - ${card.subtext})`, 20, y);
          y += 6;
        });

        y += 8;

        // Section 2: Grant Utilization & ROI Trends
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(19, 42, 19);
        doc.text("2. Grant Utilization & ROI Trends", 15, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        
        impactSecuredData.forEach((row) => {
          doc.text(`• Year ${row.year}: Secured ₹${row.secured} Cr | Utilized ₹${row.utilized} Cr | ROI: ${row.roi}%`, 20, y);
          y += 6;
        });

        y += 8;

        // Section 3: Infrastructure Utilization Metrics
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(19, 42, 19);
        doc.text("3. Infrastructure Utilization Metrics", 15, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);

        infraMetrics.forEach((item) => {
          doc.text(`• ${item.name}: Capacity ${item.capacity} ${item.unit} | Utilization ${item.utilization}% | Revenue: ₹${item.revenue} Lakh (YoY: +${item.yoy}%)`, 20, y);
          y += 6;
        });

        y += 8;

        // Section 4: Livelihood & Member Impact
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(19, 42, 19);
        doc.text("4. Livelihood & Member Impact", 15, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`• Direct Jobs Created: ${totalDirectJobs}`, 20, y);
        y += 6;
        doc.text(`• Indirect Jobs Created: ${totalIndirectJobs}`, 20, y);
        y += 6;
        doc.text(`• Total Beneficiaries: ${totalBeneficiaries}`, 20, y);
        y += 8;

        // Page break or space check
        if (y > 220) {
          doc.addPage();
          y = 30;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(19, 42, 19);
        doc.text("Top Member Income Growth Highlights:", 15, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);

        memberImpactData.slice(0, 5).forEach((member) => {
          doc.text(`• ${member.name} (${member.village}): Income increased from ₹${member.beforeIncome.toLocaleString()} to ₹${member.afterIncome.toLocaleString()} (+${member.increase}% via ${member.scheme})`, 20, y);
          y += 6;
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Report compiled automatically by AgroAnalytics Scheme Intelligence Hub. Security-signed record.", 15, 285);

        // Save report
        doc.save(`FPO_Impact_Report_${fiscalYear.replace(/\s+/g, "_")}.pdf`);
      } catch (err) {
        console.error("Error generating PDF:", err);
        alert("Failed to generate PDF. Check console logs.");
      } finally {
        setDownloadProgress(false);
        setShowDownloadModal(false);
      }
    }, 2000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Icon mapping for stats cards
  const getIcon = (iconName) => {
    switch (iconName) {
      case "DollarSign":
        return <DollarSign className="text-[#132a13]" />;
      case "TrendingUp":
        return <TrendingUp className="text-brand-medium" />;
      case "Warehouse":
        return <Warehouse className="text-[#31572c]" />;
      case "Users":
        return <Users className="text-[#90a955]" />;
      default:
        return <BarChart3 className="text-[#132a13]" />;
    }
  };

  // Colors for pie chart
  const COLORS = ["#132a13", "#31572c", "#4f772d", "#90a955", "#ecf39e"];

  // Calculate totals
  const totalDirectJobs = jobCreationData.reduce(
    (sum, item) => sum + item.directJobs,
    0,
  );
  const totalIndirectJobs = jobCreationData.reduce(
    (sum, item) => sum + item.indirectJobs,
    0,
  );
  const totalBeneficiaries = jobCreationData.reduce(
    (sum, item) => sum + item.totalBeneficiaries,
    0,
  );

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Impact Analytics Center" />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-brand-medium" />
          Impact Analytics Command Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Track economic value creation, member income growth, infrastructure
          ROI, and grant performance metrics.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => (
          <StatsCard
            key={idx}
            title={card.title}
            value={card.value}
            trend={card.trend}
            trendType={card.trendType}
            subtext={card.subtext}
            icon={getIcon(card.icon)}
          />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grant Utilization Trends - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-2">
            <TrendingUp size={16} />
            Grant Utilization & ROI Trends
          </h3>
          <p className="text-[10px] text-gray-400 mb-4">
            Historical comparison of funding secured vs utilized with ROI
            tracking
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impactSecuredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(val) => `₹${val}Cr`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "roi") return `${value}%`;
                    return `₹${value} Cr`;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="secured"
                  stroke="#4f772d"
                  strokeWidth={2}
                  name="Secured Grants"
                  dot={{ fill: "#4f772d", r: 4 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="utilized"
                  stroke="#132a13"
                  strokeWidth={2}
                  name="Utilized Funds"
                  dot={{ fill: "#132a13", r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  stroke="#90a955"
                  strokeWidth={2}
                  name="ROI %"
                  strokeDasharray="5 5"
                  dot={{ fill: "#90a955", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparative Benchmarking */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Target size={16} />
            Comparative Benchmarking
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Our FPO</span>
                <span className="font-bold text-[#132a13]">
                  {comparativeBenchmark.ourFpo}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#132a13] h-2 rounded-full"
                  style={{
                    width: `${(comparativeBenchmark.ourFpo / 40) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">District Average</span>
                <span className="font-bold text-gray-600">
                  {comparativeBenchmark.districtAvg}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-brand-medium h-2 rounded-full"
                  style={{
                    width: `${(comparativeBenchmark.districtAvg / 40) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">State Average</span>
                <span className="font-bold text-gray-600">
                  {comparativeBenchmark.stateAvg}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-[#90a955] h-2 rounded-full"
                  style={{
                    width: `${(comparativeBenchmark.stateAvg / 40) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Top Performer</span>
                <span className="font-bold text-emerald-600">
                  {comparativeBenchmark.topPerformer}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: `${(comparativeBenchmark.topPerformer / 40) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-500">
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-600 shrink-0" />
                  <span>
                    {comparativeBenchmark.ourFpo -
                      comparativeBenchmark.districtAvg}
                    % above district average
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Scheme ROI & Export Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme-wise ROI Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Award size={16} />
            Scheme-wise ROI Breakdown
          </h3>
          <div className="space-y-3">
            {schemeROI.map((scheme, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      {scheme.name}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Investment: ₹{scheme.investment}Cr → Return: ₹
                      {scheme.return}Cr
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      scheme.status === "excellent"
                        ? "bg-green-100 text-green-700"
                        : scheme.status === "good"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {scheme.roi}% ROI
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${parseInt(scheme.roi)}%`,
                      backgroundColor: scheme.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Quality Metrics */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Package size={16} />
            Export Quality Distribution
          </h3>
          <p className="text-[10px] text-gray-400 mb-3">
            Grade-wise produce distribution before/after cold storage
            intervention
          </p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={exportQualityMetrics}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="grade"
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar
                  dataKey="before"
                  name="Before Infrastructure"
                  fill="#90a955"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="after"
                  name="After Infrastructure"
                  fill="#132a13"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-green-600 flex items-center justify-center gap-1 mt-2">
            <CheckCircle2 size={12} className="text-green-600 shrink-0" />
            <span>
              Grade A produce increased by{" "}
              {exportQualityMetrics[0]?.after - exportQualityMetrics[0]?.before}
              % after cold storage
            </span>
          </p>
        </div>
      </div>

      {/* Row 3: Infrastructure Utilization & Job Creation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Utilization */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Warehouse size={16} />
            Infrastructure Utilization Metrics
          </h3>
          <div className="space-y-3">
            {infraMetrics.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <div className="flex gap-3">
                    <span className="text-gray-500">
                      {item.utilized} / {item.capacity} {item.unit}
                    </span>
                    <span
                      className={`font-bold ${item.utilization >= 85 ? "text-green-600" : item.utilization >= 70 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {item.utilization}% utilized
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${item.utilization}%`,
                      backgroundColor:
                        item.utilization >= 85
                          ? "#132a13"
                          : item.utilization >= 70
                            ? "#4f772d"
                            : "#90a955",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                  <span>Revenue: ₹{item.revenue} Lakh</span>
                  <span className="text-green-600">↑ {item.yoy}% YoY</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Creation Metrics */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Users size={16} />
            Livelihood & Job Creation
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 bg-green-50 rounded-xl">
              <p className="text-lg font-bold text-green-700">
                {totalDirectJobs}
              </p>
              <p className="text-[9px] text-gray-500">Direct Jobs</p>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-xl">
              <p className="text-lg font-bold text-blue-700">
                {totalIndirectJobs}
              </p>
              <p className="text-[9px] text-gray-500">Indirect Jobs</p>
            </div>
            <div className="text-center p-2 bg-emerald-50 rounded-xl">
              <p className="text-lg font-bold text-emerald-700">
                {totalBeneficiaries}
              </p>
              <p className="text-[9px] text-gray-500">Beneficiaries</p>
            </div>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {jobCreationData.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-lg text-xs"
              >
                <span className="font-medium text-gray-700">{item.scheme}</span>
                <div className="flex gap-3">
                  <span className="text-green-600 flex items-center gap-1">
                    <Users size={12} className="shrink-0" />
                    <span>{item.directJobs} direct</span>
                  </span>
                  <span className="text-blue-600 flex items-center gap-1">
                    <RefreshCw size={12} className="shrink-0" />
                    <span>{item.indirectJobs} indirect</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Member Impact & Predictive Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Member Impact */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Top 5 Member Income Growth
          </h3>
          <div className="space-y-2">
            {memberImpactData.slice(0, 5).map((member, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {member.name}
                  </p>
                  <p className="text-[9px] text-gray-400">
                    {member.village} • {member.scheme}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 line-through">
                      {formatCurrency(member.beforeIncome)}
                    </span>
                    <ArrowUpRight size={12} className="text-green-500" />
                    <span className="text-xs font-bold text-green-600">
                      {formatCurrency(member.afterIncome)}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-green-600">
                    +{member.increase}% increase
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Impact Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <Clock size={16} />
            Predictive Impact Forecast
          </h3>
          <p className="text-[10px] text-gray-400 mb-3">
            Projected vs Actual member income growth (₹)
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveImpact}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis dataKey="quarter" tick={{ fontSize: 9 }} />
                <YAxis
                  tickFormatter={(val) => `₹${val / 1000}k`}
                  tick={{ fontSize: 9 }}
                />
                <Tooltip
                  formatter={(value) =>
                    value ? formatCurrency(value) : "Pending"
                  }
                />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Line
                  type="monotone"
                  dataKey="projectedIncome"
                  stroke="#90a955"
                  strokeWidth={2}
                  name="Projected"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="actualIncome"
                  stroke="#132a13"
                  strokeWidth={2}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="targetIncome"
                  stroke="#4f772d"
                  strokeWidth={1.5}
                  name="Target"
                  strokeDasharray="2 2"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-2 bg-gray-50 rounded-lg text-[10px] text-gray-600 flex items-center justify-center gap-1.5">
            <Target size={12} className="text-brand-medium shrink-0" />
            <span>
              Q3 2026 Target:{" "}
              {formatCurrency(predictiveImpact[2]?.targetIncome || 0)} | On
              track for +15% YoY growth
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDownloadModal(true)}
          className="flex-1 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
        >
          <Download size={16} />
          Download Impact Report
        </button>
        {/* <button 
          onClick={() => window.print()}
          className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2"
        >
          <Printer size={16} />
          Print
        </button> */}
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-brand-medium" />
              Download Impact Report
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Export comprehensive impact analytics with ROI calculations and
              member growth data.
            </p>

            {downloadProgress ? (
              <div className="py-8 text-center">
                <Loader2 className="w-8 h-8 text-brand-medium animate-spin mx-auto mb-3" />
                <p className="text-xs font-bold text-[#132a13]">
                  Generating report...
                </p>
              </div>
            ) : (
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Report Period
                  </label>
                  <select
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-medium"
                  >
                    <option value="FY2025-26">FY 2025-26 (Current)</option>
                    <option value="FY2024-25">FY 2024-25</option>
                    <option value="FY2023-24">FY 2023-24</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Include Sections
                  </label>
                  <div className="space-y-1.5 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">
                        Grant Utilization & ROI Trends
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">
                        Member Income Growth Analysis
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">
                        Infrastructure ROI Metrics
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />
                      <span className="text-xs">Job Creation Statistics</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDownloadModal(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-sm font-medium transition"
                  >
                    Download PDF
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FpoImpactAnalytics;
