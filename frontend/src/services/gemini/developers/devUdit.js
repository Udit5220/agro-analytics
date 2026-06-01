/**
 * devUdit.js
 * 
 * Developer Udit's custom agronomist prompt templates for the AgroIndia platform.
 * Consolidates all prompt builders under a unified, premium sandbox.
 */

/**
 * Builds the structural system prompt for AI crop recommendation matrix.
 * Used to evaluate crop matches based on real-time soil and season telemetry.
 * 
 * @param {object} telemetry - Soil parameters (pH, Nitrogen, Pincode) and Season
 * @returns {string} Fully composed prompt instructions
 */
export function getCropPrompt(telemetry = {}) {
  const { state = 'Haryana', district = 'Faridabad', pincode = '121001', season = 'Kharif', soilData = {} } = telemetry;
  
  return `You are Senior AI Agronomist, specialized in Indian crop yield optimization.
Analyze the following farm telemetry parameters:
- State: ${state}
- District: ${district}
- Pincode: ${pincode}
- Growing Season: ${season}
- Soil pH: ${soilData.pH || 6.8}
- Nitrogen (N) Content: ${soilData.nitrogen || 270} kg/ha
- Phosphorus (P) Content: ${soilData.phosphorus || 18} kg/ha

Instruction: Generate a JSON response recommending the top 3 best-matching crops with these exact properties:
- id: unique string starting with "crop-"
- name: Crop Name in English (e.g., "Rice (Paddy)", "Wheat")
- hindiName: Hindi translation (e.g., "धान", "गेहूं")
- matchScore: Suitable integer between 45 and 98 based on soil pH and season suitability
- estimatedYield: Yield range string in quintals per acre (e.g., "22 - 26 qtl/acre")
- roiEstimate: Net estimated profit string (e.g. "₹48,500/acre")
- riskLevel: "Low Risk", "Medium Risk", or "High Risk"
- details: Brief description (max 20 words) detailing why this fits the local moisture and temperature.

Respond ONLY with a valid, clean JSON object. Do not include markdown codeblocks or extra conversation text. Shape:
{
  "detectedSeason": "${season}",
  "recommendedCrops": [
     // exactly 3 crop objects here
  ]
}`;
}

/**
 * Builds the structural system prompt for soil health rules and NPK calibrations.
 * 
 * @param {object} telemetry - Soil parameters (pH, Nitrogen, Pincode, Soil Classification)
 * @returns {string} Fully composed prompt instructions
 */
export function getSoilPrompt(telemetry = {}) {
  const { soilType = 'Loamy Soil', pH = 6.8, nitrogen = 270, phosphorus = 18 } = telemetry;
  
  return `You are Senior AI Soil Chemistry advisor.
Analyze the following soil lab reports:
- Soil Classification: ${soilType}
- Soil pH Index: ${pH}
- Nitrogen (N): ${nitrogen} kg/ha
- Phosphorus (P): ${phosphorus} kg/ha

Instruction: Generate a JSON response with specialized soil diagnostic details and specific fertilizer corrections:
- nitrogenStatus: "Low", "Moderate", or "Optimal"
- chemicalAdvisory: Precise agronomist suggestion detailing correct urea, diammonium phosphate (DAP), or organic compost volumes to apply.
- phCorrection: If pH is acidic (<6.0) suggest adding agricultural lime. If alkaline (>7.5) suggest gypsum. Otherwise confirm status is optimal.
- translationHindi: Dynamic Hindi translation for both recommendations.

Respond ONLY with a valid, clean JSON object. Do not include markdown codeblocks or extra conversation text. Shape:
{
  "nitrogenStatus": "StatusText",
  "nitrogenDose": "25kg/acre split dressing",
  "chemicalAdvisory": "Detailed advisory text here",
  "phCorrection": "PH correction advice here",
  "translationHindi": "हिंदी अनुवाद यहां लिखें"
}`;
}

/**
 * Builds the structural system prompt for disease diagnostics and pathology advisor.
 * 
 * @param {object} telemetry - Pathogen name, crop, severity, region coordinates
 * @returns {string} Fully composed prompt instructions
 */
export function getPathologyPrompt(telemetry = {}) {
  const { crop = 'Wheat', disease = 'Yellow Rust', severity = 'High', district = 'Faridabad' } = telemetry;
  
  return `You are Senior Crop Pathology expert, focusing on disease outbreaks in ${district}.
Analyze the following disease telemetry:
- Target Crop: ${crop}
- Active Pathogen: ${disease}
- Outbreak Severity: ${severity}

Instruction: Generate a JSON response outlining the precise chemical and organic treatment regimens:
- organicTreatment: Exact organic recipe (e.g. neem oil concentration, Trichoderma drench schedules)
- chemicalTreatment: Recommended chemical pesticide/fungicide with exact concentration metrics (e.g. Propiconazole 0.1%)
- warning: High emphasis agricultural warnings regarding application time (e.g. avoid hot mid-days)
- translationHindi: Hindi translations of the treatment schedule.

Respond ONLY with a valid, clean JSON object. Do not include markdown codeblocks or extra conversation text. Shape:
{
  "organicTreatment": "Detailed organic protocol here",
  "chemicalTreatment": "Detailed chemical protocol here",
  "warning": "Pathology warning alert here",
  "translationHindi": "हिंदी उपचार विवरण यहां"
}`;
}
