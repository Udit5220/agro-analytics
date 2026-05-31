import React from "react";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";

export default function Aitoolcard({
  icon,
  title,
  description,
  badgeText,
  badgeColor,
  linkUrl,
  highlighted,
  image,
}) {
  const IconComponent = LucideIcons[icon] || LucideIcons.HelpCircle;

  return (
    <Link
      to={linkUrl}
      className={`group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        highlighted ? "border-[#4f772d]/25 bg-[#f5f8e7]" : ""
      }`}
    >
      {image && (
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={`${title} image`}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
          <div className="absolute inset-x-0 top-4 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3 rounded-full bg-slate-950/10 px-3 py-2 backdrop-blur-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-slate-900">
                <IconComponent className="h-5 w-5" />
              </div>
              {badgeText && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.23em] ${badgeColor || "text-slate-900"}`}
                >
                  {badgeText}
                </span>
              )}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-4 text-white">
            <h3 className="text-2xl font-bold leading-tight drop-shadow-sm">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-100/90 sm:text-base">
              {description}
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
            {description}
          </p>
          <LucideIcons.ArrowRight className="h-4 w-4 text-slate-600 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>
    </Link>
  );
}
