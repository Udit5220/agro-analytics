// import React, { useState, useEffect, useRef } from "react";
// import {
//   User,
//   MapPin,
//   Droplet,
//   Sprout,
//   Tractor,
//   PawPrint,
//   IndianRupee,
//   Users,
//   Edit,
//   CheckCircle,
//   AlertCircle,
//   XCircle,
//   TrendingUp,
//   Shield,
//   CreditCard,
//   Upload,
//   X,
//   Target,
//   FileCheck,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import govtSchemeData from "../../../seed-json/govt_scheme.json";
// import { profileApi } from "../../../services/apiService";
// import StatsCard from "../../../components/partials/StatsCard";

// const FarmEligibilityCenter = () => {
//   const { farmerProfile: seedProfile, eligibilityData } = govtSchemeData;
//   const [profile, setProfile] = useState(seedProfile);
//   const [showUploadModal, setShowUploadModal] = useState(null);
//   const [showFixModal, setShowFixModal] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [loadingProfile, setLoadingProfile] = useState(false);
//   const fileInputRef = useRef(null);

//   const {
//     governmentReadinessScore,
//     scoreLabel,
//     scoreBreakdown,
//     eligibilitySummary,
//     missingRequirements: seedMissing,
//     benefitOpportunity,
//   } = eligibilityData;

//   const [requirements, setRequirements] = useState(seedMissing);
//   const [readinessScore, setReadinessScore] = useState(governmentReadinessScore);

//   // Fetch live profile data from MongoDB backend on mount
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         setLoadingProfile(true);
//         const res = await profileApi.getProfile();
//         if (res && res.success && res.data) {
//           const backendData = res.data;
//           const totalLand = backendData.farms ? backendData.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0) : seedProfile.landSize;
//           setProfile({
//             name: backendData.name || seedProfile.name,
//             location: backendData.location || seedProfile.location,
//             landSize: totalLand || seedProfile.landSize,
//             irrigation: seedProfile.irrigation,
//             machinery: seedProfile.machinery,
//             livestock: seedProfile.livestock,
//             annualIncome: seedProfile.annualIncome,
//             category: seedProfile.category,
//             lastUpdated: new Date().toLocaleDateString("en-IN") + " (DB Live)"
//           });
//         }
//       } catch (err) {
//         console.error("Error loading profile from API:", err);
//       } finally {
//         setLoadingProfile(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleUploadSubmit = (e) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       alert("Please choose a file to upload first.");
//       return;
//     }

//     // Simulate upload: update requirement status locally
//     const updatedReqs = requirements.map((r) => {
//       if (r.name === showUploadModal.name) {
//         return { ...r, fixLink: "uploaded", uploadedFileName: selectedFile.name };
//       }
//       return r;
//     });

