// src/pages/gov-schemes/farmer/FarmSchemeCalendar.jsx
import React, { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Bell,
  XCircle,
  ArrowRight,
  X,
  Filter,
  Info,
  CalendarDays,
  Sprout,
  CheckSquare
} from "lucide-react";

// Robust local mock events database (contains both upcoming and passed events for dynamic loss computation)
const LOCAL_EVENTS_DB = [
  // Passed Events (Deadline before 2026-06-12)
  {
    id: 12,
    title: "Haryana Organic Farming Subsidy Outlay",
    scheme: "Organic Farming Subsidy",
    category: "Subsidy",
    season: "Zaid",
    state: "Haryana",
    crop: "All",
    date: "2026-02-28",
    type: "deadline",
    priority: "high",
    description: "Submit crop sowing certificate and land verification to claim organic farming outlays.",
    amount: "₹15,000 subsidy",
    action: "Complete Upload"
  },
  {
    id: 13,
    title: "PM-KISAN 16th Installment Aadhaar Seeding Correction",
    scheme: "PM Kisan Samman Nidhi",
    category: "Direct Benefit",
    season: "Rabi",
    state: "Haryana",
    crop: "All",
    date: "2026-04-15",
    type: "deadline",
    priority: "urgent",
    description: "Submit Aadhaar seeding correction consent slip to bank branch for winter installment clearance.",
    amount: "₹2,000 (DBT)",
    action: "Link Account"
  },
  {
    id: 10,
    title: "Soil Health Card Distribution Camp",
    scheme: "Soil Health Card Scheme",
    category: "Service",
    season: "Zaid",
    state: "Haryana",
    crop: "All",
    date: "2026-05-15",
    type: "training",
    priority: "low",
    description: "Free soil testing camp and fertilizer recommendation chart collection.",
    location: "Sonipat District Krishi Vigyan Kendra",
    amount: "Free Soil Test",
    action: "Collect Card"
  },
  {
    id: 11,
    title: "e-NAM Digital Trade Registration Drive",
    scheme: "e-NAM National Agriculture Market",
    category: "Service",
    season: "Zaid",
    state: "Haryana",
    crop: "All",
    date: "2026-05-20",
    type: "training",
    priority: "low",
    description: "Onboarding workshop for grain lists directly on the national digital market site.",
    location: "Sonipat Grain Mandi",
    amount: "Free Onboarding",
    action: "Register Now"
  },

  // Upcoming Events (Deadline on or after 2026-06-12)
  {
    id: 1,
    title: "PMFBY Kharif Crop Insurance Enrollment",
    scheme: "PMFBY Crop Insurance",
    category: "Insurance",
    season: "Kharif",
    state: "Haryana",
    crop: "Rice",
    date: "2026-06-30",
    type: "deadline",
    priority: "urgent",
    description: "Final deadline to submit crop sowing certificate and pay subsidized premium for paddy crop insurance.",
    amount: "₹1,500 premium for ₹75,000 coverage",
    action: "Renew Policy"
  },
  {
    id: 2,
    title: "PM Kisan 17th Installment Release",
    scheme: "PM Kisan Samman Nidhi",
    category: "Direct Benefit",
    season: "Kharif",
    state: "Haryana",
    crop: "All",
    date: "2026-06-20",
    type: "installment",
    priority: "high",
    description: "Scheduled release of ₹2,000 direct benefit transfer into Aadhaar-seeded bank accounts.",
    amount: "₹2,000 (DBT)",
    action: "Check Bank Status"
  },
  {
    id: 3,
    title: "PM Kusum Solar Pump Capital Subsidy Window",
    scheme: "PM Kusum Solar Pump",
    category: "Subsidy",
    season: "Kharif",
    state: "Haryana",
    crop: "Sugarcane",
    date: "2026-06-30",
    type: "deadline",
    priority: "high",
    description: "Application window closes for 60% capital subsidy on solar water pumps up to 7.5 HP.",
    amount: "₹1,20,000 subsidy",
    action: "Complete Upload"
  },
  {
    id: 4,
    title: "Haryana State SC Farmer Tubewell Subsidy",
    scheme: "Haryana SC Farmer Scheme",
    category: "Subsidy",
    season: "Kharif",
    state: "Haryana",
    crop: "All",
    date: "2026-07-15",
    type: "deadline",
    priority: "medium",
    description: "State-specific subsidy applications for borewell and tubewell electrification for SC category farmers.",
    amount: "₹25,000 incentive",
    action: "Submit Caste Certificate"
  },
  {
    id: 5,
    title: "National Food Security Mission Seed Distribution Drive",
    scheme: "NFSM Seed Subsidy",
    category: "Subsidy",
    season: "Kharif",
    state: "Punjab",
    crop: "Rice",
    date: "2026-06-18",
    type: "training",
    priority: "medium",
    description: "Distribution of high-yielding rice seed varieties at 50% subsidized rates at local block offices.",
    amount: "50% seed discount",
    location: "Block Dev Office, Sonipat",
    action: "Locate Center"
  }
];

