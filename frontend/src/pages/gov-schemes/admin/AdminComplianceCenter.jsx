import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  X,
  FileText,
  Calendar,
  DollarSign,
  Download,
  Send,
  RefreshCw,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Sparkles,
  Info,
  Check,
  ShieldCheck,
  Building,
  UserCheck,
  Users,
} from "lucide-react";
import { getAnalyticsData, saveAnalyticsData, fetchAnalyticsData, syncAnalyticsData } from "./govSchemesHelper";

/*
// --- OLD COMPLIANCE CENTER COMPONENT COMMENTED OUT ---
export default function AdminComplianceCenter() {
  const [activeTab, setActiveTab] = useState("report");
  const [selectedFiling, setSelectedFiling] = useState(null);
  
  return (
    <div>Old Compliance Center Code</div>
  );
}
*/

// --- NEW REDESIGNED ELIGIBILITY & READINESS CENTER COMPONENT ---

export default function AdminComplianceCenter() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchAnalyticsData().then(data => setAnalytics(data)).catch(console.error);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Sync MSME Registration locally to show dynamic update behavior
  const handleFixUdyam = () => {
    const updated = { ...analytics };
    // Clear Udyam blocker from schemes
    updated.schemes.forEach((s) => {
      s.missingRequirements = [];
    });
    // Set udyam value
    updated.companyProfile.udyam = "UDYAM-HR-12-0004567";
    updated.profileStrength = 95;
    syncAnalyticsData(updated).then(data => setAnalytics(data));
    showToast("Udyam MSME Registration linked! Profile matching score refreshed.");
  };

  // Matrix calculation based on localStorage profile details
  const companySchemes = analytics.schemes.filter(s => !s.isFarmerScheme);
  const readinessMatrix = companySchemes.map((s) => {
    const isUdyamMissing = s.id === "adm-04" && !analytics.companyProfile.udyam;
    const missing = isUdyamMissing ? ["Udyam Registration Missing"] : [];
    const metCount = 4 - missing.length;
    const readinessPct = Math.round((metCount / 4) * 100);
    return {
      id: s.id,
      name: s.name,
      matchScore: s.matchScore,
      requirements: isUdyamMissing ? "GST, PAN, DPIIT (MSME Missing)" : "GST, PAN, DPIIT, MSME",
      status: missing.length === 0 ? "Ready" : "Action Needed",
      readiness: readinessPct,
      missing
    };
  });

  // Overall Readiness Score
  const totalReadinessSum = readinessMatrix.reduce((sum, r) => sum + r.readiness, 0);
  const overallReadiness = Math.round(totalReadinessSum / readinessMatrix.length);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Eligibility Readiness Diagnostics
          </span>
          <h1 className="text-2xl font-black tracking-tight">Eligibility & Readiness Center</h1>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Audit compliance checklists, identify missing corporate records, and evaluate eligibility match factors before visiting government registration portals.
          </p>
        </div>
      </div>

      {/* Readiness Score & Missing Requirements Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Readiness Score Gauge */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest">Overall Readiness</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-brand-medium"
                strokeDasharray={`${overallReadiness}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-brand-darkest">{overallReadiness}%</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase block tracking-wider">Readiness Index</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
            Measures company compliance completeness against match criteria guidelines.
          </p>
        </div>

        {/* Missing Requirements Dashboard */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm md:col-span-2 space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> Missing Requirements Dashboard
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Udyam Registration Check */}
            <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs font-semibold">
              <div>
                <p className="font-bold text-brand-darkest">Udyam Registration</p>
                <p className="text-[10px] text-gray-400">Required for MSME programs</p>
              </div>
              {analytics.companyProfile.udyam ? (
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[9px] font-black uppercase">Synced</span>
              ) : (
                <button 
                  onClick={handleFixUdyam}
                  className="text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded text-[9px] font-black uppercase transition"
                >
                  Link Now
                </button>
              )}
            </div>

            {/* GST Check */}
            <div className="p-3.5 rounded-xl border border-gray-150 bg-gray-50/50 flex items-center justify-between text-xs font-semibold">
              <div>
                <p className="font-bold text-brand-darkest">GST Certificate</p>
                <p className="text-[10px] text-gray-400">Tax compliance verification</p>
              </div>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[9px] font-black uppercase">Active</span>
            </div>

            {/* DPIIT Check */}
            <div className="p-3.5 rounded-xl border border-gray-150 bg-gray-50/50 flex items-center justify-between text-xs font-semibold">
              <div>
                <p className="font-bold text-brand-darkest">DPIIT Startup India Link</p>
                <p className="text-[10px] text-gray-400">Incubator / Tax benefits pre-req</p>
              </div>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[9px] font-black uppercase">Linked</span>
            </div>

            {/* Audited statements Check */}
            <div className="p-3.5 rounded-xl border border-gray-150 bg-gray-50/50 flex items-center justify-between text-xs font-semibold">
              <div>
                <p className="font-bold text-brand-darkest">Financial Audit Statements</p>
                <p className="text-[10px] text-gray-400">FY 2024-25 CA Signed files</p>
              </div>
              <button 
                onClick={() => navigate("/module/gov-schemes/admin/profile")}
                className="text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded text-[9px] font-black uppercase transition"
              >
                Incomplete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Readiness Matrix */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-medium" /> Scheme Readiness Matrix
          </h3>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-150 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Scheme Name</th>
                <th className="p-4 text-center">Match Score</th>
                <th className="p-4">Missing Requirements</th>
                <th className="p-4 text-center">Readiness Level</th>
                <th className="p-4 text-right">Recommended Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              {readinessMatrix.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/30">
                  <td className="p-4 font-black text-brand-darkest uppercase">{r.name}</td>
                  <td className="p-4 text-center font-black text-brand-medium">{r.matchScore}%</td>
                  <td className="p-4 text-gray-500">
                    {r.missing.length > 0 ? (
                      <span className="text-red-600 font-bold">{r.missing.join(", ")}</span>
                    ) : (
                      <span className="text-emerald-600 font-bold">None</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        r.status === "Ready" ? "bg-emerald-50 text-emerald-800 border border-emerald-150" : "bg-amber-50 text-amber-800 border border-amber-150"
                      }`}>
                        {r.status === "Ready" ? "Estimated Match" : "Readiness Level"}
                      </span>
                      <span className="text-[10px] text-gray-400">{r.readiness}% Ready</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {r.missing.length > 0 ? (
                      <button
                        onClick={handleFixUdyam}
                        className="text-[10px] font-black bg-brand-darkest hover:bg-brand-dark text-white px-3 py-1.5 rounded-xl transition uppercase tracking-wider"
                      >
                        Link Udyam
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/module/gov-schemes/admin/detail/${r.id}`)}
                        className="text-[10px] font-black border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-xl transition uppercase tracking-wider"
                      >
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Network Readiness Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5 border-b border-gray-100 pb-2">
          <Users className="w-4 h-4 text-brand-medium" /> Network Readiness & Potential Fit
        </h3>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Aggregated diagnostic matches for farmers and FPOs in your cooperative network. All counts represent potential fit criteria before government portal verification.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-gray-150 bg-gray-50/50 space-y-1">
            <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">Estimated Farmer Match Count</span>
            <span className="text-lg font-black text-brand-darkest">{analytics.outreach.farmersReached.toLocaleString()} Farmers</span>
            <span className="text-[9px] text-brand-medium font-bold block">Likely Eligibility</span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-150 bg-gray-50/50 space-y-1">
            <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">Estimated FPO Match Count</span>
            <span className="text-lg font-black text-brand-darkest">{analytics.companyProfile.fpoPartnerships}</span>
            <span className="text-[9px] text-brand-medium font-bold block">Potential Fit</span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-150 bg-gray-50/50 space-y-1">
            <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">Most Relevant Schemes</span>
            <span className="text-xs font-black text-brand-darkest block truncate">PM-KISAN, PMFBY</span>
            <span className="text-[9px] text-gray-500 font-bold block">Network-wide matches</span>
          </div>
        </div>
      </div>

      {/* Compliance Readiness Checklist & Profile Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compliance Readiness Checklist */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-medium" /> Compliance Readiness Checklist
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/40">
              <span className="font-bold text-brand-darkest">Business Identity (CIN, GSTIN, PAN)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verified</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/40">
              <span className="font-bold text-brand-darkest">Financial Records (Turnover levels)</span>
              <span className="text-amber-600 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Action Required</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/40">
              <span className="font-bold text-brand-darkest">Certifications (ISO Quality guidelines)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verified</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/40">
              <span className="font-bold text-brand-darkest">Operational Data (Farmer operations coverage)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verified</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-gray-50/40">
              <span className="font-bold text-brand-darkest">Legal Documentation (Incorporation files)</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verified</span>
            </div>
          </div>
        </div>

        {/* Profile Completion Recommendations */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-medium" /> AI Profile Completion Recommendations
          </h3>

          <div className="space-y-3.5 text-xs font-semibold leading-relaxed">
            {!analytics.companyProfile.udyam && (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-amber-900 space-y-1">
                <span className="font-black block uppercase text-[9px] text-amber-800">Critical Eligibility Recommendation:</span>
                Link Udyam MSME ID credentials inside matching setup to unlock <span className="font-bold text-brand-darkest">SIDBI Venture Capital Fund eligibility</span>, adding potential benefits of up to ₹80,00,000.
              </div>
            )}
            <div className="bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl text-gray-700 space-y-1">
              <span className="font-black block uppercase text-[9px] text-brand-medium">Documentation Update:</span>
              Upload audited CA financial turnover statements for FY 2024-25. This fulfills pre-requisite compliance requirements for cold chain export subsidies.
            </div>
            <div className="bg-[#f8faf8] border border-gray-100 p-3.5 rounded-xl text-gray-700 space-y-1">
              <span className="font-black block uppercase text-[9px] text-brand-medium">States Focus Target:</span>
              Toggle state preferences for Punjab and Haryana under Operational Profile to filter local interest subventions.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