//     setRequirements(updatedReqs);
//     setReadinessScore(prev => Math.min(prev + 5, 100)); // boost score slightly
//     setShowUploadModal(null);
//     setSelectedFile(null);
//     alert(`Document "${selectedFile.name}" uploaded successfully! Status is now Pending Verification.`);
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const triggerFileSelect = () => {
//     fileInputRef.current?.click();
//   };

//   // Circular progress calculations
//   const radius = 55;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (readinessScore / 100) * circumference;

//   return (
//     <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
//       {/* Branded Header */}
//       <div className="mb-6">
//         <div className="flex items-center gap-3 mb-1">
//           <div className="p-2 bg-[#132a13]/10 rounded-xl">
//             <FileCheck className="h-5 w-5 text-[#4f772d]" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-[#132a13]">Eligibility Assessment Center</h1>
//             <p className="text-xs text-gray-500">Evaluate your eligibility for various central and state agricultural schemes</p>
//           </div>
//         </div>
//       </div>

//       {/* Farmer Profile Summary Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden mb-6">
//         <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f4f7f4]/35">
//           <div>
//             <h3 className="font-bold text-[#132a13] text-sm">
//               Farmer Profile Summary
//             </h3>
//             <p className="text-[10px] text-gray-400 mt-0.5">Last updated: {profile.lastUpdated}</p>
//           </div>
//           <span className="text-[10px] font-bold bg-[#132a13]/10 text-[#132a13] px-2.5 py-1 rounded-full uppercase tracking-wider">
//             {loadingProfile ? "Syncing..." : "Profile Synced"}
//           </span>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <User className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.name}
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <MapPin className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.location}
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <Sprout className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Land Size</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.landSize} acres
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <Droplet className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Irrigation</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.irrigation}
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <Tractor className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Machinery</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.machinery}
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <PawPrint className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Livestock</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.livestock} cattle
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <IndianRupee className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Income</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1">
//                 {profile.annualIncome}
//               </p>
//             </div>
//             <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
//               <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
//                 <Users className="w-4 h-4 text-[#4f772d]" />
//               </div>
//               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</p>
//               <p className="text-xs font-bold text-gray-800 truncate mt-1 font-mono">
//                 {profile.category.join(", ")}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Government Readiness Score & Score Breakdown */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Custom Progress Circular Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 flex flex-col justify-between items-center md:items-start">
//           <h3 className="font-bold text-[#132a13] text-sm mb-3">
//             Readiness Score Index
//           </h3>
//           <div className="flex flex-col sm:flex-row items-center gap-6 py-2 w-full justify-center">
//             <div className="relative flex items-center justify-center h-36 w-36">
//               <svg viewBox="0 0 144 144" className="w-36 h-36 transform -rotate-90">
//                 <defs>
//                   <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                     <stop offset="0%" stopColor="#ecf39e" />
//                     <stop offset="100%" stopColor="#4f772d" />
//                   </linearGradient>
//                 </defs>
//                 <circle
//                   cx="72"
//                   cy="72"
//                   r={radius}
//                   stroke="#f4f7f4"
//                   strokeWidth="8"
//                   fill="transparent"
//                 />
//                 <circle
//                   cx="72"
//                   cy="72"
//                   r={radius}
//                   stroke="url(#readinessGrad)"
//                   strokeWidth="8"
//                   fill="transparent"
//                   strokeDasharray={circumference}
//                   strokeDashoffset={strokeDashoffset}
//                   strokeLinecap="round"
//                   className="transition-all duration-500 drop-shadow-[0_2px_4px_rgba(79,119,45,0.2)]"
//                 />
//               </svg>
//               <div className="absolute flex flex-col items-center justify-center">
//                 <span className="text-3xl font-black text-[#132a13] tracking-tight">{readinessScore}%</span>
//                 <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Readiness</span>
//               </div>
//             </div>
//             <div className="text-center sm:text-left space-y-1">
//               <p className="text-base font-black text-gray-850">{scoreLabel}</p>
//               <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-semibold">
//                 Your profile ranks in the upper tier for direct benefit eligibility. Upload missing files to reach 100%.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Score Breakdown Bar Chart */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-5">
//           <h3 className="font-bold text-[#132a13] text-sm mb-3">Score Breakdown</h3>
//           <div className="h-60">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={scoreBreakdown}
//                 layout="vertical"
//                 margin={{ left: 20, right: 20 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
//                 <XAxis
//                   type="number"
//                   domain={[0, 100]}
//                   tickFormatter={(value) => `${value}%`}
//                   tick={{ fontSize: 10 }}
//                 />
//                 <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} />
//                 <Tooltip formatter={(value) => `${value}%`} />
//                 <Bar dataKey="score" fill="#31572c" radius={[0, 4, 4, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* 3 Stats Cards Eligibility Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <StatsCard
//           title="Eligible Schemes"
//           value={eligibilitySummary.eligible.count}
//           trend={`Potential: ${eligibilitySummary.eligible.potential}`}
//           trendType="success"
//           subtext="Ready to apply immediately"
//           icon={<CheckCircle className="text-emerald-600" />}
//         />
//         <StatsCard
//           title="Partially Eligible"
//           value={eligibilitySummary.partiallyEligible.count}
//           trend={`Potential: ${eligibilitySummary.partiallyEligible.potential}`}
//           trendType="warning"
//           subtext={eligibilitySummary.partiallyEligible.blocking}
//           icon={<AlertCircle className="text-amber-500" />}
//         />
//         <StatsCard
//           title="Not Eligible"
//           value={eligibilitySummary.notEligible.count}
//           trend={`Excludes ${eligibilitySummary.notEligible.reasons.length} criteria`}
//           trendType="danger"
//           subtext="Criteria like Gender/FPO required"
//           icon={<XCircle className="text-red-500" />}
//         />
//       </div>

