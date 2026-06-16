import React from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { dashboardContent } from '../../content/dashboardContent';
import { useAITranslation } from '../../hooks/useAITranslation';
import { useRole } from '../../context/RoleContext';

export default function GenericSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { moduleId } = useParams();
  const { userProfile, sidebarMenus } = dashboardContent;
  const { activeRole } = useRole();

  // Resolve default active menu array based on active moduleId path param
  let activeModuleKey = moduleId;
  if (
    moduleId &&
    (sidebarMenus[moduleId] || moduleId === "crop-recommendation-1")
  ) {
    sessionStorage.setItem("lastActiveModule", moduleId);
  } else {
    const saved = sessionStorage.getItem("lastActiveModule");
    activeModuleKey =
      saved && (sidebarMenus[saved] || saved === "crop-recommendation-1")
        ? saved
        : "crop-recommendation";
  }

  // Force crop-recommendation vs crop-recommendation-1 based on active role
  if (
    activeModuleKey === "crop-recommendation" ||
    activeModuleKey === "crop-recommendation-1"
  ) {
    if (activeRole === "farmer") {
      activeModuleKey = "crop-recommendation";
    } else {
      activeModuleKey = "crop-recommendation-1";
    }
  }

  const [dynamicAdminMenu, setDynamicAdminMenu] = React.useState(null);
  const userRole = localStorage.getItem('userRole') || 'Farmer';
  const isCompanyAdmin = userRole === 'Company Admin';

  React.useEffect(() => {
    if (activeModuleKey === 'research-ai' && isCompanyAdmin) {
      const fetchAdminMenu = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/research/admin-menu', {
            headers: {
              'x-user-role': 'Company Admin',
              'x-language': localStorage.getItem('language') || 'English'
            }
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.menu)) {
              setDynamicAdminMenu(json.menu);
            }
          }
        } catch (err) {
          console.error("Failed to fetch dynamic admin menu:", err);
        }
      };
      fetchAdminMenu();
    }
  }, [activeModuleKey, isCompanyAdmin]);

  const [dynamicNewsMenu, setDynamicNewsMenu] = React.useState(null);

  React.useEffect(() => {
    if (activeModuleKey === 'news-intel') {
      const fetchNewsMenu = async () => {
        try {
          const res = await fetch('http://localhost:5000/api/news/sidebar-menu', {
            headers: {
              'x-user-role': userRole,
              'x-language': localStorage.getItem('language') || 'English'
            }
          });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.menu)) {
              setDynamicNewsMenu(json.menu);
            }
          }
        } catch (err) {
          console.error("Failed to fetch dynamic news menu:", err);
        }
      };
      fetchNewsMenu();
    }
  }, [activeModuleKey, userRole]);

  let currentMenu = sidebarMenus[activeModuleKey];
  if (activeModuleKey === "disease-detection") {
    if (activeRole === "farmer") {
      // Inherits default farmer items from sidebarMenus
    } else if (activeRole === "company" || activeRole === "admin") {
      currentMenu = [
        { label: "Executive Operations", path: "dashboard", icon: "LayoutDashboard" },
        { label: "Global Intelligence", path: "global-intelligence", icon: "Globe" },
        { label: "Customer Risk Monitoring", path: "customer-risk", icon: "Users" },
        { label: "AI Model Performance", path: "model-performance", icon: "Cpu" },
        { label: "Alert Operations", path: "alerts", icon: "Bell" },
        { label: "Intervention Effectiveness", path: "interventions", icon: "ShieldAlert" },
        { label: "Platform Impact", path: "platform-impact", icon: "Award" },
        { label: "Operational Control", path: "operations", icon: "Sliders" },
        { label: "Intelligence Repository", path: "repository", icon: "Database" },
      ];
    } else if (activeRole === "government") {
      currentMenu = [
        { label: "National Command Center", path: "", icon: "LayoutDashboard" },
        { label: "Disease Surveillance Network", path: "surveillance", icon: "Radio" },
        { label: "National Risk Map", path: "risk-map", icon: "Map" },
        { label: "Early Warning Center", path: "early-warning", icon: "Compass" },
        { label: "Outbreak Response Management", path: "outbreak-response", icon: "Activity" },
        { label: "Resource & Field Operations", path: "field-operations", icon: "Users" },
        { label: "Food Security Impact Monitor", path: "food-security", icon: "ShieldAlert" },
        { label: "Policy & Intervention", path: "policy-interventions", icon: "ClipboardList" },
        { label: "Historical Repository", path: "history", icon: "History" },
      ];
    } else {
      currentMenu = [
        { label: "Executive Dashboard", path: "", icon: "LayoutDashboard" },
        { label: "Outbreak Monitoring", path: "outbreaks", icon: "Activity" },
        { label: "Disease Intelligence Map", path: "map", icon: "Map" },
        { label: "Farmer Case Management", path: "cases", icon: "Users" },
        { label: "Risk Forecasting", path: "predictions", icon: "TrendingUp" },
        { label: "Treatment Campaign Center", path: "campaigns", icon: "Shield" },
        { label: "Disease Alerts & Advisories", path: "alerts", icon: "Bell" },
        { label: "Impact Analytics", path: "analytics", icon: "BarChart3" },
        { label: "Historical Disease Intelligence", path: "history", icon: "History" },
      ];
    }
  } else if (activeModuleKey === "crop-recommendation-1") {
    if (activeRole === "government") {
      currentMenu = [
        { label: "National Command Center", path: "", icon: "LayoutDashboard" },
        { label: "Food Security Center", path: "food-security", icon: "Shield" },
        { label: "Strategic Intervention", path: "strategic-intervention", icon: "Activity" },
        { label: "Crop Intelligence", path: "crop-intelligence", icon: "Sprout" },
        { label: "Climate Risk Center", path: "climate-risk", icon: "CloudLightning" },
        { label: "Water Security Center", path: "water-security", icon: "Droplets" },
        { label: "Pest & Disease Monitor", path: "pest-disease", icon: "Bug" },
        { label: "Policy Impact Intel", path: "policy-impact", icon: "LineChart" },
        { label: "Subsidy & Scheme Intel", path: "subsidy-intelligence", icon: "Coins" },
        { label: "Regional Performance Intel", path: "regional-performance", icon: "Map" },
        { label: "Policy Simulation Lab", path: "policy-sim", icon: "Cpu" },
      ];
    } else if (activeRole === "company" || activeRole === "admin") {
      currentMenu = [
        { label: "Executive Supply Command Center", path: "", icon: "LayoutDashboard" },
        { label: "Demand & Supply Planning Center", path: "demand-supply", icon: "CalendarRange" },
        { label: "Contract Farming Intelligence", path: "contract-farming", icon: "FileText" },
        { label: "Yield & Production Forecast", path: "yield-forecast", icon: "TrendingUp" },
        { label: "Commodity Opportunity Engine", path: "commodity-opportunity", icon: "Coins" },
        { label: "Regional Suitability & Expansion", path: "regional-suitability", icon: "MapPin" },
        { label: "Supply Chain Performance Intel", path: "supply-chain-performance", icon: "Award" },
        { label: "Procurement & Inventory Intel", path: "procurement-inventory", icon: "Warehouse" },
        { label: "Market Expansion & Opportunity", path: "market-expansion", icon: "Compass" },
      ];
    } else {
      currentMenu = [
        { label: "FPO Command Center", path: "", icon: "LayoutDashboard" },
        { label: "Crop Planning & Allocation", path: "crop-planning", icon: "Sprout" },
        { label: "Production Forecast Center", path: "forecast-center", icon: "TrendingUp" },
        { label: "Input Demand Intelligence", path: "demand-forecast", icon: "LineChart" },
        { label: "Farmer Engagement & Adoption", path: "adoption-analytics", icon: "Users" },
        { label: "Procurement & Aggregation Intelligence", path: "procurement", icon: "ShoppingCart" },
        { label: "Market Linkage & Buyer Intelligence", path: "market-linkage", icon: "Compass" },
        { label: "Risk Intelligence Center", path: "risk-intelligence", icon: "ShieldAlert" },
        { label: "Farmer Income & Business Performance", path: "benchmarking", icon: "BarChart3" },
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
  } else if (activeModuleKey === "research-ai") {
    if (isCompanyAdmin) {
      currentMenu = dynamicAdminMenu || [
        { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
        { label: "Research Summary", path: "summary", icon: "FileText" },
        { label: "Admin Panel", path: "admin", icon: "Activity" },
        { label: "Model Settings", path: "settings", icon: "Settings" }
      ];
    } else {
      currentMenu = [
        { label: "Overview Dashboard", path: "", icon: "LayoutDashboard" },
        { label: "Research Summary", path: "summary", icon: "FileText" }
      ];
    }
  } else if (activeModuleKey === "news-intel") {
    currentMenu = dynamicNewsMenu || sidebarMenus[activeModuleKey];
  }

  const isGreenSidebar = activeModuleKey === 'research-ai' || activeModuleKey === 'news-intel';

  const uiStrings = currentMenu.map(menu => menu.label).concat(["Navigation"]);
  const { t } = useAITranslation(uiStrings);

  return (
    <aside className={isGreenSidebar
      ? "w-full md:w-64 bg-[#132a13] border-r border-[#31572c]/40 flex flex-col justify-between shrink-0 h-full min-h-0 p-4 text-white overflow-hidden transition-colors duration-300"
      : "w-full md:w-64 bg-white dark:bg-[#132a13] border-r border-gray-200 dark:border-[#31572c]/40 flex flex-col justify-between shrink-0 h-full min-h-0 p-4 text-gray-800 dark:text-white overflow-hidden transition-colors duration-300"
    }>
      
      <div className="flex flex-col min-h-0 flex-1">
        {/* Top Header & Collapsible Close Button */}
        <div className={isGreenSidebar
          ? "flex items-center justify-between pb-3 border-b border-[#31572c]/30"
          : "flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#31572c]/30"
        }>
          <div className="flex items-center space-x-2">
            <LucideIcons.Sprout className={isGreenSidebar ? "h-4 w-4 text-[#ecf39e]" : "h-4 w-4 text-emerald-600 dark:text-[#ecf39e]"} />
            <span className={isGreenSidebar
              ? "text-[10px] font-bold tracking-widest uppercase text-gray-400"
              : "text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400"
            }>{t("Navigation")}</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className={isGreenSidebar
              ? "bg-[#4f772d]/25 hover:bg-[#4f772d]/45 text-gray-300 hover:text-white border border-[#90a955]/20 rounded-lg p-1.5 transition-all duration-200 active:scale-[0.95]"
              : "bg-gray-50 dark:bg-[#4f772d]/25 hover:bg-gray-100 dark:hover:bg-[#4f772d]/45 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-200 dark:border-[#90a955]/20 rounded-lg p-1.5 transition-all duration-200 active:scale-[0.95]"
            }
            title="Close Navigation Panel"
          >
            <LucideIcons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Nav List */}
        <nav className="space-y-1 mt-3 flex-1 overflow-y-auto overscroll-contain pr-0.5 scrollbar-thin">
          {currentMenu.map((item, idx) => {
            if (item.type === 'header' || item.isHeader) {
              return (
                <div key={idx} className={isGreenSidebar
                  ? "text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2 px-3"
                  : "text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-4 mb-2 px-3"
                }>
                  {t(item.label)}
                </div>
              );
            }

            const IconComponent = LucideIcons[item.icon] || LucideIcons.HelpCircle;
            // Build the absolute routing link to avoid subpath mismatch errors and trailing slash issues
            const pathUrl = item.path ? `/module/${activeModuleKey}/${item.path}` : `/module/${activeModuleKey}`;
            
            return (
              <NavLink
                key={idx}
                to={pathUrl}
                end
                className={({ isActive }) => {
                  if (isGreenSidebar) {
                    return `flex items-center gap-3 w-full transition-all duration-200 font-semibold text-xs py-2 px-4 rounded-lg relative group ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs font-bold'
                        : 'text-gray-300 hover:bg-[#4f772d]/30 hover:text-white'
                    }`;
                  }
                  return `flex items-center gap-3 w-full transition-all duration-200 font-semibold text-xs py-2 px-4 rounded-lg relative group ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-600 text-emerald-900 dark:text-white shadow-xs font-bold'
                      : 'text-gray-650 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-[#4f772d]/20 hover:text-emerald-900 dark:hover:text-white'
                  }`;
                }}
                title={item.label}
              >
                {({ isActive }) => (
                  <>
                    <IconComponent className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isGreenSidebar
                        ? (isActive ? 'text-white' : 'text-gray-400 group-hover:text-white')
                        : (isActive ? 'text-emerald-600 dark:text-white' : 'text-gray-400 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-white')
                    }`} />
                    
                    <span>{t(item.label)}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Fixed Bottom Profile Block (Isolated at bottom) */}
      <div className={isGreenSidebar
        ? "border-t border-[#31572c]/30 pt-4 flex items-center justify-between"
        : "border-t border-gray-200 dark:border-[#31572c]/30 pt-4 flex items-center justify-between"
      }>
        <div className="flex items-center space-x-2.5">
          {/* Avatar Emblems */}
          <div className={isGreenSidebar
            ? "h-8 w-8 rounded-lg bg-[#4f772d]/30 border border-[#90a955]/30 text-[#ecf39e] font-bold flex items-center justify-center text-[11px] shrink-0"
            : "h-8 w-8 rounded-lg bg-emerald-100 dark:bg-[#4f772d]/30 border border-emerald-200 dark:border-[#90a955]/30 text-emerald-800 dark:text-[#ecf39e] font-bold flex items-center justify-center text-[11px] shrink-0"
          }>
            {userProfile.avatar}
          </div>
          <div>
            <h4 className={isGreenSidebar ? "text-white font-bold text-xs tracking-wide" : "text-gray-900 dark:text-white font-bold text-xs tracking-wide"}>
              {userProfile.name}
            </h4>
            <p className={isGreenSidebar
              ? "text-[9px] font-medium text-gray-400 flex items-center space-x-1 mt-0.5"
              : "text-[9px] font-medium text-gray-500 dark:text-gray-400 flex items-center space-x-1 mt-0.5"
            }>
              <span>{userProfile.role}</span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className={isGreenSidebar
                ? "text-[9px] font-semibold bg-[#4f772d]/30 text-[#ecf39e] px-1.5 py-0.5 rounded-md border border-[#90a955]/10"
                : "text-[9px] font-semibold bg-emerald-50 dark:bg-[#4f772d]/30 text-emerald-700 dark:text-[#ecf39e] px-1.5 py-0.5 rounded-md border border-emerald-250 dark:border-[#90a955]/10"
              }>
                {userProfile.hindiRole}
              </span>
            </p>
          </div>
        </div>

        {/* Pinned Exit Button */}
        <Link
          to="/"
          title="Sign Out"
          className={isGreenSidebar
            ? "text-gray-450 hover:text-[#ecf39e] hover:bg-[#4f772d]/20 p-1.5 rounded-lg border border-[#31572c]/30 transition-all duration-300 active:scale-[0.92]"
            : "text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-[#ecf39e] hover:bg-emerald-50 dark:hover:bg-[#4f772d]/20 p-1.5 rounded-lg border border-gray-200 dark:border-[#31572c]/30 transition-all duration-300 active:scale-[0.92]"
          }
        >
          <LucideIcons.LogOut className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
