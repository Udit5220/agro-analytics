/**
 * journalService.js
 * 
 * Provides local storage persistence and analytical query functions for the 
 * Farm Journal history, regional yield benchmarking, and soil trend tracking.
 */

const LOCAL_STORAGE_KEY = 'agro_india_journal_entries';

// Realistic agricultural yield averages for crops in India (qtl/acre)
const REGIONAL_YIELD_BENCHMARKS = {
  "Rice": { districtAvg: 23, nationalAvg: 17.2, unit: "qtl/acre" },
  "Wheat": { districtAvg: 21, nationalAvg: 15.5, unit: "qtl/acre" },
  "Cotton": { districtAvg: 9, nationalAvg: 6.8, unit: "qtl/acre" },
  "Maize": { districtAvg: 22, nationalAvg: 15.0, unit: "qtl/acre" },
  "Mustard": { districtAvg: 8.5, nationalAvg: 6.2, unit: "qtl/acre" },
  "Watermelon": { districtAvg: 110, nationalAvg: 85.0, unit: "qtl/acre" }
};

/**
 * Saves a new seasonal log entry to local storage.
 * @param {object} entry - The journal record
 * @returns {object} The saved entry with generated unique identity
 */
export function saveSeasonEntry(entry) {
  try {
    const entries = getAllEntries();
    const newEntry = {
      ...entry,
      id: entry.id || 'jrnl_' + Math.random().toString(36).substr(2, 9),
      createdAt: entry.createdAt || new Date().toISOString()
    };
    entries.push(newEntry);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  } catch (error) {
    console.error("Failed to write season journal log to LocalStorage:", error);
    return null;
  }
}

/**
 * Loads all journal records from local storage.
 * Sorted chronologically by year (descending) and season sequence.
 * @returns {Array<object>}
 */
export function getAllEntries() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return getMockHistoricalEntries(); // return seed data if empty so the chart looks stunning right away!
    const parsed = JSON.parse(raw);
    
    // Sort chronologically (Year Descending, then Season sequence Zaid -> Rabi -> Kharif)
    const seasonOrder = { "Zaid": 0, "Rabi": 1, "Kharif": 2 };
    return parsed.sort((a, b) => {
      const yearDiff = parseInt(b.year, 10) - parseInt(a.year, 10);
      if (yearDiff !== 0) return yearDiff;
      return (seasonOrder[b.season] || 0) - (seasonOrder[a.season] || 0);
    });
  } catch (error) {
    console.error("Failed to read journal entries from LocalStorage:", error);
    return [];
  }
}

/**
 * Deletes a journal log entry by unique identity.
 * @param {string} id - unique ID of the record
 * @returns {boolean} Whether operation succeeded
 */
