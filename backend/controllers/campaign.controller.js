import Campaign from '../models/Campaign.js';

const defaultCampaigns = [
  { name: "Kharindwa Blast Control", disease: "Rice Blast", villages: ["Kharindwa", "Mehna"], progress: 65, status: "Active", officers: 3, targetFarmers: 120, completedFarmers: 78, type: "Chemical Spray", startDate: "2026-06-01", notes: "Applying copper fungicide solutions to early crop blocks." },
  { name: "Rust Prevention Drive", disease: "Yellow Rust", villages: ["Bhucho Mandi", "Talwandi"], progress: 90, status: "Active", officers: 4, targetFarmers: 180, completedFarmers: 162, type: "Prophylactic Dusting", startDate: "2026-05-28", notes: "Sowing protection spraying based on AI drift recommendations." },
  { name: "Blight Suppression Campaign", disease: "Late Blight", villages: ["Raman"], progress: 20, status: "Pending", officers: 2, targetFarmers: 80, completedFarmers: 16, type: "Systemic Fungicide", startDate: "2026-06-05", notes: "Targeted leaf spray application to contain concentric lesions." }
];

export const getCampaigns = async (req, res) => {
  try {
    let campaigns = await Campaign.find().sort({ createdAt: -1 });
    
    // Auto-seed default campaigns if empty
    if (campaigns.length === 0) {
      await Campaign.insertMany(defaultCampaigns);
      campaigns = await Campaign.find().sort({ createdAt: -1 });
    }
    
    // Convert _id to id for frontend compatibility
    const formatted = campaigns.map(c => {
      const obj = c.toObject();
      obj.id = obj._id;
      return obj;
    });

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    const obj = campaign.toObject();
    obj.id = obj._id;
    res.status(201).json({ success: true, data: obj });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    const obj = campaign.toObject();
    obj.id = obj._id;
    res.json({ success: true, data: obj });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
