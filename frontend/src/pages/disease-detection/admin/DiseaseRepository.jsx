import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  BookOpen,
  Database,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Activity,
  ArrowRight,
  Plus
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter
} from "recharts";

export default function DiseaseRepository() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("knowledge");
  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Tab 4 State
  const [archiveSearch, setArchiveSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const diseaseKnowledge = [
    { 
      id: 1, 
      name: "Rice Blast (Pyricularia oryzae)", 
      crop: "Rice", 
      season: "Kharif", 
      risk: "High", 
      symptoms: "Diamond-shaped lesions on leaves, collar rot, neck rot", 
      treatment: "Tricyclazole 75% WP, Azoxystrobin 25% SC", 
      confidence: 94.2, 
      temp: "25-28°C", 
      humidity: ">90%", 
      model: "Leaf Vision Model v2.4.1",
      vector: "Airborne fungal spores (Magnaporthe oryzae)",
      riskZones: "Punjab, Haryana, Guntur (AP), Cuttack (Odisha)",
      remediation: "Within 24-48 hours of initial warning threshold breach",
      mtdScans: "1.42 Lakh API requests",
      severityIndex: "84/100"
    },
    { 
      id: 2, 
      name: "Brown Plant Hopper (Nilaparvata lugens)", 
      crop: "Rice", 
      season: "Kharif", 
      risk: "Critical", 
      symptoms: "Hopperburn, yellowing and drying of foliage, vector of viruses", 
      treatment: "Imidacloprid 17.8% SL, Pymetrozine 50% WG", 
      confidence: 91.8, 
      temp: "28-32°C", 
      humidity: ">85%", 
      model: "Outbreak Predictor v1.8.3",
      vector: "Migratory brown plant hopper insects",
      riskZones: "Odisha coastal belt, Krishna-Godavari Delta (AP)",
      remediation: "Within 12 hours (quarantine and chemical barrier block)",
      mtdScans: "92,400 API requests",
      severityIndex: "91/100"
    },
    { 
      id: 3, 
      name: "Leaf Rust (Puccinia triticina)", 
      crop: "Wheat", 
      season: "Rabi", 
      risk: "High", 
      symptoms: "Orange-brown pustules on leaf surface, chlorosis", 
      treatment: "Propiconazole 25% EC, Tebuconazole 250% EC", 
      confidence: 89.5, 
      temp: "15-20°C", 
      humidity: ">70%", 
      model: "Leaf Vision Model v2.4.1",
      vector: "Urediniospores carried by high-altitude winds",
      riskZones: "Indo-Gangetic Plain, Madhya Pradesh wheat pockets",
      remediation: "Within 72 hours of first remote sensing stress signal",
      mtdScans: "1.18 Lakh API requests",
      severityIndex: "78/100"
    },
    { 
      id: 4, 
      name: "Yellow Mosaic Virus (YMV)", 
      crop: "Pulses", 
      season: "Kharif", 
      risk: "Medium", 
      symptoms: "Bright yellow patches on leaves, reduced pod size", 
      treatment: "Vector (Whitefly) management using Imidacloprid", 
      confidence: 85.0, 
      temp: "30-35°C", 
      humidity: "Moderate", 
      model: "Satellite Stress Classifier v2.0.2",
      vector: "Insect vector: Bemisia tabaci (Whitefly)",
      riskZones: "Bundelkhand (UP/MP), Karnataka pulse plateaus",
      remediation: "Within 3 days (Vector spray suppression campaign)",
      mtdScans: "38,500 API requests",
      severityIndex: "62/100"
    },
    { 
      id: 5, 
      name: "Late Blight (Phytophthora infestans)", 
      crop: "Potato", 
      season: "Rabi", 
      risk: "High", 
      symptoms: "Water-soaked lesions on leaf margins, dark brown decay", 
      treatment: "Metalaxyl 8% + Mancozeb 64% WP", 
      confidence: 92.4, 
      temp: "18-22°C", 
      humidity: ">90%", 
      model: "Spread Propagator v1.2.4",
      vector: "Water-borne zoospores and sporangia",
      riskZones: "Western UP (Agra cluster), West Bengal potato belt",
      remediation: "Within 24 hours (immediate prophylactic spray)",
      mtdScans: "84,100 API requests",
      severityIndex: "81/100"
    }
  ];

  // Tab 2: Historical Outbreaks
  const historicalOutbreaks = [
    { disease: "Rice Blast", state: "Punjab", district: "Ludhiana", crop: "Rice", season: "Kharif", year: 2024, area: 12400, loss: 1800, economic: "₹2.4 Cr", resolution: "Contained" },
    { disease: "Brown Plant Hopper", state: "Odisha", district: "Cuttack", crop: "Rice", season: "Kharif", year: 2023, area: 9800, loss: 1400, economic: "₹1.8 Cr", resolution: "Contained" },
    { disease: "Leaf Rust", state: "Maharashtra", district: "Nagpur", crop: "Wheat", season: "Rabi", year: 2023, area: 6200, loss: 800, economic: "₹1.1 Cr", resolution: "Contained" },
    { disease: "Yellow Mosaic", state: "Bihar", district: "Patna", crop: "Pulses", season: "Kharif", year: 2022, area: 4400, loss: 500, economic: "₹0.6 Cr", resolution: "Partial Loss" }
  ];

  // Trend for historical outbreaks counts
  const outbreakTrendData = [
    { year: "2019", RiceBlast: 8, BPH: 14, LeafRust: 6 },
    { year: "2020", RiceBlast: 12, BPH: 18, LeafRust: 10 },
    { year: "2021", RiceBlast: 10, BPH: 12, LeafRust: 8 },
    { year: "2022", RiceBlast: 15, BPH: 22, LeafRust: 14 },
    { year: "2023", RiceBlast: 23, BPH: 28, LeafRust: 19 },
    { year: "2024", RiceBlast: 18, BPH: 24, LeafRust: 12 }
  ];

  // Tab 4: Forecast Accuracy
  const forecastArchive = [
    { date: "2026-05-15", disease: "Rice Blast", region: "Ludhiana", pred: "High", actual: "High", acc: 94.2, version: "v2.4", fp: 12, fn: 8 },
    { date: "2026-05-10", disease: "Leaf Rust", region: "Nagpur", pred: "Medium", actual: "High", acc: 81.4, version: "v1.8", fp: 24, fn: 19 },
    { date: "2026-05-08", disease: "BPH Vector", region: "Cuttack", pred: "Low", actual: "Low", acc: 98.7, version: "v3.1", fp: 5, fn: 2 }
  ];

  const forecastScatterData = [
    { pred: 80, actual: 82 },
    { pred: 65, actual: 62 },
    { pred: 90, actual: 94 },
    { pred: 45, actual: 48 },
    { pred: 75, actual: 78 }
  ];

  // Filtered lists
  const filteredKnowledge = diseaseKnowledge.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.crop.toLowerCase().includes(search.toLowerCase());
    const matchCrop = cropFilter === "All" || d.crop === cropFilter;
    return matchSearch && matchCrop;
  });

  const handleExportKnowledge = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Disease Scientific Name,Crop Target,Season,Risk Rating,Confidence\n" +
      diseaseKnowledge.map(d => `${d.id},"${d.name}","${d.crop}","${d.season}","${d.risk}",${d.confidence}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Disease_Scientific_Repository.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-200 rounded-xl" />
        <div className="h-20 bg-slate-200 rounded-xl" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Hero Header Banner */}
      <div className="bg-[#132a13] rounded-2xl p-6 text-white border border-[#31572c]/40 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="flex flex-col space-y-1.5 z-10 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ecf39e]">
            Disease Intelligence
          </span>
          <h2 className="text-xl font-black tracking-tight">
            Disease Repository & Outbreak Registry
          </h2>
          <p className="text-xs text-slate-300 font-bold font-mono">
            Date: {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* 5 Tabs Navigation bar */}
      <div className="bg-white border border-gray-200/60 rounded-2xl p-2.5 shadow-sm flex flex-wrap gap-2">
        {[
          { id: "knowledge", label: "Disease Knowledge Database", icon: Database },
          { id: "historical", label: "Historical Outbreaks Database", icon: Calendar },
          { id: "research", label: "Research & Intelligence Briefing", icon: BookOpen },
          { id: "accuracy", label: "Forecast Accuracy Archive", icon: Activity },
          { id: "explorer", label: "Interactive Explorer", icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch("");
                setSelectedDisease(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase transition duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#31572c] text-white shadow"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Disease Knowledge Database */}
      {activeTab === "knowledge" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search disease repository..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#31572c]"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={cropFilter}
                onChange={(e) => setCropFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="All">All Crops</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Potato">Potato</option>
                <option value="Pulses">Pulses</option>
              </select>
              <button onClick={handleExportKnowledge} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900" title="Export CSV">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Grid of cards (left 2 cols if drawer is open, else full grid) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${selectedDisease ? "lg:col-span-2" : "lg:col-span-3"}`}>
              {filteredKnowledge.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-gray-900 leading-snug">{item.name}</span>
                      <span className="bg-[#31572c]/10 text-[#31572c] px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wide shrink-0">
                        {item.crop}
                      </span>
                    </div>
                    <div className="space-y-2 mt-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Symptoms</span>
                        <p className="text-gray-800 font-semibold">{item.symptoms}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[9px] uppercase tracking-wider">Treatments</span>
                        <p className="text-gray-800 font-semibold">{item.treatment}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-50 pt-3 flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span>AI Detection Accuracy: <span className="text-[#31572c] font-black">{item.confidence}%</span></span>
                    <button
                      onClick={() => setSelectedDisease(item)}
                      className="text-[#31572c] font-black hover:underline flex items-center gap-0.5"
                    >
                      View Profile <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Disease Detail Drawer */}
            {selectedDisease && (
              <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-fit animate-fadeIn">
                <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#31572c] uppercase tracking-widest">Scientific Profile</h4>
                  <button onClick={() => setSelectedDisease(null)} className="text-gray-400 hover:text-gray-600 font-black">✕</button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">Common Name</span>
                    <span className="font-black text-gray-900 text-sm leading-tight block mt-0.5">{selectedDisease.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">Crops Stages Affected</span>
                    <p className="text-slate-700 font-semibold mt-0.5">Vegetative growth phase, high foliage canopy stages.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[10px]">
                    <div>
                      <span className="text-slate-400 block font-bold text-[8px] uppercase">Temp Range</span>
                      <span className="font-bold text-slate-800">{selectedDisease.temp}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[8px] uppercase">Humidity</span>
                      <span className="font-bold text-[#31572c]">{selectedDisease.humidity}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">AI Model Detection</span>
                    <span className="font-black text-[#31572c] block mt-0.5">{selectedDisease.model}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Historical Outbreak Database */}
      {activeTab === "historical" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Historical Outbreaks Registry</h3>
              <button
                onClick={() => alert("Downloading historical outbound data package...")}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-slate-700 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition"
              >
                Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-3 pl-6 text-gray-400 font-bold uppercase">Disease</th>
                    <th className="p-3 text-gray-400 font-bold uppercase">State</th>
                    <th className="p-3 text-gray-400 font-bold uppercase">Crop</th>
                    <th className="p-3 text-gray-400 font-bold uppercase text-right">Affected Area (Ha)</th>
                    <th className="p-3 text-gray-400 font-bold uppercase text-right">Economic Impact</th>
                    <th className="p-3 text-gray-400 font-bold uppercase text-center">Resolution</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalOutbreaks.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 font-semibold text-gray-700">
                      <td className="p-3 pl-6 font-black text-gray-950">{row.disease}</td>
                      <td className="p-3 font-bold text-gray-800">{row.state}</td>
                      <td className="p-3">{row.crop}</td>
                      <td className="p-3 text-right font-mono">{row.area.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-black text-red-600">{row.economic}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-800 uppercase border border-emerald-100">
                          {row.resolution}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outbreak line chart trend */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4">
              Annual Outbreak Frequency Trend (2019-2024)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outbreakTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" style={{ fontSize: "10px", fontWeight: "bold" }} />
                  <YAxis style={{ fontSize: "10px", fontWeight: "bold" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "9px" }} />
                  <Line type="monotone" dataKey="RiceBlast" stroke="#4f772d" strokeWidth={2} name="Rice Blast" />
                  <Line type="monotone" dataKey="BPH" stroke="#f59e0b" strokeWidth={2} name="Brown Plant Hopper" />
                  <Line type="monotone" dataKey="LeafRust" stroke="#e74c3c" strokeWidth={2} name="Leaf Rust" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Research & Intelligence */}
      {activeTab === "research" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Research papers */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2">
              Scientific Publications
            </h4>
            <div className="space-y-3.5 max-h-96 overflow-y-auto scrollbar-thin">
              {[
                { title: "Epidemiological models of Rice Blast under Punjab climatic variations", source: "ICAR University", year: "2024" },
                { title: "BPH vector flight migrations: humidity and temperature thresholds", source: "ICRISAT Labs", year: "2023" },
                { title: "Tricyclazole buffer limits and soil pesticide degradation dynamics", source: "State Agri Lab", year: "2023" }
              ].map((p, i) => (
                <div key={i} className="text-xs border-b border-gray-50 pb-2">
                  <span className="font-bold text-gray-900 block leading-snug hover:text-[#31572c] cursor-pointer">
                    {p.title}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase block mt-1">
                    {p.source} • {p.year}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Government advisories */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2">
              Government Advisories
            </h4>
            <div className="space-y-3.5 max-h-96 overflow-y-auto scrollbar-thin">
              {[
                { title: "Advisory on early Kharif rice blast prevention buffers", region: "Ministry of Agriculture", date: "May 2026" },
                { title: "Pesticide buffer controls for central Maharashtra cotton farmers", region: "Maharashtra Department", date: "May 2026" }
              ].map((p, i) => (
                <div key={i} className="text-xs border-b border-gray-50 pb-2">
                  <span className="font-bold text-gray-900 block leading-snug hover:text-[#31572c] cursor-pointer">
                    {p.title}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase block mt-1">
                    {p.region} • {p.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal findings */}
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2">
              Internal Findings (AgroAnalytics)
            </h4>
            <div className="space-y-3.5 max-h-96 overflow-y-auto scrollbar-thin">
              {[
                { title: "Satellite stress detection leads vector models by 14 days in Punjab", author: "Data Team", date: "2026-05" },
                { title: "Model drift vectors during early Kharif seasons analyzed", author: "ML Ops Team", date: "2026-04" }
              ].map((p, i) => (
                <div key={i} className="text-xs border-b border-gray-50 pb-2">
                  <span className="font-bold text-gray-900 block leading-snug hover:text-[#31572c] cursor-pointer">
                    {p.title}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase block mt-1">
                    {p.author} • {p.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Forecast Accuracy Archive */}
      {activeTab === "accuracy" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Forecast Accuracy Archive</h3>
              <span className="text-[10px] font-black text-[#31572c] uppercase font-mono mt-1 block">
                Overall Archive Uptime Accuracy: 83.4% (across 12,840 predictions)
              </span>
            </div>
            <input
              type="text"
              placeholder="Search archive..."
              value={archiveSearch}
              onChange={(e) => setArchiveSearch(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[380px]">
            {/* Table */}
            <div className="lg:col-span-2 bg-white border border-gray-200/60 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col justify-between">
              <div className="overflow-x-auto flex-1 scrollbar-thin">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-3 text-gray-400 font-bold uppercase">Date</th>
                      <th className="p-3 text-gray-400 font-bold uppercase">Disease</th>
                      <th className="p-3 text-gray-400 font-bold uppercase">Region</th>
                      <th className="p-3 text-gray-400 font-bold uppercase text-right">Accuracy</th>
                      <th className="p-3 text-gray-400 font-bold uppercase font-mono">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecastArchive.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-[#4f772d]/5 font-semibold text-gray-700">
                        <td className="p-3 font-mono text-gray-500">{row.date}</td>
                        <td className="p-3 font-bold text-gray-900">{row.disease}</td>
                        <td className="p-3">{row.region}</td>
                        <td className="p-3 text-right font-mono font-black text-emerald-600">{row.acc}%</td>
                        <td className="p-3 font-mono text-gray-400">{row.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scatter chart */}
            <div className="bg-white border border-gray-200/60 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-between">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-2">
                Predicted vs Actual Severity correlation
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="pred" name="Predicted Severity" style={{ fontSize: "8px" }} />
                    <YAxis type="number" dataKey="actual" name="Actual Severity" style={{ fontSize: "8px" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#132a13", borderColor: "#31572c", color: "#fff", borderRadius: "8px", fontSize: "9px" }} />
                    <Scatter name="Predictions Archive" data={forecastScatterData} fill="#4f772d" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Interactive Explorer */}
      {activeTab === "explorer" && (
        <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm min-h-[400px] flex flex-col md:flex-row gap-6">
          {/* Left panel: List */}
          <div className="w-full md:w-64 border-r border-gray-100 pr-0 md:pr-6 space-y-3 shrink-0">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-widest mb-4">Select Disease</h4>
            {diseaseKnowledge.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDisease(item)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold leading-snug transition duration-200 cursor-pointer ${
                  selectedDisease?.id === item.id
                    ? "bg-[#31572c]/10 border-[#31572c] text-[#31572c] font-black shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.name.split(" (")[0]}
              </button>
            ))}
          </div>

          {/* Right panel: Details */}
          <div className="flex-1">
            {selectedDisease ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedDisease.name}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">Scientific Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">Symptoms profile</span>
                      <p className="font-semibold text-slate-800 mt-1">{selectedDisease.symptoms}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">Transmission Vector</span>
                      <p className="font-semibold text-slate-800 mt-1 font-mono text-[10px]">{selectedDisease.vector}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">High-Risk Regions & Zones</span>
                      <p className="font-semibold text-slate-800 mt-1">{selectedDisease.riskZones}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold block text-[8px] uppercase tracking-wider">Detection Confidence</span>
                      <span className="text-sm font-black text-[#31572c] mt-1 block">{selectedDisease.confidence}% accuracy index</span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-2 text-[10px] uppercase tracking-wider">Environmental Triggers</h5>
                    <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                      <div>
                        <span className="text-slate-400 block font-bold text-[8px] uppercase">Temperature Range</span>
                        <span className="font-bold text-slate-800">{selectedDisease.temp}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[8px] uppercase">Relative Humidity</span>
                        <span className="font-bold text-[#31572c]">{selectedDisease.humidity}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-slate-400 block font-bold text-[8px] uppercase">Treatment Protocol</span>
                      <p className="font-semibold text-slate-800 leading-snug mt-1">{selectedDisease.treatment}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <span className="text-slate-400 block font-bold text-[8px] uppercase">AI Inference Model</span>
                      <p className="font-semibold text-slate-800 font-mono text-[10px] mt-1">{selectedDisease.model}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <span className="text-slate-400 block font-bold text-[8px] uppercase">Remediation SLA</span>
                      <p className="font-bold text-red-600 mt-1">{selectedDisease.remediation}</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <span className="text-slate-400 block font-bold text-[8px] uppercase">Monthly Prediction Volume</span>
                      <p className="font-black text-slate-900 mt-1 font-mono">{selectedDisease.mtdScans}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs font-bold py-12">
                <Database size={28} className="mb-2.5 text-gray-300" />
                Select a disease scientific profile from the sidebar to inspect risk parameters.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
