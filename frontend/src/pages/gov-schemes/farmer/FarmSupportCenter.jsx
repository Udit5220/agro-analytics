// src/pages/gov-schemes/farmer/FarmSupportCenter.jsx
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  MessageSquare,
  Search,
  CheckCircle,
  HelpCircle,
  FileText,
  AlertTriangle,
  Send,
  Building,
  Info
} from "lucide-react";

const SUPPORT_CENTERS = [
  {
    id: 1,
    name: "Common Service Centre (CSC) - Sonipat Central",
    type: "CSC",
    address: "Subzi Mandi Road, near Old Tehsil, Sonipat, Haryana 131001",
    phone: "+91 98765 43210",
    email: "csc.sonipat@haryana.gov.in",
    services: ["Aadhaar-Bank seeding", "Online scheme applications (PM Kisan, PMFBY)", "Land records printing (Jamabandi)", "Digital signature verification"],
    mapsQuery: "Common Service Centre Sonipat Haryana"
  },
  {
    id: 2,
    name: "Krishi Vigyan Kendra (KVK) - Sonipat Branch",
    type: "KVK",
    address: "Sandal Kalan, Sonipat, Haryana 131024",
    phone: "+91 130 248231",
    email: "kvk.sonipat@hau.ac.in",
    services: ["Soil health card testing & distribution", "Subsidized seeds & fertilizers camp", "Organic farming training modules", "Crop disease diagnosis"],
    mapsQuery: "Krishi Vigyan Kendra Sandal Kalan Sonipat"
  },
  {
    id: 3,
    name: "District Agriculture Office (DAO) Sonipat",
    type: "DAO",
    address: "New Grain Mandi Road, Sector 15, Sonipat, Haryana 131001",
    phone: "+91 130 222014",
    email: "ddasonipat@agriharyana.gov.in",
    services: ["Subsidy approval (PM Kusum Solar, Tractors)", "Crop loss assessment submissions", "Fertilizer dealer licensing", "State scheme disbursements oversight"],
    mapsQuery: "District Agriculture Office Sonipat Haryana"
  },
  {
    id: 4,
    name: "Sonipat Farmers Producer Organisation (FPO) Head Office",
    type: "FPO",
    address: "GT Road, Murthal, Sonipat, Haryana 131027",
    phone: "+91 99912 88832",
    email: "support@sonipatfpo.org",
    services: ["Bulk input purchasing discounts", "Collective market linkages (e-NAM sales)", "KCC bank group linkage", "Post-harvest cold storage access"],
    mapsQuery: "Murthal Sonipat Haryana"
  }
];

const COMMON_RESOLUTIONS = [
  {
    issue: "Aadhaar-Bank Seeding Pending / Rejected",
    resolution: "Download the 'Aadhaar Seeding Consent Form' from PM-Kisan portal, fill in your Bank Account & Aadhaar numbers, sign it, and submit it physically to your bank branch Manager. The bank must seed it via NPci mapper. It takes 7-10 working days to update."
  },
  {
    issue: "Land Record (Jamabandi) Mismatch",
    resolution: "If your name or plot dimensions in the scheme portal differ from local records, visit the local Patwari at your Block Office. Obtain a certified Jamabandi Copy and upload it using the CSC portal's 'Correction Section'."
  },
  {
    issue: "DBT Payment Credited to Wrong Account",
    resolution: "DBT transfers are sent to the bank account linked last with your Aadhaar. Check your active bank status by dialing *99*99# from your Aadhaar-registered mobile number to verify which account is currently linked."
  }
];

const FarmSupportCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  
  // Grievance form state
  const [formData, setFormData] = useState({
    name: "Suresh Kumar", // default profile name
    phone: "+91 98765 48210",
    scheme: "PM Kisan Samman Nidhi",
    description: "",
    issueType: "Aadhaar Seeding"
  });
  const [ticketId, setTicketId] = useState(null);

  const filterTypes = ["All", "CSC", "KVK", "DAO", "FPO"];

  const filteredCenters = SUPPORT_CENTERS.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "All" || center.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    // Generate a random mock ticket ID
    const randomId = "SR-" + new Date().getFullYear() + "-" + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomId);
  };

  const handleResetForm = () => {
    setFormData({
      name: "Suresh Kumar",
      phone: "+91 98765 48210",
      scheme: "PM Kisan Samman Nidhi",
      description: "",
      issueType: "Aadhaar Seeding"
    });
    setTicketId(null);
  };

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f0]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A3A2A] text-[#C5F547] rounded-xl">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F2E1F]">Local Support & Help Desks</h1>
            <p className="text-xs text-[#2d5a3d] font-medium">
              Locate official Common Service Centers (CSC), Krishi Vigyan Kendras, and submit grievances.
            </p>
          </div>
        </div>

        {/* Source citation */}
        <div className="bg-[#1A3A2A]/5 border border-[#2d5a3d]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-xs">
          <Info className="h-4.5 w-4.5 text-[#2d5a3d] shrink-0" />
          <span className="text-[10px] text-[#2d5a3d] font-semibold">
            Directory mapped for District Sonipat, Haryana. All data is publicly derived.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Directory Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-4">
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Local Support Directory</h2>
              
              {/* Type Filter */}
              <div className="flex flex-wrap gap-1 bg-gray-150 p-1 rounded-lg">
                {filterTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                      selectedType === type
                        ? "bg-[#1A3A2A] text-white shadow-xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search centers by service or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold text-gray-700 bg-gray-55 border border-gray-200 rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d]"
              />
            </div>

            {/* Directory Cards */}
            <div className="space-y-4">
              {filteredCenters.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xs font-semibold">No support centers match your query.</p>
                </div>
              ) : (
                filteredCenters.map((center) => (
                  <div
                    key={center.id}
                    className="border border-gray-150 rounded-xl p-4 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#E8F5C0] text-[#0F2E1F] text-[9px] font-bold rounded border border-brand-accent/50 uppercase">
                          {center.type}
                        </span>
                        <h3 className="text-xs font-bold text-gray-900 leading-snug">{center.name}</h3>
                      </div>
                      
                      {/* External Map Query Link */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#2d5a3d] hover:text-[#0F2E1F] font-bold flex items-center gap-1 shrink-0 border border-[#2d5a3d]/25 hover:bg-[#2d5a3d]/5 px-2.5 py-1 rounded"
                      >
                        <MapPin className="h-3 w-3 text-[#2d5a3d]" />
                        <span>Locate on Maps</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>

                    <p className="text-[11px] text-gray-500 font-semibold mb-3 flex items-start gap-1">
                      <span className="shrink-0 mt-0.5">📍</span>
                      <span>{center.address}</span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 text-[10.5px]">
                      <div className="flex items-center gap-1.5 font-medium text-gray-600">
                        <Phone className="h-3.5 w-3.5 text-[#2d5a3d]" />
                        <span>{center.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-gray-600 truncate">
                        <Mail className="h-3.5 w-3.5 text-[#2d5a3d]" />
                        <span className="truncate">{center.email}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">Assisted Services Offered:</span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-600 font-semibold list-disc list-inside">
                        {center.services.map((service, idx) => (
                          <li key={idx} className="truncate" title={service}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Self-Help Resolution Guides */}
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <HelpCircle className="h-4.5 w-4.5 text-[#2d5a3d]" />
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Common Issues & Resolutions</h2>
            </div>
            
            <div className="space-y-4">
              {COMMON_RESOLUTIONS.map((res, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <h3 className="text-xs font-bold text-gray-900 flex items-start gap-1.5 mb-1.5">
                    <span className="text-red-500 font-bold">Q.</span>
                    <span>{res.issue}</span>
                  </h3>
                  <div className="text-[11px] text-gray-600 leading-relaxed font-semibold bg-gray-50/70 p-3 rounded-lg border border-gray-100/60">
                    <p className="flex items-start gap-1.5">
                      <span className="text-[#2d5a3d] font-bold">Ans.</span>
                      <span>{res.resolution}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Local Grievance Submission Mockup */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-150 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
              <MessageSquare className="h-4.5 w-4.5 text-[#2d5a3d]" />
              <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Scheme Grievance Redressal</h2>
            </div>

            {ticketId ? (
              <div className="py-6 text-center space-y-4 bg-green-50/20 border border-dashed border-green-200 rounded-xl p-4">
                <CheckCircle className="h-12 w-12 text-[#2d5a3d] mx-auto animate-bounce" />
                <div>
                  <h3 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Grievance Ticket Lodged</h3>
                  <p className="text-[11px] text-[#2d5a3d] font-bold mt-1 bg-[#E8F5C0] inline-block px-3 py-1 rounded">
                    Ticket ID: {ticketId}
                  </p>
                </div>
                
                <p className="text-[10px] text-gray-600 leading-normal font-semibold">
                  This mock ticket has been simulated inside the system. To file a formal grievance under Indian Ministry guidelines, visit the official central pgportal.gov.in directory.
                </p>

                <div className="pt-2 flex gap-2">
                  <a
                    href="https://pgportal.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-[#1A3A2A] text-white hover:bg-[#0F2E1F] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <span>Official PGPortal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  
                  <button
                    onClick={handleResetForm}
                    className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 text-gray-650 rounded-lg text-[10px] font-bold transition"
                  >
                    Create New Ticket
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Filing Farmer</label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Grievance Scheme</label>
                  <select
                    value={formData.scheme}
                    onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                    className="w-full text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d]"
                  >
                    <option value="PM Kisan Samman Nidhi">PM Kisan Samman Nidhi</option>
                    <option value="PMFBY Crop Insurance">PMFBY Crop Insurance</option>
                    <option value="PM Kusum Solar Pump">PM Kusum Solar Pump</option>
                    <option value="Haryana SC Farmer Scheme">Haryana SC Farmer Scheme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Discrepancy Category</label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                    className="w-full text-xs font-semibold text-gray-700 bg-gray-55 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d]"
                  >
                    <option value="Aadhaar Seeding">Aadhaar Seeding / DBT Rejects</option>
                    <option value="Land Record Corrections">Land Record corrections</option>
                    <option value="Crop Loss Inspection">Crop Loss Inspection Delay</option>
                    <option value="Incorrect Benefit Amount">Incorrect Benefit Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Discrepancy Details</label>
                  <textarea
                    rows="3.5"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter detailed description of bank status, dates of filing, block names..."
                    required
                    className="w-full text-xs font-semibold text-gray-750 bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d] focus:border-[#2d5a3d] placeholder-gray-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1A3A2A] hover:bg-[#0F2E1F] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>

          {/* Official Escalation Notice */}
          <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-850">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-700" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider">How to Escalate Issues</span>
            </div>
            
            <p className="text-[10px] text-amber-800 leading-relaxed font-semibold">
              If your scheme installation remains pending at the district office for more than 30 days:
            </p>
            
            <ol className="text-[9.5px] text-amber-800 space-y-1 list-decimal list-inside font-semibold">
              <li>Check your application checklist vault for missing signatures.</li>
              <li>Call the state grievance helpline: <strong>1800 180 2117</strong> (Haryana toll-free).</li>
              <li>File an online report directly with the DAC&FW pgportal link above.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmSupportCenter;
