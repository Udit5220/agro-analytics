import React from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { dashboardContent } from '../../content/dashboardContent';
import { uiConfig } from '../../utils/uiConfig';

export default function GenericSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { moduleId } = useParams();
  const { userProfile, sidebarMenus } = dashboardContent;

  // Resolve default active menu array based on active moduleId path param
  const activeModuleKey = sidebarMenus[moduleId] ? moduleId : 'crop-recommendation';
  const currentMenu = sidebarMenus[activeModuleKey];

  return (
    <aside className="w-72 bg-brand-darkest text-white border-r border-brand-dark/25 flex flex-col justify-between shrink-0 select-none h-full p-4">
      
      <div>
        {/* Top Header & Collapsible Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-dark/20">
          <div className="flex items-center space-x-2">
            <LucideIcons.Sprout className="h-5 w-5 text-brand-accent animate-pulse" />
            <span className="text-sm font-extrabold tracking-wide text-white">Navigation</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-brand-dark/30 hover:bg-brand-medium text-slate-300 hover:text-brand-accent transition-all duration-200 active:scale-[0.95]"
            title="Close Navigation Panel"
          >
            <LucideIcons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Nav List (Compact & Clean spacing) */}
        <nav className="space-y-1 mt-4 overflow-y-auto max-h-[calc(100vh-240px)] scroll-thin">
          {currentMenu.map((item, idx) => {
            const IconComponent = LucideIcons[item.icon] || LucideIcons.HelpCircle;
            // Build the absolute routing link to avoid subpath mismatch errors
            const pathUrl = `/module/${activeModuleKey}/${item.path}`;
            
            return (
              <NavLink
                key={idx}
                to={pathUrl}
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm relative group ${
                    isActive
                      ? 'bg-brand-medium text-white shadow-lg shadow-brand-medium/10'
                      : 'text-slate-300/80 hover:text-white hover:bg-brand-dark/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left Active border bar */}
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-1.5 bg-brand-accent rounded-r-full" />
                    )}
                    
                    <IconComponent className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-brand-accent' : 'text-brand-light'
                    }`} />
                    
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Fixed Bottom Profile Block (Isolated at bottom) */}
      <div className="border-t border-[#31572c]/40 pt-4 bg-brand-darkest/90 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar Emblems */}
            <div className="h-10 w-10 rounded-xl bg-brand-accent/25 border border-brand-accent/30 text-brand-accent font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
              {userProfile.avatar}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">
                {userProfile.name}
              </h4>
              <p className="text-[10px] font-medium text-slate-300 flex items-center space-x-1 mt-0.5">
                <span>{userProfile.role}</span>
                <span className="text-brand-accent/50">•</span>
                <span className="text-[9px] font-semibold bg-brand-medium/20 text-brand-accent px-1.5 py-0.5 rounded-md">
                  {userProfile.hindiRole}
                </span>
              </p>
            </div>
          </div>

          {/* Pinned Exit Button (Subtle & space-efficient scaled container) */}
          <Link
            to="/"
            title="Sign Out"
            className="p-1.5 rounded-lg bg-brand-dark/20 text-slate-400 hover:text-brand-accent hover:bg-brand-medium/20 border border-brand-light/10 transition-all duration-300 active:scale-[0.92]"
          >
            <LucideIcons.LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </aside>
  );
}
