import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const chatModel = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-flash-latest',
  temperature: 0.3,
});

// Roles and their exact subpage paths
const rolesConfig = {
  'Farmer': [
    { title: 'Local Mandi & Market Insights', path: 'mandi-insights' },
    { title: 'Weather Anomalies & Safety', path: 'weather-safety' },
    { title: 'Agri-Tech & Best Practices', path: 'agri-tech' },
    { title: 'Financial & Credit News', path: 'financial-credit' },
    { title: 'Govt Scheme & MSP Flash', path: 'scheme-news' }
  ],
  'FPO': [
    { title: 'Cluster Risk Hub', path: '' },
    { title: 'B2B Market Sentiment', path: 'b2b-market' },
    { title: 'Bulk Input Procurement', path: 'input-procurement' },
    { title: 'Logistics & Warehousing', path: 'logistics' },
    { title: 'Govt Grants & Compliance', path: 'compliance-grants' }
  ],
  'Commodity Trader': [
    { title: 'Global Futures & Macros', path: '' },
    { title: 'Local Mandi Arbitrage', path: 'mandi-arbitrage' },
    { title: 'Weather & Supply Risk', path: 'supply-risk' },
    { title: 'Export & Tariff Policies', path: 'export-policy' },
    { title: 'Institutional Procurement Flow', path: 'institutional-flow' }
  ],
  'Procurement Manager': [
    { title: 'Supply Chain Map', path: '' },
    { title: 'Sourcing Risk Grid', path: 'risk' },
    { title: 'Vendor Negotiations', path: 'vendor-negotiations' },
    { title: 'Quality & Assaying', path: 'quality-assaying' },
    { title: 'Logistics Routing', path: 'logistics-routing' }
  ],
  'Agribusiness Manager': [
    { title: 'Corporate Macro Trends', path: '' },
    { title: 'Competitor Intelligence', path: 'competitor-intel' },
    { title: 'Supply Chain Optimization', path: 'supply-chain' },
    { title: 'Retail & Consumer Demand', path: 'retail-demand' },
    { title: 'Mergers & Acquisitions', path: 'm-and-a' }
  ],
  'Research Analyst': [
    { title: 'Global Agronomy Papers', path: '' },
    { title: 'Climate Impact Modeling', path: 'climate-modeling' },
    { title: 'Genomics & Bio-Tech', path: 'bio-tech' },
    { title: 'Soil & Micro-Biome', path: 'soil-microbiome' },
    { title: 'Policy & Economics', path: 'policy-economics' }
  ],
  'Government Official': [
    { title: 'District Crisis Monitor', path: '' },
    { title: 'Relief Disbursement', path: 'relief' },
    { title: 'Policy Sentiment', path: 'sentiment' },
    { title: 'Food Security Reserves', path: 'food-security' },
    { title: 'Infrastructure Progress', path: 'infrastructure' }
  ],
  'Company Admin': [
    { title: 'Ingestion Engine Status', path: '' },
    { title: 'Translation & LLM Config', path: 'translation' },
    { title: 'API & Webhook Health', path: 'api-health' },
    { title: 'User Access & Roles', path: 'user-access' },
    { title: 'System Security & Audit', path: 'security' }
  ]
};

async function generateDataForSubpage(role, subpage) {
  console.log(`Generating data for ${role} -> ${subpage.title}...`);
  const promptText = `
    You are generating extremely dense, high-quality, ultra-realistic mock data for an agricultural intelligence platform.
    Role: ${role}
    Subpage: ${subpage.title}
    
    Output STRICTLY in the following JSON format. Do not use Markdown wrapping (no \`\`\`json). Just the raw JSON object.
    You MUST provide exactly 7 highly detailed accordionItems and exactly 2 detailed page_charts.
    Ensure primary_metrics has 3 relevant metrics with realistic numbers.
    Ensure actionable_steps has 2 realistic, strategic actions.
    Ensure ticker_type is a single uppercase word like ALERT, TREND, SUCCESS, CRITICAL, PRICE, UPDATE, etc.
    
    {
      "accordionItems": [
        {
          "ticker_type": "string",
          "single_line_summary": "string",
          "expanded_data_points": {
            "primary_metrics": { "metric1": "string", "metric2": "string", "metric3": "string" },
            "actionable_steps": ["string", "string"],
            "source_or_authority": "string"
          }
        }
      ],
      "page_charts": [
        {
          "title": "string (e.g. 'Arrival Trends', 'Market Volatility')",
          "type": "bar | line",
          "data": [
            { "label": "string (e.g. Jan, 10:00, Hub A)", "value": number }
          ]
        }
      ]
    }
  `;

  try {
    const res = await chatModel.invoke(promptText);
    let rawText = res.content.trim();
    if (rawText.startsWith('\`\`\`json')) rawText = rawText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
    if (rawText.startsWith('\`\`\`')) rawText = rawText.replace(/\`\`\`/g, '').trim();
    
    return JSON.parse(rawText);
  } catch (error) {
    console.error(`Error generating for ${role} - ${subpage.title}:`, error.message);
    // Return a safe fallback
    return {
      accordionItems: [
        {
          ticker_type: "SYSTEM",
          single_line_summary: "Data generation fallback triggered due to generation error.",
          expanded_data_points: {
            primary_metrics: { "Status": "Fallback", "Error": "LLM Timeout", "Retries": "0" },
            actionable_steps: ["Check API Quota", "Reduce concurrent requests"],
            source_or_authority: "Data Generator Script"
          }
        }
      ],
      page_charts: []
    };
  }
}

async function main() {
  const finalData = {};

  for (const [role, subpages] of Object.entries(rolesConfig)) {
    finalData[role] = {};
    for (const subpage of subpages) {
      // Use the path string as the key in the JSON
      // If path is empty string, use "default"
      const pathKey = subpage.path === '' ? 'default' : subpage.path;
      finalData[role][pathKey] = await generateDataForSubpage(role, subpage);
      
      // Sleep slightly to avoid rate limits
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const outputPath = path.join(__dirname, '../data/newsMockData.json');
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  console.log(`Successfully generated dense mock data at ${outputPath}`);
}

main().catch(console.error);
