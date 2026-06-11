import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import {
  INDIAN_STATES,
  getSoilDataByPincode,
  getLocationByGPS,
} from "../services/locationService";
import { profileApi } from "../services/apiService";

// High-fidelity fallback farms in case the local database is offline
const FALLBACK_FARMS = [
  {
    _id: "fallback-farm-1",
    name: "Home Sector Flatlands",
    location: "Faridabad, Haryana",
    totalLand: 4.5,
    crops: [
      { name: "Rice (Paddy)", sowingDate: "2026-05-01", sownArea: 2.5 },
      { name: "Mustard", sowingDate: "2026-05-15", sownArea: 1.5 },
    ],
  },
  {
    _id: "fallback-farm-2",
    name: "Northern Tube-well Plot",
    location: "Faridabad, Haryana",
    totalLand: 3.2,
    crops: [{ name: "Wheat", sowingDate: "2025-11-10", sownArea: 2.0 }],
  },
];

// Helper to resolve State & District from location descriptors
const parseLocationText = (locStr) => {
  let state = "Haryana";
  let district = "Faridabad";

  if (locStr && locStr.includes(", ")) {
    const parts = locStr.split(", ");
    const parsedState = parts[parts.length - 1].trim();
    const parsedDistrict = parts[0].trim();

    if (INDIAN_STATES[parsedState]) {
      state = parsedState;
      if (INDIAN_STATES[parsedState].includes(parsedDistrict)) {
        district = parsedDistrict;
      } else {
        district = INDIAN_STATES[parsedState][0] || "Faridabad";
      }
    }
  } else if (locStr && locStr.toLowerCase().includes("ballabhgarh")) {
    state = "Haryana";
    district = "Faridabad";
  }
  return { state, district };
};

