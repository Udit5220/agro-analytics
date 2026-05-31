import React, { useState, useEffect } from "react";
import { CalendarDays, Sprout, Pin, Thermometer, Droplets, Calendar, Sparkles, Info, Loader2 } from "lucide-react";
import { getSeasonalCalendar } from "../../services/geminiService";
import LocationSelector from "../../components/LocationSelector";
import { getSoilDataByPincode } from "../../services/locationService";

const SEASON_MONTHS = {
  Kharif: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
  Rabi: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"],
  Zaid: ["Mar", "Apr", "May", "Jun"],
};

// Pastel background styling with high-contrast readable text
const PHASE_STYLES = {
  Sowing:
    "bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[10px] py-1.5 px-2 rounded-lg w-full block text-center tracking-wide shadow-sm",
  Irrigation:
    "bg-sky-50 text-sky-700 border border-sky-200/80 font-bold text-[10px] py-1.5 px-2 rounded-lg w-full block text-center tracking-wide shadow-sm",
  Fertilizer:
    "bg-amber-50 text-amber-855 border border-amber-200/80 font-bold text-[10px] py-1.5 px-2 rounded-lg w-full block text-center tracking-wide shadow-sm",
  Harvest:
    "bg-emerald-100/70 text-emerald-900 border border-emerald-250 font-bold text-[10px] py-1.5 px-2 rounded-lg w-full block text-center tracking-wide shadow-sm",
};

