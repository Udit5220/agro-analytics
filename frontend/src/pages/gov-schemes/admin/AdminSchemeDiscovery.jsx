import React, { useState } from "react";
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
} from "lucide-react";

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
      benefitAmount: "₹6,000/year Direct Benefit Transfer",
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
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      
      {/* Upper Status Banner & Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#28a745]" />
            Government Scheme Module
          </h1>
          <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#28a745] rounded-full animate-ping"></span>
            Synced with official government sources: Just now
          </p>
        </div>
      </div>

      {/* Profile Incomplete Banner */}
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

      {/* Sticky Alerts */}
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

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Schemes You Qualify For</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-[#2e4057]">18 Schemes</span>
          </div>
          <span className="text-[10px] text-[#28a745] font-bold">12 not yet applied</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Active Applications</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-[#2e4057]">3 Processed</span>
          </div>
          <span className="text-[10px] text-amber-600 font-bold">2 Under review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Benefits Received</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-[#2e4057]">₹12.4 Lakh</span>
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

      {/* Horizontal Filters Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3.5">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#28a745]" /> Filters
          </h3>
          <button 
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* 6-Column Grid for single line filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* Search Bar */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs pl-8 pr-2 py-2 rounded-xl text-[#2e4057] font-semibold"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Scheme Level */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Scheme Level</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="Central Government">Central Government</option>
              <option value="State Government">State Government</option>
              <option value="Both">Both (Shared)</option>
            </select>
          </div>

          {/* Benefit Type */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Benefit Type</label>
            <select
              value={selectedBenefit}
              onChange={(e) => setSelectedBenefit(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
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

          {/* Sector */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Sector Focus</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
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

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closing Soon">Closing Soon</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          {/* State Select */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Target State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-xs p-2 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
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

      {/* Main Panel Feed (Full Width Stack) */}
      <div className="space-y-4">
          
          {/* Feed Toolbar Toggle */}
          <div className="bg-white p-2 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between gap-4">
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1 w-full md:w-auto">
              <button
                onClick={() => setActiveSegment("company")}
                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                  activeSegment === "company"
                    ? "bg-[#2e4057] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                For My Company
              </button>
              <button
                onClick={() => setActiveSegment("farmers")}
                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                  activeSegment === "farmers"
                    ? "bg-[#2e4057] text-white shadow-sm"
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
          <div className="space-y-3">
            {filteredSchemes.length > 0 ? (
              filteredSchemes.map((s) => (
                <div key={s.id} className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
                  {/* Matching Indicator Ribbon */}
                  <div className="absolute top-0 right-0 bg-[#f4f7f4] border-l border-b border-gray-150 px-3.5 py-1 text-[10px] font-black text-[#2e4057] rounded-bl-xl flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#28a745]" />
                    {s.matchScore}% PROFILE MATCH
                  </div>

                  <div>
                    {/* Badge Strip */}
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-[#2e4057]/5 text-[#2e4057] px-2 py-0.5 rounded border border-[#2e4057]/10">
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

                    {/* Title & Ministry */}
                    <h3 className="text-sm font-black text-[#2e4057] pr-28 uppercase tracking-wide">
                      {s.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                      {s.ministry}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed mt-2.5">
                      {s.description}
                    </p>

                    {/* Benefit Details Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-3 rounded-xl mt-3.5">
                      <div>
                        <span className="text-[8px] text-gray-400 font-bold uppercase block tracking-wider">Benefit Amount</span>
                        <span className="text-xs font-black text-[#2e4057]">{s.benefitAmount}</span>
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

                  {/* Actions footer */}
                  <div className="flex gap-2 border-t border-gray-100 pt-3 mt-4 justify-end">
                    <button 
                      onClick={() => navigate(`/module/gov-schemes/admin/detail/${s.id}`)}
                      className="text-xs font-bold text-gray-600 hover:text-black border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl transition"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => navigate("/module/gov-schemes/admin/tracker", { state: { autoStart: s.id } })}
                      className="text-xs font-bold text-white bg-[#2e4057] hover:bg-[#208837] px-4 py-2 rounded-xl transition flex items-center gap-1"
                    >
                      Start Application <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-150 p-8 rounded-2xl text-center shadow-sm text-[#2e4057]/70">
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