// Polished Custom UI Dropdown Component
function CustomDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "-- Choose --",
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize options to structured objects: { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === "object" && opt !== null) {
      return { value: opt.value, label: opt.label };
    }
    return { value: opt, label: opt };
  });

  // Find active option label to display on the button trigger
  const activeOption = normalizedOptions.find((opt) => opt.value === value);
  const displayLabel = activeOption ? activeOption.label : placeholder;

  return (
    <div className="flex flex-col space-y-1.5 relative w-full text-left">
      {label && (
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#f4f7f4] border border-[#2ec4b6]/30 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#208837] transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] select-none"
        >
          <span className="truncate pr-4">{displayLabel}</span>
          <LucideIcons.ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            <ul className="absolute left-0 right-0 z-40 mt-1.5 w-full bg-white border border-gray-200/80 rounded-xl shadow-xl max-h-60 overflow-y-auto focus:outline-none py-1.5 animate-fadeIn text-xs font-bold text-gray-700 divide-y divide-gray-50">
              {normalizedOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-3.5 py-2.5 hover:bg-[#208837]/10 hover:text-[#2e4057] cursor-pointer transition-colors duration-150 flex items-center justify-between ${opt.value === value ? "bg-[#208837]/5 text-[#208837] border-l-2 border-l-[#208837] font-black" : ""}`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.value === value && (
                    <LucideIcons.Check className="h-3.5 w-3.5 text-[#208837] shrink-0 ml-2" />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default function LocationSelector({ value, onChange, onCropSelect, selectedCropId }) {
  // --- DATABASE STATE ---
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [profilePincode, setProfilePincode] = useState("121001");
  const [loadingFarms, setLoadingFarms] = useState(true);

  // --- MANUAL SELECTION FALLBACK STATE ---
  const [selectedState, setSelectedState] = useState("Haryana");
  const [selectedDistrict, setSelectedDistrict] = useState("Faridabad");
  const [pincode, setPincode] = useState("121001");
  const [latitude, setLatitude] = useState(28.4089);
  const [longitude, setLongitude] = useState(77.3178);
  const [soilData, setSoilData] = useState(() =>
    getSoilDataByPincode("121001"),
  );
  const [errorMsg, setErrorMsg] = useState("");

  // Currently selected farm item helper
  const activeFarm = farms.find((f) => (f._id || f.id) === selectedFarmId);
  const unallocatedLand = activeFarm
    ? Number(activeFarm.totalLand) -
      (activeFarm.crops
        ? activeFarm.crops.reduce((sum, c) => sum + Number(c.sownArea || 0), 0)
        : 0)
    : 0;

  // --- SYNC WITH API DIRECTLY ---
  const loadFarmsFromProfile = async () => {
    try {
      setLoadingFarms(true);
      const res = await profileApi.getProfile();
      if (res.success && res.data) {
        const farmList = res.data.farms || [];
        setFarms(farmList);
        setProfilePincode(res.data.pincode || "121001");

        if (farmList.length > 0) {
          // Default to the first registered farm plot
          const firstFarm = farmList[0];
          setSelectedFarmId(firstFarm._id || firstFarm.id);
          applyFarmLocation(firstFarm, res.data.pincode || "121001");
        } else {
          setSelectedFarmId("custom");
        }
      }
    } catch (err) {
      console.warn(
        "[LocationSelector] Profile API offline. Falling back to offline seed assets.",
      );
      setFarms(FALLBACK_FARMS);
      setSelectedFarmId(FALLBACK_FARMS[0]._id);
      applyFarmLocation(FALLBACK_FARMS[0], "121001");
    } finally {
      setLoadingFarms(false);
    }
  };

  useEffect(() => {
    loadFarmsFromProfile();
  }, []);

  // --- ARRANGE TELEMETRY STATE ACCORDING TO SELECT FARM ---
  const applyFarmLocation = (farm, basePin = "121001") => {
    if (!farm) return;
    const { state, district } = parseLocationText(farm.location);
    setSelectedState(state);
    setSelectedDistrict(district);

    // Resolve different pincodes and coordinates for different farm plots
    let pin = basePin || "121001";
    let lat = 28.4089;
    let lng = 77.3178;

    if (farm.name && farm.name.toLowerCase().includes("northern")) {
      pin = "121004";
      lat = 28.3370;
      lng = 77.3275;
    } else if (farm.location && farm.location.toLowerCase().includes("ballabhgarh")) {
      pin = "121004";
      lat = 28.3370;
      lng = 77.3275;
    } else if (farm.name && farm.name.toLowerCase().includes("flatlands")) {
      pin = "121001";
      lat = 28.4089;
      lng = 77.3178;
    }

    setPincode(pin);
    setLatitude(lat);
    setLongitude(lng);

    const newSoil = getSoilDataByPincode(pin);
    setSoilData(newSoil);
  };

  // Trigger external onChange handler when location variables change
  useEffect(() => {
    if (onChange) {
      onChange({
        state: selectedState,
        district: selectedDistrict,
        pincode,
        latitude,
        longitude,
        soilData,
        activeFarm: selectedFarmId !== "custom" ? activeFarm : null,
      });
    }
  }, [selectedState, selectedDistrict, pincode, latitude, longitude, soilData, activeFarm, selectedFarmId]);

  // Synchronize state overrides from GPS Fetch location triggers in parent
  useEffect(() => {
    if (value) {
      if (value.state && value.state !== selectedState) {
        setSelectedState(value.state);
      }
      if (value.district && value.district !== selectedDistrict) {
        setSelectedDistrict(value.district);
      }
      if (value.pincode && value.pincode !== pincode) {
        setPincode(value.pincode);
      }
      if (value.latitude && value.latitude !== latitude) {
        setLatitude(value.latitude);
      }
      if (value.longitude && value.longitude !== longitude) {
        setLongitude(value.longitude);
      }
      if (
        value.soilData &&
        JSON.stringify(value.soilData) !== JSON.stringify(soilData)
      ) {
        setSoilData(value.soilData);
      }
    }
  }, [value]);

  // Handle farm selection changes
  const handleFarmDropdownChange = (farmId) => {
    setSelectedFarmId(farmId);
    if (farmId === "custom") {
      // Revert to manual selector controls
      return;
    }
    const selected = farms.find((f) => (f._id || f.id) === farmId);
    if (selected) {
      applyFarmLocation(selected, profilePincode);
    }
  };

  // Handle manual state changes
  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const firstDistrict = INDIAN_STATES[stateName]?.[0] || "";
    setSelectedDistrict(firstDistrict);
    setErrorMsg("");
  };

  // Handle manual district changes
  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    setErrorMsg("");
  };

  // Handle manual pincode change
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").trim().slice(0, 6);
    setPincode(val);
    if (val.length === 6) {
      const newSoil = getSoilDataByPincode(val);
      setSoilData(newSoil);
    }
    setErrorMsg("");
  };



  // Build options dataset for custom dropdown picker
  const farmOptions = farms.map((f) => ({
    value: f._id || f.id,
    label: `${f.name} (${f.totalLand} Acres) — ${f.location}`,
  }));
  farmOptions.push({
    value: "custom",
    label: "-- Custom / Live Location Override --",
  });

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-6 shadow-sm transition-all duration-300">
      {/* 2-Section Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* LEFT SECTION: Heading & Dropdown */}
        <div className="flex flex-col justify-center space-y-4">
          {/* Header Information */}
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-[#208837]/10 rounded-2xl text-[#208837] shrink-0 shadow-sm">
              <LucideIcons.MapPin className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-gray-955 uppercase tracking-wide flex items-center gap-1.5 leading-snug">
                <span>Agricultural Field Selector</span>
                <span className="text-gray-400 font-bold lowercase text-xs tracking-normal hidden sm:inline">
                  (कृषि क्षेत्र चयनकर्ता)
                </span>
              </h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1 leading-relaxed">
                Select a registered land plot to synchronize dynamic telemetry
                profiles
              </p>
            </div>
          </div>

          {/* Farm Selection Dropdown */}
          <div className="w-full">
            <CustomDropdown
              label="Active Telemetry Plot"
              options={farmOptions}
              value={selectedFarmId}
              onChange={handleFarmDropdownChange}
              placeholder={
                loadingFarms
                  ? "Loading farm plots..."
                  : "-- Choose Farm Plot --"
              }
            />
          </div>
        </div>

        {/* RIGHT SECTION: Selected Farm HUD or Fallback Manual Selectors */}
        <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-150 pt-6 lg:pt-0 lg:pl-8">
          {selectedFarmId !== "custom" && activeFarm ? (
            // Dynamic Visual readout for Selected Farm
            <div className="bg-[#28a745]/[0.03] border border-[#cbdcd5] rounded-2xl p-5 space-y-4 text-left animate-fadeIn h-full flex flex-col justify-between shadow-sm hover:shadow transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#cbdcd5]/40 pb-3">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 tracking-wider">
                    ACTIVE TELEMETRY CELL
                  </span>
                  <h4 className="text-base font-black text-gray-950 mt-2 tracking-tight">
                    {activeFarm.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                    <LucideIcons.MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>Location: {activeFarm.location}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                    Field Size
                  </span>
                  <span className="text-base font-black text-gray-900">
                    {activeFarm.totalLand}{" "}
                    <small className="text-xs font-bold text-gray-400">
                      Acres
                    </small>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                {/* Crops display */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Registered Crops in Plot {onCropSelect && "(Click to View Advisory)"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeFarm.crops && activeFarm.crops.length > 0 ? (
                      activeFarm.crops.map((cr, idx) => {
                        const cropKey = cr.name.toLowerCase().includes("rice")
                          ? "rice"
                          : cr.name.toLowerCase().includes("wheat")
                            ? "wheat"
                            : cr.name.toLowerCase().includes("mustard")
                              ? "mustard"
                              : cr.name.toLowerCase().includes("potato")
                                ? "potato"
                                : cr.name.toLowerCase();

                        const isSelected = selectedCropId === cropKey;

                        if (onCropSelect) {
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => onCropSelect(cropKey)}
                              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border ${
                                isSelected
                                  ? "bg-[#208837] text-white border-[#208837]"
                                  : "bg-white text-[#2e4057] border-[#2ec4b6]/20 hover:bg-[#208837]/10"
                              }`}
                            >
                              <span>🌾 {cr.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ml-0.5 ${
                                isSelected ? "bg-white/20 text-white" : "bg-[#208837]/8 text-[#208837]"
                              }`}>
                                {cr.sownArea || 0} Ac
                              </span>
                            </button>
                          );
                        }

                        return (
                          <span
                            key={idx}
                            className="text-[10px] font-bold uppercase bg-white text-[#2e4057] border border-[#2ec4b6]/20 px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm"
                          >
                            <span>🌾 {cr.name}</span>
                            <span className="text-[9px] bg-[#208837]/8 text-[#208837] px-1.5 py-0.5 rounded font-black ml-0.5">
                              {cr.sownArea || 0} Ac
                            </span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400 font-medium italic">
                        No crops currently sown.
                      </span>
                    )}
                  </div>
                </div>

                {/* Land metrics breakdown */}
                <div className="flex flex-col justify-end sm:items-end">
                  <div className="space-y-2 w-full sm:text-right">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Plot Space Allocation
                    </span>
                    <div className="flex items-center gap-1.5 justify-start sm:justify-end">
                      <span className="text-[10px] font-black bg-[#edf7f4] text-[#1e4638] px-3 py-1 rounded-xl border border-[#cbdcd5] shadow-sm">
                        Available: {unallocatedLand.toFixed(2)} Ac
                      </span>
                      {unallocatedLand <= 0 ? (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-xl">
                          Fully Sown
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-xl">
                          Available Space
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Fallback Manual Override controls
            <div className="space-y-4 text-left p-1 h-full flex flex-col justify-center animate-fadeIn">
              <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-100 tracking-wider self-start">
                MANUAL TELEMETRY OVERRIDE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <CustomDropdown
                  label="Select State / राज्य"
                  options={Object.keys(INDIAN_STATES)}
                  value={selectedState}
                  onChange={handleStateChange}
                />
                <CustomDropdown
                  label="Select District / जिला"
                  options={INDIAN_STATES[selectedState] || []}
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Pincode / पिनकोड
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="e.g. 121001"
                    className="w-full bg-[#f4f7f4] border border-[#2ec4b6]/30 rounded-xl px-3.5 py-2.5 pl-10 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#208837] transition-all"
                  />
                  <LucideIcons.Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  {pincode.length > 0 && pincode.length < 6 && (
                    <span
                      className="absolute right-3 top-3 flex h-2 w-2 rounded-full bg-amber-500 animate-ping"
                      title="Inputting..."
                    />
                  )}
                </div>
              </div>

              {onCropSelect && (
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Select Target Crop to View Advisory
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "rice", name: "Rice (Paddy)" },
                      { id: "wheat", name: "Wheat" },
                      { id: "mustard", name: "Mustard" },
                      { id: "potato", name: "Potato" },
                    ].map((cr) => {
                      const isSelected = selectedCropId === cr.id;
                      return (
                        <button
                          key={cr.id}
                          type="button"
                          onClick={() => onCropSelect(cr.id)}
                          className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-[#208837] text-white border-[#208837]"
                              : "bg-white text-[#2e4057] border-[#2ec4b6]/20 hover:bg-[#208837]/10"
                          }`}
                        >
                          <span>🌾 {cr.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* System Warning/Error messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200/60 rounded-xl p-3 text-red-700 text-xs font-semibold flex items-center space-x-2 animate-fadeIn mt-4">
          <LucideIcons.AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