//       {/* Missing Requirements Panel */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden mb-6">
//         <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
//           <h3 className="font-bold text-[#132a13] text-sm">Actionable Missing Requirements</h3>
//           <p className="text-[10px] text-gray-400 mt-0.5">
//             Complete verification steps to unlock restricted schemes and credit limits
//           </p>
//         </div>
//         <div className="divide-y divide-gray-100">
//           {requirements.map((req, idx) => (
//             <div
//               key={idx}
//               className="px-6 py-4 flex justify-between items-center hover:bg-gray-50/20"
//             >
//               <div>
//                 <p className="text-xs font-bold text-gray-850">{req.name}</p>
//                 <p className="text-[10px] font-semibold text-gray-450 mt-0.5">
//                   Unlocks {req.affects} government programs
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 {req.fixLink === "uploaded" ? (
//                   <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
//                     <CheckCircle className="w-3.5 h-3.5" />
//                     Uploaded ({req.uploadedFileName})
//                   </span>
//                 ) : (
//                   <button
//                     onClick={() => {
//                       if (req.fixLink === "how-to-fix") {
//                         setShowFixModal(req);
//                       } else {
//                         setShowUploadModal(req);
//                       }
//                     }}
//                     className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#4f772d]/20 bg-[#4f772d]/5 text-[#4f772d] hover:bg-[#4f772d]/10 transition"
//                   >
//                     <Upload className="w-3.5 h-3.5" />
//                     {req.fixLink === "how-to-fix"
//                       ? "How to fix"
//                       : req.fixLink === "learn-more"
//                         ? "Learn more"
//                         : "Upload now"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Benefit Opportunity Calculator */}
//       <div
//         className="rounded-2xl p-6 text-white shadow-sm"
//         style={{ background: "linear-gradient(135deg, #132a13, #31572c)" }}
//       >
//         <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">
//           Scheme Benefit Opportunity Calculator
//         </h3>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
//             <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1">
//               Est. Yearly Max
//             </p>
//             <p className="text-lg font-black text-white">
//               {benefitOpportunity.estimatedYearly}
//             </p>
//           </div>
//           <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
//             <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1">Active Claims</p>
//             <p className="text-lg font-black text-white">
//               {benefitOpportunity.currentlyAccessing}
//             </p>
//           </div>
//           <div className="bg-[#90a955] rounded-xl p-3.5 text-center shadow-inner">
//             <p className="text-[10px] text-white font-bold uppercase tracking-wider mb-1">Opportunity Gap</p>
//             <p className="text-lg font-black text-white">
//               {benefitOpportunity.opportunityGap}
//             </p>
//           </div>
//           <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
//             <div className="flex items-center justify-center gap-1 mb-1">
//               <Shield className="w-3 h-3 text-white" />
//               <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Insurance</p>
//             </div>
//             <p className="text-lg font-black text-white">
//               {benefitOpportunity.insuranceCoverage}
//             </p>
//           </div>
//           <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
//             <div className="flex items-center justify-center gap-1 mb-1">
//               <CreditCard className="w-3 h-3 text-white" />
//               <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">KCC Credit</p>
//             </div>
//             <p className="text-lg font-black text-white">
//               {benefitOpportunity.kccLoanAvailable}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Upload Document Modal */}
//       {showUploadModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
//           <div className="relative w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 border border-gray-100 shadow-xl animate-scaleUp">
//             <button
//               onClick={() => { setShowUploadModal(null); setSelectedFile(null); }}
//               className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h3 className="text-lg font-bold text-[#132a13] mb-1">
//               Upload Document
//             </h3>
//             <p className="text-xs text-gray-500 mb-4 font-bold">
//               Uploading file for: {showUploadModal.name}
//             </p>

//             <form onSubmit={handleUploadSubmit} className="space-y-4">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileChange}
//               />
//               <div
//                 onClick={triggerFileSelect}
//                 className="border-2 border-dashed border-gray-250 hover:border-[#4f772d] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-gray-50/50"
//               >
//                 <Upload className="w-8 h-8 text-[#4f772d] mx-auto mb-2 animate-pulse" />
//                 <p className="text-xs font-bold text-gray-700">
//                   {selectedFile ? `Selected: ${selectedFile.name}` : "Choose PDF, JPG or PNG file"}
//                 </p>
//                 <p className="text-[10px] text-gray-400 mt-1">
//                   {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Click to select from computer"}
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => { setShowUploadModal(null); setSelectedFile(null); }}
//                   className="flex-1 px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-650 hover:bg-gray-50 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!selectedFile}
//                   className={`flex-1 px-4 py-2 text-xs font-semibold rounded-xl transition ${
//                     selectedFile
//                       ? "bg-[#4f772d] hover:bg-[#31572c] text-white"
//                       : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150"
//                   }`}
//                 >
//                   Upload File
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* How to Fix Help Modal */}
//       {showFixModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4 animate-fadeIn">
//           <div className="relative w-full max-w-2xl my-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 border border-gray-100 shadow-xl animate-scaleUp">
//             <button
//               onClick={() => setShowFixModal(null)}
//               className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <h3 className="text-lg font-bold text-[#132a13] mb-1">
//               Resolving Missing Requirement
//             </h3>
//             <p className="text-xs text-gray-500 mb-4 bg-[#f4f7f4] px-3 py-1 rounded-lg border border-gray-100">
//               Item: <span className="font-bold text-[#132a13]">{showFixModal.name}</span>
//             </p>

