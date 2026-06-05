import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../../context/RoleContext";
import {
  BookOpen,
  Sprout,
  ShieldAlert,
  TrendingUp,
  Droplet,
  DollarSign,
  Users,
  Factory,
  Layers,
  FileText,
  Search,
  ArrowUpRight,
  MessageSquare,
  CloudSun,
  Building2,
  Settings,
  ServerCrash,
  Briefcase,
} from "lucide-react";

// ============================================================================
// BALANCED ROLE-BASED PROMPT SCHEMAS (Consistently 2 Featured & 3 Prompts Each)
// ============================================================================
import seededData from "../../../seed-json/seededData.json";

// Map icon string names to Lucide icons
const IconMap = {
  BookOpen: <BookOpen className="w-3.5 h-3.5" />,
  Sprout: <Sprout className="w-3.5 h-3.5" />,
  ShieldAlert: <ShieldAlert className="w-3.5 h-3.5" />,
  TrendingUp: <TrendingUp className="w-3.5 h-3.5" />,
  Droplet: <Droplet className="w-3.5 h-3.5" />,
  Droplets: <Droplet className="w-3.5 h-3.5" />,
  DollarSign: <DollarSign className="w-3.5 h-3.5" />,
  Users: <Users className="w-3.5 h-3.5" />,
  Factory: <Factory className="w-3.5 h-3.5" />,
  Layers: <Layers className="w-3.5 h-3.5" />,
  FileText: <FileText className="w-3.5 h-3.5" />,
  Search: <Search className="w-3.5 h-3.5" />,
  ArrowUpRight: <ArrowUpRight className="w-3.5 h-3.5" />,
  MessageSquare: <MessageSquare className="w-3.5 h-3.5" />,
  CloudSun: <CloudSun className="w-3.5 h-3.5" />,
  Building2: <Building2 className="w-3.5 h-3.5" />,
  Settings: <Settings className="w-3.5 h-3.5" />,
  ServerCrash: <ServerCrash className="w-3.5 h-3.5" />,
  Briefcase: <Briefcase className="w-3.5 h-3.5" />,
};

// Reconstruct promptsConfigByRole with React icons
const promptsConfigByRole = Object.keys(
  seededData.aiAssistant1.promptsConfigByRole,
).reduce((acc, role) => {
  const roleData = seededData.aiAssistant1.promptsConfigByRole[role];
  acc[role] = {
    ...roleData,
    categories: roleData.categories.map((cat) => ({
      ...cat,
      icon: IconMap[cat.icon] || null,
    })),
    prompts: roleData.prompts.map((p) => ({
      ...p,
      icon: IconMap[p.icon] || null,
    })),
  };
  return acc;
}, {});

// Safelist of Tailwind CSS gradient background classes to ensure compilation
const TAILWIND_GRADIENT_SAFELIST = [
  "from-[#1a3a22] to-[#2d5a36]",
  "from-[#b45309] to-[#f59e0b]",
  "from-[#1d3557] to-[#457b9d]",
  "from-[#2d5a36] to-[#405d1b]",
  "from-[#6f4e37] to-[#a67c52]",
  "from-[#1a3a22] to-[#405d1b]",
  "from-[#4c1d95] to-[#6d28d9]",
  "from-[#1e3a22] to-[#2d5a36]",
  "from-[#1e1b4b] to-[#312e81]",
  "from-[#31572c] to-[#4f772d]",
  "from-[#7f1d1d] to-[#b91c1c]",
  "from-[#4c1d95] to-[#5b21b6]",
  "from-[#0f172a] to-[#334155]",
  "from-[#1e293b] to-[#475569]",
  "from-[#065f46] to-[#047857]",
  "from-[#0f5132] to-[#146c43]"
];

export default function PromptLibrary() {
  const { activeRole } = useRole();
  const navigate = useNavigate();

  const currentRoleKey = activeRole
    ? activeRole.toLowerCase().trim()
    : "farmer";
  const activeSchema =
    promptsConfigByRole[currentRoleKey] || promptsConfigByRole.farmer;

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setActiveCategory("all");
    setSearchQuery("");
  }, [activeRole, currentRoleKey]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleCopyPrompt = (promptText, promptTitle) => {
    navigator.clipboard.writeText(promptText);
    showToast(`\u2713 "${promptTitle}" prompt copied`);
  };

  const handleUsePrompt = (prompt) => {
    showToast(`\u2728 Redirecting "${prompt.title}" to chat...`);
    setTimeout(() => {
      navigate("/module/ai-assistant-1/chat-workspace", {
        state: { executePrompt: prompt.prompt },
      });
    }, 850);
  };

  const filteredPrompts = (activeSchema.prompts || []).filter(
    (p) =>
      (activeCategory === "all" || p.category === activeCategory) &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="animate-fadeIn bg-white min-h-screen font-sans w-full">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#1a3a22] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl z-50 animate-toastIn">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 max-w-2xl">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 mb-1">
          Prompt Library{" "}
          <span className="text-gray-400 font-medium text-base">
            [{currentRoleKey.toUpperCase()}]
          </span>
        </h1>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          Discover and utilize engineered AI prompts optimized for agricultural
          analysis.
        </p>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-1.5">
          {activeSchema.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                activeCategory === cat.id
                  ? "bg-[#1a3a22] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-48 shrink-0">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[11px] bg-gray-50 border border-gray-100 rounded-lg py-1.5 pl-7 pr-3 font-semibold focus:outline-none focus:border-[#31572c]"
          />
          <Search className="w-3 h-3 absolute left-2.5 top-2 text-gray-400" />
        </div>
      </div>

      {/* Featured Strategies */}
      {activeSchema.featured?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-4">
            {"\u2605"} Featured Strategies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSchema.featured.map((f) => (
              <div
                key={f.id}
                className={`bg-gradient-to-br ${f.bgColorClass} rounded-xl p-5 shadow-sm text-white h-48 flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">
                    {f.category}
                  </span>
                  <h3 className="text-sm font-bold mt-2">{f.title}</h3>
                  <p className="text-[11px] text-white/80 line-clamp-2 mt-1">
                    {f.description}
                  </p>
                </div>
                <button
                  onClick={() => handleUsePrompt(f)}
                  className="w-fit text-[11px] font-bold bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  {f.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Prompts Grid */}
      <h2 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-4">
        All Prompts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-7 h-7 ${p.iconBg} ${p.iconColor} rounded-lg flex items-center justify-center`}
                >
                  {p.icon}
                </div>
                <span className="text-[9px] font-bold bg-gray-50 text-gray-400 px-2 py-0.5 rounded uppercase">
                  {p.subcategory}
                </span>
              </div>
              <h3 className="text-xs font-bold text-gray-900 mb-1">
                {p.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-3 mb-4">
                {p.description}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
              <button
                onClick={() => handleUsePrompt(p)}
                className="text-[11px] font-black text-[#1a3a22] hover:underline flex items-center gap-0.5"
              >
                Run Template <ArrowUpRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleCopyPrompt(p.prompt, p.title)}
                className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 ml-auto"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
