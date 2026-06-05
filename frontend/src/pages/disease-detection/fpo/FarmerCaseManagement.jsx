// // PAGE 4 — Farmer Case Management
// // File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/FarmerCaseManagement.jsx

// import React, { useState, useEffect } from "react";
// import seededData from "../../../seed-json/seededData.json";
// import StatsCard from "../../../components/partials/StatsCard";
// import {
//   Users, AlertTriangle, ShieldCheck, Clock, X, User,
//   ChevronRight, Calendar, Check, Play, RefreshCw
// } from "lucide-react";

// export default function FarmerCaseManagement() {
//   const [dataState, setDataState] = useState(() => {
//     const saved = localStorage.getItem("fpoDiseaseDetectionState");
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch (e) {
//         console.error("Failed to parse FPO state", e);
//       }
//     }
//     return seededData.fpoDiseaseDetection;
//   });

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const saved = localStorage.getItem("fpoDiseaseDetectionState");
//       if (saved) {
//         try {
//           setDataState(JSON.parse(saved));
//         } catch (e) {
//           console.error("Failed to parse FPO state from storage event", e);
//         }
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const cases = dataState.cases || [];
//   const officers = dataState.officers || [];

//   const updateFpoState = (updatedState) => {
//     localStorage.setItem("fpoDiseaseDetectionState", JSON.stringify(updatedState));
//     window.dispatchEvent(new Event("storage"));
//     setDataState(updatedState);
//   };

//   const [selectedCase, setSelectedCase] = useState(null);
//   const [activeQueueTab, setActiveQueueTab] = useState("Critical"); // Critical | High Priority | Medium | Resolved

//   // Overview Cards calculations
//   const overviewCards = [
//     { label: "Open Cases", value: cases.filter(c => c.status !== "Resolved").length },
//     { label: "Critical Cases", value: cases.filter(c => c.severity === "Critical" && c.status !== "Resolved").length },
//     { label: "Pending Reviews", value: cases.filter(c => c.officer === "Unassigned" && c.status !== "Resolved").length },
//     { label: "Resolved Cases", value: cases.filter(c => c.status === "Resolved").length }
//   ];

//   // Queue lists helper
//   const getFilteredQueueCases = () => {
//     return cases.filter(c => {
//       if (activeQueueTab === "Critical") return c.severity === "Critical" && c.status !== "Resolved";
//       if (activeQueueTab === "High Priority") return c.severity === "High" && c.status !== "Resolved";
//       if (activeQueueTab === "Medium") return c.severity === "Moderate" && c.status !== "Resolved";
//       if (activeQueueTab === "Resolved") return c.status === "Resolved";
//       return true;
//     });
//   };

//   // Stepper representation for treatments
//   const stepperStages = [
//     { label: "Diagnostic Scan Complete", desc: "Leaf lesions uploaded & checked" },
//     { label: "Officer Appointed", desc: "Field technician dispatched to farm" },
//     { label: "Chemical Spray Deployed", desc: "Recommended fungicidal splits completed" },
//     { label: "Resolution Verified", desc: "Follow-up biomass checks completed" }
//   ];

//   // Drawer Handler functions
//   const updateCaseOfficer = (caseId, officerName) => {
//     const nextCases = cases.map(c => c.id === caseId ? { ...c, officer: officerName, status: "In Progress", updated: "Just now" } : c);
//     updateFpoState({ ...dataState, cases: nextCases });
//     if (selectedCase && selectedCase.id === caseId) {
//       setSelectedCase(prev => ({ ...prev, officer: officerName, status: "In Progress" }));
//     }
//   };

//   const updateCaseProgress = (caseId, val) => {
//     const isResolved = Number(val) === 100;
//     const nextCases = cases.map(c => c.id === caseId ? {
//       ...c,
//       progress: Number(val),
//       status: isResolved ? "Resolved" : "In Progress",
//       updated: "Just now"
//     } : c);
//     updateFpoState({ ...dataState, cases: nextCases });

//     if (selectedCase && selectedCase.id === caseId) {
//       setSelectedCase(prev => ({
//         ...prev,
//         progress: Number(val),
//         status: isResolved ? "Resolved" : "In Progress"
//       }));
//     }
//   };

//   const updateCaseStatus = (caseId, status) => {
//     const progressVal = status === "Resolved" ? 100 : status === "Open" ? 10 : 50;
//     const nextCases = cases.map(c => c.id === caseId ? {
//       ...c,
//       status,
//       progress: progressVal,
//       updated: "Just now"
//     } : c);
//     updateFpoState({ ...dataState, cases: nextCases });

//     if (selectedCase && selectedCase.id === caseId) {
//       setSelectedCase(prev => ({
//         ...prev,
//         status,
//         progress: progressVal
//       }));
//     }
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif]">
//       {/* Title */}
//       <div className="space-y-1 text-left">
//         <h1 className="text-2xl font-black text-[#132a13] tracking-tight">Farmer Case Management System</h1>
//         <p className="text-slate-500 text-xs font-semibold">
//           Coordinate leaf scans, assign officer visits, and monitor individual farm recovery steps.
//         </p>
//       </div>

