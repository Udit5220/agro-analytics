import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  Upload,
  RefreshCw,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  ShieldAlert,
  Sprout,
  Trash2,
  Sparkles,
  Info,
  ExternalLink,
} from "lucide-react";
import { diagnosePlantLeafImage } from "../../services/diseaseGeminiService";
import { profileApi } from "../../services/apiService";
import LocationSelector from "../../components/LocationSelector";

// Premium Preset SVGs representing leaf disease anomalies
const PRESETS = [
  {
    id: "rice-blast",
    name: "Rice Blast Leaf Spot",
    hindi: "धान का झोंका रोग",
    fileName: "rice_blast_leaf.png",
    crop: "Rice (Paddy)",
    disease: "Rice Blast (Pyricularia oryzae)",
    base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", // Minimal dummy base64 segment
    svgPreview: (
      <svg viewBox="0 0 120 160" className="w-full h-full bg-[#132a13]/10 rounded-xl border border-[#31572c]/20 p-2">
        <path d="M60,10 C80,50 90,90 90,130 C90,150 75,150 60,150 C45,150 30,150 30,130 C30,90 40,50 60,10 Z" fill="#2d6a4f" />
        {/* Lesions */}
        <ellipse cx="60" cy="50" rx="4" ry="10" fill="#f4e285" stroke="#780000" strokeWidth="1" />
        <ellipse cx="50" cy="90" rx="3" ry="8" fill="#f4e285" stroke="#780000" strokeWidth="1" />
        <ellipse cx="70" cy="110" rx="4" ry="9" fill="#f4e285" stroke="#780000" strokeWidth="1" />
        <ellipse cx="60" cy="130" rx="2" ry="6" fill="#f4e285" stroke="#780000" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "wheat-rust",
    name: "Wheat Yellow Rust",
    hindi: "गेहूं का पीला रतवा",
    fileName: "wheat_yellow_rust.png",
    crop: "Wheat",
    disease: "Yellow Rust (Puccinia striiformis)",
    base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    svgPreview: (
      <svg viewBox="0 0 120 160" className="w-full h-full bg-[#132a13]/10 rounded-xl border border-[#31572c]/20 p-2">
        <path d="M60,5 C70,45 80,85 80,125 C80,145 70,155 60,155 C50,155 40,145 40,125 C40,85 50,45 60,5 Z" fill="#4f772d" />
        {/* Rust stripes */}
        <line x1="56" y1="30" x2="56" y2="120" stroke="#ffb703" strokeWidth="2" strokeDasharray="2 3" />
        <line x1="64" y1="40" x2="64" y2="130" stroke="#ffb703" strokeWidth="2" strokeDasharray="3 4" />
        <line x1="50" y1="60" x2="50" y2="110" stroke="#ffb703" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="70" y1="50" x2="70" y2="120" stroke="#ffb703" strokeWidth="1.5" strokeDasharray="1 3" />
      </svg>
    )
  },
  {
    id: "tomato-blight",
    name: "Tomato Early Blight",
    hindi: "टमाटर का अगेती झुलसा",
    fileName: "tomato_early_blight.png",
    crop: "Tomato",
    disease: "Early Blight (Alternaria solani)",
    base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    svgPreview: (
      <svg viewBox="0 0 120 160" className="w-full h-full bg-[#132a13]/10 rounded-xl border border-[#31572c]/20 p-2">
        {/* Leaf outline */}
        <path d="M60,15 C75,30 95,30 85,55 C98,68 95,85 75,85 C85,105 75,120 60,110 C45,120 35,105 45,85 C25,85 22,68 35,55 C25,30 45,30 60,15 Z" fill="#2d6a4f" />
        <line x1="60" y1="15" x2="60" y2="135" stroke="#1b4332" strokeWidth="1.5" />
        {/* Concentric rings leaf spots */}
        <circle cx="50" cy="50" r="8" fill="#473317" stroke="#000" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="5" fill="#f4e285" />
        <circle cx="50" cy="50" r="2" fill="#473317" />

        <circle cx="72" cy="72" r="6" fill="#473317" stroke="#000" strokeWidth="0.5" />
        <circle cx="72" cy="72" r="3.5" fill="#f4e285" />
        <circle cx="72" cy="72" r="1.5" fill="#473317" />
      </svg>
    )
  }
];

export default function LeafScanner() {
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [diagnosisReport, setDiagnosisReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);

  // Synchronize location changes
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    setSelectedPresetId("");
    setErrorMsg("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({
        base64: reader.result.split(",")[1],
        mimeType: file.type,
        fileName: file.name
      });
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset) => {
    setErrorMsg("");
    setSelectedPresetId(preset.id);
    setImagePreviewUrl(""); // Trigger SVG placeholder rendering in preview
    setSelectedImage({
      base64: preset.base64Data,
      mimeType: "image/png",
      fileName: preset.fileName
    });
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl("");
    setSelectedPresetId("");
    setDiagnosisReport(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const runAnalysis = async () => {
    if (!selectedImage) {
      setErrorMsg("Please select or upload a crop leaf image first.");
      return;
    }

    setIsScanning(true);
    setDiagnosisReport(null);
    setErrorMsg("");

    const messages = [
      "Connecting to pathology neural network...",
      "Extracting leaf cellular telemetry...",
      "Analyzing spot lesions & necrotic margins...",
      "Matching conidia spore profiles...",
      "Generating diagnostic report from agronomy databases..."
    ];

    let currentMsgIdx = 0;
    setProgressMsg(messages[currentMsgIdx]);

    const interval = setInterval(() => {
      if (currentMsgIdx < messages.length - 1) {
        currentMsgIdx++;
        setProgressMsg(messages[currentMsgIdx]);
      }
    }, 900);

    try {
      const result = await diagnosePlantLeafImage(
        selectedImage.base64,
        selectedImage.mimeType
      );
      
      clearInterval(interval);
      setDiagnosisReport(result);
    } catch (err) {
      clearInterval(interval);
      setErrorMsg(`Analysis failed: ${err.message}. Please try again.`);
    } finally {
      setIsScanning(false);
      setProgressMsg("");
    }
  };

  const getSeverityBadgeClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-950 border border-red-300 font-black";
      case "high":
        return "bg-orange-50 text-orange-950 border border-orange-300 font-bold";
      case "moderate":
        return "bg-amber-50 text-amber-950 border border-amber-300 font-bold";
      default:
        return "bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased max-w-7xl mx-auto text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Camera className="h-6 w-6 text-[#31572c]" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
              <span>AI Crop Leaf Scanner</span>
              <span className="text-gray-300 font-light text-xl">|</span>
              <span className="text-[#31572c] font-black text-sm md:text-base">
                पत्ती रोग विश्लेषक
              </span>
            </h1>
          </div>
          <p className="text-gray-900 text-[11px] md:text-xs font-semibold mt-1.5">
            Upload or capture a leaf photo to trigger instant agronomical neural diagnosis.
          </p>
        </div>
      </div>

      {/* 2-Section Compound Field Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* 3. Main Action Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Input controls & Presets */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-5">
          
          <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-2.5 border-b border-gray-200">
            <Upload className="h-4 w-4 text-[#4f772d]" />
            <span>Select Leaf Sample Source</span>
          </h2>

          {/* Preset options row */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
              Quick Test Sample Presets
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-between gap-2.5 transition-all cursor-pointer ${
                    selectedPresetId === p.id
                      ? "bg-[#31572c]/10 border-[#31572c] shadow-sm font-bold scale-[1.02]"
                      : "bg-white border-gray-300 text-gray-800 hover:border-[#31572c]"
                  }`}
                >
                  <div className="w-12 h-14 shrink-0">{p.svgPreview}</div>
                  <div className="text-center min-w-0 w-full">
                    <span className="text-[10px] font-black leading-tight text-gray-950 truncate block">
                      {p.name}
                    </span>
                    <span className="text-[8px] text-gray-600 block mt-0.5 truncate font-semibold">
                      {p.hindi}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3.5">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider block">
              Or Upload Your Crop Photo
            </span>

            {/* Custom file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Drag & Drop Upload Zone representation */}
            <div
              onClick={triggerFileSelect}
              className="border-2 border-dashed border-gray-300 hover:border-[#31572c] hover:bg-[#f4f7f4]/25 transition-all rounded-2xl p-6 text-center cursor-pointer space-y-2 flex flex-col items-center justify-center min-h-[140px]"
            >
              <div className="h-10 w-10 bg-[#31572c]/10 rounded-full flex items-center justify-center text-[#31572c]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-gray-950">
                  Drag and drop your leaf photo here
                </p>
                <p className="text-[10px] text-gray-700 font-bold mt-0.5">
                  Supports PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs font-bold text-red-950">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Master trigger button */}
          <button
            type="button"
            onClick={runAnalysis}
            disabled={!selectedImage || isScanning}
            className="w-full bg-[#31572c] text-white hover:bg-[#132a13] disabled:opacity-50 disabled:cursor-not-allowed font-black py-3 px-4 rounded-xl shadow-sm transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Activity className="w-4 h-4" />
            )}
            {isScanning ? "Scanning Crop Telemetry..." : "Run AI Pathological Scan"}
          </button>

        </div>

        {/* RIGHT COLUMN: Image Preview & Scan canvas */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm flex flex-col justify-between items-center relative overflow-hidden min-h-[380px]">
          
          <h2 className="text-[#132a13] text-sm font-bold flex items-center gap-2 pb-2.5 border-b border-gray-200 w-full">
            <Activity className="h-4 w-4 text-[#4f772d]" />
            <span>Real-time Crop Cell Analyzer</span>
          </h2>

          <div className="flex-1 w-full flex items-center justify-center py-4 relative">
            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-gray-300 max-h-[280px] w-full max-w-[280px] aspect-square flex items-center justify-center bg-gray-50 shadow-inner group">
                
                {/* Image Render */}
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded Sample"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Render Preset Leaf vector preview
                  <div className="w-full h-full p-4">
                    {PRESETS.find(p => p.id === selectedPresetId)?.svgPreview}
                  </div>
                )}

                {/* Neon Laser Scanning Bar overlay */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1.5 bg-[#4f772d] shadow-[0_0_15px_#ecf39e] animate-scanBar z-20"></div>
                )}

                {/* Clear selected file tag button */}
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white border border-gray-300 rounded-lg p-1.5 transition-all text-gray-700 shadow-md cursor-pointer opacity-0 group-hover:opacity-100 z-30"
                  title="Remove Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2 py-8 text-gray-500 select-none">
                <ShieldAlert className="w-14 h-14 mx-auto text-gray-300 stroke-[1.25]" />
                <p className="text-xs font-black text-gray-950">No Leaf Image Selected</p>
                <p className="text-[10px] text-gray-700 font-semibold max-w-[240px]">
                  Select a test leaf preset above or upload a photo to initialize pathology scanning.
                </p>
              </div>
            )}

            {/* Spinner overlaid when scanning */}
            {isScanning && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3 z-10 transition-opacity">
                <RefreshCw className="w-8 h-8 text-[#31572c] animate-spin" />
                <p className="text-xs font-black text-[#132a13] animate-pulse">
                  {progressMsg}
                </p>
              </div>
            )}
          </div>

          <div className="w-full pt-3.5 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-wider">
            <span>Target: {selectedImage ? selectedImage.fileName : "Pending"}</span>
            <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded border">
              <span className={`w-1.5 h-1.5 rounded-full ${selectedImage ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`}></span>
              {selectedImage ? "Image Loaded" : "Standby"}
            </span>
          </div>

        </div>

      </div>

      {/* 4. Complete Dynamic Report Ledger Panel */}
      {diagnosisReport && (
        <div className="bg-white border border-gray-300 rounded-3xl p-6 shadow-sm space-y-6 animate-slideUp text-left">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
            <div>
              <span className="text-[9px] font-black text-[#31572c] uppercase tracking-widest bg-[#31572c]/10 border border-[#31572c]/20 px-2.5 py-1 rounded-md">
                Diagnostic Report
              </span>
              <h3 className="text-lg font-black text-gray-950 mt-2.5">
                {diagnosisReport.plant_name}
              </h3>
            </div>
            
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="bg-white border rounded-xl px-3 py-1.5 text-center shadow-inner">
                <span className="text-[8px] text-gray-600 block uppercase tracking-wider font-bold">Health Status</span>
                <span className={`text-xs font-black uppercase ${diagnosisReport.health_status?.toLowerCase().includes("healthy") ? "text-emerald-700" : "text-red-700"}`}>
                  {diagnosisReport.health_status}
                </span>
              </div>
              <div className="bg-white border rounded-xl px-3 py-1.5 text-center shadow-inner">
                <span className="text-[8px] text-gray-600 block uppercase tracking-wider font-bold">Risk Level</span>
                <span className={`text-xs font-black uppercase px-1.5 py-0.25 rounded-md ${getSeverityBadgeClass(diagnosisReport.severity)}`}>
                  {diagnosisReport.severity}
                </span>
              </div>
              <div className="bg-white border rounded-xl px-3 py-1.5 text-center shadow-inner">
                <span className="text-[8px] text-gray-600 block uppercase tracking-wider font-bold">Confidence</span>
                <span className="text-xs font-black text-gray-950">
                  {diagnosisReport.confidence}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Blocks split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Block: Pathological details */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Primary Disease details */}
              <div className="bg-[#f4f7f4] border border-gray-300 rounded-2xl p-5 space-y-2.5">
                <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Primary Pathogen Diagnosis
                </h4>
                <p className="text-sm font-black text-[#132a13]">
                  {diagnosisReport.disease_name}
                </p>
                <div className="pt-2 border-t border-gray-200 text-xs font-semibold text-gray-800 leading-relaxed">
                  <span className="font-black text-gray-950 block mb-1">Agronomical Breakdown:</span>
                  {diagnosisReport.why_it_happened}
                </div>
              </div>

              {/* Grid lists for symptoms vs causes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Symptoms list */}
                <div className="bg-white border border-gray-300 rounded-2xl p-5 space-y-3">
                  <h5 className="text-[11px] font-black text-gray-950 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    Observed Symptoms
                  </h5>
                  <ul className="space-y-2 text-xs font-semibold text-gray-700 leading-relaxed">
                    {(diagnosisReport.symptoms || []).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Possible Causes list */}
                <div className="bg-white border border-gray-300 rounded-2xl p-5 space-y-3">
                  <h5 className="text-[11px] font-black text-gray-950 uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-sky-700" />
                    Possible Outbreak Causes
                  </h5>
                  <ul className="space-y-2 text-xs font-semibold text-gray-700 leading-relaxed">
                    {(diagnosisReport.possible_causes || []).map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Growth & Yield Impact block */}
              <div className="bg-white border border-gray-300 rounded-2xl p-5 space-y-2.5">
                <h5 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-red-600" />
                  Yield & Production Impact
                </h5>
                <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                  {diagnosisReport.impact_on_crop}
                </p>
              </div>

            </div>

            {/* Right Block: Treatments & Advice */}
            <div className="space-y-5">
              
              {/* Recovery Steps Checklist */}
              <div className="bg-white border border-gray-300 rounded-2xl p-5 space-y-3">
                <h5 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  Immediate Recovery Program
                </h5>
                <ul className="space-y-2.5 text-xs font-semibold text-gray-800 leading-relaxed">
                  {(diagnosisReport.recovery_steps || []).map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="bg-[#31572c]/10 text-[#31572c] font-black text-[9px] px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <span>Recovery Probability</span>
                  <span className="bg-[#4f772d]/10 text-[#132a13] px-2 py-0.5 rounded border border-[#31572c]/20">
                    {diagnosisReport.recovery_probability}
                  </span>
                </div>
              </div>

              {/* Treatments Panel */}
              <div className="bg-white border border-gray-300 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#31572c]" />
                  Treatment Protocols
                </h5>

                <div className="space-y-3">
                  {/* Organic panel */}
                  <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3 space-y-2">
                    <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Organic Treatment
                    </span>
                    <ul className="space-y-1.5 text-xs font-semibold text-gray-700">
                      {(diagnosisReport.organic_treatments || []).map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 shrink-0 mt-0.5">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Chemical panel */}
                  <div className="bg-amber-50/30 border border-amber-200 rounded-xl p-3 space-y-2">
                    <span className="text-[8px] font-black text-amber-800 uppercase tracking-widest bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">
                      Chemical Treatment (If critical)
                    </span>
                    <ul className="space-y-1.5 text-xs font-semibold text-gray-700">
                      {(diagnosisReport.chemical_treatments || []).map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-700 shrink-0 mt-0.5">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Simple Farmer Advice Block */}
          <div className="bg-[#31572c]/[0.03] border border-[#31572c]/30 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-black text-gray-950 uppercase tracking-widest flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#31572c]" />
              <span>Bilingual Farmer Advisory — किसान सलाह</span>
            </h4>
            <p className="text-xs font-bold text-gray-900 leading-relaxed italic bg-white border rounded-xl p-3.5 shadow-sm">
              "{diagnosisReport.farmer_advice}"
            </p>
          </div>

          {/* Long term preventive tips */}
          <div className="bg-white border border-gray-300 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-black text-gray-950 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#31572c]" />
              <span>Long-Term Outbreak Prevention</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(diagnosisReport.prevention_tips || []).map((tip, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-xl p-3 text-xs font-semibold text-gray-700 flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer warnings notes */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center text-[10px] font-bold text-gray-600 leading-relaxed">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{diagnosisReport.additional_notes}</span>
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
