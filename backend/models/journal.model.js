import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  season: { 
    type: String, 
    enum: ['Kharif', 'Rabi', 'Zaid'], 
    required: true 
  },
  year: { 
    type: Number, 
    required: true 
  },
  crop: { 
    type: String, 
    required: true 
  },
  acreage: { 
    type: Number, 
    required: true 
  },
  totalCost: { 
    type: Number, 
    required: true 
  },
  actualYield: { 
    type: Number, 
    required: true 
  },
  actualRevenue: { 
    type: Number, 
    required: true 
  },
  soilPH: { 
    type: Number, 
    required: false 
  },
  nitrogen: { 
    type: Number, 
    required: false 
  },
  notes: { 
    type: String, 
    default: '' 
  },
  userId: { 
    type: String, 
    default: 'guest' 
  }
}, { 
  timestamps: true, 
  collection: 'agroindia_journals' 
});

journalEntrySchema.index({ userId: 1, year: -1 });

export default mongoose.model('JournalEntry', journalEntrySchema);