//       {/* Overview Rows */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {overviewCards.map((card, idx) => {
//           const Icon = idx === 0 ? Clock : idx === 1 ? AlertTriangle : idx === 2 ? User : ShieldCheck;
//           return (
//             <StatsCard
//               key={idx}
//               title={card.label}
//               value={card.value}
//               icon={<Icon className="text-emerald-700" />}
//               subtext="Real-time casework"
//             />
//           );
//         })}
//       </div>

//       {/* Main Layout containing Priority Queue Tabs & Table */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">

//           {/* Priority Queue Ledger Box */}
//           <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">

//             {/* Tabbed filters */}
//             <div className="flex justify-between items-center pb-2 border-b border-slate-100 flex-wrap gap-3">
//               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
//                 <Users className="w-4 h-4 text-[#31572c]" /> Priority Queue Tabs
//               </h3>

//               <div className="flex gap-2">
//                 {["Critical", "High Priority", "Medium", "Resolved"].map((tab) => {
//                   const filterSeverity = tab === "High Priority" ? "High" : tab === "Medium" ? "Moderate" : tab;
//                   const count = tab === "Resolved"
//                     ? cases.filter(c => c.status === "Resolved").length
//                     : cases.filter(c => c.severity === filterSeverity && c.status !== "Resolved").length;

//                   return (
//                     <button
//                       key={tab}
//                       type="button"
//                       onClick={() => setActiveQueueTab(tab)}
//                       className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
//                         activeQueueTab === tab ? "bg-[#31572c] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-200"
//                       }`}
//                     >
//                       {tab}
//                       <span className={`px-1.5 py-0.25 text-[8px] font-black rounded-full ${
//                         activeQueueTab === tab ? "bg-white text-[#31572c]" : "bg-slate-200 text-slate-700"
//                       }`}>{count}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs text-left">
//                 <thead>
//                   <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                     <th className="py-2.5">Farmer</th>
//                     <th className="py-2.5">Village</th>
//                     <th className="py-2.5">Crop</th>
//                     <th className="py-2.5">Pathogen</th>
//                     <th className="py-2.5 text-center">Severity</th>
//                     <th className="py-2.5 text-center">Status</th>
//                     <th className="py-2.5 text-center">Officer</th>
//                     <th className="py-2.5 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 font-bold">
//                   {getFilteredQueueCases().map((c) => (
//                     <tr
//                       key={c.id}
//                       onClick={() => setSelectedCase(c)}
//                       className={`cursor-pointer hover:bg-slate-50 transition-colors ${
//                         selectedCase?.id === c.id ? "bg-[#31572c]/5" : ""
//                       }`}
//                     >
//                       <td className="py-3.5 text-slate-900">{c.farmer}</td>
//                       <td className="py-3.5 text-slate-550">{c.village}</td>
//                       <td className="py-3.5 text-slate-550">{c.crop}</td>
//                       <td className="py-3.5 text-slate-700">{c.disease}</td>
//                       <td className="py-3.5 text-center">
//                         <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
//                           c.severity === "Critical" ? "bg-red-100 text-red-700" : c.severity === "High" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
//                         }`}>
//                           {c.severity}
//                         </span>
//                       </td>
//                       <td className="py-3.5 text-center">
//                         <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${
//                           c.status === "Resolved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
//                         }`}>
//                           {c.status}
//                         </span>
//                       </td>
//                       <td className="py-3.5 text-center text-slate-500">{c.officer}</td>
//                       <td className="py-3.5 text-right flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
//                         <button
//                           type="button"
//                           onClick={() => setSelectedCase(c)}
//                           className="px-2 py-1 text-[9px] bg-slate-100 hover:bg-slate-200 rounded font-black uppercase tracking-wider text-slate-600 cursor-pointer"
//                         >
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </div>

