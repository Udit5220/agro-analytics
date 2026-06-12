import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  Users,
  ShieldAlert,
  Award,
  Bell,
  Cpu,
  Sliders,
  Database,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";

const NAV_ITEMS = [
  {
    section: "BUSINESS",
    items: [
      { label: "Executive Dashboard", path: "/company/disease-intelligence/dashboard", icon: LayoutDashboard, persona: "CEO / CPO" },
      { label: "Customer Risk Monitor", path: "/company/disease-intelligence/customer-risk", icon: Users, persona: "Customer Success Lead" },
      { label: "Intervention Effectiveness", path: "/company/disease-intelligence/interventions", icon: ShieldAlert, persona: "Customer Success" },
      { label: "Platform Impact", path: "/company/disease-intelligence/platform-impact", icon: Award, persona: "CEO / Sales" }
    ]
  },
  {
    section: "INTELLIGENCE",
    items: [
      { label: "Global Disease Map", path: "/company/disease-intelligence/global-intelligence", icon: Globe, persona: "Product / Data Science" },
      { label: "Alert Operations", path: "/company/disease-intelligence/alerts", icon: Bell, persona: "Product Ops" }
    ]
  },
  {
    section: "ENGINEERING",
    items: [
      { label: "AI Model Performance", path: "/company/disease-intelligence/model-performance", icon: Cpu, persona: "AI Engineer" },
      { label: "Operational Control", path: "/company/disease-intelligence/operations", icon: Sliders, persona: "DevOps / CTO" }
    ]
  },
  {
    section: "KNOWLEDGE",
    items: [
      { label: "Disease Repository", path: "/company/disease-intelligence/repository", icon: Database, persona: "Data Scientist" }
    ]
  }
];

export default function DiseaseIntelligenceLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Find the active nav item to get details like persona and title
  let activeItem = null;
  for (const sec of NAV_ITEMS) {
    const found = sec.items.find(item => location.pathname.startsWith(item.path));
    if (found) {
      activeItem = found;
      break;
    }
  }

  // Fallback active item if none matched exactly
  if (!activeItem) {
    activeItem = {
      label: "Executive Dashboard",
      path: "/company/disease-intelligence/dashboard",
      icon: LayoutDashboard,
      persona: "CEO / CPO"
    };
  }

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans flex antialiased">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-dark/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ecf39e]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* LEFT SIDEBAR (Fixed & Collapsible) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-[#132a13] text-white flex flex-col justify-between transition-all duration-300 z-30 shadow-none ${
          collapsed ? "w-16" : "w-60"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin">
          {/* Logo Branding */}
          <div className="h-14 flex items-center px-4 shrink-0 justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <span className="font-extrabold text-[#ecf39e] text-sm font-mono">A</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-black text-white text-xs tracking-tight">AgroAnalytics</span>
                  <span className="text-[#ecf39e] text-[9px] uppercase tracking-wider font-extrabold -mt-0.5">
                    Disease Intel
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Toggle (Desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex h-6 w-6 rounded-md bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition active:scale-95 shrink-0"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-4 flex-1">
            {NAV_ITEMS.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {/* Section header */}
                {!collapsed ? (
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2.5 mb-1.5 mt-2">
                    {section.section}
                  </div>
                ) : (
                  <div className="h-px bg-white/10 my-3" />
                )}

                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={iIdx}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition duration-200 text-xs font-bold relative group ${
                        isActive
                          ? "bg-brand-medium text-white shadow-none"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                      title={collapsed ? item.label : ""}
                    >
                      <Icon
                        size={17}
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-[#ecf39e]" : "text-slate-300 group-hover:text-white"
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-3 shrink-0 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-xl bg-white/10 flex items-center justify-center text-sm font-black text-[#ecf39e] shrink-0">
              OP
            </div>
            {!collapsed && (
              <div className="overflow-hidden flex-1">
                <h4 className="text-[11px] font-bold text-white truncate leading-tight">Admin Terminal</h4>
                <p className="text-[9px] text-[#ecf39e] font-extrabold uppercase tracking-wide truncate mt-0.5">
                  {activeItem.persona}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={() => {
                  // Back to landing page
                  navigate("/");
                }}
                className="text-slate-300 hover:text-red-400 transition shrink-0 p-1 rounded-lg hover:bg-white/10"
                title="Exit Command Center"
              >
                <LogOut size={17} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* TOP HEADER & CONTENT CONTAINER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-60"}`}>
        {/* Top Header (h-14, sticky top) */}
        <header className="h-14 bg-[#132a13] flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm shrink-0">
          {/* Left: Mobile Menu Toggle, Title and Context Chip */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-200 hover:bg-white/10 transition"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <h1 className="text-sm font-black text-white uppercase tracking-wider font-mono">
              {activeItem.label}
            </h1>

            <span className="hidden md:inline-flex items-center bg-white/10 text-[#ecf39e] text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-white/10">
              Viewing as: {activeItem.persona}
            </span>
          </div>

          {/* Right: Date Picker, Notifications, User Avatar */}
          <div className="flex items-center space-x-3 text-xs font-bold">
            {/* Date Range Picker */}
            <div className="relative flex items-center bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-slate-200 hover:bg-white/20 transition">
              <Calendar size={13} className="text-[#ecf39e] mr-1.5 shrink-0" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-[10px] font-bold border-none focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="Last 7 Days" className="text-slate-900 font-bold bg-white">7D</option>
                <option value="Last 30 Days" className="text-slate-900 font-bold bg-white">30D</option>
                <option value="Last 90 Days" className="text-slate-900 font-bold bg-white">90D</option>
                <option value="Last 1 Year" className="text-slate-900 font-bold bg-white">1Y</option>
              </select>
            </div>

            {/* Notification Bell */}
            <button className="h-8 w-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition relative">
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Export Report */}
            <button
              onClick={() => {
                alert(`Exporting current report data for range: ${dateRange}`);
              }}
              className="hidden sm:flex items-center gap-1.5 bg-brand-medium hover:bg-brand-medium/90 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition active:scale-95 border border-white/10"
            >
              <Download size={12} /> Export Report
            </button>

            {/* User Avatar with role toggle menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="h-8.5 w-8.5 rounded-xl bg-[#132a13] hover:bg-[#132a13]/80 text-[#ecf39e] flex items-center justify-center font-black text-xs border border-white/10 cursor-pointer transition active:scale-95"
              >
                AA
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-2 animate-fadeIn text-gray-800">
                  <div className="p-2 border-b border-gray-100 mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Command</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">Executive Terminal</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-2 hover:bg-red-50 text-red-600 rounded-lg p-2 text-xs font-bold transition"
                  >
                    <LogOut size={13} /> Exit Command Center
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN OUTLET CANVAS */}
        <main className="flex-1 px-6 py-6 md:px-8 md:py-8 z-10 overflow-y-auto relative scrollbar-thin">
          <div className="w-full">
            <Outlet context={{ dateRange }} />
          </div>
        </main>
      </div>
    </div>
  );
}
