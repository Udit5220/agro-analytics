import { fetchLiveNews } from './services/news.service.js';
import { synthesizeRoleNews } from './services/langchain.service.js';

async function test() {
    try {
        const raw = await fetchLiveNews("mandi market arrivals price updates India");
        console.log("Raw News fetched");
        const synth = await synthesizeRoleNews(raw, "Farmer", "mandi-insights", { userLoc: "India", userCrops: "Wheat", userStage: "Sowing", userSize: "2" });
        console.log("Synthesized:", synth);
    } catch(e) {
        console.error(e);
    }
}
test();