//         </div>

//         {/* Sliding detail drawer sidebar mockup style */}
//         <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-fit space-y-4">
//           <div className="flex justify-between items-center pb-2 border-b border-slate-100">
//             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
//               Case Detail Drawer
//             </h3>
//             {selectedCase && (
//               <button
//                 type="button"
//                 onClick={() => setSelectedCase(null)}
//                 className="p-1 hover:bg-slate-100 rounded text-slate-400"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {selectedCase ? (
//             <div className="space-y-4 text-xs font-semibold text-slate-700 animate-slideIn">

//               {/* Profile Avatar structure */}
//               <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
//                 <div className="h-10 w-10 bg-[#31572c] text-[#ecf39e] rounded-full flex items-center justify-center text-sm font-black uppercase tracking-wider">
//                   {selectedCase.farmer.split(" ").map(n => n[0]).join("")}
//                 </div>
//                 <div>
//                   <h4 className="font-black text-slate-900">{selectedCase.farmer}</h4>
//                   <p className="text-[10px] text-slate-500">{selectedCase.village} Cluster • {selectedCase.crop}</p>
//                 </div>
//               </div>

//               {/* Diagnosis details */}
//               <div className="space-y-1.5">
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Diagnosis Summary</span>
//                 <div><b>Infection:</b> {selectedCase.disease}</div>
//                 <div><b>Severity Index:</b> {selectedCase.severity}</div>
//               </div>

//               {/* Symptom checklist */}
//               <div className="space-y-1.5">
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Symptom Checklist</span>
//                 <div className="space-y-1">
//                   {selectedCase.symptoms?.map((sym, idx) => (
//                     <div key={idx} className="flex gap-1.5 items-center">
//                       <Check className="w-3.5 h-3.5 text-[#31572c]" />
//                       <span>{sym}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Treatment steppers */}
//               <div className="space-y-2 pt-1 border-t border-slate-100">
//                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Treatment Timeline Steps</span>
//                 <div className="space-y-3 pl-2">
//                   {stepperStages.map((stage, idx) => {
//                     const stepProgress = selectedCase.progress;
//                     const isActive = stepProgress >= (idx + 1) * 25;
//                     return (
//                       <div key={idx} className="flex gap-3 items-start relative">
//                         <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[9px] font-black z-10 shrink-0 ${
//                           isActive ? "bg-[#31572c] text-[#ecf39e] border-[#31572c]" : "bg-slate-50 text-slate-400 border-slate-200"
//                         }`}>
//                           {idx + 1}
//                         </div>
//                         <div>
//                           <span className="font-extrabold text-slate-900 block leading-tight">{stage.label}</span>
//                           <span className="text-[10px] text-slate-450 block mt-0.5">{stage.desc}</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Recovery tracking progress bar */}
//               <div className="space-y-1.5 pt-2 border-t border-slate-100">
//                 <div className="flex justify-between text-[10px] font-bold">
//                   <span>Recovery Progress</span>
//                   <span>{selectedCase.progress}%</span>
//                 </div>
//                 <input
//                   type="range"
//                   min="10"
//                   max="100"
//                   step="10"
//                   value={selectedCase.progress}
//                   onChange={(e) => updateCaseProgress(selectedCase.id, e.target.value)}
//                   className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#31572c]"
//                 />
//               </div>

