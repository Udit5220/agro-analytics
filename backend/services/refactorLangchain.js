import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'langchain.service.js');
let content = fs.readFileSync(filePath, 'utf8');

// The new dynamic fallback logic
const newLogic = `
        if (!fs) {
            // Because fs isn't imported at the top of the file yet, we require it dynamically
            var fsSync = await import('fs');
            var pathSync = await import('path');
            var { fileURLToPath } = await import('url');
            var __filename = fileURLToPath(import.meta.url);
            var __dirname = pathSync.dirname(__filename);
        } else {
            var fsSync = fs;
            var pathSync = path;
            var __dirname = pathSync.dirname(new URL(import.meta.url).pathname);
            if (process.platform === 'win32' && __dirname.startsWith('/')) {
                __dirname = __dirname.substring(1);
            }
        }

        try {
            const mockDataPath = pathSync.join(__dirname, '../data/newsMockData.json');
            const fileContent = fsSync.readFileSync(mockDataPath, 'utf8');
            const allMockData = JSON.parse(fileContent);
            const roleData = allMockData[role];
            
            if (roleData) {
                const key = subPath === '' ? 'default' : subPath;
                if (roleData[key]) return roleData[key];
            }
        } catch (e) {
            console.error("Failed to read dynamic mock data file:", e.message);
        }
        
        return { 
           accordionItems: [
             {
               ticker_type: "SYSTEM",
               single_line_summary: "Fallback data not available.",
               expanded_data_points: {
                 primary_metrics: {},
                 actionable_steps: [],
                 source_or_authority: "System"
               }
             }
           ],
           page_charts: []
        };
`;

// Find start and end indices
const startStr = "if (role === 'Farmer') {";
const endStr = "        return { \n           newsItems: [{ title: \"Simulated Alert due to API Limit\", impact: \"Medium\", tag: \"Neutral\", sentimentScore: 0, audioText: \"सिम्युलेटेड ऑडियो।\" }],\n           macroTrends: [{ topic: \"Simulated Macro\", growth: \"+5%\", sentiment: \"Positive\" }],\n           disruptions: [{ location: \"Simulated\", issue: \"Road Block\", delay: \"2 Days\" }]\n        };\n    }";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const finalEndIndex = endIndex + endStr.length;
    const newContent = content.substring(0, startIndex) + newLogic.trim() + "\n    }\n" + content.substring(finalEndIndex);
    fs.writeFileSync(filePath, newContent);
    console.log("Successfully refactored langchain.service.js!");
} else {
    console.error("Could not find start or end block.");
    console.log("Start index:", startIndex);
    console.log("End index:", endIndex);
}

