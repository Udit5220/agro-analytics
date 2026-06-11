import React, { useState, useEffect, useRef } from "react";
import {
  Sprout,
  Globe,
  Sun,
  Moon,
  Bell,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle,
  Tractor,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { uiConfig } from "../../utils/uiConfig";
import { homeContent } from "../../content/homeContent";
import { useRole } from "../../context/RoleContext";

export default function Navbar() {
  const { activeRole, switchRole, allRoles } = useRole();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Monitor scroll for transition styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync dark mode class
  const toggleDarkMode = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
          ? "bg-brand-lightest/95 backdrop-blur-md shadow-md py-3"
          : "bg-brand-lightest/80 backdrop-blur-[2px] py-5"
      }`}
    >
      <div className={uiConfig.layout.container}>
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="p-2 bg-brand-darkest/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Sprout className="h-6 w-6 text-brand-darkest" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-darkest">
              AgroIndia
              <span className="text-brand-medium font-extrabold">.</span>
            </span>
          </a>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {homeContent.navbarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-brand-darkest/85 hover:text-brand-darkest transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-brand-darkest transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="h-9 w-9 rounded-full bg-brand-darkest/10 flex items-center justify-center text-brand-darkest hover:bg-brand-dark hover:text-brand-darkest transition-all duration-300 text-base cursor-pointer"
                title={`Active Role: ${allRoles[activeRole.toUpperCase()]?.label || activeRole}`}
              >
                {allRoles[activeRole.toUpperCase()]?.icon || "🌾"}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-brand-darkest rounded-xl shadow-xl border border-gray-100 dark:border-brand-dark/30 z-50 p-3.5 animate-fadeIn">
                  {/* Top: User Info */}
                  <div className="flex items-center gap-3 pb-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-dark flex items-center justify-center text-lg shrink-0 shadow-inner">
                      {allRoles[activeRole.toUpperCase()]?.icon || "🌾"}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {activeRole === "government" ? "Govt Official" : activeRole === "admin" ? "Admin User" : activeRole === "company" ? "Agribusiness User" : activeRole === "fpo" ? "FPO Manager" : "Suresh Kumar"}
                      </h4>
                      <p className="text-[9px] text-gray-500 dark:text-slate-400 font-extrabold uppercase tracking-wider truncate">
                        {allRoles[activeRole.toUpperCase()]?.label || activeRole}
                      </p>
                    </div>
                    <span
                      className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-500/20"
                      title="Active Session"
                    />
                  </div>

                  {/* Switch Role Section */}
                  <div className="border-t border-gray-100 dark:border-brand-dark/20 pt-2 pb-1.5">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 px-1">Switch Active Role</p>
                    <div className="relative">
                      <select
                        value={activeRole}
                        onChange={(e) => {
                          const newRole = e.target.value;
                          switchRole(newRole);
                          setIsProfileOpen(false);
                          // Route seamlessly based on current module if any
                          if (moduleId) {
                            navigate(`/module/${moduleId}`);
                          }
                        }}
                        className="w-full bg-gray-50 dark:bg-brand-dark/30 border border-gray-200 dark:border-brand-light/10 text-xs text-gray-800 dark:text-white rounded-lg px-2 py-1.5 font-bold focus:outline-none focus:ring-1 focus:ring-brand-medium cursor-pointer"
                      >
                        {Object.values(allRoles).map((role) => (
                          <option key={role.id} value={role.id} className="text-gray-950 font-bold bg-white">
                            {role.icon} {role.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-brand-dark/20 my-2" />

                  {/* Quick Links */}
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/module/profile");
                      }}
                      className="w-full text-left text-gray-700 dark:text-slate-300 hover:bg-brand-lightest dark:hover:bg-brand-dark/20 rounded-lg px-2 py-1.5 transition-all text-xs flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <UserCircle className="h-3.5 w-3.5 text-brand-medium" />
                      My Profile
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-brand-dark/20 my-2" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs py-2 rounded-lg transition-all duration-200 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Hamburger Mobile Button */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-darkest hover:text-brand-medium hover:bg-brand-darkest/10 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-brand-darkest" />
              ) : (
                <Menu className="h-6 w-6 text-brand-darkest" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-brand-lightest z-40 md:hidden animate-slideDown">
          <div className="px-6 py-8 flex flex-col space-y-6">
            {/* Navigation links */}
            {homeContent.navbarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-brand-darkest hover:text-brand-medium transition-colors duration-200 border-b border-brand-darkest/10 pb-3"
              >
                {link.label}
              </a>
            ))}

            {/* Sub-actions in mobile */}
            <div className="flex flex-col space-y-4 pt-4">
              <button
                type="button"
                className="w-full py-3 bg-brand-medium text-brand-darkest font-bold rounded-xl text-center active:scale-[0.98] transition-transform duration-100 cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/module/crop-recommendation");
                }}
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
