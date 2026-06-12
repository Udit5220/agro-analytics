// // src/pages/gov-schemes/fpo/FpoCompliance.jsx
// import React, { useState } from "react";
// import {
//   FileText,
//   Calendar,
//   X,
//   CheckCircle2,
//   AlertCircle
// } from "lucide-react";
// import govtSchemeData from "../../../seed-json/govt_scheme.json";
// import { FpoUtilizationHeader } from "./FpoHelper";

// const FpoCompliance = () => {
//   const { compliance } = govtSchemeData.fpoOpportunityData;
//   const [checklist, setChecklist] = useState(compliance.checklist);
//   const [documents, setDocuments] = useState(compliance.documents);

//   // Interactive modal states
//   const [showLogModal, setShowLogModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [taskStatus, setTaskStatus] = useState("Completed");
//   const [taskNotes, setTaskNotes] = useState("");

//   const [showDocsModal, setShowDocsModal] = useState(false);

//   const triggerUpdateLog = (item) => {
//     setSelectedTask(item);
//     setTaskStatus(item.status);
//     setTaskNotes("");
//     setShowLogModal(true);
//   };

//   const handleLogSubmit = (e) => {
//     e.preventDefault();
//     setChecklist(prev => prev.map(t => {
//       if (t.name === selectedTask.name) {
//         return { ...t, status: taskStatus };
//       }
//       return t;
//     }));
//     setShowLogModal(false);
//     alert(`Status for compliance filing "${selectedTask.name}" has been updated to "${taskStatus}"!`);
//   };

//   return (
//     <div className="space-y-6">
//       <FpoUtilizationHeader subtitle="FPO Compliance & Document Vault" />

//       {/* Header */}
//       <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
//         <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
//           <FileText className="w-5 h-5 text-brand-medium" />
//           Compliance & Document Vault
//         </h1>
//         <p className="text-xs text-gray-500 mt-1">Audit mandatory compliance checkpoints (AGM, Audits, GST) and secure required certifications for FPO funding.</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Compliance Checklist */}
//         <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm overflow-x-auto">
//           <h3 className="font-bold text-[#132a13] text-sm mb-3">Audit & Filing Compliance Checklist</h3>
//           <table className="w-full text-xs font-semibold text-left text-gray-600">
//             <thead>
//               <tr className="border-b border-gray-200 text-gray-400">
//                 <th className="py-2">Filing Checklist</th>
//                 <th className="py-2">Schedule Due</th>
//                 <th className="py-2">Current Status</th>
//                 <th className="py-2 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {checklist.map((item, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50/40">
//                   <td className="py-3 font-bold text-gray-800">{item.name}</td>
//                   <td className="py-3 text-gray-700 font-mono">{item.dueDate}</td>
//                   <td className="py-3">
//                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
//                       item.status === "Completed" || item.status === "Active"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                         : item.status === "Pending"
//                           ? "bg-amber-50 text-amber-700 border-amber-200"
//                           : "bg-red-50 text-red-700 border-red-200"
//                     }`}>
//                       {item.status}
//                     </span>
//                   </td>
//                   <td className="py-3 text-right">
//                     <button
//                       type="button"
//                       onClick={() => triggerUpdateLog(item)}
//                       className="text-[10px] font-bold text-brand-medium hover:underline"
//                     >
//                       Update Log
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Expiry Tracker */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="font-bold text-[#132a13] text-sm mb-1 flex items-center gap-1">
//               <Calendar className="w-4 h-4 text-brand-medium" />
//               FPO Expiry Tracker
//             </h3>
//             <p className="text-[10px] text-gray-400 mb-4">Review dates and expiry parameters of active cooperative certificates</p>
//             <div className="space-y-3.5">
//               {documents.map((doc, idx) => (
//                 <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-100 pb-2">
//                   <div>
//                     <p className="font-bold text-gray-855 truncate max-w-[170px]" title={doc.name}>{doc.name}</p>
//                     <p className="text-[9px] text-gray-455 font-semibold">{doc.category} Category</p>
//                   </div>
//                   <span className="text-[10px] font-bold text-emerald-700 font-mono bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
//                     {doc.expiry}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={() => setShowDocsModal(true)}
//             className="w-full mt-4 text-xs font-bold text-center py-2 bg-[#132a13] text-white rounded-xl hover:bg-brand-dark transition"
//           >
//             View All Documents
//           </button>
//         </div>
//       </div>

