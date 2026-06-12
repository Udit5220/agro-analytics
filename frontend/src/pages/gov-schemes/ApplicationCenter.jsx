import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  File, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MousePointerClick, 
  Loader2, 
  X, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function ApplicationCenter() {
  // Document states
  const [khasraStatus, setKhasraStatus] = useState('update_required'); // 'update_required', 'uploading', 'verifying', 'verified'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [khasraDetails, setKhasraDetails] = useState(null);

  // Application/Modal states
  const [submittingSchemeId, setSubmittingSchemeId] = useState(null);
  const [successModal, setSuccessModal] = useState(null); // stores scheme object when open
  
  // Custom toast notifications state
  const [toasts, setToasts] = useState([]);

  const fileInputRef = useRef(null);

  // Helper to trigger custom toasts
  const showToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (khasraStatus === 'update_required') {
      fileInputRef.current?.click();
    }
  };

  // Enforce file validation
  const validateAndProcessFile = (file) => {
    // 1. Accept only PDF, JPG, PNG
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file format. Please upload PDF, JPG, or PNG only.', 'error');
      return;
    }

    // 2. Max size 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      showToast('File is too large. Maximum allowed size is 5MB.', 'error');
      return;
    }

    // Start simulation
    setUploadedFile(file);
    simulateUploadAndVerification(file);
  };

  const simulateUploadAndVerification = (file) => {
    setKhasraStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          // Transition to verifying/parsing
          setKhasraStatus('verifying');
          simulateAIVerification(file);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const simulateAIVerification = async (file) => {
    const prompt = `Simulate OCR document parsing extraction of land record (Khasra) for the file named: "${file.name}".
    Extract:
    - Owner Name (make it match Suresh Kumar or similar rural family names)
    - Khata / Khewat Number (e.g., 204/348)
    - Survey/Plot Number (e.g., 42//15/2)
    - Total Area in Hectares (make it between 1.0 and 3.0 Hectares)
    - Location/District (e.g., Faridabad, Haryana)
    
    Return ONLY a single valid JSON object containing these keys: "ownerName", "khataNo", "surveyNo", "area", "district". No extra text. No markdown tags.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an automated land records OCR indexing engine. Return clean JSON.",
        temperature: 0.1
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const parsed = JSON.parse(cleanJson);
      setKhasraDetails(parsed);
      setKhasraStatus('verified');
      showToast('Land Record (Khasra) successfully parsed and verified by Gemini AI!', 'success');
    } catch (err) {
      console.error(err);
      // Fallback
      setKhasraDetails({
        ownerName: "Suresh Kumar",
        khataNo: "128/192",
        surveyNo: "14//3/1",
        area: "1.8 Hectares",
        district: "Faridabad, Haryana"
      });
      setKhasraStatus('verified');
      showToast('Khasra parsed successfully with default profile.', 'success');
    }
  };

  const handleApplyClick = (scheme) => {
    // Check document requirements
    if (khasraStatus !== 'verified') {
      showToast(`Cannot apply to "${scheme.name}". Please upload your updated Khasra (Land Record) first.`, 'warning');
      return;
    }

    // Start loading state for 1-Click apply
    setSubmittingSchemeId(scheme.id);

    // Simulate API Submission to Government portal
    setTimeout(() => {
      setSubmittingSchemeId(null);
      
      // Generate tracking ID
      const randomId = `IN-${scheme.prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      setSuccessModal({
        ...scheme,
        trackingId: randomId,
        submissionDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    }, 1800);
  };

  const resetKhasra = () => {
    setKhasraStatus('update_required');
    setUploadedFile(null);
    setUploadProgress(0);
    setKhasraDetails(null);
  };

  const catalog = [
    { 
      id: 'kusum',
      prefix: 'KUSUM',
      name: "Solar Pump Subsidy (KUSUM)", 
      agency: "Ministry of New & Renewable Energy", 
      limit: "₹50k - ₹2L", 
      time: "~15 days", 
      badge: "Fast Track" 
    },
    { 
      id: 'organic',
      prefix: 'PKVY',
      name: "Organic Certification Grant", 
      agency: "Paramparagat Krishi Vikas Yojana", 
      limit: "₹50k/ha", 
      time: "~30 days", 
      badge: "Popular" 
    },
    { 
      id: 'drip',
      prefix: 'PMKSY',
      name: "Drip Irrigation Setup", 
      agency: "Pradhan Mantri Krishi Sinchayee Yojana", 
      limit: "80% Cost", 
      time: "~20 days", 
      badge: "State Match" 
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start justify-between gap-3 animate-slideIn ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : toast.type === 'warning' 
                ? 'bg-amber-50 border-amber-200 text-amber-950' 
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />}
              <div>
                <p className="text-xs font-bold font-sans leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-brand-dark/10 rounded-xl">
            <MousePointerClick className="h-6 w-6 text-[#31572c]" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">1-Click Application Center</h1>
            <p className="text-sm text-gray-500">Unified document locker & auto-fill applications</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-brand-dark/5 text-[#31572c] px-3.5 py-1.5 rounded-xl border border-[#31572c]/10 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4" /> Secured via UIDAI & State Land API
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Document Locker (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Digital Document Locker</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">DigiLocker Linked</span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">Your state certificates are safely stored here. They will be auto-filled directly into government forms during submission.</p>
            
            <div className="space-y-4">
              {/* Aadhaar Card (Verified) */}
              <div className="p-4 border border-emerald-100 rounded-xl flex items-center justify-between bg-emerald-50/30">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100 shadow-xs">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Aadhaar Card</h4>
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-100 text-emerald-600" /> Verified (UIDAI)
                    </p>
                  </div>
                </div>
              </div>

              {/* Land Record (Khasra) Status display */}
              <div className={`p-4 border rounded-xl flex flex-col gap-3 transition-colors ${
                khasraStatus === 'verified' 
                  ? 'border-emerald-100 bg-emerald-50/30' 
                  : 'border-amber-100 bg-amber-50/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border shadow-xs ${
                      khasraStatus === 'verified' 
                        ? 'bg-white border-emerald-100 text-emerald-600' 
                        : 'bg-white border-amber-100 text-amber-600'
                    }`}>
                      <File className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">Land Record (Khasra)</h4>
                      
                      {khasraStatus === 'update_required' && (
                        <p className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Update Required (Older than 6 mos)
                        </p>
                      )}

                      {khasraStatus === 'uploading' && (
                        <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading Khasra document...
                        </p>
                      )}

                      {khasraStatus === 'verifying' && (
                        <p className="text-[11px] text-purple-600 font-bold flex items-center gap-1 mt-0.5 animate-pulse">
                          <Sparkles className="h-3.5 w-3.5" /> AI parser verifying land survey ID...
                        </p>
                      )}

                      {khasraStatus === 'verified' && (
                        <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-100 text-emerald-600" /> Verified (AI Match & Land Registry)
                        </p>
                      )}
                    </div>
                  </div>

                  {khasraStatus === 'verified' && (
                    <button 
                      onClick={resetKhasra} 
                      className="text-xs text-gray-400 hover:text-rose-500 hover:underline transition-all"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* File info helper */}
                {uploadedFile && (khasraStatus === 'uploading' || khasraStatus === 'verifying' || khasraStatus === 'verified') && (
                  <div className="text-xs text-gray-500 bg-white/70 p-2 rounded-lg border border-gray-100 flex items-center justify-between">
                    <span className="truncate max-w-[180px] font-medium">{uploadedFile.name}</span>
                    <span className="text-[10px] text-gray-400">({(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                )}

                {/* Extracted Details */}
                {khasraStatus === 'verified' && khasraDetails && (
                  <div className="text-xs bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 space-y-1 text-slate-700 font-medium">
                    <div className="font-bold text-emerald-800 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Extracted land record data:
                    </div>
                    <div className="flex justify-between border-b border-emerald-100/30 pb-0.5"><span className="text-slate-500">Owner Name:</span> <span className="font-bold text-slate-850">{khasraDetails.ownerName}</span></div>
                    <div className="flex justify-between border-b border-emerald-100/30 pb-0.5"><span className="text-slate-500">Khata No:</span> <span className="font-bold text-slate-850">{khasraDetails.khataNo}</span></div>
                    <div className="flex justify-between border-b border-emerald-100/30 pb-0.5"><span className="text-slate-500">Survey No:</span> <span className="font-bold text-slate-850">{khasraDetails.surveyNo}</span></div>
                    <div className="flex justify-between border-b border-emerald-100/30 pb-0.5"><span className="text-slate-500">Total Area:</span> <span className="font-bold text-slate-850">{khasraDetails.area}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Location:</span> <span className="font-bold text-slate-850">{khasraDetails.district}</span></div>
                  </div>
                )}
              </div>

              {/* Upload Zone */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden" 
                accept=".pdf, image/png, image/jpeg, image/jpg"
              />

              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  khasraStatus === 'verified' 
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-75' 
                    : isDragOver
                    ? 'border-[#31572c] bg-brand-dark/10 scale-[0.99]'
                    : khasraStatus !== 'update_required'
                    ? 'border-gray-200 bg-gray-50/50 cursor-not-allowed pointer-events-none'
                    : 'border-gray-300 hover:border-[#31572c] hover:bg-brand-dark/5 cursor-pointer'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                {khasraStatus === 'uploading' && (
                  <div className="flex flex-col items-center py-4">
                    <Loader2 className="h-8 w-8 text-[#31572c] animate-spin mb-3" />
                    <h4 className="text-sm font-bold text-gray-900">Uploading Document</h4>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-xs mt-3 overflow-hidden">
                      <div 
                        className="bg-brand-dark h-1.5 rounded-full transition-all duration-150" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">{uploadProgress}% uploaded</span>
                  </div>
                )}

                {khasraStatus === 'verifying' && (
                  <div className="flex flex-col items-center py-4">
                    <div className="relative mb-3 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-[#31572c] animate-spin absolute" />
                      <Sparkles className="h-4 w-4 text-[#31572c] animate-pulse" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">Verifying Details</h4>
                    <p className="text-xs text-gray-500 mt-1">Cross-referencing survey number with State Land records API...</p>
                  </div>
                )}

                {khasraStatus === 'verified' && (
                  <div className="flex flex-col items-center py-3">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2 fill-emerald-50" />
                    <h4 className="text-sm font-bold text-emerald-900">All Systems Go</h4>
                    <p className="text-xs text-emerald-700 mt-1">You are pre-approved for immediate application.</p>
                  </div>
                )}

                {khasraStatus === 'update_required' && (
                  <div className="flex flex-col items-center py-3">
                    <div className="bg-white p-3 rounded-full border border-gray-100 shadow-xs mb-3">
                      <UploadCloud className="h-6 w-6 text-gray-400 group-hover:text-[#31572c]" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">Upload Updated Khasra</h4>
                    <p className="text-xs text-gray-500 mt-1">Drag and drop or click to browse</p>
                    <p className="text-[10px] text-gray-400 mt-2">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Approved Schemes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Pre-Approved for You</h2>
                <p className="text-xs text-gray-500 mt-0.5">Based on your land size, crop types, and location profile</p>
              </div>
              <span className="text-xs font-bold bg-brand-dark/10 text-[#31572c] px-3 py-1 rounded-full shrink-0">
                {catalog.length} Ready
              </span>
            </div>

            <div className="space-y-4">
              {catalog.map((scheme) => {
                const isSubmitting = submittingSchemeId === scheme.id;
                return (
                  <div 
                    key={scheme.id} 
                    className={`p-5 border rounded-xl hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between ${
                      khasraStatus === 'verified' 
                        ? 'border-gray-200/80 hover:border-[#31572c]/30' 
                        : 'border-gray-100 opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{scheme.agency}</span>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#31572c] transition-colors">{scheme.name}</h3>
                        </div>
                        <span className="bg-brand-dark/5 text-[#31572c] text-[10px] font-bold px-2.5 py-1 rounded-md shrink-0 border border-[#31572c]/10">
                          {scheme.badge}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-3.5 text-xs font-medium text-gray-600">
                        <div className="bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100/80">
                          Benefit: <span className="font-bold text-gray-900">{scheme.limit}</span>
                        </div>
                        <div className="bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100/80">
                          Est. Time: <span className="font-bold text-gray-900">{scheme.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100/80 flex items-center justify-between flex-wrap gap-3">
                      {khasraStatus === 'verified' ? (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 fill-emerald-50" /> Auto-fill ready
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-bold flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" /> Khasra Update Required
                        </span>
                      )}

                      <button 
                        onClick={() => handleApplyClick(scheme)}
                        disabled={isSubmitting}
                        className={`text-xs font-bold text-white px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 min-w-[110px] justify-center ${
                          isSubmitting
                            ? 'bg-brand-dark/70 cursor-not-allowed'
                            : 'bg-brand-dark hover:bg-[#1f371c] active:scale-[0.98]'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            1-Click Apply <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl relative overflow-hidden animate-scaleUp">
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-[#31572c] to-emerald-600" />
            
            <div className="flex flex-col items-center text-center mt-3">
              <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-4 animate-bounce">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Application Submitted!</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                Your application has been compiled using your Digital Locker credentials and secure APIs.
              </p>
            </div>

            <div className="mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-left text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                <span className="text-gray-500 font-medium">Scheme Applied</span>
                <span className="text-gray-900 font-bold text-right truncate max-w-[200px]">{successModal.name}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                <span className="text-gray-500 font-medium">Tracking ID</span>
                <span className="text-[#31572c] font-black tracking-wider font-mono text-[13px] bg-brand-dark/5 px-2 py-0.5 rounded border border-[#31572c]/10">{successModal.trackingId}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                <span className="text-gray-500 font-medium">Timestamp</span>
                <span className="text-gray-900 font-medium">{successModal.submissionDate}</span>
              </div>
              <div className="flex justify-between items-start py-1.5">
                <span className="text-gray-500 font-medium">Data Auto-filled</span>
                <div className="text-right space-y-1">
                  <span className="block text-emerald-600 font-bold">✓ Aadhaar Identity verified</span>
                  <span className="block text-emerald-600 font-bold">✓ Land Survey Verified (AI Matched)</span>
                  <span className="block text-emerald-600 font-bold">✓ Bank Accounts details linked</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Status: Pending Department Review</span>
                <span className="text-[11px] text-emerald-700 leading-relaxed">The regional agricultural officer will review your application within 15 days. No manual action is needed.</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setSuccessModal(null)} 
                className="w-full bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs"
              >
                Track Status on Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
