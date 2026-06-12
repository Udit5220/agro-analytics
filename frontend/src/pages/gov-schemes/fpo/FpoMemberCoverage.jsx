// // src/pages/gov-schemes/fpo/FpoMemberCoverage.jsx
// import React, { useState } from "react";
// import {
//   Users,
//   CheckCircle2,
//   AlertCircle,
//   TrendingUp,
//   Map,
//   X,
//   Download
// } from "lucide-react";
// import StatsCard from "../../../components/partials/StatsCard";
// import govtSchemeData from "../../../seed-json/govt_scheme.json";
// import { FpoUtilizationHeader } from "./FpoHelper";

// const FpoMemberCoverage = () => {
//   const { memberCoverage } = govtSchemeData.fpoOpportunityData;
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [exportProgress, setExportProgress] = useState(false);
//   const [exportFormat, setExportFormat] = useState("PDF");

//   const handleExportSubmit = (e) => {
//     e.preventDefault();
//     setExportProgress(true);
//     setTimeout(() => {
//       setExportProgress(false);
//       setShowExportModal(false);
//       alert(`Geographic Audit Report exported successfully in ${exportFormat} format!`);
//     }, 2000);
//   };

//   return (
//     <div className="space-y-6">
//       <FpoUtilizationHeader subtitle="FPO Member Benefit Coverage" />

//       {/* Header */}
//       <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
//         <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
//           <Users className="w-5 h-5 text-brand-medium" />
//           Member Benefit Coverage Center
//         </h1>
//         <p className="text-xs text-gray-500 mt-1">Monitor government schemes penetration and sub-category enrollments across FPO member segments.</p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard title="Total FPO Members" value={memberCoverage.total} subtext="Active registered farmers" icon={<Users className="text-[#132a13]" />} />
//         <StatsCard title="Covered Members" value={memberCoverage.covered} subtext="Active benefits received" trend={`${memberCoverage.coveragePercent}%`} trendType="success" icon={<CheckCircle2 className="text-brand-medium" />} />
//         <StatsCard title="Uncovered Members" value={memberCoverage.uncovered} subtext="Pending scheme registration" icon={<AlertCircle className="text-red-500" />} />
//         <StatsCard title="Target Reach" value={`${memberCoverage.potentialPercent}%`} subtext="Potential with AIF & PMFBY campaigns" icon={<TrendingUp className="text-[#31572c]" />} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Scheme Coverage table */}
//         <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm overflow-x-auto">
//           <h3 className="font-bold text-[#132a13] text-sm mb-3">Scheme Penetration Breakdown</h3>
//           <table className="w-full text-xs font-semibold text-left text-gray-600">
//             <thead>
//               <tr className="border-b border-gray-200 text-gray-400">
//                 <th className="py-2">Scheme Name</th>
//                 <th className="py-2 text-center">Eligible</th>
//                 <th className="py-2 text-center">Applied</th>
//                 <th className="py-2 text-center">Approved</th>
//                 <th className="py-2 text-center">Coverage</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {memberCoverage.schemes.map((s, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50/40">
//                   <td className="py-3 font-bold text-gray-800">{s.name}</td>
//                   <td className="py-3 text-center">{s.eligible}</td>
//                   <td className="py-3 text-center">{s.applied}</td>
//                   <td className="py-3 text-center text-emerald-700">{s.approved}</td>
//                   <td className="py-3 text-center">
//                     <div className="flex items-center justify-center gap-1.5">
//                       <span className="font-black text-[#132a13]">{s.percent}%</span>
//                       <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
//                         <div className="bg-brand-medium h-full" style={{ width: `${s.percent}%` }} />
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Village map mockup */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-1">
//               <Map className="w-4 h-4 text-brand-medium" />
//               Village Coverage Index
//             </h3>
//             <p className="text-[10px] text-gray-400 mb-4">Location-wise member density and scheme coverage percentages</p>