//               {/* Officer Workloads assignment */}
//               <div className="space-y-2 pt-2 border-t border-slate-100">
//                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Assign Field Officer</label>
//                 <select
//                   value={selectedCase.officer}
//                   onChange={(e) => updateCaseOfficer(selectedCase.id, e.target.value)}
//                   className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 bg-white"
//                 >
//                   <option value="Unassigned">Assign Officer</option>
//                   {officers.map((o, idx) => (
//                     <option key={idx} value={o.name}>
//                       {o.name} ({o.area} • Workload: {o.workload})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Status Update Quick Toggles */}
//               <div className="pt-2 border-t border-slate-100 flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => updateCaseStatus(selectedCase.id, "Open")}
//                   className="flex-1 py-1.5 bg-red-600 hover:bg-red-755 text-white rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
//                 >
//                   Reopen
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => updateCaseStatus(selectedCase.id, "Resolved")}
//                   className="flex-1 py-1.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
//                 >
//                   Mark Resolved
//                 </button>
//               </div>

//             </div>
//           ) : (
//             <div className="text-center py-12 text-slate-400 font-bold">
//               Select a case in the priority queue ledger to view full diagnostic file folders, checklists, and assign response field officers.
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// PAGE 4 — Farmer Case Management
// File Path: d:/HARIOM/Documents/AventIQ/agro-analytics/frontend/src/pages/disease-detection/fpo/FarmerCaseManagement.jsx

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import seededData from "../../../seed-json/seededData.json";
import StatsCard from "../../../components/partials/StatsCard";
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  Clock,
  X,
  User,
  ChevronRight,
  Calendar,
  Check,
  Play,
  RefreshCw,
  Eye,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  Upload,
  SprayCan,
  Leaf,
  Microscope,
  Activity,
  Droplet,
} from "lucide-react";

