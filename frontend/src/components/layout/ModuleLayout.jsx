import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import { Sprout, Globe, Sun, Moon, Bell, ChevronDown, Menu, LogOut, Settings, UserCircle, Tractor } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import GenericSidebar from '../sidebar/GenericSidebar';
import { uiConfig } from '../../utils/uiConfig';
import { dashboardContent } from '../../content/dashboardContent';
import { useRole } from '../../context/RoleContext';

export default function ModuleLayout() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = dashboardContent;
  const { activeRole, switchRole, allRoles } = useRole();
  const [darkMode, setDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [notificationCount, setNotificationCount] = useState(2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Sync dark mode toggle
  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setLangDropdownOpen(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f7f4] text-[#132a13] antialiased font-sans">
      
      {/* 1. TOP STICKY HEADER — Premium AgroIndia Dark Forest Green Canvas */}
      <header className="bg-[#132a13] border-b border-[#31572c]/40 sticky top-0 z-40 shadow-sm h-16 px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Branding Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-[#4f772d]/30 rounded-xl border border-[#90a955]/20 group-hover:scale-110 transition-transform duration-300">
            <Sprout className="h-6 w-6 text-[#ecf39e]" />
          </div>
          <span className="text-white font-black text-lg flex items-center gap-2">
            AgroIndia<span className="text-[#ecf39e] font-extrabold">.</span>
          </span>
        </Link>

        {/* Center: Module Title (Absolute horizontal center alignment) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block z-50">
          <span className="bg-[#4f772d]/30 text-[#ecf39e] border border-[#90a955]/20 font-bold uppercase tracking-widest text-[9px] px-3 py-1.5 rounded-lg">
            {moduleId ? moduleId.replace('-', ' ') : 'Agri AI'}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">

          {/* Removed Voice Assistant Module */}

          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Lang:</span>
            <select 
              value={localStorage.getItem('language') || 'English'}
              onChange={(e) => {
                localStorage.setItem('language', e.target.value);
                window.location.reload();
              }}
              className="text-xs font-bold text-[#ecf39e] bg-transparent outline-none cursor-pointer"
            >
              <option value="English" className="text-gray-900">English</option>
              <option value="Hindi" className="text-gray-900">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Role Switcher (Global RBAC) */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 w-auto min-w-[90px] sm:min-w-[100px] max-w-[160px] sm:max-w-none whitespace-normal sm:whitespace-nowrap transition-all">
            <span className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-wider shrink-0">Active Role:</span>
            <select 
              value={localStorage.getItem('userRole') || 'Farmer'}
              onChange={(e) => {
                localStorage.setItem('userRole', e.target.value);
                window.location.reload();
              }}
              className="text-[10px] sm:text-xs font-bold text-[#ecf39e] bg-transparent outline-none cursor-pointer w-auto min-w-[70px] sm:min-w-[100px] max-w-none whitespace-nowrap"
            >
              <option value="Farmer" className="text-gray-900">Farmer</option>
              <option value="FPO" className="text-gray-900">FPO</option>
              <option value="Commodity Trader" className="text-gray-900">Commodity Trader</option>
              <option value="Research Analyst" className="text-gray-900">Research Analyst</option>
              <option value="Agribusiness Manager" className="text-gray-900">Agribusiness Manager</option>
              <option value="Government Official" className="text-gray-900">Government Official</option>
              <option value="Company Admin" className="text-gray-900">Company Admin</option>
            </select>
          </div>

          {/* Avatar with Profile Dropdown */}
          <div className="flex items-center pl-2 relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-8 w-8 rounded-full bg-[#4f772d]/30 hover:bg-[#4f772d]/50 border border-[#90a955]/30 flex items-center justify-center text-lg hover:scale-105 transition-transform duration-200 shadow-sm cursor-pointer animate-fadeIn"
              title={`Active Role: ${allRoles[activeRole.toUpperCase()]?.label || activeRole}`}
            >
              {allRoles[activeRole.toUpperCase()]?.icon || "🌾"}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-3.5 animate-fadeIn text-gray-800">
                
                {/* Top: User Info */}
                <div className="flex items-center gap-3 pb-3">
                  <div className="h-10 w-10 rounded-xl bg-[#132a13] flex items-center justify-center text-lg shrink-0 shadow-inner">
                    {allRoles[activeRole.toUpperCase()]?.icon || "🌾"}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {activeRole === "government" ? "Govt Official" : activeRole === "admin" ? "Admin User" : activeRole === "company" ? "Agribusiness User" : activeRole === "fpo" ? "FPO Manager" : "Suresh Kumar"}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider truncate">
                      {allRoles[activeRole.toUpperCase()]?.label || activeRole}
                    </p>
                  </div>
                  <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-500/20" title="Active Session" />
                </div>

                {/* Switch Role Section */}
                <div className="border-t border-gray-100 pt-2 pb-1.5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Switch Active Role</p>
                  <div className="relative">
                    <select
                      value={activeRole}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        switchRole(newRole);
                        setIsProfileOpen(false);
                        // Route dynamically based on active role
                        navigate("/module/disease-detection");
                      }}
                      className="w-full bg-gray-50 border border-gray-200 text-xs text-gray-800 rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-[#31572c] cursor-pointer"
                    >
                      {Object.values(allRoles).map((role) => (
                        <option key={role.id} value={role.id} className="text-gray-950 font-bold bg-white">
                          {role.icon} {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* Quick Links */}
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => { setIsProfileOpen(false); navigate('/module/profile'); }}
                    className="w-full text-left text-gray-700 hover:bg-[#f4f7f4] rounded-lg px-2 py-1.5 transition-all text-xs flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <UserCircle className="h-3.5 w-3.5 text-[#90a955]" />
                    My Profile
                  </button>
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={() => { setIsProfileOpen(false); navigate('/'); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* 2. BODY SPLIT (Sidebar + Outlet Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Column: Collapsible Sidebar */}
        {moduleId !== 'learning-hub' && (
          <div className={`transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0 ${
            isSidebarOpen 
              ? 'w-full md:w-64 absolute md:relative inset-y-0 left-0 z-30' 
              : 'w-0'
          }`}>
            <GenericSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        )}

        {/* Floating Menu Toggle Button when Sidebar is collapsed */}
        {!isSidebarOpen && moduleId !== 'learning-hub' && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-20 left-4 z-40 p-2.5 bg-white hover:bg-[#f4f7f4] text-[#132a13] border border-gray-200 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center animate-fadeIn"
            title="Open Navigation"
          >
            <LucideIcons.Menu className="h-5 w-5 text-[#132a13]" />
          </button>
        )}

        {/* Right Column: Dynamic Outlet Page (Dynamic Padding transition when sidebar is closed) */}
        <main className={`flex-1 bg-[#f4f7f4] overflow-y-auto scroll-thin transition-all duration-300 ${
          moduleId === 'learning-hub' 
            ? 'p-0' 
            : `p-4 md:p-6 ${!isSidebarOpen ? 'pl-16 md:pl-20' : ''}`
        }`}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}
