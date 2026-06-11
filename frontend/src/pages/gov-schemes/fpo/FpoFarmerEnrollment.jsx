import React, { useState, useMemo } from "react";
import GenericTable from "../../../components/partials/GenericTable";
import { PageHeader, StatsCard, FarmerSchemeCell, WhatsAppReminderModal, FarmerEnrollmentModal } from "./FpoSharedComponents";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Search, Share2, Phone, UserCheck, AlertTriangle, FileSpreadsheet, Check, Users, ShieldCheck, HelpCircle } from "lucide-react";

// DATA SECTION
const VILLAGE_SNAPSHOTS = [
  {
    name: "Kharindwa",
    count: 320,
    avgSchemes: 2.1,
    coverage: 15,
    status: "Needs Immediate Action",
    color: "red"
  },
  {
    name: "Bhadana",
    count: 287,
    avgSchemes: 3.4,
    coverage: 31,
    status: "Moderate — Push Needed",
    color: "amber"
  },
  {
    name: "Murthal",
    count: 240,
    avgSchemes: 4.2,
    coverage: 61,
    status: "Good — Maintain",
    color: "green"
  }
];

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
    },
    count: "3/5",
    action: "Enroll Missing"
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
    },
    count: "1/5",
    action: "Enroll Missing"
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
    },
    count: "5/5",
    action: "Complete ✓"
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
    },
    count: "0/5",
    action: "Enroll Now 🔴"
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
    },
    count: "4/5",
    action: "Enroll Missing"
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
    },
    count: "1/5",
    action: "Enroll Missing"
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
    },
    count: "5/5",
    action: "Complete ✓"
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
    },
    count: "2/5",
    action: "Enroll Missing"
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
    },
    count: "2/5",
    action: "Enroll Missing"
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
    },
    count: "0/5",
    action: "Enroll Now 🔴"
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
    },
    count: "5/5",
    action: "Complete ✓"
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
    },
    count: "1/5",
    action: "Enroll Missing"
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
    },
    count: "2/5",
    action: "Enroll Missing"
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
    },
    count: "0/5",
    action: "Enroll Now 🔴"
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
    },
    count: "4/5",
    action: "Enroll Missing"
  }
];

const GAP_CHART_DATA = [
  { name: "PM-KISAN", enrolled: 612, gap: 168 },
  { name: "PMFBY", enrolled: 423, gap: 424 },
  { name: "KCC", enrolled: 389, gap: 291 },
  { name: "PM-KMY", enrolled: 89, gap: 223 },
  { name: "eNAM", enrolled: 156, gap: 524 }
];

