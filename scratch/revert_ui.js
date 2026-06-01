const fs = require('fs');
const path = require('path');

const filesToProcess = [
  "frontend/src/pages/market-intelligence/CommodityTerminalLayout.jsx",
  "frontend/src/pages/market-intelligence/terminal/Overview.jsx",
  "frontend/src/pages/market-intelligence/terminal/Watchlist.jsx",
  "frontend/src/pages/market-intelligence/terminal/SpotPrices.jsx",
  "frontend/src/pages/market-intelligence/terminal/FuturesPrices.jsx",
  "frontend/src/pages/market-intelligence/terminal/AdvancedCharts.jsx",
  "frontend/src/pages/market-intelligence/terminal/SpreadAnalysis.jsx",
  "frontend/src/pages/market-intelligence/terminal/MarketSignals.jsx",
  "frontend/src/pages/market-intelligence/terminal/GlobalTradeImpact.jsx",
  "frontend/src/pages/market-intelligence/terminal/AiCommentary.jsx",
  "frontend/src/pages/market-intelligence/terminal/Alerts.jsx"
];

const basePath = "c:/Users/devan/OneDrive/Desktop/CODEBASE_AVENTIQ/agro-analytic/";

filesToProcess.forEach(file => {
  const fullPath = path.join(basePath, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping: ${file} (not found)`);
    return;
  }

  let code = fs.readFileSync(fullPath, 'utf8');

  // Step 1: Remove "some-light-class dark:some-dark-class" inside className strings.
  // It matches a light class, space(s), and the "dark:" prefix, replacing both with just the dark class.
  // E.g. "bg-white dark:bg-[#1e293b]" -> "bg-[#1e293b]"
  // It handles Tailwind classes including those with hash codes, square brackets, slashes, etc.
  code = code.replace(/([a-zA-Z0-9#\-\[\]\/]+(?:\/[0-9]+)?)\s+dark:([a-zA-Z0-9#\-\[\]\/]+(?:\/[0-9]+)?)/g, '$2');
  
  // Step 2: Handle cases where the refactor script added standalone "dark:" classes without a preceding light class.
  // Or cases where `dark:hover:` etc were added.
  code = code.replace(/dark:hover:([a-zA-Z0-9#\-\[\]\/]+(?:\/[0-9]+)?)/g, 'hover:$1');
  code = code.replace(/dark:([a-zA-Z0-9#\-\[\]\/]+(?:\/[0-9]+)?)/g, '$1');

  fs.writeFileSync(fullPath, code);
  console.log(`Reverted classes in: ${file}`);
});
