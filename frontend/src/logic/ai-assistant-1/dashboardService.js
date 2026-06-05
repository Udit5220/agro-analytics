import {
  getDashboardStats,
  getCurrentSeason,
  getRecentChats,
  getAiRecommendations,
  getQuickActions,
} from "./dashboardLogic.js"; // Standardized to your exact file layout extension

export const loadDashboardData = async (role) => {
  // Normalize checking parameter keys to protect data mapping boundaries cleanly
  const safeRoleKey = role ? role.toLowerCase().trim() : "farmer";

  return {
    welcomeMessage: `Workspace Dashboard: ${safeRoleKey.toUpperCase()}`,
    season: getCurrentSeason(),
    quickActions: getQuickActions(safeRoleKey),
    stats: getDashboardStats(safeRoleKey),
    recentChats: getRecentChats(safeRoleKey),
    aiRecommendations: getAiRecommendations(safeRoleKey),

    // Fallbacks set to null or empty arrays to satisfy any legacy UI expectations safely
    recommendations: [],
    activities: [],
  };
};
