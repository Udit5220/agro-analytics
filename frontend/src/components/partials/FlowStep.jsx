import React from 'react';
import * as LucideIcons from 'lucide-react';
import { uiConfig } from '../../utils/uiConfig';

export default function FlowStep({ icon, title, description, stepNumber, isLast }) {
  // Dynamically resolve icon component from Lucide
  const IconComponent = LucideIcons[icon] || LucideIcons.HelpCircle;

  return (
    <div className="flex items-center w-full md:w-auto relative group">
      
      {/* Step Container Card */}
      <div className="flex flex-col items-center text-center w-full md:w-48 p-6 rounded-2xl bg-white dark:bg-brand-darkest/25 border border-slate-100 dark:border-brand-dark/20 hover:border-brand-light/30 transition-all duration-300">
        
        {/* Step Badge Indicator */}
        <span className="text-[10px] font-extrabold text-brand-medium dark:text-brand-accent bg-brand-light/10 px-2 py-0.5 rounded-full mb-4">
          STEP 0{stepNumber}
        </span>

        {/* Icon container */}
        <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-brand-accent/15 border border-brand-accent/20 text-brand-medium dark:text-brand-accent group-hover:bg-brand-medium group-hover:text-white group-hover:rotate-12 transition-all duration-500 shadow-sm mb-4">
          <IconComponent className="h-7 w-7" />
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1.5">
          {title}
        </h4>

        {/* Description */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
          {description}
        </p>

      </div>

      {/* Directional Connector Arrow */}
      {!isLast && (
        <div className="hidden md:flex items-center justify-center mx-4 text-brand-light/40 group-hover:text-brand-accent transition-colors duration-300">
          <LucideIcons.ChevronRight className="h-6 w-6 animate-pulse" />
        </div>
      )}

    </div>
  );
}
