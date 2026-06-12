import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  Download,
  Upload,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Building,
  Info,
  DollarSign,
  Link as LinkIcon,
  Check,
  Sparkles,
  ExternalLink,
} from "lucide-react";

/*
// --- OLD UNUSED CODE COMMENTED OUT ---
export default function AdminSchemeDetail() {
  const navigate = useNavigate();
  const { "*": rawSubPath } = useParams();
  
  // Extract scheme ID from subPath if available, else default to 'adm-01'
  const schemeId = rawSubPath ? rawSubPath.split("/").pop() : "adm-01";

  // State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [activeTab, setActiveTab] = useState("eligibility");
  const [isMsmeRegistered, setIsMsmeRegistered] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    pan: true,
    gst: true,
    msme: false,
    audit: false,
  });
  const [timeLeft, setTimeLeft] = useState({ days: 8, hours: 14, mins: 45, secs: 20 });

  // Countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, secs: 59, mins: prev.mins - 1 };
        if (prev.hours > 0) return { ...prev, secs: 59, mins: 59, hours: prev.hours - 1 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Details data based on ID
  const schemeData = {
    "adm-01": {
      name: "RKVY-RAFTAAR Agritech Incubator Support",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      type: "Central Government",
      benefitType: "Grant",
      maxBenefit: "₹25,00,000 Direct Seed Funding",
      sector: "Agritech Startups / FPO Aggregators",
      deadline: "2026-06-18",
      matchScore: 92,
      description: "Direct grant-in-aid support for agritech startups demonstrating proof of concept, high scaling capability, and viable post-harvest models.",
      tranches: [
        { phase: "Tranche 1", percentage: "40%", description: "On initial verification and validation of MVP and business incubation plan execution" },
        { phase: "Tranche 2", percentage: "40%", description: "Upon validation of field testing milestones and FPO alignment numbers" },
        { phase: "Tranche 3", percentage: "20%", description: "On final submission of utilization certificate (UC) and audited financial logs" }
      ],
      eligibilityRules: [
        { name: "Business Legal Entity Type", required: "Private Limited, LLP or Registered Coop", current: "Private Limited Company", status: true },
        { name: "DPIIT Recognition Status", required: "DPIIT Registered Startup", current: "DPIIT-78923 Active", status: true },
        { name: "Minimum Operational Age", required: "At least 12 Months", current: "18 Months Active", status: true },
        { name: "Udyam MSME Registration", required: "Required Active MSME", current: isMsmeRegistered ? "Active (Udyam-HR-003)" : "Not Detected / Missing", status: isMsmeRegistered, updateTrigger: "MSME registration missing — register or sync here" }
      ],
      documents: [
        { key: "pan", name: "Incorporation & Corporate PAN Document", source: "Auto-filled from profile", required: true },
        { key: "gst", name: "GSTIN Returns (GSTR-1 & 3B logs last 12m)", source: "Auto-filled from profile", required: true },
        { key: "msme", name: "Udyam Registration Certificate", source: isMsmeRegistered ? "Auto-synced just now" : "User Upload Required", required: true },
        { key: "audit", name: "Audited Accounts & IT Returns (FY 2024-25)", source: "User Upload Required", required: true }
      ],
      postApprovalObligations: "Must submit Utilization Certificate (UC) within 60 days of each tranche payout. Quarterly performance update reports are mandatory."
    }
  };

  const activeScheme = schemeData[schemeId] || schemeData["adm-01"];
  return (
    <div>Detail page</div>
  );
}
*/

// --- NEW REDESIGNED SCHEME DETAIL WORKSPACE COMPONENT ---

import { getAnalyticsData, saveAnalyticsData } from "./govSchemesHelper";