export default function FarmerCaseManagement() {
  const [dataState, setDataState] = useState(() => {
    const saved = localStorage.getItem("fpoDiseaseDetectionState");
    const seededCases = seededData.fpoDiseaseDetection?.cases || [];
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Overwrite or sync local storage if seeded cases count increases
        if (parsed && Array.isArray(parsed.cases) && parsed.cases.length >= seededCases.length) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse FPO state", e);
      }
    }
    
    // Fallback: Initialize with seeded data or default cases
    const initialData = seededData.fpoDiseaseDetection || {
      cases: [],
      officers: [],
    };
    
    // Save to local storage for persistent Casework
    localStorage.setItem("fpoDiseaseDetectionState", JSON.stringify(initialData));
    return initialData;
  });

  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeQueueTab, setActiveQueueTab] = useState("All");

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("fpoDiseaseDetectionState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.cases)) {
            setDataState(parsed);
          }
        } catch (e) {
          console.error("Failed to parse FPO state from storage event", e);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const cases = dataState.cases || [];
  const officers = dataState.officers || [];

  const updateFpoState = (updatedState) => {
    localStorage.setItem(
      "fpoDiseaseDetectionState",
      JSON.stringify(updatedState),
    );
    window.dispatchEvent(new Event("storage"));
    setDataState(updatedState);
  };

  // Overview Cards calculations
  const overviewCards = [
    {
      label: "Open Cases",
      value: cases.filter((c) => c.status !== "Resolved").length,
      icon: Clock,
    },
    {
      label: "Critical Cases",
      value: cases.filter(
        (c) => c.severity === "Critical" && c.status !== "Resolved",
      ).length,
      icon: AlertTriangle,
    },
    {
      label: "Pending Reviews",
      value: cases.filter(
        (c) => c.officer === "Unassigned" && c.status !== "Resolved",
      ).length,
      icon: User,
    },
    {
      label: "Resolved Cases",
      value: cases.filter((c) => c.status === "Resolved").length,
      icon: ShieldCheck,
    },
  ];

  // Queue lists helper
  const getFilteredQueueCases = () => {
    return cases.filter((c) => {
      if (activeQueueTab === "All") return true;
      if (activeQueueTab === "Critical")
        return c.severity === "Critical" && c.status !== "Resolved";
      if (activeQueueTab === "High Priority")
        return c.severity === "High" && c.status !== "Resolved";
      if (activeQueueTab === "Medium")
        return c.severity === "Moderate" && c.status !== "Resolved";
      if (activeQueueTab === "Resolved") return c.status === "Resolved";
      return true;
    });
  };

  // Stepper representation for treatments
  const getStepperStages = (progress) => {
    const stages = [
      {
        label: "Diagnostic Scan Complete",
        desc: "Leaf lesions uploaded & checked",
        icon: Microscope,
        step: 1,
      },
      {
        label: "Officer Appointed",
        desc: "Field technician dispatched to farm",
        icon: User,
        step: 2,
      },
      {
        label: "Chemical Spray Deployed",
        desc: "Recommended fungicidal splits completed",
        icon: SprayCan,
        step: 3,
      },
      {
        label: "Resolution Verified",
        desc: "Follow-up biomass checks completed",
        icon: CheckCircle,
        step: 4,
      },
    ];

    return stages.map((stage, idx) => ({
      ...stage,
      isCompleted: progress >= (idx + 1) * 25,
      isActive: progress >= idx * 25 && progress < (idx + 1) * 25,
    }));
  };

  // Modal Handler functions
  const openModal = (caseItem) => {
    setSelectedCase(caseItem);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
    document.body.style.overflow = "auto";
  };

  const updateCaseOfficer = (caseId, officerName) => {
    const nextCases = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            officer: officerName,
            status: "In Progress",
            updated: "Just now",
          }
        : c,
    );
    updateFpoState({ ...dataState, cases: nextCases });
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase((prev) => ({
        ...prev,
        officer: officerName,
        status: "In Progress",
      }));
    }
  };

  const updateCaseProgress = (caseId, val) => {
    const isResolved = Number(val) === 100;
    const nextCases = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            progress: Number(val),
            status: isResolved ? "Resolved" : "In Progress",
            updated: "Just now",
          }
        : c,
    );
    updateFpoState({ ...dataState, cases: nextCases });

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase((prev) => ({
        ...prev,
        progress: Number(val),
        status: isResolved ? "Resolved" : "In Progress",
      }));
    }
  };

  const updateCaseStatus = (caseId, status) => {
    const progressVal =
      status === "Resolved" ? 100 : status === "Open" ? 10 : 50;
    const nextCases = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            status,
            progress: progressVal,
            updated: "Just now",
          }
        : c,
    );
    updateFpoState({ ...dataState, cases: nextCases });

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase((prev) => ({
        ...prev,
        status,
        progress: progressVal,
      }));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "High":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Moderate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-amber-500";
      case "Moderate":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getModalHeaderBorder = (status, severity) => {
    if (status === "Resolved") return "border-t-4 border-emerald-500";
    switch (severity) {
      case "Critical":
        return "border-t-4 border-red-500";
      case "High":
        return "border-t-4 border-amber-500";
      case "Moderate":
        return "border-t-4 border-blue-500";
      default:
        return "border-t-4 border-emerald-500";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',_sans-serif] p-6">
      {/* Title */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-black text-[#132a13] tracking-tight">
          Farmer Case Management
        </h1>
        <p className="text-slate-500 text-xs font-semibold">
          Coordinate leaf scans, assign officer visits, and monitor individual
          farm recovery steps.
        </p>
      </div>
      {/* Overview Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <StatsCard
              key={idx}
              title={card.label}
              value={card.value}
              icon={<Icon className="text-emerald-700" />}
              subtext="Real-time casework"
            />
          );
        })}
      </div>
      {/* Priority Queue Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
        {/* Tabbed filters */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 flex-wrap gap-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#31572c]" /> Priority Queue
          </h3>

          <div className="flex gap-2 flex-wrap">
            {["All", "Critical", "High Priority", "Medium", "Resolved"].map((tab) => {
              const filterSeverity =
                tab === "High Priority"
                  ? "High"
                  : tab === "Medium"
                    ? "Moderate"
                    : tab;
              const count =
                tab === "All"
                  ? cases.length
                  : tab === "Resolved"
                    ? cases.filter((c) => c.status === "Resolved").length
                    : cases.filter(
                        (c) =>
                          c.severity === filterSeverity &&
                          c.status !== "Resolved",
                      ).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveQueueTab(tab)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeQueueTab === tab
                      ? "bg-[#31572c] text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                  <span
                    className={`px-1.5 py-0.25 text-[8px] font-black rounded-full ${
                      activeQueueTab === tab
                        ? "bg-white text-[#31572c]"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="py-2.5">Farmer</th>
                <th className="py-2.5">Village</th>
                <th className="py-2.5">Crop</th>
                <th className="py-2.5">Pathogen</th>
                <th className="py-2.5 text-center">Severity</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-center">Officer</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {getFilteredQueueCases().map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openModal(c)}
                >
                  <td className="py-3.5 text-slate-900">{c.farmer}</td>
                  <td className="py-3.5 text-slate-550">{c.village}</td>
                  <td className="py-3.5 text-slate-550">{c.crop}</td>
                  <td className="py-3.5 text-slate-700">{c.disease}</td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${getSeverityColor(c.severity)}`}
                    >
                      {c.severity}
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black ${getStatusColor(c.status)}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-center text-slate-500">
                    {c.officer}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(c);
                      }}
                      className="px-3 py-1.5 text-[10px] bg-[#31572c] hover:bg-[#132a13] text-white rounded-lg font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-1.5 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && selectedCase && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0A0D14]/70 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] flex flex-col z-10 overflow-hidden animate-scaleIn">
            
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-100 px-8 py-5 shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-[#31572c] to-[#132a13] text-white rounded-xl flex items-center justify-center text-lg font-black uppercase tracking-wider shadow-lg">
                    {selectedCase.farmer
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#132a13]">
                      {selectedCase.farmer}
                    </h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedCase.village} Cluster • {selectedCase.crop}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="px-8 pt-8 pb-24 overflow-y-auto flex-1 space-y-6 scroll-thin">
              {/* Status Badges Row */}
              <div className="flex gap-3 flex-wrap">
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${getSeverityColor(selectedCase.severity)}`}
                >
                  {selectedCase.severity} Severity
                </span>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${getStatusColor(selectedCase.status)}`}
                >
                  {selectedCase.status}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-black uppercase bg-slate-100 text-slate-600">
                  Case #{selectedCase.id}
                </span>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Diagnosis Summary */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#31572c]" />
                      DIAGNOSIS SUMMARY
                    </h3>
                    <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 space-y-3 border border-slate-100">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <span className="text-sm font-semibold text-slate-600">
                          Infection:
                        </span>
                        <span className="text-base font-black text-slate-900">
                          {selectedCase.disease}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600">
                          Severity Index:
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-base font-black ${selectedCase.severity === "Critical" ? "text-red-600" : selectedCase.severity === "High" ? "text-amber-600" : "text-blue-600"}`}
                          >
                            {selectedCase.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Symptom Checklist */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      SYMPTOM CHECKLIST
                    </h3>
                    <div className="space-y-2">
                      {selectedCase.symptoms &&
                      selectedCase.symptoms.length > 0 ? (
                        selectedCase.symptoms.map((sym, idx) => (
                          <div
                            key={idx}
                            className="flex gap-3 items-start p-3 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="h-5 w-5 rounded-full bg-[#31572c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-[#31572c]" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">
                              {sym}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl">
                          No symptoms recorded yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      CONTACT INFORMATION
                    </h3>
                    <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 space-y-3 border border-slate-100">
                      <div className="flex items-center gap-3 text-sm group">
                        <div className="h-8 w-8 rounded-lg bg-[#31572c]/10 flex items-center justify-center group-hover:bg-[#31572c]/20 transition-colors">
                          <Phone className="w-4 h-4 text-[#31572c]" />
                        </div>
                        <span className="text-slate-700 font-semibold">
                          {selectedCase.phone || "+91 98765 43210"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm group">
                        <div className="h-8 w-8 rounded-lg bg-[#31572c]/10 flex items-center justify-center group-hover:bg-[#31572c]/20 transition-colors">
                          <Mail className="w-4 h-4 text-[#31572c]" />
                        </div>
                        <span className="text-slate-700 font-semibold">
                          {selectedCase.email ||
                            `${selectedCase.farmer.toLowerCase().replace(" ", ".")}@farmers.com`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Treatment Timeline */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      TREATMENT TIMELINE
                    </h3>
                    <div className="space-y-0">
                      {getStepperStages(selectedCase.progress).map(
                        (stage, idx) => (
                          <div
                            key={idx}
                            className="flex gap-4 items-start relative pb-6 last:pb-0"
                          >
                            {idx < 3 && (
                              <div
                                className={`absolute left-5 top-10 bottom-0 w-0.5 -ml-px transition-colors duration-500 ${
                                  stage.isCompleted ? "bg-[#31572c]" : "bg-slate-200"
                                }`}
                              />
                            )}
                            <div
                              className={`h-10 w-10 rounded-full border-2 flex items-center justify-center text-sm font-black z-10 shrink-0 transition-all ${
                                stage.isCompleted
                                  ? "bg-[#31572c] text-white border-[#31572c]"
                                  : stage.isActive
                                    ? "bg-amber-100 text-amber-700 border-amber-500 animate-pulse"
                                    : "bg-slate-50 text-slate-400 border-slate-200"
                              }`}
                            >
                              {stage.isCompleted ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                stage.step
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <div
                                  className={`font-extrabold text-base ${stage.isCompleted ? "text-slate-900" : stage.isActive ? "text-amber-700" : "text-slate-500"}`}
                              >
                                {stage.label}
                              </div>
                              <div className="text-sm text-slate-500 mt-1">
                                {stage.desc}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Recovery Progress */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        RECOVERY PROGRESS
                      </h3>
                      <span className="text-2xl font-black text-[#31572c]">
                        {selectedCase.progress}%
                      </span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-slate-100">
                        <div
                          style={{ width: `${selectedCase.progress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#31572c] transition-all duration-500 rounded-full"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={selectedCase.progress}
                        onChange={(e) =>
                          updateCaseProgress(selectedCase.id, e.target.value)
                        }
                        className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer mt-4"
                        style={{ accentColor: "#31572c" }}
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Assign Field Officer */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      ASSIGN FIELD OFFICER
                    </h3>
                    <select
                      value={selectedCase.officer}
                      onChange={(e) =>
                        updateCaseOfficer(selectedCase.id, e.target.value)
                      }
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#31572c] focus:border-transparent cursor-pointer"
                    >
                      <option value="Unassigned">Select Officer</option>
                      {officers.map((o, idx) => (
                        <option key={idx} value={o.name}>
                          {o.name} • {o.area} (Workload: {o.workload})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-50 border-t border-slate-100 px-8 py-4 flex gap-4 justify-end rounded-b-2xl z-20">
              <button
                type="button"
                onClick={() => updateCaseStatus(selectedCase.id, "Open")}
                className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2 border border-red-200"
              >
                <RefreshCw className="w-4 h-4" />
                Reopen Case
              </button>
              <button
                type="button"
                onClick={() =>
                  updateCaseStatus(selectedCase.id, "Resolved")
                }
                className="px-6 py-2.5 bg-[#31572c] hover:bg-[#132a13] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Resolved
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
