import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// CP1252 Mojibake self-healing block for localStorage
try {
  const keysToPurge = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const val = localStorage.getItem(key);
      if (val && (val.includes('à¤') || val.includes('\u00e0\u00a4') || val.includes('â€”') || val.includes('à¥') || val.includes('à¦'))) {
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