export default function SeasonalCalendar() {
  const [location, setLocation] = useState({
    state: "Haryana",
    district: "Faridabad",
    pincode: "121001",
    latitude: 28.4089,
    longitude: 77.3178,
    soilData: getSoilDataByPincode("121001"),
  });

  const [activeSeason, setActiveSeason] = useState("Kharif");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic calendar state loaded from Gemini/fallback
  const [calendarData, setCalendarData] = useState({
    seasons: [
      {
        name: "Kharif",
        months: "June – November",
        temperature: "25°C – 35°C",
        humidity: "70% – 90%",
        description: "Sown with the onset of the southwest monsoon. Characterized by high humidity, warm temperature models, and heavy rain demands.",
        crops: [
          { name: "Rice", hindiName: "धान", npk: "120-60-40", timeline: { Jun: ["Sowing"], Jul: ["Sowing", "Irrigation", "Fertilizer"], Aug: ["Irrigation"], Sep: ["Irrigation", "Fertilizer"], Oct: ["Harvest"], Nov: ["Harvest"] } },
          { name: "Maize", hindiName: "मक्का", npk: "100-50-40", timeline: { Jun: ["Sowing"], Jul: ["Sowing", "Fertilizer"], Aug: ["Irrigation", "Fertilizer"], Sep: ["Irrigation", "Harvest"], Oct: ["Harvest"] } },
          { name: "Cotton", hindiName: "कपास", npk: "80-40-40", timeline: { Jun: ["Sowing"], Jul: ["Irrigation"], Aug: ["Irrigation", "Fertilizer"], Sep: ["Irrigation", "Fertilizer"], Oct: ["Irrigation", "Harvest"], Nov: ["Harvest"] } }
        ]
      },
      {
        name: "Rabi",
        months: "November – April",
        temperature: "15°C – 25°C",
        humidity: "40% – 60%",
        description: "Sown in winter after the monsoon rains retreat. Requires mild temperatures during sowing/growing and warm weather during harvest.",
        crops: [
          { name: "Wheat", hindiName: "गेहूं", npk: "120-60-40", timeline: { Nov: ["Sowing"], Dec: ["Sowing", "Irrigation"], Jan: ["Irrigation", "Fertilizer"], Feb: ["Irrigation"], Mar: ["Harvest"], Apr: ["Harvest"] } }
        ]
      },
      {
        name: "Zaid",
        months: "March – June",
        temperature: "30°C – 40°C",
        humidity: "30% – 50%",
        description: "Short summer crop window between the Rabi harvest and Kharif sowing. Dominated by warm winds and rapid maturity requirements.",
        crops: [
          { name: "Watermelon", hindiName: "तरबूज", npk: "80-40-60", timeline: { Mar: ["Sowing"], Apr: ["Irrigation", "Fertilizer"], May: ["Irrigation"], Jun: ["Harvest"] } }
        ]
      }
    ]
  });

  const handleLocationChange = (newLocation) => {
    if (
      newLocation.district !== location.district ||
      newLocation.state !== location.state ||
      newLocation.pincode !== location.pincode ||
      newLocation.latitude !== location.latitude ||
      newLocation.longitude !== location.longitude
    ) {
      setLocation(newLocation);
    }
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    const loadCalendar = async () => {
      try {
        const result = await getSeasonalCalendar("Rice,Wheat,Maize,Cotton,Watermelon", location.district, activeSeason);
        if (active) {
          setCalendarData(result);
        }
      } catch (err) {
        console.error("Failed to load seasonal calendar data:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadCalendar();

    return () => {
      active = false;
    };
  }, [activeSeason, location.district, location.state, location.pincode, location.latitude, location.longitude]);

  // Extract active season data from dynamic state
  const activeSeasonData = calendarData.seasons.find(
    s => s.name.toLowerCase() === activeSeason.toLowerCase()
  ) || calendarData.seasons[0];

  const months = SEASON_MONTHS[activeSeason] || SEASON_MONTHS["Kharif"];
  const gridColsClass = months.length === 6 ? "grid-cols-6" : "grid-cols-4";

  return (
    <div className="space-y-6 animate-fadeIn antialiased max-w-7xl mx-auto">
      
      {/* 1. Header Info Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-6.5 w-6.5 text-[#31572c]" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-950 flex items-center gap-3">
              <span>Seasonal Agronomic Calendar</span>
              <span className="text-gray-300 font-light text-xl">|</span>
              <span className="text-[#31572c] font-bold text-sm md:text-base">
                ऋतु चक्र कैलेंडर
              </span>
            </h1>
          </div>
          <p className="text-gray-550 text-[11px] md:text-xs font-medium mt-1.5">
            Plan your farm activities and track crop rotational timelines across the growing season.
          </p>
        </div>
      </div>

      {/* 2-Section Compound Field Selector */}
      <LocationSelector value={location} onChange={handleLocationChange} />

      {/* 2. Horizontal Controls Section: Segmented Toggles & Active Metadata */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        
        {/* Horizontal segmented tabs */}
        <div className="bg-white border border-gray-200/80 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm w-full sm:w-auto">
          {["Kharif", "Rabi", "Zaid"].map((season) => {
            const labelHi =
              season === "Kharif"
                ? "खरीफ"
                : season === "Rabi"
                  ? "रबी"
                  : "जायद";
            const isActive = activeSeason === season;
            
            return (
              <button
                key={season}
                type="button"
                onClick={() => setActiveSeason(season)}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                  isActive
                    ? "bg-[#31572c]/10 border-[#31572c]/30 text-[#132a13] font-extrabold shadow-sm"
                    : "bg-white border-transparent text-gray-600 hover:text-[#31572c] hover:bg-gray-50"
                }`}
              >
                <span>{season} Season</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isActive ? 'bg-[#31572c]/15 text-[#132a13]' : 'bg-gray-100 text-gray-500'}`}>
                  {labelHi}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Duration Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-sm self-stretch sm:self-auto shrink-0">
          <div className="p-2 bg-[#31572c]/10 rounded-xl text-[#31572c]">
            <Calendar size={15} />
          </div>
          <div>
            <span className="text-[8px] text-gray-400 block font-bold uppercase tracking-wider">Active Months</span>
            <span className="text-xs font-black text-gray-800">{activeSeasonData.months}</span>
          </div>
        </div>

      </div>

      {/* 3. Horizontal Climate Parameters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Avg Temperature Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4.5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-11 w-11 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 shadow-sm border border-red-500/5">
            <Thermometer size={22} />
          </div>
          <div>
            <span className="text-[9px] text-gray-455 block font-bold uppercase tracking-wider">Average Temperature</span>
            <span className="text-base font-black text-gray-800 mt-0.5 block">{activeSeasonData.temperature}</span>
          </div>
        </div>

        {/* Avg Humidity Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4.5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 shadow-sm border border-blue-500/5">
            <Droplets size={22} />
          </div>
          <div>
            <span className="text-[9px] text-gray-455 block font-bold uppercase tracking-wider">Average Humidity</span>
            <span className="text-base font-black text-gray-800 mt-0.5 block">{activeSeasonData.humidity}</span>
          </div>
        </div>

        {/* Agronomic Overview Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4.5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="h-11 w-11 rounded-xl bg-[#4f772d]/10 text-[#31572c] flex items-center justify-center shrink-0 shadow-sm border border-[#4f772d]/5">
            <Info size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-gray-455 block font-bold uppercase tracking-wider">Agronomic Overview</span>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed truncate mt-0.5" title={activeSeasonData.description}>
              {activeSeasonData.description}
            </p>
          </div>
        </div>

      </div>

      {/* 4. Rotational Gantt Lifecycle Matrix */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5 overflow-hidden relative">
        
        {/* Title, Legend Indicators Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b border-gray-100">
          <h2 className="text-[#31572c] text-sm font-bold flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-[#4f772d]" />
            <span>Timeline Rotational Matrix</span>
          </h2>
          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#31572c]" />
              Syncing calendar...
            </div>
          )}

          {/* Premium Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-750">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[8.5px] text-emerald-800 font-bold shadow-sm">S</span>
              <span className="text-[10px] text-gray-500 font-semibold">Sowing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-[8.5px] text-sky-700 font-bold shadow-sm">I</span>
              <span className="text-[10px] text-gray-500 font-semibold">Irrigation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-[8.5px] text-amber-800 font-bold shadow-sm">F</span>
              <span className="text-[10px] text-gray-500 font-semibold">Fertilizer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-[8.5px] text-emerald-900 font-bold shadow-sm">H</span>
              <span className="text-[10px] text-gray-500 font-semibold">Harvest</span>
            </div>
          </div>
        </div>

        {/* Matrix Table with native scroll */}
        <div className="overflow-x-auto">
          <div className={`w-full min-w-[760px] table-fixed ${isLoading ? 'opacity-40 pointer-events-none' : ''} transition-opacity duration-200`}>
            
            {/* Table Headers */}
            <div className="grid grid-cols-[180px_1fr] pb-3.5 items-center mb-2 px-2 border-b border-gray-50">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Sprout size={14} className="text-[#31572c]" />
                <span>Crop Profile</span>
              </div>

              <div className={`grid ${gridColsClass} text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider`}>
                {months.map((month) => {
                  const isCurrentMonth = 
                    activeSeason === "Kharif" ? month === "Jul" :
                    activeSeason === "Rabi" ? month === "Jan" :
                    month === "May";
                  return (
                    <span
                      key={month}
                      className={`py-1 rounded-lg flex items-center justify-center gap-1 mx-1 transition-all duration-300 ${
                        isCurrentMonth
                          ? "bg-[#4f772d]/10 text-[#132a13] font-black scale-105"
                          : ""
                      }`}
                    >
                      {isCurrentMonth && (
                        <Pin size={10} className="text-[#31572c]" />
                      )}
                      {month}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Matrix Crop Rows */}
            <div className="divide-y divide-gray-100/70">
              {activeSeasonData.crops.map((crop) => (
                <div
                  key={crop.name}
                  className="grid grid-cols-[180px_1fr] items-center py-3.5 px-2 hover:bg-gray-50/40 rounded-xl transition-all duration-150 group"
                >
                  {/* Left Column Crop Info */}
                  <div className="flex items-center gap-3 pl-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4f772d] group-hover:scale-125 transition-transform shrink-0" />
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 leading-tight">
                        {crop.name}
                      </h3>
                      <span className="text-gray-450 font-bold text-[10px] tracking-wide block mt-0.5">
                        {crop.hindiName || "फसल"}
                      </span>
                    </div>
                  </div>

                  {/* Right Column Stacked Layout Bars */}
                  <div className={`grid ${gridColsClass} gap-2 text-center items-center`}>
                    {months.map((month) => {
                      const phases = crop.timeline[month] || [];
                      const isCurrentMonth = 
                        activeSeason === "Kharif" ? month === "Jul" :
                        activeSeason === "Rabi" ? month === "Jan" :
                        month === "May";

                      return (
                        <div
                          key={month}
                          className={`flex flex-col gap-1.5 p-2 rounded-xl justify-center items-center min-h-[90px] border transition-all duration-200 ${
                            isCurrentMonth
                              ? "bg-[#4f772d]/[0.03] border-[#4f772d]/15 shadow-inner-sm"
                              : "border-transparent bg-transparent"
                          }`}
                        >
                          {phases.map((phase) => (
                            <span
                              key={phase}
                              className={`${PHASE_STYLES[phase]} transform hover:scale-[1.03] transition-transform duration-150 cursor-default`}
                            >
                              {phase}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
