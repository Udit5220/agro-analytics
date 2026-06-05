import React, { createContext, useContext, useState, useEffect } from "react";

// Role definitions with full configurations
export const ROLES = {
  FARMER: {
    id: "farmer",
    label: "Farmer / किसान",
    icon: "🌾",
    color: "green",
    badgeColor: "bg-green-100 text-green-800",
    buttonColor: "bg-green-600 hover:bg-green-700",
    description:
      "Crop advice, disease detection, weather guidance, government schemes",
    features: [
      "Crop Advisory",
      "Disease Detection",
      "Weather & Irrigation",
      "Scheme Finder",
    ],
  },
  FPO: {
    id: "fpo",
    label: "FPO Manager",
    icon: "👥",
    color: "blue",
    badgeColor: "bg-blue-100 text-blue-800",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    description:
      "Member monitoring, collective planning, bulk procurement, marketing",
    features: [
      "Member Monitoring",
      "Crop Planning",
      "Bulk Procurement",
      "Collective Marketing",
      "Scheme Facilitation",
      "Credit Scoring",
    ],
  },
  TRADER: {
    id: "trader",
    label: "Commodity Trader",
    icon: "📈",
    color: "amber",
    badgeColor: "bg-amber-100 text-amber-800",
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    description: "Price forecasting, arbitrage detection, arrival prediction",
    features: [
      "Price Forecast",
      "Arbitrage Detection",
      "Arrival Prediction",
      "Counterparty Risk",
      "Trade Signals",
    ],
  },
  PROCUREMENT: {
    id: "procurement",
    label: "Procurement Manager",
    icon: "🏭",
    color: "purple",
    badgeColor: "bg-purple-100 text-purple-800",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    description:
      "Sourcing optimization, supply forecasting, quality prediction",
    features: [
      "Sourcing Optimization",
      "Supply Forecast",
      "Quality Prediction",
      "Supplier Scorecard",
    ],
  },
  RESEARCHER: {
    id: "researcher",
    label: "Research Analyst",
    icon: "🔬",
    color: "indigo",
    badgeColor: "bg-indigo-100 text-indigo-800",
    buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    description: "Paper summarization, research Q&A, citation generation",
    features: [
      "PDF Summarization",
      "Research Q&A",
      "Cross-Paper Analysis",
      "Citation Generator",
    ],
  },
  GOVERNMENT: {
    id: "government",
    label: "Government Official",
    icon: "🏛️",
    color: "red",
    badgeColor: "bg-red-100 text-red-800",
    buttonColor: "bg-red-600 hover:bg-red-700",
    description: "Crop estimation, scheme tracking, disaster assessment",
    features: [
      "Crop Area Estimation",
      "Scheme Adoption",
      "Disaster Assessment",
      "Price Monitoring",
      "Policy Recommendations",
    ],
  },
  COMPANY: {
    id: "company",
    label: "Company / Agribusiness",
    icon: "💼",
    color: "emerald",
    badgeColor: "bg-emerald-100 text-emerald-800",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
    description: "Sourcing, demand forecasting, contract farming, inventory planning, market expansion",
    features: [
      "Executive Supply Command Center",
      "Demand & Supply Planning Center",
      "Contract Farming Intelligence",
      "Yield & Production Forecast Center",
      "Commodity Opportunity Engine",
      "Regional Suitability & Expansion Engine",
      "Supply Chain Performance Intelligence",
      "Procurement & Inventory Intelligence",
      "Market Expansion & Opportunity Intelligence",
    ],
  },
  ADMIN: {
    id: "admin",
    label: "Company Admin",
    icon: "⚙️",
    color: "slate",
    badgeColor: "bg-slate-100 text-slate-800",
    buttonColor: "bg-slate-600 hover:bg-slate-700",
    description: "Platform analytics, AI monitoring, configuration management",
    features: [
      "Analytics",
      "AI Monitoring",
      "Prompt Management",
      "User Management",
      "Billing",
    ],
  },
};

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem("activeRole");
    return saved && ROLES[saved.toUpperCase()] ? saved : "farmer";
  });

  const [roleConfig, setRoleConfig] = useState(
    () => ROLES[activeRole.toUpperCase()] || ROLES.FARMER,
  );

  // Update role config when active role changes
  useEffect(() => {
    const config = ROLES[activeRole.toUpperCase()] || ROLES.FARMER;
    setRoleConfig(config);
    localStorage.setItem("activeRole", activeRole);

    // Dispatch custom event for components that don't use context
    window.dispatchEvent(
      new CustomEvent("roleChanged", {
        detail: { role: activeRole, config },
      }),
    );
  }, [activeRole]);

  const switchRole = (roleId) => {
    if (ROLES[roleId.toUpperCase()]) {
      setActiveRole(roleId.toLowerCase());
    }
  };

  const value = {
    activeRole,
    roleConfig,
    switchRole,
    isRole: (roleId) => activeRole === roleId.toLowerCase(),
    allRoles: ROLES,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export default RoleContext;
