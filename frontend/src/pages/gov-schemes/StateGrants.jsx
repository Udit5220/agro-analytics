import React, { useState } from 'react';
import { 
  Landmark, 
  Warehouse, 
  Factory, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Check, 
  Info,
  MapPin,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { generateContent } from '../../services/gemini/client';

export default function StateGrants() {
  const [activeModalGrant, setActiveModalGrant] = useState(null); // stores grant object when modal is open
  const [calculating, setCalculating] = useState(false);

  // Cold Storage Eligibility State
  const [coldStorageAnswers, setColdStorageAnswers] = useState({
    farmerType: '', // 'individual' or 'fpo'
    capacity: '' // number in metric tons
  });

  // Agro-Processing Eligibility State
  const [agroProcessingAnswers, setAgroProcessingAnswers] = useState({
    nearFarmGate: null, // boolean or null
    sorting: false,
    grading: false,
    packing: false
  });

  const [eligibilityResult, setEligibilityResult] = useState(null); // { status: 'success' | 'warning', message: string }

  const grants = [
    {
      id: 'cold-storage',
      state: "Madhya Pradesh",
      title: "Cold Storage Infrastructure Subsidy",
      amount: "Up to ₹50 Lakhs",
      icon: Warehouse,
      status: "Accepting Applications",
      description: "Financial assistance for FPOs and individual farmers to build solar-powered cold storage units to prevent post-harvest loss of horticultural produce.",
      deadline: "August 15, 2026",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100"
    },
    {
      id: 'agro-processing',
      state: "Haryana",
      title: "Agro-Processing Setup Grant",
      amount: "40% Project Cost",
      icon: Factory,
      status: "Closing Soon",
      description: "Support for establishing primary processing units (sorting, grading, packing) near farm gates to increase value addition.",
      deadline: "June 30, 2026",
      badgeColor: "bg-rose-50 text-rose-600 border-rose-100"
    }
  ];

  const handleOpenModal = (grant) => {
    setActiveModalGrant(grant);
    setEligibilityResult(null);
    // Reset answers
    if (grant.id === 'cold-storage') {
      setColdStorageAnswers({ farmerType: '', capacity: '' });
    } else {
      setAgroProcessingAnswers({ nearFarmGate: null, sorting: false, grading: false, packing: false });
    }
  };

  const handleCloseModal = () => {
    setActiveModalGrant(null);
    setEligibilityResult(null);
  };

  const calculateColdStorageEligibility = async (e) => {
    e.preventDefault();
    const { farmerType, capacity } = coldStorageAnswers;

    if (!farmerType) {
      setEligibilityResult({
        status: 'warning',
        message: 'Please select whether you are an Individual Farmer or an FPO.'
      });
      return;
    }

    const capVal = parseFloat(capacity);
    if (!capacity || isNaN(capVal) || capVal <= 0) {
      setEligibilityResult({
        status: 'warning',
        message: 'Please enter a valid capacity in Metric Tons.'
      });
      return;
    }

    setCalculating(true);
    setEligibilityResult(null);

    const prompt = `Evaluate eligibility for Madhya Pradesh Cold Storage Infrastructure Subsidy:
    - Entity Type: ${farmerType}
    - Storage Capacity Requested: ${capacity} Metric Tons (MT)

    Rule Guidance:
    - Madhya Pradesh state solar storage grants support units between 5 to 500 MT capacity.
    - Individual farmers typically qualify for 35% capital subsidy capped at 25 MT capacity. FPOs qualify for a 50% capital subsidy up to ₹50 Lakhs for capacity up to 500 MT.
    
    Determine if they qualify (success status) or need to modify their proposal (warning status).
    Return ONLY a single valid JSON object with keys "status" (either "success" or "warning") and "message" (a brief, professional assessment explaining their subsidy percentage and next steps). Do not include markdown tags.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert government welfare advisor validating cold storage infrastructure subsidies. Return clean JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const result = JSON.parse(cleanJson);
      setEligibilityResult(result);
    } catch (err) {
      console.error(err);
      setEligibilityResult({
        status: farmerType === 'individual' && capVal > 25 ? 'warning' : 'success',
        message: farmerType === 'individual' && capVal > 25 
          ? 'Subsidy limit for Individual Farmers is capped at 25 Metric Tons (MT). Please reduce capacity or register as FPO.'
          : 'You are eligible! Proceed to upload documents.'
      });
    } finally {
      setCalculating(false);
    }
  };

  const calculateAgroProcessingEligibility = async (e) => {
    e.preventDefault();
    const { nearFarmGate, sorting, grading, packing } = agroProcessingAnswers;

    if (nearFarmGate === null) {
      setEligibilityResult({
        status: 'warning',
        message: 'Please specify if your processing facility is located within 15km of a registered farm gate.'
      });
      return;
    }

    if (!sorting && !grading && !packing) {
      setEligibilityResult({
        status: 'warning',
        message: 'Please select at least one primary processing type (Sorting, Grading, or Packing).'
      });
      return;
    }

    setCalculating(true);
    setEligibilityResult(null);

    const activities = [];
    if (sorting) activities.push("Sorting");
    if (grading) activities.push("Grading");
    if (packing) activities.push("Packing");

    const prompt = `Evaluate eligibility for Haryana Agro-Processing Setup Grant:
    - Located near farm gate (within 15km): ${nearFarmGate ? "Yes" : "No"}
    - Activities selected: ${activities.join(", ")}

    Rule Guidance:
    - Facility must be located near registered farm gates (within 15km) to qualify. If not, they are ineligible.
    - Implementing all 3 (Sorting, Grading, Packing) qualifies for the maximum 40% state matching grant. Fewer activities still qualify but may get lower priority.

    Determine if they qualify (success status) or are ineligible (warning status).
    Return ONLY a single valid JSON object with keys "status" (either "success" or "warning") and "message" (a brief, helpful assessment). Do not include markdown tags.`;

    try {
      const response = await generateContent(prompt, {
        system_instruction: "You are an expert government welfare advisor validating agro-processing matching grants. Return clean JSON.",
        temperature: 0.2
      });

      let cleanJson = response.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const result = JSON.parse(cleanJson);
      setEligibilityResult(result);
    } catch (err) {
      console.error(err);
      setEligibilityResult({
        status: nearFarmGate ? 'success' : 'warning',
        message: nearFarmGate 
          ? 'You are eligible! Establishing your primary processing unit qualifies for the 40% matching grant.'
          : 'Ineligible: Facility must be located near farm gates (within 15km) to qualify.'
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn antialiased">
      {/* Page Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2.5 bg-brand-dark/10 rounded-xl">
          <Landmark className="h-6 w-6 text-[#31572c]" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950">State Infrastructure Grants</h1>
          <p className="text-sm text-gray-500">Capital subsidies for post-harvest management and processing</p>
        </div>
      </div>

      {/* Top Profile Region Alert Banner */}
      <div className="bg-brand-dark/5 border border-[#31572c]/15 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#274422]">
        <div className="flex items-center gap-2.5">
          <MapPin className="h-5 w-5 text-[#31572c] shrink-0" />
          <div>
            <span className="font-bold">Active Profile:</span> Suresh Kumar (Farmer from Madhya Pradesh)
            <p className="text-[11px] text-[#31572c]/75 mt-0.5">Showing grants available for your profile regions. To explore other states, update your profile location.</p>
          </div>
        </div>
        <span className="shrink-0 bg-brand-dark text-white px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider">MP & HR Match</span>
      </div>

      {/* Grants Cards List */}
      <div className="space-y-6">
        {grants.map(grant => {
          const IconComponent = grant.icon;
          return (
            <div key={grant.id} className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col md:flex-row">
              
              {/* Left Column: State name, logo icon, and large bold grant tier */}
              <div className="bg-gray-50/70 p-6 md:p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200/80 flex flex-col justify-center items-center text-center">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-4">
                  <IconComponent className="h-8 w-8 text-[#31572c]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{grant.state}</span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 font-sans tracking-tight">{grant.amount}</h2>
              </div>
              
              {/* Right Column: Descriptions, status badges, deadlines, and action buttons */}
              <div className="p-6 md:p-8 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">{grant.title}</h3>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase border shrink-0 ${grant.badgeColor}`}>
                      {grant.status}
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6">
                    {grant.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-50 shrink-0" />
                    Apply Deadline: <span className="font-bold text-gray-900">{grant.deadline}</span>
                  </div>
                  <button 
                    onClick={() => handleOpenModal(grant)}
                    className="w-full sm:w-auto bg-brand-dark text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-[#1a3018] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    Check Eligibility <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>

      {/* Dynamic Questionnaire Modals */}
      {activeModalGrant && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gray-100 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">{activeModalGrant.state} Grant</span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{activeModalGrant.title}</h3>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cold Storage Questionnaire Form */}
            {activeModalGrant.id === 'cold-storage' && (
              <form onSubmit={calculateColdStorageEligibility} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1">
                    1. Applicant Entity Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setColdStorageAnswers(prev => ({ ...prev, farmerType: 'individual' }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        coldStorageAnswers.farmerType === 'individual'
                          ? 'border-[#31572c] bg-brand-dark/5 text-[#31572c] font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="block text-xs uppercase font-extrabold tracking-wider text-gray-400">Option A</span>
                      <span className="text-sm">Individual Farmer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setColdStorageAnswers(prev => ({ ...prev, farmerType: 'fpo' }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        coldStorageAnswers.farmerType === 'fpo'
                          ? 'border-[#31572c] bg-brand-dark/5 text-[#31572c] font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="block text-xs uppercase font-extrabold tracking-wider text-gray-400">Option B</span>
                      <span className="text-sm">Registered FPO</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="capacity-input" className="text-xs sm:text-sm font-bold text-gray-800 block">
                    2. Intended Capacity of the Storage Unit (in Metric Tons)
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <input
                      type="number"
                      id="capacity-input"
                      value={coldStorageAnswers.capacity}
                      onChange={(e) => setColdStorageAnswers(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#31572c]/20 focus:border-[#31572c] text-sm text-gray-900"
                      placeholder="e.g. 15"
                      min="1"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-bold text-gray-400 uppercase">
                      MT
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-1.5 leading-relaxed">
                    <Info className="h-3 w-3 shrink-0" /> Note: Madhya Pradesh state solar storage grants support units between 5 to 500 MT capacity.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                      </>
                    ) : (
                      "Calculate Eligibility"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Agro-Processing Questionnaire Form */}
            {activeModalGrant.id === 'agro-processing' && (
              <form onSubmit={calculateAgroProcessingEligibility} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1">
                    1. Is the facility located within 15km of a registered farm gate?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAgroProcessingAnswers(prev => ({ ...prev, nearFarmGate: true }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        agroProcessingAnswers.nearFarmGate === true
                          ? 'border-[#31572c] bg-brand-dark/5 text-[#31572c] font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgroProcessingAnswers(prev => ({ ...prev, nearFarmGate: false }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        agroProcessingAnswers.nearFarmGate === false
                          ? 'border-rose-500 bg-rose-50/20 text-rose-600 font-bold'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-gray-800 block">
                    2. Select Primary Processing Types (Select all that apply)
                  </label>
                  <div className="space-y-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                    <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-xs sm:text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={agroProcessingAnswers.sorting}
                        onChange={(e) => setAgroProcessingAnswers(prev => ({ ...prev, sorting: e.target.checked }))}
                        className="rounded border-gray-300 text-[#31572c] focus:ring-[#31572c]/20 h-4 w-4"
                      />
                      <span>Sorting (Removal of defects & foreign matter)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-xs sm:text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={agroProcessingAnswers.grading}
                        onChange={(e) => setAgroProcessingAnswers(prev => ({ ...prev, grading: e.target.checked }))}
                        className="rounded border-gray-300 text-[#31572c] focus:ring-[#31572c]/20 h-4 w-4"
                      />
                      <span>Grading (Size, weight, or color sorting)</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors text-xs sm:text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={agroProcessingAnswers.packing}
                        onChange={(e) => setAgroProcessingAnswers(prev => ({ ...prev, packing: e.target.checked }))}
                        className="rounded border-gray-300 text-[#31572c] focus:ring-[#31572c]/20 h-4 w-4"
                      />
                      <span>Packing (Pre-cooling & standardized boxing)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full bg-brand-dark hover:bg-[#1a3018] text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {calculating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Evaluating...
                      </>
                    ) : (
                      "Calculate Eligibility"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Calculations Result Block */}
            {eligibilityResult && (
              <div className={`mt-6 p-4 rounded-2xl border flex items-start gap-3 animate-fadeIn ${
                eligibilityResult.status === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                {eligibilityResult.status === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5 fill-emerald-100" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                    {eligibilityResult.status === 'success' ? 'Eligible' : 'Requirement Warning'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed font-medium">
                    {eligibilityResult.message}
                  </p>
                  
                  {eligibilityResult.status === 'success' && (
                    <button
                      onClick={() => {
                        handleCloseModal();
                        window.location.href = '/module/gov-schemes/applications';
                      }}
                      className="mt-3.5 inline-flex items-center gap-1 bg-brand-dark text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#1a3018]"
                    >
                      Proceed to Document Upload <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