//             {/* Visual map outline simulation */}
//             <div className="relative border border-gray-250 bg-emerald-50/15 rounded-xl h-44 flex items-center justify-center overflow-hidden mb-4">
//               <div className="absolute inset-0 bg-[#f4f7f4] opacity-50 bg-[radial-gradient(#d1e2d1_1px,transparent_1px)] [background-size:16px_16px]"></div>
//               <div className="relative z-10 text-center space-y-3 px-4 w-full">
//                 {memberCoverage.villages.map((v, idx) => (
//                   <div key={idx} className="flex justify-between items-center bg-white border border-gray-200/60 p-2 rounded-lg text-[10px] shadow-sm">
//                     <span className="font-bold text-[#132a13]">{v.name}</span>
//                     <div className="flex gap-1.5 items-center font-bold">
//                       <span className="text-gray-500">({v.covered}/{v.total})</span>
//                       <span className={v.intensity === "high" ? "text-emerald-700" : v.intensity === "medium" ? "text-amber-600" : "text-red-500"}>
//                         {Math.round((v.covered/v.total)*100)}%
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={() => setShowExportModal(true)}
//             className="w-full text-xs font-bold text-center py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition"
//           >
//             Export Geographic Audit Reports
//           </button>
//         </div>
//       </div>

//       {/* Geographic Report Export Modal */}
//       {showExportModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
//           <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
//             <button
//               type="button"
//               onClick={() => setShowExportModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
//               <Download className="w-5 h-5 text-brand-medium" />
//               Export Geographical Audit
//             </h2>
//             <p className="text-xs text-gray-500 mb-4">Export member registration stats and coverage grids per demographic segment.</p>

//             {exportProgress ? (
//               <div className="py-8 text-center text-xs font-bold text-[#132a13] animate-pulse">
//                 Assembling geolocation details and exporting CSV/PDF grid...
//               </div>
//             ) : (
//               <form onSubmit={handleExportSubmit} className="space-y-4">
//                 <div>
//                   <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Export Format</label>
//                   <div className="grid grid-cols-3 gap-2">
//                     {["PDF Report", "Excel Spreadsheet", "Raw CSV Data"].map((f) => (
//                       <button
//                         key={f}
//                         type="button"
//                         onClick={() => setExportFormat(f)}
//                         className={`py-2 rounded-xl border text-xs font-bold transition ${
//                           exportFormat === f
//                             ? "border-brand-medium bg-brand-medium/5 text-brand-medium"
//                             : "border-gray-200 text-gray-600"
//                         }`}
//                       >
//                         {f}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Include Villages</label>
//                   <div className="space-y-1 text-xs font-semibold text-gray-700">
//                     {memberCoverage.villages.map((v, idx) => (
//                       <label key={idx} className="flex items-center gap-2 py-1 cursor-pointer">
//                         <input type="checkbox" defaultChecked className="accent-[#4f772d]" />
//                         <span>{v.name} ({v.covered} of {v.total} covered)</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowExportModal(false)}
//                     className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
//                   >
//                     Export File
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FpoMemberCoverage;
// src/pages/gov-schemes/fpo/FpoMemberCoverage.jsx
import React, { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Map,
  X,
  Download,
  Send,
  PieChart,
  BarChart3,
  Clock,
  ShieldAlert,
  Eye,
  Smartphone,
  LayoutDashboard,
  Phone,
  UserX,
} from "lucide-react";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import { FpoUtilizationHeader } from "./FpoHelper";
import { govSchemesApi } from "../../../services/apiService";

const mapBackendMemberDetails = (farmersList) => {
  return farmersList.map(f => {
    let enrolledSchemes = 0;
    Object.keys(f.schemes || {}).forEach(k => {
      if (f.schemes[k] === 'enrolled') enrolledSchemes++;
    });

    return {
      id: f.farmerId,
      name: f.name,
      village: f.village,
      category: f.category,
      mobile: f.mobileVerified ? f.phone : null,
      aadhaarSeeded: f.aadhaarSeeded,
      enrolledSchemes,
      pendingBenefits: f.pendingBenefits || '₹0'
    };
  });
};

