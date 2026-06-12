import React from "react";
import { useDashboard } from "../../../logic/ai-assistant-1/useDashboard";
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  TrendingUp,
  Building2,
  CloudSun,
  MessageSquare,
  AlertTriangle,
  Droplet,
  ChevronRight,
  FileText,
  Users,
  Factory,
  Layers,
  Settings,
  ShieldCheck,
  ServerCrash,
} from "lucide-react";

// Context icon mapper supporting quick action strips dynamically across fields
const DynamicActionIcon = ({ typeKey, className = "w-4 h-4" }) => {
  const iconMatrix = {
    crop: <Sprout className={className} />,
    market: <TrendingUp className={className} />,
    weather: <CloudSun className={className} />,
    scheme: <Building2 className={className} />,
    fpo: <Users className={className} />,
    procurement: <Factory className={className} />,
    default: <Layers className={className} />,
  };
  return iconMatrix[typeKey] || <Layers className={className} />;
};

export default function Dashboard() {
  const { dashboardData, loading } = useDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#31572c] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            Syncing role workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    welcomeMessage,
    season,
    quickActions,
    stats,
    recentChats,
    aiRecommendations,
  } = dashboardData;

  const recommendationStyles = {
    danger: {
      card: "bg-red-50/60 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-900 dark:text-red-200",
      link: "text-red-700 dark:text-red-400 hover:underline",
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
    },
    warning: {
      card: "bg-yellow-50/60 dark:bg-yellow-950/10 border-yellow-100 dark:border-yellow-900/20 text-yellow-900 dark:text-yellow-200",
      link: "text-yellow-700 dark:text-yellow-400 hover:underline",
      icon: <Droplet className="w-4 h-4 text-yellow-600" />,
    },
    success: {
      card: "bg-emerald-50/60 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-950 dark:text-emerald-200",
      link: "text-emerald-800 dark:text-emerald-400 hover:underline",
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
    },
  };

  return (
    <div className="p-4 sm:p-6 bg-[#f8f9fa] dark:bg-brand-dark min-h-screen space-y-6 text-gray-800 dark:text-gray-100 animate-fadeIn">
      {/* 1. Dynamic Header Banner */}
      <div className="bg-gradient-to-br from-[#1a3a22] to-[#2d5a36] p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {welcomeMessage}
          </h1>
          <p className="text-xs text-white/80 mt-1 font-medium">
            Your workspace context has successfully compiled today's operational
            bounds.
          </p>
        </div>
        {/* <button
          onClick={() => navigate("/module/ai-assistant-1/chat-workspace")}
          className="bg-white text-gray-900 hover:bg-gray-50 font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-xs flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
          <span>Open Chat Suite</span>
        </button> */}
      </div>

      {/* 2. Unified Key Telemetry Metrics Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-brand-darkest p-4 rounded-xl border border-gray-200/50 dark:border-brand-dark/20 shadow-2xs"
          >
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {stat.title}
            </p>
            <p className="text-lg font-black text-[#1e4638] dark:text-[#ecf39e] mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Role-Based Quick Actions Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-gray-955 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-gray-400" />
          Quick Actions Grid Toolkit
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions?.map((action, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/module/ai-assistant-1/chat-workspace")}
              className="bg-white dark:bg-brand-darkest p-4 rounded-xl border border-gray-200/60 dark:border-brand-dark/20 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[105px] h-full hover:-translate-y-0.5"
            >
              <div>
                <div className="w-7 h-7 rounded-full bg-[#dbe7c4]/50 dark:bg-brand-dark/30 text-[#31572c] dark:text-[#ecf39e] flex items-center justify-center mb-2.5 shadow-2xs">
                  <DynamicActionIcon typeKey={action.key} />
                </div>
                <h3 className="text-[11px] font-black text-gray-955 dark:text-slate-200 uppercase tracking-widest leading-tight">
                  {action.title}
                </h3>
                <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 leading-snug mt-0.5">
                  {action.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Split Layout Canvas: Sidebar Communications and Live Recommendation Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Chats Column */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-darkest p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-brand-dark/20 shadow-2xs space-y-4">
          <div className="flex justify-between items-center pb-1">
            <h2 className="text-xs font-black text-gray-955 dark:text-white uppercase tracking-widest">
              Recent Copilot Threads
            </h2>
            <button
              onClick={() => navigate("/module/ai-assistant-1/chat-history")}
              className="text-[10px] font-bold text-gray-400 dark:text-[#ecf39e] uppercase tracking-wider hover:underline cursor-pointer"
            >
              View History
            </button>
          </div>

          <div className="space-y-2">
            {recentChats?.map((chat) => (
              <div
                key={chat.id}
                onClick={() =>
                  navigate("/module/ai-assistant-1/chat-workspace", {
                    state: { chatId: chat.id },
                  })
                }
                className="p-3 bg-gray-50/50 dark:bg-brand-dark/10 rounded-xl border border-gray-100 dark:border-brand-dark/20 flex items-center justify-between gap-4 hover:bg-green-50/20 dark:hover:bg-brand-dark/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#dbe7c4]/40 dark:bg-brand-dark/30 flex items-center justify-center shrink-0 text-[#31572c] dark:text-[#ecf39e]">
                    {chat.type === "crop" && <Sprout className="w-3.5 h-3.5" />}
                    {chat.type === "market" && (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                    {chat.type === "scheme" && (
                      <Building2 className="w-3.5 h-3.5" />
                    )}
                    {chat.type === "weather" && (
                      <CloudSun className="w-3.5 h-3.5" />
                    )}
                    {chat.type === "procurement" && (
                      <Factory className="w-3.5 h-3.5" />
                    )}
                    {![
                      "crop",
                      "market",
                      "scheme",
                      "weather",
                      "procurement",
                    ].includes(chat.type) && (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 dark:text-slate-200 tracking-tight transition-colors">
                      {chat.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 truncate max-w-md mt-0.5">
                      "{chat.subtitle || chat.description}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                    {chat.time}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Column */}
        <div className="bg-white dark:bg-brand-darkest p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-brand-dark/20 shadow-2xs space-y-4">
          <h2 className="text-xs font-black text-gray-955 dark:text-white uppercase tracking-widest">
            AI Operational Warnings
          </h2>

          <div className="space-y-3">
            {aiRecommendations?.map((rec) => {
              const theme =
                recommendationStyles[rec.variant] ||
                recommendationStyles.success;

              return (
                <div
                  key={rec.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 shadow-2xs transition-all ${theme.card}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{theme.icon}</div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <h3 className="text-xs font-black tracking-tight uppercase truncate">
                        {rec.title}
                      </h3>
                      <p className="text-[11px] leading-normal font-semibold opacity-90 break-words">
                        {rec.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() =>
                        navigate("/module/ai-assistant-1/chat-workspace")
                      }
                      className={`text-[11px] font-black transition-all bg-transparent border-0 p-0 cursor-pointer ${theme.link}`}
                    >
                      {rec.linkText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
