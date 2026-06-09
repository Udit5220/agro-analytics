import React, { useState, useMemo } from "react";
import AgribusinessLayout from "./components/AgribusinessLayout";
import StatsCard from "../../../components/partials/StatsCard";
import GenericTable from "../../../components/partials/GenericTable";
import AgriLeafletMap from "./components/AgriLeafletMap";
import {
  FileText,
  ShieldCheck,
  Users,
  GitPullRequest,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Phone
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts";

// List of contracted FPOs
const FPO_CONTRACTS_DATABASE = [
  { name: "Ludhiana Farmers Coop", location: "Ludhiana, PB", growers: 1200, compliance: 95, acreage: 45000, status: "Active", stage: "Signed", value: "₹42 Cr" },
  { name: "Bathinda Agri Sourcing Ltd", location: "Bathinda, PB", growers: 850, compliance: 82, acreage: 38000, status: "Active", stage: "Signed", value: "₹34 Cr" },
  { name: "Karnal Sourcing Cluster", location: "Karnal, HR", growers: 1400, compliance: 94, acreage: 48000, status: "Active", stage: "Signed", value: "₹50 Cr" },
  { name: "Indore Sourcing Federation", location: "Indore, MP", growers: 950, compliance: 80, acreage: 35000, status: "Active", stage: "Signed", value: "₹28 Cr" },
  { name: "Nagpur Crop Source Hub", location: "Nagpur, MH", growers: 680, compliance: 74, acreage: 24000, status: "Active", stage: "Signed", value: "₹18 Cr" },
  { name: "Guntur Procurement Coop", location: "Guntur, AP", growers: 1100, compliance: 88, acreage: 38000, status: "Active", stage: "Signed", value: "₹36 Cr" },
  
  // Pipeline FPOs
  { name: "Patiala Sourcing Union", location: "Patiala, PB", growers: 500, compliance: 0, acreage: 12000, status: "In Negotiation", stage: "Term Sheet", value: "₹10 Cr" },
  { name: "Bhopal Soy Cluster", location: "Bhopal, MP", growers: 400, compliance: 0, acreage: 10000, status: "Lead", stage: "Discovery", value: "₹8 Cr" },
  { name: "Amritsar Wheat Farmers", location: "Amritsar, PB", growers: 750, compliance: 0, acreage: 18000, status: "In Negotiation", stage: "Verification", value: "₹15 Cr" }
];

export default function AgriContractIntelligence() {
  const [selectedCommodity, setSelectedCommodity] = useState("Wheat");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedFpo, setSelectedFpo] = useState("Ludhiana Farmers Coop");

  const zoneMultiplier = useMemo(() => {
    if (selectedZone.includes("North")) return 1.2;
    if (selectedZone.includes("Central")) return 0.95;
    if (selectedZone.includes("South")) return 1.05;
    if (selectedZone.includes("West")) return 0.85;
    return 1.0;
  }, [selectedZone]);

  const computedFpos = useMemo(() => {
    return FPO_CONTRACTS_DATABASE.map((f) => {
      // Modify compliance or values slightly based on selected commodity
      let commodityComplianceFactor = 1.0;
      if (selectedCommodity === "Rice" && f.compliance > 0) commodityComplianceFactor = 0.95;
      if (selectedCommodity === "Mustard" && f.compliance > 0) commodityComplianceFactor = 1.03;

      const finalCompliance = f.compliance > 0 ? Math.min(100, Math.round(f.compliance * commodityComplianceFactor)) : 0;

      // Filter based on zone
      let isVisible = true;
      if (selectedZone === "North Zone" && !f.location.includes("PB") && !f.location.includes("HR")) isVisible = false;
      if (selectedZone === "Central Zone" && !f.location.includes("MP")) isVisible = false;
      if (selectedZone === "West Zone" && !f.location.includes("MH")) isVisible = false;
      if (selectedZone === "South Zone" && !f.location.includes("AP")) isVisible = false;

      return {
        ...f,
        compliance: finalCompliance,
        growers: Math.round(f.growers * zoneMultiplier),
        acreage: Math.round(f.acreage * zoneMultiplier),
        visible: isVisible
      };
    });
  }, [selectedCommodity, selectedZone, zoneMultiplier]);

  const activeFpoData = useMemo(() => {
    return computedFpos.find((f) => f.name === selectedFpo) || computedFpos[0];
  }, [computedFpos, selectedFpo]);

  // Aggregate stats
  const totalGrowers = useMemo(() => {
    return computedFpos
      .filter((f) => f.visible && f.status === "Active")
      .reduce((sum, f) => sum + f.growers, 0);
  }, [computedFpos]);

  const totalAcreage = useMemo(() => {
    return computedFpos
      .filter((f) => f.visible && f.status === "Active")
      .reduce((sum, f) => sum + f.acreage, 0);
  }, [computedFpos]);

  const avgCompliance = useMemo(() => {
    const activeFpos = computedFpos.filter((f) => f.visible && f.status === "Active" && f.compliance > 0);
    if (activeFpos.length === 0) return 0;
    return Math.round(activeFpos.reduce((sum, f) => sum + f.compliance, 0) / activeFpos.length);
  }, [computedFpos]);

  const pipelineCount = useMemo(() => {
    return computedFpos.filter((f) => f.visible && f.status !== "Active").length;
  }, [computedFpos]);

  const kpis = [
    <StatsCard
      key="1"
      title="Total Contracted Growers"
      value={totalGrowers.toLocaleString()}
      trend="+12% YoY"
      trendType="success"
      subtext="Active contract farming accounts"
    />,
    <StatsCard
      key="2"
      title="Contract compliance Rate"
      value={`${avgCompliance}%`}
      trend={avgCompliance >= 85 ? "EXCELLENT" : "ATTENTION REQ"}
      trendType={avgCompliance >= 85 ? "success" : "warning"}
      subtext="Contract volume delivery rate"
    />,
    <StatsCard
      key="3"
      title="Active Contracted Acreage"
      value={`${totalAcreage.toLocaleString()} Ac`}
      trend="+8.5%"
      trendType="success"
      subtext="Acreage mapped to supply targets"
    />,
    <StatsCard
      key="4"
      title="Pending FPO Acquisitions"
      value={`${pipelineCount} FPOs`}
      trend="IN NEGOTIATION"
      trendType="warning"
      subtext="Securing future buffer zones"
    />
  ];

  // Pipeline funnel stage counts for chart
  const pipelineChartData = useMemo(() => {
    const counts = { Discovery: 0, Verification: 0, "Term Sheet": 0, Signed: 0 };
    computedFpos.filter((f) => f.visible).forEach((f) => {
      if (counts[f.stage] !== undefined) {
        counts[f.stage] += 1;
      }
    });
    return Object.keys(counts).map((key) => ({
      stage: key,
      FPOs: counts[key]
    }));
  }, [computedFpos]);

  const tableDataForPdf = computedFpos
    .filter((f) => f.visible)
    .map((f) => [f.name, f.location, f.growers, f.acreage, `${f.compliance}%`, f.stage, f.value]);

  return (
    <AgribusinessLayout
      pageName="Contract Farming Intelligence"
      kpiStrip={kpis}
      selectedCommodity={selectedCommodity}
      setSelectedCommodity={setSelectedCommodity}
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      tableDataForPdf={tableDataForPdf}
      pdfHeaders={["FPO Partner", "Location", "Growers", "Contract Acres", "Compliance", "Pipeline Stage", "Value"]}
    >
      <div className="space-y-6">
        
        {/* Onboarding Pipeline stages */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b pb-3 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <GitPullRequest className="w-4 h-4 text-[#31572c]" /> FPO Acquisition & Integration Pipeline
            </h3>
            <span className="text-[9px] bg-emerald-50 text-[#31572c] border border-emerald-200 px-2 py-0.5 rounded font-black uppercase">
              Pipeline Active
            </span>
          </div>
          
          {/* Funnel visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-gray-50 border rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-2 top-2 text-gray-200 font-black text-4xl">1</div>
              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase tracking-wider block">Stage 1</span>
                <span className="text-xs font-black text-gray-800 mt-1 block">Lead Discovery</span>
                <p className="text-[10px] text-gray-500 mt-1">Identifying high acreage supplier targets.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/60">
                <span className="text-[9px] text-gray-400 font-bold">Patiala Sourcing...</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 border rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-2 top-2 text-gray-200 font-black text-4xl">2</div>
              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase tracking-wider block">Stage 2</span>
                <span className="text-xs font-black text-gray-800 mt-1 block">Due Diligence</span>
                <p className="text-[10px] text-gray-500 mt-1">Verifying legal compliance and farm borders.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/60">
                <span className="text-[9px] text-gray-400 font-bold">Amritsar Farmers</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 border rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-2 top-2 text-gray-200 font-black text-4xl">3</div>
              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase tracking-wider block">Stage 3</span>
                <span className="text-xs font-black text-gray-800 mt-1 block">Term Sheet</span>
                <p className="text-[10px] text-gray-500 mt-1">Negotiating buy-back prices and volume commitments.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/60">
                <span className="text-[9px] text-gray-400 font-bold">Bhopal Soy Cluster</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
              <CheckCircle className="absolute right-2 top-2 text-emerald-200/30 w-12 h-12 stroke-[1]" />
              <div>
                <span className="text-[9px] text-[#31572c] font-black uppercase tracking-wider block">Stage 4</span>
                <span className="text-xs font-black text-emerald-900 mt-1 block">Active Contracts</span>
                <p className="text-[10px] text-emerald-800/80 mt-1">Active growers supplying procurement units.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-emerald-200">
                <span className="text-[9px] text-[#31572c] font-bold">6 FPOs Engaged</span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>

          </div>
        </div>

        {/* Directory & Pipeline Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table Directory */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-800 border-b pb-3">FPO Contractor Directory</h3>
            <GenericTable
              columns={[
                { header: "FPO Supplier Partner", accessor: "name", cellClassName: "font-black text-gray-900" },
                { header: "Region Hub", accessor: "location" },
                { header: "Farmers", accessor: "growers", cell: (v) => v.toLocaleString() },
                { header: "Contracted Acres", accessor: "acreage", cell: (v) => `${v.toLocaleString()} Ac` },
                { 
                  header: "Grower Compliance", 
                  accessor: "compliance", 
                  cell: (v) => {
                    if (v === 0) return <span className="text-gray-400 font-bold">—</span>;
                    const color = v >= 90 ? "text-emerald-700" : v >= 80 ? "text-amber-600" : "text-red-650";
                    return <span className={`font-black ${color}`}>{v}%</span>;
                  }
                },
                { 
                  header: "Status", 
                  accessor: "status", 
                  cell: (v) => {
                    const style = v === "Active" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200";
                    return <span className={`px-2.5 py-0.5 border rounded-lg font-bold text-[9px] uppercase tracking-wider ${style}`}>{v}</span>;
                  }
                }
              ]}
              data={computedFpos.filter((f) => f.visible)}
              showSearch={false}
              itemsPerPage={6}
              onRowClick={(row) => setSelectedFpo(row.name)}
            />
          </div>

          {/* FPO Compliance & Details card */}
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="border-b pb-3 flex justify-between items-center">
                <h3 className="text-sm font-black text-gray-800">Supplier: {activeFpoData.name}</h3>
                <span className={`px-2.5 py-0.5 border rounded-lg font-bold text-[9px] uppercase tracking-wider ${activeFpoData.status === "Active" ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                  {activeFpoData.status}
                </span>
              </div>
              
              <div className="space-y-4 pt-3 text-xs leading-relaxed">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 border p-3 rounded-xl">
                  <div>
                    <span className="text-[8px] font-black text-gray-450 uppercase block">Total Growers</span>
                    <span className="text-sm font-black text-[#31572c]">{activeFpoData.growers.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-gray-450 uppercase block">Total Contract Value</span>
                    <span className="text-sm font-black text-gray-800">{activeFpoData.value}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider">Acreage Allocation</span>
                  <p className="font-semibold text-gray-700">{activeFpoData.acreage.toLocaleString()} Acres mapped. Quality requirements: Moisture &lt;12%, foreign matter &lt;2.5%.</p>
                </div>
                <div>
                  <span className="text-[9px] text-[#31572c] font-black uppercase block tracking-wider">Historical Compliance Rate</span>
                  <p className="font-semibold text-gray-700">{activeFpoData.compliance > 0 ? `${activeFpoData.compliance}% rate of compliance on committed arrivals` : "Under preliminary review and term sheet audit."}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#31572c] text-white border rounded-xl p-3 text-[10px] text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#224222] transition-colors">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>Contact FPO Coordinator: +91 98450-XXXXX</span>
            </div>
          </div>

        </div>

      </div>
    </AgribusinessLayout>
  );
}
