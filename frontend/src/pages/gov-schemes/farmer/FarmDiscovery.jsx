import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Save,
  Compass,
  X,
  Check,
} from "lucide-react";
import { govSchemesApi } from "../../../services/apiService";

const FarmDiscovery = () => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [selectedState, setSelectedState] = useState("Haryana");
  const [selectedDistrict, setSelectedDistrict] = useState("Sonipat");
  const [selectedCrops, setSelectedCrops] = useState(["Wheat", "Rice"]);
  const [landSize, setLandSize] = useState(4.5);
  const [selectedIrrigation, setSelectedIrrigation] = useState("Drip");
  const [selectedCategories, setSelectedCategories] = useState([
    "SC",
    "Small Farmer",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [applyScheme, setApplyScheme] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const [schemes, setSchemes] = useState([]);
  const [discoveryFilters, setDiscoveryFilters] = useState({
    states: [],
    districts: [],
    crops: [],
    irrigationTypes: [],
    farmerCategories: []
  });
  const [matchBreakdown, setMatchBreakdown] = useState({});
  const [blockingFactors, setBlockingFactors] = useState([]);
  const [farmerProfile, setFarmerProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // Load saved schemes and fetch DB data
  useEffect(() => {
    const saved = localStorage.getItem("farmerSavedSchemes");
    if (saved) {
      try {
        setSavedSchemes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    govSchemesApi.getSchemes({ role: "farmer" })
      .then(res => {
        if (res && res.schemes) {
          setSchemes(res.schemes);
          if (res.discoveryFilters) setDiscoveryFilters(res.discoveryFilters);
          if (res.matchBreakdown) setMatchBreakdown(res.matchBreakdown);
          if (res.blockingFactors) setBlockingFactors(res.blockingFactors);
          if (res.farmerProfile) setFarmerProfile(res.farmerProfile);

          // Log view interactions for top 3 matching schemes
          res.schemes.slice(0, 3).forEach(s => {
            govSchemesApi.interact(s.id, "view").catch(console.error);
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch schemes:", err);
        setLoading(false);
      });
  }, []);

  const toggleSaveScheme = (schemeId) => {
    const isSaved = savedSchemes.includes(schemeId);
    let updated;
    if (isSaved) {
      updated = savedSchemes.filter((id) => id !== schemeId);
    } else {
      updated = [...savedSchemes, schemeId];
    }
    setSavedSchemes(updated);
    localStorage.setItem("farmerSavedSchemes", JSON.stringify(updated));

    // Log bookmark telemetry interaction
    govSchemesApi.interact(schemeId, "bookmark", !isSaved).catch(console.error);
  };

  const getStatusBadge = (status, statusType) => {
    const styles = {
      applied: "bg-emerald-50 text-emerald-700 border-emerald-200",
      not_applied: "bg-gray-50 text-gray-600 border-gray-200",
      active: "bg-blue-50 text-blue-700 border-blue-200",
      approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      action_needed: "bg-amber-50 text-amber-700 border-amber-200",
      recommended: "bg-purple-50 text-purple-700 border-purple-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    const icons = {
      applied: <CheckCircle className="w-3 h-3" />,
      not_applied: <Clock className="w-3 h-3" />,
      active: <CheckCircle className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      action_needed: <AlertCircle className="w-3 h-3" />,
      recommended: <TrendingUp className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />,
    };
    const finalStyle = styles[statusType] || styles.not_applied;
    const finalIcon = icons[statusType] || icons.not_applied;

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 font-medium ${finalStyle}`}
      >
        {finalIcon}
        {status}
      </span>
    );
  };

  const filteredSchemes = schemes.filter((scheme) => {
    if (
      searchQuery &&
      !scheme.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const eligibleCount = filteredSchemes.length;
  const totalCount = schemes.length;

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySuccess(true);

    // Log apply telemetry interaction
    if (applyScheme) {
      govSchemesApi.interact(applyScheme.id, "apply_click").catch(console.error);
    }

    setTimeout(() => {
      setApplySuccess(false);
      setApplyScheme(null);
    }, 2000);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <Compass className="h-5 w-5 text-brand-medium" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">
              Scheme Discovery Center
            </h1>
            <p className="text-xs text-gray-500">
              Find and apply for government schemes tailored to your profile
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Collapsible Horizontal Filters Bar on Top */}
        <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-[#f4f7f4]/15 transition-all"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-medium" />
              <span className="font-bold text-[#132a13] text-sm">
                Search Filters & Profile Matcher
              </span>
              <span className="text-[10px] bg-brand-medium/10 text-brand-medium font-bold px-2 py-0.5 rounded-full">
                {filterOpen ? "Active" : "Click to customize"}
              </span>
            </div>
            {filterOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {filterOpen && (
            <div className="p-6 space-y-6">
              {/* Responsive Grid with intentional column spanning */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
                {/* State */}
                <div className="xl:col-span-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-medium bg-white text-gray-700 font-semibold"
                  >
                    {discoveryFilters.states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="xl:col-span-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-medium bg-white text-gray-700 font-semibold"
                  >
                    {discoveryFilters.districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Land Size */}
                <div className="md:col-span-2 xl:col-span-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Land Size:{" "}
                      <span className="text-brand-medium font-bold">
                        {landSize} acres
                      </span>
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="0.5"
                    value={landSize}
                    onChange={(e) => setLandSize(parseFloat(e.target.value))}
                    className="w-full accent-[#4f772d] mt-2"
                  />
                </div>

                {/* Irrigation */}
                <div className="md:col-span-2 xl:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Irrigation
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {discoveryFilters.irrigationTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedIrrigation(type)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
                          selectedIrrigation === type
                            ? "bg-brand-medium text-white border-brand-medium"
                            : "bg-[#f4f7f4] text-gray-600 border-gray-200/60 hover:bg-gray-150"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Caste Category - Now properly expanded across elements to completely prevent crowding */}
                <div className="md:col-span-2 xl:col-span-6 mt-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Caste Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {discoveryFilters.farmerCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          if (selectedCategories.includes(cat)) {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== cat),
                            );
                          } else {
                            setSelectedCategories([...selectedCategories, cat]);
                          }
                        }}
                        className={`text-[10px] font-bold px-3.5 py-2 rounded-lg border transition-all whitespace-nowrap ${
                          selectedCategories.includes(cat)
                            ? "bg-brand-medium text-white border-brand-medium shadow-sm"
                            : "bg-[#f4f7f4] text-gray-600 border-gray-200/60 hover:bg-gray-150"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-row: Crop chips selection & Reset button */}
              <div className="pt-5 border-t border-gray-100 flex flex-wrap gap-6 items-end justify-between">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                    Crops Selection
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {discoveryFilters.crops.map((crop) => (
                      <button
                        key={crop}
                        onClick={() => {
                          if (selectedCrops.includes(crop)) {
                            setSelectedCrops(
                              selectedCrops.filter((c) => c !== crop),
                            );
                          } else {
                            setSelectedCrops([...selectedCrops, crop]);
                          }
                        }}
                        className={`text-[10px] font-bold px-3.5 py-2 rounded-xl border transition-all ${
                          selectedCrops.includes(crop)
                            ? "bg-[#132a13] text-white border-[#132a13]"
                            : "bg-gray-50 text-gray-600 border-gray-250/50 hover:bg-gray-100"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedState("Haryana");
                    setSelectedDistrict("Sonipat");
                    setSelectedCrops(["Wheat", "Rice"]);
                    setLandSize(4.5);
                    setSelectedIrrigation("Drip");
                    setSelectedCategories(["SC", "Small Farmer"]);
                    setSearchQuery("");
                  }}
                  className="px-5 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition shrink-0 h-9"
                >
                  Reset All Filters
                </button>
              </div>

              {/* AI Profile Fit Breakdown Panel */}
              <div className="pt-4 border-t border-gray-100 bg-[#f4f7f4]/25 p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-brand-medium" />
                    <h4 className="font-bold text-[#132a13] text-xs uppercase tracking-wider">
                      AI Match Probability Index
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(matchBreakdown).map(([key, data]) => (
                      <div
                        key={key}
                        className="bg-white p-2.5 rounded-lg border border-gray-150"
                      >
                        <div className="flex justify-between text-[10px] mb-1 font-bold">
                          <span className="capitalize text-gray-500">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="text-[#132a13]">
                            {data.eligible}/{data.total}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand-medium"
                            style={{
                              width: `${(data.eligible / data.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-80 shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Key Blocking Factors:
                  </p>
                  <div className="space-y-1.5">
                    {blockingFactors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs bg-red-50 text-red-700 px-3 py-1 rounded-lg border border-red-100"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-red-650 shrink-0" />
                        <span className="text-[11px] font-bold leading-none">
                          {factor.factor} (affects {factor.affects} schemes)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Grid Section */}
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search PM Kisan, KCC, PMFBY, solar pump subsidy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-medium shadow-sm text-sm"
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-bold text-[#132a13]">{eligibleCount}</span>{" "}
              eligible schemes out of{" "}
              <span className="font-bold text-gray-600">{totalCount}</span>{" "}
              total based on filters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-brand-medium/10 transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className="text-[10px] font-bold px-2 py-1 rounded-lg text-white uppercase tracking-wider"
                      style={{ backgroundColor: scheme.categoryColor }}
                    >
                      {scheme.category}
                    </span>
                    {getStatusBadge(scheme.status, scheme.statusType)}
                  </div>

                  <h3 className="font-bold text-[#132a13] text-sm mb-1 leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mb-3">
                    {scheme.dept}
                  </p>

                  <p className="text-lg font-black text-[#132a13] mb-3">
                    {scheme.benefit}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-gray-500 font-medium">
                        Match Probability
                      </span>
                      <span className="font-bold text-brand-medium">
                        {scheme.matchScore}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-medium"
                        style={{
                          width: `${scheme.matchScore}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-500 mb-3 border-t border-gray-50 pt-2.5">
                    <span className="flex items-center gap-1 font-medium text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-red-500" />
                      {scheme.deadline}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-gray-600">
                      <FileText className="w-3.5 h-3.5 text-brand-medium" />
                      {scheme.docsUploaded}/{scheme.docsRequired} docs
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 mb-4 bg-[#f4f7f4] px-2 py-1 rounded font-medium">
                    Est. Approval: {scheme.estApproval}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setApplyScheme(scheme)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        scheme.statusType !== "applied" &&
                        scheme.statusType !== "active"
                          ? "bg-brand-medium text-white hover:bg-brand-dark hover:shadow-sm"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150"
                      }`}
                      disabled={
                        scheme.statusType === "applied" ||
                        scheme.statusType === "active"
                      }
                    >
                      {scheme.statusType === "applied" ||
                      scheme.statusType === "active"
                        ? "Registered"
                        : "Apply Now"}
                    </button>
                    <button
                      onClick={() => toggleSaveScheme(scheme.id)}
                      className={`px-3 py-2 rounded-xl border transition-all duration-200 ${
                        savedSchemes.includes(scheme.id)
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500"
                      }`}
                    >
                      <Save className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Form Modal */}
      {applyScheme && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-xl relative my-auto max-h-[85vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setApplyScheme(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {applySuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <Check className="w-8 h-8 text-emerald-600 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Application Submitted!
                </h3>
                <p className="text-xs text-gray-500">
                  Your details have been registered under Reference ID: SCH-
                  {Math.floor(Math.random() * 90000) + 10000}
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-[#132a13] mb-1">
                  Apply for Government Scheme
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Please review the details below. Most fields are pre-filled
                  from your profile.
                </p>
                <div className="bg-[#f4f7f4] border border-brand-medium/10 rounded-xl p-3.5 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Selected Program
                  </p>
                  <p className="text-sm font-bold text-[#132a13] mt-0.5">
                    {applyScheme.name}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Benefit Amount:{" "}
                    <span className="font-bold text-brand-medium">
                      {applyScheme.benefit}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                      value={farmerProfile.name || ""}
                      readOnly
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                        value={farmerProfile.state || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                        value={farmerProfile.district || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Farming Experience
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                        value={farmerProfile.farmingExperience || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Landholdings (acres)
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed"
                        value={farmerProfile.landSize || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">
                      Linked Bank Account PIN
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600 cursor-not-allowed font-mono"
                      value={
                        farmerProfile.bankAccount ||
                        "[Configured Securely]"
                      }
                      readOnly
                    />
                  </div>
                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyScheme(null)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-semibold transition"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmDiscovery;
