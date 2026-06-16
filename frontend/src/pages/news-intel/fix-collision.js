import fs from 'fs';
import path from 'path';

const dir = 'c:/Agro_Project/agro-analytics/frontend/src/pages/news-intel';
const files = fs.readdirSync(dir).filter(f => f.endsWith('NewsView.jsx'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Fix the naming collision by using an alias
  content = content.replace(/,\s*Info\s*\}/g, ', Info as LucideInfo }');
  content = content.replace(/let Icon = Info;/g, 'let Icon = LucideInfo;');

  fs.writeFileSync(fullPath, content);
  console.log("Fixed collision in " + file);
});
