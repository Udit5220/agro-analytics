import { farmerContent } from '../data/farmerContent.js';
import { fpoContent } from '../data/fpoContent.js';
import { agribusinessContent } from '../data/agribusinessContent.js';
import { governmentContent } from '../data/governmentContent.js';
import { companyAdminContent } from '../data/companyAdminContent.js';
import { commodityTraderContent } from '../data/commodityTraderContent.js';
import { researchAnalystContent } from '../data/researchAnalystContent.js';

/**
 * Robust utility to load predefined hardcoded content when AI fails.
 * Guarantees valid structured JSON data is always returned to the frontend.
 */
export const getFallbackContent = (role, subPath, language, context = '') => {
  let roleData;

  // 1. Select the correct dataset based on role
  switch (role) {
    case 'Farmer':
      roleData = farmerContent;
      break;
    case 'FPO':
      roleData = fpoContent;
      break;
    case 'Agribusiness Manager':
      roleData = agribusinessContent;
      break;
    case 'Government Official':
      roleData = governmentContent;
      break;
    case 'Company Admin':
      roleData = companyAdminContent;
      break;
    case 'Commodity Trader':
      roleData = commodityTraderContent;
      break;
    case 'Research Analyst':
      roleData = researchAnalystContent;
      break;
    default:
      roleData = farmerContent; // fallback to Farmer
  }

  // 2. Select the specific subpage content
  let fallbackData;
  if (roleData[subPath]) {
    fallbackData = { ...roleData[subPath] };
    
    // Inject the specific context (course title) if provided, to make lessons/quizzes relevant even offline
    if (context) {
        if (subPath === 'lesson' && fallbackData.module_title) {
            fallbackData.module_title = context;
            if (fallbackData.timeline && fallbackData.timeline.length > 0) {
               fallbackData.timeline[0].title = `Intro to ${context}`;
            }
        }
        if (subPath === 'quiz' && fallbackData.course_title) {
            fallbackData.course_title = `${context} Assessment`;
        }
    }
  } else {
    // If it's a custom dynamic topic (e.g. crop-management), fallback to defaultCatalog
    fallbackData = { ...roleData.defaultCatalog };
    
    // Customize the catalog titles based on the requested subPath for better UX
    if (fallbackData.courses) {
        const titleFormat = subPath.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        fallbackData.courses = fallbackData.courses.map((course, index) => ({
            ...course,
            title: `${titleFormat} - ${course.title}`
        }));
    }
  }

  // Add a fallback indicator (optional, useful for frontend debugging if needed)
  fallbackData._isFallback = true;
  
  return fallbackData;
};
