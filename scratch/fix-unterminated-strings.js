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

files.forEach(file => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Match t("...") containing newlines or extra spaces
  // We use [\s\S]+? inside quotes, but make sure to stop at the closing quote
  content = content.replace(/\{t\(\"([\s\S]+?)\"\)\}/g, (match, p1) => {
    const clean = p1.replace(/\s+/g, ' ').trim();
    return `{t("${clean}")}`;
  });

  fs.writeFileSync(fullPath, content);
  console.log(`Fixed formatting in ${file}`);
});

console.log("Formatting fix finished!");
