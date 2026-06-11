// src/pages/gov-schemes/farmer/ApplyAndTrack.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  FolderKanban,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  FileText,
  Calendar,
  IndianRupee,
  RefreshCw,
  Eye,
  X,
  Upload,
  Check,
  Loader
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

export default function ApplyAndTrack() {
  const { applicationsData } = govtSchemeData;
  const [applications, setApplications] = useState(applicationsData.applicationsList);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showReapply, setShowReapply] = useState(false);
  const [reapplySuccess, setReapplySuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const rejection = applicationsData.rejectionAnalysis;

  const getStatusBadge = (status, text) => {
    if (status === "approved" || status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle className="w-3 h-3" />
          {text || "Approved"}
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
          <XCircle className="w-3 h-3" />
          {text || "Rejected"}
        </span>
      );
    }
    if (status === "action_needed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
          <AlertTriangle className="w-3 h-3" />
          {text || "Action Needed"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
        <Clock className="w-3 h-3" />
        {text || "In Review"}
      </span>
    );
  };

  const handleReapplyClick = () => {
    setShowReapply(true);
  };

  const handleReapplySubmit = (e) => {
    e.preventDefault();
    setReapplySuccess(true);
    setTimeout(() => {
      setApplications(prev =>
        prev.map(app =>
          app.id === rejection.applicationId
            ? { ...app, status: "in_review", statusText: "Resubmitted", currentStage: "Document Audit" }
            : app
        )
      );
      setReapplySuccess(false);
      setShowReapply(false);
      alert("Application successfully resubmitted! Status is now 'In Review'.");
    }, 1500);
  };

  return (
    <div className="p-1 sm:p-2 bg-[#f4f7f4]/40 min-h-screen font-sans animate-fadeIn">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-2.5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2e4057]/10 rounded-xl">
            <FolderKanban className="h-5 w-5 text-[#28a745]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#2e4057]">Track Applications</h1>
            <p className="text-xs text-gray-500">
              Monitor milestones, expected approvals, and address blockers for active schemes.
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Alert Box */}
      {applications.some(a => a.id === rejection.applicationId && a.status === "rejected") && (
        <div className="max-w-7xl mx-auto mb-2.5 bg-red-50/60 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-red-100 rounded-xl text-red-600 shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-red-900">
                Action Required: Application Rejected for {rejection.schemeName}
              </h3>
              <p className="text-[11px] text-red-800 font-semibold mt-0.5">
                Reason: {rejection.reason}
              </p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed max-w-2xl font-medium">
                <strong>Suggested Fix:</strong> {rejection.suggestedFix} (Missing files: <span className="underline font-bold text-[#2e4057]">{rejection.missingDocuments}</span>)
              </p>
            </div>
          </div>

          <button
            onClick={handleReapplyClick}
            className="bg-[#2e4057] hover:bg-[#28a745] text-white px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shrink-0 self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Upload & Reapply</span>
          </button>
        </div>
      )}

      {/* Submissions Pipeline Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-2.5">
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#2e4057] mb-2">Active Pipeline</h3>
            <div className="divide-y divide-gray-100">
              {applications.map((app) => (
                <div key={app.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#2e4057]">{app.schemeName}</p>
                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500 font-semibold">
                      <span>App ID: {app.id}</span>
                      <span>•</span>
                      <span>Stage: {app.currentStage}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(app.status, app.statusText)}
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-[#28a745] transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar / Deadline Badges Widget */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#2e4057] mb-2">Upcoming Cutoff Deadlines</h3>
            <div className="space-y-2.5">
              {applications.map((app) => {
                const daysLeft = app.status === "approved" ? null : app.status === "rejected" ? 2 : 12;
                if (daysLeft === null) return null;
                const isUrgent = daysLeft < 7;
                return (
                  <div
                    key={app.id}
                    className={`p-2.5 rounded-lg border flex gap-2.5 items-start ${
                      isUrgent
                        ? "bg-red-50/70 border-red-200/50 text-red-800"
                        : "bg-gray-50/70 border-gray-150 text-gray-700"
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isUrgent ? "text-red-500" : "text-gray-400"}`} />
                    <div>
                      <p className="text-[11px] font-bold leading-tight truncate max-w-[180px] text-gray-805">{app.schemeName}</p>
                      <p className="text-[9px] font-bold mt-1">
                        {isUrgent ? (
                          <span className="text-red-650 font-black">CRITICAL: {daysLeft} days remaining!</span>
                        ) : (
                          <span className="text-gray-500">{daysLeft} days left to respond</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Details View Modal (Rendered with React Portal to fit viewport) */}
      {selectedApp &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-[#2e4057] leading-tight">
                Application Details
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 font-bold">
                Verification audit milestones
              </p>

              <div className="bg-[#f4f7f4] border border-[#28a745]/10 rounded-xl p-3 my-3">
                <span className="text-[9px] font-bold text-gray-450 uppercase tracking-wider block">Scheme Name</span>
                <p className="text-xs font-bold text-[#2e4057] leading-snug">{selectedApp.schemeName}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-200/50 text-[11px] font-semibold">
                  <div>
                    <span className="text-[9px] text-gray-405 font-bold block uppercase tracking-wider">Application ID</span>
                    <span className="font-mono font-bold text-gray-750">{selectedApp.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-405 font-bold block uppercase tracking-wider">Benefit Worth</span>
                    <span className="font-bold text-[#28a745]">{selectedApp.benefitAmount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Verification Steps</span>
                
                <div className="space-y-3.5 pl-3 border-l-2 border-gray-150 relative">
                  <div className="relative">
                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#28a745] border border-white"></div>
                    <p className="text-[11px] font-bold text-gray-805">Sowing / Land Sync</p>
                    <p className="text-[9px] text-gray-450 mt-0.5">District land registry records matched successfully</p>
                  </div>
                  <div className="relative">
                    <div className={`absolute -left-[17px] top-1 w-2 h-2 rounded-full border border-white ${
                      selectedApp.status === "rejected" ? "bg-red-500" : "bg-[#28a745]"
                    }`}></div>
                    <p className="text-[11px] font-bold text-gray-800">Current Stage: {selectedApp.currentStage}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Expected Resolution: {selectedApp.expectedApproval}</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-gray-200 border border-white"></div>
                    <p className="text-[11px] font-bold text-gray-800">DBT Release Approval</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Pending stage validation authorization</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 flex gap-2 justify-end">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Reapply Submission Modal */}
      {showReapply &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowReapply(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-[#2e4057] leading-tight">
                Reapply for {rejection.schemeName}
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-semibold">
                Please upload the requested documentation:
              </p>

              <form onSubmit={handleReapplySubmit} className="space-y-3.5 mt-3">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2.5">
                  <p className="font-bold text-[#2e4057]">Required File: {rejection.missingDocuments}</p>
                  
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center hover:border-[#28a745] transition cursor-pointer relative bg-white">
                    <input
                      type="file"
                      onChange={(e) => setUploadedFile(e.target.files[0]?.name || "Verified_Caste_Doc.pdf")}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-[11px] font-bold text-gray-650">
                      {uploadedFile ? uploadedFile : "Click to select or drag & drop file"}
                    </p>
                    <p className="text-[9px] text-gray-400 mt-0.5">PDF or JPG formats up to 2MB</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReapply(false)}
                    className="flex-1 py-1.5 text-xs font-bold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadedFile}
                    className={`flex-1 py-1.5 text-xs font-bold text-white rounded-lg transition flex items-center justify-center gap-1.5 ${
                      uploadedFile ? "bg-[#2e4057] hover:bg-[#28a745]" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {reapplySuccess ? (
                      <Loader className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Submit & Reapply</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
