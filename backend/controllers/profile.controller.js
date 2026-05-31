import FarmerProfile from '../models/FarmerProfile.js';

// Helper for graceful MongoDB handling
const tryMongo = async (fn, fallback = null) => {
  try { return await fn(); }
  catch (e) { console.error('[Profile Controller] Mongoose Error:', e.message); return fallback; }
};

// Seed default profile data if not present
const getOrCreateDefaultProfile = async () => {
  // Inspect raw MongoDB document without Mongoose defaults hydration to check if sownArea is missing
  const rawProfile = await FarmerProfile.findOne({ userId: 'guest' }).lean();
  
  if (rawProfile && rawProfile.farms.length > 0) {
    const firstFarm = rawProfile.farms[0];
    const isObsolete = firstFarm.crops.length > 0 && (
      typeof firstFarm.crops[0] === 'string' || 
      !firstFarm.crops[0].name || 
      firstFarm.crops[0].sownArea === undefined ||
      JSON.stringify(firstFarm.crops[0]).includes('"0":')
    );
    if (isObsolete) {
      console.warn('[Profile Controller] Obsolete profile layout found in DB. Deleting to perform fresh structure seeding...');
      await FarmerProfile.deleteOne({ userId: 'guest' });
    }
  }

  let profile = await FarmerProfile.findOne({ userId: 'guest' });

  if (!profile) {
    profile = new FarmerProfile({
      userId: 'guest',
      name: 'Suresh Kumar',
      location: 'Faridabad, Haryana',
      pincode: '121001',
      primaryCrops: ['Rice', 'Wheat'],
      farms: [
        {
          name: 'Home Sector Flatlands',
          location: 'Faridabad Outskirts',
          totalLand: 4.5,
          crops: [
            { name: 'Rice (Paddy)', sowingDate: '2026-05-01', sownArea: 2.5 },
            { name: 'Mustard', sowingDate: '2026-05-15', sownArea: 1.5 }
          ]
        },
        {
          name: 'Northern Tube-well Plot',
          location: 'Ballabhgarh Boundary',
          totalLand: 3.2,
          crops: [
            { name: 'Wheat', sowingDate: '2025-11-10', sownArea: 2.0 }
          ]
        }
      ]
    });
    await profile.save();
    console.log('[Profile Controller] Default profile initialized and seeded in MongoDB with Sowing Dates and Sown Areas.');
  }
  return profile;
};

