import React, { useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import { Sprout, Globe, Sun, Moon, Bell, ChevronDown, Menu } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import GenericSidebar from '../sidebar/GenericSidebar';
import { uiConfig } from '../../utils/uiConfig';
import { dashboardContent } from '../../content/dashboardContent';

export default function ModuleLayout() {
  const { moduleId } = useParams();
  const { userProfile } = dashboardContent;
  const [darkMode, setDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [notificationCount, setNotificationCount] = useState(2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f7f4] dark:bg-brand-darkest text-slate-800 dark:text-white transition-colors duration-300 font-sans">
      
      {/* 1. TOP STICKY HEADER */}
      <header className="h-16 bg-brand-darkest text-white border-b border-brand-dark/30 z-30 flex items-center justify-between px-6 shrink-0 shadow-md">
        
        {/* Left: Branding Logo (Matched to Home page) */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-brand-accent/25 rounded-xl border border-brand-accent/20 group-hover:scale-110 transition-transform duration-300">
            <Sprout className="h-6 w-6 text-brand-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AgroSense<span className="text-brand-accent font-extrabold">.</span>
          </span>
        </Link>

        {/* Center: Module Title */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-slate-300">
          <span className="bg-brand-medium/30 border border-brand-light/20 text-brand-accent px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px]">
            {moduleId ? moduleId.replace('-', ' ') : 'Agri AI'}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="font-semibold">{selectedLang}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/20 rounded-xl shadow-xl py-1 text-slate-800 dark:text-white z-50 animate-fadeIn">
                {['English', 'Español', 'Français', 'हिन्दी'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLangSelect(lang)}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-brand-accent/10 hover:text-brand-dark transition-colors duration-150"
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
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? (
              <Sun className="h-4.5 w-4.5 text-brand-accent" />
            ) : (
              <Moon className="h-4.5 w-4.5 hover:text-brand-accent" />
            )}
          </button>

          {/* Notifications bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationCount(0)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 relative transition-all duration-200"
            >
              <Bell className="h-4.5 w-4.5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-brand-light text-brand-darkest rounded-full text-[9px] font-extrabold flex items-center justify-center border border-brand-darkest">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Avatar (SK Initials only) */}
          <div className="flex items-center pl-2 border-l border-brand-dark/45">
            <div className="h-8 w-8 rounded-full bg-brand-medium flex items-center justify-center font-bold text-white text-xs hover:scale-105 transition-transform duration-200 shadow-md cursor-pointer" title={`${userProfile.name} (${userProfile.hindiRole})`}>
              {userProfile.avatar}
            </div>
          </div>

        </div>

      </header>

      {/* 2. BODY SPLIT (Sidebar + Outlet Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Column: Collapsible Sidebar */}
        <div className={`transition-all duration-300 ease-in-out h-full overflow-hidden shrink-0 ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
          <GenericSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {/* Floating Menu Toggle Button when Sidebar is collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-20 left-4 z-40 p-2.5 bg-brand-darkest hover:bg-brand-medium text-white border border-brand-light/20 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center animate-fadeIn"
            title="Open Navigation"
          >
            <LucideIcons.Menu className="h-5 w-5 text-brand-accent" />
          </button>
        )}

        {/* Right Column: Dynamic Outlet Page (Dynamic Padding transition when sidebar is closed) */}
        <main className={`flex-1 bg-[#f4f7f4] dark:bg-brand-darkest/95 overflow-y-auto p-6 lg:p-8 scroll-thin transition-all duration-300 ${!isSidebarOpen ? 'pl-20 sm:pl-24 lg:pl-28' : ''}`}>
          <Outlet />
        </main>

      </div>

    </div>
  );
}
