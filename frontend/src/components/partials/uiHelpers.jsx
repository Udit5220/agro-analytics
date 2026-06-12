/**
 * Shared UI utility components for AgroIndia dashboard modules.
 * Used across: Commodity Market Intelligence, Marketplace, Weather & Reservoir.
 *
 * Exports:
 *  - SkeletonBox       — generic animated placeholder rectangle
 *  - SkeletonCard      — a full card-shaped skeleton
 *  - SkeletonTable     — table-row skeletons
 *  - PageLoader        — centered full-page spinner
 *  - SectionSkeleton   — skeleton for a section with title + rows
 *  - EmptyState        — clean empty-state with icon, title, description
 *  - ErrorState        — error banner with retry button
 */

import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

// ─── Base skeleton block ──────────────────────────────────────────────────────
export const SkeletonBox = ({ h = 'h-4', w = 'w-full', rounded = 'rounded-lg', className = '' }) => (
  <div className={`${h} ${w} ${rounded} bg-slate-100 animate-pulse ${className}`} />
);

// ─── KPI / stat card skeleton ─────────────────────────────────────────────────
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white border border-slate-100 rounded-2xl p-5 space-y-3 ${className}`}>
    <div className="flex items-start gap-3">
      <SkeletonBox h="h-10" w="w-10" rounded="rounded-xl" />
      <div className="flex-1 space-y-2 pt-1">
        <SkeletonBox h="h-3" w="w-24" />
        <SkeletonBox h="h-6" w="w-16" />
        <SkeletonBox h="h-2.5" w="w-32" />
      </div>
    </div>
  </div>
);

// ─── Table row skeletons ──────────────────────────────────────────────────────
export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
    {/* header row */}
    <div className="border-b border-slate-100 px-5 py-3 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBox key={i} h="h-3" w={i === 0 ? 'w-28' : 'flex-1'} />
      ))}
    </div>
    {/* data rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="border-b border-slate-50 last:border-0 px-5 py-3.5 flex gap-4 items-center">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox
            key={i}
            h={i === 0 ? 'h-3.5' : 'h-3'}
            w={i === 0 ? 'w-24' : i === cols - 1 ? 'w-16' : 'flex-1'}
            className={r % 2 === 0 ? '' : 'opacity-70'}
          />
        ))}
      </div>
    ))}
  </div>
);

// ─── Centered full-page/section loader ────────────────────────────────────────
export const PageLoader = ({ height = 'h-64', label = 'Loading...' }) => (
  <div className={`flex flex-col items-center justify-center gap-3 ${height}`}>
    <RefreshCw className="h-7 w-7 text-brand-dark animate-spin" />
    <p className="text-xs text-slate-400 font-medium">{label}</p>
  </div>
);

// ─── Section-level skeleton: title + n card skeletons ─────────────────────────
export const SectionSkeleton = ({ cards = 3, cols = 'grid-cols-1', className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    <SkeletonBox h="h-5" w="w-40" />
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

// ─── Clean empty-state panel ──────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center gap-3">
    {Icon && <Icon className="h-10 w-10 text-slate-300" />}
    <div>
      <p className="text-slate-500 font-semibold text-sm">{title}</p>
      {description && <p className="text-slate-400 text-xs mt-1">{description}</p>}
    </div>
    {action}
  </div>
);

// ─── Error banner with optional retry ────────────────────────────────────────
export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center gap-3 py-12 bg-red-50 border border-red-200 rounded-2xl text-center px-6">
    <AlertCircle className="h-8 w-8 text-red-400" />
    <p className="text-red-600 font-semibold text-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-1 px-5 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold hover:bg-[#4a7c59] transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);
