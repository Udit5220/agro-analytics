import React, { useState } from "react";
import {
  Shield,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink,
  Phone,
  Calendar,
  MapPin,
  User,
  CreditCard,
  Landmark,
  Clock,
  Loader2,
  Info,
  Award,
  Heart,
  Users,
} from "lucide-react";
import { useRole } from "../../../context/RoleContext";
import LocationSelector from "../../../components/LocationSelector";
import { getSoilDataByPincode } from "../../../services/locationService";
import { getSchemeFinder, SCHEME_DATABASE } from "../../../logic/farmerLogic";

export default function SchemeFinder() {
  const { roleConfig } = useRole();
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });
  const [loading, setLoading] = useState(false);
  const [schemes, setSchemes] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState({
    name: "Suresh Kumar",
    landHolding: 2.5,
    category: "general", // general, sc, st, obc
    hasAadhaar: true,
    hasBankAccount: true,
  });
  const [selectedScheme, setSelectedScheme] = useState(null);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const result = await getSchemeFinder(farmerProfile, location);
      setSchemes(result);
    } catch (error) {
      console.error("Error loading schemes:", error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    loadSchemes();
  }, [location, farmerProfile.category]);

  const handleApplyScheme = (scheme) => {
    setSelectedScheme(scheme);
  };

  const getEligibilityBadge = (schemeName) => {
    if (
      schemeName.includes("PM-KISAN") ||
      schemeName.includes("PMFBY") ||
      schemeName.includes("Soil Health")
    ) {
      return { text: "Eligible", color: "green" };
    }
    return { text: "Check Eligibility", color: "orange" };
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800 max-w-7xl mx-auto w-full p-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-150">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2.5">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#31572c]" />
            <span>Scheme Finder</span>
            <span className="text-[#31572c] font-black text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent font-mono uppercase tracking-wider">
              योजना खोज
            </span>
          </h1>
          <p className="text-gray-950 text-[11px] md:text-xs mt-1 font-semibold">
            Discover government schemes, financial subsidies, and developmental grants you qualify for.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start md:self-auto px-3 py-1.5 bg-[#31572c]/10 rounded-xl text-[#31572c] text-[10px] font-black tracking-wider uppercase font-mono border border-[#31572c]/20">
          <Award className="w-3.5 h-3.5" />
          <span>सरकारी योजनाएँ</span>
        </div>
      </div>

      {/* Location Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Farmer Profile */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-widest flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-purple-600" />
              Farmer Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                <input
                  type="text"
                  value={farmerProfile.name}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  disabled
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Land Holding (acres)
                </label>
                <input
                  type="number"
                  value={farmerProfile.landHolding}
                  onChange={(e) =>
                    setFarmerProfile((prev) => ({
                      ...prev,
                      landHolding: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block">Category</label>
                <select
                  value={farmerProfile.category}
                  onChange={(e) =>
                    setFarmerProfile((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="general">General</option>
                  <option value="obc">OBC</option>
                  <option value="sc">SC</option>
                  <option value="st">ST</option>
                </select>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700">
                  Aadhaar Linked: Yes
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-700">
                  Bank Account: Yes
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-xl p-5 text-white">
            <p className="text-purple-100 text-sm">Your Eligibility Summary</p>
            <p className="text-2xl font-bold mt-1">
              {schemes?.data?.totalEligible || 0}+ Schemes
            </p>
            <p className="text-xs text-purple-100 mt-1">
              You may be eligible for multiple government schemes
            </p>
          </div>
        </div>

        {/* Right Column - Schemes */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto mb-3" />
              <p className="text-gray-500">
                Finding schemes you're eligible for...
              </p>
            </div>
          ) : schemes && schemes.data?.eligibleSchemes ? (
            <>
              {schemes.data.eligibleSchemes.map((scheme, idx) => {
                const eligibility = getEligibilityBadge(scheme.name);
                const isExpanded = selectedScheme === scheme;

                return (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-955">
                              {scheme.name}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${eligibility.color}-100 text-${eligibility.color}-700`}
                            >
                              {eligibility.text}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {scheme.fullName || scheme.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleApplyScheme(scheme)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                        >
                          Apply
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Benefit</p>
                          <p className="text-sm font-medium text-green-600">
                            {scheme.benefit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Eligibility</p>
                          <p className="text-sm">
                            {scheme.eligibility || "All farmers"}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="text-sm font-semibold mb-2">
                            Required Documents
                          </h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {scheme.documents?.map((doc, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button className="flex items-center gap-1 text-sm text-purple-600">
                              <FileText className="w-4 h-4" />
                              Download Form
                            </button>
                            <button className="flex items-center gap-1 text-sm text-purple-600">
                              <ExternalLink className="w-4 h-4" />
                              Apply Online
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer with helpline */}
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Helpline: {scheme.helpline || "1551"}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedScheme(isExpanded ? null : scheme)
                        }
                        className="text-xs text-purple-600 font-medium"
                      >
                        {isExpanded ? "Show Less" : "Show Details"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Info className="w-4 h-4" />
              How to Apply?
            </h3>
            <ol className="space-y-2 text-xs leading-relaxed text-blue-900">
              <li>
                1. Visit nearest Common Service Centre (CSC) or bank branch
              </li>
              <li>2. Carry Aadhaar card and land documents</li>
              <li>3. Fill application form (CSC operator can help)</li>
              <li>4. Submit documents and get acknowledgment</li>
              <li>5. Track status online or through helpline</li>
            </ol>
          </div>

          {/* Full Response */}
          {schemes && (
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                {schemes.text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
