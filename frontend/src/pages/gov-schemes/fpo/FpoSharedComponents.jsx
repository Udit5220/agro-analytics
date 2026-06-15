import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Send, X, AlertTriangle, ChevronRight, ArrowUpRight, ArrowDownRight, ShieldCheck, Upload, HelpCircle, Check, Play, Eye, Coins, CreditCard, HeartHandshake, Building2, PiggyBank, Globe, Award, Sparkles, AlertCircle } from "lucide-react";

// 1. PageHeader (Without breadcrumbs)
export const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-gray-250/60 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-brand-darkest">{title}</h1>
        {subtitle && <p className="text-xs font-bold text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
};

// 2. StatsCard (Consistent across all 5 pages)
export const StatsCard = ({ title, value, sub, trend, isPositive, alert, icon: Icon }) => {
  const getIdentity = () => {
    const t = title.toLowerCase();
    if (t.includes("scheme")) {
      return "bg-purple-50 text-purple-600 border border-purple-100";
    }
    if (t.includes("eligible") || t.includes("total farmers") || t.includes("total holdings")) {
      return "bg-blue-50 text-blue-600 border border-blue-100";
    }
    if (t.includes("enrolled") || t.includes("pm-kisan")) {
      return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    }
    return "bg-orange-50 text-orange-600 border border-orange-100";
  };

  const iconClasses = getIdentity();

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-150 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group">
      
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          {/* Label above */}
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">{title}</span>
          
          {/* Metric value and trend side-by-side */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-950 tracking-tight leading-none">{value}</span>
            {trend && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                    : "bg-rose-50 text-rose-700 border-rose-250"
                }`}
              >
                {isPositive ? "↗ " : "↘ "}
                {trend}
              </span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className={`w-10 h-10 rounded-full ${iconClasses} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        {/* One-line description below */}
        <p className="text-xs font-semibold text-gray-500 line-clamp-1">{sub}</p>
        
        {alert && (
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-100 p-2.5 rounded-xl text-[10px] font-black leading-tight animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{alert}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. EnrollmentFunnelBar
export const EnrollmentFunnelBar = ({ eligible, enrolled, received }) => {
  const enrollPct = eligible > 0 ? Math.round((enrolled / eligible) * 100) : 0;
  const receivePct = enrolled > 0 ? Math.round((received / enrolled) * 100) : 0;

  const getColorClass = (pct) => {
    if (pct > 75) return { bg: "bg-emerald-500", text: "text-emerald-700" };
    if (pct >= 50) return { bg: "bg-amber-500", text: "text-amber-700" };
    return { bg: "bg-rose-500", text: "text-rose-700" };
  };

  const c1 = getColorClass(enrollPct);
  const c2 = getColorClass(receivePct);

  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
      {/* Funnel Step 1: Enrolled / Eligible */}
      <div>
        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
          <span>Enrolled / Eligible</span>
          <span className={`font-bold ${c1.text}`}>{enrolled} / {eligible} ({enrollPct}%)</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className={`h-full ${c1.bg}`} style={{ width: `${enrollPct}%` }} />
        </div>
      </div>

      {/* Funnel Step 2: Benefit Received / Enrolled */}
      <div>
        <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
          <span>Benefit Received / Enrolled</span>
          <span className={`font-bold ${c2.text}`}>{received} / {enrolled} ({receivePct}%)</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div className={`h-full ${c2.bg}`} style={{ width: `${receivePct}%` }} />
        </div>
      </div>
    </div>
  );
};

// 4. SchemeStatusBadge
export const SchemeStatusBadge = ({ status }) => {
  let styles = "bg-gray-200 text-gray-800 border-gray-300";

  switch (status) {
    case "Active":
    case "Approved":
    case "On Track":
      styles = "bg-emerald-100 text-emerald-900 border-emerald-300";
      break;
    case "Enrollment Open":
    case "Push Needed":
    case "Under Review":
      styles = "bg-amber-100 text-amber-900 border-amber-300";
      break;
    case "Deadline Soon":
    case "Critical":
    case "Failed":
    case "Blocked":
    case "Overdue":
      styles = "bg-rose-100 text-rose-900 border-rose-300 animate-pulse";
      break;
    case "Drafting":
    case "In Progress":
    case "Submitted":
      styles = "bg-blue-100 text-blue-900 border-blue-300";
      break;
    case "Not Started":
      styles = "bg-gray-200 text-gray-800 border-gray-300";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider shrink-0 ${styles}`}>
      {status}
    </span>
  );
};

// 5. FarmerSchemeCell
export const FarmerSchemeCell = ({ status }) => {
  if (status === "enrolled" || status === "self-reported-applied" || status === "self-reported-benefit-received") {
    return (
      <div className="flex items-center justify-center animate-fadeIn" title="Enrolled / Applied">
        <CheckCircle2 className="w-5 h-5 text-green-600" fill="#dcfce7" />
      </div>
    );
  }
  if (status === "eligible-not-enrolled" || status === "recommended" || status === "interested" || status === "apply-link-shared" || status === "profile-complete") {
    return (
      <div className="flex items-center justify-center cursor-help animate-pulse" title="Engaged / Recommended (Action Needed)">
        <AlertTriangle className="w-5 h-5 text-red-650" fill="#fee2e2" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center text-gray-300" title="Not Enrolled / Not Eligible">
      <XCircle className="w-5 h-5" fill="#f3f4f6" />
    </div>
  );
};

// 6. SchemeCard (Premium, unified card styling for Scheme Overview following Greenleaf design)
export const SchemeCard = ({ scheme, mult, onStartDrive, navigate }) => {
  const scaledEligible = Math.round((scheme.eligible || 0) * (mult || 1));
  const scaledEnrolled = Math.round((scheme.enrolled || 0) * (mult || 1));
  const scaledReceived = Math.round((scheme.received || 0) * (mult || 1));
  const remainingToEnroll = Math.max(0, scaledEligible - scaledEnrolled);

  const getThemeColors = () => {
    switch (scheme.type) {
      case "Direct Benefit":
        return {
          barBg: "bg-emerald-500",
          badge: "bg-emerald-50 text-emerald-800 border-emerald-100",
          iconBg: "bg-emerald-50 text-emerald-700",
        };
      case "Insurance":
        return {
          barBg: "bg-blue-500",
          badge: "bg-blue-50 text-blue-800 border-blue-100",
          iconBg: "bg-blue-50 text-blue-700",
        };
      case "Credit":
        return {
          barBg: "bg-amber-500",
          badge: "bg-amber-50 text-amber-800 border-amber-100",
          iconBg: "bg-amber-50 text-amber-700",
        };
      case "Pension":
        return {
          barBg: "bg-purple-500",
          badge: "bg-purple-50 text-purple-800 border-purple-100",
          iconBg: "bg-purple-50 text-purple-700",
        };
      case "Infrastructure":
        return {
          barBg: "bg-orange-500",
          badge: "bg-orange-50 text-orange-850 border-orange-100",
          iconBg: "bg-orange-50 text-orange-700",
        };
      case "Subsidy":
        return {
          barBg: "bg-rose-500",
          badge: "bg-rose-50 text-rose-850 border-rose-100",
          iconBg: "bg-rose-50 text-rose-700",
        };
      case "Market Linkage":
        return {
          barBg: "bg-indigo-500",
          badge: "bg-indigo-50 text-indigo-850 border-indigo-100",
          iconBg: "bg-indigo-50 text-indigo-700",
        };
      default:
        return {
          barBg: "bg-gray-400",
          badge: "bg-gray-50 text-gray-800 border-gray-200",
          iconBg: "bg-gray-100 text-gray-650",
        };
    }
  };

  const colors = getThemeColors();
  const isUrgent = scheme.status === "Enrollment Open" && scheme.daysLeft && scheme.daysLeft < 60;

  const getIcon = () => {
    switch (scheme.type) {
      case "Direct Benefit": return <Coins className="w-4 h-4" />;
      case "Insurance": return <ShieldCheck className="w-4 h-4" />;
      case "Credit": return <CreditCard className="w-4 h-4" />;
      case "Pension": return <HeartHandshake className="w-4 h-4" />;
      case "Infrastructure": return <Building2 className="w-4 h-4" />;
      case "Subsidy": return <PiggyBank className="w-4 h-4" />;
      case "Market Linkage": return <Globe className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        scheme.id === "pmfby" ? "" : "border border-gray-150"
      }`}
    >
      <div className="space-y-4">
        {/* Card Header with top-left colored icon badge */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100 gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center shrink-0 border border-current/10`}>
              {getIcon()}
            </div>
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${colors.badge} mb-1`}>
                {scheme.type}
              </span>
              <h3 className="text-sm font-black text-brand-darkest leading-snug tracking-tight">
                {scheme.name}
              </h3>
            </div>
          </div>
          <SchemeStatusBadge status={scheme.status} />
        </div>

        {/* Official Name section */}
        <div className="space-y-1">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Official Program Name</span>
          <p className="text-xs font-bold text-gray-600 leading-normal" title={scheme.fullName}>{scheme.fullName}</p>
        </div>

        {/* Description Box */}
        <p className="text-xs text-gray-700 font-bold leading-relaxed bg-gray-50 border border-gray-150 p-3.5 rounded-xl">
          {scheme.description}
        </p>

        {/* FPO pipeline / Extra Info */}
        {scheme.isFpoLevel ? (
          <div className="p-3 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-100/70 rounded-xl space-y-1">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">
              FPO Project Pipeline
            </span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-700">{scheme.projectsInfo}</span>
            </div>
          </div>
        ) : (
          scheme.extraInfo && (
            <div className="text-xs text-brand-darkest font-bold bg-green-50/30 px-3 py-2.5 rounded-xl border border-green-100/50 flex items-center gap-2 shadow-3xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-medium shrink-0" />
              <span>{scheme.extraInfo}</span>
            </div>
          )
        )}

        {/* Warning / Deadline Info */}
        {scheme.status === "Enrollment Open" && scheme.deadline && !scheme.isFpoLevel && (
          <div className="flex items-center justify-between text-xs font-bold text-red-750 bg-red-50 p-2.5 rounded-xl shadow-3xs">
            <span>Deadline: {scheme.deadline}</span>
            {scheme.daysLeft && (
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-md text-[9px] font-black uppercase tracking-wider">
                {scheme.daysLeft} days left
              </span>
            )}
          </div>
        )}

        {scheme.alert && !scheme.isFpoLevel && (
          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 p-2.5 rounded-xl text-xs font-bold animate-pulse shadow-3xs">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{scheme.alert}</span>
          </div>
        )}

        {/* Funnel chart */}
        {!scheme.isFpoLevel && (
          <EnrollmentFunnelBar
            eligible={scaledEligible}
            enrolled={scaledEnrolled}
            received={scaledReceived}
          />
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
        {scheme.isFpoLevel ? (
          <button
            onClick={() => {
              if (scheme.linkPath) {
                navigate(scheme.linkPath);
              } else {
                alert(`Exploring Details for FPO Scheme: ${scheme.name}`);
              }
            }}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-brand-darkest rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm border border-gray-250 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{scheme.buttonText || "View Detail"}</span>
            <Eye className="w-4 h-4" />
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/module/gov-schemes/enrollment")}
              className="flex-1 py-2.5 border-2 border-gray-200 hover:border-brand-medium text-gray-600 hover:text-brand-medium rounded-xl text-xs font-bold transition hover:scale-[1.02] active:scale-[0.98]"
            >
              See Farmer List
            </button>
            <button
              onClick={() => onStartDrive(scheme.name, remainingToEnroll)}
              className="flex-1 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-black transition shadow-sm flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white" />
              {scheme.id === "enam" ? "Register Farmers" : "Start Drive"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// 7. WhatsAppReminderModal
export const WhatsAppReminderModal = ({ scheme, targetFarmers = [], village, isOpen, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (isOpen) {
      const sampleName = targetFarmers.length > 0 ? targetFarmers[0].name || "Ramesh Kumar" : "Ramesh Kumar";
      setMessageText(`Namaste ${sampleName}! Sonipat FPO ki taraf se — ${scheme || "PMFBY"} enrollment ka akhiri mauka. Last date: 31 Jul 2025. Suresh se mile: 9812XXXXXX`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  const formattedCount = targetFarmers.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-brand-darkest mb-2 flex items-center gap-2">
          <Send className="w-5 h-5 text-green-600" />
          Send WhatsApp Reminder
        </h3>

        {success ? (
          <div className="py-8 text-center text-sm font-bold text-green-800 bg-green-50 rounded-xl border border-green-200 animate-pulse">
            Reminders sent successfully to {formattedCount} farmers {village ? `in ${village}` : ""}!
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 space-y-1">
              <p className="flex justify-between">
                <span>Scheme:</span> <strong className="text-gray-800">{scheme || "PMFBY"}</strong>
              </p>
              <p className="flex justify-between">
                <span>Target:</span> <strong className="text-gray-800">{formattedCount} Farmers</strong>
              </p>
              {village && (
                <p className="flex justify-between">
                  <span>Village:</span> <strong className="text-gray-800">{village}</strong>
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Message Preview (Hinglish)</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-green-50/50 p-4 rounded-xl border border-green-150 text-xs text-gray-800 leading-relaxed font-mono focus:outline-none focus:ring-1 focus:ring-green-600/30 resize-none h-28"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Send Reminders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 8. IssueResolutionModal
export const IssueResolutionModal = ({ farmer, isOpen, onClose, onResolve }) => {
  const [success, setSuccess] = useState(false);

  if (!isOpen || !farmer) return null;

  const handleResolve = async () => {
    if (onResolve) {
      try {
        await onResolve(farmer.farmerId);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } catch (err) {
        console.error("Failed to resolve:", err);
      }
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const getGuide = (issue) => {
    switch (issue) {
      case "Aadhaar–bank mismatch":
        return [
          "Step 1: Ask farmer to visit nearest bank branch.",
          "Step 2: Carry Aadhaar card + bank passbook.",
          "Step 3: Fill seeding form at bank counter.",
          "Step 4: Update will reflect in PM-KISAN portal in 3-5 days.",
          "Step 5: Mark as resolved in this tracker."
        ];
      case "Bank account inactive":
        return [
          "Step 1: Farmer must do any transaction to reactivate account.",
          "Step 2: Deposit minimum ₹100 at branch or ATM.",
          "Step 3: Confirm reactivation with bank, then retry payment."
        ];
      case "Land record name mismatch":
        return [
          "Step 1: Visit Tehsildar office with Aadhaar + old land record.",
          "Step 2: Apply for name correction in Jamabandi.",
          "Step 3: Expected resolution: 15-30 days.",
          "Step 4: Upload corrected Jamabandi to document vault."
        ];
      case "Aadhaar not seeded":
        return [
          "Step 1: Visit CSC (Common Service Centre) in village.",
          "Step 2: Carry Aadhaar card + bank passbook + land record.",
          "Step 3: CSC operator will seed Aadhaar to PM-KISAN portal.",
          "Step 4: Seeding takes 2-3 working days."
        ];
      case "Auto-debit not set":
        return [
          "Step 1: Check auto-debit consent details.",
          "Step 2: Visit bank with mandate form signed by farmer.",
          "Step 3: Confirm auto-debit activation with the branch manager."
        ];
      case "Premium payment failed":
        return [
          "Step 1: Validate farmer premium share amount.",
          "Step 2: Retry premium transaction through FPO portal gateway.",
          "Step 3: In case of bank server errors, verify alternate IFSC or bank account."
        ];
      case "Claim docs incomplete":
        return [
          "Step 1: Obtain the missing land possession certificate.",
          "Step 2: Seed crop sowing certificate verified by Agriculture Officer.",
          "Step 3: Re-upload documents to the insurance portal."
        ];
      default:
        return [
          "Step 1: Verify documents at the FPO center.",
          "Step 2: Contact the district agriculture nodal officer.",
          "Step 3: Resubmit details after rectification."
        ];
    }
  };

  const steps = getGuide(farmer.issue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-brand-darkest mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Resolve Blocked Benefit
        </h3>

        {success ? (
          <div className="py-8 text-center text-sm font-bold text-green-800 bg-green-50 rounded-xl border border-green-200 animate-pulse">
            Marked as Resolved successfully! Update pending portal sync.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-xs text-gray-700">
              <p className="flex justify-between">
                <span>Farmer:</span> <strong className="text-gray-800">{farmer.name}</strong>
              </p>
              <p className="flex justify-between">
                <span>Village:</span> <strong className="text-gray-800">{farmer.village}</strong>
              </p>
              <p className="flex justify-between">
                <span>Scheme:</span> <strong className="text-gray-800">{farmer.scheme}</strong>
              </p>
              <p className="flex justify-between text-red-600">
                <span>Issue Type:</span> <strong className="font-black">{farmer.issue}</strong>
              </p>
              <p className="flex justify-between">
                <span>Amount Blocked:</span> <strong className="text-gray-800">₹{farmer.amountBlocked || "2,000"}</strong>
              </p>
              <p className="flex justify-between">
                <span>Days Stuck:</span> <strong className="text-gray-800">{farmer.daysStuck || "42"} days</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Step-by-Step Resolution Guide</label>
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-xs text-red-800 space-y-1.5 leading-relaxed font-bold">
                {steps.map((step, idx) => (
                  <p key={idx}>{step}</p>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleResolve}
                className="flex-1 py-2 bg-brand-darkest hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 9. FarmerEnrollmentModal (Interactive Quick Scheme Enrollment Form Modal)
export const FarmerEnrollmentModal = ({ farmer, isOpen, onClose, onEnrollSuccess }) => {
  const [selectedSchemes, setSelectedSchemes] = useState({
    pmKisan: farmer?.schemes?.pmKisan === "enrolled",
    pmfby: farmer?.schemes?.pmfby === "enrolled",
    kcc: farmer?.schemes?.kcc === "enrolled",
    pmKmy: farmer?.schemes?.pmKmy === "enrolled",
    eNam: farmer?.schemes?.eNam === "enrolled"
  });

  const [docsVerified, setDocsVerified] = useState({
    aadhaar: false,
    landRegistry: false,
    bankPassbook: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !farmer) return null;

  const handleToggleScheme = (key) => {
    setSelectedSchemes({ ...selectedSchemes, [key]: !selectedSchemes[key] });
  };

  const handleToggleDoc = (key) => {
    setDocsVerified({ ...docsVerified, [key]: !docsVerified[key] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onEnrollSuccess) {
          const finalSchemesMap = { ...farmer.schemes };
          Object.keys(selectedSchemes).forEach((key) => {
            if (selectedSchemes[key]) {
              finalSchemesMap[key] = "enrolled";
            }
          });
          onEnrollSuccess(farmer.id, finalSchemesMap);
        }
        onClose();
      }, 1500);
    }, 1200);
  };

  const readyToSubmit = docsVerified.aadhaar && docsVerified.landRegistry && docsVerified.bankPassbook;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-[24px] p-6 shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-brand-darkest mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          Enroll Farmer in Schemes
        </h3>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
              <Check className="w-6 h-6 text-green-600 stroke-[3px]" />
            </div>
            <h4 className="text-sm font-black text-green-800">Enrollment Submitted!</h4>
            <p className="text-xs text-gray-500 font-bold">Farmer profile database successfully synchronized.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farmer context info */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-2 gap-2 text-xs text-gray-700">
              <p>Farmer Name: <strong className="text-gray-900 block font-black">{farmer.name}</strong></p>
              <p>Village Cluster: <strong className="text-gray-900 block font-black">{farmer.village}</strong></p>
              <p>Land Size: <strong className="text-gray-900 block font-black">{farmer.land}</strong></p>
              <p>Social Category: <strong className="text-gray-900 block font-black">{farmer.category}</strong></p>
            </div>

            {/* Select schemes block */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Select Target Schemes</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: "pmKisan", label: "PM-KISAN (Income)" },
                  { key: "pmfby", label: "PMFBY (Crop Insurance)" },
                  { key: "kcc", label: "KCC (Crop Loan)" },
                  { key: "pmKmy", label: "PM-KMY (Pension)" },
                  { key: "eNam", label: "eNAM (Online Market Linkage)" }
                ].map((s) => {
                  const itemKey = s.key;
                  const isAlreadyEnrolled = farmer.schemes[itemKey] === "enrolled";
                  const isEligible = farmer.schemes[itemKey] !== "not-eligible";
                  
                  return (
                    <label
                      key={s.key}
                      className={`flex items-center gap-2 p-2 border rounded-xl cursor-pointer text-xs font-bold transition ${
                        isAlreadyEnrolled
                          ? "bg-green-50/50 border-green-200 text-green-800"
                          : !isEligible
                          ? "bg-gray-55 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
                          : selectedSchemes[itemKey]
                          ? "bg-green-50 border-green-300 text-green-700 shadow-sm"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isAlreadyEnrolled || selectedSchemes[itemKey]}
                        disabled={isAlreadyEnrolled || !isEligible}
                        onChange={() => handleToggleScheme(itemKey)}
                        className="rounded text-green-600 focus:ring-green-600"
                      />
                      <span>{s.label}</span>
                      {isAlreadyEnrolled && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black ml-auto">Enrolled</span>}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Documents checklist */}
            <div className="space-y-1.5 bg-red-50/50 p-4 border border-red-100 rounded-xl">
              <span className="text-[10px] font-black text-red-700 uppercase tracking-wider block mb-1">Verify Ground Documents (All Mandatory)</span>
              <div className="space-y-2">
                {[
                  { key: "aadhaar", label: "Aadhaar Card copy matched with Bank ID" },
                  { key: "landRegistry", label: "Land registry seeding check (Jamabandi copy verified)" },
                  { key: "bankPassbook", label: "Active bank passbook copy for DBT transfer" }
                ].map((doc) => (
                  <label key={doc.key} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={docsVerified[doc.key]}
                      onChange={() => handleToggleDoc(doc.key)}
                      className="rounded text-red-600 focus:ring-red-650"
                    />
                    <span className={docsVerified[doc.key] ? "text-green-700 font-black" : "text-red-700"}>{doc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Form actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !readyToSubmit}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
                  readyToSubmit
                    ? "bg-brand-darkest hover:bg-brand-dark text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Registering..." : "Submit Enrollment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
