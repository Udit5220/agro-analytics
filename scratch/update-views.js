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

  // Find the fetch headers object and append x-user-location
  const target = `      fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title), {
        headers: { 
          'x-user-role': role,
          'x-language': activeLang
        }
      })`;

  const replacement = `      const userLoc = localStorage.getItem('news_selected_location') || 'Faridabad, Haryana';
      fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title), {
        headers: { 
          'x-user-role': role,
          'x-language': activeLang,
          'x-user-location': userLoc
        }
      })`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated ${file}`);
  } else {
    // Try to match with windows line endings or any slight whitespace variation
    const cleanTarget = target.replace(/\r\n/g, '\n');
    const cleanContent = content.replace(/\r\n/g, '\n');
    if (cleanContent.includes(cleanTarget)) {
      content = cleanContent.replace(cleanTarget, replacement);
      fs.writeFileSync(filePath, content);
      console.log(`Successfully updated ${file} (normalized newlines)`);
    } else {
      console.log(`Target not found in ${file}`);
    }
  }
});
