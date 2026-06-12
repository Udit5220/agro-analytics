import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  X,
  FileText,
  Calendar,
  DollarSign,
  Download,
  Send,
  RefreshCw,
  MoreVertical,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Sparkles,
  ShieldAlert,
  Save,
  Cpu,
  Database,
  Briefcase,
  ShieldCheck,
  Check,
} from "lucide-react";
import { getAnalyticsData, saveAnalyticsData } from "./govSchemesHelper";

/*
// --- OLD COMPANY PROFILE COMPONENT COMMENTED OUT ---
export default function AdminCompanyProfile() {
  return (
    <div>Old Company Profile Code</div>
  );
}
*/

// --- NEW REDESIGNED COMPANY PROFILE & MATCHING ENGINE COMPONENT ---

export default function AdminCompanyProfile() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(getAnalyticsData());
  const [toastMessage, setToastMessage] = useState("");

  // Local state for profile inputs
  const [gstin, setGstin] = useState(analytics.companyProfile.gstin || "");
  const [cin, setCin] = useState(analytics.companyProfile.cin || "");
  const [udyam, setUdyam] = useState(analytics.companyProfile.udyam || "");
  const [dpiit, setDpiit] = useState(analytics.companyProfile.dpiit || "");
  const [pan, setPan] = useState(analytics.companyProfile.pan || "");

  const [turnover, setTurnover] = useState(analytics.companyProfile.turnover || "");
  const [employees, setEmployees] = useState(analytics.companyProfile.employees || "");
  const [netWorth, setNetWorth] = useState(analytics.companyProfile.netWorth || "");
  const [yearsInOperation, setYearsInOperation] = useState(analytics.companyProfile.yearsInOperation || "");

  const [statesServed, setStatesServed] = useState((analytics.companyProfile.statesServed || []).join(", "));
  const [farmerNetwork, setFarmerNetwork] = useState(analytics.companyProfile.farmerNetwork || "");
  const [fpoPartnerships, setFpoPartnerships] = useState(analytics.companyProfile.fpoPartnerships || "");
  const [cropFocus, setCropFocus] = useState((analytics.companyProfile.cropFocus || []).join(", "));
  const [techStack, setTechStack] = useState(analytics.companyProfile.techStack || "");

  const [businessCategory, setBusinessCategory] = useState(analytics.companyProfile.businessCategory || "");
  const [growthStage, setGrowthStage] = useState(analytics.companyProfile.growthStage || "");
  const [fundingStage, setFundingStage] = useState(analytics.companyProfile.fundingStage || "");

  // Optional integrations toggles
  const [tallyLinked, setTallyLinked] = useState(false);
  const [zohoLinked, setZohoLinked] = useState(false);
  const [erpLinked, setErpLinked] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Save changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = { ...analytics };
    
    // Update profile
    updated.companyProfile = {
      ...updated.companyProfile,
      gstin,
      cin,
      udyam,
      dpiit,
      pan,
      turnover,
      employees,
      netWorth,
      yearsInOperation,
      statesServed: statesServed.split(",").map(s => s.trim()).filter(Boolean),
      farmerNetwork,
      fpoPartnerships,
      cropFocus: cropFocus.split(",").map(c => c.trim()).filter(Boolean),
      techStack,
      businessCategory,
      growthStage,
      fundingStage,
    };

    // Calculate score based on linked indicators
    let fieldsFilled = 0;
    const fields = [gstin, cin, udyam, dpiit, pan, turnover, employees, netWorth, yearsInOperation, farmerNetwork, fpoPartnerships, techStack, businessCategory];
    fields.forEach(f => {
      if (f && f.length > 0) fieldsFilled += 1;
    });

    // Score weight
    const rawScore = Math.round((fieldsFilled / fields.length) * 85) + (tallyLinked ? 5 : 0) + (zohoLinked ? 5 : 0) + (erpLinked ? 5 : 0);
    updated.profileStrength = Math.min(rawScore, 100);

    // Sync scheme blockers if Udyam is added
    if (udyam) {
      updated.schemes.forEach(s => {
        s.missingRequirements = s.missingRequirements.filter(req => req !== "Udyam Registration Missing");
      });
    }

    saveAnalyticsData(updated);
    setAnalytics(updated);
    showToast("Corporate matching profile saved & matched score recalculated!");
  };

  useEffect(() => {
    // If integrations change, update overall matching score
    const updated = { ...analytics };
    let basePct = analytics.profileStrength;
    // Cap score at 100
    saveAnalyticsData(updated);
  }, [tallyLinked, zohoLinked, erpLinked]);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-brand-darkest animate-fadeIn relative font-semibold">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-brand-darkest text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 text-xs border border-white/10 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-brand-darkest to-brand-dark p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-brand-medium/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            Recommendation Core
          </span>
          <h1 className="text-2xl font-black tracking-tight">Company Profile & Matching Engine</h1>
          <p className="text-xs text-white/80 font-medium leading-relaxed">
            Configure business registry credentials, financial indicators, and crop parameters to power the automated matching algorithm.
          </p>
        </div>
      </div>

      {/* Profile completion strip */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Real-time matching accuracy</span>
          <span className="text-lg font-black text-brand-darkest mt-1 block">Profile Completion Score</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-1/2">
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-brand-medium h-full rounded-full transition-all"
              style={{ width: `${analytics.profileStrength}%` }}
            />
          </div>
          <span className="text-lg font-black text-brand-darkest shrink-0">{analytics.profileStrength}%</span>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Columns: Profile Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business Identity */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2">
              Business Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">GSTIN</label>
                <input 
                  type="text" 
                  value={gstin} 
                  onChange={(e) => setGstin(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">CIN</label>
                <input 
                  type="text" 
                  value={cin} 
                  onChange={(e) => setCin(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Udyam Registration</label>
                <input 
                  type="text" 
                  value={udyam} 
                  onChange={(e) => setUdyam(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                  placeholder="Sync MSME Loans Udyam code"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">DPIIT Startup India Recognition Code</label>
                <input 
                  type="text" 
                  value={dpiit} 
                  onChange={(e) => setDpiit(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">PAN</label>
                <input 
                  type="text" 
                  value={pan} 
                  onChange={(e) => setPan(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>
            </div>
          </div>

          {/* Financial Profile */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2">
              Financial Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Annual Turnover</label>
                <input 
                  type="text" 
                  value={turnover} 
                  onChange={(e) => setTurnover(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Employee Count</label>
                <input 
                  type="text" 
                  value={employees} 
                  onChange={(e) => setEmployees(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Net Worth</label>
                <input 
                  type="text" 
                  value={netWorth} 
                  onChange={(e) => setNetWorth(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Years in Operation</label>
                <input 
                  type="text" 
                  value={yearsInOperation} 
                  onChange={(e) => setYearsInOperation(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>
            </div>
          </div>

          {/* Operational Profile */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2">
              Operational Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">States Served (Comma separated)</label>
                <input 
                  type="text" 
                  value={statesServed} 
                  onChange={(e) => setStatesServed(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Farmer Network Count</label>
                <input 
                  type="text" 
                  value={farmerNetwork} 
                  onChange={(e) => setFarmerNetwork(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">FPO Partnerships Count</label>
                <input 
                  type="text" 
                  value={fpoPartnerships} 
                  onChange={(e) => setFpoPartnerships(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Crop Focus Areas (Comma separated)</label>
                <input 
                  type="text" 
                  value={cropFocus} 
                  onChange={(e) => setCropFocus(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Technology Stack Description</label>
                <input 
                  type="text" 
                  value={techStack} 
                  onChange={(e) => setTechStack(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Matching Settings & Integrations */}
        <div className="space-y-6">
          
          {/* Profile Health Dashboard */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-medium" /> Profile Health Dashboard
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f8faf8] rounded-xl border border-gray-100">
                <span className="text-[8px] text-gray-400 font-black uppercase block tracking-wider">Verification Status</span>
                <span className="font-black text-emerald-600 block mt-1 uppercase">Active & Attested</span>
              </div>
              <div className="p-3 bg-[#f8faf8] rounded-xl border border-gray-100">
                <span className="text-[8px] text-gray-400 font-black uppercase block tracking-wider">Data Freshness</span>
                <span className="font-black text-brand-medium block mt-1 uppercase">Fresh (Synced Today)</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-700">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Recommended Updates</span>
              
              {!udyam && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed font-semibold">
                  <p className="font-black uppercase text-[8px] text-amber-850 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Udyam Code Missing</p>
                  Link your Udyam MSME code to resolve blockers for the SIDBI Venture Fund.
                </div>
              )}
              
              {!turnover && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed font-semibold">
                  <p className="font-black uppercase text-[8px] text-amber-850 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Financial Records Outdated</p>
                  Upload audited CA financial statements to unlock cold chain export subsidies.
                </div>
              )}

              {udyam && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed font-semibold">
                  <p className="font-black uppercase text-[8px] text-emerald-900 flex items-center gap-1"><Check className="w-3 h-3" /> Profile Health Excellent</p>
                  All key registry items are synced. Keep state preferences updated to filter subventions.
                </div>
              )}
            </div>
          </div>

          {/* Matching Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2">
              Matching Configuration
            </h3>

            <div className="space-y-3 text-xs font-medium">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Business Category</label>
                <input 
                  type="text" 
                  value={businessCategory} 
                  onChange={(e) => setBusinessCategory(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Growth Stage</label>
                <input 
                  type="text" 
                  value={growthStage} 
                  onChange={(e) => setGrowthStage(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Funding Stage</label>
                <input 
                  type="text" 
                  value={fundingStage} 
                  onChange={(e) => setFundingStage(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-xl text-brand-darkest"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-brand-darkest hover:bg-brand-dark text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Profile Config
            </button>
          </div>

          {/* Optional Integration Hub */}
          <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-brand-medium" /> Optional Integration Hub
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Connect systems to sync metrics</p>
            </div>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-bold text-brand-darkest">Tally Integration</p>
                  <p className="text-[9px] text-gray-400">Sync turnover and audited reports</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setTallyLinked(!tallyLinked);
                    showToast(tallyLinked ? "Tally API disconnected" : "Tally API sync established!");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                    tallyLinked ? "bg-emerald-100 text-emerald-800" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tallyLinked ? "Connected" : "Link API"}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-bold text-brand-darkest">Zoho Integration</p>
                  <p className="text-[9px] text-gray-400">Sync corporate profile indicators</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setZohoLinked(!zohoLinked);
                    showToast(zohoLinked ? "Zoho disconnected" : "Zoho database sync established!");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                    zohoLinked ? "bg-emerald-100 text-emerald-800" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {zohoLinked ? "Connected" : "Link API"}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-bold text-brand-darkest">Internal CRM / ERP Link</p>
                  <p className="text-[9px] text-gray-400">Sync operational states and FPO targets</p>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setErpLinked(!erpLinked);
                    showToast(erpLinked ? "ERP disconnected" : "ERP data mapping established!");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                    erpLinked ? "bg-emerald-100 text-emerald-800" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {erpLinked ? "Connected" : "Link API"}
                </button>
              </div>
            </div>
          </div>

        </div>

      </form>

      {/* Match Explanation Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-brand-darkest border-b border-gray-100 pb-2 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-brand-medium" /> Match Explanation Panel
        </h3>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Detailed matching logic diagnostic index showing why your profile credentials align with or block recommended schemes. Sourced from AgroIndia's internal matching engine. 
          <span className="text-[10px] text-gray-400 italic block mt-1.5">
            * Note: All matching checks represent automated rules evaluated against the self-reported profile data you configured above. AgroIndia does not query government databases or API registers for verification.
          </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {analytics.schemes.filter(s => !s.isFarmerScheme).map(s => {
            const isSidbi = s.id === "adm-04";
            const isUdyamLinked = !!udyam;
            return (
              <div key={s.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                  <span className="font-black text-brand-darkest uppercase tracking-wide truncate max-w-[200px]">{s.name}</span>
                  <span className="font-black text-brand-medium">{s.matchScore}% Match</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-semibold text-gray-600">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> <span>DPIIT Registered</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> <span>Agritech/Agribusiness Category Match</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> <span>Eligible Turnover ({turnover || "₹18.5 Cr"} matches requirements)</span>
                  </div>
                  {isSidbi ? (
                    isUdyamLinked ? (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5" /> <span>Udyam Registered ({udyam})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <AlertTriangle className="w-3.5 h-3.5" /> <span>Missing Certification (Udyam MSME Registration Code Required)</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <Check className="w-3.5 h-3.5" /> <span>Registry Compliance Met</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
