import 'dotenv/config';
import mongoose from 'mongoose';
import GovScheme from '../models/GovScheme.js';
import FarmerProfile from '../models/FarmerProfile.js';

// Copy calculateEligibility from backend controller
const calculateEligibility = (scheme, stateName, totalLand, cropsList, categoriesList) => {
  let matchScore = scheme.matchScore || 85;
  let status = scheme.status || 'Not Applied';
  let statusType = scheme.statusType || 'not_applied';
  
  const state = stateName ? stateName.toLowerCase() : '';
  const isHaryana = state.includes('haryana') || state.includes('sonipat') || state.includes('faridabad');
  const schemeNameLower = scheme.name.toLowerCase();
  
  if (schemeNameLower.includes('haryana') && !isHaryana) {
    matchScore = Math.max(matchScore - 40, 10);
    status = 'Not Eligible';
    statusType = 'rejected';
  }
  
  if (schemeNameLower.includes('kisan') && totalLand > 5) {
    matchScore = Math.max(matchScore - 20, 50);
  }
  
  if (schemeNameLower.includes('sc farmer') && categoriesList) {
    const hasSC = categoriesList.some(cat => cat.toLowerCase().includes('sc'));
    if (!hasSC) {
      matchScore = Math.max(matchScore - 45, 10);
      status = 'Not Eligible';
      statusType = 'rejected';
    }
  }
  
  if (schemeNameLower.includes('micro irrigation') || schemeNameLower.includes('kusum')) {
    const hasWaterIntensive = cropsList.some(c => {
      const name = c.toLowerCase();
      return name.includes('rice') || name.includes('sugarcane') || name.includes('paddy');
    });
    if (hasWaterIntensive) {
      matchScore = Math.min(matchScore + 5, 100);
    } else {
      matchScore = Math.max(matchScore - 15, 60);
    }
  }

  return { matchScore, status, statusType };
};

async function check() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, { dbName: 'greenleaf-dev' });

    const profile = await FarmerProfile.findOne({ userId: 'guest' }) || {
      location: 'Faridabad, Haryana',
      farms: [
        { totalLand: 4.5, crops: [{ name: 'Rice (Paddy)' }, { name: 'Mustard' }] }
      ],
      category: ['SC', 'Small Farmer']
    };

    const totalLand = profile.farms ? profile.farms.reduce((sum, f) => sum + (Number(f.totalLand) || 0), 0) : 4.5;
    const crops = [];
    if (profile.farms) {
      profile.farms.forEach(f => {
        if (f.crops) {
          f.crops.forEach(c => {
            if (c.name) crops.push(c.name);
          });
        }
      });
    }
    const categories = profile.category || ['SC', 'Small Farmer'];
    const location = profile.location || 'Haryana';

    const schemes = await GovScheme.find({}).sort({ id: 1 }).lean();

    console.log(`Farmer Profile: Location=${location}, Land=${totalLand}, Crops=${crops.join(', ')}, Categories=${categories.join(', ')}`);
    console.log('\n--- Match Scores ---');
    schemes.forEach(scheme => {
      const { matchScore } = calculateEligibility(scheme, location, totalLand, crops, categories);
      console.log(`ID: ${scheme.id} | Name: ${scheme.name} | MatchScore: ${matchScore}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
