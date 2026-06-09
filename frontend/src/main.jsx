import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { uiConfig } from './utils/uiConfig'

// Inject UI config theme variables into document root
if (uiConfig.theme && uiConfig.theme.colors) {
  const root = document.documentElement;
  Object.entries(uiConfig.theme.colors).forEach(([key, val]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, val);
  });
}

// CP1252 Mojibake self-healing block for localStorage
try {
  const keysToPurge = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key);
      if (val && (val.includes('à¤') || val.includes('\u00e0\u00a4') || val.includes('—') || val.includes('à¥') || val.includes('à¦'))) {
        keysToPurge.push(key);
      }
    }
  }
  keysToPurge.forEach(key => {
    console.warn(`Purging corrupted localStorage key: ${key}`);
    localStorage.removeItem(key);
  });
} catch (e) {
  console.error("Failed to self-heal localStorage", e);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
