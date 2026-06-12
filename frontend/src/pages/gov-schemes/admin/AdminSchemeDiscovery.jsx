import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  FileCheck,
  IndianRupee,
  Building,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Tag,
  AlertCircle,
  Info,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react";
import { getAnalyticsData, saveAnalyticsData } from "./govSchemesHelper";

/*
export default function AdminSchemeDiscovery() {
  const navigate = useNavigate();
  const [activeSegment, setActiveSegment] = useState("company"); // company vs farmers
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBenefit, setSelectedBenefit] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  // Mock data for company schemes
  const companySchemes = [
    {
      id: "adm-01",
      name: "RKVY-RAFTAAR Agritech Incubator Support",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      type: "Central Government",
      benefitType: "Grant",
      benefitAmount: "₹25,00,000 Direct Seed Funding",
      sector: "Agritech",
      status: "Closing Soon",
      deadline: "2026-06-18",
      daysLeft: 8,
      matchScore: 92,
      isNew: false,
      description: "Direct grant-in-aid support for agritech startups demonstrating proof of concept and scalable MVP models.",
    },
    {
      id: "adm-02",
      name: "DPIIT Agritech Tax Holiday under Startup India",
      ministry: "DPIIT, Ministry of Commerce and Industry",
      type: "Central Government",
      benefitType: "Tax Exemption",
      benefitAmount: "100% Tax Exemption for 3 Consecutive Years",
      sector: "Startup India",
      status: "Open for Application",
      deadline: "2026-12-31",
      daysLeft: 204,
      matchScore: 88,
      isNew: true,
      description: "Income tax exemption under section 80-IAC for eligible DPIIT-recognized agricultural technology startups.",
    },
    {
      id: "adm-03",
      name: "Agri-Infrastructure Fund (AIF) Subvention",
      ministry: "Ministry of Agriculture & State Depts",
      type: "Both",
      benefitType: "Interest Subvention",
      benefitAmount: "3% Interest Subvention + Credit Guarantee cover",
      sector: "Post-Harvest",
      status: "Open for Application",
      deadline: "2026-07-15",
      daysLeft: 35,
      matchScore: 85,
      isNew: false,
      description: "Medium to long-term debt financing facility for investment in viable post-harvest management infrastructure.",
    },
    {
      id: "adm-04",
      name: "SIDBI Venture Capital Fund for MSME Agritech",
      ministry: "SIDBI",
      type: "Central Government",
      benefitType: "Collateral-Free Loan",
      benefitAmount: "Up to ₹2 Crore debt with SIDBI Guarantee",
      sector: "MSME",
      status: "Open for Application",
      deadline: "2026-08-30",
      daysLeft: 81,
      matchScore: 78,
      isNew: false,
      description: "Collateral-free developmental funding support targeted at rural MSMEs operating technological processing hubs.",
    },
    {
      id: "adm-05",
      name: "Haryana Agribusiness Export Capital Subsidy",
      ministry: "Haryana State Agriculture Department",
      type: "State Government",
      benefitType: "Capital Subsidy",
      benefitAmount: "25% Capital Subsidy up to ₹50 Lakh on machinery",
      sector: "Export",
      status: "Open for Application",
      deadline: "2026-06-25",
      daysLeft: 15,
      matchScore: 95,
      isNew: true,
      description: "Financial assistance for creating cold chain facilities, sorting lines, and primary processing for agro exports.",
    },
  ];

  // Mock data for farmer schemes
  const farmerSchemes = [
    {
      id: "fmr-01",
      name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      ministry: "Ministry of Agriculture",
      type: "Central Government",
      benefitType: "Capital Subsidy",
      benefitAmount: "₹6,00,000/year Direct Benefit Transfer",
      sector: "Organic Farming",
      status: "Open for Application",
      deadline: "2026-10-10",
      daysLeft: 122,
      matchScore: 100,
      isNew: false,
      description: "Direct financial support to landholding farmer families across the country.",
    },
    {
      id: "fmr-02",
      name: "PM Fasal Bima Yojana (Crop Insurance)",
      ministry: "Ministry of Agriculture",
      type: "Central Government",
      benefitType: "Credit Guarantee",
      benefitAmount: "Subsidized Crop Risk Cover",
      sector: "FPO Support",
      status: "Closing Soon",
      deadline: "2026-06-22",
      daysLeft: 12,
      matchScore: 94,
      isNew: false,
      description: "Uniform premium rates with state support covering crop losses due to natural calamities.",
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedBenefit("all");
    setSelectedSector("all");
    setSelectedStatus("all");
    setSelectedState("all");
  };

  const activeSchemes = activeSegment === "company" ? companySchemes : farmerSchemes;

  // Filter schemes
  const filteredSchemes = activeSchemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || s.type === selectedType;
    const matchesBenefit = selectedBenefit === "all" || s.benefitType === selectedBenefit;
    const matchesSector = selectedSector === "all" || s.sector === selectedSector;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "Closing Soon" && s.daysLeft <= 15) ||
      (selectedStatus === "Open" && s.status === "Open for Application") ||
      s.status === selectedStatus;

    return matchesSearch && matchesType && matchesBenefit && matchesSector && matchesStatus;
  });

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn">
      
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-medium" />
            Government Scheme Module
          </h1>
          <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-brand-medium rounded-full animate-ping"></span>
            Synced with official government sources: Just now
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-amber-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <p className="text-xs font-semibold leading-relaxed">
            <span className="font-black">Unlock More Matches:</span> Complete your company profile with financial turnovers and certifications to reveal 14 more matching state-level grant programs.
          </p>
        </div>
        <button 
          onClick={() => navigate("/module/gov-schemes/admin/profile")}
          className="text-xs font-bold text-amber-900 hover:text-black flex items-center gap-1 shrink-0"
        >
          Complete Profile <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-red-950 shadow-sm">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 animate-pulse" />
          <p className="text-xs font-semibold leading-relaxed">
            <span className="font-black">Critical Deadline:</span> RKVY-RAFTAAR Agritech Incubator application window closes in 8 days. You are eligible.
          </p>
        </div>
        <button 
          onClick={() => navigate("/module/gov-schemes/admin/detail/adm-01")}
          className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl transition shrink-0"
        >
          Apply Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Schemes You Qualify For</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-brand-darkest">18 Schemes</span>
          </div>
          <span className="text-[10px] text-brand-medium font-bold">12 not yet applied</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Applications</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-brand-darkest">3 Processed</span>
          </div>
          <span className="text-[10px] text-amber-600 font-bold">2 Under review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Benefits Received</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-brand-darkest">₹12.4 Lakh</span>
          </div>
          <span className="text-[10px] text-gray-500 font-semibold">Subsidy: ₹8.4L | Tax: ₹4L</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Closing Soon</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-red-700">2 Schemes</span>
          </div>
          <span className="text-[10px] text-red-600 font-bold">1 within 7 days</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3.5">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-medium" /> Filters
          </h3>
          <button 
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs pl-8 pr-2 py-2 rounded-xl text-brand-darkest font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Scheme Level</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="Central Government">Central Government</option>
              <option value="State Government">State Government</option>
              <option value="Both">Both (Shared)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Benefit Type</label>
            <select
              value={selectedBenefit}
              onChange={(e) => setSelectedBenefit(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Benefits</option>
              <option value="Grant">Grant</option>
              <option value="Capital Subsidy">Capital Subsidy</option>
              <option value="Interest Subvention">Interest Subvention</option>
              <option value="Tax Exemption">Tax Exemption</option>
              <option value="Collateral-Free Loan">Collateral-Free Loan</option>
              <option value="Credit Guarantee">Credit Guarantee</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Sector Focus</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="Agritech">Agritech</option>
              <option value="MSME">MSME</option>
              <option value="Startup India">Startup India</option>
              <option value="Post-Harvest">Post-Harvest</option>
              <option value="Export">Agro Export</option>
              <option value="Organic Farming">Organic Farming</option>
              <option value="FPO Support">FPO Support</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closing Soon">Closing Soon</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Target State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="haryana">Haryana</option>
              <option value="punjab">Punjab</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="delhi">Delhi NCT</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
          <div className="bg-white p-2 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-full md:w-auto">
              <button
                onClick={() => setActiveSegment("company")}
                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                  activeSegment === "company"
                    ? "bg-brand-darkest text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                For My Company
              </button>
              <button
                onClick={() => setActiveSegment("farmers")}
                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                  activeSegment === "farmers"
                    ? "bg-brand-darkest text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                For My Farmers / FPO Users
              </button>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
              {filteredSchemes.length} Matches Found
            </span>
          </div>

          <div className="space-y-3">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((s) => (
                <div key={s.id} className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 bg-[#f4f7f4] border-l border-b border-gray-150 px-3.5 py-1 text-[10px] font-black text-brand-darkest rounded-bl-xl flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-medium" />
                    {s.matchScore}% PROFILE MATCH
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-brand-darkest/5 text-brand-darkest px-2 py-0.5 rounded border border-brand-darkest/10">
                        {s.benefitType}
                      </span>
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                        {s.sector}
                      </span>
                      {s.isNew && (
                        <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded animate-pulse">
                          NEW
                        </span>
                      )}
                      {s.daysLeft <= 15 && (
                        <span className="text-[8px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          CLOSING SOON
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-brand-darkest pr-28 uppercase tracking-wide">
                      {s.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                      {s.ministry}
                    </p>

                    <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-2.5">
                      {s.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl mt-3.5">
                      <div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase block tracking-wider">Benefit Amount</span>
                        <span className="text-xs font-black text-brand-darkest">{s.benefitAmount}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase block tracking-wider">Application Deadline</span>
                        <span className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {s.deadline} ({s.daysLeft} days left)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-gray-100 pt-3 mt-4 justify-end">
                    <button 
                      onClick={() => navigate(`/module/gov-schemes/admin/detail/${s.id}`)}
                      className="text-xs font-bold text-gray-600 hover:text-black border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate("/module/gov-schemes/admin/tracker", { state: { autoStart: s.id } })}
                      className="text-xs font-bold text-white bg-brand-darkest hover:bg-brand-dark px-4 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      Start Application <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-150 p-8 rounded-2xl text-center shadow-sm text-brand-darkest/70">
                <Compass className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <h4 className="text-xs font-black uppercase tracking-wider mb-1">No Schemes Found</h4>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto font-semibold">
                  No programs match the selected filters. Reset search queries or expand eligibility thresholds to explore other opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
*/

