import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { INDIAN_STATES, getSoilDataByPincode } from '../services/locationService';

// Generic Custom UI Dropdown Component for polished premium aesthetics
function CustomDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="flex flex-col space-y-1.5 relative">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 text-left text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#31572c] transition-all flex items-center justify-between cursor-pointer active:scale-[0.99] select-none"
        >
          <span>{value}</span>
          <LucideIcons.ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <>
            {/* Backdrop layer to capture clicks outside */}
            <div className="fixed inset-0 z-30 bg-transparent" onClick={() => setIsOpen(false)} />
            
            {/* Options List */}
            <ul className="absolute left-0 right-0 z-40 mt-1.5 w-full bg-white border border-gray-200/80 rounded-xl shadow-xl max-h-60 overflow-y-auto focus:outline-none py-1.5 animate-fadeIn text-xs font-bold text-gray-700 divide-y divide-gray-50">
              {options.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 hover:bg-[#31572c]/10 hover:text-[#132a13] cursor-pointer transition-colors duration-150 ${opt === value ? 'bg-[#31572c]/5 text-[#31572c] border-l-2 border-l-[#31572c]' : ''}`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default function LocationSelector({ value, onChange }) {
  const [selectedState, setSelectedState] = useState('Haryana');
  const [selectedDistrict, setSelectedDistrict] = useState('Faridabad');
  const [pincode, setPincode] = useState('121001');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Resolve soil analytics based on pincode
  const [soilData, setSoilData] = useState(() => getSoilDataByPincode('121001'));

  // Synchronize with external value prop updates
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
      if (value.soilData && JSON.stringify(value.soilData) !== JSON.stringify(soilData)) {
        setSoilData(value.soilData);
      }
    }
  }, [value]);

  // Trigger onChange when location values modify
  useEffect(() => {
    if (onChange) {
      onChange({
        state: selectedState,
        district: selectedDistrict,
        pincode,
        soilData
      });
    }
  }, [selectedState, selectedDistrict, pincode, soilData]);

  // Handle manual state selection
  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    // Reset district to first available district in that state
    const firstDistrict = INDIAN_STATES[stateName]?.[0] || '';
    setSelectedDistrict(firstDistrict);
    setErrorMsg('');
  };

  // Handle manual district selection
  const handleDistrictChange = (districtName) => {
    setSelectedDistrict(districtName);
    setErrorMsg('');
  };

  // Handle pincode text input
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').trim().slice(0, 6);
    setPincode(val);
    
    // Automatically recalculate soil data when a valid 6-digit pincode is completed
    if (val.length === 6) {
      const newSoil = getSoilDataByPincode(val);
      setSoilData(newSoil);
    }
    setErrorMsg('');
  };

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm space-y-5 transition-all">
      
      {/* Top Header Selector Area */}
      <div className="flex items-center space-x-2.5 pb-4 border-b border-gray-100">
        <div className="p-2 bg-[#31572c]/10 rounded-xl text-[#31572c]">
          <LucideIcons.MapPin className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            Location Selector
            <span className="text-gray-400 font-medium lowercase text-xs tracking-normal">
              (स्थान चयनकर्ता)
            </span>
          </h3>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
            Select farm coordinates to load local soil chemistry
          </p>
        </div>
      </div>

      {/* Dropdown controls grid using premium custom generic UI dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* State select dropdown */}
        <CustomDropdown
          label="Select State / राज्य"
          options={Object.keys(INDIAN_STATES)}
          value={selectedState}
          onChange={handleStateChange}
        />

        {/* District select dropdown */}
        <CustomDropdown
          label="Select District / जिला"
          options={INDIAN_STATES[selectedState] || []}
          value={selectedDistrict}
          onChange={handleDistrictChange}
        />

        {/* Pincode numerical entry */}
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
              className="w-full bg-[#f4f7f4] border border-[#90a955]/30 rounded-xl px-3 py-2 pl-9 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#31572c] transition-all"
            />
            <LucideIcons.Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            {pincode.length > 0 && pincode.length < 6 && (
              <span className="absolute right-3 top-2 flex h-2 w-2 rounded-full bg-amber-500 animate-ping" title="Inputting..." />
            )}
          </div>
        </div>

      </div>

      {/* System Warning/Error messages */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200/60 rounded-xl p-3 text-red-700 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <LucideIcons.AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

    </div>
  );
}
