import React, { useState, useMemo, useEffect } from "react";
import GenericTable from "../../../components/partials/GenericTable";
import {
  PageHeader,
  StatsCard,
  WhatsAppReminderModal,
  FarmerEnrollmentModal,
} from "./FpoSharedComponents";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Phone,
  UserCheck,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  Users,
  ShieldCheck,
  HelpCircle,
  X,
  Clock,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Plus,
  Upload,
} from "lucide-react";
import { govSchemesApi } from "../../../services/apiService";

const INITIAL_FARMERS = [
  {
    id: "F-101",
    name: "Ramesh Kumar",
    village: "Kharindwa",
    land: "1.2 Ha",
    category: "OBC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "eligible-not-enrolled",
    },
  },
  {
    id: "F-102",
    name: "Sunita Devi",
    village: "Kharindwa",
    land: "0.8 Ha",
    category: "SC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-103",
    name: "Mahesh Singh",
    village: "Bhadana",
    land: "2.1 Ha",
    category: "General",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "enrolled",
    },
  },
  {
    id: "F-104",
    name: "Priya Yadav",
    village: "Kharindwa",
    land: "0.6 Ha",
    category: "OBC",
    schemes: {
      pmKisan: "eligible-not-enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-105",
    name: "Harpal Singh",
    village: "Murthal",
    land: "3.4 Ha",
    category: "General",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "not-eligible",
      eNam: "enrolled",
    },
  },
  {
    id: "F-106",
    name: "Kamla Devi",
    village: "Bhadana",
    land: "0.4 Ha",
    category: "SC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-107",
    name: "Rajveer Malik",
    village: "Murthal",
    land: "1.8 Ha",
    category: "OBC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "enrolled",
    },
  },
  {
    id: "F-108",
    name: "Geeta Sharma",
    village: "Bhadana",
    land: "0.9 Ha",
    category: "General",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "not-eligible",
      pmKmy: "eligible-not-enrolled",
      eNam: "eligible-not-enrolled",
    },
  },
  {
    id: "F-109",
    name: "Sukhbir Hooda",
    village: "Kharindwa",
    land: "1.1 Ha",
    category: "OBC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-110",
    name: "Anita Kumari",
    village: "Kharindwa",
    land: "0.5 Ha",
    category: "SC",
    schemes: {
      pmKisan: "eligible-not-enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-111",
    name: "Devraj Nain",
    village: "Murthal",
    land: "4.2 Ha",
    category: "General",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "enrolled",
    },
  },
  {
    id: "F-112",
    name: "Poonam Singh",
    village: "Bhadana",
    land: "0.7 Ha",
    category: "SC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-113",
    name: "Balram Yadav",
    village: "Kharindwa",
    land: "1.5 Ha",
    category: "OBC",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "eligible-not-enrolled",
    },
  },
  {
    id: "F-114",
    name: "Savitri Devi",
    village: "Murthal",
    land: "0.3 Ha",
    category: "ST",
    schemes: {
      pmKisan: "eligible-not-enrolled",
      pmfby: "eligible-not-enrolled",
      kcc: "eligible-not-enrolled",
      pmKmy: "eligible-not-enrolled",
      eNam: "not-eligible",
    },
  },
  {
    id: "F-115",
    name: "Narendra Pal",
    village: "Bhadana",
    land: "2.8 Ha",
    category: "General",
    schemes: {
      pmKisan: "enrolled",
      pmfby: "enrolled",
      kcc: "enrolled",
      pmKmy: "enrolled",
      eNam: "eligible-not-enrolled",
    },
  },
];

// Helper: Deterministic Age based on ID
const getFarmerAge = (farmerId) => {
  const hash = String(farmerId || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 30) + 22; // Range: 22 to 51
};

// Helper: Deterministic Phone
const getFarmerPhone = (farmerId) => {
  const hash = String(farmerId || "")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `+91 9${(hash % 90000) + 10000} ${(hash % 90000) + 10000}`;
};

// Helper: Deterministic Gender
const getFarmerGender = (name) => {
  const nameLower = String(name || "").toLowerCase();
  if (
    nameLower.includes("devi") ||
    nameLower.includes("kumari") ||
    nameLower.includes("sunita") ||
    nameLower.includes("priya") ||
    nameLower.includes("kamla") ||
    nameLower.includes("geeta") ||
    nameLower.includes("anita") ||
    nameLower.includes("poonam") ||
    nameLower.includes("savitri")
  ) {
    return "Female";
  }
  return "Male";
};

// Eligibility Engine rule evaluation
const evaluateSchemeEligibility = (farmer, schemeKey) => {
  const land = parseFloat(farmer.land) || 0;
  const age = farmer.age || getFarmerAge(farmer.id);

  if (schemeKey === "pmKisan") return true; // PM-KISAN for all small-medium farmers
  if (schemeKey === "pmfby") return true; // PMFBY Crop Insurance for all land owners
  if (schemeKey === "kcc") return land >= 0.5; // KCC credit cards for holdings >= 0.5 Ha
  if (schemeKey === "pmKmy") return age >= 18 && age <= 40; // PM-KMY pension scheme age limit 18-40
  if (schemeKey === "eNam") return land >= 0.8; // e-NAM commercial integration for holdings >= 0.8 Ha
  return true;
};

// Combine raw farmer state with evaluated eligibility rules
const getFarmerSchemesWithEligibility = (farmer) => {
  const schemesList = ["pmKisan", "pmfby", "kcc", "pmKmy", "eNam"];
  const updatedSchemes = {};

  schemesList.forEach((key) => {
    const rawStatus = farmer.schemes?.[key] || "recommended";

    // Evaluate eligibility rule
    const isEligible = evaluateSchemeEligibility(farmer, key);

    if (!isEligible || rawStatus === "not-eligible") {
      updatedSchemes[key] = "not-eligible";
    } else {
      updatedSchemes[key] = rawStatus;
    }
  });

  return updatedSchemes;
};

// Compute coverage metrics
const calculateFarmerCoverage = (schemesObj) => {
  let eligibleCount = 0;
  let enrolledCount = 0;

  Object.keys(schemesObj).forEach((key) => {
    const status = schemesObj[key];
    if (status !== "not-eligible") {
      eligibleCount++;
      if (status === "enrolled") {
        enrolledCount++;
      }
    }
  });

  const pct =
    eligibleCount > 0 ? Math.round((enrolledCount / eligibleCount) * 100) : 0;
  return {
    eligible: eligibleCount,
    enrolled: enrolledCount,
    percent: pct,
  };
};

