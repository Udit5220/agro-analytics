import React, { useState } from "react";
import {
  Building2,
  FileCheck,
  TrendingUp,
  Award,
  Link2,
  CheckCircle,
  Save,
  Info,
  ChevronRight,
  Upload,
  AlertCircle,
  Database,
  RefreshCw,
} from "lucide-react";

export default function AdminCompanyProfile() {
  // Tabs: "identity" (Business Identity), "financials" (Financials), "operations" (Operations), "compliance" (Compliance)
  const [activeTab, setActiveTab] = useState("identity");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cin: "U72200HR2024PTC109841",
    gst: "06AAICA8840G1ZX",
    udyam: "UDYAM-HR-0034921",
    dpiit: "DPIIT-78923",
    turnoverY1: "3.5", // Cr
    turnoverY2: "5.8", // Cr
    turnoverY3: "8.4", // Cr
    networth: "4.2", // Cr
    employees: "145",
    fpos: "5",
    states: "Haryana, Punjab, Rajasthan",
    crops: "Wheat, Paddy, Mustard",
    iso: "ISO 9001:2015, ISO 27001",
    dpdpCheck: true,
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = React.useRef(null);

  // Calculate dynamic profile completion based on filled fields
  const calculateCompletion = () => {
    let score = 0;
    if (formData.cin) score += 10;
    if (formData.gst) score += 10;
    if (formData.udyam) score += 15;
    if (formData.dpiit) score += 15;
    if (formData.turnoverY3) score += 15;
    if (formData.employees) score += 10;
    if (formData.fpos) score += 15;
    if (formData.dpdpCheck) score += 10;
    return score;
  };

  const profileScore = calculateCompletion();

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      // Validate file type
      const validTypes = ['application/pdf', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Only PDF and PNG files are allowed');
        return;
      }
      setSelectedFile(file);
      setUploadSuccess(false);

      // Simulate upload process
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }, 2000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Header section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#28a745]" />
            Company Profile Settings
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Manage corporate credentials, MSME records, financial auditing logs, and platform sync settings.
          </p>
        </div>

        {/* Dynamic Completion Widget */}
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-[280px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span>Matching Accuracy Strength</span>
              <span className="text-[#28a745]">{profileScore}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="bg-[#28a745] h-full transition-all duration-300" style={{ width: `${profileScore}%` }}></div>
            </div>
          </div>
          <span className="text-xs font-black text-gray-500 bg-white border border-gray-150 px-2 py-1 rounded-lg">
            {profileScore >= 90 ? "Excellent" : "Needs Sync"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white p-2 rounded-xl border border-gray-150">
        <button
          onClick={() => setActiveTab("identity")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "identity" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Business Identity
        </button>
        <button
          onClick={() => setActiveTab("financials")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "financials" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Financial Records
        </button>
        <button
          onClick={() => setActiveTab("operations")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "operations" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Operational Metrics
        </button>
        <button
          onClick={() => setActiveTab("compliance")}
          className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === "compliance" ? "bg-[#2e4057] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Compliance Certification
        </button>
      </div>

      {/* Grid Layout: Form vs Sync Integrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Tab forms */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-4">
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Tab 1: Business Identity */}
            {activeTab === "identity" && (
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">Official Registration Credentials</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Corporate Identity Number (CIN)</label>
                    <input
                      type="text"
                      value={formData.cin}
                      onChange={(e) => handleFieldChange("cin", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">GST Registration (GSTIN)</label>
                    <input
                      type="text"
                      value={formData.gst}
                      onChange={(e) => handleFieldChange("gst", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">MSME Udyam Registration ID</label>
                    <input
                      type="text"
                      value={formData.udyam}
                      placeholder="e.g. UDYAM-XX-00-0000000"
                      onChange={(e) => handleFieldChange("udyam", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">DPIIT Startup Recognition Code</label>
                    <input
                      type="text"
                      value={formData.dpiit}
                      placeholder="e.g. DPIIT-12345"
                      onChange={(e) => handleFieldChange("dpiit", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>
                </div>

                <div className={`border border-dashed p-4 rounded-xl text-center space-y-2 cursor-pointer transition ${isUploading ? 'border-[#28a745] bg-[#28a745]/10' : uploadSuccess ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-[#28a745] hover:bg-gray-100/50'}`} onClick={!isUploading ? handleUploadClick : undefined}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.png"
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-6 h-6 mx-auto text-[#28a745] animate-spin" />
                      <span className="block text-xs font-bold text-[#28a745]">Uploading file...</span>
                      <span className="block text-[10px] text-gray-400 font-semibold">Please wait while we process your file</span>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle className="w-6 h-6 mx-auto text-emerald-600" />
                      <span className="block text-xs font-bold text-emerald-700">File uploaded successfully!</span>
                      <span className="block text-[10px] text-emerald-600 font-semibold">{selectedFile?.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mx-auto text-gray-400" />
                      <span className="block text-xs font-bold text-gray-700">
                        {selectedFile ? selectedFile.name : "Upload Certificate PDF Scans"}
                      </span>
                      <span className="block text-[10px] text-gray-400 font-semibold">
                        {selectedFile ? `Selected: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "Maximum file size: 5MB. File types: PDF, PNG"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Financial Records */}
            {activeTab === "financials" && (
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">3-Year Audited Turnovers & Capitalization</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Turnover FY 2023-24 (in Crore)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.turnoverY1}
                      onChange={(e) => handleFieldChange("turnoverY1", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Turnover FY 2024-25 (in Crore)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.turnoverY2}
                      onChange={(e) => handleFieldChange("turnoverY2", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Turnover FY 2025-26 (in Crore)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.turnoverY3}
                      onChange={(e) => handleFieldChange("turnoverY3", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Corporate Net Worth (in Crore)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.networth}
                      onChange={(e) => handleFieldChange("networth", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Active Full-time Employees</label>
                    <input
                      type="number"
                      value={formData.employees}
                      onChange={(e) => handleFieldChange("employees", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Operational Metrics */}
            {activeTab === "operations" && (
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">FPO Cooperatives & Coverage Metrics</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Total Linked FPOs</label>
                      <input
                        type="number"
                        value={formData.fpos}
                        onChange={(e) => handleFieldChange("fpos", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Operational Target States</label>
                      <input
                        type="text"
                        value={formData.states}
                        onChange={(e) => handleFieldChange("states", e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Core Crop Canopy Cover</label>
                    <input
                      type="text"
                      value={formData.crops}
                      onChange={(e) => handleFieldChange("crops", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Compliance Certifications */}
            {activeTab === "compliance" && (
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">Standards & DPDP Act Alignment</h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Quality Certifications (e.g. ISO 9001, NPOP)</label>
                    <input
                      type="text"
                      value={formData.iso}
                      onChange={(e) => handleFieldChange("iso", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-3 py-2 rounded-xl text-gray-800 font-semibold"
                    />
                  </div>

                  {/* Toggle checkbox */}
                  <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <span className="block text-xs font-bold text-gray-800">DPDP Act Compliance Audit Check</span>
                      <span className="block text-[10px] text-gray-400 font-semibold">Verify compliance under Digital Personal Data Protection Act rules.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.dpdpCheck}
                      onChange={(e) => handleFieldChange("dpdpCheck", e.target.checked)}
                      className="w-4.5 h-4.5 accent-[#2e4057] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#2e4057] hover:bg-[#208837] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#ffc857]" /> Saved Settings
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save & Update Profile
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Col: HR/Accounting Sync Systems */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-[#28a745]" /> Automated Systems Sync
            </h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Link with external systems to auto-populate employee rolls, ledger turnovers, and startup status parameters.
            </p>

            <div className="space-y-3">
              {/* Accounting software */}
              <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800">Accounting / Ledgers</span>
                  <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Linked</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t border-gray-100 pt-2 font-semibold">
                  <span className="text-gray-400">Tally Prime API</span>
                  <button className="text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
                    <RefreshCw className="w-3 h-3" /> Sync Now
                  </button>
                </div>
              </div>

              {/* HR software */}
              <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800">HR / Payroll Systems</span>
                  <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Not Linked</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t border-gray-100 pt-2 font-semibold">
                  <span className="text-gray-400">Darwinbox / Zoho People</span>
                  <button className="text-[#2e4057] hover:underline font-bold flex items-center gap-0.5">
                    Connect Link <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
