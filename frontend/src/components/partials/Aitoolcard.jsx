import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { uiConfig } from '../../utils/uiConfig';

export default function Aitoolcard({ icon, title, description, badgeText, badgeColor, linkUrl, highlighted }) {
  // Dynamically resolve icon component from Lucide
  const IconComponent = LucideIcons[icon] || LucideIcons.HelpCircle;

  return (
    <Link
      to={linkUrl}
      className={`group relative overflow-hidden flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 cursor-pointer hover:bg-brand-darkest hover:dark:bg-brand-darkest hover:border-brand-light/20 hover:shadow-2xl hover:shadow-brand-darkest/30 hover:-translate-y-1 ${
        highlighted
          ? "bg-[#4f772d]/10 border-[#4f772d]/25 shadow-sm"
          : "bg-white border-slate-200/60 shadow-sm"
      }`}
    >
      
      {/* Subtle glowing card background pattern */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-colors duration-300" />
      
      <div>
        {/* Header Ribbon: Icon and Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3.5 rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-brand-darkest ${
            highlighted
              ? "bg-[#4f772d]/10 border-[#4f772d]/15 text-[#31572c]"
              : "bg-brand-medium/10 border-slate-100 text-[#31572c]"
          }`}>
            <IconComponent className="h-5.5 w-5.5" />
          </div>
          {badgeText && (
            <span className="text-[#31572c] font-extrabold text-[10px] tracking-widest uppercase bg-transparent border-b-2 border-[#31572c]/10 pb-0.5 transition-all duration-300 group-hover:text-[#ecf39e] group-hover:border-[#ecf39e]/20">
              {badgeText}
            </span>
          )}
        </div>

        {/* Content Area */}
        <h3 className="text-base font-extrabold text-slate-800 dark:text-white group-hover:text-white transition-colors duration-200 mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-350 group-hover:text-slate-200 transition-colors duration-200 leading-relaxed font-semibold">
          {description}
        </p>
      </div>

      {/* Footer Area: Interactive Link */}
      <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-brand-dark/15 flex items-center">
        <div
          className="text-[10px] font-black uppercase tracking-wider text-[#31572c] dark:text-brand-accent flex items-center group-hover:text-[#ecf39e] transition-colors duration-200"
        >
          <span>Explore Module</span>
          <LucideIcons.ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>

    </Link>
  );
}