export function deleteEntry(id) {
  try {
    const entries = getAllEntries();
    const filtered = entries.filter((e) => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Failed to delete journal entry:", error);
    return false;
  }
}

/**
 * Aggregates year-over-year performance values for a chosen crop.
 * @param {string} crop - Crop name (e.g. Wheat, Rice)
 * @returns {Array<{year: number, season: string, yield: number, profit: number, cost: number, revenue: number}>}
 */
export function getYearOverYear(crop) {
  const all = getAllEntries();
  return all
    .filter((e) => e.crop.toLowerCase().includes(crop.toLowerCase()))
    .map((e) => {
      const yieldPerAcre = parseFloat((parseFloat(e.actualYield) / parseFloat(e.acreage)).toFixed(1));
      const profit = parseFloat(e.actualRevenue) - parseFloat(e.totalCost);
      const profitPerAcre = parseFloat((profit / parseFloat(e.acreage)).toFixed(0));
      return {
        id: e.id,
        year: parseInt(e.year, 10),
        season: e.season,
        yieldVal: yieldPerAcre, // quintals per acre
        profitVal: profitPerAcre, // ₹ per acre
        costVal: parseFloat(e.totalCost),
        revenueVal: parseFloat(e.actualRevenue),
        acreage: parseFloat(e.acreage)
      };
    })
    .sort((a, b) => a.year - b.year); // Sort oldest to newest for chronological progress
}

/**
 * Compares farmer productivity benchmarks against regional and national averages.
 * @param {string} crop - Crop classification name
 * @param {string} district - Regional boundaries
 * @param {number} farmerYieldPerAcre - The calculated yield (qtl/acre)
 * @returns {{districtAvg: number, nationalAvg: number, gapPercent: number, suggestion: string, unit: string}}
 */
export function benchmarkYield(crop, district, farmerYieldPerAcre) {
  // Safe normalization
  const normalizedCrop = Object.keys(REGIONAL_YIELD_BENCHMARKS).find(
    (k) => k.toLowerCase() === String(crop || "").trim().toLowerCase()
  ) || "Wheat";

  const benchmark = REGIONAL_YIELD_BENCHMARKS[normalizedCrop];
  const districtAvg = benchmark.districtAvg;
  const nationalAvg = benchmark.nationalAvg;
  
  const gap = farmerYieldPerAcre - districtAvg;
  const gapPercent = Math.round((gap / districtAvg) * 100);

  let suggestion = "";
  if (gapPercent < 0) {
    suggestion = `Your ${normalizedCrop.toLowerCase()} yield is ${Math.abs(gapPercent)}% below the ${district || "Faridabad"} district average. High-yield farmers in this district recommend using balanced micro-drip irrigation, localized nitrogen-splitting urea applications, and premium university-certified seed varieties.`;
  } else if (gapPercent === 0) {
    suggestion = `Your ${normalizedCrop.toLowerCase()} yield matches the regional average. To push beyond, consider introducing nitrogen-fixing legume rotations and bio-fungicides like Trichoderma during the early vegetative phase.`;
  } else {
    suggestion = `Outstanding! Your ${normalizedCrop.toLowerCase()} yield is ${gapPercent}% higher than the ${district || "Faridabad"} district average. To sustain this optimal performance, prioritize organic humus composting and carry out light deep-tillage during Rabi preparation.`;
  }

  return {
    districtAvg,
    nationalAvg,
    gapPercent,
    suggestion,
    unit: benchmark.unit
  };
}

/**
 * Extract pH and Nitrogen levels over seasons to construct trend lines.
 * @param {Array<object>} entries - Collected journal records
 * @returns {Array<{label: string, pH: number, nitrogen: number}>}
 */
export function getSoilTrend(entries) {
  return [...entries]
    .filter((e) => e.soilPH && e.nitrogen)
    .sort((a, b) => parseInt(a.year, 10) - parseInt(b.year, 10)) // chronologically ascending
    .map((e) => ({
      label: `${e.season.slice(0,2)} '${String(e.year).slice(2)}`,
      pH: parseFloat(e.soilPH),
      nitrogen: parseFloat(e.nitrogen)
    }));
}

/**
 * Dynamic Mock/Seed Data to prepopulate farmer history for high-fidelity presentation.
 * Returns realistic historical cropping records for Suresh Kumar.
 * @returns {Array<object>}
 */
function getMockHistoricalEntries() {
  return [
    {
      id: "jrnl_mock_1",
      season: "Kharif",
      year: "2023",
      crop: "Rice",
      acreage: "5",
      totalCost: "22000",
      actualYield: "105", // 21 qtl/acre
      actualRevenue: "58000",
      notes: "Sown slightly late due to monsoon delay. High fertilizer costs but good market selling price.",
      soilPH: "6.2",
      nitrogen: "250",
      createdAt: new Date("2023-11-15T12:00:00Z").toISOString()
    },
    {
      id: "jrnl_mock_2",
      season: "Rabi",
      year: "2023",
      crop: "Wheat",
      acreage: "5",
      totalCost: "19000",
      actualYield: "95", // 19 qtl/acre
      actualRevenue: "47500",
      notes: "Excellent soil moisture throughout winter. Mild winter rain boosted seed formation.",
      soilPH: "6.4",
      nitrogen: "265",
      createdAt: new Date("2024-04-20T12:00:00Z").toISOString()
    },
    {
      id: "jrnl_mock_3",
      season: "Kharif",
      year: "2024",
      crop: "Rice",
      acreage: "5",
      totalCost: "23500",
      actualYield: "120", // 24 qtl/acre
      actualRevenue: "69000",
      notes: "Auto-irrigation system active. Applied dynamic NPK scheduling recommendation. Outstanding vegetative growth.",
      soilPH: "6.7",
      nitrogen: "290",
      createdAt: new Date("2024-11-18T12:00:00Z").toISOString()
    },
    {
      id: "jrnl_mock_4",
      season: "Rabi",
      year: "2024",
      crop: "Wheat",
      acreage: "5",
      totalCost: "20500",
      actualYield: "115", // 23 qtl/acre
      actualRevenue: "59800",
      notes: "Certified hybrid seed variety PBW-343. Exceptional root structure and minimal yellow rust incidence.",
      soilPH: "6.8",
      nitrogen: "310",
      createdAt: new Date("2025-04-22T12:00:00Z").toISOString()
    }
  ];
}
