import React from "react";

export default function StatsCard({
  title,
  value,
  trend,
  trendType = "success",
  subtext,
  icon,
}) {
  // Gracefully handle icon sizing to avoid huge or overflowing icons
  const cleanIcon = icon
    ? React.cloneElement(icon, {
        className: `w-6 h-6 shrink-0 ${icon.props.className ? icon.props.className.replace(/\b[wh]-\d+\b/g, "") : ""}`,
      })
    : null;

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[115px] animate-fadeIn transition-all duration-200 hover:shadow-md hover:border-gray-200">
      <div className="space-y-3">
        {/* Title above */}
        <div className="flex">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            {title}
          </span>
          {cleanIcon && (
            <div className="pointer-events-none shrink-0 ml-auto">
              {cleanIcon}
            </div>
          )}
        </div>

        {/* Value, Trend, Icon in the same row/order */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0 flex-1">
            <span className="text-2xl font-black text-gray-955 tracking-tight leading-none break-words">
              {value}
            </span>
            {trend && (
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-lg border inline-flex items-center shrink-0 ${
                  trendType === "success"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100/40"
                    : trendType === "danger"
                      ? "bg-red-50 text-red-700 border-red-100/40"
                      : "bg-gray-50 text-gray-700 border-gray-100/50"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtext below */}
      {subtext && (
        <div className="text-[11px] font-semibold text-gray-500 mt-2 block">
          {subtext}
        </div>
      )}
    </div>
  );
}
