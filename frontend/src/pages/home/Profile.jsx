// import React, { useState, useEffect } from "react";
// import {
//   User,
//   MapPin,
//   Layers,
//   Plus,
//   Trash2,
//   CheckCircle2,
//   Sprout,
//   Edit3,
//   X,
//   Save,
//   Check,
//   RefreshCw,
//   CalendarDays,
// } from "lucide-react";
// import { profileApi } from "../../services/apiService";
// import {
//   INDIAN_STATES,
//   getLocationByGPS,
// } from "../../services/locationService";

// export default function Profile() {
//   // --- STATE LAYER ---
//   const [loading, setLoading] = useState(true);
//   const [syncing, setSyncing] = useState(false);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Core farmer profile
//   const [farmerProfile, setFarmerProfile] = useState({
//     name: "Suresh Kumar",
//     location: "Faridabad, Haryana",
//     pincode: "121001",
//     primaryCrops: ["Rice", "Wheat"],
//   });

//   // Multiple plots/farms array
//   const [farms, setFarms] = useState([]);

//   // Profile Edit state
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [editName, setEditName] = useState("");
//   const [editLocation, setEditLocation] = useState("");
//   const [editPincode, setEditPincode] = useState("");
//   const [editPrimaryCrops, setEditPrimaryCrops] = useState("");

//   // --- REGISTER FARM FORM STATE ---
//   const [newFarmName, setNewFarmName] = useState("");
//   const [newFarmLocation, setNewFarmLocation] = useState("");
//   const [newFarmLand, setNewFarmLand] = useState("");
//   const [newFarmState, setNewFarmState] = useState("");
//   const [newFarmDistrict, setNewFarmDistrict] = useState("");

//   // Interactive crops register array for registering new farms
//   const [tempCropsList, setTempCropsList] = useState([]);
//   const [tempCropName, setTempCropName] = useState("");
//   const [tempCropSowingDate, setTempCropSowingDate] = useState("");
//   const [tempCropSownArea, setTempCropSownArea] = useState("");

//   // --- INDIVIDUAL FARM INLINE EDIT STATE ---
//   const [editingFarmId, setEditingFarmId] = useState(null);
//   const [editFarmName, setEditFarmName] = useState("");
//   const [editFarmLocation, setEditFarmLocation] = useState("");
//   const [editFarmLand, setEditFarmLand] = useState("");
//   const [editFarmState, setEditFarmState] = useState("");
//   const [editFarmDistrict, setEditFarmDistrict] = useState("");

//   // Interactive crops list for inline farm edits
//   const [editCropsList, setEditCropsList] = useState([]);
//   const [editCropName, setEditCropName] = useState("");
//   const [editCropSowingDate, setEditCropSowingDate] = useState("");
//   const [editCropSownArea, setEditCropSownArea] = useState("");

//   // --- GEOLOCATION DETECTION STATE ---
//   const [isDetectingLocation, setIsDetectingLocation] = useState(false);

//   // --- API CONSUMPTION (GET PROFILE) ---
//   const loadProfile = async (showMutedSpinner = false) => {
//     try {
//       if (showMutedSpinner) setSyncing(true);
//       else setLoading(true);

//       const res = await profileApi.getProfile();
//       if (res.success && res.data) {
//         setFarmerProfile(res.data);
//         setFarms(res.data.farms || []);
//         setError(null);
//       } else {
//         throw new Error(res.error || "Invalid API response format.");
//       }
//     } catch (err) {
//       console.error("[Profile] API Sync Failed:", err.message);
//       setError("Mongoose Database Server offline. Using baseline details.");
//     } finally {
//       setLoading(false);
//       setSyncing(false);
//     }
//   };

//   useEffect(() => {
//     loadProfile();
//   }, []);

//   // --- CORE PROFILE EDIT HANDLERS (PUT PROFILE) ---
//   const startEditingProfile = () => {
//     setEditName(farmerProfile.name);
//     setEditLocation(farmerProfile.location);
//     setEditPincode(farmerProfile.pincode);
//     setEditPrimaryCrops(farmerProfile.primaryCrops.join(", "));
//     setIsEditingProfile(true);
//   };

//   const handleSaveProfile = async (e) => {
//     e.preventDefault();
//     if (!editName.trim()) return;

//     try {
//       setSyncing(true);
//       const cropsArray = editPrimaryCrops
//         ? editPrimaryCrops
//             .split(",")
//             .map((c) => c.trim())
//             .filter(Boolean)
//         : [];

//       const res = await profileApi.updateProfile({
//         name: editName,
//         location: editLocation,
//         pincode: editPincode,
//         primaryCrops: cropsArray,
//       });

//       if (res.success && res.data) {
//         setFarmerProfile(res.data);
//         setIsEditingProfile(false);
//         setError(null);
//       }
//     } catch (err) {
//       alert("Error updating profile credentials: " + err.message);
//     } finally {
//       setSyncing(false);
//     }
//   };

//   // --- INTERACTIVE DYNAMIC GEOLOCATION DETECTOR ---
//   const handleDetectGPSLocation = async (isEdit = false) => {
//     try {
//       setIsDetectingLocation(true);
//       const resolved = await getLocationByGPS();
//       const locationText = `${resolved.district}, ${resolved.state}`;
//       if (isEdit) {
//         setEditFarmLocation(locationText);
//         setEditFarmState(resolved.state);
//         setEditFarmDistrict(resolved.district);
//       } else {
//         setNewFarmLocation(locationText);
//         setNewFarmState(resolved.state);
//         setNewFarmDistrict(resolved.district);
//       }
//     } catch (err) {
//       alert("GPS Detection failed: " + err.message);
//     } finally {
//       setIsDetectingLocation(false);
//     }
//   };

//   // --- INTERACTIVE TEMP CROPS HANDLERS (NEW FARM REGISTER FORM) ---
//   const handleAddTempCrop = (e) => {
//     e.preventDefault();
//     if (!tempCropName.trim()) return;

//     const numericSown = Number(tempCropSownArea);
//     if (isNaN(numericSown) || numericSown <= 0) {
//       alert(
//         "Crop sown area must be a positive number. Alphabetic characters or negative values are not allowed.",
//       );
//       return;
//     }

//     const totalLandVal = Number(newFarmLand || 0);
//     if (isNaN(totalLandVal) || totalLandVal <= 0) {
//       alert(
//         "Please specify a valid positive total land area for the farm first before allocating crops.",
//       );
//       return;
//     }

//     const sumExisting = tempCropsList.reduce(
//       (sum, c) => sum + Number(c.sownArea || 0),
//       0,
//     );
//     const remaining = totalLandVal - sumExisting;

//     if (numericSown > remaining) {
//       alert(
//         `Over-allocation error: Sown area for ${tempCropName} (${numericSown} Acres) exceeds the remaining available land area (${remaining.toFixed(2)} Acres).`,
//       );
//       return;
//     }

//     const newCrop = {
//       name: tempCropName.trim(),
//       sowingDate: tempCropSowingDate || "",
//       sownArea: numericSown,
//     };

//     setTempCropsList([...tempCropsList, newCrop]);
//     setTempCropName("");
//     setTempCropSowingDate("");
//     setTempCropSownArea("");
//   };

//   const handleRemoveTempCrop = (index) => {
//     setTempCropsList(tempCropsList.filter((_, idx) => idx !== index));
//   };

//   // --- LAND ASSET REGISTRATION (POST FARM) ---
//   const handleAddFarm = async (e) => {
//     e.preventDefault();
//     if (!newFarmName.trim() || !newFarmLand) return;

