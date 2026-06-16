import fs from 'fs';
import path from 'path';

const dir = 'c:/Agro_Project/agro-analytics/frontend/src/pages/news-intel';
const files = [
  'FarmerNewsView.jsx',
  'FPONewsView.jsx',
  'TraderNewsView.jsx',
  'ProcurementNewsView.jsx',
  'AgribusinessNewsView.jsx',
  'ResearcherNewsView.jsx',
  'GovNewsView.jsx',
  'AdminNewsView.jsx'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace whatever details fetch is there with the timestamped version
  const targetPattern = /fetch\("http:\/\/localhost:5000\/api\/news\/ai-details\?headline=" \+ encodeURIComponent\(title\)[^,]*,\s*\{/g;
  
  content = content.replace(targetPattern, 'fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title) + "&location=" + encodeURIComponent(userLoc) + "&t=" + Date.now(), {');

  fs.writeFileSync(filePath, content);
  console.log(`Successfully updated ${file} with cache-busting timestamp`);
});