// --- NEW REDESIGNED SCHEME DISCOVERY CENTER COMPONENT ---

/*
// Default Mock Data for Cohesive Platform Interaction
export const defaultAnalyticsData = {
  profileStrength: 82,
  companyProfile: {
    gstin: "06AAAAA1111A1Z1",
    cin: "U01110HR2023PTC112233",
    udyam: "UDYAM-HR-12-0004567",
    dpiit: "DPIIT-88493",
    pan: "AAAAA1111A",
    turnover: "₹18.5 Crore",
    employees: "142",
    netWorth: "₹8.2 Crore",
    yearsInOperation: "3 Years",
    statesServed: ["Haryana", "Punjab", "Rajasthan"],
    farmerNetwork: "12,400+ Farmers",
    fpoPartnerships: "8 Active FPOs",
    cropFocus: ["Paddy", "Wheat", "Mustard", "Cotton"],
    techStack: "AgroIndia Analytics Dashboard & Soil Sensors V2",
    businessCategory: "Agribusiness & Agritech SaaS Provider",
    preferredStates: ["Haryana", "Punjab"],
    growthStage: "Early Scaleup",
    fundingStage: "Series A",
  },
  events: [
    { type: "scheme_view", count: 42, label: "Schemes Viewed" },
    { type: "guide_open", count: 18, label: "Portal Guides Opened" },
    { type: "bookmark", count: 12, label: "Bookmarked" },
    { type: "apply_click", count: 9, label: "Apply Now Clicked" },
    { type: "self_reported_applied", count: 3, label: "Self-Reported Applied" },
  ],
  schemes: [
    {
      id: "adm-01",
      name: "RKVY-RAFTAAR Agritech Incubator Support",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      category: "Agritech Programs",
      level: "Central Government",
      benefitType: "Grants",
      benefitAmount: "₹25,00,000",
      deadline: "2026-06-20",
      daysLeft: 8,
      matchScore: 92,
      viewed: 15,
      guideOpened: 6,
      bookmarked: true,
      applyClicked: 4,
      selfReportedApplied: true,
      lastInteraction: "2026-06-12",
      status: "Applied (Self Reported)",
      description:
        "Direct grant-in-aid support for agritech startups demonstrating proof of concept and scalable MVP models.",
      missingRequirements: [],
      potValue: 2500000,
      eligibilitySnapshot:
        "Registered agritech startup with functional prototype, DPIIT recognized, operational under 5 years.",
    },
    {
      id: "adm-02",
      name: "DPIIT Agritech Tax Holiday under Startup India",
      ministry: "DPIIT, Ministry of Commerce and Industry",
      category: "Startup Programs",
      level: "Central Government",
      benefitType: "Tax Benefits",
      benefitAmount: "₹45,00,000",
      deadline: "2026-12-31",
      daysLeft: 204,
      matchScore: 88,
      viewed: 12,
      guideOpened: 4,
      bookmarked: false,
      applyClicked: 2,
      selfReportedApplied: false,
      lastInteraction: "2026-06-10",
      status: "Researching",
      description:
        "Income tax exemption under section 80-IAC for eligible DPIIT-recognized agricultural technology startups.",
      missingRequirements: [],
      potValue: 4500000,
      eligibilitySnapshot:
        "DPIIT Startup India certificate, incorporation post April 2016, turnover below 100cr.",
    },
    {
      id: "adm-03",
      name: "Agri-Infrastructure Fund (AIF) Subvention",
      ministry: "Ministry of Agriculture & State Depts",
      category: "Agritech Programs",
      level: "Both",
      benefitType: "Subsidies",
      benefitAmount: "₹40,00,000",
      deadline: "2026-07-15",
      daysLeft: 35,
      matchScore: 85,
      viewed: 9,
      guideOpened: 3,
      bookmarked: true,
      applyClicked: 2,
      selfReportedApplied: false,
      lastInteraction: "2026-06-11",
      status: "Ready To Apply",
      description:
        "Medium to long-term debt financing facility for investment in viable post-harvest management infrastructure.",
      missingRequirements: [],
      potValue: 4000000,
      eligibilitySnapshot:
        "Agribusiness startups, FPOs, or entrepreneurs constructing post-harvest storage hubs.",
    },
    {
      id: "adm-04",
      name: "SIDBI Venture Capital Fund for MSME Agritech",
      ministry: "SIDBI",
      category: "MSME Programs",
      level: "Central Government",
      benefitType: "Loans",
      benefitAmount: "₹80,00,000",
      deadline: "2026-08-30",
      daysLeft: 81,
      matchScore: 78,
      viewed: 4,
      guideOpened: 1,
      bookmarked: false,
      applyClicked: 1,
      selfReportedApplied: false,
      lastInteraction: "2026-06-05",
      status: "Interested",
      description:
        "Collateral-free developmental funding support targeted at rural MSMEs operating technological processing hubs.",
      missingRequirements: ["Udyam Registration Missing"],
      potValue: 8000000,
      eligibilitySnapshot:
        "Udyam registered MSME operating in agriculture value chain, minimum 3yr positive balance sheet.",
    },
    {
      id: "adm-05",
      name: "Haryana Agribusiness Export Capital Subsidy",
      ministry: "Haryana State Agriculture Department",
      category: "Export Incentives",
      level: "State Government",
      benefitType: "Export Incentives",
      benefitAmount: "₹50,00,000",
      deadline: "2026-06-25",
      daysLeft: 13,
      matchScore: 95,
      viewed: 2,
      guideOpened: 4,
      bookmarked: true,
      applyClicked: 0,
      selfReportedApplied: false,
      lastInteraction: "2026-06-12",
      status: "Ready To Apply",
      description:
        "Financial assistance for creating cold chain facilities, sorting lines, and primary processing for agro exports.",
      missingRequirements: [],
      potValue: 5000000,
      eligibilitySnapshot:
        "Agribusiness registered in Haryana, actively exporting crops with valid APEDA certificates.",
    },
    {
      id: "fmr-01",
      name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      ministry: "Ministry of Agriculture",
      category: "Agritech Programs",
      level: "Central Government",
      benefitType: "Subsidies",
      benefitAmount: "₹6,0,000/year Direct Benefit Transfer",
      deadline: "2026-10-10",
      daysLeft: 122,
      matchScore: 100,
      viewed: 18,
      guideOpened: 8,
      bookmarked: false,
      applyClicked: 5,
      selfReportedApplied: false,
      lastInteraction: "2026-06-12",
      status: "Researching",
      description:
        "Direct income support to landholding farmer families across the country.",
      missingRequirements: [],
      potValue: 600000,
      eligibilitySnapshot: "Direct income transfer for individual farmers.",
      isFarmerScheme: true,
      farmerSavedCount: 30,
    },
    {
      id: "fmr-02",
      name: "PM Fasal Bima Yojana (Crop Insurance)",
      ministry: "Ministry of Agriculture",
      category: "Agritech Programs",
      level: "Central Government",
      benefitType: "Subsidies",
      benefitAmount: "Subsidized Crop Risk Cover",
      deadline: "2026-06-22",
      daysLeft: 10,
      matchScore: 94,
      viewed: 14,
      guideOpened: 5,
      bookmarked: true,
      applyClicked: 3,
      selfReportedApplied: false,
      lastInteraction: "2026-06-11",
      status: "Ready To Apply",
      description:
        "Uniform premium rates with state support covering crop losses due to natural calamities.",
      missingRequirements: [],
      potValue: 1200000,
      eligibilitySnapshot:
        "Subsidized premium crop risk insurance cover for registered FPO farmers.",
      isFarmerScheme: true,
      farmerSavedCount: 15,
    },
  ],
  missedOpportunities: [
    {
      id: "missed-01",
      name: "National Beekeeping Honey Mission Support",
      potValue: "₹15,0,000",
      expiredDate: "2026-05-15",
      reason: "Deadline Missed",
      isFarmerScheme: true,
      farmerCount: 42,
    },
    {
      id: "missed-02",
      name: "PM Formalisation of Micro Food Processing Enterprises",
      potValue: "₹10,0,0,000",
      expiredDate: "2026-04-10",
      reason: "Required Certification Missing",
      isFarmerScheme: true,
      farmerCount: 18,
    },
  ],
  outreach: {
    farmersReached: 12400,
    campaignsSent: 12,
    notificationOpens: 4235,
    engagementRate: 84.5,
  },
  campaigns: [
    {
      id: "c-01",
      name: "PM-Kisan Seed Funding Awareness",
      channel: "WhatsApp",
      sentCount: 4500,
      opens: 3950,
      clicks: 1240,
      status: "Delivered",
      date: "2026-06-08",
    },
    {
      id: "c-02",
      name: "Crop Insurance Renewal Campaign",
      channel: "SMS",
      sentCount: 6200,
      opens: 5100,
      clicks: 840,
      status: "Completed",
      date: "2026-06-01",
    },
    {
      id: "c-03",
      name: "Drip Irrigation Subsidy Info Dispatch",
      channel: "Email",
      sentCount: 1200,
      opens: 900,
      clicks: 310,
      status: "Completed",
      date: "2026-05-25",
    },
  ],
  farmers: [
    {
      id: "f-01",
      name: "Rajesh Kumar",
      state: "Haryana",
      crop: "Paddy",
      size: "Medium",
      type: "Smallholder",
      fpo: "Sonipat Organic FPO",
      schemes: ["PM-Kisan", "PMFBY"],
      outreachStatus: "Sent",
      lastComm: "2026-06-10",
    },
    {
      id: "f-02",
      name: "Satnam Singh",
      state: "Punjab",
      crop: "Wheat",
      size: "Large",
      type: "Commercial",
      fpo: "Amritsar Farmers Union",
      schemes: ["PMFBY"],
      outreachStatus: "Interacted",
      lastComm: "2026-06-11",
    },
    {
      id: "f-03",
      name: "Suresh Sharma",
      state: "Haryana",
      crop: "Mustard",
      size: "Small",
      type: "Smallholder",
      fpo: "Rohtak Agri Cooperative",
      schemes: ["PM-Kisan"],
      outreachStatus: "Not Contacted",
      lastComm: "-",
    },
  ],
  updates: [
    {
      id: "upd-01",
      title: "New Guidelines for PMFBY H1 2026",
      type: "Policy Updates",
      date: "2026-06-11",
      summary:
        "Ministry released operational guidelines detailing new subsidy slabs for organic mustard crops in Haryana.",
    },
    {
      id: "upd-02",
      title: "Circular 24-B: Export Credit Guarantee Slabs",
      type: "New Circulars",
      date: "2026-06-05",
      summary:
        "State bank circular revising interest coverage details for agribusiness startup export credit schemes.",
    },
  ],
  alerts: [
    {
      id: "a-01",
      title: "RKVY-RAFTAAR Seed Funding Deadline Closing",
      type: "Deadlines Closing Soon",
      date: "2026-06-12",
      priority: "Critical",
      read: false,
    },
    {
      id: "a-02",
      title: "Udyam MSME Audit Certificate Expiration Alert",
      type: "Document Expirations",
      date: "2026-06-10",
      priority: "Warning",
      read: false,
    },
    {
      id: "a-03",
      title: "New Subsidy Added: Solar Pump Incentives 2026",
      type: "New Scheme Announcements",
      date: "2026-06-09",
      priority: "Info",
      read: true,
    },
  ],
};

export const getAnalyticsData = () => {
  const data = localStorage.getItem("agroindia_analytics");
  if (!data) {
    localStorage.setItem(
      "agroindia_analytics",
      JSON.stringify(defaultAnalyticsData),
    );
    return defaultAnalyticsData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultAnalyticsData;
  }
};

export const saveAnalyticsData = (data) => {
  localStorage.setItem("agroindia_analytics", JSON.stringify(data));
};
*/

