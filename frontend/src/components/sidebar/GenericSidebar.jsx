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
    <aside className="bg-[#132a13] border-r border-[#31572c]/20 w-56 h-[calc(100vh-64px)] flex flex-col justify-between shrink-0 select-none p-4 text-white">
      
      <div>
        {/* Top Header & Collapsible Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-[#31572c]/30">
          <div className="flex items-center space-x-2">
            <LucideIcons.Sprout className="h-4 w-4 text-[#ecf39e]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Navigation</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="bg-[#4f772d]/25 hover:bg-[#4f772d]/45 text-gray-300 hover:text-white border border-[#90a955]/20 rounded-lg p-1.5 transition-all duration-200 active:scale-[0.95]"
            title="Close Navigation Panel"
          >
            <LucideIcons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Nav List (Compact & Clean spacing) */}
        <nav className="space-y-0.5 mt-3 overflow-y-auto max-h-[calc(100vh-220px)] scroll-thin">
          {currentMenu.map((item, idx) => {
            const IconComponent = LucideIcons[item.icon] || LucideIcons.HelpCircle;
            // Build the absolute routing link to avoid subpath mismatch errors and trailing slash issues
            const pathUrl = item.path ? `/module/${activeModuleKey}/${item.path}` : `/module/${activeModuleKey}`;
            
            return (
              <NavLink
                key={idx}
                to={pathUrl}
                end
                className={({ isActive }) =>
                  `h-10 flex items-center gap-3 w-full transition-all duration-200 font-semibold text-[12px] relative group ${
                    isActive
                      ? 'bg-[#4f772d]/20 text-white border-l-4 border-[#ecf39e] pl-2 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#4f772d]/10 border-l-4 border-transparent pl-2'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#ecf39e]' : 'text-gray-400 group-hover:text-gray-200'
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
      <div className="border-t border-[#31572c]/30 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Avatar Emblems */}
          <div className="h-8 w-8 rounded-lg bg-[#4f772d]/30 border border-[#90a955]/30 text-[#ecf39e] font-bold flex items-center justify-center text-[11px] shrink-0">
            {userProfile.avatar}
          </div>
          <div>
            <h4 className="text-white font-bold text-xs tracking-wide">
              {userProfile.name}
            </h4>
            <p className="text-[9px] font-medium text-gray-400 flex items-center space-x-1 mt-0.5">
              <span>{userProfile.role}</span>
              <span className="text-gray-500">•</span>
              <span className="text-[9px] font-semibold bg-[#4f772d]/30 text-[#ecf39e] px-1.5 py-0.5 rounded-md border border-[#90a955]/10">
                {userProfile.hindiRole}
              </span>
            </p>
          </div>
        </div>

        {/* Pinned Exit Button */}
        <Link
          to="/"
          title="Sign Out"
          className="text-gray-400 hover:text-[#ecf39e] hover:bg-[#4f772d]/20 p-1.5 rounded-lg border border-[#31572c]/30 transition-all duration-300 active:scale-[0.92]"
        >
          <LucideIcons.LogOut className="h-3.5 w-3.5" />
        </Link>
      </div>

    </aside>
  );
}
