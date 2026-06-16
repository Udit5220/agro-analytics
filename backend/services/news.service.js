import axios from 'axios';

/**
 * Fetches live news articles from Google News RSS based on a specific query.
 * Extracts the top 10 articles to send to the AI for synthesis.
 */
export const fetchLiveNews = async (query) => {
    try {
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
        const response = await axios.get(url, { timeout: 2000 });
        const xml = response.data;
        
        // Lightweight XML string parsing (avoids heavy dependencies like xml2js for simple RSS)
        const articles = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        let count = 0;
        
        while ((match = itemRegex.exec(xml)) !== null && count < 10) {
            const itemContent = match[1];
            
            const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
            const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
            
            let title = titleMatch ? titleMatch[1].replace("<![CDATA[", "").replace("]]>", "").trim() : '';
            let pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
            
            // Extract description and strip HTML tags
            let description = descMatch ? descMatch[1].replace("<![CDATA[", "").replace("]]>", "") : '';
            description = description.replace(/<[^>]*>?/gm, '').trim();
            
            if (title) {
                articles.push({ title, pubDate, description: description.substring(0, 300) });
                count++;
            }
        }
        
        return articles;
    } catch (error) {
        console.error("Error fetching live news via RSS:", error.message);
        return [];
    }
};
