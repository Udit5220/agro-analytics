import JournalEntry from '../models/journal.model.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Helper for graceful MongoDB handling
const tryMongo = async (fn, fallback = null) => {
  try { return await fn(); }
  catch (e) { console.error('[Journal Controller] Mongoose Error:', e.message); return fallback; }
};

// Auto-seed historical logs from seed JSON if database has 0 records
const seedDefaultJournalEntries = async () => {
  try {
    const count = await JournalEntry.countDocuments({ userId: 'guest' });
    if (count === 0) {
      console.log('[Journal Controller] Database has 0 entries. Ingesting seeded crop records...');
      const seedFilePath = path.join(process.cwd(), 'seed-json', 'journal_logs.json');
      
      let seedData = [];
      if (fs.existsSync(seedFilePath)) {
        const fileContent = fs.readFileSync(seedFilePath, 'utf8');
        seedData = JSON.parse(fileContent);
      } else {
        // Safe hardcoded fallback if seed file is missing in the workspace
        seedData = [
          { season: "Kharif", year: 2024, crop: "Rice (Paddy)", acreage: 4.5, totalCost: 67500, actualYield: 72, actualRevenue: 158400, soilPH: 6.8, nitrogen: 210, notes: "Low monsoon rainfall.", userId: "guest" },
          { season: "Rabi", year: 2024, crop: "Wheat", acreage: 3.5, totalCost: 52500, actualYield: 77, actualRevenue: 175175, soilPH: 7.2, nitrogen: 280, notes: "Perfect winter harvest.", userId: "guest" }
        ];
        console.warn('[Journal Controller] Seed file not found at path, loading minimal fallback data.');
      }

      if (seedData.length > 0) {
        await JournalEntry.insertMany(seedData);
        console.log(`[Journal Controller] Successfully seeded ${seedData.length} historic entries in MongoDB.`);
      }
    }
  } catch (err) {
    console.error('[Journal Controller] Seeding failed:', err.message);
  }
};

/**
 * GET /api/journal/entries
 * Returns all Farm Journal entries filtered by userId: 'guest', sorted by year desc and createdAt desc.
 */
export const getAllEntries = async (req, res) => {
  try {
    // Run seeder check first
    await seedDefaultJournalEntries();

    const entries = await JournalEntry.find({ userId: 'guest' })
      .sort({ year: -1, createdAt: -1 });

    res.json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (err) {
    console.error('[Journal Controller] Error in getAllEntries:', err.message);
    res.status(500).json({ success: false, error: 'Failed to retrieve journal entries', message: err.message });
  }
};

/**
 * POST /api/journal/entries
 * Extracts crop parameters and safely parses numeric values to prevent DB pollution.
 */
export const saveSeasonEntry = async (req, res) => {
  try {
    const {
      season,
      year,
      crop,
      acreage,
      totalCost,
      actualYield,
      actualRevenue,
      soilPH,
      nitrogen,
      notes
    } = req.body;

    // Strict input parsing using standard base-10 and floating-point metrics
    const parsedYear = parseInt(year, 10);
    const parsedAcreage = parseFloat(acreage);
    const parsedTotalCost = parseFloat(totalCost);
    const parsedActualYield = parseFloat(actualYield);
    const parsedActualRevenue = parseFloat(actualRevenue);

    // Validate required fields
    if (!season || !crop || isNaN(parsedYear) || isNaN(parsedAcreage) || isNaN(parsedTotalCost) || isNaN(parsedActualYield) || isNaN(parsedActualRevenue)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'All parameters (season, year, crop, acreage, totalCost, actualYield, actualRevenue) are required and must be valid numeric values.'
      });
    }

    const parsedSoilPH = soilPH !== undefined && soilPH !== null && soilPH !== '' ? parseFloat(soilPH) : undefined;
    const parsedNitrogen = nitrogen !== undefined && nitrogen !== null && nitrogen !== '' ? parseFloat(nitrogen) : undefined;

    const newEntry = new JournalEntry({
      season,
      year: parsedYear,
      crop: crop.trim(),
      acreage: parsedAcreage,
      totalCost: parsedTotalCost,
      actualYield: parsedActualYield,
      actualRevenue: parsedActualRevenue,
      soilPH: parsedSoilPH,
      nitrogen: parsedNitrogen,
      notes: notes ? notes.trim() : '',
      userId: 'guest'
    });

    const saved = await newEntry.save();

    res.status(201).json({
      success: true,
      message: 'Journal entry successfully registered in database.',
      data: saved
    });
  } catch (err) {
    console.error('[Journal Controller] Error in saveSeasonEntry:', err.message);
    res.status(500).json({ success: false, error: 'Failed to record journal entry', message: err.message });
  }
};

/**
 * DELETE /api/journal/entries/:id
 * Drops historical records safely and validates existence.
 */
export const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Import mongoose helper or just check length
      if (id.length !== 24) {
        return res.status(400).json({ success: false, error: 'Invalid ID format' });
      }
    }

    const deleted = await JournalEntry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'No journal record found with the specified database ID.'
      });
    }

    res.json({
      success: true,
      message: 'Journal entry successfully deleted from database.',
      data: deleted
    });
  } catch (err) {
    console.error('[Journal Controller] Error in deleteEntry:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete journal entry', message: err.message });
  }
};
