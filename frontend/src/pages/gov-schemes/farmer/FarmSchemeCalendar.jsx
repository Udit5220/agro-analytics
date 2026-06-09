// src/pages/farmer/FarmSchemeCalendar.jsx
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
  TrendingUp,
  CalendarDays,
  FileText,
  ArrowRight,
  X,
} from "lucide-react";
import govtSchemeData from "../../../seed-json/govt_scheme.json";

const FarmSchemeCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1));
  const [selectedDate, setSelectedDate] = useState(null);

  const { scheduleData } = govtSchemeData;
  const { monthEvents, alerts, missedOpportunities, events } = scheduleData;

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventTypeColor = (type, priority) => {
    if (priority === "urgent") return "bg-red-500 text-white";
    if (type === "deadline") return "bg-red-100 text-red-700 border-red-200";
    if (type === "payment") return "bg-blue-100 text-blue-700 border-blue-200";
    if (type === "installment")
      return "bg-green-100 text-green-700 border-green-200";
    if (type === "training")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getAlertIcon = (type) => {
    if (type === "urgent") return <AlertCircle className="w-4 h-4" />;
    if (type === "upcoming") return <Clock className="w-4 h-4" />;
    return <Bell className="w-4 h-4" />;
  };

  const getAlertColor = (type) => {
    if (type === "urgent") return "border-red-200 bg-red-50";
    if (type === "upcoming") return "border-amber-200 bg-amber-50";
    return "border-blue-200 bg-blue-50";
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
    setSelectedDate(null);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();

    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div
          key={`empty-${i}`}
          className="h-28 bg-gray-50/50 rounded-lg border border-gray-100/50"
        ></div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents =
        monthEvents.find((m) => m.date === dateStr)?.events || [];
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      calendarDays.push(
        <div
          key={day}
          onClick={() => setSelectedDate(selectedDate === day ? null : day)}
          className={`h-28 p-2 rounded-lg border cursor-pointer transition hover:shadow-md ${
            selectedDate === day
              ? "border-2 shadow-md bg-[#f4f7f4]/45"
              : "border-gray-100 hover:border-gray-300"
          } ${isToday ? "bg-[#132a13]/5 border-[#132a13]" : "bg-white"}`}
          style={selectedDate === day ? { borderColor: "#4f772d" } : {}}
        >
          <span
            className={`text-sm font-bold ${isToday ? "text-[#132a13] font-bold" : "text-gray-700"}`}
          >
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`text-[9px] px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type, event.priority)}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-[9px] text-gray-400 font-semibold pl-1">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return calendarDays;
  };

  const selectedDateEvents = selectedDate
    ? monthEvents.find(
        (m) =>
          m.date ===
          `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
      )?.events || []
    : [];

  return (
    <div className="p-6 overflow-y-auto h-full bg-[#f4f7f4]/40 animate-fadeIn">
      {/* Branded Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-[#132a13]/10 rounded-xl">
            <Calendar className="h-5 w-5 text-[#4f772d]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#132a13]">Scheme Calendar</h1>
            <p className="text-xs text-gray-500">Track deadlines, application windows, and DBT transfer events</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-[#132a13]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day, idx) => (
                  <div
                    key={idx}
                    className="text-center text-xs font-bold text-gray-400 py-2 uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
            </div>
            <div className="p-4 space-y-3">
              {events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                >
                  <div
                    className={`p-2 rounded-lg ${getEventTypeColor(event.type, event.priority)}`}
                  >
                    {event.type === "deadline" && (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {event.type === "payment" && (
                      <DollarSign className="w-4 h-4" />
                    )}
                    {event.type === "installment" && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {event.type === "training" && (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.date.split("-").reverse().join("/")}
                    </p>
                    {event.location && (
                      <p className="text-xs text-gray-400 mt-1">
                        {event.location}
                      </p>
                    )}
                    {event.amount && (
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#2D4A3E" }}
                      >
                        {event.amount}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Alerts Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" style={{ color: "#2D4A3E" }} />
                <h3 className="font-semibold text-gray-900">Smart Alerts</h3>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start gap-2">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </p>
                      {alert.daysLeft && (
                        <p className="text-xs text-red-600">
                          {alert.daysLeft} days remaining
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {alert.impact}
                      </p>
                      <button
                        className="text-xs font-medium mt-2 flex items-center gap-1"
                        style={{ color: "#2D4A3E" }}
                      >
                        {alert.action}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missed Opportunities Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-900">
                  Missed Opportunities
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You missed 2 schemes this year
              </p>
            </div>
            <div className="p-4 space-y-3">
              {missedOpportunities.map((opp, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {opp.scheme}
                  </p>
                  <p className="text-xs text-gray-500">
                    Closed: {opp.closedDate}
                  </p>
                  <p className="text-xs text-red-600 font-medium mt-1">
                    Lost: {opp.lostAmount}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{opp.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Drawer Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-end z-[9999] animate-fadeIn">
          <div className="bg-white h-full max-w-sm w-full p-6 border-l border-gray-100 shadow-2xl relative animate-slideLeft flex flex-col justify-between max-h-screen overflow-y-auto">
            <div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-[#132a13] mb-1">
                Day Schedule Details
              </h3>
              <p className="text-xs text-gray-405 font-bold mb-4 uppercase tracking-wider">
                {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </p>

              {selectedDateEvents.length === 0 ? (
                <div className="py-12 text-center text-gray-405">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-30 text-gray-400" />
                  <p className="text-xs font-semibold">No events scheduled for this date.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-150 rounded-xl p-4 bg-gray-50/70 space-y-2.5"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                            event.priority === "urgent"
                              ? "bg-red-50 text-red-700 border-red-155"
                              : "bg-[#f4f7f4] text-[#4f772d] border-[#4f772d]/20"
                          }`}
                        >
                          {event.type}
                        </span>
                        {event.amount && (
                          <span className="text-xs font-black text-[#132a13]">{event.amount}</span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-800 leading-snug">{event.title}</p>
                      {event.location && (
                        <p className="text-[10px] text-gray-500 font-semibold">📍 Location: {event.location}</p>
                      )}
                      <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                        This event is tracked under your active farmer profile categories. Keep all documents ready in the Vault.
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6">
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="w-full py-2.5 bg-[#132a13] hover:bg-[#31572c] text-white rounded-xl text-xs font-bold transition"
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
