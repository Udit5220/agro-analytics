import fs from 'fs';
import path from 'path';

const dir = 'c:/Agro_Project/agro-analytics/frontend/src/pages/news-intel';

const colorRegex = /\b(red|orange|amber|yellow|lime|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|zinc)-(50|100|200|300|400|500|600|700|800|900|950)\b/g;

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      content = content.replace(colorRegex, (match, color, weight) => {
        return `emerald-${weight}`;
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Greenified: ${file}`);
      }
    }
  });
}

processDirectory(dir);
console.log('All components are now 100% emerald green!');