//     const numericLand = Number(newFarmLand);
//     if (isNaN(numericLand) || numericLand <= 0) {
//       alert(
//         "Total land area must be a positive number. Alphabetic characters or negative values are not allowed.",
//       );
//       return;
//     }

//     const totalSown = tempCropsList.reduce(
//       (sum, c) => sum + Number(c.sownArea || 0),
//       0,
//     );
//     if (totalSown > numericLand) {
//       alert(
//         `Over-allocation error: Total crop sown area (${totalSown} Acres) exceeds the farm's total land area (${numericLand} Acres).`,
//       );
//       return;
//     }

//     try {
//       setSyncing(true);
//       const cropsArray =
//         tempCropsList.length > 0
//           ? tempCropsList
//           : [{ name: "Fallow", sowingDate: "", sownArea: 0 }];

//       const res = await profileApi.addFarm({
//         name: newFarmName.trim(),
//         location: newFarmLocation || "Haryana Region",
//         totalLand: numericLand,
//         crops: cropsArray,
//       });

//       if (res.success) {
//         if (res.farms) setFarms(res.farms);
//         else await loadProfile(true);

//         // Reset farm form fields & Close Modal
//         setNewFarmName("");
//         setNewFarmLocation("");
//         setNewFarmLand("");
//         setNewFarmState("");
//         setNewFarmDistrict("");
//         setTempCropsList([]);
//         setTempCropName("");
//         setTempCropSowingDate("");
//         setTempCropSownArea("");
//         setIsModalOpen(false);
//       }
//     } catch (err) {
//       alert("Failed to register new land asset: " + err.message);
//     } finally {
//       setSyncing(false);
//     }
//   };

//   // --- INTERACTIVE EDIT CROPS HANDLERS (FARM EDIT MODE) ---
//   const handleAddEditCrop = (e) => {
//     e.preventDefault();
//     if (!editCropName.trim()) return;

//     const numericSown = Number(editCropSownArea);
//     if (isNaN(numericSown) || numericSown <= 0) {
//       alert(
//         "Crop sown area must be a positive number. Alphabetic characters or negative values are not allowed.",
//       );
//       return;
//     }

//     const totalLandVal = Number(editFarmLand || 0);
//     if (isNaN(totalLandVal) || totalLandVal <= 0) {
//       alert(
//         "Please specify a valid positive total land area for the farm first.",
//       );
//       return;
//     }

//     const sumExisting = editCropsList.reduce(
//       (sum, c) => sum + Number(c.sownArea || 0),
//       0,
//     );
//     const remaining = totalLandVal - sumExisting;

//     if (numericSown > remaining) {
//       alert(
//         `Over-allocation error: Sown area for ${editCropName} (${numericSown} Acres) exceeds the remaining available land area (${remaining.toFixed(2)} Acres).`,
//       );
//       return;
//     }

//     const newCrop = {
//       name: editCropName.trim(),
//       sowingDate: editCropSowingDate || "",
//       sownArea: numericSown,
//     };

//     setEditCropsList([...editCropsList, newCrop]);
//     setEditCropName("");
//     setEditCropSowingDate("");
//     setEditCropSownArea("");
//   };

//   const handleRemoveEditCrop = (index) => {
//     setEditCropsList(editCropsList.filter((_, idx) => idx !== index));
//   };

//   // --- LAND ASSET INLINE UPDATE (PUT FARM) ---
//   const startEditingFarm = (farm) => {
//     setEditingFarmId(farm._id || farm.id);
//     setEditFarmName(farm.name);
//     setEditFarmLocation(farm.location);
//     setEditFarmLand(farm.totalLand);
//     setEditCropsList(
//       farm.crops
//         ? farm.crops.map((c) => ({
//             name: c.name,
//             sowingDate: c.sowingDate,
//             sownArea: Number(c.sownArea || 0),
//           }))
//         : [],
//     );
//     setEditCropName("");
//     setEditCropSowingDate("");
//     setEditCropSownArea("");

//     if (farm.location && farm.location.includes(", ")) {
//       const parts = farm.location.split(", ");
//       if (parts.length >= 2) {
//         setEditFarmState(parts[parts.length - 1].trim());
//         setEditFarmDistrict(parts[parts.length - 2].trim());
//       }
//     } else {
//       setEditFarmState("");
//       setEditFarmDistrict("");
//     }
//   };

//   const handleSaveFarmEdit = async (e) => {
//     e.preventDefault();
//     if (!editFarmName.trim() || !editFarmLand) return;

//     const numericLand = Number(editFarmLand);
//     if (isNaN(numericLand) || numericLand <= 0) {
//       alert(
//         "Total land area must be a positive number. Alphabetic characters or negative values are not allowed.",
//       );
//       return;
//     }

//     const totalSown = editCropsList.reduce(
//       (sum, c) => sum + Number(c.sownArea || 0),
//       0,
//     );
//     if (totalSown > numericLand) {
//       alert(
//         `Over-allocation error: Total crop sown area (${totalSown} Acres) exceeds the farm's total land area (${numericLand} Acres).`,
//       );
//       return;
//     }

//     try {
//       setSyncing(true);
//       const cropsArray =
//         editCropsList.length > 0
//           ? editCropsList
//           : [{ name: "Fallow", sowingDate: "", sownArea: 0 }];

//       const res = await profileApi.updateFarm(editingFarmId, {
//         name: editFarmName.trim(),
//         location: editFarmLocation,
//         totalLand: numericLand,
//         crops: cropsArray,
//       });

//       if (res.success) {
//         if (res.farms) setFarms(res.farms);
//         else await loadProfile(true);

//         setEditingFarmId(null);
//         setEditFarmState("");
//         setEditFarmDistrict("");
//       }
//     } catch (err) {
//       alert("Failed to update farm details: " + err.message);
//     } finally {
//       setSyncing(false);
//     }
//   };

//   // --- LAND ASSET DELETION (DELETE FARM) ---
//   const handleDeleteFarm = async (farmId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to de-register this land asset from the cloud ledger?",
//       )
//     )
//       return;

//     try {
//       setSyncing(true);
//       const res = await profileApi.deleteFarm(farmId);
//       if (res.success) {
//         if (res.farms) setFarms(res.farms);
//         else await loadProfile(true);
//       }
//     } catch (err) {
//       alert("Failed to delete land asset: " + err.message);
//     } finally {
//       setSyncing(false);
//     }
//   };

//   const blockInvalidChar = (e) =>
//     ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

//   const aggregateAcreage = farms.reduce(
//     (sum, f) => sum + parseFloat(f.totalLand || 0),
//     0,
//   );

//   if (loading) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
//         <div className="h-10 w-10 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
//         <p className="text-sm font-bold text-[#132a13] animate-pulse">
//           Syncing Farmer Registry Ledger...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f4f7f4] font-['Plus_Jakarta_Sans',_Inter,_sans-serif] p-4 md:p-8 text-gray-700">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* --- PAGE HEADER --- */}
//         <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
//           <div className="text-left">
//             <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
//               Farmer Ledger & Registry{" "}
//               <span className="text-gray-300 font-normal">|</span>{" "}
//               <span className="text-[#31572c] font-medium font-hindi text-lg">
//                 कृषक पत्रिका
//               </span>
//             </h1>
//             <p className="text-xs text-gray-700 mt-1">
//               Manage secondary operations plots, multi-farm telemetry
//               structures, and vocal translation pathways.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {syncing && (
//               <span className="text-[10px] font-bold text-[#31572c] bg-brand-dark/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse border border-[#90a955]/30">
//                 <RefreshCw className="w-3.5 h-3.5 animate-spin" />
//                 <span>Syncing Cloud...</span>
//               </span>
//             )}
//           </div>
//         </header>