const FALLBACK_MEMBERS = [
  { farmerId: "F-101", name: "Ramesh Kumar", village: "Kharindwa", category: "OBC", phone: "9876543210", mobileVerified: true, aadhaarSeeded: true, schemes: { pmKisan: "enrolled", pmfby: "enrolled", kcc: "enrolled" }, pendingBenefits: "₹2,000" },
  { farmerId: "F-102", name: "Sunita Devi", village: "Kharindwa", category: "SC", phone: "9876543211", mobileVerified: false, aadhaarSeeded: false, schemes: { pmKisan: "enrolled" }, pendingBenefits: "₹0" },
  { farmerId: "F-103", name: "Mahesh Singh", village: "Bhadana", category: "General", phone: "9876543212", mobileVerified: true, aadhaarSeeded: true, schemes: { pmKisan: "enrolled", pmfby: "enrolled", kcc: "enrolled", pmKmy: "enrolled", eNam: "enrolled" }, pendingBenefits: "₹6,000" },
  { farmerId: "F-104", name: "Priya Yadav", village: "Kharindwa", category: "OBC", phone: "9876543213", mobileVerified: false, aadhaarSeeded: false, schemes: {}, pendingBenefits: "₹0" },
  { farmerId: "F-105", name: "Harpal Singh", village: "Murthal", category: "General", phone: "9876543214", mobileVerified: true, aadhaarSeeded: true, schemes: { pmKisan: "enrolled", pmfby: "enrolled", kcc: "enrolled", eNam: "enrolled" }, pendingBenefits: "₹2,000" }
];

const fallbackStats = {
  success: true,
  memberCoverage: {
    total: 700,
    covered: 480,
    uncovered: 220,
    coveragePercent: 68.5,
    potentialPercent: 92.0,
    schemes: [
      { name: "PM Kisan Samman Nidhi", eligible: 620, applied: 540, approved: 490, pending: 30, rejected: 20, percent: 79.0 },
      { name: "Pradhan Mantri Fasal Bima Yojana", eligible: 680, applied: 450, approved: 410, pending: 20, rejected: 20, percent: 60.3 },
      { name: "Kisan Credit Card (KCC)", eligible: 580, applied: 380, approved: 340, pending: 15, rejected: 25, percent: 58.6 },
      { name: "Solar Pump Subsidies", eligible: 240, applied: 80, approved: 60, pending: 10, rejected: 10, percent: 25.0 }
    ],
    villages: [
      { name: "Kharindwa", covered: 180, total: 240, intensity: "high" },
      { name: "Bhadana", covered: 120, total: 180, intensity: "medium" },
      { name: "Murthal Outskirts", covered: 90, total: 150, intensity: "medium" },
      { name: "Sonipat Northern Plot", covered: 60, total: 80, intensity: "low" },
      { name: "Ganaur Boundary", covered: 30, total: 50, intensity: "low" }
    ]
  },
  compliance: {
    memberDemographics: {
      gender: { male: 420, female: 280, total: 700 },
      categories: { SC: 180, ST: 40, OBC: 280, General: 200 },
      landSize: { marginal: 320, small: 210, medium: 140, large: 30 },
      ageGroups: { "18-30": 110, "31-45": 280, "46-60": 210, "60+": 100 }
    },
    criticalIssues: {
      aadhaarNotSeeded: 45,
      mobileNotVerified: 80,
      noSchemesEnrolled: 65,
      benefitsOverdue: 12
    },
    schemePerformance: []
  }
};

