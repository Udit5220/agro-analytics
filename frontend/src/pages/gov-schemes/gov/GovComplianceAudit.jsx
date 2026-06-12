import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Building2,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";

const GovComplianceAudit = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for compliance metrics
  const complianceStats = [
    {
      title: "TOTAL AUDITS (FY25)",
      value: "1,248",
      trend: "+15% YoY",
      trendType: "success",
      subtext: "Across 22 districts",
      icon: <ShieldCheck className="text-[#132a13]" />
    },
    {
      title: "COMPLIANCE RATE",
      value: "84.5%",
      trend: "+2.3% from Q2",
      trendType: "success",
      subtext: "Scheme implementation",
      icon: <FileCheck className="text-[#31572c]" />
    },
    {
      title: "CRITICAL FINDINGS",
      value: "42",
      trend: "-12% from Q2",
      trendType: "success",
      subtext: "Requires immediate action",
      icon: <AlertTriangle className="text-amber-600" />
    },
    {
      title: "PENDING RESOLUTIONS",
      value: "156",
      trend: "8 within SLA",
      trendType: "neutral",
      subtext: "Open audit observations",
      icon: <Clock className="text-brand-medium" />
    }
  ];

  const auditTrendsData = [
    { month: "Apr", scheduled: 85, completed: 80, findings: 12 },
    { month: "May", scheduled: 95, completed: 92, findings: 15 },
    { month: "Jun", scheduled: 110, completed: 105, findings: 8 },
    { month: "Jul", scheduled: 105, completed: 98, findings: 18 },
    { month: "Aug", scheduled: 120, completed: 115, findings: 14 },
    { month: "Sep", scheduled: 140, completed: 135, findings: 9 },
  ];

  const complianceCategoryData = [
    { name: "Financial Mgt", value: 35 },
    { name: "Scheme Delivery", value: 45 },
    { name: "Infrastructure", value: 15 },
    { name: "Data Accuracy", value: 5 }
  ];
  const COLORS = ["#132a13", "#31572c", "#4f772d", "#90a955"];

  const auditLogColumns = [
    {
      header: "AUDIT ID",
      accessor: "auditId",
      sortable: true,
      cell: (val) => <span className="font-bold text-[#132a13]">{val}</span>
    },
    {
      header: "DISTRICT / BLOCK",
      accessor: "location",
      sortable: true,
      cell: (val) => <span className="font-medium text-gray-700">{val}</span>
    },
    {
      header: "SCHEME/PROGRAM",
      accessor: "scheme",
      sortable: true
    },
    {
      header: "DATE",
      accessor: "date",
      sortable: true
    },
    {
      header: "STATUS",
      accessor: "status",
      sortable: true,
      cell: (val) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
          val === 'Completed' ? 'bg-green-100 text-green-700' :
          val === 'In Progress' ? 'bg-blue-100 text-blue-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: "RATING",
      accessor: "rating",
      sortable: true,
      cell: (val) => (
        <div className="flex items-center gap-1">
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${val >= 80 ? 'bg-green-500' : val >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${val}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">{val}%</span>
        </div>
      )
    },
    {
      header: "ACTION",
      accessor: "action",
      cell: () => (
        <button className="p-1 hover:bg-gray-100 rounded text-gray-500 transition">
          <Eye size={16} />
        </button>
      )
    }
  ];

  const auditLogsData = [
    { id: 1, auditId: "AUD-2025-089", location: "Karnal / Nilokheri", scheme: "PMKSY Implementation", date: "15 Oct 2025", status: "Completed", rating: 92 },
    { id: 2, auditId: "AUD-2025-090", location: "Sonipat / Ganaur", scheme: "AIF Warehouse Grant", date: "18 Oct 2025", status: "In Progress", rating: 65 },
    { id: 3, auditId: "AUD-2025-091", location: "Panipat / Samalkha", scheme: "PMFBY Claim Settlement", date: "22 Oct 2025", status: "Scheduled", rating: 0 },
    { id: 4, auditId: "AUD-2025-092", location: "Hisar / Hansi", scheme: "KCC Disbursement", date: "25 Oct 2025", status: "Completed", rating: 78 },
    { id: 5, auditId: "AUD-2025-093", location: "Rohtak / Meham", scheme: "PM-Kisan Verification", date: "28 Oct 2025", status: "Completed", rating: 88 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-medium" />
            Compliance & Audit Monitoring
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track statutory compliance, audit findings, and scheme implementation standards across districts.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
            <Filter size={16} />
            Filter Audits
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#132a13] text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceStats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audit Completion Trends */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
            <Calendar size={16} />
            Audit Execution Trends (H1 2025)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f1" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8faf8' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: '10px' }} />
                <Bar dataKey="scheduled" name="Scheduled Audits" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed Audits" fill="#4f772d" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="findings" name="Critical Findings" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Categories */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            Findings by Category
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complianceCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {complianceCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {complianceCategoryData.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
          <FileCheck size={16} />
          Recent & Upcoming Audits
        </h3>
        <GenericTable 
          columns={auditLogColumns}
          data={auditLogsData}
          itemsPerPage={5}
          showSearch={true}
          searchPlaceholder="Search by Audit ID, District or Scheme..."
        />
      </div>
    </div>
  );
};

export default GovComplianceAudit;
