import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom';
import { Sprout, Globe, Sun, Moon, Bell, ChevronDown, Menu, LogOut, Settings, UserCircle, Tractor } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import GenericSidebar from '../sidebar/GenericSidebar';
import { uiConfig } from '../../utils/uiConfig';
import { dashboardContent } from '../../content/dashboardContent';

export default function ModuleLayout() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = dashboardContent;
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs text-gray-200 hover:text-white hover:bg-[#4f772d]/30 transition-all duration-200"
            >
              <Globe className="h-3.5 w-3.5 text-gray-300" />
              <span className="font-semibold">{selectedLang}</span>
              <ChevronDown className="h-3 w-3 text-gray-300" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl py-1 text-gray-800 z-50 animate-fadeIn">
                {['English', 'Español', 'Français', 'हिन्दी'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLangSelect(lang)}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#31572c]/10 hover:text-[#132a13] transition-colors duration-150"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-350 hover:text-white hover:bg-[#4f772d]/30 transition-all duration-200"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-[#ecf39e]" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-gray-300" />
            )}
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationCount(0)}
              className="p-2 rounded-lg text-gray-350 hover:text-white hover:bg-[#4f772d]/30 relative transition-all duration-200"
            >
              <Bell className="h-4.5 w-4.5 text-gray-300" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border-2 border-[#132a13]">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Avatar with Profile Dropdown */}
          <div className="flex items-center pl-2 border-l border-[#31572c]/40 relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="h-8 w-8 rounded-full bg-[#4f772d]/30 hover:bg-[#4f772d]/50 border border-[#90a955]/30 flex items-center justify-center font-bold text-[#ecf39e] text-xs hover:scale-105 transition-transform duration-200 shadow-sm cursor-pointer animate-fadeIn"
              title={`${userProfile.name} (${userProfile.hindiRole})`}
            >
              {userProfile.avatar}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-3 animate-fadeIn text-gray-800">
                
                {/* Top: User Info */}
                <div className="flex items-center gap-3 pb-3">
                  <div className="h-10 w-10 rounded-xl bg-[#132a13] flex items-center justify-center text-[#ecf39e] font-bold text-sm shrink-0 shadow-inner">
                    {userProfile.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{userProfile.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{userProfile.role} / {userProfile.hindiRole}</p>
                  </div>
                  <span className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-500/20" title="Active" />
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* Quick Links */}
                <div className="space-y-0.5">
                  <button className="w-full text-left text-gray-700 hover:bg-[#f4f7f4] rounded-lg px-2 py-1.5 transition-all text-xs flex items-center gap-2 font-medium">
                    <UserCircle className="h-3.5 w-3.5 text-[#90a955]" />
                    My Profile
                  </button>
                  <button className="w-full text-left text-gray-700 hover:bg-[#f4f7f4] rounded-lg px-2 py-1.5 transition-all text-xs flex items-center gap-2 font-medium">
                    <Tractor className="h-3.5 w-3.5 text-[#90a955]" />
                    Farm Configurations
                  </button>
                  <button className="w-full text-left text-gray-700 hover:bg-[#f4f7f4] rounded-lg px-2 py-1.5 transition-all text-xs flex items-center gap-2 font-medium">
                    <Settings className="h-3.5 w-3.5 text-[#90a955]" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-gray-100 my-2" />

                {/* Logout */}
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/'); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-2 rounded-lg transition-all duration-200"
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
        <div className={`transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0 ${isSidebarOpen ? 'w-56' : 'w-0'}`}>
          <GenericSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* Floating Menu Toggle Button when Sidebar is collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-20 left-4 z-40 p-2.5 bg-white hover:bg-[#f4f7f4] text-[#132a13] border border-gray-200 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center animate-fadeIn"
            title="Open Navigation"
          >
            <LucideIcons.Menu className="h-5 w-5 text-[#132a13]" />
          </button>
        )}

        {/* Right Column: Dynamic Outlet Page (Dynamic Padding transition when sidebar is closed) */}
        <main className={`flex-1 bg-[#f4f7f4] overflow-y-auto p-6 lg:p-8 scroll-thin transition-all duration-300 ${!isSidebarOpen ? 'pl-20 sm:pl-24 lg:pl-28' : ''}`}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}
