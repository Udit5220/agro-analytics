// import React, { useState, useEffect } from 'react';
// import * as LucideIcons from 'lucide-react';
// import {
//   saveSeasonEntry,
//   getAllEntries,
//   deleteEntry,
//   getYearOverYear,
//   benchmarkYield,
//   getSoilTrend
// } from '../../../services/journalService';

// export default function FarmJournal() {
//   // Core Journal State
//   const [entries, setEntries] = useState([]);
//   const [selectedCropFilter, setSelectedCropFilter] = useState('Rice');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Form State
//   const [formData, setFormData] = useState({
//     season: 'Kharif',
//     year: '2025',
//     crop: 'Rice',
//     acreage: '',
//     totalCost: '',
//     actualYield: '',
//     actualRevenue: '',
//     soilPH: '',
//     nitrogen: '',
//     notes: ''
//   });

//   // Load entries on mount
//   useEffect(() => {
//     loadJournal();
//   }, []);

//   const loadJournal = () => {
//     const data = getAllEntries();
//     setEntries(data);
//   };

//   // Input sanitisation & changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Form Submit Action
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validations
//     if (!formData.acreage || parseFloat(formData.acreage) <= 0) {
//       alert("Please enter a valid acreage greater than 0.");
//       return;
//     }
//     if (!formData.totalCost || parseFloat(formData.totalCost) < 0) {
//       alert("Please enter a valid production cost.");
//       return;
//     }
//     if (!formData.actualYield || parseFloat(formData.actualYield) < 0) {
//       alert("Please enter actual crop yield.");
//       return;
//     }
//     if (!formData.actualRevenue || parseFloat(formData.actualRevenue) < 0) {
//       alert("Please enter total revenue.");
//       return;
//     }

//     const saved = saveSeasonEntry({
//       season: formData.season,
//       year: formData.year,
//       crop: formData.crop,
//       acreage: String(formData.acreage),
//       totalCost: String(formData.totalCost),
//       actualYield: String(formData.actualYield),
//       actualRevenue: String(formData.actualRevenue),
//       soilPH: formData.soilPH ? String(formData.soilPH) : '',
//       nitrogen: formData.nitrogen ? String(formData.nitrogen) : '',
//       notes: formData.notes
//     });

//     if (saved) {
//       setSuccessMessage('Entry logged successfully! फसल का विवरण सहेज लिया गया है।');
//       loadJournal();

//       // Reset form fields with defaults intact
//       setFormData({
//         season: 'Kharif',
//         year: '2025',
//         crop: 'Rice',
//         acreage: '',
//         totalCost: '',
//         actualYield: '',
//         actualRevenue: '',
//         soilPH: '',
//         nitrogen: '',
//         notes: ''
//       });

//       // Clear toast message after 3.5s
//       setTimeout(() => setSuccessMessage(''), 3500);
//     }
//   };

//   // Delete Action
//   const handleDelete = (id) => {
//     if (confirm("Are you sure you want to delete this historical record?")) {
//       const ok = deleteEntry(id);
//       if (ok) {
//         loadJournal();
//       }
//     }
//   };

//   // Resolve Year over Year data for selected crop comparison
//   const yoyData = getYearOverYear(selectedCropFilter);
//   const maxYoYYield = yoyData.length > 0 ? Math.max(...yoyData.map(d => d.yieldVal), 10) : 10;
//   const maxYoYProfit = yoyData.length > 0 ? Math.max(...yoyData.map(d => d.profitVal), 1000) : 1000;

//   // Resolve soil trends for visual charts
//   const soilTrendData = getSoilTrend(entries);

//   // Compute overall average yield for benchmarking based on logged entries
//   const getCropAverageYield = (cropName) => {
//     const cropEntries = entries.filter(e => e.crop.toLowerCase() === cropName.toLowerCase());
//     if (cropEntries.length === 0) return 0;
//     const totalYield = cropEntries.reduce((sum, e) => sum + parseFloat(e.actualYield), 0);
//     const totalAcreage = cropEntries.reduce((sum, e) => sum + parseFloat(e.acreage), 0);
//     return parseFloat((totalYield / totalAcreage).toFixed(1));
//   };

//   return (
//     <div className="space-y-8 animate-fadeIn">

//       {/* Page Title Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//         <div>
//           <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
//             <span>Historical Farm Journal</span>
//             <span className="text-[#132a13] font-bold text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
//               फसल डायरी (इतिहास)
//             </span>
//           </h1>
//           <p className="text-gray-500 text-[11px] md:text-xs tracking-normal mt-1 font-medium">
//             Log seasonal production outcomes, evaluate year-over-year cost efficiency, and benchmark performance metrics.
//           </p>
//         </div>
//       </div>

//       {/* Success notification banner */}
//       {successMessage && (
//         <div className="bg-[#4f772d]/10 border border-[#90a955]/40 text-[#132a13] font-semibold text-xs py-3 px-4 rounded-xl flex items-center space-x-2.5 shadow-sm animate-pulse">
//           <LucideIcons.CheckCircle2 className="h-4.5 w-4.5 text-[#31572c] shrink-0" />
//           <span>{successMessage}</span>
//         </div>
//       )}

//       {/* Grid: Form (Section 1) & Benchmarking overview (Section 4 top) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* Section 1: Add Entry Form */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
//           <h2 className="text-[#31572c] font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3">
//             <LucideIcons.FilePlus className="h-4.5 w-4.5" />
//             <span>Log Current Season Outcome</span>
//             <span className="text-gray-400 font-medium text-xs lowercase tracking-normal font-sans">(नया सीजन विवरण जोड़ें)</span>
//           </h2>

//           <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

//             {/* Season select */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Season / मौसम</label>
//               <div className="relative">
//                 <select
//                   name="season"
//                   value={formData.season}
//                   onChange={handleInputChange}
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#31572c] cursor-pointer"
//                 >
//                   <option value="Kharif">Kharif (खरीफ)</option>
//                   <option value="Rabi">Rabi (रबी)</option>
//                   <option value="Zaid">Zaid (जायद)</option>
//                 </select>
//                 <LucideIcons.ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
//               </div>
//             </div>