//         {/* --- ERROR DISPLAY BANNER --- */}
//         {error && (
//           <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs font-bold text-left">
//             ⚠️ {error} Baselines are saved locally. Connect backend to restore
//             MongoDB syncing!
//           </div>
//         )}

//         {/* --- HORIZONTAL CORE IDENTITY SUMMARY PANEL --- */}
//         <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
//           <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-left">
//             <div className="flex items-center gap-2">
//               <User className="w-4 h-4 text-[#31572c]" />
//               <h2 className="text-xs font-bold text-gray-900 tracking-wide uppercase">
//                 Core Identity Summary
//               </h2>
//             </div>
//             {!isEditingProfile && (
//               <button
//                 type="button"
//                 onClick={startEditingProfile}
//                 className="text-xs text-[#31572c] hover:text-[#132a13] font-bold flex items-center gap-1 cursor-pointer"
//               >
//                 <Edit3 className="w-3 h-3" />
//                 <span>Edit Profile</span>
//               </button>
//             )}
//           </div>

//           {isEditingProfile ? (
//             <form
//               onSubmit={handleSaveProfile}
//               className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left items-end"
//             >
//               <div>
//                 <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
//                   Farmer Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={editName}
//                   onChange={(e) => setEditName(e.target.value)}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
//                   HQ Base Location
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={editLocation}
//                   onChange={(e) => setEditLocation(e.target.value)}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
//                   Pincode
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={editPincode}
//                   onChange={(e) => setEditPincode(e.target.value)}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
//                   Primary Staples
//                 </label>
//                 <input
//                   type="text"
//                   value={editPrimaryCrops}
//                   onChange={(e) => setEditPrimaryCrops(e.target.value)}
//                   className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-950 focus:outline-none focus:border-[#31572c]"
//                 />
//               </div>
//               <div className="md:col-span-4 flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsEditingProfile(false)}
//                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
//                 >
//                   <X className="w-3.5 h-3.5" /> Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-brand-dark hover:bg-[#132a13] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
//                 >
//                   <Save className="w-3.5 h-3.5" /> Save Changes
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left items-center bg-[#f4f7f4]/40 p-4 rounded-xl">
//               <div>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
//                   Farmer Name
//                 </span>
//                 <span className="text-sm font-black text-gray-900 block mt-0.5">
//                   {farmerProfile.name}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
//                   Primary Headquarters Base
//                 </span>
//                 <span className="text-xs font-bold text-gray-700 flex items-center gap-1 mt-0.5">
//                   <MapPin className="w-3.5 h-3.5 text-gray-600" />{" "}
//                   {farmerProfile.location} ({farmerProfile.pincode})
//                 </span>
//               </div>
//               <div>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
//                   Registered Global Staples
//                 </span>
//                 <div className="flex flex-wrap gap-1">
//                   {farmerProfile.primaryCrops.map((crop) => (
//                     <span
//                       key={crop}
//                       className="text-[9px] font-black uppercase tracking-widest bg-white text-[#31572c] px-2.5 py-1 rounded border border-gray-200"
//                     >
//                       🌾 {crop}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//               <div className="sm:border-l sm:border-gray-200 sm:pl-6 flex flex-col justify-center">
//                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
//                   Aggregated Holdings
//                 </span>
//                 <span className="text-lg font-black text-gray-900">
//                   {aggregateAcreage.toFixed(1)}{" "}
//                   <small className="text-xs font-bold text-gray-600">
//                     Acres Total
//                   </small>
//                 </span>
//                 <span className="text-[9px] font-black uppercase tracking-widest text-[#15803d] mt-0.5">
//                   {farms.length} Active Plots Registered
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* --- FULL-WIDTH AGRICULTURAL LAND ASSETS FEED --- */}
//         <div className="space-y-4">
//           <div className="flex justify-between items-center border-b border-gray-200/80 pb-2 text-left">
//             <div className="flex items-center gap-1.5">
//               <Layers className="w-4 h-4 text-[#31572c]" />
//               <h3 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
//                 Your Agricultural Land Assets
//               </h3>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {farms.map((farm) => {
//               const farmId = farm._id || farm.id;
//               const isEditingThisFarm = editingFarmId === farmId;

//               return (
//                 <div
//                   key={farmId}
//                   className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group min-h-[220px]"
//                 >
//                   {!isEditingThisFarm && (
//                     <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
//                       <button
//                         type="button"
//                         onClick={() => startEditingFarm(farm)}
//                         className="p-1.5 text-gray-600 hover:text-[#31572c] rounded-lg hover:bg-emerald-50 cursor-pointer"
//                         title="Edit Plot"
//                       >
//                         <Edit3 className="w-3.5 h-3.5" />
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => handleDeleteFarm(farmId)}
//                         className="p-1.5 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
//                         title="Delete Plot"
//                       >
//                         <Trash2 className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   )}

//                   {isEditingThisFarm ? (
//                     <form
//                       onSubmit={handleSaveFarmEdit}
//                       className="space-y-3 text-left w-full"
//                     >
//                       <h4 className="text-xs font-bold text-gray-900 border-b pb-1">
//                         Edit Land Plot
//                       </h4>
//                       <div>
//                         <label className="text-[8px] font-bold text-gray-600 uppercase block">
//                           Plot Name
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           value={editFarmName}
//                           onChange={(e) => setEditFarmName(e.target.value)}
//                           className="w-full border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white text-gray-900 focus:outline-none focus:border-[#31572c]"
//                         />
//                       </div>
//                       <div className="grid grid-cols-2 gap-2">
//                         <div>
//                           <label className="text-[8px] font-bold text-gray-600 uppercase block">
//                             State
//                           </label>
//                           <select
//                             value={editFarmState}
//                             onChange={(e) => {
//                               const state = e.target.value;
//                               setEditFarmState(state);
//                               setEditFarmDistrict("");
//                               if (!state) setEditFarmLocation("");
//                             }}
//                             className="w-full border border-gray-200 rounded px-2 py-0.5 text-[10px] font-bold bg-white text-gray-900 focus:outline-none"
//                           >
//                             <option value="">-- State --</option>
//                             {Object.keys(INDIAN_STATES).map((st) => (
//                               <option key={st} value={st}>
//                                 {st}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="text-[8px] font-bold text-gray-600 uppercase block">
//                             District
//                           </label>
//                           <select
//                             value={editFarmDistrict}
//                             disabled={!editFarmState}
//                             onChange={(e) => {
//                               const dist = e.target.value;
//                               setEditFarmDistrict(dist);
//                               if (dist && editFarmState)
//                                 setEditFarmLocation(
//                                   `${dist}, ${editFarmState}`,
//                                 );
//                             }}
//                             className="w-full border border-gray-200 rounded px-2 py-0.5 text-[10px] font-bold bg-white text-gray-900 focus:outline-none disabled:opacity-50"
//                           >
//                             <option value="">-- District --</option>
//                             {editFarmState &&
//                               INDIAN_STATES[editFarmState].map((d) => (
//                                 <option key={d} value={d}>
//                                   {d}
//                                 </option>
//                               ))}
//                           </select>
//                         </div>
//                       </div>
//                       <div>
//                         <label className="text-[8px] font-bold text-gray-600 uppercase block">
//                           Total Area (Acres)
//                         </label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           required
//                           value={editFarmLand}
//                           onKeyDown={blockInvalidChar}
//                           onChange={(e) => setEditFarmLand(e.target.value)}
//                           className="w-full border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white text-gray-900 focus:outline-none"
//                         />
//                       </div>
//                       <div className="flex gap-2 pt-1">
//                         <button
//                           type="button"
//                           onClick={() => setEditingFarmId(null)}
//                           className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-lg"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           className="flex-1 py-1.5 bg-brand-dark text-white text-[10px] font-bold uppercase rounded-lg"
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </form>
//                   ) : (
//                     <>
//                       <div className="space-y-3 text-left">
//                         <div>
//                           <h4 className="text-sm font-black text-gray-900 leading-tight pr-12">
//                             {farm.name}
//                           </h4>
//                           <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1 mt-0.5">
//                             <MapPin className="w-3 h-3 text-gray-600" />{" "}
//                             {farm.location}
//                           </span>
//                         </div>

