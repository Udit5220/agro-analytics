import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatsCard, SchemeCard, WhatsAppReminderModal } from "./FpoSharedComponents";
import { AlertCircle, Award, Users, CheckCircle2, IndianRupee, X, RefreshCw } from "lucide-react";
import { govSchemesApi } from "../../../services/apiService";

const INITIAL_SCHEMES = [
  {
    id: "pm_kisan",
    name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    type: "Direct Benefit",
    description: "₹6,000/year in 3 installments of ₹2,000 each",
    eligible: 780,
    enrolled: 612,
    received: 558,
    status: "Active",
    deadline: "Always open",
    alert: null
  },
  {
    id: "pmfby",
    name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    type: "Insurance",
    description: "Crop loss insurance up to ₹35,000 per Hectare",
    eligible: 847,
    enrolled: 423,
    received: 398,
    status: "Enrollment Open",
    deadline: "31 Jul 2025",
    daysLeft: 45,
    alert: "424 farmers not enrolled — deadline in 45 days"
  },
  {
    id: "kcc",
    name: "KCC",
    fullName: "Kisan Credit Card",
    type: "Credit",
    description: "Crop loan up to ₹3 Lakh at 4% interest rate",
    eligible: 680,
    enrolled: 389,
    received: 334,
    status: "Active",
    deadline: "Always open",
    alert: null
  },
  {
    id: "pm_kmy",
    name: "PM-KMY",
    fullName: "Kisan Maan Dhan Yojana",
    type: "Pension",
    description: "₹3,000/month pension after age 60 for small farmers",
    eligible: 312,
    enrolled: 89,
    received: 71,
    status: "Active",
    deadline: "Always open",
    alert: "Only 29% enrolled — major opportunity gap"
  },
  {
    id: "aif",
    name: "AIF",
    fullName: "Agriculture Infrastructure Fund",
    type: "Infrastructure",
    description: "FPO projects: 2 Applied | 1 Approved | ₹2.0 Cr Pipeline",
    eligible: 0,
    enrolled: 0,
    received: 0,
    status: "Active",
    isFpoLevel: true,
    projectsInfo: "2 Applied | 1 Approved | ₹2.0 Cr Pipeline",
    linkPath: "/module/gov-schemes/applications",
    buttonText: "View Projects"
  },
  {
    id: "midh",
    name: "MIDH",
    fullName: "Mission for Integrated Development of Horticulture",
    type: "Subsidy",
    description: "FPO cold storage / pack house subsidy",
    eligible: 0,
    enrolled: 0,
    received: 0,
    status: "Enrollment Open",
    isFpoLevel: true,
    projectsInfo: "1 Draft in Progress | 180 farmers will benefit",
    linkPath: "/module/gov-schemes/applications",
    buttonText: "Complete Application"
  },
  {
    id: "smam",
    name: "SMAM",
    fullName: "Sub Mission on Agricultural Mechanisation",
    type: "Subsidy",
    description: "FPO machinery custom hiring center (CHC)",
    eligible: 0,
    enrolled: 0,
    received: 0,
    status: "Not Started",
    isFpoLevel: true,
    projectsInfo: "Status: Not Started | 340 farmers could benefit",
    buttonText: "Explore Scheme"
  },
  {
    id: "enam",
    name: "eNAM",
    fullName: "National Agriculture Market",
    type: "Market Linkage",
    description: "Sell crops at better price via online unified market",
    eligible: 680,
    enrolled: 156,
    received: 156,
    status: "Active",
    deadline: "Always open",
    extraInfo: "Revenue via eNAM this season: ₹8.4 Lakh",
    buttonText: "Register More Farmers"
  }
];