//       {/* Compliance Log Updater Modal */}
//       {showLogModal && selectedTask && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
//           <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
//             <button
//               type="button"
//               onClick={() => setShowLogModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
//               <FileText className="w-5 h-5 text-brand-medium" />
//               Update Compliance Log
//             </h2>
//             <p className="text-xs text-gray-500 mb-4 font-semibold">
//               Filing details for: <span className="text-[#132a13]">{selectedTask.name}</span>
//             </p>

//             <form onSubmit={handleLogSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Current Status</label>
//                   <select
//                     value={taskStatus}
//                     onChange={(e) => setTaskStatus(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
//                   >
//                     <option value="Completed">Completed</option>
//                     <option value="Pending">Pending</option>
//                     <option value="Overdue">Overdue</option>
//                     <option value="Active">Active</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Due Date</label>
//                   <input
//                     type="text"
//                     defaultValue={selectedTask.dueDate}
//                     disabled
//                     className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-xs font-semibold focus:outline-none text-gray-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Resolution Notes</label>
//                 <textarea
//                   rows="3"
//                   value={taskNotes}
//                   onChange={(e) => setTaskNotes(e.target.value)}
//                   placeholder="Type updates or upload references logs..."
//                   className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-brand-medium resize-none"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowLogModal(false)}
//                   className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
//                 >
//                   Save Status
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View All Documents Modal */}
//       {showDocsModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
//           <div className="relative w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
//             <button
//               type="button"
//               onClick={() => setShowDocsModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
//               <FileText className="w-5 h-5 text-brand-medium" />
//               FPO Document Vault Library
//             </h2>
//             <p className="text-xs text-gray-500 mb-4">Complete audit trail of registration certificates, cooperative resolutions, and corporate statements.</p>

//             <div className="overflow-x-auto border border-gray-150 rounded-xl">
//               <table className="w-full text-xs font-semibold text-left text-gray-600">
//                 <thead className="bg-[#f4f7f4]/60">
//                   <tr>
//                     <th className="p-3">Document Name</th>
//                     <th className="p-3">Category</th>
//                     <th className="p-3">Audit Expiry</th>
//                     <th className="p-3 text-right">Downloads</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {documents.map((doc, idx) => (
//                     <tr key={idx} className="hover:bg-gray-50/40">
//                       <td className="p-3 font-bold text-gray-800">{doc.name}</td>
//                       <td className="p-3 text-gray-500">{doc.category}</td>
//                       <td className="p-3">
//                         <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
//                           {doc.expiry}
//                         </span>
//                       </td>
//                       <td className="p-3 text-right">
//                         <button type="button" className="text-[10px] font-bold text-brand-medium hover:underline">Download</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <button
//               type="button"
//               onClick={() => setShowDocsModal(false)}
//               className="w-full mt-4 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
//             >
//               Close Vault
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FpoCompliance;