//             <div className="space-y-4 text-xs text-gray-650 leading-relaxed">
//               <p>
//                 To resolve <span className="font-bold">{showFixModal.name}</span> and unlock eligibility for <span className="font-bold text-[#4f772d]">{showFixModal.affects} schemes</span>, please follow these steps:
//               </p>
//               <div className="p-4 bg-gray-50 rounded-xl space-y-2 font-medium">
//                 <p>1. {showFixModal.fixAction}</p>
//                 <p>2. Keep the certificate reference number handy.</p>
//                 <p>3. Upload the certified copy to the Document Vault once generated.</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowFixModal(null)}
//               className="w-full mt-5 px-4 py-2.5 bg-[#132a13] text-white rounded-xl text-xs font-semibold hover:bg-[#31572c] transition"
//             >
//               Understand
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FarmEligibilityCenter;

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  MapPin,
  Droplet,
  Sprout,
  Tractor,
  PawPrint,
  IndianRupee,
  Users,
  Edit,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Shield,
  CreditCard,
  Upload,
  X,
  Target,
  FileCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import govtSchemeData from "../../../seed-json/govt_scheme.json";
import { profileApi } from "../../../services/apiService";
import StatsCard from "../../../components/partials/StatsCard";
import { createPortal } from "react-dom";