//             {/* Year Input */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Year / वर्ष</label>
//               <input
//                 type="number"
//                 name="year"
//                 value={formData.year}
//                 onChange={handleInputChange}
//                 min="2010"
//                 max="2030"
//                 required
//                 className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//               />
//             </div>

//             {/* Crop select */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Crop Class / फसल</label>
//               <div className="relative">
//                 <select
//                   name="crop"
//                   value={formData.crop}
//                   onChange={handleInputChange}
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#31572c] cursor-pointer"
//                 >
//                   <option value="Rice">Rice (धान)</option>
//                   <option value="Wheat">Wheat (गेहूं)</option>
//                   <option value="Cotton">Cotton (कपास)</option>
//                   <option value="Maize">Maize (मक्का)</option>
//                   <option value="Mustard">Mustard (सरसों)</option>
//                   <option value="Watermelon">Watermelon (तरबूज)</option>
//                 </select>
//                 <LucideIcons.ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
//               </div>
//             </div>

//             {/* Acreage */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Acreage / कुल क्षेत्रफल</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   name="acreage"
//                   value={formData.acreage}
//                   onChange={handleInputChange}
//                   placeholder="e.g. 5"
//                   step="0.1"
//                   required
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 pr-12 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//                 />
//                 <span className="absolute right-3 top-2 text-[10px] font-bold text-gray-400">Acres</span>
//               </div>
//             </div>

//             {/* Production cost */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Cost / उत्पादन लागत</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   name="totalCost"
//                   value={formData.totalCost}
//                   onChange={handleInputChange}
//                   placeholder="e.g. 20000"
//                   required
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 pl-7 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//                 />
//                 <span className="absolute left-3 top-2.5 text-xs text-gray-400">₹</span>
//               </div>
//             </div>

//             {/* Actual yield */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Actual Yield / कुल उपज</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   name="actualYield"
//                   value={formData.actualYield}
//                   onChange={handleInputChange}
//                   placeholder="e.g. 110"
//                   required
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 pr-12 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//                 />
//                 <span className="absolute right-3 top-2 text-[10px] font-bold text-gray-400">Qtl</span>
//               </div>
//             </div>

//             {/* Actual revenue */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Gross Revenue / सकल आय</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   name="actualRevenue"
//                   value={formData.actualRevenue}
//                   onChange={handleInputChange}
//                   placeholder="e.g. 60000"
//                   required
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 pl-7 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//                 />
//                 <span className="absolute left-3 top-2.5 text-xs text-gray-400">₹</span>
//               </div>
//             </div>

//             {/* Soil pH (Optional) */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Soil pH (Opt) / पीएच मान</label>
//               <input
//                 type="number"
//                 name="soilPH"
//                 value={formData.soilPH}
//                 onChange={handleInputChange}
//                 placeholder="e.g. 6.7"
//                 step="0.1"
//                 min="3.0"
//                 max="10.0"
//                 className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//               />
//             </div>

//             {/* Nitrogen Level (Optional) */}
//             <div className="flex flex-col space-y-1">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nitrogen Level / नाइट्रोजन</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   name="nitrogen"
//                   value={formData.nitrogen}
//                   onChange={handleInputChange}
//                   placeholder="e.g. 280"
//                   className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 pr-12 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c]"
//                 />
//                 <span className="absolute right-3 top-2 text-[9px] font-bold text-gray-400">kg/ha</span>
//               </div>
//             </div>

//             {/* Notes */}
//             <div className="flex flex-col space-y-1 sm:col-span-2 md:col-span-3">
//               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Field Notes / टिप्पणी</label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 placeholder="Log pest occurrences, heavy rain timings, or fertilizer types used..."
//                 className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 h-16 focus:outline-none focus:ring-2 focus:ring-[#31572c] font-sans"
//               />
//             </div>

//             {/* Submit Action */}
//             <div className="sm:col-span-2 md:col-span-3 pt-2 text-right">
//               <button
//                 type="submit"
//                 className="bg-[#31572c] hover:bg-[#132a13] text-[#ecf39e] text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] inline-flex items-center space-x-2 cursor-pointer"
//               >
//                 <LucideIcons.Save className="h-4 w-4" />
//                 <span>Save Seasonal Entry</span>
//               </button>
//             </div>

//           </form>

//         </div>

//         {/* Dynamic Regional Benchmarking Stats */}
//         <div className="bg-[#132a13] text-white border border-[#31572c]/40 rounded-2xl p-5 shadow-sm space-y-4">
//           <h2 className="text-[#ecf39e] font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 border-b border-[#31572c]/30 pb-3">
//             <LucideIcons.Award className="h-4.5 w-4.5" />
//             <span>Yield Benchmarking</span>
//           </h2>

//           <div className="space-y-4 text-xs">
//             {['Rice', 'Wheat'].map((cropKey) => {
//               const myAvg = getCropAverageYield(cropKey);
//               const bench = benchmarkYield(cropKey, 'Faridabad', myAvg);

//               return (
//                 <div key={cropKey} className="bg-[#4f772d]/20 border border-[#90a955]/20 rounded-xl p-3.5 space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="font-extrabold text-sm text-[#ecf39e]">{cropKey} Suitability</span>
//                     {myAvg > 0 && (
//                       <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
//                         bench.gapPercent >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
//                       }`}>
//                         {bench.gapPercent >= 0 ? `+${bench.gapPercent}%` : `${bench.gapPercent}%`} vs District
//                       </span>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-300 border-b border-[#31572c]/30 pb-2">
//                     <div>
//                       <p className="text-[9px] uppercase font-bold text-gray-400">My Avg</p>
//                       <p className="text-sm font-black text-white mt-0.5">{myAvg > 0 ? `${myAvg} qtl` : 'No logs'}</p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] uppercase font-bold text-gray-400">Dist Avg</p>
//                       <p className="text-sm font-black text-[#ecf39e] mt-0.5">{bench.districtAvg} qtl</p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] uppercase font-bold text-gray-400">Nat Avg</p>
//                       <p className="text-sm font-black text-gray-300 mt-0.5">{bench.nationalAvg} qtl</p>
//                     </div>
//                   </div>

