import fs from 'fs';
import path from 'path';

const dir = 'c:/Agro_Project/agro-analytics/frontend/src/pages/news-intel';
const files = [
  'FarmerNewsView.jsx',
  'GovNewsView.jsx',
  'AgribusinessNewsView.jsx',
  'ProcurementNewsView.jsx',
  'TraderNewsView.jsx',
  'AdminNewsView.jsx',
  'ResearcherNewsView.jsx',
  'FPONewsView.jsx'
];

// Unified translation vocabulary to translate everything inside the news module at once
const uiStringsDeclaration = `  const uiStrings = React.useMemo(() => [
    "Live Intelligence Feed", "Updates", "Synthesizing live intelligence feeds...", "Synthesizing live AI analysis...",
    "Market Intelligence Feed", "Bulletins", "Synthesizing Market Intelligence...", "Academic Research Feed",
    "Academic Intelligence Synthesis", "Papers", "Publications", "Aggregating Research Papers & Models...",
    "Sourcing Intelligence Feed", "Alerts", "Synthesizing Sourcing Intelligence...", "Aggregating Sourcing Intelligence...",
    "Crisis Intelligence Feed", "Synthesizing Crisis Advisories...", "Aggregating State Policy & Crisis Intelligence...",
    "Cluster Intelligence Feed", "Synthesizing Cluster Insights...", "Aggregating Institutional Intelligence...",
    "Corporate Intelligence Feed", "Reports", "Synthesizing Corporate intelligence...", "Aggregating Corporate Intelligence...",
    "System Log Feed", "Synthesizing System Logs...", "Connecting to Infrastructure Telemetry...",
    "System Infrastructure Telemetry", "ACTIVE LOGS", "Supply Chain Disruption Map", "Live Disruptions", "Est. Delay",
    "[Geographic Heat Map Rendered Here]", "FPO Operations Feed", "Academic Intelligence Synthesis",
    "Administrative Intelligence synthesis", "Reports Active", "Aggregating Procurement Intelligence...",
    "PRICE", "ALERT", "TREND", "MSP", "WEATHER", "CRITICAL", "TECH", "SUBSIDY", "UPDATE", "CREDIT", "KCC", "SCHEME", "SYSTEM", "SUPPLY", "NETWORK"
  ], []);

  const { t } = useAITranslation(uiStrings);`;

files.forEach(file => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping non-existent ${file}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Inject useAITranslation import if not present
  if (!content.includes("useAITranslation")) {
    content = content.replace(
      /import React, \{ useState \}/,
      "import React, { useState }\nimport { useAITranslation } from '../../hooks/useAITranslation';"
    );
  }

  // 2. Update AccordionItem signature to accept t
  content = content.replace(
    /const AccordionItem = \(\{ item, isOpen, onClick \}\) => \{/,
    "const AccordionItem = ({ item, isOpen, onClick, t }) => {"
  );

  // 3. Update JIT Fetch inside AccordionItem to add x-language header
  content = content.replace(
    /fetch\("http:\/\/localhost:5000\/api\/news\/ai-details\?headline=" \+ encodeURIComponent\(title\),\s*\{\s*headers:\s*\{\s*'x-user-role':\s*role\s*\}\s*\}\)/,
    `const activeLang = localStorage.getItem('language') || 'English';
      fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title), {
        headers: { 
          'x-user-role': role,
          'x-language': activeLang
        }
      })`
  );

  // 4. Translate tagText and loading state inside AccordionItem
  content = content.replace(/\{tagText\}/g, "{t(tagText)}");
  content = content.replace(
    /Synthesizing live AI analysis\.\.\./g,
    `{t("Synthesizing live AI analysis...")}`
  );

  // 5. Inject uiStrings & hook call at the start of the main view component function
  const functionRegex = new RegExp(`export default function (\\w+)View\\(\\{ data, subPath \\}\\) \\{\\s*const \\[openIndex, setOpenIndex\\] = useState\\(null\\);`);
  content = content.replace(functionRegex, (match) => {
    return `${match}\n\n${uiStringsDeclaration}`;
  });

  // 6. Pass t to AccordionItem inside the items.map call
  content = content.replace(
    /<AccordionItem([\s\S]*?)\/>/g,
    (match) => {
      if (!match.includes("t={t}")) {
        return match.replace(/\/>/, "t={t}\n          />");
      }
      return match;
    }
  );

  // 7. Translate loading messages
  content = content.replace(
    /<p className="text-sm font-medium">([^<]+)<\/p>/,
    `<p className="text-sm font-medium">{t("$1")}</p>`
  );
  content = content.replace(
    /<p className="text-sm font-medium font-mono">([^<]+)<\/p>/,
    `<p className="text-sm font-medium font-mono">{t("$1")}</p>`
  );
  content = content.replace(
    /<p className="text-sm font-semibold tracking-wide">([^<]+)<\/p>/,
    `<p className="text-sm font-semibold tracking-wide">{t("$1")}</p>`
  );

  // 8. Translate headings and counts
  content = content.replace(
    /<h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">\s*([^<]+)\s*<\/h3>/,
    `<h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">{t("$1")}</h3>`
  );
  content = content.replace(
    /\{items\.length\} Updates/g,
    `{items.length} {t("Updates")}`
  );
  content = content.replace(
    /\{items\.length\} Bulletins/g,
    `{items.length} {t("Bulletins")}`
  );
  content = content.replace(
    /\{items\.length\} Publications/g,
    `{items.length} {t("Publications")}`
  );
  content = content.replace(
    /\{items\.length\} Papers/g,
    `{items.length} {t("Papers")}`
  );
  content = content.replace(
    /\{items\.length\} Reports/g,
    `{items.length} {t("Reports")}`
  );
  content = content.replace(
    /\{items\.length\} Alerts/g,
    `{items.length} {t("Alerts")}`
  );
  content = content.replace(
    /\{items\.length\} ACTIVE LOGS/g,
    `{items.length} {t("ACTIVE LOGS")}`
  );
  content = content.replace(
    /\{items\.length\} Reports Active/g,
    `{items.length} {t("Reports Active")}`
  );

  // 9. Specific replaces for ProcurementNewsView which doesn't follow normal accordions
  if (file === 'ProcurementNewsView.jsx') {
    // Translate Procurement Map titles and descriptions
    content = content.replace(
      /Supply Chain Disruption Map/g,
      `{t("Supply Chain Disruption Map")}`
    );
    content = content.replace(
      /Live Disruptions/g,
      `{t("Live Disruptions")}`
    );
    content = content.replace(
      /Est\. Delay/g,
      `{t("Est. Delay")}`
    );
    content = content.replace(
      /\[Geographic Heat Map Rendered Here\]/g,
      `{t("[Geographic Heat Map Rendered Here]")}`
    );
    // Fix missing icon import AlertOctagon -> AlertCircle
    content = content.replace(/AlertOctagon/g, 'AlertCircle');
  }

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${file}`);
});

console.log("All news views updated successfully!");