export default function AdminSchemeDiscovery() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [activeSegment, setActiveSegment] = useState("company"); // company vs farmers
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all"); // all, central, state
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, open, closing_soon
  const [selectedCategory, setSelectedCategory] = useState("all"); // all, or specific categories

  // Simulated Toast/Modal State
  const [toastMessage, setToastMessage] = useState("");
  const [redirectModal, setRedirectModal] = useState(null); // scheme info for redirect modal

  useEffect(() => {
    // Sync viewed analytics event
    const updated = { ...analytics };
    const viewEvent = updated.events.find((e) => e.type === "scheme_view");
    if (viewEvent) {
      viewEvent.count += 1;
    }
    saveAnalyticsData(updated);
    setAnalytics(updated);
  }, []);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLevel("all");
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  // Filter Logic based on User Prompt requirements
  const filteredSchemes = analytics.schemes.filter((s) => {
    // Segment filtering (Company vs Farmer schemes)
    if (activeSegment === "company" && s.isFarmerScheme) return false;
    if (activeSegment === "farmers" && !s.isFarmerScheme) return false;

    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevel === "all" ||
      (selectedLevel === "central" && s.level === "Central Government") ||
      (selectedLevel === "state" && s.level === "State Government") ||
      (selectedLevel === "both" && s.level === "Both");

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "open" && s.daysLeft > 0) ||
      (selectedStatus === "closing_soon" && s.daysLeft <= 30);

    const matchesCategory =
      selectedCategory === "all" ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      s.benefitType.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesLevel && matchesStatus && matchesCategory;
  });

  // Calculate Metrics Strip context-aware
  const potentialOpportunityValue = analytics.schemes
    .filter((s) => (activeSegment === "company" ? !s.isFarmerScheme : s.isFarmerScheme))
    .reduce((sum, s) => sum + s.potValue, 0);

  const closingSoonCount = analytics.schemes
    .filter((s) => (activeSegment === "company" ? !s.isFarmerScheme : s.isFarmerScheme))
    .filter((s) => s.daysLeft <= 30).length;

  const matchedCount = analytics.schemes.filter((s) =>
    activeSegment === "company" ? !s.isFarmerScheme : s.isFarmerScheme
  ).length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleBookmark = (schemeId) => {
    const updated = { ...analytics };
    const scheme = updated.schemes.find((s) => s.id === schemeId);
    if (scheme) {
      scheme.bookmarked = !scheme.bookmarked;
      // Track Bookmark event
      const bookmarkEvent = updated.events.find((e) => e.type === "bookmark");
      if (bookmarkEvent) {
        bookmarkEvent.count += scheme.bookmarked ? 1 : -1;
      }
      saveAnalyticsData(updated);
      setAnalytics(updated);
      showToast(
        scheme.bookmarked
          ? `"${scheme.name}" bookmarked successfully!`
          : `Removed bookmark for "${scheme.name}"`,
      );
    }
  };

  const handleShare = (schemeName) => {
    navigator.clipboard.writeText(window.location.href);
    const updated = { ...analytics };
    // Track share in platform analytics (represented under scheme_view or overall engagement)
    saveAnalyticsData(updated);
    showToast(
      `Opportunity link for "${schemeName}" copied to clipboard! (Platform activity logged)`,
    );
  };

  const handleApplyClick = (scheme) => {
    // Open Portal modal to clarify redirection
    setRedirectModal(scheme);

    // Log event in platform analytics
    const updated = { ...analytics };
    const applyEvent = updated.events.find((e) => e.type === "apply_click");
    if (applyEvent) {
      applyEvent.count += 1;
    }
    const matchedScheme = updated.schemes.find((s) => s.id === scheme.id);
    if (matchedScheme) {
      matchedScheme.applyClicked = (matchedScheme.applyClicked || 0) + 1;
      matchedScheme.status = "Applied (Self Reported)";
      matchedScheme.selfReportedApplied = true;
    }
    saveAnalyticsData(updated);
    setAnalytics(updated);
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10 animate-bounce">
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
              <h3 className="font-bold text-sm uppercase tracking-wider text-brand-darkest">
                External Redirection
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              You are now leaving AgroIndia to visit the official government
              application portal for{" "}
              <span className="font-black text-brand-darkest">
                {redirectModal.name}
              </span>
              .
            </p>
            <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-xl text-[11px] text-emerald-900 leading-relaxed font-semibold">
              <span className="font-bold">AgroIndia Audit Notice:</span> We have
              logged this click in our Platform Analytics. Since this portal
              operates independently from government databases, AgroIndia does
              not access, verify, or submit application status files.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRedirectModal(null)}
                className="text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <a
                href="https://www.india.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRedirectModal(null)}
                className="text-xs font-bold text-white bg-brand-darkest hover:bg-brand-dark px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                Proceed to Official Portal{" "}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Page Header (Hero Section) */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 md:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Enterprise Opportunity Hub
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Government Opportunities Hub
          </h1>
          <p className="text-xs md:text-sm text-white/80 font-medium leading-relaxed">
            Discover grants, subsidies, startup incentives, MSME support
            programs, export incentives, agritech innovation funds, tax
            exemptions, and agricultural ecosystem schemes.
          </p>
        </div>
      </div>

      {/* Company Opportunity Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
            Matched Schemes
          </p>
          <h3 className="text-2xl font-black text-brand-darkest mt-1.5">
            {matchedCount} Schemes
          </h3>
          <p className="text-[10px] text-brand-medium font-bold mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {activeSegment === "company" ? "Derived from company profile matching" : "Derived from farmer network eligibility"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
            Potential Opportunity Value
          </p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1.5">
            ₹{(potentialOpportunityValue / 10000000).toFixed(1)} Crore+
          </h3>
          <p className="text-[10px] text-gray-500 font-semibold mt-1.5 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Sum of published scheme benefits
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
            Closing Soon
          </p>
          <h3 className="text-2xl font-black text-red-600 mt-1.5">
            {closingSoonCount} Opportunities
          </h3>
          <p className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Deadlines within 30 days
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden group hover:border-brand-medium transition">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider">
            Profile Strength
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <h3 className="text-2xl font-black text-brand-darkest">
              {analytics.profileStrength}%
            </h3>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-medium h-full rounded-full transition-all"
                style={{ width: `${analytics.profileStrength}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 font-semibold mt-1.5">
            Completion score controls recommendations
          </p>
        </div>
      </div>

      {/* Smart Search & Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-medium" /> Smart Filters
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Search Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, ministry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-medium text-xs pl-8 pr-2 py-2 rounded-xl text-brand-darkest font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Authority Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Authorities</option>
              <option value="central">Central Government</option>
              <option value="state">State Government</option>
              <option value="both">Both (Shared)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Deadline Urgency
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Timelines</option>
              <option value="open">Open Schemes</option>
              <option value="closing_soon">Closing Soon (Under 30 Days)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
              Category Focus
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-brand-darkest font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="grants">Grants</option>
              <option value="subsidies">Subsidies</option>
              <option value="tax benefits">Tax Benefits</option>
              <option value="loans">Loans</option>
              <option value="export incentives">Export Incentives</option>
              <option value="startup programs">Startup Programs</option>
              <option value="msme programs">MSME Programs</option>
              <option value="agritech programs">Agritech Programs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Segment Switcher Tab */}
      <div className="bg-white p-2 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveSegment("company")}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeSegment === "company"
                ? "bg-brand-darkest text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            For My Company
          </button>
          <button
            onClick={() => setActiveSegment("farmers")}
            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
              activeSegment === "farmers"
                ? "bg-brand-darkest text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            For My Farmers / FPO Users
          </button>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden md:block">
          {filteredSchemes.length} Matches Found
        </span>
      </div>

      {/* Scheme Cards Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>{filteredSchemes.length} MATCHING OPPORTUNITIES</span>
          <span>Verified Public Data</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between"
              >
                {/* Match Ribbon */}
                <div className="absolute top-0 right-0 bg-[#f4f7f4] border-l border-b border-gray-150 px-4 py-1 text-[10px] font-black text-brand-darkest rounded-bl-xl flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-medium" />
                  {s.matchScore}% Match
                </div>

                <div className="space-y-3">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-brand-darkest/5 text-brand-darkest px-2 py-0.5 rounded border border-brand-darkest/10">
                      {s.category}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                      {s.level}
                    </span>
                    {s.daysLeft <= 30 && (
                      <span className="text-[8px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded animate-pulse">
                        Closing Soon ({s.daysLeft}d left)
                      </span>
                    )}
                  </div>

                  {/* Title & Ministry */}
                  <div>
                    <h3 className="text-sm font-black text-brand-darkest uppercase tracking-wide pr-24">
                      {s.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                      {s.ministry}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    {s.description}
                  </p>

                  {/* Eligibility Snapshot */}
                  <div className="bg-[#f8faf8] border border-gray-100 p-2.5 rounded-xl text-[11px] text-gray-600">
                    <span className="font-bold text-brand-darkest uppercase text-[9px] block mb-1">
                      Eligibility Snapshot:
                    </span>
                    {s.eligibilitySnapshot}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs">
                    <div>
                      <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">
                        Maximum Benefit Structure
                      </span>
                      <span className="font-black text-brand-darkest text-sm">
                        {s.benefitAmount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider block">
                        Application Deadline
                      </span>
                      <span className="font-bold text-gray-700 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {s.deadline} ({s.daysLeft} days remaining)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBookmark(s.id)}
                      className={`p-2 rounded-xl border transition ${
                        s.bookmarked
                          ? "bg-amber-50 border-amber-200 text-amber-600"
                          : "bg-white border-gray-200 text-gray-400 hover:text-brand-darkest"
                      }`}
                      title="Bookmark Opportunity"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => handleShare(s.name)}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-brand-darkest transition"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(`/module/gov-schemes/admin/detail/${s.id}`)
                      }
                      className="text-xs font-bold text-gray-600 hover:text-black border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition"
                    >
                      View Details
                    </button>
                    {!s.isFarmerScheme && (
                      <button
                        onClick={() => handleApplyClick(s)}
                        className="text-xs font-bold text-white bg-brand-darkest hover:bg-brand-dark px-4 py-2 rounded-xl transition flex items-center gap-1"
                      >
                        Apply Now <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-150 p-8 rounded-2xl text-center shadow-sm text-brand-darkest/70">
              <Compass className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <h4 className="text-xs font-black uppercase tracking-wider mb-1">
                No Opportunities Matched
              </h4>
              <p className="text-[11px] text-gray-400 max-w-sm mx-auto font-semibold">
                No schemes match the selected filters. Expand your profile
                parameters to discover more state-level incentives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
