import React, { useState } from "react";
import {
  ShieldCheck,
  Calendar,
  FileText,
  Archive,
  Bell,
  Download,
  Eye,
  Check,
  ChevronRight,
  RefreshCw,
  Edit2,
  Save,
  MessageSquare,
  AlertTriangle,
  Mail,
  Smartphone,
  Info,
} from "lucide-react";

// Mock telemetry data that "auto-populates"
const telemetryData = {
  rkvy: {
    title: "RKVY-RAFTAAR Phase 1 Report",
    farmerCount: "2,450 Verified Landholders",
    cropArea: "4,560 Hectares",
    droneLogs: "124 Autonomous Flight Hours",
    utilizationAmount: "₹10,00,000",
  },
  aif: {
    title: "Agri-Infrastructure Fund Audit Log",
    farmerCount: "1,890 Active Members",
    cropArea: "3,120 Hectares",
    droneLogs: "86 Surveyor Flight Hours",
    utilizationAmount: "₹20,00,000",
  },
  haryana: {
    title: "Haryana State Export Quality Audit",
    farmerCount: "5 FPO Cooperatives",
    cropArea: "1,200 Greenhouse Hectares",
    droneLogs: "45 Quality Inspections",
    utilizationAmount: "₹12,50,000",
  },
};

export default function AdminComplianceCenter() {
  // Tabs: "calendar" (Calendar & Deadlines), "generator" (Auto-Report Builder), "vault" (Compliance Vault), "reminders" (Alert Settings)
  const [activeTab, setActiveTab] = useState("generator");

  // Report Builder State
  const [selectedReportType, setSelectedReportType] = useState("rkvy");
  const [reportTitle, setReportTitle] = useState(
    "Utilization Certificate - Phase 1",
  );
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [reportSignee, setReportSignee] = useState(
    "Rohan Verma (CFO, AgroIndia)",
  );
  const [auditNotes, setAuditNotes] = useState(
    "Live IoT telemetry indicates 94% moisture sensor uptime. Drone mapping verifies all 4,560 sq km of Haryana cold chains. Linkages verified for 5 Active FPOs.",
  );

  // Success indicator for report generation
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Editable Telemetry States
  const [farmerCount, setFarmerCount] = useState(telemetryData.rkvy.farmerCount);
  const [cropArea, setCropArea] = useState(telemetryData.rkvy.cropArea);
  const [droneLogs, setDroneLogs] = useState(telemetryData.rkvy.droneLogs);
  const [utilizationAmount, setUtilizationAmount] = useState(telemetryData.rkvy.utilizationAmount);
  const [fundingCode, setFundingCode] = useState("RKVY-UC-2026");

  // Archive state
  const [archiveDocs, setArchiveDocs] = useState([
    {
      id: "COMP-2026-09",
      name: "DPIIT FY25 Tax Exemption Compliance",
      code: "80-IAC/25",
      date: "2026-05-18",
      size: "1.4 MB",
      status: "Accepted",
      receipt: "REC-884021",
    },
    {
      id: "COMP-2026-05",
      name: "AIF Equipment Inspection Utilization",
      code: "AIF-UC/44",
      date: "2026-04-30",
      size: "2.1 MB",
      status: "Verified",
      receipt: "REC-104928",
    },
    {
      id: "COMP-2026-01",
      name: "PM Fasal Bima Subsidized Crop Audit",
      code: "PMFBY/25",
      date: "2026-03-15",
      size: "940 KB",
      status: "Accepted",
      receipt: "REC-092841",
    },
  ]);

  // Channel settings
  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    inapp: true,
    email: false,
  });

  const selectedTelemetry = telemetryData[selectedReportType];

  const handleChannelToggle = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReportTypeChange = (type) => {
    setSelectedReportType(type);
    setFarmerCount(telemetryData[type].farmerCount);
    setCropArea(telemetryData[type].cropArea);
    setDroneLogs(telemetryData[type].droneLogs);
    setUtilizationAmount(telemetryData[type].utilizationAmount);
    setFundingCode(`${type.toUpperCase()}-UC-2026`);
  };

  const handleGenerate = () => {
    setGenerationSuccess(true);
    // Add new file to archive
    const newDoc = {
      id: `COMP-2026-${Math.floor(Math.random() * 90) + 10}`,
      name: `${reportTitle} - Signed`,
      code: fundingCode,
      date: new Date().toISOString().split("T")[0],
      size: "1.1 MB",
      status: "Submitted",
      receipt: `REC-${Math.floor(Math.random() * 900000) + 100000}`,
    };
    setArchiveDocs((prev) => [newDoc, ...prev]);

    setTimeout(() => {
      setGenerationSuccess(false);
      setActiveTab("vault");
    }, 1800);
  };

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Header section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#28a745]" />
            Compliance & Reporting Center
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Track statutory filing schedules, compile sensor-driven utilization
            audit reports, and audit historical logs.
          </p>
        </div>

        {/* Small stats */}
        <div className="flex gap-2 text-xs font-bold text-gray-700">
          <div className="bg-white border border-gray-150 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Calendar className="w-4 h-4 text-[#28a745]" />
            <span>Next Filing: June 18</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl border border-gray-150">
        <button
          onClick={() => setActiveTab("generator")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "generator"
              ? "bg-[#2e4057] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Auto-Report Generator
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "calendar"
              ? "bg-[#2e4057] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Filings Calendar ({3} Active)
        </button>
        <button
          onClick={() => setActiveTab("vault")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "vault"
              ? "bg-[#2e4057] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Compliance Document Vault
        </button>
        <button
          onClick={() => setActiveTab("reminders")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "reminders"
              ? "bg-[#2e4057] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Reminders Channels
        </button>
      </div>

      {/* Tab 1: Auto-Report Generator */}
      {activeTab === "generator" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Form parameters */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">
              Filing Source Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Target Government Scheme
                </label>
                <select
                  value={selectedReportType}
                  onChange={(e) => handleReportTypeChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs p-2.5 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
                >
                  <option value="rkvy">RKVY-RAFTAAR Agritech Fund</option>
                  <option value="aif">
                    Agri-Infrastructure Fund Subvention
                  </option>
                  <option value="haryana">
                    Haryana State Export Capital Subsidy
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Report Title Header
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2.5 rounded-xl text-[#2e4057] font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Authorized Officer Signee
                </label>
                <input
                  type="text"
                  value={reportSignee}
                  onChange={(e) => setReportSignee(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2.5 rounded-xl text-[#2e4057] font-semibold"
                />
              </div>
            </div>

            <div className="p-3 bg-[#f4f7f4] border border-gray-150 rounded-xl space-y-1">
              <span className="block text-[8px] text-gray-400 font-extrabold uppercase">
                Platform Sync Diagnostics
              </span>
              <span className="text-[10px] font-bold text-[#28a745] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> All sensors online (5 FPOs
                tracked)
              </span>
            </div>
          </div>

          {/* Document Preview & Execution */}
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <span className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#28a745]" /> Form Template
                Preview
              </span>

              <button
                onClick={() => setIsEditingReport(!isEditingReport)}
                className="text-[10px] font-bold text-gray-500 hover:text-black flex items-center gap-1 border border-gray-200 bg-white px-2.5 py-1.5 rounded-lg transition"
              >
                {isEditingReport ? (
                  <>
                    <Save className="w-3 h-3 text-[#28a745]" /> Save Form
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3 h-3 text-gray-500" /> Edit Fields
                  </>
                )}
              </button>
            </div>

            {/* Generated/Template Body Mockup */}
            <div className="p-6 space-y-5 font-serif text-[#2e4057] bg-amber-50/10 min-h-[300px]">
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-gray-200">
                <h2 className="text-sm font-black uppercase tracking-widest">
                  FORM GFR 12-C (Utilization Certificate Rules)
                </h2>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Government of India compliance framework
                </h3>
              </div>

              <div className="text-xs leading-relaxed space-y-3">
                <p>
                  Certified that out of{" "}
                  {isEditingReport ? (
                    <input
                      type="text"
                      value={utilizationAmount}
                      onChange={(e) => setUtilizationAmount(e.target.value)}
                      className="font-sans border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-1.5 py-0.5 rounded-md font-semibold text-gray-800 bg-white inline-block w-28 mx-1 font-mono"
                    />
                  ) : (
                    <span className="font-bold border-b border-gray-300 px-1">
                      {utilizationAmount}
                    </span>
                  )}{" "}
                  grants-in-aid sanctioned during the financial period under
                  Ministry code references, a sum of{" "}
                  {isEditingReport ? (
                    <input
                      type="text"
                      value={utilizationAmount}
                      onChange={(e) => setUtilizationAmount(e.target.value)}
                      className="font-sans border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-1.5 py-0.5 rounded-md font-semibold text-gray-800 bg-white inline-block w-28 mx-1 font-mono"
                    />
                  ) : (
                    <span className="font-bold border-b border-gray-300 px-1">
                      {utilizationAmount}
                    </span>
                  )}{" "}
                  has been fully utilized for the targeted crop cultivation
                  activities.
                </p>

                {/* Telemetry data fields */}
                <div className="my-4 p-4 bg-white border border-gray-100 font-mono text-[11px] space-y-1.5 rounded-xl not-italic">
                  <span className="block text-[8px] font-bold uppercase text-gray-400">
                    Sync Telemetry Data Fields {isEditingReport ? "(Editable)" : "(Read-Only)"}
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-400 block mb-1">Total FPO Farmers:</span>{" "}
                      {isEditingReport ? (
                        <input
                          type="text"
                          value={farmerCount}
                          onChange={(e) => setFarmerCount(e.target.value)}
                          className="w-full font-mono border border-gray-200 focus:outline-none focus:border-[#28a745] text-[11px] px-2 py-1 rounded-md font-semibold text-gray-800 bg-white"
                        />
                      ) : (
                        <span className="font-black text-gray-700">
                          {farmerCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Crop Canopy Area:</span>{" "}
                      {isEditingReport ? (
                        <input
                          type="text"
                          value={cropArea}
                          onChange={(e) => setCropArea(e.target.value)}
                          className="w-full font-mono border border-gray-200 focus:outline-none focus:border-[#28a745] text-[11px] px-2 py-1 rounded-md font-semibold text-gray-800 bg-white"
                        />
                      ) : (
                        <span className="font-black text-gray-700">
                          {cropArea}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Drone Uptime Logs:</span>{" "}
                      {isEditingReport ? (
                        <input
                          type="text"
                          value={droneLogs}
                          onChange={(e) => setDroneLogs(e.target.value)}
                          className="w-full font-mono border border-gray-200 focus:outline-none focus:border-[#28a745] text-[11px] px-2 py-1 rounded-md font-semibold text-gray-800 bg-white"
                        />
                      ) : (
                        <span className="font-black text-gray-700">
                          {droneLogs}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Funding Code:</span>{" "}
                      {isEditingReport ? (
                        <input
                          type="text"
                          value={fundingCode}
                          onChange={(e) => setFundingCode(e.target.value)}
                          className="w-full font-mono border border-gray-200 focus:outline-none focus:border-[#28a745] text-[11px] px-2 py-1 rounded-md font-semibold text-[#28a745] bg-white"
                        />
                      ) : (
                        <span className="font-black text-[#28a745]">
                          {fundingCode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="block text-[8px] font-bold uppercase text-gray-400 font-sans">
                    Self-Audit Verification Notes
                  </span>
                  {isEditingReport ? (
                    <textarea
                      rows="3"
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      className="w-full font-sans border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs p-2.5 rounded-xl font-semibold text-gray-800"
                    />
                  ) : (
                    <p className="text-[11px] italic font-semibold text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-sans leading-relaxed">
                      "{auditNotes}"
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-end pt-8 font-sans">
                  <div>
                    <span className="block text-[8px] text-gray-400 font-extrabold uppercase">
                      Audit Timestamp
                    </span>
                    <span className="text-[10px] font-bold text-gray-600">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-gray-400 font-extrabold uppercase">
                      Authorized Representative Signature
                    </span>
                    <span className="text-xs font-black text-gray-900 border-b border-gray-400 px-2 italic">
                      {reportSignee}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom generate button */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={generationSuccess}
                className="bg-[#2e4057] hover:bg-[#208837] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                {generationSuccess ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling &
                    Syncing...
                  </>
                ) : (
                  <>
                    Authorize & Submit Compliance Report{" "}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Filings Calendar */}
      {activeTab === "calendar" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">
            Statutory Audit & Filings Timeline
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 border border-red-150 bg-red-50/20 rounded-2xl">
              <div className="bg-red-100 text-red-800 p-2.5 rounded-xl font-black text-xs text-center shrink-0 min-w-[50px]">
                <span className="block text-sm">18</span>
                <span className="text-[9px] uppercase font-extrabold">
                  June
                </span>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-red-950 uppercase tracking-wide">
                    DPIIT Startup tax exemption filing
                  </span>
                  <span className="text-[9px] font-black uppercase text-red-700 bg-red-100 px-2.5 py-0.5 rounded">
                    8 Days Left
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                  Submit 3-year turnover audit sheets to maintain startup tax
                  certificate benefits. Missing deadline will trigger a standard
                  taxation review.
                </p>
                <button
                  onClick={() => {
                    setSelectedReportType("rkvy");
                    setReportTitle("DPIIT FY25 Income Tax Declaration");
                    setActiveTab("generator");
                  }}
                  className="text-[10px] font-bold bg-[#2e4057] text-white hover:bg-[#208837] px-3 py-1.5 rounded-lg transition mt-2"
                >
                  Generate Report
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border border-gray-150 bg-white rounded-2xl">
              <div className="bg-gray-100 text-gray-700 p-2.5 rounded-xl font-black text-xs text-center shrink-0 min-w-[50px]">
                <span className="block text-sm">30</span>
                <span className="text-[9px] uppercase font-extrabold">
                  June
                </span>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#2e4057] uppercase tracking-wide">
                    Agri-Infrastructure utilization audits
                  </span>
                  <span className="text-[9px] font-black uppercase text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded">
                    20 Days Left
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                  Requires CA signed utilization certificate matching
                  construction ledger to authorize Tranche 2 payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Vault Archive */}
      {activeTab === "vault" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] flex items-center gap-1.5">
                <Archive className="w-4 h-4 text-[#28a745]" /> Read-Only
                Compliance Document Vault
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Archived records of submitted utilization reports
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {archiveDocs.length} Documents Archived
            </span>
          </div>

          <div className="border border-gray-150 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                  <th className="p-3">Doc Ref</th>
                  <th className="p-3">Compliance Name</th>
                  <th className="p-3">Template Reference</th>
                  <th className="p-3">Date Submitted</th>
                  <th className="p-3">Government Status</th>
                  <th className="p-3 text-right">Receipt Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold">
                {archiveDocs.map((doc, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-700">{doc.id}</td>
                    <td className="p-3 text-[#2e4057] uppercase tracking-wide">
                      {doc.name}
                    </td>
                    <td className="p-3 text-gray-500">{doc.code}</td>
                    <td className="p-3 text-gray-500">{doc.date}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          doc.status === "Verified" || doc.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-600 font-mono text-[10px] font-bold">
                      {doc.receipt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Channel configuration settings */}
      {activeTab === "reminders" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">
            Filing Reminder Channels Configuration
          </h3>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Configure system channels to broadcast upcoming compliance dates to
            the CFO and Operations Team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-2xl border transition flex flex-col justify-between h-[130px] ${
                channels.whatsapp
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="bg-white p-2 rounded-xl text-emerald-600 border border-emerald-100 shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleChannelToggle("whatsapp")}
                  className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md transition ${
                    channels.whatsapp
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {channels.whatsapp ? "Active" : "Disabled"}
                </button>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-800">
                  WhatsApp Broadcasts
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Instant alerts sent to operations number.
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition flex flex-col justify-between h-[130px] ${
                channels.sms
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="bg-white p-2 rounded-xl text-[#2e4057] border border-gray-100 shadow-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleChannelToggle("sms")}
                  className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md transition ${
                    channels.sms
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {channels.sms ? "Active" : "Disabled"}
                </button>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-800">
                  SMS Alerts Gateway
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Priority text logs.
                </span>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl border transition flex flex-col justify-between h-[130px] ${
                channels.inapp
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="bg-white p-2 rounded-xl text-[#2e4057] border border-gray-100 shadow-sm">
                  <Bell className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleChannelToggle("inapp")}
                  className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md transition ${
                    channels.inapp
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {channels.inapp ? "Active" : "Disabled"}
                </button>
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-800">
                  In-App Command Feed
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">
                  Banners inside the admin dashboard.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