const FarmSchemeCalendar = () => {
  // Anchored date for calendar: June 2026 (matching Suresh Kumar's timeline)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Month index 5 = June
  const [selectedDate, setSelectedDate] = useState(null);

  // Filters State
  const [selectedState, setSelectedState] = useState("Haryana");
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All"); // All, Kharif, Rabi, Zaid

  // Checkbox state for applied schemes (ID -> Boolean)
  const [appliedEvents, setAppliedEvents] = useState({
    // PM Kisan 16th installment seeding correction is unchecked by default to show as missed
    13: false,
    10: true, // Marked as applied/completed
    11: true, // Marked as applied/completed
  });

  const statesList = ["Haryana", "Punjab", "Uttar Pradesh", "Rajasthan"];
  const cropsList = ["All", "Wheat", "Rice", "Sugarcane", "Mustard"];
  const categoriesList = ["All", "Direct Benefit", "Insurance", "Subsidy", "Credit", "Service"];
  const seasonsList = [
    { code: "All", name: "All Seasons" },
    { code: "Kharif", name: "Kharif (June - Oct)" },
    { code: "Rabi", name: "Rabi (Nov - April)" },
    { code: "Zaid", name: "Zaid (May - June)" }
  ];

  const handleApplyToggle = (eventId) => {
    setAppliedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Filter the events
  const filteredEvents = LOCAL_EVENTS_DB.filter((event) => {
    const stateMatch = !selectedState || event.state === selectedState;
    const cropMatch = selectedCrop === "All" || event.crop === "All" || event.crop === selectedCrop;
    const categoryMatch = selectedCategory === "All" || event.category === selectedCategory;
    const seasonMatch = selectedSeason === "All" || event.season === selectedSeason;
    return stateMatch && cropMatch && categoryMatch && seasonMatch;
  });

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventTypeColor = (type, priority, isApplied) => {
    if (isApplied) return "bg-green-50 text-green-700 border-green-200 opacity-80";
    if (priority === "urgent") return "bg-red-50 text-red-700 border-red-200";
    if (type === "deadline") return "bg-red-50 text-red-700 border-red-100";
    if (type === "payment" || type === "installment") return "bg-[#E8F5C0] text-[#0F2E1F] border-brand-accent/50";
    if (type === "training") return "bg-blue-50 text-blue-700 border-blue-100";
    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date(2026, 5, 12); // Mock current date: 12 June 2026

    const calendarDays = [];

    // Empty spaces for previous month's alignment
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div
          key={`empty-${i}`}
          className="h-24 bg-gray-50/20 rounded-lg border border-gray-100/30"
        ></div>
      );
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      
      // Filter events matching this date and active filters
      const dayEvents = filteredEvents.filter((e) => e.date === dateStr);
      
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      calendarDays.push(
        <div
          key={day}
          onClick={() => setSelectedDate(selectedDate === day ? null : day)}
          className={`h-24 p-2 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
            selectedDate === day
              ? "border-[#2d5a3d] bg-[#f4f7f0] shadow-sm scale-[1.01]"
              : "border-gray-100 hover:border-gray-300 bg-white"
          } ${isToday ? "ring-2 ring-[#C5F547] border-[#2d5a3d]" : ""}`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-bold ${
                isToday ? "text-[#0F2E1F] bg-[#C5F547] px-1.5 py-0.5 rounded-full" : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </div>
          
          <div className="mt-1 space-y-1 overflow-hidden flex-1 flex flex-col justify-end">
            {dayEvents.slice(0, 2).map((event, idx) => {
              const isApplied = !!appliedEvents[event.id];
              return (
                <div
                  key={idx}
                  className={`text-[8.5px] px-1 py-0.5 rounded truncate font-medium border ${getEventTypeColor(event.type, event.priority, isApplied)}`}
                  title={event.title}
                >
                  {isApplied ? "✓ " : ""}{event.scheme.split(" ")[0]}..
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-[8px] text-gray-400 font-semibold pl-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return calendarDays;
  };

  // Events on the selected day
  const selectedDateEvents = selectedDate
    ? filteredEvents.filter(
        (m) =>
          m.date ===
          `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
      )
    : [];

  // Dynamic Missed Opportunities calculation:
  // An event is considered missed if its date has passed (< 2026-06-12) and it has NOT been checked as 'applied'.
  const mockTodayDateStr = "2026-06-12";
  const missedOpportunities = filteredEvents.filter((event) => {
    const isPassed = event.date < mockTodayDateStr;
    const isApplied = !!appliedEvents[event.id];
    return isPassed && !isApplied;
  });

  // Completed/Applied past events
  const completedOpportunities = filteredEvents.filter((event) => {
    const isPassed = event.date < mockTodayDateStr;
    const isApplied = !!appliedEvents[event.id];
    return isPassed && isApplied;
  });

  // Upcoming events
  const upcomingEvents = filteredEvents.filter((event) => {
    return event.date >= mockTodayDateStr;
  });

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f0]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1A3A2A] text-[#C5F547] rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F2E1F]">Farmer Scheme Calendar</h1>
            <p className="text-xs text-[#2d5a3d] font-medium">
              Track seasonal sowing windows and deadlines. Mark applied programs to prevent missed opportunity alerts.
            </p>
          </div>
        </div>
        
        {/* Source citation badge */}
        <div className="bg-[#1A3A2A]/5 border border-[#2d5a3d]/20 rounded-xl px-3 py-1.5 flex items-center gap-2 max-w-xs">
          <Info className="h-4.5 w-4.5 text-[#2d5a3d] shrink-0" />
          <span className="text-[10px] text-[#2d5a3d] font-semibold">
            Source: myScheme.gov.in official deadlines database.
          </span>
        </div>
      </div>

      {/* Season Tabs Selector */}
      <div className="mb-6 bg-white p-1.5 rounded-xl border border-gray-200/60 shadow-sm flex flex-wrap gap-1">
        {seasonsList.map((season) => (
          <button
            key={season.code}
            onClick={() => setSelectedSeason(season.code)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${
              selectedSeason === season.code
                ? "bg-[#1A3A2A] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Sprout className={`h-3.5 w-3.5 ${selectedSeason === season.code ? "text-[#C5F547]" : "text-gray-400"}`} />
              <span>{season.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Filters Panel */}
      <div className="mb-6 bg-white rounded-xl border border-gray-150 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
          <Filter className="h-4 w-4 text-[#2d5a3d]" />
          <h2 className="text-xs font-extrabold text-[#0F2E1F] uppercase tracking-wider">Filter Scheme Events</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* State Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">State Jurisdiction</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs font-semibold text-gray-700 bg-gray-55 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d]"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>{st} Directory</option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Crop Specificity</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full text-xs font-semibold text-gray-700 bg-gray-55 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d]"
            >
              {cropsList.map((cr) => (
                <option key={cr} value={cr}>{cr === "All" ? "All Crop Schemes" : `${cr} Schemes`}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Benefit Type</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-semibold text-gray-700 bg-gray-55 border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-[#2d5a3d]"
            >
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat === "All" ? "All Benefit Categories" : cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
            {/* Calendar Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2d5a3d]"></span>
                <h2 className="text-sm font-extrabold text-[#0F2E1F]">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day, idx) => (
                  <div
                    key={idx}
                    className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
            </div>
            
            <div className="px-6 py-3 border-t border-gray-100 bg-[#f4f7f0]/30 flex flex-wrap gap-4 text-[10px] text-gray-500 font-semibold justify-center">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-red-100 border border-red-200 inline-block"></span>
                <span>Deadlines (Unapplied)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-[#E8F5C0] border border-brand-accent/50 inline-block"></span>
                <span>Payments / DBT Releases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-green-50 border border-green-200 inline-block"></span>
                <span>Applied / Completed Schemes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Alerts and Actions */}
        <div className="space-y-6">
          {/* Upcoming Event Deadlines with Applied Checks */}
          <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-extrabold text-sm text-[#0F2E1F]">Upcoming Sowing Windows</h3>
            </div>
            
            <div className="p-4 space-y-3.5">
              {upcomingEvents.length === 0 ? (
                <div className="py-6 text-center text-gray-400">
                  <p className="text-xs font-semibold">No upcoming deadlines.</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2.5 pb-3.5 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    {/* Applied Checkbox */}
                    <input
                      type="checkbox"
                      checked={!!appliedEvents[event.id]}
                      onChange={() => handleApplyToggle(event.id)}
                      className="mt-1.5 rounded text-[#2d5a3d] focus:ring-[#2d5a3d] cursor-pointer"
                      title="Mark as Applied on government portal"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold text-gray-900 truncate ${appliedEvents[event.id] ? "line-through text-gray-400" : ""}`}>
                        {event.title}
                      </p>
                      <p className="text-[10px] text-gray-550 font-semibold mt-0.5">
                        Closing: {event.date.split("-").reverse().join("/")}
                      </p>
                      <p className="text-[10px] text-[#2d5a3d] font-bold mt-1">
                        Coverage value: {event.amount}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Missed Opportunities Section (calculated dynamically) */}
          <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 bg-red-50/20">
              <div className="flex items-center gap-2">
                <XCircle className="w-4.5 h-4.5 text-red-550 shrink-0" />
                <h3 className="font-extrabold text-sm text-red-900">Missed Deadlines & Losses</h3>
              </div>
              <p className="text-[10px] text-red-850 font-medium mt-0.5">
                Past periods where deadlines lapsed without checking 'Applied'.
              </p>
            </div>
            
            <div className="p-4 space-y-3.5">
              {missedOpportunities.length === 0 ? (
                <div className="py-6 text-center text-green-700 bg-green-50/50 rounded-xl border border-dashed border-green-200">
                  <p className="text-xs font-extrabold">All past deadlines checked!</p>
                  <p className="text-[9.5px] text-green-600 font-semibold mt-0.5">Zero missed outlays recorded.</p>
                </div>
              ) : (
                missedOpportunities.map((opp) => (
                  <div key={opp.id} className="p-3 bg-red-50/10 border border-red-100 rounded-lg flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleApplyToggle(opp.id)}
                      className="mt-1 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      title="Tick to mark as applied retroactively"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{opp.scheme}</p>
                        <span className="text-[9.5px] text-red-600 font-extrabold shrink-0">Lapsed</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Closed: {opp.date.split("-").reverse().join("/")}</p>
                      <p className="text-[9.5px] text-gray-500 leading-normal font-medium mt-1">
                        Reason: Unapplied on government portal. Payout estimated loss: <span className="font-bold text-red-600">{opp.amount.split(" ")[0]}</span>.
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Applied past events checklist */}
          {completedOpportunities.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-green-50/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-[#2d5a3d] shrink-0" />
                  <h3 className="font-extrabold text-sm text-[#0F2E1F]">Applied / Secured Benefits</h3>
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                {completedOpportunities.map((comp) => (
                  <div key={comp.id} className="p-2.5 bg-gray-50/60 rounded-lg border border-gray-100 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleApplyToggle(comp.id)}
                      className="mt-1 rounded text-[#2d5a3d] focus:ring-[#2d5a3d] cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate line-through">{comp.scheme}</p>
                      <p className="text-[9.5px] text-green-700 font-bold mt-0.5">Applied: {comp.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Drawer Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-[9999] animate-fadeIn">
          <div className="bg-white h-full max-w-sm w-full p-6 border-l border-gray-100 shadow-2xl relative animate-slideLeft flex flex-col justify-between max-h-screen overflow-y-auto">
            <div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-650 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-2 mt-4">
                <Sprout className="h-5 w-5 text-[#2d5a3d]" />
                <h3 className="text-sm font-extrabold text-[#0F2E1F] uppercase tracking-wider">
                  Schedule Details
                </h3>
              </div>
              
              <p className="text-xs text-[#2d5a3d] font-bold bg-[#E8F5C0] px-2.5 py-1 rounded-md inline-block mb-6 uppercase tracking-wider">
                {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>

              {filteredEvents.filter(e => e.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`).length === 0 ? (
                <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="text-xs font-bold">No active events matching your filters on this date.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents
                    .filter(e => e.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`)
                    .map((event, idx) => {
                      const isApplied = !!appliedEvents[event.id];
                      return (
                        <div
                          key={idx}
                          className="border border-gray-150 rounded-xl p-4 bg-gray-50/70 space-y-2.5"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                                event.priority === "urgent"
                                  ? "bg-red-50 text-red-700 border-red-155"
                                  : "bg-[#E8F5C0] text-[#0F2E1F] border-brand-accent/50"
                              }`}
                            >
                              {event.type}
                            </span>
                            {event.amount && (
                              <span className="text-xs font-black text-[#0F2E1F]">{event.amount}</span>
                            )}
                          </div>
                          
                          <p className="text-xs font-bold text-gray-805 leading-snug">{event.title}</p>
                          
                          {event.location && (
                            <p className="text-[10px] text-gray-500 font-bold">
                              📍 Center: {event.location}
                            </p>
                          )}
                          
                          <p className="text-[10px] text-gray-600 leading-relaxed font-semibold bg-white p-2.5 rounded border border-gray-150">
                            {event.description}
                          </p>

                          {/* Applied toggle inside details drawer */}
                          <label className="flex items-center gap-2 text-[10.5px] text-gray-700 font-bold pt-1 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isApplied}
                              onChange={() => handleApplyToggle(event.id)}
                              className="rounded text-[#2d5a3d] focus:ring-[#2d5a3d]"
                            />
                            <span>I have submitted application on official portal</span>
                          </label>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="w-full py-2.5 bg-[#0F2E1F] hover:bg-[#1A3A2A] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmSchemeCalendar;
