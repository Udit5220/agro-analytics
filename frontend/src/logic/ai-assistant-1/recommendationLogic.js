export const generateRecommendations = ({ role, weather, market }) => {
  const recommendations = [];

  if (weather?.rainChance > 70) {
    recommendations.push({
      type: "warning",
      title: "Heavy Rain Expected",
      description: "Review field operations and postpone spraying.",
    });
  }

  if (market?.trend === "up") {
    recommendations.push({
      type: "success",
      title: "Positive Market Trend",
      description: "Prices are increasing this week.",
    });
  }

  return recommendations;
};
