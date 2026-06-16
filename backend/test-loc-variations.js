import { synthesizeRoleNews } from './services/langchain.service.js';

async function runTest() {
    const raw = []; // empty raw news to force fallback
    const res1 = await synthesizeRoleNews(raw, "Farmer", "mandi-insights", { userLoc: "Ludhiana, Punjab" });
    const res2 = await synthesizeRoleNews(raw, "Farmer", "mandi-insights", { userLoc: "Amritsar, Punjab" });
    
    console.log("=== LUDHIANA, PUNJAB ===");
    console.log("Headline 1:", res1.accordionItems[0].single_line_summary);
    console.log("Metric 1 (Modal):", res1.accordionItems[0].expanded_data_points.primary_metrics.Modal);
    console.log("Chart 1 Data:", res1.page_charts[0].data[0]);
    
    console.log("\n=== AMRITSAR, PUNJAB ===");
    console.log("Headline 1:", res2.accordionItems[0].single_line_summary);
    console.log("Metric 1 (Modal):", res2.accordionItems[0].expanded_data_points.primary_metrics.Modal);
    console.log("Chart 1 Data:", res2.page_charts[0].data[0]);
}

runTest();