//                   {myAvg > 0 ? (
//                     <p className="text-[10px] text-gray-350 leading-relaxed italic">
//                       {bench.suggestion}
//                     </p>
//                   ) : (
//                     <p className="text-[9px] text-gray-400 leading-normal italic">
//                       * Log at least one seasonal outcome to load localized gap analysis advisory reports.
//                     </p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//       </div>

//       {/* Section 3: Year over Year Crop Outcomes Comparison Chart */}
//       <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">

//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
//           <h2 className="text-[#31572c] font-bold text-sm tracking-wide uppercase flex items-center gap-1.5">
//             <LucideIcons.TrendingUp className="h-4.5 w-4.5" />
//             <span>Year over Year Performance comparison</span>
//             <span className="text-gray-400 font-medium text-xs lowercase tracking-normal font-sans">(वार्षिक तुलनात्मक विश्लेषण)</span>
//           </h2>

//           {/* Crop Selector Filter */}
//           <div className="flex items-center space-x-2">
//             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Select Crop:</span>
//             <div className="relative">
//               <select
//                 value={selectedCropFilter}
//                 onChange={(e) => setSelectedCropFilter(e.target.value)}
//                 className="bg-[#f4f7f4] border border-[#90a955]/30 rounded-lg px-2.5 py-1 text-xs font-bold text-[#132a13] appearance-none pr-8 cursor-pointer focus:outline-none"
//               >
//                 <option value="Rice">Rice (धान)</option>
//                 <option value="Wheat">Wheat (गेहूं)</option>
//                 <option value="Cotton">Cotton (कपास)</option>
//                 <option value="Maize">Maize (मक्का)</option>
//                 <option value="Mustard">Mustard (सरसों)</option>
//                 <option value="Watermelon">Watermelon (तरबूज)</option>
//               </select>
//               <LucideIcons.ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-[#132a13] pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* YoY CSS charts */}
//         {yoyData.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">

//             {/* Chart: Yield trends */}
//             <div className="space-y-4 bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-4">
//               <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
//                 <LucideIcons.Activity className="h-4 w-4 text-[#4f772d]" />
//                 Yield Productivity Trends (qtl/acre)
//               </h3>

//               <div className="space-y-3.5">
//                 {yoyData.map((d) => (
//                   <div key={d.id} className="space-y-1">
//                     <div className="flex justify-between text-[10px] font-bold text-gray-600">
//                       <span>{d.season} {d.year}</span>
//                       <span className="text-gray-900">{d.yieldVal} qtl / acre</span>
//                     </div>
//                     {/* Bar container */}
//                     <div className="h-6 w-full bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center p-0.5">
//                       <div
//                         className="h-full bg-gradient-to-r from-[#90a955] to-[#31572c] rounded-md transition-all duration-700"
//                         style={{ width: `${(d.yieldVal / maxYoYYield) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Chart: Profit trends */}
//             <div className="space-y-4 bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-4">
//               <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
//                 <LucideIcons.Coins className="h-4 w-4 text-[#4f772d]" />
//                 Net Profit Per Acre Trends (₹/acre)
//               </h3>

//               <div className="space-y-3.5">
//                 {yoyData.map((d) => (
//                   <div key={d.id} className="space-y-1">
//                     <div className="flex justify-between text-[10px] font-bold text-gray-600">
//                       <span>{d.season} {d.year}</span>
//                       <span className="text-emerald-700 font-bold">₹{d.profitVal.toLocaleString('en-IN')} / acre</span>
//                     </div>
//                     {/* Bar container */}
//                     <div className="h-6 w-full bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center p-0.5">
//                       <div
//                         className="h-full bg-gradient-to-r from-[#ecf39e] to-[#15803d] rounded-md transition-all duration-700"
//                         style={{ width: `${(d.profitVal / maxYoYProfit) * 100}%` }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//           </div>
//         ) : (
//           <div className="bg-[#f4f7f4]/40 border border-[#90a955]/20 rounded-2xl py-8 px-6 text-center max-w-lg mx-auto">
//             <LucideIcons.LineChart className="h-8 w-8 text-[#90a955] mx-auto mb-2.5 animate-pulse" />
//             <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Insufficient Data</h4>
//             <p className="text-[10px] text-gray-500 leading-normal mt-1 max-w-sm mx-auto">
//               No entries logged for crop classification **{selectedCropFilter}** yet. Please use the log form at the top to record at least two seasons to load comparison statistics.
//             </p>
//           </div>
//         )}

//       </div>

//       {/* Grid: Table (Section 2) & Soil curve line (Section 4 bottom) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* Section 2: Table */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
//           <h2 className="text-[#31572c] font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3">
//             <LucideIcons.BookOpen className="h-4.5 w-4.5" />
//             <span>Cropping History Journal Ledger</span>
//             <span className="text-gray-400 font-medium text-xs lowercase tracking-normal font-sans">(ऐतिहासिक बहीखाता)</span>
//           </h2>

//           <div className="overflow-x-auto scroll-thin">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
//                   <th className="py-2.5 px-3">Season & Year</th>
//                   <th className="py-2.5 px-3">Crop</th>
//                   <th className="py-2.5 px-3">Acreage</th>
//                   <th className="py-2.5 px-3">Total Yield</th>
//                   <th className="py-2.5 px-3">Financials (Cost / Rev)</th>
//                   <th className="py-2.5 px-3">Net Profit</th>
//                   <th className="py-2.5 px-3 text-right">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50 text-xs font-medium">
//                 {entries.length > 0 ? (
//                   entries.map((e) => {
//                     const profit = parseFloat(e.actualRevenue) - parseFloat(e.totalCost);
//                     const roi = parseFloat(e.totalCost) > 0 ? Math.round((profit / parseFloat(e.totalCost)) * 100) : 0;