export default function AdminSchemeDetail() {
  const navigate = useNavigate();
  const { "*": rawSubPath } = useParams();
  
  // Extract scheme ID from path e.g. /detail/adm-01
  const schemeId = rawSubPath ? rawSubPath.split("/").pop() : "adm-01";

  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [activeTab, setActiveTab] = useState("overview"); // overview, eligibility, benefits, documents, similar
  const [toastMessage, setToastMessage] = useState("");
  const [redirectModal, setRedirectModal] = useState(false);

  // Load active scheme
  const scheme = analytics.schemes.find(s => s.id === schemeId) || analytics.schemes[0];

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ days: scheme.daysLeft, hours: 14, mins: 45, secs: 20 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, secs: 59, mins: prev.mins - 1 };
        if (prev.hours > 0) return { ...prev, secs: 59, mins: 59, hours: prev.hours - 1 };
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [scheme.daysLeft]);

  // Log viewed event for details
  useEffect(() => {
    const updated = { ...analytics };
    const matched = updated.schemes.find(s => s.id === scheme.id);
    if (matched) {
      matched.viewed = (matched.viewed || 0) + 1;
    }
    // Track guide open
    const guideEvent = updated.events.find(e => e.type === "guide_open");
    if (guideEvent) {
      guideEvent.count += 1;
    }
    saveAnalyticsData(updated);
    setAnalytics(updated);
  }, [scheme.id]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleBookmark = () => {
    const updated = { ...analytics };
    const matched = updated.schemes.find(s => s.id === scheme.id);
    if (matched) {
      matched.bookmarked = !matched.bookmarked;
      // Track Bookmark event
      const bookmarkEvent = updated.events.find(e => e.type === "bookmark");
      if (bookmarkEvent) {
        bookmarkEvent.count += matched.bookmarked ? 1 : -1;
      }
      saveAnalyticsData(updated);
      setAnalytics(updated);
      showToast(matched.bookmarked ? "Bookmarked opportunity!" : "Removed bookmark");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Opportunity details link copied!");
  };

  const handleApplyClick = () => {
    setRedirectModal(true);
    // Log event in platform analytics
    const updated = { ...analytics };
    const applyEvent = updated.events.find(e => e.type === "apply_click");
    if (applyEvent) {
      applyEvent.count += 1;
    }
    const matched = updated.schemes.find(s => s.id === scheme.id);
    if (matched) {
      matched.applyClicked = (matched.applyClicked || 0) + 1;
      matched.status = "Applied (Self Reported)";
      matched.selfReportedApplied = true;
      matched.lastInteraction = new Date().toISOString().split("T")[0];
    }
    saveAnalyticsData(updated);
    setAnalytics(updated);
  };

  // Define dynamic content for tabs based on scheme profile
  const getOverviewTab = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Scheme Summary</h4>
        <p className="text-xs text-gray-600 leading-relaxed mt-1">{scheme.description}</p>
      </div>
      <div>
        <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Primary Objectives</h4>
        <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 mt-1 leading-relaxed">
          <li>Accelerate corporate-FPO partnerships via technology seeding.</li>
          <li>Foster localized post-harvest value addition and infrastructure development.</li>
          <li>Deliver structured capital offsets for eligible registered businesses.</li>
        </ul>
      </div>
      <div className="pt-2 border-t border-gray-100">
        <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Official Resources</h4>
        <div className="flex gap-4 mt-2">
          <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-medium hover:underline flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5" /> Guidelines PDF (Public)
          </a>
          <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-medium hover:underline flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5" /> Ministry Circular
          </a>
        </div>
      </div>
    </div>
  );

  const getEligibilityTab = () => {
    // Generate simple checklist criteria matching profile
    const criteria = [
      { name: "Registration State", required: "Haryana or Punjab", actual: "Haryana, Punjab, Rajasthan", met: true },
      { name: "Annual Turnover", required: "Over ₹5.0 Crore", actual: analytics.companyProfile.turnover, met: true },
      { name: "Employee Threshold", required: "Over 50 Employees", actual: analytics.companyProfile.employees, met: true },
      { name: "Udyam Registered", required: "Required Active MSME", actual: scheme.id === "adm-04" ? "Missing Udyam ID" : "Active (UDYAM-HR-12)", met: scheme.id !== "adm-04" }
    ];

    return (
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Eligibility Gap Analysis</h4>
        <div className="space-y-2">
          {criteria.map((c, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 text-xs bg-gray-50">
              <div>
                <p className="font-bold text-brand-darkest">{c.name}</p>
                <p className="text-[10px] text-gray-500 font-semibold">Requirement: {c.required}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${c.met ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                  {c.met ? "Matched" : "Gap Detected"}
                </span>
                <p className="text-[10px] text-gray-500 mt-1">Company: {c.actual}</p>
              </div>
            </div>
          ))}
        </div>
        {scheme.id === "adm-04" && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-900 leading-relaxed font-semibold">
            <span className="font-bold block">Eligibility Blockers Identified:</span>
            Your Udyam Registration code needs to be verified inside your Profile Settings to unlock this loan opportunity.
          </div>
        )}
      </div>
    );
  };

  const getBenefitsTab = () => (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Benefit Structure</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-emerald-800 block">Financial Incentives</span>
          <span className="text-xl font-black text-emerald-950 block mt-1">{scheme.benefitAmount}</span>
          <p className="text-xs text-emerald-800/80 mt-2 leading-relaxed">
            Provided as Capital subsidy offsets or tax holiday relief credits based on verified operational investments.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-xs space-y-2">
          <span className="font-bold text-brand-darkest uppercase block">Payout Mechanism</span>
          <p className="text-gray-600 leading-relaxed">
            Tranche-based disbursements. Sum is distributed across milestones subject to direct self-filing compliance audits under GFR 12-C templates.
          </p>
        </div>
      </div>
    </div>
  );

  const getDocumentsTab = () => {
    const docs = [
      { name: "GST Certificate", publicReq: "Active registration verification return", status: "Available inside profile" },
      { name: "PAN Card copy", publicReq: "Incorporation PAN card scan", status: "Available inside profile" },
      { name: "Udyam Registration", publicReq: "MSME ministry portal certificate", status: scheme.id === "adm-04" ? "Missing / Needs Link" : "Synced inside profile" },
      { name: "DPIIT Startup India ID", publicReq: "Valid DPIIT certification status", status: "Synced inside profile" },
      { name: "Audited Balances", publicReq: "CA-certified turnover statements (FY25)", status: "Needs Upload" }
    ];

    return (
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Required Documentation</h4>
        <div className="space-y-2 text-xs">
          {docs.map((d, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 bg-white">
              <div>
                <p className="font-bold text-brand-darkest">{d.name}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{d.publicReq}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                d.status.includes("Available") || d.status.includes("Synced") 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                  : "bg-amber-50 text-amber-800 border border-amber-100"
              }`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getSimilarTab = () => {
    const similar = analytics.schemes.filter(s => s.id !== scheme.id).slice(0, 2);
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-brand-darkest uppercase tracking-wide">Complementary Opportunities</h4>
        {similar.map((s, i) => (
          <div 
            key={i} 
            onClick={() => navigate(`/module/gov-schemes/admin/detail/${s.id}`)}
            className="border border-gray-100 hover:border-brand-medium rounded-2xl p-4 cursor-pointer hover:bg-gray-50/40 transition flex justify-between items-center bg-white"
          >
            <div>
              <span className="text-[8px] font-black uppercase tracking-wider bg-brand-darkest/5 text-brand-darkest px-2.5 py-0.5 rounded">
                {s.category}
              </span>
              <h4 className="text-xs font-black text-brand-darkest uppercase tracking-wide mt-2">{s.name}</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{s.ministry} • {s.benefitAmount}</p>
            </div>
            <span className="text-xs font-black text-brand-medium shrink-0">{s.matchScore}% Match</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Redirect Notification Modal */}
      {redirectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-gray-150 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-600">
              <ExternalLink className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-wider text-brand-darkest">External Redirection</h3>
            </div>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Redirecting you to the official government portal to apply for <span className="font-black text-brand-darkest">{scheme.name}</span>.
            </p>
            <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl text-[11px] text-emerald-900 leading-relaxed font-semibold">
              <span className="font-bold">Notice:</span> Since AgroIndia does not link to government administrative platforms, this action logs an apply intent event locally. You will need to complete the form directly on government systems.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setRedirectModal(false)}
                className="text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <a 
                href="https://www.india.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setRedirectModal(false)}
                className="text-xs font-bold text-white bg-brand-darkest hover:bg-brand-dark px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                Proceed to Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Header Back Button & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={() => navigate("/module/gov-schemes/admin")}
          className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1.5 transition animate-fadeIn"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity Hub
        </button>

        <div className="flex gap-2 animate-fadeIn">
          <button 
            onClick={handleBookmark}
            className={`p-2.5 rounded-xl border transition ${
              scheme.bookmarked 
                ? "bg-amber-50 border-amber-200 text-amber-600" 
                : "bg-white border-gray-200 text-gray-400 hover:text-brand-darkest"
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <button 
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-brand-darkest transition"
            title="Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Scheme Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase bg-brand-medium/10 text-brand-medium px-3 py-1 rounded-full">
                {scheme.category}
              </span>
              <h2 className="text-lg font-black text-brand-darkest uppercase mt-3 tracking-wide">{scheme.name}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{scheme.ministry}</p>
            </div>

            {/* Countdown timer ticker */}
            <div className="bg-red-50 border border-red-150 p-4 rounded-xl flex items-center justify-between gap-4 text-red-950">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">Application Window Closes In:</span>
              </div>
              <div className="flex gap-2 text-xs font-bold text-red-800">
                <span>{timeLeft.days}d</span>
                <span>{timeLeft.hours}h</span>
                <span>{timeLeft.mins}m</span>
                <span>{timeLeft.secs}s</span>
              </div>
            </div>

            {/* Tab Toggles */}
            <div className="flex border-b border-gray-100 overflow-x-auto gap-2 scrollbar-none">
              {["overview", "eligibility", "benefits", "documents", "similar"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-black uppercase pb-2 px-1 border-b-2 transition shrink-0 ${
                    activeTab === tab 
                      ? "border-brand-darkest text-brand-darkest font-extrabold" 
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  {tab === "documents" ? "Documents Required" : tab}
                </button>
              ))}
            </div>

            {/* Tab content renderer */}
            <div className="pt-2 min-h-[220px]">
              {activeTab === "overview" && getOverviewTab()}
              {activeTab === "eligibility" && getEligibilityTab()}
              {activeTab === "benefits" && getBenefitsTab()}
              {activeTab === "documents" && getDocumentsTab()}
              {activeTab === "similar" && getSimilarTab()}
            </div>
          </div>
        </div>

        {/* Right Column: Match Score & Action Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4 text-center">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest">Matching Profile Score</h3>
            
            {/* Circular Progress Gauge */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
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
                  strokeDasharray={`${scheme.matchScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-brand-darkest">{scheme.matchScore}%</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase block tracking-wider">Profile Score</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
              Calculated using Udyam, turnover levels, and location parameters matching publicly announced guidelines.
            </p>

            {scheme.isFarmerScheme ? (
              <div className="bg-brand-medium/5 border border-brand-medium/20 text-brand-darkest p-3 rounded-xl text-xs font-semibold leading-relaxed text-center">
                This is a farmer-directed program. Associated farmers can apply directly from their respective portals.
              </div>
            ) : (
              <button 
                onClick={handleApplyClick}
                className="w-full bg-brand-darkest hover:bg-brand-dark text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                Apply Now <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