//                         <div className="pt-1">
//                           <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
//                             Crops Planted Here
//                           </span>
//                           <div className="flex flex-wrap gap-1.5">
//                             {farm.crops && farm.crops.length > 0 ? (
//                               farm.crops.map((cr, idx) => (
//                                 <span
//                                   key={idx}
//                                   className="text-[9px] font-black uppercase bg-[#ecf39e]/40 text-[#132a13] px-2.5 py-1 rounded border border-[#90a955]/20 flex flex-col items-start leading-tight"
//                                 >
//                                   <span className="flex items-center gap-1">
//                                     🌾 {cr.name}
//                                     <span className="text-[8px] bg-brand-dark/10 text-[#31572c] px-1 rounded font-extrabold ml-1">
//                                       {cr.sownArea || 0} Ac
//                                     </span>
//                                   </span>
//                                   {cr.sowingDate && (
//                                     <span className="text-[7px] text-gray-700 font-bold mt-0.5 flex items-center gap-0.5 uppercase tracking-wide">
//                                       <CalendarDays className="w-2 h-2 text-gray-600" />{" "}
//                                       Sown: {cr.sowingDate}
//                                     </span>
//                                   )}
//                                 </span>
//                               ))
//                             ) : (
//                               <span className="text-[9px] font-bold text-gray-600">
//                                 No active crops registered.
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-left">
//                         <div>
//                           <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block">
//                             Field Area
//                           </span>
//                           <span className="text-xs font-black text-gray-900">
//                             {farm.totalLand} Acres
//                           </span>
//                           <span className="text-[9px] font-semibold text-gray-700 block mt-0.5">
//                             Available:{" "}
//                             {(
//                               Number(farm.totalLand) -
//                               (farm.crops
//                                 ? farm.crops.reduce(
//                                     (sum, c) => sum + Number(c.sownArea || 0),
//                                     0,
//                                   )
//                                 : 0)
//                             ).toFixed(2)}{" "}
//                             Acres
//                           </span>
//                         </div>
//                         <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100 self-end">
//                           <CheckCircle2 className="w-3 h-3" /> Linked
//                         </span>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               );
//             })}

//             {/* --- INTERACTIVE CARD INTEGRATION METHOD TO TRIGGER MODAL --- */}
//             <div
//               onClick={() => setIsModalOpen(true)}
//               className="bg-transparent rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#31572c] transition-all flex flex-col items-center justify-center p-5 cursor-pointer group min-h-[220px]"
//             >
//               <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-emerald-50 border border-gray-100 transition-colors">
//                 <Plus className="w-6 h-6 text-gray-600 group-hover:text-[#31572c]" />
//               </div>
//               <h4 className="text-xs font-bold text-gray-700 group-hover:text-[#31572c] uppercase tracking-wider mt-3">
//                 Register New Farm Unit
//               </h4>
//               <p className="text-[10px] text-gray-600 mt-1 max-w-[200px] text-center">
//                 Add structural acreage descriptors, boundary locations, and
//                 temporary dynamic crops
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* --- FARM REGISTRATION MODAL OVERLAY --- */}
//         {isModalOpen && (
//           <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 overflow-y-auto">
//             {/* Explicit Backdrop Layer covering the full screen viewport */}
//             <div
//               className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm transition-opacity"
//               onClick={() => setIsModalOpen(false)}
//             />

//             {/* Content Wrapper to enforce spacing at screen edges */}
//             <div className="w-full max-w-2xl my-8 relative z-10 flex items-center justify-center">
//               {/* Modal Elevation Content Surface Box */}
//               <div className="bg-white rounded-2xl p-6 w-full border border-gray-100 shadow-2xl animate-fadeIn space-y-4 max-h-[85vh] overflow-y-auto">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="absolute top-4 right-4 p-1.5 text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>

//                 <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 text-left">
//                   <Plus className="w-4 h-4 text-[#31572c]" />
//                   <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
//                     Register New Farm Unit
//                   </h3>
//                 </div>

//                 <form
//                   onSubmit={handleAddFarm}
//                   className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
//                 >
//                   <div>
//                     <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
//                       Farm / Plot Name
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="e.g. Ridge Road Mustard Patch"
//                       value={newFarmName}
//                       onChange={(e) => setNewFarmName(e.target.value)}
//                       className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                     />
//                   </div>

//                   <div>
//                     <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
//                       Total Land Area (Acres)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       required
//                       placeholder="e.g. 12.0"
//                       value={newFarmLand}
//                       onKeyDown={blockInvalidChar}
//                       onChange={(e) => setNewFarmLand(e.target.value)}
//                       className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                     />
//                   </div>

//                   <div className="md:col-span-2 space-y-2 border-t pt-3 mt-1">
//                     <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
//                       Farm Location Selector
//                     </label>
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                       <div>
//                         <label className="text-[9px] font-bold text-gray-700 uppercase block mb-1">
//                           Select State
//                         </label>
//                         <select
//                           value={newFarmState}
//                           onChange={(e) => {
//                             const state = e.target.value;
//                             setNewFarmState(state);
//                             setNewFarmDistrict("");
//                             if (!state) setNewFarmLocation("");
//                           }}
//                           className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                         >
//                           <option value="">-- Choose State --</option>
//                           {Object.keys(INDIAN_STATES).map((st) => (
//                             <option key={st} value={st}>
//                               {st}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                       <div>
//                         <label className="text-[9px] font-bold text-gray-700 uppercase block mb-1">
//                           Select District
//                         </label>
//                         <select
//                           value={newFarmDistrict}
//                           disabled={!newFarmState}
//                           onChange={(e) => {
//                             const dist = e.target.value;
//                             setNewFarmDistrict(dist);
//                             if (dist && newFarmState)
//                               setNewFarmLocation(`${dist}, ${newFarmState}`);
//                           }}
//                           className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] disabled:opacity-50"
//                         >
//                           <option value="">-- Choose District --</option>
//                           {newFarmState &&
//                             INDIAN_STATES[newFarmState].map((d) => (
//                               <option key={d} value={d}>
//                                 {d}
//                               </option>
//                             ))}
//                         </select>
//                       </div>
//                       <div className="flex flex-col justify-end">
//                         <button
//                           type="button"
//                           disabled={isDetectingLocation}
//                           onClick={() => handleDetectGPSLocation(false)}
//                           className="w-full h-[38px] bg-emerald-50 text-[#31572c] hover:bg-emerald-100 border border-[#cbdcd5] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
//                         >
//                           {isDetectingLocation ? (
//                             <>
//                               <RefreshCw className="w-3.5 h-3.5 animate-spin" />
//                               <span>Detecting...</span>
//                             </>
//                           ) : (
//                             <>
//                               <MapPin className="w-3.5 h-3.5 text-[#31572c]" />
//                               <span>Fetch Location</span>
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="text-[9px] font-bold text-gray-700 uppercase block mb-1">
//                         Location Descriptor / Address
//                       </label>
//                       <input
//                         type="text"
//                         required
//                         placeholder="e.g. Ballabhgarh Outer Zone, Haryana"
//                         value={newFarmLocation}
//                         onChange={(e) => setNewFarmLocation(e.target.value)}
//                         className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
//                       />
//                     </div>
//                   </div>

