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
    <aside className="w-60 bg-[#132a13] border-r border-[#132a13]/25 flex flex-col justify-between shrink-0 h-full min-h-0 p-3 text-white overflow-hidden">
      
      <div className="flex flex-col min-h-0 flex-1">
        {/* Top Header & Collapsible Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <LucideIcons.Sprout className="h-4 w-4 text-[#ecf39e]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">Navigation</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all duration-200 active:scale-[0.95]"
            title="Close Navigation Panel"
          >
            <LucideIcons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Nav List */}
        <nav className="space-y-0.5 mt-3 flex-1 overflow-y-auto overscroll-contain pr-0.5">
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
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-[11px] tracking-wide relative group ${
                    isActive
                      ? 'bg-white/10 text-white font-bold border-l-[3px] border-[#ecf39e]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#ecf39e]' : 'text-slate-400'
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
      <div className="border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* Avatar Emblems */}
            <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 text-[#ecf39e] font-bold flex items-center justify-center text-[11px] shrink-0">
              {userProfile.avatar}
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-white tracking-wide">
                {userProfile.name}
              </h4>
              <p className="text-[9px] font-medium text-slate-300 flex items-center space-x-1 mt-0.5">
                <span>{userProfile.role}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[9px] font-semibold bg-[#4f772d]/30 text-[#ecf39e] px-1.5 py-0.5 rounded-md">
                  {userProfile.hindiRole}
                </span>
              </p>
            </div>
          </div>

          {/* Pinned Exit Button */}
          <Link
            to="/"
            title="Sign Out"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-white/10 transition-all duration-300 active:scale-[0.92]"
          >
            <LucideIcons.LogOut className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

    </aside>
  );
}