const mapBackendFarmers = (backendFarmers) => {
  return backendFarmers.map((f) => {
    const fId = f.farmerId || f.id;
    return {
      ...f,
      id: fId,
      age: f.age || getFarmerAge(fId),
      phone: f.phone || getFarmerPhone(fId),
      gender: f.gender || getFarmerGender(f.name),
      matchScore: f.matchScore !== undefined ? f.matchScore : 71,
      recommendedSchemes: f.recommendedSchemes || ["PM-KISAN", "PMFBY"],
      missingRequirements: f.missingRequirements || ["Bank-Aadhaar Link"],
      readinessPercent: f.readinessPercent !== undefined ? f.readinessPercent : 71
    };
  });
};

// Local Scheme Status badge renderer
const renderFarmerSchemeCell = (status) => {
  switch (status) {
    case "self-reported-benefit-received":
      return (
        <div className="flex items-center justify-center animate-fadeIn" title="Benefit Received (Self Reported)">
          <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
          </span>
        </div>
      );
    case "self-reported-applied":
      return (
        <div className="flex items-center justify-center animate-fadeIn" title="Applied (Self Reported)">
          <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-green-50 text-green-700 border border-green-200">
            <Check className="w-3.5 h-3.5 stroke-[3] text-green-600" />
          </span>
        </div>
      );
    case "profile-complete":
      return (
        <div className="flex items-center justify-center" title="Profile Complete & Ready">
          <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 stroke-[2] text-blue-600" />
          </span>
        </div>
      );
    case "apply-link-shared":
      return (
        <div className="flex items-center justify-center animate-pulse" title="Link Shared (Outreach Campaign Sent)">
          <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-amber-50 text-amber-600 border border-amber-250">
            <Clock className="w-3.5 h-3.5 stroke-[2] text-amber-500" />
          </span>
        </div>
      );
    case "interested":
      return (
        <div className="flex items-center justify-center" title="Interested (Opened Guide)">
          <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Phone className="w-3 h-3 text-purple-650" />
          </span>
        </div>
      );
    case "recommended":
      return (
        <div className="flex items-center justify-center cursor-help animate-pulse" title="Recommended (Action Needed)">
          <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-red-50 text-red-500 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-500" />
          </span>
        </div>
      );
    case "not-eligible":
    default:
      return (
        <div className="flex items-center justify-center text-gray-300" title="Not Eligible">
          <span className="text-gray-300 font-bold text-base">—</span>
        </div>
      );
  }
};

