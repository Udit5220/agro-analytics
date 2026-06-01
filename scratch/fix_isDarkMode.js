const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/devan/OneDrive/Desktop/CODEBASE_AVENTIQ/agro-analytic/frontend/src/pages/market-intelligence/terminal';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Replace `isDarkMode ? 'darkVal' : 'lightVal'` with `'darkVal'`
  code = code.replace(/isDarkMode\s*\?\s*'([^']+)'\s*:\s*'([^']+)'/g, "'$1'");
  
  // Replace `{ isDarkMode ? 'darkVal' : 'lightVal' }` with `'darkVal'` if it was unquoted
  // But usually it's used inside `{}` for props. Since we replaced the string inside, `{ 'darkVal' }` becomes valid JSX or we can just replace `{ 'darkVal' }` with `"darkVal"` later if needed, but `{ 'darkVal' }` works fine in React.
  
  // Remove `isDarkMode,` or `, isDarkMode` or `isDarkMode` from destructuring
  code = code.replace(/,\s*isDarkMode\b/g, '');
  code = code.replace(/\bisDarkMode\s*,\s*/g, '');
  
  // Just in case it's the only variable (unlikely here)
  code = code.replace(/\{\s*isDarkMode\s*\}/g, '{}');
  
  // Also fix `isDarkMode: false` default values
  code = code.replace(/,\s*isDarkMode:\s*(true|false)/g, '');

  fs.writeFileSync(fullPath, code);
  console.log(`Fixed isDarkMode in: ${file}`);
});
