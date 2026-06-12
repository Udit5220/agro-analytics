/**
 * UI Configuration & Shared Style Constants for AgroIndia
 * Color system aligned with GreenLeaf / Agro Matics theme.
 *
 * Architecture: Hybrid — CSS custom tokens + Tailwind utilities + JS hex literals
 * Brand identity: Green (#28a745) shell on dark gray (#1F2937) with white/glass card panels.
 */
export const uiConfig = {
  // Global App metadata
  appName: "AgroIndia",
  appTagline: "AI-Powered Agriculture Platform",

  // ──────────────────────────────────────────────────────
  // 1. SEMANTIC COLOR TOKEN SYSTEM (mirrors index.css custom classes)
  // ──────────────────────────────────────────────────────
  theme: {
    // Core semantic tokens (bg / border / text triplets)
    tokens: {
      primary: { bg: "#2d5a3d", border: "#2d5a3d", text: "#2d5a3d" }, // Dark green
      secondary: { bg: "#C5F547", border: "#C5F547", text: "#C5F547" }, // Lime accent
      positive: { bg: "#2d5a3d", border: "#C5F547", text: "#0F2E1F" },
      negative: { bg: "#cc5555", border: "#ff6b6b", text: "#ff6b6b" }, // Coral Red
      neutral: { bg: "#d3d3d3", border: "#d3d3d3", text: "#d3d3d3" },
      contrast: { bg: "#0F2E1F", border: "#0F2E1F", text: "#0F2E1F" }, // Darkest green
      green: { bg: "#1A3A2A", border: "#1A3A2A", text: "#1A3A2A" },
    },

    // Named brand palette (used in Tailwind config as brand-*)
    colors: {
      brandDarkest: "#0F2E1F", // Top Header background
      brandDark: "#1A3A2A", // Sidebar background
      brandMedium: "#2d5a3d", // Primary buttons, active states
      brandLight: "#C5F547", // Icons, hover states
      brandAccent: "#E8F5C0", // Active nav item background
      brandLightest: "#f4f7f0", // Main content background
    },

    // Shell / Layout colors
    shell: {
      sidebarBg: "#0F2E1F",
      navbarBg: "#0F2E1F",
      activeRouteBg: "#E8F5C0",
      mainBorder: "transparent",
      inputBorder: "#e5e2dc",
      activeRouteBorder: "transparent",
      sidebarHover: "rgba(255, 255, 255, 0.05)",
      sidebarText: "#a3b8a3",
      navbarIconHover: "#C5F547",
    },

    // Action button color presets
    buttons: {
      primary: { bg: "#C5F547", hover: "#B0E030", text: "#0F2E1F" }, // Lime CTA, dark text
      secondary: { bg: "#2d5a3d", hover: "#1A3A2A", text: "#FFFFFF" }, // Forest button
      apply: { bg: "#2563EB", hover: "#1D4ED8", text: "#FFFFFF" }, // Blue apply/filter
      download: { bg: "#16a34a", hover: "#15803d", text: "#FFFFFF" }, // Download green
      danger: { bg: "#DC2626", hover: "#B91C1C", text: "#FFFFFF" }, // Red destructive
      disabled: { bg: "#9CA3AF", text: "#D1D5DB" }, // gray-400
    },

    // Glass-card pattern (Greenleaf signature)
    glass: {
      cardBg: "bg-white/80",
      shadow: "0px 0px 4px 0px rgba(0,0,0,0.5)",
      shadowSm: "0px 0px 4px 0px rgba(0,0,0,0.12)",
      radius: "rounded-xl",
    },

    // Status indicator colors (dashboard cards)
    status: {
      uptrend: "#C5F547", // bg-theme-positive
      downtrend: "#cc5555", // bg-theme-negative
      neutral: "#4a4a4a",
    },
  },

  // ──────────────────────────────────────────────────────
  // 2. CHART & DATA VISUALIZATION PALETTES
  // ──────────────────────────────────────────────────────
  charts: {
    // Default 10-color palette (Greenleaf light theme)
    light: [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#84CC16",
      "#F97316",
      "#6366F1",
    ],
    dark: [
      "#60A5FA",
      "#34D399",
      "#FBBF24",
      "#F87171",
      "#A78BFA",
      "#F472B6",
      "#22D3EE",
      "#A3E635",
      "#FB923C",
      "#818CF8",
    ],
    blue: [
      "#2563EB",
      "#059669",
      "#D97706",
      "#DC2626",
      "#7C3AED",
      "#DB2777",
      "#0891B2",
      "#65A30D",
      "#EA580C",
      "#4F46E5",
    ],
    // Legacy Recharts palette (MCX/ChiniMandi style)
    legacy16: [
      "#8884d8",
      "#82ca9d",
      "#ff7300",
      "#ff0000",
      "#00bcd4",
      "#ffc658",
      "#673ab7",
      "#4caf50",
      "#f44336",
      "#9c27b0",
      "#3f51b5",
      "#2196f3",
      "#009688",
      "#8bc34a",
      "#ffc107",
      "#ff9800",
    ],
    grid: "#e0e0e0",
  },

  // ──────────────────────────────────────────────────────
  // 3. LAYOUT STANDARDIZATIONS
  // ──────────────────────────────────────────────────────
  layout: {
    container: "max-w-[1536px] mx-auto px-6 sm:px-8 lg:px-12",
    sectionPadding: "py-20 lg:py-28",
    sectionPaddingCompact: "py-12 lg:py-16",
    flexCenter: "flex items-center justify-center",
    flexBetween: "flex items-center justify-between",
  },

  // ──────────────────────────────────────────────────────
  // 4. PREMIUM TRANSITIONS & MICRO-ANIMATIONS
  // ──────────────────────────────────────────────────────
  transitions: {
    default: "transition-all duration-300 ease-in-out",
    fast: "transition-all duration-150 ease-in-out",
    slow: "transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
    hoverScale: "hover:scale-[1.02] active:scale-[0.98]",
    hoverLift: "hover:-translate-y-1 hover:shadow-xl",
  },

  // ──────────────────────────────────────────────────────
  // 5. INTERACTIVE STYLING STANDARDS
  // ──────────────────────────────────────────────────────
  styles: {
    // Glass-card (Greenleaf signature): white/80 + subtle shadow
    card: "bg-white/80 border border-gray-200 rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-md transition-all duration-300",
    cardInteractive:
      "bg-white/80 border border-gray-200 rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.5)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
    glass: "backdrop-blur-md bg-white/70 border border-white/20",

    badge:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase",

    buttonPrimary:
      "px-6 py-3 rounded-xl bg-[#C5F547] text-[#0F2E1F] font-bold hover:bg-[#B0E030] transition-all duration-300 hover:shadow-lg active:scale-[0.98]",
    buttonContrast:
      "px-6 py-3 rounded-xl bg-[#0F2E1F] text-white font-medium hover:bg-[#1A3A2A] transition-all duration-300 hover:shadow-lg active:scale-[0.98]",
    buttonAccent:
      "px-6 py-3 rounded-xl bg-[#E8F5C0] text-[#0F2E1F] font-semibold hover:bg-[#D8E5B0] transition-all duration-300 hover:shadow-lg active:scale-[0.98]",
    buttonOutline:
      "px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-[#C5F547] hover:text-[#0F2E1F] transition-all duration-300 active:scale-[0.98]",
  },

  // ──────────────────────────────────────────────────────
  // 6. TYPOGRAPHY
  // ──────────────────────────────────────────────────────
  typography: {
    fontFamily: '"Plus Jakarta Sans", Inter, sans-serif',
    chartFont: "Inter, sans-serif",
    sizes: {
      navbarTitle: "text-2xl font-bold",
      sidebarLabel: "text-xs",
      filterLabel: "text-xs font-semibold",
      tableHeader: "text-xs font-semibold",
      cardBody: "text-sm",
      heading: "text-2xl font-bold",
    },
  },

  // ──────────────────────────────────────────────────────
  // 7. TOAST / NOTIFICATION COLORS
  // ──────────────────────────────────────────────────────
  toast: {
    success: { bg: "#16a34a", text: "#FFFFFF" }, // green-600
    warning: { bg: "#f97316", text: "#FFFFFF" }, // orange-500
    error: { bg: "#dc2626", text: "#FFFFFF" }, // red-600
    info: { bg: "#2563eb", text: "#FFFFFF" }, // blue-600
  },

  // ──────────────────────────────────────────────────────
  // 8. SCROLLBAR COLORS
  // ──────────────────────────────────────────────────────
  scrollbar: {
    track: "#f1f1f1",
    thumb: "#cbd5e1", // slate-300
    thumbHover: "#94a3b8", // slate-400
    width: "5px",
  },

  // Global visual flags
  flags: {
    enableAnimations: true,
    enableThemeToggle: true,
    enableNotifications: true,
  },
};
