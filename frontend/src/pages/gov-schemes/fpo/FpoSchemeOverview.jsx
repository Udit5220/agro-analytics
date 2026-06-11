import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatsCard, SchemeCard, WhatsAppReminderModal } from "./FpoSharedComponents";
import { AlertCircle, Award, Users, CheckCircle2, IndianRupee } from "lucide-react";

// DATA SECTION
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

export default function FpoSchemeOverview() {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVillage, setFilterVillage] = useState("All");

  // State for WhatsApp Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScheme, setModalScheme] = useState("");
  const [modalCount, setModalCount] = useState(0);

  // Village Scaling Factor to simulate filtering
  const getVillageMultiplier = (village) => {
    if (village === "Kharindwa") return 0.38; // ~320/847
    if (village === "Bhadana") return 0.34;   // ~287/847
    if (village === "Murthal") return 0.28;   // ~240/847
    return 1.0;
  };

  const mult = getVillageMultiplier(filterVillage);

  // Compute stats dynamically
  const totalSchemes = INITIAL_SCHEMES.length;
  const totalEligible = Math.round(847 * mult);
  const totalEnrolled = Math.round(634 * mult);
  const totalBenefitUnlocked = filterVillage === "All" ? "₹42.3 Lakh" : `₹${(42.3 * mult).toFixed(1)} Lakh`;

  // Filter schemes
  const filteredSchemes = INITIAL_SCHEMES.filter((scheme) => {
    const typeMatch = filterType === "All" || scheme.type === filterType;
    const statusMatch = filterStatus === "All" || scheme.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const handleStartDrive = (schemeName, count) => {
    setModalScheme(schemeName);
    setModalCount(count);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Scheme Overview"
        subtitle="Analyze active government programs and unlock farmer benefits"
      />

      {/* Top Summary Bar using generic StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Schemes Available"
          value={String(totalSchemes)}
          sub="Central & State Programs matched for Sonipat FPO"
          icon={Award}
        />

        <StatsCard
          title="Farmers Eligible"
          value={String(totalEligible)}
          sub="Out of 847 member farmers in crop clusters"
          icon={Users}
        />

        <StatsCard
          title="Farmers Enrolled"
          value={String(totalEnrolled)}
          sub={`Coverage Rate: ${totalEligible > 0 ? Math.round((totalEnrolled / totalEligible) * 100) : 0}% of eligible members`}
          trend={`${totalEligible > 0 ? Math.round((totalEnrolled / totalEligible) * 100) : 0}%`}
          isPositive={true}
          icon={CheckCircle2}
        />

        <StatsCard
          title="Total Benefit Unlocked"
          value={totalBenefitUnlocked}
          sub="Direct payouts & infrastructure grants secured this year"
          trend="+18%"
          isPositive={true}
          icon={IndianRupee}
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:gap-6">
        {/* Scheme Type */}
        <div className="flex-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 block">Scheme Type</label>
          <div className="flex flex-wrap gap-1.5">
            {["All", "Insurance", "Direct Benefit", "Credit", "Pension", "Infrastructure", "Market Linkage"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  filterType === type
                    ? "bg-[#2e4057] text-white border-[#2e4057] shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="w-full md:w-48">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 block">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#2e4057]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Enrollment Open">Enrollment Open</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>

        {/* Village */}
        <div className="w-full md:w-48">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 block">Village Filter</label>
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#2e4057]"
          >
            <option value="All">All Villages</option>
            <option value="Kharindwa">Kharindwa</option>
            <option value="Bhadana">Bhadana</option>
            <option value="Murthal">Murthal</option>
          </select>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            mult={mult}
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
    </div>
  );
}
