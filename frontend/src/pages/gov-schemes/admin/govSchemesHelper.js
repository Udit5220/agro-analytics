// shared state and helper functions for government schemes admin pages

export const defaultAnalyticsData = {
  profileStrength: 82,
  companyProfile: {
    gstin: "06AAAAA1111A1Z1",
    cin: "U01110HR2023PTC112233",
    udyam: "UDYAM-HR-12-0004567",
    dpiit: "DPIIT-88493",
    pan: "AAAAA1111A",
    turnover: "₹18.5 Crore",
    employees: "142",
    netWorth: "₹8.2 Crore",
    yearsInOperation: "3 Years",
    statesServed: ["Haryana", "Punjab", "Rajasthan"],
    farmerNetwork: "12,400+ Farmers",
    fpoPartnerships: "8 Active FPOs",
    cropFocus: ["Paddy", "Wheat", "Mustard", "Cotton"],
    techStack: "AgroIndia Analytics Dashboard & Soil Sensors V2",
    businessCategory: "Agribusiness & Agritech SaaS Provider",
    preferredStates: ["Haryana", "Punjab"],
    growthStage: "Early Scaleup",
    fundingStage: "Series A"
  },
  events: [
    { type: "scheme_view", count: 42, label: "Schemes Viewed" },
    { type: "guide_open", count: 18, label: "Portal Guides Opened" },
    { type: "bookmark", count: 12, label: "Bookmarked" },
    { type: "apply_click", count: 9, label: "Apply Now Clicked" },
    { type: "self_reported_applied", count: 3, label: "Self-Reported Applied" }
  ],
  schemes: [
    {
      id: "adm-01",
      name: "RKVY-RAFTAAR Agritech Incubator Support",
      ministry: "Ministry of Agriculture & Farmers Welfare",
      category: "Agritech Programs",
      level: "Central Government",
      benefitType: "Grants",
      benefitAmount: "₹25,00,000",
      deadline: "2026-06-20",
      daysLeft: 8,
      matchScore: 92,
      viewed: 15,
      guideOpened: 6,
      bookmarked: true,
      applyClicked: 4,
      selfReportedApplied: true,
      lastInteraction: "2026-06-12",
      status: "Applied (Self Reported)",
      description: "Direct grant-in-aid support for agritech startups demonstrating proof of concept and scalable MVP models.",
      missingRequirements: [],
      potValue: 2500000,
      eligibilitySnapshot: "Registered agritech startup with functional prototype, DPIIT recognized, operational under 5 years."
    },
    {
      id: "adm-02",
      name: "DPIIT Agritech Tax Holiday under Startup India",
      ministry: "DPIIT, Ministry of Commerce and Industry",
      category: "Startup Programs",
      level: "Central Government",
      benefitType: "Tax Benefits",
      benefitAmount: "₹45,00,000",
      deadline: "2026-12-31",
      daysLeft: 204,
      matchScore: 88,
      viewed: 12,
      guideOpened: 4,
      bookmarked: false,
      applyClicked: 2,
      selfReportedApplied: false,
      lastInteraction: "2026-06-10",
      status: "Researching",
      description: "Income tax exemption under section 80-IAC for eligible DPIIT-recognized agricultural technology startups.",
      missingRequirements: [],
      potValue: 4500000,
      eligibilitySnapshot: "DPIIT Startup India certificate, incorporation post April 2016, turnover below 100cr."
    },
    {
      id: "adm-03",
      name: "Agri-Infrastructure Fund (AIF) Subvention",
      ministry: "Ministry of Agriculture & State Depts",
      category: "Agritech Programs",
      level: "Both",
      benefitType: "Subsidies",
      benefitAmount: "₹40,00,000",
      deadline: "2026-07-15",
      daysLeft: 35,
      matchScore: 85,
      viewed: 9,
      guideOpened: 3,
      bookmarked: true,
      applyClicked: 2,
      selfReportedApplied: false,
      lastInteraction: "2026-06-11",
      status: "Ready To Apply",
      description: "Medium to long-term debt financing facility for investment in viable post-harvest management infrastructure.",
      missingRequirements: [],
      potValue: 4000000,
      eligibilitySnapshot: "Agribusiness startups, FPOs, or entrepreneurs constructing post-harvest storage hubs."
    },
    {
      id: "adm-04",
      name: "SIDBI Venture Capital Fund for MSME Agritech",
      ministry: "SIDBI",
      category: "MSME Programs",
      level: "Central Government",
      benefitType: "Loans",
      benefitAmount: "₹80,00,000",
      deadline: "2026-08-30",
      daysLeft: 81,
      matchScore: 78,
      viewed: 4,
      guideOpened: 1,
      bookmarked: false,
      applyClicked: 1,
      selfReportedApplied: false,
      lastInteraction: "2026-06-05",
      status: "Interested",
      description: "Collateral-free developmental funding support targeted at rural MSMEs operating technological processing hubs.",
      missingRequirements: ["Udyam Registration Missing"],
      potValue: 8000000,
      eligibilitySnapshot: "Udyam registered MSME operating in agriculture value chain, minimum 3yr positive balance sheet."
    },
    {
      id: "adm-05",
      name: "Haryana Agribusiness Export Capital Subsidy",
      ministry: "Haryana State Agriculture Department",
      category: "Export Incentives",
      level: "State Government",
      benefitType: "Export Incentives",
      benefitAmount: "₹50,00,000",
      deadline: "2026-06-25",
      daysLeft: 13,
      matchScore: 95,
      viewed: 2,
      guideOpened: 4,
      bookmarked: true,
      applyClicked: 0,
      selfReportedApplied: false,
      lastInteraction: "2026-06-12",
      status: "Ready To Apply",
      description: "Financial assistance for creating cold chain facilities, sorting lines, and primary processing for agro exports.",
      missingRequirements: [],
      potValue: 5000000,
      eligibilitySnapshot: "Agribusiness registered in Haryana, actively exporting crops with valid APEDA certificates."
    },
    {
      id: "fmr-01",
      name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
      ministry: "Ministry of Agriculture",
      category: "Agritech Programs",
      level: "Central Government",
      benefitType: "Subsidies",
      benefitAmount: "₹6,00,000/year Direct Benefit Transfer",
      deadline: "2026-10-10",
      daysLeft: 122,
      matchScore: 100,
      viewed: 18,
      guideOpened: 8,
      bookmarked: false,
      applyClicked: 5,
      selfReportedApplied: false,
      lastInteraction: "2026-06-12",
      status: "Researching",
      description: "Direct income support to landholding farmer families across the country.",
      missingRequirements: [],
      potValue: 600000,
      eligibilitySnapshot: "Direct income transfer for individual farmers.",
      isFarmerScheme: true,
      farmerSavedCount: 30
    },
    {
      id: "fmr-02",
      name: "PM Fasal Bima Yojana (Crop Insurance)",
      ministry: "Ministry of Agriculture",
      category: "Agritech Programs",
      level: "Central Government",
      benefitType: "Subsidies",
      benefitAmount: "Subsidized Crop Risk Cover",
      deadline: "2026-06-22",
      daysLeft: 10,
      matchScore: 94,
      viewed: 14,
      guideOpened: 5,
      bookmarked: true,
      applyClicked: 3,
      selfReportedApplied: false,
      lastInteraction: "2026-06-11",
      status: "Ready To Apply",
      description: "Uniform premium rates with state support covering crop losses due to natural calamities.",
      missingRequirements: [],
      potValue: 1200000,
      eligibilitySnapshot: "Subsidized premium crop risk insurance cover for registered FPO farmers.",
      isFarmerScheme: true,
      farmerSavedCount: 15
    }
  ],
  missedOpportunities: [
    {
      id: "missed-01",
      name: "National Beekeeping Honey Mission Support",
      potValue: "₹15,00,000",
      expiredDate: "2026-05-15",
      reason: "Deadline Missed",
      isFarmerScheme: true,
      farmerCount: 42
    },
    {
      id: "missed-02",
      name: "PM Formalisation of Micro Food Processing Enterprises",
      potValue: "₹10,00,000",
      expiredDate: "2026-04-10",
      reason: "Required Certification Missing",
      isFarmerScheme: true,
      farmerCount: 18
    },
    {
      id: "missed-03",
      name: "NABARD Agri-Clinic Venture Subsidy",
      potValue: "₹20,00,000",
      expiredDate: "2026-05-01",
      reason: "Missing Udyam Registration",
      isFarmerScheme: false
    },
    {
      id: "missed-04",
      name: "SIDBI Agritech Digital Grant V1",
      potValue: "₹15,00,000",
      expiredDate: "2026-04-15",
      reason: "Profile Incomplete",
      isFarmerScheme: false
    }
  ],
  outreach: {
    farmersReached: 12400,
    campaignsSent: 12,
    notificationOpens: 4235,
    engagementRate: 84.5
  },
  campaigns: [
    { id: "c-01", name: "PM-Kisan Seed Funding Awareness", channel: "WhatsApp", sentCount: 4500, opens: 3950, clicks: 1240, status: "Delivered", date: "2026-06-08" },
    { id: "c-02", name: "Crop Insurance Renewal Campaign", channel: "SMS", sentCount: 6200, opens: 5100, clicks: 840, status: "Completed", date: "2026-06-01" },
    { id: "c-03", name: "Drip Irrigation Subsidy Info Dispatch", channel: "Email", sentCount: 1200, opens: 900, clicks: 310, status: "Completed", date: "2026-05-25" }
  ],
  farmers: [
    { id: "f-01", name: "Rajesh Kumar", state: "Haryana", crop: "Paddy", size: "Medium", type: "Smallholder", fpo: "Sonipat Organic FPO", schemes: ["PM-Kisan", "PMFBY"], outreachStatus: "Sent", lastComm: "2026-06-10" },
    { id: "f-02", name: "Satnam Singh", state: "Punjab", crop: "Wheat", size: "Large", type: "Commercial", fpo: "Amritsar Farmers Union", schemes: ["PMFBY"], outreachStatus: "Interacted", lastComm: "2026-06-11" },
    { id: "f-03", name: "Suresh Sharma", state: "Haryana", crop: "Mustard", size: "Small", type: "Smallholder", fpo: "Rohtak Agri Cooperative", schemes: ["PM-Kisan"], outreachStatus: "Not Contacted", lastComm: "-" }
  ],
  updates: [
    { id: "upd-01", title: "New Guidelines for PMFBY H1 2026", type: "Policy Updates", date: "2026-06-11", summary: "Ministry released operational guidelines detailing new subsidy slabs for organic mustard crops in Haryana." },
    { id: "upd-02", title: "Circular 24-B: Export Credit Guarantee Slabs", type: "New Circulars", date: "2026-06-05", summary: "State bank circular revising interest coverage details for agribusiness startup export credit schemes." }
  ],
  alerts: [
    { id: "a-01", title: "High Match Opportunity Detected: AIF Subvention", type: "Opportunity Alert", category: "opportunity", date: "2026-06-12", priority: "Critical", read: false },
    { id: "a-02", title: "New Matching Scheme Available: Solar Pump Incentives", type: "Opportunity Alert", category: "opportunity", date: "2026-06-11", priority: "Info", read: false },
    { id: "a-03", title: "Deadline Approaching: RKVY-RAFTAAR Seed Funding", type: "Opportunity Alert", category: "opportunity", date: "2026-06-12", priority: "Critical", read: false },
    { id: "a-04", title: "Eligibility Criteria Updated: Tax Holiday Guidelines", type: "Opportunity Alert", category: "opportunity", date: "2026-06-09", priority: "Warning", read: true },
    { id: "a-05", title: "Missing Registration: Udyam Registration Blocked", type: "Readiness Alert", category: "readiness", date: "2026-06-10", priority: "Critical", read: false },
    { id: "a-06", title: "Profile Completion Dropped: Statements Expiring", type: "Readiness Alert", category: "readiness", date: "2026-06-10", priority: "Warning", read: false },
    { id: "a-07", title: "Financial Records Outdated: CA Audited Files Needed", type: "Readiness Alert", category: "readiness", date: "2026-06-08", priority: "Warning", read: true },
    { id: "a-08", title: "PMFBY Interest Increased 35% (Sonipat District)", type: "Farmer Interest Alert", category: "farmer_interest", date: "2026-06-12", priority: "Info", read: false },
    { id: "a-09", title: "KCC Searches Increased 22% (Amritsar District)", type: "Farmer Interest Alert", category: "farmer_interest", date: "2026-06-11", priority: "Info", read: false },
    { id: "a-10", title: "New Farmer Demand Trend Detected: Mustard Subsidy", type: "Farmer Interest Alert", category: "farmer_interest", date: "2026-06-09", priority: "Info", read: true }
  ]
};

export const getAnalyticsData = () => {
  const data = localStorage.getItem("agroindia_analytics");
  if (!data) {
    localStorage.setItem("agroindia_analytics", JSON.stringify(defaultAnalyticsData));
    return defaultAnalyticsData;
  }
  try {
    const parsed = JSON.parse(data);
    // Overwrite old/stale localStorage caches to add the farmer schemes
    if (!parsed.schemes || parsed.schemes.length < defaultAnalyticsData.schemes.length) {
      localStorage.setItem("agroindia_analytics", JSON.stringify(defaultAnalyticsData));
      return defaultAnalyticsData;
    }
    return parsed;
  } catch (e) {
    return defaultAnalyticsData;
  }
};

export const saveAnalyticsData = (data) => {
  localStorage.setItem("agroindia_analytics", JSON.stringify(data));
};
