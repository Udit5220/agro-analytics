import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translateMockData } from './services/langchain.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAllTranslations() {
    const mockDataPath = path.join(__dirname, 'data/newsMockData.json');
    const allMockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

    const roles = Object.keys(allMockData);
    let totalItems = 0;
    let untranslatedCount = 0;

    for (const role of roles) {
        console.log(`\n--- TRANSLATIONS FOR ROLE: ${role} ---`);
        const subPaths = Object.keys(allMockData[role]);
        for (const subPath of subPaths) {
            const data = allMockData[role][subPath];
            // Force fallback by passing an invalid/fake model invocation or just calling it directly since it has a fallback.
            // Since chatModel invoke will fail due to rate limit, we will see the fallback result.
            const translated = await translateMockData(data, 'Hindi');
            
            console.log(`Subpath: ${subPath || 'default'}`);
            if (translated.accordionItems) {
                translated.accordionItems.forEach((item, idx) => {
                    totalItems++;
                    const hasEnglish = /[a-zA-Z]/.test(item.single_line_summary.replace(/Q1|Q2|Q3|Q4|Wk|FPO|B2B|API|NABARD|RBI|KCC|PM-Kisan|PMFBY|DBT|e-NAM/g, ''));
                    if (hasEnglish) {
                        untranslatedCount++;
                        console.log(`  [ENG] ${idx}: ${item.single_line_summary}  <-- NOT FULLY TRANSLATED`);
                    } else {
                        console.log(`  [HIN] ${idx}: ${item.single_line_summary}`);
                    }
                });
            }
        }
    }
    console.log(`\nTotal Headlines Tested: ${totalItems}`);
    console.log(`Untranslated Headlines (containing english letters other than standard acronyms): ${untranslatedCount}`);
}

testAllTranslations();
