/**
 * coreEngine.js
 * 
 * Shared parsing & orchestration middleware. Serves as the central dispatcher 
 * to coordinate input telemetry, format prompts using specialized developer models, 
 * run inferences, and parse structural outputs.
 */

import { generateContent } from './client';
import { getCropPrompt, getSoilPrompt, getPathologyPrompt } from './developers/devUdit';

/**
 * Orchestrates agronomist inferences across various domains.
 * 
 * @param {string} engineType - Target task ('recommendation', 'soil', 'pathology')
 * @param {object} telemetry - Dynamic soil, crop, and location telemetry
 * @returns {Promise<object>} Parsed analytical results
 */
export async function runAgronomistInference(engineType, telemetry = {}) {
  let prompt = '';
  
  switch (engineType) {
    case 'recommendation':
      // Udit's specialized dynamic crop recommendation templates
      prompt = getCropPrompt(telemetry);
      break;
      
    case 'soil':
      // Udit's chemical and pH balancing soil guidelines
      prompt = getSoilPrompt(telemetry);
      break;
      
    case 'pathology':
      // Udit's pathogen infection vectors and disease treatment templates
      prompt = getPathologyPrompt(telemetry);
      break;
      
    default:
      prompt = `Act as an expert agronomist. Analyze the following telemetry and provide quick insights: ${JSON.stringify(telemetry)}`;
  }

  try {
    const rawText = await generateContent(prompt, { temperature: 0.2 });
    return parseModelResponse(rawText);
  } catch (error) {
    console.error("Agronomy coreEngine execution failure:", error);
    return {
      success: false,
      error: error.message || "Failed to complete AI agronomist inference.",
      fallbackData: getAgronomyFallback(engineType, telemetry)
    };
  }
}

/**
 * Resilient JSON parsing supporting markdown code blocks fallback.
 */
function parseModelResponse(text) {
  try {
    // Strip markdown code block boundaries if present
    const cleanText = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
      
    return JSON.parse(cleanText);
  } catch (err) {
    // Return structured text fallback if not strictly JSON
    return {
      success: true,
      rawOutput: text,
      isStructuredText: true
    };
  }
}

/**
 * Fallback static matrices when the external API limits out or key is invalid.
 */
function getAgronomyFallback(type, data) {
  if (type === 'soil') {
    return {
      nitrogenStatus: "Moderate",
      actionNeeded: "Apply 25kg/acre Nitrogen through split urea dressing.",
      advisoryEnglish: "Soil demonstrates moderate organic load. Consider inter-cropping with legumes.",
      advisoryHindi: "मिट्टी में मध्यम नाइट्रोजन लोड है। फलियों के साथ फसल चक्र अपनाएं।"
    };
  }
  return {
    recommendation: `Advisory for ${data.crop || 'Rice'} at stage ${data.stage || 'Vegetative'}: Maintain regular watering schedules.`,
    riskLevel: "Low"
  };
}
