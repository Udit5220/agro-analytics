import React, { useState } from "react";
import {
  Users,
  Send,
  MessageSquare,
  Smartphone,
  CheckCircle,
  TrendingUp,
  MapPin,
  Filter,
  Search,
  ChevronRight,
  Info,
  Calendar,
  Eye,
} from "lucide-react";

export default function AdminUserGuidance() {
  const [selectedSegment, setSelectedSegment] = useState("haryana-wheat");
  const [broadcastChannel, setBroadcastChannel] = useState("whatsapp");
  const [messageTemplate, setMessageTemplate] = useState(
    "Dear {farmer_name}, you qualify for the PM Fasal Bima Yojana crop cover subsidy. Apply before June 22 via your nearest FPO center. Ref: AgroIndia Support Team."
  );
  const [campaignSent, setCampaignSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Target Farmers & FPOs Database
  const [farmers, setFarmers] = useState([
    { id: "FMR-209", name: "Baldev Singh", location: "Karnal, Haryana", crop: "Wheat", eligibleScheme: "PM Fasal Bima Yojana", status: "Notified (WhatsApp)" },
    { id: "FMR-210", name: "Satnam Singh", location: "Ambala, Haryana", crop: "Wheat", eligibleScheme: "PM Fasal Bima Yojana", status: "Notified (WhatsApp)" },
    { id: "FMR-304", name: "Gurpreet Singh", location: "Patiala, Punjab", crop: "Paddy", eligibleScheme: "PM-KISAN Payout", status: "Unnotified" },
    { id: "FMR-102", name: "Ramesh Patil", location: "Nashik, Maharashtra", crop: "Mustard", eligibleScheme: "State Micro-irrigation Subsidy", status: "Notified (SMS)" },
    { id: "FMR-221", name: "Rajinder Prasad", location: "Rohtak, Haryana", crop: "Wheat", eligibleScheme: "PM Fasal Bima Yojana", status: "Unnotified" }
  ]);

  const handleBroadcast = (e) => {
    e.preventDefault();
    setCampaignSent(true);

    // Update unnotified farmers in the selected segment to "Notified"
    setFarmers(prev => prev.map(f => {
      if (selectedSegment === "haryana-wheat" && f.location.includes("Haryana") && f.crop === "Wheat") {
        return { ...f, status: `Notified (${broadcastChannel === "whatsapp" ? "WhatsApp" : "SMS"})` };
      }
      if (selectedSegment === "punjab-paddy" && f.location.includes("Punjab") && f.crop === "Paddy") {
        return { ...f, status: `Notified (${broadcastChannel === "whatsapp" ? "WhatsApp" : "SMS"})` };
      }
      return f;
    }));

    setTimeout(() => {
      setCampaignSent(false);
    }, 2500);
  };

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.eligibleScheme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 text-[#2e4057] animate-fadeIn">
      {/* Header section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-[#28a745]" />
            User Scheme Guidance & Broadcasts
          </h1>
          <p className="text-xs text-gray-500 font-semibold">
            Track eligibility matches for cooperative farmers and execute SMS/WhatsApp outreach notification campaigns.
          </p>
        </div>
      </div>

      {/* Outreach Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Outreach Coverage</span>
          <span className="text-xl font-black text-[#2e4057] block mt-1">1,240 Target Users</span>
          <span className="text-[10px] text-[#28a745] font-bold">94% active database match</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Notification Open Rate</span>
          <span className="text-xl font-black text-[#2e4057] block mt-1">84.5% Read</span>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#28a745] h-full" style={{ width: "84%" }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Farmer Registrations</span>
          <span className="text-xl font-black text-[#2e4057] block mt-1">42% Converted</span>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#2ec4b6] h-full" style={{ width: "42%" }}></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Outreach Active Channels</span>
          <span className="text-xl font-black text-[#2e4057] block mt-1">WhatsApp / SMS</span>
          <span className="text-[10px] text-gray-500 font-semibold">Active gateway server online</span>
        </div>
      </div>

      {/* Side-by-side composer and geographic map widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: Broadcast composer */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] flex items-center gap-1 mb-4">
              <Send className="w-4 h-4 text-[#28a745]" /> Segment Push Composer
            </h3>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Target Farmer Segment</label>
                <select
                  value={selectedSegment}
                  onChange={(e) => {
                    setSelectedSegment(e.target.value);
                    if (e.target.value === "haryana-wheat") {
                      setMessageTemplate("Dear {farmer_name}, you qualify for the PM Fasal Bima Yojana crop cover subsidy. Apply before June 22 via your nearest FPO center.");
                    } else if (e.target.value === "punjab-paddy") {
                      setMessageTemplate("Sat Sri Akal {farmer_name}, register your paddy crop under state direct seeding subvention. Direct ₹4,000 subsidy. Limit July 5.");
                    }
                  }}
                  className="w-full bg-gray-50 border border-gray-200 text-xs p-2.5 rounded-xl text-[#2e4057] font-semibold focus:outline-none"
                >
                  <option value="haryana-wheat">Wheat Farmers in Haryana (3 Active)</option>
                  <option value="punjab-paddy">Paddy Farmers in Punjab (1 Active)</option>
                  <option value="all-fpo">All Connected FPO Directors</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Broadcast Channel</label>
                <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setBroadcastChannel("whatsapp")}
                    className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${
                      broadcastChannel === "whatsapp" ? "bg-white text-emerald-800 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    WhatsApp Business
                  </button>
                  <button
                    type="button"
                    onClick={() => setBroadcastChannel("sms")}
                    className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${
                      broadcastChannel === "sms" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    SMS Gateway
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Alert Template Body</label>
                <textarea
                  rows="4"
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs p-3 rounded-xl text-gray-800 font-semibold"
                />
                <span className="block text-[8px] text-gray-400 font-semibold">Supports auto-populating tag: `{`farmer_name`}`</span>
              </div>

              <button
                type="submit"
                disabled={campaignSent}
                className="w-full bg-[#2e4057] hover:bg-[#208837] text-white py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {campaignSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#ffc857]" /> Broadcast Sent!
                  </>
                ) : (
                  <>
                    Dispatch Segment Broadcast <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* SVG Map Widget */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057] mb-4">Interactive Geographic User Coverage</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-6 justify-around py-2">
              {/* custom SVG layout showing active states */}
              <div className="w-full max-w-[280px]">
                <svg className="w-full h-auto" viewBox="0 0 200 150">
                  {/* Haryana polygon */}
                  <path
                    d="M 60 40 L 90 20 L 110 50 L 80 70 Z"
                    fill="#28a745"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.85"
                    className="hover:opacity-100 transition cursor-pointer"
                  />
                  <text x="85" y="48" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">HARYANA</text>

                  {/* Punjab polygon */}
                  <path
                    d="M 20 50 L 60 40 L 80 70 L 40 90 Z"
                    fill="#2e4057"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.85"
                    className="hover:opacity-100 transition cursor-pointer"
                  />
                  <text x="50" y="65" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">PUNJAB</text>

                  {/* Rajasthan polygon */}
                  <path
                    d="M 40 90 L 80 70 L 100 110 L 60 130 Z"
                    fill="#2ec4b6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity="0.8"
                    className="hover:opacity-100 transition cursor-pointer"
                  />
                  <text x="70" y="105" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">RAJASTHAN</text>
                </svg>
              </div>

              {/* State split legend */}
              <div className="space-y-3 flex-1 w-full">
                <span className="block text-[10px] font-extrabold uppercase text-gray-400">Scheme Concentrations By State</span>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-700">Haryana State Cooperatives</span>
                    <span className="font-black text-[#28a745]">3 Active Schemes (740 Farmers)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-700">Punjab Crop Subvention</span>
                    <span className="font-black text-[#2e4057]">1 Active Scheme (380 Farmers)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-gray-700">Rajasthan Micro-irrigation</span>
                    <span className="font-black text-[#2ec4b6]">1 Active Scheme (120 Farmers)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target List table (Full Width) */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden w-full">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
          <h3 className="font-black text-xs uppercase tracking-wider text-[#2e4057]">Cooperative Members & Eligible Schemes</h3>
          
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:outline-none focus:border-[#28a745] text-xs px-8 py-1.5 rounded-xl text-[#2e4057] font-semibold"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                <th className="p-3">Farmer ID</th>
                <th className="p-3">Farmer Name</th>
                <th className="p-3">Region & Location</th>
                <th className="p-3">Target Crop</th>
                <th className="p-3">Qualifying Scheme Match</th>
                <th className="p-3 text-right">Outreach Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {filteredFarmers.map((f, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="p-3 text-gray-400">{f.id}</td>
                  <td className="p-3 text-[#2e4057]">{f.name}</td>
                  <td className="p-3 text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#28a745]" /> {f.location}
                  </td>
                  <td className="p-3 text-gray-600">{f.crop}</td>
                  <td className="p-3 text-[#28a745] uppercase text-[10px] tracking-wide">{f.eligibleScheme}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      f.status === "Unnotified"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
