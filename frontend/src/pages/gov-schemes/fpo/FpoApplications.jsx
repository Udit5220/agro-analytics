import React, { useState, useMemo } from "react";
import GenericTable from "../../../components/partials/GenericTable";
import { PageHeader, StatsCard, SchemeStatusBadge } from "./FpoSharedComponents";
import { FolderCheck, Upload, AlertTriangle, CheckCircle, ChevronRight, X, Clock, HelpCircle, Building2, ClipboardList, Info } from "lucide-react";

// DATA SECTION
const INITIAL_APPLICATIONS = [
  {
    id: "APP-001",
    projectName: "AIF Dry Warehouse · Village: Kharindwa",
    scheme: "AIF",
    valueText: "₹1.2 Cr",
    valueNum: 120000000,
    stage: "Approved",
    daysInStage: 12,
    nextAction: "Upload construction completion certificate",
    status: "Approved",
    description: "1000 MT capacity dry storage warehouse to prevent post-harvest distress selling of wheat & paddy. Eligible for 3% interest subvention.",
    subsidy: "3% Interest Subvention for 7 years on credit up to ₹2 Crore",
    officer: "Sh. Rajeev Sharma, DAO Sonipat (9812XXXXXX)",
    timeline: [
      { date: "12 Jan 2024", event: "Application drafted" },
      { date: "28 Jan 2024", event: "Submitted to district portal" },
      { date: "15 Feb 2024", event: "Site inspection completed" },
      { date: "02 Mar 2024", event: "Approved by NABARD district office" },
      { date: "Today", event: "Awaiting disbursement — completion cert pending" }
    ],
    checklist: [
      { name: "Land Registry Title Deed", status: "Verified" },
      { name: "Board Resolution (AGM)", status: "Verified" },
      { name: "FPO Registration Certificate", status: "Verified" },
      { name: "Construction Completion Certificate", status: "Missing" },
      { name: "Utilization Certificate", status: "Missing" }
    ]
  },
  {
    id: "APP-002",
    projectName: "AIF Cold Storage Unit · Sonipat",
    scheme: "AIF",
    valueText: "₹80 Lakh",
    valueNum: 8000000,
    stage: "Under Review",
    daysInStage: 34,
    nextAction: "Awaiting district officer site visit",
    status: "Under Review",
    alert: "SLA Warning: 34 days — expected review time is 21 days",
    description: "500 MT cold storage chambers for perishable horticultural products (mainly tomato and cauliflower clusters).",
    subsidy: "3% Interest Subvention + Credit Guarantee cover fee waiver",
    officer: "Sh. Rajeev Sharma, DAO Sonipat (9812XXXXXX)",
    timeline: [
      { date: "10 Feb 2024", event: "Application drafted" },
      { date: "22 Feb 2024", event: "Submitted to portal" },
      { date: "Today", event: "Awaiting site inspection and evaluation" }
    ],
    checklist: [
      { name: "Land Registry Title Deed", status: "Verified" },
      { name: "Board Resolution (AGM)", status: "Verified" },
      { name: "FPO Registration Certificate", status: "Verified" },
      { name: "Technical Feasibility Study", status: "Verified" }
    ]
  },
  {
    id: "APP-003",
    projectName: "MIDH Pack House · Bhadana Village",
    scheme: "MIDH",
    valueText: "₹50 Lakh",
    valueNum: 5000000,
    stage: "Drafting",
    daysInStage: 8,
    nextAction: "Complete DPR and upload architect quote",
    status: "Drafting",
    description: "Integrated post-harvest pack house with washing, sorting, and grading lines for member vegetable growers.",
    subsidy: "50% capital subsidy on projects up to ₹50 Lakhs limit",
    officer: "Sh. M. S. Hooda, Hort. Nodal Officer (9416XXXXXX)",
    timeline: [
      { date: "03 Jun 2024", event: "DPR drafting initiated" },
      { date: "Today", event: "Gathering structural layout quotations" }
    ],
    checklist: [
      { name: "Land Registry Title Deed", status: "Verified" },
      { name: "Detailed Project Report (DPR)", status: "Missing" },
      { name: "Architect Layout & Quotations", status: "Missing" }
    ]
  },
  {
    id: "APP-004",
    projectName: "SMAM Custom Hiring Center",
    scheme: "SMAM",
    valueText: "₹40 Lakh",
    valueNum: 4000000,
    stage: "Drafting",
    daysInStage: 3,
    nextAction: "Collect equipment supplier quotations (min 3)",
    status: "Drafting",
    description: "Farm machinery CHC pool including high-HP tractors, laser land levelers, and combine harvesters for rent.",
    subsidy: "40% to 60% procurement subsidy on approved agricultural machinery",
    officer: "District Agriculture Mechanization Desk (Sonipat)",
    timeline: [
      { date: "Yesterday", event: "CHC machinery checklist prepared" },
      { date: "Today", event: "Quotation drafts requested from dealers" }
    ],
    checklist: [
      { name: "Board Resolution (AGM)", status: "Verified" },
      { name: "Machinery Specifications", status: "Verified" },
      { name: "Min 3 Dealer Quotations", status: "Missing" }
    ]
  },
  {
    id: "APP-005",
    projectName: "NABARD Equity Grant · FPO Equity",
    scheme: "NABARD",
    valueText: "₹15 Lakh",
    valueNum: 1500000,
    stage: "Submitted",
    daysInStage: 18,
    nextAction: "Awaiting NABARD district office acknowledgment",
    status: "Submitted",
    description: "Matching equity grant request to build working capital threshold matching shareholder farmer contributions.",
    subsidy: "1:1 Matching Equity Grant up to maximum of ₹15 Lakhs per FPO",
    officer: "NABARD DDM Sonipat Office (0130-22XXXX)",
    timeline: [
      { date: "15 May 2024", event: "Equity contribution audited" },
      { date: "22 May 2024", event: "Dossier dispatched to NABARD office" },
      { date: "Today", event: "Awaiting registration acknowledgment" }
    ],
    checklist: [
      { name: "Audited Financial Statement", status: "Missing" },
      { name: "Shareholder Register", status: "Verified" },
      { name: "Bank Verification Certificate", status: "Verified" }
    ]
  }
];

