import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { uiConfig } from '../../utils/uiConfig';

export default function Aitoolcard({ icon, title, description, badgeText, badgeColor, linkUrl }) {
  // Dynamically resolve icon component from Lucide
  const IconComponent = LucideIcons[icon] || LucideIcons.HelpCircle;

  return (
    <Link
      to={linkUrl}
      className="group relative overflow-hidden flex flex-col justify-between p-8 rounded-3xl bg-white/70 dark:bg-brand-darkest/20 border border-slate-200/60 dark:border-brand-dark/20 shadow-md hover:bg-brand-darkest hover:dark:bg-brand-darkest hover:border-brand-light/20 hover:shadow-2xl hover:shadow-brand-darkest/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      
      {/* Subtle glowing card background pattern */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors duration-300" />
      
      <div>
        {/* Header Ribbon: Icon and Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 rounded-2xl bg-brand-medium/10 dark:bg-brand-dark/30 border border-slate-100 dark:border-brand-dark/20 text-brand-medium dark:text-brand-accent group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-darkest transition-all duration-300">
            <IconComponent className="h-6 w-6" />
          </div>
          {badgeText && (
            <span className="text-[#31572c] font-extrabold text-[11px] tracking-widest uppercase bg-transparent border-b-2 border-[#31572c]/10 pb-0.5 transition-all duration-300 group-hover:text-[#ecf39e] group-hover:border-[#ecf39e]/20">
              {badgeText}
            </span>
          )}
        </div>

        {/* Content Area */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-white transition-colors duration-200 mb-3">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-200 transition-colors duration-200 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer Area: Interactive Link */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-brand-dark/10 flex items-center">
        <div
          className="text-xs font-bold uppercase tracking-wider text-brand-medium dark:text-brand-accent flex items-center group-hover:text-brand-accent transition-colors duration-200"
        >
          <span>Explore Module</span>
          <LucideIcons.ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>

    </Link>
  );
}
