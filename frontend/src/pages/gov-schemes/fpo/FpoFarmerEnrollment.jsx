import React, { useState, useMemo, useEffect } from "react";
import GenericTable from "../../../components/partials/GenericTable";
import { PageHeader, StatsCard, WhatsAppReminderModal, FarmerEnrollmentModal } from "./FpoSharedComponents";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
  AlertCircle 
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
      eNam: "eligible-not-enrolled"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "enrolled"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "enrolled"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "enrolled"
    }
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
      eNam: "eligible-not-enrolled"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "enrolled"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "eligible-not-enrolled"
    }
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
      eNam: "not-eligible"
    }
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
      eNam: "eligible-not-enrolled"
    }
  }
];

// Helper: Deterministic Age based on ID
const getFarmerAge = (farmerId) => {
  const hash = String(farmerId || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 30) + 22; // Range: 22 to 51
};

// Helper: Deterministic Phone
const getFarmerPhone = (farmerId) => {
  const hash = String(farmerId || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `+91 9${(hash % 90000) + 10000} ${(hash % 90000) + 10000}`;
};

// Helper: Deterministic Gender
const getFarmerGender = (name) => {
  const nameLower = String(name || "").toLowerCase();
  if (nameLower.includes("devi") || nameLower.includes("kumari") || nameLower.includes("sunita") || nameLower.includes("priya") || nameLower.includes("kamla") || nameLower.includes("geeta") || nameLower.includes("anita") || nameLower.includes("poonam") || nameLower.includes("savitri")) {
    return "Female";
  }
  return "Male";
};

// Eligibility Engine rule evaluation
const evaluateSchemeEligibility = (farmer, schemeKey) => {
  const land = parseFloat(farmer.land) || 0;
  const age = farmer.age || getFarmerAge(farmer.id);
  
  if (schemeKey === "pmKisan") return true; // PM-KISAN for all small-medium farmers
  if (schemeKey === "pmfby") return true;   // PMFBY Crop Insurance for all land owners
  if (schemeKey === "kcc") return land >= 0.5; // KCC credit cards for holdings >= 0.5 Ha
  if (schemeKey === "pmKmy") return age >= 18 && age <= 40; // PM-KMY pension scheme age limit 18-40
  if (schemeKey === "eNam") return land >= 0.8; // e-NAM commercial integration for holdings >= 0.8 Ha
  return true;
};

// Combine raw farmer state with evaluated eligibility rules
const getFarmerSchemesWithEligibility = (farmer) => {
  const schemesList = ["pmKisan", "pmfby", "kcc", "pmKmy", "eNam"];
  const updatedSchemes = {};
  
  schemesList.forEach(key => {
    const rawStatus = farmer.schemes?.[key] || "eligible-not-enrolled";
    
    // Evaluate eligibility rule
    const isEligible = evaluateSchemeEligibility(farmer, key);
    
    if (rawStatus === "enrolled" || rawStatus === "pending" || rawStatus === "applied") {
      updatedSchemes[key] = rawStatus;
    } else if (!isEligible || rawStatus === "not-eligible") {
      updatedSchemes[key] = "not-eligible";
    } else {
      updatedSchemes[key] = "eligible-not-enrolled";
    }
  });
  
  return updatedSchemes;
};

// Compute coverage metrics
const calculateFarmerCoverage = (schemesObj) => {
  let eligibleCount = 0;
  let enrolledCount = 0;
  
  Object.keys(schemesObj).forEach(key => {
    const status = schemesObj[key];
    if (status !== "not-eligible") {
      eligibleCount++;
      if (status === "enrolled") {
        enrolledCount++;
      }
    }
  });
  
  const pct = eligibleCount > 0 ? Math.round((enrolledCount / eligibleCount) * 100) : 0;
  return {
    eligible: eligibleCount,
    enrolled: enrolledCount,
    percent: pct
  };
};

const mapBackendFarmers = (backendFarmers) => {
  return backendFarmers.map(f => {
    const fId = f.farmerId || f.id;
    return {
      ...f,
      id: fId,
      age: f.age || getFarmerAge(fId),
      phone: f.phone || getFarmerPhone(fId),
      gender: f.gender || getFarmerGender(f.name)
    };
  });
};

// Local Scheme Status badge renderer
const renderFarmerSchemeCell = (status) => {
  if (status === "enrolled") {
    return (
      <div className="flex items-center justify-center animate-fadeIn" title="Enrolled">
        <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-green-50 text-green-600 border border-green-200">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      </div>
    );
  }
  if (status === "pending" || status === "applied") {
    return (
      <div className="flex items-center justify-center animate-pulse" title="Applied / Pending">
        <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-amber-50 text-amber-500 border border-amber-200">
          <Clock className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      </div>
    );
  }
  if (status === "eligible-not-enrolled") {
    return (
      <div className="flex items-center justify-center cursor-help" title="Eligible but Not Enrolled (Action Needed)">
        <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-red-50 text-red-500 border border-red-200">
          <X className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center text-gray-300" title="Not Eligible">
      <span className="text-gray-300 font-bold text-base">—</span>
    </div>
  );
};

export default function FpoFarmerEnrollment() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedFarmerForDrawer, setSelectedFarmerForDrawer] = useState(null);
  
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

  const loadFarmers = async () => {
    try {
      setLoading(true);
      const res = await govSchemesApi.getFpoFarmers();
      if (res && res.success) {
        setFarmers(mapBackendFarmers(res.farmers || []));
      } else {
        triggerFarmersFallback();
      }
    } catch (err) {
      console.warn("Failed to load FPO farmers via API, triggering local fallback:", err);
      triggerFarmersFallback();
    } finally {
      setLoading(false);
    }
  };

  const triggerFarmersFallback = () => {
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

    farmers.forEach(f => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);
      
      totalEligible += coverage.eligible;
      totalEnrolled += coverage.enrolled;
      missingCount += (coverage.eligible - coverage.enrolled);
      totalCoveragePctSum += coverage.percent;
      
      if (coverage.percent === 100 && coverage.eligible > 0) {
        fullyCovered++;
      }
    });

    const avgCoverage = total > 0 ? Math.round(totalCoveragePctSum / total) : 0;
    const fullyCoveredPct = total > 0 ? Math.round((fullyCovered / total) * 100) : 0;

    return {
      total,
      avgCoverage,
      missingCount,
      fullyCovered,
      fullyCoveredPct
    };
  }, [farmers]);

  // Village snapshotted coverage metrics
  const dynamicVillageSnapshots = useMemo(() => {
    const villages = {};
    farmers.forEach(f => {
      const vName = f.village || 'Unknown';
      if (!villages[vName]) {
        villages[vName] = { name: vName, count: 0, totalCoveragePct: 0 };
      }
      
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);
      
      villages[vName].count++;
      villages[vName].totalCoveragePct += coverage.percent;
    });
    
    return Object.keys(villages).map(vName => {
      const v = villages[vName];
      const avgCoverage = v.count > 0 ? Math.round(v.totalCoveragePct / v.count) : 0;
      
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
        color
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
      eNam: { enrolled: 0, gap: 0 }
    };
    
    farmers.forEach(f => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      Object.keys(schemesObj).forEach(k => {
        const status = schemesObj[k];
        if (status === 'enrolled') {
          counts[k].enrolled++;
        } else if (status === 'eligible-not-enrolled') {
          counts[k].gap++;
        }
      });
    });
    
    return [
      { name: "PM-KISAN", enrolled: counts.pmKisan.enrolled, gap: counts.pmKisan.gap },
      { name: "PMFBY", enrolled: counts.pmfby.enrolled, gap: counts.pmfby.gap },
      { name: "KCC", enrolled: counts.kcc.enrolled, gap: counts.kcc.gap },
      { name: "PM-KMY", enrolled: counts.pmKmy.enrolled, gap: counts.pmKmy.gap },
      { name: "eNAM", enrolled: counts.eNam.enrolled, gap: counts.eNam.gap }
    ];
  }, [farmers]);

  // Chart Data: Scheme Adoption Rate
  const adoptionChartData = useMemo(() => {
    const counts = {
      pmKisan: { eligible: 0, enrolled: 0 },
      pmfby: { eligible: 0, enrolled: 0 },
      kcc: { eligible: 0, enrolled: 0 },
      pmKmy: { eligible: 0, enrolled: 0 },
      eNam: { eligible: 0, enrolled: 0 }
    };

    farmers.forEach(f => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      Object.keys(schemesObj).forEach(key => {
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
      { name: "PM-KISAN", rate: counts.pmKisan.eligible > 0 ? Math.round((counts.pmKisan.enrolled / counts.pmKisan.eligible) * 100) : 0 },
      { name: "PMFBY", rate: counts.pmfby.eligible > 0 ? Math.round((counts.pmfby.enrolled / counts.pmfby.eligible) * 100) : 0 },
      { name: "KCC", rate: counts.kcc.eligible > 0 ? Math.round((counts.kcc.enrolled / counts.kcc.eligible) * 100) : 0 },
      { name: "PM-KMY", rate: counts.pmKmy.eligible > 0 ? Math.round((counts.pmKmy.enrolled / counts.pmKmy.eligible) * 100) : 0 },
      { name: "eNAM", rate: counts.eNam.eligible > 0 ? Math.round((counts.eNam.enrolled / counts.eNam.eligible) * 100) : 0 }
    ];
  }, [farmers]);

  // Chart Data: Village Average Coverage
  const villageChartData = useMemo(() => {
    const villages = {};
    
    farmers.forEach(f => {
      const vName = f.village || "Unknown";
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);
      
      if (!villages[vName]) {
        villages[vName] = { name: vName, totalCoveragePct: 0, count: 0 };
      }
      
      villages[vName].totalCoveragePct += coverage.percent;
      villages[vName].count++;
    });
    
    return Object.keys(villages).map(vName => ({
      name: vName,
      coverage: Math.round(villages[vName].totalCoveragePct / villages[vName].count)
    }));
  }, [farmers]);

  // Apply filters
  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVillage = filterVillage === "All" || f.village === filterVillage;
      const matchesCategory = filterCategory === "All" || f.category === filterCategory;

      let matchesGap = true;
      if (filterGap === "Zero Enrollment") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        const coverage = calculateFarmerCoverage(schemesObj);
        matchesGap = coverage.enrolled === 0;
      } else if (filterGap === "Missing PMFBY") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = schemesObj.pmfby === "eligible-not-enrolled";
      } else if (filterGap === "Missing KCC") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = schemesObj.kcc === "eligible-not-enrolled";
      } else if (filterGap === "Missing PM-KISAN") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = schemesObj.pmKisan === "eligible-not-enrolled";
      } else if (filterGap === "Missing PM-KMY") {
        const schemesObj = getFarmerSchemesWithEligibility(f);
        matchesGap = schemesObj.pmKmy === "eligible-not-enrolled";
      }

      return matchesSearch && matchesVillage && matchesCategory && matchesGap;
    });
  }, [farmers, searchTerm, filterVillage, filterGap, filterCategory]);

  const flattenedFarmers = useMemo(() => {
    return filteredFarmers.map(f => {
      const schemesObj = getFarmerSchemesWithEligibility(f);
      const coverage = calculateFarmerCoverage(schemesObj);
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
        coveragePercent: coverage.percent,
        statusLabel: coverage.percent === 100 
          ? "Complete" 
          : coverage.enrolled === 0 
          ? "Not Applied" 
          : "Enroll Missing"
      };
    });
  }, [filteredFarmers]);

  // Redesigned Columns for Scheme Coverage Table
  const columns = useMemo(() => [
    {
      header: (
        <input
          type="checkbox"
          checked={filteredFarmers.length > 0 && selectedIds.size === filteredFarmers.length}
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
      )
    },
    {
      header: "Farmer Name",
      accessor: "name",
      cell: (name, row) => (
        <div className="min-w-[120px]">
          <span className="font-bold text-gray-900 block hover:text-brand-medium transition">{name}</span>
          <span className="text-[10px] text-gray-400 block mt-0.5 font-bold uppercase tracking-wider">{row.id}</span>
        </div>
      )
    },
    { header: "Village", accessor: "village", cellClassName: "font-semibold text-gray-700" },
    { header: "Land", accessor: "land", cellClassName: "font-semibold text-gray-700" },
    {
      header: "Category",
      accessor: "category",
      cell: (category) => (
        <span className="px-2 py-0.5 bg-gray-50 border border-gray-150 rounded-lg text-[10px] font-black text-gray-500 uppercase">
          {category}
        </span>
      )
    },
    { header: "PM-KISAN", accessor: "pmKisan", cellClassName: "text-center", cell: (val) => renderFarmerSchemeCell(val) },
    { header: "PMFBY", accessor: "pmfby", cellClassName: "text-center", cell: (val) => renderFarmerSchemeCell(val) },
    { header: "KCC", accessor: "kcc", cellClassName: "text-center", cell: (val) => renderFarmerSchemeCell(val) },
    { header: "PM-KMY", accessor: "pmKmy", cellClassName: "text-center", cell: (val) => renderFarmerSchemeCell(val) },
    { header: "eNAM", accessor: "eNam", cellClassName: "text-center", cell: (val) => renderFarmerSchemeCell(val) },
    { header: "Eligible", accessor: "eligibleCount", cellClassName: "text-center font-black text-gray-500" },
    { header: "Enrolled", accessor: "enrolledCount", cellClassName: "text-center font-black text-gray-950" },
    {
      header: "Coverage %",
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
              <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${bgClass} ${textClass}`}>
              {pct}%
            </span>
          </div>
        );
      }
    },
    {
      header: "Status",
      accessor: "statusLabel",
      cell: (val) => {
        let styles = "bg-gray-100 text-gray-500 border-gray-200";
        if (val === "Complete") styles = "bg-green-50 text-green-700 border-green-200";
        else if (val === "Enroll Missing") styles = "bg-amber-50 text-amber-700 border-amber-200";
        else if (val === "Not Applied") styles = "bg-red-50 text-red-700 border-red-200";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-wider ${styles}`}>
            {val}
          </span>
        );
      }
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
            {row.statusLabel === "Not Applied" ? "Enroll All" : "Enroll Missing"}
          </button>
        );
      }
    }
  ], [filteredFarmers, selectedIds]);

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
      const res = await govSchemesApi.updateFpoEnrollment(farmerId, finalSchemesMap);
      if (res && res.success) {
        await loadFarmers();
        return;
      }
    } catch (err) {
      console.warn("Failed to commit enrollment updates online, falling back to local state:", err);
    }

    // In-memory local state fallback
    setFarmers(prev => prev.map(f => {
      const fId = f.farmerId || f.id;
      if (fId === farmerId) {
        return {
          ...f,
          schemes: finalSchemesMap
        };
      }
      return f;
    }));
  };

  // Bulk Actions
  const handleBulkWhatsApp = () => {
    setSelectedScheme("PMFBY");
    setIsWhatsAppOpen(true);
  };

  const handleBulkExportCSV = () => {
    const selectedFarmers = filteredFarmers.filter(f => selectedIds.has(f.id));
    const listToExport = selectedFarmers.length > 0 ? selectedFarmers : filteredFarmers;
    
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
    alert(`Assigned Local Resource Person (LRP) to contact the ${selectedIds.size} selected farmers.`);
    setSelectedIds(new Set());
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Farmer Enrollment"
        subtitle="Manage member applications, identify gaps, and coordinate village outreach"
        actions={
          <button
            onClick={handleBulkExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-700" />
            Export CSV
          </button>
        }
      />

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
          alert={statsSummary.missingCount > 0 ? `${statsSummary.missingCount} pending actions` : null}
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
          <div key={v.name} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-black text-gray-950">{v.name}</h4>
                <p className="text-xs text-gray-400 font-bold mt-0.5">{v.count} Farmers · Avg Coverage: {v.coverage}%</p>
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
                    v.color === "red" ? "text-red-700 font-bold" : v.color === "amber" ? "text-amber-700 font-bold" : "text-green-700 font-bold"
                  }
                >
                  {v.coverage}%
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    v.color === "red" ? "bg-red-500" : v.color === "amber" ? "bg-amber-500" : "bg-green-600"
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
          💡 Click on any farmer row to view detailed scheme eligibility and documents profile.
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
              <BarChart data={adoptionChartData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" unit="%" tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }} width={80} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Adoption Rate"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px" }}
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
              <BarChart data={gapChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }} />
                <Bar dataKey="enrolled" name="Enrolled" fill="#2d5a3d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gap" name="Gap (Unenrolled)" fill="#dc2626" radius={[4, 4, 0, 0]} />
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
              <BarChart data={villageChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }} />
                <YAxis unit="%" tick={{ fontSize: 10, fontWeight: "bold", fill: "#6b7280" }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Avg Coverage"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px" }}
                />
                <Bar dataKey="coverage" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Slide-over Detail Drawer */}
      {selectedFarmerForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
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
                      {selectedFarmerForDrawer.gender === "Female" ? "👩" : "👨"}
                    </div>
                    <div>
                      <h3 className="text-base font-black tracking-wide">{selectedFarmerForDrawer.name}</h3>
                      <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">{selectedFarmerForDrawer.id}</span>
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
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Scheme Coverage</span>
                      <h4 className="text-xl font-black text-gray-950">
                        {calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).enrolled} / {calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).eligible} Schemes
                      </h4>
                      <p className="text-[10px] text-gray-500 font-bold">
                        {calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).percent}% of eligible welfare programs active
                      </p>
                    </div>

                    {/* Progress Ring Indicator */}
                    <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={
                            calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).percent >= 80 
                              ? "text-green-600" 
                              : calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).percent >= 50 
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
                        {calculateFarmerCoverage(getFarmerSchemesWithEligibility(selectedFarmerForDrawer)).percent}%
                      </span>
                    </div>
                  </div>

                  {/* Profile Information Block */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">Personal Profile</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">Mobile Number</span>
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
                        <span className="block text-gray-400 font-medium mb-0.5">Village Cluster</span>
                        <span className="font-bold text-gray-800">{selectedFarmerForDrawer.village}</span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">Land Holding</span>
                        <span className="font-bold text-gray-800">{selectedFarmerForDrawer.land}</span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">Farmer Category</span>
                        <span className="font-bold text-gray-800">{selectedFarmerForDrawer.category}</span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">Demographics</span>
                        <span className="font-bold text-gray-800">{selectedFarmerForDrawer.age} yrs · {selectedFarmerForDrawer.gender}</span>
                      </div>
                      <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <span className="block text-gray-400 font-medium mb-0.5">Est. Annual Income</span>
                        <span className="font-bold text-gray-800">₹{((parseFloat(selectedFarmerForDrawer.land) || 0) * 50000 + 42000).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scheme Enrollment Status Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">Scheme Eligibility & Status</h4>
                    <div className="space-y-3.5">
                      {[
                        { key: "pmKisan", name: "PM-KISAN Samman Nidhi", desc: "Direct benefit transfer of ₹6,000/year in 3 installments" },
                        { key: "pmfby", name: "PM Fasal Bima Yojana (PMFBY)", desc: "Crop insurance coverage for food and commercial crops" },
                        { key: "kcc", name: "Kisan Credit Card (KCC) Loans", desc: "Subsidized short-term credit loans up to ₹3 Lakhs" },
                        { key: "pmKmy", name: "PM Kisan Maandhan Yojana (PM-KMY)", desc: "Social security pension of ₹3,000/month after age 60" },
                        { key: "eNam", name: "e-NAM Market Integration", desc: "Digital platform for crop trade and mandi transactions" }
                      ].map(item => {
                        const status = getFarmerSchemesWithEligibility(selectedFarmerForDrawer)[item.key];
                        return (
                          <div key={item.key} className="flex items-start justify-between gap-4 p-3.5 bg-white border border-gray-150 rounded-2xl hover:shadow-sm transition">
                            <div className="space-y-1">
                              <span className="font-black text-xs text-gray-900 block">{item.name}</span>
                              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{item.desc}</p>
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
    </div>
  );
}