const INITIAL_CORP_DOCS = [
  {
    id: "doc-gst",
    name: "GST Return Q4 2024",
    status: "Overdue",
    risk: "Blocks AIF disbursement ₹1.2 Cr",
    validTill: "Expired 31 Mar 2025"
  },
  {
    id: "doc-agm",
    name: "AGM Board Resolution 2024",
    status: "Verified",
    risk: "—",
    validTill: "Valid till Mar 2026"
  },
  {
    id: "doc-land",
    name: "Land Registry Title Deed",
    status: "Verified",
    risk: "—",
    validTill: "Permanent"
  },
  {
    id: "doc-audit",
    name: "Audited Financial Statement 2023-24",
    status: "Missing",
    risk: "Blocks NABARD Equity Grant ₹15 Lakh",
    validTill: "Pending audit sign-off"
  },
  {
    id: "doc-reg",
    name: "FPO Registration Certificate",
    status: "Verified",
    risk: "—",
    validTill: "Valid till Dec 2026"
  }
];

export default function FpoApplications() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [corpDocs, setCorpDocs] = useState(INITIAL_CORP_DOCS);
  const [selectedApp, setSelectedApp] = useState(INITIAL_APPLICATIONS[0]);
  const [uploadModalDoc, setUploadModalDoc] = useState(null);

  const columnsGrants = useMemo(() => [
    {
      header: "Project Name",
      accessor: "projectName",
      cell: (name, row) => (
        <div>
          <span className="font-bold text-gray-900 block">{name}</span>
          {row.alert && (
            <span className="text-[10px] text-red-600 font-black flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {row.alert}
            </span>
          )}
        </div>
      )
    },
    {
      header: "Scheme",
      accessor: "scheme",
      cell: (scheme) => (
        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-600">
          {scheme}
        </span>
      )
    },
    { header: "Value", accessor: "valueText", cellClassName: "font-bold text-gray-900" },
    { header: "Days in Stage", accessor: "daysInStage", cellClassName: "font-bold text-gray-800", cell: (days) => `${days} days` },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => <SchemeStatusBadge status={status} />
    }
  ], []);

  const columnsDocs = useMemo(() => [
    { header: "Document Name", accessor: "name", cellClassName: "font-bold text-gray-900" },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${
            status === "Verified"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200 animate-pulse"
          }`}
        >
          {status}
        </span>
      )
    },
    { header: "Validity", accessor: "validTill", cellClassName: "font-bold text-gray-800" },
    { header: "Financial Disqualification Risk", accessor: "risk", cellClassName: "font-bold text-red-600" },
    {
      header: "Action",
      accessor: "id",
      sortable: false,
      cellClassName: "text-right",
      cell: (id, row) => {
        const isUrgent = row.status === "Overdue" || row.status === "Missing";
        return isUrgent ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUploadNow(row);
            }}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition shadow-sm border border-red-500 block ml-auto"
          >
            Upload Now
          </button>
        ) : (
          <span className="text-gray-400 font-bold block pr-4">—</span>
        );
      }
    }
  ], []);

  // Stats
  const totalApps = applications.length;
  const inProgress = applications.filter(a => a.status === "Drafting" || a.status === "Submitted" || a.status === "Under Review").length;
  const approved = applications.filter(a => a.status === "Approved").length;
  const totalPipeline = "₹4.85 Cr";

  const handleRowClick = (app) => {
    setSelectedApp(app);
  };

  const handleUploadNow = (doc) => {
    setUploadModalDoc(doc);
  };

  const handleSimulateUpload = () => {
    if (!uploadModalDoc) return;
    
    // 1. Update Corporate Docs State
    const updatedDocs = corpDocs.map((d) => {
      if (d.id === uploadModalDoc.id) {
        return { ...d, status: "Verified", risk: "—", validTill: "Verified Today" };
      }
      return d;
    });
    setCorpDocs(updatedDocs);

    // 2. Update Application checklists and alert statuses if relevant
    const updatedApps = applications.map((app) => {
      let changed = false;
      const updatedChecklist = app.checklist.map((item) => {
        // If audited financial is missing, and we uploaded audited financial doc
        if (uploadModalDoc.id === "doc-audit" && item.name === "Audited Financial Statement") {
          changed = true;
          return { ...item, status: "Verified" };
        }
        return item;
      });

      if (changed) {
        return { ...app, checklist: updatedChecklist };
      }
      return app;
    });
    setApplications(updatedApps);
    
    // Also update selectedApp reference if it was changed
    const matchedSelected = updatedApps.find(a => a.id === selectedApp.id);
    if (matchedSelected) setSelectedApp(matchedSelected);

    setUploadModalDoc(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="FPO Applications"
        subtitle="Manage capital grants, warehouse infrastructure financing, and institutional corporate files"
      />

      {/* Explanatory Banner: "What this page does" */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 shadow-sm flex items-start gap-4 animate-fadeIn">
        <div className="p-2 bg-green-100 rounded-xl text-green-700 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-black text-brand-darkest">What this page does</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-semibold">
            This dashboard tracks the FPO's institutional grants, machinery subsidies, and infrastructure project clearances. 
            Unlike individual farmer-level schemes, these are large-scale cooperative investments (such as Dry Warehouses, 
            Cold Storages, and Custom Hiring pools) owned and run by the Sonipat FPO to improve crop aggregation and market bargaining power.
          </p>
        </div>
      </div>

      {/* Top Summary Bar using generic StatsCard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Applications"
          value={String(totalApps)}
          sub="Institutional grants active in the portal"
          icon={Building2}
        />

        <StatsCard
          title="In Progress"
          value={String(inProgress)}
          sub="Submissions under government evaluation or drafting"
          trend="40%"
          isPositive={true}
          icon={Clock}
        />

        <StatsCard
          title="Approved"
          value={String(approved)}
          sub="Subsidies sanctioned and cleared for construction"
          trend="20%"
          isPositive={true}
          icon={CheckCircle}
        />

        <StatsCard
          title="Total Pipeline Value"
          value={totalPipeline}
          sub="Cumulative value of applied capital grants"
          icon={ClipboardList}
        />
      </div>

      {/* Pipeline Stage Summary strip */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Pipeline Flow:</span>
        <div className="flex items-center gap-1.5 sm:gap-4 flex-wrap text-xs font-bold text-gray-700">
          <span className="bg-white border border-gray-200 px-3 py-1 rounded-xl">Drafting (2)</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="bg-white border border-gray-200 px-3 py-1 rounded-xl">Submitted (1)</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="bg-white border border-gray-200 px-3 py-1 rounded-xl">Under Review (1)</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-xl">Approved (1)</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="bg-white border border-gray-100 text-gray-400 px-3 py-1 rounded-xl">Disbursed (0)</span>
        </div>
      </div>

      {/* Application Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Applications Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-black text-brand-darkest uppercase tracking-wider">Active Corporate Infrastructure Grants</h3>
          </div>
          <div className="p-4">
            <GenericTable
              columns={columnsGrants}
              data={applications}
              onRowClick={handleRowClick}
              rowClassName={(row) => selectedApp.id === row.id ? "bg-green-50/70" : "hover:bg-gray-50"}
              showSearch={false}
              showSort={false}
              itemsPerPage={10}
            />
          </div>
        </div>

        {/* Right Column: Application Detail Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4">
          <div className="flex justify-between items-start pb-3 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Selected Project Details</span>
              <h3 className="text-sm font-black text-gray-950 mt-0.5">{selectedApp.projectName}</h3>
            </div>
          </div>
          <div className="space-y-3.5 text-xs text-gray-600">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Description</span>
              <p className="font-semibold text-gray-700 mt-1 leading-relaxed">{selectedApp.description}</p>
            </div>

            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Scheme Benefits</span>
              <p className="font-black text-brand-darkest mt-1">{selectedApp.subsidy}</p>
            </div>

            {/* Document Checklist */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Requirement Checklist</span>
              <div className="space-y-2 border border-gray-100 p-3 rounded-xl bg-gray-50">
                {selectedApp.checklist.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700">{item.name}</span>
                    {item.status === "Verified" ? (
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUploadNow({ id: "doc-audit", name: item.name })}
                        className="px-2.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-black transition flex items-center gap-1 border border-red-200"
                      >
                        <Upload className="w-3 h-3" />
                        Upload
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Processing Timeline</span>
              <div className="space-y-2 relative pl-4 border-l border-gray-200 ml-1.5">
                {selectedApp.timeline.map((event, idx) => (
                  <div key={idx} className="relative text-[11px] font-medium text-gray-600">
                    <span className="absolute -left-[20px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border border-white" />
                    <span className="text-gray-400 font-bold block">{event.date}</span>
                    <span className="text-gray-700 mt-0.5 block font-bold">{event.event}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 text-[11px] font-bold flex justify-between">
              <span className="text-gray-400">Assigned Officer:</span>
              <span className="text-gray-800">{selectedApp.officer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Document Status Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <FolderCheck className="w-5 h-5 text-brand-darkest" />
          <h3 className="text-xs font-black text-brand-darkest uppercase tracking-wider">FPO Corporate Documents — Compliance Health</h3>
        </div>

        <div className="p-4">
          <GenericTable
            columns={columnsDocs}
            data={corpDocs}
            rowClassName={(row) => (row.status === "Overdue" || row.status === "Missing") ? "bg-red-50 hover:bg-red-100/80" : "hover:bg-gray-50"}
            showSearch={false}
            showSort={false}
            itemsPerPage={10}
          />
        </div>
      </div>

      {/* Drag-and-drop simulated file upload modal */}
      {uploadModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-200">
            <button
              onClick={() => setUploadModalDoc(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-brand-darkest mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              Upload Corporate Document
            </h3>

            <div className="space-y-4">
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                <p className="flex justify-between">
                  <span>Uploading For:</span> <strong className="text-gray-800">{uploadModalDoc.name}</strong>
                </p>
                {uploadModalDoc.risk !== "—" && (
                  <p className="flex justify-between text-red-600 font-bold">
                    <span>Blockage Risk:</span> <span>{uploadModalDoc.risk}</span>
                  </p>
                )}
              </div>

              {/* Simulated drop area */}
              <div
                onClick={handleSimulateUpload}
                className="border-2 border-dashed border-gray-300 hover:border-green-600 rounded-xl p-8 text-center cursor-pointer transition bg-gray-50 hover:bg-green-50/30 flex flex-col items-center justify-center space-y-2 group"
              >
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-600 transition" />
                <span className="text-xs font-bold text-gray-700 block">Drag and drop file here, or click to browse</span>
                <span className="text-[10px] text-gray-400 font-medium block">PDF, JPG, PNG, DOC (max 10MB)</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalDoc(null)}
                  className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSimulateUpload}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Simulate Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
