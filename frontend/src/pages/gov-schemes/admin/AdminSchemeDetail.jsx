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
} from "lucide-react";

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
    },
    "adm-02": {
      name: "DPIIT Agritech Tax Holiday under Startup India",
      ministry: "DPIIT, Ministry of Commerce and Industry",
      type: "Central Government",
      benefitType: "Tax Exemption",
      maxBenefit: "100% Tax Exemption for 3 Consecutive Years",
      sector: "Startup India",
      deadline: "2026-12-31",
      matchScore: 88,
      description: "Income tax exemption under section 80-IAC for eligible DPIIT-recognized agricultural technology startups.",
      tranches: [
        { phase: "Year 1 Release", percentage: "33%", description: "Tax savings authorized upon validation of the 80-IAC exemption certificate" },
        { phase: "Year 2 Release", percentage: "33%", description: "Savings maintained upon verification of continued agritech status" },
        { phase: "Year 3 Release", percentage: "34%", description: "On final submission of three-year audit compliance reports" }
      ],
      eligibilityRules: [
        { name: "Legal Entity Type", required: "Private Limited or LLP", current: "Private Limited Company", status: true },
        { name: "DPIIT Recognition Status", required: "DPIIT Registered Startup", current: "DPIIT-78923 Active", status: true },
        { name: "Year of Incorporation", required: "Incorporated after April 1, 2016", current: "Incorporated Jan 2024", status: true }
      ],
      documents: [
        { key: "pan", name: "DPIIT Recognition Certificate Scan", source: "Auto-filled from profile", required: true },
        { key: "gst", name: "Section 80-IAC Application Draft", source: "User Upload Required", required: true },
        { key: "audit", name: "CA Audit Statement (Previous 2 financial periods)", source: "User Upload Required", required: true }
      ],
      postApprovalObligations: "Annual compliance audits must be submitted. Exemption holds only if core business remains agricultural tech."
    },
    "adm-03": {
      name: "Agri-Infrastructure Fund (AIF) Subvention",
      ministry: "Ministry of Agriculture & State Depts",
      type: "Both",
      benefitType: "Interest Subvention",
      maxBenefit: "3% Interest Subvention + Credit Guarantee cover",
      sector: "Post-Harvest Management",
      deadline: "2026-07-15",
      matchScore: 85,
      description: "Medium to long-term debt financing facility for investment in viable post-harvest management infrastructure.",
      tranches: [
        { phase: "Interest Subvention", percentage: "3% Annually", description: "Refunded directly to the linked capital term loan account for up to 7 years" }
      ],
      eligibilityRules: [
        { name: "Post-Harvest Infra Project", required: "Cold Chain, Packhouse, or Assay Hub", current: "Cold Chain Project", status: true },
        { name: "Bank Term Loan Status", required: "Sanctioned loan from commercial bank", current: "Sanctioned Bank Loan Active", status: true }
      ],
      documents: [
        { key: "pan", name: "Bank Term Loan Sanction Letter", source: "User Upload Required", required: true },
        { key: "gst", name: "Detailed Project Feasibility Report (DPR)", source: "User Upload Required", required: true }
      ],
      postApprovalObligations: "Infrastructure asset must remain active and undergo annual government inspection checks."
    },
    "adm-04": {
      name: "SIDBI Venture Capital Fund for MSME Agritech",
      ministry: "SIDBI",
      type: "Central Government",
      benefitType: "Collateral-Free Loan",
      maxBenefit: "Up to ₹2 Crore debt with SIDBI Guarantee",
      sector: "MSME",
      deadline: "2026-08-30",
      matchScore: 78,
      description: "Collateral-free developmental funding support targeted at rural MSMEs operating technological processing hubs.",
      tranches: [
        { phase: "Single Release", percentage: "100%", description: "Disbursed to bank account following collateral-free agreement execution" }
      ],
      eligibilityRules: [
        { name: "MSME Registration Status", required: "Active Udyam MSME Certificate", current: "Active (Udyam-HR-003)", status: true },
        { name: "Corporate CIBIL Score", required: "CIBIL Score > 750", current: "780 Active", status: true }
      ],
      documents: [
        { key: "pan", name: "Udyam MSME Certificate Doc", source: "Auto-filled from profile", required: true },
        { key: "gst", name: "3-Year Corporate Balance Sheet CA Signed", source: "User Upload Required", required: true }
      ],
      postApprovalObligations: "Monthly EMIs must remain regular. Annual end-use audit certificate must be uploaded."
    },
    "adm-05": {
      name: "Haryana Agribusiness Export Capital Subsidy",
      ministry: "Haryana State Agriculture Department",
      type: "State Government",
      benefitType: "Capital Subsidy",
      maxBenefit: "25% Capital Subsidy up to ₹50 Lakh on machinery",
      sector: "Export",
      deadline: "2026-06-25",
      matchScore: 95,
      description: "Financial assistance for creating cold chain facilities, sorting lines, and primary processing for agro exports.",
      tranches: [
        { phase: "Single Release", percentage: "100%", description: "Released directly to lending bank for capital loan offset upon physical inspection of machinery" }
      ],
      eligibilityRules: [
        { name: "Physical Unit Location", required: "Haryana state industrial zone", current: "Haryana Unit Active", status: true },
        { name: "Total Capital Investment", required: "Min ₹20 Lakh in machinery", current: "₹45 Lakh Certified", status: true },
        { name: "FPO Procurement Linkage", required: "Active contract buyback > 100 farmers", current: "124 Farmers Connected", status: true }
      ],
      documents: [
        { key: "pan", name: "Agribusiness Layout & Land Blueprint", source: "Auto-filled from profile", required: true },
        { key: "gst", name: "NOC from Pollution Control Board", source: "User Upload Required", required: true },
        { key: "audit", name: "Chartered Accountant (CA) Asset Audit Certificate", source: "User Upload Required", required: true }
      ],
      postApprovalObligations: "Asset must remain operational for at least 5 years. Transfer or disposal without department approval will trigger recovery clauses."
    },
    "fmr-01": {
      name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      ministry: "Ministry of Agriculture",
      type: "Central Government",
      benefitType: "Capital Subsidy",
      maxBenefit: "₹6,000/year Direct Benefit Transfer",
      sector: "Organic Farming",
      deadline: "2026-10-10",
      matchScore: 100,
      description: "Direct income support to landholding farmer families across the country.",
      tranches: [
        { phase: "Installment 1", percentage: "₹2,000", description: "Disbursed seasonal DBT (April-July)" },
        { phase: "Installment 2", percentage: "₹2,000", description: "Disbursed seasonal DBT (August-November)" },
        { phase: "Installment 3", percentage: "₹2,000", description: "Disbursed seasonal DBT (December-March)" }
      ],
      eligibilityRules: [
        { name: "Cultivable Landholding", required: "Ownership of land in target state", current: "Certified landowner", status: true }
      ],
      documents: [
        { key: "pan", name: "Aadhaar e-KYC Verification Certificate", source: "Auto-filled from profile", required: true },
        { key: "gst", name: "Land Record Ownership Document (Jamabandi)", source: "Auto-filled from profile", required: true }
      ],
      postApprovalObligations: "Annual e-KYC validation via bio-metrics or OTP authentication must remain verified."
    },
    "fmr-02": {
      name: "PM Fasal Bima Yojana (Crop Insurance)",
      ministry: "Ministry of Agriculture",
      type: "Central Government",
      benefitType: "Credit Guarantee",
      maxBenefit: "Subsidized Crop Risk Cover",
      sector: "FPO Support",
      deadline: "2026-06-22",
      matchScore: 94,
      description: "Uniform premium rates with state support covering crop losses due to natural calamities.",
      tranches: [
        { phase: "Premium Payment", percentage: "Subsidized premium", description: "State subsidizes the remaining premium rate for crop risk safety net" }
      ],
      eligibilityRules: [
        { name: "Crop Match", required: "Notified crop in targeted state boundary", current: "Wheat Crop verified", status: true }
      ],
      documents: [
        { key: "pan", name: "Sowing Certificate issued by Agronomist", source: "User Upload Required", required: true },
        { key: "gst", name: "Bank Account Passbook Details", source: "Auto-filled from profile", required: true }
      ],
      postApprovalObligations: "Claims for crop damages must be registered within 72 hours of damage alongside geotagged survey photos."
    }
  };

  const scheme = schemeData[schemeId] || schemeData["adm-01"];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareStatus("Link Copied!");
    setTimeout(() => setShareStatus(""), 2000);
  };

  const handleUpload = (key) => {
    setUploadedDocs(prev => ({
      ...prev,
      [key]: true
    }));
  };

  const triggerMsmeFix = () => {
    setIsMsmeRegistered(true);
    setUploadedDocs(prev => ({ ...prev, msme: true }));
  };

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/module/gov-schemes/admin")}
          className="text-xs font-bold text-gray-500 hover:text-[#2e4057] flex items-center gap-1.5 transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discovery Feed
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              isBookmarked
                ? "bg-[#28a745]/10 border-[#28a745] text-[#28a745]"
                : "bg-white border-gray-200 text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#28a745]" : ""}`} />
            {isBookmarked ? "Bookmarked" : "Save Scheme"}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-500 hover:text-gray-700 transition"
          >
            <Share2 className="w-4 h-4" />
            {shareStatus || "Share"}
          </button>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden">
        {/* Match score label */}
        <div className="absolute top-6 right-6 bg-[#f4f7f4] border border-gray-200 px-4 py-2 rounded-xl text-right">
          <span className="block text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Matching Accuracy</span>
          <span className="text-xl font-black text-[#28a745]">{scheme.matchScore}% Match</span>
        </div>

        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-wider bg-[#2e4057] text-[#ffc857] px-2.5 py-1 rounded">
              {scheme.type}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded border border-gray-200">
              {scheme.benefitType}
            </span>
          </div>

          <h1 className="text-xl font-black text-[#2e4057] leading-tight pr-28 uppercase tracking-wide">
            {scheme.name}
          </h1>
          
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
            {scheme.ministry}
          </p>

          <p className="text-xs text-gray-500 font-semibold leading-relaxed pt-2">
            {scheme.description}
          </p>
        </div>

        {/* Live Timer strip */}
        <div className="border-t border-gray-100 pt-4 mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 text-red-700 p-2 rounded-lg border border-red-100">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[9px] text-gray-400 font-extrabold uppercase">Application Window Closes</span>
              <span className="text-xs font-bold text-gray-700">{scheme.deadline} (Strict Submission)</span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1">
            <div className="bg-red-50 text-red-800 border border-red-100 rounded-lg px-2.5 py-1 text-center min-w-[45px]">
              <span className="block text-sm font-black">{timeLeft.days}</span>
              <span className="text-[8px] font-bold uppercase text-red-600">Days</span>
            </div>
            <span className="font-bold text-red-400">:</span>
            <div className="bg-red-50 text-red-800 border border-red-100 rounded-lg px-2.5 py-1 text-center min-w-[45px]">
              <span className="block text-sm font-black">{timeLeft.hours}</span>
              <span className="text-[8px] font-bold uppercase text-red-600">Hrs</span>
            </div>
            <span className="font-bold text-red-400">:</span>
            <div className="bg-red-50 text-red-800 border border-red-100 rounded-lg px-2.5 py-1 text-center min-w-[45px]">
              <span className="block text-sm font-black">{timeLeft.mins}</span>
              <span className="text-[8px] font-bold uppercase text-red-600">Mins</span>
            </div>
            <span className="font-bold text-red-400">:</span>
            <div className="bg-red-50 text-red-800 border border-red-100 rounded-lg px-2.5 py-1 text-center min-w-[45px]">
              <span className="block text-sm font-black">{timeLeft.secs}</span>
              <span className="text-[8px] font-bold uppercase text-red-600">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tabs & Detail sections */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 p-2">
              <button
                onClick={() => setActiveTab("eligibility")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition ${
                  activeTab === "eligibility"
                    ? "bg-white text-[#2e4057] shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Eligibility Verification
              </button>
              <button
                onClick={() => setActiveTab("benefits")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition ${
                  activeTab === "benefits"
                    ? "bg-white text-[#2e4057] shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Financial Tranches
              </button>
              <button
                onClick={() => setActiveTab("obligations")}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition ${
                  activeTab === "obligations"
                    ? "bg-white text-[#2e4057] shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Auditing & Obligations
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
              
              {/* Tab 1: Eligibility Check */}
              {activeTab === "eligibility" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">Detailed Criteria Mapping</h3>
                    <span className="text-[10px] text-gray-500 font-semibold">Matched with profile data</span>
                  </div>

                  <div className="border border-gray-150 rounded-xl overflow-hidden divide-y divide-gray-100">
                    <div className="grid grid-cols-12 bg-gray-50 p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <div className="col-span-5">Criterion Parameter</div>
                      <div className="col-span-3 text-center">Required</div>
                      <div className="col-span-3 text-center">Your Profile</div>
                      <div className="col-span-1 text-right">Status</div>
                    </div>

                    {scheme.eligibilityRules.map((rule, idx) => (
                      <div key={idx} className="grid grid-cols-12 p-3 text-xs items-center font-semibold">
                        <div className="col-span-5 text-[#2e4057]">{rule.name}</div>
                        <div className="col-span-3 text-center text-gray-500">{rule.required}</div>
                        <div className="col-span-3 text-center text-gray-800">{rule.current}</div>
                        <div className="col-span-1 flex justify-end">
                          {rule.status ? (
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>

                        {/* Mismatch Alert & Trigger Option */}
                        {!rule.status && rule.updateTrigger && (
                          <div className="col-span-12 mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              {rule.updateTrigger}
                            </span>
                            <button
                              onClick={triggerMsmeFix}
                              className="text-[9px] font-extrabold bg-[#2e4057] text-white px-2 py-1 rounded hover:bg-[#208837] transition"
                            >
                              Sync Udyam Now
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <p className="text-[11px] text-emerald-900 font-semibold leading-relaxed">
                      All eligibility thresholds have a direct impact on matched scores. Updating missing parameters in your corporate workspace profile will refresh status indicators.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Financial Tranches */}
              {activeTab === "benefits" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#f4f7f4] border border-gray-150 p-4 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-500 font-extrabold uppercase">Maximum Benefit Allowance</span>
                      <span className="block text-base font-black text-[#2e4057]">{scheme.maxBenefit}</span>
                    </div>
                    <div className="bg-[#2e4057] text-[#ffc857] p-2.5 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Direct Bank Transfer (DBT) Tranches Outlines</h4>
                    
                    <div className="space-y-2.5">
                      {scheme.tranches.map((t, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-3 bg-white flex items-start gap-3.5">
                          <div className="bg-gray-100 text-gray-700 w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold text-[#2e4057]">{t.phase}</span>
                              <span className="text-xs font-black text-[#28a745] bg-[#28a745]/10 px-2 py-0.5 rounded-md">{t.percentage} payout</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                              {t.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Auditing Obligations */}
              {activeTab === "obligations" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Post-Approval Compliance Audit</h4>
                  
                  <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 text-red-950 space-y-2">
                    <h5 className="text-xs font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Statutory Warning & Recoverable Actions
                    </h5>
                    <p className="text-[11px] font-semibold leading-relaxed text-red-900/90">
                      {scheme.postApprovalObligations}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <span className="block text-[10px] font-extrabold uppercase text-gray-400">Standard Audit Requirements</span>
                    <ul className="text-xs font-semibold space-y-1.5 text-gray-700 list-disc list-inside">
                      <li>Drone mapping logs for land and infrastructure assets built under capital grants</li>
                      <li>Verified vendor invoices matching CA disbursement audit logs</li>
                      <li>Farmer list & FPO ledger copies highlighting target state residency</li>
                      <li>Mandatory compliance audits conducted under ISO/Government standards</li>
                    </ul>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Workflow & Steppers Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">Application Workflow Stages</h3>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2.5 w-full md:w-auto bg-gray-50 border border-gray-100 p-3 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-[#2e4057] text-white flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Pre-check</span>
                  <span className="text-xs font-bold text-gray-700">Auto-filled Profiling</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 hidden md:block" />

              <div className="flex items-center gap-2.5 w-full md:w-auto bg-gray-50 border border-gray-100 p-3 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Submit</span>
                  <span className="text-xs font-bold text-gray-500">Document Uploads</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 hidden md:block" />

              <div className="flex items-center gap-2.5 w-full md:w-auto bg-gray-50 border border-gray-100 p-3 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Verify</span>
                  <span className="text-xs font-bold text-gray-500">Physical Audits</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 hidden md:block" />

              <div className="flex items-center gap-2.5 w-full md:w-auto bg-gray-50 border border-gray-100 p-3 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">4</div>
                <div>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Disbursement</span>
                  <span className="text-xs font-bold text-gray-500">Tranche Payouts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Required Document Checklist & Action */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 h-fit">
            <div className="space-y-1">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#28a745]" /> Document Checklist
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Required items to initiate application</p>
            </div>

            <div className="space-y-3">
              {scheme.documents.map((doc, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-bold text-[#2e4057]">{doc.name}</span>
                    {uploadedDocs[doc.key] ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-200">
                        Synced
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="text-[9px] text-gray-400 font-semibold">{doc.source}</span>
                    
                    {uploadedDocs[doc.key] ? (
                      <span className="text-[10px] font-bold text-[#28a745] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Auto-pulled
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpload(doc.key)}
                        className="text-[9px] font-extrabold text-[#2e4057] hover:text-white border border-gray-200 bg-white hover:bg-[#2e4057] px-2 py-1 rounded transition flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" /> Upload File
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Button */}
            <div className="pt-2">
              <button
                onClick={() => navigate("/module/gov-schemes/admin/tracker", { state: { autoStart: scheme.id } })}
                className="w-full bg-[#2e4057] hover:bg-[#208837] text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                Apply & Initiate Application <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Related Schemes */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">Complementary Schemes</h3>
            
            <div className="space-y-3">
              <div 
                onClick={() => navigate("/module/gov-schemes/admin/detail/adm-05")}
                className="border border-gray-100 hover:border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-wider bg-[#28a745]/10 text-[#28a745] px-2 py-0.5 rounded">State Subsidies</span>
                  <span className="text-[10px] font-black text-[#28a745]">95% Match</span>
                </div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Haryana Agribusiness Export Capital Subsidy</h4>
                <p className="text-[10px] text-gray-400 font-semibold truncate">Haryana State Agriculture Department • Machinery grants</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
