import React from "react";
import { NavLink, Link, useParams } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { dashboardContent } from "../../content/dashboardContent";
import { uiConfig } from "../../utils/uiConfig";

import { useRole } from "../../context/RoleContext";

export default function GenericSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { moduleId } = useParams();
  const { userProfile, sidebarMenus } = dashboardContent;
  const { activeRole } = useRole();

  // Resolve default active menu array based on active moduleId path param
  let activeModuleKey = moduleId;
  if (moduleId && sidebarMenus[moduleId]) {
    sessionStorage.setItem("lastActiveModule", moduleId);
  } else {
    const saved = sessionStorage.getItem("lastActiveModule");
    activeModuleKey =
      saved && sidebarMenus[saved] ? saved : "crop-recommendation";
  }

  let currentMenu = sidebarMenus[activeModuleKey];
  if (activeModuleKey === "disease-detection") {
    if (activeRole === "farmer") {
      // Inherits default farmer items from sidebarMenus
    } else if (activeRole === "company" || activeRole === "admin") {
      currentMenu = [
        {
          label: "Executive Operations",
          path: "dashboard",
          icon: "LayoutDashboard",
        },
        {
          label: "Global Intelligence",
          path: "global-intelligence",
          icon: "Globe",
        },
        {
          label: "Customer Risk Monitoring",
          path: "customer-risk",
          icon: "Users",
        },
        {
          label: "AI Model Performance",
          path: "model-performance",
          icon: "Cpu",
        },
        { label: "Alert Operations", path: "alerts", icon: "Bell" },
        {
          label: "Intervention Effectiveness",
          path: "interventions",
          icon: "ShieldAlert",
        },
        { label: "Platform Impact", path: "platform-impact", icon: "Award" },
        { label: "Operational Control", path: "operations", icon: "Sliders" },
        {
          label: "Intelligence Repository",
          path: "repository",
          icon: "Database",
        },
      ];
    } else if (activeRole === "government") {
      currentMenu = [
        { label: "National Command Center", path: "", icon: "LayoutDashboard" },
        {
          label: "Disease Surveillance Network",
          path: "surveillance",
          icon: "Radio",
        },
        { label: "National Risk Map", path: "risk-map", icon: "Map" },
        {
          label: "Early Warning Center",
          path: "early-warning",
          icon: "Compass",
        },
        {
          label: "Outbreak Response Management",
          path: "outbreak-response",
          icon: "Activity",
        },
        {
          label: "Resource & Field Operations",
          path: "field-operations",
          icon: "Users",
        },
        {
          label: "Food Security Impact Monitor",
          path: "food-security",
          icon: "ShieldAlert",
        },
        {
          label: "Policy & Intervention",
          path: "policy-interventions",
          icon: "ClipboardList",
        },
        { label: "Historical Repository", path: "history", icon: "History" },
      ];
    } else {
      currentMenu = [
        { label: "Executive Dashboard", path: "", icon: "LayoutDashboard" },
        { label: "Outbreak Monitoring", path: "outbreaks", icon: "Activity" },
        { label: "Disease Intelligence Map", path: "map", icon: "Map" },
        { label: "Farmer Case Management", path: "cases", icon: "Users" },
        { label: "Risk Forecasting", path: "predictions", icon: "TrendingUp" },
        {
          label: "Treatment Campaign Center",
          path: "campaigns",
          icon: "Shield",
        },
        { label: "Disease Alerts & Advisories", path: "alerts", icon: "Bell" },
        { label: "Impact Analytics", path: "analytics", icon: "BarChart3" },
        {
          label: "Historical Disease Intelligence",
          path: "history",
          icon: "History",
        },
      ];
    }
  } else if (
    activeModuleKey === "crop-recommendation" &&
    activeRole !== "farmer"
  ) {
    if (activeRole === "government") {
      currentMenu = [
        { label: "National Command Center", path: "", icon: "LayoutDashboard" },
        {
          label: "Food Security Center",
          path: "food-security",
          icon: "Shield",
        },
        {
          label: "Strategic Intervention",
          path: "strategic-intervention",
          icon: "Activity",
        },
        {
          label: "Crop Intelligence",
          path: "crop-intelligence",
          icon: "Sprout",
        },
        {
          label: "Climate Risk Center",
          path: "climate-risk",
          icon: "CloudLightning",
        },
        {
          label: "Water Security Center",
          path: "water-security",
          icon: "Droplets",
        },
        { label: "Pest & Disease Monitor", path: "pest-disease", icon: "Bug" },
        {
          label: "Policy Impact Intel",
          path: "policy-impact",
          icon: "LineChart",
        },
        {
          label: "Subsidy & Scheme Intel",
          path: "subsidy-intelligence",
          icon: "Coins",
        },
        {
          label: "Regional Performance Intel",
          path: "regional-performance",
          icon: "Map",
        },
        { label: "Policy Simulation Lab", path: "policy-sim", icon: "Cpu" },
      ];
    } else if (activeRole === "company" || activeRole === "admin") {
      currentMenu = [
        {
          label: "Executive Supply Command Center",
          path: "",
          icon: "LayoutDashboard",
        },
        {
          label: "Demand & Supply Planning Center",
          path: "demand-supply",
          icon: "CalendarRange",
        },
        {
          label: "Contract Farming Intelligence",
          path: "contract-farming",
          icon: "FileText",
        },
        {
          label: "Yield & Production Forecast",
          path: "yield-forecast",
          icon: "TrendingUp",
        },
        {
          label: "Commodity Opportunity Engine",
          path: "commodity-opportunity",
          icon: "Coins",
        },
        {
          label: "Regional Suitability & Expansion",
          path: "regional-suitability",
          icon: "MapPin",
        },
        {
          label: "Supply Chain Performance Intel",
          path: "supply-chain-performance",
          icon: "Award",
        },
        {
          label: "Procurement & Inventory Intel",
          path: "procurement-inventory",
          icon: "Warehouse",
        },
        {
          label: "Market Expansion & Opportunity",
          path: "market-expansion",
          icon: "Compass",
        },
      ];
    } else {
      currentMenu = [
        { label: "FPO Command Center", path: "", icon: "LayoutDashboard" },
        {
          label: "Crop Planning & Allocation",
          path: "crop-planning",
          icon: "Sprout",
        },
        {
          label: "Production Forecast Center",
          path: "forecast-center",
          icon: "TrendingUp",
        },
        {
          label: "Input Demand Intelligence",
          path: "demand-forecast",
          icon: "LineChart",
        },
        {
          label: "Farmer Engagement & Adoption",
          path: "adoption-analytics",
          icon: "Users",
        },
        {
          label: "Procurement & Aggregation Intelligence",
          path: "procurement",
          icon: "ShoppingCart",
        },
        {
          label: "Market Linkage & Buyer Intelligence",
          path: "market-linkage",
          icon: "Compass",
        },
        {
          label: "Risk Intelligence Center",
          path: "risk-intelligence",
          icon: "ShieldAlert",
        },
        {
          label: "Farmer Income & Business Performance",
          path: "benchmarking",
          icon: "BarChart3",
        },
      ];
    }
  } else if (
    activeModuleKey === "ai-assistant-1" &&
    (activeRole === "admin" || activeRole === "company")
  ) {
    currentMenu = [
      { label: "Executive Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "User Analytics", path: "user-analytics", icon: "Users" },
      {
        label: "Conversation Intelligence",
        path: "conversation-intelligence",
        icon: "MessageSquare",
      },
      { label: "Intent Analysis", path: "intent-analysis", icon: "Compass" },
      {
        label: "Sentiment Analysis",
        path: "sentiment-analysis",
        icon: "Smile",
      },
      {
        label: "Problem Detection",
        path: "problem-detection",
        icon: "AlertTriangle",
      },
      {
        label: "Regional Intelligence",
        path: "regional-intelligence",
        icon: "Map",
      },
      { label: "Model Intelligence", path: "model-intelligence", icon: "Cpu" },
      {
        label: "Advisory Intelligence",
        path: "advisory-intelligence",
        icon: "ClipboardList",
      },
      {
        label: "Disease Intelligence",
        path: "disease-intelligence",
        icon: "Activity",
      },
      {
        label: "Farmer Success Analytics",
        path: "farmer-success",
        icon: "TrendingUp",
      },
      {
        label: "Knowledge Base Intel",
        path: "knowledge-base-intelligence",
        icon: "BookOpen",
      },
    ];
  } else if (activeModuleKey === "ai-suggestion" && activeRole === "farmer") {
    currentMenu = [
      { label: "AI Assistant", path: "", icon: "MessageSquare" },
      { label: "Crop Advisory", path: "crop-advisory", icon: "Sprout" },
      { label: "Disease Detection", path: "disease", icon: "Syringe" },
      { label: "Fertilizer Planner", path: "fertilizer-plan", icon: "Leaf" },
      {
        label: "Irrigation Scheduler",
        path: "irrigation-guide",
        icon: "Droplets",
      },
      { label: "Scheme Finder", path: "scheme-finder", icon: "Shield" },
    ];
  } else if (activeModuleKey === "gov-schemes" && activeRole === "farmer") {
    currentMenu = [
      { label: "Farm Dashboard", path: "", icon: "LayoutDashboard" },
      { label: "Scheme Discovery Center", path: "discovery", icon: "Compass" },
      { label: "Scheme Details", path: "scheme-details", icon: "FileText" },
      {
        label: "Eligibility Center",
        path: "eligibility",
        icon: "CheckCircle2",
      },
      { label: "My Applications", path: "applications", icon: "FolderKanban" },
      { label: "Benefits Wallet", path: "benefits", icon: "Wallet" },
      { label: "Subsidy Center", path: "subsidy", icon: "Sprout" },
      { label: "Crop Insurance", path: "insurance", icon: "Shield" },
      { label: "KCC & Loans", path: "loans", icon: "CreditCard" },
      { label: "Document Vault", path: "documents", icon: "FolderKanban" },
      { label: "Scheme Calendar", path: "calendar", icon: "Calendar" },
      { label: "AI Advisor", path: "advisor", icon: "MessageSquare" },
    ];
  } else if (activeModuleKey === "gov-schemes" && activeRole === "fpo") {
    currentMenu = [
      {
        label: "Opportunity Command Center",
        path: "",
        icon: "LayoutDashboard",
      },
      { label: "Opportunity Explorer", path: "explorer", icon: "Compass" },
      { label: "Funding Pipeline", path: "pipeline", icon: "FolderKanban" },
      {
        label: "Eligibility & Readiness",
        path: "readiness",
        icon: "CheckCircle2",
      },
      { label: "Member Benefit Coverage", path: "coverage", icon: "Users" },
      {
        label: "Infrastructure Support",
        path: "infrastructure",
        icon: "Building2",
      },
      {
        label: "Impact Analytics Center",
        path: "analytics",
        icon: "BarChart3",
      },
      {
        label: "Compliance & Documentation",
        path: "compliance",
        icon: "FileText",
      },
      { label: "Strategic Simulator", path: "simulator", icon: "PlayCircle" },
      {
        label: "AI Opportunity Advisor",
        path: "advisor",
        icon: "MessageSquare",
      },
    ];
  } else if (activeModuleKey === "gov-schemes" && activeRole === "government") {
    currentMenu = [
      { label: "Governance Command Center", path: "", icon: "LayoutDashboard" },
      {
        label: "Scheme Performance",
        path: "scheme-performance",
        icon: "Activity",
      },
      {
        label: "Beneficiary Coverage",
        path: "beneficiary-coverage",
        icon: "Users",
      },
      {
        label: "FPO Ecosystem Monitoring",
        path: "fpo-ecosystem",
        icon: "Network",
      },
      {
        label: "Budget & Financials",
        path: "budget-utilization",
        icon: "CircleDollarSign",
      },
      {
        label: "Service Delivery",
        path: "application-monitoring",
        icon: "Clock",
      },
      {
        label: "Infrastructure Assets",
        path: "infrastructure-intelligence",
        icon: "Building2",
      },
      {
        label: "Policy Impact Analytics",
        path: "policy-impact",
        icon: "BarChart3",
      },
      {
        label: "Compliance & Governance",
        path: "compliance-audit",
        icon: "ShieldAlert",
      },
      {
        label: "AI Policy Command Center",
        path: "policy-command",
        icon: "Bot",
      },
    ];
  }

  return (
    <aside className="w-[200px] bg-[#31572c] flex flex-col justify-between shrink-0 h-full min-h-0 p-4 text-white overflow-hidden border-r border-[#e5e2dc]/10">
      <div className="flex flex-col min-h-0 flex-1">
        {/* Top Header & Collapsible Close Button */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <LucideIcons.Sprout className="h-[18px] w-[18px] text-[#6bc46b]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-white/70">
              Navigation
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl p-1.5 transition-all duration-200 active:scale-[0.95] cursor-pointer"
            title="Close Navigation Panel"
          >
            <LucideIcons.X className="h-[17px] w-[17px]" />
          </button>
        </div>

        {/* Dynamic Nav List */}
        <nav className="space-y-1.5 mt-4 flex-1 overflow-y-auto overscroll-contain pr-0.5">
          {currentMenu.map((item, idx) => {
            const IconComponent =
              LucideIcons[item.icon] || LucideIcons.HelpCircle;
            const pathUrl = item.path
              ? `/module/${activeModuleKey}/${item.path}`
              : `/module/${activeModuleKey}`;

            return (
              <NavLink
                key={idx}
                to={pathUrl}
                end
                className={({ isActive }) =>
                  `min-h-[2.25rem] px-3 py-2 flex items-start gap-2.5 w-full transition-all duration-200 text-[10.5px] rounded-xl group ${
                    isActive
                      ? "bg-[#e8f5e8] text-[#31572c] font-semibold shadow-sm"
                      : "text-[#a3b8a3] hover:text-white hover:bg-white/5 font-medium"
                  }`
                }
                title={item.label}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      className={`h-[17px] w-[17px] shrink-0 transition-transform duration-200 group-hover:scale-110 mt-0.5 ${
                        isActive
                          ? "text-[#31572c]"
                          : "text-[#a3b8a3] group-hover:text-white"
                      }`}
                    />

                    <span className="whitespace-normal leading-snug break-words text-left flex-1 pr-1">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Fixed Bottom Profile Block (Isolated at bottom) */}
      <div className="pt-4 flex items-center justify-between gap-2.5 overflow-hidden border-t border-white/5 mt-4">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {/* Avatar Emblems */}
          <div className="h-9 w-9 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center text-[12px] shrink-0 border border-white/5">
            {userProfile.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <h4
              className="text-white font-bold text-xs tracking-wide truncate"
              title={userProfile.name}
            >
              {userProfile.name}
            </h4>
            <p className="text-[9px] font-medium text-[#a3b8a3] flex items-center space-x-1 mt-0.5 min-w-0">
              <span className="truncate" title={userProfile.role}>
                {userProfile.role}
              </span>
              <span className="text-white/20 shrink-0">•</span>
              <span className="text-[9px] font-bold bg-[#e8f5e8] text-[#31572c] px-1.5 py-0.5 rounded-md shrink-0">
                {userProfile.hindiRole}
              </span>
            </p>
          </div>
        </div>

        {/* Pinned Exit Button */}
        <Link
          to="/"
          title="Sign Out"
          className="text-[#a3b8a3] hover:text-white hover:bg-white/5 p-2 rounded-xl transition-all duration-300 active:scale-[0.92]"
        >
          <LucideIcons.LogOut className="h-[17px] w-[17px]" />
        </Link>
      </div>
    </aside>
  );
}