const FarmEligibilityCenter = () => {
  const { farmerProfile: seedProfile, eligibilityData } = govtSchemeData;
  const [profile, setProfile] = useState(seedProfile);
  const [showUploadModal, setShowUploadModal] = useState(null);
  const [showFixModal, setShowFixModal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const fileInputRef = useRef(null);

  const {
    governmentReadinessScore,
    scoreLabel,
    scoreBreakdown,
    eligibilitySummary,
    missingRequirements: seedMissing,
    benefitOpportunity,
  } = eligibilityData;

  const [requirements, setRequirements] = useState(seedMissing);
  const [readinessScore, setReadinessScore] = useState(
    governmentReadinessScore,
  );

  // Fetch live profile data from MongoDB backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await profileApi.getProfile();
        if (res && res.success && res.data) {
          const backendData = res.data;
          const totalLand = backendData.farms
            ? backendData.farms.reduce(
                (sum, f) => sum + (Number(f.totalLand) || 0),
                0,
              )
            : seedProfile.landSize;
          setProfile({
            name: backendData.name || seedProfile.name,
            location: backendData.location || seedProfile.location,
            landSize: totalLand || seedProfile.landSize,
            irrigation: seedProfile.irrigation,
            machinery: seedProfile.machinery,
            livestock: seedProfile.livestock,
            annualIncome: seedProfile.annualIncome,
            category: seedProfile.category,
            lastUpdated: new Date().toLocaleDateString("en-IN") + " (DB Live)",
          });
        }
      } catch (err) {
        console.error("Error loading profile from API:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please choose a file to upload first.");
      return;
    }

    // Simulate upload: update requirement status locally
    const updatedReqs = requirements.map((r) => {
      if (r.name === showUploadModal.name) {
        return {
          ...r,
          fixLink: "uploaded",
          uploadedFileName: selectedFile.name,
        };
      }
      return r;
    });

    setRequirements(updatedReqs);
    setReadinessScore((prev) => Math.min(prev + 5, 100)); // boost score slightly
    setShowUploadModal(null);
    setSelectedFile(null);
    alert(
      `Document "${selectedFile.name}" uploaded successfully! Status is now Pending Verification.`,
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Circular progress calculations
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (readinessScore / 100) * circumference;

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <FileCheck className="h-5 w-5 text-[#4f772d]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">
              Eligibility Assessment Center
            </h1>
            <p className="text-xs text-gray-500">
              Evaluate your eligibility for various central and state
              agricultural schemes
            </p>
          </div>
        </div>
      </div>

      {/* Farmer Profile Summary Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#f4f7f4]/35">
          <div>
            <h3 className="font-bold text-[#132a13] text-sm">
              Farmer Profile Summary
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Last updated: {profile.lastUpdated}
            </p>
          </div>
          <span className="text-[10px] font-bold bg-[#132a13]/10 text-[#132a13] px-2.5 py-1 rounded-full uppercase tracking-wider">
            {loadingProfile ? "Syncing..." : "Profile Synced"}
          </span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <User className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Name
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.name}
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Location
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.location}
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <Sprout className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Land Size
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.landSize} acres
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <Droplet className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Irrigation
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.irrigation}
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <Tractor className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Machinery
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.machinery}
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <PawPrint className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Livestock
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.livestock} cattle
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <IndianRupee className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Income
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1">
                {profile.annualIncome}
              </p>
            </div>
            <div className="text-center p-2 rounded-xl hover:bg-gray-50/50 transition">
              <div className="w-9 h-9 rounded-full bg-[#132a13]/5 flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-[#4f772d]" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Category
              </p>
              <p className="text-xs font-bold text-gray-800 truncate mt-1 font-mono">
                {profile.category.join(", ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Government Readiness Score & Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Custom Progress Circular Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 flex flex-col justify-between items-center md:items-start">
          <h3 className="font-bold text-[#132a13] text-sm mb-3">
            Readiness Score Index
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2 w-full justify-center">
            <div className="relative flex items-center justify-center h-36 w-36">
              <svg
                viewBox="0 0 144 144"
                className="w-36 h-36 transform -rotate-90"
              >
                <defs>
                  <linearGradient
                    id="readinessGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ecf39e" />
                    <stop offset="100%" stopColor="#4f772d" />
                  </linearGradient>
                </defs>
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="#f4f7f4"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="url(#readinessGrad)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 drop-shadow-[0_2px_4px_rgba(79,119,45,0.2)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#132a13] tracking-tight">
                  {readinessScore}%
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                  Readiness
                </span>
              </div>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <p className="text-base font-black text-gray-850">{scoreLabel}</p>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed font-semibold">
                Your profile ranks in the upper tier for direct benefit
                eligibility. Upload missing files to reach 100%.
              </p>
            </div>
          </div>
        </div>

        {/* Score Breakdown Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-5">
          <h3 className="font-bold text-[#132a13] text-sm mb-3">
            Score Breakdown
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreBreakdown}
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f1" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: "bold" }}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="score" fill="#31572c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3 Stats Cards Eligibility Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Eligible Schemes"
          value={eligibilitySummary.eligible.count}
          trend={`Potential: ${eligibilitySummary.eligible.potential}`}
          trendType="success"
          subtext="Ready to apply immediately"
          icon={<CheckCircle className="text-emerald-600" />}
        />
        <StatsCard
          title="Partially Eligible"
          value={eligibilitySummary.partiallyEligible.count}
          trend={`Potential: ${eligibilitySummary.partiallyEligible.potential}`}
          trendType="warning"
          subtext={eligibilitySummary.partiallyEligible.blocking}
          icon={<AlertCircle className="text-amber-500" />}
        />
        <StatsCard
          title="Not Eligible"
          value={eligibilitySummary.notEligible.count}
          trend={`Excludes ${eligibilitySummary.notEligible.reasons.length} criteria`}
          trendType="danger"
          subtext="Criteria like Gender/FPO required"
          icon={<XCircle className="text-red-500" />}
        />
      </div>

      {/* Missing Requirements Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
          <h3 className="font-bold text-[#132a13] text-sm">
            Actionable Missing Requirements
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Complete verification steps to unlock restricted schemes and credit
            limits
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className="px-6 py-4 flex justify-between items-center hover:bg-gray-50/20"
            >
              <div>
                <p className="text-xs font-bold text-gray-850">{req.name}</p>
                <p className="text-[10px] font-semibold text-gray-450 mt-0.5">
                  Unlocks {req.affects} government programs
                </p>
              </div>
              <div className="flex items-center gap-2">
                {req.fixLink === "uploaded" ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Uploaded ({req.uploadedFileName})
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (req.fixLink === "how-to-fix") {
                        setShowFixModal(req);
                      } else {
                        setShowUploadModal(req);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#4f772d]/20 bg-[#4f772d]/5 text-[#4f772d] hover:bg-[#4f772d]/10 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {req.fixLink === "how-to-fix"
                      ? "How to fix"
                      : req.fixLink === "learn-more"
                        ? "Learn more"
                        : "Upload now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefit Opportunity Calculator */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #132a13, #31572c)" }}
      >
        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">
          Scheme Benefit Opportunity Calculator
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1">
              Est. Yearly Max
            </p>
            <p className="text-lg font-black text-white">
              {benefitOpportunity.estimatedYearly}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
            <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider mb-1">
              Active Claims
            </p>
            <p className="text-lg font-black text-white">
              {benefitOpportunity.currentlyAccessing}
            </p>
          </div>
          <div className="bg-[#90a955] rounded-xl p-3.5 text-center shadow-inner">
            <p className="text-[10px] text-white font-bold uppercase tracking-wider mb-1">
              Opportunity Gap
            </p>
            <p className="text-lg font-black text-white">
              {benefitOpportunity.opportunityGap}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-white" />
              <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                Insurance
              </p>
            </div>
            <p className="text-lg font-black text-white">
              {benefitOpportunity.insuranceCoverage}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 text-center border border-white/5">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CreditCard className="w-3 h-3 text-white" />
              <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                KCC Credit
              </p>
            </div>
            <p className="text-lg font-black text-white">
              {benefitOpportunity.kccLoanAvailable}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto animate-fadeIn">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 border border-gray-100 shadow-xl animate-scaleUp">
                <button
                  onClick={() => {
                    setShowUploadModal(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-[#132a13] mb-1">
                  Upload Document
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">
                  Uploading file for: {showUploadModal.name}
                </p>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={triggerFileSelect}
                    className="border-2 border-dashed border-gray-250 hover:border-[#4f772d] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-gray-50/50"
                  >
                    <Upload className="w-8 h-8 text-[#4f772d] mx-auto mb-2 animate-pulse" />
                    <p className="text-xs font-bold text-gray-700">
                      {selectedFile
                        ? `Selected: ${selectedFile.name}`
                        : "Choose PDF, JPG or PNG file"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                        : "Click to select from computer"}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(null);
                        setSelectedFile(null);
                      }}
                      className="flex-1 px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-650 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedFile}
                      className={`flex-1 px-4 py-2 text-xs font-semibold rounded-xl transition ${
                        selectedFile
                          ? "bg-[#4f772d] hover:bg-[#31572c] text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150"
                      }`}
                    >
                      Upload File
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* How to Fix Help Modal */}
      {showFixModal && (
        <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 animate-fadeIn flex">
          <div className="relative w-full max-w-2xl my-auto mx-auto max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 border border-gray-100 shadow-xl animate-scaleUp">
            <button
              onClick={() => setShowFixModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-[#132a13] mb-1">
              Resolving Missing Requirement
            </h3>
            <p className="text-xs text-gray-500 mb-4 bg-[#f4f7f4] px-3 py-1 rounded-lg border border-gray-100">
              Item:{" "}
              <span className="font-bold text-[#132a13]">
                {showFixModal.name}
              </span>
            </p>

            <div className="space-y-4 text-xs text-gray-650 leading-relaxed">
              <p>
                To resolve{" "}
                <span className="font-bold">{showFixModal.name}</span> and
                unlock eligibility for{" "}
                <span className="font-bold text-[#4f772d]">
                  {showFixModal.affects} schemes
                </span>
                , please follow these steps:
              </p>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 font-medium">
                <p>1. {showFixModal.fixAction}</p>
                <p>2. Keep the certificate reference number handy.</p>
                <p>
                  3. Upload the certified copy to the Document Vault once
                  generated.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFixModal(null)}
              className="w-full mt-5 px-4 py-2.5 bg-[#132a13] text-white rounded-xl text-xs font-semibold hover:bg-[#31572c] transition"
            >
              Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmEligibilityCenter;
