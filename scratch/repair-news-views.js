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

  // Repair the React import lines
  content = content.replace(
    /import React, \{ useState \}\s*import \{ useAITranslation \} from '\.\.\/\.\.\/hooks\/useAITranslation'; from 'react';/g,
    "import React, { useState } from 'react';\nimport { useAITranslation } from '../../hooks/useAITranslation';"
  );
  content = content.replace(
    /import React, \{ useState \}\nimport \{ useAITranslation \} from '\.\.\/\.\.\/hooks\/useAITranslation'; from 'react';/g,
    "import React, { useState } from 'react';\nimport { useAITranslation } from '../../hooks/useAITranslation';"
  );

  // Fix ProcurementNewsView icon imports if applicable
  if (file === 'ProcurementNewsView.jsx') {
    if (!content.includes('AlertCircle') && content.includes('lucide-react')) {
      content = content.replace(
        /import \{ ([^}]+) \} from 'lucide-react';/,
        (match, p1) => {
          let imports = p1.split(',').map(s => s.trim());
          if (!imports.includes('AlertCircle')) {
            imports.push('AlertCircle');
          }
          return `import { ${imports.join(', ')} } from 'lucide-react';`;
        }
      );
    }
  }

  fs.writeFileSync(fullPath, content);
  console.log(`Repaired ${file}`);
});
console.log("Repair finished successfully!");
