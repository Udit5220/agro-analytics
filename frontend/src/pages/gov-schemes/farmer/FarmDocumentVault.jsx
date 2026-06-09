// src/pages/farmer/FarmDocumentVault.jsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  FolderKanban,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Upload,
  Eye,
  RefreshCw,
  Download,
  Trash2,
  Shield,
  IdCard,
  CreditCard,
  Wallet,
  Tractor,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ChevronRight,
  FolderOpen,
  X,
  Check,
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const FarmDocumentVault = () => {
  const { documentVaultData } = govtSchemeData;
  const { storageSummary: seedSummary, documents: seedDocuments, aiVerificationActions, expiryTimeline } =
    documentVaultData;

  const [documents, setDocuments] = useState(seedDocuments);
  const [storageSummary, setStorageSummary] = useState(seedSummary);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [renewingDocName, setRenewingDocName] = useState(null);

  const getStatusBadge = (status, statusType) => {
    const styles = {
      verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      expiring: "bg-orange-50 text-orange-700 border-orange-200",
      missing: "bg-red-50 text-red-700 border-red-200",
    };
    const icons = {
      verified: <CheckCircle className="w-3 h-3" />,
      pending: <Clock className="w-3 h-3" />,
      expiring: <AlertTriangle className="w-3 h-3" />,
      missing: <XCircle className="w-3 h-3" />,
    };
    return (
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 uppercase tracking-wider ${styles[statusType] || styles.missing}`}
      >
        {icons[statusType] || icons.missing}
        {status}
      </span>
    );
  };

  const getDocIcon = (iconName) => {
    const icons = {
      IdCard: <IdCard className="w-8 h-8 text-[#132a13]" />,
      CreditCard: <CreditCard className="w-8 h-8 text-[#31572c]" />,
      FileText: <FileText className="w-8 h-8 text-[#4f772d]" />,
      Wallet: <Wallet className="w-8 h-8 text-[#90a955]" />,
      Shield: <Shield className="w-8 h-8 text-[#132a13]" />,
      Tractor: <Tractor className="w-8 h-8 text-[#31572c]" />,
      default: <FileText className="w-8 h-8 text-[#4f772d]" />,
    };
    return icons[iconName] || icons.default;
  };

  const getPriorityColor = (priority) => {
    return priority === "high"
      ? "text-red-700 bg-red-50 border border-red-150"
      : "text-amber-705 bg-amber-50 border border-amber-150";
  };

  const handleMockUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadingDoc) return;

    // Update document status in state to "Under Review"
    const updatedDocs = documents.map((doc) => {
      if (doc.id === uploadingDoc.id) {
        return {
          ...doc,
          status: "Under Review",
          statusType: "pending",
          uploadDate: new Date().toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric"
          })
        };
      }
      return doc;
    });

    setDocuments(updatedDocs);

    // Recalculate summary cards
    const missing = updatedDocs.filter(d => d.statusType === "missing").length;
    const pending = updatedDocs.filter(d => d.statusType === "pending").length;
    setStorageSummary({
      ...storageSummary,
      missing,
      pendingReview: pending
    });

    setUploadingDoc(null);
    alert(`File uploaded successfully for ${uploadingDoc.name}! Document status is now "Under Review".`);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <FolderOpen className="h-5 w-5 text-[#4f772d]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">Document Vault</h1>
            <p className="text-xs text-gray-500">Secure digital locker for land records, certificates, and identity proofs</p>
          </div>
        </div>
      </div>

      {/* Storage Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3.5 border border-gray-150 text-center">
          <p className="text-2xl font-black text-gray-850">
            {storageSummary.totalDocuments}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total Stored</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-gray-150 text-center">
          <p className="text-2xl font-black text-emerald-600">
            {storageSummary.verified}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Verified</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-gray-150 text-center">
          <p className="text-2xl font-black text-amber-600">
            {storageSummary.pendingReview}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Pending Review</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-gray-150 text-center">
          <p className="text-2xl font-black text-orange-605">
            {storageSummary.expiringSoon}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Expiring Soon</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-gray-150 text-center">
          <p className="text-2xl font-black text-red-650">
            {storageSummary.missing}
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Missing</p>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden hover:shadow-md hover:border-[#4f772d]/15 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-gray-50 rounded-xl">
                    {getDocIcon(doc.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-xs truncate leading-snug">
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-gray-450 font-semibold uppercase tracking-wider mt-0.5">{doc.type}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  {getStatusBadge(doc.status, doc.statusType)}
                  {doc.expiryDate && doc.expiryDate !== "Valid" && (
                    <span className="text-[10px] font-mono text-gray-400">
                      Exp: {doc.expiryDate}
                    </span>
                  )}
                  {doc.expiryDate === "Valid" && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">Valid</span>
                  )}
                </div>

                {doc.uploadDate && (
                  <p className="text-[10px] text-gray-400 font-mono mb-2">
                    Uploaded: {doc.uploadDate}
                  </p>
                )}

                {doc.requiredFor && (
                  <p className="text-[10px] font-semibold text-red-650 bg-red-50/50 p-2 rounded-xl mb-3 border border-red-100/50 leading-normal">
                    * Required for: {doc.requiredFor}
                  </p>
                )}
              </div>

              <div className="flex gap-1.5 mt-2 border-t border-gray-50 pt-3">
                <button
                  onClick={() => setViewingDoc(doc)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-bold px-2 py-1.5 rounded-xl border border-gray-200 hover:bg-[#4f772d]/10 hover:border-[#4f772d]/20 transition-all text-gray-650"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                {doc.statusType === "missing" ? (
                  <button
                    onClick={() => setUploadingDoc(doc)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-bold px-2 py-1.5 rounded-xl text-white transition bg-[#4f772d] hover:bg-[#31572c] hover:shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                ) : (
                  <button
                    onClick={() => setUploadingDoc(doc)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-bold px-2 py-1.5 rounded-xl border border-gray-200 hover:bg-[#4f772d]/10 hover:border-[#4f772d]/20 transition text-gray-600"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Verification Panel */}
      <div
        className="rounded-2xl p-6 mb-6 text-white shadow-sm"
        style={{ background: "linear-gradient(135deg, #132a13, #31572c)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-[#ecf39e]" />
          <h3 className="font-bold text-sm uppercase tracking-wider">AI Verification Panel</h3>
        </div>
        <p className="text-white/85 text-xs mb-4">
          Complete {aiVerificationActions.length} required vault items to unlock estimated grants and direct subsidies.
        </p>
        <div className="space-y-3">
          {aiVerificationActions.map((action, idx) => (
            <div
              key={idx}
              className="bg-white/10 rounded-xl p-3.5 flex flex-wrap justify-between items-center gap-3 border border-white/5"
            >
              <div className="flex-1">
                <p className="text-white text-xs font-bold leading-snug">
                  {action.action}
                </p>
                <p className="text-white/70 text-[10px] font-semibold mt-1">
                  Unlocks: {action.unlocks} • Potential Benefit: <span className="text-[#ecf39e] font-bold">{action.benefit}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  if (action.action.includes("seeding")) {
                    setRenewingDocName("Aadhaar Seeding Instruction Manual");
                  } else {
                    setRenewingDocName(action.action);
                  }
                }}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider shrink-0 ${getPriorityColor(action.priority)}`}
              >
                {action.priority === "high" ? "Fix Now" : "Take Action"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Expiry Monitor Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f4f7f4]/20">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#4f772d]" />
            <h3 className="font-bold text-[#132a13] text-sm">
              Document Expiry Timeline Monitor
            </h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Active tracking dashboard of document validity schedules (12 months)
          </p>
        </div>
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {expiryTimeline.map((month, idx) => (
              <div key={idx} className="w-24 text-center">
                <div className="bg-gray-50 rounded-xl p-2 mb-2 border border-gray-100/50">
                  <p className="text-[10px] font-bold text-gray-550 font-mono">
                    {month.month}
                  </p>
                </div>
                {month.documents.length > 0 ? (
                  month.documents.map((doc, docIdx) => (
                    <div
                      key={docIdx}
                      className="mt-1 p-1.5 bg-orange-50 border border-orange-100 rounded-lg text-[10px] font-bold text-orange-700 leading-snug cursor-pointer"
                      onClick={() => setRenewingDocName(doc)}
                    >
                      {doc}
                    </div>
                  ))
                ) : (
                  <div className="mt-1 p-1 text-xs text-gray-300">-</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-3.5 bg-orange-50/50 border-t border-orange-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
            <p className="text-xs font-bold text-orange-800">
              Caste Certificate expires in 12 days. Immediate renewal required to keep SC subsidies.
            </p>
          </div>
          <button
            onClick={() => setRenewingDocName("Caste Certificate (SC)")}
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white uppercase tracking-wider transition"
          >
            Renew Now
          </button>
        </div>
      </div>

      {/* Document Detail Preview Modal */}
      {viewingDoc && createPortal(
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
              <button
                onClick={() => setViewingDoc(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            <h3 className="text-base font-bold text-[#132a13] mb-1">
              Document Preview
            </h3>
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-wider font-bold">
              {viewingDoc.type} Category
            </p>

            <div className="space-y-4">
              <div className="border border-gray-150 rounded-2xl p-5 bg-gray-50 text-center">
                <FileText className="w-12 h-12 text-[#4f772d] mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-805 leading-snug">{viewingDoc.name}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">Status: {viewingDoc.status}</p>
              </div>

              <div className="text-xs text-gray-650 space-y-1.5 bg-[#f4f7f4] rounded-xl p-3 border border-[#4f772d]/10">
                <p>Upload Date: <span className="font-bold text-gray-850">{viewingDoc.uploadDate || "N/A"}</span></p>
                <p>Expiry: <span className="font-bold text-gray-850">{viewingDoc.expiryDate || "Lifetime Verified"}</span></p>
                <p>Digital Signature: <span className="font-bold text-emerald-600 font-mono">ENCRYPTED-OK</span></p>
              </div>

              <button
                onClick={() => setViewingDoc(null)}
                className="w-full py-2.5 bg-[#132a13] hover:bg-[#31572c] text-white rounded-xl text-xs font-bold transition"
              >
                Close Preview
              </button>
            </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Mock Upload Picker Modal */}
      {uploadingDoc && createPortal(
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
              <button
                onClick={() => setUploadingDoc(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            <h3 className="text-base font-bold text-[#132a13] mb-1">
              Select Document File
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Upload credentials for: <span className="font-bold text-gray-800">{uploadingDoc.name}</span>
            </p>

            <form onSubmit={handleMockUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 hover:border-[#4f772d] rounded-2xl p-6 text-center cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-[#4f772d] mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700">Choose PDF, JPG or PNG file</p>
                <p className="text-[9px] text-gray-400 mt-1">Strict PDF limit: 2MB</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUploadingDoc(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#4f772d] hover:bg-[#31572c] text-white rounded-xl text-xs font-bold transition"
                >
                  Upload File
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Renewal Manual Steps Modal */}
      {renewingDocName && createPortal(
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-[9999] overflow-y-auto animate-fadeIn">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 shadow-xl relative animate-scaleUp">
              <button
                onClick={() => setRenewingDocName(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            <h3 className="text-base font-bold text-[#132a13] mb-1">
              Document Renewal Guidelines
            </h3>
            <p className="text-xs text-gray-500 mb-4 bg-amber-50 border border-amber-100 p-2.5 rounded-xl font-bold text-amber-800">
              Guideline for: {renewingDocName}
            </p>

            <div className="space-y-3 text-xs text-gray-650 leading-relaxed font-semibold">
              <p>To renew or link this credential, please follow these instructions:</p>
              <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-2">
                <p>1. Visit your local Common Service Center (CSC) or log in to the state E-Disha portal.</p>
                <p>2. Submit the renewal application with your Aadhaar ID and current address verification proof.</p>
                <p>3. Once issued, download the digitally signed PDF certificate and upload it to the vault.</p>
              </div>
            </div>
            <button
              onClick={() => setRenewingDocName(null)}
              className="w-full mt-5 py-2.5 bg-[#132a13] text-white rounded-xl text-xs font-bold hover:bg-[#31572c] transition"
            >
              Understood
            </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default FarmDocumentVault;
