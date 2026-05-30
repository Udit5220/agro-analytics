import React, { useState, useEffect } from 'react';
import { Sprout, Globe, Sun, Moon, Bell, User, Menu, X, ChevronDown } from 'lucide-react';
import { uiConfig } from '../../utils/uiConfig';
import { homeContent } from '../../content/homeContent';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Monitor scroll for transition styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync dark mode class
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
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-darkest/95 backdrop-blur-md shadow-lg border-b border-brand-light/10 py-3'
          : 'bg-gradient-to-b from-[#132a13]/80 via-[#132a13]/45 to-transparent backdrop-blur-[2px] py-5'
      }`}
    >
      <div className={uiConfig.layout.container}>
        <div className="flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-brand-accent/25 rounded-xl border border-brand-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Sprout className="h-6 w-6 text-brand-accent" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              AgroSense<span className="text-brand-accent font-extrabold">.</span>
            </span>
          </a>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {homeContent.navbarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-white hover:text-brand-accent transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm text-white hover:text-brand-accent hover:bg-white/10 transition-all duration-200"
              >
                <Globe className="h-4 w-4" />
                <span className="font-semibold text-xs">{selectedLang}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
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

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-white hover:text-brand-accent hover:bg-white/10 relative transition-all duration-200"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-brand-darkest" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-brand-darkest border border-slate-100 dark:border-brand-dark/20 rounded-2xl shadow-2xl p-4 text-slate-800 dark:text-white z-50 animate-fadeIn">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-brand-dark/10">
                    <span className="font-bold text-sm">Notifications</span>
                    <span className="text-[10px] text-brand-medium dark:text-brand-accent bg-brand-medium/10 px-2 py-0.5 rounded-full font-semibold">1 New</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="flex space-x-3 p-2 hover:bg-slate-50 dark:hover:bg-brand-dark/10 rounded-xl transition-colors duration-150 cursor-pointer">
                      <div className="h-2 w-2 bg-brand-accent rounded-full mt-2 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Rainfall Alert - Crop Safe Mode</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Heavy rainfall expected within 12 hours. Secure irrigation.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-white hover:text-brand-accent hover:bg-white/10 transition-all duration-200"
              title="Toggle Light/Dark Theme"
            >
              {darkMode ? (
                <Sun className="h-4.5 w-4.5 text-brand-accent rotate-0 transition-transform duration-300" />
              ) : (
                <Moon className="h-4.5 w-4.5 hover:text-brand-accent rotate-0 transition-transform duration-300" />
              )}
            </button>

            {/* User Profile */}
            <button className="h-9 w-9 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-brand-darkest transition-all duration-300">
              <User className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Right: Hamburger Mobile Button */}
          <div className="flex items-center space-x-3 md:hidden">
            
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-white/80 hover:text-white transition-all duration-200"
            >
              {darkMode ? <Sun className="h-5 w-5 text-brand-accent" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-brand-darkest/98 dark:bg-brand-darkest/98 z-40 md:hidden animate-slideDown border-t border-brand-light/10">
          <div className="px-6 py-8 flex flex-col space-y-6">
            
            {/* Navigation links */}
            {homeContent.navbarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-white/90 hover:text-brand-accent transition-colors duration-200 border-b border-white/5 pb-3"
              >
                {link.label}
              </a>
            ))}

            {/* Sub-actions in mobile */}
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Selected Language</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Globe className="h-4 w-4" /> {selectedLang}
                </span>
              </div>
              <button
                className="w-full py-3 bg-brand-accent text-brand-darkest font-bold rounded-xl text-center active:scale-[0.98] transition-transform duration-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Launch Dashboard
              </button>
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
}
