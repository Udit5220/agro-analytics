import fs from 'fs';
import path from 'path';

const dir = 'c:/Agro_Project/agro-analytics/frontend/src/pages/news-intel';

const filesToUpdate = [
  'FarmerNewsView.jsx',
  'GovNewsView.jsx',
  'AgribusinessNewsView.jsx',
  'ProcurementNewsView.jsx',
  'TraderNewsView.jsx',
  'AdminNewsView.jsx',
  'ResearcherNewsView.jsx',
  'FPONewsView.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Fix InfoIcon -> Info in imports
  content = content.replace(/InfoIcon/g, 'Info');

  fs.writeFileSync(fullPath, content);
  console.log("Fixed Info icon in " + file);
});