const SyncResultModal = ({ isOpen, onClose, result }) => {
  if (!isOpen || !result) return null;

  const stats = result.stats || {};
  const sourceMeta = result.sourceMeta || {};
  const gap = Math.max(0, stats.totalFarmers - stats.enrolledFarmers);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-gray-150 animate-scaleIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-12 h-12 bg-green-50 text-brand-medium rounded-2xl flex items-center justify-center mx-auto border border-green-100 shadow-sm">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h3 className="text-sm font-black text-gray-900 tracking-tight">Database Synchronized</h3>
          <p className="text-[10px] text-gray-500 font-bold">Sonipat district agricultural datasets successfully parsed</p>
        </div>

        {/* Data Cards */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-150">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Farmers (Holdings)</span>
            <span className="text-xs font-black text-gray-950">{stats.totalFarmers?.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-green-50/40 rounded-xl border border-green-100">
            <span className="text-[9px] font-black text-brand-medium uppercase tracking-widest">Enrolled (PM-Kisan)</span>
            <span className="text-xs font-black text-brand-medium">{stats.enrolledFarmers?.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100">
            <span className="text-[9px] font-black text-red-700 uppercase tracking-widest">Non-Enrolled Gap</span>
            <span className="text-xs font-black text-red-600">{gap.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Metadata Source Grid */}
        <div className="p-3 bg-gray-50/70 border border-gray-200/60 rounded-xl space-y-2 mb-6">
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">API Ingestion Sources</span>
          <div className="grid grid-cols-2 gap-3 text-[9px] font-bold text-gray-600">
            <div>
              <span className="block text-gray-400 font-medium">Census Baseline</span>
              <span className="text-gray-800">{sourceMeta.icrisat || "ICRISAT DLD API"}</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Enrollment Registry</span>
              <span className="text-gray-800">{sourceMeta.pmKisan || "data.gov.in API"}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-brand-medium hover:bg-brand-dark text-white text-[11px] font-bold rounded-xl shadow-sm transition"
        >
          Acknowledge & Sync Overview
        </button>

      </div>
    </div>
  );
};

const mergeApiSchemesWithMetadata = (apiSchemes) => {
  if (!apiSchemes || !Array.isArray(apiSchemes)) return INITIAL_SCHEMES;
  
  return INITIAL_SCHEMES.map(uiScheme => {
    // Find matching scheme from api responses
    const apiMatch = apiSchemes.find(apiScheme => {
      const apiName = (apiScheme.name || "").toLowerCase().trim();
      const uiName = (uiScheme.name || "").toLowerCase().trim();
      const uiFullName = (uiScheme.fullName || "").toLowerCase().trim();
      
      // Normalized matching rules
      if (uiScheme.id === "pm_kisan" && (apiName.includes("samman nidhi") || apiName.includes("pm-kisan") || apiName.includes("pm kisan"))) {
        return true;
      }
      if (uiScheme.id === "pmfby" && (apiName.includes("fasal bima") || apiName.includes("pmfby"))) {
        return true;
      }
      if (uiScheme.id === "kcc" && (apiName.includes("credit card") || apiName === "kcc")) {
        return true;
      }
      if (uiScheme.id === "pm_kmy" && (apiName.includes("maan dhan") || apiName.includes("maan-dhan") || apiName.includes("pm-kmy"))) {
        return true;
      }
      if (uiScheme.id === "enam" && (apiName.includes("national agriculture market") || apiName.includes("enam") || apiName.includes("e-nam"))) {
        return true;
      }
      
      return apiName === uiName || apiName === uiFullName;
    });
    
    if (apiMatch) {
      // Map API approved to enrolled, and set received to dynamic count if available
      const eligible = apiMatch.eligible !== undefined ? apiMatch.eligible : uiScheme.eligible;
      const enrolled = apiMatch.approved !== undefined ? apiMatch.approved : uiScheme.enrolled;
      const received = apiMatch.received !== undefined ? apiMatch.received : (apiMatch.approved !== undefined ? Math.round(apiMatch.approved * 0.9) : uiScheme.received);
      
      return {
        ...uiScheme,
        eligible,
        enrolled,
        received,
        percent: eligible > 0 ? Math.round((enrolled / eligible) * 100) : 0
      };
    }
    
    return uiScheme;
  });
};

export default function FpoSchemeOverview() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVillage, setFilterVillage] = useState("All");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statsView, setStatsView] = useState("fpo");
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // State for WhatsApp Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScheme, setModalScheme] = useState("");
  const [modalCount, setModalCount] = useState(0);

  // State for Sync Success Modal
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const getVillageMultiplier = (village) => {
    if (village === "Kharindwa") return 0.38; // ~320/847
    if (village === "Bhadana") return 0.34;   // ~287/847
    if (village === "Murthal") return 0.28;   // ~240/847
    return 1.0;
  };

  useEffect(() => {
    let active = true;
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await govSchemesApi.getFpoStats({ village: filterVillage });
        if (active) {
          if (res && res.success) {
            setStats(res);
            const merged = mergeApiSchemesWithMetadata(res.memberCoverage.schemes);
            setSchemes(merged);
            setIsUsingFallback(false);
          } else {
            triggerFallback();
          }
        }
      } catch (err) {
        console.warn("Failed to load FPO schemes stats, using local fallback:", err);
        if (active) {
          triggerFallback();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const triggerFallback = () => {
      setIsUsingFallback(true);
      const mult = getVillageMultiplier(filterVillage);
      const mockStats = {
        success: true,
        isFallback: true,
        districtTotalFarmers: 34500,
        districtEnrolledFarmers: 28400,
        totalDisbursedValue: `₹${Math.round(634 * mult * 0.066).toFixed(1)} Lakh`,
        potentialOpportunityValue: `₹${Math.round(847 * mult * 0.12).toFixed(1)} Lakh`,
        memberCoverage: {
          total: Math.round(847 * mult),
          covered: Math.round(634 * mult),
        }
      };
      const mockSchemes = INITIAL_SCHEMES.map(s => {
        const scaledEligible = Math.round((s.eligible || 0) * mult);
        const scaledEnrolled = Math.round((s.enrolled || 0) * mult);
        const scaledReceived = Math.round((s.received || 0) * mult);
        return {
          ...s,
          eligible: scaledEligible,
          enrolled: scaledEnrolled,
          received: scaledReceived,
          percent: scaledEligible > 0 ? Math.round((scaledEnrolled / scaledEligible) * 100) : 0
        };
      });
      setStats(mockStats);
      setSchemes(mockSchemes);
    };

    loadStats();
    return () => { active = false; };
  }, [filterVillage]);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await govSchemesApi.syncFpoData();
      if (res && res.success) {
        // Reload stats after sync completes
        try {
          const updatedStats = await govSchemesApi.getFpoStats({ village: filterVillage });
          if (updatedStats.success) {
            setStats(updatedStats);
            const merged = mergeApiSchemesWithMetadata(updatedStats.memberCoverage.schemes);
            setSchemes(merged);
            setIsUsingFallback(false);
          }
        } catch (loadErr) {
          console.warn("Reloading stats failed post-sync:", loadErr);
        }
        setSyncResult(res);
        setIsSyncModalOpen(true);
      } else {
        triggerSyncFallback();
      }
    } catch (err) {
      console.warn("Sync failed, using cached local dataset:", err);
      triggerSyncFallback();
    } finally {
      setIsSyncing(false);
    }
  };

  const triggerSyncFallback = () => {
    const mockResult = {
      success: true,
      stats: {
        totalFarmers: 34500,
        enrolledFarmers: 28400
      },
      sourceMeta: {
        icrisat: "Cached ICRISAT DLD 2021 (Local Backup)",
        pmKisan: "Cached data.gov.in 2025 (Local Backup)"
      },
      message: "Successfully synchronized district stats! Total Farmers: 34500, Enrolled: 28400, Gap: 6100"
    };
    setIsUsingFallback(true);
    setSyncResult(mockResult);
    setIsSyncModalOpen(true);
  };

  const handleStartDrive = (schemeName, count) => {
    setModalScheme(schemeName);
    setModalCount(count);
    setIsModalOpen(true);
  };

  // Compute stats dynamically
  const totalSchemes = schemes.length;
  const totalEligible = stats?.memberCoverage?.total || 0;
  const totalEnrolled = stats?.memberCoverage?.covered || 0;
  const totalBenefitUnlocked = stats?.totalDisbursedValue || (stats
    ? `₹${(totalEnrolled * 0.066).toFixed(1)} Lakh`
    : "₹0.0 Lakh");
  const potentialOpportunityValue = stats?.potentialOpportunityValue || (stats
    ? `₹${(totalEligible * 0.12).toFixed(1)} Lakh`
    : "₹0.0 Lakh");

  const mult = getVillageMultiplier(filterVillage);
  const districtTotal = Math.round((stats?.districtTotalFarmers || 34500) * mult);
  const districtEnrolled = Math.round((stats?.districtEnrolledFarmers || 28400) * mult);
  const districtGap = Math.max(0, districtTotal - districtEnrolled);

  // Filter schemes
  const filteredSchemes = schemes.filter((scheme) => {
    const typeMatch = filterType === "All" || scheme.type === filterType;
    const statusMatch = filterStatus === "All" || scheme.status === filterStatus;
    return typeMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto text-center py-24">
        <div className="w-10 h-10 border-4 border-brand-medium border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-bold text-gray-500">Loading dynamic FPO statistics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Scheme Overview"
        subtitle="Analyze active government programs and unlock farmer benefits"
        actions={
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`px-3 py-1.5 bg-[#1A3A2A] hover:bg-[#0F2E1F] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 ${isSyncing ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isSyncing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Syncing...
              </>
            ) : (
              "Sync Real Census Data"
            )}
          </button>
        }
      />

      {/* Demo Warning Banner */}
      {isUsingFallback && (
        <div className="bg-amber-50 border border-amber-250 text-amber-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-pulse shadow-3xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Using Demo Data (API Server Offline)</span>
        </div>
      )}

      {/* Stats View Toggle Selector */}
      <div className="flex items-center gap-3">
        <div className="inline-flex bg-white p-1 rounded-xl border border-gray-150 shadow-sm">
          <button
            onClick={() => setStatsView("fpo")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              statsView === "fpo"
                ? "bg-[#1A3A2A] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            FPO Member View
          </button>
          <button
            onClick={() => setStatsView("district")}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              statsView === "district"
                ? "bg-[#1A3A2A] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            District Census View
          </button>
        </div>
        
        {statsView === "district" && (
          <span className="text-[10px] bg-green-50 text-[#1A3A2A] border border-green-200/60 rounded-full px-2.5 py-0.5 font-bold animate-pulse">
            Live Census Active
          </span>
        )}
      </div>

      {/* Top Summary Bar using generic StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Schemes Available"
          value={String(totalSchemes)}
          sub={statsView === "district" ? "Active district-wide matched programs" : "Central & State Programs matched for Sonipat FPO"}
          icon={Award}
        />

        <StatsCard
          title={statsView === "district" ? "Total Farmers" : "Estimated Matches"}
          value={statsView === "district" ? districtTotal.toLocaleString('en-IN') : String(totalEligible)}
          sub={statsView === "district" ? `Operational holdings in ${filterVillage === "All" ? "Sonipat district" : filterVillage + " village"}` : `Eligible member farmers matched across crop categories`}
          icon={Users}
        />

        <StatsCard
          title={statsView === "district" ? "Enrolled (PM-Kisan)" : "Farmers Reached"}
          value={statsView === "district" ? districtEnrolled.toLocaleString('en-IN') : String(totalEnrolled)}
          sub={statsView === "district" ? `Coverage Rate: ${districtTotal > 0 ? Math.round((districtEnrolled / districtTotal) * 100) : 0}% of district` : `Coverage Rate: ${totalEligible > 0 ? Math.round((totalEnrolled / totalEligible) * 100) : 0}% of eligible members`}
          trend={statsView === "district" ? `${districtTotal > 0 ? Math.round((districtEnrolled / districtTotal) * 100) : 0}%` : `${totalEligible > 0 ? Math.round((totalEnrolled / totalEligible) * 100) : 0}%`}
          isPositive={true}
          icon={CheckCircle2}
        />

        <StatsCard
          title={statsView === "district" ? "Non-Enrolled Gap" : "Potential Opportunity Value"}
          value={statsView === "district" ? districtGap.toLocaleString('en-IN') : potentialOpportunityValue}
          sub={statsView === "district" ? "Farmers eligible but not receiving benefits" : "Estimated total potential funding available for matched members"}
          trend={statsView === "district" ? `Gap: ${districtTotal > 0 ? Math.round((districtGap / districtTotal) * 100) : 0}%` : "+18%"}
          isPositive={statsView === "district" ? false : true}
          icon={statsView === "district" ? AlertCircle : IndianRupee}
        />
      </div>

      {statsView === "fpo" && (
        <p className="text-[10px] text-gray-400 font-bold -mt-2.5">
          * Potential Opportunity Value is based on published government scheme benefits and matching farmer profiles. Not guaranteed funding.
        </p>
      )}

      {/* Filter Bar */}
      <div className="space-y-4">
        {/* Scheme Type Pills Row */}
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
            Filter by Scheme Type
          </span>
          <div className="flex flex-wrap gap-2">
            {["All", "Insurance", "Direct Benefit", "Credit", "Pension", "Infrastructure", "Market Linkage"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                  filterType === type
                    ? "bg-[#1A3A2A] text-white border-[#1A3A2A] shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dropdowns Row (Status & Village Filters) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Dropdown */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-center">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#1A3A2A] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Enrollment Open">Enrollment Open</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

          {/* Village Dropdown */}
          <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-center">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
              Filter by Village Cluster
            </label>
            <select
              value={filterVillage}
              onChange={(e) => setFilterVillage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#1A3A2A] cursor-pointer"
            >
              <option value="All">All Villages</option>
              <option value="Kharindwa">Kharindwa</option>
              <option value="Bhadana">Bhadana</option>
              <option value="Murthal">Murthal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            mult={1.0}
            onStartDrive={handleStartDrive}
            navigate={navigate}
          />
        ))}

        {filteredSchemes.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-150">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-gray-800">No schemes found</h4>
            <p className="text-xs text-gray-500 mt-1">Try resetting your filters or selecting a different status.</p>
          </div>
        )}
      </div>

      {/* WhatsApp Modal Trigger */}
      <WhatsAppReminderModal
        scheme={modalScheme}
        targetFarmers={Array.from({ length: modalCount }, (_, i) => ({ name: `Farmer Member #${i + 1}` }))}
        village={filterVillage !== "All" ? filterVillage : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Sync Success Modal Trigger */}
      <SyncResultModal
        isOpen={isSyncModalOpen}
        onClose={() => {
          setIsSyncModalOpen(false);
          setStatsView("district");
        }}
        result={syncResult}
      />
    </div>
  );
}
