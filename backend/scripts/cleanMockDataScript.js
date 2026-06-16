import fs from 'fs';
import path from 'path';

const mockScriptPath = 'c:/Agro_Project/agro-analytics/backend/scripts/buildOfflineMockData.js';
let content = fs.readFileSync(mockScriptPath, 'utf8');

// Use regex to remove all instances of the 'default' key in the rolesConfig
// It looks like: 'default': { templates: ["Important update regarding market conditions."], ... }
content = content.replace(/\s*'default':\s*\{\s*templates:\s*\["Important update regarding market conditions\."\],\s*metrics:\s*\['General: OK',\s*'Index: 104',\s*'Volatility: Low'\],\s*actions:\s*\['Monitor markets'\],\s*tags:\s*\['INFO'\]\s*\}/g, '');

fs.writeFileSync(mockScriptPath, content);
console.log("Cleaned buildOfflineMockData.js");
