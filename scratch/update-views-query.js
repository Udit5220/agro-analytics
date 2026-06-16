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

  const target = `fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title), {`;
  const replacement = `fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title) + "&location=" + encodeURIComponent(userLoc), {`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated ${file} with location query param`);
  } else {
    // Attempt normal newlines matching
    const cleanTarget = target.replace(/\r\n/g, '\n');
    const cleanContent = content.replace(/\r\n/g, '\n');
    if (cleanContent.includes(cleanTarget)) {
      content = cleanContent.replace(cleanTarget, replacement);
      fs.writeFileSync(filePath, content);
      console.log(`Successfully updated ${file} with location query param (normalized newlines)`);
    } else {
      console.log(`Target query not found in ${file}`);
    }
  }
});