// ─── GET /api/profile ──────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const profile = await getOrCreateDefaultProfile();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── PUT /api/profile ──────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, location, pincode, primaryCrops } = req.body;
    let profile = await FarmerProfile.findOne({ userId: 'guest' });
    
    if (!profile) {
      profile = await getOrCreateDefaultProfile();
    }

    if (name !== undefined) profile.name = name;
    if (location !== undefined) profile.location = location;
    if (pincode !== undefined) profile.pincode = pincode;
    if (primaryCrops !== undefined) profile.primaryCrops = primaryCrops;

    await profile.save();
    res.json({ success: true, message: 'Farmer profile updated successfully', data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── POST /api/profile/farms ──────────────────────────────────────────────────
export const addFarm = async (req, res) => {
  try {
    const { name, location, totalLand, crops } = req.body;
    if (!name || totalLand === undefined || totalLand === null) {
      return res.status(400).json({ success: false, error: 'Name and total land are required fields.' });
    }

    const numericLand = Number(totalLand);
    if (isNaN(numericLand) || numericLand <= 0) {
      return res.status(400).json({ success: false, error: 'Total land area must be a positive number. Alphabetic characters or negative values are not allowed.' });
    }

    const validatedCrops = [];
    let totalSownArea = 0;

    if (crops && Array.isArray(crops)) {
      for (const crop of crops) {
        if (!crop.name || !crop.name.trim()) {
          return res.status(400).json({ success: false, error: 'Crop name is required for all active crops.' });
        }
        const numericSown = Number(crop.sownArea || 0);
        if (isNaN(numericSown) || numericSown < 0) {
          return res.status(400).json({ success: false, error: `Sown area for ${crop.name} must be a positive number.` });
        }
        totalSownArea += numericSown;
        validatedCrops.push({
          name: crop.name.trim(),
          sowingDate: crop.sowingDate || '',
          sownArea: numericSown
        });
      }
    }

    if (totalSownArea > numericLand) {
      return res.status(400).json({
        success: false,
        error: `Over-allocation error: Total crop sown area (${totalSownArea} Acres) exceeds the farm's total land area (${numericLand} Acres).`
      });
    }

    let profile = await FarmerProfile.findOne({ userId: 'guest' });
    if (!profile) {
      profile = await getOrCreateDefaultProfile();
    }

    const newFarm = { 
      name: name.trim(), 
      location: location || 'Haryana Region', 
      totalLand: numericLand, 
      crops: validatedCrops 
    };
    profile.farms.push(newFarm);
    await profile.save();

    // Get the newly added farm (it will be the last element)
    const addedFarm = profile.farms[profile.farms.length - 1];

    res.status(201).json({ success: true, message: 'Land asset registered successfully', data: addedFarm, farms: profile.farms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── PUT /api/profile/farms/:id ───────────────────────────────────────────────
export const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, totalLand, crops } = req.body;

    const profile = await FarmerProfile.findOne({ userId: 'guest' });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const farm = profile.farms.id(id);
    if (!farm) {
      return res.status(404).json({ success: false, error: 'Farm asset not found' });
    }

    // Determine final total land for validation
    let finalLand = farm.totalLand;
    if (totalLand !== undefined) {
      const numericLand = Number(totalLand);
      if (isNaN(numericLand) || numericLand <= 0) {
        return res.status(400).json({ success: false, error: 'Total land area must be a positive number. Alphabetic characters or negative values are not allowed.' });
      }
      finalLand = numericLand;
    }

    // Determine final crops for validation
    let finalCrops = farm.crops;
    if (crops !== undefined) {
      if (!Array.isArray(crops)) {
        return res.status(400).json({ success: false, error: 'Crops must be an array.' });
      }
      
      const validatedCrops = [];
      let totalSownArea = 0;
      for (const crop of crops) {
        if (!crop.name || !crop.name.trim()) {
          return res.status(400).json({ success: false, error: 'Crop name is required for all active crops.' });
        }
        const numericSown = Number(crop.sownArea || 0);
        if (isNaN(numericSown) || numericSown < 0) {
          return res.status(400).json({ success: false, error: `Sown area for ${crop.name} must be a positive number.` });
        }
        totalSownArea += numericSown;
        validatedCrops.push({
          name: crop.name.trim(),
          sowingDate: crop.sowingDate || '',
          sownArea: numericSown
        });
      }

      if (totalSownArea > finalLand) {
        return res.status(400).json({
          success: false,
          error: `Over-allocation error: Total crop sown area (${totalSownArea} Acres) exceeds the farm's total land area (${finalLand} Acres).`
        });
      }
      finalCrops = validatedCrops;
    } else {
      // If land is changing but crops are not, validate existing crops against new land size
      let totalSownArea = 0;
      for (const crop of farm.crops) {
        totalSownArea += Number(crop.sownArea || 0);
      }
      if (totalSownArea > finalLand) {
        return res.status(400).json({
          success: false,
          error: `Over-allocation error: Shrinking farm land to ${finalLand} Acres would be less than the current total crop sown area (${totalSownArea} Acres).`
        });
      }
    }

    if (name !== undefined) farm.name = name.trim();
    if (location !== undefined) farm.location = location;
    if (totalLand !== undefined) farm.totalLand = finalLand;
    if (crops !== undefined) farm.crops = finalCrops;

    await profile.save();
    res.json({ success: true, message: 'Land asset updated successfully', data: farm, farms: profile.farms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── DELETE /api/profile/farms/:id ────────────────────────────────────────────
export const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await FarmerProfile.findOne({ userId: 'guest' });
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const farm = profile.farms.id(id);
    if (!farm) {
      return res.status(404).json({ success: false, error: 'Farm asset not found' });
    }

    profile.farms.pull(id);
    await profile.save();
    res.json({ success: true, message: 'Land asset deleted successfully', farms: profile.farms });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ─── POST /api/crop-ranking ──────────────────────────────────────────────────
export const getCropRankingsBackend = async (req, res) => {
  try {
    const {
      district = 'Faridabad',
      soilType = 'Loamy',
      rainfall = 420,
      temperature = 28,
      waterAvailability = 'Medium',
      landArea = 5,
      waterWeight = 50,
      roiWeight = 50,
      riskWeight = 50
    } = req.body;

    // Define base agronomical parameters for all 9 key crops
    const CROPS_METRICS = [
      { name: 'Wheat', hindi: 'गेहूं', baseRoi: 88, baseWaterDemand: 40, baseRisk: 20, preferredSoils: ['Loamy', 'Silt', 'Clay', 'Alluvial'], tempRange: [12, 25], rainRange: [300, 600] },
      { name: 'Rice', hindi: 'चावल', baseRoi: 82, baseWaterDemand: 95, baseRisk: 35, preferredSoils: ['Clay', 'Alluvial', 'Silt'], tempRange: [22, 35], rainRange: [800, 1500] },
      { name: 'Maize', hindi: 'मक्का', baseRoi: 75, baseWaterDemand: 55, baseRisk: 30, preferredSoils: ['Loamy', 'Alluvial', 'Silt'], tempRange: [18, 30], rainRange: [500, 900] },
      { name: 'Sugarcane', hindi: 'गन्ना', baseRoi: 85, baseWaterDemand: 90, baseRisk: 40, preferredSoils: ['Clay', 'Loamy', 'Alluvial'], tempRange: [20, 38], rainRange: [750, 1300] },
      { name: 'Cotton', hindi: 'कपास', baseRoi: 78, baseWaterDemand: 50, baseRisk: 38, preferredSoils: ['Clay', 'Loamy', 'Black'], tempRange: [20, 32], rainRange: [400, 800] },
      { name: 'Mustard', hindi: 'सरसों', baseRoi: 68, baseWaterDemand: 25, baseRisk: 22, preferredSoils: ['Sandy', 'Loamy', 'Alluvial'], tempRange: [10, 22], rainRange: [200, 450] },
      { name: 'Bajra', hindi: 'बाजरा', baseRoi: 60, baseWaterDemand: 15, baseRisk: 15, preferredSoils: ['Sandy', 'Loamy', 'Chalky'], tempRange: [25, 42], rainRange: [150, 400] },
      { name: 'Moong', hindi: 'मूंग', baseRoi: 58, baseWaterDemand: 20, baseRisk: 18, preferredSoils: ['Loamy', 'Sandy', 'Silt'], tempRange: [20, 35], rainRange: [250, 500] },
      { name: 'Sunflower', hindi: 'सूरजमुखी', baseRoi: 62, baseWaterDemand: 35, baseRisk: 25, preferredSoils: ['Loamy', 'Alluvial', 'Silt'], tempRange: [15, 30], rainRange: [300, 650] }
    ];

    // Check if Gemini API key exists inside the backend to perform live inference
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (GEMINI_API_KEY) {
      try {
        // Build call to Gemini
        const model = "gemini-3.1-pro-preview";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        
        const systemPrompt = "You are an agriculture ranking expert. Always return ONLY raw JSON array, no markdown, no explanation.";
        const userPrompt = `Given farm inputs —
        District: ${district}, Soil: ${soilType}, 
        Rainfall: ${rainfall}mm, Temperature: ${temperature}C,
        Water: ${waterAvailability}, Area: ${landArea} acres,
        Farmer priorities — Water Saving: ${waterWeight}%, 
        ROI: ${roiWeight}%, Low Risk: ${riskWeight}%
        Return a JSON array sorted by score descending:
        [
          {
            "name": "Rice",
            "hindi": "चावल",
            "score": 85,
            "explanation": "High suitability score due to optimal soil clay structure and ample water indices."
          }
        ]
        Include exactly these 9 crops: Rice, Wheat, Cotton, Maize, Mustard, Sugarcane, Bajra, Moong, Sunflower. Assign scores out of 100 based on standard agronomical formulas. explanation must be exactly one sentence.`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            system_instruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { maxOutputTokens: 2048, temperature: 0.3 }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const clean = text.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(clean);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const formatted = parsed.map((item, idx) => ({
                rank: idx + 1,
                name: item.name,
                hindi: item.hindi || item.name,
                score: Number(item.score) || 60,
                explanation: item.explanation || "Highly suitable agricultural profile."
              }));
              return res.json({ success: true, source: 'gemini', data: formatted });
            }
          }
        }
      } catch (geminiErr) {
        console.warn("[Profile Controller] Backend Gemini ranking failed. Cascading to local scoring engine:", geminiErr.message);
      }
    }

    // High-fidelity local dynamic scoring algorithm (Rule-based agronomical matching)
    const scoredCrops = CROPS_METRICS.map(crop => {
      // 1. Soil Suitability Score (0 to 25)
      let soilScore = 12; // default moderate suitability
      const matchedPref = crop.preferredSoils.find(s => s.toLowerCase() === soilType.toLowerCase());
      if (matchedPref) {
        soilScore = 25; // Perfect match
      } else if (soilType.toLowerCase().includes('clay') && crop.preferredSoils.includes('Clay')) {
        soilScore = 22;
      } else if (soilType.toLowerCase().includes('loam') && crop.preferredSoils.includes('Loamy')) {
        soilScore = 22;
      } else if (soilType.toLowerCase().includes('sandy') && crop.preferredSoils.includes('Sandy')) {
        soilScore = 22;
      }

      // 2. Rainfall Suitability Score (0 to 20)
      let rainScore = 20;
      if (rainfall < crop.rainRange[0]) {
        // Too dry
        const deficit = crop.rainRange[0] - rainfall;
        rainScore = Math.max(5, 20 - (deficit / 30));
      } else if (rainfall > crop.rainRange[1]) {
        // Too wet
        const excess = rainfall - crop.rainRange[1];
        rainScore = Math.max(8, 20 - (excess / 50));
      }

      // 3. Temperature Suitability Score (0 to 15)
      let tempScore = 15;
      if (temperature < crop.tempRange[0]) {
        const coldDeficit = crop.tempRange[0] - temperature;
        tempScore = Math.max(3, 15 - coldDeficit * 1.5);
      } else if (temperature > crop.tempRange[1]) {
        const heatExcess = temperature - crop.tempRange[1];
        tempScore = Math.max(3, 15 - heatExcess * 1.2);
      }

      // 4. Priorities alignment (0 to 40)
      // Water saving priority: farmer wants low water use. So high water use crops get penalized more if waterWeight is high.
      const waterFactor = (100 - crop.baseWaterDemand) / 100; // 0 to 1 (high is better for saving)
      const waterWeightFactor = waterWeight / 100;
      const waterPriorityScore = waterFactor * 40 * waterWeightFactor;

      // ROI priority: farmer wants high ROI.
      const roiFactor = crop.baseRoi / 100; // 0 to 1
      const roiWeightFactor = roiWeight / 100;
      const roiPriorityScore = roiFactor * 40 * roiWeightFactor;

      // Low Risk priority: farmer wants low risk. High baseRisk gets penalized if riskWeight is high.
      const riskFactor = (100 - crop.baseRisk) / 100; // 0 to 1 (high is better for low risk)
      const riskWeightFactor = riskWeight / 100;
      const riskPriorityScore = riskFactor * 40 * riskWeightFactor;

      // Aggregate priority score (weighted average)
      const totalWeights = (waterWeightFactor + roiWeightFactor + riskWeightFactor) || 1;
      const priorityScore = (waterPriorityScore + roiPriorityScore + riskPriorityScore) / totalWeights;

      // Calculate total base score out of 100
      let rawScore = Math.round(soilScore + rainScore + tempScore + priorityScore);
      // Clamp between 35 and 98 for realistic scoring UI
      const finalScore = Math.min(98, Math.max(35, rawScore));

      // Generate dynamic high-fidelity explanation statement
      let explanation = "";
      if (finalScore >= 85) {
        explanation = `Excellent fit! The local ${soilType} soil matrix and climate inputs align perfectly with ${crop.name}'s growth cycles.`;
      } else if (finalScore >= 70) {
        explanation = `Highly recommended. Strong agricultural index matches standard regional soil pH and moisture parameters.`;
      } else if (finalScore >= 55) {
        explanation = `Moderate suitability. Yield weight can be fully optimized by managing water supply and specific nutrient additions.`;
      } else {
        explanation = `Low matching index. Elevated environmental parameters or resource constraints may limit seasonal harvest profitability.`;
      }

      return {
        name: crop.name,
        hindi: crop.hindi,
        score: finalScore,
        explanation
      };
    });

    // Sort descending by score
    scoredCrops.sort((a, b) => b.score - a.score);

    // Map ranks
    const rankedCrops = scoredCrops.map((item, idx) => ({
      rank: idx + 1,
      ...item
    }));

    res.json({
      success: true,
      source: 'local-agronomy-model',
      data: rankedCrops
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
