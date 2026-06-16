import { fetchLiveNews } from '../services/news.service.js';

async function run() {
    const rawLudhiana = await fetchLiveNews("mandi market arrivals commodity price news updates Ludhiana, Punjab Wheat");
    const rawAmritsar = await fetchLiveNews("mandi market arrivals commodity price news updates Amritsar, Punjab Wheat");
    
    console.log("LUDHIANA COUNT:", rawLudhiana.length);
    if (rawLudhiana.length > 0) {
        console.log("Ludhiana Title 1:", rawLudhiana[0].title);
    }
    
    console.log("AMRITSAR COUNT:", rawAmritsar.length);
    if (rawAmritsar.length > 0) {
        console.log("Amritsar Title 1:", rawAmritsar[0].title);
    }
}

run();