const FpoMemberCoverage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [memberDetails, setMemberDetails] = useState([]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsRes, farmersRes] = await Promise.all([
          govSchemesApi.getFpoStats(),
          govSchemesApi.getFpoFarmers()
        ]);
        if (active) {
          if (statsRes && statsRes.success && farmersRes && farmersRes.success) {
            setStats(statsRes);
            setMemberDetails(mapBackendMemberDetails(farmersRes.farmers || []));
          } else {
            triggerFallback();
          }
        }
      } catch (err) {
        console.warn("Failed to load FPO coverage data via API, triggering local fallback:", err);
        if (active) {
          triggerFallback();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const triggerFallback = () => {
      setStats(fallbackStats);
      setMemberDetails(mapBackendMemberDetails(FALLBACK_MEMBERS));
    };

    loadData();
    return () => { active = false; };
  }, []);

  const memberCoverage = stats?.memberCoverage;
  const memberDemographics = stats?.compliance?.memberDemographics || {
    gender: { male: 0, female: 0, total: 0 },
    categories: { SC: 0, ST: 0, OBC: 0, General: 0 },
    landSize: { marginal: 0, small: 0, medium: 0, large: 0 },
    ageGroups: { "18-30": 0, "31-45": 0, "46-60": 0, "60+": 0 },
  };
  const criticalIssues = stats?.compliance?.criticalIssues || {
    aadhaarNotSeeded: 0,
    mobileNotVerified: 0,
    noSchemesEnrolled: 0,
    benefitsOverdue: 0,
  };
  const schemePerformance = stats?.compliance?.schemePerformance || [];

  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkReminderModal, setShowBulkReminderModal] = useState(false);
  const [exportProgress, setExportProgress] = useState(false);
  const [exportFormat, setExportFormat] = useState("PDF");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberDetailModal, setShowMemberDetailModal] = useState(false);

  const handleExportSubmit = (e) => {
    e.preventDefault();
    setExportProgress(true);
    setTimeout(() => {
      setExportProgress(false);
      setShowExportModal(false);
      alert(
        `Geographic Audit Report exported successfully in ${exportFormat} format!`,
      );
    }, 2000);
  };

  const handleSendReminders = (e) => {
    e.preventDefault();
    setExportProgress(true);
    setTimeout(() => {
      setExportProgress(false);
      setShowBulkReminderModal(false);
      alert(`Reminders sent to all uncovered members!`);
    }, 1500);
  };

  const getPriorityColor = (pendingAmount) => {
    const amount = parseFloat(String(pendingAmount).replace(/[^0-9.-]+/g, ""));
    if (amount > 20000) return "text-red-600 bg-red-50";
    if (amount > 10000) return "text-orange-600 bg-orange-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowMemberDetailModal(true);
  };

  // Table columns configuration
  const columns = [
    {
      header: "MEMBER ID",
      accessor: "id",
      sortable: true,
      cell: (value) => (
        <span className="font-mono text-[10px] font-medium text-gray-500">
          {value}
        </span>
      ),
    },
    {
      header: "NAME",
      accessor: "name",
      sortable: true,
      cell: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">{value}</span>
          {row.enrolledSchemes === 0 && (
            <span className="text-[8px] px-1 py-0.5 bg-red-100 text-red-600 rounded-full">
              New
            </span>
          )}
        </div>
      ),
    },
    {
      header: "VILLAGE",
      accessor: "village",
      sortable: true,
      cell: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      header: "CATEGORY",
      accessor: "category",
      sortable: true,
      cell: (value) => {
        const colors = {
          SC: "bg-blue-50 text-blue-700",
          ST: "bg-purple-50 text-purple-700",
          OBC: "bg-orange-50 text-orange-700",
          General: "bg-gray-50 text-gray-700",
        };
        return (
          <span
            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${colors[value] || "bg-gray-50 text-gray-700"}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: "MOBILE",
      accessor: "mobile",
      sortable: true,
      cell: (value) =>
        value ? (
          <span className="flex items-center gap-1 text-green-600 text-xs">
            <Smartphone size={10} /> {value}
          </span>
        ) : (
          <span className="text-red-500 flex items-center gap-1 text-xs">
            <AlertCircle size={10} /> Missing
          </span>
        ),
    },
    {
      header: "AADHAAR",
      accessor: "aadhaarSeeded",
      sortable: true,
      className: "text-center",
      cell: (value) =>
        value ? (
          <CheckCircle2 size={14} className="text-green-500 inline" />
        ) : (
          <X size={14} className="text-red-500 inline" />
        ),
    },
    {
      header: "SCHEMES",
      accessor: "enrolledSchemes",
      sortable: true,
      className: "text-center",
      cell: (value) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
            value > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      header: "PENDING BENEFITS",
      accessor: "pendingBenefits",
      sortable: true,
      className: "text-right",
      cell: (value) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getPriorityColor(value)}`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Action buttons for the table
  const tableActions = [
    {
      label: "View",
      onClick: (row) => handleViewMember(row),
      className: "text-[#31572c] hover:text-[#132a13] font-medium text-xs",
    },
  ];

  // If loading, show spinner
  if (loading) {
    return (
      <div className="space-y-6 text-center py-24">
        <FpoUtilizationHeader subtitle="FPO Member Benefit Coverage" />
        <div className="w-10 h-10 border-4 border-brand-medium border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-bold text-gray-500">Loading member benefits metrics...</p>
      </div>
    );
  }

  // If no memberDetails, show empty state
  if (!memberDetails || memberDetails.length === 0) {
    return (
      <div className="space-y-6">
        <FpoUtilizationHeader subtitle="FPO Member Benefit Coverage" />
        <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            No member data available. Please check your database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Member Benefit Coverage" />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-brand-medium" />
          Member Benefit Coverage Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor government schemes penetration and sub-category enrollments
          across FPO member segments.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total FPO Members"
          value={memberCoverage?.total || 700}
          subtext="Active registered farmers"
          icon={<Users className="text-[#132a13]" />}
        />
        <StatsCard
          title="Covered Members"
          value={memberCoverage?.covered || 480}
          subtext="Active benefits received"
          trend={`${memberCoverage?.coveragePercent || 68.5}%`}
          trendType="success"
          icon={<CheckCircle2 className="text-brand-medium" />}
        />
        <StatsCard
          title="Uncovered Members"
          value={memberCoverage?.uncovered || 220}
          subtext="Pending scheme registration"
          icon={<AlertCircle className="text-red-500" />}
        />
        <StatsCard
          title="Target Reach"
          value={`${memberCoverage?.potentialPercent || 92}%`}
          subtext="Potential with AIF & PMFBY campaigns"
          icon={<TrendingUp className="text-[#31572c]" />}
        />
      </div>

      {/* Demographics & Critical Issues Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Demographics */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <PieChart size={16} />
            Member Demographics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">
                Gender Ratio
              </p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Male</span>
                    <span className="font-bold">
                      {memberDemographics.gender?.male || 420}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-0.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{
                        width: `${((memberDemographics.gender?.male || 420) / (memberDemographics.gender?.total || 700)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs">
                    <span>Female</span>
                    <span className="font-bold">
                      {memberDemographics.gender?.female || 260}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-0.5">
                    <div
                      className="bg-pink-500 h-1.5 rounded-full"
                      style={{
                        width: `${((memberDemographics.gender?.female || 260) / (memberDemographics.gender?.total || 700)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pt-1 text-[10px] text-gray-500">
                  <span className="font-bold text-amber-600">⚠️ Gap:</span>{" "}
                  {(memberDemographics.gender?.male || 420) -
                    (memberDemographics.gender?.female || 260)}{" "}
                  more male members
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">
                Category Breakdown
              </p>
              <div className="space-y-1.5">
                {Object.entries(memberDemographics.categories || {}).map(
                  ([cat, count]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-xs">
                        <span>{cat}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-brand-medium h-1 rounded-full"
                          style={{
                            width: `${(count / (memberCoverage?.total || 700)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                Age Groups
              </p>
              {Object.entries(memberDemographics.ageGroups || {}).map(
                ([age, count]) => (
                  <div
                    key={age}
                    className="flex justify-between text-[10px] py-0.5"
                  >
                    <span>{age}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ),
              )}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">
                Land Holdings
              </p>
              {Object.entries(memberDemographics.landSize || {}).map(
                ([size, count]) => (
                  <div
                    key={size}
                    className="flex justify-between text-[10px] py-0.5"
                  >
                    <span className="capitalize">{size}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Critical Issues & Quick Actions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <ShieldAlert size={16} />
            Critical Issues - Member Level
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-xl text-center">
              <Smartphone size={18} className="text-red-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-600">
                {criticalIssues.aadhaarNotSeeded || 0}
              </p>
              <p className="text-[9px] text-red-600">Aadhaar Not Seeded</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl text-center">
              <Phone size={18} className="text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-orange-600">
                {criticalIssues.mobileNotVerified || 0}
              </p>
              <p className="text-[9px] text-orange-600">Mobile Not Verified</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl text-center">
              <UserX size={18} className="text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-600">
                {criticalIssues.noSchemesEnrolled || 0}
              </p>
              <p className="text-[9px] text-yellow-600">
                Zero Schemes Enrolled
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center">
              <Clock size={18} className="text-amber-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-600">
                {criticalIssues.benefitsOverdue || 0}
              </p>
              <p className="text-[9px] text-amber-600">Benefits Overdue</p>
            </div>
          </div>
          <button
            onClick={() => setShowBulkReminderModal(true)}
            className="w-full text-xs font-bold text-center py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition flex items-center justify-center gap-2"
          >
            <Send size={14} />
            Send Bulk Reminders to Uncovered
          </button>
        </div>
      </div>

      {/* Scheme Performance & Village Coverage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheme Performance */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            Scheme Performance Scorecard
          </h3>
          <div className="space-y-3">
            {(schemePerformance || []).slice(0, 6).map((scheme, idx) => (
              <div key={idx} className="p-2.5 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-gray-800">
                    {scheme.name}
                  </p>
                  <div className="flex gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                      ✅ {scheme.approved}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                      ❌ {scheme.rejected || 0}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-brand-medium h-1.5 rounded-full"
                    style={{ width: `${scheme.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] text-gray-500 mt-1">
                  <span>Coverage: {scheme.percent}%</span>
                  <span>Pending: {scheme.pending || 0}</span>
                  <span>Eligible: {scheme.eligible}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Village Coverage Index */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-1">
            <Map className="w-4 h-4 text-brand-medium" />
            Village Coverage Index
          </h3>
          <p className="text-[10px] text-gray-400 mb-3">
            Location-wise member density and coverage
          </p>
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {(memberCoverage?.villages || []).map((v, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg text-[10px]"
              >
                <span className="font-bold text-[#132a13]">{v.name}</span>
                <div className="flex gap-1.5 items-center font-bold">
                  <span className="text-gray-500">
                    ({v.covered}/{v.total})
                  </span>
                  <span
                    className={
                      v.intensity === "high"
                        ? "text-emerald-700"
                        : v.intensity === "medium"
                          ? "text-amber-600"
                          : "text-red-500"
                    }
                  >
                    {Math.round((v.covered / v.total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="w-full text-xs font-bold text-center py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl transition"
          >
            Export Geographic Audit
          </button>
        </div>
      </div>

      {/* Member Directory Table using GenericTable */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="font-bold text-[#132a13] text-sm mb-4 flex items-center gap-2">
          <Users size={16} />
          Member Directory & Benefit Status
        </h3>

        <GenericTable
          columns={columns}
          data={memberDetails}
          actions={tableActions}
          itemsPerPage={8}
          showSearch={true}
          showSort={true}
          searchPlaceholder="Search by name or member ID..."
          emptyMessage="No members found matching your search criteria"
        />
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-brand-medium" />
              Export Geographical Audit
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Export member registration stats and coverage grids per
              demographic segment.
            </p>

            {exportProgress ? (
              <div className="py-8 text-center text-xs font-bold text-[#132a13] animate-pulse">
                Assembling geolocation details and exporting...
              </div>
            ) : (
              <form onSubmit={handleExportSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["PDF", "Excel", "CSV"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setExportFormat(f)}
                        className={`py-2 rounded-xl border text-xs font-bold transition ${exportFormat === f ? "border-brand-medium bg-brand-medium/5 text-brand-medium" : "border-gray-200 text-gray-600"}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Include Villages
                  </label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {(memberCoverage?.villages || []).map((v, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 py-1 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="accent-[#4f772d]"
                        />
                        <span>
                          {v.name} ({v.covered} of {v.total} covered)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
                  >
                    Export File
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bulk Reminder Modal */}
      {showBulkReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowBulkReminderModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Send className="w-5 h-5 text-brand-medium" />
              Send Bulk Reminders
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Send WhatsApp/SMS reminders to uncovered members about pending
              scheme applications.
            </p>

            {exportProgress ? (
              <div className="py-8 text-center text-xs font-bold text-[#132a13] animate-pulse">
                Sending reminders to {memberCoverage?.uncovered || 220}{" "}
                members...
              </div>
            ) : (
              <form onSubmit={handleSendReminders} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Reminder Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="py-2 rounded-xl border border-brand-medium bg-brand-medium/5 text-brand-medium text-xs font-bold"
                    >
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      className="py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold"
                    >
                      SMS
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Target Audience
                  </label>
                  <div className="space-y-1 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-[#4f772d]"
                      />{" "}
                      Uncovered Members ({memberCoverage?.uncovered || 220})
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#4f772d]" />{" "}
                      Aadhaar Not Seeded ({criticalIssues.aadhaarNotSeeded || 0}
                      )
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#4f772d]" />{" "}
                      Zero Schemes Enrolled (
                      {criticalIssues.noSchemesEnrolled || 0})
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Message Template
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Dear Farmer, You are eligible for multiple government schemes. Please visit the FPO office to complete your registration and unlock benefits up to ₹50,000."
                    className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-brand-medium"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkReminderModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
                  >
                    Send Reminders
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {showMemberDetailModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-md my-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowMemberDetailModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#132a13]/10 flex items-center justify-center mx-auto mb-3">
                <Users size={32} className="text-[#132a13]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedMember.name}
              </h2>
              <p className="text-xs text-gray-500">
                Member ID: {selectedMember.id}
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Village</p>
                  <p className="text-sm font-medium">
                    {selectedMember.village}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">
                    Category
                  </p>
                  <p className="text-sm font-medium">
                    {selectedMember.category}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">
                    Land Size
                  </p>
                  <p className="text-sm font-medium">
                    {selectedMember.landSize}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Age</p>
                  <p className="text-sm font-medium">
                    {selectedMember.age} years
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Mobile</p>
                  <p className="text-sm font-medium">
                    {selectedMember.mobile || "Not Available"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">
                    Aadhaar Seeded
                  </p>
                  <p className="text-sm font-medium">
                    {selectedMember.aadhaarSeeded ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-[#132a13]/5 to-[#4f772d]/5 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase mb-1">
                  Benefits Summary
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-gray-500">Received</p>
                    <p className="text-lg font-bold text-green-600">
                      {selectedMember.benefitsReceived}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500">Pending</p>
                    <p className="text-lg font-bold text-orange-600">
                      {selectedMember.pendingBenefits}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-[10px] text-gray-500">Enrolled Schemes</p>
                  <p className="text-sm font-bold">
                    {selectedMember.enrolledSchemes} schemes active
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 bg-brand-medium text-white rounded-lg text-xs font-bold hover:bg-brand-dark transition">
                  Send Reminder
                </button>
                <button className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FpoMemberCoverage;