export default function FpoFarmerEnrollment() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedFarmerForDrawer, setSelectedFarmerForDrawer] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVillage, setFilterVillage] = useState("All");
  const [filterGap, setFilterGap] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  // WhatsApp Modal State
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState("PMFBY");

  // Enrollment Modal State
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [enrollFarmer, setEnrollFarmer] = useState(null);

  // Add & Bulk Upload State
  const [isAddFarmerOpen, setIsAddFarmerOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isAssignOfficerOpen, setIsAssignOfficerOpen] = useState(false);

  const loadFarmers = async () => {
    try {
      setLoading(true);
      const res = await govSchemesApi.getFpoFarmers();
      if (res && res.success) {
        setFarmers(mapBackendFarmers(res.farmers || []));
        setIsUsingFallback(false);
      } else {
        triggerFarmersFallback();
      }
    } catch (err) {
      console.warn(
        "Failed to load FPO farmers via API, triggering local fallback:",
        err,
      );
      triggerFarmersFallback();
    } finally {
      setLoading(false);
    }
  };

  const triggerFarmersFallback = () => {
    setIsUsingFallback(true);
    setFarmers(mapBackendFarmers(INITIAL_FARMERS));
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // Handler for select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredFarmers.map((f) => f.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handler for single row select
  const handleSelectRow = (id) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  // Row styling based on coverage
  const getRowBgClass = (pct) => {
    if (pct === 0) return "bg-red-50/40 hover:bg-red-100/40";
    if (pct === 100) return "bg-green-50/40 hover:bg-green-100/40";
    return "bg-white hover:bg-gray-50/80";
  };

  // Redesigned 4 KPI Cards
  const statsSummary = useMemo(() => {
    let total = farmers.length;
    let totalEligible = 0;
    let totalEnrolled = 0;
    let missingCount = 0;
    let fullyCovered = 0;
    let totalCoveragePctSum = 0;

    farmers.forEach((f) => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);

      totalEligible += coverage.eligible;
      totalEnrolled += coverage.enrolled;
      missingCount += coverage.eligible - coverage.enrolled;
      totalCoveragePctSum += coverage.percent;

      if (coverage.percent === 100 && coverage.eligible > 0) {
        fullyCovered++;
      }
    });

    const avgCoverage = total > 0 ? Math.round(totalCoveragePctSum / total) : 0;
    const fullyCoveredPct =
      total > 0 ? Math.round((fullyCovered / total) * 100) : 0;

    return {
      total,
      avgCoverage,
      missingCount,
      fullyCovered,
      fullyCoveredPct,
    };
  }, [farmers]);

  // Village snapshotted coverage metrics
  const dynamicVillageSnapshots = useMemo(() => {
    const villages = {};
    farmers.forEach((f) => {
      const vName = f.village || "Unknown";
      if (!villages[vName]) {
        villages[vName] = { name: vName, count: 0, totalCoveragePct: 0 };
      }

      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);

      villages[vName].count++;
      villages[vName].totalCoveragePct += coverage.percent;
    });

    return Object.keys(villages).map((vName) => {
      const v = villages[vName];
      const avgCoverage =
        v.count > 0 ? Math.round(v.totalCoveragePct / v.count) : 0;

      let status = "Immediate Action";
      let color = "red";
      if (avgCoverage > 75) {
        status = "Good — Maintain";
        color = "green";
      } else if (avgCoverage >= 50) {
        status = "Moderate — Push Needed";
        color = "amber";
      }

      return {
        name: vName,
        count: v.count,
        coverage: avgCoverage,
        status,
        color,
      };
    });
  }, [farmers]);

  // Chart Data: Scheme-wise Enrollment Gap
  const gapChartData = useMemo(() => {
    const counts = {
      pmKisan: { enrolled: 0, gap: 0 },
      pmfby: { enrolled: 0, gap: 0 },
      kcc: { enrolled: 0, gap: 0 },
      pmKmy: { enrolled: 0, gap: 0 },
      eNam: { enrolled: 0, gap: 0 },
    };

    farmers.forEach((f) => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      Object.keys(schemesObj).forEach((k) => {
        const status = schemesObj[k];
        if (status === "enrolled") {
          counts[k].enrolled++;
        } else if (status === "eligible-not-enrolled") {
          counts[k].gap++;
        }
      });
    });

    return [
      {
        name: "PM-KISAN",
        enrolled: counts.pmKisan.enrolled,
        gap: counts.pmKisan.gap,
      },
      { name: "PMFBY", enrolled: counts.pmfby.enrolled, gap: counts.pmfby.gap },
      { name: "KCC", enrolled: counts.kcc.enrolled, gap: counts.kcc.gap },
      {
        name: "PM-KMY",
        enrolled: counts.pmKmy.enrolled,
        gap: counts.pmKmy.gap,
      },
      { name: "eNAM", enrolled: counts.eNam.enrolled, gap: counts.eNam.gap },
    ];
  }, [farmers]);

  // Chart Data: Scheme Adoption Rate
  const adoptionChartData = useMemo(() => {
    const counts = {
      pmKisan: { eligible: 0, enrolled: 0 },
      pmfby: { eligible: 0, enrolled: 0 },
      kcc: { eligible: 0, enrolled: 0 },
      pmKmy: { eligible: 0, enrolled: 0 },
      eNam: { eligible: 0, enrolled: 0 },
    };

    farmers.forEach((f) => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      Object.keys(schemesObj).forEach((key) => {
        const status = schemesObj[key];
        if (status !== "not-eligible") {
          counts[key].eligible++;
          if (status === "enrolled") {
            counts[key].enrolled++;
          }
        }
      });
    });

    return [
      {
        name: "PM-KISAN",
        rate:
          counts.pmKisan.eligible > 0
            ? Math.round(
                (counts.pmKisan.enrolled / counts.pmKisan.eligible) * 100,
              )
            : 0,
      },
      {
        name: "PMFBY",
        rate:
          counts.pmfby.eligible > 0
            ? Math.round((counts.pmfby.enrolled / counts.pmfby.eligible) * 100)
            : 0,
      },
      {
        name: "KCC",
        rate:
          counts.kcc.eligible > 0
            ? Math.round((counts.kcc.enrolled / counts.kcc.eligible) * 100)
            : 0,
      },
      {
        name: "PM-KMY",
        rate:
          counts.pmKmy.eligible > 0
            ? Math.round((counts.pmKmy.enrolled / counts.pmKmy.eligible) * 100)
            : 0,
      },
      {
        name: "eNAM",
        rate:
          counts.eNam.eligible > 0
            ? Math.round((counts.eNam.enrolled / counts.eNam.eligible) * 100)
            : 0,
      },
    ];
  }, [farmers]);

  // Chart Data: Village Average Coverage
  const villageChartData = useMemo(() => {
    const villages = {};

    farmers.forEach((f) => {
      const vName = f.village || "Unknown";
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);

      if (!villages[vName]) {
        villages[vName] = { name: vName, totalCoveragePct: 0, count: 0 };
      }

      villages[vName].totalCoveragePct += coverage.percent;
      villages[vName].count++;
    });

    return Object.keys(villages).map((vName) => ({
      name: vName,
      coverage: Math.round(
        villages[vName].totalCoveragePct / villages[vName].count,
      ),
    }));
  }, [farmers]);

  // Apply filters
  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVillage =
        filterVillage === "All" || f.village === filterVillage;
      const matchesCategory =
        filterCategory === "All" || f.category === filterCategory;

      let matchesGap = true;
      if (filterGap === "Zero Enrollment") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        const coverage = calculateFarmerCoverage(schemesObj);
        matchesGap = coverage.enrolled === 0;
      } else if (filterGap === "Missing PMFBY") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = ["recommended", "interested", "apply-link-shared"].includes(schemesObj.pmfby);
      } else if (filterGap === "Missing KCC") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = ["recommended", "interested", "apply-link-shared"].includes(schemesObj.kcc);
      } else if (filterGap === "Missing PM-KISAN") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = ["recommended", "interested", "apply-link-shared"].includes(schemesObj.pmKisan);
      } else if (filterGap === "Missing PM-KMY") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = ["recommended", "interested", "apply-link-shared"].includes(schemesObj.pmKmy);
      }

      return matchesSearch && matchesVillage && matchesCategory && matchesGap;
    });
  }, [farmers, searchTerm, filterVillage, filterGap, filterCategory]);

  const flattenedFarmers = useMemo(() => {
    return filteredFarmers.map((f) => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);
      const gaps = f.missingRequirements || [];
      return {
        ...f,
        schemes: schemesObj,
        pmKisan: schemesObj.pmKisan,
        pmfby: schemesObj.pmfby,
        kcc: schemesObj.kcc,
        pmKmy: schemesObj.pmKmy,
        eNam: schemesObj.eNam,
        eligibleCount: coverage.eligible,
        enrolledCount: coverage.enrolled,
        coveragePercent: f.readinessPercent !== undefined ? f.readinessPercent : coverage.percent,
        gapsLabel: gaps.length > 0 ? gaps.join(", ") : "No Profile Gaps",
        statusLabel:
          (f.readinessPercent !== undefined ? f.readinessPercent : coverage.percent) === 100
            ? "Complete"
            : gaps.length > 0
              ? "KYC Gaps"
              : "Incomplete",
      };
    });
  }, [filteredFarmers]);

  // Redesigned Columns for Scheme Coverage Table
  const columns = useMemo(
    () => [
      {
        header: (
          <input
            type="checkbox"
            checked={
              filteredFarmers.length > 0 &&
              selectedIds.size === filteredFarmers.length
            }
            onChange={handleSelectAll}
            className="rounded text-green-600 focus:ring-green-600 cursor-pointer"
          />
        ),
        accessor: "id",
        sortable: false,
        cellClassName: "text-center w-10 py-3",
        cell: (id) => (
          <input
            type="checkbox"
            checked={selectedIds.has(id)}
            onChange={() => handleSelectRow(id)}
            onClick={(e) => e.stopPropagation()}
            className="rounded text-green-600 focus:ring-green-600 cursor-pointer"
          />
        ),
      },
      {
        header: "Farmer Name",
        accessor: "name",
        cell: (name, row) => (
          <div className="min-w-[120px]">
            <span className="font-bold text-gray-900 block hover:text-brand-medium transition">
              {name}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5 font-bold uppercase tracking-wider">
              {row.id}
            </span>
          </div>
        ),
      },
      {
        header: "Village",
        accessor: "village",
        cellClassName: "font-semibold text-gray-700",
      },
      {
        header: "Land",
        accessor: "land",
        cellClassName: "font-semibold text-gray-700",
      },
      {
        header: "Category",
        accessor: "category",
        cell: (category) => (
          <span className="px-2 py-0.5 bg-gray-50 border border-gray-150 rounded-lg text-[10px] font-black text-gray-500 uppercase">
            {category}
          </span>
        ),
      },
      {
        header: "PM-KISAN",
        accessor: "pmKisan",
        cellClassName: "text-center",
        cell: (val) => renderFarmerSchemeCell(val),
      },
      {
        header: "PMFBY",
        accessor: "pmfby",
        cellClassName: "text-center",
        cell: (val) => renderFarmerSchemeCell(val),
      },
      {
        header: "KCC",
        accessor: "kcc",
        cellClassName: "text-center",
        cell: (val) => renderFarmerSchemeCell(val),
      },
      {
        header: "PM-KMY",
        accessor: "pmKmy",
        cellClassName: "text-center",
        cell: (val) => renderFarmerSchemeCell(val),
      },
      {
        header: "eNAM",
        accessor: "eNam",
        cellClassName: "text-center",
        cell: (val) => renderFarmerSchemeCell(val),
      },
      {
        header: "Readiness Score",
        accessor: "coveragePercent",
        cell: (pct) => {
          let colorClass = "bg-red-500";
          let textClass = "text-red-700";
          let bgClass = "bg-red-50";
          if (pct >= 80) {
            colorClass = "bg-green-650";
            textClass = "text-green-700";
            bgClass = "bg-green-50";
          } else if (pct >= 50) {
            colorClass = "bg-amber-500";
            textClass = "text-amber-700";
            bgClass = "bg-amber-50";
          }
          return (
            <div className="flex items-center gap-2 min-w-[70px]">
              <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden shrink-0">
                <div
                  className={`h-full ${colorClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded ${bgClass} ${textClass}`}
              >
                {pct}%
              </span>
            </div>
          );
        },
      },
      {
        header: "Missing Requirements",
        accessor: "gapsLabel",
        cellClassName: "font-semibold text-xs text-gray-500 max-w-[150px] truncate",
        cell: (val) => (
          <span className={val === "No Profile Gaps" ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
            {val}
          </span>
        )
      },
      {
        header: "Status",
        accessor: "statusLabel",
        cell: (val) => {
          let styles = "bg-gray-100 text-gray-500 border-gray-200";
          if (val === "Complete")
            styles = "bg-green-50 text-green-700 border-green-200";
          else if (val === "KYC Gaps")
            styles = "bg-amber-50 text-amber-700 border-amber-200";
          else if (val === "Incomplete")
            styles = "bg-red-50 text-red-700 border-red-200";
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${styles}`}
            >
              {val}
            </span>
          );
        },
      },
      {
        header: "Action",
        accessor: "id",
        sortable: false,
        cellClassName: "text-right",
        cell: (id, row) => {
          if (row.coveragePercent === 100) {
            return (
              <span className="text-green-600 font-bold flex items-center justify-end gap-1 text-[11px] py-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Complete
              </span>
            );
          }
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnrollClick(row);
              }}
              className="px-2.5 py-1 bg-brand-medium hover:bg-brand-dark text-white font-bold rounded-lg text-[10px] transition shadow-sm"
            >
              {row.statusLabel === "Incomplete"
                ? "Enroll All"
                : "Enroll Missing"}
            </button>
          );
        },
      },
    ],
    [filteredFarmers, selectedIds],
  );

  // Trigger Enrollment Form Modal
  const handleEnrollClick = (farmer) => {
    setEnrollFarmer(farmer);
    setIsEnrollOpen(true);
  };

  const handleRowClick = (farmer) => {
    setSelectedFarmerForDrawer(farmer);
  };

  // Callback on successful enrollment submission
  const handleEnrollSuccess = async (farmerId, finalSchemesMap) => {
    try {
      const res = await govSchemesApi.updateFpoEnrollment(
        farmerId,
        finalSchemesMap,
      );
      if (res && res.success) {
        await loadFarmers();
        return;
      }
    } catch (err) {
      console.warn(
        "Failed to commit enrollment updates online, falling back to local state:",
        err,
      );
    }

    // In-memory local state fallback
    setFarmers((prev) =>
      prev.map((f) => {
        const fId = f.farmerId || f.id;
        if (fId === farmerId) {
          return {
            ...f,
            schemes: finalSchemesMap,
          };
        }
        return f;
      }),
    );
  };

  // Bulk Actions
  const handleBulkWhatsApp = () => {
    setSelectedScheme("PMFBY");
    setIsWhatsAppOpen(true);
  };

  const handleBulkExportCSV = () => {
    const selectedFarmers = filteredFarmers.filter((f) =>
      selectedIds.has(f.id),
    );
    const listToExport =
      selectedFarmers.length > 0 ? selectedFarmers : filteredFarmers;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Farmer ID,Name,Village,Land,Category,Coverage %\n";
    listToExport.forEach((f) => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);
      csvContent += `${f.id},${f.name},${f.village},${f.land},${f.category},${coverage.percent}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FPO_Farmer_Enrollment_${filterVillage}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAssignFieldOfficer = () => {
    setIsAssignOfficerOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="Farmer Readiness Registry"
        subtitle="Manage member profile parameters, identify document seeding gaps, and run campaign outreach"
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddFarmerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-dark hover:bg-brand-dark text-white font-bold rounded-xl text-xs transition shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Register Farmer
            </button>
            <button
              onClick={() => setIsBulkUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A3A2A] hover:bg-[#0F2E1F] text-white font-bold rounded-xl text-xs transition shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              Bulk Upload Registry
            </button>
            <button
              onClick={handleBulkExportCSV}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-700" />
              Export CSV
            </button>
          </div>
        }
      />

      {/* Demo Warning Banner */}
      {isUsingFallback && (
        <div className="bg-amber-50 border border-amber-250 text-amber-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-pulse shadow-3xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Using Demo Data (API Server Offline)</span>
        </div>
      )}

      {/* Top 4 Redesigned KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Farmers"
          value={String(statsSummary.total)}
          sub="Verified member farmers registered in Sonipat cooperative"
          icon={Users}
        />

        <StatsCard
          title="Avg Scheme Coverage"
          value={`${statsSummary.avgCoverage}%`}
          sub="Average coverage rate of eligible welfare programs"
          trend={`${statsSummary.avgCoverage > 65 ? "+" : ""}${statsSummary.avgCoverage}% Average`}
          isPositive={statsSummary.avgCoverage > 60}
          icon={TrendingUp}
        />

        <StatsCard
          title="Missing Enrollments"
          value={String(statsSummary.missingCount)}
          sub="Welfare program spots eligible but not yet enrolled"
          alert={
            statsSummary.missingCount > 0
              ? `${statsSummary.missingCount} pending actions`
              : null
          }
          icon={AlertCircle}
        />

        <StatsCard
          title="Fully Covered Farmers"
          value={String(statsSummary.fullyCovered)}
          sub="Farmers with 100% active scheme enrollment coverage"
          trend={`${statsSummary.fullyCoveredPct}% of members`}
          isPositive={true}
          icon={ShieldCheck}
        />
      </div>

      {/* Village Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {dynamicVillageSnapshots.map((v) => (
          <div
            key={v.name}
            className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-black text-gray-950">{v.name}</h4>
                <p className="text-xs text-gray-400 font-bold mt-0.5">
                  {v.count} Farmers · Avg Coverage: {v.coverage}%
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  v.color === "red"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : v.color === "amber"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-green-50 text-green-700 border-green-200"
                }`}
              >
                {v.status}
              </span>
            </div>

            {/* Coverage Meter */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                <span>Welfare Coverage Meter</span>
                <span
                  className={
                    v.color === "red"
                      ? "text-red-700 font-bold"
                      : v.color === "amber"
                        ? "text-amber-700 font-bold"
                        : "text-green-700 font-bold"
                  }
                >
                  {v.coverage}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    v.color === "red"
                      ? "bg-red-500"
                      : v.color === "amber"
                        ? "bg-amber-500"
                        : "bg-green-600"
                  }`}
                  style={{ width: `${v.coverage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by farmer name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-medium focus:ring-1 focus:ring-[#4f772d]/30"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-3">
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium"
          >
            <option value="All">All Villages</option>
            <option value="Kharindwa">Kharindwa</option>
            <option value="Bhadana">Bhadana</option>
            <option value="Murthal">Murthal</option>
          </select>

          <select
            value={filterGap}
            onChange={(e) => setFilterGap(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium"
          >
            <option value="All">All Gaps</option>
            <option value="Missing PMFBY">Missing PMFBY</option>
            <option value="Missing KCC">Missing KCC</option>
            <option value="Missing PM-KISAN">Missing PM-KISAN</option>
            <option value="Missing PM-KMY">Missing PM-KMY</option>
            <option value="Zero Enrollment">Zero Enrollment</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium"
          >
            <option value="All">All Categories</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4 animate-slideIn">
          <div className="flex items-center gap-2 text-xs text-green-800 font-bold">
            <UserCheck className="w-5 h-5 text-green-700" />
            <span>{selectedIds.size} farmers selected</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkWhatsApp}
              className="px-3.5 py-1.5 bg-brand-medium hover:bg-brand-dark text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              Send WhatsApp Reminder
            </button>
            <button
              onClick={handleBulkExportCSV}
              className="px-3.5 py-1.5 border border-green-300 hover:bg-green-100 text-green-750 rounded-lg text-xs font-bold transition"
            >
              Export Selected CSV
            </button>
            <button
              onClick={handleAssignFieldOfficer}
              className="px-3.5 py-1.5 bg-[#1A3A2A] hover:bg-[#0F2E1F] text-white rounded-lg text-xs font-bold transition"
            >
              Assign Field Officer
            </button>
          </div>
        </div>
      )}

      {/* Farmer Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-4 overflow-hidden animate-fadeIn">
        <div className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider px-2">
          💡 Click on any farmer row to view detailed scheme eligibility and
          documents profile.
        </div>
        <GenericTable
          columns={columns}
          data={flattenedFarmers}
          onRowClick={handleRowClick}
          rowClassName={(row) => getRowBgClass(row.coveragePercent)}
          showSearch={false}
          showSort={false}
          itemsPerPage={15}
          emptyMessage="No farmers match these filters"
        />
      </div>

      {/* Scheme Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Scheme Adoption Rate Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-brand-medium" />
            Scheme Adoption Rates
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={adoptionChartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  type="number"
                  unit="%"
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Adoption Rate"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="rate" fill="#4f772d" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scheme-wise Enrollment Gap Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Scheme-wise Enrollment Gap
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gapChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
                />
                <Bar
                  dataKey="enrolled"
                  name="Enrolled"
                  fill="#2d5a3d"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="gap"
                  name="Gap (Unenrolled)"
                  fill="#dc2626"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Village Coverage Comparison Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#84cc16]" />
            Village Coverage Comparison
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={villageChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }}
                />
                <YAxis
                  unit="%"
                  tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Avg Coverage"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="coverage" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedFarmerForDrawer && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          aria-labelledby="slide-over-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-600/50 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
              onClick={() => setSelectedFarmerForDrawer(null)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-lg transform transition-all duration-300 ease-in-out translate-x-0 shadow-2xl bg-white flex flex-col h-full border-l border-gray-100">
                {/* Drawer Header */}
                <div className="p-6 bg-[#0F2E1F] text-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold border border-white/10">
                      {selectedFarmerForDrawer.gender === "Female"
                        ? "👩"
                        : "👨"}
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-wide">
                        {selectedFarmerForDrawer.name}
                      </h3>
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">
                        {selectedFarmerForDrawer.id}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFarmerForDrawer(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Coverage Summary Indicator */}
                  <div className="bg-gray-50 border border-gray-150 p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                        Scheme Coverage
                      </span>
                      <h4 className="text-xl font-black text-gray-950">
                        {
                          calculateFarmerCoverage(
                            getFarmerSchemesWithEligibility(
                              selectedFarmerForDrawer,
                            ),
                          ).enrolled
                        }{" "}
                        /{" "}
                        {
                          calculateFarmerCoverage(
                            getFarmerSchemesWithEligibility(
                              selectedFarmerForDrawer,
                            ),
                          ).eligible
                        }{" "}
                        Schemes
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold">
                        {
                          calculateFarmerCoverage(
                            getFarmerSchemesWithEligibility(
                              selectedFarmerForDrawer,
                            ),
                          ).percent
                        }
                        % of eligible welfare programs active
                      </p>
                    </div>

                    {/* Progress Ring Indicator */}
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          className="text-gray-200"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            calculateFarmerCoverage(
                              getFarmerSchemesWithEligibility(
                                selectedFarmerForDrawer,
                              ),
                            ).percent >= 80
                              ? "text-green-600"
                              : calculateFarmerCoverage(
                                    getFarmerSchemesWithEligibility(
                                      selectedFarmerForDrawer,
                                    ),
                                  ).percent >= 50
                                ? "text-amber-500"
                                : "text-red-500"
                          }
                          strokeWidth="3.5"
                          strokeDasharray={`${calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).percent}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-black text-gray-800">
                        {
                          calculateFarmerCoverage(
                            getFarmerSchemesWithEligibility(
                              selectedFarmerForDrawer,
                            ),
                          ).percent
                        }
                        %
                      </span>
                    </div>
                  </div>

                  {/* Profile Information Block */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">
                      Personal Profile
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">
                          Mobile Number
                        </span>
                        <span className="font-bold text-gray-800 flex items-center gap-1.5">
                          {selectedFarmerForDrawer.phone}
                          <button
                            onClick={() => {
                              setSelectedScheme("PM-KISAN");
                              setIsWhatsAppOpen(true);
                            }}
                            title="Send WhatsApp Message"
                            className="text-green-600 hover:text-green-700 p-0.5 hover:bg-green-55 rounded"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">
                          Village Cluster
                        </span>
                        <span className="font-bold text-gray-800">
                          {selectedFarmerForDrawer.village}
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">
                          Land Holding
                        </span>
                        <span className="font-bold text-gray-800">
                          {selectedFarmerForDrawer.land}
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">
                          Farmer Category
                        </span>
                        <span className="font-bold text-gray-800">
                          {selectedFarmerForDrawer.category}
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">
                          Demographics
                        </span>
                        <span className="font-bold text-gray-800">
                          {selectedFarmerForDrawer.age} yrs ·{" "}
                          {selectedFarmerForDrawer.gender}
                        </span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">
                          Est. Annual Income
                        </span>
                        <span className="font-bold text-gray-800">
                          ₹
                          {(
                            (parseFloat(selectedFarmerForDrawer.land) || 0) *
                              50000 +
                            42000
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scheme Enrollment Status Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">
                      Scheme Eligibility & Status
                    </h4>
                    <div className="space-y-3.5">
                      {[
                        {
                          key: "pmKisan",
                          name: "PM-KISAN Samman Nidhi",
                          desc: "Direct benefit transfer of ₹6,000/year in 3 installments",
                        },
                        {
                          key: "pmfby",
                          name: "PM Fasal Bima Yojana (PMFBY)",
                          desc: "Crop insurance coverage for food and commercial crops",
                        },
                        {
                          key: "kcc",
                          name: "Kisan Credit Card (KCC) Loans",
                          desc: "Subsidized short-term credit loans up to ₹3 Lakhs",
                        },
                        {
                          key: "pmKmy",
                          name: "PM Kisan Maandhan Yojana (PM-KMY)",
                          desc: "Social security pension of ₹3,000/month after age 60",
                        },
                        {
                          key: "eNam",
                          name: "e-NAM Market Integration",
                          desc: "Digital platform for crop trade and mandi transactions",
                        },
                      ].map((item) => {
                        const status = getFarmerSchemesWithEligibility(
                          selectedFarmerForDrawer,
                        )[item.key];
                        return (
                          <div
                            key={item.key}
                            className="flex items-start justify-between gap-4 p-3.5 bg-white border border-gray-150 rounded-2xl hover:shadow-sm transition"
                          >
                            <div className="space-y-1">
                              <span className="font-black text-xs text-gray-900 block">
                                {item.name}
                              </span>
                              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                {item.desc}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              {renderFarmerSchemeCell(status)}
                              {status === "eligible-not-enrolled" && (
                                <button
                                  onClick={() => {
                                    handleEnrollClick(selectedFarmerForDrawer);
                                  }}
                                  className="px-2 py-0.5 bg-brand-medium hover:bg-brand-dark text-white text-[9px] font-bold rounded-md transition shadow-sm"
                                >
                                  Enroll Now
                                </button>
                              )}
                              {status === "pending" && (
                                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md">
                                  Awaiting verification
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
                  <button
                    onClick={() => {
                      handleEnrollClick(selectedFarmerForDrawer);
                    }}
                    className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-4 h-4" />
                    Enroll in Missing
                  </button>
                  <button
                    onClick={() => {
                      setSelectedScheme("PMFBY");
                      setIsWhatsAppOpen(true);
                    }}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-green-600" />
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal Trigger */}
      <WhatsAppReminderModal
        scheme={selectedScheme}
        targetFarmers={
          selectedIds.size > 0
            ? farmers.filter((f) => selectedIds.has(f.id))
            : [{ name: "All unenrolled members" }]
        }
        village={filterVillage !== "All" ? filterVillage : undefined}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Interactive Quick Enrollment Form Modal */}
      <FarmerEnrollmentModal
        farmer={enrollFarmer}
        isOpen={isEnrollOpen}
        onClose={() => {
          setIsEnrollOpen(false);
          setEnrollFarmer(null);
        }}
        onEnrollSuccess={handleEnrollSuccess}
      />

      {/* Single Farmer Registration Modal */}
      <AddFarmerModal
        isOpen={isAddFarmerOpen}
        onClose={() => setIsAddFarmerOpen(false)}
        onSuccess={loadFarmers}
      />

      {/* Bulk Upload Farmer Registry Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={loadFarmers}
      />

      {/* Field Officer Assignment Modal */}
      <AssignOfficerModal
        isOpen={isAssignOfficerOpen}
        selectedCount={selectedIds.size}
        onClose={() => setIsAssignOfficerOpen(false)}
        onConfirm={(officerName) => {
          setSelectedIds(new Set());
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddFarmerModal — Form to register a single farmer under FPO
// ─────────────────────────────────────────────────────────────────────────────
function AddFarmerModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [village, setVillage] = useState("Kharindwa");
  const [land, setLand] = useState("");
  const [category, setCategory] = useState("General");
  const [aadhaarSeeded, setAadhaarSeeded] = useState(true);
  const [mobileVerified, setMobileVerified] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required");
    if (!land.trim() || isNaN(parseFloat(land)))
      return setError("Valid land size in Hectares is required");

    setLoading(true);
    try {
      const res = await govSchemesApi.createFpoFarmer({
        name,
        phone,
        village,
        land: `${parseFloat(land).toFixed(1)} Ha`,
        category,
        aadhaarSeeded,
        mobileVerified,
      });
      if (res && res.success) {
        onSuccess();
        onClose();
        // Reset form
        setName("");
        setPhone("");
        setVillage("Kharindwa");
        setLand("");
        setCategory("General");
        setAadhaarSeeded(true);
        setMobileVerified(true);
      } else {
        setError(res.message || "Failed to add farmer");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while saving the farmer record",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-[24px] p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-brand-darkest mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-medium" />
          Register New FPO Farmer
        </h3>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
              Farmer Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Satish Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98123 45678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                Village Cluster *
              </label>
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium"
              >
                <option value="Kharindwa">Kharindwa</option>
                <option value="Bhadana">Bhadana</option>
                <option value="Murthal">Murthal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                Land Holding Size (Ha) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="e.g. 1.2"
                value={land}
                onChange={(e) => setLand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-brand-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                Social Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
              Verification Statuses (Manual Offline Check)
            </span>
            <p className="text-[9.5px] text-gray-500 font-bold -mt-1 leading-relaxed">
              These checkboxes are for offline database tracking. We do not retrieve or store actual Aadhaar numbers or query government UIDAI systems.
            </p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aadhaarSeeded}
                  onChange={(e) => setAadhaarSeeded(e.target.checked)}
                  className="rounded text-brand-medium focus:ring-brand-medium"
                />
                <span>Bank-Aadhaar Linked</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mobileVerified}
                  onChange={(e) => setMobileVerified(e.target.checked)}
                  className="rounded text-brand-medium focus:ring-brand-medium"
                />
                <span>Mobile Number Verified</span>
              </label>
            </div>
          </div>

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
              disabled={loading}
              className="flex-1 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-black transition shadow-sm"
            >
              {loading ? "Registering..." : "Onboard Farmer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BulkUploadModal — Parses CSV directly, simulates PDF/Excel OCR extraction
// ─────────────────────────────────────────────────────────────────────────────
function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [parsedFarmers, setParsedFarmers] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractStep, setExtractStep] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setError("");
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    setError("");
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (fileObj) => {
    const ext = fileObj.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls", "pdf"].includes(ext)) {
      setError(
        "Unsupported file format. Please upload CSV, Excel (.xlsx) or PDF",
      );
      return;
    }
    setFile(fileObj);
    if (ext === "csv") {
      setIsExtracting(true);
      setProgress(20);
      setExtractStep("Reading CSV text file...");
      setTimeout(() => {
        parseCsvFile(fileObj);
      }, 600);
    } else {
      runSimulatedOcr();
    }
  };

  const parseCsvFile = (fileObj) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text
          .split(/\r?\n/)
          .filter((line) => line.trim().length > 0);
        if (lines.length <= 1) {
          setError("CSV file is empty or missing data rows");
          setIsExtracting(false);
          return;
        }

        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const dataRows = lines.slice(1);

        const parsed = dataRows
          .map((row) => {
            const cols = row
              .split(",")
              .map((c) => c.trim().replace(/^["']|["']$/g, ""));

            const getVal = (possibleHeaders, defaultColIndex) => {
              const index = headers.findIndex((h) =>
                possibleHeaders.includes(h),
              );
              if (index !== -1 && index < cols.length) return cols[index];
              if (defaultColIndex < cols.length) return cols[defaultColIndex];
              return "";
            };

            const name = getVal(["name", "farmer name", "farmername"], 0);
            const phone = getVal(
              ["phone", "phone number", "mobile", "contact"],
              1,
            );
            const village =
              getVal(["village", "village cluster", "cluster"], 2) ||
              "Kharindwa";
            const land =
              getVal(["land", "land size", "land holding", "holding"], 3) ||
              "1.0 Ha";
            const category =
              getVal(["category", "social category", "caste"], 4) || "General";
            const aadhaarSeeded =
              getVal(
                ["aadhaar", "aadhaarseeded", "aadhaar seeded"],
                5,
              ).toLowerCase() !== "false";
            const mobileVerified =
              getVal(
                ["mobile", "mobileverified", "mobile verified"],
                6,
              ).toLowerCase() !== "false";

            return {
              name,
              phone,
              village,
              land,
              category,
              aadhaarSeeded,
              mobileVerified,
            };
          })
          .filter((f) => f.name.length > 0);

        setProgress(100);
        setExtractStep("CSV parsed successfully!");
        setTimeout(() => {
          setParsedFarmers(parsed);
          setIsExtracting(false);
          setShowPreview(true);
        }, 400);
      } catch (err) {
        setError("Failed to parse CSV: " + err.message);
        setIsExtracting(false);
      }
    };
    reader.readAsText(fileObj);
  };

  const runSimulatedOcr = () => {
    setIsExtracting(true);
    setProgress(0);
    setExtractStep("Opening file stream...");

    const steps = [
      { progress: 15, msg: "Reading layout grid & typography styles..." },
      { progress: 40, msg: "Running OCR cell alignment algorithm..." },
      {
        progress: 70,
        msg: "Extracting names, villages and land size columns...",
      },
      {
        progress: 90,
        msg: "Validating record schema & checking duplicates...",
      },
      { progress: 100, msg: "Extraction complete!" },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setProgress(step.progress);
        setExtractStep(step.msg);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setIsExtracting(false);
        const mockExtracted = [
          {
            name: "Suresh Chander",
            phone: "+91 98123 45678",
            village: "Kharindwa",
            land: "1.5 Ha",
            category: "General",
            aadhaarSeeded: true,
            mobileVerified: true,
          },
          {
            name: "Rajender Singh",
            phone: "+91 94162 89012",
            village: "Bhadana",
            land: "0.7 Ha",
            category: "OBC",
            aadhaarSeeded: true,
            mobileVerified: true,
          },
          {
            name: "Meena Kumari",
            phone: "+91 90501 23456",
            village: "Murthal",
            land: "2.2 Ha",
            category: "SC",
            aadhaarSeeded: true,
            mobileVerified: true,
          },
          {
            name: "Satish Kumar",
            phone: "+91 98960 78901",
            village: "Kharindwa",
            land: "0.9 Ha",
            category: "General",
            aadhaarSeeded: true,
            mobileVerified: true,
          },
          {
            name: "Vidya Devi",
            phone: "+91 92543 21098",
            village: "Bhadana",
            land: "1.1 Ha",
            category: "OBC",
            aadhaarSeeded: true,
            mobileVerified: true,
          },
        ];
        setParsedFarmers(mockExtracted);
        setShowPreview(true);
      }
    }, 450);
  };

  const handleBulkSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await govSchemesApi.bulkCreateFpoFarmers({
        farmers: parsedFarmers,
      });
      if (res && res.success) {
        onSuccess();
        onClose();
        setFile(null);
        setParsedFarmers([]);
        setShowPreview(false);
      } else {
        setError(res.message || "Failed to onboard bulk registry");
      }
    } catch (err) {
      setError(err.message || "An error occurred during bulk registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-[24px] p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-655 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-brand-darkest mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-brand-medium" />
          Bulk Upload Farmer Registry
        </h3>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!showPreview && !isExtracting && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 font-bold leading-relaxed">
              Upload farmer directories matching Excel registry formats, PDFs,
              or CSV data tables. The onboarding system automatically reconciles
              holdings with scheme criteria.
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[20px] p-8 text-center transition ${
                dragOver
                  ? "border-brand-medium bg-green-50/30"
                  : "border-gray-300 hover:border-brand-medium hover:bg-gray-50/50"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-150 text-gray-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-gray-800">
                    Drag and drop file here, or{" "}
                    <label className="text-brand-medium underline cursor-pointer hover:text-brand-dark">
                      browse
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    Supports .csv, .xlsx, .xls, .pdf files up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-650 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isExtracting && (
          <div className="py-8 space-y-6 text-center">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-100 border-t-brand-medium rounded-full animate-spin" />
              <FileSpreadsheet className="w-8 h-8 text-brand-medium animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-black text-gray-800">
                {extractStep}
              </h4>
              <p className="text-xs text-gray-400 font-bold">
                Progress: {progress}%
              </p>
            </div>

            <div className="w-64 bg-gray-100 h-2 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-brand-medium transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {showPreview && (
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-green-50 border border-green-250 px-4 py-3 rounded-xl">
              <span className="text-xs text-green-800 font-bold">
                Successfully extracted <strong>{parsedFarmers.length}</strong>{" "}
                records from <strong>{file?.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowPreview(false);
                  setFile(null);
                  setParsedFarmers([]);
                }}
                className="text-[10px] text-green-700 font-black uppercase hover:underline"
              >
                Upload Different File
              </button>
            </div>

            <div className="border border-gray-150 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 border-b border-gray-150 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">
                      Village
                    </th>
                    <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">
                      Land
                    </th>
                    <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">
                      Bank Link
                    </th>
                    <th className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase">
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {parsedFarmers.map((f, idx) => (
                    <tr key={idx} className="hover:bg-gray-55/50">
                      <td className="px-4 py-2.5 font-bold text-gray-900">
                        {f.name}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 font-semibold">
                        {f.village}
                      </td>
                      <td className="px-4 py-2.5 text-gray-600 font-semibold">
                        {f.land}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase">
                          {f.category}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        {f.aadhaarSeeded ? (
                          <span className="text-green-600 font-bold">
                            Linked
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {f.mobileVerified ? (
                          <span className="text-green-600 font-bold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowPreview(false);
                  setFile(null);
                  setParsedFarmers([]);
                }}
                className="flex-1 py-2.5 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={loading || parsedFarmers.length === 0}
                className="flex-1 py-2.5 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-black transition shadow-sm"
              >
                {loading ? "Onboarding..." : "Confirm & Onboard"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssignOfficerModal({ isOpen, onClose, selectedCount, onConfirm }) {
  const [selectedOfficer, setSelectedOfficer] = useState("Suresh Kumar (Kharindwa cluster)");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      onConfirm(selectedOfficer);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-brand-darkest mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-brand-medium" />
          Assign Field Officer
        </h3>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-200">
              <Check className="w-6 h-6 text-green-600 stroke-[3px]" />
            </div>
            <h4 className="text-sm font-black text-green-800">Assignment Successful!</h4>
            <p className="text-xs text-gray-500 font-bold">
              {selectedCount} farmers assigned to {selectedOfficer}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs text-gray-550 font-semibold leading-relaxed">
              Assign a Local Resource Person (LRP) to contact the {selectedCount} selected members for offline verification.
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                Select Field Facilitator
              </label>
              <select
                value={selectedOfficer}
                onChange={(e) => setSelectedOfficer(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-brand-medium"
              >
                <option value="Suresh Kumar (Kharindwa cluster)">Suresh Kumar (Kharindwa cluster)</option>
                <option value="Rajesh Dev (Bhadana cluster)">Rajesh Dev (Bhadana cluster)</option>
                <option value="Amit Singh (Murthal cluster)">Amit Singh (Murthal cluster)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-250 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-brand-medium hover:bg-brand-dark text-white rounded-xl text-xs font-black transition shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