//                   <div className="md:col-span-2 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-left">
//                     <div className="flex justify-between items-center">
//                       <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
//                         Planted Crops Registry
//                       </label>
//                       <span className="text-[10px] font-black text-gray-900 bg-white text-[#1e4638] px-2 py-0.5 rounded border border-gray-200">
//                         Available:{" "}
//                         {(
//                           Number(newFarmLand || 0) -
//                           tempCropsList.reduce(
//                             (sum, c) => sum + Number(c.sownArea || 0),
//                             0,
//                           )
//                         ).toFixed(2)}{" "}
//                         / {Number(newFarmLand || 0).toFixed(2)} Acres
//                       </span>
//                     </div>

//                     <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto bg-white p-2 rounded-lg border border-gray-200 min-h-[38px] items-center">
//                       {tempCropsList.length > 0 ? (
//                         tempCropsList.map((c, idx) => (
//                           <span
//                             key={idx}
//                             className="text-[9px] font-black uppercase bg-[#ecf39e]/40 text-[#132a13] border border-[#90a955]/20 px-2.5 py-1 rounded flex items-center gap-1.5"
//                           >
//                             <span>
//                               🌾 {c.name} ({c.sownArea} Acres){" "}
//                               {c.sowingDate ? `[Sown: ${c.sowingDate}]` : ""}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => handleRemoveTempCrop(idx)}
//                               className="text-red-600 hover:text-red-800 font-extrabold cursor-pointer focus:outline-none"
//                             >
//                               ×
//                             </button>
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-[10px] font-medium text-gray-700 pl-1">
//                           No crops added yet. Add crop allocations below.
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex flex-col sm:flex-row items-end gap-3 pt-1">
//                       <div className="flex-1 w-full">
//                         <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
//                           Crop Name
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="e.g. Rice (Paddy)"
//                           value={tempCropName}
//                           onChange={(e) => setTempCropName(e.target.value)}
//                           className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
//                         />
//                       </div>
//                       <div className="w-full sm:w-auto">
//                         <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
//                           Sowing Date
//                         </label>
//                         <input
//                           type="date"
//                           value={tempCropSowingDate}
//                           onChange={(e) =>
//                             setTempCropSowingDate(e.target.value)
//                           }
//                           className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none min-w-[120px]"
//                         />
//                       </div>
//                       <div className="w-full sm:w-auto">
//                         <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
//                           Sown Area
//                         </label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           placeholder="e.g. 2.5"
//                           value={tempCropSownArea}
//                           onKeyDown={blockInvalidChar}
//                           onChange={(e) => setTempCropSownArea(e.target.value)}
//                           className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none min-w-[100px]"
//                         />
//                       </div>
//                       <button
//                         type="button"
//                         onClick={handleAddTempCrop}
//                         className="h-[38px] px-4 bg-brand-dark hover:bg-[#132a13] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
//                       >
//                         <Plus className="w-3.5 h-3.5" /> <span>Add</span>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="md:col-span-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => setIsModalOpen(false)}
//                       className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl"
//                     >
//                       Close
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-5 py-3 bg-brand-dark hover:bg-[#132a13] text-[#f4f7f4] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
//                     >
//                       <Sprout className="w-4 h-4 text-[#ecf39e]" />
//                       <span>Save Asset to Registry Ledger</span>
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  Sprout,
  Edit3,
  X,
  Save,
  Check,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import { profileApi } from "../../services/apiService";
import {
  INDIAN_STATES,
  getLocationByGPS,
} from "../../services/locationService";

export default function Profile() {
  // --- STATE LAYER ---
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Core farmer profile
  const [farmerProfile, setFarmerProfile] = useState({
    name: "Suresh Kumar",
    location: "Faridabad, Haryana",
    pincode: "121001",
    primaryCrops: ["Rice", "Wheat"],
  });

  // Multiple plots/farms array
  const [farms, setFarms] = useState([]);

  // Profile Edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editPincode, setEditPincode] = useState("");
  const [editPrimaryCrops, setEditPrimaryCrops] = useState("");

  // --- REGISTER FARM FORM STATE ---
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmLocation, setNewFarmLocation] = useState("");
  const [newFarmLand, setNewFarmLand] = useState("");
  const [newFarmState, setNewFarmState] = useState("");
  const [newFarmDistrict, setNewFarmDistrict] = useState("");

  // Interactive crops register array for registering new farms
  const [tempCropsList, setTempCropsList] = useState([]);
  const [tempCropName, setTempCropName] = useState("");
  const [tempCropSowingDate, setTempCropSowingDate] = useState("");
  const [tempCropSownArea, setTempCropSownArea] = useState("");

  // --- INDIVIDUAL FARM INLINE EDIT STATE ---
  const [editingFarmId, setEditingFarmId] = useState(null);
  const [editFarmName, setEditFarmName] = useState("");
  const [editFarmLocation, setEditFarmLocation] = useState("");
  const [editFarmLand, setEditFarmLand] = useState("");
  const [editFarmState, setEditFarmState] = useState("");
  const [editFarmDistrict, setEditFarmDistrict] = useState("");

  // Interactive crops list for inline farm edits
  const [editCropsList, setEditCropsList] = useState([]);
  const [editCropName, setEditCropName] = useState("");
  const [editCropSowingDate, setEditCropSowingDate] = useState("");
  const [editCropSownArea, setEditCropSownArea] = useState("");

  // --- GEOLOCATION DETECTION STATE ---
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // --- API CONSUMPTION (GET PROFILE) ---
  const loadProfile = async (showMutedSpinner = false) => {
    try {
      if (showMutedSpinner) setSyncing(true);
      else setLoading(true);

      const res = await profileApi.getProfile();
      if (res.success && res.data) {
        setFarmerProfile(res.data);
        setFarms(res.data.farms || []);
        setError(null);
      } else {
        throw new Error(res.error || "Invalid API response format.");
      }
    } catch (err) {
      console.error("[Profile] API Sync Failed:", err.message);
      setError("Mongoose Database Server offline. Using baseline details.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // --- CORE PROFILE EDIT HANDLERS (PUT PROFILE) ---
  const startEditingProfile = () => {
    setEditName(farmerProfile.name);
    setEditLocation(farmerProfile.location);
    setEditPincode(farmerProfile.pincode);
    setEditPrimaryCrops(farmerProfile.primaryCrops.join(", "));
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      setSyncing(true);
      const cropsArray = editPrimaryCrops
        ? editPrimaryCrops
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        : [];

      const res = await profileApi.updateProfile({
        name: editName,
        location: editLocation,
        pincode: editPincode,
        primaryCrops: cropsArray,
      });

      if (res.success && res.data) {
        setFarmerProfile(res.data);
        setIsEditingProfile(false);
        setError(null);
      }
    } catch (err) {
      alert("Error updating profile credentials: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // --- INTERACTIVE DYNAMIC GEOLOCATION DETECTOR ---
  const handleDetectGPSLocation = async (isEdit = false) => {
    try {
      setIsDetectingLocation(true);
      const resolved = await getLocationByGPS();
      const locationText = `${resolved.district}, ${resolved.state}`;
      if (isEdit) {
        setEditFarmLocation(locationText);
        setEditFarmState(resolved.state);
        setEditFarmDistrict(resolved.district);
      } else {
        setNewFarmLocation(locationText);
        setNewFarmState(resolved.state);
        setNewFarmDistrict(resolved.district);
      }
    } catch (err) {
      alert("GPS Detection failed: " + err.message);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // --- INTERACTIVE TEMP CROPS HANDLERS (NEW FARM REGISTER FORM) ---
  const handleAddTempCrop = (e) => {
    e.preventDefault();
    if (!tempCropName.trim()) return;

    const numericSown = Number(tempCropSownArea);
    // Explicit Validation Check for Non-Numeric, Negative, or Zero Area Values
    if (isNaN(numericSown) || numericSown <= 0) {
      alert(
        "Crop sown area must be a valid positive number. Alphabetic characters, symbols, or negative numbers are not permitted.",
      );
      return;
    }

    const totalLandVal = Number(newFarmLand || 0);
    if (isNaN(totalLandVal) || totalLandVal <= 0) {
      alert(
        "Please specify a valid positive total land area for the farm first before allocating crops.",
      );
      return;
    }

    const sumExisting = tempCropsList.reduce(
      (sum, c) => sum + Number(c.sownArea || 0),
      0,
    );
    const remaining = totalLandVal - sumExisting;

    if (numericSown > remaining) {
      alert(
        `Over-allocation error: Sown area for ${tempCropName} (${numericSown} Acres) exceeds the remaining available land area (${remaining.toFixed(2)} Acres).`,
      );
      return;
    }

    const newCrop = {
      name: tempCropName.trim(),
      sowingDate: tempCropSowingDate || "",
      sownArea: numericSown,
    };

    setTempCropsList([...tempCropsList, newCrop]);
    setTempCropName("");
    setTempCropSowingDate("");
    setTempCropSownArea("");
  };

  const handleRemoveTempCrop = (index) => {
    setTempCropsList(tempCropsList.filter((_, idx) => idx !== index));
  };

  // --- LAND ASSET REGISTRATION (POST FARM) ---
  const handleAddFarm = async (e) => {
    e.preventDefault();
    if (!newFarmName.trim() || !newFarmLand) return;

    const numericLand = Number(newFarmLand);
    // Strict Verification check on Land value input validation
    if (isNaN(numericLand) || numericLand <= 0) {
      alert(
        "Total land area must be a valid positive number. Alphabetic characters, symbols, or negative numbers are not permitted.",
      );
      return;
    }

    const totalSown = tempCropsList.reduce(
      (sum, c) => sum + Number(c.sownArea || 0),
      0,
    );
    if (totalSown > numericLand) {
      alert(
        `Over-allocation error: Total crop sown area (${totalSown} Acres) exceeds the farm's total land area (${numericLand} Acres).`,
      );
      return;
    }

    try {
      setSyncing(true);
      const cropsArray =
        tempCropsList.length > 0
          ? tempCropsList
          : [{ name: "Fallow", sowingDate: "", sownArea: 0 }];

      const res = await profileApi.addFarm({
        name: newFarmName.trim(),
        location: newFarmLocation || "Haryana Region",
        totalLand: numericLand,
        crops: cropsArray,
      });

      if (res.success) {
        if (res.farms) setFarms(res.farms);
        else await loadProfile(true);

        // Reset farm form fields & Close Modal
        setNewFarmName("");
        setNewFarmLocation("");
        setNewFarmLand("");
        setNewFarmState("");
        setNewFarmDistrict("");
        setTempCropsList([]);
        setTempCropName("");
        setTempCropSowingDate("");
        setTempCropSownArea("");
        setIsModalOpen(false);
      }
    } catch (err) {
      alert("Failed to register new land asset: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // --- INTERACTIVE EDIT CROPS HANDLERS (FARM EDIT MODE) ---
  const handleAddEditCrop = (e) => {
    e.preventDefault();
    if (!editCropName.trim()) return;

    const numericSown = Number(editCropSownArea);
    if (isNaN(numericSown) || numericSown <= 0) {
      alert(
        "Crop sown area must be a valid positive number. Alphabetic characters, symbols, or negative numbers are not permitted.",
      );
      return;
    }

    const totalLandVal = Number(editFarmLand || 0);
    if (isNaN(totalLandVal) || totalLandVal <= 0) {
      alert(
        "Please specify a valid positive total land area for the farm first.",
      );
      return;
    }

    const sumExisting = editCropsList.reduce(
      (sum, c) => sum + Number(c.sownArea || 0),
      0,
    );
    const remaining = totalLandVal - sumExisting;

    if (numericSown > remaining) {
      alert(
        `Over-allocation error: Sown area for ${editCropName} (${numericSown} Acres) exceeds the remaining available land area (${remaining.toFixed(2)} Acres).`,
      );
      return;
    }

    const newCrop = {
      name: editCropName.trim(),
      sowingDate: editCropSowingDate || "",
      sownArea: numericSown,
    };

    setEditCropsList([...editCropsList, newCrop]);
    setEditCropName("");
    setEditCropSowingDate("");
    setEditCropSownArea("");
  };

  const handleRemoveEditCrop = (index) => {
    setEditCropsList(editCropsList.filter((_, idx) => idx !== index));
  };

  // --- LAND ASSET INLINE UPDATE (PUT FARM) ---
  const startEditingFarm = (farm) => {
    setEditingFarmId(farm._id || farm.id);
    setEditFarmName(farm.name);
    setEditFarmLocation(farm.location);
    setEditFarmLand(farm.totalLand);
    setEditCropsList(
      farm.crops
        ? farm.crops.map((c) => ({
            name: c.name,
            sowingDate: c.sowingDate,
            sownArea: Number(c.sownArea || 0),
          }))
        : [],
    );
    setEditCropName("");
    setEditCropSowingDate("");
    setEditCropSownArea("");

    if (farm.location && farm.location.includes(", ")) {
      const parts = farm.location.split(", ");
      if (parts.length >= 2) {
        setEditFarmState(parts[parts.length - 1].trim());
        setEditFarmDistrict(parts[parts.length - 2].trim());
      }
    } else {
      setEditFarmState("");
      setEditFarmDistrict("");
    }
  };

  const handleSaveFarmEdit = async (e) => {
    e.preventDefault();
    if (!editFarmName.trim() || !editFarmLand) return;

    const numericLand = Number(editFarmLand);
    if (isNaN(numericLand) || numericLand <= 0) {
      alert(
        "Total land area must be a valid positive number. Alphabetic characters, symbols, or negative numbers are not permitted.",
      );
      return;
    }

    const totalSown = editCropsList.reduce(
      (sum, c) => sum + Number(c.sownArea || 0),
      0,
    );
    if (totalSown > numericLand) {
      alert(
        `Over-allocation error: Total crop sown area (${totalSown} Acres) exceeds the farm's total land area (${numericLand} Acres).`,
      );
      return;
    }

    try {
      setSyncing(true);
      const cropsArray =
        editCropsList.length > 0
          ? editCropsList
          : [{ name: "Fallow", sowingDate: "", sownArea: 0 }];

      const res = await profileApi.updateFarm(editingFarmId, {
        name: editFarmName.trim(),
        location: editFarmLocation,
        totalLand: numericLand,
        crops: cropsArray,
      });

      if (res.success) {
        if (res.farms) setFarms(res.farms);
        else await loadProfile(true);

        setEditingFarmId(null);
        setEditFarmState("");
        setEditFarmDistrict("");
      }
    } catch (err) {
      alert("Failed to update farm details: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // --- LAND ASSET DELETION (DELETE FARM) ---
  const handleDeleteFarm = async (farmId) => {
    if (
      !window.confirm(
        "Are you sure you want to de-register this land asset from the cloud ledger?",
      )
    )
      return;

    try {
      setSyncing(true);
      const res = await profileApi.deleteFarm(farmId);
      if (res.success) {
        if (res.farms) setFarms(res.farms);
        else await loadProfile(true);
      }
    } catch (err) {
      alert("Failed to delete land asset: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  // Blocks 'e', 'E', '+', '-' on standard key press tracking triggers
  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const aggregateAcreage = farms.reduce(
    (sum, f) => sum + parseFloat(f.totalLand || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-[#132a13] animate-pulse">
          Syncing Farmer Registry Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f4] font-['Plus_Jakarta_Sans',_Inter,_sans-serif] p-4 md:p-8 text-gray-700">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- PAGE HEADER --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
              Farmer Ledger & Registry{" "}
              <span className="text-gray-300 font-normal">|</span>{" "}
              <span className="text-[#31572c] font-medium font-hindi text-lg">
                कृषक पत्रिका
              </span>
            </h1>
            <p className="text-xs text-gray-700 mt-1">
              Manage secondary operations plots, multi-farm telemetry
              structures, and vocal translation pathways.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {syncing && (
              <span className="text-[10px] font-bold text-[#31572c] bg-brand-dark/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse border border-[#90a955]/30">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Cloud...</span>
              </span>
            )}
          </div>
        </header>

        {/* --- ERROR DISPLAY BANNER --- */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs font-bold text-left">
            ⚠️ {error} Baselines are saved locally. Connect backend to restore
            MongoDB syncing!
          </div>
        )}

        {/* --- HORIZONTAL CORE IDENTITY SUMMARY PANEL --- */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-left">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#31572c]" />
              <h2 className="text-xs font-bold text-gray-900 tracking-wide uppercase">
                Core Identity Summary
              </h2>
            </div>
            {!isEditingProfile && (
              <button
                type="button"
                onClick={startEditingProfile}
                className="text-xs text-[#31572c] hover:text-[#132a13] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form
              onSubmit={handleSaveProfile}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left items-end"
            >
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  Farmer Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  HQ Base Location
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  Primary Staples
                </label>
                <input
                  type="text"
                  value={editPrimaryCrops}
                  onChange={(e) => setEditPrimaryCrops(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-950 focus:outline-none focus:border-[#31572c]"
                />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-dark hover:bg-[#132a13] text-white text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left items-center bg-[#f4f7f4]/40 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                  Farmer Name
                </span>
                <span className="text-sm font-black text-gray-900 block mt-0.5">
                  {farmerProfile.name}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                  Primary Headquarters Base
                </span>
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-600" />{" "}
                  {farmerProfile.location} ({farmerProfile.pincode})
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                  Registered Global Staples
                </span>
                <div className="flex flex-wrap gap-1">
                  {farmerProfile.primaryCrops.map((crop) => (
                    <span
                      key={crop}
                      className="text-[9px] font-black uppercase tracking-widest bg-white text-[#31572c] px-2.5 py-1 rounded border border-gray-200"
                    >
                      🌾 {crop}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:border-l sm:border-gray-200 sm:pl-6 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">
                  Aggregated Holdings
                </span>
                <span className="text-lg font-black text-gray-900">
                  {aggregateAcreage.toFixed(1)}{" "}
                  <small className="text-xs font-bold text-gray-600">
                    Acres Total
                  </small>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#15803d] mt-0.5">
                  {farms.length} Active Plots Registered
                </span>
              </div>
            </div>
          )}
        </div>

        {/* --- FULL-WIDTH AGRICULTURAL LAND ASSETS FEED --- */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200/80 pb-2 text-left">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#31572c]" />
              <h3 className="text-sm font-bold text-[#31572c] tracking-wide uppercase">
                Your Agricultural Land Assets
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {farms.map((farm) => {
              const farmId = farm._id || farm.id;
              const isEditingThisFarm = editingFarmId === farmId;

              return (
                <div
                  key={farmId}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative group min-h-[220px]"
                >
                  {!isEditingThisFarm && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        type="button"
                        onClick={() => startEditingFarm(farm)}
                        className="p-1.5 text-gray-600 hover:text-[#31572c] rounded-lg hover:bg-emerald-50 cursor-pointer"
                        title="Edit Plot"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFarm(farmId)}
                        className="p-1.5 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                        title="Delete Plot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {isEditingThisFarm ? (
                    <form
                      onSubmit={handleSaveFarmEdit}
                      className="space-y-3 text-left w-full"
                    >
                      <h4 className="text-xs font-bold text-gray-900 border-b pb-1">
                        Edit Land Plot
                      </h4>
                      <div>
                        <label className="text-[8px] font-bold text-gray-600 uppercase block">
                          Plot Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editFarmName}
                          onChange={(e) => setEditFarmName(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white text-gray-900 focus:outline-none focus:border-[#31572c]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[8px] font-bold text-gray-600 uppercase block">
                            State
                          </label>
                          <select
                            value={editFarmState}
                            onChange={(e) => {
                              const state = e.target.value;
                              setEditFarmState(state);
                              setEditFarmDistrict("");
                              if (!state) setEditFarmLocation("");
                            }}
                            className="w-full border border-gray-200 rounded px-2 py-0.5 text-[10px] font-bold bg-white text-gray-900 focus:outline-none"
                          >
                            <option value="">-- State --</option>
                            {Object.keys(INDIAN_STATES).map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-gray-600 uppercase block">
                            District
                          </label>
                          <select
                            value={editFarmDistrict}
                            disabled={!editFarmState}
                            onChange={(e) => {
                              const dist = e.target.value;
                              setEditFarmDistrict(dist);
                              if (dist && editFarmState)
                                setEditFarmLocation(
                                  `${dist}, ${editFarmState}`,
                                );
                            }}
                            className="w-full border border-gray-200 rounded px-2 py-0.5 text-[10px] font-bold bg-white text-gray-900 focus:outline-none disabled:opacity-50"
                          >
                            <option value="">-- District --</option>
                            {editFarmState &&
                              INDIAN_STATES[editFarmState].map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-gray-600 uppercase block">
                          Total Area (Acres)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.01"
                          required
                          value={editFarmLand}
                          onKeyDown={blockInvalidChar}
                          onChange={(e) => setEditFarmLand(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-semibold bg-white text-gray-900 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingFarmId(null)}
                          className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold uppercase rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-1.5 bg-brand-dark text-white text-[10px] font-bold uppercase rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="space-y-3 text-left">
                        <div>
                          <h4 className="text-sm font-black text-gray-900 leading-tight pr-12">
                            {farm.name}
                          </h4>
                          <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-600" />{" "}
                            {farm.location}
                          </span>
                        </div>

                        <div className="pt-1">
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                            Crops Planted Here
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {farm.crops && farm.crops.length > 0 ? (
                              farm.crops.map((cr, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-black uppercase bg-[#ecf39e]/40 text-[#132a13] px-2.5 py-1 rounded border border-[#90a955]/20 flex flex-col items-start leading-tight"
                                >
                                  <span className="flex items-center gap-1">
                                    🌾 {cr.name}
                                    <span className="text-[8px] bg-brand-dark/10 text-[#31572c] px-1 rounded font-extrabold ml-1">
                                      {cr.sownArea || 0} Ac
                                    </span>
                                  </span>
                                  {cr.sowingDate && (
                                    <span className="text-[7px] text-gray-700 font-bold mt-0.5 flex items-center gap-0.5 uppercase tracking-wide">
                                      <CalendarDays className="w-2 h-2 text-gray-600" />{" "}
                                      Sown: {cr.sowingDate}
                                    </span>
                                  )}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] font-bold text-gray-600">
                                No active crops registered.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-left">
                        <div>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block">
                            Field Area
                          </span>
                          <span className="text-xs font-black text-gray-900">
                            {farm.totalLand} Acres
                          </span>
                          <span className="text-[9px] font-semibold text-gray-700 block mt-0.5">
                            Available:{" "}
                            {(
                              Number(farm.totalLand) -
                              (farm.crops
                                ? farm.crops.reduce(
                                    (sum, c) => sum + Number(c.sownArea || 0),
                                    0,
                                  )
                                : 0)
                            ).toFixed(2)}{" "}
                            Acres
                          </span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-100 self-end">
                          <CheckCircle2 className="w-3 h-3" /> Linked
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* --- INTERACTIVE CARD INTEGRATION METHOD TO TRIGGER MODAL --- */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-transparent rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#31572c] transition-all flex flex-col items-center justify-center p-5 cursor-pointer group min-h-[220px]"
            >
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:bg-emerald-50 border border-gray-100 transition-colors">
                <Plus className="w-6 h-6 text-gray-600 group-hover:text-[#31572c]" />
              </div>
              <h4 className="text-xs font-bold text-gray-700 group-hover:text-[#31572c] uppercase tracking-wider mt-3">
                Register New Farm Unit
              </h4>
              <p className="text-[10px] text-gray-600 mt-1 max-w-[200px] text-center">
                Add structural acreage descriptors, boundary locations, and
                temporary dynamic crops
              </p>
            </div>
          </div>
        </div>

        {/* --- FARM REGISTRATION MODAL OVERLAY --- */}
        {isModalOpen && (
          <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            {/* Explicit Backdrop Layer covering the full screen viewport */}
            <div
              className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Content Wrapper to enforce spacing at screen edges */}
            <div className="w-full max-w-2xl my-8 relative z-10 flex items-center justify-center">
              {/* Modal Elevation Content Surface Box */}
              <div className="bg-white rounded-2xl p-6 w-full border border-gray-100 shadow-2xl animate-fadeIn space-y-4 max-h-[85vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 text-gray-700 hover:text-gray-950 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 text-left">
                  <Plus className="w-4 h-4 text-[#31572c]" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    Register New Farm Unit
                  </h3>
                </div>

                <form
                  onSubmit={handleAddFarm}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
                >
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Farm / Plot Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ridge Road Mustard Patch"
                      value={newFarmName}
                      onChange={(e) => setNewFarmName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Total Land Area (Acres)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.01"
                      required
                      placeholder="e.g. 12.0"
                      value={newFarmLand}
                      onKeyDown={blockInvalidChar}
                      onChange={(e) => setNewFarmLand(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2 border-t pt-3 mt-1">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                      Farm Location Selector
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-gray-700 uppercase block mb-1">
                          Select State
                        </label>
                        <select
                          value={newFarmState}
                          onChange={(e) => {
                            const state = e.target.value;
                            setNewFarmState(state);
                            setNewFarmDistrict("");
                            if (!state) setNewFarmLocation("");
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                        >
                          <option value="">-- Choose State --</option>
                          {Object.keys(INDIAN_STATES).map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-700 uppercase block mb-1">
                          Select District
                        </label>
                        <select
                          value={newFarmDistrict}
                          disabled={!newFarmState}
                          onChange={(e) => {
                            const dist = e.target.value;
                            setNewFarmDistrict(dist);
                            if (dist && newFarmState)
                              setNewFarmLocation(`${dist}, ${newFarmState}`);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] disabled:opacity-50"
                        >
                          <option value="">-- Choose District --</option>
                          {newFarmState &&
                            INDIAN_STATES[newFarmState].map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex flex-col justify-end">
                        <button
                          type="button"
                          disabled={isDetectingLocation}
                          onClick={() => handleDetectGPSLocation(false)}
                          className="w-full h-[38px] bg-emerald-50 text-[#31572c] hover:bg-emerald-100 border border-[#cbdcd5] text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isDetectingLocation ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Detecting...</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-[#31572c]" />
                              <span>Fetch Location</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-700 uppercase block mb-1">
                        Location Descriptor / Address
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ballabhgarh Outer Zone, Haryana"
                        value={newFarmLocation}
                        onChange={(e) => setNewFarmLocation(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                        Planted Crops Registry
                      </label>
                      <span className="text-[10px] font-black text-gray-900 bg-white text-[#1e4638] px-2 py-0.5 rounded border border-gray-200">
                        Available:{" "}
                        {(
                          Number(newFarmLand || 0) -
                          tempCropsList.reduce(
                            (sum, c) => sum + Number(c.sownArea || 0),
                            0,
                          )
                        ).toFixed(2)}{" "}
                        / {Number(newFarmLand || 0).toFixed(2)} Acres
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto bg-white p-2 rounded-lg border border-gray-200 min-h-[38px] items-center">
                      {tempCropsList.length > 0 ? (
                        tempCropsList.map((c, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-black uppercase bg-[#ecf39e]/40 text-[#132a13] border border-[#90a955]/20 px-2.5 py-1 rounded flex items-center gap-1.5"
                          >
                            <span>
                              🌾 {c.name} ({c.sownArea} Acres){" "}
                              {c.sowingDate ? `[Sown: ${c.sowingDate}]` : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTempCrop(idx)}
                              className="text-red-600 hover:text-red-800 font-extrabold cursor-pointer focus:outline-none"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-medium text-gray-700 pl-1">
                          No crops added yet. Add crop allocations below.
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                      <div className="sm:col-span-5 w-full">
                        <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                          Crop Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Rice (Paddy)"
                          value={tempCropName}
                          onChange={(e) => setTempCropName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] h-[38px]"
                        />
                      </div>
                      <div className="sm:col-span-3 w-full">
                        <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                          Sowing Date
                        </label>
                        <input
                          type="date"
                          value={tempCropSowingDate}
                          onChange={(e) =>
                            setTempCropSowingDate(e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] h-[38px]"
                        />
                      </div>
                      <div className="sm:col-span-2 w-full">
                        <label className="text-[9px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                          Sown Area
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.01"
                          placeholder="e.g. 2.5"
                          value={tempCropSownArea}
                          onKeyDown={blockInvalidChar}
                          onChange={(e) => setTempCropSownArea(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#31572c] h-[38px]"
                        />
                      </div>
                      <div className="sm:col-span-2 w-full">
                        <button
                          type="button"
                          onClick={handleAddTempCrop}
                          className="h-[38px] w-full bg-brand-dark hover:bg-[#132a13] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-3 bg-brand-dark hover:bg-[#132a13] text-[#f4f7f4] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sprout className="w-4 h-4 text-[#ecf39e]" />
                      <span>Save Asset to Registry Ledger</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