export default function FpoFarmerEnrollment() {
  const [farmers, setFarmers] = useState(INITIAL_FARMERS);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
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

  // Apply filters
  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVillage = filterVillage === "All" || f.village === filterVillage;
      const matchesCategory = filterCategory === "All" || f.category === filterCategory;

      let matchesGap = true;
      if (filterGap === "Zero Enrollment") {
        matchesGap = f.count === "0/5";
      } else if (filterGap === "Missing PMFBY") {
        matchesGap = f.schemes.pmfby === "eligible-not-enrolled";
      } else if (filterGap === "Missing KCC") {
        matchesGap = f.schemes.kcc === "eligible-not-enrolled";
      } else if (filterGap === "Missing PM-KISAN") {
        matchesGap = f.schemes.pmKisan === "eligible-not-enrolled";
      } else if (filterGap === "Missing PM-KMY") {
        matchesGap = f.schemes.pmKmy === "eligible-not-enrolled";
      }

      return matchesSearch && matchesVillage && matchesCategory && matchesGap;
    });
  }, [farmers, searchTerm, filterVillage, filterGap, filterCategory]);

  const flattenedFarmers = useMemo(() => {
    return filteredFarmers.map(f => ({
      ...f,
      pmKisan: f.schemes.pmKisan,
      pmfby: f.schemes.pmfby,
      kcc: f.schemes.kcc,
      pmKmy: f.schemes.pmKmy,
      eNam: f.schemes.eNam
    }));
  }, [filteredFarmers]);

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
        <div>
          <span className="font-bold text-gray-900">{name}</span>
          <span className="text-[10px] text-gray-400 block mt-0.5 font-bold">{row.id}</span>
        </div>
      )
    },
    { header: "Village", accessor: "village", cellClassName: "font-bold text-gray-805" },
    { header: "Land", accessor: "land", cellClassName: "font-bold text-gray-805" },
    {
      header: "Category",
      accessor: "category",
      cell: (category) => (
        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-655">
          {category}
        </span>
      )
    },
    { header: "PM-KISAN", accessor: "pmKisan", cellClassName: "text-center", cell: (val) => <FarmerSchemeCell status={val} /> },
    { header: "PMFBY", accessor: "pmfby", cellClassName: "text-center", cell: (val) => <FarmerSchemeCell status={val} /> },
    { header: "KCC", accessor: "kcc", cellClassName: "text-center", cell: (val) => <FarmerSchemeCell status={val} /> },
    { header: "PM-KMY", accessor: "pmKmy", cellClassName: "text-center", cell: (val) => <FarmerSchemeCell status={val} /> },
    { header: "eNAM", accessor: "eNam", cellClassName: "text-center", cell: (val) => <FarmerSchemeCell status={val} /> },
    { header: "Schemes", accessor: "count", cellClassName: "text-center font-black text-gray-900" },
    {
      header: "Action",
      accessor: "action",
      sortable: false,
      cellClassName: "text-right",
      cell: (action, row) => {
        if (action === "Complete ✓") {
          return (
            <span className="text-green-600 font-bold flex items-center justify-end gap-1">
              <Check className="w-3.5 h-3.5" />
              Complete
            </span>
          );
        }
        if (action === "Enroll Now 🔴") {
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEnrollClick(row);
              }}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[11px] transition shadow-sm"
            >
              Enroll Now
            </button>
          );
        }
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnrollClick(row);
            }}
            className="px-3 py-1 border border-amber-500 hover:bg-amber-50 text-amber-700 font-bold rounded-lg text-[11px] transition"
          >
            Enroll Missing
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

  // Callback on successful enrollment submission
  const handleEnrollSuccess = (farmerId, finalSchemesMap) => {
    // Count enrolled count (e.g. 3 out of 5)
    let enrolledCount = 0;
    let totalCount = 0;
    Object.keys(finalSchemesMap).forEach((key) => {
      if (finalSchemesMap[key] === "enrolled") enrolledCount++;
      if (finalSchemesMap[key] !== "not-eligible") totalCount++;
    });

    const actionLabel = enrolledCount === totalCount ? "Complete ✓" : "Enroll Missing";

    const updatedFarmers = farmers.map((f) => {
      if (f.id === farmerId) {
        return {
          ...f,
          schemes: finalSchemesMap,
          count: `${enrolledCount}/5`,
          action: actionLabel
        };
      }
      return f;
    });

    setFarmers(updatedFarmers);
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
    csvContent += "Farmer ID,Name,Village,Land,Category,Enrolled Count\n";
    listToExport.forEach((f) => {
      csvContent += `${f.id},${f.name},${f.village},${f.land},${f.category},${f.count}\n`;
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

  // Row styling based on count
  const getRowBgClass = (count) => {
    if (count === "0/5") return "bg-red-50/75 hover:bg-red-100/70";
    if (count === "5/5") return "bg-green-50/70 hover:bg-green-100/70";
    return "bg-white hover:bg-gray-50";
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
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
        }
      />

      {/* Top Summary Bar using generic StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Members"
          value="847"
          sub="Verified member farmers registered in Sonipat cooperative"
          icon={Users}
        />

        <StatsCard
          title="Fully Enrolled"
          value="198"
          sub="Farmers active in 5+ central & state welfare schemes"
          trend="23%"
          isPositive={true}
          icon={ShieldCheck}
        />

        <StatsCard
          title="Partially Enrolled"
          value="436"
          sub="Farmers enrolled in 1-4 schemes. Needs verification push"
          trend="51%"
          isPositive={true}
          icon={UserCheck}
        />

        <StatsCard
          title="Zero Enrollment"
          value="213"
          sub="Marginal members with no registered benefits (Priority)"
          alert="213 farmers have zero active coverage"
          icon={AlertTriangle}
        />
      </div>

      {/* Village Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VILLAGE_SNAPSHOTS.map((v) => (
          <div key={v.name} className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-black text-gray-950">{v.name}</h4>
                <p className="text-xs text-gray-400 font-bold mt-0.5">{v.count} Farmers · Avg {v.avgSchemes} Schemes</p>
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
                <span>Fully Enrolled Coverage</span>
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
            className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#2e4057]"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-3">
          <select
            value={filterVillage}
            onChange={(e) => setFilterVillage(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#2e4057]"
          >
            <option value="All">All Villages</option>
            <option value="Kharindwa">Kharindwa</option>
            <option value="Bhadana">Bhadana</option>
            <option value="Murthal">Murthal</option>
          </select>

          <select
            value={filterGap}
            onChange={(e) => setFilterGap(e.target.value)}
            className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#2e4057]"
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
            className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#2e4057]"
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
            <UserCheck className="w-5 h-5" />
            <span>{selectedIds.size} farmers selected</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkWhatsApp}
              className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Send WhatsApp Reminder
            </button>
            <button
              onClick={handleBulkExportCSV}
              className="px-3.5 py-1.5 border border-green-300 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition"
            >
              Export Selected CSV
            </button>
            <button
              onClick={handleAssignFieldOfficer}
              className="px-3.5 py-1.5 bg-[#2e4057] hover:bg-[#3a5170] text-white rounded-lg text-xs font-bold transition"
            >
              Assign Field Officer
            </button>
          </div>
        </div>
      )}

      {/* Farmer Table */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-4 overflow-hidden animate-fadeIn">
        <GenericTable
          columns={columns}
          data={flattenedFarmers}
          rowClassName={(row) => getRowBgClass(row.count)}
          showSearch={false}
          showSort={false}
          itemsPerPage={15}
          emptyMessage="No farmers match these filters"
        />
      </div>

      {/* Enrollment Gap Chart */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        <h3 className="text-sm font-black text-[#2e4057] mb-4">Scheme-wise Enrollment Gap</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GAP_CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 11, fontWeight: "bold", fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px", fontFamily: "monospace" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
              <Bar dataKey="enrolled" name="Enrolled" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gap" name="Gap (Eligible but Not Enrolled)" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

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