//                     return (
//                       <tr key={e.id} className="hover:bg-[#f4f7f4]/30 transition-colors">
//                         <td className="py-3 px-3">
//                           <span className="font-bold text-gray-800">{e.season}</span>
//                           <p className="text-[10px] text-gray-400">{e.year}</p>
//                         </td>
//                         <td className="py-3 px-3">
//                           <span className="font-bold text-gray-900">{e.crop}</span>
//                           <span className="text-[9px] font-bold bg-[#31572c]/10 text-[#31572c] rounded-md px-1.5 py-0.5 ml-1.5 uppercase tracking-wide">
//                             {e.season === 'Kharif' ? 'खरीफ' : e.season === 'Rabi' ? 'रबी' : 'जायद'}
//                           </span>
//                         </td>
//                         <td className="py-3 px-3 text-gray-800 font-bold">
//                           {e.acreage} Acres
//                         </td>
//                         <td className="py-3 px-3">
//                           <span className="font-bold text-gray-800">{e.actualYield} Qtl</span>
//                           <p className="text-[10px] text-gray-400">({parseFloat((parseFloat(e.actualYield)/parseFloat(e.acreage)).toFixed(1))} qtl/ac)</p>
//                         </td>
//                         <td className="py-3 px-3 text-gray-650">
//                           <p className="text-gray-550">Cost: ₹{parseFloat(e.totalCost).toLocaleString('en-IN')}</p>
//                           <p className="font-bold text-gray-855">Rev: ₹{parseFloat(e.actualRevenue).toLocaleString('en-IN')}</p>
//                         </td>
//                         <td className="py-3 px-3">
//                           <span className={`font-black text-sm ${profit >= 0 ? 'text-[#15803d]' : 'text-red-600'}`}>
//                             {profit >= 0 ? `+₹${profit.toLocaleString('en-IN')}` : `-₹${Math.abs(profit).toLocaleString('en-IN')}`}
//                           </span>
//                           <p className="mt-0.5">
//                             <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
//                               roi >= 0 ? 'bg-[#15803d]/10 text-[#15803d]' : 'bg-red-50 text-red-600'
//                             }`}>
//                               {roi >= 0 ? `${roi}% ROI` : `${roi}% ROI`}
//                             </span>
//                           </p>
//                         </td>
//                         <td className="py-3 px-3 text-right">
//                           <button
//                             onClick={() => handleDelete(e.id)}
//                             className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 transition-all cursor-pointer active:scale-95"
//                             title="Delete Record"
//                           >
//                             <LucideIcons.Trash2 className="h-4 w-4" />
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="py-8 text-center text-gray-500 font-sans italic">
//                       No entries logged yet. Add your first season details using the form above.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//         </div>

//         {/* Section 4 bottom: Soil Chemistry Curves Line SVG Chart */}
//         <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-4">
//           <h2 className="text-[#31572c] font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3">
//             <LucideIcons.LineChart className="h-4.5 w-4.5" />
//             <span>Soil chemistry curve logs</span>
//           </h2>

//           {soilTrendData.length >= 2 ? (
//             <div className="space-y-4">
//               <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
//                 <span className="flex items-center gap-1 text-[#31572c]"><span className="h-2 w-2 rounded-full bg-[#31572c]" /> pH level</span>
//                 <span className="flex items-center gap-1 text-[#15803d]"><span className="h-2 w-2 rounded-full bg-[#15803d]" /> Nitrogen (kg/ha)</span>
//               </div>

//               {/* Responsive SVG Line Plot */}
//               <div className="relative pt-2">
//                 <svg viewBox="0 0 300 150" className="w-full overflow-visible">
//                   {/* Grid Lines */}
//                   <line x1="20" y1="20" x2="280" y2="20" stroke="#f1f5f9" strokeWidth="1" />
//                   <line x1="20" y1="75" x2="280" y2="75" stroke="#f1f5f9" strokeWidth="1" />
//                   <line x1="20" y1="130" x2="280" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />

//                   {/* Coordinates calculations */}
//                   {(() => {
//                     const pointsCount = soilTrendData.length;
//                     const spacing = 260 / (pointsCount - 1);

//                     const minPH = 5.0, maxPH = 8.5;
//                     const minN = 150, maxN = 350;

//                     const getPHCoordinate = (val, idx) => {
//                       const x = 20 + idx * spacing;
//                       const y = 130 - ((val - minPH) / (maxPH - minPH)) * 100;
//                       return { x, y };
//                     };

//                     const getNCoordinate = (val, idx) => {
//                       const x = 20 + idx * spacing;
//                       const y = 130 - ((val - minN) / (maxN - minN)) * 100;
//                       return { x, y };
//                     };

//                     const phCoords = soilTrendData.map((d, i) => getPHCoordinate(d.pH, i));
//                     const nCoords = soilTrendData.map((d, i) => getNCoordinate(d.nitrogen, i));

//                     // Build path strings
//                     const phPath = phCoords.reduce((acc, c, idx) => acc + (idx === 0 ? `M ${c.x} ${c.y}` : ` L ${c.x} ${c.y}`), '');
//                     const nPath = nCoords.reduce((acc, c, idx) => acc + (idx === 0 ? `M ${c.x} ${c.y}` : ` L ${c.x} ${c.y}`), '');

//                     return (
//                       <>
//                         {/* pH Line */}
//                         <path d={phPath} fill="none" stroke="#31572c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                         {phCoords.map((c, i) => (
//                           <g key={`ph-${i}`}>
//                             <circle cx={c.x} cy={c.y} r="4" fill="#132a13" stroke="#fff" strokeWidth="1.5" />
//                             <text x={c.x} y={c.y - 8} fontSize="7" fontWeight="bold" textAnchor="middle" fill="#31572c">
//                               {soilTrendData[i].pH} pH
//                             </text>
//                             {/* X-axis labels */}
//                             <text x={c.x} y="142" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#94a3b8">
//                               {soilTrendData[i].label}
//                             </text>
//                           </g>
//                         ))}

//                         {/* Nitrogen Line */}
//                         <path d={nPath} fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                         {nCoords.map((c, i) => (
//                           <g key={`n-${i}`}>
//                             <circle cx={c.x} cy={c.y} r="4" fill="#15803d" stroke="#fff" strokeWidth="1.5" />
//                             <text x={c.x} y={c.y - 8} fontSize="7" fontWeight="bold" textAnchor="middle" fill="#15803d">
//                               {soilTrendData[i].nitrogen}
//                             </text>
//                           </g>
//                         ))}
//                       </>
//                     );
//                   })()}
//                 </svg>
//               </div>

