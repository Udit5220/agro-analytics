import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  Check,
  Users,
  Sprout,
  TrendingUp,
  Factory,
  FlaskConical,
  Building2,
  Settings,
  Briefcase,
} from "lucide-react";
import { useRole, ROLES } from "../context/RoleContext";

// Icon mapping for roles
const RoleIcon = ({ roleId, className = "w-4 h-4" }) => {
  const icons = {
    farmer: <Sprout className={className} />,
    fpo: <Users className={className} />,
    trader: <TrendingUp className={className} />,
    procurement: <Factory className={className} />,
    researcher: <FlaskConical className={className} />,
    government: <Building2 className={className} />,
    admin: <Settings className={className} />,
    company: <Briefcase className={className} />,
  };
  return icons[roleId] || <Sprout className={className} />;
};

export default function RoleSelector() {
  const { activeRole, roleConfig, switchRole, allRoles } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleRoleSelect = (roleId) => {
    switchRole(roleId);
    setIsOpen(false);
  };

  const isPolicySim = location.pathname.includes("/policy-sim");

  const displayedRoles = isPolicySim
    ? Object.entries(allRoles).filter(([key, role]) =>
        ["farmer", "fpo", "government", "company", "admin"].includes(role.id)
      )
    : Object.entries(allRoles);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Role Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2 text-white text-xs font-semibold hover:bg-white/20 transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        <RoleIcon roleId={activeRole} className="w-3.5 h-3.5 text-[#ecf39e]" />
        <span>{roleConfig.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 text-[#ecf39e] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-brand-darkest rounded-xl shadow-xl border border-gray-100 dark:border-brand-dark/30 z-50 overflow-hidden animate-fadeIn text-gray-800 dark:text-gray-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-brand-dark/10 border-b border-gray-100 dark:border-brand-dark/20">
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400">
              Switch Role / भूमिका बदलें
            </p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 font-medium">
              Each role has specialized features
            </p>
          </div>

          {/* Role List */}
          <div className="max-h-96 overflow-y-auto">
            {displayedRoles.map(([key, role]) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  w-full px-4 py-3 flex items-start gap-3 text-left
                  transition-colors duration-150 border-b border-gray-100 dark:border-brand-dark/10 last:border-b-0 cursor-pointer
                  ${
                    activeRole === role.id
                      ? "bg-[#31572c]/10 dark:bg-[#31572c]/20 hover:bg-[#31572c]/15 dark:hover:bg-[#31572c]/25"
                      : "hover:bg-gray-50 dark:hover:bg-brand-dark/10"
                  }
                `}
              >
                {/* Icon */}
                <div
                  className={`
                  w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                  ${
                    activeRole === role.id
                      ? "bg-[#31572c]/20 text-[#31572c] dark:text-[#ecf39e]"
                      : "bg-gray-100 dark:bg-brand-dark/30 text-gray-600 dark:text-slate-400"
                  }
                `}
                >
                  <RoleIcon roleId={role.id} className="w-4.5 h-4.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold ${
                        activeRole === role.id
                          ? "text-[#1e4638] dark:text-[#ecf39e]"
                          : "text-gray-700 dark:text-slate-300"
                      }`}
                    >
                      {role.label}
                    </span>
                    {activeRole === role.id && (
                      <Check className="w-3.5 h-3.5 text-[#31572c] dark:text-[#ecf39e] shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {role.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-brand-dark/30 rounded-full text-gray-500 dark:text-slate-400 font-semibold"
                      >
                        {feature}
                      </span>
                    ))}
                    {role.features.length > 3 && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-brand-dark/30 rounded-full text-gray-400 dark:text-slate-500 font-semibold">
                        +{role.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 dark:bg-brand-dark/10 border-t border-gray-100 dark:border-brand-dark/20">
            <p className="text-[9px] text-gray-400 dark:text-slate-500 text-center font-semibold">
              Features adapt based on your selected role
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