// src/pages/gov-schemes/fpo/FpoCompliance.jsx
import React, { useState } from "react";
import {
  FileText,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  Eye,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Building2,
  Users,
  FileCheck,
  ScrollText,
  Gauge,
  Target,
  Flag,
  Info,
  ChevronRight,
  Loader2,
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  ListChecks,
  Ban,
  CircleCheck,
  CircleAlert,
  FileWarning,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { FpoUtilizationHeader } from "./FpoHelper";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const FpoCompliance = () => {
  // Get compliance data from JSON
  const complianceData = govtSchemeData.fpoComplianceData || {};
  const fpoCompliance = govtSchemeData.fpoOpportunityData?.compliance || {};

  const [checklist, setChecklist] = useState(fpoCompliance.checklist || []);
  const [documents, setDocuments] = useState(fpoCompliance.documents || []);
  const [requiredDocs, setRequiredDocs] = useState(
    complianceData.requiredDocuments || [],
  );
  const [auditTrail, setAuditTrail] = useState(complianceData.auditTrail || []);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState(
    complianceData.upcomingDeadlines || [],
  );
  const [blockedGrants, setBlockedGrants] = useState(
    complianceData.blockedGrants || [],
  );
  const [complianceScore, setComplianceScore] = useState(
    complianceData.complianceScore || {
      overall: 82,
      trend: "+4.2%",
      previousQuarter: 78,
      target: 95,
    },
  );
  const [riskIndicators, setRiskIndicators] = useState(
    complianceData.riskIndicators || [],
  );

  // Modal states
  const [showLogModal, setShowLogModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [taskStatus, setTaskStatus] = useState("Completed");
  const [taskNotes, setTaskNotes] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [activeTab, setActiveTab] = useState("checklist");

  const triggerUpdateLog = (item) => {
    setSelectedTask(item);
    setTaskStatus(item.status);
    setTaskNotes("");
    setShowLogModal(true);
  };

  const triggerUploadDoc = (doc) => {
    setSelectedDoc(doc);
    setUploadFile(null);
    setShowUploadModal(true);
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    setChecklist((prev) =>
      prev.map((t) => {
        if (t.name === selectedTask.name) {
          return { ...t, status: taskStatus };
        }
        return t;
      }),
    );
    setShowLogModal(false);

    // Add to audit trail
    const newAudit = {
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      action: `Status Updated to ${taskStatus}`,
      user: "FPO Manager",
      document: selectedTask.name,
      status:
        taskStatus === "Completed" ? "approved" : taskStatus.toLowerCase(),
    };
    setAuditTrail((prev) => [newAudit, ...prev.slice(0, 19)]);

    alert(
      `Status for "${selectedTask.name}" has been updated to "${taskStatus}"!`,
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setUploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a file to upload");
      return;
    }

    setUploadProgress(true);
    setTimeout(() => {
      setUploadProgress(false);
      setShowUploadModal(false);

      // Update required documents
      setRequiredDocs((prev) =>
        prev.map((doc) => {
          if (doc.name === selectedDoc.name) {
            return {
              ...doc,
              uploaded: true,
              lastUpdated: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            };
          }
          return doc;
        }),
      );

      // Add to audit trail
      const newAudit = {
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        action: "Document Uploaded",
        user: "FPO Manager",
        document: selectedDoc.name,
        status: "pending_review",
      };
      setAuditTrail((prev) => [newAudit, ...prev.slice(0, 19)]);

      // Update compliance score
      const uploadedCount = requiredDocs.filter((d) => d.uploaded).length + 1;
      const newScore = Math.min(
        Math.round((uploadedCount / requiredDocs.length) * 100),
        100,
      );
      setComplianceScore((prev) => ({ ...prev, overall: newScore }));

      alert(`"${selectedDoc.name}" uploaded successfully! Under review.`);
    }, 2000);
  };

  const getRiskColor = (risk) => {
    const colors = {
      Critical: "bg-red-100 text-red-700 border-red-200",
      High: "bg-orange-100 text-orange-700 border-orange-200",
      Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Low: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[risk] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={12} className="text-green-500" />;
      case "Active":
        return <CircleCheck size={12} className="text-green-500" />;
      case "Pending":
        return <Clock size={12} className="text-yellow-500" />;
      case "Overdue":
        return <AlertCircle size={12} className="text-red-500" />;
      case "Upcoming":
        return <CalendarDays size={12} className="text-blue-500" />;
      default:
        return <AlertCircle size={12} className="text-gray-400" />;
    }
  };

  // Calculate stats
  const uploadedCount = requiredDocs.filter((d) => d.uploaded).length;
  const missingCount = requiredDocs.filter(
    (d) => d.required && !d.uploaded,
  ).length;
  const totalBlockedAmount = blockedGrants.reduce((sum, g) => {
    const amount = parseFloat(g.amount.replace(/[^0-9.-]+/g, "")) * 10000000;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  // Table columns for required documents
  const docColumns = [
    {
      header: "DOCUMENT",
      accessor: "name",
      sortable: true,
      cell: (value, row) => (
        <span className="font-bold text-gray-800">{value}</span>
      ),
    },
    { header: "CATEGORY", accessor: "category", sortable: true },
    {
      header: "STATUS",
      accessor: "uploaded",
      sortable: true,
      cell: (value, row) => (
        <span
          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {value ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
          {value ? "Uploaded" : "Missing"}
        </span>
      ),
    },
    {
      header: "BLOCKS",
      accessor: "blocking",
      sortable: true,
      cell: (value) =>
        value ? (
          <span className="text-[9px] text-red-600">{value}</span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  // Table columns for risk indicators
  const riskColumns = [
    {
      header: "COMPLIANCE ITEM",
      accessor: "name",
      sortable: true,
      cell: (value) => <span className="font-bold text-gray-800">{value}</span>,
    },
    {
      header: "RISK",
      accessor: "risk",
      sortable: true,
      cell: (value) => (
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getRiskColor(value)}`}
        >
          {value}
        </span>
      ),
    },
    { header: "IMPACT", accessor: "impact", sortable: true },
    {
      header: "DEADLINE",
      accessor: "deadline",
      sortable: true,
      cell: (value, row) => (
        <div className="flex items-center gap-1">
          {getStatusIcon(row.status)}
          <span
            className={row.status === "Overdue" ? "text-red-600 font-bold" : ""}
          >
            {value}
          </span>
        </div>
      ),
    },
  ];

  // Table columns for audit trail
  const auditColumns = [
    {
      header: "DATE",
      accessor: "date",
      sortable: true,
      cell: (value) => <span className="font-mono text-[10px]">{value}</span>,
    },
    { header: "ACTION", accessor: "action", sortable: true },
    { header: "DOCUMENT", accessor: "document", sortable: true },
    { header: "USER", accessor: "user", sortable: true },
    {
      header: "STATUS",
      accessor: "status",
      sortable: true,
      cell: (value) => (
        <span
          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
            value === "approved"
              ? "bg-green-100 text-green-700"
              : value === "submitted"
                ? "bg-blue-100 text-blue-700"
                : value === "pending_review"
                  ? "bg-yellow-100 text-yellow-700"
                  : value === "alert"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  // Table actions for required documents
  const docActions = [
    {
      label: "Upload",
      onClick: (row) => triggerUploadDoc(row),
      className: "text-brand-medium hover:text-[#31572c] font-medium text-xs",
    },
    {
      label: "View",
      onClick: (row) => console.log("View", row),
      className: "text-gray-500 hover:text-gray-700 font-medium text-xs",
    },
  ];

  return (
    <div className="space-y-6">
      <FpoUtilizationHeader subtitle="FPO Compliance & Document Vault" />

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h1 className="text-xl font-bold text-[#132a13] flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-brand-medium" />
          Compliance Command Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Audit mandatory compliance checkpoints, track document expiry, and
          manage certifications for FPO funding eligibility.
        </p>
      </div>

      {/* Compliance Score & Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="COMPLIANCE SCORE"
          value={`${complianceScore.overall}%`}
          trend={complianceScore.trend}
          trendType="success"
          subtext={`Target: ${complianceScore.target}%`}
          icon={<Gauge className="text-[#132a13]" />}
        />
        <StatsCard
          title="DOCUMENTS"
          value={`${uploadedCount}/${requiredDocs.length}`}
          trend={`${missingCount} missing`}
          trendType={missingCount > 0 ? "danger" : "success"}
          subtext="Required certifications"
          icon={<FileCheck className="text-brand-medium" />}
        />
        <StatsCard
          title="PENDING DEADLINES"
          value={
            upcomingDeadlines.filter((d) => d.daysLeft > 0 && d.daysLeft <= 30)
              .length
          }
          trend={`${upcomingDeadlines.filter((d) => d.daysLeft < 0).length} overdue`}
          trendType="danger"
          subtext="Next 30 days"
          icon={<CalendarDays className="text-[#31572c]" />}
        />
        <StatsCard
          title="BLOCKED GRANTS"
          value={`₹${(totalBlockedAmount / 10000000).toFixed(1)} Cr`}
          trend={`${blockedGrants.length} grants`}
          trendType="danger"
          subtext="Action required"
          icon={<DollarSign className="text-red-500" />}
        />
        <StatsCard
          title="HIGH RISK ITEMS"
          value={
            riskIndicators.filter(
              (r) => r.risk === "Critical" || r.risk === "High",
            ).length
          }
          trend="Immediate attention"
          trendType="danger"
          subtext="May block funding"
          icon={<AlertTriangle className="text-orange-500" />}
        />
        <StatsCard
          title="AUDIT TRAIL"
          value={auditTrail.length}
          trend="Last 30 days"
          trendType="info"
          subtext="All compliance actions"
          icon={<ScrollText className="text-[#90a955]" />}
        />
      </div>

      {/* Risk Indicators Banner */}
      {riskIndicators.filter((r) => r.risk === "Critical" || r.risk === "High")
        .length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-xs font-bold text-red-800">
                Critical Compliance Risks Detected
              </p>
              <p className="text-[10px] text-red-600">
                {riskIndicators.filter((r) => r.risk === "Critical").length}{" "}
                critical,{" "}
                {riskIndicators.filter((r) => r.risk === "High").length} high
                risk items require immediate action
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRiskModal(true)}
            className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1"
          >
            View Details <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Main Tabs */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="border-b border-gray-150 px-5">
          <div className="flex gap-1 overflow-x-auto">
            {[
              {
                id: "checklist",
                label: "Compliance Checklist",
                icon: ListChecks,
                count: checklist.filter((c) => c.status !== "Completed").length,
              },
              {
                id: "documents",
                label: "Document Vault",
                icon: FileText,
                count: missingCount,
              },
              {
                id: "deadlines",
                label: "Upcoming Deadlines",
                icon: Calendar,
                count: upcomingDeadlines.filter(
                  (d) => d.daysLeft <= 30 && d.daysLeft > 0,
                ).length,
              },
              {
                id: "audit",
                label: "Audit Trail",
                icon: ScrollText,
                count: null,
              },
              {
                id: "grants",
                label: "Blocked Grants",
                icon: Ban,
                count: blockedGrants.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#132a13]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? "bg-[#132a13] text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#132a13] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* Compliance Checklist Tab */}
          {activeTab === "checklist" && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="text-left py-2">Filing Checklist</th>
                    <th className="text-left py-2">Schedule Due</th>
                    <th className="text-left py-2">Current Status</th>
                    <th className="text-right py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {checklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/40">
                      <td className="py-3 font-bold text-gray-800">
                        {item.name}
                      </td>
                      <td className="py-3 text-gray-700 font-mono">
                        {item.dueDate}
                      </td>
                      <td className="py-3">
                        <span
                          className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            item.status === "Completed" ||
                            item.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status === "Pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {item.status === "Completed" && (
                            <CheckCircle2 size={10} />
                          )}
                          {item.status === "Pending" && <Clock size={10} />}
                          {item.status === "Overdue" && (
                            <AlertCircle size={10} />
                          )}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => triggerUpdateLog(item)}
                          className="text-[10px] font-bold text-brand-medium hover:underline flex items-center gap-1 ml-auto"
                        >
                          <Edit size={12} /> Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Document Vault Tab */}
          {activeTab === "documents" && (
            <GenericTable
              columns={docColumns}
              data={requiredDocs}
              actions={docActions}
              itemsPerPage={8}
              showSearch={true}
              showSort={true}
              searchPlaceholder="Search documents..."
              emptyMessage="No documents found"
            />
          )}

          {/* Upcoming Deadlines Tab */}
          {activeTab === "deadlines" && (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    deadline.priority === "critical"
                      ? "bg-red-50 border-red-200"
                      : deadline.priority === "high"
                        ? "bg-orange-50 border-orange-200"
                        : deadline.priority === "medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {deadline.task}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        Penalty: {deadline.penalty}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold ${
                          deadline.daysLeft < 0
                            ? "text-red-600"
                            : deadline.daysLeft <= 7
                              ? "text-orange-600"
                              : "text-gray-600"
                        }`}
                      >
                        {deadline.daysLeft < 0
                          ? `Overdue by ${Math.abs(deadline.daysLeft)} days`
                          : `${deadline.daysLeft} days left`}
                      </p>
                      <p className="text-[9px] text-gray-400">
                        Due: {deadline.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        deadline.daysLeft < 0
                          ? "bg-red-500"
                          : deadline.daysLeft <= 7
                            ? "bg-orange-500"
                            : deadline.priority === "critical"
                              ? "bg-red-500"
                              : deadline.priority === "high"
                                ? "bg-orange-500"
                                : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(Math.max((deadline.daysLeft / 30) * 100, 0), 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === "audit" && (
            <GenericTable
              columns={auditColumns}
              data={auditTrail}
              itemsPerPage={8}
              showSearch={true}
              showSort={true}
              searchPlaceholder="Search audit records..."
              emptyMessage="No audit records found"
            />
          )}

          {/* Blocked Grants Tab */}
          {activeTab === "grants" && (
            <div className="space-y-3">
              {blockedGrants.map((grant, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {grant.grant}
                      </p>
                      <p className="text-[10px] text-red-600 mt-0.5">
                        Blocked by: {grant.blockedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600">
                        {grant.amount}
                      </p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-200 text-red-800">
                        {grant.status}
                      </span>
                    </div>
                  </div>
                  <button className="mt-2 text-[10px] font-bold text-red-700 hover:underline flex items-center gap-1">
                    <FileWarning size={10} /> View Resolution Path
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compliance Log Updater Modal */}
      {showLogModal && selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
              <button
                onClick={() => setShowLogModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-brand-medium" />
                Update Compliance Log
              </h2>
              <p className="text-xs text-gray-500 mb-4 font-semibold">
                Filing details for:{" "}
                <span className="text-[#132a13]">{selectedTask.name}</span>
              </p>

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                      Current Status
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Active">Active</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                      Due Date
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTask.dueDate}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">
                    Resolution Notes
                  </label>
                  <textarea
                    rows={3}
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    placeholder="Type updates or upload references logs..."
                    className="w-full px-3 py-2 border border-gray-250 rounded-xl text-xs focus:outline-none focus:border-brand-medium resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition"
                  >
                    Save Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-lg my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-brand-medium" />
              Upload {selectedDoc.name}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {selectedDoc.required ? "Required document" : "Optional document"}{" "}
              - {selectedDoc.category} category
            </p>

            <div className="bg-amber-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-amber-800">
                <span className="font-bold">⚠️ Impact if missing:</span>{" "}
                {selectedDoc.blocking || "May affect scheme eligibility"}
              </p>
            </div>

            {uploadProgress ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-brand-medium animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">
                  Uploading and verifying...
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                    dragActive
                      ? "border-brand-medium bg-brand-medium/5"
                      : "border-gray-250 hover:border-gray-300"
                  }`}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    {uploadFile
                      ? uploadFile.name
                      : "Drag and drop your file here, or click to browse"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-medium">
                    Supports PDF, DOCX, JPEG up to 10MB
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 py-2.5 border border-gray-250 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFile}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${uploadFile ? "bg-brand-medium hover:bg-brand-dark text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Risk Details Modal */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="relative w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-gray-150">
            <button
              onClick={() => setShowRiskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-black text-[#132a13] flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Compliance Risk Assessment
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Detailed risk analysis and recommended mitigation actions
            </p>

            <div className="space-y-3">
              {riskIndicators.map((risk, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    risk.risk === "Critical"
                      ? "bg-red-50 border-red-200"
                      : risk.risk === "High"
                        ? "bg-orange-50 border-orange-200"
                        : risk.risk === "Medium"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getRiskColor(risk.risk)}`}
                        >
                          {risk.risk}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {risk.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {risk.impact}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-gray-400">
                          Deadline: {risk.deadline}
                        </span>
                        <span
                          className={`text-[10px] font-bold ${risk.status === "Overdue" ? "text-red-600" : risk.status === "Pending" ? "text-orange-600" : "text-green-600"}`}
                        >
                          {risk.status}
                        </span>
                      </div>
                    </div>
                    <button className="ml-2 text-xs font-bold text-brand-medium hover:underline">
                      Mitigate
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRiskModal(false)}
              className="w-full mt-4 py-2 bg-[#132a13] text-white rounded-xl text-sm font-bold hover:bg-brand-dark transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FpoCompliance;