//               <p className="text-[9px] font-medium text-gray-400 italic leading-snug mt-3">
//                 * Trend line monitors active chemical enrichment ratios over consecutive growing periods. Ensure consistent seasonal updates.
//               </p>
//             </div>
//           ) : (
//             <div className="bg-[#f4f7f4]/40 border border-[#90a955]/20 rounded-2xl py-8 px-6 text-center max-w-sm mx-auto">
//               <LucideIcons.LineChart className="h-8 w-8 text-[#90a955] mx-auto mb-2.5 animate-pulse" />
//               <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">Historical Soil Trends</h4>
//               <p className="text-[10px] text-gray-500 leading-normal mt-1 max-w-xs mx-auto">
//                 Not enough seasonal logs to trace soil trends yet. Please save at least **two entries** including soil pH and Nitrogen levels to load dynamic timeline graphs.
//               </p>
//             </div>
//           )}

//         </div>

//       </div>

//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  saveSeasonEntry,
  getAllEntries,
  deleteEntry,
  getYearOverYear,
  benchmarkYield,
  getSoilTrend,
} from "../../../services/journalService";

export default function FarmJournal() {
  // Core Journal State
  const [entries, setEntries] = useState([]);
  const [selectedCropFilter, setSelectedCropFilter] = useState("Rice");
  const [successMessage, setSuccessMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    season: "Kharif",
    year: "2026",
    crop: "Rice",
    acreage: "",
    totalCost: "",
    actualYield: "",
    actualRevenue: "",
    soilPH: "",
    nitrogen: "",
    notes: "",
  });

  // Load entries on mount
  useEffect(() => {
    loadJournal();
  }, []);

  const loadJournal = () => {
    const data = getAllEntries();
    setEntries(data || []);
  };

  // Input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Form Submit Action with strict validation guards
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Acreage Validation (Must be greater than 0)
    const parsedAcreage = parseFloat(formData.acreage);
    if (isNaN(parsedAcreage) || parsedAcreage <= 0) {
      alert(
        "Acreage must be a positive number greater than 0. (क्षेत्रफल 0 से अधिक होना चाहिए।)",
      );
      return;
    }

    // 2. Production Cost Validation (Must be greater than 0)
    const parsedCost = parseFloat(formData.totalCost);
    if (isNaN(parsedCost) || parsedCost <= 0) {
      alert(
        "Total Cost must be a valid production expense greater than 0. (उत्पादन लागत 0 से अधिक होनी चाहिए।)",
      );
      return;
    }

    // 3. Actual Yield Validation (Must be greater than 0)
    const parsedYield = parseFloat(formData.actualYield);
    if (isNaN(parsedYield) || parsedYield <= 0) {
      alert(
        "Actual Yield must be a logged output greater than 0 Qtl. (कुल उपज 0 से अधिक होनी चाहिए।)",
      );
      return;
    }

    // 4. Gross Revenue Validation (Must be greater than 0)
    const parsedRevenue = parseFloat(formData.actualRevenue);
    if (isNaN(parsedRevenue) || parsedRevenue <= 0) {
      alert(
        "Gross Revenue must be an incoming value greater than 0. (सकल आय 0 से अधिक होनी चाहिए।)",
      );
      return;
    }

    // 5. Soil pH Range Validation (Optional field safety check)
    if (formData.soilPH !== "") {
      const parsedPH = parseFloat(formData.soilPH);
      if (isNaN(parsedPH) || parsedPH < 3.0 || parsedPH > 10.0) {
        alert(
          "Soil pH must look realistic and stay between 3.0 and 10.0. (पीएच मान 3.0 और 10.0 के बीच होना चाहिए।)",
        );
        return;
      }
    }

    // 6. Soil Nitrogen Validation (Optional field safety check)
    if (formData.nitrogen !== "") {
      const parsedNitrogen = parseFloat(formData.nitrogen);
      if (isNaN(parsedNitrogen) || parsedNitrogen < 0) {
        alert(
          "Nitrogen saturation metric cannot be negative. (नाइट्रोजन स्तर नकारात्मक नहीं हो सकता।)",
        );
        return;
      }
    }

    const saved = saveSeasonEntry({
      season: formData.season,
      year: formData.year,
      crop: formData.crop,
      acreage: String(parsedAcreage),
      totalCost: String(parsedCost),
      actualYield: String(parsedYield),
      actualRevenue: String(parsedRevenue),
      soilPH: formData.soilPH ? String(formData.soilPH) : "",
      nitrogen: formData.nitrogen ? String(formData.nitrogen) : "",
      notes: formData.notes,
    });

    if (saved) {
      setSuccessMessage(
        "Entry logged successfully! फसल का विवरण सहेज लिया गया है।",
      );
      loadJournal();

      // Reset form fields with defaults intact
      setFormData({
        season: "Kharif",
        year: "2026",
        crop: "Rice",
        acreage: "",
        totalCost: "",
        actualYield: "",
        actualRevenue: "",
        soilPH: "",
        nitrogen: "",
        notes: "",
      });

      // Clear toast message after 3.5s
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  };

  // Delete Action
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this historical record?")) {
      const ok = deleteEntry(id);
      if (ok) {
        loadJournal();
      }
    }
  };

  // Resolve Year over Year data for selected crop comparison
  const yoyData = getYearOverYear(selectedCropFilter) || [];
  const maxYoYYield =
    yoyData.length > 0 ? Math.max(...yoyData.map((d) => d.yieldVal), 10) : 10;
  const maxYoYProfit =
    yoyData.length > 0
      ? Math.max(...yoyData.map((d) => d.profitVal), 1000)
      : 1000;

  // Resolve soil trends for visual charts
  const soilTrendData = getSoilTrend(entries) || [];

  // Compute overall average yield for benchmarking based on logged entries
  const getCropAverageYield = (cropName) => {
    const cropEntries = entries.filter(
      (e) => e.crop.toLowerCase() === cropName.toLowerCase(),
    );
    if (cropEntries.length === 0) return 0;
    const totalYield = cropEntries.reduce(
      (sum, e) => sum + parseFloat(e.actualYield || 0),
      0,
    );
    const totalAcreage = cropEntries.reduce(
      (sum, e) => sum + parseFloat(e.acreage || 0),
      0,
    );
    return totalAcreage > 0
      ? parseFloat((totalYield / totalAcreage).toFixed(1))
      : 0;
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left font-['Plus_Jakarta_Sans',_sans-serif] text-gray-800">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
            <span>Historical Farm Journal</span>
            <span className="text-[#31572c] font-black text-sm md:text-base border-l-2 border-gray-300 pl-3 ml-3 bg-transparent">
              फसल डायरी (इतिहास)
            </span>
          </h1>
          <p className="text-gray-900 text-[11px] md:text-xs tracking-normal mt-1 font-semibold">
            Log seasonal production outcomes, evaluate year-over-year cost
            efficiency, and benchmark performance metrics securely.
          </p>
        </div>
      </div>

      {/* Success notification banner */}
      {successMessage && (
        <div className="bg-[#4f772d]/10 border border-[#90a955]/40 text-[#132a13] font-semibold text-xs py-3 px-4 rounded-xl flex items-center space-x-2.5 shadow-sm animate-pulse">
          <LucideIcons.CheckCircle2 className="h-4.5 w-4.5 text-[#31572c] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 1: Add Entry Form */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="text-[#31572c] font-black text-xs tracking-wide uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <LucideIcons.FilePlus className="h-4.5 w-4.5" />
            <span>Log Current Season Outcome</span>
            <span className="text-gray-500 font-bold text-xs lowercase tracking-normal font-sans">
              (नया सीजन विवरण जोड़ें)
            </span>
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {/* Season selection drop */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Season / मौसम
              </label>
              <div className="relative">
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-black text-gray-950 appearance-none focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  <option value="Kharif">Kharif (खरीफ)</option>
                  <option value="Rabi">Rabi (रबी)</option>
                  <option value="Zaid">Zaid (जायद)</option>
                </select>
                <LucideIcons.ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Year Input option */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Year / वर्ष
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="2010"
                max="2035"
                required
                className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
              />
            </div>

            {/* Crop Type drop selector */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Crop Class / फसल
              </label>
              <div className="relative">
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleInputChange}
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-black text-gray-950 appearance-none focus:outline-none focus:border-[#31572c] cursor-pointer"
                >
                  <option value="Rice">Rice (धान)</option>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Maize">Maize (मक्का)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Watermelon">Watermelon (तरबूज)</option>
                </select>
                <LucideIcons.ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            {/* Acreage size metric */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Acreage / कुल क्षेत्रफल
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="acreage"
                  value={formData.acreage}
                  onChange={handleInputChange}
                  placeholder="e.g. 5"
                  step="0.1"
                  min="0.1"
                  required
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 pr-12 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
                />
                <span className="absolute right-3 top-2 text-[10px] font-black text-gray-500">
                  Acres
                </span>
              </div>
            </div>

            {/* Production input total expenses */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Total Cost / उत्पादन लागत
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="totalCost"
                  value={formData.totalCost}
                  onChange={handleInputChange}
                  placeholder="e.g. 20000"
                  min="1"
                  required
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 pl-7 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
                />
                <span className="absolute left-3 top-2.5 text-xs font-black text-gray-500">
                  ₹
                </span>
              </div>
            </div>

            {/* Actual total output yield */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Actual Yield / कुल उपज
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="actualYield"
                  value={formData.actualYield}
                  onChange={handleInputChange}
                  placeholder="e.g. 110"
                  min="0.1"
                  required
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 pr-12 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
                />
                <span className="absolute right-3 top-2 text-[10px] font-black text-gray-500">
                  Qtl
                </span>
              </div>
            </div>

            {/* Total incoming revenue return parameters */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Gross Revenue / सकल आय
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="actualRevenue"
                  value={formData.actualRevenue}
                  onChange={handleInputChange}
                  placeholder="e.g. 60000"
                  min="1"
                  required
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 pl-7 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
                />
                <span className="absolute left-3 top-2.5 text-xs font-black text-gray-500">
                  ₹
                </span>
              </div>
            </div>

            {/* Soil pH value metrics */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Soil pH (Opt) / पीएच मान
              </label>
              <input
                type="number"
                name="soilPH"
                value={formData.soilPH}
                onChange={handleInputChange}
                placeholder="e.g. 6.7"
                step="0.1"
                min="3.0"
                max="10.0"
                className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
              />
            </div>

            {/* Soil Nitrogen Level values */}
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Nitrogen Level / नाइट्रोजन
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  placeholder="e.g. 280"
                  min="0"
                  className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 pr-12 text-xs font-black text-gray-950 focus:outline-none focus:border-[#31572c]"
                />
                <span className="absolute right-3 top-2 text-[9px] font-black text-gray-500">
                  kg/ha
                </span>
              </div>
            </div>

            {/* Rich remarks text description notes field */}
            <div className="flex flex-col space-y-1 sm:col-span-2 md:col-span-3">
              <label className="text-[10px] font-black text-gray-700 uppercase tracking-wider">
                Field Notes / टिप्पणी
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Log pest occurrences, heavy rain timings, or fertilizer types used..."
                className="w-full bg-[#f4f7f4] border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 h-16 focus:outline-none focus:border-[#31572c]"
              />
            </div>

            {/* Submission triggers action link buttons block */}
            <div className="sm:col-span-2 md:col-span-3 pt-2 text-right">
              <button
                type="submit"
                className="bg-[#31572c] hover:bg-[#132a13] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all duration-300 active:scale-[0.97] inline-flex items-center space-x-2 cursor-pointer"
              >
                <LucideIcons.Save className="h-4 w-4" />
                <span>Save Seasonal Entry</span>
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic Regional Benchmarking Stats */}
        <div className="bg-[#132a13] text-white border border-[#31572c]/40 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-[#ecf39e] font-black text-xs tracking-wide uppercase flex items-center gap-1.5 border-b border-[#31572c]/30 pb-3">
            <LucideIcons.Award className="h-4.5 w-4.5" />
            <span>Yield Benchmarking</span>
          </h2>

          <div className="space-y-4 text-xs">
            {["Rice", "Wheat"].map((cropKey) => {
              const myAvg = getCropAverageYield(cropKey);
              const bench = benchmarkYield(cropKey, "Faridabad", myAvg);

              return (
                <div
                  key={cropKey}
                  className="bg-[#4f772d]/20 border border-[#90a955]/20 rounded-xl p-3.5 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-[#ecf39e]">
                      {cropKey} Suitability
                    </span>
                    {myAvg > 0 && (
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          bench.gapPercent >= 0
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {bench.gapPercent >= 0
                          ? `+${bench.gapPercent}%`
                          : `${bench.gapPercent}%`}{" "}
                        vs District
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-gray-300 border-b border-[#31572c]/30 pb-2">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-gray-400">
                        My Avg
                      </p>
                      <p className="text-sm font-black text-white mt-0.5">
                        {myAvg > 0 ? `${myAvg} qtl` : "No logs"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-gray-400">
                        Dist Avg
                      </p>
                      <p className="text-sm font-black text-[#ecf39e] mt-0.5">
                        {bench.districtAvg} qtl
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-gray-400">
                        Nat Avg
                      </p>
                      <p className="text-sm font-black text-gray-300 mt-0.5">
                        {bench.nationalAvg} qtl
                      </p>
                    </div>
                  </div>

                  {myAvg > 0 ? (
                    <p className="text-[10px] text-gray-350 leading-relaxed italic">
                      {bench.suggestion}
                    </p>
                  ) : (
                    <p className="text-[9px] text-gray-400 leading-normal italic">
                      * Log at least one seasonal outcome to load localized gap
                      analysis advisory reports.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 3: Year over Year Crop Outcomes Comparison Chart */}
      <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <h2 className="text-[#31572c] font-black text-xs tracking-wide uppercase flex items-center gap-1.5">
            <LucideIcons.TrendingUp className="h-4.5 w-4.5" />
            <span>Year over Year Performance comparison</span>
            <span className="text-gray-500 font-bold text-xs lowercase tracking-normal font-sans">
              (वार्षिक तुलनात्मक विश्लेषण)
            </span>
          </h2>

          {/* Crop Selector Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Select Crop:
            </span>
            <div className="relative">
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="bg-[#f4f7f4] border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-black text-[#132a13] appearance-none pr-8 cursor-pointer focus:outline-none"
              >
                <option value="Rice">Rice (धान)</option>
                <option value="Wheat">Wheat (गेहूं)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Maize">Maize (मक्का)</option>
                <option value="Mustard">Mustard (सरसों)</option>
                <option value="Watermelon">Watermelon (तरबूज)</option>
              </select>
              <LucideIcons.ChevronDown className="absolute right-2 top-2 h-3.5 w-3.5 text-[#132a13] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* YoY CSS charts */}
        {yoyData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Chart: Yield trends */}
            <div className="space-y-4 bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <LucideIcons.Activity className="h-4 w-4 text-[#4f772d]" />
                Yield Productivity Trends (qtl/acre)
              </h3>

              <div className="space-y-3.5">
                {yoyData.map((d) => (
                  <div key={d.id} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-gray-600">
                      <span>
                        {d.season} {d.year}
                      </span>
                      <span className="text-gray-900">
                        {d.yieldVal} qtl / acre
                      </span>
                    </div>
                    {/* Bar container */}
                    <div className="h-6 w-full bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#90a955] to-[#31572c] rounded-md transition-all duration-700"
                        style={{
                          width: `${(d.yieldVal / maxYoYYield) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart: Profit trends */}
            <div className="space-y-4 bg-[#f4f7f4]/40 border border-gray-100 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <LucideIcons.Coins className="h-4 w-4 text-[#4f772d]" />
                Net Profit Per Acre Trends (₹/acre)
              </h3>

              <div className="space-y-3.5">
                {yoyData.map((d) => (
                  <div key={d.id} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-gray-600">
                      <span>
                        {d.season} {d.year}
                      </span>
                      <span className="text-emerald-700 font-bold">
                        ₹{d.profitVal.toLocaleString("en-IN")} / acre
                      </span>
                    </div>
                    {/* Bar container */}
                    <div className="h-6 w-full bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#ecf39e] to-[#15803d] rounded-md transition-all duration-700"
                        style={{
                          width: `${(d.profitVal / maxYoYProfit) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#f4f7f4]/40 border border-[#90a955]/20 rounded-2xl py-8 px-6 text-center max-w-lg mx-auto">
            <LucideIcons.LineChart className="h-8 w-8 text-[#90a955] mx-auto mb-2.5 animate-pulse" />
            <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
              Insufficient Data
            </h4>
            <p className="text-[10px] text-gray-500 leading-normal mt-1 max-w-sm mx-auto">
              No entries logged for crop classification **{selectedCropFilter}**
              yet. Please use the log form at the top to record at least two
              seasons to load comparison statistics.
            </p>
          </div>
        )}
      </div>

      {/* Grid: Table (Section 2) & Soil curve line (Section 4 bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 2: Table */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="text-[#31572c] font-black text-xs tracking-wide uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <LucideIcons.BookOpen className="h-4.5 w-4.5" />
            <span>Cropping History Journal Ledger</span>
            <span className="text-gray-500 font-bold text-xs lowercase tracking-normal font-sans">
              (ऐतिहासिक बहीखाता)
            </span>
          </h2>

          <div className="overflow-x-auto scroll-thin">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-700 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Season & Year</th>
                  <th className="py-2.5 px-3">Crop</th>
                  <th className="py-2.5 px-3">Acreage</th>
                  <th className="py-2.5 px-3">Total Yield</th>
                  <th className="py-2.5 px-3">Financials (Cost / Rev)</th>
                  <th className="py-2.5 px-3">Net Profit</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium">
                {entries.length > 0 ? (
                  entries.map((e) => {
                    const profit =
                      parseFloat(e.actualRevenue) - parseFloat(e.totalCost);
                    const roi =
                      parseFloat(e.totalCost) > 0
                        ? Math.round((profit / parseFloat(e.totalCost)) * 100)
                        : 0;

                    return (
                      <tr
                        key={e.id}
                        className="hover:bg-[#f4f7f4]/30 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-800">
                            {e.season}
                          </span>
                          <p className="text-[10px] text-gray-400">{e.year}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900">
                            {e.crop}
                          </span>
                          <span className="text-[9px] font-bold bg-[#31572c]/10 text-[#31572c] rounded-md px-1.5 py-0.5 ml-1.5 uppercase tracking-wide">
                            {e.season === "Kharif"
                              ? "खरीफ"
                              : e.season === "Rabi"
                                ? "रबी"
                                : "जायद"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-800 font-bold">
                          {e.acreage} Acres
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-800">
                            {e.actualYield} Qtl
                          </span>
                          <p className="text-[10px] text-gray-400">
                            (
                            {parseFloat(
                              (
                                parseFloat(e.actualYield) /
                                parseFloat(e.acreage)
                              ).toFixed(1),
                            )}{" "}
                            qtl/ac)
                          </p>
                        </td>
                        <td className="py-3 px-3 text-gray-650">
                          <p className="text-gray-500">
                            Cost: ₹
                            {parseFloat(e.totalCost).toLocaleString("en-IN")}
                          </p>
                          <p className="font-bold text-gray-900">
                            Rev: ₹
                            {parseFloat(e.actualRevenue).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-black text-sm ${profit >= 0 ? "text-[#15803d]" : "text-red-600"}`}
                          >
                            {profit >= 0
                              ? `+₹${profit.toLocaleString("en-IN")}`
                              : `-₹${Math.abs(profit).toLocaleString("en-IN")}`}
                          </span>
                          <p className="mt-0.5">
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                roi >= 0
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {roi}% ROI
                            </span>
                          </p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 transition-all cursor-pointer active:scale-95"
                            title="Delete Record"
                          >
                            <LucideIcons.Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-8 text-center text-gray-500 font-sans italic"
                    >
                      No entries logged yet. Add your first season details using
                      the form above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4 bottom: Soil Chemistry Curves Line SVG Chart */}
        <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-[#31572c] font-black text-xs tracking-wide uppercase flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <LucideIcons.LineChart className="h-4.5 w-4.5" />
            <span>Soil chemistry curve logs</span>
          </h2>

          {soilTrendData.length >= 2 ? (
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1 text-[#31572c]">
                  <span className="h-2 w-2 rounded-full bg-[#31572c]" /> pH
                  level
                </span>
                <span className="flex items-center gap-1 text-[#15803d]">
                  <span className="h-2 w-2 rounded-full bg-[#15803d]" />{" "}
                  Nitrogen (kg/ha)
                </span>
              </div>

              {/* Responsive SVG Line Plot */}
              <div className="relative pt-2">
                <svg viewBox="0 0 300 150" className="w-full overflow-visible">
                  {/* Grid Lines */}
                  <line
                    x1="20"
                    y1="20"
                    x2="280"
                    y2="20"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1="20"
                    y1="75"
                    x2="280"
                    y2="75"
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <line
                    x1="20"
                    y1="130"
                    x2="280"
                    y2="130"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />

                  {/* Coordinates calculations */}
                  {(() => {
                    const pointsCount = soilTrendData.length;
                    const spacing = 260 / (pointsCount - 1);

                    const minPH = 5.0,
                      maxPH = 8.5;
                    const minN = 150,
                      maxN = 350;

                    const getPHCoordinate = (val, idx) => {
                      const x = 20 + idx * spacing;
                      const y = 130 - ((val - minPH) / (maxPH - minPH)) * 100;
                      return { x, y };
                    };

                    const getNCoordinate = (val, idx) => {
                      const x = 20 + idx * spacing;
                      const y = 130 - ((val - minN) / (maxN - minN)) * 100;
                      return { x, y };
                    };

                    const phCoords = soilTrendData.map((d, i) =>
                      getPHCoordinate(d.pH, i),
                    );
                    const nCoords = soilTrendData.map((d, i) =>
                      getNCoordinate(d.nitrogen, i),
                    );

                    // Build path strings
                    const phPath = phCoords.reduce(
                      (acc, c, idx) =>
                        acc +
                        (idx === 0 ? `M ${c.x} ${c.y}` : ` L ${c.x} ${c.y}`),
                      "",
                    );
                    const nPath = nCoords.reduce(
                      (acc, c, idx) =>
                        acc +
                        (idx === 0 ? `M ${c.x} ${c.y}` : ` L ${c.x} ${c.y}`),
                      "",
                    );

                    return (
                      <>
                        {/* pH Line */}
                        <path
                          d={phPath}
                          fill="none"
                          stroke="#31572c"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {phCoords.map((c, i) => (
                          <g key={`ph-${i}`}>
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r="4"
                              fill="#132a13"
                              stroke="#fff"
                              strokeWidth="1.5"
                            />
                            <text
                              x={c.x}
                              y={c.y - 8}
                              fontSize="7"
                              fontWeight="bold"
                              textAnchor="middle"
                              fill="#31572c"
                            >
                              {soilTrendData[i].pH} pH
                            </text>
                            {/* X-axis labels */}
                            <text
                              x={c.x}
                              y="142"
                              fontSize="7"
                              fontWeight="bold"
                              textAnchor="middle"
                              fill="#94a3b8"
                            >
                              {soilTrendData[i].label}
                            </text>
                          </g>
                        ))}

                        {/* Nitrogen Line */}
                        <path
                          d={nPath}
                          fill="none"
                          stroke="#15803d"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {nCoords.map((c, i) => (
                          <g key={`n-${i}`}>
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r="4"
                              fill="#15803d"
                              stroke="#fff"
                              strokeWidth="1.5"
                            />
                            <text
                              x={c.x}
                              y={c.y - 8}
                              fontSize="7"
                              fontWeight="bold"
                              textAnchor="middle"
                              fill="#15803d"
                            >
                              {soilTrendData[i].nitrogen}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <p className="text-[9px] font-medium text-gray-400 italic leading-snug mt-3">
                * Trend line monitors active chemical enrichment ratios over
                consecutive growing periods. Ensure consistent seasonal updates.
              </p>
            </div>
          ) : (
            <div className="bg-[#f4f7f4]/40 border border-[#90a955]/20 rounded-2xl py-8 px-6 text-center max-w-sm mx-auto">
              <LucideIcons.LineChart className="h-8 w-8 text-[#90a955] mx-auto mb-2.5 animate-pulse" />
              <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide">
                Historical Soil Trends
              </h4>
              <p className="text-[10px] text-gray-500 leading-normal mt-1 max-w-xs mx-auto">
                Not enough seasonal logs to trace soil trends yet. Please save
                at least **two entries** including soil pH and Nitrogen levels
                to load dynamic timeline graphs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
